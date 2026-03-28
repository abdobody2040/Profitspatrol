import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Shield, AlertTriangle, Activity, Filter, RefreshCw, Download } from 'lucide-react';
import { Logger } from '../../../services/logger';

interface SecurityEvent {
    id: string;
    event_type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    user_id: string | null;
    session_id: string | null;
    event_data: Record<string, any>;
    ip_address: string | null;
    user_agent: string | null;
    created_at: string;
}

export const SecurityMonitoring = () => {
    const [events, setEvents] = useState<SecurityEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<{
        severity: string;
        eventType: string;
        timeRange: string;
    }>({
        severity: 'all',
        eventType: 'all',
        timeRange: '24h',
    });
    const [stats, setStats] = useState({
        total: 0,
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
    });

    useEffect(() => {
        fetchSecurityEvents();
        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchSecurityEvents, 30000);
        return () => clearInterval(interval);
    }, [filter]);

    const fetchSecurityEvents = async () => {
        setLoading(true);
        try {
            if (!supabase) {
                // ✅ SECURITY FIX: Reveal nothing about client init in console (use Logger)
                Logger.warn('SecurityMonitoring: Supabase client not initialized');
                return;
            }

            let query = supabase
                .from('security_events')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(100);

            // Apply filters
            if (filter.severity !== 'all') {
                query = query.eq('severity', filter.severity);
            }

            if (filter.eventType !== 'all') {
                query = query.eq('event_type', filter.eventType);
            }

            // Time range filter
            const now = new Date();
            let timeFilter: Date;
            switch (filter.timeRange) {
                case '1h':
                    timeFilter = new Date(now.getTime() - 60 * 60 * 1000);
                    break;
                case '24h':
                    timeFilter = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                    break;
                case '7d':
                    timeFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    break;
                case '30d':
                    timeFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    break;
                default:
                    timeFilter = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            }
            query = query.gte('created_at', timeFilter.toISOString());

            const { data, error } = await query;

            if (error) throw error;

            setEvents(data || []);

            // Calculate stats
            const allEvents = data || [];
            setStats({
                total: allEvents.length,
                critical: allEvents.filter(e => e.severity === 'critical').length,
                high: allEvents.filter(e => e.severity === 'high').length,
                medium: allEvents.filter(e => e.severity === 'medium').length,
                low: allEvents.filter(e => e.severity === 'low').length,
            });
        } catch (error) {
            Logger.error('SecurityMonitoring: Error fetching security events', error);
        } finally {
            setLoading(false);
        }
    };

    const exportToCSV = () => {
        const headers = ['Timestamp', 'Event Type', 'Severity', 'User ID', 'IP Address', 'Details'];
        const rows = events.map(event => [
            new Date(event.created_at).toLocaleString(),
            event.event_type,
            event.severity,
            event.user_id || 'Anonymous',
            event.ip_address || 'Unknown',
            JSON.stringify(event.event_data),
        ]);

        const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `security-events-${new Date().toISOString()}.csv`;
        a.click();
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return 'bg-red-100 text-red-800 border-red-300';
            case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
            case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'low': return 'bg-blue-100 text-blue-800 border-blue-300';
            default: return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const getEventTypeIcon = (eventType: string) => {
        switch (eventType) {
            case 'prompt_injection': return '🛡️';
            case 'profanity_detected': return '🚫';
            case 'pii_leak': return '🔒';
            case 'rate_limit_exceeded': return '⏱️';
            case 'content_violation': return '⚠️';
            case 'unauthorized_access': return '🔐';
            case 'suspicious_activity': return '👁️';
            default: return '📋';
        }
    };

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Shield className="w-8 h-8 text-blue-600" />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Security Monitoring</h1>
                        <p className="text-sm text-gray-600">Real-time security event tracking</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={fetchSecurityEvents}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </button>
                    <button
                        onClick={exportToCSV}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-gray-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Events</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                        </div>
                        <Activity className="w-8 h-8 text-gray-500" />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Critical</p>
                            <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
                        </div>
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">High</p>
                            <p className="text-2xl font-bold text-orange-600">{stats.high}</p>
                        </div>
                        <AlertTriangle className="w-8 h-8 text-orange-500" />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Medium</p>
                            <p className="text-2xl font-bold text-yellow-600">{stats.medium}</p>
                        </div>
                        <AlertTriangle className="w-8 h-8 text-yellow-500" />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Low</p>
                            <p className="text-2xl font-bold text-blue-600">{stats.low}</p>
                        </div>
                        <Activity className="w-8 h-8 text-blue-500" />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center gap-2 mb-3">
                    <Filter className="w-5 h-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">Filters</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                        <select
                            value={filter.severity}
                            onChange={(e) => setFilter({ ...filter, severity: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Severities</option>
                            <option value="critical">Critical</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                        <select
                            value={filter.eventType}
                            onChange={(e) => setFilter({ ...filter, eventType: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Types</option>
                            <option value="prompt_injection">Prompt Injection</option>
                            <option value="profanity_detected">Profanity</option>
                            <option value="pii_leak">PII Leak</option>
                            <option value="rate_limit_exceeded">Rate Limit</option>
                            <option value="content_violation">Content Violation</option>
                            <option value="unauthorized_access">Unauthorized Access</option>
                            <option value="suspicious_activity">Suspicious Activity</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
                        <select
                            value={filter.timeRange}
                            onChange={(e) => setFilter({ ...filter, timeRange: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="1h">Last Hour</option>
                            <option value="24h">Last 24 Hours</option>
                            <option value="7d">Last 7 Days</option>
                            <option value="30d">Last 30 Days</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Events List */}
            <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">Recent Security Events</h3>
                </div>
                <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">
                            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
                            Loading events...
                        </div>
                    ) : events.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <Shield className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>No security events found</p>
                            <p className="text-sm">Try adjusting your filters</p>
                        </div>
                    ) : (
                        events.map((event) => (
                            <div key={event.id} className="p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3 flex-1">
                                        <span className="text-2xl">{getEventTypeIcon(event.event_type)}</span>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-semibold text-gray-900">
                                                    {event.event_type.replace(/_/g, ' ').toUpperCase()}
                                                </h4>
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getSeverityColor(event.severity)}`}>
                                                    {event.severity.toUpperCase()}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-2">
                                                {new Date(event.created_at).toLocaleString()}
                                            </p>
                                            <div className="text-sm space-y-1">
                                                {event.user_id && (
                                                    <p className="text-gray-600">
                                                        <span className="font-medium">User ID:</span> {event.user_id.slice(0, 8)}...
                                                    </p>
                                                )}
                                                {event.ip_address && (
                                                    <p className="text-gray-600">
                                                        <span className="font-medium">IP:</span> {event.ip_address}
                                                    </p>
                                                )}
                                                {event.event_data && Object.keys(event.event_data).length > 0 && (
                                                    <details className="mt-2">
                                                        <summary className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium">
                                                            View Details
                                                        </summary>
                                                        <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-x-auto">
                                                            {JSON.stringify(event.event_data, null, 2)}
                                                        </pre>
                                                    </details>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
