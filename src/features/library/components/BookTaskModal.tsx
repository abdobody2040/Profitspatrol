import React, { useState } from 'react';
import { BookTask } from '../../../types';
import { X, CheckCircle, Zap, Coins, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Logger } from '../../../services/logger';

interface BookTaskModalProps {
    task: BookTask;
    onClose: () => void;
    onComplete: (data?: { score?: number; response?: string; checkpointProgress?: Record<string, boolean> }) => void;
}

const BookTaskModal: React.FC<BookTaskModalProps> = ({ task, onClose, onComplete }) => {
    const { t, i18n } = useTranslation();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
    const [reflectionText, setReflectionText] = useState('');
    const [checkpoints, setCheckpoints] = useState<Record<string, boolean>>({});
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);

    // Helper to get translated task content
    const getTaskContent = () => {
        const typeMapping: Record<string, string> = {
            'action_challenge': 'actionChallenge',
            'share_teach': 'shareTeach',
        };
        const typeKey = typeMapping[task.type] || task.type;
        const baseKey = `library_tasks.${task.bookId}.${typeKey}`;

        // Basic fields with fallback to generic task type translations
        const titleKey = `${baseKey}.title`;
        const descKey = `${baseKey}.description`;
        const genericTitleKey = `library.task_${task.type.replace('_', '')}_title`;
        const genericDescKey = `library.task_${task.type.replace('_', '')}_desc`;

        const title = i18n.exists(titleKey)
            ? t(titleKey as any)
            : i18n.exists(genericTitleKey)
                ? t(genericTitleKey as any)
                : task.title;

        const description = i18n.exists(descKey)
            ? t(descKey as any)
            : i18n.exists(genericDescKey)
                ? t(genericDescKey as any)
                : task.description;

        // Deep fields
        let translatedQuiz = task.quiz;
        if (task.quiz) {
            const baseQuizKey = `${baseKey}.quiz`;
            const hasSpecificTranslation = i18n.exists(baseQuizKey, { returnObjects: true });

            if (hasSpecificTranslation) {
                // Use book-specific translations if available
                const quizData = t(baseQuizKey as any, { returnObjects: true }) as any;
                if (quizData.questions) {
                    translatedQuiz = {
                        ...task.quiz,
                        questions: task.quiz.questions.map((q, i) => ({
                            ...q,
                            question: quizData.questions[i]?.question || q.question,
                            options: quizData.questions[i]?.options || q.options
                        }))
                    };
                }
            } else {
                // Fall back to generic quiz translations
                translatedQuiz = {
                    ...task.quiz,
                    questions: task.quiz.questions.map((q, i) => {
                        const qNum = i + 1;
                        const genericQuestionKey = `library.quiz_question_${qNum}`;
                        const hasGenericQuestion = i18n.exists(genericQuestionKey);

                        return {
                            ...q,
                            question: hasGenericQuestion
                                ? t(genericQuestionKey as any)
                                : q.question,
                            options: q.options.map((opt, optIdx) => {
                                const genericOptionKey = `library.quiz_option_${qNum}_${optIdx + 1}`;
                                return i18n.exists(genericOptionKey)
                                    ? t(genericOptionKey as any)
                                    : opt;
                            })
                        };
                    })
                };
            }
        }

        let translatedReflection = task.reflection;
        if (task.reflection) {
            const baseReflectionKey = `${baseKey}.reflection`;
            if (i18n.exists(baseReflectionKey, { returnObjects: true })) {
                const reflectionData = t(baseReflectionKey as any, { returnObjects: true }) as any;
                translatedReflection = {
                    ...task.reflection,
                    prompt: reflectionData.prompt || task.reflection.prompt
                };
            } else if (i18n.exists('library.reflection_prompt')) {
                // Fall back to generic reflection prompt
                translatedReflection = {
                    ...task.reflection,
                    prompt: t('library.reflection_prompt' as any)
                };
            }
        }

        let translatedAction = task.actionChallenge;
        if (task.actionChallenge) {
            const baseActionKey = `${baseKey}.actionChallenge`;
            if (i18n.exists(baseActionKey, { returnObjects: true })) {
                const actionData = t(baseActionKey as any, { returnObjects: true }) as any;
                translatedAction = {
                    ...task.actionChallenge,
                    steps: actionData.steps || task.actionChallenge.steps,
                    checkpoints: actionData.checkpoints || task.actionChallenge.checkpoints
                };
            } else {
                // Fall back to generic action challenge translations
                const hasGenericSteps = i18n.exists('library.action_step_1');
                if (hasGenericSteps) {
                    translatedAction = {
                        ...task.actionChallenge,
                        steps: task.actionChallenge.steps.map((_, i) => {
                            const stepKey = `library.action_step_${i + 1}`;
                            return i18n.exists(stepKey)
                                ? t(stepKey as any)
                                : task.actionChallenge!.steps[i];
                        }),
                        checkpoints: task.actionChallenge.checkpoints.map((_, i) => {
                            const checkKey = `library.action_checkpoint_${i + 1}`;
                            return i18n.exists(checkKey)
                                ? t(checkKey as any)
                                : task.actionChallenge!.checkpoints[i];
                        })
                    };
                }
            }
        }

        return {
            ...task,
            title,
            description,
            quiz: translatedQuiz,
            reflection: translatedReflection,
            actionChallenge: translatedAction
        };
    };

    const taskDisplay = getTaskContent();
    // Use taskDisplay instead of task for rendering text, but keep original task for logic if needed (though IDs/logic shouldn't change)
    const { title, description } = taskDisplay;

    // Quiz handling
    const handleQuizAnswer = (answerIndex: number) => {
        const newAnswers = [...quizAnswers];
        newAnswers[currentQuestion] = answerIndex;
        setQuizAnswers(newAnswers);

        if (taskDisplay.quiz && currentQuestion < taskDisplay.quiz.questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            // Calculate score
            let correct = 0;
            // ✅ SECURITY FIX: Removed 7-line DEBUG block that logged child's quiz answers,
            // correctAnswer indices (COPPA: answer content linked to identity), and score
            // to the production console. Quiz scoring logic remains identical.
            taskDisplay.quiz?.questions.forEach((q, i) => {
                if (newAnswers[i] === q.correctAnswer) correct++;
            });

            const finalScore = taskDisplay.quiz ? Math.round((correct / taskDisplay.quiz.questions.length) * 100) : 0;
            Logger.info('BookTaskModal: Quiz scored', { score: finalScore, totalQuestions: taskDisplay.quiz?.questions.length });

            setScore(finalScore);
            setShowResults(true);
        }
    };

    // Reflection handling
    const handleReflectionSubmit = () => {
        const wordCount = reflectionText.trim().split(/\s+/).length;
        const minWords = taskDisplay.reflection?.minWords || 0;

        if (wordCount < minWords) {
            alert(`Please write at least ${minWords} words. Current: ${wordCount}`);
            return;
        }

        onComplete({ response: reflectionText });
    };

    // Action challenge handling
    const toggleCheckpoint = (checkpoint: string) => {
        setCheckpoints(prev => ({ ...prev, [checkpoint]: !prev[checkpoint] }));
    };

    const handleActionChallengeSubmit = () => {
        const allChecked = taskDisplay.actionChallenge?.checkpoints.every(cp => checkpoints[cp]);
        if (!allChecked) {
            alert('Please complete all checkpoints before submitting!');
            return;
        }
        onComplete({ checkpointProgress: checkpoints });
    };

    // Share/Teach handling
    const handleShareTeachSubmit = () => {
        onComplete();
    };

    // Application handling
    const handleApplicationSubmit = () => {
        onComplete({ response: reflectionText });
    };

    // Quiz reset
    const handleTryAgain = () => {
        setCurrentQuestion(0);
        setQuizAnswers([]);
        setScore(0);
        setShowResults(false);
    };

    // Render quiz results
    const renderQuizResults = () => (
        <div className="text-center py-8">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-block"
            >
                <div className={`text-6xl mb-4 ${score >= 70 ? '🎉' : '📚'}`}>
                    {score >= 70 ? '🎉' : '📚'}
                </div>
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                {score >= 70 ? t('library.tasks.great_job') : t('library.tasks.keep_learning')}
            </h3>
            <p className="text-4xl font-black text-blue-600 dark:text-blue-400 mb-4">
                {score}%
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
                {t('library.tasks.correct', { count: taskDisplay.quiz?.questions.filter((q, i) => quizAnswers[i] === q.correctAnswer).length, total: taskDisplay.quiz?.questions.length })}
            </p>

            {/* Rewards */}
            {score >= 70 && (
                <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                        <Zap className="w-5 h-5" />
                        <span className="font-bold">+{taskDisplay.rewards.xp} XP</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                        <Coins className="w-5 h-5" />
                        <span className="font-bold">+{taskDisplay.rewards.coins}</span>
                    </div>
                </div>
            )}

            {score >= 70 ? (
                <button
                    onClick={() => onComplete({ score })}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg transform hover:scale-105 transition-all"
                >
                    {t('library.tasks.claim_rewards')}
                </button>
            ) : (
                <button
                    onClick={handleTryAgain}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg transform hover:scale-105 transition-all"
                >
                    {t('library.tasks.try_again')}
                </button>
            )}
        </div>
    );

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[300] p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between z-10">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                                {title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {description}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {/* Quiz Task */}
                        {taskDisplay.type === 'quiz' && !showResults && taskDisplay.quiz && (
                            <div>
                                <div className="mb-4 flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        Question {currentQuestion + 1} of {taskDisplay.quiz.questions.length}
                                    </span>
                                    <div className="flex gap-1">
                                        {taskDisplay.quiz.questions.map((_, i) => (
                                            <div
                                                key={i}
                                                className={`w-2 h-2 rounded-full ${i <= currentQuestion ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                                    {taskDisplay.quiz.questions[currentQuestion].question}
                                </h4>

                                <div className="space-y-3">
                                    {taskDisplay.quiz.questions[currentQuestion].options.map((option, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleQuizAnswer(i)}
                                            className="w-full text-left p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                                        >
                                            <span className="font-medium text-gray-800 dark:text-gray-100">{option}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quiz Results */}
                        {taskDisplay.type === 'quiz' && showResults && renderQuizResults()}

                        {/* Reflection Task */}
                        {taskDisplay.type === 'reflection' && taskDisplay.reflection && (
                            <div>
                                <p className="text-gray-700 dark:text-gray-300 mb-4 font-medium">
                                    {taskDisplay.reflection.prompt}
                                </p>
                                <textarea
                                    value={reflectionText}
                                    onChange={(e) => setReflectionText(e.target.value)}
                                    className="w-full h-48 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                                    placeholder={t('library.tasks.submit_reflection')}
                                />
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {reflectionText.trim().split(/\s+/).filter(w => w).length} {t('library.tasks.words')}
                                        {taskDisplay.reflection.minWords && ` (min: ${taskDisplay.reflection.minWords})`}
                                    </span>
                                </div>
                                <button
                                    onClick={handleReflectionSubmit}
                                    className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold shadow-lg transition-all"
                                >
                                    {t('library.tasks.submit_reflection')}
                                </button>
                            </div>
                        )}

                        {/* Action Challenge */}
                        {taskDisplay.type === 'action_challenge' && taskDisplay.actionChallenge && (
                            <div>
                                <div className="mb-6">
                                    <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">{t('library.tasks.steps')}</h4>
                                    <ul className="space-y-2">
                                        {taskDisplay.actionChallenge.steps.map((step, i) => (
                                            <li key={i} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                                                <span className="text-blue-500 font-bold">{i + 1}.</span>
                                                <span>{step}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mb-6">
                                    <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">{t('library.tasks.track_progress')}</h4>
                                    <div className="space-y-2">
                                        {taskDisplay.actionChallenge.checkpoints.map((checkpoint, i) => (
                                            <label
                                                key={i}
                                                className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={checkpoints[checkpoint] || false}
                                                    onChange={() => toggleCheckpoint(checkpoint)}
                                                    className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
                                                />
                                                <span className="font-medium text-gray-800 dark:text-gray-100">{checkpoint}</span>
                                                {checkpoints[checkpoint] && <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={handleActionChallengeSubmit}
                                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold shadow-lg transition-all"
                                >
                                    {t('library.tasks.complete_challenge')}
                                </button>
                            </div>
                        )}

                        {/* Share/Teach Task */}
                        {taskDisplay.type === 'share_teach' && (
                            <div className="text-center py-8">
                                <div className="text-6xl mb-4">🗣️</div>
                                <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                                    {t('library.tasks.shared_title', { defaultValue: 'Share what you learned!' })}
                                </h4>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    {t('library.tasks.shared_desc', { defaultValue: 'Explain this concept to a friend, family member, or classmate. Teaching others is one of the best ways to learn!' })}
                                </p>
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        {t('library.tasks.shared_tip', { defaultValue: '💡 Tip: Try to explain it in your own words without looking at the book!' })}
                                    </p>
                                </div>
                                <button
                                    onClick={handleShareTeachSubmit}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg transition-all"
                                >
                                    {t('library.tasks.shared')}
                                </button>
                            </div>
                        )}

                        {/* Application Task */}
                        {taskDisplay.type === 'application' && (
                            <div>
                                <p className="text-gray-700 dark:text-gray-300 mb-4 font-medium">
                                    {t('library.tasks.application_prompt', { defaultValue: 'Describe how you applied what you learned from this book in real life:' })}
                                </p>
                                <textarea
                                    value={reflectionText}
                                    onChange={(e) => setReflectionText(e.target.value)}
                                    className="w-full h-48 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                                    placeholder={t('library.tasks.submit_application')}
                                />
                                <button
                                    onClick={handleApplicationSubmit}
                                    className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold shadow-lg transition-all"
                                >
                                    {t('library.tasks.submit_application')}
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default BookTaskModal;
