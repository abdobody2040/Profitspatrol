<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\WebhookEvent;
use App\Services\Logging\AppLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class StripeController extends Controller
{
    /**
     * Authoritative server-side pricing definitions.
     */
    private const TIER_PRICING = [
        'intern' => ['price' => 0, 'priceId' => null, 'name' => 'Intern'],
        'founder' => ['price' => 999, 'priceId' => 'price_1T0N6rGpy11OSRPTdKOfORt9', 'name' => 'Founder (Monthly)'],
        'board' => ['price' => 1499, 'priceId' => 'price_1T0N7pGpy11OSRPTAoyzEWPR', 'name' => 'Board Member (Monthly)'],
        'tycoon' => ['price' => 8999, 'priceId' => 'price_1T0N87Gpy11OSRPTjOfmf54z', 'name' => 'Tycoon (Yearly)'],
        'classroom' => ['price' => 2999, 'priceId' => 'price_classroom_monthly', 'name' => 'Classroom (Monthly)'],
        'teacher_solo' => ['price' => 0, 'priceId' => null, 'name' => 'Teacher Solo'],
        'teacher_pro' => ['price' => 4900, 'priceId' => 'price_teacher_pro_yearly', 'name' => 'Teacher Pro (Yearly)'],
        'school_small' => ['price' => 29900, 'priceId' => 'price_school_small_yearly', 'name' => 'Small School (Yearly)'],
        'school_medium' => ['price' => 89900, 'priceId' => 'price_school_medium_yearly', 'name' => 'Medium School (Yearly)'],
        'school_large' => ['price' => 149900, 'priceId' => 'price_school_large_yearly', 'name' => 'Large School (Yearly)'],
    ];

    /**
     * Create checkout session with server-side authoritative pricing.
     */
    public function createCheckoutSession(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'planId' => 'required|string',
            'success_url' => 'nullable|string',
            'cancel_url' => 'nullable|string',
        ]);

        $planId = $validated['planId'];

        if (!isset(self::TIER_PRICING[$planId])) {
            return response()->json(['error' => 'Invalid plan ID selected.'], 400);
        }

        $tier = self::TIER_PRICING[$planId];
        $stripeSecret = config('services.stripe.secret', env('STRIPE_SECRET_KEY'));

        if (!$stripeSecret) {
            // Development fallback mock session
            return response()->json([
                'sessionId' => 'mock_cs_' . uniqid(),
                'url' => url('/profile?mock_checkout=success&plan=' . $planId),
            ]);
        }

        $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
        $successUrl = $validated['success_url'] ?? "{$frontendUrl}/profile?session_id={CHECKOUT_SESSION_ID}&success=true";
        $cancelUrl = $validated['cancel_url'] ?? "{$frontendUrl}/pricing?cancelled=true";

        try {
            $isYearly = str_contains($planId, 'yearly') || $planId === 'tycoon';

            $payload = [
                'payment_method_types' => ['card'],
                'mode' => 'subscription',
                'customer_email' => $user->email,
                'client_reference_id' => $user->id,
                'metadata' => [
                    'userId' => $user->id,
                    'planId' => $planId,
                ],
                'subscription_data' => [
                    'metadata' => [
                        'userId' => $user->id,
                        'planId' => $planId,
                    ],
                ],
                'line_items' => [
                    [
                        'price_data' => [
                            'currency' => 'usd',
                            'product_data' => [
                                'name' => "Profits Patrol - {$tier['name']}",
                            ],
                            'unit_amount' => $tier['price'],
                            'recurring' => [
                                'interval' => $isYearly ? 'year' : 'month',
                            ],
                        ],
                        'quantity' => 1,
                    ],
                ],
                'success_url' => $successUrl,
                'cancel_url' => $cancelUrl,
            ];

            $startTime = microtime(true);
            $response = Http::withToken($stripeSecret)
                ->asForm()
                ->post('https://api.stripe.com/v1/checkout/sessions', $payload);

            $durationMs = round((microtime(true) - $startTime) * 1000, 2);
            AppLogger::outbound(
                target: 'api.stripe.com',
                event: 'payment.stripe.checkout_session',
                durationMs: $durationMs,
                outcome: $response->successful() ? 'success' : 'failed',
                context: [
                    'plan_id' => $planId,
                    'status' => $response->status(),
                ]
            );

            if (!$response->successful()) {
                AppLogger::error('payment.checkout.failed', 'Stripe checkout initialization failed', [
                    'plan_id' => $planId,
                    'status' => $response->status(),
                    'error_body' => $response->json(),
                ]);

                return response()->json([
                    'error' => 'Failed to initialize payment session',
                    'details' => $response->json(),
                ], $response->status());
            }

            $session = $response->json();
            AppLogger::info('payment.checkout.created', 'Stripe checkout session initialized', [
                'session_id' => $session['id'],
                'plan_id' => $planId,
                'user_id' => $user->id,
            ]);

            return response()->json([
                'sessionId' => $session['id'],
                'url' => $session['url'],
            ]);

        } catch (\Exception $e) {
            AppLogger::error('payment.checkout.exception', 'Stripe session creation exception occurred', [
                'plan_id' => $planId ?? null,
            ], $e);

            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Create billing customer portal session.
     */
    public function createPortalSession(Request $request): JsonResponse
    {
        $user = $request->user();
        $stripeSecret = config('services.stripe.secret', env('STRIPE_SECRET_KEY'));

        if (!$user->stripe_customer_id) {
            return response()->json(['error' => 'No active Stripe customer found.'], 404);
        }

        if (!$stripeSecret) {
            return response()->json(['url' => url('/profile')]);
        }

        $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
        $returnUrl = "{$frontendUrl}/profile";

        $response = Http::withToken($stripeSecret)
            ->asForm()
            ->post('https://api.stripe.com/v1/billing_portal/sessions', [
                'customer' => $user->stripe_customer_id,
                'return_url' => $returnUrl,
            ]);

        if (!$response->successful()) {
            return response()->json(['error' => 'Failed to create portal session'], $response->status());
        }

        return response()->json(['url' => $response->json('url')]);
    }

    /**
     * Handle incoming Stripe webhooks (Idempotent with webhook_events table).
     */
    public function webhook(Request $request): JsonResponse
    {
        $payload = $request->all();
        $eventId = $payload['id'] ?? null;
        $eventType = $payload['type'] ?? null;

        if (!$eventId || !$eventType) {
            return response()->json(['error' => 'Invalid webhook event format'], 400);
        }

        // Idempotency check: if already processed, return 200 immediately
        $existingEvent = WebhookEvent::where('stripe_event_id', $eventId)->first();
        if ($existingEvent && $existingEvent->processed) {
            return response()->json(['status' => 'already_processed']);
        }

        $webhookLog = $existingEvent ?: WebhookEvent::create([
            'stripe_event_id' => $eventId,
            'event_type' => $eventType,
            'payload' => $payload,
            'processed' => false,
        ]);

        try {
            switch ($eventType) {
                case 'checkout.session.completed':
                    $session = $payload['data']['object'] ?? [];
                    $userId = $session['metadata']['userId'] ?? null;
                    $planId = $session['metadata']['planId'] ?? null;
                    $customerId = $session['customer'] ?? null;

                    if ($userId && $planId) {
                        $isYearly = str_contains($planId, 'yearly') || $planId === 'tycoon';

                        // Update parent user
                        $user = User::find($userId);
                        if ($user) {
                            $user->update([
                                'subscription_tier' => $planId,
                                'subscription_status' => 'PREMIUM',
                                'billing_cycle' => $isYearly ? 'YEARLY' : 'MONTHLY',
                                'stripe_customer_id' => $customerId ?: $user->stripe_customer_id,
                            ]);

                            // Cascade to children
                            User::where('parent_id', $user->id)->update([
                                'subscription_tier' => $planId,
                                'subscription_status' => 'PREMIUM',
                                'billing_cycle' => $isYearly ? 'YEARLY' : 'MONTHLY',
                            ]);
                        }
                    }
                    break;

                case 'customer.subscription.deleted':
                    $subscription = $payload['data']['object'] ?? [];
                    $customerId = $subscription['customer'] ?? null;

                    if ($customerId) {
                        $user = User::where('stripe_customer_id', $customerId)->first();
                        if ($user) {
                            $user->update([
                                'subscription_tier' => 'intern',
                                'subscription_status' => 'FREE',
                            ]);

                            User::where('parent_id', $user->id)->update([
                                'subscription_tier' => 'intern',
                                'subscription_status' => 'FREE',
                            ]);
                        }
                    }
                    break;
            }

            $webhookLog->update([
                'processed' => true,
                'processed_at' => now(),
            ]);

            AppLogger::info('payment.webhook.processed', 'Stripe webhook event processed successfully', [
                'event_type' => $type ?? 'unknown',
                'event_id' => $event['id'] ?? null,
            ]);

            return response()->json(['status' => 'success']);

        } catch (\Exception $e) {
            AppLogger::error('payment.webhook.failed', 'Stripe webhook processing exception', [
                'event_type' => $type ?? 'unknown',
            ], $e);

            $webhookLog->update(['error' => $e->getMessage()]);

            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
