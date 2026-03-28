import { describe, it, expect } from 'vitest';
import { ContentModerationService } from '../ContentModerationService';

describe('ContentModerationService', () => {
    describe('Profanity Detection', () => {
        it('should detect and mask profanity', () => {
            const text = 'This is stupid and you are an idiot';
            const result = ContentModerationService.moderateContent(text);

            expect(result.isClean).toBe(false);
            expect(result.violations.length).toBeGreaterThan(0);
            expect(result.sanitizedText).toContain('s*****');
            expect(result.sanitizedText).toContain('i****');
        });

        it('should handle clean text', () => {
            const text = 'This is a great business opportunity!';
            const result = ContentModerationService.moderateContent(text);

            expect(result.isClean).toBe(true);
            expect(result.violations).toEqual([]);
            expect(result.sanitizedText).toBe(text);
            expect(result.confidence).toBe(1.0);
        });

        it('should be case-insensitive for profanity', () => {
            const text = 'STUPID stupid StUpId';
            const result = ContentModerationService.moderateContent(text);

            expect(result.isClean).toBe(false);
            expect(result.sanitizedText).not.toContain('STUPID');
        });
    });

    describe('PII Detection', () => {
        it('should detect and redact email addresses', () => {
            const text = 'Contact me at john.doe@example.com for details';
            const result = ContentModerationService.moderateContent(text);

            expect(result.isClean).toBe(false);
            expect(result.violations.some(v => v.type === 'pii' && v.detected === 'email address')).toBe(true);
            expect(result.sanitizedText).toContain('[EMAIL REDACTED]');
            expect(result.sanitizedText).not.toContain('john.doe@example.com');
        });

        it('should detect and redact phone numbers', () => {
            const text = 'Call me at 555-123-4567 or (555) 987-6543';
            const result = ContentModerationService.moderateContent(text);

            expect(result.isClean).toBe(false);
            expect(result.violations.some(v => v.type === 'pii' && v.detected === 'phone number')).toBe(true);
            expect(result.sanitizedText).toContain('[PHONE REDACTED]');
            expect(result.sanitizedText).not.toContain('555-123-4567');
        });

        it('should detect and redact SSN', () => {
            const text = 'My SSN is 123-45-6789';
            const result = ContentModerationService.moderateContent(text);

            expect(result.isClean).toBe(false);
            expect(result.violations.some(v => v.type === 'pii' && v.detected === 'SSN')).toBe(true);
            expect(result.sanitizedText).toContain('[SSN REDACTED]');
        });

        it('should detect and redact credit card numbers', () => {
            const text = 'Card: 4532-1234-5678-9010';
            const result = ContentModerationService.moderateContent(text);

            expect(result.isClean).toBe(false);
            expect(result.violations.some(v => v.type === 'pii' && v.detected === 'credit card')).toBe(true);
            expect(result.sanitizedText).toContain('[CARD REDACTED]');
        });

        it('should detect and redact addresses', () => {
            const text = 'I live at 123 Main Street';
            const result = ContentModerationService.moderateContent(text);

            expect(result.isClean).toBe(false);
            expect(result.violations.some(v => v.type === 'pii' && v.detected === 'address')).toBe(true);
            expect(result.sanitizedText).toContain('[ADDRESS REDACTED]');
        });

        it('should detect and redact zip codes', () => {
            const text = 'ZIP: 12345 or 98765-4321';
            const result = ContentModerationService.moderateContent(text);

            expect(result.isClean).toBe(false);
            expect(result.violations.some(v => v.type === 'pii' && v.detected === 'zip code')).toBe(true);
            expect(result.sanitizedText).toContain('[ZIP REDACTED]');
        });
    });

    describe('Confidence Scoring', () => {
        it('should return confidence 1.0 for clean text', () => {
            const result = ContentModerationService.moderateContent('Clean business text');
            expect(result.confidence).toBe(1.0);
        });

        it('should decrease confidence with violations', () => {
            const result = ContentModerationService.moderateContent('stupid idiot');
            expect(result.confidence).toBeLessThan(1.0);
            expect(result.confidence).toBeGreaterThanOrEqual(0.0);
        });

        it('should return low confidence for many violations', () => {
            const text = 'stupid idiot damn hell crap moron';
            const result = ContentModerationService.moderateContent(text);
            // Confidence decreases by 0.2 per violation, so 3 violations = 0.4
            expect(result.confidence).toBeLessThanOrEqual(0.6);
            expect(result.confidence).toBeGreaterThanOrEqual(0.0);
        });
    });

    describe('Helper Methods', () => {
        it('isSafe should return boolean', () => {
            expect(ContentModerationService.isSafe('Clean text')).toBe(true);
            expect(ContentModerationService.isSafe('stupid text')).toBe(false);
        });

        it('sanitize should return only sanitized text', () => {
            const sanitized = ContentModerationService.sanitize('Contact: test@example.com');
            expect(sanitized).toContain('[EMAIL REDACTED]');
            expect(sanitized).not.toContain('test@example.com');
        });
    });

    describe('Edge Cases', () => {
        it('should handle empty string', () => {
            const result = ContentModerationService.moderateContent('');
            expect(result.isClean).toBe(true);
            expect(result.violations).toEqual([]);
        });

        it('should handle text with multiple violation types', () => {
            const text = 'You stupid idiot! Email me at bad@example.com or call (555) 123-4567';
            const result = ContentModerationService.moderateContent(text);

            expect(result.isClean).toBe(false);
            expect(result.violations.length).toBeGreaterThanOrEqual(2);
            expect(result.sanitizedText).toContain('[EMAIL REDACTED]');
            expect(result.sanitizedText).toContain('[PHONE REDACTED]');
            expect(result.sanitizedText).toContain('s*****');
        });

        it('should preserve safe content while removing violations', () => {
            const text = 'Great idea! Contact: test@example.com';
            const result = ContentModerationService.moderateContent(text);

            expect(result.sanitizedText).toContain('Great idea!');
            expect(result.sanitizedText).toContain('[EMAIL REDACTED]');
        });
    });
});
