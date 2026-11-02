import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, 
  Lightbulb, 
  DollarSign, 
  Sparkles, 
  ShieldCheck, 
  Swords, 
  Award, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { useCapstoneStore } from '../store/capstoneStore';
import { CAPSTONE_PROBLEMS, MOCK_INVESTORS } from '../data/capstoneData';
import { CapstoneStage } from '../types/capstone';
import { CapstoneCertificateModal } from './CapstoneCertificateModal';
import { useAgeMode } from '../../ageMode/hooks/useAgeMode';
import { SoundService } from '../../../lib/sound';

export const CapstoneExperience: React.FC = () => {
  const { isArabic } = useAgeMode();
  const {
    currentStage,
    venture,
    certificate,
    setProblem,
    setSolution,
    setEconomics,
    setBranding,
    setOperations,
    setStrategy,
    pitchToTheTank,
    setStage,
    resetCapstone
  } = useCapstoneStore();

  const [showCertificate, setShowCertificate] = useState(false);

  // Form local states
  const [costInput, setCostInput] = useState<number>(venture.unitCost || 2.5);
  const [priceInput, setPriceInput] = useState<number>(venture.sellingPrice || 6.0);
  const [companyNameInput, setCompanyNameInput] = useState<string>(venture.companyName || 'My Startup Co.');
  const [sloganInput, setSloganInput] = useState<string>(venture.sloganAr || venture.sloganEn || 'Making Life Better!');

  const stages: { id: CapstoneStage; labelEn: string; labelAr: string; icon: any }[] = [
    { id: 'problem', labelEn: '1. Problem', labelAr: '١. المشكلة', icon: Lightbulb },
    { id: 'solution', labelEn: '2. Solution', labelAr: '٢. الحل', icon: Rocket },
    { id: 'pricing', labelEn: '3. Economics', labelAr: '٣. التسعير', icon: DollarSign },
    { id: 'branding', labelEn: '4. Branding', labelAr: '٤. العلامة', icon: Sparkles },
    { id: 'operations', labelEn: '5. Ethics', labelAr: '٥. الأمان', icon: ShieldCheck },
    { id: 'strategy', labelEn: '6. Strategy', labelAr: '٦. الخطة', icon: Swords },
    { id: 'pitch', labelEn: '7. Pitch', labelAr: '٧. العرض', icon: Award }
  ];

  const handleNextFromPricing = () => {
    setEconomics(costInput, priceInput);
    SoundService.playClick();
    setStage('branding');
  };

  const handleNextFromBranding = () => {
    setBranding(companyNameInput, sloganInput, sloganInput, venture.primaryColor);
    SoundService.playClick();
    setStage('operations');
  };

  const handleStartPitch = () => {
    SoundService.playSuccess();
    pitchToTheTank();
    setShowCertificate(true);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 p-6 text-white shadow-xl mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 text-xs font-black uppercase tracking-wider mb-2">
              <Award size={14} />
              <span>{isArabic ? 'مشروع التخرج الريادي الكبير' : 'Grand Entrepreneurship Capstone'}</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black m-0 tracking-tight">
              {isArabic ? 'ابنِ شركتك الحقيقية وتخرج كمدير تنفيذي' : 'Build Your Business & Graduate as a CEO'}
            </h1>
            <p className="text-xs sm:text-sm text-white/90 mt-1 max-w-xl">
              {isArabic 
                ? 'رحلتك الكبرى التي تجمع التخطيط، الابتكار، حماية المخاطر، التسويق، وعرض المشروع أمام المستثمرين!' 
                : 'Combine all 6 competencies: design a solution, set prices, build ethical operations, and pitch to The Tank!'}
            </p>
          </div>

          {currentStage === 'graduated' && (
            <button
              onClick={() => setShowCertificate(true)}
              className="py-3 px-5 rounded-2xl bg-white text-orange-600 font-black text-xs shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center gap-2 self-start sm:self-auto"
            >
              <Award size={16} />
              <span>{isArabic ? 'عرض الشهادة الرسمية' : 'View Certificate'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Stage Stepper Tabs */}
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 mb-6">
        {stages.map((st, idx) => {
          const isActive = currentStage === st.id;
          const isDone = stages.findIndex(s => s.id === currentStage) > idx || currentStage === 'graduated';
          return (
            <button
              key={st.id}
              onClick={() => {
                SoundService.playClick();
                setStage(st.id);
              }}
              className={`p-2.5 rounded-2xl flex flex-col items-center gap-1 text-[11px] font-bold transition-all border ${
                isActive
                  ? 'bg-indigo-600 text-white border-indigo-700 shadow-md scale-105'
                  : isDone
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                  : 'bg-white dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800'
              }`}
            >
              <st.icon size={16} />
              <span className="truncate w-full text-center">{isArabic ? st.labelAr : st.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* Main Card Content */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-slate-100 dark:border-slate-800 shadow-lg">
        {/* ── STAGE 1: PROBLEM SELECTION ── */}
        {currentStage === 'problem' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white mb-1">
                {isArabic ? 'الخطوة الأولى: اختر المشكلة التي تريد حلها' : 'Step 1: Choose the Problem to Solve'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isArabic ? 'كل مشروع عظيم يبدأ بحل مشكلة حقيقية يعاني منها العملاء.' : 'Great businesses solve real customer pains.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {CAPSTONE_PROBLEMS.map((prob) => {
                const isSelected = venture.problemId === prob.id;
                return (
                  <div
                    key={prob.id}
                    onClick={() => {
                      SoundService.playClick();
                      setProblem(prob);
                    }}
                    className={`cursor-pointer p-5 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-indigo-50/60 dark:bg-indigo-950/40 border-indigo-500 shadow-md scale-[1.02]'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                    }`}
                  >
                    <div>
                      <div className="text-3xl mb-3">{prob.icon}</div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white mb-2">
                        {isArabic ? prob.titleAr : prob.titleEn}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                        {isArabic ? prob.descriptionAr : prob.descriptionEn}
                      </p>
                    </div>

                    <div className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-100/60 dark:bg-indigo-950 px-2.5 py-1 rounded-xl">
                      🎯 {isArabic ? prob.targetCustomerAr : prob.targetCustomerEn}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => {
                  SoundService.playClick();
                  setStage('solution');
                }}
                className="py-3 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
              >
                <span>{isArabic ? 'متابعة إلى تصميم الحل' : 'Continue to Solution'}</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ── STAGE 2: SOLUTION & PROTOTYPE ── */}
        {currentStage === 'solution' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white mb-1">
                {isArabic ? 'الخطوة الثانية: تصميم الحل مع كيمي (Kami Lab)' : 'Step 2: Design Your Prototype with Kami'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isArabic ? 'حدد اسم المنتج التجريبي والمواد الأساسية لتصنيعه.' : 'Define your prototype product details.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <label className="text-xs font-black text-slate-700 dark:text-slate-300 block mb-2">
                  {isArabic ? 'اسم المنتج المقترح' : 'Proposed Product Name'}
                </label>
                <input
                  type="text"
                  value={venture.solutionNameAr || venture.solutionNameEn}
                  onChange={(e) => setSolution(e.target.value, e.target.value, venture.prototypeCategory, venture.baseMaterial)}
                  className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <label className="text-xs font-black text-slate-700 dark:text-slate-300 block mb-2">
                  {isArabic ? 'المادة الأساسية أو التقنية' : 'Base Material / Tech'}
                </label>
                <select
                  value={venture.baseMaterial}
                  onChange={(e) => setSolution(venture.solutionNameEn, venture.solutionNameAr, venture.prototypeCategory, e.target.value)}
                  className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                >
                  <option value="organic_fresh">{isArabic ? 'مكونات عضوية طبيعية 100%' : '100% Organic Natural Inputs'}</option>
                  <option value="recycled_fiber">{isArabic ? 'ألياف نباتية قابلة للتحلل وإعادة التدوير' : 'Biodegradable Recycled Fibers'}</option>
                  <option value="smart_interactive">{isArabic ? 'بطاقات وأدوات تفاعلية ذكية' : 'Smart Interactive Tools'}</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStage('problem')}
                className="py-3 px-5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black text-xs"
              >
                {isArabic ? 'رجوع' : 'Back'}
              </button>
              <button
                onClick={() => {
                  SoundService.playClick();
                  setStage('pricing');
                }}
                className="py-3 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center gap-2"
              >
                <span>{isArabic ? 'متابعة إلى حساب التكاليف والتسعير' : 'Continue to Pricing'}</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ── STAGE 3: PRICING & ECONOMICS ── */}
        {currentStage === 'pricing' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white mb-1">
                {isArabic ? 'الخطوة الثالثة: دراسة التكاليف وتحديد السعر العادل' : 'Step 3: Economics & Fair Pricing'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isArabic ? 'اضبط تكلفة تصنيع الوحدة وسعر البيع لضمان هامش ربح مستدام.' : 'Set unit cost and selling price to achieve sustainable margins.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <label className="text-xs font-black text-slate-700 dark:text-slate-300 block mb-2">
                  {isArabic ? 'تكلفة إنتاج الوحدة ($)' : 'Unit Cost ($)'}
                </label>
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={costInput}
                  onChange={(e) => setCostInput(parseFloat(e.target.value) || 1)}
                  className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <label className="text-xs font-black text-slate-700 dark:text-slate-300 block mb-2">
                  {isArabic ? 'سعر البيع المقترح ($)' : 'Selling Price ($)'}
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  value={priceInput}
                  onChange={(e) => setPriceInput(parseFloat(e.target.value) || 2)}
                  className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold"
                />
              </div>
            </div>

            {/* Live Margin Calculation */}
            {(() => {
              const margin = Math.round(((Math.max(priceInput, costInput) - costInput) / Math.max(priceInput, 0.1)) * 100);
              const profitPerUnit = Math.round((priceInput - costInput) * 100) / 100;
              return (
                <div className="p-5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {isArabic ? 'هامش الربح الإجمالي:' : 'Gross Profit Margin:'}
                    </span>
                    <span className={`text-base font-black ${margin >= 40 && margin <= 75 ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {margin}% (${profitPerUnit} {isArabic ? 'ربح لكل قطعة' : 'profit/unit'})
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300 bg-gradient-to-r from-indigo-500 to-emerald-500"
                      style={{ width: `${Math.min(100, Math.max(5, margin))}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                    {margin >= 40 && margin <= 75
                      ? (isArabic ? '✅ هامش متوازن ومثالي يجذب المستثمرين!' : '✅ Optimal balanced margin for lasting growth!')
                      : (isArabic ? '⚠️ الهامش إما منخفض جداً أو مرتفع قد ينفر الزبائن. ينصح بنسبة 40% - 75%.' : '⚠️ Target 40% - 75% for best investor reception.')}
                  </p>
                </div>
              );
            })()}

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStage('solution')}
                className="py-3 px-5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black text-xs"
              >
                {isArabic ? 'رجوع' : 'Back'}
              </button>
              <button
                onClick={handleNextFromPricing}
                className="py-3 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center gap-2"
              >
                <span>{isArabic ? 'متابعة إلى الهوية والتسويق' : 'Continue to Branding'}</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ── STAGE 4: BRANDING & MARKETING ── */}
        {currentStage === 'branding' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white mb-1">
                {isArabic ? 'الخطوة الرابعة: بناء الهوية الإعلانية مع ريما' : 'Step 4: Branding with Reema'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isArabic ? 'اختر اسماً رناناً وشعاراً تسويقياً جذاباً يحفظه الجمهور.' : 'Create an unforgettable brand name and slogan.'}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-black text-slate-700 dark:text-slate-300 block mb-2">
                  {isArabic ? 'اسم الشركة / المشروع' : 'Company / Brand Name'}
                </label>
                <input
                  type="text"
                  value={companyNameInput}
                  onChange={(e) => setCompanyNameInput(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-black text-slate-700 dark:text-slate-300 block mb-2">
                  {isArabic ? 'الشعار التسويقي (Slogan)' : 'Brand Slogan'}
                </label>
                <input
                  type="text"
                  value={sloganInput}
                  onChange={(e) => setSloganInput(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStage('pricing')}
                className="py-3 px-5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black text-xs"
              >
                {isArabic ? 'رجوع' : 'Back'}
              </button>
              <button
                onClick={handleNextFromBranding}
                className="py-3 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center gap-2"
              >
                <span>{isArabic ? 'متابعة إلى سلاسل التوريد والأمان' : 'Continue to Operations'}</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ── STAGE 5: OPERATIONS & ETHICS ── */}
        {currentStage === 'operations' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white mb-1">
                {isArabic ? 'الخطوة الخامسة: سلاسل الإمداد والأمان مع فيلو' : 'Step 5: Ethical Operations with Filo'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isArabic ? 'فيلو ينصحك: اختيار الموردين الأخلاقيين يحمي سمعتك من الخسائر الكارثية.' : 'Ethical sourcing shields your brand from reputational harm.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => {
                  SoundService.playClick();
                  setOperations('local_ethical');
                }}
                className={`cursor-pointer p-5 rounded-2xl border-2 transition-all ${
                  venture.supplierType === 'local_ethical'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 shadow-md scale-[1.02]'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-emerald-300'
                }`}
              >
                <div className="text-2xl mb-2">🌿 🤝</div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white mb-1">
                  {isArabic ? 'مورد محلي معتمد وأخلاقي' : 'Certified Local Ethical Supplier'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isArabic ? 'جودة مضمونة، أمان للبيئة، وحماية كاملة ضد شكاوى العملاء (+15 نقطة تميز في The Tank).' : 'Guaranteed quality, eco-safe, and shields brand trust.'}
                </p>
              </div>

              <div
                onClick={() => {
                  SoundService.playClick();
                  setOperations('cheap_unverified');
                }}
                className={`cursor-pointer p-5 rounded-2xl border-2 transition-all ${
                  venture.supplierType === 'cheap_unverified'
                    ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 shadow-md scale-[1.02]'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-rose-300'
                }`}
              >
                <div className="text-2xl mb-2">⚠️ 📉</div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white mb-1">
                  {isArabic ? 'مورد رخيص غير موثوق' : 'Cheap Unverified Source'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isArabic ? 'يوفر بعض المال حالياً لكنه يعرضك لمخاطر تلف البضائع ورفض المستثمر فيلو للمشروع.' : 'Risky quality; causes Philo the Elephant to pass on your pitch.'}
                </p>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStage('branding')}
                className="py-3 px-5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black text-xs"
              >
                {isArabic ? 'رجوع' : 'Back'}
              </button>
              <button
                onClick={() => {
                  SoundService.playClick();
                  setStage('strategy');
                }}
                className="py-3 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center gap-2"
              >
                <span>{isArabic ? 'متابعة إلى الخطة التنافسية' : 'Continue to Strategy'}</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ── STAGE 6: STRATEGY & MOAT ── */}
        {currentStage === 'strategy' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white mb-1">
                {isArabic ? 'الخطوة السادسة: بناء الحصن التنافسي ضد ريكس مع أولي' : 'Step 6: Build Your Moat with Ollie'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isArabic ? 'ما هي ميزتك الفريدة التي تجعل الزبائن يفضلونك على المنافسين؟' : 'What is your competitive moat against rivals?'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'customer_trust', labelEn: 'Unbeatable Customer Trust', labelAr: 'ثقة العملاء والخدمة الممتازة', icon: '❤️' },
                { id: 'innovation', labelEn: 'Continuous Lab Innovation', labelAr: 'الابتكار والتجديد المستمر', icon: '⚡' },
                { id: 'low_cost', labelEn: 'Smart Efficient Pricing', labelAr: 'الكفاءة والتسعير الذكي', icon: '🎯' }
              ].map(item => (
                <div
                  key={item.id}
                  onClick={() => {
                    SoundService.playClick();
                    setStrategy(item.id as any);
                  }}
                  className={`cursor-pointer p-4 rounded-2xl border-2 transition-all text-center ${
                    venture.competitiveMoat === item.id
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 shadow-md scale-[1.02]'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <div className="text-xs font-black text-slate-900 dark:text-white">
                    {isArabic ? item.labelAr : item.labelEn}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStage('operations')}
                className="py-3 px-5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black text-xs"
              >
                {isArabic ? 'رجوع' : 'Back'}
              </button>
              <button
                onClick={() => {
                  SoundService.playClick();
                  setStage('pitch');
                }}
                className="py-3 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center gap-2"
              >
                <span>{isArabic ? 'جاهز للعرض أمام المستثمرين في The Tank' : 'Enter The Tank Pitch'}</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ── STAGE 7: THE TANK PITCH & RESULTS ── */}
        {(currentStage === 'pitch' || currentStage === 'graduated') && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white mb-1">
                {isArabic ? 'عرض مشروع التخرج أمام لجنة المستثمرين (The Tank)' : 'The Tank Pitch: Investor Room'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isArabic ? 'المستثمرون الثلاثة أولي، ريما، وفيلو يستمعون لعرض مشروعك لتقييمه وتمويله!' : 'Ollie, Reema, and Filo evaluate your capstone venture!'}
              </p>
            </div>

            {/* Pitch Button if not pitched yet */}
            {currentStage === 'pitch' && (
              <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-50 to-amber-50 dark:from-indigo-950/30 dark:to-amber-950/30 text-center space-y-4 border-2 border-indigo-200 dark:border-indigo-800">
                <div className="text-5xl animate-bounce">🎙️</div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {isArabic ? 'مشروعك جاهز بالكامل للعرض!' : 'Your Pitch Deck is Ready!'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                  {isArabic
                    ? `ستعرض شركة "${venture.companyName}" بشعارها "${venture.sloganAr || venture.sloganEn}" وهامش ربح ${venture.marginPercent}%.`
                    : `Presenting "${venture.companyName}" with a ${venture.marginPercent}% margin.`}
                </p>
                <button
                  onClick={handleStartPitch}
                  className="py-4 px-8 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm shadow-xl shadow-orange-500/30 transition-transform active:scale-95"
                >
                  🚀 {isArabic ? 'ابدأ العرض واحصل على التقييم والتمويل' : 'Deliver Pitch & Graduate!'}
                </button>
              </div>
            )}

            {/* Result Showcase */}
            {currentStage === 'graduated' && (
              <div className="space-y-5">
                {/* Score & Valuation Banner */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                    <div className="text-[10px] text-amber-700 dark:text-amber-400 font-bold uppercase">
                      {isArabic ? 'تقييم الشركة' : 'Valuation'}
                    </div>
                    <div className="text-lg sm:text-2xl font-black text-amber-600 dark:text-amber-400">
                      ${venture.tankValuation.toLocaleString()}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                    <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold uppercase">
                      {isArabic ? 'التمويل الممنوح' : 'Funding'}
                    </div>
                    <div className="text-lg sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
                      +{venture.fundingRaised.toLocaleString()} PP
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
                    <div className="text-[10px] text-purple-700 dark:text-purple-400 font-bold uppercase">
                      {isArabic ? 'المرتبة الريادية' : 'Rank'}
                    </div>
                    <div className="text-lg sm:text-2xl font-black text-purple-600 dark:text-purple-400">
                      ⭐ {venture.grade}
                    </div>
                  </div>
                </div>

                {/* Investor Comments */}
                <div className="space-y-3">
                  <h3 className="text-xs uppercase font-black text-slate-400 tracking-wider">
                    {isArabic ? 'آراء لجنة المستثمرين:' : 'Investor Panel Feedback:'}
                  </h3>
                  {venture.investorOffers.map((inv, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-3"
                    >
                      <div className="text-3xl flex-shrink-0">{inv.avatar}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{inv.investorName}</span>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                            inv.verdict === 'invest' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                          }`}>
                            {inv.verdict === 'invest' ? (isArabic ? '✓ استثمار مؤكد' : '✓ Funded') : (isArabic ? '✗ رفض العرض' : '✗ Pass')}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed m-0">
                          "{isArabic ? inv.commentAr : inv.commentEn}"
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowCertificate(true)}
                    className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Award size={16} />
                    <span>{isArabic ? 'عرض وتحميل الشهادة الكبرى' : 'Open Graduation Diploma'}</span>
                  </button>

                  <button
                    onClick={() => {
                      SoundService.playClick();
                      resetCapstone();
                    }}
                    className="py-3.5 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-white text-xs font-bold"
                  >
                    {isArabic ? 'بدء مشروع جديد' : 'New Venture'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Diploma Modal */}
      <CapstoneCertificateModal
        certificate={certificate}
        isOpen={showCertificate}
        onClose={() => setShowCertificate(false)}
      />
    </div>
  );
};

export default CapstoneExperience;
