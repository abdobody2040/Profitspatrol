<?php

declare(strict_types=1);

namespace App\Logging;

use Monolog\Formatter\FormatterInterface;
use Monolog\LogRecord;

/**
 * Pretty human-readable colorized formatter for local development console.
 */
class PrettyConsoleFormatter implements FormatterInterface
{
    private const COLORS = [
        'DEBUG' => "\033[0;36m",    // Cyan
        'INFO'  => "\033[0;32m",    // Green
        'WARN'  => "\033[0;33m",    // Yellow
        'ERROR' => "\033[0;31m",    // Red
        'FATAL' => "\033[1;37;41m", // Bold White on Red Background
        'RESET' => "\033[0m",
        'GRAY'  => "\033[0;90m",
        'BLUE'  => "\033[0;34m",
        'PURPLE'=> "\033[0;35m",
    ];

    public function format(LogRecord $record): string
    {
        $levelName = strtoupper($record->level->getName());
        $normalizedLevel = match ($levelName) {
            'DEBUG' => 'DEBUG',
            'INFO', 'NOTICE' => 'INFO',
            'WARNING' => 'WARN',
            'ERROR' => 'ERROR',
            'CRITICAL', 'ALERT', 'EMERGENCY' => 'FATAL',
            default => 'INFO',
        };

        $color = self::COLORS[$normalizedLevel] ?? self::COLORS['INFO'];
        $reset = self::COLORS['RESET'];
        $gray = self::COLORS['GRAY'];
        $blue = self::COLORS['BLUE'];
        $purple = self::COLORS['PURPLE'];

        $dt = $record->datetime->setTimezone(new \DateTimeZone('UTC'));
        $timeStr = $dt->format('Y-m-d H:i:s.v');

        $context = $record->context;
        $event = $context['event'] ?? $record->extra['event'] ?? 'app.log';
        if (isset($context['event'])) {
            unset($context['event']);
        }

        $requestId = $record->extra['request_id'] ?? CorrelationContext::getRequestId();
        $shortReq = substr($requestId, 0, 8);

        $line = sprintf(
            "%s[%s]%s %s%-5s%s %s[%s]%s %s[%s]%s %s",
            $gray,
            $timeStr,
            $reset,
            $color,
            $normalizedLevel,
            $reset,
            $purple,
            $event,
            $reset,
            $blue,
            $shortReq,
            $reset,
            $record->message
        );

        if (!empty($context)) {
            $line .= ' ' . $gray . json_encode($context, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . $reset;
        }

        if (isset($context['exception']) && $context['exception'] instanceof \Throwable) {
            $ex = $context['exception'];
            $line .= "\n" . $color . "Exception: " . get_class($ex) . ": " . $ex->getMessage() . $reset;
            $line .= "\n" . $gray . $ex->getTraceAsString() . $reset;
        }

        return $line . "\n";
    }

    public function formatBatch(array $records): string
    {
        $output = '';
        foreach ($records as $r) {
            $output .= $this->format($r);
        }
        return $output;
    }
}
