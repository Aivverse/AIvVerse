# 🔧 Fix: 403 Permission Denied Error

## ❌ The Error

```
remote: Permission to Aivverse/AIvVerse.git denied to Aivverse.
fatal: unable to access 'https://github.com/Aivverse/AIvVerse.git/': The requested URL returned error: 403
```

## 🔍 Possible Causes

1. **Token doesn't have `repo` scope**
2. **Token is expired or invalid**
3. **Repository permissions issue**
4. **Git credential cache issue**

---

## ✅ Solution 1: Clear Credential Cache and Retry

```bash
cd /Users/sujalthapa/Desktop/alvverse

# Clear any cached credentials
git credential-cache exit 2>/dev/null || true
git credential reject <<EOF
protocol=https
host=github.com
EOF

# Try pushing again (will prompt for credentials)
git push -u origin main --force
```

**When prompted:**
- **Username:** `Aivverse`
- **Password:** Paste your token: `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`

---

## ✅ Solution 2: Verify Token Permissions

1. **Go to:** https://github.com/settings/tokens
2. **Find your token** or check if it exists
3. **Verify it has:**
   - ✅ `repo` scope (Full control of private repositories)
   - ✅ Not expired
   - ✅ Active status

4. **If token is missing or wrong permissions:**
   - Create new token: https://github.com/settings/tokens/new
   - Select `repo` scope
   - Generate and copy new token
   - Use new token as password when pushing

---

## ✅ Solution 3: Use Token in URL (Temporary)

```bash
cd /Users/sujalthapa/Desktop/alvverse

# Set remote with token embedded
git remote set-url origin https://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@github.com/Aivverse/AIvVerse.git

# Push
git push -u origin main --force

# IMPORTANT: Remove token from URL after pushing
git remote set-url origin https://github.com/Aivverse/AIvVerse.git
```

---

## ✅ Solution 4: Use GitHub CLI (Best Long-term)

```bash
# Install GitHub CLI (if not installed)
brew install gh

# Authenticate
gh auth login
# Follow prompts:
# - GitHub.com
# - HTTPS
# - Paste your token: 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

# Then push
cd /Users/sujalthapa/Desktop/alvverse
git push -u origin main --force
```

---

## ✅ Solution 5: Check Repository Access

Make sure you have write access to the repository:

1. **Go to:** https://github.com/Aivverse/AIvVerse
2. **Check if you're a collaborator** or owner
3. **If not, ask the repository owner to add you** as a collaborator

---

## 🎯 Quick Fix (Try This First)

```bash
cd /Users/sujalthapa/Desktop/alvverse

# Clear credentials
git credential reject <<EOF
protocol=https
host=github.com
EOF

# Set remote with token
git remote set-url origin https://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@github.com/Aivverse/AIvVerse.git

# Push
git push -u origin main --force

# Clean up (remove token from URL)
git remote set-url origin https://github.com/Aivverse/AIvVerse.git
```

---

## 🔍 Debug Steps

If still not working:

1. **Test token manually:**
   ```bash
   curl -H "Authorization: token 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" https://api.github.com/user
   ```
   Should return your user info if token is valid.

2. **Check repository access:**
   ```bash
   curl -H "Authorization: token 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" https://api.github.com/repos/Aivverse/AIvVerse
   ```
   Should return repository info if you have access.

---

## ✅ After Successful Push

1. **Verify on GitHub:**
   - Visit: https://github.com/Aivverse/AIvVerse
   - Check that `LevelMap/dist` folder exists
   - Verify all files are there

2. **Connect to Vercel:**
   - Go to Vercel Dashboard
   - Import project from GitHub
   - Auto-deploy will start

---

*Try Solution 5 (Quick Fix) first - it's the fastest!*

