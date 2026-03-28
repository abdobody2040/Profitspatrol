import React from 'react';
import { useAppStore } from '../../../store';
import { HQ_LEVELS, SHOP_ITEMS, SKILLS_DB } from '../../../data/constants';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import { TrendingUp, PieChart as PieIcon, DollarSign, Briefcase } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const PortfolioAnalysis = () => {
    const { user } = useAppStore();

    if (!user) return null;

    // --- CALCULATE ASSETS ---
    const cash = user.bizCoins;

    // HQ Value: Sum of costs of all levels up to current
    const hqIndex = HQ_LEVELS.findIndex(h => h.id === user.hqLevel);
    const hqValue = HQ_LEVELS.reduce((acc, level, idx) => {
        if (idx <= (hqIndex === -1 ? 0 : hqIndex)) return acc + level.cost;
        return acc;
    }, 0) + 1000; // Base value

    // Inventory Value: Sum of costs of owned items
    const inventoryValue = user.inventory.reduce((acc, itemId) => {
        const item = SHOP_ITEMS.find(i => i.id === itemId);
        return acc + (item ? item.cost : 0);
    }, 0);

    // Skills Value: Sum of costs of unlocked skills
    const skillsValue = user.unlockedSkills.reduce((acc, skillId) => {
        const skill = SKILLS_DB.find(s => s.id === skillId);
        return acc + (skill ? skill.cost : 0);
    }, 0);

    const totalNetWorth = cash + hqValue + inventoryValue + skillsValue;

    const pieData = [
        { name: 'Cash', value: cash },
        { name: 'HQ Equity', value: hqValue },
        { name: 'Inventory', value: inventoryValue },
        { name: 'Skills', value: skillsValue }
    ].filter(d => d.value > 0);

    // --- MOCK HISTORY (Last 7 Days) ---
    // In a real app, this would be stored in db
    const historyData = Array.from({ length: 7 }).map((_, i) => {
        const factor = 1 - ((6 - i) * 0.1); // 0.4 to 1.0
        return {
            name: `Day ${i + 1}`,
            value: Math.floor(totalNetWorth * factor)
        };
    });

    return (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-8">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full text-blue-600 dark:text-blue-400">
                    <TrendingUp size={32} />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-gray-800 dark:text-white">Empire Valuation</h2>
                    <p className="text-gray-500 font-medium">Net Worth Analysis</p>
                </div>
                <div className="ml-auto text-right">
                    <div className="text-sm text-gray-500 font-bold uppercase tracking-wider">Total Net Worth</div>
                    <div className="text-3xl font-black text-green-500">${totalNetWorth.toLocaleString()}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-80">
                {/* LINE CHART: Growth */}
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 relative">
                    <h3 className="text-sm font-bold text-gray-400 absolute top-4 left-4 flex items-center gap-2">
                        <TrendingUp size={14} /> 7-Day Growth
                    </h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={historyData}>
                            <XAxis dataKey="name" hide />
                            <YAxis hide domain={['dataMin', 'dataMax']} />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Net Worth']}
                            />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#10b981"
                                strokeWidth={4}
                                dot={{ stroke: '#10b981', strokeWidth: 2, r: 4, fill: '#fff' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* PIE CHART: Allocation */}
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 relative flex items-center">
                    <h3 className="text-sm font-bold text-gray-400 absolute top-4 left-4 flex items-center gap-2">
                        <PieIcon size={14} /> Asset Allocation
                    </h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value: any) => `$${Number(value).toLocaleString()}`} />
                            <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Breakdown Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                {pieData.map((item, i) => (
                    <div key={item.name} className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div className="text-xs text-gray-500 font-bold uppercase mb-1" style={{ color: COLORS[i % COLORS.length] }}>
                            {item.name}
                        </div>
                        <div className="font-black text-lg text-gray-800 dark:text-white">
                            ${Math.floor(item.value).toLocaleString()}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PortfolioAnalysis;
