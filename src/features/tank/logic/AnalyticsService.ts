
import { Logger } from '../../../services/logger';

type AnalyticsEvent = 'PITCH_SUBMITTED' | 'DEAL_MADE' | 'OFFER_REJECTED';
// ✅ SECURITY FIX: Typed event data instead of `any` — prevents accidental PII inclusion
type AnalyticsEventData = Record<string, string | number | boolean>;

class AnalyticsService {
    // ✅ SECURITY FIX: Replaced console.log (leaks data in production) with Logger.debug
    // (dev-only, structured, sanitized through the PII redaction layer in logger.ts).
    track(event: AnalyticsEvent, data?: AnalyticsEventData): void {
        Logger.debug(`[Tank Analytics] ${event}`, data);
        // TODO: Wire to real backend analytics (Supabase Edge Function / Mixpanel)
    }
}

export const analytics = new AnalyticsService();
