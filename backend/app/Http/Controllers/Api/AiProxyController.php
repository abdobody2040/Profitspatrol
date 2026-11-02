<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Logging\AppLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AiProxyController extends Controller
{
    /**
     * AI Proxy for Ollie / ByteBoss AI assistant.
     */
    public function chat(Request $request): JsonResponse
    {
        $user = $request->user();

        // Tycoon tier or Admin gate
        if (!$user->isTycoon() && !$user->isAdmin()) {
            AppLogger::security(
                'security.authorization_denied',
                'Access to Ollie AI Proxy denied: Tycoon tier required',
                [
                    'user_id' => $user->id,
                    'subscription_tier' => $user->subscription_tier,
                    'role' => $user->role,
                ],
                'low'
            );

            return response()->json([
                'error' => 'Upgrade to Tycoon tier for Ollie AI mentor access.',
                'code' => 'TIER_REQUIRED',
            ], 403);
        }

        $validated = $request->validate([
            'provider' => 'nullable|string|in:openrouter,gemini',
            'method' => 'nullable|string',
            'body' => 'required|array',
        ]);

        $provider = $validated['provider'] ?? 'openrouter';
        $body = $validated['body'];
        $startTime = microtime(true);

        try {
            if ($provider === 'openrouter') {
                $apiKey = config('services.openrouter.api_key', env('OPENROUTER_API_KEY'));
                if (!$apiKey) {
                    AppLogger::error('ai.proxy.misconfigured', 'OPENROUTER_API_KEY is not configured');
                    return response()->json(['error' => 'OPENROUTER_API_KEY not configured on server.'], 500);
                }

                $response = Http::withHeaders([
                    'Authorization' => "Bearer {$apiKey}",
                    'HTTP-Referer' => config('app.url', 'https://profitspatrol.com'),
                    'X-Title' => 'Profits Patrol',
                ])->timeout(30)->post('https://openrouter.ai/api/v1/chat/completions', $body);

                $durationMs = round((microtime(true) - $startTime) * 1000, 2);
                AppLogger::outbound(
                    target: 'openrouter.ai',
                    event: 'ai.proxy.request',
                    durationMs: $durationMs,
                    outcome: $response->successful() ? 'success' : 'failed',
                    context: [
                        'provider' => 'openrouter',
                        'status' => $response->status(),
                        'model' => $body['model'] ?? 'unknown',
                    ]
                );

                return response()->json($response->json(), $response->status());
            } elseif ($provider === 'gemini') {
                $apiKey = config('services.gemini.api_key', env('GEMINI_API_KEY'));
                if (!$apiKey) {
                    AppLogger::error('ai.proxy.misconfigured', 'GEMINI_API_KEY is not configured');
                    return response()->json(['error' => 'GEMINI_API_KEY not configured on server.'], 500);
                }

                $model = $body['model'] ?? 'gemini-1.5-flash';
                $response = Http::timeout(30)
                    ->post("https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}", $body);

                $durationMs = round((microtime(true) - $startTime) * 1000, 2);
                AppLogger::outbound(
                    target: 'generativelanguage.googleapis.com',
                    event: 'ai.proxy.request',
                    durationMs: $durationMs,
                    outcome: $response->successful() ? 'success' : 'failed',
                    context: [
                        'provider' => 'gemini',
                        'status' => $response->status(),
                        'model' => $model,
                    ]
                );

                return response()->json($response->json(), $response->status());
            }

            return response()->json(['error' => 'Invalid provider'], 400);

        } catch (\Exception $e) {
            $durationMs = round((microtime(true) - $startTime) * 1000, 2);
            AppLogger::error(
                'ai.proxy.failed',
                'AI Proxy request encountered an exception',
                [
                    'provider' => $provider,
                    'duration_ms' => $durationMs,
                ],
                $e
            );

            return response()->json([
                'error' => 'AI Service error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
