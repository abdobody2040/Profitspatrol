import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { CharacterId, getCharacterAsset } from '../../../lib/assets/assetRegistry';
import { HEROES } from '../data/heroes';
import { RIVAL_REX } from '../data/rivalRex';
import { TRUST_TIERS, REX_RESPECT_TIERS, getPerksForCharacter } from '../data/trustPerks';
import { calculateTierProgress } from '../engine/relationshipEngine';
import { useTrustStore } from '../store/trustStore';
import { 
  Shield, 
  Sparkles, 
  Trophy, 
  Lock, 
  CheckCircle2, 
  HelpCircle,
  Compass,
  Calendar,
  TrendingUp,
  Building,
  Award,
  Smile,
  Megaphone,
  Shirt,
  Heart,
  ShieldCheck,
  PiggyBank,
  FlaskConical,
  Hammer,
  Scroll,
  Glasses,
  Zap,
  Target,
  Coins,
  Users,
  Eye
} from 'lucide-react';

interface CharacterTrustCardProps {
  characterId: CharacterId;
}

// Icon helper
const getIconComponent = (iconName: string) => {
  const map: Record<string, React.ReactNode> = {
    Compass: <Compass className="w-4 h-4" />,
    Calendar: <Calendar className="w-4 h-4" />,
    TrendingUp: <TrendingUp className="w-4 h-4" />,
    Building: <Building className="w-4 h-4" />,
    Award: <Award className="w-4 h-4" />,
    Smile: <Smile className="w-4 h-4" />,
    Megaphone: <Megaphone className="w-4 h-4" />,
    Sparkles: <Sparkles className="w-4 h-4" />,
    Shirt: <Shirt className="w-4 h-4" />,
    Heart: <Heart className="w-4 h-4" />,
    Shield: <Shield className="w-4 h-4" />,
    ShieldCheck: <ShieldCheck className="w-4 h-4" />,
    PiggyBank: <PiggyBank className="w-4 h-4" />,
    Vault: <Shield className="w-4 h-4" />,
    Lock: <Lock className="w-4 h-4" />,
    FlaskConical: <FlaskConical className="w-4 h-4" />,
    Hammer: <Hammer className="w-4 h-4" />,
    Scroll: <Scroll className="w-4 h-4" />,
    Glasses: <Glasses className="w-4 h-4" />,
    Zap: <Zap className="w-4 h-4" />,
    Target: <Target className="w-4 h-4" />,
    Coins: <Coins className="w-4 h-4" />,
    Users: <Users className="w-4 h-4" />,
    Eye: <Eye className="w-4 h-4" />,
    Trophy: <Trophy className="w-4 h-4" />
  };
  return map[iconName] || <HelpCircle className="w-4 h-4" />;
};

export const CharacterTrustCard: React.FC<CharacterTrustCardProps> = ({ characterId }) => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language.startsWith('ar');
  const isRival = characterId === 'rex';

  const charState = useTrustStore((state) => state.characters[characterId]);
  const points = charState?.trustPoints ?? 0;
  const progress = calculateTierProgress(points, isRival);

  // Profile data
  const profile = isRival ? RIVAL_REX : HEROES[characterId];
  const charAsset = getCharacterAsset(characterId, isRival ? 'excited' : 'happy');

  const name = isArabic ? profile.nameAr : profile.nameEn;
  const animal = isArabic ? profile.animalAr : profile.animalEn;
  const role = isArabic ? profile.roleAr : profile.roleEn;
  const pillar = !isRival 
    ? (isArabic ? (profile as any).pillarAr : (profile as any).pillarEn)
    : (isArabic ? 'المنافس' : 'RIVAL');

  const allPerks = getPerksForCharacter(characterId);

  return (
    <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-lg relative overflow-hidden transition-all hover:border-blue-400 dark:hover:border-blue-500">
      {/* Top Banner with Pillar Badge */}
      <div className="flex items-center justify-between mb-4">
        <span 
          className="text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider text-white shadow-sm"
          style={{ backgroundColor: profile.colors.primary }}
        >
          {pillar}
        </span>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-extrabold text-slate-700 dark:text-slate-300">
          <span>{progress.currentTier.badge}</span>
          <span>{isArabic ? progress.currentTier.nameAr : progress.currentTier.nameEn}</span>
        </div>
      </div>

      {/* Hero Visual & Identity */}
      <div className="flex items-center gap-4 mb-5">
        <div 
          className="w-20 h-20 rounded-2xl flex items-center justify-center p-1.5 shadow-inner border-2 border-white dark:border-slate-700 shrink-0 relative overflow-hidden"
          style={{ backgroundColor: profile.colors.secondary + '20' }}
        >
          <img 
            src={charAsset.path} 
            alt={name}
            className="w-full h-full object-contain drop-shadow"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-3xl select-none -z-10">
            🌟
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-black text-slate-900 dark:text-white truncate">
            {name}
          </h3>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 truncate">
            {animal} • {role}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm font-black text-blue-600 dark:text-blue-400">
              {points.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-slate-400">
              {isRival 
                ? (isArabic ? 'نقاط الاحترام' : 'Respect Pts')
                : (isArabic ? 'نقاط الثقة' : 'Trust Pts')}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl p-3 border border-slate-200/60 dark:border-slate-700/60">
        <div className="flex justify-between items-center text-xs font-bold mb-1.5">
          <span className="text-slate-600 dark:text-slate-300">
            {isArabic ? progress.currentTier.nameAr : progress.currentTier.nameEn} (Lv {progress.currentTier.tier})
          </span>
          {progress.nextTier ? (
            <span className="text-blue-600 dark:text-blue-400">
              {progress.pointsNeededForNextTier} {isArabic ? 'نقطة للمستوى التالي' : 'pts to next tier'}
            </span>
          ) : (
            <span className="text-amber-500 font-black">
              {isArabic ? 'الحد الأقصى للمستوى' : 'MAX TIER REACHED'}
            </span>
          )}
        </div>

        {/* Outer Bar */}
        <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden relative">
          <motion.div 
            className="h-full rounded-full transition-all duration-500"
            style={{ 
              backgroundColor: progress.currentTier.color,
              width: `${progress.progressPercent}%` 
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progress.progressPercent}%` }}
          />
        </div>
      </div>

      {/* Perks List */}
      <div>
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
          {isArabic ? 'المزايا والمكافآت المفتوحة' : 'Relationship Perks'}
        </h4>
        <div className="space-y-2">
          {allPerks.map((perk) => {
            const isUnlocked = (charState?.unlockedPerkIds ?? []).includes(perk.id);
            const tierInfo = isRival ? REX_RESPECT_TIERS[perk.tierRequired] : TRUST_TIERS[perk.tierRequired];

            return (
              <div 
                key={perk.id}
                className={`flex items-start gap-3 p-2.5 rounded-xl border transition-all ${
                  isUnlocked 
                    ? 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700' 
                    : 'bg-slate-100/40 dark:bg-slate-900/40 border-dashed border-slate-200 dark:border-slate-800 opacity-60'
                }`}
              >
                <div 
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    isUnlocked 
                      ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300' 
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  {isUnlocked ? getIconComponent(perk.icon) : <Lock className="w-3.5 h-3.5" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className={`text-xs font-black truncate ${isUnlocked ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                      {isArabic ? perk.titleAr : perk.titleEn}
                    </p>
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-700/80 text-slate-600 dark:text-slate-300 shrink-0">
                      Lv {perk.tierRequired}
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-tight mt-0.5 line-clamp-2">
                    {isArabic ? perk.descriptionAr : perk.descriptionEn}
                  </p>
                </div>

                {isUnlocked && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 self-center" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
