import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, GraduationCap, ArrowLeft, Sparkles } from "lucide-react";
import { UserRole } from '../../../types';
import { useAuthForm } from '../hooks/useAuthForm';
import { ParentalGate } from './ParentalGate';
import { PasswordInput } from './PasswordInput';
import { motion } from "framer-motion";

interface AuthProps {
    onBack?: () => void;
    initialMode?: 'LOGIN' | 'REGISTER';
}

const Auth: React.FC<AuthProps> = ({ onBack, initialMode = 'LOGIN' }) => {
    const { t } = useTranslation();

    // Use the new hook for all logic
    const {
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
    } = useAuthForm();

    const googleBtnRef = React.useRef<HTMLDivElement>(null);
    const [hasGsiRendered, setHasGsiRendered] = useState(false);

    // Initialize mode from props on mount if needed (hook defaults to LOGIN)
    React.useEffect(() => {
        if (initialMode) setMode(initialMode);
    }, [initialMode, setMode]);

    // Initialize Google Identity Services button
    React.useEffect(() => {
        const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        if (!googleClientId) return;

        let isMounted = true;

        // Dynamically load Google Identity Services only when Auth component mounts
        if (!(window as any).google?.accounts?.id && !document.getElementById('google-gsi-client')) {
            const script = document.createElement('script');
            script.id = 'google-gsi-client';
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
        }

        const checkInterval = setInterval(() => {
            const google = (window as any).google;
            if (google?.accounts?.id && googleBtnRef.current) {
                clearInterval(checkInterval);
                try {
                    google.accounts.id.initialize({
                        client_id: googleClientId,
                        callback: (res: any) => {
                            if (res?.credential) {
                                handleGoogleCredential(res.credential);
                            }
                        },
                    });
                    googleBtnRef.current.innerHTML = '';
                    google.accounts.id.renderButton(googleBtnRef.current, {
                        type: 'standard',
                        theme: 'outline',
                        size: 'large',
                        text: mode === 'LOGIN' ? 'signin_with' : 'signup_with',
                        shape: 'pill',
                        width: 320,
                    });
                    if (isMounted) setHasGsiRendered(true);
                } catch {
                    // Fall back to custom button
                }
            }
        }, 300);

        return () => {
            isMounted = false;
            clearInterval(checkInterval);
        };
    }, [mode, handleGoogleCredential]);

    // Parental Gate Local State
    const [showParentGate, setShowParentGate] = useState(false);

    const handleRoleSelect = (role: UserRole) => {
        setSelectedRole(role);
        if (role === UserRole.KID) {
            setShowParentGate(true); // Trigger Gate
        } else {
            setStep(2);
            setError('');
        }
    };

    const handleGateSuccess = () => {
        setShowParentGate(false);
        setStep(2);
        setError('');
    };

    // Shared Google Button Component
    const GoogleButton = () => (
        <div className="w-full flex flex-col items-center justify-center mb-6">
            <div ref={googleBtnRef} className={hasGsiRendered ? "flex justify-center w-full" : "hidden"} />
            {!hasGsiRendered && (
                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={isSubmitting}
                    className="w-full bg-white dark:bg-gray-100/10 text-gray-700 dark:text-white font-bold py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
                >
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    {mode === 'LOGIN' ? t('auth.google_login' as any, 'Sign in with Google') : t('auth.google_signup' as any, 'Sign up with Google')}
                </button>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/20 flex flex-col items-center justify-center p-4 relative transition-colors overflow-hidden">
            
            {/* Animated Background Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-50 dark:opacity-20">
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-1/4 -start-1/4 w-1/2 h-1/2 bg-yellow-200 rounded-full blur-[120px]"
                />
                <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-1/4 -end-1/4 w-1/2 h-1/2 bg-green-200 rounded-full blur-[120px]"
                />
            </div>

            {/* PARENTAL GATE MODAL */}
            <ParentalGate
                isOpen={showParentGate}
                onClose={() => setShowParentGate(false)}
                onSuccess={handleGateSuccess}
            />

            {onBack && (
                <button
                    onClick={onBack}
                    className="absolute top-8 start-8 text-gray-500 dark:text-gray-400 font-bold hover:text-green-600 dark:hover:text-green-400 flex items-center gap-2"
                >
                    <ArrowLeft size={20} /> {t('common.back')}
                </button>
            )}

                <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-2xl max-w-lg w-full text-center border-4 border-white dark:border-gray-700 relative z-10">
                    
                    {/* Ollie Mascot Injection */}
                    <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-48 h-48 pointer-events-none hidden md:block">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <img src="/assets/ollie_head.png" alt="Ollie" className="w-full h-full object-contain animate-float" />
                            <motion.div 
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.8, type: "spring" }}
                                className="absolute -top-4 -end-8 bg-white dark:bg-gray-700 p-3 rounded-2xl rounded-bs-none shadow-xl border-2 border-yellow-400 max-w-[180px]"
                            >
                                <p className="text-xs font-black text-gray-800 dark:text-white leading-tight">
                                    {mode === 'LOGIN' ? t('auth.ollie_login') : t('auth.ollie_signup')}
                                </p>
                            </motion.div>
                        </motion.div>
                    </div>

                    <div className="flex justify-center mb-6">
                        <img src="/images/logo_text.png" alt={t('auth.title')} className="h-24 w-auto object-contain hover:scale-110 transition-transform cursor-pointer" />
                    </div>

                {/* Toggle Mode */}
                <div className="flex justify-center gap-6 mb-8 mt-4 text-sm font-bold border-b border-gray-100 dark:border-gray-700 pb-4">
                    <button
                        onClick={() => { setMode('LOGIN'); setStep(1); setError(''); }}
                        className={`pb-2 border-b-2 transition-colors ${mode === 'LOGIN' ? 'text-kid-secondary border-kid-secondary' : 'text-gray-400 dark:text-gray-500 border-transparent hover:text-gray-600 dark:hover:text-gray-300'}`}
                    >
                        {t('auth.login')}
                    </button>
                    <button
                        onClick={() => { setMode('REGISTER'); setStep(1); setError(''); }}
                        className={`pb-2 border-b-2 transition-colors ${mode === 'REGISTER' ? 'text-kid-secondary border-kid-secondary' : 'text-gray-400 dark:text-gray-500 border-transparent hover:text-gray-600 dark:hover:text-gray-300'}`}
                    >
                        {t('auth.create_account')}
                    </button>
                </div>

                {/* LOGIN FORM */}
                {mode === 'LOGIN' && (
                    <div className="space-y-4">
                        <GoogleButton />
                        <div className="relative flex items-center justify-center my-6">
                            <hr className="w-full border-gray-200 dark:border-gray-700" />
                            <span className="absolute bg-white dark:bg-gray-800 px-4 text-xs font-bold text-gray-400 uppercase">{t('auth.or')}</span>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="text-start">
                                <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">{t('auth.username_or_email', { defaultValue: 'Username or Email' })}</label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => updateField('username', e.target.value)}
                                    className="w-full p-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white font-bold focus:border-kid-accent outline-none transition-colors"
                                    placeholder={t('auth.enter_username')}
                                />
                            </div>

                            <div className="text-start">
                                <PasswordInput
                                    value={formData.password}
                                    onChange={(val) => updateField('password', val)}
                                />
                            </div>

                            {error && <div className="text-red-500 font-bold text-sm bg-red-50 dark:bg-red-900/30 p-2 rounded-lg">{error}</div>}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-kid-primary text-yellow-900 font-black py-4 rounded-2xl shadow-[0_6px_0_0_rgba(202,138,4,1)] btn-juicy text-xl hover:bg-yellow-400 transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                            >
                                {isSubmitting ? t('common.loading') : (
                                    <>
                                        {t('auth.submit_login')}
                                        <Sparkles className="group-hover:animate-spin" size={20} />
                                    </>
                                )}
                            </button>

                            {/* Only show dev test accounts widget in development */}
                            {!import.meta.env.PROD && (
                                <div className="mt-6 pt-4 border-t border-dashed border-gray-200 dark:border-gray-700">
                                    <p className="text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                                        🧪 Quick Test Accounts (Dev Mode)
                                    </p>
                                    <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                updateField('username', 'kid@profits.com');
                                                updateField('password', 'Password123!');
                                            }}
                                            className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-sm"
                                        >
                                            <span>🧒</span> Junior (7y)
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                updateField('username', 'maya10@profits.com');
                                                updateField('password', 'Password123!');
                                            }}
                                            className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-sm"
                                        >
                                            <span>🚀</span> Explorer (10y)
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                updateField('username', 'parent@profits.com');
                                                updateField('password', 'Password123!');
                                            }}
                                            className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-sm"
                                        >
                                            <span>🛡️</span> Parent
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                updateField('username', 'teacher@profits.com');
                                                updateField('password', 'Password123!');
                                            }}
                                            className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-sm"
                                        >
                                            <span>🎓</span> Teacher
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                updateField('username', 'admin@profits.com');
                                                updateField('password', 'Password123!');
                                            }}
                                            className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-sm"
                                        >
                                            <span>👑</span> Admin
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                )}

                {/* REGISTER FLOW STEP 1 */}
                {mode === 'REGISTER' && step === 1 && (
                    <div className="space-y-4">
                        <GoogleButton />
                        <div className="relative flex items-center justify-center my-6">
                            <hr className="w-full border-gray-200 dark:border-gray-700" />
                            <span className="absolute bg-white dark:bg-gray-800 px-4 text-xs font-bold text-gray-400 uppercase">{t('auth.or')}</span>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 font-bold mb-6">{t('auth.role_prompt')}</p>

                        <RoleButton
                            role={UserRole.KID}
                            title={t('auth.role_kid')}
                            desc={t('auth.role_kid_desc')}
                            icon="🧒"
                            colorClass="bg-kid-primary"
                            onClick={() => handleRoleSelect(UserRole.KID)}
                        />
                        <RoleButton
                            role={UserRole.PARENT}
                            title={t('auth.role_parent')}
                            desc={t('auth.role_parent_desc')}
                            iconComponent={<ShieldCheck size={32} />}
                            colorClass="bg-blue-100 dark:bg-blue-900 text-blue-500"
                            onClick={() => handleRoleSelect(UserRole.PARENT)}
                        />
                        <RoleButton
                            role={UserRole.TEACHER}
                            title={t('auth.role_teacher')}
                            desc={t('auth.role_teacher_desc')}
                            iconComponent={<GraduationCap size={32} />}
                            colorClass="bg-purple-100 dark:bg-purple-900 text-purple-500"
                            onClick={() => handleRoleSelect(UserRole.TEACHER)}
                        />

                        <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                            {/* Admin role hidden from public registration */}
                        </div>
                    </div>
                )}

                {/* REGISTER FLOW STEP 2 */}
                {mode === 'REGISTER' && step === 2 && (
                    <form onSubmit={handleRegister} className="space-y-4 text-start">
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="text-sm font-bold text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 mb-2 rtl:rotate-180"
                        >
                            &larr; {t('auth.back_roles')}
                        </button>

                        <h3 className="text-xl font-black text-gray-800 dark:text-white mb-4 text-center">
                            {t('auth.create_account')}
                        </h3>

                        <div>
                            <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">{t('auth.full_name')}</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => updateField('name', e.target.value)}
                                className="w-full p-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white font-bold focus:border-kid-accent outline-none transition-colors"
                                placeholder={t('auth.your_name')}
                                maxLength={50}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">{t('auth.email', { defaultValue: 'Email' })}</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => updateField('email', e.target.value)}
                                className="w-full p-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white font-bold focus:border-kid-accent outline-none transition-colors"
                                placeholder={t('auth.enter_email', { defaultValue: 'Enter your email' })}
                                maxLength={254}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">{t('auth.username')}</label>
                            <input
                                type="text"
                                value={formData.username}
                                onChange={(e) => updateField('username', e.target.value)}
                                className="w-full p-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white font-bold focus:border-kid-accent outline-none transition-colors"
                                placeholder={t('auth.enter_username')}
                                maxLength={30}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">{t('auth.invite_code')}</label>
                            <input
                                type="text"
                                value={formData.inviteCode || ''}
                                onChange={(e) => updateField('inviteCode', e.target.value.toUpperCase())}
                                className="w-full p-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white font-bold focus:border-yellow-400 outline-none transition-colors"
                                placeholder="e.g. ABCDEF"
                                maxLength={8}
                            />
                        </div>

                        <PasswordInput
                            value={formData.password}
                            onChange={(val) => updateField('password', val)}
                            showStrength={true}
                        />

                        {/* Age Mode Selection for Kids */}
                        {selectedRole === UserRole.KID && (
                            <div className="text-start mt-2">
                                <label className="block text-sm font-black text-gray-700 dark:text-gray-300 mb-2">
                                    {t('auth.age_mode_title', 'Choose the appropriate level:')}
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => updateField('ageMode', 'junior')}
                                        className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center text-center relative ${
                                            formData.ageMode === 'junior'
                                                ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/30 shadow-[0_4px_0_0_rgba(245,158,11,1)]'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-amber-300 bg-white dark:bg-gray-800'
                                        }`}
                                    >
                                        <span className="text-2xl mb-1">🐣</span>
                                        <span className="text-sm font-black text-gray-800 dark:text-white">{t('auth.junior_title', 'Junior Starter')}</span>
                                        <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">{t('auth.junior_age', 'Ages 6 - 8')}</span>
                                        <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 leading-tight">{t('auth.junior_desc', 'Large buttons, voice reading, playful learning')}</span>
                                        {formData.ageMode === 'junior' && (
                                            <span className="absolute top-2 end-2 w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => updateField('ageMode', 'explorer')}
                                        className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center text-center relative ${
                                            formData.ageMode === 'explorer'
                                                ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 shadow-[0_4px_0_0_rgba(99,102,241,1)]'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 bg-white dark:bg-gray-800'
                                        }`}
                                    >
                                        <span className="text-2xl mb-1">🚀</span>
                                        <span className="text-sm font-black text-gray-800 dark:text-white">{t('auth.explorer_title', 'Smart Explorer')}</span>
                                        <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">{t('auth.explorer_age', 'Ages 9 - 12')}</span>
                                        <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 leading-tight">{t('auth.explorer_desc', 'Entrepreneurial challenges, budgets & metrics')}</span>
                                        {formData.ageMode === 'explorer' && (
                                            <span className="absolute top-2 end-2 w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Consent Checkbox */}
                        <div className="flex items-start gap-3 mt-4">
                            <input
                                type="checkbox"
                                id="consent"
                                checked={formData.consentGiven}
                                onChange={(e) => updateField('consentGiven', e.target.checked)}
                                className="w-5 h-5 mt-0.5 rounded border-gray-300 text-kid-primary focus:ring-kid-primary transition-colors cursor-pointer"
                            />
                            <label htmlFor="consent" className="text-sm font-bold text-gray-500 dark:text-gray-400 cursor-pointer select-none">
                                {t('auth.consent_label')}
                            </label>
                        </div>

                        {error && <div className="text-red-500 font-bold text-sm bg-red-50 dark:bg-red-900/30 p-2 rounded-lg text-center">{error}</div>}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-kid-primary text-yellow-900 font-black py-4 rounded-2xl shadow-[0_6px_0_0_rgba(202,138,4,1)] btn-juicy text-xl hover:bg-yellow-400 transition-all mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                        >
                            {isSubmitting ? t('common.loading') : (
                                <>
                                    {t('auth.submit_register')}
                                    <Sparkles className="group-hover:animate-spin" size={20} />
                                </>
                            )}
                        </button>
                    </form>
                )}

            </div>
        </div>
    );
};

// Sub-component for Role Selection
const RoleButton = ({ role, title, desc, icon, iconComponent, colorClass, onClick }: any) => (
    <button
        onClick={onClick}
        className="w-full p-6 rounded-2xl border-4 border-gray-100 dark:border-gray-700 hover:border-kid-primary dark:hover:border-kid-primary hover:bg-yellow-50 dark:hover:bg-gray-700 transition-all group flex items-center gap-4 text-start"
    >
        <div className={`w-16 h-16 ${colorClass} rounded-full flex items-center justify-center text-3xl shadow-md group-hover:scale-110 transition-transform`}>
            {icon || iconComponent}
        </div>
        <div>
            <h3 className="text-xl font-black text-gray-800 dark:text-white">{title}</h3>
            <p className="text-gray-500 dark:text-gray-400 font-semibold text-sm">{desc}</p>
        </div>
    </button>
);

export default Auth;

