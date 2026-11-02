<?php

declare(strict_types=1);

namespace App\Logging;

use Monolog\Handler\StreamHandler;
use Monolog\Logger;
use Monolog\Processor\PsrLogMessageProcessor;

/**
 * Factory class to instantiate the structured Monolog logger for Profits Patrol.
 */
class CreateStructuredLogger
{
    /**
     * Create a custom Monolog instance.
     */
    public function __invoke(array $config): Logger
    {
        $level = $config['level'] ?? env('LOG_LEVEL', 'info');
        $channelName = $config['name'] ?? env('APP_NAME', 'profits-patrol-api');

        // Output destination: stdout by default (12-factor / container best practice)
        // Can write to storage/logs/laravel.log if LOG_TO_FILE=true
        $stream = env('LOG_TO_FILE', false)
            ? storage_path('logs/laravel.log')
            : 'php://stdout';

        $handler = new StreamHandler($stream, $level);

        // Determine formatter: JSON in staging/prod, Pretty in local dev unless LOG_FORMAT=json
        $format = env('LOG_FORMAT');
        if (!$format) {
            $format = env('APP_ENV') === 'local' ? 'pretty' : 'json';
        }

        if ($format === 'pretty') {
            $handler->setFormatter(new PrettyConsoleFormatter());
        } else {
            $handler->setFormatter(new StructuredJsonFormatter());
        }

        $logger = new Logger($channelName);
        $logger->pushHandler($handler);

        // Register processors in order: correlation context -> redaction -> PSR message placeholder replacement
        $logger->pushProcessor(new CorrelationContextProcessor());
        $logger->pushProcessor(new RedactionProcessor());
        $logger->pushProcessor(new PsrLogMessageProcessor());

        return $logger;
    }
}
