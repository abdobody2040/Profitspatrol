import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Store, 
  DollarSign, 
  Package, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  HelpCircle, 
  Play, 
  Award, 
  Megaphone, 
  ShieldCheck,
  History,
  RotateCcw,
  Swords,
  Heart,
  Shield,
  Zap
} from 'lucide-react';
import { useBusinessStore } from '../store/businessStore';
import { QualityTier } from '../types/business';
import { useAgeMode } from '../../ageMode/hooks/useAgeMode';
import { WhyExplanationModal } from './WhyExplanationModal';
import { RexShowdownModal } from '../../rivalry/components/RexShowdownModal';
import { useRivalryStore } from '../../rivalry/store/rivalryStore';
import { calculateMarketShareBonus } from '../../rivalry/engine/rexCompetition';
import { useTrustStore } from '../../characters/store/trustStore';
import { getCharacterAsset } from '../../../lib/assets/assetRegistry';

export const BusinessDashboard: React.FC = () => {
  const { isArabic, isJunior, playTap, playSuccess } = useAgeMode();
  const { 
    venture, 
    lastSimResult, 
    buyInventory, 
    setPrice, 
    setQuality, 
    setMarketingBudget, 
    simulateNextDay,
    clearConsequence,
    resetVenture
  } = useBusinessStore();

  const [whyModalOpen, setWhyModalOpen] = useState(false);
  const [showdownOpen, setShowdownOpen] = useState(false);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  const trustStore = useTrustStore();
  const hasOllieForecast = trustStore.hasPerk('ollie_p3');
  const hasReemaMarketing = trustStore.hasPerk('reema_p2');
  const hasFiloShield = trustStore.hasPerk('filo_p2');
  const hasKamiInnovation = trustStore.hasPerk('kami_p3');
  const hasRexDeal = trustStore.hasPerk('rex_p2');
  const anyHeroPerkActive = hasOllieForecast || hasReemaMarketing || hasFiloShield || hasKamiInnovation || hasRexDeal;

  const { getDistrictStatus } = useRivalryStore();
  const districtStatus = getDistrictStatus('money');
  const marketBonus = calculateMarketShareBonus(districtStatus.playerMarketShare);

  const handleBuy = (units: number) => {
    playTap?.();
    const res = buyInventory(units);
    if (!res.success) {
      setPurchaseError(res.message || 'Cannot purchase inventory');
      setTimeout(() => setPurchaseError(null), 3000);
    }
  };

  const handleSimulate = () => {
    playSuccess?.();
    const result = simulateNextDay();
    if (result.consequence) {
      setWhyModalOpen(true);
    }
  };

  return (
    <div 
      className="w-full max-w-4xl mx-auto px-4 py-6 text-slate-800 dark:text-slate-100"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* ── Business Top Card ── */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-800 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center text-3xl">
              <Store className="w-8 h-8 text-amber-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {venture.name}
                </h1>
                <span className="text-xs font-black uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {isArabic ? `اليوم ${venture.day}` : `Day ${venture.day}`}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                {isArabic ? 'مشروعك التجاري الدائم' : 'Your Persistent Business Empire'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => { playTap?.(); resetVenture(); }}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
              title={isArabic ? 'إعادة ضبط المشروع' : 'Reset Venture'}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Core Financial Gauges ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5">
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
              {isArabic ? 'الخزينة (كاش)' : 'Cash in Vault'}
            </span>
            <span className="text-2xl font-black text-emerald-700 dark:text-emerald-300">
              ${venture.cash.toFixed(2)}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-800/40">
            <span className="text-xs font-bold text-sky-600 dark:text-sky-400 block mb-1">
              {isArabic ? 'المخزون المتوفر' : 'In Stock'}
            </span>
            <span className="text-2xl font-black text-sky-700 dark:text-sky-300">
              {venture.inventory} <span className="text-xs font-bold">{isArabic ? 'وحدة' : 'units'}</span>
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/40">
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 block mb-1">
              {isArabic ? 'السمعة التجارية' : 'Reputation'}
            </span>
            <span className="text-2xl font-black text-purple-700 dark:text-purple-300">
              {venture.reputation}/100
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 block mb-1">
              {isArabic ? 'صافي الأرباح الكلي' : 'Total Profit'}
            </span>
            <span className={`text-2xl font-black ${venture.netProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'}`}>
              ${venture.netProfit.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* ── Active Consequence Banner (If triggered) ── */}
      {venture.activeConsequence && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-300 dark:border-amber-800 rounded-3xl p-4 sm:p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500 text-white flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-black text-slate-900 dark:text-white">
                {isArabic ? venture.activeConsequence.titleAr : venture.activeConsequence.titleEn}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-1">
                {isArabic ? venture.activeConsequence.suggestedActionAr : venture.activeConsequence.suggestedActionEn}
              </p>
            </div>
          </div>
          <button
            onClick={() => setWhyModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black flex items-center gap-1.5 shadow"
          >
            <HelpCircle className="w-4 h-4" />
            <span>{isArabic ? 'لماذا حدث هذا؟' : 'Why did this happen?'}</span>
          </button>
        </div>
      )}

      {/* ── Active Hero Perks & Advisory Banner ── */}
      <div className="bg-gradient-to-r from-indigo-50/80 via-purple-50/80 to-blue-50/80 dark:from-slate-800/80 dark:to-slate-800/50 rounded-3xl p-4 sm:p-5 border border-indigo-100 dark:border-indigo-900/40 mb-6 shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-indigo-600 dark:text-indigo-400 fill-current" />
            <h3 className="text-sm font-black text-slate-800 dark:text-slate-100">
              {isArabic ? 'الدعم الاستشاري ومزايا الأبطال الفعالة' : 'Active Hero Advisors & Perks'}
            </h3>
          </div>
          <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300">
            {anyHeroPerkActive
              ? (isArabic ? 'المزايا تضاعف أرباحك وتخفض التكاليف' : 'Perks boosting sales & trimming costs')
              : (isArabic ? 'تحدث مع الأبطال في الخريطة لفتح المزايا' : 'Level up Hero Trust on Map to unlock perks')}
          </span>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {hasOllieForecast && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 border border-indigo-200 dark:border-indigo-800 text-xs font-bold shadow-sm">
              <span className="text-sm">🦉</span>
              <span>{isArabic ? 'تنبؤات أولي (+15% زوار)' : "Ollie's Forecast (+15% Visitors)"}</span>
            </span>
          )}

          {hasReemaMarketing && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 border border-indigo-200 dark:border-indigo-800 text-xs font-bold shadow-sm">
              <span className="text-sm">🦊</span>
              <span>{isArabic ? 'انتشار ريما (2.2x تسويق)' : "Reema's Viral Boost (2.2x ROI)"}</span>
            </span>
          )}

          {hasFiloShield && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 border border-indigo-200 dark:border-indigo-800 text-xs font-bold shadow-sm">
              <span className="text-sm">🐘</span>
              <span>{isArabic ? 'درع فيلو (15% خصم توريد)' : "Filo's Wholesale Shield (-15% Cost)"}</span>
            </span>
          )}

          {hasKamiInnovation && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 border border-indigo-200 dark:border-indigo-800 text-xs font-bold shadow-sm">
              <span className="text-sm">🦎</span>
              <span>{isArabic ? 'تصنيع كامي (20% توفير مميز)' : "Kami's Quality Craft (-20% Premium)"}</span>
            </span>
          )}

          {hasRexDeal && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 border border-indigo-200 dark:border-indigo-800 text-xs font-bold shadow-sm">
              <span className="text-sm">🥊</span>
              <span>{isArabic ? 'صفقة ريكس (خصم منافسين)' : "Rex's Market Deal (Wholesale)"}</span>
            </span>
          )}

          {!anyHeroPerkActive && (
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span className="text-base">🌱</span>
              <span>
                {isArabic
                  ? 'أنت في المستوى الأول مع الأبطال. واصل إتمام الدروس ونزالات ريكس لتفعيل قدراتهم الخاصة في متجرك!'
                  : 'You are at Tier 1. Complete lessons and district showdowns to activate hero superpowers in your shop!'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Control Center (The 4 Business Levers) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        {/* Lever 1: Pricing */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-500" />
              <span>{isArabic ? 'سعر البيع للوحدة' : 'Selling Price Per Unit'}</span>
            </h3>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              ${venture.sellingPrice.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => { playTap?.(); setPrice(venture.sellingPrice - 0.5); }}
              className="w-12 h-12 rounded-2xl border-2 border-slate-200 dark:border-slate-700 text-xl font-black hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center active:scale-95"
            >
              -
            </button>
            <input
              type="range"
              min="0.5"
              max="10.0"
              step="0.25"
              value={venture.sellingPrice}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
              className="flex-1 accent-emerald-500 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
            <button
              onClick={() => { playTap?.(); setPrice(venture.sellingPrice + 0.5); }}
              className="w-12 h-12 rounded-2xl border-2 border-slate-200 dark:border-slate-700 text-xl font-black hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center active:scale-95"
            >
              +
            </button>
          </div>
          <span className="text-xs text-slate-400 block text-start">
            {isArabic ? `تكلفة إنتاج الوحدة الحالية: $${venture.inventoryCostPerUnit.toFixed(2)}` : `Current unit cost: $${venture.inventoryCostPerUnit.toFixed(2)}`}
          </span>
        </div>

        {/* Lever 2: Inventory Purchase */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-sky-500" />
              <span>{isArabic ? 'شراء بضاعة ومواد' : 'Buy Inventory'}</span>
            </h3>
            <span className="text-sm font-bold text-slate-400">
              ${venture.inventoryCostPerUnit.toFixed(2)} / {isArabic ? 'وحدة' : 'unit'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-2">
            {[5, 10, 20].map((units) => {
              const cost = units * venture.inventoryCostPerUnit;
              const canAfford = venture.cash >= cost;
              return (
                <button
                  key={units}
                  onClick={() => handleBuy(units)}
                  disabled={!canAfford}
                  className={`py-3 px-2 rounded-2xl font-black text-xs sm:text-sm flex flex-col items-center justify-center border transition-all ${
                    canAfford
                      ? 'bg-sky-50 dark:bg-sky-950/30 border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 hover:bg-sky-100 active:scale-95'
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <span>+{units} {isArabic ? 'وحدات' : 'Units'}</span>
                  <span className="text-[11px] font-semibold opacity-80">${cost.toFixed(2)}</span>
                </button>
              );
            })}
          </div>
          {purchaseError && (
            <span className="text-xs text-rose-500 font-bold block">{purchaseError}</span>
          )}
        </div>

        {/* Lever 3: Quality Tier */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <span>{isArabic ? 'درجة جودة المواد' : 'Material Quality'}</span>
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {(['budget', 'standard', 'premium'] as QualityTier[]).map((tier) => (
              <button
                key={tier}
                onClick={() => { playTap?.(); setQuality(tier); }}
                className={`py-3 px-2 rounded-2xl font-black text-xs sm:text-sm capitalize transition-all border ${
                  venture.qualityTier === tier
                    ? 'bg-purple-600 text-white border-purple-600 shadow-md scale-105'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                }`}
              >
                <div>{tier}</div>
                <div className="text-[10px] opacity-80 mt-0.5">
                  {tier === 'budget' ? '$0.50' : tier === 'standard' ? '$1.00' : '$2.00'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Lever 4: Marketing Budget */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-amber-500" />
              <span>{isArabic ? 'ميزانية الدعاية اليومية' : 'Daily Marketing Budget'}</span>
            </h3>
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
              ${venture.marketingBudget.toFixed(2)}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[0, 5, 10, 15].map((budget) => (
              <button
                key={budget}
                onClick={() => { playTap?.(); setMarketingBudget(budget); }}
                className={`py-2.5 px-1 rounded-2xl font-black text-xs transition-all border ${
                  venture.marketingBudget === budget
                    ? 'bg-amber-500 text-white border-amber-500 shadow-md scale-105'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                }`}
              >
                ${budget}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Simulate Next Day CTA ── */}
      <div className="flex justify-center mb-8">
        <button
          onClick={handleSimulate}
          className="w-full sm:w-auto px-10 py-5 rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xl shadow-xl hover:shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 min-h-[64px]"
        >
          <Play className="w-7 h-7 fill-current" />
          <span>{isArabic ? `بدء مبيعات اليوم ${venture.day} 🚀` : `Run Day ${venture.day} Sales 🚀`}</span>
        </button>
      </div>

      {/* ── Last Day Summary Card ── */}
      {lastSimResult && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-md mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>{isArabic ? `نتائج اليوم ${lastSimResult.day}` : `Day ${lastSimResult.day} Results`}</span>
            </h3>
            <span className={`text-base font-black px-3 py-1 rounded-xl ${
              lastSimResult.dailyProfit >= 0
                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
            }`}>
              {lastSimResult.dailyProfit >= 0 ? `+${lastSimResult.dailyProfit.toFixed(2)}$` : `${lastSimResult.dailyProfit.toFixed(2)}$`}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-center">
              <span className="text-xs text-slate-400 block">{isArabic ? 'الزبائن' : 'Customers'}</span>
              <span className="text-lg font-black">{lastSimResult.customersVisited}</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-center">
              <span className="text-xs text-slate-400 block">{isArabic ? 'تم بيعه' : 'Units Sold'}</span>
              <span className="text-lg font-black">{lastSimResult.unitsSold}</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-center">
              <span className="text-xs text-slate-400 block">{isArabic ? 'الإيرادات' : 'Revenue'}</span>
              <span className="text-lg font-black text-emerald-600">${lastSimResult.revenue.toFixed(2)}</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-center">
              <span className="text-xs text-slate-400 block">{isArabic ? 'المصاريف' : 'Expenses'}</span>
              <span className="text-lg font-black text-rose-500">${lastSimResult.totalExpenses.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* ── District Rivalry Widget (Rex the Raccoon) ── */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-rose-950/40 rounded-3xl p-6 border-2 border-rose-500/30 text-white shadow-xl mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <Swords className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  {isArabic ? 'المنافسة الإقليمية: ريكس المنافس' : 'District Rivalry: Rival Rex'}
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 font-bold border border-rose-800">
                  {isArabic ? marketBonus.tierAr : marketBonus.tierEn}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isArabic 
                  ? 'ريكس يفتح متاجره المنافسة في حيك! واجهه بقراراتك الاستراتيجية لتكسب حصة السوق.' 
                  : 'Rex is operating rival shops in your district! Outsmart him to capture market share.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => { playTap?.(); setShowdownOpen(true); }}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20 active:scale-95 transition-all"
          >
            <Swords className="w-4 h-4" />
            <span>{isArabic ? 'مواجهة ريكس ⚡' : 'Challenge Rex ⚡'}</span>
          </button>
        </div>

        {/* Market Share Bar */}
        <div className="pt-4">
          <div className="flex justify-between items-center text-xs font-black mb-1.5">
            <span className="text-emerald-400">
              {isArabic ? 'حصتك في السوق:' : 'Your Market Share:'} {districtStatus.playerMarketShare}%
            </span>
            <span className="text-rose-400">
              {districtStatus.rexMarketShare}% :{isArabic ? 'حصة ريكس' : "Rex's Share"}
            </span>
          </div>
          <div className="relative h-2.5 w-full bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
            <div 
              style={{ width: `${districtStatus.playerMarketShare}%` }}
              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-l-full"
            />
            <div className="flex-1 h-full bg-gradient-to-r from-rose-500 to-rose-700 rounded-r-full" />
          </div>
        </div>
      </div>

      {/* ── Why Explanation Modal ── */}
      <WhyExplanationModal
        isOpen={whyModalOpen}
        onClose={() => setWhyModalOpen(false)}
        consequence={venture.activeConsequence || null}
      />

      {/* ── Rex Showdown Modal ── */}
      <AnimatePresence>
        {showdownOpen && (
          <RexShowdownModal
            districtId="money"
            onClose={() => setShowdownOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
