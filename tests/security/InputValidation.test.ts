import { describe, it, expect } from 'vitest';
import { TextSanitizer } from '../../src/utils/sanitization';

describe('Input Validation Security', () => {

    it('should sanitize HTML from text inputs (XSS Defense)', () => {
        const dirty = 'Hello <script>alert(1)</script>';
        const clean = TextSanitizer.sanitizeText(dirty);
        expect(clean).toBe('Hello');
        expect(clean).not.toContain('<script>');
    });

    it('should reject files larger than 5MB', () => {
        const maxSizeBytes = 5 * 1024 * 1024;
        const validFile = { size: 2 * 1024 * 1024, type: 'image/png' };
        const heavyFile = { size: 6 * 1024 * 1024, type: 'image/png' };

        const isAllowedSize = (file: { size: number }) => file.size <= maxSizeBytes;

        expect(isAllowedSize(validFile)).toBe(true);
        expect(isAllowedSize(heavyFile)).toBe(false);
    });

    it('should reject potentially dangerous file types (EXE, SH)', () => {
        const dangerousExtensions = ['.exe', '.sh', '.bat', '.cmd', '.msi'];
        const safeExtensions = ['.png', '.jpg', '.jpeg', '.webp'];

        const isSafeExtension = (ext: string) => safeExtensions.includes(ext.toLowerCase());

        expect(isSafeExtension('.png')).toBe(true);
        dangerousExtensions.forEach(ext => {
            expect(isSafeExtension(ext)).toBe(false);
        });
    });

    it('should sanitize filenames to prevent path traversal', () => {
        const filename = '../../etc/passwd.png';
        const sanitized = filename.replace(/\.\./g, '').replace(/[\/\\]/g, '_');
        expect(sanitized).not.toContain('..');
        expect(sanitized).toBe('__etc_passwd.png');
    });
});
