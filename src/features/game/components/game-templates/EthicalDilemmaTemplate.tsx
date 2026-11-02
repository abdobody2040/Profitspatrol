import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, Heart, TrendingUp, ChevronRight, CheckCircle2 } from 'lucide-react';
import OllieBubble from '../../../../components/OllieBubble';
import { useOllieCommentary } from '../../../../hooks/useOllieCommentary';

interface Scenario {
    id: string;
    title: string;
    desc: string;
    options: {
        a: { text: string; profit: number; reputation: number; nextId?: string; feedback: string };
        b: { text: string; profit: number; reputation: number; nextId?: string; feedback: string };
    };
    caseStudy?: {
        company: string;
        text: string;
    };
}

// Fallback scenarios if not provided via config
const DEFAULT_SCENARIOS: Record<string, Scenario> = {
    '1': {
        id: '1',
        title: 'The Sourcing Dilemma',
        desc: 'You found a factory that produces your product for 50% less, but they have terrible working conditions and pay below minimum wage.',
        options: {
            a: {
                text: 'Use the cheap factory. We need higher profit margins to survive!',
                profit: 30,
                reputation: -25,
                nextId: '1_a_followup',
                feedback: 'Your profits surged, but a journalist is now investigating your supply chain.'
            },
            b: {
                text: 'Refuse. Pay more for the ethical factory. It\'s the right thing to do.',
                profit: -15,
                reputation: 20,
                nextId: '1_b_followup',
                feedback: 'Your margins are tight, but your workers are happy and safe.'
            }
        },
        caseStudy: {
            company: 'Nike (1990s)',
            text: 'Nike faced huge boycotts in the 90s due to sweatshop labor. They lost reputation and had to completely overhaul their supply chain to win back trust.'
        }
    },
    '1_a_followup': {
        id: '1_a_followup',
        title: 'The Exposé',
        desc: 'A news article went viral showing the terrible conditions at your cheap factory. Customers are boycotting your brand!',
        options: {
            a: {
                text: 'Deny everything and hire a PR firm to hide the truth.',
                profit: -10,
                reputation: -30,
                feedback: 'The cover-up made it worse! People hate being lied to.'
            },
            b: {
                text: 'Apologize publicly, fire the factory, and pay compensation.',
                profit: -25,
                reputation: 15,
                feedback: 'It cost a lot of money, but taking responsibility started to rebuild trust.'
            }
        }
    },
    '1_b_followup': {
        id: '1_b_followup',
        title: 'The Marketing Spin',
        desc: 'Since you chose the ethical factory, your costs are high. How do you market this to customers?',
        options: {
            a: {
                text: 'Launch a "100% Fair Trade" campaign. Charge a premium price.',
                profit: 20,
                reputation: 15,
                feedback: 'Customers were willing to pay more because they believed in your mission!'
            },
            b: {
                text: 'Keep it quiet and just absorb the cost to stay competitive.',
                profit: -10,
                reputation: 5,
                feedback: 'You survived, but missed a huge opportunity to build brand loyalty.'
            }
        },
        caseStudy: {
            company: 'Patagonia',
            text: 'Patagonia actively tells customers NOT to buy their jackets if they don\'t need them, to save the environment. This honesty actually increased their sales!'
        }
    }
};

const DEFAULT_SCENARIOS_AR: Record<string, Scenario> = {
    '1': {
        id: '1',
        title: 'معضلة اختيار المصنع والموردين',
        desc: 'وجدت مصنعاً ينتج بضاعتك بنصف التكلفة (أرباح ضخمة)، لكن ظروف العمل فيه سيئة للغاية والرواتب تحت خط الفقر.',
        options: {
            a: {
                text: 'التعاقد مع المصنع الرخيص: نحتاج لهامش ربح أعلى لننجح في البداية!',
                profit: 30,
                reputation: -25,
                nextId: '1_a_followup',
                feedback: 'ارتفعت أرباحك سريعاً، لكن صحفياً استقصائياً بدأ بالتحقيق في سلسلة توريدك!'
            },
            b: {
                text: 'رفض التعاقد: الدفع للمصنع الأخلاقي المسؤول هو القرار الصائب.',
                profit: -15,
                reputation: 20,
                nextId: '1_b_followup',
                feedback: 'هامش ربحك أقل، لكن عمالك ومجتمعك في أمان تام واحترام متبادل.'
            }
        },
        caseStudy: {
            company: 'شركة نايكي (التسعينيات)',
            text: 'واجهت نايكي مقاطعات عالمية واسعة بسبب ظروف العمل السيئة لدى مورديها، وخسرت سمعتها حتى قامت بإصلاح شامل لسلاسل التوريد.'
        }
    },
    '1_a_followup': {
        id: '1_a_followup',
        title: 'فضيحة التحقيق الصحفي',
        desc: 'انتشر تقرير صحفي مصور يوضح الظروف السيئة في مصنعك الرخيص، وبدأ الزبائن بمقاطعة منتجاتك!',
        options: {
            a: {
                text: 'إنكار كل شيء وتوظيف شركة علاقات عامة لإخفاء الحقيقة.',
                profit: -10,
                reputation: -30,
                feedback: 'محاولة التستر زادت الأمر سوءاً! الجمهور يكره الخداع والأكاذيب.'
            },
            b: {
                text: 'الاعتراف بالخطأ فوراً، وإنهاء التعاقد مع المصنع، وتعويض العمال.',
                profit: -25,
                reputation: 15,
                feedback: 'كلّف الأمر مبالغ كبيرة، لكن تحمل المسؤولية بصدق بدأ يستعيد ثقة الجمهور.'
            }
        }
    },
    '1_b_followup': {
        id: '1_b_followup',
        title: 'الحملة التسويقية الأخلاقية',
        desc: 'لأنك اخترت المصنع الأخلاقي، فإن تكلفة الإنتاج مرتفعة. كيف تسوّق هذا لزبائنك؟',
        options: {
            a: {
                text: 'إطلاق حملة "تجارة عادلة 100%" وبيع المنتج بسعر أعلى يعكس قيمته.',
                profit: 20,
                reputation: 15,
                feedback: 'دفع الزبائن بسعادة سعراً أعلى لأنهم آمنوا برسالتك وقيم شركتك النبيلة!'
            },
            b: {
                text: 'التزام الصمت وتحمل التكلفة الزائدة لمجاراة المنافسين.',
                profit: -10,
                reputation: 5,
                feedback: 'نجت شركتك، لكنك فوّت فرصة ذهبية لبناء ولاء عميق مع زبائنك.'
            }
        },
        caseStudy: {
            company: 'شركة باتاغونيا',
            text: 'أخبرت باتاغونيا زبائنها علناً ألا يشتروا ستراتها إلا إذا كانوا بحاجة حقيقية إليها حفاظاً على البيئة؛ فكانت النتيجة مضاعفة ثقة الناس ومبيعاتها!'
        }
    }
};

interface GameState {
    profit: number;
    reputation: number;
    history: string[]; // Track choices made
}

interface EthicalDilemmaTemplateProps {
    onComplete: (score: number, data: any) => void;
}

const EthicalDilemmaTemplate: React.FC<EthicalDilemmaTemplateProps> = ({ onComplete }) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language.startsWith('ar');
    const { currentMessage, isVisible, trigger, dismiss } = useOllieCommentary();

    const [currentScenarioId, setCurrentScenarioId] = useState('1');
    const [gameState, setGameState] = useState<GameState>({
        profit: 50,
        reputation: 50,
        history: []
    });
    const [showResult, setShowResult] = useState(false);
    const [lastChoice, setLastChoice] = useState<'a' | 'b' | null>(null);
    const [isGameOver, setIsGameOver] = useState(false);

    const scenarioPool = isRTL ? DEFAULT_SCENARIOS_AR : DEFAULT_SCENARIOS;
    const currentScenario = scenarioPool[currentScenarioId] || DEFAULT_SCENARIOS[currentScenarioId];

    const handleChoice = (choice: 'a' | 'b') => {
        const option = currentScenario.options[choice];

        setGameState(prev => ({
            ...prev,
            profit: Math.min(100, Math.max(0, prev.profit + option.profit)),
            reputation: Math.min(100, Math.max(0, prev.reputation + option.reputation)),
            history: [...prev.history, `${currentScenarioId}_${choice}`]
        }));

        setLastChoice(choice);
        setShowResult(true);

        if (option.reputation < 0) trigger('bad_decision');
        else trigger('good_decision');
    };

    const nextScenario = () => {
        const option = currentScenario.options[lastChoice!];
        setLastChoice(null);
        setShowResult(false);

        if (option.nextId && (DEFAULT_SCENARIOS[option.nextId] || DEFAULT_SCENARIOS_AR[option.nextId])) {
            setCurrentScenarioId(option.nextId);
        } else {
            setIsGameOver(true);
            endGame();
        }
    };

    const endGame = () => {
        const average = (gameState.profit + gameState.reputation) / 2;
        const imbalance = Math.abs(gameState.profit - gameState.reputation);
        const finalScore = Math.floor(average - (imbalance * 0.2));

        if (gameState.reputation < 30) trigger('going_broke'); // Using as negative warning
        else trigger('game_over_win');

        setTimeout(() => {
            onComplete(finalScore, {
                profit: gameState.profit,
                reputation: gameState.reputation,
                ethics_rating: gameState.reputation > 70 ? 'Saint' : gameState.reputation > 40 ? 'Hustler' : 'Villain'
            });
        }, 3000);
    };

    if (!currentScenario && !isGameOver) return <div>Loading scenario...</div>;

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 overflow-hidden relative font-sans">
            <OllieBubble message={currentMessage} isVisible={isVisible} onDismiss={dismiss} position="top-right" />

            {/* HEADER METERS */}
            <div className="bg-white dark:bg-slate-800 p-4 shadow-sm flex justify-around items-center z-10 shrink-0">
                <div className="flex flex-col items-center w-1/3">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        {isRTL ? 'أثر الأرباح' : 'Profit Impact'}
                    </div>
                    <div className="flex items-center gap-2 w-full px-4">
                        <TrendingUp size={16} className="text-green-500 shrink-0" />
                        <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <motion.div className="h-full bg-green-500 rounded-full" animate={{ width: `${gameState.profit}%` }} />
                        </div>
                    </div>
                </div>

                <div className="h-10 w-px bg-slate-200 dark:bg-slate-700" />

                <div className="flex flex-col items-center w-1/3">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        {isRTL ? 'أثر السمعة والمجتمع' : 'Society Impact'}
                    </div>
                    <div className="flex items-center gap-2 w-full px-4">
                        <Heart size={16} className="text-pink-500 shrink-0" />
                        <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <motion.div className="h-full bg-pink-500 rounded-full" animate={{ width: `${gameState.reputation}%` }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col justify-center max-w-4xl mx-auto w-full">
                
                {isGameOver ? (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6">
                        <Scale size={64} className="mx-auto text-indigo-500" />
                        <h2 className="text-3xl font-black text-slate-800 dark:text-white">
                            {isRTL ? 'تم حسم المعضلة' : 'Dilemma Resolved'}
                        </h2>
                        <p className="text-slate-500">
                            {isRTL ? 'راجع مجلس الإدارة قراراتك الإدارية بعناية.' : 'The board has reviewed your decisions.'}
                        </p>
                        
                        <div className="flex justify-center gap-8 py-4">
                            <div className="text-center">
                                <div className="text-4xl font-black text-green-500">{gameState.profit}%</div>
                                <div className="text-xs uppercase font-bold text-slate-400">
                                    {isRTL ? 'الربح النهائي' : 'Final Profit'}
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-black text-pink-500">{gameState.reputation}%</div>
                                <div className="text-xs uppercase font-bold text-slate-400">
                                    {isRTL ? 'السمعة النهائية' : 'Final Reputation'}
                                </div>
                            </div>
                        </div>

                        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4 text-start border border-indigo-100 dark:border-indigo-800">
                            <p className="font-bold text-indigo-800 dark:text-indigo-300 mb-1">
                                {isRTL ? '💡 درس الاستدامة والمسؤولية المجتمعية:' : '💡 The ESG Lesson:'}
                            </p>
                            <p className="text-sm text-indigo-600 dark:text-indigo-400">
                                {isRTL
                                    ? 'الاستثمار الأخلاقي والمسؤول (ESG) يمثل تريليونات الدولارات حول العالم. الشركات التي تتخذ قرارات نزيهة وتراعي المجتمع والبيئة تبني ولاءً راسخاً وتجذب مستثمرين وشركاء يدعمون نموها الدائم!'
                                    : 'ESG (Environmental, Social, Governance) investing is worth $35 TRILLION globally. Companies that act ethically often attract more loyal customers AND investors in the long run. Short-term profits can lead to long-term ruin.'}
                            </p>
                        </div>
                    </motion.div>

                ) : (
                    <AnimatePresence mode='wait'>
                        {!showResult ? (
                            <motion.div key="scenario" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-6">
                                <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 shadow-md border-s-8 border-indigo-500">
                                    <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white mb-3">
                                        {currentScenario.title}
                                    </h2>
                                    <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                                        {currentScenario.desc}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    {['a', 'b'].map((opt) => {
                                        const choice = opt as 'a' | 'b';
                                        const optionData = currentScenario.options[choice];
                                        return (
                                            <button key={choice} onClick={() => handleChoice(choice)}
                                                className="group relative bg-white dark:bg-slate-800 p-5 md:p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-500 transition-all text-start shadow-sm hover:shadow-md hover:-translate-y-1">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-black text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors shrink-0">
                                                        {choice.toUpperCase()}
                                                    </div>
                                                    <span className="font-bold text-lg text-slate-800 dark:text-gray-200 pt-1">
                                                        {optionData.text}
                                                    </span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 text-center">
                                <CheckCircle2 size={64} className="mx-auto text-indigo-500" />
                                <h3 className="text-2xl font-black text-slate-800 dark:text-white">
                                    {isRTL ? 'تم تسجيل قرارك!' : 'Decision Recorded'}
                                </h3>

                                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm text-center">
                                    <p className="text-xl text-slate-700 dark:text-slate-200 font-bold mb-6">
                                        {currentScenario.options[lastChoice!].feedback}
                                    </p>

                                    {/* Impacts */}
                                    <div className="flex justify-center gap-8">
                                        <div className={`flex items-center gap-2 text-2xl font-black ${currentScenario.options[lastChoice!].profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            <TrendingUp size={28} />
                                            {currentScenario.options[lastChoice!].profit > 0 ? '+' : ''}{currentScenario.options[lastChoice!].profit}%
                                        </div>
                                        <div className={`flex items-center gap-2 text-2xl font-black ${currentScenario.options[lastChoice!].reputation >= 0 ? 'text-pink-500' : 'text-red-500'}`}>
                                            <Heart size={28} />
                                            {currentScenario.options[lastChoice!].reputation > 0 ? '+' : ''}{currentScenario.options[lastChoice!].reputation}%
                                        </div>
                                    </div>
                                </div>

                                {currentScenario.caseStudy && (
                                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-5 text-start">
                                        <h4 className="font-black text-amber-800 dark:text-amber-400 mb-2 flex items-center gap-2">
                                            {isRTL ? `📖 دراسة حالة واقعية: ${currentScenario.caseStudy.company}` : `📖 Real World Case Study: ${currentScenario.caseStudy.company}`}
                                        </h4>
                                        <p className="text-sm text-amber-900 dark:text-amber-200">
                                            {currentScenario.caseStudy.text}
                                        </p>
                                    </div>
                                )}

                                <button onClick={nextScenario}
                                    className="bg-indigo-600 text-white px-10 py-4 rounded-xl font-black text-lg shadow-[0_4px_0_0_rgba(67,56,202,1)] hover:bg-indigo-700 active:translate-y-1 active:shadow-none transition-all flex items-center gap-2 mx-auto">
                                    {currentScenario.options[lastChoice!].nextId 
                                        ? (isRTL ? 'المعضلة التالية' : 'Next Dilemma') 
                                        : (isRTL ? 'إنهاء المحاكاة' : 'Finish Simulation')} <ChevronRight />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

export default EthicalDilemmaTemplate;
