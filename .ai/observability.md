# ProfitsPatrol Observability & SRE Architecture

> Master reference: see [`LOGGING.md`](file:///g:/Vibe%20coding/Profitspatrol/LOGGING.md) for full JSON schema, LogQL queries, and setup instructions.

## Logging Strategy
- **Backend Service**: Monolog 3.12 custom structured logging channel (`LOG_CHANNEL=structured`).
  - **Staging / Production**: Emits strict, single-line JSON via `StructuredJsonFormatter.php` to `stdout`.
  - **Local Development**: Emits colorized console output with status badges and highlighted context via `PrettyConsoleFormatter.php` (`LOG_FORMAT=pretty`).
  - **Global Facade**: `AppLogger.php` (`debug`, `info`, `warn`, `error`, `fatal`, `security`, `outbound`, `access`).
- **Frontend Service**: Centralized `Logger` service (`src/services/logger.ts`).
  - Formats logs matching the top-level schema.
  - Automatically captures uncaught window `error` and `unhandledrejection` events.
- **Privacy & Redaction**: `RedactionProcessor.php` automatically redacts sensitive keys (`password`, `token`, `secret`, `apiKey`, `authorization`, `credit_card`, `cvv`, `ssn`, `national_id`, `phone`) and masks credit cards, phone numbers, emails (`u***@domain.com`), and Bearer tokens in message text.

## Centralized Infrastructure
- **Log Shipper / Collector**: Vector with a **1GB on-disk buffer** (`buffer.type = "disk"`) to guarantee zero log loss under network backpressure.
- **Central Log Store**: Grafana Loki 3.x with **30-day (720h) retention** via compactor.
  - Low-cardinality indexing: `{service="...", env="...", level="..."}`.
  - High-cardinality fields (`request_id`, `user_id`, `route`) are preserved in the indexed JSON payload.
- **Visualization & Alerting**: Grafana 11 with auto-provisioned Loki datasource and production dashboard (`profitspatrol-logs-dashboard.json`).
- **Orchestration**: `monitoring/docker-compose.logging.yml` (and Kubernetes DaemonSet `monitoring/k8s/vector-daemonset.yaml`).

## Distributed Tracing & Correlation
- **Request ID**: Generated as UUIDv4 or propagated via `X-Request-ID` across both client and server HTTP requests.
- **W3C Distributed Tracing**: Handled via `OpenTelemetryTracer.php` parsing and injecting standard `traceparent` (`00-{trace_id}-{span_id}-{flags}`) headers.
- **Access Logging**: Every HTTP request emits exactly one `http.request.completed` access line with method, route, status code, and `duration_ms`.

## SRE Alert Rules
Configured in `monitoring/loki/alert-rules.yaml`:
- **`ErrorRateSpike`**: Rate of error logs > 5/min over 5m.
- **`Http5xxRatioSpike`**: 5xx HTTP response ratio > 2% over 5m.
- **`FailedLoginBurst`**: > 5 failed logins from a single IP within 3m.
- **`ServiceNoLogsHeartbeat`**: Zero logs received from service in 10m.

## Verification & Diagnostics
- **Automated Tests**: `php vendor/bin/phpunit tests/Feature/LoggingAndCorrelationTest.php` (7/7 passing).
- **Health Engine**: `php backend/scripts/verify-logging.php` (Schema, redaction, exception boundary, and collector connectivity checks).
