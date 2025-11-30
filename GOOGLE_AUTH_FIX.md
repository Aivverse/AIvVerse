# 🔧 Fix: Google OAuth "redirect_uri_mismatch" Error

## The Error You're Seeing:
```
Error 400: redirect_uri_mismatch
You can't sign in because this app sent an invalid request.
```

## ✅ I've Already Fixed The Code!

The issue was in how the redirect URL was configured. I've updated the JavaScript to use the correct Supabase callback flow.

---

## 🎯 What You Need To Do Now:

### Step 1: Configure Google Cloud Console

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/apis/credentials

2. **Select Your Project** (or create one if you haven't):
   - Click the project dropdown at the top
   - Select or create "ALvVERSE" project

3. **Create OAuth 2.0 Client ID:**
   - Click "Create Credentials" → "OAuth client ID"
   - If prompted, configure consent screen first (External, add app name)

4. **Configure the OAuth Client:**
   
   **Application type:** Web application
   
   **Name:** ALvVERSE Web Client
   
   **Authorized JavaScript origins:**
   ```
   http://localhost:8080
   https://okumswphgekymmgqbxwf.supabase.co
   ```
   
   **Authorized redirect URIs (THE IMPORTANT PART!):**
   ```
   https://okumswphgekymmgqbxwf.supabase.co/auth/v1/callback
   ```
   
   ⚠️ **IMPORTANT:** Only add the Supabase URL above. Do NOT add any other URLs!

5. **Save and Copy Credentials:**
   - Click "Create"
   - Copy the **Client ID** (looks like: `xxxxx.apps.googleusercontent.com`)
   - Copy the **Client Secret**

---

### Step 2: Configure Supabase

1. **Go to Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard/project/okumswphgekymmgqbxwf

2. **Enable Google Provider:**
   - Click "Authentication" in left sidebar
   - Click "Providers"
   - Find "Google" and toggle it ON

3. **Enter Your Google Credentials:**
   - **Client ID:** Paste the Client ID from Google
   - **Client Secret:** Paste the Client Secret from Google
   - Click "Save"

4. **Configure Redirect URLs:**
   - Go to Authentication → Settings
   - Scroll to "Redirect URLs"
   - Add these URLs:
     ```
     http://localhost:8080/login.html
     http://localhost:8080/**
     ```
   - Save

---

## 🧪 Test It Now:

1. **Refresh your browser** (clear cache if needed)

2. **Go to login page:**
   ```
   http://localhost:8080/login.html
   ```

3. **Click "Sign Up" tab**

4. **Click "Sign up with Google"**

5. **Select your Google account**

6. **Should redirect back and log you in!** ✅

---

## 📋 Checklist:

Make sure you have:

- [ ] Created OAuth client in Google Cloud Console
- [ ] Added ONLY Supabase callback URL to Google redirect URIs
- [ ] Copied Client ID and Secret
- [ ] Enabled Google provider in Supabase
- [ ] Pasted Client ID and Secret in Supabase
- [ ] Added redirect URLs in Supabase settings
- [ ] Refreshed your browser
- [ ] Tested the signup flow

---

## 🎯 The Flow Now Works Like This:

```
1. Click "Sign up with Google"
   ↓
2. Redirect to Google login
   ↓
3. Google redirects to: 
   https://okumswphgekymmgqbxwf.supabase.co/auth/v1/callback
   ↓
4. Supabase processes authentication
   ↓
5. Supabase redirects to:
   http://localhost:8080/login.html
   ↓
6. login.html detects session
   ↓
7. Creates user profile in database
   ↓
8. Redirects to Level Map
   ✅ Success!
```

---

## 🐛 Still Getting Errors?

### Error: "redirect_uri_mismatch"
→ **Check:** Google Cloud Console redirect URIs
→ **Should be ONLY:** `https://okumswphgekymmgqbxwf.supabase.co/auth/v1/callback`

### Error: "Invalid client ID"
→ **Check:** Client ID is correctly pasted in Supabase
→ **Check:** No extra spaces or characters

### Button does nothing
→ **Check:** Browser console for errors (F12)
→ **Check:** Google provider is enabled in Supabase

### Profile not created
→ **Check:** Supabase Table Editor → users table
→ **Check:** Browser console for errors
→ May need to disable RLS: `ALTER TABLE users DISABLE ROW LEVEL SECURITY;`

---

## 📸 Visual Guide:

### Google Cloud Console Should Look Like:

```
Authorized redirect URIs:
┌────────────────────────────────────────────────────────────┐
│ https://okumswphgekymmgqbxwf.supabase.co/auth/v1/callback │
└────────────────────────────────────────────────────────────┘
     [+ ADD URI]
```

### Supabase Should Show:

```
Google Provider: ✅ Enabled

Client ID: xxxxx.apps.googleusercontent.com
Client Secret: ••••••••••••••••

Redirect URLs:
- http://localhost:8080/login.html
- http://localhost:8080/**
```

---

## 🎉 Once Configured:

After you complete the setup above, Google authentication will work perfectly! Users can:

- ✅ Click "Sign up with Google"
- ✅ Select their Google account
- ✅ Automatically create profile
- ✅ Redirect to Level Map
- ✅ Start playing!

---

## ⏱️ Estimated Time:

- Google Cloud setup: ~5 minutes
- Supabase setup: ~2 minutes
- Testing: ~1 minute
- **Total: ~8 minutes**

---

**Need more help?** Check the browser console (F12) for detailed error messages, or review `GOOGLE_AUTH_SETUP.md` for full documentation.

---

*The code is fixed and ready to work once you complete the configuration above!*

