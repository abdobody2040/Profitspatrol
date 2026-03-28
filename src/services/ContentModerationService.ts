import { Logger } from './logger';
import { supabase } from '../lib/supabase';

export type ViolationType =
    | 'profanity'
    | 'pii'
    | 'violence'
    | 'adult_content'
    | 'hate_speech'
    | 'self_harm';

export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';
export type PatternType = 'keyword' | 'exact' | 'regex';

export interface Violation {
    type: ViolationType;
    detected: string;
    severity: SeverityLevel;
    confidence: number;
}

export interface ModerationResult {
    isClean: boolean;
    violations: Violation[];
    sanitizedText: string;
    confidence: number;
    severity: SeverityLevel;
    source?: 'ai' | 'whitelist' | 'blacklist';
}

interface Pattern {
    id: string;
    pattern: string;
    pattern_type: PatternType;
    severity?: SeverityLevel; // Only for blacklist
}

/**
 * Content Moderation Service for AI Safety
 * Detects and filters profanity and PII from AI-generated content
 * Integrated with Admin Whitelist/Blacklist
 */
export class ContentModerationService {
    // Cache for patterns
    private static patterns: {
        whitelist: Pattern[];
        blacklist: Pattern[];
        lastUpdated: number;
    } = {
            whitelist: [],
            blacklist: [],
            lastUpdated: 0
        };

    // ✅ RACE FIX: In-flight dedup — a single Promise is shared between concurrent loadPatterns() calls.
    // Without this, two calls during cache expiry fire two Supabase fetches; the last one to complete
    // wins and may overwrite fresh data with stale data from a slower earlier response.
    private static _loadingPromise: Promise<void> | null = null;

    // Refresh interval (5 minutes)
    private static readonly CACHE_TTL = 5 * 60 * 1000;

    // Profanity patterns (kid-safe, conservative list)
    private static readonly PROFANITY_SEVERE = [
        'fuck', 'shit', 'bitch', 'asshole', 'bastard', 'damn', 'hell',
        'crap', 'piss', 'dick', 'cock', 'pussy', 'whore', 'slut'
    ];

    private static readonly PROFANITY_MODERATE = [
        'stupid', 'idiot', 'dumb', 'moron', 'jerk', 'suck', 'sucks', 'loser', 'freak'
    ];

    // Harmful topic keywords
    private static readonly HARMFUL_TOPICS = {
        violence: ['kill', 'murder', 'weapon', 'gun', 'knife', 'bomb', 'attack', 'hurt', 'harm', 'shoot', 'stab'],
        adult_content: ['sex', 'porn', 'nude', 'naked', 'xxx', 'adult', 'erotic'],
        hate_speech: ['hate', 'racist', 'nazi', 'terrorist', 'supremacy', 'genocide'],
        self_harm: ['suicide', 'cut myself', 'kill myself', 'self harm', 'end my life', 'want to die'],
    };

    // PII detection patterns — returned as new instances each time to avoid /g lastIndex state bugs
    private static get PII_PATTERNS() {
        return {
            email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
            // Allow - . or space as separator to match formats like (555) 123-4567
            phone: /\b(\+?1[-.\ ]?)?\(?\d{3}\)?[-.\ ]?\d{3}[-.\ ]?\d{4}\b/g,
            ssn: /\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/g,
            creditCard: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,
            address: /\b\d{1,5}\s+\w+\s+(street|st|avenue|ave|road|rd|drive|dr|lane|ln|boulevard|blvd)\b/gi,
            zipCode: /\b\d{5}(-\d{4})?\b/g,
        };
    }

    /**
     * Initialize the service by loading patterns from Supabase
     */
    static async loadPatterns() {
        if (!supabase) return;

        // check cache first
        const now = Date.now();
        if (now - this.patterns.lastUpdated < this.CACHE_TTL && this.patterns.whitelist.length > 0) {
            return;
        }

        // ✅ RACE FIX: Deduplicate concurrent calls — reuse the in-flight Promise if one exists.
        if (this._loadingPromise) return this._loadingPromise;

        this._loadingPromise = (async () => {
            try {
                // Load whitelist
                const { data: whitelist } = await supabase!
                    .from('moderation_whitelist')
                    .select('*');

                // Load blacklist
                const { data: blacklist } = await supabase!
                    .from('moderation_blacklist')
                    .select('*');

                this.patterns = {
                    whitelist: (whitelist || []) as Pattern[],
                    blacklist: (blacklist || []) as Pattern[],
                    lastUpdated: Date.now()
                };

                Logger.info('Content moderation patterns loaded', {
                    whitelistCount: whitelist?.length || 0,
                    blacklistCount: blacklist?.length || 0
                });
            } catch (error) {
                Logger.error('Failed to load moderation patterns', error);
            } finally {
                // Always clear the sentinel so the next cache expiry triggers a fresh fetch
                this._loadingPromise = null;
            }
        })();

        return this._loadingPromise;
    }

    /**
     * Check against whitelist patterns
     */
    private static checkWhitelist(text: string): boolean {
        return this.patterns.whitelist.some(p => this.isPatternMatch(text, p));
    }

    /**
     * Check against blacklist patterns
     */
    private static checkBlacklist(text: string): Violation | null {
        for (const p of this.patterns.blacklist) {
            if (this.isPatternMatch(text, p)) {
                return {
                    type: 'profanity', // Generic type for custom blacklist
                    detected: p.pattern,
                    severity: p.severity || 'high',
                    confidence: 1.0
                };
            }
        }
        return null;
    }

    /**
     * Pattern matching logic
     */
    private static isPatternMatch(text: string, pattern: Pattern): boolean {
        const lowerText = text.toLowerCase();
        const lowerPattern = pattern.pattern.toLowerCase();

        switch (pattern.pattern_type) {
            case 'keyword':
                return lowerText.includes(lowerPattern);
            case 'exact':
                return lowerText === lowerPattern || lowerText.trim() === lowerPattern;
            case 'regex':
                // ✅ SECURITY FIX: ReDoS protection for DB-sourced regex patterns.
                // An admin could inadvertently (or maliciously) insert a catastrophic
                // backtracking pattern like `(a+)+$` into the moderation_blacklist table.
                // Defenses:
                // 1. Reject patterns > 100 chars (complex patterns = higher ReDoS risk)
                // 2. Cap the input slice to 1000 chars (limits backtracking surface)
                // 3. Catch *all* errors, not just SyntaxError (some engines throw RangeError)
                if (pattern.pattern.length > 100) {
                    Logger.warn('[Security] Moderation regex pattern exceeds safe length limit, skipping', {
                        patternId: pattern.id,
                        patternLength: pattern.pattern.length
                    });
                    return false;
                }
                try {
                    const regex = new RegExp(pattern.pattern, 'i');
                    // Limit input to 1000 chars to bound backtracking complexity
                    return regex.test(text.slice(0, 1000));
                } catch (e) {
                    Logger.warn('[Security] Moderation regex compile/exec failed', {
                        patternId: pattern.id,
                        error: e instanceof Error ? e.message : 'unknown'
                    });
                    return false;
                }
            default:
                return false;
        }
    }

    /**
     * Moderate AI-generated content
     * Returns sanitized text with violations flagged
     */
    static moderateContent(text: string): ModerationResult {
        // Try to load patterns if cache is empty or stale (non-blocking)
        if (this.patterns.whitelist.length === 0 || Date.now() - this.patterns.lastUpdated > this.CACHE_TTL) {
            void this.loadPatterns();
        }

        // 1. Check Whitelist — bypasses profanity/spam only.
        // ✅ SECURITY FIX: Whitelist does NOT bypass PII or critical harm categories.
        // A broad whitelist entry must never allow self-harm, adult content, or PII through.
        if (this.checkWhitelist(text)) {
            const piiViolations = this.detectPII(text);
            const criticalHarm = this.detectHarmfulTopics(text)
                .filter(v => v.severity === 'critical');

            if (piiViolations.length === 0 && criticalHarm.length === 0) {
                return {
                    isClean: true,
                    violations: [],
                    sanitizedText: text,
                    confidence: 1.0,
                    severity: 'low',
                    source: 'whitelist'
                };
            }
            // Fall through to full moderation if critical issues exist
        }

        const violations: Violation[] = [];
        let sanitizedText = text;

        // 2. Check Blacklist (Block)
        const blacklistViolation = this.checkBlacklist(text);
        if (blacklistViolation) {
            violations.push(blacklistViolation);
            return {
                isClean: false,
                violations,
                sanitizedText: '[BLOCKED CONTENT]',
                confidence: 1.0,
                severity: blacklistViolation.severity,
                source: 'blacklist'
            };
        }

        // 3. Regular AI Moderation
        // Check for profanity
        const profanityViolations = this.detectProfanity(text);
        violations.push(...profanityViolations);

        // Check for PII
        const piiViolations = this.detectPII(text);
        violations.push(...piiViolations);

        // Check for harmful topics
        const topicViolations = this.detectHarmfulTopics(text);
        violations.push(...topicViolations);

        // Sanitize content
        if (violations.length > 0) {
            sanitizedText = this.sanitizeViolations(text, violations);
        }

        const isClean = violations.length === 0;
        const severity = this.calculateSeverity(violations);
        const confidence = this.calculateConfidence(violations);

        if (!isClean) {
            Logger.warn('Content moderation violations detected', {
                violation_count: violations.length,
                severity,
                confidence,
            });

            // Log to security monitoring system
            void Logger.logSecurityEvent('content_violation', severity, {
                violation_types: violations.map(v => v.type),
                violation_count: violations.length,
                text_length: text.length,
            });
        }

        return {
            isClean,
            violations,
            sanitizedText,
            confidence,
            severity,
        };
    }

    /**
     * Detect profanity in text
     */
    private static detectProfanity(text: string): Violation[] {
        const violations: Violation[] = [];
        const lowerText = text.toLowerCase();

        // Check severe profanity
        for (const word of this.PROFANITY_SEVERE) {
            const regex = new RegExp(`\\b${word}\\b`, 'gi');
            if (regex.test(lowerText)) {
                violations.push({
                    type: 'profanity',
                    detected: word,
                    severity: 'high',
                    confidence: 0.95,
                });
            }
        }

        // Check moderate profanity
        for (const word of this.PROFANITY_MODERATE) {
            const regex = new RegExp(`\\b${word}\\b`, 'gi');
            if (regex.test(lowerText)) {
                violations.push({
                    type: 'profanity',
                    detected: word,
                    severity: 'medium',
                    confidence: 0.85,
                });
            }
        }

        return violations;
    }


    /**
     * Detect harmful topics in content
     */
    private static detectHarmfulTopics(text: string): Violation[] {
        const violations: Violation[] = [];
        const lowerText = text.toLowerCase();

        // Check for violence
        for (const keyword of this.HARMFUL_TOPICS.violence) {
            if (lowerText.includes(keyword)) {
                violations.push({
                    type: 'violence',
                    detected: keyword,
                    severity: 'high',
                    confidence: 0.80,
                });
                break; // Only report once per category
            }
        }

        // Check for adult content
        for (const keyword of this.HARMFUL_TOPICS.adult_content) {
            if (lowerText.includes(keyword)) {
                violations.push({
                    type: 'adult_content',
                    detected: keyword,
                    severity: 'critical',
                    confidence: 0.90,
                });
                break;
            }
        }

        // Check for hate speech
        for (const keyword of this.HARMFUL_TOPICS.hate_speech) {
            if (lowerText.includes(keyword)) {
                violations.push({
                    type: 'hate_speech',
                    detected: keyword,
                    severity: 'critical',
                    confidence: 0.85,
                });
                break;
            }
        }

        // Check for self-harm content
        for (const keyword of this.HARMFUL_TOPICS.self_harm) {
            if (lowerText.includes(keyword)) {
                violations.push({
                    type: 'self_harm',
                    detected: keyword,
                    severity: 'critical',
                    confidence: 0.95,
                });
                break;
            }
        }

        return violations;
    }

    /**
     * Sanitize content by removing/redacting violations
     */
    private static sanitizeViolations(text: string, violations: Violation[]): string {
        let sanitized = text;

        for (const violation of violations) {
            const { type, detected } = violation;

            switch (type) {
                case 'pii':
                    // Redact PII
                    sanitized = this.redactPII(sanitized);
                    break;
                case 'profanity':
                    // Replace profanity with first letter + asterisks (e.g. 'stupid' → 's*****')
                    const profanityRegex = new RegExp(`\\b${detected}\\b`, 'gi');
                    sanitized = sanitized.replace(profanityRegex, (match) =>
                        match[0] + '*'.repeat(match.length - 1)
                    );
                    break;
                case 'violence':
                case 'adult_content':
                case 'hate_speech':
                case 'self_harm':
                    // For harmful topics, return a safe message
                    return "I'm sorry, I can't provide that information. Let's talk about something else!";
            }
        }

        return sanitized;
    }

    /**
     * Calculate overall severity from violations
     */
    private static calculateSeverity(violations: Violation[]): SeverityLevel {
        if (violations.length === 0) return 'low';

        const hasCritical = violations.some(v => v.severity === 'critical');
        if (hasCritical) return 'critical';

        const hasHigh = violations.some(v => v.severity === 'high');
        if (hasHigh) return 'high';

        const hasMedium = violations.some(v => v.severity === 'medium');
        if (hasMedium) return 'medium';

        return 'low';
    }


    /**
     * Detect PII in text
     */
    private static detectPII(text: string): Violation[] {
        const violations: Violation[] = [];

        // Email detection
        if (this.PII_PATTERNS.email.test(text)) {
            violations.push({
                type: 'pii',
                detected: 'email address',
                severity: 'high',
                confidence: 0.98,
            });
        }

        // Phone detection
        if (this.PII_PATTERNS.phone.test(text)) {
            violations.push({
                type: 'pii',
                detected: 'phone number',
                severity: 'high',
                confidence: 0.90,
            });
        }

        // SSN detection
        if (this.PII_PATTERNS.ssn.test(text)) {
            violations.push({
                type: 'pii',
                detected: 'SSN',
                severity: 'critical',
                confidence: 0.99,
            });
        }

        // Credit card detection
        if (this.PII_PATTERNS.creditCard.test(text)) {
            violations.push({
                type: 'pii',
                detected: 'credit card',
                severity: 'critical',
                confidence: 0.95,
            });
        }

        // Address detection
        if (this.PII_PATTERNS.address.test(text)) {
            violations.push({
                type: 'pii',
                detected: 'address',
                severity: 'high',
                confidence: 0.85,
            });
        }

        // Zip code detection
        if (this.PII_PATTERNS.zipCode.test(text)) {
            violations.push({
                type: 'pii',
                detected: 'zip code',
                severity: 'medium',
                confidence: 0.90,
            });
        }

        return violations;
    }

    /**
     * Redact PII from text
     */
    private static redactPII(text: string): string {
        let sanitized = text;

        sanitized = sanitized.replace(this.PII_PATTERNS.email, '[EMAIL REDACTED]');
        sanitized = sanitized.replace(this.PII_PATTERNS.phone, '[PHONE REDACTED]');
        sanitized = sanitized.replace(this.PII_PATTERNS.ssn, '[SSN REDACTED]');
        sanitized = sanitized.replace(this.PII_PATTERNS.creditCard, '[CARD REDACTED]');
        sanitized = sanitized.replace(this.PII_PATTERNS.address, '[ADDRESS REDACTED]');
        sanitized = sanitized.replace(this.PII_PATTERNS.zipCode, '[ZIP REDACTED]');

        return sanitized;
    }

    /**
     * Calculate confidence score (0.0 - 1.0)
     * Starts at 1.0, reduces by 0.15 per violation, floored at 0.
     * E.g. 6 violations → 1.0 - (6 × 0.15) = 0.1
     */
    private static calculateConfidence(violations: Violation[]): number {
        if (violations.length === 0) return 1.0;

        const score = 1.0 - (violations.length * 0.15);
        return Math.max(0, Math.round(score * 100) / 100);
    }

    /**
     * Quick check if text is safe (no detailed analysis)
     */
    static isSafe(text: string): boolean {
        const result = this.moderateContent(text);
        return result.isClean;
    }

    /**
     * Get sanitized text without full moderation result
     */
    static sanitize(text: string): string {
        const result = this.moderateContent(text);
        return result.sanitizedText;
    }
}
