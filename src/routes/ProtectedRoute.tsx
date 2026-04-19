import React from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { useAppStore } from '../store';
import { useEducationStore } from '../store/educationStore';
import { UserRole } from '../types';
import Layout from '../components/layout/Layout';
import { Lock } from 'lucide-react';
import { Logger } from '../services/logger';
import DynamicPage from '../features/marketing/components/DynamicPage';

// Helper components defined outside to prevent remounts
export const ProtectedRoute = ({ children, onNavigate, lockoutEnabled = false }: { children: JSX.Element, onNavigate: (path: string) => void, lockoutEnabled?: boolean }) => {
    const { user } = useAppStore();
    const { classrooms } = useEducationStore();
    const location = useLocation();

    const getActiveTab = () => {
        const path = location.pathname.substring(1);
        if (path === 'dashboard') return 'parent_dashboard';
        if (path === 'classroom' || path === 'principal') return 'teacher_dashboard';
        if (path === 'admin') return 'admin_dashboard';
        if (path === '') return 'map';
        return path;
    };

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // School Hours Lockout Check
    if (lockoutEnabled && user.role === UserRole.KID && user.classId) {
        const classroom = classrooms.find((c: any) => c.id === user.classId);
        if (classroom?.schoolHoursOnly) {
            const now = new Date();
            const hours = now.getHours();
            const day = now.getDay();
            // Monday-Friday (1-5), 8:00 AM to 2:59 PM (hours 8 to 14)
            if (day >= 1 && day <= 5 && hours >= 8 && hours < 15) {
                return (
                    <Layout activeTab={getActiveTab()} onNavigate={onNavigate}>
                        <div className="flex flex-col items-center justify-center p-20 text-center min-h-[60vh]">
                            <div className="w-24 h-24 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-6 mx-auto">
                                <Lock size={48} />
                            </div>
                            <h2 className="text-3xl font-black text-gray-800 mb-4">School Hours Active</h2>
                            <p className="text-gray-500 font-medium max-w-md mx-auto">
                                Your teacher has restricted access to games, stores, and social features during school hours (8 AM - 3 PM). Return to the Map to complete your assignments!
                            </p>
                            <button onClick={() => onNavigate('/map')} className="mt-8 px-6 py-3 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 transition-colors shadow-lg">
                                Back to Learning Map
                            </button>
                        </div>
                    </Layout>
                );
            }
        }
    }

    return (
        <Layout activeTab={getActiveTab()} onNavigate={onNavigate}>
            {children}
        </Layout>
    );
};

export const RoleProtectedRoute = ({
    children,
    onNavigate,
    allowedRoles,
    lockoutEnabled = false
}: {
    children: JSX.Element,
    onNavigate: (path: string) => void,
    allowedRoles: UserRole[],
    lockoutEnabled?: boolean
}) => {
    const { user } = useAppStore();
    const location = useLocation();

    // Not authenticated — redirect to login
    if (!user) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    // Authenticated but wrong role — redirect to home with warning
    if (!allowedRoles.includes(user.role as UserRole)) {
        Logger.warn('[Security] Unauthorized route access blocked', {
            userId: user.id,
            userRole: user.role,
            path: location.pathname,
            allowedRoles
        });
        return <Navigate to="/map" replace />;
    }

    return (
        <ProtectedRoute onNavigate={onNavigate} lockoutEnabled={lockoutEnabled}>
            {children}
        </ProtectedRoute>
    );
};

export const DynamicPageWrapper = ({ cmsContent, onBack }: any) => {
    const { slug } = useParams();
    // @ts-ignore
    const page = cmsContent.customPages.find((p: any) => p.slug === slug);

    if (page) {
        return <DynamicPage page={page} onBack={onBack} />;
    }
    return <div className="p-10 text-center">Page not found. <button onClick={onBack} className="text-blue-500 underline">Go Home</button></div>;
};
