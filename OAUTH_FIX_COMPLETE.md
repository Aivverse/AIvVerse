# 🔧 Complete OAuth Fix Guide

## ❌ The Problem

Your Google OAuth redirect URIs are **incorrect**. You have:
- ❌ `http://127.0.0.1:8000/auth/google/callback` - **WRONG! This doesn't exist**

The correct flow is:
1. User clicks Google button
2. Google redirects to **Supabase** (not your site)
3. Supabase processes authentication
4. Supabase redirects back to your site

---

## ✅ Step-by-Step Fix

### Step 1: Fix Google Cloud Console

1. **Go to Google Cloud Console:**
   - https://console.cloud.google.com/apis/credentials

2. **Edit Your OAuth 2.0 Client ID**

3. **Authorized JavaScript origins** (Keep these):
   ```
   ✅ http://127.0.0.1:5500
   ✅ https://alvverse.vercel.app
   ✅ https://xierzrkqijhymluffqyl.supabase.co
   ✅ http://localhost:8000
   ```

4. **Authorized redirect URIs** (IMPORTANT - Fix this!):
   
   **REMOVE these:**
   - ❌ `http://127.0.0.1:5500`
   - ❌ `http://127.0.0.1:8000/auth/google/callback` ← **DELETE THIS!**
   
   **KEEP ONLY this:**
   ```
   ✅ https://xierzrkqijhymluffqyl.supabase.co/auth/v1/callback
   ```
   
   **That's it! Only ONE redirect URI!**

5. **Save Changes**

---

### Step 2: Configure Supabase Redirect URLs

1. **Go to Supabase Dashboard:**
   - https://supabase.com/dashboard/project/xierzrkqijhymluffqyl

2. **Authentication → Settings**

3. **Site URL:**
   ```
   https://alvverse.vercel.app
   ```

4. **Redirect URLs** (Add all of these):
   ```
   https://alvverse.vercel.app/**
   https://alvverse.vercel.app/login.html
   http://127.0.0.1:5500/**
   http://127.0.0.1:5500/login.html
   http://localhost:8000/**
   http://localhost:8000/login.html
   http://localhost:8080/**
   http://localhost:8080/login.html
   ```

5. **Save Settings**

---

### Step 3: Verify Google Provider in Supabase

1. **Authentication → Providers**

2. **Google Provider:**
   - ✅ Should be **Enabled** (toggle ON)
   - ✅ **Client ID** should match Google Cloud Console
   - ✅ **Client Secret** should match Google Cloud Console

3. **Save if you made changes**

---

## 🎯 Correct OAuth Flow

```
User clicks "Sign up with Google"
    ↓
Redirects to: Google login page
    ↓
User selects Google account
    ↓
Google redirects to: https://xierzrkqijhymluffqyl.supabase.co/auth/v1/callback
    ↓
Supabase processes authentication
    ↓
Supabase redirects to: https://alvverse.vercel.app/login.html (or localhost)
    ↓
login.html detects session
    ↓
Creates user profile
    ↓
Redirects to: LevelMap/dist/index.html
    ✅ Success!
```

---

## 📋 Quick Checklist

### Google Cloud Console:
- [ ] **Authorized JavaScript origins:** All your domains (localhost, Vercel, Supabase)
- [ ] **Authorized redirect URIs:** ONLY `https://xierzrkqijhymluffqyl.supabase.co/auth/v1/callback`
- [ ] Removed incorrect redirect URIs
- [ ] Saved changes

### Supabase Dashboard:
- [ ] **Site URL:** `https://alvverse.vercel.app`
- [ ] **Redirect URLs:** Added all your domains (Vercel + localhost variants)
- [ ] **Google Provider:** Enabled with correct Client ID and Secret
- [ ] Saved all settings

---

## 🧪 Testing

### Test on Localhost:

1. **Start your local server:**
   ```bash
   # Option 1: Python
   python3 -m http.server 8000
   
   # Option 2: VS Code Live Server (port 5500)
   # Right-click index.html → Open with Live Server
   ```

2. **Open:** `http://localhost:8000/login.html` (or your port)

3. **Click "Sign up with Google"**

4. **Should work!** ✅

### Test on Vercel:

1. **Visit:** https://alvverse.vercel.app/login.html

2. **Click "Sign up with Google"**

3. **Should work!** ✅

---

## 🐛 Troubleshooting

### Error: "redirect_uri_mismatch"

**Cause:** Google redirect URI doesn't match

**Fix:**
- In Google Cloud Console, make sure redirect URI is EXACTLY:
  ```
  https://xierzrkqijhymluffqyl.supabase.co/auth/v1/callback
  ```
- Remove ALL other redirect URIs
- Wait 1-2 minutes for changes to propagate

### Error: "ERR_CONNECTION_REFUSED" on localhost

**Cause:** Google trying to redirect to wrong URL

**Fix:**
- Remove `http://127.0.0.1:8000/auth/google/callback` from Google Console
- Keep only Supabase callback URL
- Clear browser cache and try again

### Error: "Invalid redirect URL" in Supabase

**Cause:** Supabase redirect URL not configured

**Fix:**
- Add your localhost URL to Supabase Redirect URLs:
  ```
  http://127.0.0.1:5500/**
  http://localhost:8000/**
  ```
- Make sure Site URL matches your production domain

### Google button does nothing

**Cause:** JavaScript origins not configured

**Fix:**
- Add your localhost URL to Google JavaScript origins:
  ```
  http://127.0.0.1:5500
  http://localhost:8000
  ```

---

## 📸 Visual Guide

### Google Cloud Console Should Show:

**Authorized JavaScript origins:**
```
✅ http://127.0.0.1:5500
✅ https://alvverse.vercel.app
✅ https://xierzrkqijhymluffqyl.supabase.co
✅ http://localhost:8000
```

**Authorized redirect URIs:**
```
✅ https://xierzrkqijhymluffqyl.supabase.co/auth/v1/callback
   (ONLY THIS ONE - NO OTHERS!)
```

### Supabase Should Show:

**Site URL:**
```
https://alvverse.vercel.app
```

**Redirect URLs:**
```
✅ https://alvverse.vercel.app/**
✅ https://alvverse.vercel.app/login.html
✅ http://127.0.0.1:5500/**
✅ http://127.0.0.1:5500/login.html
✅ http://localhost:8000/**
✅ http://localhost:8000/login.html
```

---

## ✅ Summary

**The Key Fix:**
- Google redirect URIs should ONLY have: `https://xierzrkqijhymluffqyl.supabase.co/auth/v1/callback`
- Remove: `http://127.0.0.1:8000/auth/google/callback` (this doesn't exist!)
- Supabase handles the OAuth callback, then redirects to your site

**After fixing:**
1. Wait 1-2 minutes for changes to propagate
2. Clear browser cache
3. Test again
4. Should work on both localhost and Vercel! ✅

---

*Fix these settings and Google OAuth will work perfectly!*

