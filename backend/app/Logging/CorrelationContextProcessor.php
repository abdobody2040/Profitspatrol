<?php

declare(strict_types=1);

namespace App\Logging;

use Monolog\LogRecord;
use Monolog\Processor\ProcessorInterface;

/**
 * Injects request correlation IDs and user context into every Monolog LogRecord.
 */
class CorrelationContextProcessor implements ProcessorInterface
{
    public function __invoke(LogRecord $record): LogRecord
    {
        $context = CorrelationContext::all();

        $extra = $record->extra;
        $extra['request_id'] = $context['request_id'] ?? CorrelationContext::getRequestId();
        
        if (!empty($context['trace_id'])) {
            $extra['trace_id'] = $context['trace_id'];
        }
        if (!empty($context['span_id'])) {
            $extra['span_id'] = $context['span_id'];
        }
        if (!empty($context['user_id'])) {
            $extra['user_id'] = $context['user_id'];
        }
        if (!empty($context['tenant_id'])) {
            $extra['tenant_id'] = $context['tenant_id'];
        }
        if (!empty($context['user_role'])) {
            $extra['user_role'] = $context['user_role'];
        }
        if (!empty($context['client_ip'])) {
            $extra['client_ip'] = $context['client_ip'];
        }

        return $record->with(extra: $extra);
    }
}
