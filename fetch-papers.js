// Fetch papers from APIs and save to JSON file
// This script runs on GitHub Actions to update papers daily

const axios = require('axios');
const Parser = require('rss-parser');
const fs = require('fs').promises;
const parser = new Parser();

// Journal configuration
const journals = [
    {
        name: "American Economic Review",
        field: "Economics",
        rss: "https://www.aeaweb.org/journals/aer/feed",
        useAPI: true
    },
    {
        name: "Quarterly Journal of Economics",
        field: "Economics",
        rss: null,
        useAPI: true
    },
    {
        name: "Journal of Political Economy",
        field: "Economics",
        rss: null,
        useAPI: true
    },
    {
        name: "Journal of Finance",
        field: "Finance",
        rss: null,
        useAPI: true
    },
    {
        name: "Journal of Financial Economics",
        field: "Finance",
        rss: null,
        useAPI: true
    },
    {
        name: "Review of Financial Studies",
        field: "Finance",
        rss: null,
        useAPI: true
    },
    {
        name: "Journal of Accounting and Economics",
        field: "Accounting",
        rss: null,
        useAPI: true
    },
    {
        name: "Journal of Accounting Research",
        field: "Accounting",
        rss: null,
        useAPI: true
    },
    {
        name: "The Accounting Review",
        field: "Accounting",
        rss: null,
        useAPI: true
    },
    {
        name: "Nature",
        field: "Science",
        rss: "https://www.nature.com/nature.rss",
        useAPI: true
    }
];

// Get field from journal name
function getFieldFromJournal(journalName) {
    const journal = journals.find(j => j.name === journalName);
    if (journal) return journal.field;

    if (journalName.toLowerCase().includes('economic')) return 'Economics';
    if (journalName.toLowerCase().includes('finance')) return 'Finance';
    if (journalName.toLowerCase().includes('accounting')) return 'Accounting';
    if (journalName.toLowerCase().includes('nature') || journalName.toLowerCase().includes('science')) return 'Science';
    return 'Other';
}

// Fetch from CrossRef API
async function fetchFromCrossRef(journalName, limit = 20) {
    try {
        // Fetch papers from past 6 months
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const fromDate = sixMonthsAgo.toISOString().split('T')[0];

        const response = await axios.get('https://api.crossref.org/works', {
            params: {
                query: journalName,
                filter: `from-pub-date:${fromDate}`,
                rows: limit,
                sort: 'published',
                order: 'desc'
            },
            headers: {
                'User-Agent': 'AcademicPapersBot/1.0 (mailto:your-email@example.com)'
            }
        });

        const items = response.data.message.items || [];
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

// Fetch from RSS feed
async function fetchFromRSS(feedUrl, journalName) {
    try {
        const feed = await parser.parseURL(feedUrl);

        // Filter for papers from past 6 months
        return feed.items
            .filter(item => {
                const pubDate = new Date(item.pubDate || item.isoDate);
                const sixMonthsAgo = new Date();
                sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
                return pubDate >= sixMonthsAgo;
            })
            .slice(0, 20)
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

// Load existing papers from file
async function loadExistingPapers() {
    try {
        const data = await fs.readFile('papers-data.json', 'utf8');
        const json = JSON.parse(data);
        return json.papers || [];
    } catch (error) {
        console.log('No existing papers file found, starting fresh.');
        return [];
    }
}

// Filter out papers older than 3 months
function filterRecentPapers(papers) {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    return papers.filter(paper => {
        const paperDate = new Date(paper.date);
        return paperDate >= threeMonthsAgo;
    });
}

// Merge and deduplicate papers
function mergePapers(existingPapers, newPapers) {
    const paperMap = new Map();

    // Add existing papers first
    existingPapers.forEach(paper => {
        const key = paper.doi || paper.title.toLowerCase().trim();
        paperMap.set(key, paper);
    });

    // Add or update with new papers
    newPapers.forEach(paper => {
        const key = paper.doi || paper.title.toLowerCase().trim();
        paperMap.set(key, paper);
    });

    // Convert back to array and sort by date (newest first)
    return Array.from(paperMap.values()).sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });
}

// Main function
async function fetchAllPapers() {
    const allPapers = [];

    console.log('Starting to fetch papers...');

    // Fetch from each journal
    for (const journal of journals) {
        console.log(`Fetching ${journal.name}...`);

        // Try RSS first if available
        if (journal.rss) {
            const papers = await fetchFromRSS(journal.rss, journal.name);
            if (papers.length > 0) {
                allPapers.push(...papers);
                console.log(`  ✓ Found ${papers.length} papers from RSS`);
                await new Promise(resolve => setTimeout(resolve, 1000));
                continue;
            }
        }

        // Fallback to CrossRef API
        if (journal.useAPI) {
            const papers = await fetchFromCrossRef(journal.name, 20);
            if (papers.length > 0) {
                allPapers.push(...papers);
                console.log(`  ✓ Found ${papers.length} papers from CrossRef`);
            } else {
                console.log(`  ✗ No papers found`);
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    console.log(`\nTotal papers fetched: ${allPapers.length}`);
    return allPapers;
}

// Run and save to file
(async () => {
    try {
        console.log('Loading existing papers...');
        const existingPapers = await loadExistingPapers();
        console.log(`Found ${existingPapers.length} existing papers`);

        console.log('Filtering papers (keeping only last 3 months)...');
        const recentPapers = filterRecentPapers(existingPapers);
        console.log(`Kept ${recentPapers.length} papers from last 3 months`);

        console.log('\nFetching new papers from journals...');
        const newPapers = await fetchAllPapers();

        console.log('\nMerging and deduplicating papers...');
        const allPapers = mergePapers(recentPapers, newPapers);
        console.log(`Final count: ${allPapers.length} unique papers`);

        const output = {
            lastUpdated: new Date().toISOString(),
            count: allPapers.length,
            papers: allPapers
        };

        await fs.writeFile('papers-data.json', JSON.stringify(output, null, 2));
        console.log('\n✓ Successfully saved papers to papers-data.json');

        if (allPapers.length === 0) {
            console.warn('⚠ Warning: No papers in final output.');
            process.exit(1);
        }

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
})();
