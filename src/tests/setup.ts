/**
 * Vitest Test Setup
 * Configures testing environment with jsdom and testing-library
 */

import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
    cleanup();
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => { }, // deprecated
        removeListener: () => { }, // deprecated
        addEventListener: () => { },
        removeEventListener: () => { },
        dispatchEvent: () => true,
    }),
});

// Mock IntersectionObserver
// eslint-disable-next-line no-undef
global.IntersectionObserver = class IntersectionObserver {
    constructor() { }
    disconnect() { }
    observe() { }
    takeRecords() {
        return [];
    }
    unobserve() { }
} as any;

// Mock ResizeObserver
// eslint-disable-next-line no-undef
global.ResizeObserver = class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
};

// Global Fetch Mock to prevent real network calls (e.g. Logger remote calls) from hanging tests
globalThis.fetch = vi.fn().mockImplementation(() => Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
} as Response));
