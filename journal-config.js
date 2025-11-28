// Journal configuration file
// Update RSS feeds and API endpoints here

module.exports = {
    journals: [
        {
            name: "American Economic Review",
            field: "Economics",
            rss: "https://www.aeaweb.org/journals/aer/feed",
            useAPI: true // Will use CrossRef if RSS fails
        },
        {
            name: "Quarterly Journal of Economics",
            field: "Economics",
            rss: null, // No public RSS feed
            useAPI: true // Use CrossRef API
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
    ],

    // API endpoints
    apis: {
        crossref: {
            baseUrl: "https://api.crossref.org/works",
            rateLimit: 1000, // milliseconds between requests
            maxResults: 10
        },
        semanticScholar: {
            baseUrl: "https://api.semanticscholar.org/graph/v1/paper/search",
            rateLimit: 1000,
            maxResults: 10
        }
    },

    // Data fetching configuration
    config: {
        cacheDuration: 24 * 60 * 60 * 1000, // 24 hours
        fromDate: "2025-11-01", // Fetch papers from this date
        updateInterval: 6 * 60 * 60 * 1000, // Check for updates every 6 hours
        maxPapersPerJournal: 10
    }
};
