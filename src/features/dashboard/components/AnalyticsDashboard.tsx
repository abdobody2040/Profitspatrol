import React, { useState } from 'react';
import { useAppStore } from '../../../store';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { Users, TrendingUp, BookOpen, Clock, Award } from 'lucide-react';
import { UserRole } from '../../../types';
import { useEducationStore } from "../../../store/educationStore";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AnalyticsDashboard: React.FC = () => {
    const { users } = useAppStore();
    const { classrooms, submissions, assignments, lessons } = useEducationStore();
    const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('7d');

    // --- REAL DATA AGGREGATION ---

    // 1. Role Distribution
    const roleDistribution = [
        { name: 'Students', value: users.filter(u => u.role === UserRole.KID).length },
        { name: 'Teachers', value: users.filter(u => u.role === UserRole.TEACHER).length },
        { name: 'Parents', value: users.filter(u => u.role === UserRole.PARENT).length },
    ].filter(d => d.value > 0);

    // 2. Subscription Tiers
    const subscriptionTiers = [
        { name: 'Intern (Free)', value: users.filter(u => u.subscriptionTier === 'intern').length },
        { name: 'Founder', value: users.filter(u => u.subscriptionTier === 'founder').length },
        { name: 'Board Member', value: users.filter(u => u.subscriptionTier === 'board').length },
        { name: 'Tycoon', value: users.filter(u => u.subscriptionTier === 'tycoon').length },
    ].filter(d => d.value > 0);

    // 3. User Engagement (Last 7 Days)
    const getEngagementData = () => {
        const days = 7;
        const data = [];
        const today = new Date();

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

            // Count submissions for this day
            const dailySubmissions = submissions.filter(s => s.submittedAt.startsWith(dateStr)).length;

            // Estimate logins via lastActivityDate (Approximate logic)
            const dailyActive = users.filter(u => u.lastActivityDate === dateStr).length;

            data.push({
                name: dayName,
                date: dateStr,
                logins: dailyActive,
                assignments: dailySubmissions
            });
        }
        return data;
    };

    const realEngagementData = getEngagementData();

    // 4. Module Performance (grouped by Assignment/Lesson)
    const getModulePerformance = () => {
        // Map assignments to their names
        const assignmentMap = new Map(); // id -> { name, totalScore, count }

        submissions.forEach(sub => {
            if (sub.status !== 'GRADED' || sub.grade === undefined) return;

            const assignment = assignments.find(a => a.id === sub.assignmentId);
            const name = assignment ? assignment.title : (sub.assignmentId || 'Unknown');

            if (!assignmentMap.has(name)) {
                assignmentMap.set(name, { totalScore: 0, count: 0 });
            }

            const entry = assignmentMap.get(name);
            entry.totalScore += sub.grade;
            entry.count += 1;
        });

        // Convert key-value to array
        const result = Array.from(assignmentMap.entries()).map(([name, data]) => ({
            name: name.length > 15 ? name.substring(0, 15) + '...' : name,
            fullName: name,
            avgScore: Math.round(data.totalScore / data.count),
            completions: data.count
        }));

        // Sort by completions
        return result.sort((a, b) => b.completions - a.completions).slice(0, 5); // Top 5
    };

    const realModulePerformance = getModulePerformance();

    // --- CALCULATIONS ---
    const totalRevenue = users.reduce((acc, user) => {
        // Mock revenue calculation based on tiers
        const price = user.subscriptionTier === 'tycoon' ? 29 :
            user.subscriptionTier === 'board' ? 19 :
                user.subscriptionTier === 'founder' ? 9 : 0;
        return acc + price;
    }, 0);

    const activeStudents = users.filter(u => {
        if (!u.lastActivityDate) return false;
        const lastActive = new Date(u.lastActivityDate);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return lastActive >= thirtyDaysAgo;
    }).length;

    const retentionRate = users.length > 0 ? Math.round((activeStudents / users.length) * 100) : 0;


    // --- EXPORT FUNCTION ---
    const handleExportCSV = () => {
        const headers = ["Date", "Day", "Active Users", "Submissions"];
        const rows = realEngagementData.map(d => [d.date, d.name, d.logins, d.assignments]);

        let csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\\n"
            + rows.map(e => e.join(",")).join("\\n");

        csvContent += "\\n\\nModule Performance\\nModule,Avg Score,Completions\\n";
        csvContent += realModulePerformance.map(m => `\${m.fullName},\${m.avgScore},\${m.completions}`).join("\\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `analytics_export_\${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-8">
            {/* Header Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-400 text-sm font-bold uppercase">Total Users</p>
                            <h3 className="text-3xl font-black text-gray-800">{users.length}</h3>
                        </div>
                        <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                            <Users size={24} />
                        </div>
                    </div>
                    <div className="mt-4 text-sm text-green-500 font-bold flex items-center gap-1">
                        <TrendingUp size={16} /> Live Data
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-400 text-sm font-bold uppercase">Assignments</p>
                            <h3 className="text-3xl font-black text-gray-800">{submissions.length}</h3>
                        </div>
                        <div className="bg-green-100 p-2 rounded-lg text-green-600">
                            <BookOpen size={24} />
                        </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-400 font-bold">
                        Avg completion rate {realModulePerformance.length > 0 ? Math.round(realModulePerformance.reduce((acc, curr) => acc + curr.avgScore, 0) / realModulePerformance.length) : 0}%
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-400 text-sm font-bold uppercase">Est. Revenue</p>
                            <h3 className="text-3xl font-black text-gray-800">${totalRevenue}</h3>
                        </div>
                        <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                            <Clock size={24} />
                        </div>
                    </div>
                    <div className="mt-4 text-sm text-green-500 font-bold flex items-center gap-1">
                        <TrendingUp size={16} /> Monthly Recurring
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-400 text-sm font-bold uppercase">Certificates</p>
                            <h3 className="text-3xl font-black text-gray-800">{users.filter(u => u.badges?.length > 0).reduce((acc, u) => acc + u.badges.length, 0)}</h3>
                        </div>
                        <div className="bg-yellow-100 p-2 rounded-lg text-yellow-600">
                            <Award size={24} />
                        </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-400 font-bold">
                        Total Badges Earned
                    </div>
                </div>
            </div>

            {/* Export Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleExportCSV}
                    className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 shadow-sm transition-all"
                >
                    <BookOpen size={16} /> Export Data (CSV)
                </button>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Engagement Chart */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">User Engagement (7 Days)</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={realEngagementData}>
                                <defs>
                                    <linearGradient id="colorLogins" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorAssignments" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <Tooltip />
                                <Legend />
                                <Area type="monotone" dataKey="logins" stroke="#8884d8" fillOpacity={1} fill="url(#colorLogins)" name="Active Users" />
                                <Area type="monotone" dataKey="assignments" stroke="#82ca9d" fillOpacity={1} fill="url(#colorAssignments)" name="Submitted Work" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Module Performance */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Module Performance (Top 5)</h3>
                    {realModulePerformance.length > 0 ? (
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={realModulePerformance} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                    <XAxis type="number" />
                                    <YAxis dataKey="name" type="category" width={100} />
                                    <Tooltip cursor={{ fill: 'transparent' }} />
                                    <Legend />
                                    <Bar dataKey="completions" fill="#FFC800" radius={[0, 4, 4, 0]} name="Completions" barSize={20} />
                                    <Bar dataKey="avgScore" fill="#4B5563" radius={[0, 4, 4, 0]} name="Avg Score %" barSize={10} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-80 w-full flex flex-col items-center justify-center text-gray-400">
                            <BookOpen size={48} className="mb-4 opacity-50" />
                            <p>No graded submissions yet.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Role Distribution */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">User Roles</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={roleDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {roleDistribution.map((entry, index) => (
                                        <Cell key={`cell-\${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Subscription Tiers */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Subscription Tiers</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={subscriptionTiers}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#82ca9d"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {subscriptionTiers.map((entry, index) => (
                                        <Cell key={`cell-\${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Retention */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 flex flex-col items-center justify-center text-center">
                    <div className="w-full">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Student Retention</h3>
                        <div className="text-5xl font-black text-blue-600 mb-2">{retentionRate}%</div>
                        <p className="text-gray-400 text-sm font-medium">Students active last 30 days</p>
                    </div>
                    <div className="w-full mt-6 pt-6 border-t border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Teacher NPS</h3>
                        <div className="text-5xl font-black text-green-600 mb-2">--</div>
                        <p className="text-gray-400 text-sm font-medium">Not enough data</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
