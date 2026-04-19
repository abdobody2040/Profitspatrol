import { supabase } from '../lib/supabase';
import { Logger } from './logger';
import { UnauthorizedError } from '../utils/errors';
import { useAppStore } from '../store';

/**
 * Account Deletion Service for GDPR Compliance
 * Implements 30-day grace period with audit trail
 */
export class AccountDeletionService {
    private static readonly GRACE_PERIOD_DAYS = 30;

    /**
     * Request account deletion (30-day grace period).
     * @param userId   The account to schedule for deletion.
     * @param callerId The authenticated user making this request (must own the account).
     * @param reason   Optional deletion reason.
     */
    static async requestDeletion(userId: string, callerId: string, reason?: string): Promise<void> {
        // ✅ SECURITY FIX: IDOR guard — requestDeletion() previously accepted any userId
        // without checking ownership. An authenticated user knowing another user's UUID
        // could schedule deletion of a victim's account.
        // Admins are allowed to delete any account (admin-initiated enforcement).
        const callerRole = useAppStore.getState().user?.role;
        const isAdmin = callerRole === 'ADMIN';
        if (!isAdmin && callerId !== userId) {
            Logger.warn('[Security] AccountDeletionService: IDOR attempt on requestDeletion blocked', { callerId, targetId: userId });
            void Logger.logSecurityEvent('unauthorized_access', 'high', {
                action: 'deletion_request_idor', callerId, targetId: userId,
            });
            throw new UnauthorizedError('You may only request deletion of your own account.');
        }

        Logger.info('Account deletion requested', { userId, requestedBy: callerId });

        const scheduledFor = new Date();
        scheduledFor.setDate(scheduledFor.getDate() + this.GRACE_PERIOD_DAYS);

        try {
            // Update profile with deletion schedule
            const { error: profileError } = await supabase!
                .from('profiles')
                .update({
                    deletion_requested_at: new Date().toISOString(),
                    deletion_scheduled_for: scheduledFor.toISOString(),
                    deletion_reason: reason || 'User requested',
                })
                .eq('id', userId);

            if (profileError) {
                Logger.error('Failed to update profile for deletion', profileError);
                throw new Error('Failed to schedule account deletion');
            }

            // Create audit log entry
            // ✅ GDPR/COPPA FIX: navigator.userAgent was previously logged here.
            // userAgent contains OS version, device model, and browser version = PII under COPPA.
            // The PRD explicitly requires "Redacted Logging for PII protection" — removed.
            const { error: logError } = await supabase!
                .from('account_deletion_log')
                .insert({
                    user_id: userId,
                    requested_at: new Date().toISOString(),
                    scheduled_for: scheduledFor.toISOString(),
                    reason: reason || 'User requested',
                    ip_address: null,
                    // user_agent: navigator.userAgent, // ❌ REMOVED — GDPR PII
                });

            if (logError) {
                Logger.error('Failed to create deletion audit log', logError);
                // Don't throw - profile is already updated
            }

            Logger.info('Account deletion scheduled', {
                userId,
                scheduledFor: scheduledFor.toISOString()
            });
        } catch (error) {
            Logger.error('Failed to request account deletion', error);
            throw error;
        }
    }

    /**
     * Cancel account deletion (within 30-day grace period).
     * @param userId   The account whose scheduled deletion to cancel.
     * @param callerId The authenticated user making this request (must own the account).
     */
    static async cancelDeletion(userId: string, callerId: string): Promise<void> {
        // ✅ SECURITY FIX: IDOR guard — cancelDeletion() previously accepted any userId.
        // A malicious user could cancel another user's pending deletion request,
        // keeping an account alive against the user's explicit wish to be forgotten (GDPR §17).
        const callerRole = useAppStore.getState().user?.role;
        const isAdmin = callerRole === 'ADMIN';
        if (!isAdmin && callerId !== userId) {
            Logger.warn('[Security] AccountDeletionService: IDOR attempt on cancelDeletion blocked', { callerId, targetId: userId });
            void Logger.logSecurityEvent('unauthorized_access', 'high', {
                action: 'deletion_cancel_idor', callerId, targetId: userId,
            });
            throw new UnauthorizedError('You may only cancel deletion of your own account.');
        }

        Logger.info('Account deletion cancellation requested', { userId, requestedBy: callerId });

        try {
            // Update profile to remove deletion schedule
            const { error: profileError } = await supabase!
                .from('profiles')
                .update({
                    deletion_requested_at: null,
                    deletion_scheduled_for: null,
                    deletion_reason: null,
                })
                .eq('id', userId);

            if (profileError) {
                Logger.error('Failed to cancel deletion in profile', profileError);
                throw new Error('Failed to cancel account deletion');
            }

            // Update audit log to mark as cancelled
            const { error: logError } = await supabase!
                .from('account_deletion_log')
                .update({ cancelled_at: new Date().toISOString() })
                .eq('user_id', userId)
                .is('cancelled_at', null)
                .is('completed_at', null);

            if (logError) {
                Logger.error('Failed to update deletion audit log', logError);
                // Don't throw - profile is already updated
            }

            Logger.info('Account deletion cancelled', { userId });
        } catch (error) {
            Logger.error('Failed to cancel account deletion', error);
            throw error;
        }
    }

    /**
     * Check if account is scheduled for deletion
     */
    static async isDeletionScheduled(userId: string): Promise<boolean> {
        try {
            if (!supabase) throw new Error("Supabase not initialized");
            const { data, error } = await supabase
                .from('profiles')
                .select('deletion_scheduled_for')
                .eq('id', userId)
                .single();

            if (error) {
                Logger.error('Failed to check deletion status', error);
                return false;
            }

            return !!data?.deletion_scheduled_for;
        } catch (error) {
            Logger.error('Failed to check deletion status', error);
            return false;
        }
    }

    /**
     * Get days remaining until deletion
     */
    static async getDaysUntilDeletion(userId: string): Promise<number | null> {
        try {
            if (!supabase) throw new Error("Supabase not initialized");
            const { data, error } = await supabase
                .from('profiles')
                .select('deletion_scheduled_for')
                .eq('id', userId)
                .single();

            if (error || !data?.deletion_scheduled_for) {
                return null;
            }

            const scheduledDate = new Date(data.deletion_scheduled_for);
            const now = new Date();
            const diffTime = scheduledDate.getTime() - now.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            return diffDays > 0 ? diffDays : 0;
        } catch (error) {
            Logger.error('Failed to calculate days until deletion', error);
            return null;
        }
    }

    /**
     * Get deletion info for user
     */
    static async getDeletionInfo(userId: string): Promise<{
        isScheduled: boolean;
        requestedAt: string | null;
        scheduledFor: string | null;
        daysRemaining: number | null;
        reason: string | null;
    }> {
        try {
            if (!supabase) throw new Error("Supabase not initialized");
            const { data, error } = await supabase
                .from('profiles')
                .select('deletion_requested_at, deletion_scheduled_for, deletion_reason')
                .eq('id', userId)
                .single();

            if (error || !data) {
                return {
                    isScheduled: false,
                    requestedAt: null,
                    scheduledFor: null,
                    daysRemaining: null,
                    reason: null,
                };
            }

            const daysRemaining = data.deletion_scheduled_for
                ? await this.getDaysUntilDeletion(userId)
                : null;

            return {
                isScheduled: !!data.deletion_scheduled_for,
                requestedAt: data.deletion_requested_at,
                scheduledFor: data.deletion_scheduled_for,
                daysRemaining,
                reason: data.deletion_reason,
            };
        } catch (error) {
            Logger.error('Failed to get deletion info', error);
            return {
                isScheduled: false,
                requestedAt: null,
                scheduledFor: null,
                daysRemaining: null,
                reason: null,
            };
        }
    }
}
