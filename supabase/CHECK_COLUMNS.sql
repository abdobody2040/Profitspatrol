-- Check the actual columns in each table
SELECT 
    table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name IN ('assignments', 'submissions', 'classrooms', 'profiles', 'security_events')
ORDER BY table_name, ordinal_position;
