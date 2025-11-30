# ALvVERSE Authentication System Guide

## Overview
This authentication system uses **Supabase** for user management, authentication, and data storage. It protects the Level Map behind a login page and tracks user progress through levels.

## System Architecture

### 1. **Authentication Flow**
```
User visits index.html 
  → Clicks "MAP" 
  → Redirected to login.html
  → User logs in/signs up
  → Authenticated users access LevelMap
  → User progress is saved to Supabase
```

### 2. **Files Created**

#### Frontend Files:
- **`login.html`** - Login/Signup page with same background as main site
- **`css/auth.css`** - Styles for authentication pages
- **`js/supabase-config.js`** - Supabase client configuration
- **`js/auth.js`** - Login/signup logic
- **`js/auth-check.js`** - Protected route middleware
- **`js/game-data.js`** - Game progress and telemetry management

#### LevelMap Integration:
- **`LevelMap/src/components/UserInfo.tsx`** - User info display with logout
- **`LevelMap/index.html`** - Updated with Supabase auth check

## Setup Instructions

### Step 1: Supabase Configuration (Already Done!)
Your Supabase project is already configured:
- **Project URL**: `https://okumswphgekymmgqbxwf.supabase.co`
- **Project Ref**: `okumswphgekymmgqbxwf`
- API keys are already set in the code

### Step 2: Database Setup
1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/okumswphgekymmgqbxwf)
2. Navigate to **SQL Editor**
3. Run the schema from `Auth/schema.sql` (if not already done)
4. Verify tables exist: `users`, `telemetry_sessions`, `scores`

### Step 3: Disable Row Level Security (For Testing)
Run this in SQL Editor:
```sql
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE telemetry_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE scores DISABLE ROW LEVEL SECURITY;
```

### Step 4: Authentication Settings
1. Go to **Authentication** → **Settings**
2. Set **Site URL**: `http://localhost:8080` (or your domain)
3. Add **Redirect URLs**: 
   - `http://localhost:8080/**`
   - `https://yourdomain.com/**`
4. **Disable email confirmation** for testing (optional)

## How It Works

### User Registration (Signup)
1. User fills signup form with:
   - Username
   - Email
   - Password
   - School Name (optional)
2. System creates account in Supabase Auth
3. User record created in `users` table with UUID
4. User automatically logged in and redirected to Level Map

### User Login
1. User enters email and password
2. Supabase validates credentials
3. Session token stored in browser
4. User redirected to Level Map

### Protected Routes
- LevelMap checks for valid session on load
- If no session found, redirects to login page
- Session persists across page refreshes

### Progress Tracking
When a level is completed:
1. Score saved to `scores` table
2. Telemetry data saved to `telemetry_sessions` table
3. Level marked as completed in localStorage (for instant UI update)
4. Progress synced with Supabase

## Integration with Unity Games

### Current Setup (HTML Levels)
Currently using dummy HTML files: `level1.html`, `level2.html`, etc.

### Future Setup (Unity WebGL)
When you deploy Unity games, they can call JavaScript functions to save data:

```javascript
// In Unity C# code, call this after level completion:
Application.ExternalCall("UnityGameData.saveLevelCompletion", levelId, score, telemetryJson);
```

Example telemetry data structure:
```javascript
{
  session_id: "session_123",
  level_id: "level_1",
  total_questions: 10,
  wrong_answers: 2,
  scene_runs: 1,
  time_zone_3d: 45.5,
  time_training_2d: 30.2,
  timestamp_start: "2024-01-01T10:00:00Z",
  timestamp_end: "2024-01-01T10:15:00Z",
  hint_used: true,
  final_score: 800
}
```

### Available JavaScript Functions for Unity:
```javascript
// Save level completion
window.UnityGameData.saveLevelCompletion(levelId, score, telemetryData)

// Save telemetry only
window.UnityGameData.saveTelemetryData(telemetryData)

// Get user progress
window.UnityGameData.getUserProgress()

// Get leaderboard
window.UnityGameData.getLeaderboard(levelId, limit)
```

## Database Schema

### `users` Table
- `uid` (UUID) - Primary key, linked to Supabase Auth
- `username` (VARCHAR) - Display name
- `email` (VARCHAR) - Unique email
- `school_name` (VARCHAR) - Optional school
- `is_active` (BOOLEAN) - Account status
- `auth_token` (VARCHAR) - Session token
- `created_at` (TIMESTAMP) - Account creation date

### `scores` Table
- `id` (SERIAL) - Primary key
- `user_id` (UUID) - Foreign key to users
- `level_id` (VARCHAR) - Level identifier
- `score` (INT) - Score achieved
- `recorded_at` (TIMESTAMP) - When score was recorded

### `telemetry_sessions` Table
- `id` (SERIAL) - Primary key
- `user_id` (UUID) - Foreign key to users
- `session_id` (VARCHAR) - Unique session identifier
- `level_id` (VARCHAR) - Level identifier
- `total_questions` (INT) - Total questions in level
- `wrong_answers` (INT) - Number of mistakes
- `scene_runs` (INT) - How many times level was attempted
- `time_zone_3d` (FLOAT) - Time spent in 3D section
- `time_training_2d` (FLOAT) - Time spent in 2D section
- `timestamp_start` (VARCHAR) - Session start time
- `timestamp_end` (VARCHAR) - Session end time
- `hint_used` (BOOLEAN) - Whether hints were used
- `final_score` (INT) - Final score achieved

## Testing the System

### Test Signup:
1. Open `http://localhost:8080/login.html` (or your domain)
2. Click "Sign Up" tab
3. Fill in details:
   - Username: testuser
   - Email: test@example.com
   - Password: test123456
4. Click "Sign Up"
5. Should redirect to Level Map

### Test Login:
1. Open `http://localhost:8080/login.html`
2. Use existing credentials
3. Should redirect to Level Map

### Test Protected Route:
1. Try accessing `http://localhost:8080/LevelMap/dist/index.html` directly
2. Without login, should redirect to login page
3. After login, can access Level Map

### Test Logout:
1. In Level Map, click the logout button (top right)
2. Should clear session and redirect to login

## Security Notes

### Production Checklist:
- [ ] Enable Row Level Security (RLS) on all tables
- [ ] Set up proper RLS policies
- [ ] Enable email confirmation
- [ ] Use environment variables for API keys
- [ ] Set proper CORS policies
- [ ] Use HTTPS only
- [ ] Implement rate limiting
- [ ] Add password complexity requirements

### Current Setup (Development):
- ✅ RLS disabled for easy testing
- ✅ Email confirmation disabled
- ✅ API keys in code (move to env vars for production)

## Troubleshooting

### "Not authenticated" errors:
- Check Supabase dashboard → Authentication → Users
- Verify user exists
- Clear browser localStorage and try again

### "Invalid API key":
- Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `supabase-config.js`
- Check Supabase dashboard → Settings → API

### Redirect loops:
- Check browser console for errors
- Verify Supabase Auth settings (Site URL, Redirect URLs)

### Database connection errors:
- Verify tables exist in Supabase
- Check RLS is disabled for testing
- Run schema.sql again if needed

## Next Steps

1. **Test authentication** with real users
2. **Deploy Unity games** to replace HTML levels
3. **Implement leaderboard UI** using `getLeaderboard()` function
4. **Add social auth** (Google, GitHub) via Supabase
5. **Enable RLS** for production security
6. **Add analytics dashboard** to view telemetry data

## Support

For issues or questions:
- Check Supabase documentation: https://supabase.com/docs
- Review Auth folder files for backend setup
- Contact project maintainers

---

**System Status**: ✅ Authentication system is fully integrated and ready for testing!

