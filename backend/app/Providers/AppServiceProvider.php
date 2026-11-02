<?php

declare(strict_types=1);

namespace App\Providers;

use App\Services\Logging\AppLogger;
use Illuminate\Database\Events\QueryExecuted;
use Illuminate\Http\Client\Events\ConnectionFailed;
use Illuminate\Http\Client\Events\ResponseReceived;
use Illuminate\Queue\Events\JobExceptionOccurred;
use Illuminate\Queue\Events\JobFailed;
use Illuminate\Queue\Events\JobProcessed;
use Illuminate\Queue\Events\JobProcessing;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->registerLifecycleLogging();
        $this->registerDatabaseLogging();
        $this->registerOutboundHttpLogging();
        $this->registerQueueJobLogging();
    }

    /**
     * Log application startup with non-secret environment configs.
     */
    protected function registerLifecycleLogging(): void
    {
        // Emit application startup event once
        static $bootstrapped = false;
        if (!$bootstrapped) {
            $bootstrapped = true;

            AppLogger::info('app.lifecycle.startup', 'Application booted successfully', [
                'php_version' => PHP_VERSION,
                'laravel_version' => app()->version(),
                'environment' => config('app.env'),
                'debug_mode' => (bool) config('app.debug'),
                'timezone' => config('app.timezone'),
                'db_connection' => config('database.default'),
                'queue_connection' => config('queue.default'),
                'cache_store' => config('cache.default'),
                'log_channel' => config('logging.default'),
            ]);
        }
    }

    /**
     * Log slow or debug database queries.
     */
    protected function registerDatabaseLogging(): void
    {
        $slowThresholdMs = config('app.env') === 'production' ? 250 : 100;
        $isVerboseDebug = config('logging.channels.structured.level') === 'debug'
            || env('LOG_LEVEL') === 'debug';

        DB::listen(function (QueryExecuted $query) use ($slowThresholdMs, $isVerboseDebug) {
            $timeMs = round($query->time, 2);

            if ($timeMs >= $slowThresholdMs) {
                AppLogger::warn('db.query.slow', "Slow database query detected ({$timeMs}ms)", [
                    'connection' => $query->connectionName,
                    'duration_ms' => $timeMs,
                    'sql' => $query->sql,
                ]);
            } elseif ($isVerboseDebug) {
                AppLogger::debug('db.query.executed', "Database query executed ({$timeMs}ms)", [
                    'connection' => $query->connectionName,
                    'duration_ms' => $timeMs,
                    'sql' => $query->sql,
                ]);
            }
        });
    }

    /**
     * Log outbound HTTP client requests (Stripe, OpenRouter, Gemini, Slack).
     */
    protected function registerOutboundHttpLogging(): void
    {
        Event::listen(ResponseReceived::class, function (ResponseReceived $event) {
            $request = $event->request;
            $response = $event->response;
            $urlParts = parse_url($request->url());
            $host = $urlParts['host'] ?? 'unknown';
            $path = $urlParts['path'] ?? '/';

            AppLogger::outbound(
                target: $host,
                event: 'outbound.http.completed',
                durationMs: 0.0, // Handled by HTTP client stats if enabled
                outcome: $response->successful() ? 'success' : 'failed',
                context: [
                    'method' => $request->method(),
                    'path' => $path,
                    'status' => $response->status(),
                ]
            );
        });

        Event::listen(ConnectionFailed::class, function (ConnectionFailed $event) {
            $request = $event->request;
            $urlParts = parse_url($request->url());
            $host = $urlParts['host'] ?? 'unknown';
            $path = $urlParts['path'] ?? '/';

            AppLogger::outbound(
                target: $host,
                event: 'outbound.http.failed',
                durationMs: 0.0,
                outcome: 'failed',
                context: [
                    'method' => $request->method(),
                    'path' => $path,
                    'error' => $event->exception->getMessage(),
                ]
            );
        });
    }

    /**
     * Log background queue job lifecycles.
     */
    protected function registerQueueJobLogging(): void
    {
        Queue::before(function (JobProcessing $event) {
            AppLogger::info('job.started', "Starting background job: {$event->job->resolveName()}", [
                'job_name' => $event->job->resolveName(),
                'queue' => $event->job->getQueue(),
                'attempts' => $event->job->attempts(),
                'connection' => $event->connectionName,
            ]);
        });

        Queue::after(function (JobProcessed $event) {
            AppLogger::info('job.completed', "Completed background job: {$event->job->resolveName()}", [
                'job_name' => $event->job->resolveName(),
                'queue' => $event->job->getQueue(),
                'connection' => $event->connectionName,
            ]);
        });

        Queue::failing(function (JobFailed $event) {
            AppLogger::error('job.failed', "Background job failed: {$event->job->resolveName()}", [
                'job_name' => $event->job->resolveName(),
                'queue' => $event->job->getQueue(),
                'connection' => $event->connectionName,
                'error' => $event->exception->getMessage(),
            ], $event->exception);
        });

        Queue::exceptionOccurred(function (JobExceptionOccurred $event) {
            AppLogger::warn('job.retry', "Exception in background job (will retry): {$event->job->resolveName()}", [
                'job_name' => $event->job->resolveName(),
                'queue' => $event->job->getQueue(),
                'attempts' => $event->job->attempts(),
                'error' => $event->exception->getMessage(),
            ], $event->exception);
        });
    }
}
