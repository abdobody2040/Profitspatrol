<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Logging\CorrelationContext;
use App\Services\Logging\AppLogger;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware that manages request correlation IDs, distributed tracing context,
 * and emits a single production-grade access log line per HTTP request.
 */
class RequestCorrelationMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $startTime = microtime(true);

        // 1. Resolve or generate Request ID
        $requestId = $request->header('X-Request-ID')
            ?: $request->header('X-Correlation-ID')
            ?: (string) Str::uuid();

        // 2. Parse or initialize W3C Distributed Tracing (traceparent)
        $traceparent = $request->header('traceparent');
        $traceId = null;
        $spanId = null;

        if ($traceparent && preg_match('/^00-([a-f0-9]{32})-([a-f0-9]{16})-[a-f0-9]{2}$/i', $traceparent, $matches)) {
            $traceId = strtolower($matches[1]);
            $spanId = strtolower($matches[2]);
        } else {
            $traceId = bin2hex(random_bytes(16)); // 32 hex chars
            $spanId = bin2hex(random_bytes(8));   // 16 hex chars
        }

        // 3. Initialize Correlation Context for the thread
        CorrelationContext::clear();
        CorrelationContext::setRequestId($requestId);
        CorrelationContext::setTraceContext($traceId, $spanId);
        CorrelationContext::set('client_ip', $request->ip());
        CorrelationContext::set('user_agent', $request->userAgent());

        // 4. Execute request pipeline
        $response = $next($request);

        // 5. Bind authenticated user if authenticated during request
        $user = $request->user();
        if ($user) {
            CorrelationContext::setUser($user);
        }

        // 6. Attach correlation headers to response
        $response->headers->set('X-Request-ID', $requestId);
        $response->headers->set('traceparent', "00-{$traceId}-{$spanId}-01");

        // 7. Calculate exact duration in ms
        $durationMs = round((microtime(true) - $startTime) * 1000, 2);

        // 8. Determine route template
        $route = $request->route();
        $routeTemplate = $route ? '/' . ltrim($route->uri(), '/') : '/' . ltrim($request->path(), '/');

        // 9. Emit single access log line
        AppLogger::access(
            method: $request->method(),
            route: $routeTemplate,
            status: $response->getStatusCode(),
            durationMs: $durationMs,
            metadata: [
                'path' => '/' . ltrim($request->path(), '/'),
                'user_agent' => $request->userAgent(),
                'query_params' => $request->query() ? array_keys($request->query()) : [],
            ]
        );

        return $response;
    }

    /**
     * Perform any final actions after the response has been sent to the browser.
     */
    public function terminate(Request $request, Response $response): void
    {
        CorrelationContext::clear();
    }
}
