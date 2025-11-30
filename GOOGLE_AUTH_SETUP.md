# Google Authentication Setup Guide

## Overview
Google authentication has been added to the **Signup process only**. Users can sign up with their Google account, but regular email/password login is still available for all users.

## What's Been Implemented

### ✅ Frontend Changes:
1. **"Sign up with Google" button** added to signup form
2. **OAuth callback page** (`auth-callback.html`) to handle Google redirect
3. **Automatic user profile creation** after Google signup
4. **Beautiful Google button** with official Google logo
5. **Loading states** and error handling

### 📁 Files Created/Modified:
- ✅ `login.html` - Added Google signup button
- ✅ `css/auth.css` - Added Google button styles
- ✅ `js/auth.js` - Added Google signup handler
- ✅ `auth-callback.html` - OAuth callback page
- ✅ `GOOGLE_AUTH_SETUP.md` - This guide

---

## Supabase Configuration (REQUIRED)

You need to enable Google OAuth in your Supabase project. Follow these steps:

### Step 1: Create Google OAuth Credentials

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/

2. **Create a New Project** (or select existing):
   - Click "Select a Project" → "New Project"
   - Name: `ALvVERSE` (or your choice)
   - Click "Create"

3. **Enable Google+ API:**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. **Create OAuth Credentials:**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - If prompted, configure OAuth consent screen first:
     - User Type: External
     - App name: ALvVERSE
     - User support email: Your email
     - Developer contact: Your email
     - Click "Save and Continue"
   
5. **Configure OAuth Client:**
   - Application type: **Web application**
   - Name: `ALvVERSE Web Client`
   - **Authorized JavaScript origins:**
     ```
     http://localhost:8080
     https://okumswphgekymmgqbxwf.supabase.co
     https://yourdomain.com (add when you deploy)
     ```
   - **Authorized redirect URIs (IMPORTANT!):**
     ```
     https://okumswphgekymmgqbxwf.supabase.co/auth/v1/callback
     ```
     **Note:** Only add the Supabase callback URL. Do NOT add your local or custom URLs here.
   - Click "Create"

6. **Copy Credentials:**
   - You'll see your **Client ID** and **Client Secret**
   - Save these - you'll need them for Supabase

### Step 2: Configure Supabase

1. **Go to Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard/project/okumswphgekymmgqbxwf

2. **Navigate to Authentication Settings:**
   - Click "Authentication" in left sidebar
   - Click "Providers"

3. **Enable Google Provider:**
   - Find "Google" in the list
   - Toggle it **ON**

4. **Enter Google Credentials:**
   - **Client ID**: Paste from Google Cloud Console
   - **Client Secret**: Paste from Google Cloud Console
   - Click "Save"

5. **Configure Redirect URLs:**
   - Go to Authentication → Settings → URL Configuration
   - **Site URL**: `http://localhost:8080` (or your domain)
   - **Redirect URLs** (add these):
     ```
     http://localhost:8080/login.html
     http://localhost:8080/**
     https://yourdomain.com/** (add when deploying)
     ```

### Step 3: Test the Integration

1. **Start your local server:**
   ```bash
   cd /Users/sujalthapa/Desktop/alvverse
   python3 -m http.server 8080
   ```

2. **Open in browser:**
   ```
   http://localhost:8080/login.html
   ```

3. **Test Google Signup:**
   - Click "Sign Up" tab
   - Click "Sign up with Google" button
   - Should redirect to Google login
   - Select/login with Google account
   - Should redirect back to auth-callback.html
   - Should create profile and redirect to Level Map

4. **Test Regular Login:**
   - Logout from Level Map
   - Go back to login page
   - Enter email and password (for Google users, use email/password if set, or login with Google again)

---

## How It Works

### User Flow:

```
┌─────────────────────────────────────────────────────────────┐
│                    User clicks "Sign up with Google"         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Redirect to Google OAuth login                  │
│         (User selects/logs in with Google account)           │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│         Google redirects back to auth-callback.html          │
│              with authentication token                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│           Supabase creates user in auth.users                │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│      Our code creates profile in 'users' table:              │
│      • uid: from Google/Supabase                             │
│      • username: from Google name or email                   │
│      • email: from Google account                            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│           Store session in localStorage                      │
│           Redirect to Level Map                              │
└─────────────────────────────────────────────────────────────┘
```

### Login Flow:

- **Google users** can login with email/password OR click Google button
- **Regular users** use email/password as before
- Session management works the same for both types

---

## Technical Details

### OAuth Callback Handler (`auth-callback.html`):

```javascript
1. Receives OAuth token from Google via Supabase
2. Gets user session from Supabase
3. Extracts user info (email, name)
4. Checks if user exists in 'users' table
5. If not exists, creates user profile
6. Stores session in localStorage
7. Redirects to Level Map
```

### User Profile Creation:

For Google signups, username is derived from:
1. Google display name (`user.user_metadata.full_name`)
2. Google account name (`user.user_metadata.name`)
3. Email prefix (fallback: `email.split('@')[0]`)

### Database Structure:

Same `users` table structure, no changes needed:
- `uid` - Supabase Auth user ID (works for both email and Google)
- `username` - Display name (from Google or manual entry)
- `email` - Email address (from Google or manual entry)
- `school_name` - Optional (null for Google signups initially)

---

## Security Considerations

### ✅ Best Practices:
- Google handles password security (no password stored for Google users)
- OAuth tokens managed by Supabase
- Secure redirect flow
- Session management same as email/password

### 🔒 Production Checklist:
- [ ] Use HTTPS for all redirect URLs
- [ ] Verify Google OAuth consent screen
- [ ] Set proper redirect URL allowlist in Supabase
- [ ] Enable email verification (optional)
- [ ] Monitor failed auth attempts
- [ ] Set up proper CORS policies

---

## Troubleshooting

### "Invalid redirect URI" error (Error 400: redirect_uri_mismatch):
**Solution:**
- Check Google Cloud Console → Credentials → Authorized redirect URIs
- **MUST include ONLY:** `https://okumswphgekymmgqbxwf.supabase.co/auth/v1/callback`
- Do NOT add your local URLs here
- The redirect goes to Supabase first, then back to your site
- In Supabase, set redirect URL to: `http://localhost:8080/login.html`

### Google button does nothing:
**Solution:**
- Check browser console for errors
- Verify Google provider is enabled in Supabase
- Verify Client ID and Secret are correct

### User created in auth but not in users table:
**Solution:**
- Check `auth-callback.html` for errors
- User can still login, profile will be created on next attempt
- Manually create profile in Supabase Table Editor if needed

### Redirect loop after Google signin:
**Solution:**
- Clear browser localStorage
- Check that `auth-callback.html` exists and is accessible
- Verify redirect URLs in Supabase settings

### "Access denied" from Google:
**Solution:**
- Make sure Google+ API is enabled
- Check OAuth consent screen is configured
- Verify user email has access (if in testing mode)

---

## Testing Checklist

- [ ] Google Cloud project created
- [ ] OAuth credentials configured
- [ ] Supabase Google provider enabled
- [ ] Redirect URLs added to both Google and Supabase
- [ ] Local server running
- [ ] Google signup button visible
- [ ] Click button redirects to Google
- [ ] Google login successful
- [ ] Redirects to callback page
- [ ] Profile created in users table
- [ ] Redirects to Level Map
- [ ] Username displayed correctly
- [ ] Can logout and login again

---

## Alternative: Using Google for Login Too

If you want to add "Login with Google" button to the login form as well:

1. Add button to login form in `login.html`:
```html
<button type="button" class="google-btn" onclick="handleGoogleLogin()">
    <!-- Same Google icon -->
    Login with Google
</button>
```

2. Add function to `js/auth.js`:
```javascript
async function handleGoogleLogin() {
    // Same as handleGoogleSignup - Google OAuth works for both
    await handleGoogleSignup();
}
```

---

## Summary

✅ **What's Working:**
- Google signup button on signup form
- OAuth flow with Google
- Automatic user profile creation
- Session management
- Redirect to Level Map

🎯 **Current Setup:**
- **Signup:** Google OR Email/Password
- **Login:** Email/Password only (but Google users can login with email/password if they set one)

🔮 **Optional Enhancement:**
- Add "Login with Google" button to login form too (uses same OAuth flow)

---

**Need Help?** 
- Check Supabase logs: Dashboard → Logs
- Check browser console for errors
- Review Google Cloud Console → Credentials → OAuth consent screen

---

*Google authentication is now integrated and ready to use after Supabase configuration!*

