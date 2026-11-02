const fs = require('fs');
const path = require('path');

const studentDashboardPath = path.resolve('src/features/education/components/StudentAssignmentDashboard.tsx');

const newContent = `import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../store';
import { Assignment, Submission } from '../../../types';
import { ClipboardList, Clock, FileText, ChevronRight, UserCog, Star, Rocket, School, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useEducationStore } from "../../../store/educationStore";
import { DailyMissions } from './DailyMissions';
import JoinClassModal from './JoinClassModal';

const StudentAssignmentDashboard: React.FC = () => {
    const { user } = useAppStore();
    const { assignments, submissions, addSubmission, classrooms } = useEducationStore();
    const [missionCategory, setMissionCategory] = useState<'DAILY' | 'CLASSROOM'>('DAILY');
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [activeTab, setActiveTab] = useState<'TODO' | 'SUBMITTED' | 'GRADED'>('TODO');
    const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
    const [submissionContent, setSubmissionContent] = useState('');
    const [previewClassId, setPreviewClassId] = useState<string>('');
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language.startsWith('ar');
    const navigate = useNavigate();

    // Effect to set initial preview class if admin/teacher
    React.useEffect(() => {
        if (user && (user.role === 'ADMIN' || user.role === 'TEACHER') && !user.classId && classrooms.length > 0 && !previewClassId) {
            setPreviewClassId(classrooms[0].id);
        }
    }, [user, classrooms, previewClassId]);

    const effectiveClassId = user?.classId || previewClassId;
    const currentClassroom = classrooms.find(c => c.id === effectiveClassId);

    // Filter Logic
    const myAssignments = useMemo(() => {
        if (!user || !effectiveClassId) return [];

        return assignments.filter(a => {
            if (a.classId !== effectiveClassId) return false;
            if (a.status !== 'PUBLISHED') return false;

            // Specific student check - only if not admin/teacher previewing
            if (user.role === 'KID' && a.specificStudentIds && a.specificStudentIds.length > 0) {
                return a.specificStudentIds.includes(user.id);
            }

            return true;
        });
    }, [assignments, user, effectiveClassId]);

    const { todo, submitted, graded } = useMemo(() => {
        const todoList: Assignment[] = [];
        const submittedList: { assignment: Assignment, submission: Submission }[] = [];
        const gradedList: { assignment: Assignment, submission: Submission }[] = [];

        if (!user) return { todo: todoList, submitted: submittedList, graded: gradedList };

        myAssignments.forEach(assign => {
            const sub = submissions.find(s => s.assignmentId === assign.id && s.studentId === user.id);
            if (!sub) {
                todoList.push(assign);
            } else if (sub.status === 'GRADED') {
                gradedList.push({ assignment: assign, submission: sub });
            } else {
                submittedList.push({ assignment: assign, submission: sub });
            }
        });

        return { todo: todoList, submitted: submittedList, graded: gradedList };
    }, [myAssignments, submissions, user]);

    const handleSubmitWork = () => {
        if (!selectedAssignment || !user) return;
        if (!submissionContent.trim()) {
            alert(t('assignments.please_type_answer', "Please type your answer or paste a link."));
            return;
        }

        const newSubmission: Submission = {
            id: \`sub_\${Date.now()}\`,
            assignmentId: selectedAssignment.id,
            studentId: user.id,
            submittedAt: new Date().toISOString(),
            status: 'PENDING',
            content: submissionContent
        };

        addSubmission(newSubmission);
        setSubmissionContent('');
        setSelectedAssignment(null);
    };

    const getGradeStyle = (score: number, max: number) => {
        if (score === max) return { bg: 'bg-blue-50 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800' };
        if (score >= max * 0.8) return { bg: 'bg-green-50 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300', border: 'border-green-200 dark:border-green-800' };
        if (score >= max * 0.5) return { bg: 'bg-yellow-50 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-300', border: 'border-yellow-200 dark:border-yellow-800' };
        return { bg: 'bg-red-50 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300', border: 'border-red-200 dark:border-red-800' };
    };

    if (!user) return null;

    // Admin/Teacher Class Selector
    const renderClassSelector = () => {
        if (user.role === 'KID' || user.classId) return null;

        return (
            <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-yellow-100 dark:bg-yellow-800 p-2 rounded-xl">
                        <UserCog size={20} className="text-yellow-700 dark:text-yellow-400" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm">{t('assignments.preview_mode', 'Teacher/Admin Preview Mode')}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t('assignments.viewing_as_student', 'Viewing as a student in:')}</p>
                    </div>
                </div>
                <select
                    value={previewClassId}
                    onChange={(e) => setPreviewClassId(e.target.value)}
                    className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white font-bold text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none"
                >
                    {classrooms.length === 0 && <option value="">{t('assignments.no_classes_found', 'No Classes Found')}</option>}
                    {classrooms.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
            </div>
        );
    };

    return (
        <div className="pb-24 max-w-4xl mx-auto px-4 sm:px-6">
            {/* Header with Glassmorphism */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-6 rounded-[32px] border-b-4 border-gray-100 dark:border-gray-700 shadow-xl mt-4">
                <div className="flex items-center gap-5 w-full sm:w-auto">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-tr from-blue-500 to-indigo-600 text-white rounded-3xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
                        <ClipboardList size={36} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-black text-gray-800 dark:text-white tracking-tight leading-tight">
                            {t('assignments.title', 'مهامي وتحدياتي')}
                        </h2>
                        <p className="text-gray-400 dark:text-gray-400 font-bold text-xs sm:text-sm mt-0.5">
                            {t('assignments.subtitle', 'أكمل هذه المهام لكسب الخبرة والعملات!')}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end flex-wrap">
                    {currentClassroom && (
                        <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-black">
                            <School size={15} />
                            <span>{currentClassroom.name}</span>
                        </div>
                    )}
                    <button
                        onClick={() => setShowJoinModal(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-2xl text-xs font-black shadow-[0_3px_0_0_rgba(37,99,235,1)] active:translate-y-0.5 transition-all flex items-center gap-2"
                    >
                        <School size={16} />
                        <span>{currentClassroom ? t('assignments.switch_class_button', 'تبديل الفصل') : t('assignments.join_class_button', 'انضم إلى فصل')}</span>
                    </button>
                </div>
            </div>

            {/* Category Switcher: Daily Missions vs Classroom Tasks */}
            <div className="flex items-center gap-3 p-1.5 bg-gray-100/80 dark:bg-slate-800/80 rounded-2xl mb-8 max-w-md mx-auto sm:mx-0">
                <button
                    onClick={() => setMissionCategory('DAILY')}
                    className={\`flex-1 py-3 px-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all \${
                        missionCategory === 'DAILY'
                            ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-md'
                            : 'text-gray-500 hover:text-gray-800 dark:text-gray-400'
                    }\`}
                >
                    <Zap size={16} className={missionCategory === 'DAILY' ? 'text-amber-500' : ''} />
                    <span>{t('assignments.tab_daily', 'المهام اليومية وعقود الأحياء')}</span>
                </button>
                <button
                    onClick={() => setMissionCategory('CLASSROOM')}
                    className={\`flex-1 py-3 px-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all \${
                        missionCategory === 'CLASSROOM'
                            ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-md'
                            : 'text-gray-500 hover:text-gray-800 dark:text-gray-400'
                    }\`}
                >
                    <School size={16} className={missionCategory === 'CLASSROOM' ? 'text-blue-500' : ''} />
                    <span>{t('assignments.tab_classroom', 'مهام الفصل الدراسي')}</span>
                    {myAssignments.length > 0 && (
                        <span className="ms-1 bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 text-[10px] px-2 py-0.5 rounded-full font-black">
                            {myAssignments.length}
                        </span>
                    )}
                </button>
            </div>

            {/* Category: DAILY MISSIONS */}
            {missionCategory === 'DAILY' && (
                <div className="space-y-6">
                    <DailyMissions />
                </div>
            )}

            {/* Category: CLASSROOM ASSIGNMENTS */}
            {missionCategory === 'CLASSROOM' && (
                <div className="space-y-6">
                    {renderClassSelector()}

                    {!effectiveClassId ? (
                        <div className="flex flex-col items-center justify-center min-h-[45vh] text-center p-8 bg-white dark:bg-gray-800 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700 shadow-sm">
                            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-5 text-blue-500">
                                <School size={40} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-2">
                                {t('assignments.no_class_card_title', 'لم تنضم إلى فصل مدرسي بعد')}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 font-bold max-w-md mb-6 text-sm">
                                {t('assignments.no_class_card_desc', 'أدخل رمز الفصل الدراسي المكون من 6 خانات الذي زودك به معلمك للوصول إلى مهام وواجبات الفصل.')}
                            </p>
                            <button
                                onClick={() => setShowJoinModal(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl font-black text-base shadow-[0_4px_0_0_rgba(37,99,235,1)] active:translate-y-0.5 transition-all flex items-center gap-2"
                            >
                                <School size={20} />
                                <span>{t('assignments.enter_code_cta', 'إدخال رمز الفصل والانضمام')}</span>
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Tabs Redesigned as Juicy Pills */}
                            <div className="flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                                <TabButton 
                                    active={activeTab === 'TODO'} 
                                    onClick={() => setActiveTab('TODO')} 
                                    label={t('assignments.tab_todo')} 
                                    count={todo.length}
                                    color="blue"
                                />
                                <TabButton 
                                    active={activeTab === 'SUBMITTED'} 
                                    onClick={() => setActiveTab('SUBMITTED')} 
                                    label={t('assignments.tab_submitted')} 
                                    count={submitted.length}
                                    color="yellow"
                                />
                                <TabButton 
                                    active={activeTab === 'GRADED'} 
                                    onClick={() => setActiveTab('GRADED')} 
                                    label={t('assignments.tab_graded')} 
                                    count={graded.length}
                                    color="green"
                                />
                            </div>

                            {/* Content */}
                            <div className="space-y-4">
                                {activeTab === 'TODO' && (
                                    todo.length === 0 ? (
                                        <EmptyState message={t('assignments.empty_todo')} />
                                    ) : (
                                        todo.map(assign => (
                                            <AssignmentCard
                                                key={assign.id}
                                                assignment={assign}
                                                onClick={() => setSelectedAssignment(assign)}
                                                ctaLabel="Start"
                                            />
                                        ))
                                    )
                                )}

                                {activeTab === 'SUBMITTED' && (
                                    submitted.length === 0 ? (
                                        <EmptyState message={t('assignments.empty_submitted')} />
                                    ) : (
                                        submitted.map(({ assignment, submission }) => (
                                            <div key={submission.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border-2 border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between">
                                                <div>
                                                    <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-1">{assignment.title}</h3>
                                                    <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                                                        <span>Submitted: {new Date(submission.submittedAt).toLocaleDateString()}</span>
                                                        <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 px-2 py-0.5 rounded-full">{t('assignments.status_pending')}</span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setSelectedAssignment(assignment)}
                                                    className="text-blue-600 font-bold hover:underline text-sm"
                                                >
                                                    View Details
                                                </button>
                                            </div>
                                        ))
                                    )
                                )}

                                {activeTab === 'GRADED' && (
                                    graded.length === 0 ? (
                                        <EmptyState message={t('assignments.empty_graded')} />
                                    ) : (
                                        graded.map(({ assignment, submission }) => {
                                            const style = getGradeStyle(submission.grade || 0, assignment.maxPoints);
                                            return (
                                                <div key={submission.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border-2 border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between">
                                                    <div>
                                                        <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-1">{assignment.title}</h3>
                                                        <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                                                            <span>Graded on {new Date(submission.submittedAt).toLocaleDateString()}</span>
                                                            {submission.feedback && <span className="text-gray-500 italic">"{submission.feedback}"</span>}
                                                        </div>
                                                    </div>
                                                    <div className={\`px-4 py-2 rounded-xl font-black text-lg border \${style.bg} \${style.text} \${style.border}\`}>
                                                        {submission.grade} / {assignment.maxPoints}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )
                                )}
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Submission Modal */}
            <AnimatePresence>
                {selectedAssignment && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border-2 border-gray-100 dark:border-gray-700 max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                                        {selectedAssignment.isHomework ? 'Home Project' : 'Class Assignment'}
                                    </span>
                                    <h3 className="text-2xl font-black text-gray-800 dark:text-white mt-2">
                                        {selectedAssignment.title}
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setSelectedAssignment(null)}
                                    className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-50"
                                >
                                    ✕
                                </button>
                            </div>

                            <p className="text-gray-600 dark:text-gray-300 font-medium mb-6 text-sm leading-relaxed">
                                {selectedAssignment.description}
                            </p>

                            <div className="space-y-4 mb-6">
                                <label className="block text-xs font-black uppercase text-gray-400">
                                    {t('assignments.submit_work', 'Your Submission')}
                                </label>
                                <textarea
                                    value={submissionContent}
                                    onChange={(e) => setSubmissionContent(e.target.value)}
                                    placeholder={t('assignments.placeholder', 'Type your thoughts, answers, or paste a link to your business project...')}
                                    className="w-full h-32 p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white font-medium text-sm outline-none focus:border-blue-500 transition-colors resize-none"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setSelectedAssignment(null)}
                                    className="flex-1 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmitWork}
                                    className="flex-[2] py-3 rounded-xl font-black bg-blue-600 text-white shadow-md hover:bg-blue-700 active:scale-95 transition-all"
                                >
                                    {t('assignments.btn_submit', 'Submit Assignment')}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Join Class Modal */}
            <AnimatePresence>
                {showJoinModal && (
                    <JoinClassModal onClose={() => setShowJoinModal(false)} />
                )}
            </AnimatePresence>
        </div>
    );
};

const TabButton = ({ active, onClick, label, count, color }: any) => {
    const colorStyles: any = {
        blue: active 
            ? 'bg-blue-600 text-white border-blue-800 shadow-blue-500/30' 
            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700',
        yellow: active 
            ? 'bg-yellow-500 text-white border-yellow-700 shadow-yellow-500/30' 
            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700',
        green: active 
            ? 'bg-green-600 text-white border-green-800 shadow-green-500/30' 
            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700'
    };

    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={\`
                px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-wider transition-all 
                border-b-[4px] flex items-center gap-2 whitespace-nowrap shadow-lg
                \${colorStyles[color] || colorStyles.blue}
                \${!active && 'hover:bg-white dark:bg-gray-800 dark:border-gray-700 opacity-70 hover:opacity-100'}
            \`}
        >
            {label}
            {count !== undefined && (
                <span className={\`
                    px-2 py-0.5 rounded-lg text-[10px] font-black
                    \${active ? 'bg-white/20' : 'bg-black/5'}
                \`}>
                    {count}
                </span>
            )}
        </motion.button>
    );
};

const AssignmentCard = ({ assignment, onClick }: any) => {
    const now = Date.now();
    const isDueSoon = assignment.dueDate ? new Date(assignment.dueDate).getTime() - now < 86400000 * 3 : false;
    const effectiveDeadline = assignment.homeworkDeadline || assignment.dueDate;
    const isOverdue = effectiveDeadline ? new Date(effectiveDeadline).getTime() < now : false;
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={onClick}
            className={\`
                group bg-white dark:bg-gray-800 p-6 rounded-[24px] border-2 shadow-xl transition-all cursor-pointer 
                flex items-center gap-6 border-b-[6px] relative overflow-hidden
                \${isOverdue
                    ? 'border-red-200 dark:border-red-900 border-b-red-600 dark:border-b-red-800 hover:border-red-400'
                    : 'border-gray-100 dark:border-gray-700 border-b-gray-300 dark:border-b-gray-900 hover:border-blue-200 dark:hover:border-blue-600'
                }
            \`}
        >
            {!isOverdue && (
                <div className="absolute top-0 start-0 w-2 h-full bg-blue-500 opacity-20" />
            )}
            {isOverdue && (
                <div className="absolute top-0 start-0 w-2 h-full bg-red-500 opacity-20" />
            )}

            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-700 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors shadow-inner">
                {assignment.isHomework ? <FileText size={32} strokeWidth={2.5} /> : <ClipboardList size={32} strokeWidth={2.5} />}
            </div>

            <div className="flex-1">
                <div className="flex justify-between items-start mb-2 gap-2 flex-wrap">
                    <h3 className="font-black text-2xl text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {assignment.title}
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap">
                        {assignment.isHomework && (
                            <span className="bg-blue-500 border-b-2 border-blue-700 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                                {t('assignments.homework', '📚 HOMEWORK')}
                            </span>
                        )}
                        {isOverdue && (
                            <span className="bg-red-600 border-b-2 border-red-800 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm animate-pulse">
                                {t('assignments.overdue', '🔴 OVERDUE')}
                            </span>
                        )}
                        {!isOverdue && isDueSoon && (
                            <span className="bg-orange-400 border-b-2 border-orange-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                                {t('assignments.due_soon')}
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 font-bold flex-wrap">
                    <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-700/50 px-3 py-1 rounded-lg">
                        <Clock size={14} className="text-blue-500" />
                        <span>{t('assignments.due')}: {effectiveDeadline ? new Date(effectiveDeadline).toLocaleDateString() : 'No Date'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-700/50 px-3 py-1 rounded-lg">
                        <Star size={14} className="text-yellow-500 fill-yellow-500" />
                        <span>{assignment.maxPoints} {t('assignments.pts')}</span>
                    </div>
                    {assignment.maxXP && (
                        <div className="flex items-center gap-1.5 bg-purple-50 dark:bg-purple-900/20 px-3 py-1 rounded-lg text-purple-600 dark:text-purple-400">
                            <Rocket size={14} fill="currentColor" />
                            <span className="font-black">+{assignment.maxXP} XP</span>
                        </div>
                    )}
                </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 group-hover:bg-blue-600 group-hover:text-white p-3 rounded-full transition-all text-gray-300 dark:text-gray-500 shadow-sm">
                <ChevronRight size={28} strokeWidth={3} className="rtl:rotate-180" />
            </div>
        </motion.div>
    );
};

const EmptyState = ({ message }: { message: string }) => {
    const { t } = useTranslation();
    return (
        <div className="text-center py-16 px-6 bg-white/50 dark:bg-gray-800/50 rounded-[32px] border-2 border-dashed border-gray-200 dark:border-gray-700 relative overflow-hidden">
            <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10"
            >
                <div className="w-32 h-32 mx-auto mb-6 relative">
                    <img 
                        src="/assets/ollie_wave.png" 
                        alt="Ollie" 
                        className="w-full h-full object-contain filter drop-shadow-xl"
                    />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="absolute -top-4 -end-8 bg-blue-500 text-white text-[10px] font-black px-3 py-2 rounded-2xl rounded-es-none shadow-lg border-2 border-white uppercase tracking-widest"
                    >
                        {t('common.nothing_here', 'All Clear!')}
                    </motion.div>
                </div>
            </motion.div>
            <p className="font-black text-xl text-gray-400 dark:text-gray-500 uppercase tracking-widest">{message}</p>
        </div>
    );
};

export default StudentAssignmentDashboard;
`;

fs.writeFileSync(studentDashboardPath, newContent, 'utf8');
console.log('StudentAssignmentDashboard.tsx updated successfully');
