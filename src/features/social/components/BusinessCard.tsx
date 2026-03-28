
import React, { useRef } from 'react';
import { useAppStore } from '../../../store';
import { motion } from 'framer-motion';
import { Coins, Zap, Flame, Trophy, Download, Share2, Star } from 'lucide-react';
import { Logger } from '../../../services/logger';
import { printCardElement, PopupBlockedError } from '../../../utils/printCard';

// â”€â”€â”€ HQ Level labels â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const HQ_LABEL: Record<string, { label: string; emoji: string }> = {
    hq_garage: { label: 'Garage HQ', emoji: 'ðŸšï¸' },
    hq_office: { label: 'Office HQ', emoji: 'ðŸ¢' },
    hq_highrise: { label: 'High-Rise HQ', emoji: 'ðŸ™ï¸' },
};

// â”€â”€â”€ Tier labels â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const TIER_LABEL: Record<string, { label: string; color: string }> = {
    intern: { label: 'Intern', color: 'from-gray-400 to-gray-500' },
    founder: { label: 'Founder', color: 'from-emerald-500 to-teal-500' },
    board: { label: 'Board Member', color: 'from-blue-500 to-indigo-600' },
    tycoon: { label: 'Tycoon', color: 'from-amber-500 to-orange-500' },
    classroom: { label: 'Classroom', color: 'from-purple-500 to-indigo-600' },
    teacher_solo: { label: 'Teacher', color: 'from-indigo-500 to-purple-600' },
    teacher_pro: { label: 'Teacher Pro', color: 'from-violet-500 to-purple-600' },
};

// â”€â”€â”€ Rank badge based on level â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const getRankTitle = (level: number) => {
    if (level >= 50) return { title: 'Legendary CEO', emoji: 'ðŸ‘‘' };
    if (level >= 30) return { title: 'Grand Tycoon', emoji: 'ðŸ’Ž' };
    if (level >= 20) return { title: 'Executive', emoji: 'ðŸ†' };
    if (level >= 10) return { title: 'Manager', emoji: 'â­' };
    if (level >= 5) return { title: 'Analyst', emoji: 'ðŸ“Š' };
    return { title: 'Intern', emoji: 'ðŸŽ“' };
};

// â”€â”€â”€ Card theme based on subscription tier â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const getCardTheme = (tier: string) => {
    switch (tier) {
        case 'tycoon':
            return {
                bg: 'bg-gradient-to-br from-amber-900 via-amber-800 to-orange-900',
                accent: 'from-amber-400 to-orange-400',
                badge: 'bg-amber-500/30 border-amber-400/50 text-amber-200',
                stat: 'bg-amber-900/60 border-amber-600/30',
                text: 'text-amber-100',
                subtext: 'text-amber-300',
                shine: 'from-amber-400/20',
            };
        case 'board':
            return {
                bg: 'bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-900',
                accent: 'from-blue-400 to-indigo-400',
                badge: 'bg-blue-500/30 border-blue-400/50 text-blue-200',
                stat: 'bg-blue-900/60 border-blue-600/30',
                text: 'text-blue-100',
                subtext: 'text-blue-300',
                shine: 'from-blue-400/20',
            };
        case 'founder':
            return {
                bg: 'bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-900',
                accent: 'from-emerald-400 to-teal-400',
                badge: 'bg-emerald-500/30 border-emerald-400/50 text-emerald-200',
                stat: 'bg-emerald-900/60 border-emerald-600/30',
                text: 'text-emerald-100',
                subtext: 'text-emerald-300',
                shine: 'from-emerald-400/20',
            };
        default:
            return {
                bg: 'bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900',
                accent: 'from-indigo-400 to-purple-400',
                badge: 'bg-indigo-500/30 border-indigo-400/50 text-indigo-200',
                stat: 'bg-indigo-900/60 border-indigo-600/30',
                text: 'text-indigo-100',
                subtext: 'text-indigo-300',
                shine: 'from-indigo-400/20',
            };
    }
};

// â”€â”€â”€ The printable card itself â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const CardFace = React.forwardRef<HTMLDivElement, { printMode?: boolean }>(
    ({ printMode = false }, ref) => {
        const { user } = useAppStore();
        if (!user) return null;

        const theme = getCardTheme(user.subscriptionTier);
        const rank = getRankTitle(user.level);
        const hq = HQ_LABEL[user.hqLevel] || { label: 'Garage HQ', emoji: 'ðŸšï¸' };
        const tierInfo = TIER_LABEL[user.subscriptionTier] || TIER_LABEL['intern'];
        const logo = user.businessLogo;
        const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        const xpToNext = (user.level + 1) * 100;
        const xpProgress = Math.min(100, (user.xp % xpToNext) / xpToNext * 100);
        const topSkill = user.unlockedSkills?.[0];

        return (
            <div
                ref={ref}
                className={`relative ${theme.bg} rounded-3xl overflow-hidden shadow-2xl`}
                style={{ width: '380px', minHeight: '220px' }}
                data-testid="business-card"
            >
                {/* Shine overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${theme.shine} via-transparent to-transparent pointer-events-none`} />
                {/* Decorative circles */}
                <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/5" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-white/5" />

                <div className="relative p-6 flex flex-col gap-4">
                    {/* Top row: Avatar / Logo + Name + Rank */}
                    <div className="flex items-center gap-4">
                        {/* Avatar / Logo */}
                        {logo ? (
                            <div
                                className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black flex-shrink-0 shadow-lg"
                                style={{ backgroundColor: logo.backgroundColor }}
                            >
                                <span style={{ color: logo.iconColor }}>{logo.icon}</span>
                            </div>
                        ) : (
                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${theme.accent} flex items-center justify-center text-2xl font-black text-white flex-shrink-0 shadow-lg`}>
                                {initials}
                            </div>
                        )}

                        <div className="flex-1 min-w-0">
                            <div className={`font-black text-xl ${theme.text} truncate leading-tight`}>
                                {logo?.companyName || user.name}
                            </div>
                            {logo?.companyName && (
                                <div className={`text-sm font-semibold ${theme.subtext} truncate`}>{user.name}</div>
                            )}
                            <div className="flex items-center gap-2 mt-1.5">
                                <span className={`text-xs font-black px-2.5 py-1 rounded-full border ${theme.badge} flex items-center gap-1`}>
                                    <span>{rank.emoji}</span> {rank.title}
                                </span>
                                <span className={`text-xs font-bold ${theme.subtext}`}>Lv.{user.level}</span>
                            </div>
                        </div>

                        {/* Tier badge */}
                        <div className={`flex-shrink-0 px-3 py-1.5 rounded-xl bg-gradient-to-r ${tierInfo.color} text-white text-[11px] font-black uppercase tracking-wide shadow-md`}>
                            {tierInfo.label}
                        </div>
                    </div>

                    {/* XP bar */}
                    <div>
                        <div className="flex justify-between mb-1">
                            <span className={`text-[11px] font-bold ${theme.subtext} uppercase tracking-wide`}>XP Progress</span>
                            <span className={`text-[11px] font-bold ${theme.subtext}`}>{user.xp.toLocaleString()} XP</span>
                        </div>
                        <div className="w-full h-2.5 bg-black/30 rounded-full overflow-hidden">
                            <div
                                className={`h-full bg-gradient-to-r ${theme.accent} rounded-full transition-all`}
                                style={{ width: `${xpProgress}%` }}
                            />
                        </div>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className={`rounded-xl p-3 border ${theme.stat} text-center`}>
                            <div className="flex items-center justify-center gap-1 mb-1">
                                <Coins size={12} className={theme.subtext} />
                                <span className={`text-[10px] font-black uppercase ${theme.subtext}`}>BizCoins</span>
                            </div>
                            <div className={`font-black text-base ${theme.text}`}>{user.bizCoins.toLocaleString()}</div>
                        </div>
                        <div className={`rounded-xl p-3 border ${theme.stat} text-center`}>
                            <div className="flex items-center justify-center gap-1 mb-1">
                                <Flame size={12} className={theme.subtext} />
                                <span className={`text-[10px] font-black uppercase ${theme.subtext}`}>Streak</span>
                            </div>
                            <div className={`font-black text-base ${theme.text}`}>{user.streak}ðŸ”¥</div>
                        </div>
                        <div className={`rounded-xl p-3 border ${theme.stat} text-center`}>
                            <div className="flex items-center justify-center gap-1 mb-1">
                                <Trophy size={12} className={theme.subtext} />
                                <span className={`text-[10px] font-black uppercase ${theme.subtext}`}>Lessons</span>
                            </div>
                            <div className={`font-black text-base ${theme.text}`}>{user.completedLessonIds.length}</div>
                        </div>
                    </div>

                    {/* Bottom row: HQ + Top Skill */}
                    <div className="flex items-center justify-between">
                        <div className={`flex items-center gap-1.5 text-xs font-bold ${theme.subtext}`}>
                            <span>{hq.emoji}</span> {hq.label}
                        </div>
                        {topSkill && (
                            <div className={`flex items-center gap-1 text-xs font-bold ${theme.badge} px-2.5 py-1 rounded-full border`}>
                                <Star size={10} /> {topSkill}
                            </div>
                        )}
                        <div className={`text-[11px] font-bold ${theme.subtext} opacity-60`}>
                            Profits Patrol â€¢ {new Date().getFullYear()}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
);

CardFace.displayName = 'CardFace';

// â”€â”€â”€ Main BusinessCard page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const BusinessCard: React.FC = () => {
    const cardRef = useRef<HTMLDivElement>(null);
    const { user } = useAppStore();

    const handleDownload = () => {
        if (!cardRef.current) return;
        try {
            printCardElement(cardRef.current);
        } catch (err) {
            if (err instanceof PopupBlockedError) {
                Logger.warn('BusinessCard: popup blocked');
                alert('Pop-up blocked. Please allow pop-ups to download your card.');
            } else {
                Logger.error('BusinessCard: unexpected print error', err);
            }
        }
    };

    const handleShare = async () => {
        const shareText = `ðŸš€ Check out my Profits Patrol Business Card!\n\nðŸ‘¤ ${user?.name}\nâ­ Level ${user?.level}\nðŸ’° ${user?.bizCoins?.toLocaleString()} BizCoins\nðŸ”¥ ${user?.streak} day streak\nðŸ“š ${user?.completedLessonIds?.length} lessons completed\n\nJoin me on Profits Patrol! ðŸ‘‘`;

        if (navigator.share) {
            try {
                await navigator.share({ title: 'My Business Card', text: shareText });
            } catch (err) {
                // SRE-02: User dismissed the share sheet â€” expected, but log for telemetry
                const isAbort = err instanceof Error && err.name === 'AbortError';
                if (!isAbort) {
                    Logger.warn('BusinessCard: share failed unexpectedly', { error: String(err) });
                }
                // Graceful degradation: fall through to clipboard copy
            }
        }

        // SRE-03: Guard clipboard API existence before calling
        if (navigator.clipboard?.writeText) {
            try {
                await navigator.clipboard.writeText(shareText);
                alert('ðŸ“‹ Card stats copied to clipboard! Paste anywhere to share.');
            } catch (err) {
                Logger.warn('BusinessCard: clipboard write failed', { error: String(err) });
                // Last resort â€” do nothing, user already used native share or was informed
            }
        }
    };

    if (!user) return null;

    return (
        <div className="flex flex-col items-center gap-6 py-4">
            <div className="text-center">
                <h2 className="font-black text-xl text-gray-800 dark:text-white mb-1">ðŸªª My Business Card</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Your shareable digital identity card</p>
            </div>

            {/* Card preview */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                whileHover={{ scale: 1.02, rotateY: 3 }}
                style={{ perspective: '1000px' }}
            >
                <CardFace ref={cardRef} />
            </motion.div>

            {/* Action buttons */}
            <div className="flex gap-3 w-full max-w-sm">
                <button
                    onClick={handleDownload}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black py-3 rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 transition-all hover:scale-105"
                >
                    <Download size={16} /> Save Card
                </button>
                <button
                    onClick={handleShare}
                    className="flex-1 flex items-center justify-center gap-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-black py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-700 transition-all hover:scale-105"
                >
                    <Share2 size={16} /> Share Stats
                </button>
            </div>

            {/* Tips */}
            <div className="w-full max-w-sm bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 text-sm">
                <div className="font-black text-amber-700 dark:text-amber-300 mb-1 flex items-center gap-1.5">
                    <Zap size={14} /> Level Up Your Card
                </div>
                <ul className="space-y-1 text-amber-600 dark:text-amber-400 font-medium">
                    <li>â€¢ Complete more lessons to raise your rank title</li>
                    <li>â€¢ Build your Business Logo in the HQ Designer</li>
                    <li>â€¢ Upgrade your subscription to unlock a premium card theme</li>
                </ul>
            </div>
        </div>
    );
};

export default BusinessCard;
