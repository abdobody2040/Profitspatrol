/**
 * Sentry Error Monitoring — Optional Integration
 *
 * To enable Sentry, add to your .env.local / production secrets:
 *   VITE_SENTRY_DSN=https://your-key@oXXXXXX.ingest.sentry.io/XXXXXXX
 *
 * No DSN = Sentry is completely inert (no errors, no runtime cost).
 *
 * ── How to enable real Sentry ──────────────────────────────────────────────
 * 1. npm install @sentry/react
 * 2. Delete src/stubs/sentry-react.ts
 * 3. Remove the @sentry/react alias from vite.config.ts AND vitest.config.ts
 * 4. Set VITE_SENTRY_DSN in your .env.production
 * ──────────────────────────────────────────────────────────────────────────
 *
 * Usage:
 *   import { SentryService } from './sentry';
 *   SentryService.initialize();          // call once in main.tsx
 *   SentryService.captureLog(log);       // called by logger.ts
 *   SentryService.captureException(err); // called by logger.ts
 */

// ✅ FIX: Import Sentry statically so Vite's import-analysis can resolve it.
// The resolve.alias in vite.config.ts redirects this to src/stubs/sentry-react.ts
// when @sentry/react is not installed. Dynamic import() was breaking Vite 7
// because import-analysis runs before alias resolution on dynamic specifiers.
import * as Sentry from '@sentry/react';

/** Shape of a structured log object from logger.ts */
export interface RemoteLog {
  timestamp: string;
  level: string;
  message: string;
  context?: unknown;
  stack?: string;
  url?: string;
  userAgent?: string;
}

let _initialized = false;
const isSentryReal = typeof (Sentry as any).Hub !== 'undefined'
    || typeof (Sentry as any).init === 'function';

// ─── Public API ──────────────────────────────────────────────────────────────

export const SentryService = {
  /**
   * Call once at app startup (e.g., top of main.tsx, before <App />).
   * Does nothing if VITE_SENTRY_DSN is not set or stub is active.
   */
  initialize(): void {
    if (_initialized) return;
    _initialized = true;

    const dsn = import.meta.env.VITE_SENTRY_DSN as string | undefined;
    if (!dsn || !isSentryReal) return; // Sentry not configured — completely inert

    Sentry.init({
      dsn,
      environment: import.meta.env.MODE, // 'production' | 'development'
      // ✅ COPPA / GDPR: disable automatic PII collection
      sendDefaultPii: false,
      // Only trace a sample of transactions — reduce noise & cost
      tracesSampleRate: import.meta.env.PROD ? 0.1 : 0,
      // Suppress noisy browser extension errors
      ignoreErrors: [
        'ResizeObserver loop limit exceeded',
        'Non-Error exception captured',
        'Network request failed',
      ],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      beforeSend(event: any) {
        // ✅ COPPA: Strip any PII that Sentry may auto-collect from breadcrumbs
        if (event.user) {
          delete event.user.email;
          delete event.user.username;
          delete event.user.ip_address;
        }
        return event;
      },
    });
  },

  /**
   * Capture a structured log entry (INFO / WARN / ERROR).
   * Called by logger.ts → sendToRemote().
   */
  captureLog(log: RemoteLog): void {
    const dsn = import.meta.env.VITE_SENTRY_DSN as string | undefined;
    if (!dsn || !_initialized || !isSentryReal) return;

    const level = (log.level.toLowerCase() === 'warn' ? 'warning' : log.level.toLowerCase()) as
      'info' | 'warning' | 'error' | 'debug';

    Sentry.captureMessage(log.message, {
      level,
      extra: {
        timestamp: log.timestamp,
        context: log.context,
        url: log.url,
      },
    } as any);
  },

  /**
   * Capture a JavaScript Error object with full stack trace.
   * Called by logger.ts → sendToRemote() for ERROR-level logs.
   */
  captureException(error: unknown, context?: unknown): void {
    const dsn = import.meta.env.VITE_SENTRY_DSN as string | undefined;
    if (!dsn || !_initialized || !isSentryReal) return;

    Sentry.captureException(error, { extra: { context } as Record<string, unknown> });
  },
};
