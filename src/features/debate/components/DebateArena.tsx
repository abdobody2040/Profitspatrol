import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DEBATE_TOPICS, DebateTopic } from '../data/topics';
import { GeminiService, DebateResult } from '../../../lib/gemini';
import { Mic, Send, Bot, Star, ArrowLeft, Trophy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../../store';

const DebateArena: React.FC = () => {
    const [selectedTopic, setSelectedTopic] = useState<DebateTopic | null>(null);
    const [messages, setMessages] = useState<{ sender: 'ollie' | 'user', text: string }[]>([]);
    const [inputText, setInputText] = useState('');
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [lastResult, setLastResult] = useState<DebateResult | null>(null);

    const { t } = useTranslation();

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
            <div className="p-6 h-full flex flex-col items-center justify-center">
                <h2 className="text-4xl font-black text-gray-800 dark:text-white mb-2 flex items-center gap-3">
                    <Bot className="text-purple-600" size={40} /> {t('debate.title')}
                </h2>
                <p className="text-gray-500 mb-8 text-lg font-medium">{t('debate.subtitle')}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
                    {DEBATE_TOPICS.map(topic => (
                        <motion.div
                            key={topic.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleSelectTopic(topic)}
                            className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl border-4 border-transparent hover:border-purple-400 cursor-pointer text-center flex flex-col items-center group"
                        >
                            <div className="text-6xl mb-4 group-hover:animate-bounce">{topic.icon}</div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{t(`debate.topics.${topic.id}.title` as any)}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider
                                ${topic.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                                    topic.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}
                            `}>
                                {t(`engine.level_${topic.difficulty.toLowerCase()}` as any)}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        );
    }

    // --- CHAT ARENA ---
    return (
        <div className="h-[calc(100vh-100px)] flex flex-col md:flex-row gap-6 p-4 md:p-8 max-w-7xl mx-auto">
            {/* Left: Chat */}
            <div className="flex-1 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden border-2 border-gray-100 dark:border-gray-700">
                {/* Header */}
                <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-4 bg-gray-50 dark:bg-gray-900/50">
                    <button onClick={() => setSelectedTopic(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h3 className="font-bold text-lg dark:text-white">{t(`debate.topics.${selectedTopic.id}.title` as any)}</h3>
                        <div className="text-xs text-gray-500">{t('debate.argue_case')}</div>
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
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-sm flex-shrink-0
                                ${msg.sender === 'ollie' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}
                            `}>
                                {msg.sender === 'ollie' ? '🤖' : '👤'}
                            </div>
                            <div className={`p-4 rounded-2xl max-w-[80%] text-sm font-medium leading-relaxed
                                ${msg.sender === 'ollie'
                                    ? 'bg-gray-100 dark:bg-gray-700 dark:text-gray-200 rounded-tl-none'
                                    : 'bg-blue-500 text-white rounded-tr-none shadow-md'}
                            `}>
                                {msg.text.includes('**') ?
                                    <strong className="block text-lg">{msg.text.replace(/\*\*/g, '')}</strong>
                                    : msg.text
                                }
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Input */}
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={t('debate.type_placeholder')}
                            disabled={isEvaluating}
                            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:ring-2 focus:ring-purple-500 outline-none transition-shadow"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!inputText.trim() || isEvaluating}
                            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white p-3 rounded-xl transition-colors shadow-lg"
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
                        className="w-full md:w-80 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-2xl flex flex-col justify-center"
                    >
                        <h3 className="text-2xl font-black mb-6 text-center text-white/90">{t('debate.results')}</h3>

                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-sm font-bold mb-1 opacity-90">
                                    <span>⚖️ {t('debate.ethics')}</span>
                                    <span>{lastResult.ethicsScore}/100</span>
                                </div>
                                <div className="h-4 bg-black/20 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${lastResult.ethicsScore}%` }}
                                        transition={{ duration: 1, ease: 'easeOut' }}
                                        className={`h-full ${lastResult.ethicsScore > 80 ? 'bg-green-400' : 'bg-yellow-400'}`}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm font-bold mb-1 opacity-90">
                                    <span>🧠 {t('debate.logic')}</span>
                                    <span>{lastResult.logicScore}/100</span>
                                </div>
                                <div className="h-4 bg-black/20 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${lastResult.logicScore}%` }}
                                        transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                                        className={`h-full ${lastResult.logicScore > 80 ? 'bg-blue-400' : 'bg-orange-400'}`}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
                            <div className="flex items-center gap-2 mb-2 text-yellow-300 font-bold">
                                <Star size={18} fill="currentColor" />
                                <span>{t('debate.verdict')}</span>
                            </div>
                            <p className="text-sm leading-relaxed opacity-90 italic">
                                "{lastResult.feedback}"
                            </p>
                        </div>

                        {(lastResult.ethicsScore + lastResult.logicScore) / 2 >= 70 && (
                            <div className="mt-4 p-4 bg-yellow-400 text-yellow-900 rounded-2xl flex items-center gap-3 shadow-lg animate-pulse">
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
