-- Webhook Events Table for Idempotency
-- Tracks processed Stripe webhook events to prevent duplicate processing

CREATE TABLE IF NOT EXISTS webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stripe_event_id TEXT UNIQUE NOT NULL,
    event_type TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('processed', 'failed')),
    error_message TEXT,
    processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast lookups by Stripe event ID
CREATE INDEX IF NOT EXISTS idx_webhook_events_stripe_id ON webhook_events(stripe_event_id);

-- Index for monitoring failed events
CREATE INDEX IF NOT EXISTS idx_webhook_events_status ON webhook_events(status) WHERE status = 'failed';

-- Add comment
COMMENT ON TABLE webhook_events IS 'Tracks processed Stripe webhook events for idempotency';
COMMENT ON COLUMN webhook_events.stripe_event_id IS 'Unique Stripe event ID (evt_...)';
COMMENT ON COLUMN webhook_events.status IS 'Processing status: processed or failed';
COMMENT ON COLUMN webhook_events.error_message IS 'Error message if status is failed';
