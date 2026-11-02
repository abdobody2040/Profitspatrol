// @ts-nocheck
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@14.0.0?target=deno';
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
    apiVersion: '2023-10-16',
    httpClient: Stripe.createFetchHttpClient(),
});

const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

async function handleCheckoutSessionCompleted(
    session: Stripe.Checkout.Session,
    eventId: string,
    db: SupabaseClient
) {
    const userId = session.metadata?.userId;
    const planId = session.metadata?.planId;

    if (!userId || !planId) {
        console.error(JSON.stringify({ event: 'webhook_missing_metadata', sessionId: session.id }));
        throw new Error('Missing metadata');
    }

    const stripeCustomerId = session.customer as string | null;
    const isYearly = planId.includes('yearly') || planId === 'tycoon';

    const { error } = await db
        .from('profiles')
        .update({
            subscription_tier: planId,
            subscription_status: 'PREMIUM',
            billing_cycle: isYearly ? 'YEARLY' : 'MONTHLY',
            stripe_customer_id: stripeCustomerId,
            updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

    if (error) {
        console.error(JSON.stringify({ event: 'parent_update_failed', userId, error: error.message }));
        throw new Error(`Failed to update parent profile: ${error.message}`);
    }

    const { error: childError } = await db
        .from('profiles')
        .update({
            subscription_tier: planId,
            subscription_status: 'PREMIUM',
            billing_cycle: isYearly ? 'YEARLY' : 'MONTHLY',
            updated_at: new Date().toISOString(),
        })
        .eq('parent_id', userId);

    if (childError) {
        console.error(JSON.stringify({ event: 'child_update_failed', userId, error: childError.message }));
        throw new Error(`Failed to update child profiles: ${childError.message}`);
    }

    // Referral rewards are intentionally omitted here as they are not yet fully implemented.
    // Do not declare success with mock fixture insertions.

    console.log(JSON.stringify({ event: 'subscription_updated', userId, planId }));
}

async function handleSubscriptionDeleted(
    subscription: Stripe.Subscription,
    db: SupabaseClient,
    eventId: string
) {
    const userId = subscription.metadata?.userId;
    const stripeCustomerId = subscription.customer as string;

    let profileId = userId;
    if (!profileId && stripeCustomerId) {
        const { data: profileRow } = await db
            .from('profiles')
            .select('id')
            .eq('stripe_customer_id', stripeCustomerId)
            .single();
        profileId = profileRow?.id;
    }

    if (!profileId) {
        console.log(JSON.stringify({ event: 'subscription_cancelled_profile_not_found', stripeCustomerId }));
        return;
    }

    const { error } = await db
        .from('profiles')
        .update({
            subscription_tier: 'intern',
            subscription_status: 'FREE',
            updated_at: new Date().toISOString(),
        })
        .eq('id', profileId);

    if (error) {
        console.error(JSON.stringify({ event: 'cancellation_failed', error: error.message }));
        throw new Error(`Failed to cancel subscription for profile ${profileId}: ${error.message}`);
    }

    await db
        .from('profiles')
        .update({ subscription_tier: 'intern', subscription_status: 'FREE', updated_at: new Date().toISOString() })
        .eq('parent_id', profileId);

    console.log(JSON.stringify({ event: 'subscription_cancelled', userId: profileId }));
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
    const userId = invoice.metadata?.userId;
    if (userId) {
        console.log(JSON.stringify({ event: 'payment_failed', userId, invoiceId: invoice.id }));
    }
}

// Map event types to their specific handlers (OCP)
const eventHandlers: Record<string, (event: Stripe.Event, db: SupabaseClient) => Promise<void>> = {
    'checkout.session.completed': async (event, db) => {
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session, event.id, db);
    },
    'customer.subscription.deleted': async (event, db) => {
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription, db, event.id);
    },
    'invoice.payment_failed': async (event) => {
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
    }
};

serve(async (req) => {
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
        return new Response('No signature', { status: 400 });
    }

    const body = await req.text();

    try {
        const event = stripe.webhooks.constructEvent(
            body,
            signature,
            Deno.env.get('STRIPE_WEBHOOK_SECRET')!
        );

        console.log(JSON.stringify({ event: 'webhook_received', type: event.type, id: event.id }));

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

        const handler = eventHandlers[event.type];
        if (handler) {
            await handler(event, supabase);
        }

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
