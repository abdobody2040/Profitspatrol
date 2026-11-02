
// Suppress Chrome extension errors in development
if (import.meta.env.DEV) {
  // Suppress unhandled promise rejections from extensions
  window.addEventListener('unhandledrejection', (event) => {
    if (
      event.reason?.message?.includes('message channel closed') ||
      event.reason?.message?.includes('Extension context') ||
      event.reason?.message?.includes('chrome-extension://')
    ) {
      event.preventDefault();
      // Silently suppress - no console output
    }
  });

  // Suppress console errors from extensions
  const originalError = console.error;
  console.error = (...args: any[]) => {
    const message = args.join(' ');
    if (
      message.includes('chrome-extension://') ||
      message.includes('background.js') ||
      message.includes('Extension context') ||
      message.includes('web_accessible_resources')
    ) {
      // Silently suppress extension errors
      return;
    }
    originalError.apply(console, args);
  };
}

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from '../components/feedback/ErrorBoundary';
import { SoundProvider } from '../contexts/SoundContext';
import '../styles.css';
import '../theme.css';

import { BrowserRouter } from 'react-router-dom';
import { laravelAdapter } from '../services/persistence/LaravelAdapter';
import { api } from '../lib/api';
import { Logger } from '../services/logger';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Initialize Services
const initServices = async () => {
  try {
    await laravelAdapter.initialize();
    Logger.info("Laravel SQLite Backend Initialized");
  } catch (e) {
    Logger.error("Laravel Backend Init Failed", e);
  }
};

initServices();

// Expose checks and services for Console Debugging
(window as any).laravelAdapter = laravelAdapter;
(window as any).api = api;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <SoundProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SoundProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
