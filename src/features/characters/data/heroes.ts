/**
 * ProfitsPatrol 4 Heroes Engine (PRD Sections 4.1 - 4.4, 7, 109)
 * Ollie (Plan), Reema (Connect), Filo (Protect), Kami (Create)
 */

import { CharacterId, CharacterEmotion } from '../../../lib/assets/assetRegistry';
import { CompetencyGroupId } from '../../../domain/curriculum/competencyModel';

export interface CharacterDialogue {
  id: string;
  emotion: CharacterEmotion;
  textEn: string;
  textAr: string;
  juniorOnly?: boolean;
  explorerOnly?: boolean;
}

export interface HeroProfile {
  id: CharacterId;
  nameEn: string;
  nameAr: string;
  animalEn: string;
  animalAr: string;
  pillarEn: 'PLAN' | 'CONNECT' | 'PROTECT' | 'CREATE';
  pillarAr: 'خطّط' | 'تواصل' | 'احْمِ' | 'ابْتَكِر';
  roleEn: string;
  roleAr: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
  };
  personalityEn: string[];
  personalityAr: string[];
  coreCompetencyGroup: CompetencyGroupId;
  competenciesTaught: string[];
  dialogueBank: {
    greeting: CharacterDialogue[];
    encouragement: CharacterDialogue[];
    success: CharacterDialogue[];
    mistakeReflect: CharacterDialogue[];
    tip: CharacterDialogue[];
  };
}

export const HEROES: Record<Exclude<CharacterId, 'rex'>, HeroProfile> = {
  ollie: {
    id: 'ollie',
    nameEn: 'Ollie',
    nameAr: 'أولي',
    animalEn: 'Owl',
    animalAr: 'بومة حكيمة',
    pillarEn: 'PLAN',
    pillarAr: 'خطّط',
    roleEn: 'Strategic Leader & Master Planner',
    roleAr: 'القائد الاستراتيجي وخبير التخطيط',
    colors: {
      primary: '#1E293B',
      secondary: '#F59E0B',
      accent: '#3B82F6',
      text: '#FFFFFF'
    },
    personalityEn: ['Analytical', 'Wise', 'Calm', 'Strategic', 'Patient'],
    personalityAr: ['تحليلي', 'حكيم', 'هادئ', 'استراتيجي', 'صبور'],
    coreCompetencyGroup: 'money',
    competenciesTaught: [
      'earning_money',
      'saving_budgeting',
      'banking_accounts',
      'corporate_strategy'
    ],
    dialogueBank: {
      greeting: [
        {
          id: 'ollie_greet_1',
          emotion: 'talking',
          textEn: 'Welcome back, CEO! What is our strategic plan for today?',
          textAr: 'أهلاً بعودتك يا بطل الأعمال! ما هي خطتنا الذكية لليوم؟'
        },
        {
          id: 'ollie_greet_2',
          emotion: 'happy',
          textEn: 'A clear goal today builds a huge empire tomorrow!',
          textAr: 'الهدف الواضح اليوم يصنع إمبراطورية عظيمة غداً!'
        }
      ],
      encouragement: [
        {
          id: 'ollie_enc_1',
          emotion: 'thinking',
          textEn: 'Take a breath and examine the numbers carefully.',
          textAr: 'خذ نفساً عميقاً وفكّر في الأرقام بعناية.'
        },
        {
          id: 'ollie_enc_2',
          emotion: 'pointing',
          textEn: 'Remember: good planning beats hasty guessing every time.',
          textAr: 'تذكّر دائماً: التخطيط المدروس يتفوق على التخمين المتسرع.'
        }
      ],
      success: [
        {
          id: 'ollie_succ_1',
          emotion: 'celebrating',
          textEn: 'Outstanding execution! Your strategic vision was spot on.',
          textAr: 'تنفيذ استثنائي! رؤيتك الاستراتيجية كانت في مكانها تماماً.'
        },
        {
          id: 'ollie_succ_2',
          emotion: 'excited',
          textEn: 'Look at those profits grow! Compound progress at its finest.',
          textAr: 'انظر كيف تنمو أرباحك! هذا هو سحر التقدم والادخار المستمر.'
        }
      ],
      mistakeReflect: [
        {
          id: 'ollie_mist_1',
          emotion: 'thinking',
          textEn: 'Every great CEO analyzes unexpected results. Let us adjust our budget and try again!',
          textAr: 'كل قائد ناجح يتعلم من النتائج غير المتوقعة. دعنا نراجع الميزانية ونحاول مجدداً!'
        },
        {
          id: 'ollie_mist_2',
          emotion: 'talking',
          textEn: 'No worries! A mistake is just free data to help us build a smarter strategy.',
          textAr: 'لا تقلق! الخطأ هو مجرد معلومة مجانية تساعدنا في بناء خطة أذكى.'
        }
      ],
      tip: [
        {
          id: 'ollie_tip_1',
          emotion: 'pointing',
          textEn: 'Always split your earnings into Needs, Wants, and Future Investments.',
          textAr: 'قسّم دخلك دائماً بين الأساسيات، الرغبات، واستثمارات المستقبل.'
        }
      ]
    }
  },

  reema: {
    id: 'reema',
    nameEn: 'Reema',
    nameAr: 'ريما',
    animalEn: 'Arctic Fox',
    animalAr: 'ثعلبة بيضاء ذكية',
    pillarEn: 'CONNECT',
    pillarAr: 'تواصل',
    roleEn: 'Marketing & Sales Prodigy',
    roleAr: 'خبيرة التسويق وإسعاد العملاء',
    colors: {
      primary: '#06B6D4',
      secondary: '#14B8A6',
      accent: '#F43F5E',
      text: '#FFFFFF'
    },
    personalityEn: ['Energetic', 'Social', 'Persuasive', 'Empathetic', 'Confident'],
    personalityAr: ['حيوية', 'اجتماعية', 'مقنعة', 'متعاطفة', 'واثقة'],
    coreCompetencyGroup: 'marketing',
    competenciesTaught: [
      'branding',
      'social_media',
      'customer_loyalty',
      'public_relations'
    ],
    dialogueBank: {
      greeting: [
        {
          id: 'reema_greet_1',
          emotion: 'excited',
          textEn: 'Hey there! Ready to dazzle our customers and spread the word?',
          textAr: 'مرحباً يا نجم! جاهز لتسعد عملاءنا وتنشر علامتك المميزة؟'
        },
        {
          id: 'reema_greet_2',
          emotion: 'happy',
          textEn: 'People buy when they feel trusted and valued. Let us shine today!',
          textAr: 'الناس يشترون حين يشعرون بالثقة والاهتمام. لنتألق اليوم معاً!'
        }
      ],
      encouragement: [
        {
          id: 'reema_enc_1',
          emotion: 'talking',
          textEn: 'Put yourself in your customer\'s shoes. What problem can you solve for them?',
          textAr: 'ضع نفسك مكان عميلك. ما هي المشكلة التي تستطيع حلها له؟'
        }
      ],
      success: [
        {
          id: 'reema_succ_1',
          emotion: 'celebrating',
          textEn: 'Amazing pitch! Our reviews are through the roof!',
          textAr: 'عرض رائع ومقنع! تقييمات العملاء وصلت إلى القمة!'
        }
      ],
      mistakeReflect: [
        {
          id: 'reema_mist_1',
          emotion: 'thinking',
          textEn: 'Feedback is a gift! If a customer wasn\'t satisfied, let\'s listen and surprise them with an improvement.',
          textAr: 'آراء العملاء هدية ثمينة! إذا لم يكن العميل راضياً، لنستمع له ونفاجئه بتطوير أفضل.'
        }
      ],
      tip: [
        {
          id: 'reema_tip_1',
          emotion: 'pointing',
          textEn: 'A great smile and genuine kindness are the most powerful marketing tools in the world.',
          textAr: 'الابتسامة الصادقة والمعاملة الطيبة هما أقوى أدوات التسويق في العالم.'
        }
      ]
    }
  },

  filo: {
    id: 'filo',
    nameEn: 'Filo',
    nameAr: 'فيلو',
    animalEn: 'Baby Elephant',
    animalAr: 'فيل صغير حذر',
    pillarEn: 'PROTECT',
    pillarAr: 'احْمِ',
    roleEn: 'Risk Guardian & Ethics Inspector',
    roleAr: 'حارس الأمان المالي والأخلاقيات',
    colors: {
      primary: '#65A30D',
      secondary: '#84CC16',
      accent: '#EAB308',
      text: '#FFFFFF'
    },
    personalityEn: ['Patient', 'Careful', 'Reliable', 'Kind', 'Practical'],
    personalityAr: ['صبور', 'حذر', 'موثوق', 'طيب', 'عملي'],
    coreCompetencyGroup: 'risk_ethics',
    competenciesTaught: [
      'scam_safety',
      'ethics_responsibility',
      'contracts_law',
      'crisis_resilience'
    ],
    dialogueBank: {
      greeting: [
        {
          id: 'filo_greet_1',
          emotion: 'talking',
          textEn: 'Hello, partner! Safe vaults and honest deals keep businesses standing strong.',
          textAr: 'أهلاً يا صديقي! الخزنة الآمنة والصفقات النزيهة هي ما يحمي مشاريعنا.'
        }
      ],
      encouragement: [
        {
          id: 'filo_enc_1',
          emotion: 'thinking',
          textEn: 'If an offer sounds too good to be true, step back and inspect it!',
          textAr: 'إذا بدا لك العرض مغرياً وسهلاً لدرجة لا تصدق، تمهل وافحصه جيداً!'
        }
      ],
      success: [
        {
          id: 'filo_succ_1',
          emotion: 'happy',
          textEn: 'Solid decision! You protected our assets and proved you are trustworthy.',
          textAr: 'قرار حكيم! لقد حميت أموالك وأثبت أنك أهل للثقة والأمانة.'
        }
      ],
      mistakeReflect: [
        {
          id: 'filo_mist_1',
          emotion: 'thinking',
          textEn: 'Risks are part of entrepreneurship. Now we know what to watch out for next time!',
          textAr: 'المخاطر جزء من التجارة. الآن عرفنا ما يجب الحذر منه في المرة القادمة!'
        }
      ],
      tip: [
        {
          id: 'filo_tip_1',
          emotion: 'pointing',
          textEn: 'Never put all your eggs in one basket. Diversify your savings!',
          textAr: 'إياك أن تضع كل بيضك في سلة واحدة. نوّع مدخراتك دائماً!'
        }
      ]
    }
  },

  kami: {
    id: 'kami',
    nameEn: 'Kami',
    nameAr: 'كامي',
    animalEn: 'Chameleon',
    animalAr: 'حرباء مبتكرة',
    pillarEn: 'CREATE',
    pillarAr: 'ابْتَكِر',
    roleEn: 'Chief Innovator & Prototype Wizard',
    roleAr: 'خبير الابتكار وصانع النماذج الأولية',
    colors: {
      primary: '#9333EA',
      secondary: '#A855F7',
      accent: '#FACC15',
      text: '#FFFFFF'
    },
    personalityEn: ['Imaginative', 'Experimental', 'Curious', 'Flexible', 'Playful'],
    personalityAr: ['خيالي', 'مجرّب', 'فضولي', 'مرن', 'مرح'],
    coreCompetencyGroup: 'innovation',
    competenciesTaught: [
      'product_design',
      'experimentation',
      'future_tech',
      'rapid_prototyping'
    ],
    dialogueBank: {
      greeting: [
        {
          id: 'kami_greet_1',
          emotion: 'excited',
          textEn: 'Sparks flying! What wacky, brilliant invention shall we test today?',
          textAr: 'الشرارات تتطاير! ما هو الاختراع المذهل الذي سنبتكره اليوم؟'
        }
      ],
      encouragement: [
        {
          id: 'kami_enc_1',
          emotion: 'thinking',
          textEn: 'Don\'t be afraid to experiment. Prototype fast and tweak as you go!',
          textAr: 'لا تخف من التجربة! اصنع نموذجك الأولي بسرعة وطوّره خطوة بخطوة!'
        }
      ],
      success: [
        {
          id: 'kami_succ_1',
          emotion: 'celebrating',
          textEn: 'Eureka! That prototype solves the problem brilliantly!',
          textAr: 'وجدتها! هذا النموذج يحل المشكلة ببراعة وابتكار مذهل!'
        }
      ],
      mistakeReflect: [
        {
          id: 'kami_mist_1',
          emotion: 'excited',
          textEn: 'Yes! A failed prototype just showed us what doesn\'t work. Edison failed 1,000 times before making the lightbulb!',
          textAr: 'رائع! النموذج الذي لم ينجح كشف لنا ما يجب تغييره. إديسون جرّب ألف مرة قبل اختراع المصباح!'
        }
      ],
      tip: [
        {
          id: 'kami_tip_1',
          emotion: 'pointing',
          textEn: 'The best products don\'t just look cool—they solve real everyday pains for people.',
          textAr: 'أفضل المنتجات ليست فقط جميلة المظهر، بل تحل مشاكل حقيقية تواجه الناس يومياً.'
        }
      ]
    }
  }
};

export const getHero = (id: Exclude<CharacterId, 'rex'>): HeroProfile => {
  return HEROES[id];
};

export const getAllHeroes = (): HeroProfile[] => {
  return Object.values(HEROES);
};

export const getHeroDialogue = (
  heroId: Exclude<CharacterId, 'rex'>,
  category: keyof HeroProfile['dialogueBank'],
  isJunior: boolean = false
): CharacterDialogue => {
  const hero = HEROES[heroId];
  const list = hero.dialogueBank[category];
  if (!list || list.length === 0) {
    return {
      id: `${heroId}_default`,
      emotion: 'talking',
      textEn: 'Keep going, CEO!',
      textAr: 'واصل التقدم يا بطل الأعمال!'
    };
  }

  const filtered = list.filter(d => (isJunior ? !d.explorerOnly : !d.juniorOnly));
  const pool = filtered.length > 0 ? filtered : list;
  return pool[Math.floor(Math.random() * pool.length)];
};
