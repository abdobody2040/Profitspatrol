import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAppStore } from '../../../store';
import { Plus, Trash2, Edit, Check, X, AlertCircle } from 'lucide-react';
import { Logger } from '../../../services/logger';

interface WhitelistEntry {
    id: string;
    pattern: string;
    pattern_type: 'exact' | 'regex' | 'keyword';
    reason: string | null;
    added_by: string | null;
    created_at: string;
}

interface BlacklistEntry {
    id: string;
    pattern: string;
    pattern_type: 'exact' | 'regex' | 'keyword';
    severity: 'low' | 'medium' | 'high' | 'critical';
    reason: string | null;
    added_by: string | null;
    created_at: string;
}

export const WhitelistBlacklistManager: React.FC = () => {
    const { user } = useAppStore();
    const [activeTab, setActiveTab] = useState<'whitelist' | 'blacklist'>('whitelist');
    const [whitelist, setWhitelist] = useState<WhitelistEntry[]>([]);
    const [blacklist, setBlacklist] = useState<BlacklistEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingEntry, setEditingEntry] = useState<WhitelistEntry | BlacklistEntry | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        pattern: '',
        pattern_type: 'keyword' as 'exact' | 'regex' | 'keyword',
        severity: 'medium' as 'low' | 'medium' | 'high' | 'critical',
        reason: '',
    });

    // Fetch whitelist
    const fetchWhitelist = async () => {
        try {
            if (!supabase) {
                Logger.warn('WhitelistBlacklistManager: Supabase client not initialized');
                return;
            }
            const { data, error } = await supabase
                .from('moderation_whitelist')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setWhitelist(data || []);
        } catch (error) {
            Logger.error('WhitelistBlacklistManager: Error fetching whitelist', error);
        }
    };

    // Fetch blacklist
    const fetchBlacklist = async () => {
        try {
            if (!supabase) {
                Logger.warn('WhitelistBlacklistManager: Supabase client not initialized');
                return;
            }
            const { data, error } = await supabase
                .from('moderation_blacklist')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setBlacklist(data || []);
        } catch (error) {
            Logger.error('WhitelistBlacklistManager: Error fetching blacklist', error);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchWhitelist(), fetchBlacklist()]);
            setLoading(false);
        };
        loadData();
    }, []);

    // Add whitelist entry
    const handleAddWhitelist = async () => {
        // ✅ SECURITY FIX: Validate pattern length before saving.
        // ContentModerationService rejects regex patterns > 100 chars (ReDoS protection),
        // so saving longer patterns would silently never fire during moderation.
        if (!formData.pattern.trim()) return;
        if (formData.pattern_type === 'regex') {
            if (formData.pattern.length > 100) {
                alert('Regex patterns must be 100 characters or fewer to be enforced by the moderation engine.');
                return;
            }
            try {
                new RegExp(formData.pattern);
            } catch (e) {
                alert('Invalid regular expression pattern.');
                return;
            }
        }
        try {
            if (!supabase) {
                Logger.warn('WhitelistBlacklistManager: Supabase client not initialized');
                return;
            }
            const { error } = await supabase
                .from('moderation_whitelist')
                .insert({
                    pattern: formData.pattern,
                    pattern_type: formData.pattern_type,
                    reason: formData.reason || null,
                    added_by: user?.id,
                });

            if (error) throw error;

            await fetchWhitelist();
            setShowAddModal(false);
            resetForm();
        } catch (error) {
            Logger.error('WhitelistBlacklistManager: Error adding whitelist entry', error);
            alert('Error adding whitelist entry. Pattern may already exist.');
        }
    };

    // Add blacklist entry
    const handleAddBlacklist = async () => {
        if (!formData.pattern.trim()) return;
        if (formData.pattern_type === 'regex') {
            if (formData.pattern.length > 100) {
                alert('Regex patterns must be 100 characters or fewer to be enforced by the moderation engine.');
                return;
            }
            try {
                new RegExp(formData.pattern);
            } catch (e) {
                alert('Invalid regular expression pattern.');
                return;
            }
        }
        try {
            if (!supabase) {
                Logger.warn('WhitelistBlacklistManager: Supabase client not initialized');
                return;
            }
            const { error } = await supabase
                .from('moderation_blacklist')
                .insert({
                    pattern: formData.pattern,
                    pattern_type: formData.pattern_type,
                    severity: formData.severity,
                    reason: formData.reason || null,
                    added_by: user?.id,
                });

            if (error) throw error;

            await fetchBlacklist();
            setShowAddModal(false);
            resetForm();
        } catch (error) {
            Logger.error('WhitelistBlacklistManager: Error adding blacklist entry', error);
            alert('Error adding blacklist entry. Pattern may already exist.');
        }
    };

    // Delete whitelist entry
    const handleDeleteWhitelist = async (id: string) => {
        if (!confirm('Are you sure you want to remove this whitelist entry?')) return;

        try {
            if (!supabase) {
                Logger.warn('WhitelistBlacklistManager: Supabase client not initialized');
                return;
            }
            const { error } = await supabase
                .from('moderation_whitelist')
                .delete()
                .eq('id', id);

            if (error) throw error;
            await fetchWhitelist();
        } catch (error) {
            Logger.error('WhitelistBlacklistManager: Error deleting whitelist entry', error);
        }
    };

    // Delete blacklist entry
    const handleDeleteBlacklist = async (id: string) => {
        if (!confirm('Are you sure you want to remove this blacklist entry?')) return;

        try {
            if (!supabase) {
                Logger.warn('WhitelistBlacklistManager: Supabase client not initialized');
                return;
            }
            const { error } = await supabase
                .from('moderation_blacklist')
                .delete()
                .eq('id', id);

            if (error) throw error;
            await fetchBlacklist();
        } catch (error) {
            Logger.error('WhitelistBlacklistManager: Error deleting blacklist entry', error);
        }
    };

    const resetForm = () => {
        setFormData({
            pattern: '',
            pattern_type: 'keyword',
            severity: 'medium',
            reason: '',
        });
        setEditingEntry(null);
    };

    const openAddModal = () => {
        resetForm();
        setShowAddModal(true);
    };

    const getPatternTypeColor = (type: string) => {
        switch (type) {
            case 'exact':
                return 'bg-blue-100 text-blue-800';
            case 'regex':
                return 'bg-purple-100 text-purple-800';
            case 'keyword':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical':
                return 'bg-red-100 text-red-800';
            case 'high':
                return 'bg-orange-100 text-orange-800';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'low':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Whitelist & Blacklist Management</h2>
                        <p className="text-gray-600 mt-1">Manage approved and banned content patterns</p>
                    </div>
                    <button
                        onClick={openAddModal}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        <Plus className="w-4 h-4" />
                        Add Pattern
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveTab('whitelist')}
                        className={`px-4 py-2 rounded-lg font-bold transition-all ${activeTab === 'whitelist'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        Whitelist ({whitelist.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('blacklist')}
                        className={`px-4 py-2 rounded-lg font-bold transition-all ${activeTab === 'blacklist'
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        Blacklist ({blacklist.length})
                    </button>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="mt-2 text-gray-600">Loading...</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow">
                    {activeTab === 'whitelist' ? (
                        <div className="divide-y divide-gray-200">
                            {whitelist.length === 0 ? (
                                <div className="p-12 text-center text-gray-500">
                                    <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                    <p>No whitelist entries yet</p>
                                    <p className="text-sm mt-2">Add patterns that should bypass moderation</p>
                                </div>
                            ) : (
                                whitelist.map((entry) => (
                                    <div key={entry.id} className="p-6 hover:bg-gray-50">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPatternTypeColor(entry.pattern_type)}`}>
                                                        {entry.pattern_type}
                                                    </span>
                                                    <code className="px-3 py-1 bg-gray-100 rounded text-sm font-mono">
                                                        {entry.pattern}
                                                    </code>
                                                </div>
                                                {entry.reason && (
                                                    <p className="text-sm text-gray-600 mt-2">
                                                        <strong>Reason:</strong> {entry.reason}
                                                    </p>
                                                )}
                                                <p className="text-xs text-gray-500 mt-2">
                                                    Added {new Date(entry.created_at).toLocaleString()}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteWhitelist(entry.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {blacklist.length === 0 ? (
                                <div className="p-12 text-center text-gray-500">
                                    <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                    <p>No blacklist entries yet</p>
                                    <p className="text-sm mt-2">Add patterns that should always be blocked</p>
                                </div>
                            ) : (
                                blacklist.map((entry) => (
                                    <div key={entry.id} className="p-6 hover:bg-gray-50">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPatternTypeColor(entry.pattern_type)}`}>
                                                        {entry.pattern_type}
                                                    </span>
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(entry.severity)}`}>
                                                        {entry.severity}
                                                    </span>
                                                    <code className="px-3 py-1 bg-gray-100 rounded text-sm font-mono">
                                                        {entry.pattern}
                                                    </code>
                                                </div>
                                                {entry.reason && (
                                                    <p className="text-sm text-gray-600 mt-2">
                                                        <strong>Reason:</strong> {entry.reason}
                                                    </p>
                                                )}
                                                <p className="text-xs text-gray-500 mt-2">
                                                    Added {new Date(entry.created_at).toLocaleString()}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteBlacklist(entry.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900">
                                Add {activeTab === 'whitelist' ? 'Whitelist' : 'Blacklist'} Pattern
                            </h3>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Pattern</label>
                                <input
                                    type="text"
                                    value={formData.pattern}
                                    onChange={(e) => setFormData({ ...formData, pattern: e.target.value })}
                                    placeholder="Enter pattern..."
                                    maxLength={formData.pattern_type === 'regex' ? 100 : 500}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono"
                                />
                                {/* ✅ SECURITY FIX: Warn admin about the 100-char limit for regex patterns
                                    (enforced in ContentModerationService.isPatternMatch to prevent ReDoS) */}
                                {formData.pattern_type === 'regex' && (
                                    <p className="text-xs text-orange-600 mt-1">
                                        ⚠️ Regex patterns are limited to 100 characters to prevent ReDoS attacks.
                                        {formData.pattern.length > 80 && ` (${formData.pattern.length}/100)`}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Pattern Type</label>
                                <select
                                    value={formData.pattern_type}
                                    onChange={(e) => setFormData({ ...formData, pattern_type: e.target.value as any })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                >
                                    <option value="keyword">Keyword (contains)</option>
                                    <option value="exact">Exact Match</option>
                                    <option value="regex">Regular Expression</option>
                                </select>
                                <p className="text-xs text-gray-500 mt-1">
                                    {formData.pattern_type === 'keyword' && 'Matches if pattern appears anywhere in text'}
                                    {formData.pattern_type === 'exact' && 'Matches only if text exactly equals pattern'}
                                    {formData.pattern_type === 'regex' && 'Matches using regular expression syntax'}
                                </p>
                            </div>

                            {activeTab === 'blacklist' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
                                    <select
                                        value={formData.severity}
                                        onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="critical">Critical</option>
                                    </select>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Reason (Optional)</label>
                                <textarea
                                    value={formData.reason}
                                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                    placeholder="Why is this pattern being added?"
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    resetForm();
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={activeTab === 'whitelist' ? handleAddWhitelist : handleAddBlacklist}
                                disabled={!formData.pattern}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Add Pattern
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
