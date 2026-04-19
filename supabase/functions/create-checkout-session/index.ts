import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@14.0.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
    apiVersion: '2023-10-16',
    httpClient: Stripe.createFetchHttpClient(),
});

const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SERVICE_ROLE_KEY')!
);

/**
 * Server-side pricing authority
 * This is the ONLY source of truth for pricing
 * Client cannot manipulate these values
 */
const TIER_PRICING: Record<string, { price: number; priceId: string | null }> = {
    'intern': { price: 0, priceId: null },
    'founder': { price: 999, priceId: 'price_1T0N6rGpy11OSRPTdKOfORt9' },
    'board': { price: 1499, priceId: 'price_1T0N7pGpy11OSRPTAoyzEWPR' }, // TODO: Update with new $14.99 Stripe Price ID
    'tycoon': { price: 8999, priceId: 'price_1T0N87Gpy11OSRPTjOfmf54z' }, // TODO: Update with new $89.99 (Yearly) Stripe Price ID
    'classroom': { price: 2999, priceId: 'price_classroom_monthly' },
    'teacher_solo': { price: 0, priceId: null },
    'teacher_pro': { price: 4900, priceId: 'price_teacher_pro_yearly' },
    'school_small': { price: 29900, priceId: 'price_school_small_yearly' },
    'school_medium': { price: 89900, priceId: 'price_school_medium_yearly' },
    'school_large': { price: 149900, priceId: 'price_school_large_yearly' },
};

serve(async (req) => {
    // CORS headers
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    };

    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers });
    }

    try {
        // ✅ CRITICAL FIX: Verify user authentication
        const authHeader = req.headers.get('authorization');
        
        // ✅ SECURITY FIX: Removed [DEBUG] auth header preview — it logged first 20 chars
        // of the JWT token into Supabase log drain (partial token exposure).
        if (!authHeader) {
            console.error(JSON.stringify({ event: 'checkout_unauthorized', reason: 'missing_auth_header' }));
            return new Response(
                JSON.stringify({ error: 'Unauthorized: Missing authorization header' }),
                { status: 401, headers }
            );
        }

        // Extract JWT token
        const token = authHeader.replace('Bearer ', '');
        console.log('[DEBUG] Token extracted, length:', token.length);

        // Verify token with Supabase Auth
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !authUser) {
            console.error(JSON.stringify({ event: 'checkout_auth_failed', reason: authError?.message || 'no_user' }));
            return new Response(
                JSON.stringify({ error: 'Unauthorized: Invalid token' }),
                { status: 401, headers }
            );
        }
        
        console.log(JSON.stringify({ event: 'checkout_auth_ok' }));

        const { planId, userId } = await req.json();

        // Validate required fields
        if (!planId || !userId) {
            return new Response(
                JSON.stringify({ error: 'Missing required fields: planId, userId' }),
                { status: 400, headers }
            );
        }

        // ✅ CRITICAL FIX: Ensure userId matches authenticated user
        if (userId !== authUser.id) {
            console.error(JSON.stringify({ event: 'checkout_userid_mismatch' })); // No IDs in logs
            return new Response(
                JSON.stringify({ error: 'Forbidden: User ID mismatch' }),
                { status: 403, headers }
            );
        }

        // Validate plan exists
        if (!TIER_PRICING[planId]) {
            return new Response(
                JSON.stringify({ error: 'Invalid plan ID' }),
                { status: 400, headers }
            );
        }

        const plan = TIER_PRICING[planId];

        // Free tier - no checkout needed
        if (plan.price === 0) {
            return new Response(
                JSON.stringify({ error: 'Free tier does not require checkout' }),
                { status: 400, headers }
            );
        }

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: plan.priceId!,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}&plan=${planId}`,
            cancel_url: `${req.headers.get('origin')}/pricing`,
            client_reference_id: userId,
            metadata: {
                userId,
                planId,
                price: plan.price.toString(),
            },
        });

        console.log(JSON.stringify({ event: 'checkout_session_created', planId, sessionId: session.id }));
        // Note: userId deliberately omitted from log to reduce PII surface

        return new Response(
            JSON.stringify({
                sessionId: session.id,
                url: session.url
            }),
            { headers }
        );
    } catch (error) {
        console.error('Checkout session creation failed:', error);
        return new Response(
            JSON.stringify({
                error: error instanceof Error ? error.message : 'Internal server error'
            }),
            { status: 500, headers }
        );
    }
});
