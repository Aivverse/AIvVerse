# 🔧 Production OAuth Setup for alvverse.vercel.app

## Your Production Domain
**https://alvverse.vercel.app/**

---

## Step 1: Update Google Cloud Console

### 1. Go to Google Cloud Console

Visit: https://console.cloud.google.com/apis/credentials

### 2. Select Your Project

- Click the project dropdown at the top
- Select your ALvVERSE project (or create one if you haven't)

### 3. Edit Your OAuth 2.0 Client

- Find your OAuth 2.0 Client ID in the credentials list
- Click on it to edit

### 4. Update Authorized JavaScript Origins

**Add this URL:**
```
https://alvverse.vercel.app
```

**Keep existing URLs:**
```
http://localhost:8080
https://okumswphgekymmgqbxwf.supabase.co
```

**Final list should look like:**
```
http://localhost:8080
https://okumswphgekymmgqbxwf.supabase.co
https://alvverse.vercel.app
```

### 5. Update Authorized Redirect URIs

**IMPORTANT:** Only add the Supabase callback URL. Do NOT add your Vercel domain here!

**Should be ONLY:**
```
https://okumswphgekymmgqbxwf.supabase.co/auth/v1/callback
```

**Do NOT add:**
- ❌ `https://alvverse.vercel.app/auth-callback.html`
- ❌ `https://alvverse.vercel.app/**`

The redirect flow is: Google → Supabase → Your Vercel site

### 6. Save Changes

- Click "Save" at the bottom
- Wait a few seconds for changes to propagate

---

## Step 2: Update Supabase Settings

### 1. Go to Supabase Dashboard

Visit: https://supabase.com/dashboard/project/okumswphgekymmgqbxwf

### 2. Update Site URL

- Go to **Authentication** → **Settings**
- Find **Site URL** field
- Change to:
  ```
  https://alvverse.vercel.app
  ```

### 3. Update Redirect URLs

- Scroll to **Redirect URLs** section
- Click **Add URL** and add:
  ```
  https://alvverse.vercel.app/**
  ```
- Also add:
  ```
  https://alvverse.vercel.app/login.html
  ```
- Also add:
  ```
  https://alvverse.vercel.app/LevelMap/dist/index.html
  ```

**Final Redirect URLs should include:**
```
http://localhost:8080/**
http://localhost:8080/login.html
https://alvverse.vercel.app/**
https://alvverse.vercel.app/login.html
https://alvverse.vercel.app/LevelMap/dist/index.html
```

### 4. Save Settings

- Click **Save** at the bottom

---

## Step 3: Verify Google Provider Settings

### 1. Check Google Provider

- Still in **Authentication** → **Providers**
- Find **Google** provider
- Make sure it's **Enabled** (toggle should be green)
- Verify **Client ID** and **Client Secret** are correct

---

## Step 4: Test the Flow

### 1. Visit Your Production Site

Go to: **https://alvverse.vercel.app**

### 2. Test Google Login

1. Click **MAP** button
2. Should redirect to login page
3. Click **"Sign up with Google"** or **"Sign Up"** tab → **"Sign up with Google"**
4. Should redirect to Google login
5. Select your Google account
6. Should redirect back to your site
7. Should be logged in and see Level Map

### 3. If It Doesn't Work

**Check browser console (F12) for errors:**
- Look for "redirect_uri_mismatch" → Google settings wrong
- Look for "Invalid redirect URL" → Supabase settings wrong
- Look for authentication errors → Check Supabase provider settings

---

## 📋 Quick Checklist

### Google Cloud Console:
- [ ] Added `https://alvverse.vercel.app` to **Authorized JavaScript origins**
- [ ] Kept `https://okumswphgekymmgqbxwf.supabase.co/auth/v1/callback` in **Authorized redirect URIs**
- [ ] Saved changes

### Supabase:
- [ ] Updated **Site URL** to `https://alvverse.vercel.app`
- [ ] Added `https://alvverse.vercel.app/**` to **Redirect URLs**
- [ ] Added `https://alvverse.vercel.app/login.html` to **Redirect URLs**
- [ ] Saved settings
- [ ] Verified Google provider is enabled

### Testing:
- [ ] Visited https://alvverse.vercel.app
- [ ] Clicked MAP → Login page loads
- [ ] Clicked "Sign up with Google"
- [ ] Google login works
- [ ] Redirected back to site
- [ ] Successfully logged in

---

## 🔍 Visual Guide

### Google Cloud Console Should Show:

**Authorized JavaScript origins:**
```
┌─────────────────────────────────────────────┐
│ http://localhost:8080                       │
│ https://okumswphgekymmgqbxwf.supabase.co    │
│ https://alvverse.vercel.app                 │ ← NEW
└─────────────────────────────────────────────┘
```

**Authorized redirect URIs:**
```
┌─────────────────────────────────────────────┐
│ https://okumswphgekymmgqbxwf.supabase.co/  │
│   auth/v1/callback                          │ ← ONLY THIS
└─────────────────────────────────────────────┘
```

### Supabase Should Show:

**Site URL:**
```
https://alvverse.vercel.app
```

**Redirect URLs:**
```
┌─────────────────────────────────────────────┐
│ http://localhost:8080/**                    │
│ http://localhost:8080/login.html            │
│ https://alvverse.vercel.app/**               │ ← NEW
│ https://alvverse.vercel.app/login.html      │ ← NEW
│ https://alvverse.vercel.app/LevelMap/        │
│   dist/index.html                            │ ← NEW
└─────────────────────────────────────────────┘
```

---

## 🐛 Troubleshooting

### Error: "redirect_uri_mismatch"

**Cause:** Google redirect URI doesn't match

**Fix:**
- In Google Cloud Console, make sure redirect URI is EXACTLY:
  ```
  https://okumswphgekymmgqbxwf.supabase.co/auth/v1/callback
  ```
- Do NOT add your Vercel domain to redirect URIs

### Error: "Invalid redirect URL" in Supabase

**Cause:** Supabase redirect URL not configured

**Fix:**
- Add `https://alvverse.vercel.app/**` to Supabase Redirect URLs
- Make sure Site URL is `https://alvverse.vercel.app`

### Google button does nothing

**Cause:** JavaScript origins not configured

**Fix:**
- Add `https://alvverse.vercel.app` to Google Authorized JavaScript origins
- Wait 1-2 minutes for changes to propagate

### Redirects to wrong page

**Cause:** Supabase Site URL wrong

**Fix:**
- Update Supabase Site URL to `https://alvverse.vercel.app`
- Add all necessary redirect URLs

---

## ✅ Summary

### What Changed:

1. **Google Cloud Console:**
   - Added `https://alvverse.vercel.app` to JavaScript origins
   - Redirect URI stays as Supabase callback (no change)

2. **Supabase:**
   - Site URL: `https://alvverse.vercel.app`
   - Redirect URLs: Added Vercel domain patterns

### What Stays the Same:

- ✅ Your code (no changes needed)
- ✅ Supabase project URL
- ✅ Google Client ID and Secret
- ✅ Database structure

### Result:

✅ Google OAuth now works on **https://alvverse.vercel.app**  
✅ Still works on localhost for development  
✅ All authentication flows correctly  

---

## 🎉 You're Done!

After making these changes:
1. Wait 1-2 minutes for changes to propagate
2. Clear browser cache (or use incognito)
3. Test Google login on https://alvverse.vercel.app
4. Should work perfectly! ✅

---

*Your production site is now ready for Google authentication!*

