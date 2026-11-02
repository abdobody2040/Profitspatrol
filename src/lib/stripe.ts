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
import { api } from './api';
import { loadStripe } from '@stripe/stripe-js';
import type { SubscriptionTier } from '../types';

// Initialize Stripe lazily (client-side publishable key is safe to expose)
let stripePromise: Promise<any> | null = null;
export const getStripe = () => {
    if (!stripePromise && typeof window !== 'undefined' && import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
        stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
    }
    return stripePromise;
};

export interface CheckoutResponse {
    success: boolean;
    error?: string;
}

/**
 * Create a secure checkout session via server-side API (Laravel / Supabase)
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

        // 1. Try Laravel Backend (active backend)
        if (api.getToken()) {
            try {
                const res: any = await api.post('/stripe/checkout-session', { planId });
                if (res?.url) {
                    Logger.info("Stripe: Redirecting to checkout via Laravel API", { url: res.url });
                    window.location.href = res.url;
                    return { success: true };
                }
                if (res?.error) {
                    return { success: false, error: res.error };
                }
            } catch (laravelErr) {
                Logger.warn("Stripe: Laravel checkout session failed, trying Supabase fallback", { error: String(laravelErr) });
            }
        }

        // 2. Fallback to Supabase if available
        if (supabase) {
            const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
            if (!authError && authUser) {
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

                if (data?.url) {
                    Logger.info("Stripe: Redirecting to checkout via Supabase", { url: data.url });
                    window.location.href = data.url;
                    return { success: true };
                }
            }
        }

        // 3. Local Development Mode Fallback: allow instant local testing without live Stripe keys
        if (import.meta.env.DEV) {
            Logger.info("Stripe: Dev mode fallback - simulating successful checkout", { planId });
            window.location.href = `/success?session_id=mock_cs_${Date.now()}&plan=${planId}`;
            return { success: true };
        }

        return {
            success: false,
            error: 'Authentication required. Please log in before subscribing.',
        };

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
 */
export const manageSubscription = async (): Promise<{ success: boolean; url?: string; error?: string }> => {
    Logger.info('Stripe: Requesting customer portal session');

    // 1. Try Laravel Backend
    if (api.getToken()) {
        try {
            const res: any = await api.post('/stripe/portal-session', {});
            if (res?.url) {
                window.location.href = res.url;
                return { success: true, url: res.url };
            }
            if (res?.error) {
                return { success: false, error: res.error };
            }
        } catch (laravelErr) {
            Logger.warn("Stripe: Laravel portal session failed, checking Supabase fallback", { error: String(laravelErr) });
        }
    }

    // 2. Fallback to Supabase
    if (supabase) {
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
        if (authUser && !authError) {
            try {
                const { data, error } = await supabase.functions.invoke('create-billing-portal-session', {
                    body: { userId: authUser.id },
                });

                if (data?.url && !error) {
                    window.location.href = data.url;
                    return { success: true, url: data.url };
                }
            } catch (err) {
                Logger.error('Stripe: Supabase portal session error', err);
            }
        }
    }

    return { success: false, error: 'Please log in to manage your subscription' };
};
