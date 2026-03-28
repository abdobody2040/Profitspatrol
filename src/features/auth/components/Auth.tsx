import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, GraduationCap, Database, ArrowLeft } from 'lucide-react';
import { UserRole } from '../../../types';
import { useAuthForm } from '../hooks/useAuthForm';
import { ParentalGate } from './ParentalGate';
import { PasswordInput } from './PasswordInput';

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
        handleGoogleLogin
    } = useAuthForm();

    // Initialize mode from props on mount if needed (hook defaults to LOGIN)
    React.useEffect(() => {
        if (initialMode) setMode(initialMode);
    }, [initialMode, setMode]);

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
        <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isSubmitting}
            className="w-full bg-white dark:bg-gray-100/10 text-gray-700 dark:text-white font-bold py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-3 mb-6 disabled:opacity-50"
        >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6" loading="lazy" />
            {mode === 'LOGIN' ? t('auth.google_login') : t('auth.google_signup')}
        </button>
    );

    return (
        <div className="min-h-screen bg-green-50 dark:bg-gray-900 flex items-center justify-center p-4 relative transition-colors">

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

            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl max-w-lg w-full text-center border dark:border-gray-700">
                <div className="flex justify-center mb-6">
                    <img src="/images/logo_text.png" alt={t('auth.title')} className="h-24 w-auto object-contain" />
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
                                className="w-full bg-kid-primary text-yellow-900 font-black py-4 rounded-2xl shadow-[0_4px_0_0_rgba(202,138,4,1)] btn-juicy text-lg hover:bg-yellow-400 transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Loading...' : t('auth.submit_login')}
                            </button>

                            {/* Only show demo hint in development */}
                            {/* Demo hint removed for production */}
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
                            <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">Invite Code (Optional)</label>
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
                            className="w-full bg-kid-primary text-yellow-900 font-black py-4 rounded-2xl shadow-[0_4px_0_0_rgba(202,138,4,1)] btn-juicy text-lg hover:bg-yellow-400 transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Creating Account...' : t('auth.submit_register')}
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

