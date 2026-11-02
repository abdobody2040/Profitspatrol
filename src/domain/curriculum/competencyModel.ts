/**
 * ProfitsPatrol Competency Model (PRD Section 2 & Section 109)
 * Canonical 6 competency groups and granular skills representing
 * real-world financial literacy and entrepreneurial mastery.
 */

export type CompetencyGroupId =
  | 'money'
  | 'business'
  | 'marketing'
  | 'risk_ethics'
  | 'leadership'
  | 'innovation';

export interface CompetencyGroup {
  id: CompetencyGroupId;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  icon: string;
  color: string;
}

export interface Competency {
  id: string;
  groupId: CompetencyGroupId;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  icon: string;
}

export interface MasteryLevelResult {
  level: 1 | 2 | 3 | 4;
  titleEn: string;
  titleAr: string;
  xpInLevel: number;
  xpRequiredForNext: number;
  progressPercent: number; // 0 to 100
}

export const COMPETENCY_GROUPS: CompetencyGroup[] = [
  {
    id: 'money',
    nameEn: 'Money & Financial Literacy',
    nameAr: 'المال والوعي المالي',
    descriptionEn: 'Understanding money, earning, smart saving, budgeting, and banking.',
    descriptionAr: 'فهم النقود، الكسب، التوفير الذكي، الميزانية، والخدمات المصرفية.',
    icon: '💰',
    color: '#10B981'
  },
  {
    id: 'business',
    nameEn: 'Business & Production',
    nameAr: 'ريادة الأعمال والإنتاج',
    descriptionEn: 'Creating ventures, calculating costs, pricing, and serving customers.',
    descriptionAr: 'تأسيس المشاريع، حساب التكاليف، التسعير، وخدمة العملاء المميزة.',
    icon: '🚀',
    color: '#3B82F6'
  },
  {
    id: 'marketing',
    nameEn: 'Marketing & Communication',
    nameAr: 'التسويق والتواصل',
    descriptionEn: 'Branding, creative advertising, storytelling, and persuasion.',
    descriptionAr: 'بناء العلامة التجارية، الإعلانات الإبداعية، وسرد القصص المؤثرة.',
    icon: '📢',
    color: '#EC4899'
  },
  {
    id: 'risk_ethics',
    nameEn: 'Risk, Safety & Ethics',
    nameAr: 'المخاطر، الأمان والأخلاقيات',
    descriptionEn: 'Managing risk, spotting scams, philanthropy, and sustainable impact.',
    descriptionAr: 'إدارة المخاطر، كشف الاحتيال، العطاء الخيري، والأثر المستدام.',
    icon: '🛡️',
    color: '#8B5CF6'
  },
  {
    id: 'leadership',
    nameEn: 'Leadership & Strategy',
    nameAr: 'القيادة والاستراتيجية',
    descriptionEn: 'Team collaboration, win-win negotiation, and market strategy.',
    descriptionAr: 'العمل الجماعي، التفاوض البنّاء، والتخطيط الاستراتيجي في الأسواق.',
    icon: '👑',
    color: '#F59E0B'
  },
  {
    id: 'innovation',
    nameEn: 'Innovation & Technology',
    nameAr: 'الابتكار والتقنية',
    descriptionEn: 'Inventing products, experimenting with prototypes, and future tech.',
    descriptionAr: 'ابتكار المنتجات، تجربة النماذج الأولية، وتقنيات المستقبل الذكية.',
    icon: '💡',
    color: '#06B6D4'
  }
];

export const COMPETENCIES: Competency[] = [
  // ── 1. Money Group ──
  {
    id: 'cash_currency',
    groupId: 'money',
    nameEn: 'Cash & Currency',
    nameAr: 'النقود والعملات',
    descriptionEn: 'Recognizing coins, bills, and digital payments.',
    descriptionAr: 'التعرف على العملات المعدنية والورقية وطرق الدفع الرقمي.',
    icon: '🪙'
  },
  {
    id: 'saving_budgeting',
    groupId: 'money',
    nameEn: 'Saving & Budgeting',
    nameAr: 'التوفير والميزانية',
    descriptionEn: 'Planning money allocation and delaying gratification.',
    descriptionAr: 'تخطيط النفقات والتحكم في الرغبات لبناء التوفير.',
    icon: '🐷'
  },
  {
    id: 'banking_interest',
    groupId: 'money',
    nameEn: 'Banking & Growth',
    nameAr: 'البنوك والنمو المالي',
    descriptionEn: 'Safekeeping money and understanding compound growth.',
    descriptionAr: 'حفظ الأموال في البنوك وفهم النمو المركب واستثمار المدخرات.',
    icon: '🏦'
  },
  {
    id: 'needs_vs_wants',
    groupId: 'money',
    nameEn: 'Needs vs Wants',
    nameAr: 'الاحتياجات والرغبات',
    descriptionEn: 'Distinguishing essentials from optional purchases.',
    descriptionAr: 'التمييز الدقيق بين الأساسيات والرغبات الثانوية.',
    icon: '⚖️'
  },

  // ── 2. Business Group ──
  {
    id: 'business_basics',
    groupId: 'business',
    nameEn: 'Business Basics',
    nameAr: 'أساسيات المشاريع',
    descriptionEn: 'Turning problems into commercial solutions.',
    descriptionAr: 'تحويل المشكلات إلى حلول ومشاريع تجارية ناجحة.',
    icon: '💼'
  },
  {
    id: 'cost_pricing',
    groupId: 'business',
    nameEn: 'Costs & Pricing',
    nameAr: 'التكاليف والتسعير',
    descriptionEn: 'Calculating unit economics, profit margins, and sales pricing.',
    descriptionAr: 'حساب تكلفة المنتجات وهامش الربح والتسعير المناسب.',
    icon: '🏷️'
  },
  {
    id: 'customer_service',
    groupId: 'business',
    nameEn: 'Customer Experience',
    nameAr: 'تجربة العملاء',
    descriptionEn: 'Delivering exceptional care and retaining loyal patrons.',
    descriptionAr: 'تقديم رعاية متميزة وبناء ولاء وثقة الزبائن.',
    icon: '⭐'
  },
  {
    id: 'operations_supply',
    groupId: 'business',
    nameEn: 'Operations & Supply',
    nameAr: 'العمليات وسلاسل الإمداد',
    descriptionEn: 'Managing inventory, logistics, and resource flow.',
    descriptionAr: 'إدارة المخزون والخدمات اللوجستية وسلاسل التوريد بكفاءة.',
    icon: '📦'
  },

  // ── 3. Marketing Group ──
  {
    id: 'branding',
    groupId: 'marketing',
    nameEn: 'Brand Building',
    nameAr: 'بناء العلامة التجارية',
    descriptionEn: 'Crafting identity, logos, and market perception.',
    descriptionAr: 'تصميم الهوية البصرية، الشعار، وصورة المشروع الذهنية.',
    icon: '🎨'
  },
  {
    id: 'advertising',
    groupId: 'marketing',
    nameEn: 'Advertising & Outreach',
    nameAr: 'الإعلانات والترويج',
    descriptionEn: 'Reaching target audiences through creative campaigns.',
    descriptionAr: 'الوصول إلى الجمهور المستهدف عبر حملات تسويقية جذابة.',
    icon: '📣'
  },
  {
    id: 'sales_pitching',
    groupId: 'marketing',
    nameEn: 'Sales & Pitching',
    nameAr: 'المبيعات والعرض الإقناعي',
    descriptionEn: 'Presenting ideas persuasively and closing deals.',
    descriptionAr: 'عرض الأفكار بإقناع وثقة وإتمام صفقات البيع.',
    icon: '🎯'
  },

  // ── 4. Risk & Ethics Group ──
  {
    id: 'risk_management',
    groupId: 'risk_ethics',
    nameEn: 'Risk Management',
    nameAr: 'إدارة المخاطر',
    descriptionEn: 'Balancing upside opportunities with safety guards.',
    descriptionAr: 'الموازنة الذكية بين الفرص الواعدة وتأمين المخاطر.',
    icon: '🛡️'
  },
  {
    id: 'scam_safety',
    groupId: 'risk_ethics',
    nameEn: 'Scam Detection',
    nameAr: 'كشف الاحتيال المالي',
    descriptionEn: 'Identifying phishing, deceptive deals, and online fraud.',
    descriptionAr: 'اكتشاف العروض الوهمية والروابط المشبوهة وحماية الحسابات.',
    icon: '🔍'
  },
  {
    id: 'ethics_responsibility',
    groupId: 'risk_ethics',
    nameEn: 'Ethics & Philanthropy',
    nameAr: 'الأخلاقيات والعطاء المجتمعي',
    descriptionEn: 'Social impact, honesty, charity, and fair business practices.',
    descriptionAr: 'الأثر الإيجابي، الصدق في المعاملات، ودعم المجتمع بالخير.',
    icon: '🤝'
  },

  // ── 5. Leadership Group ──
  {
    id: 'teamwork',
    groupId: 'leadership',
    nameEn: 'Team Collaboration',
    nameAr: 'العمل الجماعي والقيادة',
    descriptionEn: 'Leading diverse teams and delegating effectively.',
    descriptionAr: 'قيادة فرق العمل وتحفيز الآخرين وتوزيع المهام بذكاء.',
    icon: '👥'
  },
  {
    id: 'negotiation',
    groupId: 'leadership',
    nameEn: 'Win-Win Negotiation',
    nameAr: 'التفاوض الإيجابي',
    descriptionEn: 'Finding agreements that benefit all parties involved.',
    descriptionAr: 'التوصل إلى حلول وصفقات ترضي جميع الأطراف المعنية.',
    icon: '🤝'
  },
  {
    id: 'corporate_strategy',
    groupId: 'leadership',
    nameEn: 'Corporate Strategy',
    nameAr: 'الاستراتيجية التنافسية',
    descriptionEn: 'Long-term planning, positioning, and defending competitive moats.',
    descriptionAr: 'التخطيط طويل الأمد، التميز التنافسي، وبناء مزايا فريدة.',
    icon: '♟️'
  },

  // ── 6. Innovation Group ──
  {
    id: 'ideation_prototyping',
    groupId: 'innovation',
    nameEn: 'Ideation & Prototyping',
    nameAr: 'الابتكار وبناء النماذج',
    descriptionEn: 'Brainstorming creative ideas and testing rapid prototypes.',
    descriptionAr: 'ابتكار أفكار جديدة وبناء نماذج تجريبية سريعة واختبارها.',
    icon: '🧪'
  },
  {
    id: 'future_tech',
    groupId: 'innovation',
    nameEn: 'Future Tech & AI',
    nameAr: 'تقنيات المستقبل والذكاء الاصطناعي',
    descriptionEn: 'Leveraging AI, automation, and emerging digital tools.',
    descriptionAr: 'توظيف الذكاء الاصطناعي والأتمتة وأدوات العصر الرقمي.',
    icon: '🤖'
  }
];

export function getCompetency(id: string): Competency | undefined {
  return COMPETENCIES.find(c => c.id === id);
}

export function getCompetenciesByGroup(groupId: CompetencyGroupId): Competency[] {
  return COMPETENCIES.filter(c => c.groupId === groupId);
}

/**
 * Calculates a player's mastery level in a given competency based on cumulative XP.
 * Level 1: 0 - 99 XP (Novice / مبتدئ)
 * Level 2: 100 - 299 XP (Apprentice / متدرب)
 * Level 3: 300 - 699 XP (Expert / خبير)
 * Level 4: 700+ XP (Master / أستاذ)
 */
export function calculateMasteryLevel(xp: number): MasteryLevelResult {
  const safeXp = Math.max(0, xp);

  if (safeXp < 100) {
    return {
      level: 1,
      titleEn: 'Novice',
      titleAr: 'مبتدئ',
      xpInLevel: safeXp,
      xpRequiredForNext: 100,
      progressPercent: Math.min(100, Math.round((safeXp / 100) * 100))
    };
  }

  if (safeXp < 300) {
    const xpInLevel = safeXp - 100;
    return {
      level: 2,
      titleEn: 'Apprentice',
      titleAr: 'متدرب',
      xpInLevel,
      xpRequiredForNext: 200,
      progressPercent: Math.min(100, Math.round((xpInLevel / 200) * 100))
    };
  }

  if (safeXp < 700) {
    const xpInLevel = safeXp - 300;
    return {
      level: 3,
      titleEn: 'Expert',
      titleAr: 'خبير',
      xpInLevel,
      xpRequiredForNext: 400,
      progressPercent: Math.min(100, Math.round((xpInLevel / 400) * 100))
    };
  }

  return {
    level: 4,
    titleEn: 'Master',
    titleAr: 'أستاذ',
    xpInLevel: safeXp - 700,
    xpRequiredForNext: 0,
    progressPercent: 100
  };
}
