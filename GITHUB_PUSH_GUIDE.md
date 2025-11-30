# 🚀 Push to GitHub Guide

## ✅ What's Done

1. ✅ Git repository initialized
2. ✅ LevelMap built and dist folder included
3. ✅ All files committed
4. ✅ Branch renamed to `main`
5. ✅ `.gitignore` created

## 📋 Next Steps: Connect to GitHub

### Step 1: Create GitHub Repository

1. **Go to GitHub:**
   - https://github.com/new

2. **Repository Settings:**
   - **Repository name:** `alvverse` (or your preferred name)
   - **Visibility:** Public or Private (your choice)
   - **DO NOT** initialize with README, .gitignore, or license
   - Click **Create repository**

3. **Copy the repository URL:**
   - It will look like: `https://github.com/yourusername/alvverse.git`
   - Or: `git@github.com:yourusername/alvverse.git`

### Step 2: Add Remote and Push

**Option A: HTTPS (Easier)**

```bash
cd /Users/sujalthapa/Desktop/alvverse

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/alvverse.git

# Push to GitHub
git push -u origin main
```

**Option B: SSH (If you have SSH keys set up)**

```bash
cd /Users/sujalthapa/Desktop/alvverse

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin git@github.com:YOUR_USERNAME/alvverse.git

# Push to GitHub
git push -u origin main
```

### Step 3: Authenticate

**If using HTTPS:**
- GitHub will prompt for username and password
- For password, use a **Personal Access Token** (not your GitHub password)
- Create token: https://github.com/settings/tokens
- Select scope: `repo`

**If using SSH:**
- Make sure your SSH key is added to GitHub
- No authentication needed

## 🔗 Connect to Vercel

After pushing to GitHub:

1. **Go to Vercel Dashboard:**
   - https://vercel.com/dashboard

2. **Import Project:**
   - Click **Add New** → **Project**
   - Select **Import Git Repository**
   - Choose your GitHub repository

3. **Configure:**
   - **Framework Preset:** Other
   - **Root Directory:** `./`
   - **Build Command:** (leave empty or use: `cd LevelMap && npm install && npm run build`)
   - **Output Directory:** `./`
   - Click **Deploy**

4. **Vercel will:**
   - Clone your repository
   - Deploy your site
   - Auto-deploy on every push to `main` branch

## 📝 Quick Commands

```bash
# Check remote
git remote -v

# Push changes
git push

# Check status
git status

# View commits
git log --oneline
```

## ⚠️ Note About node_modules

The `node_modules` folder was committed in the initial commit. For future commits:

1. **Remove from git (but keep locally):**
   ```bash
   git rm -r --cached LevelMap/node_modules
   git commit -m "Remove node_modules from git"
   git push
   ```

2. **Future builds:**
   - Vercel will run `npm install` automatically
   - Or configure Vercel build command: `cd LevelMap && npm install && npm run build`

## ✅ Success!

After pushing:
- ✅ Code is on GitHub
- ✅ Vercel can auto-deploy
- ✅ LevelMap/dist is included
- ✅ OAuth will work
- ✅ Everything is ready! 🎉

---

*Replace `YOUR_USERNAME` with your actual GitHub username in the commands above!*

