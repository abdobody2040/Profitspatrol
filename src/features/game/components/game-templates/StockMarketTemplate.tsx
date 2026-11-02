import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, PieChart, Newspaper } from "lucide-react";
import { secureRandom } from '../../../../utils/cryptoUtils';
import OllieBubble from '../../../../components/OllieBubble';
import { useOllieCommentary } from '../../../../hooks/useOllieCommentary';
import { BusinessSimulation } from '../../../../types';

// TYPES
type MarketTrend = 'STABLE' | 'BULL' | 'BEAR' | 'CRASH' | 'BOOM';

interface Stock {
    id: string;
    name: string;
    symbol: string;
    color: string;
    price: number;
    history: number[];
    shares: number;
    volatility: number;
    trend: MarketTrend;
}

interface StockMarketTemplateProps {
    config?: BusinessSimulation;
    onComplete: (score: number, data: any) => void;
}

const GAME_DURATION = 90; // seconds
const INITIAL_CASH = 1000;
const GRAPH_POINTS = 30; // How many points to show on screen

const INITIAL_STOCKS: Stock[] = [
    { id: 's1', name: 'TechGiant', symbol: 'TCH', color: '#3B82F6', price: 100, history: new Array(GRAPH_POINTS).fill(100), shares: 0, volatility: 2.5, trend: 'STABLE' },
    { id: 's2', name: 'BurgerCorp', symbol: 'BGR', color: '#F59E0B', price: 50, history: new Array(GRAPH_POINTS).fill(50), shares: 0, volatility: 1.2, trend: 'STABLE' },
    { id: 's3', name: 'EcoEnergy', symbol: 'ECO', color: '#10B981', price: 25, history: new Array(GRAPH_POINTS).fill(25), shares: 0, volatility: 3.5, trend: 'STABLE' },
];

const NEWS_EVENTS = [
    { target: 'TCH', trend: 'BOOM', text: 'TechGiant releases new AI chip! Stocks soar!', arText: 'عملاق التقنية يطلق شريحة ذكاء اصطناعي ثورية! صعود قوي للسهم!' },
    { target: 'TCH', trend: 'CRASH', text: 'Data leak at TechGiant! Investors panic!', arText: 'تسريب بيانات في عملاق التقنية! ذعر بين المستثمرين وهبوط السهم!' },
    { target: 'BGR', trend: 'BULL', text: 'BurgerCorp new spicy sandwich goes viral!', arText: 'وجبة البرجر الحارة الجديدة تحقق انتشاراً هائلاً! طلب متزايد!' },
    { target: 'BGR', trend: 'BEAR', text: 'Health inspector fines BurgerCorp.', arText: 'مخالفة صحية ضد شركة البرجر تؤدي لهبوط مؤقت للسهم!' },
    { target: 'ECO', trend: 'BOOM', text: 'Government announces huge solar subsidies!', arText: 'دعم حكومي ضخم لشركات الطاقة الشمسية والنظيفة! قفزة في الأسعار!' },
    { target: 'ECO', trend: 'CRASH', text: 'EcoEnergy wind farm project delayed indefinitely.', arText: 'تأجيل مشروع مزارع الرياح لشركة الطاقة الخضراء!' },
    { target: 'ALL', trend: 'CRASH', text: '🚨 GLOBAL MARKET CRASH! 🚨', arText: '🚨 انهيار مفاجئ في الأسواق العالمية! 🚨' },
    { target: 'ALL', trend: 'BULL', text: 'Interest rates lowered! Market rallies!', arText: '🚀 خفض الفائدة ينعش الأسواق وصعود جماعي للأسهم!' }
];

const StockMarketTemplate: React.FC<StockMarketTemplateProps> = ({ config, onComplete }) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language.startsWith('ar');
    const { currentMessage, isVisible, trigger, dismiss } = useOllieCommentary();

    // GAME STATE
    const [isPlaying, setIsPlaying] = useState(false);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [showResult, setShowResult] = useState(false);

    // MARKET STATE
    const [stocks, setStocks] = useState<Stock[]>(INITIAL_STOCKS);
    const [selectedStockId, setSelectedStockId] = useState<string>(INITIAL_STOCKS[0].id);
    const [newsHeadline, setNewsHeadline] = useState<{ text: string, type: string } | null>(null);

    // PORTFOLIO STATE
    const [cash, setCash] = useState(INITIAL_CASH);
    const [diversificationScore, setDiversificationScore] = useState(0);

    // REFS
    const timerRef = useRef<NodeJS.Timeout>();
    const loopRef = useRef<NodeJS.Timeout>();
    const newsTimerRef = useRef<NodeJS.Timeout>();

    // CLEANUP
    useEffect(() => {
        return () => {
            stopGameLoop();
        };
    }, []);

    const stopGameLoop = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (loopRef.current) clearInterval(loopRef.current);
        if (newsTimerRef.current) clearInterval(newsTimerRef.current);
    };

    const startGame = () => {
        setIsPlaying(true);
        setCash(INITIAL_CASH);
        setStocks(INITIAL_STOCKS.map(s => ({ ...s, history: new Array(GRAPH_POINTS).fill(s.price), shares: 0, trend: 'STABLE' })));
        setTimeLeft(GAME_DURATION);
        setShowResult(false);
        setNewsHeadline(null);
        setDiversificationScore(0);
        trigger('game_start');

        // 1. Countdown Timer
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    endGame();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // 2. Market Tick Loop (Fast updates)
        loopRef.current = setInterval(updateMarket, 500); // 2 ticks per second

        // 3. News Loop
        newsTimerRef.current = setInterval(triggerNewsEvent, 12000); // Every 12s
    };

    const endGame = useCallback(() => {
        stopGameLoop();
        setIsPlaying(false);
        setShowResult(true);

        // Force sell all at end
        let finalValue = cash;
        stocks.forEach(s => {
            finalValue += s.shares * s.price;
        });

        const profit = finalValue - INITIAL_CASH;
        const score = Math.max(0, Math.floor(profit / 2) + diversificationScore * 10); 

        setTimeout(() => {
            onComplete(score, {
                netWorth: finalValue,
                profit: profit,
                diversification: diversificationScore
            });
        }, 500);

        if (profit > 500) trigger('big_profit');
        else if (profit < 0) trigger('going_broke');
        else trigger('game_over_win');

    }, [cash, stocks, diversificationScore, onComplete, trigger]);

    const updateMarket = () => {
        setStocks(prevStocks => prevStocks.map(stock => {
            let change = 0;
            const noise = (secureRandom() - 0.5) * stock.volatility;

            switch (stock.trend) {
                case 'STABLE': change = noise; break;
                case 'BULL': change = (secureRandom() * stock.volatility) + noise; break;
                case 'BEAR': change = -(secureRandom() * stock.volatility) + noise; break;
                case 'BOOM': change = (secureRandom() * stock.volatility * 3); break;
                case 'CRASH': change = -(secureRandom() * stock.volatility * 3); break;
            }

            let newPrice = stock.price + change;
            newPrice = Math.max(1, newPrice); // Never below $1

            // Drift back to stable over time
            let newTrend = stock.trend;
            if (secureRandom() < 0.1 && newTrend !== 'STABLE') {
                newTrend = 'STABLE';
            }

            const newHist = [...stock.history.slice(1), newPrice];

            return { ...stock, price: newPrice, history: newHist, trend: newTrend };
        }));

        // Calculate diversification score
        setStocks(currentStocks => {
            const investedStocks = currentStocks.filter(s => s.shares > 0).length;
            let divScore = 0;
            if (investedStocks === 2) divScore = 50;
            if (investedStocks === 3) divScore = 100;
            setDiversificationScore(divScore);
            return currentStocks;
        });
    };

    const triggerNewsEvent = () => {
        const event = NEWS_EVENTS[Math.floor(secureRandom() * NEWS_EVENTS.length)];
        
        setNewsHeadline({ text: (isRTL && event.arText) ? event.arText : event.text, type: event.trend === 'CRASH' || event.trend === 'BEAR' ? 'bad' : 'good' });
        setTimeout(() => setNewsHeadline(null), 6000);

        setStocks(prev => prev.map(s => {
            if (event.target === 'ALL' || event.target === s.symbol) {
                return { ...s, trend: event.trend as MarketTrend };
            }
            return s;
        }));

        if (event.target === 'ALL' && event.trend === 'CRASH') {
            trigger('market_crash');
        } else if (event.trend === 'BOOM') {
            trigger('good_decision'); // Re-using for positive news reaction
        }
    };

    // ACTIONS
    const buyStock = (stockId: string, amount: number = 1) => {
        const stock = stocks.find(s => s.id === stockId);
        if (!stock || cash < stock.price * amount) return;

        setCash(prev => prev - (stock.price * amount));
        setStocks(prev => prev.map(s => s.id === stockId ? { ...s, shares: s.shares + amount } : s));
    };

    const sellStock = (stockId: string, amount: number = 1) => {
        const stock = stocks.find(s => s.id === stockId);
        if (!stock || stock.shares < amount) return;

        setCash(prev => prev + (stock.price * amount));
        setStocks(prev => prev.map(s => s.id === stockId ? { ...s, shares: s.shares - amount } : s));
    };

    const buyMax = (stockId: string) => {
        const stock = stocks.find(s => s.id === stockId);
        if (!stock || stock.price <= 0) return;
        const amount = Math.floor(cash / stock.price);
        if (amount > 0) buyStock(stockId, amount);
    }

    const sellMax = (stockId: string) => {
        const stock = stocks.find(s => s.id === stockId);
        if (stock && stock.shares > 0) sellStock(stockId, stock.shares);
    }

    // RENDER HELPERS
    const getGraphPath = (stock: Stock) => {
        const max = Math.max(...stock.history, stock.price * 1.2);
        const min = Math.min(...stock.history, stock.price * 0.8, 0);
        const range = max - min || 1;

        const points = stock.history.map((p, i) => {
            const x = (i / (GRAPH_POINTS - 1)) * 100;
            const y = 100 - ((p - min) / range) * 100;
            return `${x},${y}`;
        });

        return `M ${points.join(' L ')}`;
    };

    const netWorth = cash + stocks.reduce((acc, s) => acc + (s.shares * s.price), 0);
    const isProfitable = netWorth >= INITIAL_CASH;
    const selectedStock = stocks.find(s => s.id === selectedStockId) || stocks[0];

    return (
        <div className="flex flex-col h-full bg-slate-900 text-white overflow-hidden relative font-mono">
            <OllieBubble message={currentMessage} isVisible={isVisible} onDismiss={dismiss} position="top-right" />

            {/* HUD */}
            <div className="bg-slate-800 p-3 shadow-lg border-b border-slate-700 flex justify-between items-center z-10 shrink-0">
                <div className="flex flex-col">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">{t('games.invest.ui.net_worth')}</div>
                    <div className={`text-xl font-black ${isProfitable ? 'text-green-400' : 'text-red-400'}`}>
                        ${netWorth.toFixed(0)}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Diversification Meter */}
                    <div className="hidden md:flex flex-col items-center">
                        <div className="text-[9px] text-slate-400 font-bold uppercase flex items-center gap-1">
                            <PieChart size={10} /> Diversification
                        </div>
                        <div className="w-24 h-2 bg-slate-700 rounded-full mt-1 overflow-hidden">
                            <motion.div className="h-full" style={{ backgroundColor: diversificationScore === 100 ? '#10B981' : diversificationScore === 50 ? '#F59E0B' : '#EF4444' }} animate={{ width: `${diversificationScore}%` }} />
                        </div>
                    </div>

                    <div className={`text-2xl md:text-3xl font-black ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                        0:{timeLeft.toString().padStart(2, '0')}
                    </div>
                </div>

                <div className="flex flex-col text-end">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">{t('games.invest.ui.cash')}</div>
                    <div className="text-xl font-black text-blue-400">
                        ${cash.toFixed(0)}
                    </div>
                </div>
            </div>

            {/* NEWS FLASH OVERLAY */}
            <AnimatePresence>
                {newsHeadline && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-20 start-0 end-0 flex justify-center z-20 pointer-events-none px-4"
                    >
                        <div className={`px-4 py-2 rounded-lg shadow-2xl border-2 flex items-center gap-2 max-w-md w-full
                            ${newsHeadline.type === 'good' ? 'bg-green-900/90 border-green-400 text-green-100' : 'bg-red-900/90 border-red-400 text-red-100'}`}>
                            <Newspaper size={20} className={newsHeadline.type === 'good' ? 'text-green-400' : 'text-red-400'} />
                            <span className="font-bold text-sm marquee-text overflow-hidden whitespace-nowrap text-ellipsis">{newsHeadline.text}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* GRAPH AREA */}
            <div className="flex-1 relative bg-slate-900 overflow-hidden flex flex-col md:flex-row">
                
                {/* Stock Selector Sidebar */}
                <div className="w-full md:w-1/3 bg-slate-800 border-r border-slate-700 flex flex-row md:flex-col overflow-x-auto md:overflow-y-auto">
                    {stocks.map(stock => (
                        <button key={stock.id} onClick={() => setSelectedStockId(stock.id)}
                            className={`flex-1 min-w-[120px] md:w-full p-3 border-b border-r md:border-r-0 border-slate-700 text-left transition-colors
                                ${selectedStockId === stock.id ? 'bg-slate-700/50' : 'hover:bg-slate-700/30'}`}
                            style={{ borderLeftColor: stock.color, borderLeftWidth: selectedStockId === stock.id ? 4 : 0 }}
                        >
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-sm" style={{ color: stock.color }}>{stock.symbol}</span>
                                <span className="text-xs text-slate-400">{stock.shares} sh</span>
                            </div>
                            <div className="text-lg font-black">${stock.price.toFixed(2)}</div>
                            <div className={`text-[10px] uppercase font-bold flex items-center gap-1
                                ${stock.trend === 'BOOM' || stock.trend === 'BULL' ? 'text-green-400' : stock.trend === 'CRASH' || stock.trend === 'BEAR' ? 'text-red-400' : 'text-slate-400'}`}>
                                {stock.trend !== 'STABLE' ? (stock.trend === 'BOOM' || stock.trend === 'BULL' ? <TrendingUp size={10} /> : <TrendingDown size={10} />) : <Activity size={10} />}
                                {stock.trend}
                            </div>
                        </button>
                    ))}
                </div>

                {/* Main Graph */}
                <div className="flex-1 relative p-4 flex flex-col">
                    <div className="flex justify-between items-center mb-4 z-10 bg-slate-900/50 p-2 rounded-xl backdrop-blur-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: selectedStock.color }} />
                            <h3 className="font-black text-xl">{selectedStock.name}</h3>
                        </div>
                        <div className="text-3xl font-black text-white">${selectedStock.price.toFixed(2)}</div>
                    </div>

                    <div className="flex-1 relative">
                        {/* GRID LINES */}
                        <div className="absolute inset-0 opacity-10 flex flex-col justify-between pointer-events-none">
                            <div className="border-t border-white w-full h-0"></div><div className="border-t border-white w-full h-0"></div><div className="border-t border-white w-full h-0"></div>
                        </div>

                        {/* SVG GRAPH */}
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id={`grad-${selectedStock.id}`} x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor={selectedStock.color} stopOpacity="0.4" />
                                    <stop offset="100%" stopColor={selectedStock.color} stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <path d={`${getGraphPath(selectedStock)} L 100,100 L 0,100 Z`} fill={`url(#grad-${selectedStock.id})`} stroke="none" />
                            <path d={getGraphPath(selectedStock)} fill="none" stroke={selectedStock.color} strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
                            {/* Current Point Dot */}
                            {selectedStock.history.length > 0 && (
                                <circle cx="100" cy={100 - ((selectedStock.price - Math.min(...selectedStock.history, selectedStock.price * 0.8, 0)) / (Math.max(...selectedStock.history, selectedStock.price * 1.2) - Math.min(...selectedStock.history, selectedStock.price * 0.8, 0) || 1)) * 100} r="3" fill="#white" className="animate-pulse" />
                            )}
                        </svg>
                    </div>

                    {/* CONTROLS */}
                    <div className="mt-4 grid grid-cols-2 gap-4 z-10">
                        <div className="flex flex-col gap-2">
                            <button onClick={() => sellStock(selectedStock.id, 1)} disabled={selectedStock.shares === 0 || !isPlaying}
                                className={`py-3 rounded-xl font-black text-lg uppercase tracking-wider flex items-center justify-center gap-2 transition-all
                                ${selectedStock.shares > 0 ? 'bg-red-500 hover:bg-red-600 shadow-[0_4px_0_0_rgba(185,28,28,1)] text-white active:translate-y-1 active:shadow-none' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}>
                                <TrendingDown size={18} /> {isRTL ? 'بيع ١' : 'Sell 1'}
                            </button>
                            <button onClick={() => sellMax(selectedStock.id)} disabled={selectedStock.shares === 0 || !isPlaying} className="text-xs text-slate-400 hover:text-white font-bold uppercase disabled:opacity-50">
                                {isRTL ? 'بيع الكل' : 'Sell All'}
                            </button>
                        </div>

                        <div className="flex flex-col gap-2">
                            <button onClick={() => buyStock(selectedStock.id, 1)} disabled={cash < selectedStock.price || !isPlaying}
                                className={`py-3 rounded-xl font-black text-lg uppercase tracking-wider flex items-center justify-center gap-2 transition-all
                                ${cash >= selectedStock.price ? 'bg-green-500 hover:bg-green-600 shadow-[0_4px_0_0_rgba(21,128,61,1)] text-white active:translate-y-1 active:shadow-none' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}>
                                <TrendingUp size={18} /> {isRTL ? 'شراء ١' : 'Buy 1'}
                            </button>
                            <button onClick={() => buyMax(selectedStock.id)} disabled={cash < selectedStock.price || !isPlaying} className="text-xs text-slate-400 hover:text-white font-bold uppercase disabled:opacity-50">
                                {isRTL ? 'شراء الحد الأقصى' : 'Buy Max'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* START / RESULT OVERLAYS */}
            {!isPlaying && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    {showResult ? (
                        <div className="bg-slate-800 border-2 border-slate-700 p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl">
                            <div className="text-5xl mb-3">{netWorth > INITIAL_CASH + 500 ? '📈' : netWorth > INITIAL_CASH ? '👍' : '📉'}</div>
                            <h2 className="text-2xl font-black text-white mb-1">
                                {isRTL ? 'أغلقت جلسة التداول' : 'Trading Closed'}
                            </h2>
                            <div className={`text-4xl font-black mb-3 ${netWorth >= INITIAL_CASH ? 'text-green-400' : 'text-red-400'}`}>
                                ${netWorth.toFixed(0)}
                            </div>
                            
                            <div className="bg-slate-700/50 rounded-xl p-4 mb-6 text-start space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">{isRTL ? 'صافي الربح:' : 'Profit:'}</span>
                                    <span className={netWorth - INITIAL_CASH >= 0 ? 'text-green-400' : 'text-red-400'}>
                                        ${(netWorth - INITIAL_CASH).toFixed(0)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">{isRTL ? 'مكافأة تنويع المحفظة:' : 'Diversification Bonus:'}</span>
                                    <span className="text-blue-400">+{diversificationScore * 10} {isRTL ? 'نقطة' : 'pts'}</span>
                                </div>
                            </div>

                            <div className="bg-blue-900/30 border border-blue-500/30 rounded-xl p-3 mb-6 text-xs text-start text-blue-200">
                                <span className="font-bold text-blue-400 block mb-1">
                                    {isRTL ? '💡 درس مالي مهم:' : '💡 Financial Lesson:'}
                                </span>
                                {isRTL
                                    ? 'تنويع الاستثمار يعني توزيع أموالك على مجالات متعددة؛ فإذا هبط أحد الأسهم، حمتك بقية الأسهم من الخسارة!'
                                    : 'Diversification means spreading your money across different investments. If one crashes, the others protect you!'}
                            </div>

                            <div className="flex gap-3">
                                <button onClick={startGame} className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-black shadow-[0_4px_0_#1d4ed8] active:translate-y-1 active:shadow-none">
                                    {isRTL ? 'تداول مجدداً' : 'Trade Again'}
                                </button>
                                <button onClick={() => onComplete(0, {})} className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-black shadow-[0_4px_0_#334155] active:translate-y-1 active:shadow-none">
                                    {isRTL ? 'خروج' : 'Exit'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-slate-800 border-2 border-slate-700 p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl">
                            <Activity size={64} className="mx-auto text-blue-400 mb-4" />
                            <h2 className="text-3xl font-black text-white mb-2">{t('games.invest.title')}</h2>
                            <p className="text-slate-400 mb-6 text-sm">{config?.description || t('games.invest.desc')}</p>
                            
                            <div className="bg-slate-700/50 rounded-xl p-4 mb-6 text-xs text-start text-slate-300">
                                <ul className="space-y-2">
                                    <li>{isRTL ? '📰 راقب الأخبار: فالأحداث تؤثر بقوة على حركة الأسعار.' : '📰 Watch the news: Events drastically affect prices.'}</li>
                                    <li>{isRTL ? '🥧 نوّع استثمارك: اشترِ أسهماً مختلفة لكسب مكافآت وتقليل المخاطر!' : '🥧 Diversify: Buy multiple stocks to earn bonus points and reduce risk!'}</li>
                                    <li>{isRTL ? '⚡ اشترِ بسعر رخيص وبِع بسعر مرتفع.' : '⚡ Buy low, sell high.'}</li>
                                </ul>
                            </div>

                            <button onClick={startGame} className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-black text-xl shadow-[0_4px_0_0_rgba(29,78,216,1)] active:translate-y-1 active:shadow-none transition-all">
                                {t('games.invest.ui.start')}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default StockMarketTemplate;
