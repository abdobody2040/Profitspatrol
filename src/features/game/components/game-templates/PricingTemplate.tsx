import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Users, RefreshCw, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface PricingTemplateProps {
    onComplete: (score: number, data: any) => void;
    config?: any;
}

const PricingTemplate: React.FC<PricingTemplateProps> = ({ onComplete, config }) => {
    const { t } = useTranslation();
    const [price, setPrice] = useState(5); // Default price
    const [history, setHistory] = useState<any[]>([]);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [isComplete, setIsComplete] = useState(false);

    // Simulation Constants (Hidden from user)
    const MAX_DEMAND = 100;
    const OPTIMAL_PRICE = 12; // The secret sweet spot
    const PRICE_SENSITIVITY = 4; // How fast demand drops
    const COST_PER_UNIT = 4; // Cost of Goods Sold

    // Calculate outcomes based on current price
    // Demand Curve: Linear drop for simplicity (Demand = Max - (Slope * Price))
    // We clamp it so it doesn't go below 0
    const demand = Math.max(0, Math.round(MAX_DEMAND - (PRICE_SENSITIVITY * (price - 2))));
    const revenue = price * demand;
    const costs = COST_PER_UNIT * demand;
    const profit = revenue - costs;

    const maxPossibleProfit = (OPTIMAL_PRICE * (MAX_DEMAND - (PRICE_SENSITIVITY * (OPTIMAL_PRICE - 2)))) - (COST_PER_UNIT * (MAX_DEMAND - (PRICE_SENSITIVITY * (OPTIMAL_PRICE - 2))));

    const handleSimulateDay = () => {
        const entry = {
            day: history.length + 1,
            price,
            demand,
            profit,
            isOptimal: profit > maxPossibleProfit * 0.90 // 90% of max is good enough
        };

        const newHistory = [...history, entry];
        setHistory(newHistory);

        if (entry.isOptimal && history.length > 2) {
            setIsComplete(true);
            // Confetti or visual celebration here?
            setTimeout(() => {
                onComplete(100, { bestProfit: profit, history: newHistory });
            }, 2000);
        } else if (newHistory.length >= 10) {
            // Failed after 10 turns
            onComplete(50, { bestProfit: Math.max(...newHistory.map(h => h.profit)), history: newHistory });
        }
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl max-w-4xl mx-auto border-4 border-blue-500">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-black text-gray-800 dark:text-white flex items-center gap-2">
                        <TrendingUp className="text-blue-500" />
                        Supply & Demand Lab
                    </h2>
                    <p className="text-gray-500 font-bold">Find the best price to maximize profit!</p>
                </div>
                <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-4 py-2 rounded-xl font-black text-xl">
                    ${profit} Profit
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1">
                {/* CONTROLS */}
                <div className="md:col-span-1 bg-gray-50 dark:bg-gray-700 p-6 rounded-2xl flex flex-col gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-400 uppercase mb-2">Selling Price</label>
                        <div className="flex items-center gap-4">
                            <span className="text-4xl font-black text-blue-600 dark:text-blue-400">${price}</span>
                            <input
                                type="range"
                                min="2"
                                max="25"
                                step="1"
                                value={price}
                                onChange={(e) => setPrice(Number(e.target.value))}
                                disabled={isComplete}
                                className="w-full h-3 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border-2 border-gray-100 dark:border-gray-600">
                            <div className="text-xs font-bold text-gray-400 uppercase">Customers</div>
                            <div className="text-2xl font-black text-purple-500 flex items-center gap-2">
                                <Users size={20} /> {demand}
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border-2 border-gray-100 dark:border-gray-600">
                            <div className="text-xs font-bold text-gray-400 uppercase">Cost/Unit</div>
                            <div className="text-2xl font-black text-red-400 flex items-center gap-2">
                                <DollarSign size={20} /> {COST_PER_UNIT}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleSimulateDay}
                        disabled={isComplete}
                        className={`w-full py-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 transition-all shadow-lg
                             ${isComplete
                                ? 'bg-green-500 text-white cursor-default'
                                : 'bg-blue-600 hover:bg-blue-500 text-white hover:scale-105 active:scale-95'}
                        `}
                    >
                        {isComplete ? <><CheckCircle /> Optimal Found!</> : <><RefreshCw /> Test This Price</>}
                    </button>

                    <div className="text-xs text-gray-400 text-center font-bold">
                        {10 - history.length} turns remaining
                    </div>
                </div>

                {/* VISUALIZATION */}
                <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-4 border-2 border-gray-100 dark:border-gray-700 relative">
                    <h3 className="text-sm font-bold text-gray-400 uppercase mb-4 text-center">Profit Curve</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={history}>
                            <XAxis dataKey="day" stroke="#9CA3AF" />
                            <YAxis stroke="#9CA3AF" />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                            />
                            <ReferenceLine y={maxPossibleProfit} label="Goal" stroke="red" strokeDasharray="3 3" />
                            <Line type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>

                    {history.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl">
                            <p className="font-bold text-gray-500">Run a test to see data!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PricingTemplate;
