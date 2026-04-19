-- Fix: Add RLS policies for security_events table
-- This allows admins to view security events in the dashboard

BEGIN;

-- Ensure RLS is enabled
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies (if any)
DROP POLICY IF EXISTS "Admins can view all security events" ON security_events;
DROP POLICY IF EXISTS "Service role can manage security events" ON security_events;
DROP POLICY IF EXISTS "Authenticated users can view security events" ON security_events;

-- Policy 1: Admins can view all events
CREATE POLICY "Admins can view all security events"
ON security_events
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- Policy 2: Service role (Edge Functions) can insert/update
CREATE POLICY "Service role can manage security events"
ON security_events
FOR ALL
USING (auth.jwt()->>'role' = 'service_role')
WITH CHECK (auth.jwt()->>'role' = 'service_role');

COMMIT;

-- Verify policies were created
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'security_events';
