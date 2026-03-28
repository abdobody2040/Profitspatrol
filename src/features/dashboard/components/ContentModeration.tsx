import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAppStore } from '../../../store';
import { Violation, ViolationType, SeverityLevel } from '../../../services/ContentModerationService';
import { UserRole } from '../../../types';
import { Download, Filter, Search, Eye, CheckCircle, XCircle, AlertTriangle, TrendingUp, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Logger } from '../../../services/logger';

interface ModeratedContent {
    id: string;
    content_type: string;
    original_content: string;
    sanitized_content: string | null;
    violations: Violation[];
    severity: SeverityLevel;
    allowed: boolean;
    confidence: number;
    user_id: string | null;
    review_status: string;
    reviewed_by: string | null;
    reviewed_at: string | null;
    review_notes: string | null;
    created_at: string;
}

interface ModerationStats {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    byType: Record<ViolationType, number>;
    pending: number;
    reviewed: number;
}

interface FilterState {
    severity: SeverityLevel | 'all';
    violationType: ViolationType | 'all';
    reviewStatus: string;
    searchQuery: string;
    dateFrom: string;
    dateTo: string;
}

interface TimeSeriesData {
    date: string;
    count: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
}

export const ContentModeration: React.FC = () => {
    const { user } = useAppStore();
    const [stats, setStats] = useState<ModerationStats>({
        total: 0,
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        byType: {} as Record<ViolationType, number>,
        pending: 0,
        reviewed: 0,
    });
    const [flaggedContent, setFlaggedContent] = useState<ModeratedContent[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<FilterState>({
        severity: 'all',
        violationType: 'all',
        reviewStatus: 'all',
        searchQuery: '',
        dateFrom: '',
        dateTo: '',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedContent, setSelectedContent] = useState<ModeratedContent | null>(null);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
    const itemsPerPage = 20;

    // Fetch statistics
    const fetchStats = async () => {
        try {
            if (!supabase) return;

            const { data, error } = await supabase
                .from('moderated_content')
                .select('severity, violations, review_status');

            if (error) throw error;

            const newStats: ModerationStats = {
                total: data.length,
                critical: 0,
                high: 0,
                medium: 0,
                low: 0,
                byType: {
                    profanity: 0,
                    pii: 0,
                    violence: 0,
                    adult_content: 0,
                    hate_speech: 0,
                    self_harm: 0,
                },
                pending: 0,
                reviewed: 0,
            };

            data.forEach((item) => {
                // Count by severity
                newStats[item.severity as keyof typeof newStats]++;

                // Count by type
                if (item.violations && Array.isArray(item.violations)) {
                    item.violations.forEach((v: Violation) => {
                        newStats.byType[v.type]++;
                    });
                }

                // Count by review status
                if (item.review_status === 'pending') {
                    newStats.pending++;
                } else {
                    newStats.reviewed++;
                }
            });

            setStats(newStats);
        } catch (error) {
            // ✅ SECURITY FIX: Supabase errors expose DB schema — route through Logger
            Logger.error('ContentModeration: Error fetching stats', error);
        }
    };

    // Fetch flagged content
    const fetchFlaggedContent = async () => {
        setLoading(true);
        try {
            if (!supabase) return;

            let query = supabase
                .from('moderated_content')
                .select('*')
                .order('created_at', { ascending: false });

            // Apply filters
            if (filters.severity !== 'all') {
                query = query.eq('severity', filters.severity);
            }
            if (filters.reviewStatus !== 'all') {
                query = query.eq('review_status', filters.reviewStatus);
            }
            if (filters.dateFrom) {
                query = query.gte('created_at', filters.dateFrom);
            }
            if (filters.dateTo) {
                query = query.lte('created_at', filters.dateTo);
            }

            const { data, error } = await query;

            if (error) throw error;

            let filtered = data || [];

            // Client-side filtering for violation type and search
            if (filters.violationType !== 'all') {
                filtered = filtered.filter((item) =>
                    item.violations?.some((v: Violation) => v.type === filters.violationType)
                );
            }

            if (filters.searchQuery) {
                const query = filters.searchQuery.toLowerCase();
                filtered = filtered.filter((item) =>
                    item.original_content?.toLowerCase().includes(query)
                );
            }

            setFlaggedContent(filtered);
        } catch (error) {
            Logger.error('ContentModeration: Error fetching flagged content', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch time-series analytics
    const fetchAnalytics = async () => {
        try {
            if (!supabase) return;

            const { data, error } = await supabase
                .from('moderated_content')
                .select('created_at, severity')
                .order('created_at', { ascending: true });

            if (error) throw error;

            // Group by date
            const grouped = new Map<string, TimeSeriesData>();

            data.forEach((item) => {
                const date = new Date(item.created_at).toISOString().split('T')[0];

                if (!grouped.has(date)) {
                    grouped.set(date, {
                        date,
                        count: 0,
                        critical: 0,
                        high: 0,
                        medium: 0,
                        low: 0,
                    });
                }

                const dayData = grouped.get(date)!;
                dayData.count++;
                dayData[item.severity as keyof Omit<TimeSeriesData, 'date' | 'count'>]++;
            });

            // Get last 30 days
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const seriesData = Array.from(grouped.values())
                .filter((d) => new Date(d.date) >= thirtyDaysAgo)
                .sort((a, b) => a.date.localeCompare(b.date));

            setTimeSeriesData(seriesData);
        } catch (error) {
            Logger.error('ContentModeration: Error fetching analytics', error);
        }
    };

    // Bulk actions
    const toggleSelection = (id: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === paginatedContent.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(paginatedContent.map(item => item.id)));
        }
    };

    const handleBulkAction = async (action: string) => {
        if (user?.role !== UserRole.ADMIN) return;
        if (selectedIds.size === 0) {
            alert('Please select at least one item');
            return;
        }

        if (!confirm(`Are you sure you want to ${action} ${selectedIds.size} item(s)?`)) {
            return;
        }

        try {
            if (!supabase) return;

            const { error } = await supabase
                .from('moderated_content')
                .update({
                    review_status: action,
                    reviewed_by: user?.id,
                    reviewed_at: new Date().toISOString(),
                })
                .in('id', Array.from(selectedIds));

            if (error) throw error;

            fetchStats();
            fetchFlaggedContent();
            setSelectedIds(new Set());
        } catch (error) {
            Logger.error('ContentModeration: Error performing bulk action', error);
            alert('Error performing bulk action');
        }
    };

    const handleBulkExport = () => {
        if (selectedIds.size === 0) {
            alert('Please select at least one item to export');
            return;
        }

        const selectedItems = flaggedContent.filter(item => selectedIds.has(item.id));

        const headers = [
            'ID',
            'Date',
            'Content Type',
            'Severity',
            'Violation Types',
            'Original Content',
            'Sanitized Content',
            'Allowed',
            'Confidence',
            'Review Status',
        ];

        const rows = selectedItems.map((item) => [
            item.id,
            new Date(item.created_at).toISOString(),
            item.content_type,
            item.severity,
            item.violations?.map((v) => v.type).join('; ') || '',
            `"${item.original_content.replace(/"/g, '""')}"`,
            `"${item.sanitized_content?.replace(/"/g, '""') || ''}"`,
            item.allowed,
            item.confidence,
            item.review_status || 'pending',
        ]);

        const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `selected-content-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    // Real-time subscription
    useEffect(() => {
        if (!supabase) return;

        fetchStats();
        fetchFlaggedContent();
        fetchAnalytics();

        const subscription = supabase
            .channel('moderated_content_changes')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'moderated_content',
                },
                () => {
                    fetchStats();
                    fetchFlaggedContent();
                    fetchAnalytics();
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [filters]);

    // Export to CSV
    const handleExport = () => {
        const headers = [
            'ID',
            'Date',
            'Content Type',
            'Severity',
            'Violation Types',
            'Original Content',
            'Sanitized Content',
            'Allowed',
            'Confidence',
            'Review Status',
            'Reviewed By',
            'Review Notes',
        ];

        const rows = flaggedContent.map((item) => [
            item.id,
            new Date(item.created_at).toISOString(),
            item.content_type,
            item.severity,
            item.violations?.map((v) => v.type).join('; ') || '',
            `"${item.original_content.replace(/"/g, '""')}"`,
            `"${item.sanitized_content?.replace(/"/g, '""') || ''}"`,
            item.allowed,
            item.confidence,
            item.review_status || 'pending',
            item.reviewed_by || '',
            `"${item.review_notes?.replace(/"/g, '""') || ''}"`,
        ]);

        const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `moderation-report-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    // Update review status
    const handleReview = async (contentId: string, status: string, notes: string) => {
        if (user?.role !== UserRole.ADMIN) return;
        try {
            if (!supabase) return;

            const { error } = await supabase
                .from('moderated_content')
                .update({
                    review_status: status,
                    reviewed_by: user?.id,
                    reviewed_at: new Date().toISOString(),
                    review_notes: notes,
                })
                .eq('id', contentId);

            if (error) throw error;

            fetchStats();
            fetchFlaggedContent();
            setSelectedContent(null);
        } catch (error) {
            Logger.error('ContentModeration: Error updating review', error);
        }
    };

    // Pagination
    const totalPages = Math.ceil(flaggedContent.length / itemsPerPage);
    const paginatedContent = flaggedContent.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getSeverityColor = (severity: SeverityLevel) => {
        switch (severity) {
            case 'critical':
                return 'bg-red-100 text-red-800 border-red-300';
            case 'high':
                return 'bg-orange-100 text-orange-800 border-orange-300';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'low':
                return 'bg-green-100 text-green-800 border-green-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const getSeverityIcon = (severity: SeverityLevel) => {
        switch (severity) {
            case 'critical':
            case 'high':
                return <XCircle className="w-5 h-5" />;
            case 'medium':
                return <AlertTriangle className="w-5 h-5" />;
            case 'low':
                return <CheckCircle className="w-5 h-5" />;
            default:
                return null;
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Moderation</h1>
                <p className="text-gray-600">Monitor and manage flagged content</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Flagged</p>
                            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                        </div>
                        <div className="text-blue-500">🚩</div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Critical</p>
                            <p className="text-3xl font-bold text-gray-900">{stats.critical}</p>
                        </div>
                        <div className="text-red-500">🔴</div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">High</p>
                            <p className="text-3xl font-bold text-gray-900">{stats.high}</p>
                        </div>
                        <div className="text-orange-500">🟠</div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Pending Review</p>
                            <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
                        </div>
                        <div className="text-yellow-500">⏳</div>
                    </div>
                </div>
            </div>

            {/* Violation Type Breakdown */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Violation Type Breakdown</h2>
                    <button
                        onClick={() => setShowAnalytics(!showAnalytics)}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                    >
                        {showAnalytics ? <BarChart3 className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                        {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
                    </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {Object.entries(stats.byType).map(([type, count]) => (
                        <div key={type} className="text-center">
                            <p className="text-2xl font-bold text-gray-900">{count}</p>
                            <p className="text-sm text-gray-600 capitalize">{type.replace('_', ' ')}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Analytics Section */}
            {showAnalytics && (
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">30-Day Trend Analysis</h2>
                    {timeSeriesData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart data={timeSeriesData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 12 }}
                                    angle={-45}
                                    textAnchor="end"
                                    height={80}
                                />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="critical" stroke="#ef4444" strokeWidth={2} name="Critical" />
                                <Line type="monotone" dataKey="high" stroke="#f97316" strokeWidth={2} name="High" />
                                <Line type="monotone" dataKey="medium" stroke="#eab308" strokeWidth={2} name="Medium" />
                                <Line type="monotone" dataKey="low" stroke="#22c55e" strokeWidth={2} name="Low" />
                                <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} name="Total" />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                            <p>No data available for trend analysis</p>
                        </div>
                    )}
                </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-5 h-5 text-gray-600" />
                    <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                        <select
                            value={filters.severity}
                            onChange={(e) => setFilters({ ...filters, severity: e.target.value as any })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                            <option value="all">All</option>
                            <option value="critical">Critical</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Violation Type</label>
                        <select
                            value={filters.violationType}
                            onChange={(e) => setFilters({ ...filters, violationType: e.target.value as any })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                            <option value="all">All</option>
                            <option value="profanity">Profanity</option>
                            <option value="pii">PII</option>
                            <option value="violence">Violence</option>
                            <option value="adult_content">Adult Content</option>
                            <option value="hate_speech">Hate Speech</option>
                            <option value="self_harm">Self Harm</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Review Status</label>
                        <select
                            value={filters.reviewStatus}
                            onChange={(e) => setFilters({ ...filters, reviewStatus: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                            <option value="all">All</option>
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="false_positive">False Positive</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={filters.searchQuery}
                                onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                                placeholder="Search content..."
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        <Download className="w-4 h-4" />
                        Export to CSV
                    </button>
                </div>
            </div>

            {/* Bulk Actions Toolbar */}
            {selectedIds.size > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <p className="text-sm font-medium text-blue-900">
                                {selectedIds.size} item{selectedIds.size > 1 ? 's' : ''} selected
                            </p>
                            <button
                                onClick={() => setSelectedIds(new Set())}
                                className="text-sm text-blue-600 hover:text-blue-800 underline"
                            >
                                Clear selection
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleBulkAction('approved')}
                                title="Approve all selected items"
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                            >
                                Approve Selected
                            </button>
                            <button
                                onClick={() => handleBulkAction('rejected')}
                                title="Reject all selected items"
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                            >
                                Reject Selected
                            </button>
                            <button
                                onClick={() => handleBulkAction('false_positive')}
                                title="Mark selected items as false positives"
                                className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 text-sm"
                            >
                                Mark as False Positive
                            </button>
                            <button
                                onClick={handleBulkExport}
                                title="Download selected items as CSV"
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm flex items-center gap-2"
                            >
                                <Download className="w-4 h-4" />
                                Export Selected
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Flagged Content List */}
            <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {paginatedContent.length > 0 && (
                                <input
                                    type="checkbox"
                                    checked={selectedIds.size === paginatedContent.length && paginatedContent.length > 0}
                                    onChange={toggleSelectAll}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                            )}
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Flagged Content</h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    Showing {paginatedContent.length} of {flaggedContent.length} items
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="p-12 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="mt-2 text-gray-600">Loading...</p>
                    </div>
                ) : paginatedContent.length === 0 ? (
                    <div className="p-12 text-center">
                        <p className="text-gray-600">No flagged content found</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {paginatedContent.map((item) => (
                            <div key={item.id} className="p-6 hover:bg-gray-50">
                                <div className="flex gap-4">
                                    {/* Checkbox */}
                                    <div className="flex-shrink-0 pt-1">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.has(item.id)}
                                            onChange={() => toggleSelection(item.id)}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getSeverityColor(item.severity)}`}>
                                                    {getSeverityIcon(item.severity)}
                                                    {item.severity.toUpperCase()}
                                                </span>
                                                {item.violations?.map((v, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                                                    >
                                                        {v.type.replace('_', ' ')}
                                                    </span>
                                                ))}
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                {new Date(item.created_at).toLocaleString()}
                                            </span>
                                        </div>

                                        <div className="mb-3">
                                            <p className="text-sm font-medium text-gray-700 mb-1">Original Content:</p>
                                            <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded border border-gray-200">
                                                {item.original_content}
                                            </p>
                                        </div>

                                        {item.sanitized_content && (
                                            <div className="mb-3">
                                                <p className="text-sm font-medium text-gray-700 mb-1">Sanitized Content:</p>
                                                <p className="text-sm text-gray-900 bg-green-50 p-3 rounded border border-green-200">
                                                    {item.sanitized_content}
                                                </p>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                                <span>Confidence: {(item.confidence * 100).toFixed(0)}%</span>
                                                <span>Status: {item.review_status || 'pending'}</span>
                                            </div>
                                            <button
                                                onClick={() => setSelectedContent(item)}
                                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                                            >
                                                <Eye className="w-4 h-4" />
                                                Review
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="p-6 border-t border-gray-200 flex items-center justify-between">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-600">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            {/* Review Modal */}
            {selectedContent && (
                <ReviewModal
                    content={selectedContent}
                    onClose={() => setSelectedContent(null)}
                    onSubmit={handleReview}
                />
            )}
        </div>
    );
};

// Review Modal Component
const ReviewModal: React.FC<{
    content: ModeratedContent;
    onClose: () => void;
    onSubmit: (id: string, status: string, notes: string) => void;
}> = ({ content, onClose, onSubmit }) => {
    const [decision, setDecision] = useState('reviewed');
    const [notes, setNotes] = useState('');

    const handleSubmit = () => {
        onSubmit(content.id, decision, notes);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">Review Flagged Content</h2>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Original Content:</p>
                        <p className="text-sm text-gray-900 bg-gray-50 p-4 rounded border border-gray-200">
                            {content.original_content}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Violations Detected:</p>
                        <div className="space-y-2">
                            {content.violations?.map((v, idx) => (
                                <div key={idx} className="bg-red-50 p-3 rounded border border-red-200">
                                    <p className="text-sm">
                                        <span className="font-medium">Type:</span> {v.type.replace('_', ' ')}
                                    </p>
                                    <p className="text-sm">
                                        <span className="font-medium">Detected:</span> {v.detected}
                                    </p>
                                    <p className="text-sm">
                                        <span className="font-medium">Severity:</span> {v.severity}
                                    </p>
                                    <p className="text-sm">
                                        <span className="font-medium">Confidence:</span>{' '}
                                        {(v.confidence * 100).toFixed(0)}%
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Review Decision:</label>
                        <select
                            value={decision}
                            onChange={(e) => setDecision(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                            <option value="reviewed">Reviewed (No Action)</option>
                            <option value="approved">Approve (Override Detection)</option>
                            <option value="rejected">Reject (Confirm Violation)</option>
                            <option value="false_positive">Mark as False Positive</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Review Notes:</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add notes about this review decision..."
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>
                </div>

                <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Submit Review
                    </button>
                </div>
            </div>
        </div>
    );
};
