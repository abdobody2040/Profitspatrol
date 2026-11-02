
import { afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import '@/lib/i18n';

// Global PWA Mock to prevent hook destructuring crashes
vi.mock('virtual:pwa-register/react', () => ({
  useRegisterSW: () => ({
    offlineReady: [false, vi.fn()],
    needRefresh: [false, vi.fn()],
    updateServiceWorker: vi.fn(),
  })
}));

// Mock Supabase to prevent real network calls or session checks
vi.mock('@/lib/supabase', () => ({
  supabase: null,
  isSupabaseConfigured: () => false
}));

// ─── Global localStorage mock ──────────────────────────────────────────────
// The custom LocalStorageAdapter wraps native localStorage in a way that
// breaks direct localStorage.* calls in the jsdom test environment.
// We provide a simple in-memory implementation to prevent test crashes.
const _localStorageStore: Record<string, string> = {};
const _localStorageMock = {
  getItem: (key: string) => _localStorageStore[key] ?? null,
  setItem: (key: string, value: string) => { _localStorageStore[key] = value; },
  removeItem: (key: string) => { delete _localStorageStore[key]; },
  clear: () => { Object.keys(_localStorageStore).forEach(k => delete _localStorageStore[k]); },
  key: (idx: number) => Object.keys(_localStorageStore)[idx] ?? null,
  get length() { return Object.keys(_localStorageStore).length; },
};
Object.defineProperty(globalThis, 'localStorage', {
  value: _localStorageMock,
  writable: true,
});

// Mock scroll functions
window.scrollTo = vi.fn();
Element.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.scrollIntoView = vi.fn();

// Runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});


// Mock Howler for Audio
vi.mock('howler', () => {
  return {
    Howl: class {
      constructor() { }
      play() { return 0; }
      pause() { }
      stop() { }
      unload() { }
      rate() { }
      fade() { }
      on() { }
      volume() { }
      playing() { return false; }
      state() { return 'loaded'; }
    },
    Howler: {
      mute: vi.fn(),
      volume: vi.fn(),
      stop: vi.fn(),
    }
  };
});



// Mock ResizeObserver (needed for some UI components/Framer Motion)
(globalThis as any).ResizeObserver = class ResizeObserver {
  observe() { }
  unobserve() { }
  disconnect() { }
};

// Mock AudioContext (needed for SoundService)
(globalThis as any).AudioContext = class AudioContext {
  state = 'suspended';
  createOscillator() { return { type: '', frequency: { setValueAtTime: () => { } }, connect: () => { }, start: () => { }, stop: () => { } }; }
  createGain() { return { gain: { setValueAtTime: () => { }, exponentialRampToValueAtTime: () => { } }, connect: () => { } }; }
  resume() { return Promise.resolve(); }
  get destination() { return {}; }
  get currentTime() { return 0; }
} as any;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
(globalThis as any).IntersectionObserver = class IntersectionObserver {
  observe() { }
  unobserve() { }
  disconnect() { }
};

// Mock Framer Motion
vi.mock('framer-motion', () => {
  const motionProxy = new Proxy({} as any, {
    get: (target, prop) => {
      if (typeof prop === 'string') {
        const Comp = ({ children, ...props }: any) => {
          // Filter out framer-motion specific props to prevent console warnings/errors
          const cleanProps = { ...props };
          delete cleanProps.animate;
          delete cleanProps.transition;
          delete cleanProps.initial;
          delete cleanProps.exit;
          delete cleanProps.variants;
          delete cleanProps.whileHover;
          delete cleanProps.whileTap;
          return React.createElement(prop, cleanProps, children);
        };
        Comp.displayName = `motion.${prop}`;
        return Comp;
      }
      return undefined;
    }
  });
  return {
    motion: motionProxy,
    AnimatePresence: ({ children }: any) => React.createElement(React.Fragment, {}, children),
    useAnimation: () => ({ start: vi.fn() }),
  };
});

// Mock Canvas
HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
  fillRect: vi.fn(),
  clearRect: vi.fn(),
  getImageData: vi.fn(() => ({ data: new Array(4) })),
  putImageData: vi.fn(),
  createImageData: vi.fn(() => []),
  setTransform: vi.fn(),
  drawImage: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  closePath: vi.fn(),
  stroke: vi.fn(),
  translate: vi.fn(),
  scale: vi.fn(),
  rotate: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  measureText: vi.fn(() => ({ width: 0 })),
  transform: vi.fn(),
  rect: vi.fn(),
  clip: vi.fn(),
})) as any;

// Mock Phaser
vi.mock('phaser', () => ({
  default: {
    Game: class { constructor() { } destroy() { } },
    AUTO: 0,
    Scale: { FIT: 0, CENTER_BOTH: 0 },
    Scene: class { },
  },
  Game: class { constructor() { } destroy() { } },
  AUTO: 0,
  Scale: { FIT: 0, CENTER_BOTH: 0 },
  Scene: class { },
  // Add other exports used in your project
}));

// Global Fetch Mock to prevent real network calls (e.g. Logger remote calls) from hanging tests
globalThis.fetch = vi.fn().mockImplementation(() => Promise.resolve({
  ok: true,
  json: () => Promise.resolve({}),
  text: () => Promise.resolve(''),
} as Response));


