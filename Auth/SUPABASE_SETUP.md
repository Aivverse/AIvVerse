# Supabase Migration Guide

## Part 1: Supabase Setup

### 1. Create a Supabase Project
1. Go to https://supabase.com and sign up/login
2. Click "New Project"
3. Fill in:
   - **Project Name**: Your project name
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to your users
4. Wait for project to be created (2-3 minutes)

### 2. Get Your Connection Details
1. Go to **Settings** → **Database**
2. Find **Connection string** section
3. Copy the **URI** connection string (it looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`)
4. Also note:
   - **Host**: `db.xxxxx.supabase.co`
   - **Port**: `5432`
   - **Database**: `postgres`
   - **User**: `postgres`
   - **Password**: (the one you set)

### 3. Get Your Supabase API Keys
1. Go to **Settings** → **API**
2. Copy:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: (starts with `eyJ...`)
   - **service_role key**: (starts with `eyJ...`) - **KEEP THIS SECRET!**

### 4. Set Up Database Schema
1. Go to **SQL Editor** in Supabase dashboard
2. Run the SQL from `schema.sql` (provided in your project)
3. Verify tables are created: Go to **Table Editor** and check for:
   - `users`
   - `telemetry_sessions`
   - `scores`

### 5. Configure Authentication
1. Go to **Authentication** → **Settings**
2. Enable **Email** provider (should be enabled by default)
3. Configure **Site URL**: Your frontend URL (e.g., `http://localhost:3000`)
4. Configure **Redirect URLs**: Add your allowed redirect URLs
5. (Optional) Disable email confirmation if you want instant signup

### 6. Set Up Row Level Security (RLS) - Optional but Recommended
1. Go to **Authentication** → **Policies**
2. For each table (`users`, `telemetry_sessions`, `scores`), you can set policies
3. For now, you can disable RLS for testing:
   ```sql
   ALTER TABLE users DISABLE ROW LEVEL SECURITY;
   ALTER TABLE telemetry_sessions DISABLE ROW LEVEL SECURITY;
   ALTER TABLE scores DISABLE ROW LEVEL SECURITY;
   ```
   (Run this in SQL Editor)

### 7. Environment Variables
Create a `.env` file or set these environment variables:
```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_role_key_here
SUPABASE_DB_HOST=db.xxxxx.supabase.co
SUPABASE_DB_PORT=5432
SUPABASE_DB_NAME=postgres
SUPABASE_DB_USER=postgres
SUPABASE_DB_PASSWORD=your_database_password
```

## Part 2: Code Changes

The code has been updated to:
1. Use Supabase Auth API for user signup/login
2. Connect to Supabase PostgreSQL database
3. Use Supabase JWT tokens for authentication

### Key Changes:
- `main.cpp`: Updated to use Supabase PostgreSQL connection
- `AuthController.hpp`: Now uses Supabase Auth API instead of custom auth
- `SupabaseClient.hpp`: New helper class for Supabase API calls

## Part 3: Testing

1. Start your server
2. Test signup endpoint:
   ```bash
   curl -X POST http://localhost:8080/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"test123","username":"testuser","school":"Test School"}'
   ```
3. Check Supabase dashboard → **Authentication** → **Users** to see the new user

## Notes:
- Supabase handles password hashing automatically (uses bcrypt)
- Supabase provides JWT tokens for authentication
- You can use Supabase's built-in user management UI
- Consider using Supabase's real-time features for future enhancements

