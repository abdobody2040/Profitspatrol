import { SentryService } from './sentry';

export enum LogLevel {
    DEBUG = 'DEBUG',
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
    FATAL = 'FATAL'
}

/**
 * Sanitize data for logging by redacting sensitive information
 * @param data - Data to sanitize
 * @returns Sanitized data safe for logging
 */
function sanitizeForLog(data: unknown): unknown {
    const SENSITIVE_KEYS = new Set([
        'password', 'password_confirmation', 'token', 'secret', 'apikey', 'api_key',
        'authorization', 'creditcard', 'credit_card', 'cvv', 'cvc', 'ssn', 'national_id',
        // Child PII — COPPA requires these never appear in logs
        'email', 'parentemail', 'phone', 'phonenumber', 'avatarurl', 'photourl',
    ]);

    if (typeof data === 'string') {
        // Redact email addresses in strings
        return data.replace(/([a-zA-Z0-9_.+-])[a-zA-Z0-9_.+-]*(@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)/g, '$1***$2');
    }

    if (Array.isArray(data)) {
        return data.map(sanitizeForLog);
    }

    if (typeof data === 'object' && data !== null) {
        const sanitized: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(data)) {
            const lowerKey = key.toLowerCase();
            if (SENSITIVE_KEYS.has(lowerKey)) {
                sanitized[key] = '[REDACTED]';
            } else {
                sanitized[key] = sanitizeForLog(value);
            }
        }
        return sanitized;
    }

    return data;
}

class LoggerService {
    private isDev: boolean;
    private service: string = 'profits-patrol-web';
    private env: string;
    private version: string;

    constructor() {
        this.isDev = import.meta.env.DEV;
        this.env = import.meta.env.MODE || (this.isDev ? 'development' : 'production');
        this.version = import.meta.env.VITE_APP_VERSION || '6d0375d';

        if (typeof window !== 'undefined') {
            this.initGlobalHandlers();
        }
    }

    private initGlobalHandlers(): void {
        window.addEventListener('error', (event) => {
            this.error('app.uncaught_exception', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                stack: event.error?.stack,
            });
        });

        window.addEventListener('unhandledrejection', (event) => {
            const reason = event.reason;
            this.error('app.unhandled_promise_rejection', {
                message: reason instanceof Error ? reason.message : String(reason),
                stack: reason instanceof Error ? reason.stack : undefined,
            });
        });
    }

    private formatMessage(level: LogLevel, eventOrMessage: string, context?: Record<string, unknown>) {
        const timestamp = new Date().toISOString();
        const event = context?.event ? String(context.event) : eventOrMessage;
        const message = context?.event ? eventOrMessage : eventOrMessage;
        const cleanContext = { ...(context || {}) };
        delete cleanContext.event;

        return {
            timestamp,
            level,
            service: this.service,
            env: this.env,
            version: this.version,
            event,
            message,
            request_id: cleanContext.request_id || undefined,
            context: sanitizeForLog(cleanContext),
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
            url: typeof window !== 'undefined' ? window.location.href : 'unknown'
        };
    }

    info(message: string, context?: Record<string, unknown>) {
        const log = this.formatMessage(LogLevel.INFO, message, context);

        if (this.isDev) {
            console.info(`[${log.timestamp}] [${LogLevel.INFO}] [${log.event}] ${message}`, log.context || '');
        }

        if (!this.isDev) {
            this.sendToRemote(log);
        }
    }

    warn(message: string, context?: Record<string, unknown>) {
        const log = this.formatMessage(LogLevel.WARN, message, context);

        if (this.isDev) {
            console.warn(`[${log.timestamp}] [${LogLevel.WARN}] [${log.event}] ${message}`, log.context || '');
        }

        if (!this.isDev) {
            this.sendToRemote(log);
        }
    }

    error(message: string, errorOrContext?: unknown) {
        const errorContext = errorOrContext instanceof Error
            ? { message: errorOrContext.message, name: errorOrContext.name, stack: errorOrContext.stack }
            : (typeof errorOrContext === 'object' && errorOrContext !== null ? errorOrContext as Record<string, unknown> : { detail: String(errorOrContext) });

        const log = this.formatMessage(LogLevel.ERROR, message, errorContext);

        if (this.isDev) {
            console.error(`[${log.timestamp}] [${LogLevel.ERROR}] [${log.event}] ${message}`, errorContext);
        }

        if (!this.isDev) {
            if (errorOrContext instanceof Error) {
                void SentryService.captureException(errorOrContext, log.context as Record<string, unknown>);
            } else {
                this.sendToRemote(log);
            }
        }
    }

    fatal(message: string, errorOrContext?: unknown) {
        const errorContext = errorOrContext instanceof Error
            ? { message: errorOrContext.message, name: errorOrContext.name, stack: errorOrContext.stack }
            : (typeof errorOrContext === 'object' && errorOrContext !== null ? errorOrContext as Record<string, unknown> : { detail: String(errorOrContext) });

        const log = this.formatMessage(LogLevel.FATAL, message, errorContext);

        if (this.isDev) {
            console.error(`[${log.timestamp}] [${LogLevel.FATAL}] [${log.event}] ${message}`, errorContext);
        }

        if (!this.isDev) {
            this.sendToRemote(log);
        }
    }

    debug(message: string, context?: Record<string, unknown>) {
        if (this.isDev) {
            const log = this.formatMessage(LogLevel.DEBUG, message, context);
            console.debug(`[${log.timestamp}] [${LogLevel.DEBUG}] [${log.event}] ${message}`, log.context || '');
        }
    }

    /**
     * Send logs to remote monitoring service.
     *
     * Uses Sentry when VITE_SENTRY_DSN is configured (see src/services/sentry.ts).
     * Completely inert otherwise — no silent drops in production.
     *
     * To enable Sentry: add VITE_SENTRY_DSN=<your-dsn> to .env.production
     * and call SentryService.initialize() once in main.tsx.
     */
    private sendToRemote(log: Record<string, unknown>) {
        // Cast through unknown is intentional: formatMessage() always produces a RemoteLog-shaped
        // object, but its return type is Record<string,unknown> for generality.
        void SentryService.captureLog(log as unknown as import('./sentry').RemoteLog);
    }

    /**
     * Log security events to backend monitoring system
     * Only sends to backend in production mode
     */
    async logSecurityEvent(
        eventType: 'prompt_injection' | 'profanity_detected' | 'pii_leak' | 'rate_limit_exceeded' | 'content_violation' | 'ai_response_violation' | 'unauthorized_access' | 'suspicious_activity',
        severity: 'low' | 'medium' | 'high' | 'critical',
        eventData: Record<string, any>
    ): Promise<void> {
        // Always log locally for debugging
        this.warn(`[SECURITY ${severity.toUpperCase()}] ${eventType}`, eventData);

        // Send to backend monitoring (ALWAYS, even in dev for testing)
        try {
            const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
            const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

            if (!supabaseUrl || !supabaseKey) {
                // ✅ SECURITY FIX: Use console.warn only in dev (not exposed in prod)
                // Avoids recursive Logger call which could cause infinite loop
                if (this.isDev) {
                    console.warn('[Logger] Supabase not configured — security events will not be persisted to remote');
                }
                return;
            }

            // Get session ID from sessionStorage
            const sessionId = typeof window !== 'undefined'
                ? sessionStorage.getItem('session_id') || undefined
                : undefined;

            const response = await fetch(`${supabaseUrl}/functions/v1/log-security-event`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${supabaseKey}`,
                },
                body: JSON.stringify({
                    event_type: eventType,
                    severity,
                    event_data: eventData,
                    session_id: sessionId,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                // ✅ SECURITY FIX: Only log failure in dev mode to prevent exposing
                // raw Supabase error responses (which may contain schema info) in prod console
                if (this.isDev) {
                    console.warn('[Logger] Failed to log security event to remote', { status: response.status });
                }
            } else if (this.isDev) {
                // Only log success details in dev — not needed in production
                console.debug(`[Logger] Security event logged: ${eventType} (${severity})`);
            }
        } catch (error) {
            // ✅ SECURITY FIX: Avoid recursive Logger.error (could cause stack overflow).
            // Use raw console.warn in dev only — in production, these fetch failures are silent
            // because prod monitoring is handled by Sentry in sendToRemote(), not logSecurityEvent().
            if (this.isDev) {
                console.warn('[Logger] Network error sending security event', { eventType, severity });
            }
        }
    }
}

export const Logger = new LoggerService();
