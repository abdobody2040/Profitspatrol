import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../../store';
import { supabase } from '../../../lib/supabase';
import { UserRole } from '../../../types';
import { Logger } from '../../../services/logger';
import { Users, Copy, Check, Link, ShieldCheck } from "lucide-react";
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
        if (!user) return;
        setLoading(true);

        // 1. Check user model in store first
        if (user.referralCode) {
            setInviteCode(user.referralCode);
            setLoading(false);
            return;
        }

        // 2. Check localStorage for previously generated invite code
        const cachedCode = localStorage.getItem(`family_invite_code_${user.id}`);
        if (cachedCode) {
            setInviteCode(cachedCode);
            setLoading(false);
            return;
        }

        // 3. Try Supabase if configured
        if (supabase) {
            try {
                Logger.info('FamilyManager: Fetching invite code from DB');
                const { data, error } = await supabase
                    .from('profiles')
                    .select('invite_code')
                    .eq('id', user.id)
                    .single();

                if (!error && data?.invite_code) {
                    setInviteCode(data.invite_code);
                    localStorage.setItem(`family_invite_code_${user.id}`, data.invite_code);
                    setLoading(false);
                    return;
                }
            } catch (e) {
                Logger.warn('FamilyManager: Supabase fetch failed, falling back to local generation', { error: String(e) });
            }
        }

        // 4. Auto-generate persistent code if missing
        await generateCode();
    };

    const fetchLinkedKids = async () => {
        if (!user) return;
        try {
            if (supabase) {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('parent_id', user.id);

                if (!error && data && data.length > 0) {
                    setLinkedKids(data);
                    return;
                }
            }

            // Fallback: check localStorage all_profiles
            const rawProfiles = localStorage.getItem('profits_patrol_all_profiles');
            if (rawProfiles) {
                const profiles = JSON.parse(rawProfiles);
                const kids = profiles.filter((p: any) => p.parent_id === user.id || p.parentId === user.id);
                setLinkedKids(kids);
            }
        } catch (e) {
            Logger.warn("FamilyManager: Error fetching kids", { error: String(e) });
        }
    };

    const generateCode = async () => {
        setLoading(true);
        setError(null);
        try {
            const raw = user?.id ? user.id.replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase() : Math.random().toString(36).substring(2, 6).toUpperCase();
            const newCode = `FAM-${raw || '8P2X'}`;

            if (user?.id) {
                localStorage.setItem(`family_invite_code_${user.id}`, newCode);
            }

            if (supabase && user?.id) {
                try {
                    await supabase
                        .from('profiles')
                        .update({ invite_code: newCode })
                        .eq('id', user.id);
                } catch (dbErr) {
                    Logger.warn('FamilyManager: Supabase update skipped/failed', { error: String(dbErr) });
                }
            }

            setInviteCode(newCode);
            Logger.info('FamilyManager: Invite code generated successfully');
        } catch (e) {
            Logger.error('FamilyManager: Exception in generateCode', e);
            const fallbackCode = `FAM-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
            setInviteCode(fallbackCode);
        } finally {
            setLoading(false);
        }
    };

    const linkAccount = async () => {
        if (!inputCode || !user) return;
        setLoading(true);
        setError(null);
        setSuccess(null);

        const codeToMatch = inputCode.trim().toUpperCase();

        try {
            let parentId = null;

            // 1. Try Supabase RPC if configured
            if (supabase) {
                try {
                    const { data, error: findError } = await supabase
                        .rpc('get_profile_by_invite_code', { code: codeToMatch })
                        .single();

                    const parent = data as { id: string; role: string } | null;
                    if (!findError && parent) {
                        const parentRole = parent.role?.toLowerCase();
                        if (parentRole === 'parent' || parentRole === 'admin') {
                            parentId = parent.id;
                        }
                    }
                } catch (rpcErr) {
                    Logger.warn('FamilyManager: RPC lookup skipped', { error: String(rpcErr) });
                }
            }

            // 2. Fallback: Check local storage invite codes
            if (!parentId) {
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && key.startsWith('family_invite_code_')) {
                        const storedCode = localStorage.getItem(key);
                        if (storedCode && storedCode.toUpperCase() === codeToMatch) {
                            parentId = key.replace('family_invite_code_', '');
                            break;
                        }
                    }
                }
            }

            // 3. Fallback: check all_profiles
            if (!parentId) {
                const rawProfiles = localStorage.getItem('profits_patrol_all_profiles');
                if (rawProfiles) {
                    const profiles = JSON.parse(rawProfiles);
                    const match = profiles.find((p: any) =>
                        (p.invite_code && p.invite_code.toUpperCase() === codeToMatch) ||
                        (p.referralCode && p.referralCode.toUpperCase() === codeToMatch)
                    );
                    if (match) parentId = match.id;
                }
            }

            if (!parentId) {
                throw new Error(t('family.invalid_code', { defaultValue: 'Invalid invite code. Keep trying!' }));
            }

            // Link to parent
            if (supabase) {
                try {
                    await supabase
                        .from('profiles')
                        .update({ parent_id: parentId })
                        .eq('id', user.id);
                } catch (dbErr) {
                    Logger.warn('FamilyManager: Supabase link update failed', { error: String(dbErr) });
                }
            }

            // Update local state and store so linking works immediately in all environments
            const storeState = useAppStore.getState();
            const parentUser = storeState.users.find(u => u.id === parentId);
            const isParentPaid = parentUser && (
                parentUser.subscriptionStatus === 'PREMIUM' ||
                (parentUser.subscriptionTier && parentUser.subscriptionTier !== 'intern')
            );

            const updatedKid = {
                ...user,
                parentId,
                ...(isParentPaid ? {
                    subscriptionStatus: 'PREMIUM' as const,
                    subscriptionTier: parentUser.subscriptionTier,
                    billingCycle: parentUser.billingCycle
                } : {})
            };

            useAppStore.setState(state => ({
                user: state.user?.id === user.id ? updatedKid : state.user,
                users: state.users.map(u => {
                    if (u.id === user.id) return updatedKid;
                    if (u.id === parentId) return { ...u, linkedChildId: user.id };
                    return u;
                })
            }));

            // Persist link to localStorage all_profiles if present
            const rawProfiles = localStorage.getItem('profits_patrol_all_profiles');
            if (rawProfiles) {
                try {
                    const profiles = JSON.parse(rawProfiles);
                    const updatedProfiles = profiles.map((p: any) =>
                        p.id === user.id ? { 
                            ...p, 
                            parent_id: parentId, 
                            parentId,
                            ...(isParentPaid ? { 
                                subscription_status: 'PREMIUM', 
                                subscription_tier: parentUser.subscriptionTier 
                            } : {}) 
                        } :
                        p.id === parentId ? { ...p, linkedChildId: user.id } : p
                    );
                    localStorage.setItem('profits_patrol_all_profiles', JSON.stringify(updatedProfiles));
                } catch { /* ignore */ }
            }

            setSuccess(t('family.linked_parent_success', { defaultValue: "Successfully linked to Parent!" }));
            await refreshUser();

        } catch (e: any) {
            setError(e.message || t('family.invalid_code', { defaultValue: 'Invalid invite code.' }));
        } finally {
            setLoading(false);
        }
    };

    const copyCode = () => {
        if (inviteCode) {
            navigator.clipboard.writeText(inviteCode);
            setSuccess(t('family.copied', { defaultValue: "Copied to clipboard!" }));
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
                            <p className="text-sm text-gray-500 mb-4 animate-pulse">{t('family.generating_code', { defaultValue: 'Generating your unique invite code...' })}</p>
                        ) : inviteCode ? (
                            <div className="flex items-center justify-center gap-4">
                                <span className="text-4xl font-mono font-black tracking-widest text-gray-800 dark:text-white">{inviteCode}</span>
                                <button onClick={copyCode} className="p-2 hover:bg-white/50 rounded-full transition-colors text-blue-500">
                                    <Copy size={20} />
                                </button>
                            </div>
                        ) : (
                            <p className="text-sm text-red-500 mb-4">{t('family.error_generating', { defaultValue: 'Error generating invite code. Try refreshing.' })}</p>
                        )}
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-2">{t('family.linked_kids', { defaultValue: 'Linked Children' })}</h3>
                        {linkedKids.length === 0 ? (
                            <p className="text-gray-400 italic text-sm">{t('family.no_kids', { defaultValue: 'No children linked yet.' })}</p>
                        ) : (
                            <ul className="space-y-2">
                                {linkedKids.map(kid => (
                                    <li key={kid.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                        <div className="w-8 h-8 rounded-full bg-kid-primary flex items-center justify-center text-white font-bold">
                                            {kid.username?.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="font-bold text-gray-700 dark:text-gray-200">{kid.username}</span>
                                        {kid.subscription_status === 'PREMIUM' && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-bold">{t('family.premium_badge', { defaultValue: 'PREMIUM' })}</span>}
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
                                {t('family.link_desc', { defaultValue: "Enter the code from your parent's dashboard to unlock Premium features!" })}
                            </p>

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={inputCode}
                                    onChange={(e) => setInputCode(e.target.value)}
                                    placeholder={t('family.link_placeholder', { defaultValue: 'ENTER CODE' })}
                                    className="flex-1 p-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 font-mono font-bold uppercase text-center focus:border-yellow-400 outline-none"
                                    maxLength={6}
                                />
                                <button
                                    onClick={linkAccount}
                                    disabled={loading || !inputCode}
                                    className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-black py-3 px-6 rounded-xl shadow-[0_4px_0_0_rgba(202,138,4,1)] btn-juicy disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? t('family.linking', { defaultValue: 'Linking...' }) : t('family.link_button', { defaultValue: 'LINK' })}
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
                                    {t('family.part_of_family', { defaultValue: 'You are part of a family plan.' })}
                                    {user.subscriptionStatus === 'PREMIUM' && ` ${t('family.premium_unlocked', { defaultValue: 'Premium features unlocked! 🚀' })}`}
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
