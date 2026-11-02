import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FlaskConical, 
  Sparkles, 
  Lightbulb, 
  CheckCircle, 
  RotateCcw, 
  Coins, 
  Trophy, 
  Flame, 
  Sliders,
  X,
  Plus
} from 'lucide-react';
import { getHero } from '../../characters/data/heroes';
import { getCharacterAsset } from '../../../lib/assets/assetRegistry';
import { useAgeMode } from '../../ageMode/hooks/useAgeMode';
import { useAppStore } from '../../../store';
import { SoundService } from '../../../lib/sound';
import { RelationshipEngine } from '../../characters/engine/relationshipEngine';

export interface PrototypeElement {
  id: string;
  nameEn: string;
  nameAr: string;
  category: 'base' | 'modifier' | 'tech';
  icon: string;
  uniquenessWeight: number;
  feasibilityWeight: number;
  cost: number;
}

export const LAB_ELEMENTS: PrototypeElement[] = [
  // Bases
  { id: 'base_drink', nameEn: 'Artisan Lemonade Base', nameAr: 'عصير ليمون طبيعي', category: 'base', icon: '🍋', uniquenessWeight: 15, feasibilityWeight: 90, cost: 5 },
  { id: 'base_gadget', nameEn: 'Smart Pocket Gadget', nameAr: 'جهاز ذكي للجيب', category: 'base', icon: '📱', uniquenessWeight: 35, feasibilityWeight: 65, cost: 15 },
  { id: 'base_clothing', nameEn: 'Eco Apparel', nameAr: 'أزياء صديقة للبيئة', category: 'base', icon: '👕', uniquenessWeight: 25, feasibilityWeight: 80, cost: 10 },
  { id: 'base_snack', nameEn: 'Healthy Energy Bar', nameAr: 'لوح طاقة صحي ولذيذ', category: 'base', icon: '🍫', uniquenessWeight: 20, feasibilityWeight: 85, cost: 8 },

  // Modifiers
  { id: 'mod_solar', nameEn: 'Solar-Powered Kinetic Chip', nameAr: 'شريحة شحن بالطاقة الشمسية', category: 'modifier', icon: '☀️', uniquenessWeight: 30, feasibilityWeight: 60, cost: 12 },
  { id: 'mod_glow', nameEn: 'Biodegradable Glow Pigment', nameAr: 'صبغة مضيئة قابلة للتحلل', category: 'modifier', icon: '✨', uniquenessWeight: 25, feasibilityWeight: 75, cost: 8 },
  { id: 'mod_organic', nameEn: 'Mountain Wild Berry Extract', nameAr: 'خلاصة التوت البري الجبلي', category: 'modifier', icon: '🫐', uniquenessWeight: 20, feasibilityWeight: 90, cost: 6 },
  { id: 'mod_recycled', nameEn: 'Ocean Recycled Fibers', nameAr: 'ألياف بلاستيكية معاد تدويرها', category: 'modifier', icon: '🌊', uniquenessWeight: 28, feasibilityWeight: 80, cost: 10 },

  // Tech / Spark
  { id: 'tech_ai', nameEn: 'Mini Voice Greeting AI', nameAr: 'مساعد صوتي ذكي مرح', category: 'tech', icon: '🤖', uniquenessWeight: 40, feasibilityWeight: 50, cost: 20 },
  { id: 'tech_qr', nameEn: 'Interactive AR Story Sticker', nameAr: 'ملصق واقع معزز تفاعلي', category: 'tech', icon: '🏷️', uniquenessWeight: 25, feasibilityWeight: 85, cost: 7 }
];

export interface PrototypeResult {
  id: string;
  nameEn: string;
  nameAr: string;
  uniquenessScore: number;
  feasibilityScore: number;
  marketDemandScore: number;
  overallScore: number;
  tokensEarned: number;
  xpEarned: number;
  kamiVerdictEn: string;
  kamiVerdictAr: string;
}

export interface KamiExperimentLabProps {
  onClose?: () => void;
}

export const KamiExperimentLab: React.FC<KamiExperimentLabProps> = ({ onClose }) => {
  const { isArabic } = useAgeMode();
  const user = useAppStore((state) => state.user);

  const kamiHero = getHero('kami');
  const kamiAvatar = getCharacterAsset('kami', 'happy');

  const [selectedBase, setSelectedBase] = useState<PrototypeElement | null>(null);
  const [selectedModifiers, setSelectedModifiers] = useState<PrototypeElement[]>([]);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [activeResult, setActiveResult] = useState<PrototypeResult | null>(null);
  const [inventionHistory, setInventionHistory] = useState<PrototypeResult[]>([]);

  const handleToggleModifier = (mod: PrototypeElement) => {
    SoundService.playClick();
    if (selectedModifiers.some(m => m.id === mod.id)) {
      setSelectedModifiers(selectedModifiers.filter(m => m.id !== mod.id));
    } else {
      if (selectedModifiers.length >= 2) {
        // limit to 2 modifiers
        setSelectedModifiers([selectedModifiers[1], mod]);
      } else {
        setSelectedModifiers([...selectedModifiers, mod]);
      }
    }
  };

  const handleSynthesize = () => {
    if (!selectedBase || isSynthesizing) return;
    setIsSynthesizing(true);
    SoundService.playClick();

    setTimeout(() => {
      // Calculate scores based on element weights
      const totalElements = [selectedBase, ...selectedModifiers];
      const avgUniqueness = Math.min(98, Math.round(
        totalElements.reduce((sum, el) => sum + el.uniquenessWeight, 0) * 1.1
      ));
      const avgFeasibility = Math.min(95, Math.round(
        totalElements.reduce((sum, el) => sum + el.feasibilityWeight, 0) / totalElements.length
      ));
      const demand = Math.min(99, Math.round((avgUniqueness * 0.6) + (avgFeasibility * 0.4)));
      const overall = Math.round((avgUniqueness + avgFeasibility + demand) / 3);

      const tokens = Math.round(overall * 0.6);
      const xp = Math.round(overall * 1.5);

      const modNamesEn = selectedModifiers.map(m => m.nameEn).join(' + ');
      const modNamesAr = selectedModifiers.map(m => m.nameAr).join(' مع ');

      const titleEn = selectedModifiers.length > 0 
        ? `${selectedBase.nameEn} (${modNamesEn})`
        : `Pure ${selectedBase.nameEn}`;

      const titleAr = selectedModifiers.length > 0 
        ? `${selectedBase.nameAr} (${modNamesAr})`
        : `${selectedBase.nameAr} الأصلي`;

      let verdictEn = "Outstanding breakthrough! This is how game-changing startups begin!";
      let verdictAr = "ابتكار مذهل بحق! هكذا تبدأ المشاريع الريادية الرائدة التي تغير العالم!";

      if (overall < 60) {
        verdictEn = "Fun experiment! Great founders fail forward—let's tweak the formula!";
        verdictAr = "تجربة ممتازة! رواد الأعمال العظماء يتعلمون من كل محاولة، هيا نعدل المعادلة!";
      }

      const result: PrototypeResult = {
        id: `proto_${Date.now()}`,
        nameEn: titleEn,
        nameAr: titleAr,
        uniquenessScore: avgUniqueness,
        feasibilityScore: avgFeasibility,
        marketDemandScore: demand,
        overallScore: overall,
        tokensEarned: tokens,
        xpEarned: xp,
        kamiVerdictEn: verdictEn,
        kamiVerdictAr: verdictAr
      };

      // Award XP and tokens
      useAppStore.setState((state) => {
        if (!state.user) return state;
        return {
          user: {
            ...state.user,
            xp: (state.user.xp || 0) + xp,
            ppTokens: (state.user.ppTokens || 0) + tokens
          }
        };
      });

      // Award Kami trust for prototyping
      const demandRating = demand >= 90 ? 'VIRAL' : demand >= 75 ? 'HIGH' : demand >= 55 ? 'MEDIUM' : 'LOW';
      RelationshipEngine.onPrototypeCrafted(demandRating);
      try {
        useAppStore.getState().trackMissionProgress('PROTOTYPE_CRAFT', 1, 'innovation');
      } catch (_) {}

      SoundService.playSuccess();
      setActiveResult(result);
      setInventionHistory([result, ...inventionHistory]);
      setIsSynthesizing(false);
    }, 1200);
  };

  const handleReset = () => {
    SoundService.playClick();
    setSelectedBase(null);
    setSelectedModifiers([]);
    setActiveResult(null);
  };

  return (
    <div 
      className="w-full max-w-4xl mx-auto p-4 sm:p-6 text-white"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/25">
            <FlaskConical className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {isArabic ? 'معمل كامي للابتكار والاختراع' : "Kami's Prototyping Lab"}
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-extrabold border border-emerald-800">
                HQ Lab 2.0
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">
              {isArabic 
                ? 'امزج الأفكار، اصنع نماذج جديدة، واكسب توكنز الابتكار' 
                : 'Combine elements, test wild ideas, and earn Innovation Tokens'}
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors self-end sm:self-auto"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* ── Kami Banner & Philosophy ── */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/80 border-2 border-emerald-500/30 flex items-center gap-4 mb-6 shadow-xl">
        <img 
          src={kamiAvatar.path} 
          alt="Kami" 
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/assets/characters/kami/default.png';
          }}
          className="w-16 h-16 rounded-2xl object-contain bg-slate-800 p-1 border border-emerald-400/40 flex-shrink-0"
        />
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
              {isArabic ? kamiHero.nameAr : kamiHero.nameEn}
            </span>
            <span className="text-xs text-slate-400">({isArabic ? kamiHero.roleAr : kamiHero.roleEn})</span>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-200">
            {isArabic 
              ? '«لا تخف من التجربة! كل اختراع عظيم بدأ بفكرة مجنونة بدت مستحيلة!»' 
              : '“Break the rules safely! Every breakthrough invention started as a wild experiment!”'}
          </p>
        </div>
      </div>

      {!activeResult ? (
        <div className="space-y-6">
          {/* Step 1: Base Selection */}
          <div className="space-y-2.5">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">
              {isArabic ? 'الخطوة 1: اختر المنتج الأساسي' : 'Step 1: Choose Your Product Base'}
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {LAB_ELEMENTS.filter(e => e.category === 'base').map((el) => {
                const isSelected = selectedBase?.id === el.id;
                return (
                  <button
                    key={el.id}
                    onClick={() => { SoundService.playClick(); setSelectedBase(el); }}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center text-center gap-2 transition-all ${
                      isSelected
                        ? 'bg-emerald-950/40 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] scale-105'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-3xl">{el.icon}</span>
                    <span className="text-xs font-black leading-tight">
                      {isArabic ? el.nameAr : el.nameEn}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Modifiers & Tech */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                {isArabic ? 'الخطوة 2: أضف ميزات وعناصر خاصة (حتى عنصرين)' : 'Step 2: Add Special Modifiers (Up to 2)'}
              </span>
              <span className="text-xs font-bold text-emerald-400">
                {selectedModifiers.length} / 2 {isArabic ? 'مختار' : 'Selected'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {LAB_ELEMENTS.filter(e => e.category !== 'base').map((el) => {
                const isSelected = selectedModifiers.some(m => m.id === el.id);
                return (
                  <button
                    key={el.id}
                    onClick={() => handleToggleModifier(el)}
                    className={`p-3.5 rounded-2xl border-2 flex items-center gap-3 text-start transition-all ${
                      isSelected
                        ? 'bg-violet-950/40 border-violet-400 text-white shadow-[0_0_15px_rgba(139,92,246,0.25)]'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-2xl flex-shrink-0">{el.icon}</span>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-black block leading-tight truncate">
                        {isArabic ? el.nameAr : el.nameEn}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        +{el.uniquenessWeight}% {isArabic ? 'تميز' : 'Uniqueness'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Synthesize Action */}
          <div className="pt-2 flex gap-3">
            <button
              onClick={handleSynthesize}
              disabled={!selectedBase || isSynthesizing}
              className={`flex-1 py-4 px-6 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl ${
                selectedBase && !isSynthesizing
                  ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 text-slate-950 hover:brightness-110 shadow-emerald-500/25 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              <span>
                {isSynthesizing 
                  ? (isArabic ? 'جاري بناء واختبار النموذج... ⚙️' : 'Synthesizing Prototype... ⚙️')
                  : (isArabic ? 'بدء التصنيع والاختبار 🚀' : 'Synthesize Prototype 🚀')}
              </span>
            </button>

            {(selectedBase || selectedModifiers.length > 0) && (
              <button
                onClick={handleReset}
                className="p-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
                title="Reset"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Result Screen */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-3xl bg-slate-900 border-2 border-emerald-500/40 space-y-6 shadow-2xl"
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                {isArabic ? 'تم ابتكار النموذج بنجاح!' : 'Prototype Synthesized!'}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                {isArabic ? activeResult.nameAr : activeResult.nameEn}
              </h2>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 text-2xl">
              🏆
            </div>
          </div>

          {/* 3 Metric Gauges */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 text-center space-y-1">
              <span className="text-xs text-slate-400 font-bold block">
                {isArabic ? 'مؤشر التميز' : 'Uniqueness'}
              </span>
              <span className="text-xl sm:text-2xl font-black text-purple-400">
                {activeResult.uniquenessScore}%
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 text-center space-y-1">
              <span className="text-xs text-slate-400 font-bold block">
                {isArabic ? 'سهولة التصنيع' : 'Feasibility'}
              </span>
              <span className="text-xl sm:text-2xl font-black text-sky-400">
                {activeResult.feasibilityScore}%
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 text-center space-y-1">
              <span className="text-xs text-slate-400 font-bold block">
                {isArabic ? 'إقبال السوق' : 'Market Demand'}
              </span>
              <span className="text-xl sm:text-2xl font-black text-amber-400">
                {activeResult.marketDemandScore}%
              </span>
            </div>
          </div>

          {/* Kami Verdict */}
          <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-3">
            <span className="text-2xl">🦎</span>
            <div>
              <span className="text-xs font-black uppercase text-emerald-400 block mb-0.5">
                {isArabic ? 'تقييم كامي النهائي' : "Kami's Feedback"}
              </span>
              <p className="text-xs sm:text-sm text-emerald-200 leading-relaxed font-semibold">
                {isArabic ? activeResult.kamiVerdictAr : activeResult.kamiVerdictEn}
              </p>
            </div>
          </div>

          {/* Rewards */}
          <div className="flex justify-between items-center p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-xs font-black text-slate-300">
              {isArabic ? 'مكافآت الابتكار المكتسبة:' : 'Innovation Rewards Earned:'}
            </span>
            <div className="flex items-center gap-3">
              <span className="text-sm font-black text-amber-400 flex items-center gap-1">
                <Coins className="w-4 h-4" />
                +{activeResult.tokensEarned} P-Tokens
              </span>
              <span className="text-sm font-black text-cyan-400 flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                +{activeResult.xpEarned} XP
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm uppercase tracking-wider hover:brightness-110 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              {isArabic ? 'ابتكار فكرة جديدة 🧪' : 'Synthesize Another Idea 🧪'}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
