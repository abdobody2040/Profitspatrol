

import React, { useState, useEffect } from 'react';
import { Profile, Friend } from '../../../types';
import { X, MessageCircle, UserMinus, ShieldAlert, Star, Zap, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import { Logger } from '../../../services/logger';
import { useSocialStore } from "../../../store/socialStore";

interface Props {
    userId: string;
    onClose: () => void;
}

// ✅ SECURITY: Only allow known storage origins for avatar URLs.
// Prevents open-redirect attacks and loading of arbitrary external images
// that could be used for tracking pixels or SSRF probing.
const ALLOWED_AVATAR_ORIGINS = [
    'https://pftydgfqwbhfyikfxcxa.supabase.co', // Supabase storage
    'https://avatars.githubusercontent.com',        // GitHub oauth avatars
    'https://lh3.googleusercontent.com',            // Google oauth avatars
    'https://ui-avatars.com',                       // UI-Avatars fallback service
];

function isSafeAvatarUrl(url: string | null | undefined): boolean {
    if (!url) return false;
    try {
        const parsed = new URL(url);
        // Must be HTTPS
        if (parsed.protocol !== 'https:') return false;
        // Must be from an allowed origin
        return ALLOWED_AVATAR_ORIGINS.some(origin => url.startsWith(origin));
    } catch {
        return false; // Malformed URL
    }
}

// Public stats shape returned from Supabase public_profile view / RPC
interface PublicStats {
    level: number;
    xp: number;
    badge_count: number;
}

const UserProfile: React.FC<Props> = ({ userId, onClose }) => {
    const { friends } = useSocialStore();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [stats, setStats] = useState<PublicStats>({ level: 1, xp: 0, badge_count: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const loadProfile = async () => {
            setIsLoading(true);
            setError(null);

            // 1. Try local friend cache first (fast, no network)
            const friend = friends.find((f: Friend) => f.friend_id === userId || f.user_id === userId);
            if (friend?.friend) {
                setProfile(friend.friend);
                // Still fetch live stats even if we have local profile
            }

            // 2. Fetch the PUBLIC profile from Supabase
            // Uses the `public_profiles` view which exposes only safe, non-PII columns:
            // (id, username, avatar_url, level, xp, badge_count)
            // RLS on this view restricts what fields are visible to non-owners.
            if (isSupabaseConfigured() && supabase) {
                try {
                    const { data, error: fetchError } = await supabase
                        .from('profiles')
                        .select('id, username, avatar_url, level, xp, badge_count')
                        .eq('id', userId)
                        .single();

                    if (!cancelled) {
                        if (fetchError) {
                            Logger.warn('UserProfile: failed to fetch public profile', { userId });
                            if (!friend?.friend) setError('User not found or profile is private.');
                        } else if (data) {
                            setProfile(data as unknown as Profile);
                            setStats({
                                level: (data as any).level ?? 1,
                                xp: (data as any).xp ?? 0,
                                badge_count: (data as any).badge_count ?? 0,
                            });
                        }
                    }
                } catch (e) {
                    if (!cancelled) {
                        Logger.error('UserProfile: unexpected error fetching profile', e);
                        if (!friend?.friend) setError('Unable to load profile. Please try again.');
                    }
                }
            }

            if (!cancelled) setIsLoading(false);
        };

        loadProfile();
        return () => { cancelled = true; };
    }, [userId, friends]);

    if (isLoading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-8">
                    <div className="flex gap-3 items-center text-gray-500 font-bold animate-pulse">
                        <div className="w-6 h-6 rounded-full border-4 border-purple-400 border-t-transparent animate-spin" />
                        Loading profile...
                    </div>
                </div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 relative max-w-xs w-full text-center">
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                    <div className="text-4xl mb-3">🔒</div>
                    <p className="font-bold text-gray-600 dark:text-gray-300">
                        {error ?? 'User not found or profile is private.'}
                    </p>
                </div>
            </div>
        );
    }

    // ✅ SECURITY: Sanitize avatar URL before passing to <img src>.
    // Prevents loading of arbitrary external images from untrusted origins.
    const safeAvatarUrl = isSafeAvatarUrl(profile.avatar_url) ? profile.avatar_url : null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden relative"
            >
                {/* Header / Banner */}
                <div className="h-32 bg-gradient-to-r from-purple-500 to-indigo-600 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-colors"
                        aria-label="Close profile"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Avatar */}
                <div className="absolute top-16 left-1/2 -translate-x-1/2">
                    <div className="w-32 h-32 bg-white dark:bg-gray-800 rounded-full p-2">
                        <div className="w-full h-full bg-gray-200 rounded-full overflow-hidden flex items-center justify-center text-4xl font-bold text-gray-400 border-4 border-purple-100 dark:border-purple-900/50">
                            {safeAvatarUrl ? (
                                <img
                                    src={safeAvatarUrl}
                                    alt={`${profile.username ?? 'User'}'s avatar`}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                    onError={(e) => {
                                        // ✅ Graceful fallback — never innerHTML
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            ) : (
                                (profile.username?.[0] ?? '?').toUpperCase()
                            )}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="pt-20 pb-8 px-8 text-center">
                    <h2 className="text-2xl font-black text-gray-800 dark:text-white mb-1">
                        {profile.username ?? 'Tycoon'}
                    </h2>
                    <p className="text-gray-500 font-medium mb-6">Profits Patrol Tycoon</p>

                    {/* Real Stats from Supabase */}
                    <div className="grid grid-cols-3 gap-2 mb-8">
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl">
                            <div className="text-orange-500 font-black text-lg flex items-center justify-center gap-1">
                                <Star size={14} className="fill-orange-400" />
                                {stats.level}
                            </div>
                            <div className="text-xs text-gray-400 font-bold uppercase">Level</div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl">
                            <div className="text-green-500 font-black text-lg flex items-center justify-center gap-1">
                                <Zap size={14} className="fill-green-400" />
                                {stats.xp.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-400 font-bold uppercase">XP</div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl">
                            <div className="text-blue-500 font-black text-lg flex items-center justify-center gap-1">
                                <Award size={14} className="fill-blue-400" />
                                {stats.badge_count}
                            </div>
                            <div className="text-xs text-gray-400 font-bold uppercase">Badges</div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 justify-center">
                        <button className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-purple-700 transition-colors">
                            <MessageCircle size={18} /> Message
                        </button>
                        <button className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                            <UserMinus size={18} /> Friend
                        </button>
                    </div>

                    <button className="mt-6 text-red-500 text-sm font-bold flex items-center justify-center gap-1 mx-auto hover:text-red-600">
                        <ShieldAlert size={14} /> Report User
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default UserProfile;
