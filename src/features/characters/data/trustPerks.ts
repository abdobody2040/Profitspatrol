/**
 * ProfitsPatrol Trust Tiers & Hero Perks Catalog
 * Master configuration for relationships with Ollie, Reema, Filo, Kami, and Rex.
 */

import { CharacterId } from '../../../lib/assets/assetRegistry';
import { TrustTierInfo, TrustPerk, TrustTierLevel } from '../types/relationships';

export const TRUST_TIERS: Record<TrustTierLevel, TrustTierInfo> = {
  1: {
    tier: 1,
    nameEn: 'Acquaintance',
    nameAr: 'مُتعارف',
    minPoints: 0,
    badge: '🌱',
    color: '#94A3B8' // Slate-400
  },
  2: {
    tier: 2,
    nameEn: 'Ally',
    nameAr: 'حليف',
    minPoints: 100,
    badge: '🤝',
    color: '#3B82F6' // Blue-500
  },
  3: {
    tier: 3,
    nameEn: 'Trusted Advisor',
    nameAr: 'مستشار موثوق',
    minPoints: 250,
    badge: '⭐',
    color: '#8B5CF6' // Purple-500
  },
  4: {
    tier: 4,
    nameEn: 'Strategic Partner',
    nameAr: 'شريك استراتيجي',
    minPoints: 500,
    badge: '💎',
    color: '#EC4899' // Pink-500
  },
  5: {
    tier: 5,
    nameEn: 'Master Mentor',
    nameAr: 'مرشد أسطوري',
    minPoints: 850,
    badge: '👑',
    color: '#F59E0B' // Amber-500
  }
};

export const REX_RESPECT_TIERS: Record<TrustTierLevel, TrustTierInfo> = {
  1: {
    tier: 1,
    nameEn: 'Challenger',
    nameAr: 'منافس مبتدئ',
    minPoints: 0,
    badge: '🥊',
    color: '#64748B'
  },
  2: {
    tier: 2,
    nameEn: 'Respectful Rival',
    nameAr: 'خصم محترم',
    minPoints: 100,
    badge: '⚡',
    color: '#EF4444'
  },
  3: {
    tier: 3,
    nameEn: 'Co-op Contender',
    nameAr: 'متسابق متعاون',
    minPoints: 250,
    badge: '🔥',
    color: '#F97316'
  },
  4: {
    tier: 4,
    nameEn: 'Market Sparring Partner',
    nameAr: 'شريك نزال السوق',
    minPoints: 500,
    badge: '⚔️',
    color: '#A855F7'
  },
  5: {
    tier: 5,
    nameEn: 'Brother in Business',
    nameAr: 'رفيق ريادة الأعمال',
    minPoints: 850,
    badge: '🏆',
    color: '#EAB308'
  }
};

export const TRUST_PERKS: TrustPerk[] = [
  // ─── OLLIE (PLAN) PERKS ──────────────────────────────────────────
  {
    id: 'ollie_p1',
    characterId: 'ollie',
    tierRequired: 1,
    titleEn: 'Blueprint Starter',
    titleAr: 'مخطط البداية',
    descriptionEn: 'Unlocks foundational strategic insights during district exploration.',
    descriptionAr: 'يفتح نصائح استراتيجية تأسيسية أثناء استكشاف المقاطعات.',
    icon: 'Compass',
    effectType: 'special_action',
    effectValue: 'starter_advice'
  },
  {
    id: 'ollie_p2',
    characterId: 'ollie',
    tierRequired: 2,
    titleEn: 'Master Scheduler',
    titleAr: 'جدولة محترفة',
    descriptionEn: '+10% XP bonus on all planning, budgeting, and strategy lessons.',
    descriptionAr: '+10% مكافأة خبرة (XP) على دروس التخطيط والميزانية والاستراتيجية.',
    icon: 'Calendar',
    effectType: 'xp_boost',
    effectValue: 10
  },
  {
    id: 'ollie_p3',
    characterId: 'ollie',
    tierRequired: 3,
    titleEn: "Ollie's Demand Forecast",
    titleAr: 'تنبؤات أولي للطلب',
    descriptionEn: 'Reveals weather and market demand trends in the Business Simulation.',
    descriptionAr: 'يكشف اتجاهات الطقس والطلب في محاكاة الأعمال لتجنب الخسائر.',
    icon: 'TrendingUp',
    effectType: 'special_action',
    effectValue: 'demand_forecast'
  },
  {
    id: 'ollie_p4',
    characterId: 'ollie',
    tierRequired: 4,
    titleEn: 'Empire Architect',
    titleAr: 'مهندس الإمبراطورية',
    descriptionEn: '15% discount on all Headquarters room upgrades and furniture.',
    descriptionAr: 'خصم 15% على جميع توسيعات المقر الرئيسي (HQ) وشراء الأثاث.',
    icon: 'Building',
    effectType: 'discount',
    effectValue: 15
  },
  {
    id: 'ollie_p5',
    characterId: 'ollie',
    tierRequired: 5,
    titleEn: 'Grand Strategist Crown',
    titleAr: 'تاج الخبير الاستراتيجي',
    descriptionEn: 'Legendary Owl mentor status + unlocks the Grand Capstone blueprint.',
    descriptionAr: 'رتبة المرشد الأسطوري + فتح المخطط الذهبي لمشروع التخرج الريادي.',
    icon: 'Award',
    effectType: 'special_action',
    effectValue: 'capstone_blueprint'
  },

  // ─── REEMA (CONNECT) PERKS ───────────────────────────────────────
  {
    id: 'reema_p1',
    characterId: 'reema',
    tierRequired: 1,
    titleEn: 'First Impression',
    titleAr: 'الانطباع الأول',
    descriptionEn: 'Reema provides live tips on customer psychology in the Builders District.',
    descriptionAr: 'ريما تقدم نصائح حية لفهم نفسية وسلوك العملاء في مقاطعة البناة.',
    icon: 'Smile',
    effectType: 'special_action',
    effectValue: 'customer_tips'
  },
  {
    id: 'reema_p2',
    characterId: 'reema',
    tierRequired: 2,
    titleEn: 'Charisma Boost',
    titleAr: 'دفعة الكاريزما',
    descriptionEn: '+10% bonus revenue from marketing campaigns in business games.',
    descriptionAr: '+10% أرباح إضافية من الحملات الإعلانية في ألعاب الأعمال.',
    icon: 'Megaphone',
    effectType: 'retention_boost',
    effectValue: 10
  },
  {
    id: 'reema_p3',
    characterId: 'reema',
    tierRequired: 3,
    titleEn: 'Viral Sensation',
    titleAr: 'حملة انتشار واسع',
    descriptionEn: 'Unlocks the "Viral Social Blast" special marketing action.',
    descriptionAr: 'يفتح خيار "الانفجار التسويقي" لجلب ضعف عدد الزبائن في اليوم.',
    icon: 'Sparkles',
    effectType: 'special_action',
    effectValue: 'viral_campaign'
  },
  {
    id: 'reema_p4',
    characterId: 'reema',
    tierRequired: 4,
    titleEn: 'Teal Scarf Flair',
    titleAr: 'وشاح ريما الفيروزي',
    descriptionEn: 'Exclusive avatar cosmetic item: Reema’s Arctic Teal Scarf.',
    descriptionAr: 'عنصر مظهري حصري للأفاتار: وشاح ريما القطبي الفيروزي الأنيق.',
    icon: 'Shirt',
    effectType: 'cosmetic',
    effectValue: 'reema_teal_scarf'
  },
  {
    id: 'reema_p5',
    characterId: 'reema',
    tierRequired: 5,
    titleEn: 'Brand Royalty',
    titleAr: 'الملكية التجارية',
    descriptionEn: 'Permanent +20% customer loyalty retention across all player businesses.',
    descriptionAr: 'ولاء دائم بنسبة +20% للعملاء يمنع انصرافهم إلى المنافسين.',
    icon: 'Heart',
    effectType: 'retention_boost',
    effectValue: 20
  },

  // ─── FILO (PROTECT) PERKS ────────────────────────────────────────
  {
    id: 'filo_p1',
    characterId: 'filo',
    tierRequired: 1,
    titleEn: 'Safe Guard',
    titleAr: 'حارس الأمان',
    descriptionEn: 'Filo highlights high-risk contracts and suspicious investment pitches.',
    descriptionAr: 'فيلو ينبهك فوراً عند ظهور عقود احتيالية أو عروض استثمار مشبوهة.',
    icon: 'Shield',
    effectType: 'special_action',
    effectValue: 'risk_highlights'
  },
  {
    id: 'filo_p2',
    characterId: 'filo',
    tierRequired: 2,
    titleEn: 'Scam Shield',
    titleAr: 'درع الحماية من الاحتيال',
    descriptionEn: 'Refunds 50% of tokens lost in any unexpected business hazard.',
    descriptionAr: 'يسترد 50% من التوكنز في حال التعرض لأي حادث أو مخاطرة غير متوقعة.',
    icon: 'ShieldCheck',
    effectType: 'scam_protection',
    effectValue: 50
  },
  {
    id: 'filo_p3',
    characterId: 'filo',
    tierRequired: 3,
    titleEn: 'Prudent Reserves',
    titleAr: 'احتياطي حكيم',
    descriptionEn: 'Reduces business insurance and emergency loan fees by 25%.',
    descriptionAr: 'يخفض رسوم التأمين التجاري وتكاليف الطوارئ بنسبة 25%.',
    icon: 'PiggyBank',
    effectType: 'discount',
    effectValue: 25
  },
  {
    id: 'filo_p4',
    characterId: 'filo',
    tierRequired: 4,
    titleEn: 'Elephant Memory',
    titleAr: 'ذاكرة الفيل الرصينة',
    descriptionEn: 'Earns 5% compound daily interest on P-Tokens held in the vault.',
    descriptionAr: 'عائد يومي مركب بنسبة 5% على التوكنز المحفوظة في خزنة المقر.',
    icon: 'Vault',
    effectType: 'special_action',
    effectValue: 'vault_interest'
  },
  {
    id: 'filo_p5',
    characterId: 'filo',
    tierRequired: 5,
    titleEn: 'Fortress of Ethics',
    titleAr: 'حصن الأخلاقيات والنزاهة',
    descriptionEn: 'Legendary Guardian status + complete immunity to corporate espionage.',
    descriptionAr: 'رتبة الحامي الأسطوري + حماية تامة ضد سرقة الأفكار والمنافسة غير الشريفة.',
    icon: 'Lock',
    effectType: 'special_action',
    effectValue: 'espionage_immunity'
  },

  // ─── KAMI (CREATE) PERKS ─────────────────────────────────────────
  {
    id: 'kami_p1',
    characterId: 'kami',
    tierRequired: 1,
    titleEn: 'Lab Apprentice',
    titleAr: 'مبتدئ المختبر',
    descriptionEn: 'Free daily access to Kami’s Prototyping Lab in HQ 2.0.',
    descriptionAr: 'دخول يومي مجاني إلى مختبر النماذج الأولية الخاص بكامي في المقر.',
    icon: 'FlaskConical',
    effectType: 'special_action',
    effectValue: 'lab_access'
  },
  {
    id: 'kami_p2',
    characterId: 'kami',
    tierRequired: 2,
    titleEn: 'Smart Synthesizer',
    titleAr: 'المُركّب الذكي',
    descriptionEn: 'Reduces material crafting costs by 15% in Kami’s Lab.',
    descriptionAr: 'يخفض تكلفة المواد المستهلكة في صناعة النماذج الابتكارية بنسبة 15%.',
    icon: 'Hammer',
    effectType: 'discount',
    effectValue: 15
  },
  {
    id: 'kami_p3',
    characterId: 'kami',
    tierRequired: 3,
    titleEn: 'Secret Blueprints',
    titleAr: 'مخططات سرية',
    descriptionEn: 'Unlocks rare Tier-3 fusion element recipes for superior product value.',
    descriptionAr: 'يفتح وصفات دمج نادرة من المستوى الثالث لمنتجات فائقة القيمة والطلب.',
    icon: 'Scroll',
    effectType: 'special_action',
    effectValue: 'fusion_recipes'
  },
  {
    id: 'kami_p4',
    characterId: 'kami',
    tierRequired: 4,
    titleEn: 'Chameleon Vision',
    titleAr: 'نظارات الحرباء الابتكارية',
    descriptionEn: 'Exclusive cosmetic: Kami’s Prism Goggles for your avatar.',
    descriptionAr: 'عنصر مظهري حصري للأفاتار: نظارات كامي المنشورية للمخترعين.',
    icon: 'Glasses',
    effectType: 'cosmetic',
    effectValue: 'kami_prism_goggles'
  },
  {
    id: 'kami_p5',
    characterId: 'kami',
    tierRequired: 5,
    titleEn: 'Genius Inventor',
    titleAr: 'المخترع العبقري',
    descriptionEn: 'Guaranteed "Viral Breakthrough" evaluation on all prototype synthesis.',
    descriptionAr: 'تقييم "اختراق مبتكر" مضمون لجميع النماذج المصنوعة في المختبر.',
    icon: 'Zap',
    effectType: 'research_boost',
    effectValue: 'guaranteed_breakthrough'
  },

  // ─── REX (RIVAL RESPECT) PERKS ───────────────────────────────────
  {
    id: 'rex_p1',
    characterId: 'rex',
    tierRequired: 1,
    titleEn: 'Eye on the Prize',
    titleAr: 'عين على الجائزة',
    descriptionEn: 'Rex taunts are visible and district market share tracking is unlocked.',
    descriptionAr: 'متابعة نزال الحصص السوقية ضد ريكس في المقاطعات الثمانية.',
    icon: 'Target',
    effectType: 'special_action',
    effectValue: 'rival_tracking'
  },
  {
    id: 'rex_p2',
    characterId: 'rex',
    tierRequired: 2,
    titleEn: 'Fair Play',
    titleAr: 'لعب نظيف',
    descriptionEn: 'Earns +15% extra tokens when resolving district showdowns against Rex.',
    descriptionAr: '+15% توكنز إضافية عند خوض نزالات التحدي أمام ريكس في المقاطعات.',
    icon: 'Coins',
    effectType: 'market_share_bonus',
    effectValue: 15
  },
  {
    id: 'rex_p3',
    characterId: 'rex',
    tierRequired: 3,
    titleEn: 'Tank Mode Synergy',
    titleAr: 'تكامل حلبة المستثمرين',
    descriptionEn: 'Rex joins you as a co-pitcher in The Tank mode for exclusive angel deals.',
    descriptionAr: 'ريكس يشاركك كشريك إقناع في وضع حلبة القروش لصفقات استثمارية كبرى.',
    icon: 'Users',
    effectType: 'special_action',
    effectValue: 'coop_pitch_unlock'
  },
  {
    id: 'rex_p4',
    characterId: 'rex',
    tierRequired: 4,
    titleEn: 'Inside Intel',
    titleAr: 'معلومات السوق السرية',
    descriptionEn: 'Rex whispers high-profit wholesale stock opportunities before price jumps.',
    descriptionAr: 'ريكس يهمس لك بفرص أسهم وتجارة رابحة في السوق قبل ارتفاع أسعارها.',
    icon: 'Eye',
    effectType: 'special_action',
    effectValue: 'market_whispers'
  },
  {
    id: 'rex_p5',
    characterId: 'rex',
    tierRequired: 5,
    titleEn: 'Unbreakable Respect',
    titleAr: 'احترام الخصوم الذي لا ينكسر',
    descriptionEn: 'Rex acknowledges your supremacy. Player gains +10% market share floor everywhere.',
    descriptionAr: 'ريكس يعترف بمهارتك الريادية. حد أدنى دائم +10% حصة سوقية في كل المقاطعات.',
    icon: 'Trophy',
    effectType: 'market_share_bonus',
    effectValue: 10
  }
];

export function getPerksForCharacter(characterId: CharacterId): TrustPerk[] {
  return TRUST_PERKS.filter(p => p.characterId === characterId);
}

export function getTierForPoints(points: number, isRival = false): TrustTierInfo {
  const tiers = isRival ? REX_RESPECT_TIERS : TRUST_TIERS;
  if (points >= tiers[5].minPoints) return tiers[5];
  if (points >= tiers[4].minPoints) return tiers[4];
  if (points >= tiers[3].minPoints) return tiers[3];
  if (points >= tiers[2].minPoints) return tiers[2];
  return tiers[1];
}
