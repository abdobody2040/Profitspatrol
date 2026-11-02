import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../../store';
import { Download, Award, TrendingUp, Eye, X, BookOpen, Coins, Flame, Zap } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import CoinIcon from '../../../components/ui/CoinIcon';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { INITIAL_HUSTLES, getGigLevel } from "../../../store/slices/sideHustleSlice";
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
                className="bg-[#f8fafc] text-gray-900"
                style={{
                    width: '794px',
                    minHeight: '1122px',
                    fontFamily: 'system-ui, sans-serif',
                    direction: isRTL ? 'rtl' : 'ltr',
                    textAlign: isRTL ? 'right' : 'left',
                    position: 'relative',
                    overflow: 'hidden',
                    boxSizing: 'border-box'
                }}
            >
                {/* ── Background Elements ── */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '280px', background: 'linear-gradient(135deg, #FFC800 0%, #FF9900 100%)', borderBottomLeftRadius: '100px', borderBottomRightRadius: '100px', zIndex: 0 }}></div>
                
                <div style={{ position: 'relative', zIndex: 1, padding: '40px 50px' }}>
                    {/* ── Header ── */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, background: '#ffffff', borderRadius: '32px', padding: '24px 32px', border: '4px solid #fbbf24', boxShadow: '0 20px 40px rgba(255, 153, 0, 0.15)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flex: 1 }}>
                            <img src={window.location.origin + "/images/logo_text.png"} alt="Profits Patrol" style={{ height: 60, width: 180, objectFit: 'contain', flexShrink: 0 }} crossOrigin="anonymous" />
                            <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '250px' }}>
                                <div style={{ fontSize: 24, fontWeight: 900, color: '#1f2937', letterSpacing: '-0.5px', wordWrap: 'break-word', lineHeight: 1.2 }}>{user.name}</div>
                                <div style={{ fontSize: 14, color: '#f59e0b', fontWeight: 800, marginTop: 4, textTransform: 'uppercase', letterSpacing: '1px' }}>{rankTitle(user.level, t)}</div>
                            </div>
                        </div>
                        <div style={{ flexShrink: 0 }}>
                            <div style={{ fontSize: 12, fontWeight: 900, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '1px', background: 'linear-gradient(to right, #f59e0b, #ea580c)', padding: '10px 18px', borderRadius: '24px', textAlign: 'center', border: '2px solid #fff', boxShadow: '0 4px 15px rgba(234, 88, 12, 0.3)' }}>
                                {t('yearEndReport.pdfHeaderDesc', 'Official Annual Report Card')}
                            </div>
                        </div>
                    </div>

                    {/* ── Intro ── */}
                    {/* ✅ SECURITY FIX: No dangerouslySetInnerHTML. Safe bold-markdown renderer using React elements only. */}
                    <div style={{ background: '#ffffff', borderRadius: '24px', padding: '16px 24px', marginBottom: 24, border: '2px dashed #fcd34d', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
                        <p style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.6, color: '#4b5563', textAlign: isRTL ? 'right' : 'left', margin: 0 }}>
                            {t('yearEndReport.pdfIntro', { name: user.name })
                                .split(/\*\*(.*?)\*\*/g)
                                .map((part: string, i: number) => i % 2 === 1 ? <strong key={i} style={{ color: '#d97706', fontWeight: 900 }}>{part}</strong> : part)}
                        </p>
                    </div>

                    {/* ── Core Metrics ── */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24, direction: isRTL ? 'rtl' : 'ltr' }}>
                        {[
                            { label: t('yearEndReport.statXp', 'Total XP'), value: user.xp.toLocaleString(), emoji: '⚡', color: '#fffbeb', border: '#fcd34d' },
                            { label: t('yearEndReport.statLessons', 'Lessons Done'), value: user.completedLessonIds?.length ?? 0, emoji: '📚', color: '#faf5ff', border: '#d8b4fe' },
                            { label: t('yearEndReport.statStreak', 'Day Streak'), value: `${user.streak ?? 0}🔥`, emoji: '🔥', color: '#fff7ed', border: '#fdba74' },
                            { label: t('yearEndReport.statCoins', 'P Tokens'), value: (user.ppTokens ?? 0).toLocaleString(), emoji: '💰', color: '#ecfdf5', border: '#6ee7b7' },
                            { label: t('yearEndReport.statBooks', 'Books Read'), value: booksRead, emoji: '📖', color: '#eff6ff', border: '#93c5fd' },
                            { label: 'Level', value: user.level, emoji: '🏅', color: '#fff1f2', border: '#fda4af' },
                        ].map((s, i) => (
                            <div key={i} style={{ background: '#ffffff', borderBottom: `6px solid ${s.border}`, borderRadius: '24px', padding: '16px', display: 'flex', alignItems: 'center', gap: 12, flexDirection: isRTL ? 'row-reverse' : 'row', textAlign: isRTL ? 'right' : 'left', boxShadow: '0 10px 20px rgba(0,0,0,0.04)' }}>
                                <div style={{ fontSize: 28, background: s.color, width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '16px', flexShrink: 0 }}>{s.emoji}</div>
                                <div>
                                    <div style={{ fontSize: 11, fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px' }}>{s.label}</div>
                                    <div style={{ fontSize: 22, fontWeight: 900, marginTop: 2, color: '#1f2937' }}>{s.value}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ── Executive Summary ── */}
                    <div style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)', border: '3px solid #c7d2fe', borderRadius: '24px', padding: '24px', marginBottom: 24, textAlign: isRTL ? 'right' : 'left', boxShadow: '0 10px 25px rgba(67, 56, 202, 0.1)' }}>
                        <div style={{ fontSize: 18, fontWeight: 900, color: '#4338ca', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12, justifyContent: isRTL ? 'flex-end' : 'flex-start' }}>
                            {isRTL ? <>{t('yearEndReport.pdfExecutiveSummary', 'Executive Summary')} 💼</> : <>💼 {t('yearEndReport.pdfExecutiveSummary', 'Executive Summary')}</>}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, direction: isRTL ? 'rtl' : 'ltr' }}>
                            <div style={{ background: '#ffffff', padding: '12px', borderRadius: '16px', fontWeight: 600, color: '#4b5563', fontSize: 14 }}><strong style={{ color: '#3730a3' }}>{t('yearEndReport.pdfLevelReached', 'Level Reached:')}</strong> Level {user.level} — {rankTitle(user.level, t)}</div>
                            <div style={{ background: '#ffffff', padding: '12px', borderRadius: '16px', fontWeight: 600, color: '#4b5563', fontSize: 14 }}><strong style={{ color: '#3730a3' }}>{t('yearEndReport.pdfTopSkill', 'Top Market Skill:')}</strong> <span style={{ textTransform: 'capitalize' }}>{topSkill}</span></div>
                            <div style={{ background: '#ffffff', padding: '12px', borderRadius: '16px', fontWeight: 600, color: '#4b5563', fontSize: 14 }}><strong style={{ color: '#3730a3' }}>{t('yearEndReport.pdfSkillsUnlocked', 'Skills Unlocked:')}</strong> {user.unlockedSkills?.length ?? 0}</div>
                            <div style={{ background: '#ffffff', padding: '12px', borderRadius: '16px', fontWeight: 600, color: '#4b5563', fontSize: 14 }}><strong style={{ color: '#3730a3' }}>{t('yearEndReport.pdfFranchiseTier', 'Franchise Tier:')}</strong> {franchise?.isOpen ? franchise.tier : t('yearEndReport.pdfNotOpened', 'Not Opened')}</div>
                        </div>
                        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '2px dashed #a5b4fc', color: '#4f46e5', fontStyle: 'italic', fontSize: 14, fontWeight: 700, textAlign: isRTL ? 'right' : 'left' }}>
                            "{t('yearEndReport.pdfInstructorNotes', 'Instructor Notes: Demonstrates high potential for leadership and entrepreneurship. Ready for the next venture!')}"
                        </div>
                    </div>

                    {/* ── Gig Mastery ── */}
                    {topGigs.length > 0 && (
                        <div style={{ marginBottom: 20 }}>
                            <div style={{ fontSize: 15, fontWeight: 900, color: '#374151', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: 8, justifyContent: isRTL ? 'flex-end' : 'flex-start' }}>
                                {isRTL ? <>{t('yearEndReport.pdfGigMastery', 'Gig Mastery')} 🎯</> : <>🎯 {t('yearEndReport.pdfGigMastery', 'Gig Mastery')}</>}
                            </div>
                            <div style={{ display: 'flex', gap: 12, flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                                {topGigs.slice(0, 3).map((g, i) => (
                                    <div key={i} style={{ flex: 1, background: '#ffffff', borderBottom: '4px solid #818cf8', borderRadius: '16px', padding: '12px 16px', textAlign: isRTL ? 'right' : 'left', boxShadow: '0 8px 16px rgba(0,0,0,0.05)' }}>
                                        <div style={{ fontSize: 11, fontWeight: 900, color: '#a5b4fc', background: '#eef2ff', padding: '4px 8px', borderRadius: '8px', display: 'inline-block', marginBottom: 6 }}>#{i + 1}</div>
                                        <div style={{ fontWeight: 900, fontSize: 14, color: '#1f2937' }}>{g.title}</div>
                                        <div style={{ color: '#4f46e5', fontWeight: 800, fontSize: 13, marginTop: 2 }}>Level {g.level}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── Footer ── */}
                    <div style={{ marginTop: 'auto', borderTop: '3px solid #e2e8f0', paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 40, height: 40, background: '#f59e0b', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 20, fontWeight: 'bold' }}>O</div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
                                <span style={{ fontWeight: 900, fontSize: 14, color: '#1f2937' }}>Ollie the Owl</span>
                                <span style={{ fontSize: 12, color: '#64748b', fontWeight: 700 }}>Chief Education Officer</span>
                            </div>
                        </div>
                        <div style={{ textAlign: isRTL ? 'left' : 'right', fontSize: 11, color: '#94a3b8', fontWeight: 700 }}>
                            <div style={{ marginBottom: 4 }}>{t('yearEndReport.pdfDocId', 'Document ID:')} {user.id?.substring(0, 12).toUpperCase()}</div>
                            <div>{t('yearEndReport.pdfFooterCopyright', { year: new Date().getFullYear() })}</div>
                        </div>
                    </div>
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
            className="fixed inset-0 z-[200] bg-black/70 flex items-center justify-center p-4 backdrop-blur-md"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-white rounded-[32px] shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-yellow-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-yellow-200 flex items-center justify-center text-2xl">📄</div>
                        <div>
                            <h3 className="text-xl font-black text-gray-800">{t('yearEndReport.previewModalTitle', 'Report Card Preview')}</h3>
                            <p className="text-sm text-gray-500 font-bold mt-0.5">{t('yearEndReport.previewModalDesc', 'This is exactly what your PDF will look like')}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onDownload}
                            disabled={isGenerating}
                            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-5 py-3 rounded-2xl font-black transition-all disabled:opacity-50 shadow-[0_4px_0_rgb(185,28,28)] active:translate-y-1 active:shadow-none"
                        >
                            {isGenerating
                                ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                                : <Download size={20} />}
                            {isGenerating ? t('yearEndReport.generating', { defaultValue: 'Generating…' }) : t('yearEndReport.downloadBtn', { defaultValue: 'Download PDF' })}
                        </button>
                        <button onClick={onClose} className="p-3 bg-white hover:bg-gray-100 rounded-2xl transition-colors shadow-sm border border-gray-200">
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Scrollable Preview */}
                <div className="overflow-y-auto flex-1 p-8 bg-gray-100/50 rounded-b-[32px]">
                    <div className="shadow-2xl rounded-[32px] overflow-hidden mx-auto border-8 border-white" style={{ width: 'fit-content' }}>
                        <div style={{ transform: 'scale(0.75)', transformOrigin: 'top center', display: 'inline-block', marginBottom: '-25%' }}>
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

    // Bubbly stat cards definition
    const statCards = [
        { icon: <Zap size={20} className="text-yellow-500 fill-yellow-500" />, label: t('yearEndReport.statXp', 'Total XP'), value: user.xp.toLocaleString(), color: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' },
        { icon: <Award size={20} className="text-purple-500 fill-purple-500" />, label: t('yearEndReport.statLessons', 'Lessons'), value: user.completedLessonIds?.length ?? 0, color: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800' },
        { icon: <Flame size={20} className="text-orange-500 fill-orange-500" />, label: t('yearEndReport.statStreak', 'Best Streak'), value: `${user.streak ?? 0}${t('stats.days', { defaultValue: 'd' })}`, color: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800' },
        { icon: <CoinIcon size={20} />, label: t('yearEndReport.statCoins', 'P Tokens'), value: (user.ppTokens ?? 0).toLocaleString(), color: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' },
        { icon: <BookOpen size={20} className="text-blue-500 fill-blue-500" />, label: t('yearEndReport.statBooks', 'Books Read'), value: booksRead, color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' },
        { icon: <TrendingUp size={20} className="text-indigo-500" />, label: t('yearEndReport.statGigs', 'Gigs Mastered'), value: totalGigLevels, color: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800' },
    ];

    return (
        <>
            {/* ── Hidden PDF Template ── */}
            <div className="absolute overflow-hidden" style={{ left: -9999, top: -9999, width: 794 }}>
                <PDFTemplate ref={reportRef} {...templateProps} />
            </div>

            {/* ── Visible Card ── */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-[36px] p-2 shadow-2xl shadow-orange-500/30 mt-16"
            >
                {/* Peeking Mascot */}
                <motion.div 
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                    className="absolute -top-16 end-6 z-10 w-28 h-28 transform rotate-6 rtl:-rotate-6 hover:rotate-12 transition-transform cursor-pointer drop-shadow-xl"
                >
                    <img src="/assets/ollie_wave.png" alt="Ollie" className="w-full h-full object-contain" />
                </motion.div>

                <div className="bg-white dark:bg-gray-900 rounded-[30px] p-8 relative overflow-hidden">
                    {/* Playful background pattern */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 opacity-50 rounded-full blur-3xl -mr-20 -mt-20"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20 opacity-50 rounded-full blur-2xl -ml-10 -mb-10"></div>

                    {/* Header row */}
                    <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6 z-10">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg shadow-orange-200 dark:shadow-orange-900/40 transform -rotate-6">
                                    <Award size={24} className="text-white fill-white" />
                                </div>
                                <h3 className="text-3xl font-black text-gray-800 dark:text-white tracking-tight">
                                    {t('yearEndReport.title', 'Annual Report Card')}
                                </h3>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 text-base font-bold ms-15">
                                {t('yearEndReport.subtitle', 'Your fiscal year in review — ready for download!')}
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3 w-full md:w-auto">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowPreview(true)}
                                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 px-5 py-3.5 rounded-2xl font-black text-sm transition-colors border-2 border-gray-200 dark:border-gray-700 shadow-sm"
                            >
                                <Eye size={18} />
                                {t('yearEndReport.previewBtn', 'Preview')}
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={generatePDF}
                                disabled={isGenerating}
                                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3.5 rounded-2xl font-black text-sm transition-all shadow-[0_4px_0_rgb(185,28,28)] active:translate-y-1 active:shadow-none disabled:opacity-50"
                            >
                                {isGenerating
                                    ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                                    : <Download size={18} />}
                                {isGenerating
                                    ? t('yearEndReport.generating', 'Generating…')
                                    : t('yearEndReport.downloadBtn', 'Download PDF')}
                            </motion.button>
                        </div>
                    </div>

                    {/* Stats Grid with animations */}
                    <motion.div 
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: { staggerChildren: 0.1 }
                            }
                        }}
                        className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 relative z-10"
                    >
                        {statCards.map((s, i) => (
                            <motion.div 
                                key={i} 
                                variants={{
                                    hidden: { y: 20, opacity: 0 },
                                    visible: { y: 0, opacity: 1 }
                                }}
                                className={`flex flex-col gap-2 p-4 rounded-3xl border-b-4 ${s.color} hover:-translate-y-1 transition-transform`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="bg-white dark:bg-gray-800 p-2.5 rounded-xl shadow-sm">{s.icon}</div>
                                    <div className="text-[11px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">{s.label}</div>
                                </div>
                                <div className="text-3xl font-black text-gray-800 dark:text-white tracking-tight mt-1">{s.value}</div>
                            </motion.div>
                        ))}
                    </motion.div>

                    <div className="flex flex-col md:flex-row gap-4 relative z-10">
                        {/* Top Gigs Row */}
                        {topGigs.length > 0 && (
                            <div className="flex-1 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30 rounded-3xl p-5 border-2 border-indigo-100 dark:border-indigo-800">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-xl">🎯</span>
                                    <h4 className="font-black text-indigo-900 dark:text-indigo-200 uppercase tracking-widest text-xs">
                                        {t('yearEndReport.topGigs', 'Top Mastered Gigs')}
                                    </h4>
                                </div>
                                <div className="flex gap-3">
                                    {topGigs.map((g: any, i: number) => (
                                        <div key={i} className="flex-1 bg-white dark:bg-gray-800 rounded-2xl p-3 border-b-4 border-indigo-200 dark:border-indigo-700 shadow-sm text-center">
                                            <div className="w-6 h-6 mx-auto bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full flex items-center justify-center text-xs font-black mb-2">#{i + 1}</div>
                                            <div className="font-bold text-sm text-gray-800 dark:text-gray-200 truncate">{t(`gig_central.jobs.${g.id}.title`, g.title)}</div>
                                            <div className="text-xs font-black text-indigo-500 dark:text-indigo-400 mt-1">{t('stats.level', { defaultValue: 'Lv' })} {g.level}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Franchise Badge */}
                        {franchise?.isOpen && (
                            <div className="flex-1 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 border-2 border-amber-200 dark:border-amber-800 rounded-3xl p-5 flex flex-col justify-center relative overflow-hidden">
                                <div className="absolute -right-4 -bottom-4 text-7xl opacity-20">🏙️</div>
                                <div className="flex items-center gap-3 mb-2 relative z-10">
                                    <span className="text-3xl">🏙️</span>
                                    <h4 className="font-black text-amber-900 dark:text-amber-200 text-lg">
                                        {t('yearEndReport.franchiseActive', 'Franchise Active')}
                                    </h4>
                                </div>
                                <div className="relative z-10 flex flex-wrap items-end gap-x-2 gap-y-1 mt-1">
                                    <span className="bg-amber-500 text-white px-3 py-1 rounded-xl text-sm font-black uppercase tracking-wider">{t('yearEndReport.tier', { tier: franchise.tier, defaultValue: `${franchise.tier} Tier` })}</span>
                                    <span className="text-sm font-black text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/50 px-3 py-1 rounded-xl inline-flex items-center gap-1">
                                        {franchise.totalEarned.toLocaleString()} <CoinIcon size={14} /> {t('yearEndReport.earned', 'earned')}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

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
