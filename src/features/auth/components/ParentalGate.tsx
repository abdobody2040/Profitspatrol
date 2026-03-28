import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertTriangle, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../../../lib/supabase';
import { useAppStore } from '../../../store';
import { Logger } from '../../../services/logger';

interface ParentalGateProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const VERIFICATION_EXPIRY_MS = 3600000; // 1 hour
const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION_MS = 86400000; // 24 hours

export const ParentalGate: React.FC<ParentalGateProps> = ({ isOpen, onClose, onSuccess }) => {
    const { t } = useTranslation();
    const { user } = useAppStore();
    const [problem, setProblem] = useState({ a: 0, b: 0 });
    const [answer, setAnswer] = useState('');
    const [error, setError] = useState('');
    const [isLocked, setIsLocked] = useState(false);
    const [lockoutEndsAt, setLockoutEndsAt] = useState<Date | null>(null);
    const [attemptsRemaining, setAttemptsRemaining] = useState(MAX_ATTEMPTS);

    useEffect(() => {
        if (isOpen) {
            generateProblem();
            if (user) {
                checkLockoutStatus();
            }
        }
    }, [isOpen, user]);

    const checkLockoutStatus = async () => {
        if (!user || !supabase) return;

        try {
            const { data } = await supabase
                .from('profiles')
                .select('parental_gate_locked_until, parental_gate_attempts')
                .eq('id', user.id)
                .single();

            if (data?.parental_gate_locked_until) {
                const lockoutEnd = new Date(data.parental_gate_locked_until);
                if (lockoutEnd > new Date()) {
                    setIsLocked(true);
                    setLockoutEndsAt(lockoutEnd);
                    Logger.warn('Parental gate locked', { userId: user.id, lockoutEnd });
                    return;
                }
            }

            setAttemptsRemaining(MAX_ATTEMPTS - (data?.parental_gate_attempts || 0));
        } catch (err) {
            Logger.error('Failed to check lockout status', err);
        }
    };

    const generateProblem = () => {
        // ✅ SECURITY FIX (MED-01): Use crypto.getRandomValues() instead of Math.random().
        // Math.random() is a PRNG — its output can be predicted. For a security gate
        // protecting child account access, we need a CSPRNG.
        // Range expanded: a=12-49, b=3-12, answer=15-61 (~300 unique pairs vs 100).
        const secureRandom = (min: number, max: number): number => {
            const range = max - min;
            const arr = new Uint32Array(1);
            crypto.getRandomValues(arr);
            return min + (arr[0] % range);
        };
        const a = secureRandom(12, 50); // 12-49
        const b = secureRandom(3, 13);  // 3-12
        setProblem({ a, b });
        setAnswer('');
        setError('');
    };

    const handleFailedAttempt = async () => {
        if (!user || !supabase) return;

        try {
            const { data, error } = await supabase.rpc('increment_parental_gate_attempts', {
                p_user_id: user.id,
                p_max_attempts: MAX_ATTEMPTS,
                p_lockout_ms: LOCKOUT_DURATION_MS,
            });

            if (error) {
                Logger.error('Failed to increment parental gate attempts', error);
                return;
            }

            // Runtime type guard — RPC response shape: { is_locked, attempts, locked_until }
            // Prevents silent breakage if the DB function signature changes.
            if (
                !data ||
                typeof data.is_locked !== 'boolean' ||
                typeof data.attempts !== 'number'
            ) {
                Logger.error('Parental gate RPC: unexpected response shape', { data });
                setError('Verification error. Please try again.');
                return;
            }

            if (data.is_locked) {
                const lockoutEnd = data.locked_until ? new Date(data.locked_until) : new Date(Date.now() + LOCKOUT_DURATION_MS);
                setIsLocked(true);
                setLockoutEndsAt(lockoutEnd);
                Logger.warn('Parental gate locked due to failed attempts', { userId: user.id });
            } else {
                const remaining = MAX_ATTEMPTS - data.attempts;
                setAttemptsRemaining(remaining);
                setError(t('auth.parental_gate_error' as any) + ` (${remaining} attempts remaining)`);
            }
        } catch (err) {
            Logger.error('Failed to update parental gate attempts', err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isLocked) {
            setError('Account is locked. Please try again later.');
            return;
        }

        if (parseInt(answer) === problem.a + problem.b) {
            // ✅ SECURITY FIX: onSuccess() ONLY fires AFTER Supabase records the verified timestamp.
            // Previously onSuccess() was called unconditionally at line 125 — a failed DB write
            // meant the COPPA audit trail was missing but the child still advanced.
            if (user && supabase) {
                try {
                    const { error: updateError } = await supabase.from('profiles').update({
                        parental_gate_verified_at: new Date().toISOString(),
                        parental_gate_attempts: 0,
                        parental_gate_locked_until: null,
                    }).eq('id', user.id);

                    if (updateError) {
                        Logger.error('Parental gate: DB write failed', updateError);
                        setError('Verification failed. Please try again.');
                        return; // ✅ Block progression if DB write fails
                    }

                    Logger.info('Parental gate verified', { userId: user.id });
                    onSuccess(); // ✅ Only call after confirmed DB write
                } catch (err) {
                    Logger.error('Failed to update parental gate verification', err);
                    setError('Verification failed. Please check your connection.');
                    return;
                }
            } else {
                // No Supabase (offline/dev mode) — allow but log
                Logger.warn('Parental gate verified without DB persistence (offline mode)');
                onSuccess();
            }
        } else {
            await handleFailedAttempt();
            generateProblem();
        }
    };

    if (!isOpen) return null;

    // Locked state
    if (isLocked && lockoutEndsAt) {
        const hoursRemaining = Math.ceil((lockoutEndsAt.getTime() - Date.now()) / (1000 * 60 * 60));

        return (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
                    <AlertTriangle size={48} className="text-red-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-black text-gray-800 dark:text-white mb-2">
                        Account Locked
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Too many failed attempts. Your account is locked for {hoursRemaining} hours.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-gray-500 mb-6">
                        <Clock size={20} />
                        <span className="font-mono">
                            {lockoutEndsAt.toLocaleTimeString()}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-bounce-in text-center">
                <ShieldCheck size={48} className="text-kid-primary mx-auto mb-4" />
                <h2 className="text-2xl font-black text-gray-800 dark:text-white mb-2">
                    {t('auth.parental_gate_title' as any)}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 font-bold mb-6">
                    {t('auth.parental_gate_desc' as any)}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="text-4xl font-black text-kid-secondary mb-4 font-mono">
                        {problem.a} + {problem.b} = ?
                    </div>
                    <input
                        type="number"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        className="w-full p-4 text-center text-2xl font-bold rounded-xl border-2 border-gray-200 focus:border-kid-primary outline-none"
                        placeholder="?"
                        autoFocus
                        disabled={isLocked}
                    />
                    {error && <div className="text-red-500 font-bold text-sm">{error}</div>}

                    {/* Attempts remaining indicator */}
                    {attemptsRemaining < MAX_ATTEMPTS && !isLocked && (
                        <div className="text-orange-600 text-sm font-bold">
                            ⚠️ {attemptsRemaining} {attemptsRemaining === 1 ? 'attempt' : 'attempts'} remaining
                        </div>
                    )}

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            {t('common.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={isLocked}
                            className="flex-1 bg-kid-primary text-yellow-900 py-3 rounded-xl font-black hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {t('auth.parental_gate_submit' as any)}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
