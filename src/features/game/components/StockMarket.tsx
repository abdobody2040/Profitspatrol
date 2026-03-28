import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import confetti from 'canvas-confetti';
import { TrendingUp, TrendingDown, Coins, X, BarChart2, RefreshCw, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { useAppStore } from '../../../store';

// ─── Stock Definitions ────────────────────────────────────────────────────────
export interface Stock {
    id: string;
    name: string;
    ticker: string;
    emoji: string;
    sector: string;
    basePrice: number;
    description: string;
    volatility: number; // 0-1, higher = more movement
}

const STOCKS_DB: Stock[] = [
    { id: 's1', name: 'BurgerBoss Inc.', ticker: 'BRGR', emoji: '🍔', sector: 'Food', basePrice: 45, description: 'The world\'s tastiest burger chain', volatility: 0.05 },
    { id: 's2', name: 'RocketTech Corp.', ticker: 'RKTC', emoji: '🚀', sector: 'Tech', basePrice: 120, description: 'Builds software for space companies', volatility: 0.12 },
    { id: 's3', name: 'GreenLeaf Foods', ticker: 'GRNL', emoji: '🥗', sector: 'Food', basePrice: 30, description: 'Healthy meal delivery startup', volatility: 0.07 },
    { id: 's4', name: 'SneakerKing Ltd.', ticker: 'SNKR', emoji: '👟', sector: 'Fashion', basePrice: 85, description: 'Premium sneakers for young pros', volatility: 0.09 },
    { id: 's5', name: 'CloudBytes AI', ticker: 'CBAI', emoji: '🤖', sector: 'Tech', basePrice: 200, description: 'AI solutions for small businesses', volatility: 0.15 },
    { id: 's6', name: 'SolarSpark Energy', ticker: 'SLRK', emoji: '☀️', sector: 'Energy', basePrice: 60, description: 'Renewable energy for schools', volatility: 0.08 },
    { id: 's7', name: 'MediaMogul Studios', ticker: 'MMOG', emoji: '🎬', sector: 'Media', basePrice: 75, description: 'Kid-run YouTube production studio', volatility: 0.11 },
    { id: 's8', name: 'PetPals Global', ticker: 'PTPL', emoji: '🐶', sector: 'Pets', basePrice: 40, description: 'Pet care subscription service', volatility: 0.06 },
];

// ─── Types ────────────────────────────────────────────────────────────────────
export interface StockHolding {
    stockId: string;
    shares: number;
    avgBuyPrice: number;
}

export interface StockPriceMap {
    [stockId: string]: number;
}

// ─── Price Engine (deterministic + random walk) ───────────────────────────────
function generatePrice(stock: Stock, minuteSeed: number, extra: number = 0): number {
    // Deterministic drift using seed so prices don't jump on re-render
    const drift = Math.sin(minuteSeed * stock.volatility * 7 + stock.id.charCodeAt(0)) * stock.basePrice * stock.volatility;
    const noise = extra * stock.basePrice * stock.volatility * 0.5;
    const price = stock.basePrice + drift + noise;
    return Math.max(1, Math.round(price * 100) / 100);
}

function initPrices(seed: number): StockPriceMap {
    const map: StockPriceMap = {};
    STOCKS_DB.forEach(s => { map[s.id] = generatePrice(s, seed); });
    return map;
}

// ─── Mini Sparkline ───────────────────────────────────────────────────────────
function Sparkline({ history, color }: { history: number[]; color: string }) {
    if (history.length < 2) return null;
    const min = Math.min(...history);
    const max = Math.max(...history);
    const range = max - min || 1;
    const w = 60, h = 24;
    const points = history.map((v, i) => `${(i / (history.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ');
    return (
        <svg width={w} height={h} className="opacity-80">
            <polyline points={points} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
        </svg>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
interface StockMarketProps { onClose?: () => void; }

export const StockMarket: React.FC<StockMarketProps> = ({ onClose }) => {
    const { t } = useTranslation();
    const { user, buyStock, sellStock } = useAppStore();

    // Seed changes every minute
    const [minuteSeed, setMinuteSeed] = useState(() => Math.floor(Date.now() / 60000));
    const [priceHistory, setPriceHistory] = useState<{ [stockId: string]: number[] }>(() => {
        const seed = Math.floor(Date.now() / 60000);
        const hist: { [id: string]: number[] } = {};
        STOCKS_DB.forEach(s => { hist[s.id] = [generatePrice(s, seed - 4), generatePrice(s, seed - 3), generatePrice(s, seed - 2), generatePrice(s, seed - 1), generatePrice(s, seed)]; });
        return hist;
    });

    const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
    const [tradeQty, setTradeQty] = useState(1);
    const [tradeMode, setTradeMode] = useState<'buy' | 'sell'>('buy');
    const [tab, setTab] = useState<'market' | 'portfolio'>('market');
    const [feedMsg, setFeedMsg] = useState<string | null>(null);

    // Tick every 60s
    useEffect(() => {
        const tick = () => {
            const newSeed = Math.floor(Date.now() / 60000);
            setMinuteSeed(newSeed);
            setPriceHistory(prev => {
                const next = { ...prev };
                STOCKS_DB.forEach(s => {
                    const newPrice = generatePrice(s, newSeed, (Math.random() - 0.5) * 2);
                    next[s.id] = [...(prev[s.id] ?? []).slice(-9), newPrice];
                });
                return next;
            });
        };
        const ms = 60000 - (Date.now() % 60000);
        const timer = setTimeout(() => { tick(); setInterval(tick, 60000); }, ms);
        return () => clearTimeout(timer);
    }, []);

    const currentPrices = useMemo(() => {
        const map: StockPriceMap = {};
        STOCKS_DB.forEach(s => { map[s.id] = priceHistory[s.id]?.at(-1) ?? generatePrice(s, minuteSeed); });
        return map;
    }, [priceHistory, minuteSeed]);

    const holdings: StockHolding[] = (user?.stockPortfolio ?? []);
    const bizCoins = user?.bizCoins ?? 0;

    const portfolioValue = useMemo(() => holdings.reduce((sum, h) => {
        return sum + (currentPrices[h.stockId] ?? 0) * h.shares;
    }, 0), [holdings, currentPrices]);

    const portfolioGain = useMemo(() => holdings.reduce((sum, h) => {
        const cost = h.avgBuyPrice * h.shares;
        const curr = (currentPrices[h.stockId] ?? 0) * h.shares;
        return sum + (curr - cost);
    }, 0), [holdings, currentPrices]);

    const handleTrade = useCallback(() => {
        if (!selectedStock || tradeQty < 1) return;
        const price = currentPrices[selectedStock.id];
        const cost = price * tradeQty;

        if (tradeMode === 'buy') {
            if (cost > bizCoins) { setFeedMsg('❌ Not enough BizCoins!'); setTimeout(() => setFeedMsg(null), 2000); return; }
            buyStock(selectedStock.id, tradeQty, price);
            setFeedMsg(`✅ Bought ${tradeQty} ${selectedStock.ticker} for ${cost.toFixed(0)} 🪙`);
            confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
        } else {
            const holding = holdings.find(h => h.stockId === selectedStock.id);
            if (!holding || holding.shares < tradeQty) { setFeedMsg('❌ Not enough shares!'); setTimeout(() => setFeedMsg(null), 2000); return; }
            sellStock(selectedStock.id, tradeQty, price);
            const profit = (price - holding.avgBuyPrice) * tradeQty;
            setFeedMsg(`✅ Sold ${tradeQty} ${selectedStock.ticker} | P/L: ${profit >= 0 ? '+' : ''}${profit.toFixed(0)} 🪙`);
            if (profit > 0) confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
        }
        setTimeout(() => setFeedMsg(null), 3000);
        setSelectedStock(null);
        setTradeQty(1);
    }, [selectedStock, tradeQty, tradeMode, currentPrices, bizCoins, holdings, buyStock, sellStock]);

    return (
        <div className="flex flex-col gap-4 max-w-sm w-full mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-black text-gray-800 dark:text-white flex items-center gap-2">
                        <BarChart2 className="w-5 h-5 text-green-500" />
                        {t('stock.title')}
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">{t('stock.subtitle')}</p>
                </div>
                {onClose && <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400"><X size={18} /></button>}
            </div>

            {/* Portfolio Summary */}
            <div className="grid grid-cols-3 gap-2">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-2.5 text-center">
                    <p className="text-xs text-gray-400">Wallet</p>
                    <p className="font-black text-sm text-yellow-500">🪙 {bizCoins.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-2.5 text-center">
                    <p className="text-xs text-gray-400">Portfolio</p>
                    <p className="font-black text-sm text-indigo-500">🪙 {portfolioValue.toFixed(0)}</p>
                </div>
                <div className={`rounded-xl p-2.5 text-center ${portfolioGain >= 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                    <p className="text-xs text-gray-400">P/L</p>
                    <p className={`font-black text-sm ${portfolioGain >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {portfolioGain >= 0 ? '+' : ''}{portfolioGain.toFixed(0)}
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                {(['market', 'portfolio'] as const).map(t_ => (
                    <button key={t_} onClick={() => setTab(t_)}
                        className={`flex-1 py-1.5 rounded-lg text-sm font-bold transition-all ${tab === t_ ? 'bg-white dark:bg-gray-700 shadow text-gray-800 dark:text-white' : 'text-gray-500'}`}>
                        {t_ === 'market' ? '📈 Market' : '💼 Portfolio'}
                    </button>
                ))}
            </div>

            {/* Feed Message */}
            <AnimatePresence>
                {feedMsg && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="bg-gray-800 dark:bg-white text-white dark:text-gray-800 text-sm font-semibold text-center rounded-xl p-2.5">
                        {feedMsg}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Market Tab */}
            {tab === 'market' && (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                    {STOCKS_DB.map(stock => {
                        const price = currentPrices[stock.id];
                        const hist = priceHistory[stock.id] ?? [];
                        const prev = hist.at(-2) ?? price;
                        const change = price - prev;
                        const changePct = ((change / prev) * 100).toFixed(2);
                        const isUp = change >= 0;
                        const holding = holdings.find(h => h.stockId === stock.id);

                        return (
                            <motion.div key={stock.id} whileHover={{ scale: 1.01 }}
                                onClick={() => { setSelectedStock(stock); setTradeQty(1); setTradeMode('buy'); }}
                                className={`flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors border-2 ${selectedStock?.id === stock.id ? 'border-indigo-400' : 'border-transparent'}`}>
                                <div className="w-10 h-10 rounded-2xl bg-white dark:bg-gray-700 flex items-center justify-center text-xl shrink-0 shadow-sm">
                                    {stock.emoji}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1 flex-wrap">
                                        <span className="font-black text-sm text-gray-800 dark:text-white">{stock.ticker}</span>
                                        {holding && <span className="text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 px-1.5 py-0.5 rounded-full font-bold">{holding.shares}sh</span>}
                                    </div>
                                    <p className="text-xs text-gray-400 truncate">{stock.name}</p>
                                </div>
                                <Sparkline history={hist} color={isUp ? '#10B981' : '#EF4444'} />
                                <div className="text-right shrink-0">
                                    <p className="font-black text-sm text-gray-800 dark:text-white">🪙{price.toFixed(0)}</p>
                                    <p className={`text-xs font-bold flex items-center gap-0.5 justify-end ${isUp ? 'text-green-500' : 'text-red-500'}`}>
                                        {isUp ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                                        {isUp ? '+' : ''}{changePct}%
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Portfolio Tab */}
            {tab === 'portfolio' && (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                    {holdings.length === 0 ? (
                        <div className="text-center py-10 text-gray-400 text-sm">{t('stock.empty_portfolio')}</div>
                    ) : holdings.map(h => {
                        const stock = STOCKS_DB.find(s => s.id === h.stockId);
                        if (!stock) return null;
                        const price = currentPrices[h.stockId];
                        const gain = (price - h.avgBuyPrice) * h.shares;
                        const gainPct = ((price - h.avgBuyPrice) / h.avgBuyPrice * 100).toFixed(1);
                        const isUp = gain >= 0;
                        return (
                            <div key={h.stockId} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                                <div className="w-10 h-10 rounded-2xl bg-white dark:bg-gray-700 flex items-center justify-center text-xl shrink-0 shadow-sm">{stock.emoji}</div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1">
                                        <span className="font-black text-sm text-gray-800 dark:text-white">{stock.ticker}</span>
                                        <span className="text-xs text-gray-400">{h.shares}sh @ 🪙{h.avgBuyPrice.toFixed(0)}</span>
                                    </div>
                                    <p className={`text-xs font-bold ${isUp ? 'text-green-600' : 'text-red-500'}`}>
                                        {isUp ? '+' : ''}{gain.toFixed(0)} 🪙 ({isUp ? '+' : ''}{gainPct}%)
                                    </p>
                                </div>
                                <button onClick={() => { setSelectedStock(stock); setTradeMode('sell'); setTradeQty(1); setTab('market'); }}
                                    className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-bold rounded-lg hover:bg-red-200 transition-colors">
                                    Sell
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Trade Panel */}
            <AnimatePresence>
                {selectedStock && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
                        className="rounded-2xl border-2 border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/20 p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">{selectedStock.emoji}</span>
                                <div>
                                    <p className="font-black text-gray-800 dark:text-white">{selectedStock.ticker}</p>
                                    <p className="text-xs text-gray-500">{selectedStock.description}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedStock(null)} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
                        </div>

                        {/* Buy/Sell toggle */}
                        <div className="flex gap-1 bg-white dark:bg-gray-800 rounded-xl p-1">
                            <button onClick={() => setTradeMode('buy')}
                                className={`flex-1 py-1.5 rounded-lg text-sm font-bold transition-all ${tradeMode === 'buy' ? 'bg-green-500 text-white' : 'text-gray-500'}`}>
                                Buy
                            </button>
                            <button onClick={() => setTradeMode('sell')}
                                className={`flex-1 py-1.5 rounded-lg text-sm font-bold transition-all ${tradeMode === 'sell' ? 'bg-red-500 text-white' : 'text-gray-500'}`}>
                                Sell
                            </button>
                        </div>

                        {/* Quantity + cost */}
                        <div className="flex items-center gap-3">
                            <button onClick={() => setTradeQty(q => Math.max(1, q - 1))} className="w-9 h-9 rounded-xl bg-white dark:bg-gray-700 font-black text-gray-600 dark:text-gray-300 shadow hover:bg-gray-100 transition-colors">−</button>
                            <div className="flex-1 text-center">
                                <p className="font-black text-xl text-gray-800 dark:text-white">{tradeQty} share{tradeQty !== 1 ? 's' : ''}</p>
                                <p className="text-xs text-gray-500">Cost: 🪙{(currentPrices[selectedStock.id] * tradeQty).toFixed(0)}</p>
                            </div>
                            <button onClick={() => setTradeQty(q => q + 1)} className="w-9 h-9 rounded-xl bg-white dark:bg-gray-700 font-black text-gray-600 dark:text-gray-300 shadow hover:bg-gray-100 transition-colors">+</button>
                        </div>

                        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                            onClick={handleTrade}
                            className={`w-full py-3 rounded-2xl font-black text-white ${tradeMode === 'buy' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-rose-600'}`}>
                            {tradeMode === 'buy' ? `Buy ${tradeQty} Share${tradeQty > 1 ? 's' : ''}` : `Sell ${tradeQty} Share${tradeQty > 1 ? 's' : ''}`}
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            <p className="text-center text-xs text-gray-300 dark:text-gray-600">Prices update every minute · Educational simulation only</p>
        </div>
    );
};

export default StockMarket;
