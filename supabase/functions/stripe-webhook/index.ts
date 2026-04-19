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
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
        return new Response('No signature', { status: 400 });
    }

    const body = await req.text();

    try {
        // ✅ CRITICAL: Verify webhook signature
        // This prevents attackers from sending fake webhook events
        const event = stripe.webhooks.constructEvent(
            body,
            signature,
            Deno.env.get('STRIPE_WEBHOOK_SECRET')!
        );

        console.log(JSON.stringify({ event: 'webhook_received', type: event.type, id: event.id }));

        // ✅ CRITICAL FIX: Idempotency check
        // Stripe may send duplicate webhooks - prevent duplicate processing
        const { data: existingEvent } = await supabase
            .from('webhook_events')
            .select('id')
            .eq('stripe_event_id', event.id)
            .single();

        if (existingEvent) {
            console.log(JSON.stringify({ event: 'webhook_duplicate', id: event.id }));
            return new Response(JSON.stringify({ received: true, duplicate: true }), {
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Handle successful payment
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session;
            const userId = session.metadata?.userId;
            const planId = session.metadata?.planId;

            if (!userId || !planId) {
                console.error(JSON.stringify({ event: 'webhook_missing_metadata', sessionId: session.id }));
                return new Response('Missing metadata', { status: 400 });
            }

            // Update user subscription in database
            const { error } = await supabase
                .from('profiles')
                .update({
                    subscription_tier: planId,
                    subscription_status: 'PREMIUM',
                    billing_cycle: planId.includes('yearly') || planId === 'tycoon' ? 'YEARLY' : 'MONTHLY',
                    updated_at: new Date().toISOString(),
                })
                .eq('id', userId);

            if (!error) {
                // ✅ CRITICAL FIX: Upgrade linked child accounts as well
                const { error: childError } = await supabase
                    .from('profiles')
                    .update({
                        subscription_tier: planId,
                        subscription_status: 'PREMIUM',
                        billing_cycle: planId.includes('yearly') || planId === 'tycoon' ? 'YEARLY' : 'MONTHLY',
                        updated_at: new Date().toISOString(),
                    })
                    .eq('parent_id', userId);

                if (childError) {
                    console.error(JSON.stringify({ event: 'child_update_failed', userId, error: childError.message }));
                    // Non-fatal, we continue
                }
                
                // ✅ ADDITION: Process Referral Reward (Parent gets 1 Free Month)
                try {
                    // 1. Find if this upgrading user was referred by anyone
                    const { data: upgradingUser } = await supabase
                        .from('profiles')
                        .select('referred_by')
                        .eq('id', userId)
                        .single();

                    if (upgradingUser?.referred_by) {
                        const referrerId = upgradingUser.referred_by;
                        
                        // 2. We need to actually apply this in Stripe ideally, or via an internal credit system.
                        // For the Beta, we'll log it and grant them a "Credit" in a new metadata field or update their status.
                        // Simplest MVP: Extend their subscription by 30 days if they are already premium,
                        // OR just log it to a `referral_rewards` table for admin processing if extending via Stripe API is too complex right now.
                        
                        // Log the referral reward to be processed
                        console.log(JSON.stringify({ event: 'referral_reward_earned', referrerId, referredId: userId }));
                        
                        // Log the reward to be processed (could be a separate table or just webhook_events for now)
                        await supabase.from('webhook_events').insert({
                            stripe_event_id: `ref_reward_${event.id}`,
                            event_type: 'referral.reward.earned',
                            status: 'processed',
                            error_message: `Referrer: ${referrerId}, Referred: ${userId}`,
                            processed_at: new Date().toISOString(),
                        });
                        
                        // Optional: You could write an RPC here to automatically credit their account if you had an internal ledger.
                    }
                } catch (refError) {
                    const msg = refError instanceof Error ? refError.message : String(refError);
                    console.error(JSON.stringify({ event: 'referral_reward_failed', error: msg }));
                }

            } else {
                console.error(JSON.stringify({ event: 'parent_update_failed', userId, error: error.message }));
            }

            console.log(JSON.stringify({ event: 'subscription_updated', userId, planId }));
        }

        // Handle subscription cancellation
        if (event.type === 'customer.subscription.deleted') {
            const subscription = event.data.object as Stripe.Subscription;
            const userId = subscription.metadata?.userId;

            if (userId) {
                const { error } = await supabase
                    .from('profiles')
                    .update({
                        subscription_tier: 'intern',
                        subscription_status: 'FREE',
                        updated_at: new Date().toISOString(),
                    })
                    .eq('id', userId);

                if (error) {
                    console.error(JSON.stringify({ event: 'cancellation_failed', userId, error: error.message }));
                    // Record failed event
                    await supabase.from('webhook_events').insert({
                        stripe_event_id: event.id,
                        event_type: event.type,
                        status: 'failed',
                        error_message: error.message,
                        processed_at: new Date().toISOString(),
                    });
                }

                console.log(JSON.stringify({ event: 'subscription_cancelled', userId }));
            }
        }

        // Handle payment failure
        if (event.type === 'invoice.payment_failed') {
            const invoice = event.data.object as Stripe.Invoice;
            const userId = invoice.metadata?.userId;

            if (userId) {
                // Log payment failure for monitoring
                console.log(JSON.stringify({ event: 'payment_failed', userId, invoiceId: invoice.id }));
                // TODO: Notify user via email
            }
        }

        // ✅ Record successfully processed event
        await supabase.from('webhook_events').insert({
            stripe_event_id: event.id,
            event_type: event.type,
            status: 'processed',
            processed_at: new Date().toISOString(),
        });

        return new Response(JSON.stringify({ received: true }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        console.error(JSON.stringify({ event: 'webhook_error', error: msg }));
        return new Response(`Webhook Error: ${msg}`, { status: 400 });
    }
});
