# Quick Start Guide - Supabase Setup

## ✅ What You Have
- Project URL: `https://okumswphgekymmgqbxwf.supabase.co`
- Anon Key: ✅ Set
- Service Role Key: ✅ Set

## 🔧 What You Need to Do Next

### 1. Get Your Database Password (2 minutes)
1. Go to: https://supabase.com/dashboard/project/okumswphgekymmgqbxwf/settings/database
2. Find **Connection string** section
3. Your password is the one you set when creating the project
4. Copy it (you'll need it in step 3)

### 2. Set Up Authentication in Supabase (3 minutes)

**Go to**: https://supabase.com/dashboard/project/okumswphgekymmgqbxwf/auth/settings

**Configure**:
- **Site URL**: `http://localhost:8080` (or your frontend URL)
- **Redirect URLs**: Add `http://localhost:8080/**`
- **Email confirmations**: **DISABLE** (toggle off) for instant signup during testing

Click **Save**

### 3. Run Database Schema (2 minutes)

1. Go to: https://supabase.com/dashboard/project/okumswphgekymmgqbxwf/sql/new
2. Open `schema.sql` from your project folder
3. Copy ALL the SQL code
4. Paste into SQL Editor
5. Click **Run**

### 4. Disable Row Level Security (1 minute)

In the same SQL Editor, run:
```sql
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE telemetry_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE scores DISABLE ROW LEVEL SECURITY;
```

### 5. Set Environment Variables (1 minute)

**Edit `setup_supabase.sh`**:
- Replace `YOUR_DATABASE_PASSWORD_HERE` with your actual database password (from step 1)

**Then run**:
```bash
source setup_supabase.sh
```

### 6. Build and Test (2 minutes)

```bash
mkdir -p build
cd build
cmake ..
make
./GameServer
```

In another terminal, test:
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123456","username":"testuser","school":"Test School"}'
```

### 7. Verify It Works

Check Supabase Dashboard → **Authentication** → **Users**
You should see your test user!

## 📋 Complete Checklist

- [ ] Got database password from Supabase Dashboard
- [ ] Configured Authentication Settings (Site URL, Redirect URLs)
- [ ] Disabled email confirmations (for testing)
- [ ] Ran schema.sql in SQL Editor
- [ ] Disabled RLS for all tables
- [ ] Updated setup_supabase.sh with database password
- [ ] Set environment variables (source setup_supabase.sh)
- [ ] Built and ran the server
- [ ] Tested signup endpoint
- [ ] Verified user appears in Supabase Dashboard

## 🆘 Need Help?

See `AUTHENTICATION_SETUP.md` for detailed instructions.

## 🔗 Quick Links

- **Dashboard**: https://supabase.com/dashboard/project/okumswphgekymmgqbxwf
- **Authentication Settings**: https://supabase.com/dashboard/project/okumswphgekymmgqbxwf/auth/settings
- **SQL Editor**: https://supabase.com/dashboard/project/okumswphgekymmgqbxwf/sql/new
- **Table Editor**: https://supabase.com/dashboard/project/okumswphgekymmgqbxwf/editor
- **Database Settings**: https://supabase.com/dashboard/project/okumswphgekymmgqbxwf/settings/database

