# Supabase Authentication Setup Guide

## Your Project Details
- **Project URL**: `https://okumswphgekymmgqbxwf.supabase.co`
- **Project Reference**: `okumswphgekymmgqbxwf`

## Step-by-Step Authentication Setup

### 1. Configure Authentication Settings

1. **Go to Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard/project/okumswphgekymmgqbxwf

2. **Open Authentication Settings**
   - Click on **Authentication** in the left sidebar
   - Click on **Settings** (gear icon or Settings tab)

3. **Configure Site URL**
   - Find **Site URL** field
   - Set it to your frontend URL:
     - For local development: `http://localhost:8080` or `http://localhost:3000`
     - For production: Your actual domain (e.g., `https://yourdomain.com`)
   - **Example**: `http://localhost:8080`

4. **Configure Redirect URLs**
   - Scroll down to **Redirect URLs** section
   - Click **Add URL**
   - Add these URLs (one per line):
     ```
     http://localhost:8080/**
     http://localhost:3000/**
     https://yourdomain.com/**
     ```
   - This allows Supabase to redirect users after authentication
   - Use `**` wildcard to allow all paths under that domain

5. **Email Provider Settings** (Already enabled by default)
   - **Email provider** should be enabled
   - **Confirm email**: 
     - ✅ **Enable** if you want users to verify their email before signing in
     - ❌ **Disable** if you want instant signup (recommended for testing)
   - To disable email confirmation:
     - Scroll to **Email Auth** section
     - Toggle off **Enable email confirmations** (for testing only!)

6. **Save Settings**
   - Click **Save** at the bottom of the page

### 2. Get Your Database Password

**IMPORTANT**: You need your database password to connect!

1. Go to **Settings** → **Database**
2. Find **Connection string** section
3. Look for **Connection pooling** or **Direct connection**
4. The password is the one you set when creating the project
5. If you forgot it:
   - Go to **Settings** → **Database** → **Database Settings**
   - You can reset the password (but this will require updating all connections)

**Your Database Connection Details:**
- **Host**: `db.okumswphgekymmgqbxwf.supabase.co`
- **Port**: `5432`
- **Database**: `postgres`
- **User**: `postgres`
- **Password**: [The password you set when creating the project]

### 3. Set Up Database Schema

1. **Go to SQL Editor**
   - Click **SQL Editor** in the left sidebar
   - Click **New query**

2. **Run Your Schema**
   - Copy the entire contents of `schema.sql` from your project
   - Paste it into the SQL Editor
   - Click **Run** (or press Ctrl/Cmd + Enter)
   - You should see: "Success. No rows returned"

3. **Verify Tables Created**
   - Go to **Table Editor** in the left sidebar
   - You should see three tables:
     - `users`
     - `telemetry_sessions`
     - `scores`

### 4. Disable Row Level Security (For Testing)

**Note**: This is for testing only. In production, you should set up proper RLS policies.

1. Go to **SQL Editor**
2. Run this SQL:
   ```sql
   ALTER TABLE users DISABLE ROW LEVEL SECURITY;
   ALTER TABLE telemetry_sessions DISABLE ROW LEVEL SECURITY;
   ALTER TABLE scores DISABLE ROW LEVEL SECURITY;
   ```

### 5. Set Environment Variables

**Option A: Use the setup script (Recommended)**
```bash
# Edit setup_supabase.sh and add your database password
# Then run:
source setup_supabase.sh
```

**Option B: Set manually**
```bash
export SUPABASE_URL="https://okumswphgekymmgqbxwf.supabase.co"
export SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rdW1zd3BoZ2VreW1tZ3FieHdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyNTQ3MjksImV4cCI6MjA3OTgzMDcyOX0.mmKJB7UPuJtChIFBYlDFMHLp9LnmfygZ64FgGEui_Pc"
export SUPABASE_SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rdW1zd3BoZ2VreW1tZ3FieHdmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDI1NDcyOSwiZXhwIjoyMDc5ODMwNzI5fQ.Yt-zdfnf72UqU0_7x-jIooRXx395Kq0d9e37dkGxGP4"
export SUPABASE_DB_HOST="db.okumswphgekymmgqbxwf.supabase.co"
export SUPABASE_DB_PORT="5432"
export SUPABASE_DB_NAME="postgres"
export SUPABASE_DB_USER="postgres"
export SUPABASE_DB_PASSWORD="YOUR_DATABASE_PASSWORD_HERE"
```

### 6. Test Your Setup

1. **Start your server**:
   ```bash
   # Make sure environment variables are set
   source setup_supabase.sh  # or set them manually
   
   # Build and run
   mkdir -p build && cd build
   cmake ..
   make
   ./GameServer
   ```

2. **Test signup endpoint**:
   ```bash
   curl -X POST http://localhost:8080/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "test123456",
       "username": "testuser",
       "school": "Test School"
     }'
   ```

3. **Check Supabase Dashboard**:
   - Go to **Authentication** → **Users**
   - You should see the new user you just created!

## Quick Checklist

- [ ] Configured Site URL in Authentication Settings
- [ ] Added Redirect URLs
- [ ] Disabled email confirmation (for testing)
- [ ] Got database password from Settings → Database
- [ ] Ran schema.sql in SQL Editor
- [ ] Verified tables are created (Table Editor)
- [ ] Disabled RLS for testing (SQL Editor)
- [ ] Set environment variables
- [ ] Tested signup endpoint

## Troubleshooting

### "Invalid API key" error
- Make sure you're using the correct anon key (not service_role key for client requests)
- Check that SUPABASE_URL doesn't have trailing slash

### "Connection refused" or database errors
- Verify your database password is correct
- Check that SUPABASE_DB_HOST is correct: `db.okumswphgekymmgqbxwf.supabase.co`
- Make sure your IP is allowed (Supabase allows all by default, but check if you have restrictions)

### "User already exists" error
- Check Supabase Dashboard → Authentication → Users
- Delete test users if needed

### Email confirmation required
- Go to Authentication → Settings
- Disable "Enable email confirmations" for testing

## Next Steps

Once authentication is working:
1. Test all your endpoints
2. Set up proper RLS policies for production
3. Configure email templates (if using email confirmation)
4. Set up additional auth providers if needed (Google, GitHub, etc.)

