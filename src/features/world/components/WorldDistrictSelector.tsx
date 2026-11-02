import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Sparkles, CheckCircle2 } from 'lucide-react';
import { DISTRICTS, DistrictId, DistrictInfo } from '../../../domain/world/districts';
import { useAgeMode } from '../../ageMode/hooks/useAgeMode';
import { getHero } from '../../characters/data/heroes';
import { useAppStore } from '../../../store';
import { UserRole } from '../../../types';

export interface WorldDistrictSelectorProps {
  selectedDistrictId: DistrictId;
  onSelectDistrict: (districtId: DistrictId) => void;
  unlockedDistricts?: (DistrictId | string)[];
  userLevel?: number;
}

export const WorldDistrictSelector: React.FC<WorldDistrictSelectorProps> = ({
  selectedDistrictId,
  onSelectDistrict,
  unlockedDistricts = ['money'],
  userLevel = 1
}) => {
  const { isArabic, playTap } = useAgeMode();
  const user = useAppStore((state) => state.user);
  const isAdmin =
    user?.role === UserRole.ADMIN ||
    user?.role?.toUpperCase?.() === 'ADMIN' ||
    (user as any)?.isAdmin === true;

  const isDistrictUnlocked = (district: DistrictInfo): boolean => {
    if (isAdmin) return true;
    if (district.unlockedByDefault) return true;
    if (unlockedDistricts.includes(district.id) || unlockedDistricts.includes(`district_0${district.number}_${district.id}`)) return true;

    if (userLevel >= district.requiredLevel) return true;
    return false;
  };

  return (
    <div className="w-full bg-slate-900/60 backdrop-blur-md border-y border-slate-800/80 py-3 px-4">
      <div className="max-w-6xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth snap-x py-1">
        {DISTRICTS.map((district) => {
          const isSelected = district.id === selectedDistrictId;
          const unlocked = isDistrictUnlocked(district);
          const hero = district.heroGuide !== 'rex' ? getHero(district.heroGuide as any) : null;
          const heroName = isArabic ? hero?.nameAr : hero?.nameEn;

          return (
            <motion.button
              key={district.id}
              whileTap={unlocked ? { scale: 0.95 } : {}}
              onClick={() => {
                if (unlocked) {
                  playTap?.();
                  onSelectDistrict(district.id);
                }
              }}
              className={`flex-shrink-0 snap-start relative flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border-2 transition-all min-h-[48px] ${
                isSelected
                  ? 'bg-slate-800 text-white shadow-lg'
                  : unlocked
                  ? 'bg-slate-800/50 text-slate-300 hover:bg-slate-800/80 border-slate-700/60'
                  : 'bg-slate-900/40 text-slate-500 border-slate-800/50 cursor-not-allowed opacity-60'
              }`}
              style={{
                borderColor: isSelected ? district.themeColor : undefined,
                boxShadow: isSelected ? `0 0 16px ${district.themeColor}33` : undefined
              }}
              title={
                !unlocked
                  ? isArabic
                    ? `مغلق - يتطلب مستوى ${district.requiredLevel}`
                    : `Locked - Requires Level ${district.requiredLevel}`
                  : undefined
              }
              aria-label={isArabic ? district.nameAr : district.nameEn}
            >
              {/* District Icon */}
              <span className="text-xl flex-shrink-0 select-none">{district.icon}</span>

              {/* District Details */}
              <div className="flex flex-col text-start">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {isArabic ? `حي ${district.number}` : `Dist. ${district.number}`}
                  </span>
                  {!unlocked && <Lock className="w-3 h-3 text-amber-500" />}
                </div>
                <span className="text-sm font-extrabold truncate max-w-[130px] sm:max-w-[160px]">
                  {isArabic ? district.nameAr : district.nameEn}
                </span>
              </div>

              {/* Guide Hero Mini Badge */}
              {hero && unlocked && (
                <span
                  className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold text-white ml-1 flex-shrink-0"
                  style={{ backgroundColor: `${district.themeColor}dd` }}
                >
                  {heroName}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
