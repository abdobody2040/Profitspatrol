import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SideHustle } from '../../../../types';
import { CheckCircle2, XCircle, Brain } from 'lucide-react';
import { QUIZ_QUESTIONS, QuizQuestion } from '../../data/quizQuestions';

interface QuizMinigameProps {
    gig: SideHustle;
    onScoreUpdate: (score: number) => void;
    timeLeft: number;
}

const QuizMinigame: React.FC<QuizMinigameProps> = ({ gig, onScoreUpdate, timeLeft }) => {
    const [score, setScore] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
    const [questionsAnswered, setQuestionsAnswered] = useState(0);

    const questions = QUIZ_QUESTIONS[gig.id] || [];
    const currentQuestion = questions[currentQuestionIndex];

    const handleAnswer = (index: number) => {
        if (selectedAnswer !== null) return; // Already answered

        setSelectedAnswer(index);
        const isCorrect = index === currentQuestion.correctIndex;

        setFeedback(isCorrect ? 'correct' : 'wrong');

        if (isCorrect) {
            const newScore = Math.min(100, score + 20);
            setScore(newScore);
            onScoreUpdate(newScore);
        }

        setQuestionsAnswered(prev => prev + 1);

        // Move to next question after delay
        setTimeout(() => {
            setSelectedAnswer(null);
            setFeedback(null);
            setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);
        }, 1500);
    };

    const getGigContent = () => {
        switch (gig.id) {
            case 'hustle_pet_sitter':
                return { emoji: '🐾', subject: 'Pet Care' };
            case 'hustle_tutor_helper':
                return { emoji: '📚', subject: 'School Subjects' };
            case 'hustle_coding_tutor':
                return { emoji: '💻', subject: 'Programming' };
            case 'hustle_tech_support':
                return { emoji: '🖥️', subject: 'Tech Support' };
            case 'hustle_bike_repair':
                return { emoji: '🔧', subject: 'Bike Mechanics' };
            case 'hustle_ai_tutor':
                return { emoji: '🤖', subject: 'Artificial Intelligence' };
            case 'hustle_climate_advisor':
                return { emoji: '🌍', subject: 'Climate & Sustainability' };
            case 'hustle_web3_dev':
                return { emoji: '💎', subject: 'Web3 & Blockchain' };
            default:
                return { emoji: '🧠', subject: 'General Knowledge' };
        }
    };

    const content = getGigContent();

    if (!currentQuestion) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-xl text-gray-600">No questions available for this gig.</p>
            </div>
        );
    }

    return (
        <div data-testid="minigame" data-minigame-type="quiz" className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto p-8 animate-fade-in">
            <div className="text-center mb-6">
                <h2 className="text-3xl font-black text-gray-800 mb-2">{gig.title}</h2>
                <div className="text-4xl font-mono font-bold text-blue-600 mb-2">{timeLeft}s</div>
                <p className="text-gray-600 font-bold">Answer questions about {content.subject}!</p>
            </div>

            {/* Score Progress Bar */}
            <div className="w-full h-8 bg-gray-200 rounded-full mb-6 overflow-hidden border-4 border-gray-100 relative">
                <motion.div
                    className="h-full bg-gradient-to-r from-purple-400 to-pink-600"
                    animate={{ width: `${score}%` }}
                    transition={{ type: 'spring', stiffness: 100 }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-700">
                    {score}% • {questionsAnswered} answered
                </div>
            </div>

            {/* Question Card */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQuestionIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="w-full bg-white rounded-3xl shadow-2xl p-8 border-4 border-purple-200"
                >
                    {/* Question */}
                    <div className="flex items-start gap-4 mb-6">
                        <div className="text-5xl">{content.emoji}</div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <Brain className="text-purple-600" size={24} />
                                <span className="text-sm font-bold text-purple-600">Question {currentQuestionIndex + 1}</span>
                            </div>
                            <h3 className="text-2xl font-black text-gray-800">
                                {currentQuestion.question}
                            </h3>
                        </div>
                    </div>

                    {/* Answer Options */}
                    <div className="grid grid-cols-1 gap-3">
                        {currentQuestion.options.map((option, index) => {
                            const isSelected = selectedAnswer === index;
                            const isCorrect = index === currentQuestion.correctIndex;
                            const showResult = selectedAnswer !== null;

                            return (
                                <motion.button
                                    key={index}
                                    onClick={() => handleAnswer(index)}
                                    disabled={selectedAnswer !== null}
                                    whileHover={selectedAnswer === null ? { scale: 1.02 } : {}}
                                    whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
                                    className={`p-4 rounded-xl font-bold text-left transition-all border-4 flex items-center gap-3
                                        ${!showResult ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 hover:border-purple-400 hover:shadow-lg' : ''}
                                        ${showResult && isSelected && isCorrect ? 'bg-green-100 border-green-500' : ''}
                                        ${showResult && isSelected && !isCorrect ? 'bg-red-100 border-red-500' : ''}
                                        ${showResult && !isSelected && isCorrect ? 'bg-green-50 border-green-300' : ''}
                                        ${showResult && !isSelected && !isCorrect ? 'bg-gray-100 border-gray-300 opacity-50' : ''}
                                    `}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-white
                                        ${!showResult ? 'bg-purple-400' : ''}
                                        ${showResult && isSelected && isCorrect ? 'bg-green-500' : ''}
                                        ${showResult && isSelected && !isCorrect ? 'bg-red-500' : ''}
                                        ${showResult && !isSelected ? 'bg-gray-400' : ''}
                                    `}>
                                        {String.fromCharCode(65 + index)}
                                    </div>
                                    <span className="flex-1">{option}</span>
                                    {showResult && isCorrect && (
                                        <CheckCircle2 className="text-green-600" size={24} />
                                    )}
                                    {showResult && isSelected && !isCorrect && (
                                        <XCircle className="text-red-600" size={24} />
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>
                </motion.div>
            </AnimatePresence>

            <p className="mt-6 text-sm text-gray-500 font-medium">
                💡 Tip: Answer correctly to earn more points!
            </p>
        </div>
    );
};

export default QuizMinigame;
