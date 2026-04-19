-- Migration: Create moderated_content table for logging content moderation events
-- Purpose: Track all content moderation violations for compliance and monitoring

-- Create moderated_content table
CREATE TABLE IF NOT EXISTS moderated_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_type TEXT NOT NULL CHECK (content_type IN ('ai_response', 'user_input', 'chat_message', 'project_submission', 'debate_argument')),
    original_content TEXT NOT NULL,
    sanitized_content TEXT,
    violations JSONB NOT NULL DEFAULT '[]'::jsonb,
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    allowed BOOLEAN NOT NULL DEFAULT true,
    confidence DECIMAL(3,2) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id TEXT,
    context JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_moderated_content_severity ON moderated_content(severity);
CREATE INDEX IF NOT EXISTS idx_moderated_content_allowed ON moderated_content(allowed);
CREATE INDEX IF NOT EXISTS idx_moderated_content_created_at ON moderated_content(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_moderated_content_user_id ON moderated_content(user_id);
CREATE INDEX IF NOT EXISTS idx_moderated_content_content_type ON moderated_content(content_type);

-- Enable Row Level Security
ALTER TABLE moderated_content ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Admins can view all moderated content
CREATE POLICY "Admins can view all moderated content"
ON moderated_content
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- RLS Policy: Service role can insert moderation events
CREATE POLICY "Service role can insert moderation events"
ON moderated_content
FOR INSERT
WITH CHECK (auth.jwt()->>'role' = 'service_role' OR auth.uid() IS NOT NULL);

-- RLS Policy: Users can view their own moderated content
CREATE POLICY "Users can view their own moderated content"
ON moderated_content
FOR SELECT
USING (user_id = auth.uid());

-- Add comment to table
COMMENT ON TABLE moderated_content IS 'Stores content moderation events for compliance and security monitoring';

-- Add comments to columns
COMMENT ON COLUMN moderated_content.content_type IS 'Type of content being moderated';
COMMENT ON COLUMN moderated_content.violations IS 'Array of violation objects with type, detected text, severity, and confidence';
COMMENT ON COLUMN moderated_content.severity IS 'Overall severity level of all violations';
COMMENT ON COLUMN moderated_content.allowed IS 'Whether the content was allowed to be displayed';
COMMENT ON COLUMN moderated_content.confidence IS 'Average confidence score of all violations (0.00 to 1.00)';
COMMENT ON COLUMN moderated_content.context IS 'Additional context like user age, feature name, etc.';
