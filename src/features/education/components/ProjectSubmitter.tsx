import React, { useState } from 'react'; // React 19
import { useGradingStore } from '../store/useGradingStore';
import { Upload, Send, Sparkles, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { getProjectBrief } from '../data/project_prompts';
import { Logger } from '../../../services/logger';

import { Difficulty } from '../../hq/components/DifficultySelectModal';

interface ProjectSubmitterProps {
    lessonId: string;
    rubricId?: string;
    difficulty?: Difficulty;
    onComplete: () => void;
}

const MAX_FILE_SIZE_MB = 5;
const SUPPORTED_FILE_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

const ProjectSubmitter: React.FC<ProjectSubmitterProps> = ({ lessonId, difficulty = 'MEDIUM', onComplete }) => {
    const { t } = useTranslation();
    const { submitProject, submissionStatus, error: storeError, gradeResult, reset } = useGradingStore();

    // UI State
    const [step, setStep] = useState<'BRIEF' | 'SUBMIT' | 'SUCCESS' | 'REJECTED'>('BRIEF');

    // Local form state
    const [projectText, setProjectText] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [validationError, setValidationError] = useState<string | null>(null);
    // ✅ SECURITY FIX: Safe image fallback — eliminates innerHTML XSS risk
    const [ollieImgError, setOllieImgError] = useState(false);

    const brief = getProjectBrief(lessonId);

    // React 19 Action
    const [isPending, setIsPending] = useState(false);

    const validateFile = (file: File): string | null => {
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            return `File ${file.name} exceeds ${MAX_FILE_SIZE_MB}MB limit.`;
        }
        if (!SUPPORTED_FILE_TYPES.includes(file.type)) {
            return `File ${file.name} is not supported. Use JPG, PNG, or PDF.`;
        }
        return null;
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValidationError(null);
        if (e.target.files) {
            const newFiles = Array.from(e.target.files).map(originalFile => {
                // SECURITY: Sanitize filename (remove special chars, prevent path spoofing)
                // We recreate the file with a clean name if we were uploading, but for File objects,
                // we'll just track them. Ideally, we rename them here or on upload.
                // Since File.name is read-only, we just validate rigorously.
                return originalFile;
            });

            for (const file of newFiles) {
                const error = validateFile(file);
                if (error) {
                    setValidationError(error);
                    Logger.warn("[Security] Invalid File Upload Attempt", { filename: file.name, type: file.type, size: file.size });
                    return;
                }
                // SECURITY: Block risky filenames
                if (!/^[a-zA-Z0-9._-]+$/.test(file.name)) {
                    // Just a warning for now, user might have spaces. 
                    // Stricter: /^[a-zA-Z0-9._\-\s()]+$/
                    if (/[<>&;"']/.test(file.name)) {
                        setValidationError("Filename contains unsafe characters.");
                        return;
                    }
                }
            }
            setFiles(newFiles);
        }
    };

    const formAction = async (formData: FormData) => {
        setValidationError(null);
        setIsPending(true);
        try {
            const text = formData.get('projectText') as string;

            // XSS Check / Sanitization (Simple Trim for now, backend should sanitize HTML)
            const sanitizedText = text.trim();
            if (sanitizedText.length < 10) {
                setValidationError(t('project.error_too_short', { defaultValue: "Please write a bit more detail!" }));
                setIsPending(false);
                return;
            }

            // Pass difficulty to grading validation
            await submitProject(lessonId, { text: sanitizedText, files, difficulty });
            // Logic moved to useEffect
        } catch (e: any) {
            Logger.error("[ProjectSubmitter] Submission Failed", { lessonId, error: e.message });
            setValidationError(e.message || "Something went wrong. Please try again.");
        } finally {
            setIsPending(false);
        }
    };

    React.useEffect(() => {
        if (submissionStatus === 'complete' && gradeResult) {
            if (gradeResult.score >= 70) {
                setStep('SUCCESS');
            } else {
                setStep('REJECTED');
            }
        }
    }, [submissionStatus, gradeResult]);

    // VIEW: REJECTED / NEEDS WORK
    if (step === 'REJECTED' && gradeResult) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl max-w-lg mx-auto border-4 border-orange-400 dark:border-orange-500 text-center relative overflow-hidden">
                <div className="relative z-10">
                    <div className="w-24 h-24 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center text-orange-500">
                        <AlertCircle size={48} />
                    </div>

                    <h2 className="text-3xl font-black text-gray-800 dark:text-white mb-2">
                        {t('project.needs_work', { defaultValue: 'Needs a Bit More Work' })}
                    </h2>
                    <p className="text-gray-500 font-medium mb-6 text-lg leading-relaxed">
                        "{gradeResult.feedback}"
                    </p>

                    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl mb-8">
                        <p className="text-sm font-bold text-orange-700 dark:text-orange-300">
                            Tip: Try checking the brief again and adding more details!
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => {
                                reset(); // Allow re-submission
                                setStep('SUBMIT');
                            }}
                            className="flex-1 bg-kid-primary text-white py-4 rounded-2xl font-black text-xl shadow-[0_4px_0_0_rgba(180,83,9,1)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
                        >
                            <ArrowLeft size={24} /> {t('project.try_again', { defaultValue: 'Edit & Improve' })}
                        </button>
                        <button
                            onClick={() => {
                                setStep('BRIEF');
                            }}
                            className="px-6 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            Review Brief
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // VIEW: SUCCESS FEEDBACK
    if (step === 'SUCCESS') {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl max-w-lg mx-auto border-4 border-green-500 dark:border-green-600 text-center relative overflow-hidden">
                {/* Background Confetti/Decor */}
                <div className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(#22c55e 2px, transparent 2px)', backgroundSize: '20px 20px' }}
                />

                <div className="relative z-10">
                    {/* Ollie Image */}
                    <motion.div
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                        className="w-40 h-40 mx-auto mb-6 relative"
                    >
                        <div className="absolute inset-0 bg-yellow-400 rounded-full opacity-20 blur-xl animate-pulse" />
                        {/* ✅ SECURITY FIX: React state fallback replaces innerHTML (XSS vector) */}
                        {ollieImgError ? (
                            <div className="text-[80px] flex items-center justify-center w-full h-full">🦉</div>
                        ) : (
                            <img
                                src="/assets/ollie_wave.png"
                                alt="Ollie"
                                className="w-full h-full object-contain relative z-10 drop-shadow-2xl transform hover:scale-110 transition-transform"
                                loading="lazy"
                                onError={() => setOllieImgError(true)}
                            />
                        )}
                        <div className="absolute -top-4 -right-8 bg-white text-black font-black text-sm px-3 py-1 rounded-xl shadow-lg rotate-12 border-2 border-gray-100">
                            Awesome!
                        </div>
                    </motion.div>

                    <h2 className="text-3xl font-black text-gray-800 dark:text-white mb-4">
                        {t('project.feedback_title', { defaultValue: 'Project Approved!' })}
                    </h2>

                    <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-2xl mb-8 border border-green-100 dark:border-green-800">
                        <p className="text-gray-700 dark:text-gray-200 font-medium text-lg leading-relaxed text-left">
                            {gradeResult?.feedback.split('**').map((part, i) =>
                                i % 2 === 1 ? <span key={i} className="font-bold text-green-700 dark:text-green-400">{part}</span> : part
                            ) || t('project.feedback_msg', { defaultValue: "Ollie loves your ideas. You're ready for the boss battle!" })}
                        </p>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-2xl border border-green-100 dark:border-green-800 mb-8 inline-block">
                        <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-black">
                            <Sparkles size={20} />
                            <span>{t('project.xp_earned_value', { xp: 500, defaultValue: '+500 XP Earned' })}</span>
                        </div>
                    </div>

                    <button
                        onClick={onComplete}
                        className="w-full bg-kid-primary text-white py-4 rounded-2xl font-black text-xl shadow-[0_4px_0_0_rgba(180,83,9,1)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 btn-juicy"
                    >
                        {t('project.continue_boss', { defaultValue: 'Start Boss Battle' })} <ArrowRight size={24} />
                    </button>
                </div>
            </div>
        );
    }

    // VIEW: BRIEFING
    if (step === 'BRIEF') {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl max-w-2xl mx-auto border-4 border-gray-100 dark:border-gray-700">
                <div className="text-center mb-8">
                    <div className="inline-block bg-yellow-100 text-yellow-800 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4">
                        {t('project.briefing', { defaultValue: 'Project Brief' })}
                    </div>
                    <h3 className="text-3xl font-black text-gray-800 dark:text-white mb-2">{brief.title}</h3>
                    <p className="text-gray-500 font-medium text-lg">{brief.objective}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    {brief.kpis.map((kpi) => (
                        <div key={kpi.id} className="bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 text-center">
                            <div className="text-3xl mb-2">{kpi.icon}</div>
                            <div className="font-bold text-gray-800 dark:text-white mb-1">{kpi.label}</div>
                            <div className="text-xs text-gray-500 font-medium leading-tight">{kpi.desc}</div>
                        </div>
                    ))}
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl mb-8 flex gap-4 items-start">
                    <div className="bg-blue-100 text-blue-600 p-2 rounded-xl shrink-0">
                        <AlertCircle size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-blue-800 dark:text-blue-300 uppercase text-xs tracking-widest mb-1">{t('project.expectations', { defaultValue: 'What to Expect' })}</h4>
                        <p className="text-blue-900 dark:text-blue-100 font-medium leading-relaxed">
                            {brief.expectations}
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => setStep('SUBMIT')}
                    className="w-full bg-kid-primary text-white py-4 rounded-2xl font-black text-xl shadow-[0_4px_0_0_rgba(180,83,9,1)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 btn-juicy"
                >
                    {t('project.start_btn', { defaultValue: 'Start Project' })} <ArrowRight size={24} />
                </button>
            </div>
        );
    }

    // VIEW: SUBMISSION FORM
    return (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl max-w-2xl mx-auto border-4 border-dashed border-gray-200 dark:border-gray-700">
            <button
                onClick={() => setStep('BRIEF')}
                className="mb-6 flex items-center gap-2 text-gray-400 hover:text-gray-600 font-bold text-sm transition-colors"
            >
                <ArrowLeft size={16} /> {t('project.back_to_brief', { defaultValue: 'Back to Brief' })}
            </button>

            <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 text-blue-600 p-3 rounded-2xl">
                    <Sparkles size={24} />
                </div>
                <div>
                    <h3 className="text-2xl font-black text-gray-800 dark:text-white">
                        {t('project.submit_title', { defaultValue: 'Submit Your Project' })}
                    </h3>
                    <p className="text-gray-500 font-medium">
                        {t('project.submit_subtitle', { defaultValue: 'Show Ollie what you built!' })}
                    </p>
                </div>
            </div>

            <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                formAction(formData);
            }} className="space-y-6">
                {/* Text Input */}
                <div className="space-y-2">
                    <label htmlFor="projectText" className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest">
                        {t('project.business_plan', { defaultValue: 'Your Response' })}
                    </label>
                    <textarea
                        id="projectText"
                        name="projectText"
                        value={projectText}
                        onChange={(e) => setProjectText(e.target.value)}
                        className="w-full h-40 p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-700 focus:border-kid-accent outline-none font-medium text-lg resize-none transition-all"
                        placeholder={t('project.text_placeholder', { defaultValue: 'Type your answer here...' })}
                        required
                    />
                </div>

                {/* File Upload (Visual only for now) */}
                <div className="space-y-2">
                    <label htmlFor="file-upload" className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest">
                        {t('project.prototype_images', { defaultValue: 'Attachments' })}
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 text-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer relative">
                        <input
                            id="file-upload"
                            type="file"
                            multiple
                            accept=".jpg,.jpeg,.png,.pdf"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={handleFileChange}
                        />
                        <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                        <p className="text-gray-500 font-bold">
                            {files.length > 0
                                ? t('project.files_selected', { count: files.length, defaultValue: `${files.length} files selected` })
                                : t('project.upload_prompt', { defaultValue: 'Click to upload photos (Optional)' })
                            }
                        </p>
                        <p className="text-xs text-gray-400 mt-2">Max 5MB (JPG, PNG, PDF)</p>
                    </div>
                </div>

                {/* Error State */}
                {(validationError || storeError) && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2 font-bold animate-pulse">
                        <AlertCircle size={20} />
                        {validationError || storeError}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isPending || submissionStatus === 'grading'}
                    className="w-full bg-kid-accent text-white py-4 rounded-2xl font-black text-xl shadow-[0_4px_0_0_rgba(30,58,138,1)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending || submissionStatus === 'grading' ? (
                        <>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1 }}
                            >
                                <Sparkles size={24} />
                            </motion.div>
                            {t('project.grading', { defaultValue: 'Ollie is grading...' })}
                        </>
                    ) : (
                        <>
                            {t('project.submit_button', { defaultValue: 'Submit to Ollie' })} <Send size={24} />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default ProjectSubmitter;
