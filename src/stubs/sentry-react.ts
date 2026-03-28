/**
 * No-op stub for @sentry/react — optional peer dependency.
 * Used by vite.config.ts resolve.alias so Vite's import-analysis plugin
 * can resolve the module without failing the build/dev server.
 * When @sentry/react is actually installed, remove this alias and the real
 * package will be used instead.
 */
export const init = (_opts?: unknown): void => {};
export const captureMessage = (_msg: string, _opts?: unknown): void => {};
export const captureException = (_err: unknown, _opts?: unknown): void => {};
export const addBreadcrumb = (_b: unknown): void => {};
export const setUser = (_u: unknown): void => {};
export const setTag = (_k: string, _v: string): void => {};
export const withScope = (cb: (scope: unknown) => void): void => cb({});
export const BrowserTracing = class {};
export const Replay = class {};
export const Hub = class {};
export default {
    init,
    captureMessage,
    captureException,
    addBreadcrumb,
    setUser,
    setTag,
    withScope,
};
