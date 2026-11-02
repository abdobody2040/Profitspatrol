import React, { useEffect } from 'react';
import { useAppStore } from '../../../store';
import { api } from '../../../lib/api';
import { Logger } from '../../../services/logger';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const setUser = useAppStore(state => state.setUser);
    const refreshUser = useAppStore(state => state.refreshUser);

    useEffect(() => {
        const checkSession = async () => {
            const token = api.getToken();
            const currentUser = useAppStore.getState().user;

            try {
                if (token) {
                    Logger.info('Auth Provider: Sanctum token found — validating session.');
                    await refreshUser();
                } else if (currentUser && !currentUser.id?.startsWith('dev_') && import.meta.env.PROD && import.meta.env.MODE !== 'test') {
                    Logger.warn('Auth Provider: User in store but no Sanctum token. Logging out.');
                    setUser(null);
                }
            } catch (e) {
                Logger.error('Auth Provider: checkSession failed', e);
                api.clearToken();
                setUser(null);
            } finally {
                useAppStore.getState().setAuthLoading(false);
            }
        };

        checkSession();
    }, [setUser, refreshUser]);

    return <>{children}</>;
};
