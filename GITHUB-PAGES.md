# Deploy to GitHub Pages (username.github.io)

This guide will help you create a **username.github.io** website in under 5 minutes!

## Prerequisites

- A GitHub account (free) - [Sign up here](https://github.com/join)
- Git installed on your computer

**Check if Git is installed:**
```bash
git --version
```

**If not installed, download:** https://git-scm.com/downloads

---

## Step-by-Step Instructions

### Step 1: Create a GitHub Repository

1. Go to https://github.com/new
2. **Repository name**: Choose one of these:
   - **Option A**: `username.github.io` (replace `username` with your GitHub username)
     - Example: `john.github.io`
     - Your site will be at: `https://username.github.io`

   - **Option B**: Any name like `academic-papers`
     - Your site will be at: `https://username.github.io/academic-papers`

3. **Description**: "Academic papers repository with search and filter"
4. **Public** or **Private** (your choice)
5. **DO NOT** check "Add a README file"
6. Click **"Create repository"**

---

### Step 2: Push Your Code to GitHub

Open Terminal and run these commands:

```bash
# Go to your project folder
cd /Users/xuefeicheng/academic-papers-website

# Initialize Git (if not already done)
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Academic papers website"

# Set the main branch
git branch -M main

# Connect to your GitHub repo (REPLACE with your actual username and repo name!)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin main
```

**Example with actual values:**
```bash
git remote add origin https://github.com/john/john.github.io.git
git push -u origin main
```

**Note**: You may be asked to login to GitHub during the push.

---

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **"Settings"** (top right)
3. Click **"Pages"** in the left sidebar
4. Under **"Source"**:
   - Branch: Select **"main"**
   - Folder: Select **"/ (root)"**
5. Click **"Save"**

---

### Step 4: Wait & Access Your Site! 🎉

- GitHub will build your site (takes 1-2 minutes)
- Your website will be live at:
  - **Option A**: `https://username.github.io` (if repo named `username.github.io`)
  - **Option B**: `https://username.github.io/repo-name` (if repo named differently)

**You'll see a green success message** with your URL in the Pages settings.

---

## Quick Reference Commands

```bash
# Navigate to project
cd /Users/xuefeicheng/academic-papers-website

# Initial setup (one time)
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main

# Future updates (whenever you make changes)
git add .
git commit -m "Update papers/styling/features"
git push
```

---

## Troubleshooting

### "Repository not found" error
- Make sure you replaced `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual values
- Check the repository URL on GitHub

### "Authentication failed"
```bash
# Use Personal Access Token instead of password
# 1. Go to GitHub.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
# 2. Generate new token with "repo" scope
# 3. Use token as password when prompted
```

### Site shows 404 error
- Wait 2-3 minutes after enabling Pages
- Check that you selected "main" branch in Pages settings
- Make sure `index.html` exists in your repository

### Site shows blank page
- Check browser console for errors (F12)
- Verify `script.js` and `styles.css` are in the repository
- Ensure all file names are lowercase

---

## Update Your Website Later

When you make changes to your website:

```bash
cd /Users/xuefeicheng/academic-papers-website

# Make your changes to files...

# Then push updates
git add .
git commit -m "Describe your changes"
git push
```

**Your site updates automatically** within 1-2 minutes!

---

## Example: Complete Setup

Here's a complete example for user "sarah" creating `sarah.github.io`:

```bash
cd /Users/xuefeicheng/academic-papers-website

git init
git add .
git commit -m "Initial commit: Academic papers website"
git branch -M main
git remote add origin https://github.com/sarah/sarah.github.io.git
git push -u origin main
```

Then:
1. Go to https://github.com/sarah/sarah.github.io/settings/pages
2. Select branch "main" → Save
3. Wait 2 minutes
4. Visit https://sarah.github.io 🎉

---

## Custom Domain (Optional)

Want `papers.yourname.com` instead of `username.github.io`?

1. Buy a domain from Namecheap, Google Domains, etc. (~$10/year)
2. In your repo settings → Pages → Custom domain
3. Enter your domain
4. Update your domain's DNS settings:
   ```
   Type: A
   Name: @
   Value: 185.199.108.153

   Type: A
   Name: @
   Value: 185.199.109.153

   Type: A
   Name: @
   Value: 185.199.110.153

   Type: A
   Name: @
   Value: 185.199.111.153
   ```
5. Wait 24 hours for DNS propagation

---

## Important Notes

- **GitHub Pages is static only** - it can't run the Node.js backend
- Your site uses **sample data** (28 papers included)
- To add more papers, edit the `papers` array in `script.js`
- The site works perfectly - search, filters, everything functions!

---

## Adding More Papers

Edit `script.js` and add to the `papers` array:

```javascript
{
    title: "Your Paper Title",
    authors: "Author Name, Another Author",
    journal: "Journal Name",
    field: "Economics", // or Finance, Accounting, Science
    date: "2025-11-27",
    abstract: "Paper description..."
}
```

Then push changes:
```bash
git add script.js
git commit -m "Add new papers"
git push
```

---

## Need Help?

- **GitHub Pages Docs**: https://pages.github.com
- **Git Tutorial**: https://git-scm.com/book/en/v2/Getting-Started-Installing-Git
- **Can't find your repo?** Make sure you're logged in to the correct GitHub account

---

## Summary

```bash
# 1. Create repo on GitHub.com
# 2. Run these commands:

cd /Users/xuefeicheng/academic-papers-website
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main

# 3. Enable Pages in repo settings
# 4. Visit your site at username.github.io!
```

That's it! Your website will be live on the internet! 🚀
