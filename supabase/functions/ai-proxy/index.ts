// @ts-nocheck
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

serve(async (req) => {
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    };

    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers });
    }

    try {
        const authHeader = req.headers.get('authorization');
        if (!authHeader) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });
        }

        const token = authHeader.replace('Bearer ', '');
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !authUser) {
            return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401, headers });
        }

        // Fetch user profile to check AI access
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role, subscription_tier')
            .eq('id', authUser.id)
            .single();

        if (profileError || !profile) {
            return new Response(JSON.stringify({ error: 'Profile not found' }), { status: 404, headers });
        }

        const hasAccess = profile.role === 'ADMIN' || profile.subscription_tier === 'tycoon';
        if (!hasAccess) {
            return new Response(JSON.stringify({ error: 'Upgrade to Tycoon for AI access' }), { status: 403, headers });
        }

        const { provider, method, body } = await req.json();

        let response;
        if (provider === 'openrouter') {
            const apiKey = Deno.env.get('OPENROUTER_API_KEY');
            if (!apiKey) throw new Error('OPENROUTER_API_KEY not set');

            response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                    'HTTP-Referer': 'https://profitspatrol.com',
                    'X-Title': 'Profits Patrol'
                },
                body: JSON.stringify(body)
            });
        } else if (provider === 'gemini') {
            const apiKey = Deno.env.get('GEMINI_API_KEY');
            if (!apiKey) throw new Error('GEMINI_API_KEY not set');

            // Gemini API uses a different structure, we might need to adapt the body
            // or just proxy the whole request if the client sends it correctly.
            // For now, let's assume the client sends the Gemini-compatible body.
            const model = body.model || 'gemini-1.5-flash';
            response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
        } else {
            return new Response(JSON.stringify({ error: 'Invalid provider' }), { status: 400, headers });
        }

        const data = await response.json();
        return new Response(JSON.stringify(data), { status: response.status, headers });

    } catch (error) {
        console.error('AI Proxy failed:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers });
    }
});
