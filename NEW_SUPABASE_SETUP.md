# 🔄 New Supabase Project Setup Guide

## ✅ Code Updated!

I've updated all your code files with the new Supabase credentials:
- ✅ `js/supabase-config.js`
- ✅ `LevelMap/index.html`
- ✅ `LevelMap/public/js/supabase-config.js`
- ✅ `level-template-example.html`
- ✅ LevelMap rebuilt with new credentials

---

## 🎯 What You Need To Do in New Supabase Project

### Step 1: Run Database Schema

1. **Go to Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard/project/xierzrkqijhymluffqyl

2. **Open SQL Editor:**
   - Click "SQL Editor" in left sidebar
   - Click "New query"

3. **Run the Schema:**
   - Copy the entire content from `Auth/schema.sql`
   - Paste into SQL Editor
   - Click "Run" (or Ctrl/Cmd + Enter)

4. **Verify Tables Created:**
   - Go to "Table Editor" in left sidebar
   - Should see 3 tables:
     - ✅ `users`
     - ✅ `telemetry_sessions`
     - ✅ `scores`

5. **Disable RLS (for testing):**
   - Go back to SQL Editor
   - Run this:
   ```sql
   ALTER TABLE users DISABLE ROW LEVEL SECURITY;
   ALTER TABLE telemetry_sessions DISABLE ROW LEVEL SECURITY;
   ALTER TABLE scores DISABLE ROW LEVEL SECURITY;
   ```

---

### Step 2: Configure Authentication Settings

1. **Go to Authentication → Settings:**
   - Click "Authentication" in left sidebar
   - Click "Settings" tab

2. **Set Site URL:**
   ```
   https://alvverse.vercel.app
   ```

3. **Add Redirect URLs:**
   Click "Add URL" and add each:
   ```
   https://alvverse.vercel.app/**
   https://alvverse.vercel.app/login.html
   https://alvverse.vercel.app/LevelMap/dist/index.html
   http://localhost:8080/** (for local development)
   http://localhost:8080/login.html
   ```

4. **Save Settings**

---

### Step 3: Enable Google OAuth Provider

1. **Go to Authentication → Providers:**
   - Click "Providers" tab
   - Find "Google" in the list

2. **Enable Google:**
   - Toggle Google provider **ON**

3. **Enter Google Credentials:**
   - **Client ID (for OAuth):** Your Google OAuth Client ID
   - **Client Secret (for OAuth):** Your Google OAuth Client Secret
   - (Same credentials from Google Cloud Console)

4. **Save**

---

### Step 4: Update Google Cloud Console

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/apis/credentials

2. **Edit Your OAuth Client:**
   - Click on your OAuth 2.0 Client ID

3. **Update Authorized JavaScript Origins:**
   - Add: `https://xierzrkqijhymluffqyl.supabase.co`
   - Keep existing: `https://alvverse.vercel.app`
   - Keep existing: `http://localhost:8080`

4. **Update Authorized Redirect URIs:**
   - Should be ONLY: `https://xierzrkqijhymluffqyl.supabase.co/auth/v1/callback`
   - (This is the NEW Supabase callback URL!)

5. **Save**

---

## 📋 Complete Checklist

### Supabase Setup:
- [ ] Database schema run (users, telemetry_sessions, scores tables)
- [ ] RLS disabled for testing
- [ ] Site URL set to `https://alvverse.vercel.app`
- [ ] Redirect URLs added (Vercel + localhost)
- [ ] Google provider enabled
- [ ] Google Client ID and Secret entered

### Google Cloud Console:
- [ ] Added `https://xierzrkqijhymluffqyl.supabase.co` to JavaScript origins
- [ ] Redirect URI is `https://xierzrkqijhymluffqyl.supabase.co/auth/v1/callback`
- [ ] Saved changes

### Code (Already Done ✅):
- [ ] `js/supabase-config.js` updated
- [ ] `LevelMap/index.html` updated
- [ ] `level-template-example.html` updated
- [ ] LevelMap rebuilt

---

## 🔑 Your New Supabase Credentials

**Project URL:**
```
https://xierzrkqijhymluffqyl.supabase.co
```

**Anon Key (Public - Safe in frontend):**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpZXJ6cmtxaWpoeW1sdWZmcXlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0NDIzNDEsImV4cCI6MjA4MDAxODM0MX0.n1iMrNmtIqrUiFvolu2Tm_d0wLfvEydsfwk5xiGwHEI
```

**Service Role Key (Secret - Keep Private):**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpZXJ6cmtxaWpoeW1sdWZmcXlsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDQ0MjM0MSwiZXhwIjoyMDgwMDE4MzQxfQ.BzbV5XzLgm3x0PFpqsrqs_hFYMUyTxCbqFcYbd6Yxl0
```

⚠️ **Note:** Service role key is only needed for backend operations. Your frontend uses the anon key (which is already in your code).

---

## 🧪 Testing

### 1. Test Database Connection:

1. Go to: https://alvverse.vercel.app
2. Click MAP → Login
3. Sign up with Google
4. Should create user in `users` table

### 2. Verify Data:

1. Go to Supabase Dashboard
2. Table Editor → `users`
3. Should see your new user account

### 3. Test Game Data:

1. Complete a level (when Unity games are ready)
2. Check `scores` table - should see entry
3. Check `telemetry_sessions` table - should see session data

---

## 🔄 What Changed

### Old Project:
- URL: `okumswphgekymmgqbxwf.supabase.co`
- Anon Key: `eyJ...` (old)

### New Project:
- URL: `xierzrkqijhymluffqyl.supabase.co` ✅
- Anon Key: `eyJ...` (new) ✅

### What You Need:
- ✅ Run database schema (one time)
- ✅ Configure authentication settings
- ✅ Update Google OAuth redirect URL
- ✅ Test everything

---

## 🎯 Important: Google OAuth Redirect URL

**MUST UPDATE THIS:**

In Google Cloud Console, your redirect URI should be:
```
https://xierzrkqijhymluffqyl.supabase.co/auth/v1/callback
```

**NOT the old one:**
```
❌ https://okumswphgekymmgqbxwf.supabase.co/auth/v1/callback
```

This is critical - Google OAuth won't work without this!

---

## 📚 Additional Resources

- **Database Schema:** `Auth/schema.sql`
- **Google OAuth Setup:** `GOOGLE_AUTH_SETUP.md`
- **Production OAuth:** `PRODUCTION_OAUTH_SETUP.md`

---

## ✅ Summary

**Code Updated:** ✅ All files updated with new credentials  
**Next Steps:**
1. Run database schema in new Supabase project
2. Configure authentication settings
3. Update Google OAuth redirect URL
4. Test authentication flow

**No other API keys needed** - you have everything:
- ✅ Anon key (for frontend)
- ✅ Service role key (for backend if needed)
- ✅ Project URL

---

*After completing the setup steps above, your new Supabase project will be fully configured!*

