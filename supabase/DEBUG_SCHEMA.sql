-- ============================================
-- DEBUG SCRIPT - Check for existing schema issues
-- ============================================

-- Check if assignments table exists and its structure
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'assignments'
ORDER BY ordinal_position;

-- Check if student_groups table exists and its structure
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'student_groups'
ORDER BY ordinal_position;

-- List all tables in public schema
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
