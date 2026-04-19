import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

interface SecurityEvent {
    event_type: 'prompt_injection' | 'profanity_detected' | 'pii_leak' | 'rate_limit_exceeded' | 'content_violation' | 'unauthorized_access' | 'suspicious_activity';
    severity: 'low' | 'medium' | 'high' | 'critical';
    user_id?: string;
    session_id?: string;
    event_data: Record<string, any>;
}

serve(async (req) => {
    // CORS headers
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    };

    // Handle OPTIONS request for CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { event_type, severity, user_id, session_id, event_data }: SecurityEvent = await req.json();

        // Validate required fields
        if (!event_type || !severity) {
            return new Response(
                JSON.stringify({ error: 'Missing required fields: event_type and severity' }),
                {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            );
        }

        // Validate event_type enum
        const validEventTypes = ['prompt_injection', 'profanity_detected', 'pii_leak', 'rate_limit_exceeded', 'content_violation', 'unauthorized_access', 'suspicious_activity'];
        if (!validEventTypes.includes(event_type)) {
            return new Response(
                JSON.stringify({ error: `Invalid event_type. Must be one of: ${validEventTypes.join(', ')}` }),
                {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            );
        }

        // Validate severity enum
        const validSeverities = ['low', 'medium', 'high', 'critical'];
        if (!validSeverities.includes(severity)) {
            return new Response(
                JSON.stringify({ error: `Invalid severity. Must be one of: ${validSeverities.join(', ')}` }),
                {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            );
        }

        // Get client info from headers
        const ip_address = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
        const user_agent = req.headers.get('user-agent') || 'unknown';

        // Insert security event
        const { data, error } = await supabase
            .from('security_events')
            .insert({
                event_type,
                severity,
                user_id: user_id || null,
                session_id: session_id || null,
                event_data: event_data || {},
                ip_address,
                user_agent,
            })
            .select()
            .single();

        if (error) {
            console.error('Database error:', error);
            throw error;
        }

        // Send alert for critical events
        if (severity === 'critical') {
            await sendCriticalAlert(event_type, event_data, user_id, ip_address);
        }

        return new Response(
            JSON.stringify({
                success: true,
                event_id: data.id,
                message: 'Security event logged successfully'
            }),
            {
                status: 200,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        );
    } catch (error: any) {
        console.error('Error logging security event:', error);
        return new Response(
            JSON.stringify({
                error: 'Internal server error',
                message: error.message
            }),
            {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        );
    }
});

/**
 * Send alert for critical security events
 * TODO: Integrate with email/Slack/Discord
 */
async function sendCriticalAlert(
    event_type: string,
    event_data: any,
    user_id?: string,
    ip_address?: string
) {
    console.log('🚨 CRITICAL SECURITY EVENT DETECTED 🚨');
    console.log('Event Type:', event_type);
    console.log('User ID:', user_id || 'Anonymous');
    console.log('IP Address:', ip_address || 'Unknown');
    console.log('Event Data:', JSON.stringify(event_data, null, 2));
    console.log('Timestamp:', new Date().toISOString());

    // TODO: Implement actual alerting
    // Examples:
    // - Send email via SendGrid/Resend
    // - Post to Slack webhook
    // - Send Discord notification
    // - Trigger PagerDuty incident
}
