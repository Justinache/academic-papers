# Live Paper Extraction - Deployment Guide

This guide will help you deploy your website with **LIVE** paper extraction from academic journals!

## 🎯 Two Options for Live Data

### Option 1: GitHub Pages + GitHub Actions (Recommended for .github.io)
- **Updates**: Automatically every day at 2 AM
- **Cost**: FREE
- **URL**: `username.github.io`
- **Setup Time**: 5 minutes
- **Best for**: You want a .github.io URL and daily updates are sufficient

### Option 2: Vercel (Best for Real-Time)
- **Updates**: Real-time (fetches on each request, cached 24h)
- **Cost**: FREE
- **URL**: `your-site.vercel.app` (custom domain supported)
- **Setup Time**: 2 minutes
- **Best for**: You want truly real-time data

---

## 📘 Option 1: GitHub Pages with Automated Updates

### How It Works
1. Your website is hosted on GitHub Pages (`username.github.io`)
2. Every day at 2 AM UTC, GitHub Actions automatically:
   - Fetches latest papers from CrossRef API and RSS feeds
   - Updates `papers-data.json` file
   - Commits changes to your repository
3. Your website loads fresh data automatically!

### Step-by-Step Setup

#### 1. Push Your Code to GitHub

```bash
cd /Users/xuefeicheng/academic-papers-website

# Initialize Git
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit with live paper extraction"

# Set main branch
git branch -M main

# Connect to GitHub (replace YOUR_USERNAME and YOUR_REPO!)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push to GitHub
git push -u origin main
```

**Example:**
```bash
git remote add origin https://github.com/john/john.github.io.git
git push -u origin main
```

#### 2. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Source: Select **main** branch
4. Click **Save**

#### 3. Enable GitHub Actions

1. In your repository, click **Actions** tab
2. You should see "Fetch Academic Papers" workflow
3. Click **Enable workflows** if prompted
4. Click **Run workflow** → **Run workflow** to fetch papers immediately

**Note**: GitHub Actions should work automatically. If you see any permission errors:
1. Go to **Settings** → **Actions** → **General**
2. Under "Workflow permissions", select **Read and write permissions**
3. Click **Save**

#### 4. Access Your Website!

Visit: `https://YOUR_USERNAME.github.io/YOUR_REPO/`

**Example**: `https://john.github.io/john.github.io/`

### Updating Schedule

Papers are fetched automatically:
- **Daily at 2 AM UTC**
- Or **manually** by going to Actions tab → "Fetch Academic Papers" → "Run workflow"

To change the schedule, edit `.github/workflows/fetch-papers.yml`:
```yaml
on:
  schedule:
    - cron: '0 2 * * *'  # Every day at 2 AM UTC
    # - cron: '0 */6 * * *'  # Every 6 hours
    # - cron: '0 0 * * 0'  # Every Sunday
```

---

## 🚀 Option 2: Vercel (Real-Time Data)

### How It Works
- Your full Node.js backend runs on Vercel
- Papers are fetched from APIs in real-time
- Cached for 24 hours to avoid rate limits
- Truly live data!

### Step-by-Step Setup

#### 1. Install Vercel CLI

```bash
npm install -g vercel
```

#### 2. Deploy to Vercel

```bash
cd /Users/xuefeicheng/academic-papers-website
vercel
```

Follow the prompts:
- **Login**: Use GitHub, GitLab, or email
- **Set up project?**: Yes
- **Link to existing?**: No
- **Project name**: (press Enter for default)
- **Directory**: ./ (press Enter)
- **Override settings?**: No (press Enter)

#### 3. Done!

You'll get a URL like: `https://academic-papers-abc123.vercel.app`

Your website is now live with **real-time** paper fetching!

### Update Your Site

```bash
# Make changes to your code, then:
vercel --prod
```

### How Real-Time Fetching Works on Vercel

- First visitor triggers API calls to fetch papers
- Results cached for 24 hours
- Subsequent visitors see cached data (fast!)
- Cache auto-refreshes after 24 hours

---

## 📊 Comparison

| Feature | GitHub Pages + Actions | Vercel |
|---------|----------------------|--------|
| **URL** | `username.github.io` | `*.vercel.app` |
| **Cost** | FREE | FREE |
| **Data Update** | Daily (2 AM UTC) | Real-time (24h cache) |
| **Setup** | 5 min | 2 min |
| **Live APIs** | ✅ Yes | ✅ Yes |
| **Backend** | No (Actions only) | ✅ Full Node.js |
| **Custom Domain** | ✅ Yes | ✅ Yes |
| **Auto Deploy** | ✅ Git push | ✅ Git push |

---

## 📝 Data Sources

Both options fetch papers from:

### RSS Feeds
- **American Economic Review**: `aeaweb.org/journals/aer/feed`
- **Nature**: `nature.com/nature.rss`

### CrossRef API (Free)
- All journals from the past month
- No API key required
- Rate limit: 50 requests/second (we use 1/second to be safe)

### Journals Covered
1. American Economic Review
2. Quarterly Journal of Economics
3. Journal of Political Economy
4. Journal of Finance
5. Journal of Financial Economics
6. Review of Financial Studies
7. Journal of Accounting and Economics
8. Journal of Accounting Research
9. The Accounting Review
10. Nature

---

## 🔧 Customization

### Change Update Frequency (GitHub Actions)

Edit `.github/workflows/fetch-papers.yml`:

```yaml
on:
  schedule:
    - cron: '0 */12 * * *'  # Every 12 hours
```

Cron examples:
- `0 2 * * *` = Daily at 2 AM
- `0 */6 * * *` = Every 6 hours
- `0 0 * * 0` = Every Sunday
- `0 0 1 * *` = First day of every month

### Change Cache Duration (Vercel)

Edit `server.js`:

```javascript
const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours
```

### Add More Journals

Edit `fetch-papers.js`:

```javascript
{
    name: "Your Journal Name",
    field: "Economics",
    rss: "https://journal-feed-url.com",
    useAPI: true
}
```

---

## 🧪 Test Locally

Want to test paper fetching on your computer?

```bash
cd /Users/xuefeicheng/academic-papers-website

# Fix npm permissions issue (if needed)
sudo chown -R $USER ~/.npm

# Install dependencies
npm install

# Fetch papers
node fetch-papers.js

# Check the generated file
cat papers-data.json

# Or run the full server
npm start
# Open http://localhost:3000
```

---

## ⚠️ Troubleshooting

### GitHub Actions failing

**Check workflow permissions:**
1. Settings → Actions → General
2. Workflow permissions: **Read and write**
3. Save

**Manual trigger:**
1. Actions tab → "Fetch Academic Papers"
2. Run workflow → Run workflow

### No papers showing on website

**Option 1 (GitHub Pages):**
- Check if `papers-data.json` exists in your repo
- Go to Actions tab and run workflow manually
- Wait 2-3 minutes after workflow completes

**Option 2 (Vercel):**
- Check Vercel logs: `vercel logs`
- Ensure all files uploaded correctly

### Papers data is old

**GitHub Pages**: Workflow runs at 2 AM UTC. Manually trigger in Actions tab.

**Vercel**: Cache expires after 24h. Or restart deployment: `vercel --prod`

---

## 🎉 You're All Set!

Your website now has **LIVE** paper extraction!

### Next Steps

1. **Add more journals**: Edit `fetch-papers.js`
2. **Customize styling**: Edit `styles.css`
3. **Add features**: Abstract popups, export to BibTeX, email alerts
4. **Custom domain**: Point your domain to GitHub Pages or Vercel

---

## 📚 Files Overview

- **`.github/workflows/fetch-papers.yml`**: GitHub Actions workflow (daily fetch)
- **`fetch-papers.js`**: Script that fetches papers from APIs
- **`papers-data.json`**: Generated file with latest papers
- **`script.js`**: Frontend that loads from papers-data.json
- **`server.js`**: Backend for Vercel deployment (real-time)

---

## Quick Command Reference

### GitHub Pages Deployment
```bash
git init
git add .
git commit -m "Live paper extraction"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Vercel Deployment
```bash
npm install -g vercel
cd /Users/xuefeicheng/academic-papers-website
vercel
```

### Manual Paper Fetch (Local)
```bash
npm install
node fetch-papers.js
```

---

**Choose your option and deploy now!** 🚀
