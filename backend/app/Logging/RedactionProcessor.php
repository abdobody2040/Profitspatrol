<?php

declare(strict_types=1);

namespace App\Logging;

use Monolog\LogRecord;
use Monolog\Processor\ProcessorInterface;

/**
 * Monolog processor to safely sanitize and redact sensitive PII and secrets
 * from log records (context, extra, and parameters).
 */
class RedactionProcessor implements ProcessorInterface
{
    /**
     * Exact lowercase keys to completely redact.
     */
    private const REDACTED_KEYS = [
        'password',
        'password_confirmation',
        'current_password',
        'new_password',
        'token',
        'access_token',
        'refresh_token',
        'auth_token',
        'secret',
        'client_secret',
        'webhook_secret',
        'stripe_secret',
        'stripe_secret_key',
        'apikey',
        'api_key',
        'authorization',
        'cookie',
        'set-cookie',
        'credit_card',
        'card_number',
        'cardnumber',
        'cvv',
        'cvc',
        'ssn',
        'national_id',
        'pin',
        'private_key',
        'bearer',
        'phone',
        'phone_number',
        'mobile',
        'telephone',
    ];

    /**
     * Keys containing partial strings that should be redacted.
     */
    private const SENSITIVE_KEY_SUBSTRINGS = [
        'password',
        'secret',
        'api_key',
        'apikey',
        'token',
        'phone',
    ];

    public function __invoke(LogRecord $record): LogRecord
    {
        $sanitizedMessage = $this->sanitizeString($record->message);
        $sanitizedContext = $this->sanitize($record->context);
        $sanitizedExtra = $this->sanitize($record->extra);

        return $record->with(
            message: $sanitizedMessage,
            context: $sanitizedContext,
            extra: $sanitizedExtra
        );
    }

    /**
     * Recursively sanitize values.
     */
    public function sanitize(mixed $data, int $depth = 0): mixed
    {
        if ($depth > 10) {
            return '[MAX_DEPTH_REACHED]';
        }

        if (is_array($data)) {
            $cleaned = [];
            foreach ($data as $key => $value) {
                if ($this->isSensitiveKey((string) $key)) {
                    $cleaned[$key] = '[REDACTED]';
                } else {
                    $cleaned[$key] = $this->sanitize($value, $depth + 1);
                }
            }
            return $cleaned;
        }

        if (is_object($data)) {
            if ($data instanceof \Throwable) {
                return [
                    'class' => get_class($data),
                    'message' => $this->sanitizeString($data->getMessage()),
                    'code' => $data->getCode(),
                    'file' => $data->getFile() . ':' . $data->getLine(),
                    'stack_trace' => explode("\n", $data->getTraceAsString()),
                ];
            }

            if (method_exists($data, 'toArray')) {
                return $this->sanitize($data->toArray(), $depth + 1);
            }

            return $this->sanitize((array) $data, $depth + 1);
        }

        if (is_string($data)) {
            return $this->sanitizeString($data);
        }

        return $data;
    }

    /**
     * Check if key name is sensitive.
     */
    public function isSensitiveKey(string $key): bool
    {
        $normalized = strtolower(trim($key));
        if (in_array($normalized, self::REDACTED_KEYS, true)) {
            return true;
        }

        foreach (self::SENSITIVE_KEY_SUBSTRINGS as $sub) {
            if (str_contains($normalized, $sub)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Sanitize string values for credit cards, Bearer tokens, emails.
     */
    public function sanitizeString(string $val): string
    {
        if (strlen($val) > 20000) {
            $val = substr($val, 0, 20000) . '...[TRUNCATED]';
        }

        // Mask Authorization Bearer tokens in headers
        $val = preg_replace('/(Bearer\s+)[A-Za-z0-9\-\._~\+\/]+=*/i', '$1[REDACTED_TOKEN]', $val);

        // Mask standard 13-19 digit credit card numbers
        $val = preg_replace('/\b(?:\d[ -]*?){13,19}\b/', '[REDACTED_CARD]', $val);

        // Mask email addresses (e.g., user@example.com -> u***@example.com)
        $val = preg_replace_callback('/([a-zA-Z0-9_.+-])[a-zA-Z0-9_.+-]*(@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)/', function ($matches) {
            return $matches[1] . '***' . $matches[2];
        }, $val);

        // Mask phone numbers in free-text (e.g. +1 555-123-4567 -> +1 555****4567)
        $val = preg_replace('/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/', '[REDACTED_PHONE]', $val);

        return $val;
    }
}
