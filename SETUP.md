# Setup Instructions - Academic Papers Website

## Quick Start Guide

Follow these steps to get your academic papers website up and running with live API integration.

## Prerequisites

Make sure you have the following installed:
- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

To check if you have these installed:
```bash
node --version
npm --version
```

## Installation Steps

### 1. Navigate to the project directory
```bash
cd /Users/xuefeicheng/academic-papers-website
```

### 2. Install dependencies
```bash
npm install
```

This will install:
- `express` - Web server framework
- `cors` - Enable cross-origin requests
- `axios` - HTTP client for API requests
- `rss-parser` - Parse RSS feeds
- `nodemon` - Auto-reload during development (dev dependency)

### 3. Start the server

**For production:**
```bash
npm start
```

**For development (auto-reload on changes):**
```bash
npm run dev
```

### 4. Open the website

Once the server is running, open your browser and go to:
```
http://localhost:3000
```

## How It Works

### Data Sources

The website fetches papers from two main sources:

1. **RSS Feeds** (for journals that provide them):
   - American Economic Review
   - Nature

2. **CrossRef API** (for all journals):
   - Quarterly Journal of Economics
   - Journal of Political Economy
   - Journal of Finance
   - Journal of Financial Economics
   - Review of Financial Studies
   - Journal of Accounting and Economics
   - Journal of Accounting Research
   - The Accounting Review
   - And others as backup

### Caching

- Papers are cached for 24 hours to reduce API calls
- First load fetches fresh data from APIs
- Subsequent loads use cached data until it expires

## Configuration

### Customize Journal Sources

Edit `journal-config.js` to:
- Add/remove journals
- Update RSS feed URLs
- Change API endpoints
- Modify cache duration
- Adjust date ranges

Example:
```javascript
{
    name: "Your Journal Name",
    field: "Economics", // or Finance, Accounting, Science
    rss: "https://example.com/feed", // or null if no RSS
    useAPI: true // Whether to use CrossRef API
}
```

### Switch to Sample Data

If you want to use sample data instead of live APIs (for testing):

1. Open `script.js`
2. Find line 246: `const USE_SAMPLE_DATA = false;`
3. Change to: `const USE_SAMPLE_DATA = true;`

## Troubleshooting

### Server won't start
- Make sure port 3000 is not in use
- Check that all dependencies are installed: `npm install`

### No papers showing
- Check server console for error messages
- Try refreshing the page
- Verify internet connection (APIs require internet)

### Papers are outdated
- The cache refreshes every 24 hours automatically
- To force refresh: restart the server

## Project Structure

```
academic-papers-website/
├── index.html           # Main HTML structure
├── styles.css           # Styling (white & light blue theme)
├── script.js            # Frontend JavaScript
├── server.js            # Backend API server
├── package.json         # Dependencies
├── journal-config.js    # Journal configuration
└── README.md           # API integration guide
```

## API Rate Limits

### CrossRef API
- Free, no authentication required
- Rate limit: ~50 requests/second
- We use 1 request/second to be safe

### Semantic Scholar API
- Free, no authentication required
- Rate limit: 100 requests/5 minutes
- Implemented in server but not currently active

## Next Steps

### For Production Deployment

1. **Add a Database**
   - Store papers in MongoDB or PostgreSQL
   - Prevents data loss on server restart
   - Enables historical data tracking

2. **Set up Scheduled Jobs**
   ```bash
   npm install node-cron
   ```
   - Auto-fetch new papers daily
   - Update cache automatically

3. **Deploy to Cloud**
   - **Vercel**: Best for Node.js apps
   - **Heroku**: Easy deployment
   - **DigitalOcean**: More control

4. **Add Environment Variables**
   Create `.env` file:
   ```
   PORT=3000
   CACHE_DURATION=86400000
   NODE_ENV=production
   ```

5. **Enable HTTPS**
   - Required for production
   - Get free SSL from Let's Encrypt

### Adding More Features

- **Email alerts** for new papers in specific fields
- **User accounts** to save favorite papers
- **Export to BibTeX** for citations
- **Advanced filtering** by author, keyword, date range
- **Paper abstracts** with expand/collapse

## Updating Journal Feeds

To add a new journal:

1. Find the journal's RSS feed or confirm it's in CrossRef
2. Add to `journal-config.js`:
   ```javascript
   {
       name: "New Journal Name",
       field: "Your Field",
       rss: "https://journal-site.com/feed",
       useAPI: true
   }
   ```
3. Restart the server

## Support

For issues or questions:
- Check the main `README.md` for API integration details
- Review server console logs for errors
- Verify journal RSS feeds are still active

## License

MIT License - Feel free to modify and use for your projects.
