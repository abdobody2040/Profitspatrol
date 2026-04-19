/**
 * Stub for @sentry/react — optional peer dependency.
 * Vitest needs a resolvable module for the dynamic import in sentry.ts.
 * All methods are no-ops; Sentry is intentionally disabled in tests.
 */
export const init = () => {};
export const captureMessage = () => {};
export const captureException = () => {};
export const addBreadcrumb = () => {};
export const setUser = () => {};
export const setTag = () => {};
export const withScope = (cb: (scope: unknown) => void) => cb({});
export default { init, captureMessage, captureException, addBreadcrumb, setUser, setTag, withScope };
