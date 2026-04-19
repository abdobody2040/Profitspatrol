import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createCheckoutSession } from '../../../lib/stripe';
import { SUBSCRIPTION_PLANS, useAppStore } from '../../../store';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Logger } from '../../../services/logger';

/**
 * Secure Checkout Page
 * 
 * ✅ SECURITY: Uses server-side pricing via Supabase Edge Functions
 * ✅ SECURITY: Client cannot manipulate payment amounts
 * 
 * Flow:
 * 1. User selects plan
 * 2. Client calls Edge Function with planId only
 * 3. Server looks up price and creates Stripe session
 * 4. User redirects to Stripe Checkout
 */
const CheckoutPage = () => {
    const { planId } = useParams();
    const navigate = useNavigate();
    const { user } = useAppStore();

    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);

    useEffect(() => {
        if (!plan) {
            Logger.warn('Invalid plan ID in checkout', { planId });
            navigate('/pricing');
            return;
        }

        if (!user) {
            Logger.warn('User not authenticated for checkout');
            navigate('/auth');
            return;
        }

        // Auto-initiate checkout
        handleCheckout();
    }, [plan, user, navigate]);

    const handleCheckout = async () => {
        if (!plan || !user) return;

        setIsProcessing(true);
        setError(null);

        try {
            Logger.info('Initiating secure checkout', { planId: plan.id, userId: user.id });

            // ✅ SECURE: Call server-side Edge Function
            // Server controls pricing, client only sends planId
            const result = await createCheckoutSession(plan.id, user.id);

            if (!result.success) {
                throw new Error(result.error || 'Checkout failed');
            }

            // User will be redirected to Stripe Checkout
            // If we reach here, something went wrong with redirect
            Logger.warn('Checkout redirect did not occur');

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unexpected error';
            Logger.error('Checkout failed', err);
            setError(errorMessage);
            setIsProcessing(false);
        }
    };

    if (!plan) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-gray-800 mb-2">
                        Secure Checkout
                    </h1>
                    <p className="text-gray-600">
                        Upgrading to <span className="font-bold text-blue-600">{plan.name}</span>
                    </p>
                </div>

                {/* Plan Summary */}
                <div className="bg-blue-50 rounded-xl p-6 mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700 font-semibold">Plan:</span>
                        <span className="text-gray-900 font-bold">{plan.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-semibold">Price:</span>
                        <span className="text-2xl font-black text-blue-600">
                            ${plan.price.toFixed(2)}/{plan.interval}
                        </span>
                    </div>
                </div>

                {/* Status */}
                {isProcessing && !error && (
                    <div className="text-center py-8">
                        <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
                        <p className="text-gray-700 font-semibold mb-2">
                            Redirecting to secure payment...
                        </p>
                        <p className="text-sm text-gray-500">
                            Please wait while we prepare your checkout session
                        </p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-6">
                        <div className="flex items-start gap-3">
                            <XCircle className="text-red-600 flex-shrink-0 mt-1" size={24} />
                            <div>
                                <h3 className="font-bold text-red-800 mb-1">Payment Error</h3>
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate('/pricing')}
                        className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-colors"
                    >
                        Back to Pricing
                    </button>
                    {error && (
                        <button
                            onClick={handleCheckout}
                            disabled={isProcessing}
                            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Try Again
                        </button>
                    )}
                </div>

                {/* Security Notice */}
                <div className="mt-6 text-center">
                    <div className="inline-flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle size={16} className="text-green-600" />
                        <span>Secured by Stripe</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
