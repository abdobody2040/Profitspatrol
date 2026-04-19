/**
 * Secure Stripe Service
 * 
 * ✅ SECURITY: Pricing is controlled server-side via Supabase Edge Functions
 * ✅ SECURITY: Webhook signature validation prevents fake payment events
 * 
 * This service communicates with Supabase Edge Functions which handle:
 * - Server-side pricing authority (prevents client manipulation)
 * - Stripe checkout session creation
 * - Webhook signature verification
 */

import { Logger } from '../services/logger';
import { supabase } from './supabase';
import { loadStripe } from '@stripe/stripe-js';
import type { SubscriptionTier } from '../types';

// Initialize Stripe (client-side publishable key is safe to expose)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export interface CheckoutResponse {
    success: boolean;
    error?: string;
}

/**
 * Create a secure checkout session via server-side Edge Function
 * 
 * ✅ SECURE: Pricing is determined server-side, not client-side
 * ✅ SECURE: Client only sends planId, server looks up price
 * 
 * @param planId - Subscription tier ID
 * @param userId - User ID for tracking
 */
export const createCheckoutSession = async (
    planId: SubscriptionTier,
    userId: string
): Promise<CheckoutResponse> => {
    try {
        Logger.info("Stripe: Creating checkout session", { planId, userId });

        // Get Supabase client
        if (!supabase) {
            Logger.error("Stripe: Supabase client not initialized");
            return {
                success: false,
                error: 'Database connection not available',
            };
        }

        // Check Auth Session
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
        if (authError || !authUser) {
            Logger.error("Stripe: User not authenticated in Supabase", authError);
            return {
                success: false,
                error: 'User not authenticated. Please log in again.',
            };
        }

        if (authUser.id !== userId) {
            Logger.error("Stripe: User ID mismatch", { storeUserId: userId, authUserId: authUser.id });
            return {
                success: false,
                error: 'Session mismatch. Please refresh the page.',
            };
        }

        // Call Supabase Edge Function (server-side pricing authority)
        const { data, error } = await supabase.functions.invoke('create-checkout-session', {
            body: { planId, userId },
        });

        if (error) {
            Logger.error("Stripe: Checkout session creation failed", error);
            return {
                success: false,
                error: error.message || 'Failed to create checkout session',
            };
        }

        if (!data?.url) {
            Logger.error("Stripe: No checkout URL returned");
            return {
                success: false,
                error: 'No checkout URL returned from server',
            };
        }

        // ✅ CRITICAL FIX: Use modern redirect approach (not deprecated redirectToCheckout)
        // Stripe now recommends using the session URL directly
        Logger.info("Stripe: Redirecting to checkout", { url: data.url });
        window.location.href = data.url;

        return { success: true };

    } catch (error) {
        Logger.error("Stripe: Unexpected error", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unexpected error',
        };
    }
};

/**
 * Open Stripe Customer Portal for subscription management.
 *
 * ✅ SECURITY FIX: No longer returns a raw Stripe dashboard URL.
 * Calls a Supabase Edge Function that creates a per-user Billing Portal session
 * and returns a session-scoped URL — not the global Stripe dashboard.
 *
 * TODO: Implement the `create-billing-portal-session` Edge Function:
 *   - Input: { userId }
 *   - Output: { url: string } (Stripe Billing Portal URL for that customer)
 *   - Requires: STRIPE_SECRET_KEY + stripe.billingPortal.sessions.create()
 */
export const manageSubscription = async (): Promise<{ success: boolean; url?: string; error?: string }> => {
    Logger.info('Stripe: Requesting customer portal session');

    if (!supabase) {
        return { success: false, error: 'Database connection not available' };
    }

    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    if (authError || !authUser) {
        return { success: false, error: 'Please log in to manage your subscription' };
    }

    try {
        const { data, error } = await supabase.functions.invoke('create-billing-portal-session', {
            body: { userId: authUser.id },
        });

        if (error || !data?.url) {
            Logger.error('Stripe: Customer portal session creation failed', error);
            return { success: false, error: 'Unable to open subscription management. Please try again.' };
        }

        window.location.href = data.url;
        return { success: true, url: data.url };
    } catch (err) {
        Logger.error('Stripe: Unexpected error opening customer portal', err);
        return { success: false, error: 'Unexpected error. Please contact support.' };
    }
};
