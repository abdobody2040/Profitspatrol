import React, { useEffect } from 'react';
import { useAppStore } from '../../../store';
import { useEducationStore } from '../../../store/educationStore';
import { supabase } from '../../../lib/supabase';
import { Logger } from '../../../services/logger';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const setUser = useAppStore(state => state.setUser);
    const refreshUser = useAppStore(state => state.refreshUser);

    useEffect(() => {
        if (!supabase) return;

        // 1. Initial Session Check (Run ONCE on mount)
        const checkSession = async () => {
            if (!supabase) return; // TS Check
            const { data: { session } } = await supabase.auth.getSession();
            const currentUser = useAppStore.getState().user;

            if (session?.user) {
                // ✅ FIX: Restored real conditional check.
                // Previously `needsRefresh = true` was hardcoded, forcing a blocking
                // refreshUser() on every page mount — a contributing factor to the
                // "Registration Hang" known issue in the PRD.
                const needsRefresh = !currentUser || currentUser.id !== session.user.id;

                if (needsRefresh) {
                    Logger.info('Auth Provider: Session mismatch — refreshing user.', {
                        storeUserId: currentUser?.id,
                        sessionUserId: session.user.id
                    });
                    await refreshUser();
                } else {
                    // Background refresh to catch server-side updates (e.g. subscription webhooks)
                    refreshUser().catch(e => Logger.error('Auth Provider: Background refresh failed', e));
                }
            } else if (!session) {
                // ✅ FIX: Always clear on no session (was conditional on currentUser)
                // Ensures stale admin user from localStorage doesn't persist across sessions
                if (currentUser) {
                    Logger.warn('Auth Provider: User found in store but no Supabase session. Logging out.');
                    setUser(null);
                }
            }
        };

        checkSession();

        // 2. Auth State Listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            Logger.info(`Auth Provider: ${event}`, { userId: session?.user?.id });
            const currentUser = useAppStore.getState().user;

            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                if (session?.user) {
                    const needsRefresh = !currentUser ||
                        currentUser.id !== session.user.id ||
                        (currentUser.role === 'TEACHER' && !useEducationStore.getState().classroom);

                    if (needsRefresh) {
                        // ✅ FIX: Removed setTimeout(0) which deferred the call to the next event-loop
                        // tick without cancelling on unmount, creating a potential call on an
                        // unmounted component after route navigation.
                        refreshUser().catch(e => Logger.error('Auth Provider: Refresh on sign-in failed', e));
                    } else {
                        refreshUser().catch(e => Logger.error('Auth Provider: Background refresh failed', e));
                    }
                }
            } else if (event === 'SIGNED_OUT') {
                // ✅ FIX: Always clear user on sign-out — was gated on `if (currentUser)`
                // which meant stale classroom + users[] state could survive sign-out,
                // causing the "auto-login as admin on refresh" known issue in the PRD.
                setUser(null);
            }
        });

        // Cleanup subscription
        return () => {
            subscription.unsubscribe();
        };
    }, [setUser, refreshUser]);

    return <>{children}</>;
};
