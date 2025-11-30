# 🔧 Fix: Supabase Redirecting to localhost:3000

## ❌ The Problem

After Google OAuth, Supabase is redirecting to `http://localhost:3000/` instead of your actual site. This happens because:

1. **Supabase Site URL is set to `localhost:3000`** (wrong!)
2. Supabase uses the Site URL as the default redirect destination

---

## ✅ The Fix

### Step 1: Update Supabase Site URL

1. **Go to Supabase Dashboard:**
   - https://supabase.com/dashboard/project/xierzrkqijhymluffqyl

2. **Authentication → Settings**

3. **Find "Site URL" field**

4. **Change it to:**
   ```
   https://alvverse.vercel.app
   ```
   
   **NOT** `http://localhost:3000` ❌

5. **Save Settings**

---

### Step 2: Verify Redirect URLs

Still in **Authentication → Settings**, scroll to **Redirect URLs**:

**Make sure these are added:**
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

**Click "Save"**

---

### Step 3: Test Again

1. **Wait 1-2 minutes** for changes to propagate

2. **Clear browser cache** (or use incognito mode)

3. **Test on Vercel:**
   - Go to: https://alvverse.vercel.app/login.html
   - Click "Sign up with Google"
   - Should redirect back to: `https://alvverse.vercel.app/login.html` ✅

4. **Test on localhost:**
   - Go to: `http://localhost:8000/login.html` (or your port)
   - Click "Sign up with Google"
   - Should redirect back to: `http://localhost:8000/login.html` ✅

---

## 🎯 Why This Happens

Supabase uses the **Site URL** as the default redirect destination after OAuth. If it's set to `localhost:3000`, it will always redirect there, even when accessed from Vercel.

**The fix:** Set Site URL to your production domain, and add all localhost variants to Redirect URLs.

---

## 📋 Complete Checklist

- [ ] Supabase Site URL = `https://alvverse.vercel.app` (NOT localhost)
- [ ] Redirect URLs include Vercel domain
- [ ] Redirect URLs include localhost variants
- [ ] Google Console redirect URI = Supabase callback only
- [ ] Saved all settings
- [ ] Waited 1-2 minutes
- [ ] Cleared browser cache
- [ ] Tested on Vercel ✅
- [ ] Tested on localhost ✅

---

## 🐛 If Still Not Working

### Check Browser Console (F12):

Look for errors like:
- "Invalid redirect URL"
- "redirect_uri_mismatch"
- Any Supabase errors

### Verify in Supabase:

1. Go to **Authentication → Settings**
2. Check **Site URL** is exactly: `https://alvverse.vercel.app`
3. Check **Redirect URLs** include your domains
4. Make sure there are no typos

### Verify in Google Console:

1. **Authorized redirect URIs** should ONLY be:
   ```
   https://xierzrkqijhymluffqyl.supabase.co/auth/v1/callback
   ```

---

## ✅ Summary

**The Issue:** Supabase Site URL was set to `localhost:3000`

**The Fix:** 
1. Change Site URL to `https://alvverse.vercel.app`
2. Add all localhost variants to Redirect URLs
3. Save and wait 1-2 minutes

**Result:** OAuth will redirect to the correct domain! ✅

---

*After fixing the Site URL, Google OAuth will work correctly on both Vercel and localhost!*

