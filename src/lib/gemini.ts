// src/lib/gemini.ts

export interface DebateResult {
  ethicsScore: number;
  logicScore: number;
  feedback: string;
  fallaciesDetected: string[];
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
          feedback: "That argument is a bit too short! Try explaining *why* you think that. Give me a reason!",
          fallaciesDetected: []
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

      const fallacies = detectFallacies(sanitizedArgument);

      return {
        ethicsScore: ethics,
        logicScore: logic,
        feedback: generateFeedback(ethics, logic),
        fallaciesDetected: fallacies
      };
    } catch (error) {
      Logger.error("GeminiService: Failed to evaluate debate", error);
      return {
        ethicsScore: 0,
        logicScore: 0,
        feedback: "My brain connection is fuzzy right now. Please try again later!",
        fallaciesDetected: []
      };
    }
  }
};

function detectFallacies(argument?: string): string[] {
  const fallacies: string[] = [];
  if (!argument) return fallacies;
  
  const lowerArg = argument.toLowerCase();

  // Ad Hominem detection
  if (/stupid|dumb|idiot|moron|crazy/i.test(lowerArg)) {
    fallacies.push('Ad Hominem (Attacking the person instead of the argument)');
  }

  // False Dichotomy detection
  if (/only two|either.*or|must choose|no other way/i.test(lowerArg)) {
    fallacies.push('False Dichotomy (Presenting only two options when more exist)');
  }

  // Appeal to Emotion / Popularity
  if (/everyone knows|obviously|clearly|of course|always/i.test(lowerArg)) {
    fallacies.push('Appeal to Popularity (Assuming something is true because many believe it)');
  }

  // Slippery Slope
  if (/will lead to|end of the world|destroy everything/i.test(lowerArg)) {
    fallacies.push('Slippery Slope (Assuming a small step leads to an extreme outcome)');
  }

  return fallacies;
}

function generateFeedback(ethics: number, logic: number): string {
  let feedback = '';

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
  const isArabicText = /[\u0600-\u06FF]/.test(text);

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
      feedback: isArabicText
        ? (difficulty === 'EASY'
            ? "هذا قصير بعض الشيء! هل يمكنك كتابة جملة أو اثنتين إضافيتين توضح فكرتك الرائعة؟"
            : "هذا قصير جداً بالنسبة لرائد أعمال واعد! اشرح خطتك وتفاصيل مشروعك أكثر.")
        : (difficulty === 'EASY'
            ? "That's a little short! Can you write just one more sentence about your idea?"
            : "That's too short for a CEO! You need to explain your plan in detail."),
      rubricScores: { 'c1': 10, 'c2': 10, 'c3': 20 },
      ppTokensAwarded: 10,
      xpGained: 10
    };
  }

  // 2. Keyword Check (Multilingual Heuristics)
  const englishKeywords = ['customer', 'money', 'cost', 'price', 'profit', 'sell', 'buy', 'market', 'team', 'product', 'service', 'plan'];
  const arabicKeywords = ['عميل', 'عملاء', 'زبون', 'زبائن', 'مال', 'أموال', 'نقود', 'فلوس', 'تكلفة', 'تكاليف', 'سعر', 'أسعار', 'ربح', 'أرباح', 'بيع', 'مبيعات', 'شراء', 'سوق', 'تسويق', 'فريق', 'منتج', 'منتجات', 'خدمة', 'خدمات', 'خطة', 'مشروع', 'شركة', 'استثمار'];
  const otherKeywords = ['client', 'argent', 'cout', 'coût', 'prix', 'profit', 'vendre', 'acheter', 'marche', 'marché', 'equipe', 'équipe', 'produit', 'dinero', 'costo', 'precio', 'ganancia', 'mercado', 'kunde', 'geld', 'kosten', 'gewinn'];
  const keywords = [...englishKeywords, ...arabicKeywords, ...otherKeywords];
  const foundKeywords = keywords.filter(k => lowerText.includes(k));

  if (foundKeywords.length < minKeywords) {
    return {
      score: 60,
      letterGrade: 'Founder' as const,
      feedback: isArabicText
        ? `بداية جيدة ومبشرة! ولكن لمستوى التحدي هذا، نحتاج لاستخدام مصطلحات تجارية أكثر مثل 'الربح' أو 'العملاء' أو 'التكلفة'.`
        : `Good start, but for ${difficulty.toLowerCase()} mode, I need to see more business words like 'profit' or 'customer'.`,
      rubricScores: { 'c1': 20, 'c2': 20, 'c3': 20 },
      ppTokensAwarded: 50,
      xpGained: 25
    };
  }

  // 3. Success Path (Detailed Feedback)
  const uniqueFound = Array.from(new Set(foundKeywords));
  const mention1 = uniqueFound[0] || (isArabicText ? 'أفكارك' : 'your ideas');
  const mention2 = uniqueFound[1] || (isArabicText ? 'التفاصيل' : 'the details');

  const successFeedback = isArabicText
    ? `عمل رائع ومبهر! لقد وضعت خطة عمل محكمة وواضحة. أعجبني كثيراً تركيزك على **${mention1}** و **${mention2}** - وهذا يثبت أنك تفكر كرائد أعمال حقيقي. خطتك جاهزة للتنفيذ الآن!`
    : [
        `Fantastic work! You've successfully outlined a solid business plan.`,
        `I really liked how you included details about **${mention1}** and **${mention2}** - that shows you're thinking like a real entrepreneur.`,
        `Your plan is clear, covers the key points, and is ready for action.`
      ].join(' ');

  return {
    score: 95,
    letterGrade: 'Tycoon' as const,
    feedback: successFeedback,
    rubricScores: { 'c1': 35, 'c2': 30, 'c3': 30 },
    ppTokensAwarded: 500,
    xpGained: 250
  };
};

export const getLemonadeFeedback = async (weather: string, price: number, sugar: number, sales: number) => {
  await new Promise(r => setTimeout(r, 1500));
  return "Your prices are a bit high for this weather. Try lowering them on rainy days!";
};

const DEFINITIONS_DB: Record<string, { en: string; ar: string }> = {
  'barter system': {
    en: "The Barter System is swapping items you have for items you need, without using money!",
    ar: "نظام المقايضة هو تبادل السلع التي تملكها مقابل سلع تحتاجها، دون استخدام النقود!"
  },
  'المقايضة': {
    en: "The Barter System is swapping items you have for items you need, without using money!",
    ar: "نظام المقايضة هو تبادل السلع التي تملكها مقابل سلع تحتاجها، دون استخدام النقود!"
  },
  'نظام المقايضة': {
    en: "The Barter System is swapping items you have for items you need, without using money!",
    ar: "نظام المقايضة هو تبادل السلع التي تملكها مقابل سلع تحتاجها، دون استخدام النقود!"
  },
  'currency': {
    en: "Currency is the official system of money (like coins and bills) used in a country.",
    ar: "العملة هي النظام الرسمي للنقود (مثل العملات المعدنية والورقية) المستخدم في بلد ما."
  },
  'العملات المعدنية': {
    en: "Currency is the official system of money (like coins and bills) used in a country.",
    ar: "العملة هي النظام الرسمي للنقود (مثل العملات المعدنية والورقية) المستخدم في بلد ما."
  },
  'العملات': {
    en: "Currency is the official system of money (like coins and bills) used in a country.",
    ar: "العملة هي النظام الرسمي للنقود (مثل العملات المعدنية والورقية) المستخدم في بلد ما."
  },
  'earn': {
    en: "To Earn means to get money in return for work, services, or selling products.",
    ar: "كسب المال يعني الحصول على النقود مقابل العمل، تقديم الخدمات، أو بيع المنتجات."
  },
  'يكسبون': {
    en: "To Earn means to get money in return for work, services, or selling products.",
    ar: "كسب المال يعني الحصول على النقود مقابل العمل، تقديم الخدمات، أو بيع المنتجات."
  },
  'الكسب': {
    en: "To Earn means to get money in return for work, services, or selling products.",
    ar: "كسب المال يعني الحصول على النقود مقابل العمل، تقديم الخدمات، أو بيع المنتجات."
  },
  'piggy bank': {
    en: "A Piggy Bank is a container to save and keep your coins and cash safe for future goals!",
    ar: "حصالة النقود هي وعاء لادخار وحفظ نقودك المعدنية والورقية بأمان لتحقيق أهدافك المستقبلية!"
  },
  'حصالة النقود': {
    en: "A Piggy Bank is a container to save and keep your coins and cash safe for future goals!",
    ar: "حصالة النقود هي وعاء لادخار وحفظ نقودك المعدنية والورقية بأمان لتحقيق أهدافك المستقبلية!"
  },
  'needs': {
    en: "Needs are essential things you must have to survive, like food, water, and shelter.",
    ar: "الاحتياجات هي الأشياء الأساسية التي يجب أن تحصل عليها للبقاء على قيد الحياة، مثل الماء والغذاء والمأوى."
  },
  'الاحتياجات': {
    en: "Needs are essential things you must have to survive, like food, water, and shelter.",
    ar: "الاحتياجات هي الأشياء الأساسية التي يجب أن تحصل عليها للبقاء على قيد الحياة، مثل الماء والغذاء والمأوى."
  },
  'philanthropy': {
    en: "Philanthropy means donating money, time, or resources to help other people or good causes.",
    ar: "العمل الخيري يعني التبرع بالمال أو الوقت أو الموارد لمساعدة الآخرين أو دعم القضايا النبيلة."
  },
  'العمل الخيري': {
    en: "Philanthropy means donating money, time, or resources to help other people or good causes.",
    ar: "العمل الخيري يعني التبرع بالمال أو الوقت أو الموارد لمساعدة الآخرين أو دعم القضايا النبيلة."
  },
  'bank': {
    en: "A Bank is a safe place that keeps your money secure, handles deposits, and offers accounts.",
    ar: "البنك هو مكان آمن يحفظ أموالك، ويدير الإيداعات، ويقدم الحسابات المصرفية."
  },
  'البنك': {
    en: "A Bank is a safe place that keeps your money secure, handles deposits, and offers accounts.",
    ar: "البنك هو مكان آمن يحفظ أموالك، ويدير الإيداعات، ويقدم الحسابات المصرفية."
  },
  'interest': {
    en: "Interest is extra money paid to you by the bank for keeping your savings with them.",
    ar: "الفائدة هي مال إضافي يدفعه البنك لك مقابل الاحتفاظ بمدخراتك لديه."
  },
  'فائدة': {
    en: "Interest is extra money paid to you by the bank for keeping your savings with them.",
    ar: "الفائدة هي مال إضافي يدفعه البنك لك مقابل الاحتفاظ بمدخراتك لديه."
  },
  'الفائدة': {
    en: "Interest is extra money paid to you by the bank for keeping your savings with them.",
    ar: "الفائدة هي مال إضافي يدفعه البنك لك مقابل الاحتفاظ بمدخراتك لديه."
  },
  'الربح': {
    en: "Profit is the money left over after you subtract all your business costs from your total sales.",
    ar: "الربح هو الأموال المتبقية بعد طرح جميع تكاليف العمل التجاري من إجمالي المبيعات."
  },
  'profit': {
    en: "Profit is the money left over after you subtract all your business costs from your total sales.",
    ar: "الربح هو الأموال المتبقية بعد طرح جميع تكاليف العمل التجاري من إجمالي المبيعات."
  },
  'budget': {
    en: "A Budget is a plan that helps you track how much money you earn, spend, and save.",
    ar: "الميزانية هي خطة تساعدك على تتبع كمية الأموال التي تكسبها، تنفقها، وتدخرها."
  },
  'ميزانية': {
    en: "A Budget is a plan that helps you track how much money you earn, spend, and save.",
    ar: "الميزانية هي خطة تساعدك على تتبع كمية الأموال التي تكسبها، تنفقها، وتدخرها."
  },
  'الميزانية': {
    en: "A Budget is a plan that helps you track how much money you earn, spend, and save.",
    ar: "الميزانية هي خطة تساعدك على تتبع كمية الأموال التي تكسبها، تنفقها، وتدخرها."
  },
  'digital money': {
    en: "Digital Money is money that exists electronically in bank accounts and apps rather than physical cash.",
    ar: "المال الرقمي هو النقود التي توجد إلكترونياً في الحسابات والتطبيقات بدلاً من السيولة النقدية الورقية."
  },
  'المال الرقمي': {
    en: "Digital Money is money that exists electronically in bank accounts and apps rather than physical cash.",
    ar: "المال الرقمي هو النقود التي توجد إلكترونياً في الحسابات والتطبيقات بدلاً من السيولة النقدية الورقية."
  },
  'business': {
    en: "A Business is an organization or venture that provides goods or services to solve problems for profit.",
    ar: "العمل التجاري هو مؤسسة أو مشروع يقدم سلعاً أو خدمات لحل المشكلات مقابل تحقيق الربح."
  },
  'العمل التجاري': {
    en: "A Business is an organization or venture that provides goods or services to solve problems for profit.",
    ar: "العمل التجاري هو مؤسسة أو مشروع يقدم سلعاً أو خدمات لحل المشكلات مقابل تحقيق الربح."
  },
  'cost': {
    en: "Cost is the amount of money spent to buy ingredients, make products, or run a business.",
    ar: "التكلفة هي كمية الأموال التي تنفقها لشراء المكونات، تصنيع المنتجات، أو إدارة عملك التجاري."
  },
  'التكلفة': {
    en: "Cost is the amount of money spent to buy ingredients, make products, or run a business.",
    ar: "التكلفة هي كمية الأموال التي تنفقها لشراء المكونات، تصنيع المنتجات، أو إدارة عملك التجاري."
  },
  'handmade goods': {
    en: "Handmade Goods are items crafted by hand rather than produced in large quantities by factory machines.",
    ar: "المنتجات اليدوية هي السلع التي تُصنع يدوياً بدلاً من إنتاجها بكميات كبيرة بواسطة آلات المصانع."
  },
  'المنتجات اليدوية': {
    en: "Handmade Goods are items crafted by hand rather than produced in large quantities by factory machines.",
    ar: "المنتجات اليدوية هي السلع التي تُصنع يدوياً بدلاً من إنتاجها بكميات كبيرة بواسطة آلات المصانع."
  },
  'logo': {
    en: "A Logo is a unique symbol or design used by a company to represent its brand so people remember it.",
    ar: "الشعار هو رمز أو تصميم فريد تستخدمه الشركة لتمثيل علامتها التجارية ليسهل على الناس تذكرها."
  },
  'الشعار': {
    en: "A Logo is a unique symbol or design used by a company to represent its brand so people remember it.",
    ar: "الشعار هو رمز أو تصميم فريد تستخدمه الشركة لتمثيل علامتها التجارية ليسهل على الناس تذكرها."
  },
  'customer service': {
    en: "Customer Service is helping and treating your buyers with respect and kindness to keep them happy.",
    ar: "خدمة العملاء هي مساعدة المشترين ومعاملتهم باحترام ولطف للحفاظ على رضاهم وسعادتهم."
  },
  'خدمة العملاء': {
    en: "Customer Service is helping and treating your buyers with respect and kindness to keep them happy.",
    ar: "خدمة العملاء هي مساعدة المشترين ومعاملتهم باحترام ولطف للحفاظ على رضاهم وسعادتهم."
  },
  'marketing': {
    en: "Marketing is promoting and telling people about your product or service to attract customers.",
    ar: "التسويق هو الترويج وإخبار الناس بمنتجك أو خدمتك لجذب العملاء وتنمية أعمالك."
  },
  'التسويق': {
    en: "Marketing is promoting and telling people about your product or service to attract customers.",
    ar: "التسويق هو الترويج وإخبار الناس بمنتجك أو خدمتك لجذب العملاء وتنمية أعمالك."
  },
  'e-commerce': {
    en: "E-commerce is buying and selling goods or services over the internet instead of in physical stores.",
    ar: "التجارة الإلكترونية هي عملية بيع وشراء السلع أو الخدمات عبر الإنترنت بدلاً من المتاجر الفعلية."
  },
  'التجارة الإلكترونية': {
    en: "E-commerce is buying and selling goods or services over the internet instead of in physical stores.",
    ar: "التجارة الإلكترونية هي عملية بيع وشراء السلع أو الخدمات عبر الإنترنت بدلاً من المتاجر الفعلية."
  },
  'feedback': {
    en: "Feedback is opinions and suggestions from customers about how to improve your products or services.",
    ar: "التغذية الراجعة هي آراء ومقترحات العملاء حول كيفية تحسين منتجاتك أو خدماتك."
  },
  'التغذية الراجعة': {
    en: "Feedback is opinions and suggestions from customers about how to improve your products or services.",
    ar: "التغذية الراجعة هي آراء ومقترحات العملاء حول كيفية تحسين منتجاتك أو خدماتك."
  },
  'scale up': {
    en: "Scaling Up means expanding your business, hiring helpers, and growing to reach more customers.",
    ar: "التوسع يعني توسيع نطاق عملك التجاري، وتوظيف مساعدين، والنمو للوصول لعملاء أكثر."
  },
  'التوسع': {
    en: "Scaling Up means expanding your business, hiring helpers, and growing to reach more customers.",
    ar: "التوسع يعني توسيع نطاق عملك التجاري، وتوظيف مساعدين، والنمو للوصول لعملاء أكثر."
  },
  'investing': {
    en: "Investing is putting your money into assets (like stocks or property) to make it grow over time.",
    ar: "الاستثمار هو وضع أموالك in أصول (مثل الأسهم أو العقارات) لتنمو وتزداد قيمتها بمرور الوقت."
  },
  'الاستثمار': {
    en: "Investing is putting your money into assets (like stocks or property) to make it grow over time.",
    ar: "الاستثمار هو وضع أموالك في أصول (مثل الأسهم أو العقارات) لتنمو وتزداد قيمتها بمرور الوقت."
  },
  'stock': {
    en: "A Stock represents ownership of a tiny slice of a company. If the company grows, your stock gains value!",
    ar: "السهم يمثل ملكية جزء صغير جداً من الشركة. إذا نمت الشركة، تزداد قيمة سهمك!"
  },
  'السهم': {
    en: "A Stock represents ownership of a tiny slice of a company. If the company grows, your stock gains value!",
    ar: "السهم يمثل ملكية جزء صغير جداً من الشركة. إذا نمت الشركة، تزداد قيمة سهمك!"
  },
  'compound interest': {
    en: "Compound Interest is earning interest on top of the interest you already earned, making your savings snowball!",
    ar: "الفائدة المركبة هي كسب فائدة على الفائدة التي كسبتها بالفعل، مما يجعل مدخراتك تنمو ككرة الثلج!"
  },
  'الفائدة المركبة': {
    en: "Compound Interest is earning interest on top of the interest you already earned, making your savings snowball!",
    ar: "الفائدة المركبة هي كسب فائدة على الفائدة التي كسبتها بالفعل، مما يجعل مدخراتك تنمو ككرة الثلج!"
  },
  'real estate': {
    en: "Real Estate means buying land or buildings, and renting them out to earn steady monthly income.",
    ar: "الاستثمار العقاري يعني شراء الأراضي أو المباني، وتأجيرها للحصول على دخل شهري ثابت."
  },
  'العقارات': {
    en: "Real Estate means buying land or buildings, and renting them out to earn steady monthly income.",
    ar: "الاستثمار العقاري يعني شراء الأراضي أو المباني، وتأجيرها للحصول على دخل شهري ثابت."
  },
  'bond': {
    en: "A Bond is a safe loan you make to a government or corporation that pays you back with interest.",
    ar: "السند هو قرض آمن تقدمه للحكومة أو للشركات، وتلتزم برده إليك مع فائدة إضافية."
  },
  'السند': {
    en: "A Bond is a safe loan you make to a government or corporation that pays you back with interest.",
    ar: "السند هو قرض آمن تقدمه للحكومة أو للشركات، وتلتزم برده إليك مع فائدة إضافية."
  },
  'diversification': {
    en: "Diversification is spreading your money across different investments to reduce risk and protect your savings.",
    ar: "التنويع هو توزيع أموالك على استثمارات مختلفة لتقليل المخاطر وحماية مدخراتك."
  },
  'التنويع': {
    en: "Diversification is spreading your money across different investments to reduce risk and protect your savings.",
    ar: "التنويع هو توزيع أموالك على استثمارات مختلفة لتقليل المخاطر وحماية مدخراتك."
  },
  'risk': {
    en: "Risk is the chance of losing money on an investment, which is often balanced by the potential for high reward.",
    ar: "المخاطرة هي احتمال خسارة الأموال في الاستثمار، وغالباً ما تتناسب مع فرصة تحقيق أرباح عالية."
  },
  'المخاطرة': {
    en: "Risk is the chance of losing money on an investment, which is often balanced by the potential for high reward.",
    ar: "المخاطرة هي احتمال خسارة الأموال في الاستثمار، وغالباً ما تتناسب مع فرصة تحقيق أرباح عالية."
  },
  'warren buffett': {
    en: "Warren Buffett is one of the most successful investors in history, known for buying great companies and keeping them long-term.",
    ar: "وارن بافيت هو أحد أنجح المستثمرين في التاريخ، ويشتهر بشراء الشركات الجيدة والاحتفاظ بها لفترات طويلة."
  },
  'وارن بافيت': {
    en: "Warren Buffett is one of the most successful investors in history, known for buying great companies and keeping them long-term.",
    ar: "وارن بافيت هو أحد أنجح المستثمرين في التاريخ، ويشتهر بشراء الشركات الجيدة والاحتفاظ بها لفترات طويلة."
  },
  'human capital': {
    en: "Human Capital is investing in yourself by learning new skills, coding, or arts to increase your value.",
    ar: "رأس المال البشري هو الاستثمار في نفسك من خلال تعلم مهارات جديدة، مثل البرمجة أو الفنون، لزيادة قيمتك."
  },
  'رأس المال البشري': {
    en: "Human Capital is investing in yourself by learning new skills, coding, or arts to increase your value.",
    ar: "رأس المال البشري هو الاستثمار في نفسك من خلال تعلم مهارات جديدة، مثل البرمجة أو الفنون، لزيادة قيمتك."
  },
  'patience': {
    en: "Patience in investing means waiting for your money to grow over a long period rather than panicking.",
    ar: "الصبر في الاستثمار يعني الانتظار حتى تنمو أموالك على المدى الطويل بدلاً من الذعر والبيع السريع."
  },
  'الصبر': {
    en: "Patience in investing means waiting for your money to grow over a long period rather than panicking.",
    ar: "الصبر في الاستثمار يعني الانتظار حتى تنمو أموالك على المدى الطويل بدلاً من الذعر والبيع السريع."
  },
  'leader': {
    en: "A Leader is someone who guides, supports, and inspires a team to achieve a shared goal together.",
    ar: "القائد هو الشخص الذي يوجه ويدعم ويلهم الفريق لتحقيق هدف مشترك معاً."
  },
  'القائد': {
    en: "A Leader is someone who guides, supports, and inspires a team to achieve a shared goal together.",
    ar: "القائد هو الشخص الذي يوجه ويدعم ويلهم الفريق لتحقيق هدف مشترك معاً."
  },
  'economics': {
    en: "Economics is the study of how people make choices to share limited resources.",
    ar: "الاقتصاد هو دراسة كيفية اتخاذ الناس للخيارات لتوزيع الموارد المحدودة."
  },
  'الاقتصاد': {
    en: "Economics is the study of how people make choices to share limited resources.",
    ar: "الاقتصاد هو دراسة كيفية اتخاذ الناس للخيارات لتوزيع الموارد المحدودة."
  },
  'supply': {
    en: "Supply is how much of a product is available, which affects its price based on demand.",
    ar: "العرض هو كمية المنتج المتاحة للبيع، وتؤثر على السعر بناءً على حجم الطلب."
  },
  'العرض': {
    en: "Supply is how much of a product is available, which affects its price based on demand.",
    ar: "العرض هو كمية المنتج المتاحة للبيع، وتؤثر على السعر بناءً على حجم الطلب."
  },
  'scarcity': {
    en: "Scarcity means something is rare and limited, making it more valuable and expensive.",
    ar: "الندرة تعني أن الشيء نادر ومحدود، مما يجعله أكثر قيمة وارتفاعاً في السعر."
  },
  'الندرة': {
    en: "Scarcity means something is rare and limited, making it more valuable and expensive.",
    ar: "الندرة تعني أن الشيء نادر ومحدود، مما يجعله أكثر قيمة وارتفاعاً في السعر."
  },
  'app': {
    en: "An App is a software program designed to run on smartphones or tablets to perform a specific task.",
    ar: "التطبيق هو برنامج مصمم للتشغيل على الهواتف الذكية أو الأجهزة اللوحية لأداء مهمة معينة."
  },
  'التطبيق': {
    en: "An App is a software program designed to run on smartphones or tablets to perform a specific task.",
    ar: "التطبيق هو برنامج مصمم للتشغيل على الهواتف الذكية أو الأجهزة اللوحية لأداء مهمة معينة."
  },
  'coding': {
    en: "Coding is writing precise instructions that direct a computer or robot on what to do.",
    ar: "البرمجة هي كتابة تعليمات دقيقة توجه الكمبيوتر أو الروبوت حول ما يجب القيام به."
  },
  'البرمجة': {
    en: "Coding is writing precise instructions that direct a computer or robot on what to do.",
    ar: "البرمجة هي كتابة تعليمات دقيقة توجه الكمبيوتر أو الروبوت حول ما يجب القيام به."
  },
  'ai': {
    en: "Artificial Intelligence (AI) is technology that allows computers to learn, think, and make decisions.",
    ar: "الذكاء الاصطناعي هو تقنية تسمح لأجهزة الكمبيوتر بالتعلم والتفكير واتخاذ القرارات."
  },
  'الذكاء الاصطناعي': {
    en: "Artificial Intelligence (AI) is technology that allows computers to learn, think, and make decisions.",
    ar: "الذكاء الاصطناعي هو تقنية تسمح لأجهزة الكمبيوتر بالتعلم والتفكير واتخاذ القرارات."
  }
};

export const getOwlyExplanation = async (topic: string, difficulty?: number, language?: string) => {
  await new Promise(r => setTimeout(r, 1000));
  const cleanTopic = topic.replace(/\*\*/g, '').trim().toLowerCase();
  const entry = DEFINITIONS_DB[cleanTopic];
  if (entry) {
    if (language === 'ar') {
      return `هوت هوت! 🦉 ${entry.ar}`;
    }
    return `Hoo hoo! 🦉 ${entry.en}`;
  }
  if (language === 'ar') {
    return `هوت هوت! 🦉 "${topic}" هو مفهوم تجاري مهم يساعدك على بناء إمبراطوريتك. فلنتعلم المزيد عنه!`;
  }
  return `Hoo hoo! 🦉 "${topic}" is an important business concept that helps you build your empire. Let's learn more about it!`;
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
  const isArabicMsg = /[\u0600-\u06FF]/.test(cleanMsg);
  let aiResponse = '';
  if (isArabicMsg) {
    if (lower.includes('عصير') || lower.includes('ليمون')) {
      aiResponse = "كشك العصير فكرة رائعة كبداية لمشروعك! تذكر دائماً متابعة الطقس وأسعار المكونات. 🍋";
    } else if (lower.includes('سعر') || lower.includes('تسعير')) {
      aiResponse = "التسعير يحتاج حكمة وذكاء! السعر المرتفع جداً يبعد الزبائن، والمنخفض جداً يقلل الأرباح. 🏷️";
    } else if (lower.includes('تسويق')) {
      aiResponse = "التسويق هو سرد قصتك الرائعة للناس! لماذا يجب عليهم شراء منتجك بالذات؟ 📢";
    } else {
      aiResponse = "سؤال ذكي يا بطل! 🦉 فكّر في المفاهيم التي شرحناها، وستصل للإجابة الصحيحة بكل سهولة.";
    }
  } else {
    if (lower.includes('lemonade')) aiResponse = "Lemonade stands are a great first business! Remember to watch the weather.";
    else if (lower.includes('price')) aiResponse = "Pricing is tricky! Too high and no one buys, too low and you lose money.";
    else if (lower.includes('marketing')) aiResponse = "Marketing is telling your story. Why should people buy YOUR product?";
    else aiResponse = "That's a great question! What do YOU think is the answer?";
  }

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
