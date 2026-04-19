import React, { useState, useEffect } from 'react';
import { Download, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
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
        <div className="space-y-6 max-w-2xl">
            {/* Data Export Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                    <Download className="text-blue-600" size={24} />
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                        Export Your Data
                    </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Download all your personal data in JSON or CSV format. This includes your profile, progress, and settings.
                </p>

                {exportSuccess && (
                    <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-3 rounded-lg mb-4">
                        <CheckCircle size={20} />
                        <span className="font-bold">Export successful!</span>
                    </div>
                )}

                <div className="flex gap-3">
                    <button
                        onClick={handleExportJSON}
                        disabled={isExporting}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isExporting ? 'Exporting...' : 'Export as JSON'}
                    </button>
                    <button
                        onClick={handleExportCSV}
                        disabled={isExporting}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isExporting ? 'Exporting...' : 'Export as CSV'}
                    </button>
                </div>
            </div>

            {/* Account Deletion Section */}
            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border-2 border-red-200 dark:border-red-800">
                <div className="flex items-center gap-3 mb-4">
                    <Trash2 className="text-red-600 dark:text-red-400" size={24} />
                    <h3 className="text-xl font-bold text-red-800 dark:text-red-300">
                        Delete Account
                    </h3>
                </div>

                {deletionInfo.isScheduled ? (
                    <div className="space-y-4">
                        <div className="flex items-start gap-3 bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                            <AlertCircle className="text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" size={20} />
                            <div>
                                <p className="font-bold text-orange-800 dark:text-orange-300 mb-1">
                                    Account Deletion Scheduled
                                </p>
                                <p className="text-orange-700 dark:text-orange-400 text-sm">
                                    Your account will be permanently deleted in{' '}
                                    <span className="font-bold">{deletionInfo.daysRemaining} days</span>.
                                    You can cancel this request at any time before then.
                                </p>
                                {deletionInfo.scheduledFor && (
                                    <p className="text-orange-600 dark:text-orange-500 text-xs mt-2">
                                        Scheduled for: {new Date(deletionInfo.scheduledFor).toLocaleDateString()}
                                    </p>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={handleCancelDeletion}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors"
                        >
                            Cancel Deletion Request
                        </button>
                    </div>
                ) : (
                    <>
                        <p className="text-red-700 dark:text-red-400 mb-4">
                            Request permanent account deletion. Your data will be deleted after a 30-day grace period.
                            This action cannot be undone after the grace period expires.
                        </p>

                        {!showDeleteConfirm ? (
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors"
                            >
                                Request Deletion
                            </button>
                        ) : (
                            <div className="space-y-4 bg-white dark:bg-gray-800 p-4 rounded-lg border-2 border-red-300 dark:border-red-700">
                                <p className="font-bold text-gray-800 dark:text-white">
                                    Are you sure you want to delete your account?
                                </p>
                                <textarea
                                    value={deleteReason}
                                    onChange={(e) => setDeleteReason(e.target.value)}
                                    placeholder="Optional: Tell us why you're leaving (helps us improve)"
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none dark:bg-gray-700 dark:text-white"
                                    rows={3}
                                />
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            setShowDeleteConfirm(false);
                                            setDeleteReason('');
                                        }}
                                        className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleRequestDeletion}
                                        disabled={isDeleting}
                                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {isDeleting ? 'Processing...' : 'Confirm Deletion'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* GDPR Notice */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                    <strong>Your Privacy Rights:</strong> Under GDPR and COPPA regulations, you have the right to access,
                    export, and delete your personal data. We take your privacy seriously and are committed to protecting
                    your information.
                </p>
            </div>
        </div>
    );
};
