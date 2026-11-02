<?php

declare(strict_types=1);

namespace App\Services\Logging;

use App\Logging\CorrelationContext;
use Illuminate\Support\Facades\Log;

/**
 * Production-grade Central Structured Logger for Profits Patrol.
 * Enforces standardized dot-named events, log levels, and automatic context binding.
 */
class AppLogger
{
    /**
     * Log a DEBUG diagnostic message.
     */
    public static function debug(string $event, string $message, array $context = []): void
    {
        $context['event'] = $event;
        Log::debug($message, $context);
    }

    /**
     * Log an INFO business event.
     */
    public static function info(string $event, string $message, array $context = []): void
    {
        $context['event'] = $event;
        Log::info($message, $context);
    }

    /**
     * Log a WARN handled anomaly or retry event.
     */
    public static function warn(string $event, string $message, array $context = [], ?\Throwable $exception = null): void
    {
        $context['event'] = $event;
        if ($exception) {
            $context['exception'] = $exception;
        }
        Log::warning($message, $context);
    }

    /**
     * Log an ERROR failed operational event.
     */
    public static function error(string $event, string $message, array $context = [], ?\Throwable $exception = null): void
    {
        $context['event'] = $event;
        if ($exception) {
            $context['exception'] = $exception;
        }
        Log::error($message, $context);
    }

    /**
     * Log a FATAL unrecoverable system state or crash.
     */
    public static function fatal(string $event, string $message, array $context = [], ?\Throwable $exception = null): void
    {
        $context['event'] = $event;
        if ($exception) {
            $context['exception'] = $exception;
        }
        Log::critical($message, $context);
    }

    /**
     * Log a security or audit event.
     */
    public static function security(
        string $event,
        string $message,
        array $context = [],
        string $severity = 'medium'
    ): void {
        $context['event'] = $event;
        $context['security_severity'] = $severity;
        $context['client_ip'] = CorrelationContext::get('client_ip');

        if (in_array(strtolower($severity), ['high', 'critical'], true)) {
            Log::error("[SECURITY:{$severity}] " . $message, $context);
        } else {
            Log::info("[SECURITY:{$severity}] " . $message, $context);
        }
    }

    /**
     * Log an outbound external call (payment, email, third-party APIs).
     */
    public static function outbound(
        string $target,
        string $event,
        float $durationMs,
        string $outcome,
        array $context = []
    ): void {
        $context['event'] = $event;
        $context['outbound_target'] = $target;
        $context['duration_ms'] = $durationMs;
        $context['outcome'] = $outcome;

        if ($outcome === 'failed' || (isset($context['status']) && $context['status'] >= 400)) {
            Log::error("Outbound call to {$target} failed", $context);
        } else {
            Log::info("Outbound call to {$target} succeeded", $context);
        }
    }

    /**
     * Log an access line for HTTP requests.
     */
    public static function access(
        string $method,
        string $route,
        int $status,
        float $durationMs,
        array $metadata = []
    ): void {
        $event = $status >= 500 ? 'http.request.server_error'
            : ($status >= 400 ? 'http.request.client_error' : 'http.request.completed');

        $context = array_merge([
            'event' => $event,
            'method' => strtoupper($method),
            'route' => $route,
            'status' => $status,
            'duration_ms' => $durationMs,
            'client_ip' => CorrelationContext::get('client_ip'),
            'user_id' => CorrelationContext::get('user_id'),
            'request_id' => CorrelationContext::getRequestId(),
        ], $metadata);

        if ($status >= 500) {
            Log::error("HTTP {$method} {$route} {$status} ({$durationMs}ms)", $context);
        } elseif ($status >= 400) {
            Log::warning("HTTP {$method} {$route} {$status} ({$durationMs}ms)", $context);
        } else {
            Log::info("HTTP {$method} {$route} {$status} ({$durationMs}ms)", $context);
        }
    }
}
