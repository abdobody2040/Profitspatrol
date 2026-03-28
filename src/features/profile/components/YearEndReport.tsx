import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../../store';
import { Download, Award, Star, TrendingUp, Briefcase, Eye, X, BookOpen, Coins, Flame, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { INITIAL_HUSTLES } from '../../../store/slices/sideHustleSlice';
import { getGigLevel } from '../../../store/slices/sideHustleSlice';
import { Logger } from '../../../services/logger';
import { useEconomyStore } from "../../../store/economyStore";

// ─── Helper ──────────────────────────────────────────────────────────────────

const rankTitle = (level: number, t: any) =>
    level >= 10 ? t('yearEndReport.rankCeo', '👑 CEO') :
        level >= 7 ? t('yearEndReport.rankTycoon', '🏆 Tycoon') :
            level >= 5 ? t('yearEndReport.rankExecutive', '⭐ Executive') :
                level >= 3 ? t('yearEndReport.rankManager', '📈 Manager') : t('yearEndReport.rankIntern', '🌱 Intern');

// ─── PDF Template ────────────────────────────────────────────────────────────

interface PDFTemplateProps {
    user: any;
    gigXp: Record<string, number>;
    library: any[];
    franchise: any;
    topGigs: { title: string; level: number }[];
    booksRead: number;
    t: any; // Quick fix for i18next TFunction compatibility
}

const PDFTemplate = React.forwardRef<HTMLDivElement, PDFTemplateProps>(
    ({ user, gigXp, library, franchise, topGigs, booksRead, t }, ref) => {
        const topSkill = user.unlockedSkills?.length > 0
            ? user.unlockedSkills[user.unlockedSkills.length - 1].replace(/_/g, ' ')
            : 'Business Basics';

        // Check if current language is Arabic to apply RTL
        const isRTL = t('yearEndReport.pdfHeaderDesc') !== 'Official Annual Report Card' && t('yearEndReport.pdfHeaderDesc')?.match(/[\u0600-\u06FF]/);

        return (
            <div
                ref={ref}
                className="bg-white text-gray-900"
                style={{
                    width: '794px',
                    minHeight: '1122px',
                    fontFamily: 'system-ui, sans-serif',
                    padding: '60px 60px 48px',
                    direction: isRTL ? 'rtl' : 'ltr',
                    textAlign: isRTL ? 'right' : 'left'
                }}
            >
                {/* ── Header ── */}
                <div style={{ borderBottom: '4px solid #6366f1', paddingBottom: 32, marginBottom: 36, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
                        {/* Use an absolute origin or an inline SVG/base64 to ensure html2canvas grabs it. Using window.location.origin solves relative path issues. */}
                        <img src={window.location.origin + "/app_logo.png"} alt="Profits Patrol" style={{ height: 48, objectFit: 'contain' }} crossOrigin="anonymous" />
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#9ca3af', letterSpacing: '3px', textTransform: 'uppercase', marginTop: 12 }}>{t('yearEndReport.pdfHeaderDesc', 'Official Annual Report Card')}</div>
                    </div>
                    <div style={{ textAlign: isRTL ? 'left' : 'right' }}>
                        <div style={{ fontSize: 26, fontWeight: 900 }}>{user.name}</div>
                        <div style={{ fontSize: 13, color: '#6366f1', fontWeight: 700, marginTop: 4 }}>{rankTitle(user.level, t)}</div>
                        <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                    </div>
                </div>

                {/* ── Intro ── */}
                {/* ✅ SECURITY FIX: No dangerouslySetInnerHTML. Safe bold-markdown renderer using React elements only. */}
                <p style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 36, color: '#374151', textAlign: isRTL ? 'right' : 'left' }}>
                    {t('yearEndReport.pdfIntro', { name: user.name })
                        .split(/\*\*(.*?)\*\*/g)
                        .map((part: string, i: number) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part)}
                </p>


                {/* ── Core Metrics ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 36, direction: isRTL ? 'rtl' : 'ltr' }}>
                    {[
                        { label: t('yearEndReport.statXp', 'Total XP'), value: user.xp.toLocaleString(), emoji: '⚡', color: '#fef3c7', border: '#fcd34d' },
                        { label: t('yearEndReport.statLessons', 'Lessons Done'), value: user.completedLessonIds?.length ?? 0, emoji: '📚', color: '#ede9fe', border: '#a78bfa' },
                        { label: t('yearEndReport.statStreak', 'Day Streak'), value: `${user.streak ?? 0}🔥`, emoji: '🔥', color: '#fef9c3', border: '#facc15' },
                        { label: t('yearEndReport.statCoins', 'BizCoins'), value: (user.bizCoins ?? 0).toLocaleString(), emoji: '🪙', color: '#d1fae5', border: '#34d399' },
                        { label: t('yearEndReport.statBooks', 'Books Read'), value: booksRead, emoji: '📖', color: '#dbeafe', border: '#60a5fa' },
                        { label: 'Level', value: user.level, emoji: '🏅', color: '#ffe4e6', border: '#f87171' },
                    ].map((s, i) => (
                        <div key={i} style={{ background: s.color, border: `2px solid ${s.border}`, borderRadius: 16, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, flexDirection: isRTL ? 'row-reverse' : 'row', textAlign: isRTL ? 'right' : 'left' }}>
                            <span style={{ fontSize: 26 }}>{s.emoji}</span>
                            <div>
                                <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
                                <div style={{ fontSize: 24, fontWeight: 900, marginTop: 2 }}>{s.value}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Executive Summary ── */}
                <div style={{ background: '#eef2ff', border: '2px solid #c7d2fe', borderRadius: 20, padding: '24px 28px', marginBottom: 28, textAlign: isRTL ? 'right' : 'left' }}>
                    <div style={{ fontSize: 16, fontWeight: 900, color: '#4338ca', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, justifyContent: isRTL ? 'flex-end' : 'flex-start' }}>
                        {isRTL ? <>{t('yearEndReport.pdfExecutiveSummary', 'Executive Summary')} 💼</> : <>💼 {t('yearEndReport.pdfExecutiveSummary', 'Executive Summary')}</>}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, direction: isRTL ? 'rtl' : 'ltr' }}>
                        <div><strong>{t('yearEndReport.pdfLevelReached', 'Level Reached:')}</strong> Level {user.level} — {rankTitle(user.level, t)}</div>
                        <div><strong>{t('yearEndReport.pdfTopSkill', 'Top Market Skill:')}</strong> <span style={{ textTransform: 'capitalize' }}>{topSkill}</span></div>
                        <div><strong>{t('yearEndReport.pdfSkillsUnlocked', 'Skills Unlocked:')}</strong> {user.unlockedSkills?.length ?? 0}</div>
                        <div><strong>{t('yearEndReport.pdfFranchiseTier', 'Franchise Tier:')}</strong> {franchise?.isOpen ? franchise.tier : t('yearEndReport.pdfNotOpened', 'Not Opened')}</div>
                    </div>
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #c7d2fe', color: '#3730a3', fontStyle: 'italic', fontSize: 13, textAlign: isRTL ? 'right' : 'left' }}>
                        {t('yearEndReport.pdfInstructorNotes', 'Instructor Notes: Demonstrates high potential for leadership and entrepreneurship. Ready for the next venture!')}
                    </div>
                </div>

                {/* ── Gig Mastery ── */}
                {topGigs.length > 0 && (
                    <div style={{ marginBottom: 28 }}>
                        <div style={{ fontSize: 14, fontWeight: 900, color: '#374151', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: 6, justifyContent: isRTL ? 'flex-end' : 'flex-start' }}>
                            {isRTL ? <>{t('yearEndReport.pdfGigMastery', 'Gig Mastery')} 🎯</> : <>🎯 {t('yearEndReport.pdfGigMastery', 'Gig Mastery')}</>}
                        </div>
                        <div style={{ display: 'flex', gap: 10, flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                            {topGigs.slice(0, 3).map((g, i) => (
                                <div key={i} style={{ flex: 1, background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: '12px 16px', textAlign: isRTL ? 'right' : 'left' }}>
                                    <div style={{ fontSize: 11, color: '#9ca3af' }}>#{i + 1}</div>
                                    <div style={{ fontWeight: 800, fontSize: 13, marginTop: 2 }}>{g.title}</div>
                                    <div style={{ color: '#6366f1', fontWeight: 700, fontSize: 12, marginTop: 4 }}>Level {g.level}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Footer ── */}
                <div style={{ marginTop: 'auto', borderTop: '1px solid #e5e7eb', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.5, fontSize: 11, fontWeight: 600, flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                    <span>{t('yearEndReport.pdfDocId', 'Document ID:')} {user.id?.substring(0, 12).toUpperCase()}</span>
                    <span>{t('yearEndReport.pdfFooterCopyright', { year: new Date().getFullYear() })}</span>
                </div>
            </div>
        );
    }
);

// ─── Preview Modal ────────────────────────────────────────────────────────────

interface PreviewModalProps {
    onClose: () => void;
    onDownload: () => void;
    isGenerating: boolean;
    children: React.ReactNode;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ onClose, onDownload, isGenerating, children }) => {
    const { t } = useTranslation();
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <div>
                        <h3 className="text-xl font-black text-gray-800">📄 {t('yearEndReport.previewModalTitle', 'Report Card Preview')}</h3>
                        <p className="text-sm text-gray-500 font-medium mt-0.5">{t('yearEndReport.previewModalDesc', 'This is exactly what your PDF will look like')}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onDownload}
                            disabled={isGenerating}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold transition-colors disabled:opacity-50 shadow-lg shadow-indigo-200"
                        >
                            {isGenerating
                                ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                                : <Download size={18} />}
                            {isGenerating ? 'Generating…' : 'Download PDF'}
                        </button>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Scrollable Preview */}
                <div className="overflow-y-auto flex-1 p-6 bg-gray-100 rounded-b-3xl">
                    <div className="shadow-2xl rounded-2xl overflow-hidden mx-auto" style={{ width: 'fit-content' }}>
                        <div style={{ transform: 'scale(0.75)', transformOrigin: 'top center', display: 'inline-block' }}>
                            {children}
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const YearEndReport: React.FC = () => {
    const { t } = useTranslation();
    const { user, library, franchise } = useAppStore();
    const { gigXp } = useEconomyStore();
    const reportRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    if (!user) return null;

    // ── Derived Stats ──
    const booksRead = (user.readBookIds || []).length;

    const topGigs = INITIAL_HUSTLES
        .map((h: any) => ({ id: h.id, title: h.title, level: getGigLevel(h.id, gigXp) }))
        .filter((g: any) => g.level > 0)
        .sort((a: any, b: any) => b.level - a.level)
        .slice(0, 3);

    const totalGigLevels = Object.keys(gigXp).length;

    // ── PDF Generation ──
    const generatePDF = async () => {
        if (!reportRef.current) return;
        setIsGenerating(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500)); // wait extra bit for images and fonts
            const canvas = await html2canvas(reportRef.current, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                logging: false,
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pw = pdf.internal.pageSize.getWidth();
            const ph = (canvas.height * pw) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pw, ph);
            pdf.save(`${user.name.replace(/\s+/g, '_')}_Profits_Patrol_Annual_Report.pdf`);
        } catch (err) {
            // ✅ SECURITY FIX: html2canvas errors may include child's name from the PDF filename string
            Logger.error('YearEndReport: PDF generation failed', err);
            alert(t('yearEndReport.errorMsg', 'Sorry, there was an issue generating your report.'));
        } finally {
            setIsGenerating(false);
        }
    };

    const templateProps = { user, gigXp, library, franchise, topGigs, booksRead, t };

    return (
        <>
            {/* ── Hidden PDF Template ── */}
            <div className="absolute overflow-hidden" style={{ left: -9999, top: -9999, width: 794 }}>
                <PDFTemplate ref={reportRef} {...templateProps} />
            </div>

            {/* ── Visible Card ── */}
            <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-700 rounded-3xl p-[2px] shadow-xl shadow-indigo-200 dark:shadow-indigo-900/40">
                <div className="bg-white dark:bg-gray-900 rounded-[22px] p-6">
                    {/* Header row */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                                    <Award size={20} className="text-white" />
                                </div>
                                <h3 className="text-xl font-black text-gray-800 dark:text-white">
                                    {t('yearEndReport.title', 'Annual Report Card')}
                                </h3>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium ml-11">
                                {t('yearEndReport.subtitle', 'Your fiscal year in review — ready for download!')}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowPreview(true)}
                                className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors"
                            >
                                <Eye size={16} />
                                {t('yearEndReport.previewBtn', 'Preview')}
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={generatePDF}
                                disabled={isGenerating}
                                className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md shadow-indigo-200 dark:shadow-indigo-900/30 disabled:opacity-50"
                            >
                                {isGenerating
                                    ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                                    : <Download size={16} />}
                                {isGenerating
                                    ? t('yearEndReport.generating', 'Generating…')
                                    : t('yearEndReport.downloadBtn', 'Download PDF')}
                            </motion.button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">
                        {[
                            { icon: <Zap size={16} className="text-yellow-500" />, label: t('yearEndReport.statXp', 'Total XP'), value: user.xp.toLocaleString(), color: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800/40' },
                            { icon: <Award size={16} className="text-purple-500" />, label: t('yearEndReport.statLessons', 'Lessons'), value: user.completedLessonIds?.length ?? 0, color: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800/40' },
                            { icon: <Flame size={16} className="text-orange-500" />, label: t('yearEndReport.statStreak', 'Best Streak'), value: `${user.streak ?? 0}d`, color: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800/40' },
                            { icon: <span className="text-base">🪙</span>, label: t('yearEndReport.statCoins', 'BizCoins'), value: (user.bizCoins ?? 0).toLocaleString(), color: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/40' },
                            { icon: <BookOpen size={16} className="text-blue-500" />, label: t('yearEndReport.statBooks', 'Books Read'), value: booksRead, color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/40' },
                            { icon: <TrendingUp size={16} className="text-indigo-500" />, label: t('yearEndReport.statGigs', 'Gigs Mastered'), value: totalGigLevels, color: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800/40' },
                        ].map((s, i) => (
                            <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${s.color}`}>
                                <div className="bg-white dark:bg-gray-800 p-1.5 rounded-lg shadow-sm">{s.icon}</div>
                                <div>
                                    <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">{s.label}</div>
                                    <div className="text-lg font-black text-gray-800 dark:text-white leading-tight">{s.value}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Top Gigs Row */}
                    {topGigs.length > 0 && (
                        <div className="bg-gray-50 dark:bg-gray-800/60 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
                            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
                                🎯 {t('yearEndReport.topGigs', 'Top Mastered Gigs')}
                            </p>
                            <div className="flex gap-2">
                                {topGigs.map((g: any, i: number) => (
                                    <div key={i} className="flex-1 bg-white dark:bg-gray-800 rounded-xl px-3 py-2.5 border border-gray-100 dark:border-gray-700 shadow-sm">
                                        <div className="text-xs text-gray-400">#{i + 1}</div>
                                        <div className="font-bold text-sm text-gray-700 dark:text-gray-200 truncate">{g.title}</div>
                                        <div className="text-xs font-bold text-indigo-500 mt-0.5">Lv {g.level}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Franchise Badge */}
                    {franchise?.isOpen && (
                        <div className="mt-3 flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 rounded-xl px-4 py-2.5">
                            <span className="text-xl">🏙️</span>
                            <div>
                                <span className="font-bold text-amber-800 dark:text-amber-300 text-sm">
                                    {t('yearEndReport.franchiseActive', 'Franchise Active')} —
                                </span>
                                <span className="ml-1 text-amber-700 dark:text-amber-400 text-sm font-semibold">{franchise.tier} Tier</span>
                            </div>
                            <span className="ml-auto text-xs font-bold text-amber-600 dark:text-amber-500">
                                {franchise.totalEarned.toLocaleString()} 🪙 {t('yearEndReport.earned', 'earned')}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Preview Modal ── */}
            <AnimatePresence>
                {showPreview && (
                    <PreviewModal
                        onClose={() => setShowPreview(false)}
                        onDownload={generatePDF}
                        isGenerating={isGenerating}
                    >
                        <PDFTemplate {...templateProps} />
                    </PreviewModal>
                )}
            </AnimatePresence>
        </>
    );
};

export default YearEndReport;
