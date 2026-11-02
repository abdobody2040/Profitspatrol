import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, School, Sparkles, RefreshCw, Clock, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Classroom } from '../../../types';
import { SoundService } from '../../../lib/sound';

interface CreateClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (classroom: Classroom) => void;
  teacherId: string;
}

// Generate a clean, easily readable 6-character code
const generateCleanClassCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const CreateClassModal: React.FC<CreateClassModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  teacherId,
}) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language.startsWith('ar');

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [schoolHoursOnly, setSchoolHoursOnly] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize or refresh code when modal opens
  const refreshCode = useCallback(() => {
    SoundService.playClick();
    setCode(generateCleanClassCode());
  }, []);

  useEffect(() => {
    if (isOpen) {
      setName('');
      setError(null);
      setIsSubmitting(false);
      setCode(generateCleanClassCode());
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(isArabic ? 'يرجى إدخال اسم الفصل' : 'Please enter a classroom name');
      return;
    }

    if (!code.trim() || code.trim().length < 4) {
      setError(isArabic ? 'رمز الفصل يجب أن يتكون من 4 إلى 6 خانات' : 'Class code must be 4 to 6 characters');
      return;
    }

    setIsSubmitting(true);
    SoundService.playSuccess();

    const newClassroom: Classroom = {
      id: `cls_${Date.now()}`,
      name: name.trim(),
      code: code.trim().toUpperCase(),
      teacherId,
      studentIds: [],
      lockedModules: [],
      schoolHoursOnly,
    };

    onCreate(newClassroom);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border-4 border-white/60 dark:border-slate-800 p-8 sm:p-10 overflow-hidden z-10"
        >
          {/* Decorative Corner Glow */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-bl-full pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 end-6 p-2 rounded-2xl bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-500 dark:text-gray-300 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-3xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 shadow-inner">
              <School size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-800 dark:text-white leading-tight">
                {t('teacher.create_class_modal_title', 'إنشاء فصل دراسي جديد')}
              </h3>
              <p className="text-xs sm:text-sm font-bold text-gray-400 dark:text-gray-500 mt-1">
                {t('teacher.create_class_modal_desc', 'أدخل تفاصيل الفصل لتمكين الطلاب من الانضمام وبدء التحديات والمهام.')}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Classroom Name */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-2">
                {t('teacher.class_name_label', 'اسم الفصل')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError(null);
                }}
                placeholder={t('teacher.class_name_placeholder', 'مثال: رواد أعمال الصف السادس - أ')}
                className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 dark:bg-slate-800/80 border-2 border-gray-200 dark:border-slate-700 text-gray-800 dark:text-white font-bold text-base outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-all placeholder:text-gray-400 placeholder:font-normal"
                autoFocus
              />
            </div>

            {/* Class Code */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-black uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  {t('teacher.class_code_label', 'رمز الفصل (6 خانات)')}
                </label>
                <button
                  type="button"
                  onClick={refreshCode}
                  className="flex items-center gap-1.5 text-xs font-black text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                  <RefreshCw size={13} />
                  <span>{t('teacher.generate_new_code', 'توليد رمز جديد')}</span>
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  maxLength={8}
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full text-center text-2xl sm:text-3xl font-black tracking-[0.25em] px-4 py-3.5 rounded-2xl bg-blue-50/60 dark:bg-slate-800/90 border-2 border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 outline-none focus:border-blue-500 transition-all uppercase"
                />
              </div>
              <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 mt-1.5">
                {isArabic ? 'يقوم الطلاب بإدخال هذا الرمز للانضمام إلى الفصل ومزامنة المهام.' : 'Students enter this code to join your classroom and receive assignments.'}
              </p>
            </div>

            {/* School Hours Option */}
            <div
              onClick={() => setSchoolHoursOnly(!schoolHoursOnly)}
              className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700/80 flex items-center justify-between cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors select-none"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                  <Clock size={20} />
                </div>
                <div>
                  <div className="text-sm font-black text-gray-800 dark:text-white">
                    {t('teacher.school_hours', 'ساعات المدرسة فقط')}
                  </div>
                  <div className="text-xs font-medium text-gray-400 dark:text-gray-500">
                    {t('teacher.school_hours_desc', 'حظر الألعاب الترفيهية خلال وقت الدوام المدرسي')}
                  </div>
                </div>
              </div>
              <div
                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                  schoolHoursOnly
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-gray-300 dark:border-slate-600'
                }`}
              >
                {schoolHoursOnly && <Check size={14} strokeWidth={3} />}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 font-bold text-xs text-center"
              >
                {error}
              </motion.div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3.5 px-4 rounded-2xl bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 font-black text-sm transition-colors"
              >
                {t('teacher.cancel', 'إلغاء')}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-[2] py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-[0_4px_0_0_rgba(37,99,235,1)] hover:shadow-[0_2px_0_0_rgba(37,99,235,1)] active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles size={18} />
                <span>{t('teacher.create_class_btn', 'إنشاء الفصل الدراسي')}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CreateClassModal;
