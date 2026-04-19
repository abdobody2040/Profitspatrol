-- Security Events Table for Real-Time Monitoring
-- Phase 8.2: Real-Time Security Monitoring
-- Date: 2026-01-28

-- Create security_events table
CREATE TABLE IF NOT EXISTS security_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL CHECK (event_type IN (
        'prompt_injection',
        'profanity_detected',
        'pii_leak',
        'rate_limit_exceeded',
        'content_violation',
        'unauthorized_access',
        'suspicious_activity'
    )),
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    session_id TEXT,
    event_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_security_events_type 
ON security_events(event_type);

CREATE INDEX IF NOT EXISTS idx_security_events_severity 
ON security_events(severity);

CREATE INDEX IF NOT EXISTS idx_security_events_user 
ON security_events(user_id) 
WHERE user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_security_events_created 
ON security_events(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_security_events_critical 
ON security_events(severity, created_at DESC) 
WHERE severity = 'critical';

-- Enable Row Level Security
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can view security events
CREATE POLICY "Admins can view all security events"
ON security_events FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- Policy: Service role can insert events (for Edge Functions)
CREATE POLICY "Service role can insert security events"
ON security_events FOR INSERT
TO service_role
WITH CHECK (true);

-- Add table comment
COMMENT ON TABLE security_events IS 'Real-time security event logging for monitoring and alerting';
COMMENT ON COLUMN security_events.event_type IS 'Type of security event detected';
COMMENT ON COLUMN security_events.severity IS 'Severity level: low, medium, high, critical';
COMMENT ON COLUMN security_events.event_data IS 'Flexible JSONB storage for event-specific details';
COMMENT ON COLUMN security_events.session_id IS 'Browser session ID for tracking user sessions';

-- Create view for critical events (last 24 hours)
CREATE OR REPLACE VIEW critical_security_events AS
SELECT 
    id,
    event_type,
    severity,
    user_id,
    event_data,
    ip_address,
    created_at
FROM security_events
WHERE severity = 'critical'
AND created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;

-- Grant access to view for admins
GRANT SELECT ON critical_security_events TO authenticated;
