import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Sun, Sunset, Moon, MessageSquare, Swords, Heart, Star } from 'lucide-react';
import { CharacterId } from '../../../../lib/assets/assetRegistry';
import { NPC_CONFIGS } from '../../../hq/data/npcs';
import { getHero } from '../../../characters/data/heroes';
import { RIVAL_REX } from '../../../characters/data/rivalRex';
import { NPCConfig, TimeOfDay } from '../../../../types';
import { SpriteActor } from './SpriteActor';
import { useAppStore } from '../../../../store';
import { useAgeMode } from '../../../ageMode/hooks/useAgeMode';
import EnergyBar from '../../../game/components/EnergyBar';
import CoinIcon from '../../../../components/ui/CoinIcon';
import { formatCompactNumber } from '../../../../utils/formatters';

export interface DistrictResidentsStripProps {
  districtId: string;
  heroGuideId: CharacterId;
  timeOfDayOverride?: TimeOfDay;
  isArabic: boolean;
  onTalkHero: (heroId: CharacterId) => void;
  onTalkRex: () => void;
  onOpenRelationships: () => void;
  onTalkNpc: (npc: NPCConfig) => void;
}

export const getDeviceTimeOfDay = (): TimeOfDay => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  return 'night';
};

export const DistrictResidentsStrip: React.FC<DistrictResidentsStripProps> = ({
  districtId,
  heroGuideId,
  timeOfDayOverride,
  isArabic,
  onTalkHero,
  onTalkRex,
  onOpenRelationships,
  onTalkNpc,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { playTap } = useAgeMode();
  const { user } = useAppStore();

  const coins = user?.ppTokens ?? 50;
  const hearts = Math.min(5, Math.max(0, user?.energy ?? 5));
  const stars = user?.completedLessonIds?.length ?? 0;
  const isFounderOrUnlimited = user?.subscriptionTier === 'founder' || user?.subscriptionTier === 'tycoon';

  const currentTimeOfDay = timeOfDayOverride || getDeviceTimeOfDay();

  const hero = heroGuideId !== 'rex' ? getHero(heroGuideId as 'ollie' | 'filo' | 'kami' | 'reema') : null;

  // Filter NPCs present in current district and current time of day schedule
  const activeNpcs = useMemo(() => {
    return NPC_CONFIGS.filter((npc) => {
      const entry = npc.schedule?.find(
        (s) => s.districtId === districtId && s.timeOfDay === currentTimeOfDay
      );
      return !!entry;
    });
  }, [districtId, currentTimeOfDay]);

  const timeIcon = currentTimeOfDay === 'morning'
    ? <Sun className="w-3 h-3 text-amber-500" />
    : currentTimeOfDay === 'afternoon'
    ? <Sunset className="w-3 h-3 text-orange-500" />
    : <Moon className="w-3 h-3 text-indigo-400" />;

  const timeLabel = isArabic
    ? currentTimeOfDay === 'morning' ? 'صباحاً' : currentTimeOfDay === 'afternoon' ? 'ظهيرة' : 'مساءً'
    : currentTimeOfDay === 'morning' ? 'Morning' : currentTimeOfDay === 'afternoon' ? 'Afternoon' : 'Night';

  return (
    <div className="w-full bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 transition-all select-none">
      {/* Collapsed One-Row Bar (Max 56px) with Merged Player Resources */}
      <div className="max-w-xl mx-auto h-12 px-3 flex items-center justify-between gap-2">
        {/* Start side: "Who's Here" toggle + Avatars */}
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            className="flex items-center gap-1 text-xs font-black text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer shrink-0"
            aria-expanded={isExpanded}
          >
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-[10px] font-bold text-slate-500 dark:text-slate-400">
              {timeIcon}
              <span>{timeLabel}</span>
            </div>
            <span className="truncate">
              {isArabic ? "من في الحي الآن؟" : "Who's Here?"}
            </span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {/* Compact Avatars row */}
          <div className="flex items-center gap-1">
            {/* Hero Guide Avatar */}
            {hero && (
              <button
                onClick={() => onTalkHero(heroGuideId)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-emerald-500 overflow-hidden bg-white dark:bg-slate-800 hover:scale-105 transition-transform flex items-center justify-center relative cursor-pointer"
                title={isArabic ? hero.nameAr : hero.nameEn}
              >
                <SpriteActor
                  character={heroGuideId as any}
                  pose="idle"
                  size={26}
                  showShadow={false}
                  isAnimated={false}
                />
              </button>
            )}

            {/* Rex Avatar */}
            <button
              onClick={onTalkRex}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-rose-500 overflow-hidden bg-white dark:bg-slate-800 hover:scale-105 transition-transform flex items-center justify-center relative cursor-pointer"
              title={isArabic ? RIVAL_REX.nameAr : RIVAL_REX.nameEn}
            >
              <SpriteActor
                character="rex"
                pose="idle"
                size={26}
                showShadow={false}
                isAnimated={false}
              />
            </button>

            {/* District NPCs */}
            {activeNpcs.slice(0, 2).map((npc) => (
              <button
                key={npc.id}
                onClick={() => onTalkNpc(npc)}
                className="hidden sm:flex w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:scale-105 transition-transform items-center justify-center text-xs sm:text-sm shadow-sm"
                title={isArabic ? npc.nameAr : npc.nameEn}
              >
                <span>{npc.avatar}</span>
              </button>
            ))}

            {/* Hero Relationships Button */}
            <button
              onClick={onOpenRelationships}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:scale-105 transition-transform flex items-center justify-center shadow-sm"
              title={isArabic ? 'علاقات وثقة الأبطال' : 'Hero Trust & Relationships'}
            >
              <Heart className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>
        </div>

        {/* End side: Merged Health (Hearts), Coins, Stars */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* 1. Health / Hearts */}
          {isFounderOrUnlimited ? (
            <div className="scale-85 sm:scale-90 flex-shrink-0">
              <EnergyBar />
            </div>
          ) : (
            <motion.div
              whileTap={{ scale: 0.92 }}
              onClick={playTap}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1 bg-rose-50 dark:bg-rose-950/40 rounded-full select-none border border-rose-100 dark:border-rose-900/40 cursor-pointer"
              title={isArabic ? 'القلوب / الطاقة' : 'Hearts / Energy'}
            >
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 drop-shadow-sm" />
              <span className="text-xs font-black text-rose-600 dark:text-rose-400 leading-none">
                {hearts}
              </span>
            </motion.div>
          )}

          {/* 2. Coins (عملات) */}
          <motion.div
            whileTap={{ scale: 0.92 }}
            onClick={playTap}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1 bg-orange-50 dark:bg-orange-950/40 rounded-full select-none border border-orange-100 dark:border-orange-900/40 cursor-pointer"
            title={isArabic ? 'العملات' : 'Coins'}
          >
            <div className="w-3.5 h-3.5 flex items-center justify-center">
              <CoinIcon size={14} />
            </div>
            <span className="text-xs font-black text-orange-600 dark:text-orange-400 leading-none">
              {formatCompactNumber(coins)}
            </span>
          </motion.div>

          {/* 3. Stars (نجوم) */}
          <motion.div
            whileTap={{ scale: 0.92 }}
            onClick={playTap}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 rounded-full select-none border border-amber-100 dark:border-amber-900/40 cursor-pointer"
            title={isArabic ? 'النجوم' : 'Stars'}
          >
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400 drop-shadow-sm" />
            <span className="text-xs font-black text-amber-700 dark:text-amber-300 leading-none">
              {stars}
            </span>
          </motion.div>
        </div>
      </div>

      {/* Expanded Tray with Dialogue Lines */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 px-3 py-2"
          >
            <div className="max-w-xl mx-auto flex flex-col gap-2">
              {/* Hero guide row */}
              {hero && (
                <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-lg">🦉</span>
                    <div className="min-w-0">
                      <span className="text-xs font-black text-slate-800 dark:text-white block truncate">
                        {isArabic ? hero.nameAr : hero.nameEn}
                      </span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {isArabic ? hero.dialogueBank.tip[0]?.textAr : hero.dialogueBank.tip[0]?.textEn}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onTalkHero(heroGuideId)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-black shrink-0 cursor-pointer"
                  >
                    {isArabic ? "تحدث" : "Talk"}
                  </button>
                </div>
              )}

              {/* Rex Row */}
              <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 shadow-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-lg">🦝</span>
                  <div className="min-w-0">
                    <span className="text-xs font-black text-rose-700 dark:text-rose-300 block truncate">
                      {isArabic ? RIVAL_REX.nameAr : RIVAL_REX.nameEn}
                    </span>
                    <p className="text-[11px] text-rose-600/80 dark:text-rose-400 truncate">
                      {isArabic ? "هل تعتقد أنك تفهم ريادة الأعمال حقاً؟ فكر ثانية!" : "Think you know business? Think again."}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onTalkRex}
                  className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-black shrink-0 cursor-pointer flex items-center gap-1"
                >
                  <Swords className="w-3 h-3" />
                  <span>{isArabic ? "تحدي" : "Fight"}</span>
                </button>
              </div>

              {/* NPCs */}
              {activeNpcs.map((npc) => (
                <div
                  key={npc.id}
                  className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-lg">{npc.avatar}</span>
                    <div className="min-w-0">
                      <span className="text-xs font-black text-slate-800 dark:text-white block truncate">
                        {isArabic ? npc.nameAr : npc.nameEn}
                      </span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {isArabic ? npc.arabicPersonality : npc.personality}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onTalkNpc(npc)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-black shrink-0 cursor-pointer"
                  >
                    {isArabic ? "نصيحة" : "Tip"}
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
