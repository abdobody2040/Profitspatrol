-- Migration: Add whitelist/blacklist tables and review tracking
-- Purpose: Enable manual review and whitelist/blacklist management for content moderation

-- Whitelist table for approved content patterns
CREATE TABLE IF NOT EXISTS moderation_whitelist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pattern TEXT NOT NULL UNIQUE,
    pattern_type TEXT NOT NULL CHECK (pattern_type IN ('exact', 'regex', 'keyword')),
    reason TEXT,
    added_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blacklist table for explicitly banned content
CREATE TABLE IF NOT EXISTS moderation_blacklist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pattern TEXT NOT NULL UNIQUE,
    pattern_type TEXT NOT NULL CHECK (pattern_type IN ('exact', 'regex', 'keyword')),
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    reason TEXT,
    added_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add review tracking columns to moderated_content
ALTER TABLE moderated_content ADD COLUMN IF NOT EXISTS review_status TEXT DEFAULT 'pending' 
    CHECK (review_status IN ('pending', 'reviewed', 'approved', 'rejected', 'false_positive'));
ALTER TABLE moderated_content ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES auth.users(id);
ALTER TABLE moderated_content ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;
ALTER TABLE moderated_content ADD COLUMN IF NOT EXISTS review_notes TEXT;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_moderation_whitelist_pattern ON moderation_whitelist(pattern);
CREATE INDEX IF NOT EXISTS idx_moderation_blacklist_pattern ON moderation_blacklist(pattern);
CREATE INDEX IF NOT EXISTS idx_moderated_content_review_status ON moderated_content(review_status);

-- Enable RLS
ALTER TABLE moderation_whitelist ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_blacklist ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Admins can manage whitelist
CREATE POLICY "Admins can manage whitelist"
ON moderation_whitelist FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- RLS Policy: Admins can manage blacklist
CREATE POLICY "Admins can manage blacklist"
ON moderation_blacklist FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Add comments
COMMENT ON TABLE moderation_whitelist IS 'Approved content patterns that bypass moderation';
COMMENT ON TABLE moderation_blacklist IS 'Explicitly banned content patterns with severity levels';
COMMENT ON COLUMN moderated_content.review_status IS 'Manual review status by admin';
COMMENT ON COLUMN moderated_content.reviewed_by IS 'Admin user who reviewed this content';
COMMENT ON COLUMN moderated_content.reviewed_at IS 'Timestamp of manual review';
COMMENT ON COLUMN moderated_content.review_notes IS 'Admin notes from manual review';
