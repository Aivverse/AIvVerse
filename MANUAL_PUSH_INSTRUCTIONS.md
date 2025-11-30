# 🔐 Manual Push Instructions

## The Issue

The token authentication isn't working automatically. Here's how to push manually:

---

## ✅ Method 1: Push with Token (Interactive)

Run this command and enter credentials when prompted:

```bash
cd /Users/sujalthapa/Desktop/alvverse
git push -u origin main --force
```

**When prompted:**
- **Username:** `Aivverse` (or your GitHub username)
- **Password:** Paste your token: `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`

---

## ✅ Method 2: Use Token in URL (One-time)

```bash
cd /Users/sujalthapa/Desktop/alvverse

# Set remote with token
git remote set-url origin https://Aivverse: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@github.com/Aivverse/AIvVerse.git

# Push
git push -u origin main --force
```

**⚠️ Security Note:** This stores the token in your git config. Remove it after pushing:
```bash
git remote set-url origin https://github.com/Aivverse/AIvVerse.git
```

---

## ✅ Method 3: Use GitHub CLI (Recommended)

1. **Install GitHub CLI:**
   ```bash
   brew install gh
   ```

2. **Authenticate:**
   ```bash
   gh auth login
   # Choose: GitHub.com → HTTPS → Paste your token
   ```

3. **Push:**
   ```bash
   cd /Users/sujalthapa/Desktop/alvverse
   git push -u origin main --force
   ```

---

## ✅ Method 4: Check Token Permissions

The token might not have the right permissions. Verify:

1. **Go to:** https://github.com/settings/tokens
2. **Find your token** (or create a new one)
3. **Make sure it has:**
   - ✅ `repo` scope (full control of private repositories)
   - ✅ Token is not expired

4. **If needed, create a new token:**
   - Go to: https://github.com/settings/tokens/new
   - Select `repo` scope
   - Generate and copy the new token
   - Use it in Method 1 or 2 above

---

## ✅ Method 5: Use SSH Instead

1. **Generate SSH key (if you don't have one):**
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```

2. **Add SSH key to GitHub:**
   - Copy public key: `cat ~/.ssh/id_ed25519.pub`
   - Add to: https://github.com/settings/keys

3. **Change remote to SSH:**
   ```bash
   git remote set-url origin git@github.com:Aivverse/AIvVerse.git
   ```

4. **Push:**
   ```bash
   git push -u origin main --force
   ```

---

## 🔍 Troubleshooting

### Error: "Permission denied"
- Token might be invalid or expired
- Token might not have `repo` scope
- You might not have write access to the repository

### Error: "Repository not found"
- Check repository name: `Aivverse/AIvVerse`
- Make sure you have access to the repository

### Error: "Authentication failed"
- Try creating a new token
- Make sure token has `repo` scope
- Try using SSH instead

---

## 📋 Quick Checklist

- [ ] Token has `repo` scope
- [ ] Token is not expired
- [ ] You have write access to `Aivverse/AIvVerse`
- [ ] Repository exists: https://github.com/Aivverse/AIvVerse
- [ ] Local branch is `main`
- [ ] Ready to force push (overwrites remote)

---

## ✅ After Successful Push

1. **Verify on GitHub:**
   - Visit: https://github.com/Aivverse/AIvVerse
   - Check that `LevelMap/dist` folder is there
   - Check that all files are uploaded

2. **Connect to Vercel:**
   - Go to Vercel Dashboard
   - Import project from GitHub
   - Auto-deploy will start

3. **Remove token from URL (if used Method 2):**
   ```bash
   git remote set-url origin https://github.com/Aivverse/AIvVerse.git
   ```

---

*Try Method 1 first - it's the simplest!*

