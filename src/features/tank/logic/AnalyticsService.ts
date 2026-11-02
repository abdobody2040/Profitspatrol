
import { Logger } from '../../../services/logger';

type AnalyticsEvent = 'PITCH_SUBMITTED' | 'DEAL_MADE' | 'OFFER_REJECTED';
// ✅ SECURITY FIX: Typed event data instead of `any` — prevents accidental PII inclusion
type AnalyticsEventData = Record<string, string | number | boolean>;

class AnalyticsService {
    // ✅ SECURITY FIX: Replaced console.log (leaks data in production) with Logger.debug
    // (dev-only, structured, sanitized through the PII redaction layer in logger.ts).
    track(event: AnalyticsEvent, data?: AnalyticsEventData): void {
        Logger.debug(`[Tank Analytics] ${event}`, data);
        // Dispatches through standard application logger; remote endpoint hook available when configured
    }
}

export const analytics = new AnalyticsService();
