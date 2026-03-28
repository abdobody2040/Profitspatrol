-- Account Deletion Grace Period
-- Implements 30-day soft delete with audit trail for GDPR compliance

-- Add deletion tracking columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS deletion_requested_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS deletion_scheduled_for TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS deletion_reason TEXT;

-- Create audit log table for account deletions
CREATE TABLE IF NOT EXISTS account_deletion_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id),
    requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    scheduled_for TIMESTAMPTZ NOT NULL,
    cancelled_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    reason TEXT,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for scheduled deletions (for cleanup jobs)
CREATE INDEX IF NOT EXISTS idx_profiles_deletion_scheduled 
ON profiles(deletion_scheduled_for) 
WHERE deletion_scheduled_for IS NOT NULL;

-- Index for audit log queries
CREATE INDEX IF NOT EXISTS idx_deletion_log_user 
ON account_deletion_log(user_id);

CREATE INDEX IF NOT EXISTS idx_deletion_log_scheduled 
ON account_deletion_log(scheduled_for) 
WHERE completed_at IS NULL;

-- Add comments for documentation
COMMENT ON TABLE account_deletion_log IS 'Audit trail for account deletion requests (GDPR compliance)';
COMMENT ON COLUMN profiles.deletion_requested_at IS 'When user requested account deletion';
COMMENT ON COLUMN profiles.deletion_scheduled_for IS 'When account will be permanently deleted (30 days after request)';
COMMENT ON COLUMN profiles.deletion_reason IS 'User-provided reason for deletion';
