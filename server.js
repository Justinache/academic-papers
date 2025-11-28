const express = require('express');
const cors = require('cors');
const axios = require('axios');
const Parser = require('rss-parser');
const path = require('path');
const journalConfig = require('./journal-config');

const app = express();
const PORT = 3000;
const parser = new Parser();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Get RSS feeds from config
const RSS_FEEDS = {};
journalConfig.journals.forEach(journal => {
    if (journal.rss) {
        RSS_FEEDS[journal.name] = journal.rss;
    }
});

// Cache for storing fetched papers (in production, use Redis or database)
let papersCache = {
    data: [],
    lastUpdated: null
};

const CACHE_DURATION = journalConfig.config.cacheDuration;

// Helper function to determine field from journal name
function getFieldFromJournal(journalName) {
    const journal = journalConfig.journals.find(j => j.name === journalName);
    if (journal) return journal.field;

    // Fallback to pattern matching
    if (journalName.toLowerCase().includes('economic')) return 'Economics';
    if (journalName.toLowerCase().includes('finance')) return 'Finance';
    if (journalName.toLowerCase().includes('accounting')) return 'Accounting';
    if (journalName.toLowerCase().includes('nature') || journalName.toLowerCase().includes('science')) return 'Science';
    return 'Other';
}

// Fetch papers from CrossRef API
async function fetchFromCrossRef(journalName, limit = 10) {
    try {
        // CrossRef query by journal title
        const response = await axios.get(journalConfig.apis.crossref.baseUrl, {
            params: {
                query: journalName,
                filter: `from-pub-date:${journalConfig.config.fromDate}`,
                rows: limit,
                sort: 'published',
                order: 'desc'
            }
        });

        const items = response.data.message.items;
        return items.map(item => ({
            title: item.title?.[0] || 'Untitled',
            authors: item.author?.map(a => `${a.given || ''} ${a.family || ''}`).join(', ') || 'Unknown',
            journal: item['container-title']?.[0] || journalName,
            field: getFieldFromJournal(journalName),
            date: item.published?.['date-parts']?.[0]?.join('-') || new Date().toISOString().split('T')[0],
            abstract: item.abstract || 'No abstract available',
            doi: item.DOI || null,
            url: item.URL || null
        }));
    } catch (error) {
        console.error(`Error fetching from CrossRef for ${journalName}:`, error.message);
        return [];
    }
}

// Fetch papers from RSS feed
async function fetchFromRSS(feedUrl, journalName) {
    try {
        const feed = await parser.parseURL(feedUrl);

        return feed.items
            .filter(item => {
                // Filter for papers from the last month
                const pubDate = new Date(item.pubDate || item.isoDate);
                const oneMonthAgo = new Date();
                oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
                return pubDate >= oneMonthAgo;
            })
            .map(item => ({
                title: item.title || 'Untitled',
                authors: item.creator || item.author || 'Unknown',
                journal: journalName,
                field: getFieldFromJournal(journalName),
                date: item.pubDate || item.isoDate || new Date().toISOString(),
                abstract: item.contentSnippet || item.content || 'No abstract available',
                url: item.link || null
            }));
    } catch (error) {
        console.error(`Error fetching RSS for ${journalName}:`, error.message);
        return [];
    }
}

// Fetch papers from Semantic Scholar API (alternative)
async function fetchFromSemanticScholar(query, limit = 10) {
    try {
        const response = await axios.get('https://api.semanticscholar.org/graph/v1/paper/search', {
            params: {
                query: query,
                limit: limit,
                fields: 'title,authors,year,abstract,venue,publicationDate,url'
            }
        });

        return response.data.data.map(item => ({
            title: item.title || 'Untitled',
            authors: item.authors?.map(a => a.name).join(', ') || 'Unknown',
            journal: item.venue || 'Unknown Journal',
            field: getFieldFromJournal(item.venue || ''),
            date: item.publicationDate || `${item.year}-01-01`,
            abstract: item.abstract || 'No abstract available',
            url: item.url || null
        }));
    } catch (error) {
        console.error(`Error fetching from Semantic Scholar:`, error.message);
        return [];
    }
}

// Main function to fetch all papers
async function fetchAllPapers() {
    const allPapers = [];

    console.log('Fetching papers from various sources...');

    // Fetch from RSS feeds
    for (const [journalName, feedUrl] of Object.entries(RSS_FEEDS)) {
        console.log(`Fetching RSS for ${journalName}...`);
        const papers = await fetchFromRSS(feedUrl, journalName);
        allPapers.push(...papers);
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, journalConfig.apis.crossref.rateLimit));
    }

    // Fetch from CrossRef for journals without RSS or as backup
    for (const journal of journalConfig.journals) {
        if (journal.useAPI && !RSS_FEEDS[journal.name]) {
            console.log(`Fetching from CrossRef for ${journal.name}...`);
            const papers = await fetchFromCrossRef(journal.name, journalConfig.config.maxPapersPerJournal);
            allPapers.push(...papers);
            await new Promise(resolve => setTimeout(resolve, journalConfig.apis.crossref.rateLimit));
        }
    }

    console.log(`Fetched ${allPapers.length} papers total`);
    return allPapers;
}

// API Routes

// Get all papers
app.get('/api/papers', async (req, res) => {
    try {
        // Check if cache is valid
        const now = Date.now();
        if (papersCache.data.length > 0 &&
            papersCache.lastUpdated &&
            (now - papersCache.lastUpdated) < CACHE_DURATION) {
            console.log('Returning cached papers');
            return res.json(papersCache.data);
        }

        // Fetch fresh data
        const papers = await fetchAllPapers();

        // Update cache
        papersCache = {
            data: papers,
            lastUpdated: now
        };

        res.json(papers);
    } catch (error) {
        console.error('Error fetching papers:', error);
        res.status(500).json({ error: 'Failed to fetch papers' });
    }
});

// Force refresh cache
app.post('/api/papers/refresh', async (req, res) => {
    try {
        const papers = await fetchAllPapers();
        papersCache = {
            data: papers,
            lastUpdated: Date.now()
        };
        res.json({ message: 'Papers refreshed successfully', count: papers.length });
    } catch (error) {
        console.error('Error refreshing papers:', error);
        res.status(500).json({ error: 'Failed to refresh papers' });
    }
});

// Get papers from specific journal
app.get('/api/papers/journal/:name', async (req, res) => {
    try {
        const journalName = req.params.name;
        const papers = await fetchFromCrossRef(journalName, 20);
        res.json(papers);
    } catch (error) {
        console.error('Error fetching journal papers:', error);
        res.status(500).json({ error: 'Failed to fetch journal papers' });
    }
});

// Serve the frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Fetching initial paper data...');

    // Fetch papers on startup
    fetchAllPapers().then(papers => {
        papersCache = {
            data: papers,
            lastUpdated: Date.now()
        };
        console.log('Initial data loaded successfully');
    }).catch(err => {
        console.error('Error loading initial data:', err);
    });
});
