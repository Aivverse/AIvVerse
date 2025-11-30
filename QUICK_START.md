# ALvVERSE Authentication - Quick Start Guide

## 🚀 What's Been Set Up

✅ **Login/Signup System** - Beautiful login page with Supabase authentication  
✅ **Google OAuth Signup** - Users can sign up with Google account  
✅ **Protected Level Map** - Only authenticated users can access  
✅ **User Session Management** - Login persists across page reloads  
✅ **Database Integration** - User data, scores, and telemetry tracked  
✅ **Logout Functionality** - Users can sign out anytime  
✅ **Progress Tracking** - Levels completed are saved to database  

## 📁 New Files Created

```
alvverse/
├── login.html                        # Login/signup page with Google OAuth
├── auth-callback.html                # OAuth callback handler
├── css/auth.css                      # Authentication styles
├── js/
│   ├── supabase-config.js           # Supabase configuration
│   ├── auth.js                      # Login/signup logic with Google
│   ├── auth-check.js                # Protected route middleware
│   └── game-data.js                 # Game progress management
├── LevelMap/
│   ├── src/components/UserInfo.tsx  # User info + logout button
│   └── index.html (updated)         # Added auth protection
├── level-template-example.html      # Example level with Supabase
├── AUTHENTICATION_GUIDE.md          # Detailed documentation
├── GOOGLE_AUTH_SETUP.md             # Google OAuth setup guide ⭐ NEW!
└── QUICK_START.md                   # This file
```

## 🎯 How to Test

### 1. Start a Local Server
You need a web server to test. Choose one:

**Option A - Python:**
```bash
cd /Users/sujalthapa/Desktop/alvverse
python3 -m http.server 8080
```

**Option B - Node.js (http-server):**
```bash
npm install -g http-server
cd /Users/sujalthapa/Desktop/alvverse
http-server -p 8080
```

**Option C - VS Code Live Server:**
- Install "Live Server" extension
- Right-click `index.html` → "Open with Live Server"

### 2. Test the Flow

1. **Visit Homepage:**
   ```
   http://localhost:8080/index.html
   ```

2. **Click "MAP" in navigation**
   - Should redirect to login page

3. **Create Account (Signup):**
   
   **Option A - Email/Password:**
   - Click "Sign Up" tab
   - Fill in:
     - Username: `testuser`
     - Email: `test@example.com`
     - Password: `password123`
   - Click "Sign Up"
   - Should redirect to Level Map
   
   **Option B - Google OAuth (requires Supabase setup):**
   - Click "Sign Up" tab
   - Click "Sign up with Google"
   - Login with Google account
   - Should redirect to Level Map
   - See `GOOGLE_AUTH_SETUP.md` for configuration

4. **Check Level Map:**
   - See your username in top-left corner
   - Click levels to play
   - Click logout button (top-right) to sign out

5. **Test Login:**
   - Go back to login page
   - Use same credentials
   - Should log in successfully

### 3. Verify Database

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/okumswphgekymmgqbxwf)
2. Navigate to **Table Editor**
3. Check **users** table - your user should be there
4. Check **scores** table - completed levels appear here
5. Check **telemetry_sessions** table - game data appears here

## 🔧 Configuration

### Supabase Settings
Your project is already configured:
- **URL:** `https://okumswphgekymmgqbxwf.supabase.co`
- **Keys:** Already set in code

### First Time Setup
If you haven't run the database schema yet:

1. Go to Supabase Dashboard → **SQL Editor**
2. Copy content from `Auth/schema.sql`
3. Paste and run it
4. Run this to disable RLS (for testing):
```sql
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE telemetry_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE scores DISABLE ROW LEVEL SECURITY;
```

## 🎮 Integrating Levels

### Current Setup (HTML Levels)
Your dummy levels (`level1.html`, `level2.html`, etc.) can be updated using the template in `level-template-example.html`

### Key Integration Points:

1. **Check Authentication:**
```javascript
async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        window.location.href = '/login.html';
    }
}
```

2. **Save Level Completion:**
```javascript
await supabase
    .from('scores')
    .insert([{
        user_id: userId,
        level_id: 'level_1',
        score: 1000
    }]);
```

3. **Save Telemetry Data:**
```javascript
await supabase
    .from('telemetry_sessions')
    .insert([{
        user_id: userId,
        level_id: 'level_1',
        total_questions: 10,
        wrong_answers: 2,
        final_score: 800
        // ... more metrics
    }]);
```

### Future Setup (Unity WebGL)
When Unity games replace HTML levels:

1. Unity game exports to WebGL
2. Place Unity build in `LevelMap/public/` or similar
3. Unity calls JavaScript functions:
```javascript
// From Unity C#:
Application.ExternalCall("UnityGameData.saveLevelCompletion", 
    "level_1", 
    1000, 
    telemetryJson);
```

## 🐛 Troubleshooting

### "Not authenticated" error
- Clear browser localStorage
- Try signup again
- Check browser console for errors

### Redirect loops
- Make sure you're using a web server (not file://)
- Check Supabase Auth settings
- Clear cookies and try again

### Database errors
- Verify schema is set up (check SQL Editor)
- Make sure RLS is disabled for testing
- Check Supabase dashboard for connection status

### Level Map not loading
- Rebuild: `cd LevelMap && npm run build`
- Check browser console for errors
- Verify auth-check script is loaded

## 📊 Database Tables

### users
Stores user profiles:
- `uid` - User ID (from Supabase Auth)
- `username` - Display name
- `email` - Email address
- `school_name` - Optional school
- `is_active` - Account status

### scores
Tracks level completions:
- `user_id` - Who completed it
- `level_id` - Which level
- `score` - Points earned
- `recorded_at` - When

### telemetry_sessions
Detailed game analytics:
- `user_id` - Player ID
- `level_id` - Level played
- `total_questions` - Total questions
- `wrong_answers` - Mistakes made
- `time_zone_3d` - Time in 3D section
- `time_training_2d` - Time in 2D section
- `hint_used` - Used hints?
- `final_score` - Final score

## 🔐 Security Notes

### Current (Development):
- ✅ Authentication working
- ✅ Session management active
- ⚠️ RLS disabled (for easy testing)
- ⚠️ API keys in code

### For Production:
- [ ] Enable Row Level Security
- [ ] Move API keys to environment variables
- [ ] Enable email confirmation
- [ ] Add CAPTCHA to prevent bots
- [ ] Use HTTPS only
- [ ] Set up proper CORS

## 📚 Additional Resources

- **Full Guide:** `AUTHENTICATION_GUIDE.md`
- **Google OAuth Setup:** `GOOGLE_AUTH_SETUP.md` ⭐ NEW!
- **Supabase Docs:** https://supabase.com/docs
- **Auth Setup:** `Auth/AUTHENTICATION_SETUP.md`
- **Schema:** `Auth/schema.sql`

## ✅ Testing Checklist

- [ ] Start local web server
- [ ] Open homepage
- [ ] Click MAP → redirects to login
- [ ] Create new account (signup)
- [ ] Redirects to Level Map after signup
- [ ] See username displayed
- [ ] Click logout → redirects to login
- [ ] Login with existing account
- [ ] Access Level Map successfully
- [ ] Complete a level (using template)
- [ ] Check Supabase dashboard for data

## 🎉 You're Ready!

The authentication system is fully integrated. Just:
1. Start a web server
2. Test the flow
3. Integrate your actual game levels
4. Deploy when ready!

---

**Need Help?** Check `AUTHENTICATION_GUIDE.md` for detailed documentation.

