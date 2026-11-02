/**
 * Profits Patrol - Modern Laravel API Client
 * Replaces Supabase Client with standard Sanctum token-authenticated REST API.
 */

import { Logger } from '../services/logger';

export const getApiBaseUrl = (): string => {
    const envUrl = import.meta.env.VITE_LARAVEL_API_URL || import.meta.env.VITE_API_URL;

    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';

        if (!isLocal) {
            if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
                return envUrl.replace(/\/$/, '');
            }
            const rootDomain = hostname.replace(/^www\./, '');
            return `${window.location.protocol}//api.${rootDomain}/api/v1`;
        }
    }

    return (envUrl || 'http://localhost:8000/api/v1').replace(/\/$/, '');
};

const TOKEN_KEY = 'pp_auth_token';

class ApiClient {
    private token: string | null = null;

    constructor() {
        if (typeof window !== 'undefined') {
            this.token = localStorage.getItem(TOKEN_KEY);
        }
    }

    public setToken(token: string | null): void {
        this.token = token;
        if (typeof window !== 'undefined') {
            if (token) {
                localStorage.setItem(TOKEN_KEY, token);
            } else {
                localStorage.removeItem(TOKEN_KEY);
            }
        }
    }

    public getToken(): string | null {
        if (!this.token && typeof window !== 'undefined') {
            this.token = localStorage.getItem(TOKEN_KEY);
        }
        return this.token;
    }

    public clearToken(): void {
        this.setToken(null);
    }

    public isConfigured(): boolean {
        return !!getApiBaseUrl();
    }

    private generateRequestId(): string {
        if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
            return crypto.randomUUID();
        }
        return 'req_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const baseUrl = getApiBaseUrl();
        const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
        const token = this.getToken();
        const requestId = this.generateRequestId();
        const startTime = performance.now();

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-Request-ID': requestId,
            ...(options.headers as Record<string, string> || {}),
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        let response: Response;
        try {
            response = await fetch(url, {
                ...options,
                headers,
            });
        } catch (netErr: any) {
            const durationMs = Math.round(performance.now() - startTime);
            Logger.error('api.network.error', {
                endpoint,
                duration_ms: durationMs,
                request_id: requestId,
                error: netErr.message || String(netErr),
            });
            throw netErr;
        }

        const durationMs = Math.round(performance.now() - startTime);
        const serverRequestId = response.headers.get('X-Request-ID') || requestId;

        if (response.status === 401) {
            this.clearToken();
        }

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            const errorMsg = data.message || data.error || `API request failed with status ${response.status}`;
            const error: any = new Error(errorMsg);
            error.status = response.status;
            error.data = data;
            error.requestId = serverRequestId;

            Logger.error('api.request.failed', {
                endpoint,
                status: response.status,
                duration_ms: durationMs,
                request_id: serverRequestId,
                error: errorMsg,
            });

            throw error;
        }

        return data as T;
    }

    public get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
        let fullPath = endpoint;
        if (params && Object.keys(params).length > 0) {
            const searchParams = new URLSearchParams();
            Object.entries(params).forEach(([key, val]) => {
                if (val !== undefined && val !== null) {
                    searchParams.append(key, String(val));
                }
            });
            fullPath += `?${searchParams.toString()}`;
        }
        return this.request<T>(fullPath, { method: 'GET' });
    }

    public post<T>(endpoint: string, body?: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    public put<T>(endpoint: string, body?: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    public delete<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'DELETE' });
    }
}

export const api = new ApiClient();
