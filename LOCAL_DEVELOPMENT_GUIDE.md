# 🚀 Local Development Guide - ALvVERSE

## Quick Start (Easiest Method)

### Option 1: Python HTTP Server (Recommended)

1. **Open Terminal:**
   ```bash
   cd /Users/sujalthapa/Desktop/alvverse
   ```

2. **Start Server:**
   ```bash
   python3 -m http.server 8000
   ```

3. **Open Browser:**
   ```
   http://localhost:8000
   ```

4. **Done!** ✅ Your website is running locally!

---

## 📋 Complete Setup Guide

### Prerequisites

- ✅ Python 3 (usually pre-installed on Mac)
- ✅ Node.js and npm (for LevelMap development)
- ✅ Modern web browser (Chrome, Firefox, Safari, Edge)

---

## 🎯 Method 1: Python HTTP Server (Simplest)

### Step 1: Navigate to Project

```bash
cd /Users/sujalthapa/Desktop/alvverse
```

### Step 2: Start Server

```bash
python3 -m http.server 8000
```

**Output:**
```
Serving HTTP on :: port 8000 (http://[::]:8000/) ...
```

### Step 3: Open in Browser

Open your browser and go to:
```
http://localhost:8000
```

### Step 4: Access Different Pages

- **Home:** http://localhost:8000/index.html
- **Login:** http://localhost:8000/login.html
- **Level Map:** http://localhost:8000/LevelMap/dist/index.html

### Step 5: Stop Server

Press `Ctrl + C` in terminal to stop the server.

---

## 🎯 Method 2: VS Code Live Server (Best for Development)

### Step 1: Install Live Server Extension

1. Open VS Code
2. Go to Extensions (Cmd+Shift+X)
3. Search for "Live Server"
4. Install "Live Server" by Ritwick Dey

### Step 2: Open Project

1. In VS Code: File → Open Folder
2. Select: `/Users/sujalthapa/Desktop/alvverse`

### Step 3: Start Live Server

1. Right-click on `index.html`
2. Select "Open with Live Server"
3. Browser opens automatically at: `http://127.0.0.1:5500`

### Step 4: Auto-Reload

- Live Server automatically reloads when you save files
- Perfect for development!

---

## 🎯 Method 3: Node.js http-server

### Step 1: Install http-server

```bash
npm install -g http-server
```

### Step 2: Start Server

```bash
cd /Users/sujalthapa/Desktop/alvverse
http-server -p 8080
```

### Step 3: Open Browser

```
http://localhost:8080
```

---

## 🔧 LevelMap Development (React App)

If you want to develop the LevelMap React app:

### Step 1: Navigate to LevelMap

```bash
cd /Users/sujalthapa/Desktop/alvverse/LevelMap
```

### Step 2: Install Dependencies (First Time Only)

```bash
npm install
```

### Step 3: Start Development Server

```bash
npm run dev
```

**Output:**
```
  VITE v5.4.2  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 4: Open in Browser

```
http://localhost:5173
```

### Step 5: Build for Production

When ready to build:
```bash
npm run build
```

This creates the `dist/` folder with production files.

---

## 🌐 Testing the Full Flow Locally

### 1. Start Main Website

```bash
cd /Users/sujalthapa/Desktop/alvverse
python3 -m http.server 8000
```

### 2. Open Browser

Go to: `http://localhost:8000`

### 3. Test Flow

1. **Home Page:** http://localhost:8000/index.html
   - Should see Home, About, FAQ sections
   - Click "MAP" button

2. **Login Page:** http://localhost:8000/login.html
   - Should redirect automatically
   - Try "Sign up with Google"
   - Or use email/password signup

3. **Level Map:** http://localhost:8000/LevelMap/dist/index.html
   - Should show after login
   - Should see all 14 levels

---

## ⚙️ Localhost Configuration

### Supabase Settings for Localhost

Make sure in Supabase Dashboard:

1. **Authentication → Settings → Redirect URLs:**
   ```
   http://localhost:8000/**
   http://localhost:8000/login.html
   http://127.0.0.1:5500/**
   http://127.0.0.1:5500/login.html
   http://localhost:8080/**
   http://localhost:8080/login.html
   ```

2. **Site URL:**
   - Keep as: `https://alvverse.vercel.app` (for production)
   - Redirect URLs handle localhost

### Google OAuth for Localhost

In Google Cloud Console:

1. **Authorized JavaScript origins:**
   ```
   http://localhost:8000
   http://127.0.0.1:5500
   http://localhost:8080
   https://alvverse.vercel.app
   https://xierzrkqijhymluffqyl.supabase.co
   ```

2. **Authorized redirect URIs:**
   ```
   https://xierzrkqijhymluffqyl.supabase.co/auth/v1/callback
   ```
   (Only this one - Supabase handles the redirect)

---

## 🐛 Troubleshooting

### Port Already in Use

**Error:** `Address already in use`

**Solution:**
```bash
# Use a different port
python3 -m http.server 8001

# Or find and kill the process using port 8000
lsof -ti:8000 | xargs kill -9
```

### Can't Access LevelMap

**Error:** LevelMap not loading

**Solution:**
1. Make sure LevelMap is built:
   ```bash
   cd LevelMap
   npm run build
   ```

2. Check that `LevelMap/dist/index.html` exists

### Google OAuth Not Working on Localhost

**Error:** Redirect URI mismatch

**Solution:**
1. Check Supabase Redirect URLs include your localhost port
2. Check Google Console JavaScript origins include your localhost port
3. Clear browser cache
4. Try incognito mode

### CORS Errors

**Error:** CORS policy blocking requests

**Solution:**
- Make sure you're using a web server (not opening file://)
- Use `http://localhost:8000` not `file:///Users/...`

---

## 📁 Project Structure

```
alvverse/
├── index.html              # Home page (open this)
├── login.html              # Login page
├── css/                    # Styles
├── js/                     # JavaScript files
│   ├── supabase-config.js  # Supabase config
│   ├── auth.js             # Authentication
│   └── unity-bridge.js     # Unity integration
├── images/                 # Images
├── LevelMap/               # React app
│   ├── src/                # Source code
│   ├── dist/               # Built files (served)
│   └── package.json        # Dependencies
└── ...
```

---

## 🎯 Quick Commands Reference

### Start Main Website:
```bash
cd /Users/sujalthapa/Desktop/alvverse
python3 -m http.server 8000
```

### Start LevelMap Dev Server:
```bash
cd /Users/sujalthapa/Desktop/alvverse/LevelMap
npm run dev
```

### Build LevelMap:
```bash
cd /Users/sujalthapa/Desktop/alvverse/LevelMap
npm run build
```

### Stop Server:
Press `Ctrl + C` in terminal

---

## ✅ Testing Checklist

- [ ] Server starts without errors
- [ ] Home page loads at http://localhost:8000
- [ ] Can navigate to About and FAQ sections
- [ ] MAP button redirects to login page
- [ ] Login page displays correctly
- [ ] Google OAuth button visible
- [ ] Can sign up with Google (after Supabase config)
- [ ] Can sign up with email/password
- [ ] After login, redirects to Level Map
- [ ] Level Map displays all 14 levels
- [ ] User info shows in top-left
- [ ] Logout button works

---

## 🎉 You're Ready!

Your website is now running locally! 

**Default URL:** http://localhost:8000

**For development with auto-reload:** Use VS Code Live Server

**For production testing:** Use Python HTTP Server

---

*Happy coding! 🚀*

