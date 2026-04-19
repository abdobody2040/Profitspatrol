import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

interface AlertPayload {
    event_type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    event_data: Record<string, any>;
    user_id?: string;
    ip_address?: string;
    created_at: string;
}

serve(async (req) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response(null, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
        });
    }

    try {
        const payload: AlertPayload = await req.json();
        const { event_type, severity, event_data, user_id, ip_address, created_at } = payload;

        // Only send alerts for critical and high severity events
        if (severity !== 'critical' && severity !== 'high') {
            return new Response(JSON.stringify({ skipped: true, reason: 'Severity not critical/high' }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Get Slack webhook URL from environment
        const slackWebhookUrl = Deno.env.get('SLACK_WEBHOOK_URL');

        if (!slackWebhookUrl) {
            console.error('SLACK_WEBHOOK_URL not configured');
            return new Response(JSON.stringify({ error: 'Slack webhook not configured' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Determine color based on severity
        const color = severity === 'critical' ? '#dc2626' : '#ea580c';
        const emoji = severity === 'critical' ? '🚨' : '⚠️';

        // Format event type for display
        const eventTypeDisplay = event_type
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        // Create Slack message
        const slackMessage = {
            text: `${emoji} ${severity.toUpperCase()} Security Alert`,
            attachments: [{
                color,
                title: `${eventTypeDisplay}`,
                fields: [
                    {
                        title: 'Severity',
                        value: severity.toUpperCase(),
                        short: true,
                    },
                    {
                        title: 'Event Type',
                        value: eventTypeDisplay,
                        short: true,
                    },
                    {
                        title: 'User ID',
                        value: user_id ? `\`${user_id.slice(0, 8)}...\`` : 'Anonymous',
                        short: true,
                    },
                    {
                        title: 'IP Address',
                        value: ip_address || 'Unknown',
                        short: true,
                    },
                    {
                        title: 'Timestamp',
                        value: new Date(created_at).toLocaleString('en-US', {
                            dateStyle: 'medium',
                            timeStyle: 'medium',
                        }),
                        short: false,
                    },
                    {
                        title: 'Event Details',
                        value: `\`\`\`${JSON.stringify(event_data, null, 2)}\`\`\``,
                        short: false,
                    },
                ],
                footer: 'KidCapHQ Security Monitoring',
                footer_icon: 'https://platform.slack-edge.com/img/default_application_icon.png',
                ts: Math.floor(new Date(created_at).getTime() / 1000),
            }],
        };

        // Send to Slack
        const slackResponse = await fetch(slackWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(slackMessage),
        });

        if (!slackResponse.ok) {
            const errorText = await slackResponse.text();
            console.error('Slack API error:', errorText);
            return new Response(JSON.stringify({
                error: 'Failed to send Slack notification',
                details: errorText
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify({
            success: true,
            message: 'Slack alert sent successfully',
            severity,
            event_type,
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });

    } catch (error) {
        console.error('Error in slack-alert function:', error);
        return new Response(JSON.stringify({
            error: error.message || 'Unknown error occurred'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
});
