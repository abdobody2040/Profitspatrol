import React, { useState } from 'react';
import { Share2, Copy, CheckCircle2, Gift, Users, Coins } from 'lucide-react';
import { useAppStore } from '../../../store';
import { useTranslation } from 'react-i18next';
import { Logger } from '../../../services/logger';

export const ReferralPanel: React.FC = () => {
    const { user } = useAppStore();
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);

    // If somehow the user doesn't have a code yet (e.g., old account before migration), 
    // we show a fallback or a button to generate one. For now, assume the DB trigger handled it.
    const inviteCode = user?.referralCode || 'PENDING';
    const inviteLink = `${window.location.origin}/invite/${inviteCode}`;
    const totalReferrals = user?.totalReferrals || 0;
    const totalEarned = totalReferrals * 500; // 500 BizCoins per referral

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(inviteLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            // ✅ SECURITY FIX: Clipboard errors can expose browser fingerprint data in raw form
            Logger.error('ReferralPanel: Failed to copy invite link to clipboard', err);
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Join me on Profits Patrol!',
                    text: `Use my invite code ${inviteCode} to get started!`,
                    url: inviteLink,
                });
            } catch (err) {
                // Note: AbortError is normal if user dismisses share sheet — no need to alert
                Logger.warn('ReferralPanel: Share dismissed or failed', { error: String(err) });
            }
        } else {
            handleCopy();
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
                <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-16 h-16 bg-white opacity-10 rounded-full blur-lg"></div>

                <Gift className="w-12 h-12 mx-auto mb-3 text-indigo-100" />
                <h2 className="text-2xl font-bold mb-2">Invite Friends, Earn Rewards!</h2>
                <p className="text-indigo-100 max-w-sm mx-auto">
                    Get <strong className="text-yellow-300">500 BizCoins</strong> for every friend who signs up using your link.
                </p>
            </div>

            <div className="p-6">
                {/* Invite Link Section */}
                <div className="mb-8">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Your Unique Invite Link
                    </label>
                    <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 flex items-center justify-between">
                            <code className="text-indigo-600 dark:text-indigo-400 font-mono text-sm truncate">
                                {inviteLink}
                            </code>
                        </div>
                        <button
                            onClick={handleCopy}
                            className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors shrink-0"
                            title="Copy Link"
                        >
                            {copied ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                        </button>
                        <button
                            onClick={handleShare}
                            className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shrink-0 shadow-lg shadow-indigo-200 dark:shadow-none"
                            title="Share"
                        >
                            <Share2 className="w-5 h-5" />
                        </button>
                    </div>
                    {copied && <p className="text-emerald-500 text-sm mt-2 font-medium">Link copied to clipboard!</p>}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 dark:bg-slate-750 border border-slate-100 dark:border-slate-700 rounded-xl p-4 text-center">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Users className="w-5 h-5" />
                        </div>
                        <div className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
                            {totalReferrals}
                        </div>
                        <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Friends Invited
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-750 border border-slate-100 dark:border-slate-700 rounded-xl p-4 text-center">
                        <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-600 dark:text-yellow-400 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Coins className="w-5 h-5" />
                        </div>
                        <div className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
                            {totalEarned}
                        </div>
                        <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            BizCoins Earned
                        </div>
                    </div>
                </div>
            </div>

            {/* Parent Bonus Note */}
            <div className="bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 p-4 text-center">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Parent Bonus:</span> If your friend upgrades to Premium, your parents get 1 Free Month! 🎉
                </p>
            </div>
        </div>
    );
};
