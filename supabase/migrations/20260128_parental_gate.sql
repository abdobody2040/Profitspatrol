-- Parental Gate Enhancement
-- Adds time-based expiry and attempt limiting for COPPA compliance

-- Add parental gate tracking columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS parental_gate_verified_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS parental_gate_attempts INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS parental_gate_locked_until TIMESTAMPTZ;

-- Index for locked accounts (for efficient queries)
CREATE INDEX IF NOT EXISTS idx_profiles_parental_gate_locked 
ON profiles(parental_gate_locked_until) 
WHERE parental_gate_locked_until IS NOT NULL;

-- Add comments for documentation
COMMENT ON COLUMN profiles.parental_gate_verified_at IS 'Last successful parental gate verification (expires after 1 hour)';
COMMENT ON COLUMN profiles.parental_gate_attempts IS 'Failed parental gate attempts (resets on success, locks after 3 failures)';
COMMENT ON COLUMN profiles.parental_gate_locked_until IS 'Account locked until this time due to failed parental gate attempts';
