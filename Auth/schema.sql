-- 1. Users Table
-- Note: With Supabase Auth, password is handled by auth.users table
-- This table stores additional user metadata
CREATE TABLE users (
    uid UUID PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    -- hashed_password removed - Supabase Auth handles this in auth.users
    school_name VARCHAR(100),
    is_active BOOLEAN DEFAULT FALSE,
    auth_token VARCHAR(64), -- Session token for game access
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Link to Supabase auth.users if you want to reference it
-- ALTER TABLE users ADD CONSTRAINT users_email_fkey 
--   FOREIGN KEY (email) REFERENCES auth.users(email);

-- 2. Telemetry (Big Data) Table
CREATE TABLE telemetry_sessions (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(uid),
    session_id VARCHAR(64),
    level_id VARCHAR(32),
    total_questions INT,
    wrong_answers INT,
    scene_runs INT,
    time_zone_3d FLOAT,
    time_training_2d FLOAT,
    timestamp_start VARCHAR(64),
    timestamp_end VARCHAR(64),
    hint_used BOOLEAN,
    final_score INT
);

-- 3. Scores (Leaderboard) Table
CREATE TABLE scores (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(uid),
    level_id VARCHAR(32),
    score INT,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
