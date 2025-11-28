# Academic Papers Website - API Integration Guide

## Overview
This guide explains how to integrate real journal data using APIs and RSS feeds.

## Journal Data Sources

### 1. RSS Feeds (Easiest)
Most journals provide RSS feeds for their latest articles:

- **American Economic Review**: `https://www.aeaweb.org/journals/aer/feed`
- **Nature**: `https://www.nature.com/nature.rss`
- **Journal of Finance**: Available through publisher websites
- **Quarterly Journal of Economics**: Available through Oxford Academic

### 2. APIs

#### CrossRef API (Recommended)
- **Free, no API key required**
- Covers most academic journals
- Provides DOI, title, authors, publication date
- Endpoint: `https://api.crossref.org/works`
- Documentation: https://api.crossref.org

#### PubMed API
- Free for scientific/medical papers
- Good for Nature and scientific journals
- Requires registration
- Documentation: https://www.ncbi.nlm.nih.gov/home/develop/api/

#### Semantic Scholar API
- Free academic paper database
- No API key required
- Documentation: https://api.semanticscholar.org/

### 3. Publisher APIs
Some publishers offer APIs (usually require subscription):
- **Elsevier (ScienceDirect)**: Requires API key
- **Wiley**: Requires API key
- **Springer**: Open API available

## CORS Issue and Solutions

### The Problem
Browsers block direct requests to most APIs due to CORS policy.

### Solutions

#### Option 1: Backend Proxy Server (Recommended)
Create a Node.js server that fetches data and serves it to your frontend.

#### Option 2: CORS Proxy Services
Use services like:
- `https://corsproxy.io/`
- `https://api.allorigins.win/`

**Warning**: Not recommended for production due to reliability and privacy concerns.

#### Option 3: Browser Extensions (Development Only)
Install CORS extensions for testing, but this won't work for deployed sites.

## Implementation Steps

1. **Install Node.js** (if not already installed)
2. **Set up backend server** (see server.js)
3. **Update frontend** to fetch from backend
4. **Configure journal sources** (see journal-config.js)
5. **Run the application**

## Running the Application

```bash
# Install dependencies
npm install

# Start the backend server
npm start

# Or for development with auto-reload
npm run dev

# Open browser to http://localhost:3000
```

## Data Update Frequency

- RSS feeds: Check every 24 hours
- APIs: Cache results to avoid rate limits
- Store fetched papers in a database (optional)

## Next Steps for Production

1. **Add a database** (MongoDB, PostgreSQL) to store papers
2. **Set up scheduled jobs** (cron) to fetch new papers daily
3. **Implement caching** to reduce API calls
4. **Add error handling** and retry logic
5. **Deploy to a hosting service** (Vercel, Netlify, Heroku)
