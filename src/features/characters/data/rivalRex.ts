/**
 * ProfitsPatrol Rival Rex Engine (PRD Section 5, 7, 109)
 * Rex the T-Rex Dinosaur — The ambitious rival & apprentice judge.
 * Philosophy: "Think Again."
 */

import { CharacterEmotion } from '../../../lib/assets/assetRegistry';
import { CharacterDialogue } from './heroes';

export interface RivalProfile {
  id: 'rex';
  nameEn: string;
  nameAr: string;
  animalEn: string;
  animalAr: string;
  philosophyEn: string;
  philosophyAr: string;
  roleEn: string;
  roleAr: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    warning: string;
    text: string;
  };
  personalityEn: string[];
  personalityAr: string[];
  dialogueBank: {
    challenge: CharacterDialogue[];
    victory: CharacterDialogue[];
    defeat: CharacterDialogue[];
    banter: CharacterDialogue[];
    reluctantRespect: CharacterDialogue[];
  };
}

export const RIVAL_REX: RivalProfile = {
  id: 'rex',
  nameEn: 'Rex',
  nameAr: 'ريكس',
  animalEn: 'T-Rex Dinosaur',
  animalAr: 'ديناصور تي-ريكس ذكي',
  philosophyEn: 'Think Again.',
  philosophyAr: 'فكر مرة أخرى!',
  roleEn: 'Ambitious Business Rival & Apprentice Judge',
  roleAr: 'المنافس التجاري الطموح والحكم المتدرب',
  colors: {
    primary: '#C8553D',
    secondary: '#1E3A5F',
    accent: '#F59E0B',
    warning: '#E65100',
    text: '#FFFFFF'
  },
  personalityEn: [
    'Clever',
    'Competitive',
    'Mischievous',
    'Ambitious',
    'Confident',
    'Playful'
  ],
  personalityAr: [
    'ذكي',
    'تنافسي',
    'مرح ومشاكس',
    'طموح جداً',
    'واثق من نفسه',
    'سريع الحركة'
  ],
  dialogueBank: {
    challenge: [
      {
        id: 'rex_chal_1',
        emotion: 'excited',
        textEn: 'Think you can run this market better than me? Think again!',
        textAr: 'هل تظن أنك قادر على إدارة هذا السوق أفضل مني؟ فكّر مرة أخرى!'
      },
      {
        id: 'rex_chal_2',
        emotion: 'pointing',
        textEn: 'I just launched my new store across the street. May the best CEO win!',
        textAr: 'لقد افتتحت للتو متجري الجديد أمامك مباشرة. ليفز صاحب الخطة الأفضل!'
      }
    ],
    victory: [
      {
        id: 'rex_vic_1',
        emotion: 'celebrating',
        textEn: 'Ha! Faster delivery, smarter pricing. Better luck on the next round!',
        textAr: 'هاها! توصيل أسرع وتسعير أذكى. حظاً أوفر في الجولة القادمة!'
      },
      {
        id: 'rex_vic_2',
        emotion: 'happy',
        textEn: 'Told you! In business, speed and flair win the crown.',
        textAr: 'ألم أقل لك؟ في عالم الأعمال، السرعة والابتكار هما مفتاح الفوز!'
      }
    ],
    defeat: [
      {
        id: 'rex_def_1',
        emotion: 'surprised',
        textEn: 'What?! You actually out-negotiated my supplier? Okay... not bad.',
        textAr: 'ماذا؟! هل نجحت حقاً في إقناع المورّد أفضل مني؟ حسناً... لم تكن سيئاً أبداً.'
      },
      {
        id: 'rex_def_2',
        emotion: 'thinking',
        textEn: 'Hmph. Maybe cutting corners wasn\'t the brightest idea. I will be back!',
        textAr: 'همم... يبدو أن التسرع لم يكن فكرة سديدة. سأعود ومعي خطة أقوى!'
      }
    ],
    banter: [
      {
        id: 'rex_ban_1',
        emotion: 'talking',
        textEn: 'Don\'t spend all day dreaming up plans with Ollie. Real businesses need action!',
        textAr: 'لا تقضِ اليوم كله ترسم خططاً مع أولي. المشاريع الحقيقية تحتاج سرعة حركة!'
      }
    ],
    reluctantRespect: [
      {
        id: 'rex_resp_1',
        emotion: 'happy',
        textEn: 'I have to admit... your customers really love you. You earned this win, partner.',
        textAr: 'يجب أن أعترف... عملاؤك يحبونك بحق. لقد استحققت هذا الفوز يا شريكي.'
      }
    ]
  }
};

export const getRexDialogue = (
  category: keyof RivalProfile['dialogueBank']
): CharacterDialogue => {
  const pool = RIVAL_REX.dialogueBank[category];
  if (!pool || pool.length === 0) {
    return {
      id: 'rex_default',
      emotion: 'talking',
      textEn: 'Think again, rookie!',
      textAr: 'فكّر مرة أخرى يا مبتدئ!'
    };
  }
  return pool[Math.floor(Math.random() * pool.length)];
};
