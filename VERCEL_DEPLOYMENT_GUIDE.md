# 🚀 Vercel Deployment Guide for ALvVERSE

## ✅ Perfect for Vercel - No Backend Needed!

Your ALvVERSE platform is **100% static** and connects directly to Supabase. This means:
- ✅ **No backend server required**
- ✅ **No API endpoints to build**
- ✅ **No server maintenance**
- ✅ **Free hosting on Vercel**
- ✅ **Automatic HTTPS**
- ✅ **Global CDN**

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│              Vercel (Static Hosting)                     │
│                                                           │
│  📁 Your Files:                                          │
│  ├── index.html (Home/About/FAQ)                        │
│  ├── login.html (Authentication)                         │
│  ├── css/ (Styles)                                       │
│  ├── js/ (JavaScript - Supabase client)                  │
│  ├── images/ (Assets)                                     │
│  ├── LevelMap/dist/ (React app - built)                  │
│  ├── level1.html, level2.html, etc. (Unity pages)        │
│  └── unity-builds/ (Unity WebGL games)                   │
│                                                           │
│  All files served as static assets                        │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ Direct HTTPS Connection
                     │ (Browser → Supabase)
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Supabase Cloud                              │
│                                                           │
│  • Authentication (Google OAuth)                         │
│  • Database (PostgreSQL)                                 │
│  • All data storage                                      │
│  • No backend code needed!                               │
└─────────────────────────────────────────────────────────┘
```

---

## 📋 Pre-Deployment Checklist

### ✅ What You Need:

1. **Vercel Account** (free)
   - Sign up at: https://vercel.com
   - Use GitHub/GitLab/Bitbucket

2. **Supabase Project** (already have)
   - URL: `https://okumswphgekymmgqbxwf.supabase.co`
   - Anon key: Already in your code

3. **GitHub Repository** (recommended)
   - Push your code to GitHub
   - Makes deployment easier

4. **Google OAuth Credentials** (for production)
   - Update redirect URLs for production domain

---

## 🚀 Deployment Steps

### Step 1: Prepare Your Code

1. **Update Supabase Config for Production:**

   Edit `js/supabase-config.js`:
   ```javascript
   // These are already correct, but verify:
   const SUPABASE_URL = 'https://okumswphgekymmgqbxwf.supabase.co';
   const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
   ```

2. **Create `.env.local` for Vercel (optional):**
   
   Create `.env.local` in root:
   ```env
   VITE_SUPABASE_URL=https://okumswphgekymmgqbxwf.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```
   
   ⚠️ **Note:** For static HTML files, you can keep keys in code (they're public anyway). For React, use env vars.

3. **Update Google OAuth Redirect URLs:**
   
   In Google Cloud Console, add your Vercel domain:
   ```
   https://your-app.vercel.app/**
   https://yourdomain.com/** (if using custom domain)
   ```

4. **Update Supabase Redirect URLs:**
   
   In Supabase Dashboard → Authentication → Settings:
   ```
   https://your-app.vercel.app/**
   https://yourdomain.com/** (if using custom domain)
   ```

---

### Step 2: Create vercel.json (Optional)

Create `vercel.json` in root for routing:

```json
{
  "rewrites": [
    {
      "source": "/LevelMap/(.*)",
      "destination": "/LevelMap/dist/$1"
    },
    {
      "source": "/LevelMap",
      "destination": "/LevelMap/dist/index.html"
    }
  ],
  "headers": [
    {
      "source": "/unity-builds/(.*)",
      "headers": [
        {
          "key": "Cross-Origin-Embedder-Policy",
          "value": "require-corp"
        },
        {
          "key": "Cross-Origin-Opener-Policy",
          "value": "same-origin"
        }
      ]
    }
  ]
}
```

This ensures:
- LevelMap routes work correctly
- Unity WebGL files load properly (CORS headers)

---

### Step 3: Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard (Easiest)

1. **Go to Vercel:**
   - Visit: https://vercel.com/dashboard
   - Click "Add New..." → "Project"

2. **Import Repository:**
   - Connect GitHub/GitLab/Bitbucket
   - Select your `alvverse` repository
   - Click "Import"

3. **Configure Project:**
   - **Framework Preset:** Other (or "Vite" if detected)
   - **Root Directory:** `./` (root)
   - **Build Command:** 
     ```
     cd LevelMap && npm install && npm run build
     ```
   - **Output Directory:** `./` (root)
   - **Install Command:** (leave empty, handled in build)

4. **Environment Variables (if using .env):**
   - Add `VITE_SUPABASE_URL`
   - Add `VITE_SUPABASE_ANON_KEY`
   - (Only needed if using env vars in React)

5. **Click "Deploy"**
   - Wait 2-3 minutes
   - Your site will be live!

#### Option B: Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd /Users/sujalthapa/Desktop/alvverse
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? alvverse
# - Directory? ./
# - Override settings? No

# Production deploy
vercel --prod
```

---

### Step 4: Configure Custom Domain (Optional)

1. **In Vercel Dashboard:**
   - Go to your project
   - Settings → Domains
   - Add your domain (e.g., `alvverse.com`)

2. **Update DNS:**
   - Add CNAME record pointing to Vercel
   - Wait for DNS propagation

3. **Update Redirect URLs:**
   - Google Cloud Console: Add custom domain
   - Supabase: Add custom domain to redirect URLs

---

## 🔧 Post-Deployment Configuration

### 1. Update Supabase Settings

Go to Supabase Dashboard → Authentication → Settings:

**Site URL:**
```
https://your-app.vercel.app
```

**Redirect URLs:**
```
https://your-app.vercel.app/**
https://your-app.vercel.app/login.html
https://your-app.vercel.app/LevelMap/dist/index.html
```

### 2. Update Google OAuth

In Google Cloud Console → Credentials:

**Authorized JavaScript origins:**
```
https://your-app.vercel.app
https://okumswphgekymmgqbxwf.supabase.co
```

**Authorized redirect URIs:**
```
https://okumswphgekymmgqbxwf.supabase.co/auth/v1/callback
```

### 3. Test Everything

1. **Visit your Vercel URL:**
   ```
   https://your-app.vercel.app
   ```

2. **Test flow:**
   - Home page loads ✅
   - Click MAP → Login page ✅
   - Google login works ✅
   - Level Map loads ✅
   - Unity games load ✅
   - Data saves to Supabase ✅

---

## 📁 File Structure on Vercel

```
your-app.vercel.app/
├── index.html                    ✅ Served
├── login.html                    ✅ Served
├── css/
│   ├── style.css                 ✅ Served
│   └── auth.css                  ✅ Served
├── js/
│   ├── supabase-config.js        ✅ Served
│   ├── auth.js                    ✅ Served
│   └── unity-bridge.js            ✅ Served
├── images/
│   └── bg.png                     ✅ Served
├── LevelMap/
│   └── dist/
│       ├── index.html             ✅ Served
│       └── assets/                ✅ Served
├── level1.html                    ✅ Served
├── level2.html                    ✅ Served
├── ... (all level pages)          ✅ Served
└── unity-builds/
    ├── level1/
    │   └── Build/                 ✅ Served
    └── ... (all Unity builds)      ✅ Served
```

All files are served as static assets - no server processing needed!

---

## 🔐 Security Considerations

### ✅ What's Safe:

1. **Supabase Anon Key in Code:**
   - ✅ Safe to include in frontend code
   - It's designed to be public
   - Row Level Security (RLS) protects data
   - Users can only access their own data

2. **No Backend Secrets:**
   - ✅ No API keys to hide
   - ✅ No database passwords
   - ✅ No server-side secrets
   - Everything goes through Supabase

### ⚠️ For Production:

1. **Enable Row Level Security:**
   ```sql
   -- In Supabase SQL Editor
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
   ALTER TABLE telemetry_sessions ENABLE ROW LEVEL SECURITY;
   
   -- Add policies (example)
   CREATE POLICY "Users can view own data"
   ON users FOR SELECT
   USING (auth.uid() = uid);
   ```

2. **Use Environment Variables (Optional):**
   - For React components, use `VITE_` prefix
   - For static HTML, keys in code are fine

---

## 🎮 Unity WebGL on Vercel

### Unity Builds Work Perfectly!

Vercel serves Unity WebGL builds as static files:

1. **Place Unity builds in:**
   ```
   unity-builds/
   ├── level1/
   │   └── Build/
   │       ├── level1.data
   │       ├── level1.framework.js
   │       └── level1.wasm
   ├── level2/
   │   └── Build/
   └── ...
   ```

2. **Reference in HTML:**
   ```html
   <script src="/unity-builds/level1/Build/level1.loader.js"></script>
   ```

3. **CORS Headers:**
   - Already configured in `vercel.json`
   - Unity files load correctly

---

## 📊 Data Flow on Vercel

```
User Browser
    │
    │ 1. Loads static files from Vercel CDN
    │
    ▼
Vercel (Static Files)
    ├─→ HTML/CSS/JS
    ├─→ React App (built)
    └─→ Unity WebGL builds
    │
    │ 2. JavaScript connects directly to Supabase
    │
    ▼
Supabase Cloud
    ├─→ Authentication
    ├─→ Database
    └─→ Real-time (if needed)
    │
    │ 3. Unity game sends data via JavaScript
    │
    ▼
Supabase Database
    ├─→ scores table
    ├─→ telemetry_sessions table
    └─→ users table
```

**No backend server in between!** Everything is direct browser → Supabase.

---

## 💰 Cost Breakdown

### Vercel (Free Tier):
- ✅ 100GB bandwidth/month
- ✅ Unlimited requests
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Custom domains
- ✅ **Perfect for your use case!**

### Supabase (Free Tier):
- ✅ 500MB database
- ✅ 2GB file storage
- ✅ 50,000 monthly active users
- ✅ Unlimited API requests
- ✅ **Perfect for your use case!**

**Total Cost: $0/month** 🎉

---

## 🐛 Troubleshooting

### Issue: "Module not found" errors

**Solution:**
- Make sure `LevelMap` is built before deployment
- Add build command in Vercel settings:
  ```
  cd LevelMap && npm install && npm run build
  ```

### Issue: Unity games don't load

**Solution:**
- Check `vercel.json` has CORS headers
- Verify Unity build paths are correct
- Check browser console for errors

### Issue: Supabase connection fails

**Solution:**
- Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY` in code
- Check Supabase dashboard for API status
- Verify redirect URLs are updated

### Issue: Google OAuth redirect error

**Solution:**
- Update Google Cloud Console with Vercel URL
- Update Supabase redirect URLs
- Clear browser cache

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub/GitLab
- [ ] Vercel account created
- [ ] Project imported to Vercel
- [ ] Build command configured
- [ ] Environment variables set (if using)
- [ ] Deployed successfully
- [ ] Supabase redirect URLs updated
- [ ] Google OAuth redirect URLs updated
- [ ] Tested authentication flow
- [ ] Tested Level Map loading
- [ ] Tested Unity game loading
- [ ] Verified data saving to Supabase
- [ ] Custom domain configured (optional)
- [ ] RLS enabled in Supabase (production)

---

## 🎯 Quick Deploy Command

```bash
# One-time setup
npm i -g vercel
vercel login

# Deploy
cd /Users/sujalthapa/Desktop/alvverse
vercel --prod
```

That's it! Your site is live! 🚀

---

## 📚 Summary

### ✅ What You Get with Vercel:

1. **Free Hosting** - Perfect for static sites
2. **No Backend Needed** - Direct browser → Supabase
3. **Automatic HTTPS** - Secure by default
4. **Global CDN** - Fast worldwide
5. **Easy Deployment** - Push to Git, auto-deploy
6. **Custom Domains** - Use your own domain
7. **Unity Support** - WebGL games work perfectly

### ❌ What You DON'T Need:

1. ❌ Backend server
2. ❌ API endpoints
3. ❌ Server maintenance
4. ❌ Database hosting
5. ❌ Server costs

### 🎉 Your Architecture is Perfect for Vercel!

Everything connects directly:
- Browser → Supabase (authentication)
- Browser → Supabase (database)
- Unity → JavaScript → Supabase (game data)

**No backend required!** Your current setup is already production-ready! 🚀

---

*Deploy to Vercel and you're live! All data flows directly to Supabase - no backend needed!*

