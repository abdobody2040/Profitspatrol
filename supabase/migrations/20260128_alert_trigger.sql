-- Migration: Add database trigger for security event alerts
-- Created: 2026-01-28
-- Purpose: Automatically trigger alerts for critical/high severity security events

-- Enable pg_net extension for HTTP requests (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Function to send alert via Edge Function
CREATE OR REPLACE FUNCTION notify_security_alert()
RETURNS TRIGGER AS $$
DECLARE
  payload jsonb;
  slack_webhook_url text;
BEGIN
  -- Only trigger for critical/high severity events
  IF NEW.severity IN ('critical', 'high') THEN
    
    -- Build payload
    payload := jsonb_build_object(
      'event_type', NEW.event_type,
      'severity', NEW.severity,
      'event_data', NEW.event_data,
      'user_id', NEW.user_id,
      'ip_address', NEW.ip_address,
      'created_at', NEW.created_at
    );

    -- Get Slack webhook URL from app settings
    -- Note: Set this via: ALTER DATABASE postgres SET app.slack_webhook_url = 'your_webhook_url';
    BEGIN
      slack_webhook_url := current_setting('app.slack_webhook_url', true);
    EXCEPTION
      WHEN OTHERS THEN
        slack_webhook_url := NULL;
    END;

    -- Send alert via pg_net if webhook URL is configured
    IF slack_webhook_url IS NOT NULL THEN
      PERFORM net.http_post(
        url := slack_webhook_url,
        body := payload::text,
        headers := '{"Content-Type": "application/json"}'::jsonb
      );
    END IF;

    -- Log that alert was triggered
    RAISE NOTICE 'Security alert triggered for event_type: %, severity: %', NEW.event_type, NEW.severity;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on security_events table
DROP TRIGGER IF EXISTS security_event_alert_trigger ON security_events;

CREATE TRIGGER security_event_alert_trigger
AFTER INSERT ON security_events
FOR EACH ROW
EXECUTE FUNCTION notify_security_alert();

-- Add comment
COMMENT ON FUNCTION notify_security_alert() IS 'Sends alerts for critical and high severity security events';
COMMENT ON TRIGGER security_event_alert_trigger ON security_events IS 'Triggers alerts when critical/high severity events are logged';

-- Instructions for setting Slack webhook URL:
-- Run this command in SQL Editor (replace with your actual webhook URL):
-- ALTER DATABASE postgres SET app.slack_webhook_url = 'https://hooks.slack.com/services/YOUR/WEBHOOK/URL';
