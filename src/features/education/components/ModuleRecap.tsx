
import React, { useRef, useState } from 'react';
import { useAppStore } from '../../../store';
import { UniversalLessonUnit } from '../../../types';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useConfetti } from '../../../hooks/useConfetti';
import { useAppSound } from '../../../contexts/SoundContext';
import { CertificateDocument } from './CertificateDocument';
import { AchievementCard } from './AchievementCard';
import { Logger } from '../../../services/logger';

interface ModuleRecapProps {
    moduleTitle: string;
    lessons: UniversalLessonUnit[];
    totalXp: number;
    onClose: () => void;
    linkedGameId?: string;
    onPlayGame?: (id: string) => void;
    onNextModule?: () => void;
}

const ModuleRecap: React.FC<ModuleRecapProps> = ({ moduleTitle, lessons, totalXp, onClose, linkedGameId, onPlayGame, onNextModule }) => {
    const { user } = useAppStore();
    const { t, i18n } = useTranslation();
    const certificateRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const { fireworks } = useConfetti();
    const { playSuccess } = useAppSound();

    React.useEffect(() => {
        fireworks();
        playSuccess();
    }, []);

    const isIntern = user?.subscriptionTier === 'intern';
    const isRtl = i18n.language === 'ar';

    const handleDownloadCertificate = async () => {
        if (isIntern) {
            alert(t('engine.upgrade_prompt', { defaultValue: 'Upgrade to Founder to download your Diploma!' }));
            return;
        }

        if (!certificateRef.current) return;
        setIsGenerating(true);

        try {
            // Wait a moment for fonts/images
            await new Promise(resolve => setTimeout(resolve, 500));

            const canvas = await html2canvas(certificateRef.current, {
                scale: 1.5, // Optimized size
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/jpeg', 0.9); // JPEG is smaller than PNG

            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

            // Save directly using jsPDF
            const safeTitle = (moduleTitle || 'Unknown').replace(/[^a-z0-9 ]/gi, '').trim();
            const filename = `Profits Patrol Certificate ${safeTitle}.pdf`;

            pdf.save(filename);

        } catch (error) {
            // ✅ SECURITY FIX: html2canvas errors can expose child's name/avatar from DOM
            Logger.error('ModuleRecap: Certificate PDF generation failed', error);
            alert('Oops! Could not generate certificate.');
        } finally {
            setIsGenerating(false);
        }
    };

    const currentDate = new Date().toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <div className="relative w-full max-w-md mx-auto flex flex-col gap-6" dir={isRtl ? 'rtl' : 'ltr'}>
            <AchievementCard
                moduleTitle={moduleTitle}
                user={user}
                lessons={lessons}
                totalXp={totalXp}
                isGenerating={isGenerating}
                isIntern={isIntern}
                onDownload={handleDownloadCertificate}
            />

            <div className="flex flex-col gap-3 w-full">
                {linkedGameId && onPlayGame && (
                    <button
                        onClick={() => onPlayGame(linkedGameId)}
                        className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 rounded-2xl font-black shadow-lg shadow-orange-500/30 btn-juicy flex items-center justify-center gap-2 text-lg hover:brightness-110 active:scale-95 transition-all"
                    >
                        <Trophy size={24} fill="currentColor" /> {t('engine.play_simulation', { defaultValue: 'Play Simulation' })}
                    </button>
                )}

                <button
                    onClick={() => {
                        if (onNextModule) onNextModule();
                        else onClose();
                    }}
                    className="w-full bg-white text-gray-700 py-3 rounded-2xl font-bold hover:bg-gray-50 transition-colors shadow-sm"
                >
                    {t('certificate_modal.continue')}
                </button>
            </div>

            {/* HIDDEN CERTIFICATE TEMPLATE - Fixed Opacity Issue */}
            <div style={{ position: 'fixed', top: 0, left: '-9999px', zIndex: -1 }}>
                <CertificateDocument
                    ref={certificateRef}
                    moduleTitle={moduleTitle}
                    user={user}
                    date={currentDate}
                />
            </div>
        </div>
    );
};

export default ModuleRecap;
