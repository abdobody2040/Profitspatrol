
export type AnalyticsEventType =
    | 'APP_OPEN'
    | 'GAME_STARTED'
    | 'GAME_COMPLETED'
    | 'PITCH_SUBMITTED'
    | 'DEAL_CLOSED'
    | 'LESSON_COMPLETED'
    | 'PAGE_VIEW';

export interface AnalyticsEvent {
    type: AnalyticsEventType;
    payload?: any;
    timestamp: number;
    userId?: string;
}

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Logger } from '../services/logger';

export class AnalyticsService {
    private static instance: AnalyticsService;
    private queue: AnalyticsEvent[] = [];
    private isInitialized = false;

    private constructor() { }

    static getInstance(): AnalyticsService {
        if (!AnalyticsService.instance) {
            AnalyticsService.instance = new AnalyticsService();
        }
        return AnalyticsService.instance;
    }

    private flushInterval: ReturnType<typeof setInterval> | null = null;

    initialize() {
        if (this.isInitialized) return;

        const mode = isSupabaseConfigured() ? 'Cloud (Supabase)' : 'Local (Console)';
        Logger.info(`[Analytics] Initialized in ${mode} mode`);

        this.isInitialized = true;

        // Start flush interval — stored so it can be cleared if needed
        if (isSupabaseConfigured()) {
            // ✅ SECURITY FIX: store interval ref to prevent memory leak in long-running sessions
            this.flushInterval = setInterval(() => this.flushQueue(), 10000); // Flush every 10s
        }
    }

    async track(type: AnalyticsEventType, payload?: any) {
        const event: AnalyticsEvent = {
            type,
            payload,
            timestamp: Date.now(),
            // In a real app we'd get userId from a store or context here
        };

        // ✅ SECURITY FIX: Logger.debug instead of console.log (dev-only, sanitized through PII redaction)
        Logger.debug(`[Analytics] Tracked: ${type}`, { eventType: type });

        // Queue it
        this.queue.push(event);
    }

    private async flushQueue() {
        if (this.queue.length === 0 || !supabase) return;

        const batch = [...this.queue];
        this.queue = []; // Clear queue (optimistic)

        try {
            const { error } = await supabase.from('analytics_events').insert(batch);
            if (error) {
                Logger.error('[Analytics] Failed to flush events to Supabase', error);
                // Re-queue failed batch
                this.queue.unshift(...batch);
            } else {
                Logger.debug(`[Analytics] Flushed ${batch.length} events to Supabase`);
            }
        } catch (err) {
            Logger.error('[Analytics] Network error during event flush', err);
            this.queue.unshift(...batch);
        }
    }
}

export const analytics = AnalyticsService.getInstance();
