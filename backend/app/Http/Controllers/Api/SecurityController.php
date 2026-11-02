<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ParentReportLog;
use App\Models\SecurityEvent;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Services\Logging\AppLogger;

class SecurityController extends Controller
{
    /**
     * Log security event (replaces log-security-event edge function).
     */
    public function logEvent(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'event_type' => 'required|string|in:prompt_injection,profanity_detected,pii_leak,rate_limit_exceeded,content_violation,unauthorized_access,suspicious_activity,data_breach',
            'severity' => 'required|string|in:low,medium,high,critical',
            'description' => 'nullable|string',
            'metadata' => 'nullable|array',
            'event_data' => 'nullable|array',
            'user_id' => 'nullable|uuid',
        ]);

        $userId = $validated['user_id'] ?? ($request->user() ? $request->user()->id : null);
        $description = $validated['description'] ?? "Security alert: {$validated['event_type']}";
        $metadata = array_merge($validated['metadata'] ?? [], $validated['event_data'] ?? []);

        $event = SecurityEvent::create([
            'user_id' => $userId,
            'event_type' => $validated['event_type'],
            'severity' => $validated['severity'],
            'description' => $description,
            'metadata' => $metadata,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        AppLogger::security(
            event: 'security.event.' . $validated['event_type'],
            message: $description,
            context: [
                'event_id' => $event->id,
                'metadata' => $metadata,
                'user_id' => $userId,
            ],
            severity: $validated['severity']
        );

        // Slack alert dispatch for high or critical events
        if (in_array($validated['severity'], ['high', 'critical'])) {
            $this->sendSlackAlert($event);
        }

        return response()->json([
            'success' => true,
            'event_id' => $event->id,
            'message' => 'Security event logged successfully.',
        ]);
    }

    /**
     * Send Slack alert for high/critical security event.
     */
    private function sendSlackAlert(SecurityEvent $event): void
    {
        $slackWebhookUrl = env('SLACK_WEBHOOK_URL');
        if (!$slackWebhookUrl) {
            return;
        }

        try {
            $color = $event->severity === 'critical' ? '#dc2626' : '#ea580c';
            $emoji = $event->severity === 'critical' ? '🚨' : '⚠️';

            $startTime = microtime(true);
            $response = Http::post($slackWebhookUrl, [
                'text' => "{$emoji} {$event->severity} Security Event on Profits Patrol",
                'attachments' => [
                    [
                        'color' => $color,
                        'title' => ucwords(str_replace('_', ' ', $event->event_type)),
                        'fields' => [
                            ['title' => 'Severity', 'value' => strtoupper($event->severity), 'short' => true],
                            ['title' => 'User ID', 'value' => $event->user_id ?? 'Anonymous', 'short' => true],
                            ['title' => 'IP Address', 'value' => $event->ip_address, 'short' => true],
                            ['title' => 'Description', 'value' => $event->description, 'short' => false],
                            ['title' => 'Metadata', 'value' => json_encode($event->metadata, JSON_PRETTY_PRINT), 'short' => false],
                        ],
                        'ts' => time(),
                    ],
                ],
            ]);

            $durationMs = round((microtime(true) - $startTime) * 1000, 2);
            AppLogger::outbound(
                target: 'slack.com',
                event: 'security.slack_alert.sent',
                durationMs: $durationMs,
                outcome: $response->successful() ? 'success' : 'failed',
                context: [
                    'event_id' => $event->id,
                    'severity' => $event->severity,
                ]
            );
        } catch (\Exception $e) {
            AppLogger::warn('security.slack_alert.failed', 'Slack alert notification failed', [
                'event_id' => $event->id,
            ], $e);
        }
    }

    /**
     * Generate monthly parent report (replaces monthly-report edge function).
     */
    public function monthlyReport(Request $request): JsonResponse
    {
        $parent = $request->user();
        if ($parent->role !== 'parent' && !$parent->isAdmin()) {
            AppLogger::security(
                'security.authorization_denied',
                'Unauthorized attempt to access monthly parent report',
                ['user_id' => $parent->id, 'role' => $parent->role],
                'medium'
            );
            return response()->json(['error' => 'Unauthorized.'], 403);
        }

        $kids = $parent->children;
        $currentMonth = now()->format('Y-m');
        $reports = [];

        foreach ($kids as $kid) {
            $reportData = [
                'parent_name' => $parent->name,
                'kid_name' => $kid->name,
                'month' => $currentMonth,
                'xp_earned' => $kid->xp ?? 0,
                'level' => $kid->level ?? 1,
                'pp_tokens' => $kid->pp_tokens ?? 0,
                'lessons_completed' => $kid->lessons_completed ?? count($kid->completed_lesson_ids ?? []),
                'gigs_completed' => $kid->gigs_completed ?? 0,
                'streak_days' => $kid->streak ?? 1,
                'top_achievement' => $kid->top_achievement ?? 'Completed financial lessons!',
            ];

            ParentReportLog::create([
                'parent_id' => $parent->id,
                'kid_id' => $kid->id,
                'month' => $currentMonth,
                'email_status' => 'sent',
            ]);

            $reports[] = $reportData;
        }

        return response()->json([
            'success' => true,
            'month' => $currentMonth,
            'reports' => $reports,
        ]);
    }
}
