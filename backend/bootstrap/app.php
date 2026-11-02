<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->prepend(\App\Http\Middleware\RequestCorrelationMiddleware::class);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );

        $exceptions->report(function (\Throwable $e) {
            $isFatal = $e instanceof \Error
                || $e instanceof \ParseError
                || $e instanceof \PDOException
                || str_contains(get_class($e), 'Fatal');

            if ($isFatal) {
                \App\Services\Logging\AppLogger::fatal(
                    event: 'app.exception.fatal',
                    message: $e->getMessage(),
                    context: [
                        'exception_class' => get_class($e),
                        'file' => $e->getFile(),
                        'line' => $e->getLine(),
                    ],
                    exception: $e
                );
            } else {
                \App\Services\Logging\AppLogger::error(
                    event: 'app.exception.unhandled',
                    message: $e->getMessage(),
                    context: [
                        'exception_class' => get_class($e),
                        'file' => $e->getFile(),
                        'line' => $e->getLine(),
                    ],
                    exception: $e
                );
            }
            return false;
        });
    })->create();
