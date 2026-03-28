-- Quick check: How many policies exist per table and action?
SELECT 
    tablename,
    cmd as action,
    COUNT(*) as policy_count,
    array_agg(policyname) as policies
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename, cmd
HAVING COUNT(*) > 1
ORDER BY tablename, cmd;
