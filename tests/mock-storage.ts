// Mock storage for Node/Vitest test environment
const _localStorageStore: Record<string, string> = {};
export const localStorageMock = {
  getItem: (key: string) => _localStorageStore[key] ?? null,
  setItem: (key: string, value: string) => { _localStorageStore[key] = String(value); },
  removeItem: (key: string) => { delete _localStorageStore[key]; },
  clear: () => { Object.keys(_localStorageStore).forEach(k => delete _localStorageStore[k]); },
  key: (idx: number) => Object.keys(_localStorageStore)[idx] ?? null,
  get length() { return Object.keys(_localStorageStore).length; },
};

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
  configurable: true,
});

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
    configurable: true,
  });
}
