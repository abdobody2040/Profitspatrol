import React, { useMemo, useState } from 'react';
import { useAppStore } from '../../../store';
import { useEducationStore } from '../../../store/educationStore';
import { useTranslation } from 'react-i18next';
import { User, Classroom } from '../../../types';
import { Users, Building2, GraduationCap, TrendingUp, Key, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

interface PrincipalDashboardProps {
    onLogout: () => void;
}

const PrincipalDashboard: React.FC<PrincipalDashboardProps> = ({ onLogout }) => {
    const { user, users } = useAppStore();
    const { classrooms } = useEducationStore();
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'overview' | 'leaderboard' | 'licenses'>('overview');

    // Aggregate Data
    const stats = useMemo(() => {
        // In a real app, we'd filter by 'schoolId' or similar. 
        // For now, if they are a 'school_*' tier, we assume they own the school's teachers.
        // As a prototype, we'll just show all kids and teachers linked to this principal's "district".
        // Let's assume the principal's ID is tied to the teachers somehow.
        // For simplicity in this demo, we'll just grab all TEACHER and KID roles if Admin, 
        // or mock the data if not strictly linked yet.

        const teachers = users.filter(u => u.role === 'TEACHER');
        const kids = users.filter(u => u.role === 'KID');
        const activeClassrooms = classrooms.length;

        let seatLimit = 0;
        if (user?.subscriptionTier === 'school_small') seatLimit = 100;
        else if (user?.subscriptionTier === 'school_medium') seatLimit = 500;
        else if (user?.subscriptionTier === 'school_large') seatLimit = 2000;
        // Default high for admins
        if (user?.role === 'ADMIN') seatLimit = 5000;

        return {
            totalTeachers: teachers.length,
            totalStudents: kids.length,
            totalClassrooms: activeClassrooms,
            activeSeats: kids.length,
            seatLimit
        };
    }, [users, classrooms, user]);

    // Leaderboard Data
    const leaderboard = useMemo(() => {
        const sortedClassrooms = [...classrooms].map(c => {
            const classStudents = users.filter(u => u.role === 'KID' && u.classId === c.id);
            const totalXP = classStudents.reduce((sum, s) => sum + (s.xp || 0), 0);
            const teacher = users.find(u => u.id === c.teacherId);
            return {
                ...c,
                studentCount: classStudents.length,
                totalXP,
                teacherName: teacher ? teacher.name : 'Unknown'
            };
        }).sort((a, b) => b.totalXP - a.totalXP);
        return sortedClassrooms;
    }, [classrooms, users]);

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md">
                            <Building2 size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-gray-900">{t('principal.dashboard' as any, 'Principal Dashboard')}</h1>
                            <p className="text-xs font-bold text-gray-500">{t('principal.school_admin_portal' as any, 'School Admin Portal')}</p>
                        </div>
                    </div>

                    <button
                        onClick={onLogout}
                        className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors font-bold px-4 py-2 rounded-lg hover:bg-red-50"
                    >
                        <LogOut size={18} />
                        {(t as any)('common.logout')}

                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Welcome & Tabs */}
                <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 mb-2">Welcome back, {user.name}</h2>
                        <p className="text-gray-600 text-lg">Here's what's happening across your school today.</p>
                    </div>

                    <div className="flex bg-gray-200/50 p-1.5 rounded-xl self-start">
                        {[
                            { id: 'overview', label: 'Overview', icon: TrendingUp },
                            { id: 'leaderboard', label: 'Leaderboard', icon: GraduationCap },
                            { id: 'licenses', label: 'Licenses', icon: Key }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all
                                    ${activeTab === tab.id
                                        ? 'bg-white text-indigo-600 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6">
                                <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
                                    <Users size={32} />
                                </div>
                                <div>
                                    <p className="text-gray-500 font-bold mb-1">Total Students</p>
                                    <h3 className="text-4xl font-black text-gray-900">{stats.totalStudents}</h3>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6">
                                <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl">
                                    <GraduationCap size={32} />
                                </div>
                                <div>
                                    <p className="text-gray-500 font-bold mb-1">Active Teachers</p>
                                    <h3 className="text-4xl font-black text-gray-900">{stats.totalTeachers}</h3>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6">
                                <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
                                    <Building2 size={32} />
                                </div>
                                <div>
                                    <p className="text-gray-500 font-bold mb-1">Total Classrooms</p>
                                    <h3 className="text-4xl font-black text-gray-900">{stats.totalClassrooms}</h3>
                                </div>
                            </div>
                        </div>

                        {/* Additional widgets can go here */}
                    </motion.div>
                )}

                {/* LEADERBOARD TAB */}
                {activeTab === 'leaderboard' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                    >
                        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="text-xl font-black text-gray-900">Classroom Leaderboard</h3>
                            <p className="text-gray-500">Ranked by total XP earned</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold text-sm uppercase tracking-wider">
                                        <th className="p-4 pl-6">Rank</th>
                                        <th className="p-4">Classroom Name</th>
                                        <th className="p-4">Teacher</th>
                                        <th className="p-4">Students</th>
                                        <th className="p-4 pr-6 text-right">Total XP</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaderboard.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="p-8 text-center text-gray-500 font-medium">
                                                No active classrooms yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        leaderboard.map((cls, index) => (
                                            <tr key={cls.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                                <td className="p-4 pl-6 font-black text-gray-400">#{index + 1}</td>
                                                <td className="p-4 font-bold text-gray-900">{cls.name}</td>
                                                <td className="p-4 text-gray-600 font-medium">{cls.teacherName}</td>
                                                <td className="p-4 text-gray-600 font-medium">{cls.studentCount}</td>
                                                <td className="p-4 pr-6 text-right font-black text-indigo-600">
                                                    {cls.totalXP.toLocaleString()} XP
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}

                {/* LICENSES TAB */}
                {activeTab === 'licenses' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-2xl"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                                <Key size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-gray-900">License Utilization</h3>
                                <p className="text-gray-500">Manage your active school seats</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 mb-8">
                            <div className="flex justify-between items-end mb-2">
                                <div>
                                    <span className="text-sm font-bold text-gray-500 uppercase tracking-wide">Current Plan</span>
                                    <div className="text-xl font-black text-indigo-700 capitalize mt-1">
                                        {user.subscriptionTier ? user.subscriptionTier.replace('_', ' ') : 'None'}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-black text-gray-900">
                                        {stats.activeSeats} <span className="text-lg text-gray-500 font-bold">/ {stats.seatLimit}</span>
                                    </div>
                                    <div className="text-sm font-bold text-gray-500">Seats Used</div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="h-4 bg-gray-200 rounded-full mt-4 overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-1000 ${(stats.activeSeats / stats.seatLimit) > 0.9 ? 'bg-red-500' : 'bg-indigo-500'
                                        }`}
                                    style={{ width: `${Math.min(100, (stats.activeSeats / stats.seatLimit) * 100)}%` }}
                                />
                            </div>
                        </div>

                        <button className="w-full py-4 bg-indigo-50 text-indigo-700 font-black rounded-xl hover:bg-indigo-100 transition-colors border-2 border-indigo-100 hover:border-indigo-200">
                            Request Additional Seats
                        </button>
                    </motion.div>
                )}

            </main>
        </div>
    );
};

export default PrincipalDashboard;
