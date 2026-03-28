import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, StopCircle, Award, Volume2, ArrowRight, RotateCcw, DollarSign, Percent, User, ThumbsUp, ThumbsDown, XCircle, BarChart3, CheckCircle2, AlertCircle, Lightbulb } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppSound } from '../../../contexts/SoundContext';
import { useAppStore } from '../../../store';
import confetti from 'canvas-confetti';

import { analytics } from '../logic/AnalyticsService';
import { TheTankEngine, Offer, PitchAnalysis, JUDGES } from '../logic/TheTankEngine';

type Stage = 'PREP' | 'PITCH' | 'THINKING' | 'OFFER_SELECTION' | 'OFFER_NEGOTIATION' | 'DEAL' | 'REJECTED';

const TheTankMode: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { playSuccess, playMoney, playError } = useAppSound();
    const { user, updateUser } = useAppStore();

    const [stage, setStage] = useState<Stage>('PREP');
    const [transcript, setTranscript] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [thinkingText, setThinkingText] = useState('');
    const [validationError, setValidationError] = useState<string | null>(null);

    // Data State
    const [generatedOffers, setGeneratedOffers] = useState<Offer[]>([]);
    const [analysis, setAnalysis] = useState<PitchAnalysis | null>(null);

    // Active Negotiation State
    const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
    const [currentValuation, setCurrentValuation] = useState(0);
    const [currentEquity, setCurrentEquity] = useState(0);
    const [judgeMessage, setJudgeMessage] = useState('');
    const [negotiationRound, setNegotiationRound] = useState(0);

    // Counter Form
    const [counterValuation, setCounterValuation] = useState(0);
    const [counterEquity, setCounterEquity] = useState(0);
    const [isCountering, setIsCountering] = useState(false);



    // Speech Recognition Reference
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = i18n.language === 'ar' ? 'ar-SA' : 'en-US';

            recognitionRef.current.onresult = (event: any) => {
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    }
                }
                if (finalTranscript) {
                    setTranscript(prev => prev + ' ' + finalTranscript);
                }
            };
        }
    }, [i18n.language]);

    const toggleRecording = () => {
        if (!recognitionRef.current) return;
        if (isRecording) {
            recognitionRef.current.stop();
            setIsRecording(false);
        } else {
            recognitionRef.current.start();
            setIsRecording(true);
        }
    };

    const handleFinishPitch = () => {
        if (isRecording) {
            recognitionRef.current?.stop();
            setIsRecording(false);
        }

        // PRE-VALIDATION
        const isAr = i18n.language === 'ar';
        const tempAnalysis = TheTankEngine.analyzePitch(transcript, isAr);

        if (tempAnalysis.weaknesses.includes('missing_finance')) {
            setValidationError(t('the_tank.error_missing_finance'));
            playError();
            return;
        }

        setValidationError(null);
        analyzePitch();
    };

    const analyzePitch = () => {
        setStage('THINKING');

        const thinkingMessages = [
            t('the_tank.thinking_1'),
            t('the_tank.thinking_2'),
            t('the_tank.thinking_3'),
        ];
        let step = 0;
        const interval = setInterval(() => {
            setThinkingText(thinkingMessages[step % thinkingMessages.length]);
            step++;
        }, 1500);

        // ANALYZE via Engine
        const isAr = i18n.language === 'ar';
        const newAnalysis = TheTankEngine.analyzePitch(transcript, isAr);
        setAnalysis(newAnalysis);

        // Track Event
        analytics.track('PITCH_SUBMITTED', { score: newAnalysis.score, length: transcript.length });

        setTimeout(() => {
            clearInterval(interval);
            generateOffers(newAnalysis.score);
            setStage('OFFER_SELECTION');
            playSuccess();
        }, 4500);
    };

    const generateOffers = (score: number) => {
        const offers = TheTankEngine.generateOffers(score);

        if (offers.length === 0) {
            setGeneratedOffers([]);
            setJudgeMessage(t('the_tank.feedback_poor'));
            setStage('REJECTED');
            return;
        }

        // Translation mapping for comments (simple version)
        const translatedOffers = offers.map(o => ({
            ...o,
            comment: o.comment === 'GREAT' ? t('the_tank.feedback_great') : t('the_tank.feedback_good')
        }));

        setGeneratedOffers(translatedOffers);
    };

    const handleSelectOffer = (offer: Offer) => {
        setSelectedOffer(offer);
        setCurrentValuation(offer.valuation);
        setCurrentEquity(offer.equity);
        setCounterValuation(offer.valuation);
        setCounterEquity(offer.equity);
        setJudgeMessage(offer.comment);
        setNegotiationRound(0);
        setIsCountering(false);
        setStage('OFFER_NEGOTIATION');
    };

    const submitCounter = () => {
        if (!selectedOffer) return;

        const result = TheTankEngine.checkCounterOffer(
            selectedOffer,
            counterValuation,
            counterEquity,
            currentValuation,
            currentEquity,
            negotiationRound
        );

        if (result.isWalkAway) {
            setJudgeMessage(t('the_tank.judge_angry'));
            setStage('REJECTED');
            playError();
            return;
        }

        if (result.accepted) {
            completeDeal(counterValuation, counterEquity);
        } else if (result.counterOffer) {
            // Judge counters back
            setCurrentValuation(result.counterOffer.valuation);
            setCurrentEquity(result.counterOffer.equity);
            setJudgeMessage(t('the_tank.judge_counter'));
            setNegotiationRound(prev => prev + 1);
            setIsCountering(false); // Go back to view offer
        }
    };

    const completeDeal = (val: number, eq: number) => {
        if (user) {
            updateUser(user.id, { bizCoins: (user.bizCoins || 0) + 500 });
        }
        setCurrentValuation(val);
        setCurrentEquity(eq);
        setStage('DEAL');
        playMoney();
        confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.6 },
            colors: ['#22c55e', '#eab308']
        });
    };

    const AnalysisCard = () => (
        <div className="bg-gray-800 rounded-2xl p-6 mt-8 max-w-lg mx-auto text-left border border-gray-700">
            <h3 className="flex items-center gap-2 text-xl font-bold text-white mb-4">
                <BarChart3 className="text-yellow-400" /> {t('the_tank.analysis_title')}
            </h3>

            <div className="space-y-4">
                {/* Strengths */}
                <div>
                    <h4 className="text-green-400 font-bold mb-2 text-sm uppercase tracking-wider">{t('the_tank.analysis_good')}</h4>
                    <ul className="space-y-2">
                        {analysis?.strengths.map((s, i) => (
                            <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                                <CheckCircle2 size={16} className="text-green-500 mt-0.5" /> {t(`the_tank.analysis.${s}` as any)}
                            </li>
                        ))}
                        {analysis?.strengths.length === 0 && <li className="text-gray-500 italic text-sm">{t('the_tank.analysis_none')}</li>}
                    </ul>
                </div>

                {/* Weaknesses */}
                <div>
                    <h4 className="text-red-400 font-bold mb-2 text-sm uppercase tracking-wider">{t('the_tank.analysis_bad')}</h4>
                    <ul className="space-y-2">
                        {analysis?.weaknesses.map((w, i) => (
                            <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                                <AlertCircle size={16} className="text-red-500 mt-0.5" /> {t(`the_tank.analysis.${w}` as any)}
                            </li>
                        ))}
                        {analysis?.weaknesses.length === 0 && <li className="text-gray-500 italic text-sm">{t('the_tank.analysis_none_bad')}</li>}
                    </ul>
                </div>

                {/* Tips */}
                <div className="bg-blue-900/30 p-4 rounded-xl border border-blue-800/50">
                    <h4 className="text-blue-400 font-bold mb-2 text-sm uppercase tracking-wider flex items-center gap-2">
                        <Lightbulb size={16} /> {t('the_tank.analysis_tip')}
                    </h4>
                    <p className="text-gray-300 text-sm italic">"{t(`the_tank.tips.${analysis?.tips[0] || 'tip_general'}` as any)}"</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="w-full h-full bg-gray-900 text-white flex flex-col items-center justify-start overflow-y-auto relative">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-gray-900 to-gray-900 -z-0" />

            <div className={`w-full h-full p-6 flex flex-col items-center justify-center relative z-10 transition-all duration-500`}>
                <AnimatePresence mode='wait'>
                    {/* STAGE 1: PREP */}
                    {stage === 'PREP' && (
                        <motion.div key="prep" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                            <div className="mb-8">
                                <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/50">
                                    <Volume2 size={48} className="text-white" />
                                </div>
                                <h1 className="text-5xl font-black mb-2 tracking-tight">{t('the_tank.title')}</h1>
                                <p className="text-gray-300 text-xl max-w-lg mx-auto">{t('the_tank.subtitle')}</p>
                            </div>

                            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 text-left mb-8">
                                <h3 className="text-yellow-400 font-bold text-lg mb-3 uppercase tracking-wider">{t('the_tank.tips_title')}</h3>
                                <ul className="space-y-3 text-lg">
                                    <li className="flex items-start gap-3">
                                        <span className="bg-blue-500/20 text-blue-400 font-bold px-2 py-0.5 rounded">1</span>
                                        {t('the_tank.tip_1')}
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="bg-blue-500/20 text-blue-400 font-bold px-2 py-0.5 rounded">2</span>
                                        {t('the_tank.tip_2')}
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="bg-blue-500/20 text-blue-400 font-bold px-2 py-0.5 rounded">3</span>
                                        {t('the_tank.tip_3')}
                                    </li>
                                </ul>
                            </div>

                            <button onClick={() => setStage('PITCH')} className="bg-blue-500 hover:bg-blue-400 text-white text-xl font-bold py-4 px-12 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-3 mx-auto">
                                {t('the_tank.action_ready')} <ArrowRight size={24} />
                            </button>
                        </motion.div>
                    )}

                    {/* STAGE 2: PITCH (Same as before) */}
                    {stage === 'PITCH' && (
                        <motion.div key="pitch" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-200">{t('the_tank.stage_pitch_title')}</h2>
                                <p className="text-gray-400">{t('the_tank.stage_pitch_subtitle')}</p>
                                {validationError && (
                                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded-lg mt-4 flex items-center gap-2 justify-center mx-auto max-w-md">
                                        <AlertCircle size={20} />
                                        <span className="font-bold">{validationError}</span>
                                    </motion.div>
                                )}
                            </div>
                            <div className="relative mb-8">
                                <textarea value={transcript} onChange={(e) => setTranscript(e.target.value)} placeholder={t('the_tank.placeholder')} className="w-full h-64 bg-gray-800 text-white p-6 rounded-3xl text-xl resize-none focus:outline-none focus:ring-4 focus:ring-blue-500/50 border border-gray-700" />
                                {'webkitSpeechRecognition' in window || 'SpeechRecognition' in window ? (
                                    <button onClick={toggleRecording} className={`absolute bottom-6 right-6 p-4 rounded-full transition-all shadow-lg flex items-center gap-2 ${isRecording ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-blue-600 hover:bg-blue-500'}`}>
                                        {isRecording ? <div className="h-3 w-3 bg-white rounded-sm" /> : <Mic size={24} />}
                                    </button>
                                ) : null}
                            </div>
                            <button onClick={handleFinishPitch} disabled={transcript.length < 5} className="w-full bg-green-500 hover:bg-green-400 disabled:bg-gray-700 disabled:text-gray-500 text-white text-xl font-bold py-4 px-12 rounded-full shadow-xl transition-all">
                                {t('the_tank.action_submit')}
                            </button>
                        </motion.div>
                    )}

                    {/* STAGE 3: THINKING (Same as before) */}
                    {stage === 'THINKING' && (
                        <motion.div key="thinking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-20">
                            <div className="relative w-32 h-32 mx-auto mb-8">
                                <div className="absolute inset-0 border-4 border-t-blue-500 border-r-transparent border-b-purple-500 border-l-transparent rounded-full animate-spin" />
                                <Award className="absolute inset-0 m-auto text-yellow-400" size={40} />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-4 animate-pulse">{thinkingText}</h2>
                        </motion.div>
                    )}

                    {/* STAGE 4: OFFER SELECTION (NEW) */}
                    {stage === 'OFFER_SELECTION' && (
                        <motion.div key="selection" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center">
                            <h2 className="text-4xl font-black text-white mb-2">{t('the_tank.offers_available', { count: generatedOffers.length })}</h2>
                            <p className="text-gray-400 mb-8">{t('the_tank.select_offer_desc')}</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
                                {generatedOffers.map((offer, idx) => (
                                    <motion.div
                                        key={offer.judge.id}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.2 }}
                                        onClick={() => handleSelectOffer(offer)}
                                        className="bg-white text-gray-900 rounded-3xl p-6 shadow-xl cursor-pointer hover:scale-105 transition-transform relative overflow-hidden group"
                                    >
                                        <div className={`absolute top-0 left-0 w-full h-2 ${offer.judge.color}`} />
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className={`w-14 h-14 ${offer.judge.color} rounded-full flex items-center justify-center text-white shadow-md`}>
                                                <User size={24} />
                                            </div>
                                            <div className="text-left">
                                                <h3 className="font-black text-lg leading-tight">{t(offer.judge.nameKey as any)}</h3>
                                                <p className="text-xs text-gray-500 uppercase font-bold">{t(offer.judge.styleKey as any)}</p>
                                            </div>
                                        </div>
                                        <div className="bg-gray-100 rounded-xl p-4 mb-2">
                                            <div className="text-3xl font-black text-green-600">${offer.valuation.toLocaleString()}</div>
                                            <div className="text-sm font-bold text-gray-500">for {offer.equity}% Equity</div>
                                        </div>
                                        <div className="text-blue-600 font-bold text-sm bg-blue-50 py-2 rounded-lg group-hover:bg-blue-100 transition-colors">
                                            {t('the_tank.action_view_offer')}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STAGE 5: OFFER NEGOTIATION (Modified) */}
                    {stage === 'OFFER_NEGOTIATION' && selectedOffer && (
                        <motion.div key="negotiation" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="bg-white text-gray-900 rounded-3xl p-8 shadow-2xl max-w-lg mx-auto relative overflow-hidden">
                            {!isCountering ? (
                                <>
                                    <button onClick={() => setStage('OFFER_SELECTION')} className="absolute top-4 left-4 text-gray-400 hover:text-gray-600"><ArrowRight className="rotate-180" size={24} /></button>
                                    <div className="flex flex-col items-center mb-6 mt-4">
                                        <div className={`w-20 h-20 ${selectedOffer.judge.color} rounded-full flex items-center justify-center text-white mb-2 shadow-lg`}>
                                            <User size={40} />
                                        </div>
                                        <h2 className="text-2xl font-black text-gray-800">{t(selectedOffer.judge.nameKey as any)}</h2>
                                        <p className="text-gray-600 italic mt-2 text-center">"{judgeMessage}"</p>
                                    </div>
                                    <div className="bg-gray-100 rounded-2xl p-6 mb-6 border-l-8 border-gray-300 text-center">
                                        <div className="text-sm font-bold text-gray-500 mb-1">{t('the_tank.label_offer')}</div>
                                        <div className="text-5xl font-black text-green-600 mb-1">${currentValuation.toLocaleString()}</div>
                                        <div className="text-xl font-bold text-gray-400">for {currentEquity}% Equity</div>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <button onClick={() => completeDeal(currentValuation, currentEquity)} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2">
                                            <ThumbsUp size={20} /> {t('the_tank.action_deal')}
                                        </button>
                                        <div className="flex gap-3">
                                            <button onClick={() => setIsCountering(true)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow"> {t('the_tank.action_counter')} </button>
                                            <button onClick={() => { setStage('OFFER_SELECTION'); setSelectedOffer(null); }} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 rounded-xl"> {t('the_tank.action_walk')} </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                // Counter UI
                                <>
                                    <button onClick={() => setIsCountering(false)} className="absolute top-4 left-4 text-gray-400 hover:text-gray-600"><ArrowRight className="rotate-180" size={24} /></button>
                                    <h2 className="text-2xl font-black text-center mb-6 mt-4">{t('the_tank.counter_title')}</h2>
                                    <div className="space-y-8 mb-8">
                                        <div>
                                            <div className="flex justify-between mb-2 font-bold text-gray-700">
                                                <span className="flex items-center gap-2"><DollarSign size={18} className="text-green-600" /> Valuation</span>
                                                <span>${counterValuation.toLocaleString()}</span>
                                            </div>
                                            <input type="range" min={10000} max={200000} step={1000} value={counterValuation} onChange={(e) => setCounterValuation(Number(e.target.value))} className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                                        </div>
                                        <div>
                                            <div className="flex justify-between mb-2 font-bold text-gray-700">
                                                <span className="flex items-center gap-2"><Percent size={18} className="text-blue-600" /> Equity</span>
                                                <span>{counterEquity}%</span>
                                            </div>
                                            <input type="range" min={1} max={90} step={1} value={counterEquity} onChange={(e) => setCounterEquity(Number(e.target.value))} className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                                        </div>
                                    </div>
                                    <button onClick={submitCounter} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg"> {t('the_tank.action_submit_counter')} </button>
                                </>
                            )}
                        </motion.div>
                    )}

                    {/* STAGE 6: DEAL (Modified w/ Analysis) */}
                    {stage === 'DEAL' && (
                        <motion.div key="deal" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12 w-full">
                            <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-400/50 animate-bounce">
                                <ThumbsUp size={64} className="text-white" />
                            </div>
                            <h1 className="text-5xl font-black text-white mb-2">{t('the_tank.deal_title')}</h1>
                            <p className="text-2xl text-green-400 font-bold mb-8"> ${currentValuation.toLocaleString()} for {currentEquity}% </p>

                            <AnalysisCard />

                            <button onClick={() => setStage('PREP')} className="mt-8 bg-white text-gray-900 text-xl font-bold py-3 px-10 rounded-full hover:bg-gray-100"> {t('the_tank.action_continue')} </button>
                        </motion.div>
                    )}

                    {/* STAGE 7: REJECTED (Modified w/ Analysis) */}
                    {stage === 'REJECTED' && (
                        <motion.div key="rejected" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12 w-full">
                            <div className="w-32 h-32 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-red-500/50">
                                <XCircle size={64} className="text-white" />
                            </div>
                            <h1 className="text-5xl font-black text-white mb-4">{t('the_tank.rejected_title')}</h1>
                            <p className="text-xl text-gray-300 italic mb-8 max-w-md mx-auto">"{judgeMessage}"</p>

                            <AnalysisCard />

                            <button onClick={() => { setStage('PREP'); setTranscript(''); }} className="mt-8 bg-white text-gray-900 text-xl font-bold py-3 px-10 rounded-full hover:bg-gray-100"> {t('the_tank.action_try_again')} </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default TheTankMode;
