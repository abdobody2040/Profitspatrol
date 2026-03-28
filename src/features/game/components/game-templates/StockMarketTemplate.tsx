import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Activity, AlertTriangle, Briefcase } from 'lucide-react';

// TYPES
type MarketTrend = 'STABLE' | 'BULL' | 'BEAR' | 'CRASH' | 'BOOM';

interface StockMarketTemplateProps {
    onComplete: (score: number, data: any) => void;
}

const GAME_DURATION = 60; // seconds
const INITIAL_CASH = 1000;
const INITIAL_PRICE = 50;
const GRAPH_POINTS = 40; // How many points to show on screen

const StockMarketTemplate: React.FC<StockMarketTemplateProps> = ({ onComplete }) => {
    const { t } = useTranslation();

    // GAME STATE
    const [isPlaying, setIsPlaying] = useState(false);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);

    // MARKET STATE
    const [price, setPrice] = useState(INITIAL_PRICE);
    const [priceHistory, setPriceHistory] = useState<number[]>(new Array(GRAPH_POINTS).fill(INITIAL_PRICE));
    const [trend, setTrend] = useState<MarketTrend>('STABLE');
    const [newsFlash, setNewsFlash] = useState<string | null>(null);

    // PORTFOLIO STATE
    const [cash, setCash] = useState(INITIAL_CASH);
    const [shares, setShares] = useState(0);

    // REFS
    const timerRef = useRef<NodeJS.Timeout>();
    const loopRef = useRef<NodeJS.Timeout>();
    const trendTimerRef = useRef<NodeJS.Timeout>();

    // CLEANUP
    useEffect(() => {
        return () => {
            stopGameLoop();
        };
    }, []);

    const stopGameLoop = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (loopRef.current) clearInterval(loopRef.current);
        if (trendTimerRef.current) clearInterval(trendTimerRef.current);
    };

    const startGame = () => {
        setIsPlaying(true);
        setCash(INITIAL_CASH);
        setShares(0);
        setPrice(INITIAL_PRICE);
        setPriceHistory(new Array(GRAPH_POINTS).fill(INITIAL_PRICE));
        setTimeLeft(GAME_DURATION);
        setTrend('STABLE');

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
        loopRef.current = setInterval(updateMarket, 200); // 5 ticks per second

        // 3. Random Events Loop
        trendTimerRef.current = setInterval(triggerRandomEvent, 5000); // Every 5s chance for event
    };

    const endGame = () => {
        stopGameLoop();
        setIsPlaying(false);

        // Force sell all at end
        const finalValue = cash + (shares * price);
        const profit = finalValue - INITIAL_CASH;

        // Calculate Score (Profit based)
        // 1000 start -> 1500 is decent, 2000 is great
        const score = Math.max(0, Math.floor(profit / 5)); // e.g., $500 profit = 100 pts

        setTimeout(() => {
            onComplete(score, {
                netWorth: finalValue,
                profit: profit
            });
        }, 1500);
    };

    const updateMarket = () => {
        setPrice(prevPrice => {
            let change = 0;
            const volatility = Math.random() * 2; // Random noise 0-2

            switch (trend) {
                case 'STABLE':
                    change = (Math.random() - 0.5) * 1; // +/- 0.5
                    break;
                case 'BULL':
                    change = (Math.random() * 2); // 0 to +2
                    break;
                case 'BEAR':
                    change = -(Math.random() * 2); // -2 to 0
                    break;
                case 'BOOM':
                    change = (Math.random() * 5); // 0 to +5
                    break;
                case 'CRASH':
                    change = -(Math.random() * 5); // -5 to 0
                    break;
            }

            // Add noise
            // Sometimes go against trend slightly
            if (Math.random() < 0.2) change *= -1;

            let newPrice = prevPrice + change;
            newPrice = Math.max(1, newPrice); // Never below $1

            // Update history
            setPriceHistory(prev => {
                const newHist = [...prev.slice(1), newPrice];
                return newHist;
            });

            return newPrice;
        });
    };

    const triggerRandomEvent = () => {
        const roll = Math.random();
        let newTrend: MarketTrend = 'STABLE';
        let newsKey = '';

        if (roll < 0.4) {
            newTrend = 'STABLE';
        } else if (roll < 0.6) {
            newTrend = 'BULL';
            newsKey = 'bull';
        } else if (roll < 0.8) {
            newTrend = 'BEAR';
            newsKey = 'bear';
        } else if (roll < 0.9) {
            newTrend = 'BOOM';
            newsKey = 'boom';
        } else {
            newTrend = 'CRASH';
            newsKey = 'crash';
        }

        setTrend(newTrend);
        if (newsKey) {
            setNewsFlash(newsKey);
            setTimeout(() => setNewsFlash(null), 3000);
        }
    };

    // ACTIONS
    const buyStock = () => {
        if (cash >= price) {
            setCash(prev => prev - price);
            setShares(prev => prev + 1);
        }
    };

    const sellStock = () => {
        if (shares > 0) {
            setShares(prev => prev - 1);
            setCash(prev => prev + price);
        }
    };

    const buyMax = () => {
        if (price <= 0) return;
        const amount = Math.floor(cash / price);
        if (amount > 0) {
            setCash(prev => prev - (amount * price));
            setShares(prev => prev + amount);
        }
    }

    const sellMax = () => {
        if (shares > 0) {
            setCash(prev => prev + (shares * price));
            setShares(0);
        }
    }


    // RENDER HELPERS
    const getGraphPath = () => {
        const max = Math.max(...priceHistory, INITIAL_PRICE * 1.5);
        const min = Math.min(...priceHistory, INITIAL_PRICE * 0.5);
        const range = max - min || 1;

        // SVG Coordinate space: 0,0 is top-left.
        // X goes 0 -> 100%
        // Y goes 100% (min) -> 0% (max)

        // We'll map points to 100x100 space
        const points = priceHistory.map((p, i) => {
            const x = (i / (GRAPH_POINTS - 1)) * 100;
            const y = 100 - ((p - min) / range) * 100;
            return `${x},${y}`;
        });

        return `M ${points.join(' L ')}`;
    };

    const netWorth = cash + (shares * price);
    const isProfitable = netWorth >= INITIAL_CASH;

    return (
        <div className="flex flex-col h-full bg-slate-900 text-white overflow-hidden relative font-mono">

            {/* HUD */}
            <div className="bg-slate-800 p-4 shadow-lg border-b border-slate-700 flex justify-between items-center z-10">
                <div className="flex flex-col">
                    <div className="text-xs text-slate-400 font-bold uppercase">{t('games.invest.ui.net_worth')}</div>
                    <div className={`text-2xl font-black ${isProfitable ? 'text-green-400' : 'text-red-400'}`}>
                        ${netWorth.toFixed(0)}
                    </div>
                </div>

                <div className={`text-4xl font-black ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                    0:{timeLeft.toString().padStart(2, '0')}
                </div>

                <div className="flex flex-col text-right">
                    <div className="text-xs text-slate-400 font-bold uppercase">{t('games.invest.ui.price')}</div>
                    <div className="text-2xl font-black text-blue-400">
                        ${price.toFixed(2)}
                    </div>
                </div>
            </div>

            {/* GRAPH AREA */}
            <div className="flex-1 relative bg-slate-900 overflow-hidden">
                {/* GRID LINES */}
                <div className="absolute inset-0 opacity-10 flex flex-col justify-between p-4 pointer-events-none">
                    <div className="border-t border-white w-full h-0"></div>
                    <div className="border-t border-white w-full h-0"></div>
                    <div className="border-t border-white w-full h-0"></div>
                    <div className="border-t border-white w-full h-0"></div>
                </div>

                {/* SVG GRAPH */}
                <svg className="absolute inset-0 w-full h-full p-4" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <path
                        d={`${getGraphPath()} L 100,100 L 0,100 Z`}
                        fill="url(#gradient)"
                        stroke="none"
                    />
                    <path
                        d={getGraphPath()}
                        fill="none"
                        stroke="#60a5fa"
                        strokeWidth="2"
                        vectorEffect="non-scaling-stroke"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {/* Current Point Dot */}
                    {priceHistory.length > 0 && (
                        <circle
                            cx="100"
                            cy={100 - ((price - Math.min(...priceHistory, INITIAL_PRICE * 0.5)) / (Math.max(...priceHistory, INITIAL_PRICE * 1.5) - Math.min(...priceHistory, INITIAL_PRICE * 0.5) || 1)) * 100}
                            r="3" // Radius in viewBox units, might need scale adjustment
                            fill="#white"
                            className="animate-pulse"
                        />
                    )}
                </svg>

                {/* NEWS FLASH OVERLAY */}
                <AnimatePresence>
                    {newsFlash && (
                        <motion.div
                            initial={{ opacity: 0, y: -50, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 50, scale: 0.8 }}
                            className="absolute top-10 left-0 right-0 flex justify-center pointer-events-none"
                        >
                            <div className={`
                            px-8 py-4 rounded-xl shadow-2xl border-4 text-center transform rotate-[-2deg]
                            ${newsFlash === 'boom' || newsFlash === 'bull' ? 'bg-green-500 border-green-300' : 'bg-red-500 border-red-300'}
                        `}>
                                <h3 className="text-3xl font-black text-white uppercase drop-shadow-md">
                                    {t(`games.invest.events.${newsFlash}` as any)}
                                </h3>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* START OVERLAY */}
                {!isPlaying && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-slate-800 border-2 border-slate-700 p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl">
                            <Activity size={64} className="mx-auto text-blue-400 mb-4" />
                            <h2 className="text-3xl font-black text-white mb-2">{t('games.invest.title')}</h2>
                            <p className="text-slate-400 mb-8">{t('games.invest.desc')}</p>
                            <button
                                onClick={startGame}
                                className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-black text-xl shadow-[0_4px_0_0_rgba(29,78,216,1)] active:translate-y-1 active:shadow-none transition-all"
                            >
                                {t('games.invest.ui.start')}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* CONTROLS */}
            <div className="h-1/3 bg-slate-800 border-t border-slate-700 p-4 flex gap-4">
                {/* PORTFOLIO CARD */}
                <div className="flex-1 bg-slate-900 rounded-2xl p-4 flex flex-col justify-center gap-2 border border-slate-700">
                    <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-sm font-bold uppercase flex items-center gap-2">
                            <DollarSign size={16} /> {t('games.invest.ui.cash')}
                        </span>
                        <span className="text-xl font-bold text-white">${cash.toFixed(0)}</span>
                    </div>
                    <div className="w-full h-px bg-slate-800" />
                    <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-sm font-bold uppercase flex items-center gap-2">
                            <Briefcase size={16} /> {t('games.invest.ui.shares')}
                        </span>
                        <span className="text-xl font-bold text-white">{shares}</span>
                    </div>
                </div>

                {/* BUTTONS */}
                <div className="flex-[2] grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={sellStock}
                            disabled={shares === 0 || !isPlaying}
                            className={`
                            flex-1 rounded-xl font-black text-xl uppercase tracking-wider flex items-center justify-center gap-2 transition-all
                            ${shares > 0 ? 'bg-red-500 hover:bg-red-600 shadow-[0_4px_0_0_rgba(185,28,28,1)] text-white active:translate-y-1 active:shadow-none' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}
                        `}
                        >
                            <TrendingDown /> {t('games.invest.ui.sell')}
                        </button>
                        <button onClick={sellMax} className="text-xs text-slate-400 hover:text-white font-bold uppercase">
                            {t('games.invest.ui.sell_all')}
                        </button>
                    </div>

                    <div className="flex flex-col gap-2">
                        <button
                            onClick={buyStock}
                            disabled={cash < price || !isPlaying}
                            className={`
                            flex-1 rounded-xl font-black text-xl uppercase tracking-wider flex items-center justify-center gap-2 transition-all
                            ${cash >= price ? 'bg-green-500 hover:bg-green-600 shadow-[0_4px_0_0_rgba(21,128,61,1)] text-white active:translate-y-1 active:shadow-none' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}
                        `}
                        >
                            <TrendingUp /> {t('games.invest.ui.buy')}
                        </button>
                        <button onClick={buyMax} className="text-xs text-slate-400 hover:text-white font-bold uppercase">
                            {t('games.invest.ui.buy_max')}
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default StockMarketTemplate;
