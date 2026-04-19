import { supabase } from '../lib/supabase';
import { Logger } from './logger';
import type { User } from '../types';
import { UnauthorizedError } from '../utils/errors';

export interface ExportData {
    profile: Partial<User>;
    metadata: {
        exportedAt: string;
        userId: string;
        version: string;
    };
    // Additional data can be added as needed
    progress?: Record<string, unknown>;
    achievements?: unknown[];
    purchases?: unknown[];
}

/**
 * Data Export Service for GDPR Compliance
 * Provides structured data export in JSON and CSV formats
 */
export class DataExportService {
    /**
     * Export user data in JSON format.
     * @param userId  The target user's ID.
     * @param callerId  The ID of the authenticated user making this request.
     */
    static async exportAsJSON(userId: string, callerId: string): Promise<Blob> {
        Logger.info('Exporting user data as JSON', { userId });
        const data = await this.gatherUserData(userId, callerId);
        const json = JSON.stringify(data, null, 2);
        return new Blob([json], { type: 'application/json' });
    }

    /**
     * Export user data in CSV format.
     * @param userId  The target user's ID.
     * @param callerId  The ID of the authenticated user making this request.
     */
    static async exportAsCSV(userId: string, callerId: string): Promise<Blob> {
        Logger.info('Exporting user data as CSV', { userId });
        const data = await this.gatherUserData(userId, callerId);
        const csv = this.convertToCSV(data);
        return new Blob([csv], { type: 'text/csv' });
    }

    /**
     * Gather all user data from database.
     * Requires callerId == userId to prevent IDOR (Insecure Direct Object Reference) attacks.
     */
    private static async gatherUserData(userId: string, callerId: string): Promise<ExportData> {
        // ✅ SECURITY FIX: IDOR guard — a caller must own the userId they are exporting.
        // Previously any authenticated user could call exportAsJSON('admin-uuid') and
        // download another user's full profile data. The DB RLS policy is a second layer,
        // not the only layer.
        if (callerId !== userId) {
            Logger.warn('[Security] DataExportService: IDOR attempt blocked', { callerId, targetId: userId });
            void Logger.logSecurityEvent('unauthorized_access', 'high', {
                action: 'data_export_idor', callerId, targetId: userId,
            });
            throw new UnauthorizedError('You may only export your own data.');
        }

        try {
            // Fetch user profile
            if (!supabase) throw new Error('Supabase not initialized');
            const { data: profile, error } = await supabase
                .from('profiles')
                // ✅ SECURITY FIX: Column allowlist instead of select('*').
                // select('*') was exposing internal operational columns:
                // deletion_requested_at, deletion_scheduled_for, parental_gate_locked_until, etc.
                // Users should only see their own public/educational data.
                .select(`
                    id, role, name, username, level, xp, biz_coins,
                    subscription_tier, subscription_status, created_at,
                    completed_lesson_ids, badges, streak, language,
                    portfolio, hq_items, unlocked_skills, invite_code
                `)
                .eq('id', userId)
                .single();

            if (error) {
                Logger.error('Failed to fetch user profile for export', error);
                throw new Error('Failed to fetch user data');
            }

            // Remove any remaining sensitive fields
            const sanitizedProfile = this.sanitizeProfile(profile);

            return {
                profile: sanitizedProfile,
                metadata: {
                    exportedAt: new Date().toISOString(),
                    userId,
                    version: '1.0',
                },
                // TODO: Add additional data sources (completed lessons, achievements)
                progress: {},
                achievements: [],
                purchases: [],
            };
        } catch (error) {
            Logger.error('Failed to gather user data', error);
            throw error;
        }
    }

    /**
     * Remove sensitive fields from profile
     */
    private static sanitizeProfile(profile: Record<string, unknown>): Partial<User> {
        // Remove internal fields
        const {
            parental_gate_attempts,
            parental_gate_locked_until,
            deletion_requested_at,
            deletion_scheduled_for,
            ...sanitized
        } = profile;

        return sanitized as Partial<User>;
    }

    /**
     * Convert data to CSV format
     */
    private static convertToCSV(data: ExportData): string {
        const rows: string[] = [];

        // Header
        rows.push('Category,Key,Value');

        // Metadata
        Object.entries(data.metadata).forEach(([key, value]) => {
            rows.push(`Metadata,${key},"${this.escapeCSV(String(value))}"`);
        });

        // Profile data
        Object.entries(data.profile).forEach(([key, value]) => {
            const stringValue = value === null || value === undefined
                ? ''
                : String(value);
            rows.push(`Profile,${key},"${this.escapeCSV(stringValue)}"`);
        });

        return rows.join('\n');
    }

    /**
     * Escape CSV values
     */
    private static escapeCSV(value: string): string {
        return value.replace(/"/g, '""');
    }

    /**
     * Trigger download of export file
     */
    static downloadFile(blob: Blob, filename: string): void {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        Logger.info('Data export file downloaded', { filename });
    }

    /**
     * Generate filename for export
     */
    static generateFilename(userId: string, format: 'json' | 'csv'): string {
        const timestamp = new Date().toISOString().split('T')[0];
        return `profitspatrol-data-${userId.slice(0, 8)}-${timestamp}.${format}`;
    }
}
