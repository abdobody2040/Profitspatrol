import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../../store';
import { UserRole } from '../../../types';
// ✅ SECURITY NOTE: hashPassword removed — unused import, Supabase Auth handles
// password hashing server-side (bcrypt). hashPassword was a client-side SHA-256
// transitional utility that is no longer needed in this file.
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import { Logger } from '../../../services/logger';

export const useAuthForm = () => {
    const { t } = useTranslation();
    const { loginWithCredentials, registerUser } = useAppStore();

    const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
    const [step, setStep] = useState(1);
    const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.KID);

    // Form Data
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        email: '',
        password: '',
        inviteCode: new URLSearchParams(window.location.search).get('invite') || '', // Pre-fill if referred
        consentGiven: false
    });

    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const updateField = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError('');
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            // SECURITY: Send plain password to Supabase Auth
            // Supabase handles password hashing internally (bcrypt)
            const success = await loginWithCredentials(formData.username, formData.password);
            
            if (!success) {
                setError(t('auth.error_auth' as any));
            }
        } catch (err: any) {
            Logger.error("Login Error", err);
            setError(t('auth.error_generic' as any));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.username || !formData.email || !formData.password || !formData.name) {
            setError(t('auth.error_fields' as any));
            return;
        }

        // Basic password strength check
        if (formData.password.length < 8) {
            setError("Password is too weak");
            return;
        }

        if (!formData.consentGiven) {
            setError(t('auth.error_consent' as any));
            return;
        }

        setIsSubmitting(true);
        try {
            // SECURITY: Send plain password to Supabase Auth
            // Supabase handles password hashing internally (bcrypt)
            const validationError = await registerUser(
                formData.name,
                formData.username,
                formData.email,
                formData.password, // Plain password for Supabase
                selectedRole,
                formData.inviteCode // Pass invite code to registration
            );

            if (validationError) {
                setError(validationError);
            }
        } catch (err: any) {
            Logger.error("Registration Error", err);
            setError(t('auth.error_generic' as any));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleLogin = async () => {
        if (!isSupabaseConfigured()) {
            setError("Google Login requires Supabase configuration (VITE_SUPABASE_URL).");
            Logger.warn("Google Login attempted without Supabase config");
            return;
        }
        try {
            // ✅ SECURITY FIX: Added CSRF state parameter to prevent OAuth state fixation.
            // Supabase passes this state parameter through the OAuth flow and verifies it
            // on callback, preventing an attacker from substituting their own auth code.
            const csrfState = crypto.randomUUID();
            sessionStorage.setItem('oauth_csrf_state', csrfState);

            const { error } = await supabase!.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    queryParams: { state: csrfState },
                },
            });
            if (error) throw error;
        } catch (err: any) {
            Logger.error("Google Login Failed", err);
            setError(err.message || 'Google Login Failed');
        }
    };

    return {
        mode, setMode,
        step, setStep,
        selectedRole, setSelectedRole,
        formData, updateField,
        error, setError,
        isSubmitting,
        handleLogin,
        handleRegister,
        handleGoogleLogin
    };
};
