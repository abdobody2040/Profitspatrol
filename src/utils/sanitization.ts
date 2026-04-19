/**
 * Text Sanitization Utility
 * Provides safe text sanitization using DOMPurify
 */

import DOMPurify from 'dompurify';
import { ValidationError } from './errors';

export class TextSanitizer {
    /**
     * Sanitize user input by removing all HTML tags
     * @param input - Raw user input
     * @returns Sanitized plain text
     */
    static sanitizeText(input: string): string {
        if (!input) return '';

        // Remove all HTML tags
        const cleaned = DOMPurify.sanitize(input, {
            ALLOWED_TAGS: [],
            ALLOWED_ATTR: []
        });

        // Trim whitespace
        return cleaned.trim();
    }

    /**
     * Sanitize HTML content allowing only safe tags
     * @param html - HTML content
     * @param allowedTags - Array of allowed HTML tags
     * @returns Sanitized HTML
     */
    static sanitizeHTML(
        html: string,
        allowedTags: string[] = ['b', 'i', 'em', 'strong', 'p', 'br']
    ): string {
        if (!html) return '';

        return DOMPurify.sanitize(html, {
            ALLOWED_TAGS: allowedTags,
            ALLOWED_ATTR: []
        });
    }

    /**
     * Sanitize and truncate text to maximum length
     * @param input - Raw user input
     * @param maxLength - Maximum allowed length
     * @returns Sanitized and truncated text
     */
    static sanitizeAndTruncate(input: string, maxLength: number = 5000): string {
        const sanitized = this.sanitizeText(input);
        return sanitized.substring(0, maxLength);
    }

    /**
     * Validate and sanitize email address
     * @param email - Email address
     * @returns Sanitized email in lowercase
     * @throws ValidationError if email is invalid
     */
    static sanitizeEmail(email: string): string {
        if (!email) {
            throw new Error('Email is required');
        }

        const sanitized = this.sanitizeText(email).toLowerCase().trim();

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(sanitized)) {
            throw new Error('Invalid email format');
        }

        return sanitized;
    }

    /**
     * Sanitize URL to prevent javascript: and data: schemes
     * @param url - URL to sanitize
     * @returns Sanitized URL or empty string if invalid
     */
    static sanitizeURL(url: string): string {
        if (!url) throw new ValidationError('URL cannot be empty');

        const sanitized = this.sanitizeText(url).trim();

        // Block dangerous protocols
        const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
        const lowerURL = sanitized.toLowerCase();

        if (dangerousProtocols.some(protocol => lowerURL.startsWith(protocol))) {
            throw new ValidationError('Dangerous URL protocol detected');
        }

        // Ensure URL starts with http:// or https://
        if (!lowerURL.startsWith('http://') && !lowerURL.startsWith('https://')) {
            return `https://${sanitized}`;
        }

        return sanitized;
    }

    /**
     * Remove profanity from text (basic implementation)
     * @param text - Text to filter
     * @param profanityList - List of words to filter
     * @returns Filtered text
     */
    static filterProfanity(
        text: string,
        profanityList: string[] = []
    ): string {
        if (!text || profanityList.length === 0) return text;

        let filtered = text;
        profanityList.forEach(word => {
            const regex = new RegExp(`\\b${word}\\b`, 'gi');
            filtered = filtered.replace(regex, '***');
        });

        return filtered;
    }

    /**
     * Validate text length
     * @param text - Text to validate
     * @param minLength - Minimum length
     * @param maxLength - Maximum length
     * @throws ValidationError if length is invalid
     */
    static validateLength(
        text: string,
        minLength: number = 1,
        maxLength: number = 5000
    ): void {
        const length = text.trim().length;

        if (length < minLength) {
            throw new ValidationError(`Text too short (minimum ${minLength} characters)`);
        }

        if (length > maxLength) {
            throw new ValidationError(`Text too long (maximum ${maxLength} characters)`);
        }
    }
}

/**
 * Common sanitization presets
 */
export const SANITIZATION_PRESETS = {
    COMMENT: {
        maxLength: 1000,
        allowedTags: []
    },
    PROJECT_DESCRIPTION: {
        maxLength: 5000,
        allowedTags: ['b', 'i', 'em', 'strong', 'p', 'br']
    },
    USERNAME: {
        maxLength: 50,
        allowedTags: []
    },
    BIO: {
        maxLength: 500,
        allowedTags: []
    }
} as const;
