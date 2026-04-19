import React, { useState } from 'react';
import { Submission, GradeResult } from '../../../types';
import { useTranslation } from 'react-i18next';
import { Check, X, Star, Edit3, Save } from 'lucide-react';
import ProjectResultCard from './ProjectResultCard'; // Reuse display logic? Or custom
import { Logger } from '../../../services/logger';
// Actually ProjectResultCard uses global store. Better to make a dumb component for display.
// But for now, let's just build a custom view here.

// Mock Data
const MOCK_SUBMISSIONS: Submission[] = [
    {
        id: '1',
        studentId: 'user_123',
        assignmentId: 'ass_456',
        status: 'GRADED',
        submittedAt: new Date().toISOString(),
        content: "I want to build a robot that cleans rooms. It will cost $100 and I will sell it for $200.",
        grade: 85,
        letterGrade: 'Founder',
        feedback: "Great margin analysis! Make sure to check competitor prices.",
        bizCoinsAwarded: 850,
        xpGained: 425
    },
    {
        id: '2',
        studentId: 'user_789',
        assignmentId: 'ass_456',
        status: 'PENDING',
        submittedAt: new Date().toISOString(),
        content: "My business is a lemonade stand.",
    }
];

const GradeReview: React.FC = () => {
    const { t } = useTranslation();
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
    const [overrideMode, setOverrideMode] = useState(false);
    const [teacherNote, setTeacherNote] = useState('');
    const [teacherScore, setTeacherScore] = useState(0);

    const handleSelect = (sub: Submission) => {
        setSelectedSubmission(sub);
        setOverrideMode(false);
        setTeacherNote(sub.feedback || '');
        setTeacherScore(sub.grade || 0);
    };

    const handleSaveOverride = () => {
        if (!selectedSubmission) return;

        // ✅ SECURITY FIX (RBAC): Grade override must be restricted to TEACHER and ADMIN roles.
        // Without this check, any authenticated user (including a KID) could call this function
        // via the browser console and write arbitrary grades for any submission.
        // The UI only shows the button to teachers, but UI-level guards are not sufficient.
        // Note: In production, this MUST also be enforced server-side via Supabase RLS.
        const allowedRoles = ['TEACHER', 'ADMIN'];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const userRole = (window as any).__appStore?.getState?.()?.user?.role;
        if (userRole && !allowedRoles.includes(userRole)) {
            Logger.warn('[Security] Unauthorized grade override attempt', { role: userRole });
            return;
        }

        // ✅ SECURITY FIX (Input Validation): Clamp score to 0-100 before persisting.
        const clampedScore = Math.max(0, Math.min(100, teacherScore));
        if (clampedScore !== teacherScore) {
            alert('Score must be between 0 and 100. Value has been clamped.');
            setTeacherScore(clampedScore);
            return;
        }

        // ✅ SECURITY FIX (Input Length): Cap feedback at 2000 chars to prevent
        // oversized text payloads reaching the AI grading pipeline downstream.
        const MAX_FEEDBACK_LENGTH = 2000;
        const safeFeedback = teacherNote.slice(0, MAX_FEEDBACK_LENGTH);

        const updated = {
            ...selectedSubmission,
            grade: clampedScore,
            feedback: safeFeedback,
            status: 'GRADED' as const
        };
        Logger.info('GradeReview: Teacher grade override saved', {
            submissionId: updated.id,
            assignmentId: updated.assignmentId,
            newGrade: updated.grade
            // Note: studentId and feedback deliberately excluded to avoid PII in logs
        });
        // In real app, call API
        setOverrideMode(false);
        setSelectedSubmission(updated);
    };


    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[80vh]">
            {/* List */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg overflow-y-auto">
                <h2 className="text-xl font-black mb-4 flex items-center gap-2">
                    <Star className="text-yellow-400" /> Review Queue
                </h2>
                <div className="space-y-3">
                    {MOCK_SUBMISSIONS.map(sub => (
                        <div
                            key={sub.id}
                            onClick={() => handleSelect(sub)}
                            className={`p-4 rounded-2xl cursor-pointer transition-all border-2
                                ${selectedSubmission?.id === sub.id
                                    ? 'border-kid-accent bg-blue-50 dark:bg-blue-900/30'
                                    : 'border-transparent bg-gray-50 dark:bg-gray-900 hover:border-gray-200'}
                            `}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-bold text-gray-700 dark:text-gray-200">Student #{sub.studentId.slice(-4)}</span>
                                <span className={`px-2 py-0.5 rounded text-xs font-black uppercase
                                    ${sub.status === 'GRADED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}
                                `}>
                                    {sub.status}
                                </span>
                            </div>
                            <div className="text-xs text-gray-400 truncate">{sub.content}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Detail */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg overflow-y-auto">
                {selectedSubmission ? (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-black text-gray-800 dark:text-white">Project Submission</h2>
                            {!overrideMode && selectedSubmission.status === 'GRADED' && (
                                <button
                                    onClick={() => setOverrideMode(true)}
                                    className="flex items-center gap-2 text-blue-600 font-bold hover:bg-blue-50 px-4 py-2 rounded-xl transition-colors"
                                >
                                    <Edit3 size={18} /> Override Grade
                                </button>
                            )}
                        </div>

                        {/* Student Content */}
                        <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Student Work</h3>
                            <p className="text-lg text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-medium">
                                {selectedSubmission.content}
                            </p>
                        </div>

                        {/* Grading Area */}
                        {(selectedSubmission.status === 'GRADED' || overrideMode) && (
                            <div className={`p-6 rounded-2xl border-2 transition-all ${overrideMode ? 'border-blue-400 bg-blue-50/50' : 'border-green-100 bg-green-50/30'}`}>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    {overrideMode ? 'Teacher Evaluation' : 'AI Evaluation'}
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-600 mb-2">Score (0-100)</label>
                                        {overrideMode ? (
                                            <input
                                                type="number"
                                                min={0}
                                                max={100}
                                                value={teacherScore}
                                                onChange={(e) => {
                                                    // ✅ SECURITY FIX: Clamp in real-time so the
                                                    // displayed value never escapes 0-100
                                                    const raw = Number(e.target.value);
                                                    setTeacherScore(Math.max(0, Math.min(100, raw)));
                                                }}
                                                className="text-4xl font-black bg-white p-4 rounded-xl w-full border border-gray-200"
                                            />
                                        ) : (
                                            <div className="text-5xl font-black text-gray-800">{selectedSubmission.grade}</div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-600 mb-2">Letter Grade</label>
                                        <div className="text-3xl font-black text-gray-400 opacity-50">
                                            {teacherScore >= 90 ? 'Tycoon' : teacherScore >= 70 ? 'Founder' : 'Intern'}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-2">Feedback</label>
                                    {overrideMode ? (
                                        <textarea
                                            value={teacherNote}
                                            onChange={(e) => setTeacherNote(e.target.value)}
                                            className="w-full h-32 p-4 rounded-xl border border-gray-200 bg-white font-medium"
                                        />
                                    ) : (
                                        <p className="bg-white p-4 rounded-xl border border-gray-100 italic text-gray-600">
                                            "{selectedSubmission.feedback}"
                                        </p>
                                    )}
                                </div>

                                {overrideMode && (
                                    <div className="mt-6 flex justify-end gap-3">
                                        <button
                                            onClick={() => setOverrideMode(false)}
                                            className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-200"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSaveOverride}
                                            className="px-6 py-3 rounded-xl font-bold bg-kid-accent text-white shadow-lg flex items-center gap-2"
                                        >
                                            <Save size={18} /> Save Evaluation
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                        <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-full mb-4">
                            <Star size={48} />
                        </div>
                        <p className="font-bold">Select a submission to review</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GradeReview;
