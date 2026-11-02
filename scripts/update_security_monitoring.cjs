const fs = require('fs');
const filePath = 'src/features/admin/components/SecurityMonitoring.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const sampleEventsDef = `
const SAMPLE_SECURITY_EVENTS: SecurityEvent[] = [
    {
        id: 'sec_1',
        event_type: 'rate_limit_exceeded',
        severity: 'medium',
        user_id: 'user_dev_01',
        session_id: 'sess_1',
        event_data: { endpoint: '/api/v1/projects/submit', attempts: 5 },
        ip_address: '127.0.0.1',
        user_agent: 'Mozilla/5.0 Chrome',
        created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString()
    },
    {
        id: 'sec_2',
        event_type: 'prompt_injection',
        severity: 'high',
        user_id: null,
        session_id: 'sess_2',
        event_data: { prompt: 'System prompt override attempt blocked by AI firewall' },
        ip_address: '127.0.0.1',
        user_agent: 'Mozilla/5.0 Chrome',
        created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString()
    },
    {
        id: 'sec_3',
        event_type: 'unauthorized_access',
        severity: 'low',
        user_id: null,
        session_id: 'sess_3',
        event_data: { route: '/admin', redirect: '/login' },
        ip_address: '127.0.0.1',
        user_agent: 'Mozilla/5.0 Chrome',
        created_at: new Date(Date.now() - 1000 * 60 * 300).toISOString()
    }
];
`;

if (!content.includes('SAMPLE_SECURITY_EVENTS')) {
    content = content.replace('export const SecurityMonitoring = () => {', sampleEventsDef + '\nexport const SecurityMonitoring = () => {');
}

// Update fetchSecurityEvents to handle errors gracefully with SAMPLE_SECURITY_EVENTS
const oldFetch = `            if (!supabase) {
                // ✅ SECURITY FIX: Reveal nothing about client init in console (use Logger)
                Logger.warn('SecurityMonitoring: Supabase client not initialized');
                return;
            }`;

const newFetch = `            // Use local mock security events when Supabase is not available
            if (!supabase || window.location.hostname === 'localhost') {
                let filtered = [...SAMPLE_SECURITY_EVENTS];
                if (filter.severity !== 'all') filtered = filtered.filter(e => e.severity === filter.severity);
                if (filter.eventType !== 'all') filtered = filtered.filter(e => e.event_type === filter.eventType);
                setEvents(filtered);
                calculateStats(filtered);
                setLoading(false);
                return;
            }`;

content = content.replace(oldFetch, newFetch);
fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated SecurityMonitoring.tsx');
