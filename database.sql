-- Complete Database Schema for Math Problem Generator
-- Run this in Supabase SQL Editor for a fresh setup

-- Drop existing tables if you want a fresh start (CAUTION: This deletes all data)
-- Uncomment the lines below only if you want to reset everything
-- DROP TABLE IF EXISTS math_problem_submissions CASCADE;
-- DROP TABLE IF EXISTS math_problem_sessions CASCADE;
-- DROP TABLE IF EXISTS user_stats CASCADE;

-- Create math_problem_sessions table with enhanced features
CREATE TABLE IF NOT EXISTS math_problem_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    problem_text TEXT NOT NULL,
    correct_answer NUMERIC NOT NULL,
    difficulty VARCHAR(20) DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
    problem_type VARCHAR(50) DEFAULT 'general' CHECK (problem_type IN ('addition', 'subtraction', 'multiplication', 'division', 'mixed', 'general')),
    hint_text TEXT,
    solution_steps JSONB,
    user_id TEXT DEFAULT 'anonymous'
);

-- Create math_problem_submissions table with enhanced features
CREATE TABLE IF NOT EXISTS math_problem_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID NOT NULL REFERENCES math_problem_sessions(id) ON DELETE CASCADE,
    user_answer NUMERIC NOT NULL,
    is_correct BOOLEAN NOT NULL,
    feedback_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    time_spent_seconds INTEGER,
    hints_used INTEGER DEFAULT 0
);

-- Create user_stats table for score tracking
CREATE TABLE IF NOT EXISTS user_stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL UNIQUE,
    total_problems INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    total_score INTEGER DEFAULT 0,
    streak INTEGER DEFAULT 0,
    best_streak INTEGER DEFAULT 0,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    difficulty_stats JSONB DEFAULT '{"easy": {"total": 0, "correct": 0}, "medium": {"total": 0, "correct": 0}, "hard": {"total": 0, "correct": 0}}'::jsonb,
    type_stats JSONB DEFAULT '{"addition": 0, "subtraction": 0, "multiplication": 0, "division": 0, "mixed": 0, "general": 0}'::jsonb
);

-- Enable Row Level Security
ALTER TABLE math_problem_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE math_problem_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow anonymous access to math_problem_sessions" ON math_problem_sessions;
DROP POLICY IF EXISTS "Allow anonymous access to math_problem_submissions" ON math_problem_submissions;
DROP POLICY IF EXISTS "Allow anonymous access to user_stats" ON user_stats;

-- Create permissive policies for anonymous access (for assessment purposes)
-- In production, you would want more restrictive policies based on user authentication

CREATE POLICY "Allow anonymous access to math_problem_sessions" ON math_problem_sessions
    FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow anonymous access to math_problem_submissions" ON math_problem_submissions
    FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow anonymous access to user_stats" ON user_stats
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_math_problem_submissions_session_id ON math_problem_submissions(session_id);
CREATE INDEX IF NOT EXISTS idx_math_problem_sessions_created_at ON math_problem_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_math_problem_sessions_user_id ON math_problem_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_math_problem_sessions_difficulty ON math_problem_sessions(difficulty);
CREATE INDEX IF NOT EXISTS idx_math_problem_sessions_type ON math_problem_sessions(problem_type);
CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON user_stats(user_id);

-- Verification (optional - uncomment to check your setup)
-- SELECT 'math_problem_sessions' as table_name, COUNT(*) as row_count FROM math_problem_sessions
-- UNION ALL
-- SELECT 'math_problem_submissions', COUNT(*) FROM math_problem_submissions
-- UNION ALL
-- SELECT 'user_stats', COUNT(*) FROM user_stats;