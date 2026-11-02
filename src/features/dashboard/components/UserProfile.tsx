import React, { useState, useRef } from 'react';
import { useAppStore } from '../../../store';
import { useEducationStore } from '../../../store/educationStore';
import { useGameStore } from '../../../store/gameStore';
import { UserRole } from '../../../types';
import { LogOut, Briefcase, Rocket, Smile, Star, Pizza, Lightbulb, Coffee, Music, Camera, Globe, Anchor, Cpu, Car, Zap, Flame, Award, Download, Eye, X, Loader2, CheckCircle2 } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import confetti from 'canvas-confetti';
import { CertificateDocument } from '../../education/components/CertificateDocument';
import { Logger } from '../../../services/logger';
import BountyList from './BountyList';
import JoinClassModal from '../../education/components/JoinClassModal';
import { FamilyManager } from '../../family/components/FamilyManager';
import YearEndReport from '../../profile/components/YearEndReport';
import AvatarCustomizer from '../../game/components/AvatarCustomizer';

const ICON_MAP: Record<string, any> = {
    rocket: Rocket,
    pizza: Pizza,
    star: Star,
    smile: Smile,
    bulb: Lightbulb,
    coffee: Coffee,
    music: Music,
    camera: Camera,
    globe: Globe,
    anchor: Anchor,
    cpu: Cpu,
    car: Car,
    zap: Zap
};

const UserProfile: React.FC = () => {
    const { user, toggleEquipItem, logout } = useAppStore();
    const classrooms = useEducationStore(state => state.classrooms);
    const { setActiveGameId } = useGameStore();
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language.startsWith('ar');
    const navigate = useNavigate();
    const [showJoinClass, setShowJoinClass] = useState(false);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    const [showCertPreview, setShowCertPreview] = useState(false);
    const certificatePrintRef = useRef<HTMLDivElement>(null);

    if (!user) return null;

    const LogoIcon = user.businessLogo ? ICON_MAP[user.businessLogo.icon] || Rocket : Rocket;

    return (
        <div className="text-center py-6 sm:py-10 space-y-6">
            {/* Streak Indicator */}
            <div className="max-w-2xl mx-auto flex items-center justify-center">
                <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full border-2 border-amber-200 dark:border-amber-800/60 shadow-sm text-amber-600 dark:text-amber-400 font-extrabold text-sm">
                    <Flame className="w-5 h-5 fill-amber-500 text-amber-500 animate-pulse" />
                    <span>{user.streak || 0} {t('profile.days_streak', 'أيام')}</span>
                </div>
            </div>

            <div className="max-w-5xl mx-auto mb-8">
                <AvatarCustomizer />
            </div>

            <div className="max-w-2xl mx-auto bg-gray-50 dark:bg-gray-800 p-6 rounded-3xl border-2 border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="relative w-40 h-40 mx-auto mb-6">
                    {user?.businessLogo ? (
                        <div
                            className={`w-full h-full flex items-center justify-center shadow-lg border-4 border-white dark:border-gray-700 overflow-hidden relative z-0
                                ${user.businessLogo.shape === 'circle' ? 'rounded-full' : user.businessLogo.shape === 'rounded' ? 'rounded-3xl' : 'rounded-none'}
                            `}
                            style={{ backgroundColor: user.businessLogo.backgroundColor }}
                        >
                            <LogoIcon
                                size={80}
                                color={user.businessLogo.iconColor || '#FFF'}
                                strokeWidth={2.5}
                            />
                        </div>
                    ) : (
                        <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-6xl shadow-lg border-4 border-white dark:border-gray-600">
                            🏆
                        </div>
                    )}
                </div>

                <h2 className="text-2xl font-black text-gray-800 dark:text-white">{t('profile.title')}</h2>
                {user?.businessLogo && (
                    <h3 className="text-xl font-bold text-gray-600 dark:text-gray-300 mt-2">{user.businessLogo.companyName}</h3>
                )}

                <button onClick={() => { setActiveGameId('brand'); navigate('/games'); }} className="mt-4 text-sm font-bold text-blue-500 hover:underline">{t('profile.edit_logo')}</button>
            </div>

            {!user?.classId && user.role === UserRole.KID && (
                <button onClick={() => setShowJoinClass(true)} className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-6 py-3 rounded-xl font-bold hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">{t('profile.join_class')}</button>
            )}

            {user?.classId && (
                <div className="inline-block bg-blue-50 dark:bg-blue-900/30 px-6 py-2 rounded-xl text-blue-600 dark:text-blue-300 font-bold border border-blue-100 dark:border-blue-800">
                    {t('profile.student_of', { class: classrooms.find(c => c.id === user.classId)?.name || 'Unknown Class' })}
                </div>
            )}

            {/* FAMILY BOUNTIES (New) */}
            {user.role === UserRole.KID && (
                <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-3xl border-2 border-gray-100 dark:border-gray-700 shadow-sm text-start">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <Briefcase className="text-green-500" /> {t('profile.my_jobs')}
                    </h3>
                    <BountyList role={user.role} />
                </div>
            )}

            {/* YEAR-END REPORT CARD */}
            {user.role === UserRole.KID && (
                <div className="max-w-2xl mx-auto">
                    <YearEndReport />
                </div>
            )}

            {/* DIPLOMAS & CERTIFICATES CARD */}
            <div className="max-w-2xl mx-auto bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-800 p-6 sm:p-7 rounded-3xl border-2 border-amber-200 dark:border-amber-800/60 shadow-md text-start">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <span className="icon-bubble theme-orange" style={{ width: 44, height: 44 }}>
                            <img src="/icons/3d/trophy.png" alt="Diploma" />
                        </span>
                        <div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white">
                                {t('certificate_modal.completion', i18n.language.startsWith('ar') ? 'شهادات التخرج والدبلوم' : 'Diplomas & Certificates')}
                            </h3>
                            <p className="text-xs font-bold text-amber-700 dark:text-amber-400">
                                {i18n.language.startsWith('ar') ? 'شهادة إتمام المسار معتمدة وقابلة للتحميل والطباعة' : 'Official accredited certificate ready for download & print'}
                            </p>
                        </div>
                    </div>
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300 rounded-full text-xs font-black">
                        <CheckCircle2 size={14} />
                        <span>{i18n.language.startsWith('ar') ? 'معتمدة' : 'Verified'}</span>
                    </span>
                </div>

                <div className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-sm p-4 rounded-2xl border border-amber-100 dark:border-gray-700 mb-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <div className="text-xs font-bold text-gray-400 uppercase">
                            {i18n.language.startsWith('ar') ? 'اسم الخريج' : 'Recipient'}
                        </div>
                        <div className="text-lg font-black text-gray-800 dark:text-white">
                            {user.name || 'Future CEO'}
                        </div>
                        <div className="text-xs font-semibold text-gray-500">
                            {new Date().toLocaleDateString(i18n.language.startsWith('ar') ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })} • {user.subscriptionTier?.toUpperCase() || 'FOUNDER'} • {user.xp || 0} XP
                        </div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                            type="button"
                            onClick={() => setShowCertPreview(true)}
                            className="btn btn--ghost text-xs py-2.5 px-3 flex items-center justify-center gap-1.5 flex-1 sm:flex-initial"
                        >
                            <Eye size={16} />
                            <span>{i18n.language.startsWith('ar') ? 'معاينة' : 'Preview'}</span>
                        </button>
                        <button
                            type="button"
                            onClick={async () => {
                                if (!certificatePrintRef.current) return;
                                setIsGeneratingPdf(true);
                                try {
                                    await new Promise(resolve => setTimeout(resolve, 350));
                                    const canvas = await html2canvas(certificatePrintRef.current, {
                                        scale: 1.5,
                                        useCORS: true,
                                        logging: false,
                                        backgroundColor: '#ffffff'
                                    });
                                    const imgData = canvas.toDataURL('image/jpeg', 0.9);
                                    const pdf = new jsPDF({
                                        orientation: 'portrait',
                                        unit: 'mm',
                                        format: 'a4'
                                    });
                                    const pdfWidth = pdf.internal.pageSize.getWidth();
                                    const pdfHeight = pdf.internal.pageSize.getHeight();
                                    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
                                    const safeName = (user.name || 'Future_CEO').replace(/[^a-zA-Z0-9_-]/g, '_');
                                    pdf.save(`Profits_Patrol_CEO_Diploma_${safeName}.pdf`);
                                    confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
                                } catch (err) {
                                    Logger.error('UserProfile: Certificate PDF export failed', err);
                                    alert(i18n.language.startsWith('ar') ? 'عذراً، تعذر إنشاء ملف الشهادة' : 'Failed to export certificate PDF');
                                } finally {
                                    setIsGeneratingPdf(false);
                                }
                            }}
                            disabled={isGeneratingPdf}
                            className="btn btn--success text-xs py-2.5 px-4 flex items-center justify-center gap-1.5 flex-1 sm:flex-initial shadow-md"
                        >
                            {isGeneratingPdf ? (
                                <><Loader2 size={16} className="animate-spin" /> {i18n.language.startsWith('ar') ? 'جاري التحميل...' : 'Exporting...'}</>
                            ) : (
                                <><Download size={16} /> {i18n.language.startsWith('ar') ? 'تحميل الشهادة PDF' : 'Download PDF'}</>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Certificate Preview Modal */}
            {showCertPreview && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm"
                    role="dialog"
                    aria-modal="true"
                >
                    <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 sm:p-6 max-w-3xl w-full max-h-[92vh] overflow-y-auto flex flex-col items-center shadow-2xl border border-gray-200 dark:border-gray-800">
                        <div className="w-full flex items-center justify-between mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
                            <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white">
                                {i18n.language.startsWith('ar') ? 'شهادة التخرج من أكاديمية Profits Patrol' : 'Profits Patrol CEO Academy Diploma'}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setShowCertPreview(false)}
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 cursor-pointer"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="w-full flex justify-center overflow-x-auto py-2">
                            <div className="transform scale-[0.55] sm:scale-[0.72] origin-top transition-transform">
                                <CertificateDocument
                                    moduleTitle={i18n.language.startsWith('ar') ? 'أكاديمية رواد الأعمال والمستثمرين' : 'CEO Academy & Entrepreneurship'}
                                    user={user}
                                    date={new Date().toLocaleDateString(i18n.language.startsWith('ar') ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                />
                            </div>
                        </div>
                        <div className="w-full mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowCertPreview(false)}
                                className="btn btn--ghost text-xs py-2 px-4"
                            >
                                {i18n.language.startsWith('ar') ? 'إغلاق' : 'Close'}
                            </button>
                            <button
                                type="button"
                                onClick={async () => {
                                    if (!certificatePrintRef.current) return;
                                    setIsGeneratingPdf(true);
                                    try {
                                        await new Promise(resolve => setTimeout(resolve, 350));
                                        const canvas = await html2canvas(certificatePrintRef.current, {
                                            scale: 1.5,
                                            useCORS: true,
                                            logging: false,
                                            backgroundColor: '#ffffff'
                                        });
                                        const imgData = canvas.toDataURL('image/jpeg', 0.9);
                                        const pdf = new jsPDF({
                                            orientation: 'portrait',
                                            unit: 'mm',
                                            format: 'a4'
                                        });
                                        const pdfWidth = pdf.internal.pageSize.getWidth();
                                        const pdfHeight = pdf.internal.pageSize.getHeight();
                                        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
                                        const safeName = (user.name || 'Future_CEO').replace(/[^a-zA-Z0-9_-]/g, '_');
                                        pdf.save(`Profits_Patrol_CEO_Diploma_${safeName}.pdf`);
                                        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
                                    } catch (err) {
                                        Logger.error('UserProfile: Certificate PDF export failed', err);
                                    } finally {
                                        setIsGeneratingPdf(false);
                                    }
                                }}
                                disabled={isGeneratingPdf}
                                className="btn btn--success text-xs py-2 px-5 flex items-center gap-1.5"
                            >
                                {isGeneratingPdf ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                                <span>{i18n.language.startsWith('ar') ? 'تحميل كملف PDF' : 'Download PDF'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Hidden Offscreen Container for accurate html2canvas print rendering */}
            <div style={{ position: 'fixed', left: '-9999px', top: 0, zIndex: -100, pointerEvents: 'none' }}>
                <CertificateDocument
                    ref={certificatePrintRef}
                    moduleTitle={i18n.language.startsWith('ar') ? 'أكاديمية رواد الأعمال والمستثمرين' : 'CEO Academy & Entrepreneurship'}
                    user={user}
                    date={new Date().toLocaleDateString(i18n.language.startsWith('ar') ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                />
            </div>

            <div className="max-w-2xl mx-auto mb-8">
                <FamilyManager />
            </div>

            {/* Big Logout Button */}
            <div className="max-w-2xl mx-auto pt-4 pb-12">
                <button
                    onClick={() => {
                        if (window.confirm(i18n.language.startsWith('ar') ? 'هل تريد تسجيل الخروج؟' : 'Are you sure you want to sign out?')) {
                            logout();
                            navigate('/login');
                        }
                    }}
                    className="w-full py-4 px-6 rounded-2xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 border-2 border-red-200 dark:border-red-900 font-black text-base transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                    <LogOut className="w-5 h-5" />
                    <span>{t('nav.signout', isArabic ? 'تسجيل الخروج' : 'Sign Out')}</span>
                </button>
            </div>

            {showJoinClass && <JoinClassModal onClose={() => setShowJoinClass(false)} />}
        </div>
    );
};

export default UserProfile;
