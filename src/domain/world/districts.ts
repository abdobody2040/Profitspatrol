/**
 * ProfitsPatrol 8-District World Architecture (PRD Section 8 - 15)
 * Defines canonical districts, guide heroes, theme styling, and module mappings.
 */

import { CharacterId } from '../../lib/assets/assetRegistry';
import { GameDistrict } from '../..//features/games/types';

export type DistrictId = GameDistrict;

export interface DistrictInfo {
  id: DistrictId;
  number: number; // 1 to 8
  nameEn: string;
  nameAr: string;
  taglineEn: string;
  taglineAr: string;
  descriptionEn: string;
  descriptionAr: string;
  heroGuide: CharacterId;
  themeColor: string; // Primary hex color
  accentColor: string;
  icon: string;
  modules: string[]; // Modules belonging to this district
  coreSkills: string[];
  requiredLevel: number;
  unlockedByDefault: boolean;
}

export const DISTRICTS: DistrictInfo[] = [
  {
    id: 'money',
    number: 1,
    nameEn: 'Money District',
    nameAr: 'حي النقود والتوفير',
    taglineEn: 'The Fountain of Smart Saving',
    taglineAr: 'ينبوع التوفير الذكي والتخطيط',
    descriptionEn: 'Learn earning, smart spending, saving, budgeting, and bank safekeeping.',
    descriptionAr: 'تعلّم كسب المال، الإنفاق الحكيم، التوفير، وضع الميزانية، وحفظ الأموال في البنوك.',
    heroGuide: 'ollie',
    themeColor: '#10B981',
    accentColor: '#34D399',
    icon: '💰',
    modules: ['MOD_MB', 'MOD_FIN', 'MOD_FUTURE'],
    coreSkills: ['earning', 'spending', 'saving', 'budgeting', 'banking'],
    requiredLevel: 1,
    unlockedByDefault: true
  },
  {
    id: 'builders',
    number: 2,
    nameEn: 'Builders District',
    nameAr: 'حي البناة وصناع الأعمال',
    taglineEn: 'Turning Ideas into Real Businesses',
    taglineAr: 'تحويل الأفكار إلى مشاريع حقيقية',
    descriptionEn: 'Build businesses from scratch, calculate costs, set prices, and attract customers.',
    descriptionAr: 'أنشئ مشاريعك الخاصة، احسب التكاليف، حدد الأسعار، واجذب الزبائن بذكاء.',
    heroGuide: 'reema',
    themeColor: '#3B82F6',
    accentColor: '#60A5FA',
    icon: '🚀',
    modules: ['MOD_ENT', 'MOD_MKT', 'MOD_BRAND'],
    coreSkills: ['business_creation', 'pricing', 'customer_service', 'branding'],
    requiredLevel: 3,
    unlockedByDefault: false
  },
  {
    id: 'risk',
    number: 3,
    nameEn: 'Risk & Wealth District',
    nameAr: 'حي الثروة وحماية المخاطر',
    taglineEn: 'Compound Your Growth, Guard Against Scams',
    taglineAr: 'نمِّ ثروتك واحذر من المخاطر والاحتيال',
    descriptionEn: 'Explore investing principles, compounding returns, diversification, and scam defense.',
    descriptionAr: 'استكشف مبادئ الاستثمار، العائد المركب، تنويع الأصول، والتصدي للاحتيال المالي.',
    heroGuide: 'filo',
    themeColor: '#8B5CF6',
    accentColor: '#A78BFA',
    icon: '🛡️',
    modules: ['MOD_INV', 'MOD_CRYPTO', 'MOD_VC'],
    coreSkills: ['investing', 'compounding', 'risk_management', 'scam_defense'],
    requiredLevel: 5,
    unlockedByDefault: false
  },
  {
    id: 'operations',
    number: 4,
    nameEn: 'Operations District',
    nameAr: 'حي العمليات وسلاسل الإمداد',
    taglineEn: 'The Engine of Business Flow',
    taglineAr: 'محرك الكفاءة وسرعة التوريد',
    descriptionEn: 'Master inventory control, supply chain logistics, time management, and problem solving.',
    descriptionAr: 'أتقن إدارة المخزون، سلاسل التوريد، تنظيم الوقت، وحل أزمات التشغيل.',
    heroGuide: 'filo',
    themeColor: '#F59E0B',
    accentColor: '#FBBF24',
    icon: '⚙️',
    modules: ['MOD_ECO', 'MOD_GLOB', 'MOD_FMD'],
    coreSkills: ['logistics', 'inventory', 'supply_chain', 'efficiency'],
    requiredLevel: 7,
    unlockedByDefault: false
  },
  {
    id: 'innovation',
    number: 5,
    nameEn: 'Innovation District',
    nameAr: 'حي الابتكار وتكنولوجيا المستقبل',
    taglineEn: 'Inventing Tomorrow Today',
    taglineAr: 'ابتكار المستقبل بأيدي اليوم',
    descriptionEn: 'Create inventive prototypes, test with users, and leverage artificial intelligence.',
    descriptionAr: 'اصنع نماذج أولية مبتكرة، اختبرها مع المستخدمين، ووظف الذكاء الاصطناعي.',
    heroGuide: 'kami',
    themeColor: '#06B6D4',
    accentColor: '#22D3EE',
    icon: '💡',
    modules: ['MOD_TECH', 'MOD_AIJOB'],
    coreSkills: ['prototyping', 'product_testing', 'emerging_tech', 'experimentation'],
    requiredLevel: 9,
    unlockedByDefault: false
  },
  {
    id: 'leadership',
    number: 6,
    nameEn: 'Leadership District',
    nameAr: 'حي القيادة والتفاوض',
    taglineEn: 'Inspiring Teams, Winning Fair Deals',
    taglineAr: 'إلهام الفرق وعقد الصفقات الرابحة',
    descriptionEn: 'Build high-performing teams, master win-win negotiations, and practice ethical leadership.',
    descriptionAr: 'ابنِ فرقاً متعاونة، أتقن التفاوض البناء، ومارس القيادة الأخلاقية الملهمة.',
    heroGuide: 'ollie',
    themeColor: '#6366F1',
    accentColor: '#818CF8',
    icon: '🤝',
    modules: ['MOD_LDR', 'MOD_NEG'],
    coreSkills: ['team_leadership', 'negotiation', 'persuasion', 'ethics'],
    requiredLevel: 11,
    unlockedByDefault: false
  },
  {
    id: 'strategy',
    number: 7,
    nameEn: 'Strategy District',
    nameAr: 'حي الاستراتيجية والمنافسة الذكية',
    taglineEn: 'Outthink the Competition with Vision',
    taglineAr: 'التفوق الاستراتيجي وبناء المزايا الفريدة',
    descriptionEn: 'Analyze markets, identify competitor moves, and build durable business moats.',
    descriptionAr: 'حلل الأسواق، ادرس تحركات المنافسين، وابنِ حصوناً استراتيجية لمشروعك.',
    heroGuide: 'ollie',
    themeColor: '#EC4899',
    accentColor: '#F472B6',
    icon: '♟️',
    modules: ['MOD_GLO', 'MOD_CORP'],
    coreSkills: ['market_analysis', 'competitive_strategy', 'global_vision'],
    requiredLevel: 13,
    unlockedByDefault: false
  },
  {
    id: 'launch',
    number: 8,
    nameEn: 'Launch & Scale District',
    nameAr: 'حي الإطلاق والتوسع العالمي',
    taglineEn: 'Scaling Impact to the Whole World',
    taglineAr: 'نشر الأثر والتوسع إلى آفاق العالم',
    descriptionEn: 'Launch products at scale, create community impact, and build sustainable enterprises.',
    descriptionAr: 'أطلق المنتجات بنجاح، وسّع أثر مشروعك مجتمعياً، وابنِ استدامة طويلة الأمد.',
    heroGuide: 'reema',
    themeColor: '#14B8A6',
    accentColor: '#2DD4BF',
    icon: '🌍',
    modules: ['MOD_SOC', 'MOD_SUST'],
    coreSkills: ['product_launch', 'scaling', 'social_impact', 'sustainability'],
    requiredLevel: 15,
    unlockedByDefault: false
  }
];

export const CANONICAL_DISTRICTS = DISTRICTS;

export function getDistrict(id: DistrictId): DistrictInfo | undefined {
  return DISTRICTS.find(d => d.id === id);
}

export function getDistrictForModule(moduleId: string): DistrictInfo | undefined {
  return DISTRICTS.find(d => d.modules.includes(moduleId));
}

/**
 * Maps any lesson ID to its parent district by analyzing the lesson ID prefix.
 */
export function getDistrictForLesson(lessonId: string): DistrictInfo | undefined {
  const prefix = lessonId.split('_')[0];
  const prefixToModule: Record<string, string> = {
    MB: 'MOD_MB',
    ENT: 'MOD_ENT',
    INV: 'MOD_INV',
    MKT: 'MOD_MKT',
    LDR: 'MOD_LDR',
    ECO: 'MOD_ECO',
    TECH: 'MOD_TECH',
    SOC: 'MOD_SOC',
    GLO: 'MOD_GLO',
    FIN: 'MOD_FIN',
    CRYPTO: 'MOD_CRYPTO',
    AIJOB: 'MOD_AIJOB',
    SUST: 'MOD_SUST',
    VC: 'MOD_VC',
    CORP: 'MOD_CORP',
    GLOB: 'MOD_GLOB',
    FMD: 'MOD_FMD',
    BRAND: 'MOD_BRAND',
    FUTURE: 'MOD_FUTURE',
    NEG: 'MOD_NEG'
  };

  const moduleId = prefixToModule[prefix];
  if (!moduleId) return undefined;
  return getDistrictForModule(moduleId);
}
