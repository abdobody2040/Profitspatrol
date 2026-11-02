<?php

declare(strict_types=1);

namespace App\Logging;

use Monolog\Formatter\FormatterInterface;
use Monolog\LogRecord;

/**
 * Formats Monolog records into strict single-line JSON adhering to SRE production standard.
 */
class StructuredJsonFormatter implements FormatterInterface
{
    private string $service;
    private string $env;
    private string $version;

    public function __construct(
        ?string $service = null,
        ?string $env = null,
        ?string $version = null
    ) {
        $this->service = $service ?? env('LOG_SERVICE_NAME', env('APP_NAME', 'profits-patrol-api'));
        $this->env = $env ?? env('APP_ENV', 'production');
        $this->version = $version ?? env('APP_VERSION', env('GIT_COMMIT_SHA', '6d0375d'));
    }

    public function format(LogRecord $record): string
    {
        // 1. Normalize level name
        $levelName = strtoupper($record->level->getName());
        $normalizedLevel = match ($levelName) {
            'DEBUG' => 'DEBUG',
            'INFO', 'NOTICE' => 'INFO',
            'WARNING' => 'WARN',
            'ERROR' => 'ERROR',
            'CRITICAL', 'ALERT', 'EMERGENCY' => 'FATAL',
            default => 'INFO',
        };

        // 2. Format timestamp in UTC ISO-8601 with milliseconds (Z suffix)
        $dt = $record->datetime->setTimezone(new \DateTimeZone('UTC'));
        $timestamp = $dt->format('Y-m-d\TH:i:s.v\Z');

        // 3. Extract event dot-name
        $context = $record->context;
        $event = $context['event'] ?? $record->extra['event'] ?? 'app.log';
        if (isset($context['event'])) {
            unset($context['event']);
        }

        // 4. Extract correlation fields
        $requestId = $record->extra['request_id'] ?? CorrelationContext::getRequestId();
        $traceId = $record->extra['trace_id'] ?? CorrelationContext::getTraceId();
        $spanId = $record->extra['span_id'] ?? CorrelationContext::getSpanId();
        $userId = $record->extra['user_id'] ?? CorrelationContext::get('user_id');
        $tenantId = $record->extra['tenant_id'] ?? CorrelationContext::get('tenant_id');

        // 5. Structure payload
        $payload = [
            'timestamp' => $timestamp,
            'level' => $normalizedLevel,
            'service' => $this->service,
            'env' => $this->env,
            'version' => $this->version,
            'event' => $event,
            'message' => $record->message,
            'request_id' => $requestId,
        ];

        if ($traceId) {
            $payload['trace_id'] = $traceId;
        }
        if ($spanId) {
            $payload['span_id'] = $spanId;
        }
        if ($userId) {
            $payload['user_id'] = $userId;
        }
        if ($tenantId) {
            $payload['tenant_id'] = $tenantId;
        }

        // 6. Handle exception object if present
        if (isset($context['exception'])) {
            $ex = $context['exception'];
            if ($ex instanceof \Throwable) {
                $payload['exception'] = [
                    'class' => get_class($ex),
                    'message' => $ex->getMessage(),
                    'code' => $ex->getCode(),
                    'file' => $ex->getFile() . ':' . $ex->getLine(),
                    'stack_trace' => explode("\n", $ex->getTraceAsString()),
                ];
            } else {
                $payload['exception'] = $ex;
            }
            unset($context['exception']);
        }

        // Include non-empty context
        if (!empty($context)) {
            $payload['context'] = $context;
        }

        return json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . "\n";
    }

    public function formatBatch(array $records): string
    {
        $message = '';
        foreach ($records as $record) {
            $message .= $this->format($record);
        }
        return $message;
    }
}
