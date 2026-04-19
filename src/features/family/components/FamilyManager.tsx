import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../../store';
import { supabase } from '../../../lib/supabase';
import { UserRole } from '../../../types';
import { Logger } from '../../../services/logger';
import { Users, Copy, Check, Link, ShieldCheck, UserPlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const FamilyManager: React.FC = () => {
    const { user, refreshUser } = useAppStore();
    const { t } = useTranslation();
    const [inviteCode, setInviteCode] = useState<string | null>(null);
    const [inputCode, setInputCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [linkedKids, setLinkedKids] = useState<any[]>([]);

    const isParent = user?.role === UserRole.PARENT;
    const isKid = user?.role === UserRole.KID;

    // Load initial data
    useEffect(() => {
        if (isParent) {
            fetchInviteCode();
            fetchLinkedKids();
        }
    }, [user, isParent]);

    const fetchInviteCode = async () => {
        if (!supabase) return;
        try {
            setLoading(true);
            // ✅ SECURITY FIX: Do NOT log user.id to console (PII — COPPA violation)
            Logger.info('FamilyManager: Fetching invite code');
            const { data, error } = await supabase
                .from('profiles')
                .select('invite_code')
                .eq('id', user?.id)
                .single();

            if (error) {
                Logger.error('FamilyManager: Failed to fetch invite code from DB', error);
            }

            // Do not log invite code value to console
            if (data?.invite_code) {
                setInviteCode(data.invite_code);
                setLoading(false);
            } else {
                // Auto generate code if missing
                await generateCode();
            }
        } catch (e) {
            Logger.error('Error fetching invite code', e);
            setLoading(false);
        }
    };

    const fetchLinkedKids = async () => {
        if (!supabase) return;
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('parent_id', user?.id);

            if (data) setLinkedKids(data);
        } catch (e) {
            Logger.error("Error fetching kids", e);
        }
    };

    const generateCode = async () => {
        if (!supabase) return;
        setLoading(true);
        setError(null);
        try {
            const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
            // ✅ SECURITY FIX: Never log invite codes to console — they are access credentials

            const { error } = await supabase
                .from('profiles')
                .update({ invite_code: newCode })
                .eq('id', user?.id);

            if (error) {
                Logger.error('FamilyManager: Failed to update invite code in DB', error);
                throw error;
            }

            Logger.info('FamilyManager: Invite code updated successfully');
            setInviteCode(newCode);
        } catch (e: any) {
            Logger.error('FamilyManager: Exception in generateCode', e);
            setError(e.message || 'Failed to generate code');
        } finally {
            setLoading(false);
        }
    };

    const linkAccount = async () => {
        if (!inputCode) return;
        if (!supabase) return;
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            // 1. Find the parent with this code
            // Cast the response to any to avoid type errors for now or define a proper interface
            const { data, error: findError } = await supabase
                .rpc('get_profile_by_invite_code', { code: inputCode.toUpperCase() })
                .single();

            const parent = data as { id: string; role: string } | null;

            if (findError || !parent) {
                // ✅ SECURITY FIX: Log via Logger (not console) so DB error detail stays out of prod console
                Logger.error('FamilyManager: Failed to find parent by invite code', findError);
                throw new Error(t('family.invalid_code', { defaultValue: 'Invalid invite code. Keep trying!' }));
            }

            // DB stores roles as lowercase ('parent', 'admin') — compare case-insensitively
            const parentRole = parent.role?.toLowerCase();
            if (parentRole !== 'parent' && parentRole !== 'admin') {
                throw new Error("This code does not belong to a Parent account.");
            }

            // 2. Link current user to this parent
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ parent_id: parent.id })
                .eq('id', user?.id);

            if (updateError) throw updateError;

            setSuccess("Successfully linked to Parent!");
            // Refresh user to update subscription status if inherited
            await refreshUser();

        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const copyCode = () => {
        if (inviteCode) {
            navigator.clipboard.writeText(inviteCode);
            setSuccess("Copied to clipboard!");
            setTimeout(() => setSuccess(null), 2000);
        }
    };

    if (!user) return null;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-black text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Users className="text-kid-primary" />
                {t('family.title', { defaultValue: 'Family Management' })}
            </h2>

            {/* PARENT VIEW */}
            {isParent && (
                <div className="space-y-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800 text-center">
                        <p className="text-blue-800 dark:text-blue-300 font-bold mb-2">{t('family.invite_label', { defaultValue: 'Your Kid\'s Invite Code' })}</p>

                        {loading && !inviteCode ? (
                            <p className="text-sm text-gray-500 mb-4 animate-pulse">Generating your unique invite code...</p>
                        ) : inviteCode ? (
                            <div className="flex items-center justify-center gap-4">
                                <span className="text-4xl font-mono font-black tracking-widest text-gray-800 dark:text-white">{inviteCode}</span>
                                <button onClick={copyCode} className="p-2 hover:bg-white/50 rounded-full transition-colors text-blue-500">
                                    <Copy size={20} />
                                </button>
                            </div>
                        ) : (
                            <p className="text-sm text-red-500 mb-4">Error generating invite code. Try refreshing.</p>
                        )}
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-2">{t('family.linked_kids', { defaultValue: 'Linked Children' })}</h3>
                        {linkedKids.length === 0 ? (
                            <p className="text-gray-400 italic text-sm">No children linked yet.</p>
                        ) : (
                            <ul className="space-y-2">
                                {linkedKids.map(kid => (
                                    <li key={kid.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                        <div className="w-8 h-8 rounded-full bg-kid-primary flex items-center justify-center text-white font-bold">
                                            {kid.username?.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="font-bold text-gray-700 dark:text-gray-200">{kid.username}</span>
                                        {kid.subscription_status === 'PREMIUM' && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-bold">PREMIUM</span>}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}

            {/* KID VIEW */}
            {isKid && (
                <div className="space-y-4">
                    {!user.parentId ? (
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-2xl border border-yellow-100 dark:border-yellow-800">
                            <h3 className="text-lg font-black text-yellow-800 dark:text-yellow-300 mb-2 flex items-center gap-2">
                                <Link size={20} />
                                {t('family.link_parent', { defaultValue: 'Link to Parent' })}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                Enter the code from your parent's dashboard to unlock Premium features!
                            </p>

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={inputCode}
                                    onChange={(e) => setInputCode(e.target.value)}
                                    placeholder="ENTER CODE"
                                    className="flex-1 p-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 font-mono font-bold uppercase text-center focus:border-yellow-400 outline-none"
                                    maxLength={6}
                                />
                                <button
                                    onClick={linkAccount}
                                    disabled={loading || !inputCode}
                                    className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-black py-3 px-6 rounded-xl shadow-[0_4px_0_0_rgba(202,138,4,1)] btn-juicy disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Linking...' : 'LINK'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-2xl border border-green-100 dark:border-green-800 flex items-center gap-4">
                            <div className="bg-green-100 dark:bg-green-800 p-3 rounded-full text-green-600 dark:text-green-300">
                                <ShieldCheck size={32} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-green-800 dark:text-green-300">
                                    {t('family.linked_success', { defaultValue: 'Linked to Family!' })}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    You are part of a family plan.
                                    {user.subscriptionStatus === 'PREMIUM' && ' Premium features unlocked! 🚀'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Notifications */}
            {success && (
                <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-xl flex items-center gap-2 animate-fade-in text-sm font-bold">
                    <Check size={16} /> {success}
                </div>
            )}
            {error && (
                <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-xl text-sm font-bold animate-shake">
                    {error}
                </div>
            )}
        </div>
    );
};
