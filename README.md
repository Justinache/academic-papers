# Academic Papers Repository Website

A professional website that compiles **LIVE** academic papers from top journals with powerful search and filter capabilities.

## ✨ Features

- **🔴 LIVE Data Extraction**: Automatically fetches latest papers from journal APIs and RSS feeds
- **🔍 Search**: Find papers by title or author name
- **📊 Filter**: By journal, field (Economics, Finance, Accounting, Science)
- **🎨 Professional Design**: Clean white and light blue theme
- **📱 Responsive**: Works on desktop, tablet, and mobile
- **🤖 Automated Updates**: GitHub Actions fetches papers daily (or deploy to Vercel for real-time)

## 📚 Included Journals

- American Economic Review
- Quarterly Journal of Economics
- Journal of Political Economy
- Journal of Finance
- Journal of Financial Economics
- Review of Financial Studies
- Journal of Accounting and Economics
- Journal of Accounting Research
- The Accounting Review
- Nature

## 🚀 Quick Start

### Option 1: Deploy with Live Data (Recommended)

**GitHub Pages + Automated Daily Updates:**

```bash
cd /Users/xuefeicheng/academic-papers-website
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main

# Then: Enable GitHub Pages and GitHub Actions in repo settings
```

**See [LIVE-DATA-DEPLOYMENT.md](LIVE-DATA-DEPLOYMENT.md) for detailed instructions**

### Option 2: Vercel (Real-Time Updates)

```bash
npm install -g vercel
vercel
```

Your site goes live with real-time paper fetching!

### Option 3: Local Development

```bash
cd /Users/xuefeicheng/academic-papers-website
npm install
npm start
```

Then open: http://localhost:3000

## 📖 Documentation

- **[LIVE-DATA-DEPLOYMENT.md](LIVE-DATA-DEPLOYMENT.md)** - **Deploy with live paper extraction** (GitHub Actions + Vercel)
- **[GITHUB-PAGES.md](GITHUB-PAGES.md)** - GitHub Pages deployment guide
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - General deployment options
- **[SETUP.md](SETUP.md)** - Local development setup
- **[README-API.md](README-API.md)** - API integration technical details

## 🎯 Data Sources

Papers are fetched LIVE from:

### RSS Feeds
- American Economic Review: `aeaweb.org/journals/aer/feed`
- Nature: `nature.com/nature.rss`

### CrossRef API
- Free, no API key required
- Covers all academic journals
- Returns title, authors, DOI, publication date
- Past month of papers from each journal

### Update Frequency
- **GitHub Pages**: Daily at 2 AM UTC (automated via GitHub Actions)
- **Vercel**: Real-time with 24-hour cache
- **Local**: On-demand when you run `npm start`

## 📁 Project Structure

```
academic-papers-website/
├── .github/workflows/
│   └── fetch-papers.yml        # GitHub Actions workflow (auto-fetch daily)
├── index.html                  # Main HTML page
├── styles.css                  # Styling (white & light blue theme)
├── script.js                   # Frontend JavaScript (loads from papers-data.json)
├── fetch-papers.js             # Script to fetch papers from APIs
├── papers-data.json            # Generated papers data (auto-updated)
├── server.js                   # Backend API server (for Vercel)
├── journal-config.js           # Journal sources configuration
├── package.json                # Dependencies
├── LIVE-DATA-DEPLOYMENT.md     # Live data deployment guide
├── GITHUB-PAGES.md             # GitHub Pages guide
├── DEPLOYMENT.md               # General deployment guide
└── SETUP.md                    # Setup instructions
```

## 🎨 Customization

### Add/Change Journals

Edit `fetch-papers.js`:
```javascript
{
    name: "Your Journal",
    field: "Economics",
    rss: "https://feed-url.com",
    useAPI: true
}
```

### Change Update Frequency

Edit `.github/workflows/fetch-papers.yml`:
```yaml
on:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours instead of daily
```

### Change Theme Colors

Edit `styles.css` - search for `#4a90e2` (blue) and replace with your color.

## 🌐 Deployment Options

| Method | Time | Cost | Data Updates | Live APIs |
|--------|------|------|--------------|-----------|
| **GitHub Pages + Actions** | 5 min | Free | Daily (automated) | ✅ |
| **Vercel** | 2 min | Free | Real-time (24h cache) | ✅ |
| **Netlify** | 2 min | Free | Real-time (24h cache) | ✅ |
| **Local** | 1 min | Free | On-demand | ✅ |

## 💡 Tips

**Want daily updates on GitHub.io?**
- Use GitHub Pages + GitHub Actions (see LIVE-DATA-DEPLOYMENT.md)
- Papers auto-update every day at 2 AM UTC

**Want real-time updates?**
- Deploy to Vercel or Netlify
- Papers update in real-time (with 24-hour cache)

**Want to customize journals?**
- Edit `fetch-papers.js` to add/remove journals
- Push changes and let GitHub Actions handle the rest!

## 🔧 Tech Stack

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: Node.js, Express
- **APIs**: CrossRef, RSS Feeds
- **Deployment**: Vercel-ready, Netlify-ready

## 📝 License

MIT License - Feel free to use and modify!

---

## Quick Commands

```bash
# Deploy to GitHub Pages with live data
git init
git add .
git commit -m "Live paper extraction"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
# Then enable GitHub Pages and Actions in repo settings

# Or deploy to Vercel for real-time updates
npm install -g vercel
vercel

# Or run locally
npm install && npm start

# Manually fetch latest papers
node fetch-papers.js
```

For detailed instructions, see **[LIVE-DATA-DEPLOYMENT.md](LIVE-DATA-DEPLOYMENT.md)**
