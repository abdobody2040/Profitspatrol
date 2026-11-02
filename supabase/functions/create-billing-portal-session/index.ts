// @ts-nocheck
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@14.0.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
    apiVersion: '2023-10-16',
    httpClient: Stripe.createFetchHttpClient(),
});

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

    if (req.method === 'OPTIONS') return new Response('ok', { headers });

    // Verify auth
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !authUser) {
        return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401, headers });
    }

    try {
        const { userId } = await req.json();

        // Security: user can only open portal for themselves
        if (userId !== authUser.id) {
            return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
        }

        // Look up Stripe customer ID stored during checkout
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('stripe_customer_id')
            .eq('id', authUser.id)
            .single();

        if (profileError || !profile?.stripe_customer_id) {
            console.error(JSON.stringify({ event: 'portal_no_customer', userId: authUser.id }));
            return new Response(
                JSON.stringify({ error: 'No active subscription found. Please subscribe first.' }),
                { status: 404, headers }
            );
        }

        // Create a scoped billing portal session (NOT the global dashboard)
        const session = await stripe.billingPortal.sessions.create({
            customer: profile.stripe_customer_id,
            return_url: `${req.headers.get('origin') || 'https://profitspatrol.com'}/dashboard`,
        });

        console.log(JSON.stringify({ event: 'billing_portal_created', userId: authUser.id }));

        return new Response(JSON.stringify({ url: session.url }), { headers });

    } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        console.error(JSON.stringify({ event: 'billing_portal_error', error: msg }));
        return new Response(
            JSON.stringify({ error: 'Failed to open subscription management.' }),
            { status: 500, headers }
        );
    }
});
