/**
 * ErrorBoundary Component
 * Catches React errors and prevents white screen crashes
 */

import React from 'react';
import { Logger } from '../services/logger';

interface Props {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
    errorInfo?: React.ErrorInfo;
}

export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Log error to monitoring service
        Logger.error('React Error Boundary caught error', {
            error: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack,
            timestamp: new Date().toISOString()
        });

        this.setState({ errorInfo });

        // In production, send to Sentry or similar
        if (import.meta.env.PROD) {
            // TODO: Send to error monitoring service
            // if (window.Sentry) {
            //   window.Sentry.captureException(error, {
            //     contexts: { react: { componentStack: errorInfo.componentStack } }
            //   });
            // }
        }
    }

    handleReset = () => {
        this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    };

    render() {
        if (this.state.hasError) {
            // Custom fallback UI if provided
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default fallback UI
            return (
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
                    <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
                        <div className="mb-6">
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg
                                    className="w-10 h-10 text-red-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Oops! Something went wrong
                            </h1>
                            <p className="text-gray-600 mb-6">
                                We're sorry for the inconvenience. The app encountered an unexpected error.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                            >
                                Refresh Page
                            </button>

                            <button
                                onClick={this.handleReset}
                                className="w-full px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>

                        {/* Show error details in development */}
                        {import.meta.env.DEV && this.state.error && (
                            <details className="mt-6 text-left">
                                <summary className="cursor-pointer text-sm font-semibold text-gray-700 hover:text-gray-900">
                                    Error Details (Dev Only)
                                </summary>
                                <div className="mt-3 p-4 bg-gray-100 rounded-lg overflow-auto max-h-64">
                                    <p className="text-sm font-mono text-red-600 mb-2">
                                        {this.state.error.message}
                                    </p>
                                    <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                                        {this.state.error.stack}
                                    </pre>
                                    {this.state.errorInfo && (
                                        <pre className="text-xs text-gray-600 mt-2 whitespace-pre-wrap">
                                            {this.state.errorInfo.componentStack}
                                        </pre>
                                    )}
                                </div>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
