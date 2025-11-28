# Academic Papers Repository Website

A professional website that compiles recent academic papers from top journals with powerful search and filter capabilities.

## ✨ Features

- **Search**: Find papers by title or author name
- **Filter**: By journal, field (Economics, Finance, Accounting, Science)
- **Professional Design**: Clean white and light blue theme
- **Responsive**: Works on desktop, tablet, and mobile

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

### Option 1: Instant Open (Easiest)

**No installation needed!**

1. Open Finder
2. Go to: `/Users/xuefeicheng/academic-papers-website/`
3. Double-click **`index-standalone.html`**

Done! The website opens with sample data.

### Option 2: With Live API Data

```bash
cd /Users/xuefeicheng/academic-papers-website
npm install
npm start
```

Then open: http://localhost:3000

### Option 3: Deploy Online (Like GitHub.com)

```bash
npm install -g vercel
vercel
```

Get a live URL accessible from anywhere!

**See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions**

## 📖 Documentation

- **[DEPLOYMENT.md](DEPLOYMENT.md)** - How to deploy online (Vercel, Netlify, GitHub Pages)
- **[SETUP.md](SETUP.md)** - Local development setup
- **[API-INTEGRATION.md](README-API.md)** - How APIs and RSS feeds work

## 📁 Project Structure

```
academic-papers-website/
├── index.html                  # Main page (with API integration)
├── index-standalone.html       # Standalone version (no server needed)
├── styles.css                  # Styling
├── script.js                   # Main JavaScript (API version)
├── script-standalone.js        # Standalone JavaScript
├── server.js                   # Backend API server
├── journal-config.js           # Journal sources configuration
├── package.json                # Dependencies
├── DEPLOYMENT.md              # Deployment guide
└── SETUP.md                   # Setup instructions
```

## 🎨 Customization

### Change Journals

Edit `journal-config.js`:
```javascript
{
    name: "Your Journal",
    field: "Economics",
    rss: "https://feed-url.com",
    useAPI: true
}
```

### Change Theme Colors

Edit `styles.css` - search for `#4a90e2` (blue) and replace with your color.

### Add More Papers

Add to sample data in `script-standalone.js` or configure API sources in `journal-config.js`.

## 🌐 Deployment Options

| Method | Time | Cost | Live APIs |
|--------|------|------|-----------|
| **Double-click HTML** | 0 min | Free | ❌ |
| **Vercel** | 2 min | Free | ✅ |
| **Netlify** | 2 min | Free | ✅ |
| **GitHub Pages** | 5 min | Free | ❌ |

## 💡 Tips

**Want to use it daily?**
- Bookmark `index-standalone.html` in your browser
- Create a desktop shortcut

**Want to share with others?**
- Deploy to Vercel (see DEPLOYMENT.md)
- Get a URL like: `https://your-site.vercel.app`

**Want live journal data?**
- Use the API version with `npm start`
- Or deploy to Vercel/Netlify

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
# Open instantly
open index-standalone.html

# Run with live data
npm install && npm start

# Deploy to web
vercel
```

For more details, see [DEPLOYMENT.md](DEPLOYMENT.md)
