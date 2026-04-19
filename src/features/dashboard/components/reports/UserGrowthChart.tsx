import React, { useMemo } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { UserGrowthData } from '../../../../services/AnalyticsService';

interface Props {
    data: UserGrowthData[];
    isLoading: boolean;
}

export const UserGrowthChart: React.FC<Props> = ({ data, isLoading }) => {

    const formattedData = useMemo(() => {
        return data.map(item => ({
            ...item,
            formattedDate: new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
        }));
    }, [data]);

    if (isLoading) {
        return (
            <div className="h-64 flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-sm text-gray-500">
                No data available for the selected period
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">User Growth</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">New user registrations over time</p>
            </div>

            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={formattedData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis
                            dataKey="formattedDate"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                borderRadius: '8px',
                                border: 'none',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="count"
                            stroke="#3B82F6"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorGrowth)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
