import React from 'react';
import { Coins, Users, TrendingUp, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { EconomyStats } from '../../../../services/AnalyticsService';

interface Props {
    data: EconomyStats | null;
    isLoading: boolean;
}

export const EconomyHealth: React.FC<Props> = ({ data, isLoading }) => {

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-32 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
                ))}
            </div>
        );
    }

    if (!data) return null;

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD', // Using USD symbol to represent BizCoins efficiently
            maximumFractionDigits: 0
        }).format(val).replace('$', 'BZ ');
    };

    const stats = [
        {
            title: 'Money Supply',
            value: formatCurrency(data.total_supply ?? 0),
            icon: Coins,
            color: 'text-yellow-600',
            bg: 'bg-yellow-100 dark:bg-yellow-900/30',
            desc: 'Total BizCoins in circulation'
        },
        {
            title: 'Avg. Net Worth',
            value: formatCurrency(data.avg_balance_per_user ?? 0),
            icon: Wallet,
            color: 'text-blue-600',
            bg: 'bg-blue-100 dark:bg-blue-900/30',
            desc: 'Average coins per player'
        },
        {
            title: 'Total Players',
            value: (data.total_users ?? 0).toLocaleString(),
            icon: Users,
            color: 'text-purple-600',
            bg: 'bg-purple-100 dark:bg-purple-900/30',
            desc: 'Registered accounts'
        },
        {
            title: 'Active Tycoons',
            value: (data.tycoons_count ?? 0).toLocaleString(),
            icon: TrendingUp,
            color: 'text-green-600',
            bg: 'bg-green-100 dark:bg-green-900/30',
            desc: 'Players with > 5,000 BZ'
        }
    ];

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Coins className="w-5 h-5 text-yellow-500" />
                Economy Health
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-lg ${stat.bg}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            {/* Placeholder for trend indicator */}
                            <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                                <ArrowUpRight className="w-3 h-3 mr-1" />
                                Stable
                            </span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
                            <h4 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</h4>
                            <p className="text-xs text-gray-400 mt-1">{stat.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
