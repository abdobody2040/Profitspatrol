import React, { useMemo } from 'react';
import {
    ComposedChart,
    Line,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { LearningStats } from '../../../../services/AnalyticsService';
import { GraduationCap } from 'lucide-react';

interface Props {
    data: LearningStats[];
    isLoading: boolean;
}

export const LearningInsights: React.FC<Props> = ({ data, isLoading }) => {

    const formattedData = useMemo(() => {
        return data.map(item => ({
            ...item,
            formattedDate: new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
        }));
    }, [data]);

    if (isLoading) {
        return (
            <div className="h-80 flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="h-80 flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-sm text-gray-500">
                No learning data available for the selected period
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-indigo-500" />
                        Learning Outcomes
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Quiz performance vs. completion volume</p>
                </div>
            </div>

            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                        data={formattedData}
                        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    >
                        <CartesianGrid stroke="#f5f5f5" vertical={false} />
                        <XAxis
                            dataKey="formattedDate"
                            scale="point"
                            padding={{ left: 10, right: 10 }}
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            yAxisId="left"
                            label={{ value: 'Submissions', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            domain={[0, 100]}
                            label={{ value: 'Avg Grade (%)', angle: 90, position: 'insideRight', fill: '#9CA3AF' }}
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                borderRadius: '8px',
                                border: 'none',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <Bar yAxisId="left" dataKey="submissions_count" name="Submissions" barSize={20} fill="#818CF8" radius={[4, 4, 0, 0]} />
                        <Line yAxisId="right" type="monotone" dataKey="avg_grade" name="Avg. Grade" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
