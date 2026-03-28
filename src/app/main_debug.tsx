/**
 * main_debug.tsx — PATCHED
 *
 * SECURITY PATCHES APPLIED:
 *  SEC-01: Replaced innerHTML concatenation with safe DOM API (createTextNode)
 *          to eliminate XSS. Error messages are now text-Only, not raw HTML.
 *  SEC-02: Removed bare console.log statements that leak stack traces and timestamps
 *          in production builds. Logger is used for structured, environment-aware output.
 *  SEC-03: Removed window.MigrationService and window.isSupabaseConfigured exposure.
 *          Global window object modifications bypass CSP and can be exploited by injected scripts.
 */

// SEC-01 PATCHED: Use safe DOM API — no innerHTML
function appendErrorBanner(title: string, body: string, borderColor: string) {
    const root = document.getElementById('root');
    if (!root) return;
    const wrapper = document.createElement('div');
    wrapper.style.cssText = `color:red;background:white;padding:20px;border:2px solid ${borderColor};`;
    const h = document.createElement('h3');
    h.textContent = title; // textContent is safe — no HTML parsing
    const p = document.createElement('pre');
    p.textContent = body;  // textContent is safe — no HTML parsing
    wrapper.appendChild(h);
    wrapper.appendChild(p);
    root.appendChild(wrapper);
}

// SEC-01 PATCHED: Global error handler now uses safe DOM ops
window.onerror = function (message, _source, _lineno, _colno, error) {
    appendErrorBanner('GLOBAL ERROR', `${message}\n${error?.stack || ''}`, 'red');
};

window.onunhandledrejection = function (event: PromiseRejectionEvent) {
    if (String(event.reason?.message || '').includes('chrome-extension')) return;
    appendErrorBanner('UNHANDLED PROMISE', String(event.reason), 'orange');
};

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from '../components/feedback/ErrorBoundary';
import { SoundProvider } from '../contexts/SoundContext';
import '../styles.css';

import { BrowserRouter } from 'react-router-dom';
import { supabaseAdapter } from '../services/persistence/SupabaseAdapter';
import { isSupabaseConfigured } from '../lib/supabase';
import { Logger } from '../services/logger';

// SEC-02 PATCHED: Removed bare console.log — use Logger for structured output only in dev
Logger.debug('main.tsx: imports loaded');

const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error('Could not find root element to mount to');
}

// Initialize Services
const initServices = async () => {
    if (isSupabaseConfigured()) {
        try {
            await supabaseAdapter.initialize();
            Logger.info('Supabase Initialized');
        } catch (e) {
            Logger.error('Supabase Init Failed', e);
        }
    }
};

initServices();

// SEC-03 PATCHED: Removed window.isSupabaseConfigured and window.MigrationService exposure.
// Debug utilities that expose internal service references to the global scope are an
// attack surface for injected scripts — they bypass CSP-enforced isolation.
// Use browser DevTools + import() in the REPL for one-off debugging instead.

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ErrorBoundary>
            <SoundProvider>
                <BrowserRouter>
                    <React.Suspense fallback={<div style={{ color: 'green', fontSize: '30px' }}>Loading...</div>}>
                        <App />
                    </React.Suspense>
                </BrowserRouter>
            </SoundProvider>
        </ErrorBoundary>
    </React.StrictMode>
);

Logger.debug('main.tsx: ReactDOM.createRoot render called');
