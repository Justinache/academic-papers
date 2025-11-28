// Fetch papers from APIs and save to JSON file
// This script runs on GitHub Actions to update papers daily

const axios = require('axios');
const Parser = require('rss-parser');
const fs = require('fs').promises;
const cheerio = require('cheerio');
const parser = new Parser();

// Journal configuration with ISSN for exact matching
const journals = [
    {
        name: "American Economic Review",
        issn: "0002-8282",
        field: "Economics",
        rss: "https://www.aeaweb.org/journals/aer/feed",
        useAPI: true
    },
    {
        name: "Quarterly Journal of Economics",
        issn: "0033-5533",
        field: "Economics",
        rss: null,
        useAPI: true
    },
    {
        name: "Journal of Political Economy",
        issn: "0022-3808",
        field: "Economics",
        rss: null,
        useAPI: true
    },
    {
        name: "Journal of Finance",
        issn: "0022-1082",
        field: "Finance",
        rss: null,
        useAPI: true
    },
    {
        name: "Journal of Financial Economics",
        issn: "0304-405X",
        field: "Finance",
        rss: null,
        useAPI: true
    },
    {
        name: "Review of Financial Studies",
        issn: "0893-9454",
        field: "Finance",
        rss: null,
        useAPI: true
    },
    {
        name: "Journal of Accounting and Economics",
        issn: "0165-4101",
        field: "Accounting",
        rss: null,
        useAPI: true
    },
    {
        name: "Journal of Accounting Research",
        issn: "0021-8456",
        field: "Accounting",
        rss: null,
        useAPI: true
    },
    {
        name: "The Accounting Review",
        issn: "0001-4826",
        field: "Accounting",
        rss: null,
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

// Fetch abstract from paper URL
async function fetchAbstractFromURL(url) {
    if (!url) return null;

    try {
        console.log(`    Fetching abstract from ${url}...`);

        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
            },
            timeout: 15000,
            maxRedirects: 5
        });

        const $ = cheerio.load(response.data);
        let abstract = null;

        // Try multiple common abstract selectors (ordered by specificity)
        const selectors = [
            // Elsevier/ScienceDirect selectors (for JFE, JAE, etc.)
            'div.abstract.author p',
            'div.abstract.author div',
            'div[class*="abstract"] div.author',
            'section[id="abstracts"] div',
            'section[id="abstract"] div',
            'div#abstracts p',
            'div#abstract p',

            // Wiley selectors (for JF, RFS, JAR, TAR)
            'section.article-section__abstract p',
            'div.article-section__content p',
            'section.abstract div',

            // AEA/Oxford selectors (for AER, QJE, JPE)
            'section.abstract p',
            'div.abstractSection p',
            'div.abstract p',

            // Generic selectors
            'section[class*="abstract"] p',
            'div[class*="abstract"] p',
            'div[id*="abstract"] p',
            'section[id*="abstract"] p',
            '.abstract-content p',
            '.article-abstract p',
            'article section p',

            // Meta tags as fallback
            'meta[name="dc.description"]',
            'meta[name="DC.Description"]',
            'meta[name="description"]',
            'meta[property="og:description"]',
            'meta[name="citation_abstract"]',
            'meta[property="article:abstract"]'
        ];

        for (const selector of selectors) {
            if (selector.startsWith('meta')) {
                const content = $(selector).attr('content');
                if (content && content.length > 100) {
                    abstract = content;
                    console.log(`    ✓ Found abstract via ${selector} (${abstract.length} chars)`);
                    break;
                }
            } else {
                // Try to get all matching elements and combine their text
                const elements = $(selector);
                if (elements.length > 0) {
                    let combinedText = '';
                    elements.each((i, elem) => {
                        const text = $(elem).text().trim();
                        // Skip empty elements and navigation text
                        if (text && text.length > 20) {
                            combinedText += text + ' ';
                        }
                    });
                    combinedText = combinedText.trim();

                    // Accept abstracts that are at least 100 chars
                    if (combinedText && combinedText.length >= 100) {
                        abstract = combinedText;
                        console.log(`    ✓ Found abstract via ${selector} (${abstract.length} chars)`);
                        break;
                    }
                }
            }
        }

        // If still no abstract, try searching for "Abstract" heading and get next content
        if (!abstract) {
            $('h2, h3, h4, div.section-title, span.section-title').each((i, elem) => {
                const heading = $(elem).text().trim().toLowerCase();
                if (heading === 'abstract' || heading.includes('abstract')) {
                    // Try multiple ways to get the content after the heading
                    let content = '';

                    // Method 1: Get all following paragraphs until next heading
                    let nextElem = $(elem).next();
                    while (nextElem.length > 0 && !nextElem.is('h1, h2, h3, h4, h5, h6')) {
                        const text = nextElem.text().trim();
                        if (text && text.length > 20) {
                            content += text + ' ';
                        }
                        nextElem = nextElem.next();
                        // Stop after collecting enough content or 5 elements
                        if (content.length > 200 || content.split(' ').length > 50) {
                            break;
                        }
                    }

                    // Method 2: Try parent's next sibling if method 1 didn't work
                    if (!content || content.length < 100) {
                        content = $(elem).parent().next().text().trim();
                    }

                    if (content && content.length >= 100) {
                        abstract = content;
                        console.log(`    ✓ Found abstract via heading search (${abstract.length} chars)`);
                        return false; // break the loop
                    }
                }
            });
        }

        // Clean the abstract
        if (abstract) {
            abstract = abstract
                .replace(/<[^>]*>/g, '')
                .replace(/&nbsp;/g, ' ')
                .replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
                .replace(/\s+/g, ' ')
                .replace(/^abstract\s*/i, '') // Remove "Abstract" prefix if present
                .trim();

            // Validate the abstract isn't just navigation/junk text
            const junkPhrases = ['cookie', 'javascript', 'browser', 'download', 'purchase', 'subscribe'];
            const hasJunk = junkPhrases.some(phrase => abstract.toLowerCase().includes(phrase));

            if (!hasJunk && abstract.length > 100) {
                console.log(`    ✓ Final abstract: ${abstract.substring(0, 100)}...`);
                return abstract;
            }
        }

        console.log(`    ✗ No abstract found`);
        return null;
    } catch (error) {
        console.log(`    ✗ Could not fetch abstract: ${error.message}`);
        return null;
    }
}

// Fetch from CrossRef API
async function fetchFromCrossRef(journal, limit = 100) {
    try {
        // Fetch papers from past 6 months
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const fromDate = sixMonthsAgo.toISOString().split('T')[0];

        // Use ISSN for exact journal matching
        const response = await axios.get('https://api.crossref.org/works', {
            params: {
                filter: `issn:${journal.issn},from-pub-date:${fromDate}`,
                rows: limit,
                sort: 'published',
                order: 'desc'
            },
            headers: {
                'User-Agent': 'AcademicPapersBot/1.0 (mailto:research@example.com)'
            }
        });

        const items = response.data.message.items || [];

        // Filter out non-papers and normalize data
        const filteredItems = items.filter(item => {
            const title = item.title?.[0] || '';
            const titleLower = title.toLowerCase();

            // Filter out non-research papers
            const invalidTitles = [
                'untitled',
                'announcement',
                'issue information',
                'front matter',
                'back matter',
                'table of contents',
                'editorial board',
                'index',
                'erratum',
                'corrigendum',
                'retraction',
                'cover',
                'correction',
                'author correction',
                'finance association',
                'economic association',
                'accounting association',
                'expanding our insights',
                'acknowledgement',
                'acknowledgment',
                'recent referees',
                'referee',
                'references',
                'bibliography'
            ];

            // Check if paper has valid authors
            const hasValidAuthors = item.author &&
                                   item.author.length > 0 &&
                                   item.author.some(a => (a.given || a.family));

            return title.length > 10 &&
                   !invalidTitles.some(invalid => titleLower.includes(invalid)) &&
                   hasValidAuthors;
        });

        // Map items to paper objects (without async abstract fetching for now to avoid rate limiting)
        const papers = filteredItems.map((item) => {
            // Normalize author names (convert from ALL CAPS to proper case)
            const authors = item.author
                ?.map(a => {
                    const given = a.given || '';
                    const family = a.family || '';
                    const fullName = `${given} ${family}`.trim();

                    // If name is all caps, convert to title case
                    if (fullName === fullName.toUpperCase()) {
                        return fullName.toLowerCase()
                            .split(' ')
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ');
                    }
                    return fullName;
                })
                .join(', ') || 'Unknown';

            // Clean title by removing HTML tags
            const rawTitle = item.title?.[0] || 'Untitled';
            const cleanTitle = rawTitle
                .replace(/<[^>]*>/g, '') // Remove all HTML tags
                .replace(/&nbsp;/g, ' ')  // Replace &nbsp; with space
                .replace(/&amp;/g, '&')   // Replace &amp; with &
                .replace(/&lt;/g, '<')    // Replace &lt; with <
                .replace(/&gt;/g, '>')    // Replace &gt; with >
                .trim();

            // Get abstract from CrossRef
            let abstract = item.abstract || '';

            // Format date properly (ensure YYYY-MM-DD format)
            let formattedDate;
            const dateParts = item.published?.['date-parts']?.[0];
            if (dateParts && dateParts.length >= 2) {
                const year = dateParts[0];
                const month = String(dateParts[1]).padStart(2, '0');
                const day = dateParts[2] ? String(dateParts[2]).padStart(2, '0') : '01';
                formattedDate = `${year}-${month}-${day}`;
            } else {
                formattedDate = new Date().toISOString().split('T')[0];
            }

            return {
                title: cleanTitle,
                authors: authors,
                journal: journal.name,
                field: journal.field,
                date: formattedDate,
                abstract: abstract,
                doi: item.DOI || null,
                url: item.URL || null
            };
        });

        // Try to fetch abstracts for papers that don't have them (limit to first 30 to avoid rate limiting)
        const papersNeedingAbstracts = papers.filter(p =>
            (!p.abstract || p.abstract.length < 100) && p.url
        ).slice(0, 30);

        if (papersNeedingAbstracts.length > 0) {
            console.log(`  Attempting to fetch ${papersNeedingAbstracts.length} missing abstracts...`);

            for (const paper of papersNeedingAbstracts) {
                const fetchedAbstract = await fetchAbstractFromURL(paper.url);
                if (fetchedAbstract) {
                    paper.abstract = fetchedAbstract;
                }
                // Add delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }

        return papers;
    } catch (error) {
        console.error(`Error fetching from CrossRef for ${journal.name}:`, error.message);
        return [];
    }
}

// Fetch from RSS feed
async function fetchFromRSS(feedUrl, journalName) {
    try {
        const feed = await parser.parseURL(feedUrl);

        // Invalid title keywords
        const invalidTitles = [
            'untitled',
            'announcement',
            'issue information',
            'front matter',
            'back matter',
            'table of contents',
            'editorial board',
            'index',
            'erratum',
            'corrigendum',
            'retraction',
            'cover',
            'correction',
            'author correction',
            'finance association',
            'economic association',
            'accounting association',
            'expanding our insights',
            'acknowledgement',
            'acknowledgment',
            'recent referees',
            'referee',
            'references',
            'bibliography'
        ];

        // Filter for papers from past 6 months and filter out non-papers
        return feed.items
            .filter(item => {
                const pubDate = new Date(item.pubDate || item.isoDate);
                const sixMonthsAgo = new Date();
                sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

                const title = item.title || '';
                const titleLower = title.toLowerCase();

                // Check if has valid authors
                const authors = item.creator || item.author || '';
                const hasValidAuthors = authors.toLowerCase() !== 'unknown' && authors.trim().length > 0;

                // Check date and filter out invalid titles
                return pubDate >= sixMonthsAgo &&
                       title.length > 10 &&
                       !invalidTitles.some(invalid => titleLower.includes(invalid)) &&
                       hasValidAuthors;
            })
            .slice(0, 100)
            .map(item => {
                // Clean title
                const rawTitle = item.title || 'Untitled';
                const cleanTitle = rawTitle
                    .replace(/<[^>]*>/g, '')
                    .replace(/&nbsp;/g, ' ')
                    .replace(/&amp;/g, '&')
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .trim();

                return {
                    title: cleanTitle,
                    authors: item.creator || item.author || 'Unknown',
                    journal: journalName,
                    field: getFieldFromJournal(journalName),
                    date: item.pubDate || item.isoDate || new Date().toISOString(),
                    abstract: item.contentSnippet || item.content || 'No abstract available',
                    url: item.link || null
                };
            });
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

// Filter out papers older than 6 months
function filterRecentPapers(papers) {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    return papers.filter(paper => {
        const paperDate = new Date(paper.date);
        return paperDate >= sixMonthsAgo;
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

        // Fallback to CrossRef API with ISSN
        if (journal.useAPI && journal.issn) {
            const papers = await fetchFromCrossRef(journal, 100);
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

        console.log('Filtering papers (keeping only last 6 months)...');
        const recentPapers = filterRecentPapers(existingPapers);
        console.log(`Kept ${recentPapers.length} papers from last 6 months`);

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
