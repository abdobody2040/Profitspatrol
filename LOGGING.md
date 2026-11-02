# Production-Grade Logging & Observability Architecture

This document describes the enterprise logging and telemetry architecture implemented for **Profits Patrol**. It provides the complete reference for developers, SREs, and security engineers covering the structured JSON schema, request correlation lifecycle, sensitive data redaction, centralized infrastructure (Loki + Vector + Grafana), alert rules, and verification procedures.

---

## 1. Architectural Overview

```
                                  BROWSER CLIENT (React 19)
                       [Generates/Propagates X-Request-ID & traceparent]
                                              │
                                              ▼ HTTP
                               ┌─────────────────────────────┐
                               │     Laravel 13 API Core     │
                               │  RequestCorrelationMiddleware│
                               └──────────────┬──────────────┘
                                              │
                     ┌────────────────────────┼────────────────────────┐
                     │                        │                        │
                     ▼                        ▼                        ▼
           Controller Actions          Database Queries         Background Jobs
          (Stripe, AI, Auth)           (Slow Query Watch)        (Sync/Async DB)
                     │                        │                        │
                     └────────────────────────┼────────────────────────┘
                                              │
                                              ▼
                                 ┌─────────────────────────┐
                                 │       AppLogger         │
                                 │ (Security, Outbound,    │
                                 │  Access, Lifecycle)     │
                                 └────────────┬────────────┘
                                              │
                                              ▼
                                ┌───────────────────────────┐
                                │     Monolog Pipeline      │
                                │ 1. CorrelationContextProc │
                                │ 2. RedactionProcessor     │
                                │ 3. StructuredJsonFormatter│
                                └─────────────┬─────────────┘
                                              │
                                              ▼ stdout
                      ┌───────────────────────────────────────────────┐
                      │              Vector Collector                 │
                      │  - Reads Docker / k8s container stdout       │
                      │  - 1GB On-Disk Buffer (Zero Data Loss)        │
                      │  - Parses JSON & Extracts Low-Card Labels     │
                      └───────────────────────┬───────────────────────┘
                                              │
                                              ▼ HTTP / Push
                               ┌─────────────────────────────┐
                               │      Grafana Loki 3.x       │
                               │   (30-Day Hot Retention)    │
                               └──────────────┬──────────────┘
                                              │
                                              ▼
                               ┌─────────────────────────────┐
                               │         Grafana 11          │
                               │  - Profits Patrol Dashboard │
                               │  - Request ID Drilldown     │
                               │  - Automated Alert Rules    │
                               └─────────────────────────────┘
```

---

## 2. Structured Log Schema Reference

Every log record emitted in staging and production follows a strict, single-line JSON format. All fields are strongly typed, un-truncated, and correlated.

### Standard Top-Level Fields

| Field | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `timestamp` | `string` | UTC timestamp in ISO-8601 with millisecond precision (`Z` suffix) | `"2026-10-14T07:28:46.282Z"` |
| `level` | `string` | Standardized uppercase severity level | `"DEBUG"`, `"INFO"`, `"WARN"`, `"ERROR"`, `"FATAL"` |
| `service` | `string` | Service identifier | `"profits-patrol-api"`, `"profits-patrol-web"` |
| `env` | `string` | Deployment environment | `"local"`, `"staging"`, `"production"` |
| `version` | `string` | Git commit SHA or release semver tag | `"6d0375d"`, `"v1.2.0"` |
| `event` | `string` | Stable, dot-delimited event name for query indexing | `"payment.checkout.created"` |
| `message` | `string` | Human-readable description (sanitized, no raw secrets) | `"Stripe checkout session initialized"` |
| `request_id` | `string` | UUIDv4 correlating the complete request lifecycle across client & server | `"5a933f1d-83a4-4452-b2a0-ea9883017cc7"` |
| `trace_id` | `string` | W3C 128-bit hex trace identifier (from `traceparent`) | `"4bf92f3577b34da6a3ce929d0e0e4736"` |
| `span_id` | `string` | W3C 64-bit hex span identifier | `"00f067aa0ba902b7"` |
| `user_id` | `int\|string\|null` | Authenticated subject identifier | `42` |
| `tenant_id` | `int\|string\|null` | Organization or parent family identifier | `10` |
| `context` | `object` | Structured event-specific attributes (no PII or raw bodies) | `{"amount_cents": 4999}` |
| `exception` | `object` | Captured exception metadata (present on `ERROR` and `FATAL`) | `{"class": "...", "stack_trace": [...]}` |

---

### Example JSON Payloads

#### 1. HTTP Access Line (`http.request.completed`)
```json
{
  "timestamp": "2026-10-14T07:24:17.499Z",
  "level": "INFO",
  "service": "profits-patrol-api",
  "env": "production",
  "version": "6d0375d",
  "event": "http.request.completed",
  "message": "HTTP POST /api/v1/auth/login 200 (18.42ms)",
  "request_id": "5a933f1d-83a4-4452-b2a0-ea9883017cc7",
  "trace_id": "4bf92f3577b34da6a3ce929d0e0e4736",
  "span_id": "00f067aa0ba902b7",
  "user_id": 42,
  "tenant_id": null,
  "context": {
    "method": "POST",
    "route": "/api/v1/auth/login",
    "status": 200,
    "duration_ms": 18.42,
    "client_ip": "192.0.2.1",
    "path": "/api/v1/auth/login",
    "user_agent": "Mozilla/5.0 ...",
    "query_params": []
  }
}
```

#### 2. Outbound Call (`payment.stripe.checkout_session`)
```json
{
  "timestamp": "2026-10-14T07:25:01.120Z",
  "level": "INFO",
  "service": "profits-patrol-api",
  "env": "production",
  "version": "6d0375d",
  "event": "payment.stripe.checkout_session",
  "message": "Outbound call to stripe succeeded",
  "request_id": "8add4dbc-434a-488e-a1d8-c701997a4e1e",
  "trace_id": "3c98a1290bbfa187e029381cde20042f",
  "span_id": "98120fa2bb10cd83",
  "user_id": 42,
  "context": {
    "outbound_target": "stripe",
    "duration_ms": 142.31,
    "outcome": "success",
    "session_id": "cs_live_a1b2c3d4e5f6",
    "amount_cents": 1999,
    "plan_id": "patrol-cadet-monthly"
  }
}
```

#### 3. Security Event (`security.parental_gate.lockout`)
```json
{
  "timestamp": "2026-10-14T07:26:12.890Z",
  "level": "WARN",
  "service": "profits-patrol-api",
  "env": "production",
  "version": "6d0375d",
  "event": "security.parental_gate.lockout",
  "message": "[SECURITY:WARNING] Parental gate lockout triggered after consecutive failures",
  "request_id": "b02670d1-0a20-4d26-be4e-721a659a12aa",
  "trace_id": null,
  "span_id": null,
  "user_id": 88,
  "context": {
    "attempts": 4,
    "lockout_seconds": 300,
    "security_severity": "WARNING",
    "client_ip": "203.0.113.195"
  }
}
```

#### 4. Unhandled Exception with Stack Trace (`app.exception.unhandled`)
```json
{
  "timestamp": "2026-10-14T07:28:11.395Z",
  "level": "ERROR",
  "service": "profits-patrol-api",
  "env": "production",
  "version": "6d0375d",
  "event": "app.exception.unhandled",
  "message": "Connection to redis cluster timed out after 2000ms",
  "request_id": "req-exce-777",
  "trace_id": "e0a9f82bc19203a1fbc10298a0029b91",
  "span_id": "11a0bb39c011928d",
  "user_id": null,
  "exception": {
    "class": "Illuminate\\Redis\\Connections\\ConnectionException",
    "message": "Connection to redis cluster timed out after 2000ms",
    "code": 500,
    "file": "/var/www/backend/vendor/laravel/framework/src/Illuminate/Redis/Connectors/PhpRedisConnector.php:142",
    "stack_trace": [
      "#0 /var/www/backend/app/Http/Controllers/Api/StockController.php(48): Illuminate\\Redis\\RedisManager->connection()",
      "#1 [internal function]: App\\Http\\Controllers\\Api\\StockController->index()",
      "#2 {main}"
    ]
  },
  "context": {
    "exception_class": "Illuminate\\Redis\\Connections\\ConnectionException",
    "file": "/var/www/backend/vendor/laravel/framework/src/Illuminate/Redis/Connectors/PhpRedisConnector.php",
    "line": 142
  }
}
```

---

## 3. Log Levels & Decision Matrix

| Level | Severity Code | Intended Use Case | Production Default |
| :--- | :--- | :--- | :--- |
| `DEBUG` | 100 | Granular diagnostic information for local debugging (payload dumps, internal cache keys). | Disabled in Prod |
| `INFO` | 200 | Business events, successful HTTP requests, scheduled jobs, state transitions. | Enabled |
| `WARN` | 300 | Handled anomalies, transient downstream retries, rate limits, 4xx client errors. | Enabled |
| `ERROR` | 400 | Failed business operations, 5xx responses, failed third-party API calls, unhandled exceptions. | Enabled (Alertable) |
| `FATAL` | 500 | Unrecoverable crashes, database partition failure, corrupt configuration, process exit. | Enabled (Immediate Pager) |

### Exception Boundary Rules
1. **Log Once at the Boundary:** Exceptions are never logged in low-level utility classes and then re-logged when bubbling up. Exceptions are captured and logged once at the outermost architectural boundary (`bootstrap/app.php` exception handler or controller boundary).
2. **Crash Resilience:** The `RedactionProcessor` and `StructuredJsonFormatter` protect against recursive reference cycles in exceptions (`depth > 10` safeguard) and serialize traces into string arrays.

---

## 4. Request Context & Correlation

### Header Lifecycle
1. **Client-Initiated (`src/lib/api.ts`):** The frontend Axios/Fetch client automatically attaches an `X-Request-ID` UUID to outgoing requests if not already set.
2. **Server Middleware (`RequestCorrelationMiddleware.php`):**
   - Extracts `X-Request-ID` or generates a fresh UUIDv4.
   - Parses W3C standard `traceparent: 00-{trace_id}-{span_id}-{flags}` headers.
   - Binds `request_id`, `trace_id`, `span_id`, and `client_ip` to thread-scoped `CorrelationContext`.
   - Injects `X-Request-ID` and `traceparent` back into the HTTP response headers.
3. **Authentication Binding:** Once Sanctum authenticates the user, `CorrelationContext::setUser($user)` attaches `user_id` and `tenant_id` to all subsequent logs within that request thread.
4. **Access Log Emission:** A single `http.request.completed` (or client/server error) access line is logged at request termination with total execution duration in milliseconds.

---

## 5. Security & Sensitive Data Redaction

All log output passes through `RedactionProcessor` before reaching standard output.

### Redacted Direct Keys
Any dictionary key matching or containing the following names has its value replaced with `[REDACTED]`:
- `password`, `password_confirmation`, `current_password`, `new_password`
- `token`, `access_token`, `refresh_token`, `auth_token`, `raw_token`
- `secret`, `client_secret`, `webhook_secret`, `stripe_secret`, `stripe_secret_key`
- `api_key`, `apikey`
- `authorization`
- `cookie`, `set-cookie`
- `credit_card`, `card_number`, `cardnumber`, `cvv`, `cvc`, `pin`
- `ssn`, `national_id`
- `phone`, `phone_number`, `mobile`, `telephone`

### Regex & Deep Pattern Masking
- **Bearer Tokens:** `Bearer [A-Za-z0-9\-\._~\+\/]+=*` $\rightarrow$ `Bearer [REDACTED_TOKEN]`
- **Credit Card Numbers:** 13-19 digit sequences $\rightarrow$ `[REDACTED_CARD]`
- **Email Addresses:** `john.smith@domain.com` $\rightarrow$ `j***@domain.com`
- **Phone Numbers:** `+1 (555) 123-4567` $\rightarrow$ `[REDACTED_PHONE]`
- **Payload Truncation:** Strings exceeding 20,000 characters are capped with `...[TRUNCATED]` to prevent log injection and buffer exhaustion attacks.

---

## 6. Centralized Logging Infrastructure

The centralized logging stack runs on lightweight, high-performance open-source components with zero SaaS licensing fees.

```
Host/Container stdout  -->  Vector Collector (Disk Buffer)  -->  Grafana Loki  -->  Grafana 11
```

### Components

1. **Grafana Loki 3.x (`monitoring/loki/loki-config.yaml`):**
   - Multi-tenant capable log aggregation system.
   - Low-cardinality indexing: indexed strictly by `{service="...", env="...", level="..."}`. High-cardinality identifiers (`request_id`, `user_id`, `route`) are stored as JSON body fields, keeping memory usage minimal.
   - Retention: Configured for **720 hours (30 days)** hot storage via `compactor` and `retention_period`.

2. **Vector Collector (`monitoring/vector/vector.yaml`):**
   - High-performance Rust log router and collector.
   - **Disk Buffering:** Configured with a 1GB on-disk buffer (`buffer.type = "disk"` in `/var/lib/vector/buffer/loki`) to guarantee zero log loss during network partitions or Loki restarts.
   - JSON parsing: Automatically parses stdout logs, extracts labels, and removes sensitive headers.

3. **Grafana 11 (`monitoring/grafana/`):**
   - Auto-provisioned datasource linking Loki directly to OpenTelemetry traces.
   - Pre-installed dashboard: **Profits Patrol - Production Observability**.

### Starting the Stack Locally / VPS

To launch Loki, Vector, and Grafana in the background:

```powershell
# From the repository root:
docker-compose -f monitoring/docker-compose.logging.yml up -d
```

| Service | Port | Internal / External URL |
| :--- | :--- | :--- |
| **Grafana UI** | `3000` | [http://localhost:3000](http://localhost:3000) (User: `admin`, Pass: `patroladmin123`) |
| **Loki Ingest / API** | `3100` | [http://localhost:3100](http://localhost:3100) |
| **Vector Health API** | `8686` | [http://localhost:8686/health](http://localhost:8686/health) |

### Kubernetes Deployment (DaemonSet)
For Kubernetes clusters, deploy `monitoring/k8s/vector-daemonset.yaml`:
```bash
kubectl apply -f monitoring/k8s/vector-daemonset.yaml
```

---

## 7. Grafana Dashboards & Saved LogQL Queries

The auto-provisioned Grafana dashboard (`monitoring/grafana/dashboards/profitspatrol-logs-dashboard.json`) includes:
- **Total Requests per Second (RPS)**
- **HTTP 5xx Error Rate Ratio**
- **p95 and p99 Response Latency (ms)**
- **Top 10 Exception Types**
- **Security Audit Events Timeline**
- **Real-Time Live Tail Log Stream**

### Essential LogQL Queries

#### 1. Trace all logs for a specific `request_id`
```logql
{service="profits-patrol-api"} | json | request_id = "5a933f1d-83a4-4452-b2a0-ea9883017cc7"
```

#### 2. Find all failed logins per IP in the last hour
```logql
{service="profits-patrol-api"} | json | event = "auth.login.failed"
```

#### 3. Calculate HTTP 5xx error percentage over 5 minutes
```logql
sum(rate({service="profits-patrol-api"} | json | context_status >= 500 [5m]))
/
sum(rate({service="profits-patrol-api"} [5m])) * 100
```

#### 4. Find slow database queries (>250ms)
```logql
{service="profits-patrol-api"} | json | event = "database.query.slow"
```

#### 5. Track unhandled exceptions with stack traces
```logql
{service="profits-patrol-api", level="ERROR"} | json | event =~ "app.exception.*"
```

---

## 8. SRE Alerting Rules

Configured in `monitoring/loki/alert-rules.yaml`:

| Alert Name | Severity | Condition | Threshold |
| :--- | :--- | :--- | :--- |
| `ErrorRateSpike` | `critical` | Rate of `level="ERROR"` logs exceeds normal baseline | `> 5 errors/minute for 5m` |
| `Http5xxRatioSpike` | `critical` | Ratio of 5xx HTTP responses to total requests exceeds threshold | `> 2% over 5m` |
| `FailedLoginBurst` | `warning` | Rapid burst of failed authentication attempts against single IP | `> 5 failures in 3m` |
| `ServiceNoLogsHeartbeat`| `critical` | Total log volume drops to zero (service crash or collector down) | `0 logs in 10m` |

---

## 9. Environment Variables Reference

Add or adjust these variables in `backend/.env` (or Kubernetes ConfigMap/Secret):

| Variable | Default (Local) | Staging / Prod Recommended | Purpose |
| :--- | :--- | :--- | :--- |
| `LOG_CHANNEL` | `structured` | `structured` | Monolog channel routing to `CreateStructuredLogger` |
| `LOG_FORMAT` | `pretty` | `json` | Console output style: `pretty` (colorized) or `json` (single-line JSON) |
| `LOG_LEVEL` | `debug` | `info` | Minimum severity threshold (`debug`, `info`, `warn`, `error`, `fatal`) |
| `LOG_SERVICE_NAME` | `profits-patrol-api` | `profits-patrol-api` | Emitted in `service` field |
| `APP_VERSION` | `local-dev` | Git SHA (e.g., `git rev-parse --short HEAD`) | Emitted in `version` field |
| `SLOW_QUERY_THRESHOLD_MS`| `100` | `250` | Threshold above which DB queries emit `database.query.slow` |
| `LOKI_URL` | `http://127.0.0.1:3100` | `http://loki:3100` | Internal Loki endpoint for verification script |

Frontend client configuration in `.env`:
| Variable | Default | Purpose |
| :--- | :--- | :--- |
| `VITE_LOG_LEVEL` | `DEBUG` (`local`), `INFO` (`prod`) | Frontend logger threshold in browser console |
| `VITE_LOG_ENDPOINT`| `""` | Optional remote telemetry ingest endpoint |

---

## 10. Verification & Diagnostics

### Run Feature Tests
Verify correlation headers, JSON schema, redaction, and exception boundaries via PHPUnit:
```bash
cd backend
php vendor/bin/phpunit tests/Feature/LoggingAndCorrelationTest.php
```

### Run SRE Verification Engine
Execute the end-to-end automated verification script:
```bash
php backend/scripts/verify-logging.php
```
This tests:
1. Strict JSON formatting and UTC ISO-8601 millisecond validation.
2. Recursive PII and credential redaction (passwords, cards, phones, tokens, emails).
3. Exception boundary handling with full stack trace capture.
4. HTTP access logging with precise millisecond duration.
5. Ingestion connectivity with the centralized Loki cluster.

---

## 11. Manifest of Changes

### Backend Core
- [`backend/app/Logging/CorrelationContext.php`](file:///g:/Vibe%20coding/Profitspatrol/backend/app/Logging/CorrelationContext.php): Thread-scoped context for `request_id`, `trace_id`, `span_id`, `user_id`, `tenant_id`, and `client_ip`.
- [`backend/app/Logging/RedactionProcessor.php`](file:///g:/Vibe%20coding/Profitspatrol/backend/app/Logging/RedactionProcessor.php): Monolog processor with recursive masking of secrets, credit cards, phones, and emails.
- [`backend/app/Logging/CorrelationContextProcessor.php`](file:///g:/Vibe%20coding/Profitspatrol/backend/app/Logging/CorrelationContextProcessor.php): Monolog processor binding correlation attributes to every `LogRecord`.
- [`backend/app/Logging/StructuredJsonFormatter.php`](file:///g:/Vibe%20coding/Profitspatrol/backend/app/Logging/StructuredJsonFormatter.php): Single-line JSON formatter matching the production SRE schema.
- [`backend/app/Logging/PrettyConsoleFormatter.php`](file:///g:/Vibe%20coding/Profitspatrol/backend/app/Logging/PrettyConsoleFormatter.php): Colorized, badge-styled formatter for local terminal readability.
- [`backend/app/Logging/CreateStructuredLogger.php`](file:///g:/Vibe%20coding/Profitspatrol/backend/app/Logging/CreateStructuredLogger.php): Channel factory wiring stdout streams, processors, and formatters.
- [`backend/app/Logging/OpenTelemetryTracer.php`](file:///g:/Vibe%20coding/Profitspatrol/backend/app/Logging/OpenTelemetryTracer.php): TraceContext helper and span execution wrapper.
- [`backend/app/Services/Logging/AppLogger.php`](file:///g:/Vibe%20coding/Profitspatrol/backend/app/Services/Logging/AppLogger.php): Standard logging facade for debug, info, warn, error, fatal, security, outbound, and access logs.
- [`backend/app/Http/Middleware/RequestCorrelationMiddleware.php`](file:///g:/Vibe%20coding/Profitspatrol/backend/app/Http/Middleware/RequestCorrelationMiddleware.php): Handles `X-Request-ID`, W3C `traceparent`, and emits `http.request.completed` access lines.
- [`backend/bootstrap/app.php`](file:///g:/Vibe%20coding/Profitspatrol/backend/bootstrap/app.php): Configured middleware and exception boundary reporting.
- [`backend/app/Providers/AppServiceProvider.php`](file:///g:/Vibe%20coding/Profitspatrol/backend/app/Providers/AppServiceProvider.php): Registered listeners for startup lifecycle, slow DB queries, outbound HTTP requests, and queue jobs.
- Controllers migrated to `AppLogger`: `AuthController.php`, `AiProxyController.php`, `StripeController.php`, `SecurityController.php`, `ParentalGateController.php`, `ProfileController.php`.

### Frontend Core
- [`src/services/logger.ts`](file:///g:/Vibe%20coding/Profitspatrol/src/services/logger.ts): Upgraded browser logger with JSON schema, PII redaction, and global `error`/`unhandledrejection` listeners.
- [`src/lib/api.ts`](file:///g:/Vibe%20coding/Profitspatrol/src/lib/api.ts): Attached automatic `X-Request-ID` generation and propagation on all API fetch requests.

### Centralized Infrastructure
- [`monitoring/docker-compose.logging.yml`](file:///g:/Vibe%20coding/Profitspatrol/monitoring/docker-compose.logging.yml): Complete multi-container stack for Loki, Vector, and Grafana.
- [`monitoring/loki/loki-config.yaml`](file:///g:/Vibe%20coding/Profitspatrol/monitoring/loki/loki-config.yaml): Loki 3.x configuration with 30-day retention.
- [`monitoring/loki/alert-rules.yaml`](file:///g:/Vibe%20coding/Profitspatrol/monitoring/loki/alert-rules.yaml): Automated alert rules for error rates, 5xx ratios, login brute-forcing, and heartbeat timeouts.
- [`monitoring/vector/vector.yaml`](file:///g:/Vibe%20coding/Profitspatrol/monitoring/vector/vector.yaml): Vector log router with 1GB disk buffer.
- [`monitoring/grafana/provisioning/datasources/loki-datasource.yaml`](file:///g:/Vibe%20coding/Profitspatrol/monitoring/grafana/provisioning/datasources/loki-datasource.yaml): Auto-provisioned Loki datasource with TraceID and RequestID links.
- [`monitoring/grafana/provisioning/dashboards/dashboard-provider.yaml`](file:///g:/Vibe%20coding/Profitspatrol/monitoring/grafana/provisioning/dashboards/dashboard-provider.yaml): Dashboard auto-loader.
- [`monitoring/grafana/dashboards/profitspatrol-logs-dashboard.json`](file:///g:/Vibe%20coding/Profitspatrol/monitoring/grafana/dashboards/profitspatrol-logs-dashboard.json): Production Grafana dashboard.
- [`monitoring/k8s/vector-daemonset.yaml`](file:///g:/Vibe%20coding/Profitspatrol/monitoring/k8s/vector-daemonset.yaml): Kubernetes DaemonSet spec for container log shipping.

### Tests & Verification
- [`backend/tests/Feature/LoggingAndCorrelationTest.php`](file:///g:/Vibe%20coding/Profitspatrol/backend/tests/Feature/LoggingAndCorrelationTest.php): 7 automated unit/feature tests asserting headers, JSON schema, PII redaction, exception boundary, and AppLogger methods.
- [`backend/scripts/verify-logging.php`](file:///g:/Vibe%20coding/Profitspatrol/backend/scripts/verify-logging.php): Standalone CLI verification and health check tool.
