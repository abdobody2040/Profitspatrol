import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../../store';
import { UserRole } from '../../../types';
import { Logger } from '../../../services/logger';

export const useAuthForm = () => {
    const { t } = useTranslation();
    const { loginWithCredentials, registerUser, loginWithGoogle } = useAppStore();

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
        consentGiven: false,
        ageMode: 'junior' as 'junior' | 'explorer'
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
            const result = await loginWithCredentials(formData.username, formData.password);
            
            if (result === 'EMAIL_NOT_CONFIRMED') {
                setError(t('auth.error_email_not_confirmed' as any, {
                    defaultValue: 'Please confirm your email address first. Check your inbox for a verification link.'
                }));
            } else if (!result) {
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
            } else if (selectedRole === UserRole.KID) {
                const state = useAppStore.getState();
                if (state.user) {
                    state.updateUserSettings({
                        ageMode: formData.ageMode,
                        soundEnabled: true,
                        hapticsEnabled: true
                    });
                }
            }
        } catch (err: any) {
            Logger.error("Registration Error", err);
            setError(t('auth.error_generic' as any));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleCredential = async (credential: string) => {
        setIsSubmitting(true);
        setError('');
        try {
            const success = await loginWithGoogle(
                credential,
                selectedRole,
                formData.inviteCode
            );
            if (!success) {
                setError(t('auth.error_auth' as any, 'Google Sign-In failed. Please try again.'));
            }
        } catch (err: any) {
            Logger.error("Google Token Processing Failed", err);
            setError(err.message || 'Google Sign-In processing error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleLogin = async () => {
        const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        if (!googleClientId) {
            setError("Google Sign-In requires VITE_GOOGLE_CLIENT_ID in your .env file.");
            Logger.warn("Google Login attempted without VITE_GOOGLE_CLIENT_ID");
            return;
        }

        const google = (window as any).google;
        if (!google?.accounts?.id) {
            setError("Google Identity Services is loading. Please check your connection and try again.");
            return;
        }

        try {
            setIsSubmitting(true);
            setError('');

            google.accounts.id.initialize({
                client_id: googleClientId,
                callback: (res: any) => {
                    if (res?.credential) {
                        handleGoogleCredential(res.credential);
                    } else {
                        setIsSubmitting(false);
                    }
                },
            });

            google.accounts.id.prompt((notification: any) => {
                if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                    setIsSubmitting(false);
                }
            });
        } catch (err: any) {
            Logger.error("Google Login initialization failed", err);
            setError(err.message || 'Failed to initialize Google Login');
            setIsSubmitting(false);
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
        handleGoogleLogin,
        handleGoogleCredential
    };
};
