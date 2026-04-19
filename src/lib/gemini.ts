// src/lib/gemini.ts

export interface DebateResult {
  ethicsScore: number;
  logicScore: number;
  feedback: string;
}

import { Logger } from '../services/logger';
import { RateLimiter } from '../utils/RateLimiter';
import { RateLimitError, ValidationError } from '../utils/errors';
import { PromptSanitizer } from '../utils/promptSanitizer';
import { ContentModerationService } from '../services/ContentModerationService';
import { AIPromptTemplates } from '../services/AIPromptTemplates';

// Rate limiter: 10 AI requests per minute per user
const aiRateLimiter = new RateLimiter(10, 60000);

/**
 * Validates a debate argument using Gemini (mocked for now).
 */
export const GeminiService = {
  evaluateDebate: async (topicId: string, argument: string, userId: string = 'anonymous'): Promise<DebateResult> => {
    // Rate limiting check
    if (!aiRateLimiter.canMakeRequest(userId)) {
      const remainingTime = aiRateLimiter.getRemainingTime(userId);
      throw new RateLimitError(remainingTime);
    }

    // Input validation
    if (!argument || argument.trim().length === 0) {
      throw new ValidationError('Argument cannot be empty');
    }

    if (argument.length > 5000) {
      throw new ValidationError('Argument too long (max 5000 characters)');
    }

    // Prompt injection protection
    const sanitizedArgument = await PromptSanitizer.sanitize(argument);

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const argLength = sanitizedArgument.length;

      // Mock Assessment Logic
      if (argLength < 20) {
        return {
          ethicsScore: 30,
          logicScore: 20,
          feedback: "That argument is a bit too short! Try explaining *why* you think that. Give me a reason!"
        };
      }

      // Keywords detection for "simulation" of AI
      const hasEthicalKeywords = /fair|right|wrong|good|bad|people|planet|hurt|help/i.test(sanitizedArgument);
      const hasLogicKeywords = /because|therefore|so|cost|profit|money|reason/i.test(sanitizedArgument);

      let ethics = 60 + Math.floor(Math.random() * 20);
      let logic = 60 + Math.floor(Math.random() * 20);

      if (hasEthicalKeywords) ethics += 15;
      if (hasLogicKeywords) logic += 15;

      // Cap at 100
      ethics = Math.min(ethics, 100);
      logic = Math.min(logic, 100);

      return {
        ethicsScore: ethics,
        logicScore: logic,
        feedback: generateFeedback(ethics, logic, sanitizedArgument)
      };
    } catch (error) {
      Logger.error("GeminiService: Failed to evaluate debate", error);
      return {
        ethicsScore: 0,
        logicScore: 0,
        feedback: "My brain connection is fuzzy right now. Please try again later!"
      };
    }
  }
};

function generateFeedback(ethics: number, logic: number, argument?: string): string {
  let feedback = '';

  // Detect potential logical fallacies if argument is provided
  const fallacies: string[] = [];
  if (argument) {
    const lowerArg = argument.toLowerCase();

    // Ad Hominem detection
    if (/stupid|dumb|idiot|moron/i.test(lowerArg)) {
      fallacies.push('Ad Hominem (attacking the person instead of the argument)');
    }

    // False Dichotomy detection
    if (/only two|either.*or|must choose/i.test(lowerArg)) {
      fallacies.push('False Dichotomy (presenting only two options when more exist)');
    }

    // Appeal to Emotion detection
    if (/everyone knows|obviously|clearly|of course/i.test(lowerArg)) {
      fallacies.push('Appeal to Common Belief (assuming something is true because many believe it)');
    }
  }

  // Add fallacy section if any detected
  if (fallacies.length > 0) {
    feedback += '**Logical Fallacies Detected:**\n';
    fallacies.forEach(f => feedback += `- ${f}\n`);
    feedback += '\n';
  }

  // Original feedback logic
  if (ethics > 85 && logic > 85) {
    feedback += "Wow! That's a CEO-level answer. You balanced profit and people perfectly. 🌟";
  } else if (ethics > 85) {
    feedback += "Your heart is in the right place! Great ethical stance, but maybe back it up with more business facts next time.";
  } else if (logic > 85) {
    feedback += "Brilliantly logical! But remember, a business that hurts people won't last long. Try to be a bit kinder.";
  } else {
    feedback += "Good start! Try to use words like 'because' to explain your reasoning clearly.";
  }

  return feedback;
}
// Restoration of missing function
// ✅ SECURITY FIX: Added input validation, prompt sanitization, and rate limiting
// that were missing from this function (all other AI entry points have them).
export const generateBookDetails = async (title: string, author: string, userId: string = 'anonymous') => {
  // Rate limit check — share the same limiter as other AI calls
  if (!aiRateLimiter.canMakeRequest(userId)) {
    throw new RateLimitError(aiRateLimiter.getRemainingTime(userId));
  }

  // Input length guards
  if (!title || title.length > 200) throw new ValidationError('Book title must be 1-200 characters');
  if (!author || author.length > 100) throw new ValidationError('Author name must be 1-100 characters');

  // Prompt injection protection
  const safeTitle = await PromptSanitizer.sanitize(title);
  const safeAuthor = await PromptSanitizer.sanitize(author);

  // Simulate delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  return {
    summary: `(AI Generated) ${safeTitle} by ${safeAuthor} is a fascinating book about resilience, strategy, and success. It teaches young entrepreneurs how to overcome obstacles and believe in their vision.`,
    keyLessons: [
      "Believe in your crazy ideas even when others don't.",
      "Failure is just a stepping stone to success.",
      "Always treat your team and customers with respect."
    ]
  };
};

// --- RESTORED LEGACY TYPES & FUNCTIONS ---

export interface ChatMessage {
  role: 'user' | 'model' | 'assistant' | 'system';
  parts: { text: string }[];
}

// Improved Rule-Based Grading logic
export const gradeProjectWithOllie = async (submissionContent: string, rubric: any, difficulty: 'EASY' | 'MEDIUM' | 'HARD' = 'MEDIUM') => {
  await new Promise(r => setTimeout(r, 2000)); // Simulate "Thinking"

  // Content moderation check
  const moderationResult = ContentModerationService.moderateContent(submissionContent);
  if (!moderationResult.isClean) {
    Logger.warn('[AI Security] Project submission contains violations', {
      violations: moderationResult.violations,
      confidence: moderationResult.confidence,
    });
  }

  const text = moderationResult.sanitizedText.trim();
  const lowerText = text.toLowerCase();

  // Define Thresholds
  let minLength = 50;
  let minKeywords = 2;

  if (difficulty === 'EASY') { minLength = 20; minKeywords = 1; }
  if (difficulty === 'HARD') { minLength = 100; minKeywords = 3; }

  // 1. Length Check
  if (text.length < minLength) {
    return {
      score: 40,
      letterGrade: 'Intern' as const,
      feedback: difficulty === 'EASY'
        ? "That's a little short! Can you write just one more sentence about your idea?"
        : "That's too short for a CEO! You need to explain your plan in detail.",
      rubricScores: { 'c1': 10, 'c2': 10, 'c3': 20 },
      bizCoinsAwarded: 10,
      xpGained: 10
    };
  }

  // 2. Keyword Check (Simple Heuristics)
  const keywords = ['customer', 'money', 'cost', 'price', 'profit', 'sell', 'buy', 'market', 'team', 'product', 'service', 'plan'];
  const foundKeywords = keywords.filter(k => lowerText.includes(k));

  if (foundKeywords.length < minKeywords) {
    return {
      score: 60,
      letterGrade: 'Founder' as const,
      feedback: `Good start, but for ${difficulty.toLowerCase()} mode, I need to see more business words like 'profit' or 'customer'.`,
      rubricScores: { 'c1': 20, 'c2': 20, 'c3': 20 },
      bizCoinsAwarded: 50,
      xpGained: 25
    };
  }

  // 3. Success Path (Detailed Feedback)
  const uniqueFound = Array.from(new Set(foundKeywords));
  const mention1 = uniqueFound[0] || 'your ideas';
  const mention2 = uniqueFound[1] || 'the details';

  const successFeedback = [
    `Fantastic work! You've successfully outlined a solid business plan.`,
    `I really liked how you included details about **${mention1}** and **${mention2}** - that shows you're thinking like a real entrepreneur.`,
    `Your plan is clear, covers the key points, and is ready for action.`
  ].join(' ');

  return {
    score: 95,
    letterGrade: 'Tycoon' as const,
    feedback: successFeedback,
    rubricScores: { 'c1': 35, 'c2': 30, 'c3': 30 },
    bizCoinsAwarded: 500,
    xpGained: 250
  };
};

export const getLemonadeFeedback = async (weather: string, price: number, sugar: number, sales: number) => {
  await new Promise(r => setTimeout(r, 1500));
  return "Your prices are a bit high for this weather. Try lowering them on rainy days!";
};

export const getOwlyExplanation = async (topic: string, difficulty?: number) => {
  await new Promise(r => setTimeout(r, 1000));
  return `Hoo hoo! ${topic} is very important. It means thinking ahead and planning your moves carefully!`;
};

// Updated signature to match usage: chatWithOllie(messages, userText)
// But wait, the file has chatWithOllie(message: string).
// Error says: "Expected 1 arguments, but got 2." at call site.
// So call site is sending 2 args, but I defined 1.
// I should overload it or change it to match legacy usage.
// Legacy usage seems to be (history[], newMessage).

// ✅ SECURITY FIX: Use the sliding-window RateLimiter instead of the random-clear Map.
// The original Map cleared ALL limits with ~10% probability on any request — completely
// undermining rate limiting. The singleton RateLimiter below is deterministic.
const checkRateLimit = (userId: string = 'guest') => {
    if (!aiRateLimiter.canMakeRequest(userId)) {
        throw new Error("Whoa! You're typing too fast. Take a breath!");
    }
};

// SECURITY: Input Sanitization
const sanitizeInput = (input: string) => {
  return input.replace(/[<>{}]/g, '').trim();
};

export const chatWithOllie = async (
  historyOrMessage: any,
  message?: string,
  // ✅ SECURITY FIX (HIGH-03): Accept userId so each user gets their own rate-limit bucket.
  // Previously checkRateLimit() was called with no argument, defaulting to 'guest' —
  // meaning ALL users shared a single bucket. One user could exhaust it for everyone.
  userId: string = 'anonymous'
): Promise<string> => {
  // Rate Limit Check — per-user bucket
  try { checkRateLimit(userId); } catch (e: any) { return e.message; }

  await new Promise(resolve => setTimeout(resolve, 1000));

  // Signature Normalization
  let userMsg = message || (typeof historyOrMessage === 'string' ? historyOrMessage : 'Hello');

  // Enhanced prompt sanitization
  try {
    userMsg = await PromptSanitizer.sanitize(userMsg);
  } catch (error) {
    Logger.warn('[AI Security] Prompt injection attempt blocked', { error });
    return "I can't do that, but I can help you with your business!";
  }

  // Content moderation
  const moderationResult = ContentModerationService.moderateContent(userMsg);
  if (!moderationResult.isClean) {
    Logger.warn('[AI Security] Chat message contains violations', {
      violations: moderationResult.violations,
    });
  }

  const cleanMsg = moderationResult.sanitizedText;
  const lower = cleanMsg.toLowerCase();

  // Use secure prompt template for general help
  const securePrompt = AIPromptTemplates.generalHelp(cleanMsg);
  Logger.info('[AI] Using secure prompt template', { promptLength: securePrompt.length });

  // Simple keyword-based responses (mock AI)
  let aiResponse = '';
  if (lower.includes('lemonade')) aiResponse = "Lemonade stands are a great first business! Remember to watch the weather.";
  else if (lower.includes('price')) aiResponse = "Pricing is tricky! Too high and no one buys, too low and you lose money.";
  else if (lower.includes('marketing')) aiResponse = "Marketing is telling your story. Why should people buy YOUR product?";
  else aiResponse = "That's a great question! What do YOU think is the answer?";

  // Moderate AI response before returning
  const responseModeration = ContentModerationService.moderateContent(aiResponse);
  if (!responseModeration.isClean) {
    Logger.warn('[AI Security] AI response contains violations', {
      violations: responseModeration.violations,
      severity: responseModeration.severity,
    });

    // Log to security monitoring
    void Logger.logSecurityEvent('ai_response_violation', responseModeration.severity, {
      violation_types: responseModeration.violations.map(v => v.type),
      violation_count: responseModeration.violations.length,
    });

    // Return sanitized response
    return responseModeration.sanitizedText;
  }

  return aiResponse;
};
