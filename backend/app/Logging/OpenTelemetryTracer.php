<?php

declare(strict_types=1);

namespace App\Logging;

use App\Services\Logging\AppLogger;

/**
 * OpenTelemetry and W3C TraceContext correlation helper.
 * Provides trace_id / span_id resolution and traceparent header creation.
 */
class OpenTelemetryTracer
{
    /**
     * Parse incoming W3C traceparent header or generate a new span.
     * Format: version-trace_id-parent_id-trace_flags (e.g. 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01)
     */
    public static function extractOrStart(?string $traceparentHeader): array
    {
        if ($traceparentHeader && preg_match('/^00-([a-f0-9]{32})-([a-f0-9]{16})-([a-f0-9]{2})$/i', $traceparentHeader, $matches)) {
            $traceId = strtolower($matches[1]);
            // Generate a new 16-hex child span id for this local hop
            $spanId = bin2hex(random_bytes(8));
            $flags = $matches[3];
        } else {
            $traceId = bin2hex(random_bytes(16));
            $spanId = bin2hex(random_bytes(8));
            $flags = '01'; // sampled
        }

        CorrelationContext::setTraceContext($traceId, $spanId);

        return [
            'trace_id' => $traceId,
            'span_id' => $spanId,
            'traceparent' => "00-{$traceId}-{$spanId}-{$flags}",
        ];
    }

    /**
     * Get outgoing traceparent header for outbound calls.
     */
    public static function getTraceparentHeader(): string
    {
        $traceId = CorrelationContext::getTraceId() ?: bin2hex(random_bytes(16));
        $childSpanId = bin2hex(random_bytes(8));
        return "00-{$traceId}-{$childSpanId}-01";
    }

    /**
     * Record a trace span execution with automatic timing.
     */
    public static function traceSpan(string $name, callable $callback, array $attributes = []): mixed
    {
        $startTime = microtime(true);
        $spanId = bin2hex(random_bytes(8));
        $parentSpan = CorrelationContext::getSpanId();
        CorrelationContext::set('span_id', $spanId);

        try {
            $result = $callback();
            $durationMs = round((microtime(true) - $startTime) * 1000, 2);

            AppLogger::debug('trace.span.completed', "Span {$name} completed ({$durationMs}ms)", array_merge($attributes, [
                'span_name' => $name,
                'span_id' => $spanId,
                'parent_span_id' => $parentSpan,
                'duration_ms' => $durationMs,
            ]));

            return $result;
        } catch (\Throwable $e) {
            $durationMs = round((microtime(true) - $startTime) * 1000, 2);
            AppLogger::error('trace.span.failed', "Span {$name} threw exception ({$durationMs}ms)", array_merge($attributes, [
                'span_name' => $name,
                'span_id' => $spanId,
                'parent_span_id' => $parentSpan,
                'duration_ms' => $durationMs,
            ]), $e);
            throw $e;
        } finally {
            if ($parentSpan) {
                CorrelationContext::set('span_id', $parentSpan);
            }
        }
    }
}
