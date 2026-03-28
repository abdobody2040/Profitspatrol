
import { afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import '@/lib/i18n';

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
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => React.createElement('div', props, children),
    span: ({ children, ...props }: any) => React.createElement('span', props, children),
    button: ({ children, ...props }: any) => React.createElement('button', props, children),
    p: ({ children, ...props }: any) => React.createElement('p', props, children),
    img: ({ children, ...props }: any) => React.createElement('img', props, children),
    h1: ({ children, ...props }: any) => React.createElement('h1', props, children),
    h2: ({ children, ...props }: any) => React.createElement('h2', props, children),
    h3: ({ children, ...props }: any) => React.createElement('h3', props, children),
  },
  AnimatePresence: ({ children }: any) => React.createElement(React.Fragment, {}, children),
  useAnimation: () => ({ start: vi.fn() }),
}));

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


