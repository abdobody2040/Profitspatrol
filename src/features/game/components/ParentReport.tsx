import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Mail, Send, CheckCircle2, Loader2, X, BarChart2, Star, Flame, BookOpen, Briefcase } from 'lucide-react';
import { useAppStore } from '../../../store';
import { supabase } from '../../../lib/supabase';

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
    return (
        <div className={`flex flex-col items-center gap-1 p-3 rounded-2xl text-center`} style={{ background: `${color}15` }}>
            <div style={{ color }}>{icon}</div>
            <p className="font-black text-xl" style={{ color }}>{value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">{label}</p>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
interface ParentReportProps { onClose?: () => void; }

export const ParentReport: React.FC<ParentReportProps> = ({ onClose }) => {
    const { t } = useTranslation();
    const { user, users } = useAppStore();

    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Determine target kid — PARENT views their linked kid; KID views themselves
    const isParent = user?.role === 'PARENT';
    const kid = isParent
        ? (users.find(u => u.parentId === user?.id || u.id === user?.linkedKidId) ?? user)
        : user;

    const parentEmail = user?.email ?? '';
    const parentName = isParent ? (user?.name ?? 'Parent') : 'Parent';
    const month = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

    const stats = [
        { icon: <Star size={18} />, label: 'XP Earned', value: (kid?.xp ?? 0).toLocaleString(), color: '#6366F1' },
        { icon: <BarChart2 size={18} />, label: 'CEO Level', value: kid?.level ?? 1, color: '#8B5CF6' },
        { icon: <span className="font-black text-base">🪙</span>, label: 'BizCoins', value: (kid?.bizCoins ?? 0).toLocaleString(), color: '#F59E0B' },
        { icon: <BookOpen size={18} />, label: 'Lessons', value: (kid?.lessonsCompleted ?? 0), color: '#10B981' },
        { icon: <Briefcase size={18} />, label: 'Gigs Done', value: (kid?.gigsCompleted ?? 0), color: '#0EA5E9' },
        { icon: <Flame size={18} />, label: 'Day Streak', value: (kid?.streakDays ?? 0), color: '#EF4444' },
    ];

    const handleSend = async () => {
        if (!kid?.id || !parentEmail) return;
        setSending(true);
        setError(null);
        try {
            if (!supabase) throw new Error('Supabase client not initialized');
            const { error: fnError } = await supabase.functions.invoke('monthly-report', {
                body: {
                    kidUserId: kid.id,
                    parentEmail,
                    parentName,
                },
            });
            if (fnError) throw fnError;
            setSent(true);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Failed to send report');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="flex flex-col gap-4 max-w-sm w-full mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-black text-gray-800 dark:text-white flex items-center gap-2">
                        <Mail className="w-5 h-5 text-indigo-500" />
                        {t('report.title')}
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">{t('report.subtitle')}</p>
                </div>
                {onClose && <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400"><X size={18} /></button>}
            </div>

            {/* Kid banner */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-4 flex items-center gap-3 text-white">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-black">
                    {kid?.name?.charAt(0) ?? '?'}
                </div>
                <div>
                    <p className="font-black">{kid?.name ?? 'Unknown Kid'}</p>
                    <p className="text-xs opacity-70">Level {kid?.level ?? 1} CEO · {month}</p>
                </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-2">
                {stats.map(s => (
                    <StatCard key={s.label} icon={s.icon} label={s.label} value={s.value} color={s.color} />
                ))}
            </div>

            {/* Top achievement */}
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-2xl p-3 flex items-center gap-3">
                <span className="text-2xl">🌟</span>
                <div>
                    <p className="text-xs font-bold text-amber-700 dark:text-amber-400">Top Achievement</p>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {kid?.topAchievement ?? 'Completed first business lesson!'}
                    </p>
                </div>
            </div>

            {/* Email destination */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-3">
                <p className="text-xs text-gray-500 mb-1">Report will be sent to:</p>
                <p className="font-bold text-sm text-gray-800 dark:text-white flex items-center gap-1.5">
                    <Mail size={14} className="text-indigo-400" />
                    {parentEmail || 'No parent email linked'}
                </p>
            </div>

            {/* Error */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-xl p-3 text-center">
                    {error}
                </div>
            )}

            {/* Send Button */}
            {sent ? (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 font-black text-sm">
                    <CheckCircle2 size={18} />
                    Report Sent! Check {parentEmail}
                </motion.div>
            ) : (
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={handleSend}
                    disabled={sending || !parentEmail}
                    className="w-full py-3 rounded-2xl font-black text-white bg-gradient-to-r from-indigo-500 to-purple-600 disabled:opacity-50 flex items-center justify-center gap-2">
                    {sending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                    {sending ? 'Sending...' : t('report.send_btn')}
                </motion.button>
            )}

            <p className="text-center text-xs text-gray-300 dark:text-gray-600">Reports are sent securely via email · Monthly</p>
        </div>
    );
};

export default ParentReport;
