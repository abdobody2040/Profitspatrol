import React from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Sparkles, 
  MessageSquare, 
  Award, 
  Compass, 
  ShieldCheck, 
  Lightbulb, 
  Swords, 
  TrendingUp,
  CheckCircle2,
  Gift
} from 'lucide-react';
import { useTrustStore } from '../../characters/store/trustStore';
import { useStoryQuestStore } from '../../characters/store/questStore';
import { calculateTierProgress } from '../../characters/engine/relationshipEngine';
import { HEROES } from '../../characters/data/heroes';
import { RIVAL_REX } from '../../characters/data/rivalRex';
import { useAgeMode } from '../../ageMode/hooks/useAgeMode';

interface HeroMentorshipParentCardProps {
  childName?: string;
}

export const HeroMentorshipParentCard: React.FC<HeroMentorshipParentCardProps> = ({ childName = 'Child' }) => {
  const { isArabic } = useAgeMode();
  const charactersState = useTrustStore((state) => state.characters);
  const questProgress = useStoryQuestStore((state) => state.questProgress);

  const ollieTrust = charactersState['ollie'];
  const reemaTrust = charactersState['reema'];
  const filoTrust = charactersState['filo'];
  const kamiTrust = charactersState['kami'];
  const rexRespect = charactersState['rex'];

  const ollieProg = calculateTierProgress(ollieTrust?.trustPoints || 0, false);
  const reemaProg = calculateTierProgress(reemaTrust?.trustPoints || 0, false);
  const filoProg = calculateTierProgress(filoTrust?.trustPoints || 0, false);
  const kamiProg = calculateTierProgress(kamiTrust?.trustPoints || 0, false);
  const rexProg = calculateTierProgress(rexRespect?.trustPoints || 0, true);

  // Count claimed or completed story quests
  const completedQuestsCount = Object.values(questProgress).filter(
    (q) => q.status === 'completed' || q.status === 'claimed'
  ).length;

  const ROSTER_METRICS = [
    {
      id: 'ollie',
      nameEn: 'Ollie the Owl',
      nameAr: 'البومة أولي',
      pillarEn: 'Planning & Strategy',
      pillarAr: 'التخطيط والاستراتيجية',
      icon: '🦉',
      color: '#3B82F6',
      tier: ollieProg.currentTier,
      points: ollieTrust?.trustPoints || 0,
      discussionPromptEn: `Ask ${childName}: "If you were given $50 to start a weekend business, how much would you save for emergencies and how much would you spend on supplies?"`,
      discussionPromptAr: `اسأل ${childName}: "لو أعطيتك 50 دولاراً لتبدأ مشروعاً صغيراً، كم ستدخر للطوارئ وكم ستصرف على التجهيزات؟"`
    },
    {
      id: 'reema',
      nameEn: 'Reema the Fox',
      nameAr: 'الثعلب ريما',
      pillarEn: 'Marketing & Empathy',
      pillarAr: 'التسويق والتواصل الإنساني',
      icon: '🦊',
      color: '#EC4899',
      tier: reemaProg.currentTier,
      points: reemaTrust?.trustPoints || 0,
      discussionPromptEn: `Ask ${childName}: "What makes a customer choose one lemonade stand over another even when the price is the same?"`,
      discussionPromptAr: `اسأل ${childName}: "ما الذي يجعل الزبون يفضل متجراً على آخر حتى لو كانت الأسعار متطابقة؟"`
    },
    {
      id: 'filo',
      nameEn: 'Filo the Elephant',
      nameAr: 'الفيل فيلو',
      pillarEn: 'Financial Ethics & Safety',
      pillarAr: 'الحماية المالية والنزاهة',
      icon: '🐘',
      color: '#10B981',
      tier: filoProg.currentTier,
      points: filoTrust?.trustPoints || 0,
      discussionPromptEn: `Ask ${childName}: "Have you ever seen an online game promise 'Free Rewards' with tricky rules? How can you protect your money from scams?"`,
      discussionPromptAr: `اسأل ${childName}: "هل رأيت إعلاناً يعد بجوائز مجانية ثم يطلب دفع أموال خفية؟ كيف تميز بين العرض الحقيقي والاحتيال؟"`
    },
    {
      id: 'kami',
      nameEn: 'Kami the Chameleon',
      nameAr: 'الحرباء كامي',
      pillarEn: 'Innovation & Creative Craft',
      pillarAr: 'الابتكار والتجربة الجريئة',
      icon: '🦎',
      color: '#8B5CF6',
      tier: kamiProg.currentTier,
      points: kamiTrust?.trustPoints || 0,
      discussionPromptEn: `Ask ${childName}: "When a prototype fails, what did you learn that will make your next try much better?"`,
      discussionPromptAr: `اسأل ${childName}: "عندما لا ينجح النموذج الأولي من أول مرة، ما الشيء الذي تعلمته لتجعل المحاولة القادمة أقوى؟"`
    },
    {
      id: 'rex',
      nameEn: 'Rex the Rival',
      nameAr: 'ريكس (المنافس الذكي)',
      pillarEn: 'Competitive Resilience',
      pillarAr: 'الروح التنافسية والمرونة',
      icon: '🦖',
      color: '#C8553D',
      tier: rexProg.currentTier,
      points: rexRespect?.trustPoints || 0,
      discussionPromptEn: `Ask ${childName}: "What is the difference between healthy sportsmanship and being a sore loser when someone else wins market share?"`,
      discussionPromptAr: `اسأل ${childName}: "ما الفرق بين المنافسة الشريفة الذكية والتعصب عند مواجهة منافس قوي في السوق؟"`
    }
  ];

  return (
    <div 
      className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 sm:p-8 shadow-xl border-4 border-slate-100 dark:border-slate-800 space-y-6"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg">
            <Heart className="w-7 h-7 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white">
                {isArabic ? 'تطور عقلية ريادة الأعمال مع الأبطال' : 'Hero Mentorship & Mindset Growth'}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                {completedQuestsCount} {isArabic ? 'مهمة قصصية منجزة' : 'Story Quests Done'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-bold mt-0.5">
              {isArabic 
                ? `رصد مباشر لمدى ثقة ${childName} بالأبطال ونمو مهارات التفكير القيادي`
                : `Live pulse on ${childName}'s decision-making trust across Strategy, Ethics, Marketing, and Innovation`}
            </p>
          </div>
        </div>
      </div>

      {/* 5 Character Pillar Meters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {ROSTER_METRICS.map((char) => (
          <div 
            key={char.id}
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{char.icon}</span>
                <span 
                  className="px-2 py-0.5 rounded-full text-[10px] font-black text-white"
                  style={{ backgroundColor: char.color }}
                >
                  T{char.tier.tier}: {isArabic ? char.tier.nameAr : char.tier.nameEn}
                </span>
              </div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                {isArabic ? char.nameAr : char.nameEn}
              </h4>
              <p className="text-[11px] font-bold text-slate-500 line-clamp-1">
                {isArabic ? char.pillarAr : char.pillarEn}
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs font-black">
              <span className="text-slate-500">{isArabic ? 'نقاط الثقة' : 'Trust Pts'}</span>
              <span style={{ color: char.color }}>{char.points} TP</span>
            </div>
          </div>
        ))}
      </div>

      {/* Real-World Dinner / Classroom Learning Moments */}
      <div className="bg-gradient-to-r from-amber-50/80 via-orange-50/80 to-yellow-50/80 dark:from-slate-800 dark:to-slate-850 p-5 rounded-3xl border border-amber-200 dark:border-amber-800/40 space-y-3">
        <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200">
          <MessageSquare className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <h4 className="text-sm sm:text-base font-black">
            {isArabic ? 'مواضيع مقترحة للنقاش العائلي أو الصفي (Learning Moments)' : 'Recommended Dinner & Classroom Discussion Starters'}
          </h4>
        </div>
        <p className="text-xs text-amber-800/80 dark:text-amber-300 font-medium">
          {isArabic 
            ? 'حوّل مهارات اللعبة الافتراضية إلى محادثات واقعية تلهم الطفل وتعمق فهمه للمال والحياة:'
            : 'Bridge the game into real life! Ask these questions over dinner to reinforce sound financial intuition:'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {ROSTER_METRICS.slice(0, 4).map((char) => (
            <div 
              key={char.id}
              className="p-3.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-amber-200/60 dark:border-slate-700 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-base">{char.icon}</span>
                <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                  {isArabic ? char.pillarAr : char.pillarEn}
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {isArabic ? char.discussionPromptAr : char.discussionPromptEn}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
