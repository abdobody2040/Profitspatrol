import React, { useState } from "react";
import { TrendingUp, DollarSign, Users, RefreshCw, CheckCircle, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface PricingTemplateProps {
    onComplete: (score: number, data: any) => void;
    config?: any;
}

const PricingTemplate: React.FC<PricingTemplateProps> = ({ onComplete, config }) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language.startsWith('ar');

    const [price, setPrice] = useState(5); // Default price
    const [history, setHistory] = useState<any[]>([]);
    const [isComplete, setIsComplete] = useState(false);

    // Simulation Constants (Hidden from user)
    const MAX_DEMAND = 100;
    const OPTIMAL_PRICE = 12; // The secret sweet spot
    const PRICE_SENSITIVITY = 4; // How fast demand drops
    const COST_PER_UNIT = 4; // Cost of Goods Sold

    // Calculate outcomes based on current price
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
            setTimeout(() => {
                onComplete(100, { bestProfit: profit, history: newHistory });
            }, 2000);
        } else if (newHistory.length >= 10) {
            // End after 10 turns
            onComplete(50, { bestProfit: Math.max(...newHistory.map(h => h.profit)), history: newHistory });
        }
    };

    return (
        <div 
            className="flex flex-col h-full bg-[#FAF5EE] dark:bg-gray-900 rounded-2xl md:rounded-3xl p-5 md:p-8 shadow-2xl max-w-4xl mx-auto border-4 border-amber-400 dark:border-amber-600 transition-colors"
            dir={isRTL ? "rtl" : "ltr"}
        >
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b-2 border-amber-200/60 dark:border-gray-700">
                <div>
                    <h2 className="text-xl md:text-3xl font-black text-slate-800 dark:text-white flex items-center gap-2.5">
                        <span className="p-2 rounded-xl bg-amber-500 text-white shadow-md">
                            <TrendingUp size={24} />
                        </span>
                        {t('games.pricing_lab.title', isRTL ? 'مختبر العرض والطلب' : 'Supply & Demand Lab')}
                    </h2>
                    <p className="text-slate-500 dark:text-gray-400 font-bold text-sm md:text-base mt-1">
                        {t('games.pricing_lab.subtitle', isRTL ? 'حدد السعر المثالي لزيادة مبيعاتك وأرباحك!' : 'Find the best price to maximize profit!')}
                    </p>
                </div>

                <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 border-2 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 font-black text-xl shadow-sm">
                    <Sparkles size={20} className="text-emerald-600 dark:text-emerald-400" />
                    <span>{profit >= 0 ? `+${profit}$` : `${profit}$`}</span>
                    <span className="text-xs font-extrabold uppercase opacity-80">
                        {t('games.pricing_lab.profit_label', isRTL ? 'أرباح' : 'Profit')}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
                {/* CONTROLS */}
                <div className="md:col-span-1 bg-white dark:bg-gray-800 p-5 md:p-6 rounded-2xl md:rounded-3xl border-2 border-amber-100 dark:border-gray-700 shadow-sm flex flex-col justify-between gap-5">
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <label className="text-xs md:text-sm font-black text-slate-500 dark:text-gray-400 uppercase tracking-wider">
                                {t('games.pricing_lab.selling_price', isRTL ? 'سعر البيع' : 'Selling Price')}
                            </label>
                            <span className="text-2xl md:text-4xl font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-3 py-1 rounded-xl border border-amber-200 dark:border-amber-800">
                                ${price}
                            </span>
                        </div>
                        <input
                            type="range"
                            min="2"
                            max="25"
                            step="1"
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                            disabled={isComplete}
                            className="w-full h-3 bg-amber-100 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:accent-amber-600 transition-all"
                        />
                        <div className="flex justify-between text-[11px] font-bold text-slate-400 mt-1">
                            <span>$2</span>
                            <span>$25</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-purple-50 dark:bg-purple-950/40 p-3.5 rounded-2xl border-2 border-purple-200 dark:border-purple-800/60">
                            <div className="text-[11px] font-black text-purple-700 dark:text-purple-300 uppercase">
                                {t('games.pricing_lab.customers', isRTL ? 'الزبائن' : 'Customers')}
                            </div>
                            <div className="text-xl md:text-2xl font-black text-purple-900 dark:text-purple-100 flex items-center gap-1.5 mt-1">
                                <Users size={18} className="text-purple-600 dark:text-purple-400" />
                                <span>{demand}</span>
                            </div>
                        </div>

                        <div className="bg-rose-50 dark:bg-rose-950/40 p-3.5 rounded-2xl border-2 border-rose-200 dark:border-rose-800/60">
                            <div className="text-[11px] font-black text-rose-700 dark:text-rose-300 uppercase">
                                {t('games.pricing_lab.cost_per_unit', isRTL ? 'تكلفة الوحدة' : 'Cost/Unit')}
                            </div>
                            <div className="text-xl md:text-2xl font-black text-rose-900 dark:text-rose-100 flex items-center gap-1.5 mt-1">
                                <DollarSign size={18} className="text-rose-600 dark:text-rose-400" />
                                <span>${COST_PER_UNIT}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2 mt-auto">
                        <button
                            type="button"
                            onClick={handleSimulateDay}
                            disabled={isComplete}
                            className={`w-full py-4 px-5 rounded-2xl font-black text-base md:text-lg flex items-center justify-center gap-2.5 transition-all select-none cursor-pointer
                                ${isComplete
                                    ? 'bg-emerald-500 text-white shadow-[0_5px_0_#047857] cursor-default'
                                    : 'bg-gradient-to-b from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-amber-950 shadow-[0_5px_0_#b45309] hover:shadow-[0_6px_0_#92400e] active:translate-y-1 active:shadow-[0_1px_0_#92400e]'}
                            `}
                        >
                            {isComplete ? (
                                <>
                                    <CheckCircle size={22} />
                                    <span>{t('games.pricing_lab.optimal_found', isRTL ? 'تم العثور على السعر المثالي!' : 'Optimal Found!')}</span>
                                </>
                            ) : (
                                <>
                                    <RefreshCw size={20} className="transition-transform group-hover:rotate-180" />
                                    <span>{t('games.pricing_lab.test_price', isRTL ? 'اختبر هذا السعر' : 'Test This Price')}</span>
                                </>
                            )}
                        </button>

                        <div className="text-xs text-slate-500 dark:text-gray-400 text-center font-extrabold pt-1">
                            {10 - history.length} {t('games.pricing_lab.turns_remaining', isRTL ? 'محاولات متبقية' : 'turns remaining')}
                        </div>
                    </div>
                </div>

                {/* VISUALIZATION */}
                <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-2xl md:rounded-3xl p-5 border-2 border-amber-100 dark:border-gray-700 shadow-sm relative flex flex-col">
                    <h3 className="text-xs md:text-sm font-black text-slate-600 dark:text-gray-300 uppercase mb-4 text-center tracking-wider">
                        {t('games.pricing_lab.profit_curve', isRTL ? 'منحنى الأرباح والنمو' : 'Profit Curve')}
                    </h3>
                    
                    <div className="flex-1 min-h-[260px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={history} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                                <XAxis 
                                    dataKey="day" 
                                    stroke="#94A3B8" 
                                    tick={{ fill: '#64748B', fontWeight: 700 }}
                                />
                                <YAxis 
                                    stroke="#94A3B8" 
                                    tick={{ fill: '#64748B', fontWeight: 700 }}
                                />
                                <Tooltip
                                    contentStyle={{ 
                                        borderRadius: '16px', 
                                        border: '2px solid #E2E8F0', 
                                        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.08)',
                                        fontWeight: 800,
                                        fontFamily: 'Cairo, Nunito, sans-serif'
                                    }}
                                    formatter={(value: any) => [`$${value}`, t('games.pricing_lab.profit_label', isRTL ? 'الربح' : 'Profit')]}
                                    labelFormatter={(label: any) => `${t('common.turn', isRTL ? 'المحاولة' : 'Turn')} ${label}`}
                                />
                                <ReferenceLine 
                                    y={maxPossibleProfit} 
                                    label={{ 
                                        value: t('games.pricing_lab.goal', isRTL ? 'الهدف الأقصى' : 'Goal'), 
                                        fill: '#EF4444', 
                                        fontWeight: 900,
                                        position: 'insideTopRight' 
                                    }} 
                                    stroke="#EF4444" 
                                    strokeDasharray="4 4" 
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="profit" 
                                    stroke="#10B981" 
                                    strokeWidth={4} 
                                    dot={{ r: 6, fill: '#10B981', stroke: '#ffffff', strokeWidth: 2 }} 
                                    activeDot={{ r: 9, fill: '#059669' }} 
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {history.length === 0 && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 dark:bg-gray-800/80 backdrop-blur-xs rounded-2xl md:rounded-3xl p-6 text-center">
                            <span className="text-4xl mb-2">📊</span>
                            <p className="font-black text-slate-600 dark:text-gray-300 text-sm md:text-base">
                                {t('games.pricing_lab.run_test', isRTL ? 'جرّب سعراً واضغط "اختبر هذا السعر" لرؤية الأرباح!' : 'Run a test to see data on the chart!')}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PricingTemplate;
