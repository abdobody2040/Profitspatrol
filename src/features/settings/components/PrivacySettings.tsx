import React, { useState, useEffect } from 'react';
import { Download, Trash2, AlertCircle, CheckCircle, Shield } from 'lucide-react';
import { DataExportService } from '../../../services/DataExportService';
import { AccountDeletionService } from '../../../services/AccountDeletionService';
import { useAppStore } from '../../../store';
import { Logger } from '../../../services/logger';

export const PrivacySettings: React.FC = () => {
    const { user } = useAppStore();
    const [isExporting, setIsExporting] = useState(false);
    const [exportSuccess, setExportSuccess] = useState(false);
    const [deletionInfo, setDeletionInfo] = useState<{
        isScheduled: boolean;
        daysRemaining: number | null;
        scheduledFor: string | null;
    }>({ isScheduled: false, daysRemaining: null, scheduledFor: null });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteReason, setDeleteReason] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (user) {
            loadDeletionInfo();
        }
    }, [user]);

    const loadDeletionInfo = async () => {
        if (!user) return;

        const info = await AccountDeletionService.getDeletionInfo(user.id);
        setDeletionInfo({
            isScheduled: info.isScheduled,
            daysRemaining: info.daysRemaining,
            scheduledFor: info.scheduledFor,
        });
    };

    const handleExportJSON = async () => {
        if (!user) return;

        setIsExporting(true);
        setExportSuccess(false);

        try {
            const blob = await DataExportService.exportAsJSON(user.id, user.id);
            const filename = DataExportService.generateFilename(user.id, 'json');
            DataExportService.downloadFile(blob, filename);

            setExportSuccess(true);
            Logger.info('Data exported as JSON', { userId: user.id });

            setTimeout(() => setExportSuccess(false), 3000);
        } catch (error) {
            Logger.error('Data export failed', error);
            alert('Failed to export data. Please try again.');
        } finally {
            setIsExporting(false);
        }
    };

    const handleExportCSV = async () => {
        if (!user) return;

        setIsExporting(true);
        setExportSuccess(false);

        try {
            const blob = await DataExportService.exportAsCSV(user.id, user.id);
            const filename = DataExportService.generateFilename(user.id, 'csv');
            DataExportService.downloadFile(blob, filename);

            setExportSuccess(true);
            Logger.info('Data exported as CSV', { userId: user.id });

            setTimeout(() => setExportSuccess(false), 3000);
        } catch (error) {
            Logger.error('Data export failed', error);
            alert('Failed to export data. Please try again.');
        } finally {
            setIsExporting(false);
        }
    };

    const handleRequestDeletion = async () => {
        if (!user) return;

        setIsDeleting(true);

        try {
            await AccountDeletionService.requestDeletion(user.id, deleteReason);
            await loadDeletionInfo();
            setShowDeleteConfirm(false);
            setDeleteReason('');
            Logger.info('Account deletion requested', { userId: user.id });
        } catch (error) {
            Logger.error('Failed to request deletion', error);
            alert('Failed to request account deletion. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCancelDeletion = async () => {
        if (!user) return;

        try {
            await AccountDeletionService.cancelDeletion(user.id, user.id);
            await loadDeletionInfo();
            Logger.info('Account deletion cancelled', { userId: user.id });
        } catch (error) {
            Logger.error('Failed to cancel deletion', error);
            alert('Failed to cancel account deletion. Please try again.');
        }
    };

    return (
        <div className="space-y-8 max-w-3xl">
            {/* Data Export Section */}
            <div className="bg-white dark:bg-gray-800 rounded-[32px] p-8 shadow-2xl border-4 border-gray-100 dark:border-gray-700 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 dark:bg-blue-900/30 rounded-bl-full opacity-20 group-hover:scale-110 transition-transform"></div>
                <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className="p-4 bg-blue-100 dark:bg-blue-900/50 rounded-2xl">
                        <Download className="text-blue-600 dark:text-blue-400" size={28} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-gray-800 dark:text-white tracking-tight">
                            Export Your Data
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 font-bold mt-1">
                            Download all your personal data in JSON or CSV format.
                        </p>
                    </div>
                </div>

                {exportSuccess && (
                    <div className="flex items-center gap-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-4 rounded-2xl mb-6 border-2 border-green-200 dark:border-green-800 shadow-sm relative z-10">
                        <CheckCircle size={24} className="animate-bounce" />
                        <span className="font-black">Export successful! Check your downloads.</span>
                    </div>
                )}

                <div className="flex flex-wrap gap-4 relative z-10">
                    <button
                        onClick={handleExportJSON}
                        disabled={isExporting}
                        className="btn-juicy bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-[0_4px_0_0_#2563eb] hover:shadow-[0_2px_0_0_#2563eb] hover:translate-y-[2px] disabled:opacity-50 disabled:translate-y-[4px] disabled:shadow-none transition-all"
                    >
                        {isExporting ? 'Exporting...' : 'Export as JSON'}
                    </button>
                    <button
                        onClick={handleExportCSV}
                        disabled={isExporting}
                        className="btn-juicy bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-[0_4px_0_0_#16a34a] hover:shadow-[0_2px_0_0_#16a34a] hover:translate-y-[2px] disabled:opacity-50 disabled:translate-y-[4px] disabled:shadow-none transition-all"
                    >
                        {isExporting ? 'Exporting...' : 'Export as CSV'}
                    </button>
                </div>
            </div>

            {/* Account Deletion Section */}
            <div className="bg-red-50 dark:bg-red-900/20 rounded-[32px] p-8 border-4 border-red-200 dark:border-red-800 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-200 dark:bg-red-800/50 rounded-bl-full opacity-20 group-hover:scale-110 transition-transform"></div>
                <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className="p-4 bg-red-100 dark:bg-red-900/50 rounded-2xl">
                        <Trash2 className="text-red-600 dark:text-red-400" size={28} />
                    </div>
                    <h3 className="text-2xl font-black text-red-800 dark:text-red-300 tracking-tight">
                        Delete Account
                    </h3>
                </div>

                {deletionInfo.isScheduled ? (
                    <div className="space-y-6 relative z-10">
                        <div className="flex items-start gap-4 bg-orange-50 dark:bg-orange-900/30 p-6 rounded-[24px] border-4 border-orange-200 dark:border-orange-800 shadow-sm">
                            <AlertCircle className="text-orange-600 dark:text-orange-400 flex-shrink-0 mt-1 animate-pulse" size={28} />
                            <div>
                                <p className="font-black text-orange-800 dark:text-orange-300 mb-2 text-lg">
                                    Account Deletion Scheduled
                                </p>
                                <p className="text-orange-700 dark:text-orange-400 font-bold">
                                    Your account will be permanently deleted in{' '}
                                    <span className="font-black text-orange-900 dark:text-orange-200">{deletionInfo.daysRemaining} days</span>.
                                    You can cancel this request at any time before then.
                                </p>
                                {deletionInfo.scheduledFor && (
                                    <p className="text-orange-600 dark:text-orange-500 font-bold text-sm mt-3 bg-orange-100 dark:bg-orange-900/50 inline-block px-3 py-1 rounded-lg">
                                        Scheduled for: {new Date(deletionInfo.scheduledFor).toLocaleDateString()}
                                    </p>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={handleCancelDeletion}
                            className="btn-juicy bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-[0_4px_0_0_#16a34a] hover:shadow-[0_2px_0_0_#16a34a] hover:translate-y-[2px] transition-all"
                        >
                            Cancel Deletion Request
                        </button>
                    </div>
                ) : (
                    <div className="relative z-10">
                        <p className="text-red-700 dark:text-red-400 mb-6 font-bold text-lg">
                            Request permanent account deletion. Your data will be deleted after a 30-day grace period.
                            This action cannot be undone after the grace period expires.
                        </p>

                        {!showDeleteConfirm ? (
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="btn-juicy bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-[0_4px_0_0_#dc2626] hover:shadow-[0_2px_0_0_#dc2626] hover:translate-y-[2px] transition-all"
                            >
                                Request Deletion
                            </button>
                        ) : (
                            <div className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-[24px] border-4 border-red-300 dark:border-red-700 shadow-xl">
                                <p className="font-black text-gray-800 dark:text-white text-lg">
                                    Are you absolutely sure you want to delete your account?
                                </p>
                                <textarea
                                    value={deleteReason}
                                    onChange={(e) => setDeleteReason(e.target.value)}
                                    placeholder="Optional: Tell us why you're leaving (helps us improve)"
                                    className="w-full p-4 border-4 border-gray-200 dark:border-gray-600 rounded-2xl resize-none dark:bg-gray-700 dark:text-white font-bold focus:border-red-400 focus:ring-4 focus:ring-red-400/20 outline-none transition-all"
                                    rows={3}
                                />
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => {
                                            setShowDeleteConfirm(false);
                                            setDeleteReason('');
                                        }}
                                        className="flex-1 btn-juicy bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-white px-6 py-3 rounded-2xl font-black flex items-center justify-center gap-2 shadow-[0_4px_0_0_#d1d5db] dark:shadow-[0_4px_0_0_#374151] hover:shadow-[0_2px_0_0_#d1d5db] dark:hover:shadow-[0_2px_0_0_#374151] hover:translate-y-[2px] transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleRequestDeletion}
                                        disabled={isDeleting}
                                        className="flex-1 btn-juicy bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-2xl font-black flex items-center justify-center gap-2 shadow-[0_4px_0_0_#dc2626] hover:shadow-[0_2px_0_0_#dc2626] hover:translate-y-[2px] disabled:opacity-50 disabled:translate-y-[4px] disabled:shadow-none transition-all"
                                    >
                                        {isDeleting ? 'Processing...' : 'Confirm Deletion'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* GDPR Notice */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-[24px] p-6 border-4 border-blue-200 dark:border-blue-800 flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-2xl shrink-0">
                    <Shield className="text-blue-600 dark:text-blue-400" size={24} />
                </div>
                <p className="text-sm font-bold text-blue-800 dark:text-blue-300 leading-relaxed">
                    <strong className="font-black text-base block mb-1">Your Privacy Rights:</strong> 
                    Under GDPR and COPPA regulations, you have the right to access,
                    export, and delete your personal data. We take your privacy seriously and are committed to protecting
                    your information.
                </p>
            </div>
        </div>
    );
};
