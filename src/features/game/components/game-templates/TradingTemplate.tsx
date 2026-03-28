import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, Gavel, User, TrendingUp } from 'lucide-react';
import { BusinessSimulation, TradingConfig, TradingItem } from '../../../../types';

interface TradingTemplateProps {
    config?: BusinessSimulation;
    onComplete: (score: number, data: any) => void;
}

const TradingTemplate: React.FC<TradingTemplateProps> = ({ config, onComplete }) => {
    const { t } = useTranslation();
    const tradingConfig = config?.trading_config || { items: [], initial_budget: 1000 };
    const { items, initial_budget } = tradingConfig;
    const colors = config?.visual_config?.colors || { primary: '#7C2D12', background: '#FFEDD5' };

    const [budget, setBudget] = useState(initial_budget);
    const [inventory, setInventory] = useState<{ item: TradingItem, cost: number, realValue: number }[]>([]);

    // Auction State
    const [currentItemIndex, setCurrentItemIndex] = useState(0);
    const [currentBid, setCurrentBid] = useState(0);
    const [timer, setTimer] = useState(10); // 10 seconds per item
    const [highestBidder, setHighestBidder] = useState<'PLAYER' | 'BOT' | null>(null);
    const [auctionStatus, setAuctionStatus] = useState<'WAITING' | 'ACTIVE' | 'SOLD' | 'PASSED'>('WAITING');
    const [realValue, setRealValue] = useState(0);

    const timerRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        if (currentItemIndex < items.length) {
            startAuction(items[currentItemIndex]);
        } else {
            // End Game
            finishGame();
        }
    }, [currentItemIndex]);

    const startAuction = (item: TradingItem) => {
        setAuctionStatus('ACTIVE');
        setCurrentBid(item.start_price);
        setHighestBidder(null);
        setTimer(10);

        // Random real value based on range
        const val = Math.floor(Math.random() * (item.max_value - item.min_value + 1)) + item.min_value;
        setRealValue(val);

        // Start Timer
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setTimer(prev => {
                if (prev <= 0) {
                    endAuction(item, val);
                    return 0;
                }

                // Random Bot Bids logic inside timer update for simplicity?
                // Or separate effect. Let's do random bot bids here.
                if (Math.random() < 0.3) {
                    // Bot bids
                    // Bot knows "somewhat" value or just bids up to random point.
                    // Bot limit is random between start and max*0.8
                    // We need `currentBid` access.
                    // This closure captures initial state, need ref or functional update.
                    // Let's use a separate effect for bot logic.
                }

                return prev - 1;
            });
        }, 1000);
    };

    // Bot AI Loop
    useEffect(() => {
        if (auctionStatus !== 'ACTIVE') return;

        const botInterval = setInterval(() => {
            // Bot chance to bid if player is leading or no one is leading
            // Bot shouldn't bid if price > perceived value
            // 30% chance per second
            if (Math.random() < 0.3 && highestBidder !== 'BOT') {
                // Bid increment
                setCurrentBid(prev => {
                    const next = prev + 50;
                    // Prevent bot from overbidding unrealistically (limit to max_value * 1.1)
                    if (next > items[currentItemIndex].max_value * 1.1) return prev;
                    setHighestBidder('BOT');
                    return next;
                });
            }
        }, 1000);
        return () => clearInterval(botInterval);
    }, [auctionStatus, currentItemIndex, highestBidder]); // depend on highestBidder to react

    const endAuction = (item: TradingItem, value: number) => {
        if (timerRef.current) clearInterval(timerRef.current);

        // Use Functional state update to get latest bidder
        setHighestBidder(current => {
            if (current === 'PLAYER') {
                // Player won!
                setInventory(prev => [...prev, { item, cost: currentBid, realValue: value }]); // Need actual currentBid
                setBudget(b => b - currentBid); // Need actual currentBid. Warning: Closure issue if using startAuction scope vars.
                // Correct approach: We need to access state. 
                // So endAuction should rely on state.
                // But this function is called from setInterval closure...
                // Refactor needed: Use useEffect for Timer checks.
                return current;
            }
            return current;
        });

        // Since we have closure issues, let's fix the logic flow.
        // Timer effect handles time decrement.
        // Timer === 0 triggers useEffect which calls `handleAuctionEnd`.
    };

    // Refactored Timer End Logic
    useEffect(() => {
        if (timer === 0 && auctionStatus === 'ACTIVE') {
            handleAuctionEnd();
        }
    }, [timer, auctionStatus]);

    const handleAuctionEnd = () => {
        if (timerRef.current) clearInterval(timerRef.current);

        const item = items[currentItemIndex];

        if (highestBidder === 'PLAYER') {
            setBudget(b => b - currentBid);
            setInventory(prev => [...prev, { item, cost: currentBid, realValue: realValue }]);
            setAuctionStatus('SOLD');
        } else {
            setAuctionStatus('PASSED');
        }

        setTimeout(() => {
            setCurrentItemIndex(i => i + 1);
        }, 3000);
    };

    const placeBid = () => {
        if (auctionStatus !== 'ACTIVE') return;
        const nextBid = currentBid + 50;
        if (budget >= nextBid) {
            setCurrentBid(nextBid);
            setHighestBidder('PLAYER');
            // Extend timer slightly if low? Sniping?
            if (timer < 3) setTimer(3);
        }
    };

    const finishGame = () => {
        // Calculate Profit
        let totalProfit = 0;
        inventory.forEach(i => totalProfit += (i.realValue - i.cost));

        onComplete(Math.max(0, budget + totalProfit), { items: inventory.length, profit: totalProfit });
    };

    // Current Item
    const item = items[currentItemIndex];

    return (
        <div className="flex flex-col h-full overflow-hidden" style={{ backgroundColor: colors.background }}>
            {/* HUD */}
            <div className="p-4 bg-white/80 backdrop-blur-md shadow-sm z-20 flex justify-between items-center">
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-xl font-black text-xl flex items-center gap-2">
                    <DollarSign size={20} /> {budget}
                </div>
                <div className="font-bold text-gray-500">
                    Item {currentItemIndex + 1} / {items.length}
                </div>
            </div>

            {/* STAGE */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
                {item && auctionStatus !== 'WAITING' ? (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center max-w-sm w-full relative overflow-hidden"
                    >
                        <div className="text-9xl mb-4">{item.icon}</div>
                        <h2 className="text-2xl font-black text-gray-800 mb-2">{item.name}</h2>

                        {/* Timer Bar */}
                        <div className="w-full h-2 bg-gray-200 rounded-full mb-6 overflow-hidden">
                            <motion.div
                                className={`h-full ${timer < 3 ? 'bg-red-500' : 'bg-blue-500'}`}
                                animate={{ width: `${(timer / 10) * 100}%` }}
                            />
                        </div>

                        {/* Status Overlay */}
                        <AnimatePresence>
                            {auctionStatus === 'SOLD' && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 2 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="absolute inset-0 bg-green-500/90 flex flex-col items-center justify-center text-white"
                                >
                                    <div className="text-4xl font-black">SOLD!</div>
                                    <div className="font-mono mt-2">Value: ${realValue}</div>
                                    <div className={`text-xl font-bold ${realValue > currentBid ? 'text-yellow-300' : 'text-red-200'}`}>
                                        {realValue > currentBid ? `PROFIT +$${realValue - currentBid}` : `LOSS -$${currentBid - realValue}`}
                                    </div>
                                </motion.div>
                            )}
                            {auctionStatus === 'PASSED' && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 2 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="absolute inset-0 bg-red-500/90 flex flex-col items-center justify-center text-white"
                                >
                                    <div className="text-4xl font-black">SOLDOUT</div>
                                    <div className="font-mono mt-2">Sold to Bot</div>
                                    <div className="text-sm opacity-75">Real Value: ${realValue}</div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="text-center mb-6">
                            <div className="text-gray-400 font-bold uppercase text-xs tracking-widest">Current Bid</div>
                            <div className="text-5xl font-black text-gray-800 flex items-center justify-center">
                                ${currentBid}
                            </div>
                            <div className={`font-bold mt-1 ${highestBidder === 'PLAYER' ? 'text-green-500' : 'text-red-500'}`}>
                                {highestBidder === 'PLAYER' ? 'YOU ARE WINNING' : highestBidder === 'BOT' ? 'OPPONENT BID' : 'NO BIDS'}
                            </div>
                        </div>

                        <button
                            onClick={placeBid}
                            disabled={auctionStatus !== 'ACTIVE' || highestBidder === 'PLAYER'}
                            className={`w-full py-4 rounded-xl font-black text-xl shadow-[0_4px_0_0_rgba(0,0,0,0.2)] transition-all flex items-center justify-center gap-2
                                ${highestBidder === 'PLAYER'
                                    ? 'bg-gray-200 text-gray-400 cursor-default'
                                    : 'bg-green-500 text-white hover:bg-green-600 active:translate-y-1 active:shadow-none'}
                            `}
                        >
                            <Gavel size={24} /> BID ${currentBid + 50}
                        </button>

                    </motion.div>
                ) : (
                    <div className="text-2xl font-black text-gray-400 animate-pulse">Auction Closed</div>
                )}
            </div>

            {/* Inventory Strip */}
            <div className="h-24 bg-white border-t p-4 flex gap-4 overflow-x-auto">
                {inventory.map((i, idx) => (
                    <div key={idx} className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-2xl relative border-2 border-green-200">
                        {i.item.icon}
                        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] font-bold px-1 rounded-full">
                            +${i.realValue - i.cost}
                        </div>
                    </div>
                ))}
                {inventory.length === 0 && <div className="text-gray-300 font-bold text-sm flex items-center">Your won items appear here</div>}
            </div>
        </div>
    );
};

export default TradingTemplate;

