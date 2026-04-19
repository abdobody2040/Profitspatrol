/**
 * TextSanitizer Tests
 * Tests for XSS prevention and text sanitization
 */

import { describe, it, expect } from 'vitest';
import { TextSanitizer } from '../sanitization';
import { ValidationError } from '../errors';

describe('TextSanitizer', () => {
    describe('sanitizeText', () => {
        it('should remove all HTML tags', () => {
            const dirty = '<script>alert("xss")</script>Hello';
            const clean = TextSanitizer.sanitizeText(dirty);
            expect(clean).not.toContain('<script>');
            expect(clean).toContain('Hello');
        });

        it('should remove dangerous attributes', () => {
            const dirty = '<img src=x onerror="alert(1)">';
            const clean = TextSanitizer.sanitizeText(dirty);
            expect(clean).not.toContain('onerror');
        });

        it('should preserve plain text', () => {
            const text = 'This is plain text with no HTML';
            expect(TextSanitizer.sanitizeText(text)).toBe(text);
        });
    });

    describe('sanitizeHTML', () => {
        it('should allow whitelisted tags', () => {
            const html = '<p>Hello <b>world</b></p>';
            const clean = TextSanitizer.sanitizeHTML(html, ['p', 'b']);
            expect(clean).toContain('<p>');
            expect(clean).toContain('<b>');
        });

        it('should remove non-whitelisted tags', () => {
            const html = '<p>Hello <script>alert(1)</script></p>';
            const clean = TextSanitizer.sanitizeHTML(html, ['p']);
            expect(clean).not.toContain('<script>');
        });
    });

    describe('sanitizeEmail', () => {
        it('should validate correct emails', () => {
            expect(() => TextSanitizer.sanitizeEmail('user@example.com')).not.toThrow();
        });

        it('should reject invalid emails', () => {
            expect(() => TextSanitizer.sanitizeEmail('not-an-email')).toThrow(ValidationError);
            expect(() => TextSanitizer.sanitizeEmail('missing@domain')).toThrow(ValidationError);
        });

        it('should lowercase emails', () => {
            const email = TextSanitizer.sanitizeEmail('User@Example.COM');
            expect(email).toBe('user@example.com');
        });
    });

    describe('sanitizeURL', () => {
        it('should allow http and https URLs', () => {
            expect(() => TextSanitizer.sanitizeURL('https://example.com')).not.toThrow();
            expect(() => TextSanitizer.sanitizeURL('http://example.com')).not.toThrow();
        });

        it('should block javascript: URLs', () => {
            expect(() => TextSanitizer.sanitizeURL('javascript:alert(1)')).toThrow(ValidationError);
        });

        it('should block data: URLs', () => {
            expect(() => TextSanitizer.sanitizeURL('data:text/html,<script>alert(1)</script>')).toThrow(ValidationError);
        });
    });

    describe('validateLength', () => {
        it('should allow text within limits', () => {
            expect(() => TextSanitizer.validateLength('Hello', 1, 10)).not.toThrow();
        });

        it('should reject text too short', () => {
            expect(() => TextSanitizer.validateLength('Hi', 5, 10)).toThrow(ValidationError);
        });

        it('should reject text too long', () => {
            expect(() => TextSanitizer.validateLength('Hello World', 1, 5)).toThrow(ValidationError);
        });
    });
});
