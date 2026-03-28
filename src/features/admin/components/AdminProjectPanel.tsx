import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { gradeProjectWithOllie } from '../../../lib/gemini';
import { X, Save, CheckCircle, AlertCircle, ExternalLink, MessageCircle, Ruler, Bot, Sparkles, Loader2 } from 'lucide-react';
import { Submission, User, Rubric } from '../../../types';
import { useGradingStore } from '../../education/store/useGradingStore';
import { useAppStore } from '../../../store'; // Keep this if AppStore is used for other things, otherwise remove.
import { useEducationStore } from '../../../store/educationStore'; // New import
import { Logger } from '../../../services/logger';

interface AdminProjectPanelProps {
    submission: Submission;
    student: User | undefined;
    onClose: () => void;
}

const AdminProjectPanel: React.FC<AdminProjectPanelProps> = ({ submission, student, onClose }) => {
    const { t } = useTranslation();
    const { updateSubmission } = useEducationStore(); // Moved from AppStore
    const [grade, setGrade] = useState<number>(submission.grade || 0);
    const [feedback, setFeedback] = useState<string>(submission.feedback || '');
    const [letterGrade, setLetterGrade] = useState<'Intern' | 'Founder' | 'Tycoon'>(submission.letterGrade || 'Intern');
    const [isGrading, setIsGrading] = useState(false);

    // Calculate Letter Grade automatically based on numeric grade
    const handleGradeChange = (val: number) => {
        setGrade(val);
        if (val >= 90) setLetterGrade('Tycoon');
        else if (val >= 70) setLetterGrade('Founder');
        else setLetterGrade('Intern');
    };

    const handleAutoGrade = async () => {
        setIsGrading(true);
        try {
            // Default Rubric (Same as in useGradingStore for consistency)
            const rubric: Rubric = {
                id: 'default_rubric',
                teacherId: 'system',
                title: 'Project Rubric',
                criteria: [
                    { id: 'c1', title: 'Creativity', description: 'Originality of the idea', maxScore: 40 },
                    { id: 'c2', title: 'Details', description: 'Depth of business plan', maxScore: 30 },
                    { id: 'c3', title: 'Feasibility', description: 'Is it realistic?', maxScore: 30 }
                ]
            };

            // Call AI
            const result = await gradeProjectWithOllie(submission.content || '', rubric);

            // Update State
            setGrade(result.score);
            setFeedback(result.feedback);
            setLetterGrade(result.letterGrade);
        } catch (error) {
            // ✅ SECURITY FIX: Gemini errors for gradeProjectWithOllie() include child's full essay content
            Logger.error('AdminProjectPanel: AI auto-grading failed', error);
            alert("Ollie couldn't grade this right now. Please try again.");
        } finally {
            setIsGrading(false);
        }
    };

    const handleSave = () => {
        const updatedSub: Submission = {
            ...submission,
            grade,
            feedback,
            letterGrade,
            status: 'GRADED',
            // Default rewards based on tier
            bizCoinsAwarded: letterGrade === 'Tycoon' ? 50 : letterGrade === 'Founder' ? 30 : 10,
            xpGained: letterGrade === 'Tycoon' ? 100 : letterGrade === 'Founder' ? 75 : 50
        };

        // Here we assume 'updateSubmission' exists in the main store or we need to implement it.
        // If it doesn't exist, we might need to add it or manually update the array.
        // Based on AdminDashboard analysis, updateSubmission was mentioned in destructuring but might need verification.
        updateSubmission(submission.id, updatedSub);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-900 w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-200 dark:border-gray-700">

                {/* LEFT: Project Content */}
                <div className="flex-1 p-8 overflow-y-auto border-r border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center font-black text-xl">
                            {student?.name.charAt(0) || '?'}
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-gray-800 dark:text-white">{student?.name}</h2>
                            <p className="text-gray-400 font-bold text-sm">{t('admin.dashboard.grading_panel.submission_id')}: {submission.id.slice(-6)}</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">{t('admin.dashboard.grading_panel.project_content')}</label>
                            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl text-lg text-gray-700 dark:text-gray-200 font-medium whitespace-pre-wrap leading-relaxed shadow-inner">
                                {submission.content || t('admin.dashboard.grading_panel.no_content')}
                            </div>
                        </div>

                        {/* Files Section (Mock) */}
                        {/* In a real app, submission would have 'fileUrls' array. Assuming 'content' might contain links or we need to add files support to Submission type if not present.
                            For now, we just show a placeholder if no files are explicitly in type yet. 
                        */}
                    </div>
                </div>

                {/* RIGHT: Grading Panel */}
                <div className="w-full md:w-[400px] bg-gray-50 dark:bg-gray-800 p-8 flex flex-col h-full overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-black text-gray-800 dark:text-white flex items-center gap-2">
                            <Ruler className="text-purple-500" /> {t('admin.dashboard.grading_panel.grading_title')}
                        </h3>
                        <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>

                    {/* Auto Grade Button */}
                    <div className="mb-8">
                        <button
                            onClick={handleAutoGrade}
                            disabled={isGrading}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-xl font-bold dark:shadow-none shadow-lg shadow-purple-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            {isGrading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" /> {t('admin.dashboard.grading_panel.asking_ollie')}
                                </>
                            ) : (
                                <>
                                    <Bot size={20} /> {t('admin.dashboard.grading_panel.auto_grade_button')}
                                </>
                            )}
                        </button>
                    </div>

                    <div className="space-y-6 flex-1">
                        {/* Numeric Score */}
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">{t('admin.dashboard.grading_panel.score_label')}</label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="number"
                                    value={grade}
                                    onChange={(e) => handleGradeChange(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                                    className="w-24 p-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 font-black text-2xl text-center outline-none"
                                />
                                <div className={`flex-1 p-3 rounded-xl border-2 text-center font-bold uppercase tracking-wider
                                    ${letterGrade === 'Tycoon' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                                        letterGrade === 'Founder' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                            'bg-gray-100 text-gray-500 border-gray-200'}`}
                                >
                                    {t(`admin.dashboard.grading_panel.tiers.${letterGrade.toLowerCase()}` as any)}
                                </div>
                            </div>
                        </div>

                        {/* Feedback */}
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">{t('admin.dashboard.grading_panel.feedback_label')}</label>
                            <textarea
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                className="w-full h-40 p-4 rounded-xl border-2 border-gray-200 focus:border-purple-500 outline-none resize-none bg-white dark:bg-gray-900 shadow-sm"
                                placeholder={t('admin.dashboard.grading_panel.feedback_placeholder')}
                            />
                        </div>

                        {/* Rewards Preview */}
                        <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('admin.dashboard.grading_panel.rewards_label')}</div>
                            <div className="flex justify-between items-center text-sm font-bold">
                                <div className="flex items-center gap-2 text-yellow-600">
                                    <span>🪙</span>
                                    <span>{letterGrade === 'Tycoon' ? 50 : letterGrade === 'Founder' ? 30 : 10} {t('admin.dashboard.grading_panel.coins')}</span>
                                </div>
                                <div className="flex items-center gap-2 text-blue-600">
                                    <span>⭐</span>
                                    <span>{letterGrade === 'Tycoon' ? 100 : letterGrade === 'Founder' ? 75 : 50} {t('admin.dashboard.grading_panel.xp')}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
                        <button
                            onClick={handleSave}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-bold text-lg shadow-lg shadow-purple-200 dark:shadow-none transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            <CheckCircle size={20} /> {t('admin.dashboard.grading_panel.publish_button')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProjectPanel;
