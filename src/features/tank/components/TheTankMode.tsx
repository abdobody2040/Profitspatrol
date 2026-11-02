import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Mic, Volume2, VolumeX, ArrowRight, DollarSign, Percent, User, 
    ThumbsUp, XCircle, BarChart3, CheckCircle2, AlertCircle, Lightbulb,
    Sparkles, Trophy, Award, Radio, HelpCircle, ChevronRight, Check
} from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useAppSound } from '../../../contexts/SoundContext';
import { useAppStore } from '../../../store';
import confetti from 'canvas-confetti';

import { analytics } from '../logic/AnalyticsService';
import { TheTankEngine, Offer, PitchAnalysis, Judge, JUDGES } from '../logic/TheTankEngine';
import { TankJudgeVoiceEngine } from '../../../services/voice/TankJudgeVoiceEngine';

type Stage = 'PREP' | 'PITCH' | 'THINKING' | 'TANK_FLOOR' | 'NEGOTIATION' | 'DEAL' | 'REJECTED';

// Pick 3 session judges
const SESSION_JUDGES = [...JUDGES].sort(() => 0.5 - Math.random()).slice(0, 3);

// Fallback avatar helper matching character ID
const getJudgeAvatar = (judge: Judge): string => {
    if (judge.avatar) return judge.avatar;
    switch (judge.id) {
        case 'cash': return '/images/tank/judge_rex.jpg';
        case 'tech': return '/images/tank/judge_kami.jpg';
        case 'vision': return '/images/tank/judge_ollie.jpg';
        case 'eco': return '/images/tank/judge_filo.jpg';
        case 'trend': return '/images/tank/judge_reema.jpg';
        default: return '/images/tank/judge_ollie.jpg';
    }
};

const getJudgeThemeRing = (judgeId: string): string => {
    switch (judgeId) {
        case 'vision': return 'border-amber-400 dark:border-amber-400 ring-2 ring-amber-400/40 shadow-amber-500/20';
        case 'trend': return 'border-pink-500 dark:border-pink-500 ring-2 ring-pink-500/40 shadow-pink-500/20';
        case 'eco': return 'border-emerald-500 dark:border-emerald-500 ring-2 ring-emerald-500/40 shadow-emerald-500/20';
        case 'tech': return 'border-cyan-400 dark:border-cyan-400 ring-2 ring-cyan-400/40 shadow-cyan-500/20';
        case 'cash': return 'border-amber-500 dark:border-amber-500 ring-2 ring-amber-500/40 shadow-amber-500/20';
        default: return 'border-blue-400 dark:border-blue-400 ring-2 ring-blue-400/40 shadow-blue-500/20';
    }
};

const getJudgeBio = (id: string, isAr: boolean): { role: string; lookingFor: string } => {
    if (isAr) {
        switch (id) {
            case 'vision': return { role: 'المستشار أولي · صاحب الرؤية', lookingFor: 'يبحث عن استراتيجية واضحة ونموذج ربحي قابل للتوسع' };
            case 'trend': return { role: 'المستثمرة ريما · صانعة الاتجاهات', lookingFor: 'تبحث عن علامة تجارية فيروسية وجاذبية عملاء قوية' };
            case 'eco': return { role: 'المستثمر فيلو · حامي الأصول', lookingFor: 'يبحث عن إدارة مخاطر ذكية واستدامة حقيقية لرأس المال' };
            case 'tech': return { role: 'المستثمر كامي · مبتكر التقنية', lookingFor: 'يبحث عن نموذج أولي فريد وابتكار تقني لا يقبل التقليد' };
            case 'cash': return { role: 'المستثمر ريكس · طالب وحكم متدرب', lookingFor: 'مفاوض ذكي يبحث عن تدفق نقدي سريع وعوائد سخية؛ ولن يتردد في خفض تقييمك!' };
            default: return { role: 'مستثمر معتمد', lookingFor: 'يبحث عن شركات ناشئة واعدة' };
        }
    }
    switch (id) {
        case 'vision': return { role: 'Ollie · Chief Strategist', lookingFor: 'Scalable business model and disciplined unit economics' };
        case 'trend': return { role: 'Reema · Trend Setter', lookingFor: 'Viral brand identity and irresistible customer retention' };
        case 'eco': return { role: 'Filo · Asset Guardian', lookingFor: 'Capital preservation, sustainability, and rock-solid margins' };
        case 'tech': return { role: 'Kami · Lady Tech', lookingFor: 'Ingenious tech prototypes and defensible intellectual moat' };
        case 'cash': return { role: 'Rex · Apprentice Judge & Negotiator', lookingFor: 'Fast positive cash flow; tough, clever negotiator who drives a hard bargain' };
        default: return { role: 'Angel Investor', lookingFor: 'High potential ventures' };
    }
};

const TheTankMode: React.FC = () => {
    const { t, i18n } = useTranslation();
    const isAr = i18n.language === 'ar';
    const { playSuccess, playMoney, playError } = useAppSound();
    const { user, updateUser } = useAppStore();

    const [stage, setStage] = useState<Stage>('PREP');
    const [transcript, setTranscript] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);

    // Selected judge modal preview in PREP
    const [previewJudgeId, setPreviewJudgeId] = useState<string>('vision');

    // Data State
    const [analysis, setAnalysis] = useState<PitchAnalysis | null>(null);
    const [offersMap, setOffersMap] = useState<Record<string, Offer>>({});

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

    // Voice & Speech Synthesis State
    const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
    const [voiceState, setVoiceState] = useState<{ isSpeaking: boolean; activeJudgeId: string | null; waveformLevel: number }>({
        isSpeaking: false,
        activeJudgeId: null,
        waveformLevel: 0,
    });

    useEffect(() => {
        const unsubscribe = TankJudgeVoiceEngine.subscribe((state) => {
            setVoiceState(state);
        });
        return () => {
            unsubscribe();
            TankJudgeVoiceEngine.stop();
        };
    }, []);

    const toggleVoice = () => {
        const next = !isVoiceEnabled;
        setIsVoiceEnabled(next);
        TankJudgeVoiceEngine.setVoiceEnabled(next);
    };

    // Live pitch keyword checklist detector
    const detectedKeywords = useMemo(() => {
        const text = transcript.toLowerCase();
        const hasFinance = isAr
            ? ['ربح', 'مال', 'فلوس', 'تكلفة', 'سعر', 'ريال', 'دولار', 'دخل', 'ميزانية', 'استثمار', 'مصاريف'].some(k => text.includes(k))
            : ['profit', 'money', 'revenue', 'cost', 'price', 'dollar', 'earn', 'fund'].some(k => text.includes(k));
        const hasProblem = isAr
            ? ['مشكلة', 'صعوبة', 'تحدي', 'نحتاج', 'إصلاح', 'يعاني', 'غلط', 'أزمة'].some(k => text.includes(k))
            : ['problem', 'solve', 'need', 'fix', 'issue', 'pain'].some(k => text.includes(k));
        const hasSolution = isAr
            ? ['حل', 'تطبيق', 'برنامج', 'منتج', 'خدمة', 'فكرة', 'مساعدة', 'نقدم', 'ابتكار'].some(k => text.includes(k))
            : ['solution', 'help', 'app', 'product', 'service', 'create', 'offer'].some(k => text.includes(k));
        const hasCustomers = isAr
            ? ['بيع', 'مبيعات', 'زبائن', 'عملاء', 'ناس', 'مستخدمين', 'طلب', 'سوق'].some(k => text.includes(k))
            : ['sales', 'customer', 'user', 'people', 'bought', 'sold', 'order', 'market'].some(k => text.includes(k));

        return { hasFinance, hasProblem, hasSolution, hasCustomers };
    }, [transcript, isAr]);

    // Speech Recognition Reference
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = isAr ? 'ar-SA' : 'en-US';

            recognitionRef.current.onresult = (event: any) => {
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    }
                }
                if (finalTranscript) {
                    setTranscript(prev => (prev ? prev + ' ' : '') + finalTranscript);
                }
            };
        }
    }, [isAr]);

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

        const tempAnalysis = TheTankEngine.analyzePitch(transcript, isAr);

        if (tempAnalysis.weaknesses.includes('missing_finance')) {
            setValidationError(t('the_tank.error_missing_finance', 'You must mention finances, costs, or revenue to pitch to the judges!'));
            playError();
            return;
        }

        setValidationError(null);
        analyzePitch();
    };

    const analyzePitch = () => {
        setStage('THINKING');

        const newAnalysis = TheTankEngine.analyzePitch(transcript, isAr);
        setAnalysis(newAnalysis);

        analytics.track('PITCH_SUBMITTED', { score: newAnalysis.score, length: transcript.length });

        setTimeout(() => {
            generateOffers(newAnalysis.score);
            setStage('TANK_FLOOR');
            playSuccess();
        }, 3200);
    };

    const generateOffers = (score: number) => {
        const map: Record<string, Offer> = {};

        SESSION_JUDGES.forEach(judge => {
            const wantsIn = Math.random() * 100 < score + (Math.random() * 20);
            if (wantsIn) {
                const baseValuation = 50000 + (score * 1000);
                const val = Math.round((baseValuation * judge.maxValuationMultiplier) / 1000) * 1000;
                const eq = judge.minEquity + Math.floor(Math.random() * 10);
                
                map[judge.id] = {
                    judge,
                    valuation: Math.max(10000, val),
                    equity: Math.min(50, Math.max(5, eq)),
                    comment: score > 70 ? 'GREAT' : 'GOOD'
                };
            }
        });

        setOffersMap(map);
        const activeOffers = Object.values(map);

        if (activeOffers.length > 0) {
            const leadOffer = activeOffers[0];
            setTimeout(() => {
                TankJudgeVoiceEngine.speakOffer(leadOffer, isAr);
            }, 600);
        } else {
            setJudgeMessage(t('the_tank.feedback_poor', 'None of us see the potential. We are out.'));
            setTimeout(() => {
                TankJudgeVoiceEngine.speakRejection(SESSION_JUDGES[0], isAr);
            }, 400);
            setTimeout(() => setStage('REJECTED'), 4000);
        }
    };

    const handleSelectOffer = (offer: Offer) => {
        setSelectedOffer(offer);
        setCurrentValuation(offer.valuation);
        setCurrentEquity(offer.equity);
        setCounterValuation(offer.valuation);
        setCounterEquity(offer.equity);
        setJudgeMessage(t('the_tank.feedback_great', 'I like this business. Here is my offer.'));
        setNegotiationRound(0);
        setIsCountering(false);
        setStage('NEGOTIATION');

        const greeting = isAr
            ? `أهلاً بك في طاولة المفاوضات. عرضي لك هو ${offer.valuation.toLocaleString()} دولار مقابل ${offer.equity} بالمئة.`
            : `Welcome to negotiations. My starting deal is $${offer.valuation.toLocaleString()} for ${offer.equity}% equity.`;
        setTimeout(() => {
            TankJudgeVoiceEngine.speakAsJudge(offer.judge.id, greeting, isAr ? 'ar' : 'en');
        }, 300);
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
            setJudgeMessage(t('the_tank.judge_angry', 'You pushed too hard. I am OUT!'));
            setStage('REJECTED');
            playError();
            TankJudgeVoiceEngine.speakWalkAway(selectedOffer.judge.id, isAr);
            return;
        }

        if (result.accepted) {
            TankJudgeVoiceEngine.speakDealAccepted(selectedOffer.judge.id, isAr);
            completeDeal(counterValuation, counterEquity);
        } else if (result.counterOffer) {
            setCurrentValuation(result.counterOffer.valuation);
            setCurrentEquity(result.counterOffer.equity);
            setJudgeMessage(t('the_tank.judge_counter', 'I will not accept that, but I will meet you in the middle.'));
            setNegotiationRound(prev => prev + 1);
            setIsCountering(false);
            TankJudgeVoiceEngine.speakCounterResponse(selectedOffer.judge.id, isAr);
        }
    };

    const completeDeal = (val: number, eq: number) => {
        if (user) {
            updateUser(user.id, { ppTokens: (user.ppTokens || 0) + 500 });
        }
        setCurrentValuation(val);
        setCurrentEquity(eq);
        setStage('DEAL');
        playMoney();
        confetti({ particleCount: 160, spread: 100, origin: { y: 0.6 }, colors: ['#22c55e', '#eab308', '#38bdf8'] });
    };

    const formatStrength = (s: string) => {
        const key = `the_tank.analysis.${s}`;
        const val = t(key as any);
        if (val && val !== key && val !== s) return val;
        const map: Record<string, { ar: string; en: string }> = {
            mentioned_finance: { ar: 'ذكرت الجوانب المالية بوضوح (الأرباح، التكاليف، والأسعار).', en: 'You clearly highlighted finances (Profit, Cost & Pricing).' },
            clear_problem_solution: { ar: 'شرحت المشكلة وحلها الذكي بإتقان واحترافية.', en: 'You articulated a clear problem and compelling solution.' },
            mentioned_traction: { ar: 'تحدثت عن حجم الطلب، والمبيعات، والزبائن في السوق.', en: 'You highlighted customers, sales, and market demand.' },
        };
        return isAr ? (map[s]?.ar || s) : (map[s]?.en || s);
    };

    const formatWeakness = (w: string) => {
        const key = `the_tank.analysis.${w}`;
        const val = t(key as any);
        if (val && val !== key && val !== w) return val;
        const map: Record<string, { ar: string; en: string }> = {
            missing_finance: { ar: 'لم تذكر كيف تحقق الشركة الأرباح أو تكاليف منتجك.', en: 'You did not mention unit costs or how the business makes profit.' },
            missing_problem: { ar: 'لم توضح المشكلة الحقيقية التي يعاني منها الزبائن.', en: 'You did not clearly define the customer pain point.' },
        };
        return isAr ? (map[w]?.ar || w) : (map[w]?.en || w);
    };

    const formatTip = (tipKey?: string) => {
        const k = tipKey || 'tip_general';
        const key = `the_tank.tips.${k}`;
        const val = t(key as any);
        if (val && val !== key && val !== k && !val.startsWith('the_tank.tips')) return val;
        const map: Record<string, { ar: string; en: string }> = {
            tip_general: { ar: 'استمر في التدريب! الثقة والوضوح هما سر الفوز بأفضل الصفقات.', en: 'Keep practicing! Confidence and clarity win the best deals.' },
            tip_finance: { ar: 'المستثمرون يعشقون الأرقام! اذكر دائماً سعر البيع والتكلفة وهامش الربح.', en: 'Investors love numbers! Always mention unit price, cost, and margin.' },
            tip_market: { ar: 'من يشتري منتجك؟ اذكر سوقك المستهدف وحجم الطلب.', en: 'Who is buying your product? Mention your target market.' },
            tip_elaborate: { ar: 'حاول التحدث أكثر وتقديم تفاصيل إضافية لشرح فكرة مشروعك بحماس!', en: 'Try to speak a bit more and provide extra details about your venture!' },
            tip_keep_it_up: { ar: 'عرض متكامل ورائع! قدمت تفاصيل مقنعة وكافية للحكام.', en: 'Great pitch length and clarity! You gave solid details to the judges.' },
        };
        return isAr ? (map[k]?.ar || k) : (map[k]?.en || k);
    };

    const AnalysisCard = () => (
        <div className="bg-white dark:bg-slate-800/90 backdrop-blur-md rounded-3xl p-6 mt-6 max-w-xl mx-auto text-start border border-slate-200 dark:border-slate-700/80 shadow-xl dark:shadow-2xl transition-colors">
            <h3 className="flex items-center gap-2.5 text-xl font-black text-slate-900 dark:text-white mb-4">
                <BarChart3 className="text-cyan-600 dark:text-cyan-400" /> {t('the_tank.analysis_title', 'Pitch Analysis')}
            </h3>
            <div className="space-y-4">
                <div>
                    <h4 className="text-emerald-600 dark:text-emerald-400 font-extrabold mb-2 text-xs uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 size={16} /> {t('the_tank.analysis_good', 'Strengths')}
                    </h4>
                    <ul className="space-y-2">
                        {analysis?.strengths && analysis.strengths.length > 0 ? (
                            analysis.strengths.map((s, i) => (
                                <li key={i} className="flex items-start gap-2 text-slate-800 dark:text-slate-200 text-sm bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 px-3 py-2 rounded-xl">
                                    <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                                    <span>{formatStrength(s)}</span>
                                </li>
                            ))
                        ) : (
                            <li className="text-slate-500 dark:text-slate-400 text-xs italic">{t('the_tank.analysis_none', 'No specific strengths detected.')}</li>
                        )}
                    </ul>
                </div>
                {analysis?.weaknesses && analysis.weaknesses.length > 0 && (
                    <div>
                        <h4 className="text-rose-600 dark:text-rose-400 font-extrabold mb-2 text-xs uppercase tracking-wider flex items-center gap-1.5">
                            <AlertCircle size={16} /> {t('the_tank.analysis_bad', 'Weaknesses')}
                        </h4>
                        <ul className="space-y-2">
                            {analysis.weaknesses.map((w, i) => (
                                <li key={i} className="flex items-start gap-2 text-slate-800 dark:text-slate-200 text-sm bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40 px-3 py-2 rounded-xl">
                                    <AlertCircle size={16} className="text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                                    <span>{formatWeakness(w)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                <div className="bg-indigo-50 dark:bg-indigo-950/60 p-4 rounded-2xl border border-indigo-200 dark:border-indigo-800/60">
                    <h4 className="text-indigo-800 dark:text-indigo-300 font-bold mb-1.5 text-xs uppercase tracking-wider flex items-center gap-2">
                        <Lightbulb size={16} className="text-amber-500 dark:text-amber-400" /> {t('the_tank.analysis_tip', 'Pro Tip')}
                    </h4>
                    <p className="text-slate-700 dark:text-slate-200 text-sm italic">"{formatTip(analysis?.tips[0])}"</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="w-full h-full min-h-[700px] bg-slate-50 dark:bg-[#060a16] text-slate-900 dark:text-white flex flex-col relative overflow-hidden font-sans transition-colors duration-200">
            {/* Stage Ambient Lighting & Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-sky-50/70 via-slate-50 to-indigo-50/40 dark:from-blue-900/20 dark:via-[#060a16] dark:to-[#060a16] pointer-events-none" />
            <div className="absolute top-0 inset-x-0 h-96 bg-[radial-gradient(ellipse_at_top,_rgba(56,189,248,0.12),transparent_70%)] pointer-events-none" />
            
            {/* Subtle Stage Grid */}
            <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.03] bg-[radial-gradient(#0284c7_1px,transparent_1px)] dark:bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

            {/* Top Broadcast Bar */}
            <div className="relative z-30 flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-slate-950/80 backdrop-blur-md shadow-sm dark:shadow-none">
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/80 border border-red-300 dark:border-red-500/40 text-red-700 dark:text-red-300 text-xs font-black uppercase tracking-wider shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                        <span className="w-2 h-2 rounded-full bg-red-500 -ms-3" />
                        <Radio size={13} className="text-red-600 dark:text-red-400" />
                        <span>{isAr ? 'بث مباشر من العرين' : 'LIVE STUDIO RECORDING'}</span>
                    </div>
                    <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-300 text-xs font-bold">
                        <Trophy size={13} className="text-amber-500 dark:text-amber-400" />
                        {isAr ? 'الموسم الرابع: عرين المستثمرين' : 'Season 4: The Tank Arena'}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={toggleVoice}
                        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm backdrop-blur-md cursor-pointer ${
                            isVoiceEnabled
                                ? 'bg-blue-600 hover:bg-blue-500 text-white border border-blue-400/50 shadow-blue-500/20'
                                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                        }`}
                        title={isVoiceEnabled ? 'Judge voice active' : 'Judge voice muted'}
                    >
                        {isVoiceEnabled ? <Volume2 size={15} className="text-white" /> : <VolumeX size={15} />}
                        <span>{isVoiceEnabled ? (isAr ? 'صوت الحكام مفعل' : 'Judge Voice ON') : (isAr ? 'صوت مكتوم' : 'Voice Muted')}</span>
                    </button>
                </div>
            </div>

            {/* Main Stage Viewport */}
            <div className="flex-1 p-3 sm:p-5 md:p-6 flex flex-col items-center justify-start relative z-10 w-full max-w-6xl mx-auto overflow-y-auto no-scrollbar">
                <AnimatePresence mode='wait'>
                    
                    {/* ─────────────────────────────────────────────────────────────
                        STAGE: PREP (The Entrance to The Tank)
                       ───────────────────────────────────────────────────────────── */}
                    {stage === 'PREP' && (
                        <motion.div 
                            key="prep" 
                            initial={{ opacity: 0, y: 15 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            exit={{ opacity: 0, scale: 0.96 }} 
                            className="w-full flex flex-col items-center max-w-5xl"
                        >
                            {/* Cinematic Hero Card: Unobstructed 16:9 Artwork + Clean Header Below */}
                            <div className="w-full rounded-3xl overflow-hidden relative border border-slate-200/90 dark:border-blue-500/30 shadow-lg dark:shadow-[0_20px_60px_rgba(15,23,42,0.8)] mb-6 sm:mb-8 bg-white dark:bg-slate-900 transition-all">
                                <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] max-h-72 sm:max-h-80 overflow-hidden bg-slate-950">
                                    <img 
                                        src="/images/tank/tank_judges_panel.jpg" 
                                        alt="The Tank Judges Panel with Ollie and Friends" 
                                        className="w-full h-full object-cover object-center filter contrast-[1.05] hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute top-3 start-3">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 border border-white/20 text-amber-300 text-[11px] sm:text-xs font-black uppercase tracking-wider backdrop-blur-md shadow-md">
                                            <Sparkles size={13} className="text-amber-400" />
                                            {isAr ? 'منصة رواد الأعمال والشركات الناشئة' : 'Young Mogul Pitch Stage'}
                                        </span>
                                    </div>
                                </div>

                                {/* Clean Header Info Plaque Below Image */}
                                <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-start">
                                    <div>
                                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                                            {t('the_tank.title', 'The Tank')}
                                        </h1>
                                        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1 font-medium leading-relaxed">
                                            {t('the_tank.subtitle', 'Pitch your business to 3 hungry investors.')}
                                        </p>
                                    </div>
                                </div>

                                {/* Quick Arena Highlights */}
                                <div className="grid grid-cols-3 divide-x divide-slate-200 dark:divide-slate-800 bg-slate-50/90 dark:bg-slate-950/70 border-t border-slate-200 dark:border-slate-800 p-3 text-center text-xs font-bold text-slate-700 dark:text-slate-300">
                                    <div className="py-1">
                                        <span className="block text-amber-500 dark:text-amber-400 text-base sm:text-lg font-black">5</span>
                                        <span className="text-[11px] text-slate-500 dark:text-slate-400">{isAr ? 'حكام خبراء' : 'Mogul Mentors'}</span>
                                    </div>
                                    <div className="py-1">
                                        <span className="block text-emerald-600 dark:text-emerald-400 text-base sm:text-lg font-black">$250,000</span>
                                        <span className="text-[11px] text-slate-500 dark:text-slate-400">{isAr ? 'أعلى عرض تمويل' : 'Max Valuation'}</span>
                                    </div>
                                    <div className="py-1">
                                        <span className="block text-cyan-600 dark:text-cyan-400 text-base sm:text-lg font-black">+500 PP</span>
                                        <span className="text-[11px] text-slate-500 dark:text-slate-400">{isAr ? 'مكافأة إبرام الصفقة' : 'Deal Reward'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* The 5 Judges Panel Showcase */}
                            <div className="w-full bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 mb-6 sm:mb-8 backdrop-blur-md shadow-lg dark:shadow-xl">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4 sm:mb-5">
                                    <div>
                                        <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                                            <Award className="text-cyan-600 dark:text-cyan-400" />
                                            {isAr ? 'لجنة حكام العرين (أصدقاء أولي)' : 'Meet The Tank Judges (Ollie & Friends)'}
                                        </h2>
                                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                                            {isAr 
                                                ? 'سيحضر 3 حكام عشوائيين في جلستك للاستماع لعرضك وتقديم عروض التمويل!'
                                                : '3 random judges will take the executive seats to review your pitch today!'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 self-start sm:self-auto">
                                        <span className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 font-medium">
                                            {isAr ? 'اضغط على الحَكَم لسماع نصيحته' : 'Click a judge to hear their strategy'}
                                        </span>
                                    </div>
                                </div>

                                {/* 5 Judge Cards (Scrollable VIP Carousel on Mobile, 5 Columns on Desktop) */}
                                <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-5 gap-3.5 overflow-x-auto pb-4 pt-1 px-1 snap-x no-scrollbar">
                                    {JUDGES.map((judge) => {
                                        const bio = getJudgeBio(judge.id, isAr);
                                        const isSelected = previewJudgeId === judge.id;
                                        const isSpeaking = voiceState.activeJudgeId === judge.id && voiceState.isSpeaking;
                                        const themeRing = getJudgeThemeRing(judge.id);

                                        return (
                                            <motion.button
                                                key={judge.id}
                                                whileHover={{ scale: 1.03 }}
                                                whileTap={{ scale: 0.97 }}
                                                type="button"
                                                onClick={() => {
                                                    setPreviewJudgeId(judge.id);
                                                    if (isVoiceEnabled) {
                                                        const quote = isAr 
                                                            ? `أنا هنا في العرين لأستثمر في أفضل فكرة عمل!`
                                                            : `I am looking for a brilliant young founder to back!`;
                                                        TankJudgeVoiceEngine.speakAsJudge(judge.id, quote, isAr ? 'ar' : 'en');
                                                    }
                                                }}
                                                className={`text-start rounded-2xl p-3.5 border-2 transition-all relative flex flex-col items-center text-center overflow-hidden w-44 sm:w-auto shrink-0 snap-start cursor-pointer ${
                                                    isSelected
                                                        ? 'bg-blue-50/80 dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-900 border-cyan-500 shadow-md dark:shadow-[0_0_20px_rgba(6,182,212,0.3)] ring-2 ring-cyan-500/40'
                                                        : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm'
                                                }`}
                                            >
                                                <div className="relative mb-2.5">
                                                    <img 
                                                        src={getJudgeAvatar(judge)} 
                                                        alt={judge.id} 
                                                        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shadow-md border-2 ${themeRing}`}
                                                    />
                                                    {isSpeaking && (
                                                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow animate-pulse">
                                                            {isAr ? 'يتحدث' : 'Speaking'}
                                                        </span>
                                                    )}
                                                </div>

                                                <span className="text-sm font-black text-slate-900 dark:text-white truncate max-w-full">
                                                    {t(judge.nameKey as any, judge.nameKey.replace('tank.', ''))}
                                                </span>
                                                <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider mt-0.5">
                                                    {t(judge.styleKey as any, judge.styleKey.replace('tank.', ''))}
                                                </span>
                                                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-tight">
                                                    {bio.lookingFor}
                                                </span>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Ollie's Golden Rules Pre-Pitch Advice */}
                            <div className="w-full bg-gradient-to-r from-amber-50 via-white to-blue-50/40 dark:from-amber-950/40 dark:via-slate-900 dark:to-blue-950/40 border-2 border-amber-300 dark:border-amber-500/30 rounded-3xl p-5 mb-8 flex flex-col sm:flex-row items-center gap-4 shadow-md dark:shadow-lg">
                                <div className="relative shrink-0">
                                    <img 
                                        src="/images/characters_clean/ollie_idle.png" 
                                        alt="Ollie the Owl Coach" 
                                        className="w-20 h-20 object-contain drop-shadow-md"
                                    />
                                    <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-black text-[10px] px-1.5 py-0.5 rounded-full shadow">
                                        COACH
                                    </span>
                                </div>
                                <div className="flex-1 text-center sm:text-start">
                                    <h3 className="text-base font-black text-amber-800 dark:text-amber-300 mb-1 flex items-center justify-center sm:justify-start gap-1.5">
                                        <Lightbulb size={16} className="text-amber-600 dark:text-amber-400" />
                                        {isAr ? 'نصيحة أولي الذهبية قبل الصعود للمسرح:' : "Ollie's Golden Pitch Rules:"}
                                    </h3>
                                    <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                        {isAr 
                                            ? 'الحكام لا يستثمرون في الأفكار المبهمة! اذكر بوضوح: المشكلة، حلك الذكي، كم تبيع منتجك، وكم تكلفته، والتمويل الذي تريده.'
                                            : 'Judges back clarity, not just ideas! Mention your customer problem, your solution, unit price, and revenue.'}
                                    </p>
                                </div>
                            </div>

                            {/* Primary Step-in CTA */}
                            <motion.button 
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => setStage('PITCH')} 
                                className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 hover:from-blue-500 hover:to-cyan-400 text-white text-xl font-black py-4.5 px-14 rounded-full shadow-[0_10px_30px_rgba(6,182,212,0.4)] transition-all flex items-center gap-3 group border border-cyan-300/40 cursor-pointer mb-16 sm:mb-8"
                            >
                                <span>{t('the_tank.action_ready', 'Step Into The Tank')}</span>
                                <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        </motion.div>
                    )}

                    {/* ─────────────────────────────────────────────────────────────
                        STAGE: PITCH (On Stage Live Presentation)
                       ───────────────────────────────────────────────────────────── */}
                    {stage === 'PITCH' && (
                        <motion.div 
                            key="pitch" 
                            initial={{ opacity: 0, scale: 0.97 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            exit={{ opacity: 0, scale: 0.97 }} 
                            className="w-full max-w-3xl flex flex-col items-center"
                        >
                            {/* Stage Header */}
                            <div className="text-center mb-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-500/10 border border-blue-300 dark:border-blue-400/30 text-blue-700 dark:text-cyan-300 text-xs font-black uppercase tracking-wider mb-2">
                                    <Mic size={14} className="text-blue-600 dark:text-cyan-400" />
                                    {isAr ? 'أنت الآن في بؤرة الضوء' : 'Spotlight On You'}
                                </div>
                                <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">
                                    {t('the_tank.stage_pitch_title', 'Your Pitch')}
                                </h2>
                                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                                    {t('the_tank.stage_pitch_subtitle', 'Explain your product, traction, and what you are asking for.')}
                                </p>

                                {validationError && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: -10 }} 
                                        animate={{ opacity: 1, y: 0 }} 
                                        className="bg-red-50 dark:bg-red-500/20 border border-red-300 dark:border-red-500 text-red-700 dark:text-red-200 px-4 py-3 rounded-2xl mt-4 flex items-center gap-2 justify-center mx-auto max-w-lg shadow-md"
                                    >
                                        <AlertCircle size={20} className="shrink-0 text-red-500 dark:text-red-400" />
                                        <span className="font-bold text-sm">{validationError}</span>
                                    </motion.div>
                                )}
                            </div>

                            {/* Real-time Checklist Chips */}
                            <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                                <div className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                                    detectedKeywords.hasFinance
                                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 shadow-sm'
                                }`}>
                                    <Check size={14} className={detectedKeywords.hasFinance ? 'text-emerald-500 dark:text-emerald-400' : 'opacity-20'} />
                                    <span>{isAr ? '💰 الأرقام والربح' : '💰 Profit & Cost'}</span>
                                </div>
                                <div className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                                    detectedKeywords.hasProblem
                                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 shadow-sm'
                                }`}>
                                    <Check size={14} className={detectedKeywords.hasProblem ? 'text-emerald-500 dark:text-emerald-400' : 'opacity-20'} />
                                    <span>{isAr ? '🎯 المشكلة' : '🎯 Problem'}</span>
                                </div>
                                <div className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                                    detectedKeywords.hasSolution
                                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 shadow-sm'
                                }`}>
                                    <Check size={14} className={detectedKeywords.hasSolution ? 'text-emerald-500 dark:text-emerald-400' : 'opacity-20'} />
                                    <span>{isAr ? '💡 الحل والمنتج' : '💡 Solution'}</span>
                                </div>
                                <div className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                                    detectedKeywords.hasCustomers
                                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 shadow-sm'
                                }`}>
                                    <Check size={14} className={detectedKeywords.hasCustomers ? 'text-emerald-500 dark:text-emerald-400' : 'opacity-20'} />
                                    <span>{isAr ? '👥 الزبائن والسوق' : '👥 Customers'}</span>
                                </div>
                            </div>

                            {/* Pitch Input Box */}
                            <div className="w-full relative mb-6">
                                <textarea 
                                    value={transcript} 
                                    onChange={(e) => setTranscript(e.target.value)} 
                                    placeholder={t('the_tank.placeholder', 'Start typing or use the microphone to pitch...')} 
                                    className="w-full h-64 bg-white dark:bg-slate-900/90 text-slate-900 dark:text-white p-6 rounded-3xl text-lg resize-none focus:outline-none focus:ring-4 focus:ring-cyan-500/30 border-2 border-slate-300 dark:border-slate-700 shadow-lg dark:shadow-2xl leading-relaxed placeholder-slate-400 dark:placeholder-slate-500 font-sans" 
                                />

                                {/* Voice Dictation Button */}
                                {'webkitSpeechRecognition' in window || 'SpeechRecognition' in window ? (
                                    <button 
                                        type="button"
                                        onClick={toggleRecording} 
                                        className={`absolute bottom-6 end-6 p-4 rounded-2xl transition-all shadow-xl flex items-center gap-2 text-white font-bold cursor-pointer ${
                                            isRecording 
                                                ? 'bg-rose-600 hover:bg-rose-500 ring-4 ring-rose-500/50 animate-pulse' 
                                                : 'bg-cyan-600 hover:bg-cyan-500'
                                        }`}
                                        title={isRecording ? 'Stop Recording' : 'Start Speech Dictation'}
                                    >
                                        {isRecording ? (
                                            <>
                                                <div className="h-4 w-4 bg-white rounded-sm" />
                                                <span className="text-xs">{isAr ? 'إيقاف' : 'Stop'}</span>
                                            </>
                                        ) : (
                                            <>
                                                <Mic size={22} />
                                                <span className="text-xs">{isAr ? 'تحدث صوتياً' : 'Speak'}</span>
                                            </>
                                        )}
                                    </button>
                                ) : null}
                            </div>

                            {/* Action Submission */}
                            <button 
                                onClick={handleFinishPitch} 
                                disabled={transcript.length < 10} 
                                className="w-full bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-600 hover:from-emerald-500 hover:to-green-400 disabled:from-slate-200 disabled:to-slate-200 dark:disabled:from-slate-800 dark:disabled:to-slate-800 disabled:text-slate-400 dark:disabled:text-slate-500 text-white text-xl font-black py-4 rounded-2xl shadow-[0_6px_0_0_rgba(5,150,105,1)] disabled:shadow-none hover:shadow-none hover:translate-y-1 transition-all cursor-pointer"
                            >
                                {t('the_tank.action_submit', 'Finish Pitch')}
                            </button>
                        </motion.div>
                    )}

                    {/* ─────────────────────────────────────────────────────────────
                        STAGE: THINKING (Judges Deliberating)
                       ───────────────────────────────────────────────────────────── */}
                    {stage === 'THINKING' && (
                        <motion.div 
                            key="thinking" 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }} 
                            className="text-center py-12 flex flex-col items-center w-full max-w-2xl"
                        >
                            {/* The 3 Judges Thinking Head-Cards */}
                            <div className="flex justify-center items-center gap-4 sm:gap-6 mb-8">
                                {SESSION_JUDGES.map((judge, i) => (
                                    <motion.div 
                                        key={judge.id} 
                                        animate={{ y: [0, -18, 0] }} 
                                        transition={{ repeat: Infinity, delay: i * 0.25, duration: 1.2, ease: 'easeInOut' }}
                                        className="flex flex-col items-center"
                                    >
                                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-3 border-cyan-500 shadow-[0_0_25px_rgba(6,182,212,0.4)] relative">
                                            <img 
                                                src={getJudgeAvatar(judge)} 
                                                alt={judge.id} 
                                                className="w-full h-full object-cover" 
                                            />
                                            <div className="absolute inset-0 bg-cyan-500/10" />
                                        </div>
                                        <span className="text-xs font-black text-slate-900 dark:text-white mt-2">
                                            {t(judge.nameKey as any, judge.nameKey.replace('tank.', ''))}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-100 dark:bg-cyan-950/80 border border-cyan-300 dark:border-cyan-500/50 text-cyan-800 dark:text-cyan-300 text-xs font-black uppercase tracking-wider mb-3 animate-pulse">
                                <Sparkles size={14} className="text-cyan-600 dark:text-cyan-400" />
                                {isAr ? 'جلسة تشاور مغلقة بين الحكام' : 'Private Investor Deliberation'}
                            </div>

                            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                                {t('the_tank.thinking_1', 'The Judges are deliberating...')}
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 max-w-md">
                                {isAr 
                                    ? 'يقوم الحكام الآن بحساب التقييم، وفحص هامش الربح، وتحديد ما إذا كان المشروع يستحق الاستثمار!'
                                    : 'Reviewing your unit economics, customer traction, and implied valuation!'}
                            </p>
                        </motion.div>
                    )}

                    {/* ─────────────────────────────────────────────────────────────
                        STAGE: TANK_FLOOR (The Offers on the Table)
                       ───────────────────────────────────────────────────────────── */}
                    {stage === 'TANK_FLOOR' && (
                        <motion.div 
                            key="floor" 
                            initial={{ opacity: 0, y: 20 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            exit={{ opacity: 0 }} 
                            className="w-full text-center"
                        >
                            <div className="mb-8">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-xs font-black uppercase tracking-wider mb-2">
                                    <Award size={14} className="text-emerald-600 dark:text-emerald-400" />
                                    {isAr ? 'قرارات الحكام الرسمية' : 'Official Investment Verdict'}
                                </div>
                                <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-1">
                                    {t('the_tank.floor_title', 'The Judges Respond')}
                                </h2>
                                <p className="text-slate-600 dark:text-slate-400 text-sm">
                                    {t('the_tank.floor_desc', 'Select an offer to negotiate, or walk away.')}
                                </p>
                            </div>

                            {/* 3 Judges Live Offer Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                                {SESSION_JUDGES.map((judge, idx) => {
                                    const offer = offersMap[judge.id];
                                    const isOut = !offer;
                                    const isSpeakingThisJudge = voiceState.activeJudgeId === judge.id && voiceState.isSpeaking;

                                    return (
                                        <motion.div 
                                            key={judge.id} 
                                            initial={{ opacity: 0, y: 30 }} 
                                            animate={{ opacity: 1, y: 0 }} 
                                            transition={{ delay: idx * 0.2 }}
                                            className={`rounded-3xl p-6 shadow-lg dark:shadow-2xl relative overflow-hidden flex flex-col items-center transition-all ${
                                                isOut
                                                    ? 'bg-slate-100 dark:bg-slate-900/90 border-2 border-slate-200 dark:border-slate-800 opacity-60 grayscale'
                                                    : isSpeakingThisJudge
                                                    ? 'bg-white dark:bg-slate-900 border-2 border-cyan-500 ring-4 ring-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:scale-[1.02] cursor-pointer'
                                                    : 'bg-white dark:bg-slate-900/95 border-2 border-slate-200 dark:border-slate-700/80 hover:border-cyan-500/60 hover:scale-[1.02] cursor-pointer'
                                            }`}
                                            onClick={() => !isOut && offer && handleSelectOffer(offer)}
                                        >
                                            {/* Colored Top Banner */}
                                            {!isOut && <div className={`absolute top-0 inset-x-0 h-2.5 ${judge.color || 'bg-blue-600'}`} />}

                                            {/* Judge Portrait Avatar */}
                                            <div className="relative mb-3 mt-1">
                                                <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-600 shadow-md">
                                                    <img 
                                                        src={getJudgeAvatar(judge)} 
                                                        alt={judge.id} 
                                                        className="w-full h-full object-cover" 
                                                    />
                                                </div>
                                                {isSpeakingThisJudge && (
                                                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow">
                                                        {isAr ? 'يتحدث' : 'Speaking'}
                                                    </span>
                                                )}
                                            </div>
                                            
                                            <h3 className={`font-black text-xl mb-0.5 ${isOut ? 'text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                                                {t(judge.nameKey as any, judge.nameKey.replace('tank.', ''))}
                                            </h3>
                                            <p className={`text-[11px] font-bold uppercase tracking-wider mb-4 ${isOut ? 'text-slate-400 dark:text-slate-500' : 'text-cyan-600 dark:text-cyan-400'}`}>
                                                {t(judge.styleKey as any, judge.styleKey.replace('tank.', ''))}
                                            </p>

                                            {/* Speaking Waveform Animation */}
                                            {isSpeakingThisJudge && (
                                                <div className="flex items-center gap-1.5 mb-3 bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-500/40 px-3 py-1 rounded-full">
                                                    <Volume2 size={13} className="text-cyan-600 dark:text-cyan-400 animate-pulse" />
                                                    <div className="flex items-end gap-1 h-3.5">
                                                        <motion.div animate={{ height: ['4px', '14px', '6px'] }} transition={{ repeat: Infinity, duration: 0.35 }} className="w-1 bg-cyan-500 rounded-full" />
                                                        <motion.div animate={{ height: ['8px', '14px', '4px'] }} transition={{ repeat: Infinity, duration: 0.4, delay: 0.1 }} className="w-1 bg-blue-500 rounded-full" />
                                                        <motion.div animate={{ height: ['12px', '4px', '14px'] }} transition={{ repeat: Infinity, duration: 0.45, delay: 0.05 }} className="w-1 bg-indigo-500 rounded-full" />
                                                        <motion.div animate={{ height: ['5px', '12px', '7px'] }} transition={{ repeat: Infinity, duration: 0.38, delay: 0.15 }} className="w-1 bg-cyan-400 rounded-full" />
                                                    </div>
                                                </div>
                                            )}

                                            {isOut ? (
                                                <div className="bg-rose-50 dark:bg-slate-950 rounded-2xl p-4 w-full border border-rose-200 dark:border-slate-800">
                                                    <div className="text-xl font-black text-rose-600 dark:text-rose-500 tracking-wider">
                                                        {isAr ? 'أنا منسحب! (I\'M OUT)' : "I'm Out."}
                                                    </div>
                                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                                                        {isAr ? 'المشروع لا يطابق شروط المحفظة الاستثمارية' : 'Valuation risk is too high'}
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-4 w-full border border-slate-200 dark:border-slate-800 flex flex-col items-center">
                                                    <div className="text-[10px] uppercase font-black text-slate-500 dark:text-slate-400 tracking-wider mb-1">
                                                        {isAr ? 'عرض الاستثمار' : 'Offer On Table'}
                                                    </div>
                                                    <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mb-1">
                                                        ${offer.valuation.toLocaleString()}
                                                    </div>
                                                    <div className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                                                        {isAr ? `مقابل ${offer.equity}% حصة` : `for ${offer.equity}% Equity`}
                                                    </div>
                                                    
                                                    <div className="flex gap-2 w-full">
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                TankJudgeVoiceEngine.speakOffer(offer, isAr);
                                                            }}
                                                            className="flex-1 text-xs text-cyan-700 dark:text-cyan-300 hover:text-cyan-900 dark:hover:text-white font-bold flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
                                                        >
                                                            <Volume2 size={13} />
                                                            <span>{isAr ? 'استمع' : 'Hear'}</span>
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => handleSelectOffer(offer)}
                                                            className="flex-2 text-xs text-white font-black flex items-center justify-center gap-1 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 shadow-md transition-colors cursor-pointer"
                                                        >
                                                            <span>{isAr ? 'تفاوض' : 'Negotiate'}</span>
                                                            <ChevronRight size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {Object.keys(offersMap).length > 0 && (
                                <button 
                                    onClick={() => { setStage('REJECTED'); setJudgeMessage(isAr ? "قررت الانسحاب من كافة العروض المقترحة." : "You walked away from all offers."); }} 
                                    className="mt-10 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 font-bold text-sm underline transition-colors cursor-pointer"
                                >
                                    {isAr ? 'الانسحاب ورفض كافة العروض' : 'Walk Away from All Offers'}
                                </button>
                            )}
                        </motion.div>
                    )}

                    {/* ─────────────────────────────────────────────────────────────
                        STAGE: NEGOTIATION (The Deal Table)
                       ───────────────────────────────────────────────────────────── */}
                    {stage === 'NEGOTIATION' && selectedOffer && (
                        <motion.div 
                            key="negotiation" 
                            initial={{ opacity: 0, scale: 0.96 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            exit={{ opacity: 0 }} 
                            className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-3xl p-6 md:p-8 shadow-2xl max-w-xl mx-auto relative overflow-hidden w-full transition-colors"
                        >
                            {!isCountering ? (
                                <>
                                    <button 
                                        onClick={() => setStage('TANK_FLOOR')} 
                                        className="absolute top-6 start-6 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 text-xs font-bold bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full cursor-pointer border border-slate-200 dark:border-slate-700"
                                    >
                                        <ArrowRight className="rotate-180" size={16} />
                                        <span>{isAr ? 'رجوع' : 'Back'}</span>
                                    </button>

                                    <div className="flex flex-col items-center mb-6 mt-4">
                                        <div className="relative mb-3">
                                            <div className="w-24 h-24 rounded-2xl overflow-hidden border-3 border-cyan-500 shadow-xl">
                                                <img 
                                                    src={getJudgeAvatar(selectedOffer.judge)} 
                                                    alt={selectedOffer.judge.id} 
                                                    className="w-full h-full object-cover" 
                                                />
                                            </div>
                                            {voiceState.activeJudgeId === selectedOffer.judge.id && voiceState.isSpeaking && (
                                                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow animate-pulse">
                                                    Speaking
                                                </span>
                                            )}
                                        </div>

                                        <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                                            {t(selectedOffer.judge.nameKey as any, selectedOffer.judge.nameKey.replace('tank.', ''))}
                                        </h2>
                                        <p className="text-xs text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-wider">
                                            {t(selectedOffer.judge.styleKey as any, selectedOffer.judge.styleKey.replace('tank.', ''))}
                                        </p>
                                        
                                        {/* Negotiation Judge Waveform */}
                                        {voiceState.activeJudgeId === selectedOffer.judge.id && voiceState.isSpeaking && (
                                            <div className="flex items-center gap-1.5 my-2.5 bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-500/40 px-3 py-1 rounded-full">
                                                <Volume2 size={13} className="text-cyan-600 dark:text-cyan-400 animate-pulse" />
                                                <div className="flex items-end gap-1 h-3.5">
                                                    <motion.div animate={{ height: ['4px', '14px', '6px'] }} transition={{ repeat: Infinity, duration: 0.35 }} className="w-1 bg-cyan-500 rounded-full" />
                                                    <motion.div animate={{ height: ['8px', '14px', '4px'] }} transition={{ repeat: Infinity, duration: 0.4, delay: 0.1 }} className="w-1 bg-blue-500 rounded-full" />
                                                    <motion.div animate={{ height: ['12px', '4px', '14px'] }} transition={{ repeat: Infinity, duration: 0.45, delay: 0.05 }} className="w-1 bg-indigo-500 rounded-full" />
                                                    <motion.div animate={{ height: ['5px', '12px', '7px'] }} transition={{ repeat: Infinity, duration: 0.38, delay: 0.15 }} className="w-1 bg-cyan-400 rounded-full" />
                                                </div>
                                            </div>
                                        )}

                                        {/* Current Offer Badge */}
                                        <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-5 mt-4 w-full text-center relative border border-slate-200 dark:border-slate-800 shadow-inner">
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-600 px-3 py-0.5 rounded-full text-[10px] font-black text-white uppercase tracking-wider shadow">
                                                {t('the_tank.label_offer', 'Current Offer')}
                                            </div>
                                            <div className="text-4xl md:text-5xl font-black text-emerald-600 dark:text-emerald-400 mb-1">
                                                ${currentValuation.toLocaleString()}
                                            </div>
                                            <div className="text-lg font-bold text-slate-700 dark:text-slate-300">
                                                {isAr ? `مقابل ${currentEquity}% حصة` : `for ${currentEquity}% Equity`}
                                            </div>
                                            
                                            {/* Implied Valuation calculation */}
                                            {currentEquity > 0 && (
                                                <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                                                    {isAr 
                                                        ? `القيمة الإجمالية للشركة: $${Math.round(currentValuation / (currentEquity / 100)).toLocaleString()}`
                                                        : `Implied Valuation: $${Math.round(currentValuation / (currentEquity / 100)).toLocaleString()}`}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col gap-3 mt-6">
                                        <button 
                                            onClick={() => completeDeal(currentValuation, currentEquity)} 
                                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg py-4 rounded-2xl shadow-[0_4px_0_0_rgba(5,150,105,1)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
                                        >
                                            <ThumbsUp size={20} /> 
                                            <span>{t('the_tank.action_deal', 'Accept Deal')}</span>
                                        </button>

                                        <div className="flex gap-3">
                                            <button 
                                                onClick={() => setIsCountering(true)} 
                                                className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3.5 rounded-xl shadow-md cursor-pointer transition-colors"
                                            > 
                                                {t('the_tank.action_counter', 'Counter Offer')} 
                                            </button>
                                            <button 
                                                onClick={() => { setStage('TANK_FLOOR'); setSelectedOffer(null); }} 
                                                className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 cursor-pointer transition-colors"
                                            > 
                                                {t('the_tank.action_walk', 'Back out')} 
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <button 
                                        onClick={() => setIsCountering(false)} 
                                        className="absolute top-6 start-6 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 text-xs font-bold bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full cursor-pointer border border-slate-200 dark:border-slate-700"
                                    >
                                        <ArrowRight className="rotate-180" size={16} />
                                        <span>{isAr ? 'رجوع' : 'Back'}</span>
                                    </button>

                                    <h2 className="text-2xl font-black text-center mb-6 mt-4 text-slate-900 dark:text-white">
                                        {t('the_tank.counter_title', 'Make a Counter')}
                                    </h2>

                                    {/* Slider Controls */}
                                    <div className="space-y-6 mb-8">
                                        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                                            <div className="flex justify-between items-center mb-2 font-bold text-slate-700 dark:text-slate-300">
                                                <span className="flex items-center gap-1.5 text-sm">
                                                    <DollarSign size={18} className="text-emerald-600 dark:text-emerald-400" /> 
                                                    {isAr ? 'التقييم المطلوب' : 'Valuation Ask'}
                                                </span>
                                                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                                                    ${counterValuation.toLocaleString()}
                                                </span>
                                            </div>
                                            <input 
                                                type="range" 
                                                min={10000} 
                                                max={250000} 
                                                step={5000} 
                                                value={counterValuation} 
                                                onChange={(e) => setCounterValuation(Number(e.target.value))} 
                                                className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500" 
                                            />
                                        </div>

                                        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                                            <div className="flex justify-between items-center mb-2 font-bold text-slate-700 dark:text-slate-300">
                                                <span className="flex items-center gap-1.5 text-sm">
                                                    <Percent size={18} className="text-cyan-600 dark:text-cyan-400" /> 
                                                    {isAr ? 'الحصة المعطاة' : 'Equity Given'}
                                                </span>
                                                <span className="text-2xl font-black text-cyan-600 dark:text-cyan-400">
                                                    {counterEquity}%
                                                </span>
                                            </div>
                                            <input 
                                                type="range" 
                                                min={1} 
                                                max={50} 
                                                step={1} 
                                                value={counterEquity} 
                                                onChange={(e) => setCounterEquity(Number(e.target.value))} 
                                                className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500" 
                                            />
                                        </div>
                                    </div>

                                    <button 
                                        onClick={submitCounter} 
                                        className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xl py-4 rounded-2xl shadow-[0_4px_0_0_rgba(8,145,178,1)] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
                                    > 
                                        {t('the_tank.action_submit_counter', 'Propose Counter')} 
                                    </button>
                                </>
                            )}
                        </motion.div>
                    )}

                    {/* ─────────────────────────────────────────────────────────────
                        STAGE: DEAL (Victory & Investment Celebration)
                       ───────────────────────────────────────────────────────────── */}
                    {stage === 'DEAL' && (
                        <motion.div 
                            key="deal" 
                            initial={{ opacity: 0, scale: 0.92 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            className="text-center w-full max-w-3xl flex flex-col items-center"
                        >
                            {/* Joyful Celebration Artwork */}
                            <div className="w-full rounded-3xl overflow-hidden relative border-2 border-emerald-500/50 shadow-2xl mb-6 bg-slate-900">
                                <img 
                                    src="/images/tank/tank_deal_victory.jpg" 
                                    alt="Deal Closed Victory" 
                                    className="w-full h-64 md:h-72 object-cover" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                                
                                <div className="absolute bottom-4 inset-x-0 p-4">
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-xs font-black uppercase tracking-wider mb-1 backdrop-blur-md">
                                        <Trophy size={14} className="text-amber-400" />
                                        {isAr ? 'تم توقيع الصفقة رسمياً!' : 'DEAL SIGNED!'}
                                    </div>
                                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
                                        {t('the_tank.deal_title', 'Deal Closed!')}
                                    </h1>
                                </div>
                            </div>

                            {/* Investment Summary Pill */}
                            <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-emerald-500/30 rounded-2xl px-6 py-4 flex items-center justify-center gap-6 shadow-xl mb-4 w-full max-w-md">
                                <div>
                                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block uppercase">{isAr ? 'التقييم' : 'Valuation'}</span>
                                    <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">${currentValuation.toLocaleString()}</span>
                                </div>
                                <div className="w-px h-10 bg-slate-200 dark:bg-slate-800" />
                                <div>
                                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block uppercase">{isAr ? 'الحصة' : 'Equity'}</span>
                                    <span className="text-3xl font-black text-cyan-600 dark:text-cyan-400">{currentEquity}%</span>
                                </div>
                                <div className="w-px h-10 bg-slate-200 dark:bg-slate-800" />
                                <div>
                                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block uppercase">{isAr ? 'مكافأتك' : 'Reward'}</span>
                                    <span className="text-3xl font-black text-amber-500 dark:text-amber-400">+500 PP</span>
                                </div>
                            </div>

                            <AnalysisCard />

                            <button 
                                onClick={() => setStage('PREP')} 
                                className="mt-8 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-lg font-black py-4 px-12 rounded-full shadow-lg transition-all cursor-pointer"
                            > 
                                {isAr ? 'تقديم فكرة مشروع أخرى' : 'Pitch Another Idea'} 
                            </button>
                        </motion.div>
                    )}

                    {/* ─────────────────────────────────────────────────────────────
                        STAGE: REJECTED (Backstage Coaching with Ollie)
                       ───────────────────────────────────────────────────────────── */}
                    {stage === 'REJECTED' && (
                        <motion.div 
                            key="rejected" 
                            initial={{ opacity: 0, scale: 0.92 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            className="text-center w-full max-w-3xl flex flex-col items-center"
                        >
                            {/* Backstage Coaching Artwork */}
                            <div className="w-full rounded-3xl overflow-hidden relative border-2 border-slate-200 dark:border-slate-700 shadow-2xl mb-6 bg-slate-900">
                                <img 
                                    src="/images/tank/tank_coaching_board.jpg" 
                                    alt="Backstage Coaching" 
                                    className="w-full h-64 md:h-72 object-cover" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                                
                                <div className="absolute bottom-4 inset-x-0 p-4">
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/50 text-rose-300 text-xs font-black uppercase tracking-wider mb-1 backdrop-blur-md">
                                        <XCircle size={14} className="text-rose-400" />
                                        {isAr ? 'جلسة تقييم وإعادة تخطيط' : 'Post-Pitch Debrief'}
                                    </div>
                                    <h1 className="text-3xl sm:text-4xl font-black text-white">
                                        {t('the_tank.rejected_title', 'No Deal.')}
                                    </h1>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 max-w-md mx-auto mb-4 text-slate-700 dark:text-slate-300 text-sm italic shadow-md">
                                "{judgeMessage || (isAr ? 'الفكرة تحتاج لتحديد التكاليف والأرباح بشكل أفضل.' : 'The business model needs clearer margins.')}"
                            </div>

                            {analysis && <AnalysisCard />}

                            <button 
                                onClick={() => { setStage('PREP'); setTranscript(''); }} 
                                className="mt-8 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white text-lg font-bold py-4 px-12 rounded-full shadow-md dark:shadow-lg transition-all cursor-pointer"
                            > 
                                {isAr ? 'العودة للتخطيط والمحاولة من جديد' : 'Back to Drawing Board'} 
                            </button>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
};

export default TheTankMode;
