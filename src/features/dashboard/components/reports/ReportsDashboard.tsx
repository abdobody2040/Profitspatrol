import React, { useState, useEffect } from 'react';
import { AnalyticsService, UserGrowthData, EconomyStats, LearningStats } from '../../../../services/AnalyticsService';
import { UserGrowthChart } from './UserGrowthChart';
import { EconomyHealth } from './EconomyHealth';
import { LearningInsights } from './LearningInsights';
import { Download, Calendar, RefreshCw } from 'lucide-react';
import { Logger } from '../../../../services/logger';

export const ReportsDashboard: React.FC = () => {
    const [daysLookback, setDaysLookback] = useState(30);
    const [isLoading, setIsLoading] = useState(true);
    const [userGrowth, setUserGrowth] = useState<UserGrowthData[]>([]);
    const [economyStats, setEconomyStats] = useState<EconomyStats | null>(null);
    const [learningStats, setLearningStats] = useState<LearningStats[]>([]);

    useEffect(() => {
        loadData();
    }, [daysLookback]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [users, economy, learning] = await Promise.all([
                AnalyticsService.fetchUserGrowth(daysLookback),
                AnalyticsService.fetchEconomyStats(),
                AnalyticsService.fetchLearningStats(daysLookback)
            ]);

            setUserGrowth(users);
            setEconomyStats(economy);
            setLearningStats(learning);
        } catch (error) {
            Logger.error("Failed to load analytics data", { error });
        } finally {
            setIsLoading(false);
        }
    };

    const handleExport = () => {
        // Simple CSV Export Logic
        const rows = [
            ['Report Type', 'Date', 'Value', 'Metric'],
            ...userGrowth.map(u => ['User Growth', u.date, u.count.toString(), 'New Users']),
            ...learningStats.map(l => ['Learning', l.date, l.avg_grade.toString(), 'Avg Grade']),
            ...learningStats.map(l => ['Learning', l.date, l.submissions_count.toString(), 'Submissions'])
        ];

        // Add Economy Snapshot
        if (economyStats) {
            rows.push(['Economy', new Date().toISOString().split('T')[0], economyStats.total_supply.toString(), 'Total Supply']);
            rows.push(['Economy', new Date().toISOString().split('T')[0], economyStats.avg_balance_per_user.toString(), 'Avg Balance']);
        }

        const csvContent = "data:text/csv;charset=utf-8,"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `analytics_report_${daysLookback}days_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Platform Analytics</h1>
                    <p className="text-gray-500 dark:text-gray-400">Insights into engagement, economy, and education</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Calendar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <select
                            value={daysLookback}
                            onChange={(e) => setDaysLookback(Number(e.target.value))}
                            className="pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 app-subtitle"
                        >
                            <option value={7}>Last 7 Days</option>
                            <option value={30}>Last 30 Days</option>
                            <option value={90}>Last 90 Days</option>
                        </select>
                    </div>

                    <button
                        onClick={() => loadData()}
                        className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        title="Refresh Data"
                    >
                        <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>

                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                    >
                        <Download className="w-4 h-4" />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Economy Stats */}
            <section>
                <EconomyHealth data={economyStats} isLoading={isLoading} />
            </section>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <section>
                    <UserGrowthChart data={userGrowth} isLoading={isLoading} />
                </section>
                <section>
                    <LearningInsights data={learningStats} isLoading={isLoading} />
                </section>
            </div>
        </div>
    );
};
