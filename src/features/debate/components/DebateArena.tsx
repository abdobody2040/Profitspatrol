import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DEBATE_TOPICS, DebateTopic } from '../data/topics';
import { GeminiService, DebateResult } from '../../../lib/gemini';
import { Send, Bot, Star, ArrowLeft, Trophy, Lock, AlertTriangle } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../../store';
import { useEducationStore } from '../../../store/educationStore';
import { hasSchoolBypass } from '../../../utils/premiumAccess';
import InvestorPitchModal from '../../game/components/InvestorPitchModal';

const DebateArena: React.FC = () => {
    const [selectedTopic, setSelectedTopic] = useState<DebateTopic | null>(null);
    const [messages, setMessages] = useState<{ sender: 'ollie' | 'user', text: string }[]>([]);
    const [inputText, setInputText] = useState('');
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [lastResult, setLastResult] = useState<DebateResult | null>(null);
    const [showPaywall, setShowPaywall] = useState(false);

    const { t } = useTranslation();
    const { user } = useAppStore();
    const classrooms = useEducationStore(state => state.classrooms);
    const users = useAppStore(state => state.users);

    const isAdmin = user?.role === 'ADMIN';
    const activeSchoolBypass = hasSchoolBypass(user, classrooms, users);
    const isInternLocked = !isAdmin && !activeSchoolBypass && user?.subscriptionTier === 'intern';

    const handleSelectTopic = (topic: DebateTopic) => {
        setSelectedTopic(topic);
        setMessages([
            { sender: 'ollie', text: t('debate.welcome') },
            { sender: 'ollie', text: t(`debate.topics.${topic.id}.scenario` as any) },
            { sender: 'ollie', text: `**${t(`debate.topics.${topic.id}.dilemma` as any)}**` }
        ]);
        setLastResult(null);
    };

    const handleSend = async () => {
        if (!inputText.trim() || !selectedTopic) return;

        const userMsg = inputText;
        setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
        setInputText('');
        setIsEvaluating(true);
        setLastResult(null);

        // Add thinking placeholder
        setMessages(prev => [...prev, { sender: 'ollie', text: t('debate.thinking') }]);

        try {
            // Note: We still send the English ID or English text to Gemini? 
            // Gemini handles multiple languages well. Ideally we send the localized scenario context.
            // But for now, we'll just send the user message. 
            // TO IMPROVE: We should send the *Translated* scenario to Gemini so it knows the context in the user's language.
            // However, GeminiService.evaluateDebate takes topicId. If the prompt there uses English, Gemini might reply in English.
            // We should ensure Gemini replies in the user's language. 
            // But simplest fix for UI first:
            const result = await GeminiService.evaluateDebate(selectedTopic.id, userMsg);

            // Remove "Thinking..."
            setMessages(prev => prev.filter(m => m.text !== t('debate.thinking')));

            setMessages(prev => [...prev, { sender: 'ollie', text: result.feedback }]);
            setLastResult(result);

            // NEW: Claim Reward
            const averageScore = (result.ethicsScore + result.logicScore) / 2;
            if (averageScore >= 70) {
                useAppStore.getState().completeDebate(averageScore);
            }
        } catch (error) {
            setMessages(prev => prev.filter(m => m.text !== t('debate.thinking')));
            setMessages(prev => [...prev, { sender: 'ollie', text: t('debate.error') }]);
        } finally {
            setIsEvaluating(false);
        }
    };

    // --- SELECTION SCREEN ---
    if (!selectedTopic) {
        return (
            <div className="p-6 min-h-full py-12 flex flex-col items-center relative">
                <InvestorPitchModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} />
                
                <h2 className="text-4xl font-black text-[var(--color-text)] mb-2 flex items-center gap-3">
                    <Bot className="text-[var(--color-primary)]" size={40} /> {t('debate.title')}
                </h2>
                <p className="text-[var(--color-text-muted)] mb-8 text-lg font-bold">{t('debate.subtitle')}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
                    {DEBATE_TOPICS.map((topic, index) => {
                        const isLocked = isInternLocked && index > 0;
                        
                        return (
                        <motion.div
                            key={topic.id}
                            whileHover={!isLocked ? { y: -4 } : {}}
                            whileTap={!isLocked ? { scale: 0.98 } : {}}
                            onClick={() => {
                                if (isLocked) {
                                    setShowPaywall(true);
                                } else {
                                    handleSelectTopic(topic);
                                }
                            }}
                            className={`card p-6 text-center flex flex-col items-center group relative overflow-hidden transition-all cursor-pointer ${
                                isLocked ? 'grayscale opacity-75' : ''
                            }`}
                        >
                            {isLocked && (
                                <div className="absolute top-0 end-0 bg-gray-900 text-white text-xs font-black px-3 py-1 rounded-es-xl z-20 flex items-center gap-1">
                                    <Lock size={12} /> {t('arcade.locked', { defaultValue: 'Locked' })}
                                </div>
                            )}
                            {topic.image ? (
                                <div className="w-full h-40 mb-4 rounded-2xl overflow-hidden bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm relative group-hover:shadow-md transition-shadow">
                                    <img
                                        src={topic.image}
                                        alt={topic.title}
                                        className={`w-full h-full object-cover transition-transform duration-500 ${!isLocked ? 'group-hover:scale-105' : ''}`}
                                    />
                                </div>
                            ) : (
                                <div className={`text-6xl mb-4 ${!isLocked ? 'group-hover:animate-bounce' : ''}`}>{topic.icon}</div>
                            )}
                            <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">{t(`debate.topics.${topic.id}.title` as any)}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                                topic.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                                topic.difficulty === 'Medium' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                            }`}>
                                {t(`engine.level_${topic.difficulty.toLowerCase()}` as any)}
                            </span>
                        </motion.div>
                    )})}
                </div>
            </div>
        );
    }

    // --- CHAT ARENA ---
    return (
        <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-6 p-2 md:p-6 max-w-7xl mx-auto">
            {/* Left: Chat */}
            <div className="card flex-1 flex flex-col overflow-hidden p-0">
                {/* Header */}
                <div className="p-4 border-b border-[var(--color-border)] flex items-center gap-4 bg-[var(--color-surface)]">
                    <button onClick={() => setSelectedTopic(null)} className="btn--ghost p-2 cursor-pointer">
                        <ArrowLeft size={20} />
                    </button>
                    {selectedTopic.image ? (
                        <img src={selectedTopic.image} alt={selectedTopic.title} className="w-10 h-10 rounded-xl object-cover shadow-sm border border-[var(--color-border)]" />
                    ) : (
                        <span className="text-2xl">{selectedTopic.icon}</span>
                    )}
                    <div>
                        <h3 className="font-bold text-lg text-[var(--color-text)]">{t(`debate.topics.${selectedTopic.id}.title` as any)}</h3>
                        <div className="text-xs text-[var(--color-text-muted)]">{t('debate.argue_case')}</div>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-sm flex-shrink-0 ${
                                msg.sender === 'ollie' ? 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-primary)]' : 'bg-[var(--color-primary)] text-white'
                            }`}>
                                {msg.sender === 'ollie' ? '🤖' : '👤'}
                            </div>
                            <div className={`p-4 rounded-2xl max-w-[80%] text-sm font-medium leading-relaxed ${
                                msg.sender === 'ollie'
                                    ? 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] rounded-ss-none'
                                    : 'bg-[var(--color-primary)] text-white rounded-se-none shadow-sm'
                            }`}>
                                {msg.text.includes('**') ?
                                    <strong className="block text-lg">{msg.text.replace(/\*\*/g, '')}</strong>
                                    : msg.text
                                }
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Input */}
                <div className="p-4 bg-[var(--color-surface)] border-t border-[var(--color-border)]">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={t('debate.type_placeholder')}
                            disabled={isEvaluating}
                            className="flex-1 px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] transition-colors"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!inputText.trim() || isEvaluating}
                            className="btn p-3 cursor-pointer disabled:opacity-50"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Right: Score Card (Only show if we have a result) */}
            <AnimatePresence>
                {lastResult && (
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        className="card w-full md:w-80 p-6 flex flex-col justify-center"
                    >
                        <h3 className="text-2xl font-black mb-6 text-center text-[var(--color-text)]">{t('debate.results')}</h3>

                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-sm font-bold mb-1 text-[var(--color-text)]">
                                    <span>⚖️ {t('debate.ethics')}</span>
                                    <span>{lastResult.ethicsScore}/100</span>
                                </div>
                                <div className="h-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${lastResult.ethicsScore}%` }}
                                        transition={{ duration: 1, ease: 'easeOut' }}
                                        className={`h-full ${lastResult.ethicsScore > 80 ? 'bg-[var(--color-success)]' : 'bg-amber-400'}`}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm font-bold mb-1 text-[var(--color-text)]">
                                    <span>🧠 {t('debate.logic')}</span>
                                    <span>{lastResult.logicScore}/100</span>
                                </div>
                                <div className="h-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${lastResult.logicScore}%` }}
                                        transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                                        className={`h-full ${lastResult.logicScore > 80 ? 'bg-[var(--color-primary)]' : 'bg-amber-400'}`}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl">
                            <div className="flex items-center gap-2 mb-2 text-amber-500 font-bold">
                                <Star size={18} fill="currentColor" />
                                <span>{t('debate.verdict')}</span>
                            </div>
                            <p className="text-sm leading-relaxed text-[var(--color-text-muted)] italic">
                                "{lastResult.feedback}"
                            </p>
                        </div>

                        {lastResult.fallaciesDetected && lastResult.fallaciesDetected.length > 0 && (
                            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl">
                                <div className="flex items-center gap-2 mb-2 text-red-600 dark:text-red-400 font-bold">
                                    <AlertTriangle size={18} />
                                    <span>Fallacies Detected</span>
                                </div>
                                <ul className="space-y-2">
                                    {lastResult.fallaciesDetected.map((f, i) => (
                                        <li key={i} className="text-xs text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/40 p-2 rounded-lg">
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {(lastResult.ethicsScore + lastResult.logicScore) / 2 >= 70 && (
                            <div className="mt-4 p-4 bg-amber-400 text-amber-950 rounded-2xl flex items-center gap-3 shadow-md animate-pulse">
                                <Trophy size={24} />
                                <div>
                                    <div className="font-black uppercase text-xs">{t('debate.victory')}</div>
                                    <div className="font-bold text-sm">{t('debate.reward')}</div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DebateArena;
