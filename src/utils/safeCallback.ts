/**
 * Safely execute a callback function, with optional fallback
 */
import { Logger } from '../services/logger';
export function safeCallback<T extends (...args: any[]) => any>(
    callback: T | undefined,
    fallback?: () => void
): (...args: Parameters<T>) => ReturnType<T> | void {
    return (...args: Parameters<T>) => {
        if (typeof callback === 'function') {
            return callback(...args);
        }
        if (fallback) {
            return fallback();
        }
        // ✅ SECURITY FIX: Use Logger.warn so undefined-callback warnings are silenced in
        // production and not visible to anyone with DevTools open.
        Logger.warn('safeCallback: callback was called but is not defined (undefined prop)');
    };
}

/**
 * Safe property access with default value
 */
export function safeAccess<T>(
    obj: any,
    path: string,
    defaultValue: T
): T {
    const keys = path.split('.');
    let current = obj;

    for (const key of keys) {
        if (current?.[key] === undefined) {
            return defaultValue;
        }
        current = current[key];
    }

    return current ?? defaultValue;
}
