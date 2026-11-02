<?php

declare(strict_types=1);

namespace App\Logging;

use Illuminate\Support\Str;

/**
 * Thread/request-scoped correlation context for Profits Patrol.
 * Stores request_id, trace_id, span_id, user_id, tenant_id, and client metadata.
 */
class CorrelationContext
{
    private static array $context = [];

    /**
     * Set a context key.
     */
    public static function set(string $key, mixed $value): void
    {
        self::$context[$key] = $value;
    }

    /**
     * Get a context key.
     */
    public static function get(string $key, mixed $default = null): mixed
    {
        return self::$context[$key] ?? $default;
    }

    /**
     * Retrieve all context attributes.
     */
    public static function all(): array
    {
        return self::$context;
    }

    /**
     * Merge an array of context values.
     */
    public static function merge(array $values): void
    {
        self::$context = array_merge(self::$context, $values);
    }

    /**
     * Clear context (called at termination/reset).
     */
    public static function clear(): void
    {
        self::$context = [];
    }

    /**
     * Get or initialize request_id.
     */
    public static function getRequestId(): string
    {
        if (empty(self::$context['request_id'])) {
            self::$context['request_id'] = (string) Str::uuid();
        }
        return self::$context['request_id'];
    }

    /**
     * Set request_id explicitly.
     */
    public static function setRequestId(string $requestId): void
    {
        self::$context['request_id'] = $requestId;
    }

    /**
     * Get or initialize trace_id.
     */
    public static function getTraceId(): ?string
    {
        return self::$context['trace_id'] ?? null;
    }

    /**
     * Get or initialize span_id.
     */
    public static function getSpanId(): ?string
    {
        return self::$context['span_id'] ?? null;
    }

    /**
     * Set trace context (W3C traceparent).
     */
    public static function setTraceContext(?string $traceId, ?string $spanId): void
    {
        if ($traceId) {
            self::$context['trace_id'] = $traceId;
        }
        if ($spanId) {
            self::$context['span_id'] = $spanId;
        }
    }

    /**
     * Set trace_id explicitly.
     */
    public static function setTraceId(string $traceId): void
    {
        self::$context['trace_id'] = $traceId;
    }

    /**
     * Set span_id explicitly.
     */
    public static function setSpanId(string $spanId): void
    {
        self::$context['span_id'] = $spanId;
    }

    /**
     * Set user_id explicitly.
     */
    public static function setUserId(mixed $userId): void
    {
        self::$context['user_id'] = $userId;
    }

    /**
     * Set authenticated user context.
     */
    public static function setUser(mixed $user): void
    {
        if ($user) {
            self::$context['user_id'] = $user->id ?? (string) $user;
            if (isset($user->role)) {
                self::$context['user_role'] = $user->role;
            }
            if (isset($user->parent_id) && $user->parent_id) {
                self::$context['tenant_id'] = $user->parent_id;
            }
        }
    }
}
