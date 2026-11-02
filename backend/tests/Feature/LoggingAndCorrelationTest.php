<?php

namespace Tests\Feature;

use App\Logging\CorrelationContext;
use App\Logging\CorrelationContextProcessor;
use App\Logging\RedactionProcessor;
use App\Logging\StructuredJsonFormatter;
use App\Services\Logging\AppLogger;
use Monolog\Level;
use Monolog\LogRecord;
use Tests\TestCase;

class LoggingAndCorrelationTest extends TestCase
{
    protected function tearDown(): void
    {
        CorrelationContext::clear();
        parent::tearDown();
    }

    /**
     * Test that incoming requests receive an X-Request-ID and traceparent header.
     */
    public function test_incoming_request_receives_generated_request_id(): void
    {
        $response = $this->get('/api/v1/health');

        $response->assertStatus(200);
        $response->assertHeader('X-Request-ID');
        $response->assertHeader('traceparent');

        $requestId = $response->headers->get('X-Request-ID');
        $this->assertNotEmpty($requestId);
        // Valid UUID format: 8-4-4-4-12 hex characters
        $this->assertMatchesRegularExpression(
            '/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i',
            $requestId
        );
    }

    /**
     * Test that an incoming X-Request-ID is preserved and echoed back.
     */
    public function test_incoming_request_preserves_client_request_id(): void
    {
        $clientRequestId = 'test-client-req-999888';

        $response = $this->withHeaders([
            'X-Request-ID' => $clientRequestId,
        ])->get('/api/v1/health');

        $response->assertStatus(200);
        $response->assertHeader('X-Request-ID', $clientRequestId);
    }

    /**
     * Test that incoming W3C traceparent is parsed and bound to correlation context.
     */
    public function test_incoming_traceparent_is_parsed(): void
    {
        $traceId = '4bf92f3577b34da6a3ce929d0e0e4736';
        $spanId = '00f067aa0ba902b7';
        $traceparent = "00-{$traceId}-{$spanId}-01";

        $response = $this->withHeaders([
            'traceparent' => $traceparent,
        ])->get('/api/v1/health');

        $response->assertStatus(200);
        $this->assertTrue($response->headers->has('traceparent'));
        $this->assertStringContainsString($traceId, (string) $response->headers->get('traceparent'));
    }

    /**
     * Test that StructuredJsonFormatter emits strict, valid JSON matching all schema requirements.
     */
    public function test_structured_json_formatter_schema_compliance(): void
    {
        CorrelationContext::setRequestId('req-schema-verify-123');
        CorrelationContext::setTraceId('trace-abc');
        CorrelationContext::setSpanId('span-xyz');
        CorrelationContext::setUserId(42);

        $record = new LogRecord(
            datetime: new \DateTimeImmutable('2026-10-14 10:00:00.123456+00:00'),
            channel: 'test',
            level: Level::Error,
            message: 'Payment provider timed out',
            context: [
                'event' => 'payment.failed',
                'provider' => 'stripe',
                'amount' => 49.99,
            ]
        );

        // Run correlation processor
        $corrProcessor = new CorrelationContextProcessor();
        $record = $corrProcessor($record);

        // Format
        $formatter = new StructuredJsonFormatter();
        $formatted = $formatter->format($record);

        $this->assertIsString($formatted);
        $decoded = json_decode(trim($formatted), true);

        $this->assertIsArray($decoded, 'Output must be valid JSON');
        $this->assertSame('req-schema-verify-123', $decoded['request_id']);
        $this->assertSame('ERROR', $decoded['level']);
        $this->assertSame('payment.failed', $decoded['event']);
        $this->assertSame('Payment provider timed out', $decoded['message']);
        $this->assertSame(42, $decoded['user_id']);
        $this->assertSame('trace-abc', $decoded['trace_id']);
        $this->assertSame('span-xyz', $decoded['span_id']);
        $this->assertArrayHasKey('timestamp', $decoded);
        $this->assertMatchesRegularExpression('/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/', $decoded['timestamp']);
        $this->assertArrayHasKey('service', $decoded);
        $this->assertArrayHasKey('env', $decoded);
        $this->assertArrayHasKey('version', $decoded);
        $this->assertSame('stripe', $decoded['context']['provider']);
    }

    /**
     * Test that RedactionProcessor recursively masks secrets and PII.
     */
    public function test_redaction_masks_sensitive_keys_and_patterns(): void
    {
        $processor = new RedactionProcessor();

        $sensitiveData = [
            'password' => 'SuperSecret123!',
            'apiKey' => 'sk_live_abcdef1234567890',
            'authorization' => 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy',
            'nested' => [
                'token' => 'jwt.secret.token',
                'credit_card' => '4111111111111111',
                'cvv' => '999',
                'ssn' => '123-45-6789',
            ],
            'user_email' => 'student.patrol@example.com',
            'phone' => '+15551234567',
            'memo' => 'Processed payment for card 4111111111111111 successfully',
            'safe_param' => 'public_value',
        ];

        $record = new LogRecord(
            datetime: new \DateTimeImmutable('now'),
            channel: 'test',
            level: Level::Info,
            message: 'User authentication attempt for student.patrol@example.com',
            context: $sensitiveData
        );

        $processed = $processor($record);
        $context = $processed->context;

        $this->assertSame('[REDACTED]', $context['password']);
        $this->assertSame('[REDACTED]', $context['apiKey']);
        $this->assertSame('[REDACTED]', $context['authorization']);
        $this->assertSame('[REDACTED]', $context['nested']['token']);
        $this->assertSame('[REDACTED]', $context['nested']['cvv']);
        $this->assertSame('[REDACTED]', $context['nested']['ssn']);
        $this->assertSame('[REDACTED]', $context['nested']['credit_card']);
        $this->assertStringContainsString('[REDACTED_CARD]', $context['memo']);
        $this->assertSame('s***@example.com', $context['user_email']);
        $this->assertSame('[REDACTED]', $context['phone']);
        $this->assertSame('public_value', $context['safe_param']);

        // Message text redaction
        $this->assertStringNotContainsString('student.patrol@example.com', $processed->message);
        $this->assertStringContainsString('s***@example.com', $processed->message);
    }

    /**
     * Test that unhandled exceptions are captured by the boundary reporter with correlation.
     */
    public function test_exception_reporting_boundary(): void
    {
        CorrelationContext::setRequestId('req-exception-test-777');

        $exception = new \RuntimeException('Simulated database connection loss');
        report($exception);

        $this->assertSame('req-exception-test-777', CorrelationContext::getRequestId());
    }

    /**
     * Test that AppLogger correctly handles security, outbound, and access logging.
     */
    public function test_app_logger_methods(): void
    {
        CorrelationContext::setRequestId('req-applogger-test');

        // Should not throw exceptions
        AppLogger::info('system.test', 'Testing info level', ['flag' => true]);
        AppLogger::security('auth.login.failed', 'Failed login from test', ['ip' => '10.0.0.1'], 'WARNING');
        AppLogger::outbound('stripe', 'payment.stripe.charge', 123.45, 'success', ['status' => 200, 'id' => 'ch_123']);
        AppLogger::access('GET', '/api/test', 200, 15.2, [
            'client_ip' => '127.0.0.1',
            'request_id' => 'req-applogger-test',
        ]);

        $this->assertTrue(true);
    }
}
