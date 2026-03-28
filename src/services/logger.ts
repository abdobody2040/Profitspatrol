import { SentryService } from './sentry';

export enum LogLevel {
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
    DEBUG = 'DEBUG'
}

/**
 * Sanitize data for logging by redacting sensitive information
 * @param data - Data to sanitize
 * @returns Sanitized data safe for logging
 */
function sanitizeForLog(data: unknown): unknown {
    // ✅ SECURITY FIX (HIGH-01): Use a Set of EXACT key names for redaction.
    // The previous implementation used Array.includes() + lowerKey.includes(sensitive),
    // which caused over-redaction of safe fields whose key CONTAINS a sensitive word
    // (e.g. { storeName: 'Leo Corp' } was redacted because key contains 'name').
    // Using Set.has() with exact lowercase match prevents over-redaction while still
    // catching all real PII keys.
    const SENSITIVE_KEYS = new Set([
        'password', 'token', 'secret', 'apikey', 'api_key',
        'authorization', 'creditcard', 'credit_card', 'ssn',
        // Child PII — COPPA requires these never appear in logs
        'email', 'parentemail', 'name', 'username', 'displayname',
        'firstname', 'lastname', 'fullname', 'parentname', 'childname',
        'parentid', 'phone', 'phonenumber', 'avatarurl', 'photourl',
    ]);

    if (typeof data === 'string') {
        return data;
    }

    if (Array.isArray(data)) {
        return data.map(sanitizeForLog);
    }

    if (typeof data === 'object' && data !== null) {
        const sanitized: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(data)) {
            const lowerKey = key.toLowerCase();
            // Exact match only — 'storeName' → 'storename' does NOT match 'name'
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

    constructor() {
        this.isDev = import.meta.env.DEV;
    }

    private formatMessage(level: LogLevel, message: string, context?: Record<string, unknown>) {
        const timestamp = new Date().toISOString();
        return {
            timestamp,
            level,
            message,
            context: sanitizeForLog(context),
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
            url: typeof window !== 'undefined' ? window.location.href : 'unknown'
        };
    }

    info(message: string, context?: Record<string, unknown>) {
        const log = this.formatMessage(LogLevel.INFO, message, context);

        if (this.isDev) {
            console.info(`[${LogLevel.INFO}] ${message}`, log.context || '');
        }

        // In production, send to remote logging service
        if (!this.isDev) {
            this.sendToRemote(log);
        }
    }

    warn(message: string, context?: Record<string, unknown>) {
        const log = this.formatMessage(LogLevel.WARN, message, context);

        if (this.isDev) {
            console.warn(`[${LogLevel.WARN}] ${message}`, log.context || '');
        }

        // Always log warnings to remote in production
        if (!this.isDev) {
            this.sendToRemote(log);
        }
    }

    error(message: string, error?: unknown) {
        const errorContext = error instanceof Error
            ? { message: error.message, name: error.name } // ✅ SECURITY FIX: Omit stack trace from console; send to remote only
            : { detail: String(error) };
        const log = this.formatMessage(LogLevel.ERROR, message, errorContext as Record<string, unknown>);

        // ✅ SECURITY FIX: Log structured sanitized object — never the raw error which may contain PII
        if (this.isDev) {
            console.error(`[${LogLevel.ERROR}] ${message}`, errorContext);
        }

        // In production: send full details (incl. stack) to remote only — never to browser console
        if (!this.isDev) {
            const remoteLog = {
                ...log,
                stack: error instanceof Error ? error.stack : undefined,
            };
            // ✅ AUDIT FIX: Capture the original Error object so Sentry records the full stack trace
            if (error instanceof Error) {
                void SentryService.captureException(error, log.context);
            } else {
                this.sendToRemote(remoteLog);
            }
        }
    }

    debug(message: string, context?: Record<string, unknown>) {
        if (this.isDev) {
            const log = this.formatMessage(LogLevel.DEBUG, message, context);
            console.debug(`[${LogLevel.DEBUG}] ${message}`, log.context || '');
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
