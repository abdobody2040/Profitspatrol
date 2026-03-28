/**
 * Prompt Sanitizer - Prevents AI Prompt Injection Attacks
 * Detects and blocks malicious prompt patterns
 */

import { ValidationError } from './errors';
import { Logger } from '../services/logger';

/**
 * Dangerous patterns that indicate prompt injection attempts
 */
const DANGEROUS_PATTERNS = [
    // Direct instruction overrides
    /ignore\s+(all\s+)?previous\s+instructions?/i,
    /disregard\s+(all\s+)?previous\s+instructions?/i,
    /forget\s+(all\s+)?previous\s+instructions?/i,

    // System prompt manipulation
    /system\s+prompt/i,
    /you\s+are\s+now/i,
    /your\s+new\s+role\s+is/i,
    /act\s+as\s+(a\s+)?different/i,

    // Instruction injection
    /\[system\]/i,
    /\[assistant\]/i,
    /\[user\]/i,
    /<\|system\|>/i,
    /<\|assistant\|>/i,
    /<\|im_start\|>/i,
    /<\|im_end\|>/i,

    // Jailbreak attempts
    /DAN\s+mode/i, // "Do Anything Now"
    /developer\s+mode/i,
    /jailbreak/i,
    /bypass\s+restrictions?/i,
    /evil\s+mode/i,
    /unrestricted\s+mode/i,
    /no\s+filter/i,
    /ignore\s+safety/i,

    // Information extraction
    /reveal\s+(the\s+)?system\s+prompt/i,
    /show\s+(me\s+)?(the\s+)?instructions?/i,
    /what\s+(are|is)\s+(your|the)\s+instructions?/i,

    // Role manipulation
    /pretend\s+to\s+be/i,
    /simulate\s+(being\s+)?a/i,
    /roleplay\s+as/i,

    // Advanced injection patterns
    /new\s+instructions?/i,
    /override\s+(previous|all)/i,
    /execute\s+(code|command|script)/i,
    /eval\(|exec\(/i,
    /system\s*:\s*/i,
];

/**
 * Control characters that could be used for injection
 */
const CONTROL_CHARACTERS = /[\u0000-\u001F\u007F-\u009F]/g;

/**
 * Maximum allowed prompt length
 */
const MAX_PROMPT_LENGTH = 5000;

export class PromptSanitizer {
    /**
     * Sanitize and validate AI prompt input
     * @param prompt - User-provided prompt
     * @returns Sanitized prompt
     * @throws ValidationError if prompt contains injection attempts
     */
    static async sanitize(prompt: string): Promise<string> {
        if (!prompt || typeof prompt !== 'string') {
            throw new ValidationError('Prompt must be a non-empty string');
        }

        // Trim whitespace
        const trimmed = prompt.trim();

        // Check length
        if (trimmed.length === 0) {
            throw new ValidationError('Prompt cannot be empty');
        }

        if (trimmed.length > MAX_PROMPT_LENGTH) {
            throw new ValidationError(
                `Prompt too long (max ${MAX_PROMPT_LENGTH} characters)`
            );
        }

        // Check for dangerous patterns
        for (const pattern of DANGEROUS_PATTERNS) {
            if (pattern.test(trimmed)) {
                // ✅ SECURITY FIX: Route to structured Logger instead of bare console.warn
                Logger.warn('[SECURITY] Prompt injection attempt detected', {
                    pattern: pattern.source,
                });

                try {
                    await Logger.logSecurityEvent('prompt_injection', 'high', {
                        pattern: pattern.source,
                        input_length: trimmed.length,
                    });
                } catch (logError) {
                    Logger.error('[SECURITY] Failed to log security event', logError);
                }

                throw new ValidationError(
                    'Prompt contains potentially malicious content. Please rephrase your input.',
                    { pattern: pattern.source }
                );
            }
        }

        // Remove control characters
        const cleaned = trimmed.replace(CONTROL_CHARACTERS, '');

        // Remove excessive whitespace
        const normalized = cleaned.replace(/\s+/g, ' ');

        return normalized;
    }

    /**
     * Check if prompt is safe without throwing
     * @param prompt - User-provided prompt
     * @returns true if safe, false if dangerous
     */
    static async isSafe(prompt: string): Promise<boolean> {
        try {
            await this.sanitize(prompt);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Escape special delimiters used in prompt templates
     * @param text - Text to escape
     * @returns Escaped text
     */
    static escapeDelimiters(text: string): string {
        return text
            .replace(/---/g, '- - -')
            .replace(/###/g, '# # #')
            .replace(/\[INST\]/gi, '[I N S T]')
            .replace(/\[\/INST\]/gi, '[/ I N S T]');
    }

    /**
     * Create a safe prompt template with user input
     * @param userInput - User-provided content
     * @param template - Prompt template with {input} placeholder
     * @returns Safe formatted prompt
     */
    static async createSafePrompt(userInput: string, template: string): Promise<string> {
        const sanitized = await this.sanitize(userInput);
        const escaped = this.escapeDelimiters(sanitized);

        return template.replace('{input}', escaped);
    }
}

/**
 * Convenience function for sanitizing prompts
 * @param prompt - User-provided prompt
 * @returns Sanitized prompt
 * @throws ValidationError if prompt contains injection attempts
 */
export async function sanitizePrompt(prompt: string): Promise<string> {
    return await PromptSanitizer.sanitize(prompt);
}
