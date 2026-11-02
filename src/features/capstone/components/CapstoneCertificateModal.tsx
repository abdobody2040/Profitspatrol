import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, CheckCircle, Sparkles, Printer, Share2 } from 'lucide-react';
import { CapstoneCertificate } from '../types/capstone';
import { useAgeMode } from '../../ageMode/hooks/useAgeMode';
import { SoundService } from '../../../lib/sound';

interface CapstoneCertificateModalProps {
  certificate: CapstoneCertificate | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CapstoneCertificateModal: React.FC<CapstoneCertificateModalProps> = ({
  certificate,
  isOpen,
  onClose
}) => {
  const { isArabic } = useAgeMode();

  if (!isOpen || !certificate) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 20 }}
          className="relative w-full max-w-2xl bg-gradient-to-b from-amber-50 via-white to-amber-50/60 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 rounded-3xl p-6 sm:p-8 border-4 border-amber-400 dark:border-amber-500/80 shadow-2xl overflow-hidden"
          dir={isArabic ? 'rtl' : 'ltr'}
        >
          {/* Close button */}
          <button
            onClick={() => {
              SoundService.playClick();
              onClose();
            }}
            className="absolute top-4 end-4 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white bg-white/70 dark:bg-slate-800/80 shadow-sm"
          >
            <X size={20} />
          </button>

          {/* Decorative Corner Seals */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 shadow-lg shadow-amber-400/30">
              <Award size={36} />
            </div>

            <div>
              <span className="text-xs uppercase font-black tracking-widest text-amber-600 dark:text-amber-400">
                ProfitsPatrol Academy of Entrepreneurship
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                {isArabic ? 'شهادة التخرج الريادي الكبرى' : 'Official Capstone Graduation Certificate'}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isArabic ? 'مُنحت تكريماً لإتمام تأسيس وإطلاق المشروع بنجاح' : 'Awarded for exceptional venture creation, ethics, and strategic pitch'}
              </p>
            </div>

            {/* Certificate Core Card */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-dashed border-amber-300 dark:border-amber-500/40 space-y-4 shadow-inner">
              <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                {isArabic ? 'هذا يشهد بأن رائد الأعمال الصغير:' : 'This certifies that Young Entrepreneur:'}
              </div>

              <div className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">
                {certificate.studentName}
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
                {isArabic
                  ? `قد اجتاز بتفوق جميع مراحل بناء مشروعه المستقل "${certificate.companyName}"، محققاً هوامش ربحية مستقرة، سلاسل إمداد أخلاقية، وتقييماً استثمارياً مستحقاً.`
                  : `has successfully founded "${certificate.companyName}", demonstrating sound unit economics, ethical operations, and a compelling venture pitch.`}
              </p>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40">
                  <div className="text-[10px] text-amber-700 dark:text-amber-300 font-bold uppercase">
                    {isArabic ? 'تقييم الشركة' : 'Company Valuation'}
                  </div>
                  <div className="text-base sm:text-lg font-black text-amber-600 dark:text-amber-400">
                    ${certificate.valuation.toLocaleString()}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40">
                  <div className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold uppercase">
                    {isArabic ? 'التمويل المستحق' : 'Funding Raised'}
                  </div>
                  <div className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400">
                    +{certificate.fundingRaised.toLocaleString()} PP
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/40">
                  <div className="text-[10px] text-purple-700 dark:text-purple-300 font-bold uppercase">
                    {isArabic ? 'المرتبة الريادية' : 'Founding Grade'}
                  </div>
                  <div className="text-base sm:text-lg font-black text-purple-600 dark:text-purple-400">
                    ⭐ {certificate.grade}
                  </div>
                </div>
              </div>

              {/* Signatures */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-around text-center">
                <div>
                  <div className="text-base">🦉 ✍️</div>
                  <div className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Ollie the Owl</div>
                  <div className="text-[9px] text-slate-400">Chief of Strategy</div>
                </div>
                <div>
                  <div className="text-base">🦊 ✍️</div>
                  <div className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Reema the Fox</div>
                  <div className="text-[9px] text-slate-400">Chief Marketing</div>
                </div>
                <div>
                  <div className="text-base">🐘 ✍️</div>
                  <div className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Filo the Elephant</div>
                  <div className="text-[9px] text-slate-400">Ethics & Protection</div>
                </div>
                <div>
                  <div className="text-base">🦎 ✍️</div>
                  <div className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Kami the Chameleon</div>
                  <div className="text-[9px] text-slate-400">Chief Innovation</div>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={() => {
                  SoundService.playClick();
                  window.print();
                }}
                className="py-3 px-5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black flex items-center gap-2 shadow-md transition-all active:scale-95"
              >
                <Printer size={15} />
                <span>{isArabic ? 'طباعة وحفظ الشهادة' : 'Print / Save PDF'}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
