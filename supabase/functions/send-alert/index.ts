import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
serve(async (req) => {
    try {
        const { event_type, severity, event_data, created_at } = await req.json();
        // Only send alerts for critical/high severity
        if (severity !== 'critical' && severity !== 'high') {
            return new Response(JSON.stringify({ skipped: true }), {
                headers: { 'Content-Type': 'application/json' },
            });
        }
        // Send email using SendGrid/Resend/etc
        const emailResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: 'security@kidcaphq.com',
                to: 'admin@kidcaphq.com',
                subject: `🚨 ${severity.toUpperCase()} Security Alert: ${event_type}`,
                html: `
          <h2>Security Alert</h2>
          <p><strong>Severity:</strong> ${severity}</p>
          <p><strong>Event Type:</strong> ${event_type}</p>
          <p><strong>Time:</strong> ${created_at}</p>
          <p><strong>Details:</strong></p>
          <pre>${JSON.stringify(event_data, null, 2)}</pre>
        `,
            }),
        });
        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
});