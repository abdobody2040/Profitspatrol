import React from 'react';
import { useTranslation } from 'react-i18next';

export interface DistrictWorldBackgroundProps {
  districtId: string;
  districtNumber: number;
  moduleId: string;
  primaryColor: string;
  secondaryColor: string;
  bgTint: string;
  pattern?: string;
  isNight?: boolean;
  isArabic?: boolean;
}

export const DistrictWorldBackground: React.FC<DistrictWorldBackgroundProps> = ({
  districtId,
  districtNumber,
  moduleId,
  primaryColor,
  secondaryColor,
  bgTint,
  isNight = false,
  isArabic: isArabicProp,
}) => {
  const { i18n } = useTranslation();
  const isArabic = isArabicProp !== undefined ? isArabicProp : i18n.language.startsWith('ar');
  const normDistrict = districtId.toLowerCase();

  // Color schemes for rich cartoon terrain
  const getThemePalette = () => {
    switch (normDistrict) {
      case 'money':
        return {
          skyDayTop: '#E0F2FE',
          skyDayBottom: '#FEF3C7',
          skyNightTop: '#0F172A',
          skyNightBottom: '#1E293B',
          hillFar: isNight ? '#1E293B' : '#BBF7D0',
          hillMid: isNight ? '#064E3B' : '#4ADE80',
          hillNear: isNight ? '#065F46' : '#22C55E',
          groundBottom: isNight ? '#042F24' : '#15803D',
          river: isNight ? '#1E3A8A' : '#38BDF8',
          accent: '#F59E0B',
        };
      case 'builders':
        return {
          skyDayTop: '#FEF08A',
          skyDayBottom: '#FFEDD5',
          skyNightTop: '#18181B',
          skyNightBottom: '#27272A',
          hillFar: isNight ? '#27272A' : '#FED7AA',
          hillMid: isNight ? '#7C2D12' : '#FB923C',
          hillNear: isNight ? '#9A3412' : '#F97316',
          groundBottom: isNight ? '#451A03' : '#C2410C',
          river: isNight ? '#1E3A8A' : '#60A5FA',
          accent: '#EA580C',
        };
      case 'risk':
        return {
          skyDayTop: '#E0E7FF',
          skyDayBottom: '#F3E8FF',
          skyNightTop: '#1E1B4B',
          skyNightBottom: '#312E81',
          hillFar: isNight ? '#312E81' : '#DDD6FE',
          hillMid: isNight ? '#4C1D95' : '#A78BFA',
          hillNear: isNight ? '#5B21B6' : '#8B5CF6',
          groundBottom: isNight ? '#2E1065' : '#6D28D9',
          river: isNight ? '#1E3A8A' : '#818CF8',
          accent: '#7C3AED',
        };
      case 'operations':
        return {
          skyDayTop: '#CCFBF1',
          skyDayBottom: '#E0F2FE',
          skyNightTop: '#022C22',
          skyNightBottom: '#134E4A',
          hillFar: isNight ? '#134E4A' : '#99F6E4',
          hillMid: isNight ? '#115E59' : '#2DD4BF',
          hillNear: isNight ? '#134E4A' : '#14B8A6',
          groundBottom: isNight ? '#042F2C' : '#0F766E',
          river: isNight ? '#0369A1' : '#38BDF8',
          accent: '#0D9488',
        };
      case 'innovation':
        return {
          skyDayTop: '#E0F2FE',
          skyDayBottom: '#EDE9FE',
          skyNightTop: '#09090B',
          skyNightBottom: '#18181B',
          hillFar: isNight ? '#27272A' : '#BAE6FD',
          hillMid: isNight ? '#1E293B' : '#38BDF8',
          hillNear: isNight ? '#0F172A' : '#0284C7',
          groundBottom: isNight ? '#030712' : '#0369A1',
          river: isNight ? '#312E81' : '#818CF8',
          accent: '#06B6D4',
        };
      default:
        return {
          skyDayTop: '#E0F2FE',
          skyDayBottom: '#FEF3C7',
          skyNightTop: '#0F172A',
          skyNightBottom: '#1E293B',
          hillFar: isNight ? '#1E293B' : '#BBF7D0',
          hillMid: isNight ? '#064E3B' : '#4ADE80',
          hillNear: isNight ? '#065F46' : '#22C55E',
          groundBottom: isNight ? '#042F24' : '#15803D',
          river: isNight ? '#1E3A8A' : '#38BDF8',
          accent: primaryColor || '#F59E0B',
        };
    }
  };

  const p = getThemePalette();

  return (
    <div
      aria-hidden="true"
      className="absolute inset-x-0 top-0 w-full min-h-[3600px] overflow-hidden pointer-events-none select-none z-0 transition-colors duration-1000"
      style={{
        background: isNight
          ? `linear-gradient(180deg, ${p.skyNightTop} 0px, ${p.skyNightBottom} 320px, ${p.hillNear} 560px, ${p.groundBottom} 100%)`
          : `linear-gradient(180deg, ${p.skyDayTop} 0px, ${p.skyDayBottom} 280px, ${p.hillFar} 420px, ${p.hillNear} 600px, ${p.groundBottom} 100%)`,
      }}
    >
      {/* ── 1. Sun or Glowing Moon in the Sky ── */}
      {!isNight ? (
        <div className="absolute top-10 left-12 w-28 h-28 rounded-full bg-gradient-to-tr from-amber-300 to-yellow-100 opacity-90 blur-[1px] shadow-[0_0_60px_rgba(251,191,36,0.6)] animate-pulse" />
      ) : (
        <div className="absolute top-12 left-16 w-20 h-20 rounded-full bg-amber-100 opacity-85 shadow-[0_0_40px_rgba(254,243,199,0.7)]">
          <div className="absolute top-3 left-4 w-4 h-4 rounded-full bg-amber-200/50" />
          <div className="absolute top-8 left-9 w-6 h-6 rounded-full bg-amber-200/40" />
        </div>
      )}

      {/* ── 2. Cartoon Clouds (Day) or Twinkling Stars (Night) ── */}
      {!isNight ? (
        <div className="absolute top-8 inset-x-0 h-40 opacity-70 pointer-events-none">
          {/* Cloud 1 */}
          <svg
            className="absolute top-4 left-8 w-48 h-20 text-white/90 drop-shadow-sm"
            viewBox="0 0 100 50"
            fill="currentColor"
          >
            <path d="M20,38 Q10,38 10,26 Q10,14 26,14 Q32,4 48,10 Q62,4 72,18 Q86,15 86,28 Q90,38 74,38 Z" />
          </svg>
          {/* Cloud 2 */}
          <svg
            className="absolute top-12 right-12 w-56 h-24 text-white/85 drop-shadow-sm"
            viewBox="0 0 100 50"
            fill="currentColor"
          >
            <path d="M20,38 Q10,38 10,26 Q10,14 26,14 Q32,4 48,10 Q62,4 72,18 Q86,15 86,28 Q90,38 74,38 Z" />
          </svg>
          {/* Cloud 3 */}
          <svg
            className="hidden md:block absolute top-2 left-1/2 -translate-x-1/2 w-36 h-16 text-white/60 drop-shadow-xs"
            viewBox="0 0 100 50"
            fill="currentColor"
          >
            <path d="M20,38 Q10,38 10,26 Q10,14 26,14 Q32,4 48,10 Q62,4 72,18 Q86,15 86,28 Q90,38 74,38 Z" />
          </svg>
        </div>
      ) : (
        <div className="absolute top-6 inset-x-0 h-48 opacity-75 pointer-events-none">
          <div className="absolute top-8 left-16 w-2 h-2 rounded-full bg-amber-200 animate-pulse" />
          <div className="absolute top-20 left-48 w-1.5 h-1.5 rounded-full bg-sky-200" />
          <div className="absolute top-10 right-32 w-2 h-2 rounded-full bg-amber-100 animate-pulse" />
          <div className="absolute top-24 right-64 w-1.5 h-1.5 rounded-full bg-indigo-200" />
          <div className="absolute top-6 left-1/3 w-1 h-1 rounded-full bg-white opacity-90" />
          <div className="absolute top-28 right-1/4 w-1.5 h-1.5 rounded-full bg-amber-300" />
        </div>
      )}

      {/* ── 3. Full-Bleed Continuous Layered Cartoon Hills SVG ── */}
      <svg
        className="absolute top-20 inset-x-0 w-full h-[3600px] pointer-events-none"
        preserveAspectRatio="none"
        viewBox="0 0 1200 3600"
        fill="none"
      >
        <defs>
          <linearGradient id="far-hills-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={p.hillFar} stopOpacity="0.85" />
            <stop offset="100%" stopColor={p.hillFar} stopOpacity="0.6" />
          </linearGradient>

          <linearGradient id="mid-hills-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={p.hillMid} stopOpacity="0.95" />
            <stop offset="100%" stopColor={p.hillMid} stopOpacity="0.8" />
          </linearGradient>

          <linearGradient id="near-hills-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={p.hillNear} stopOpacity="1" />
            <stop offset="100%" stopColor={p.groundBottom} stopOpacity="1" />
          </linearGradient>

          <linearGradient id="river-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={p.river} stopOpacity="0.9" />
            <stop offset="100%" stopColor="#67E8F9" stopOpacity="0.75" />
          </linearGradient>
        </defs>

        {/* Tier 1: Far Rolling Mountain Ridges */}
        <path
          d="M 0 240 Q 300 120 600 230 T 1200 160 L 1200 3600 L 0 3600 Z"
          fill="url(#far-hills-grad)"
        />

        {/* Tier 2: Mid Hills with gentle slopes */}
        <path
          d="M 0 380 Q 250 260 520 370 T 1200 320 L 1200 3600 L 0 3600 Z"
          fill="url(#mid-hills-grad)"
        />

        {/* Tier 3: Winding River Ribbon */}
        <path
          d="M 1200 340 C 900 420 850 620 800 780 C 750 940 680 1100 480 1250 C 280 1400 150 1580 0 1700 L 0 3600 L 1200 3600 Z"
          fill="url(#river-grad)"
          opacity="0.85"
        />

        {/* River Ripple Highlights */}
        <path
          d="M 1100 370 Q 950 450 850 630"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeDasharray="16 24"
          strokeLinecap="round"
          opacity="0.6"
        />
        <path
          d="M 750 850 Q 650 1020 500 1200"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeDasharray="20 30"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* Tier 4: Foreground Lush Terraces & Slopes */}
        <path
          d="M 0 550 Q 220 480 420 570 T 900 620 L 1200 700 L 1200 3600 L 0 3600 Z"
          fill="url(#near-hills-grad)"
        />
      </svg>

      {/* ── 4. 3D COBBLESTONE WATERFALL BRIDGE (Spanning River Crossing) ── */}
      <div className="absolute top-[720px] right-[2%] md:right-[8%] lg:right-[14%] 2xl:right-[18%] w-48 md:w-60 h-48 pointer-events-none z-[2]">
        <img
          src="/assets/world/stone_bridge.png"
          alt=""
          className="w-full h-full object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.35)]"
          loading="lazy"
        />
      </div>

      {/* ── 5. LEFT FLANK: 3D TERRAIN PLATEAU & BUSINESS LANDMARKS (>= 1024px) ── */}
      <div className="hidden lg:block absolute left-2 xl:left-6 2xl:left-12 top-24 bottom-0 w-80 2xl:w-96 pointer-events-none transition-all duration-700 z-[1]">
        {/* Floating 3D Grass Island with Stepped Cliffs on Top Flank */}
        <div className="absolute top-4 left-2 w-72 2xl:w-80 h-72">
          <img
            src="/assets/world/terrain_island.png"
            alt=""
            className="w-full h-full object-contain drop-shadow-[0_20px_32px_rgba(0,0,0,0.4)]"
            loading="lazy"
          />
        </div>

        {/* District 1: Money / Savings District */}
        {normDistrict === 'money' && (
          <div className="relative w-full h-full">
            {/* 3D Bank HQ Landmark Building on the Upper Plateau */}
            <div className="absolute top-16 left-6 w-56 2xl:w-64 h-56 flex flex-col items-center">
              <img
                src="/assets/world/bank_hq.png"
                alt="Bank HQ"
                className="w-full h-full object-contain drop-shadow-[0_16px_28px_rgba(0,0,0,0.45)] hover:scale-105 transition-transform"
                loading="lazy"
              />
              <div className="px-3 py-1 rounded-full bg-white/95 dark:bg-slate-900/95 border border-amber-300 shadow-md -mt-4 text-center">
                <span className="text-[11px] font-black text-amber-950 dark:text-amber-300">
                  🏛️ {isArabic ? 'أكاديمية المال والبنك المركزي' : 'Central Bank & Money Academy'}
                </span>
              </div>
            </div>

            {/* Tree Clusters on Mid Slopes */}
            <div className="absolute top-[480px] left-10 flex items-end gap-2">
              <div className="w-14 h-20 flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600 border-2 border-emerald-300 shadow-md" />
                <div className="w-3 h-6 bg-amber-900 rounded-b" />
              </div>
              <div className="w-16 h-24 flex flex-col items-center -ml-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-b from-green-300 to-emerald-500 border-2 border-green-200 shadow-lg" />
                <div className="w-3.5 h-8 bg-amber-950 rounded-b" />
              </div>
            </div>

            {/* Golden Coin Shimmer on Terrain */}
            <div className="absolute top-[640px] left-12 w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 border-2 border-white shadow-xl flex items-center justify-center text-amber-950 font-black text-xl animate-bounce">
              💰
            </div>
          </div>
        )}

        {/* District 2: Builders / Startup District */}
        {normDistrict === 'builders' && (
          <div className="relative w-full h-full">
            {/* 3D Lemonade Stand & Maker Kiosk on Upper Plateau */}
            <div className="absolute top-16 left-6 w-52 2xl:w-60 h-52 flex flex-col items-center">
              <img
                src="/assets/world/lemonade_stand.png"
                alt="Lemonade Stand"
                className="w-full h-full object-contain drop-shadow-[0_16px_28px_rgba(0,0,0,0.45)] hover:scale-105 transition-transform"
                loading="lazy"
              />
              <div className="px-3 py-1 rounded-full bg-white/95 dark:bg-slate-900/95 border border-amber-400 shadow-md -mt-2 text-center">
                <span className="text-[11px] font-black text-amber-950 dark:text-amber-300">
                  🍋 {isArabic ? 'كشك رواد الأعمال الصغار' : 'Young Founders Kiosk'}
                </span>
              </div>
            </div>

            {/* Workshop Windmill / Waterwheel */}
            <div className="absolute top-[480px] left-12 flex flex-col items-center">
              <div className="text-4xl animate-spin" style={{ animationDuration: '10s' }}>⚙️</div>
              <div className="w-16 h-14 bg-amber-200 border-2 border-amber-600 rounded-lg mt-1 flex items-center justify-center text-xl shadow-md">
                🔨
              </div>
            </div>
          </div>
        )}

        {/* District 3: Risk & Investing */}
        {normDistrict === 'risk' && (
          <div className="relative w-full h-full">
            <div className="absolute top-24 left-6 p-3.5 rounded-3xl bg-white/95 dark:bg-slate-900/95 border-2 border-purple-400 shadow-xl flex items-center gap-3">
              <span className="text-4xl">🐂</span>
              <div>
                <div className="text-xs font-black text-purple-950 dark:text-purple-200">
                  {isArabic ? 'قمة الثور الذهبي' : 'Golden Bull Peak'}
                </div>
                <div className="text-[10px] font-bold text-purple-600">
                  {isArabic ? 'قمة سوق الصعود' : 'Bull Market Summit'}
                </div>
              </div>
            </div>
            <div className="absolute top-[440px] left-14 flex gap-2">
              <div className="text-3xl animate-pulse">💎</div>
              <div className="text-3xl animate-bounce">📈</div>
            </div>
          </div>
        )}

        {/* District 4: Operations & Trade */}
        {normDistrict === 'operations' && (
          <div className="relative w-full h-full">
            <div className="absolute top-24 left-6 p-3.5 rounded-3xl bg-white/95 dark:bg-slate-900/95 border-2 border-teal-400 shadow-xl flex items-center gap-3">
              <span className="text-4xl">🚢</span>
              <div>
                <div className="text-xs font-black text-teal-950 dark:text-teal-200">
                  {isArabic ? 'ميناء التجارة العالمي' : 'Global Trade Dock'}
                </div>
                <div className="text-[10px] font-bold text-teal-600">
                  {isArabic ? 'رصيف الملاحة والشحن' : 'Global Trade Harbor'}
                </div>
              </div>
            </div>
            <div className="absolute top-[440px] left-12 text-4xl animate-pulse">⚓</div>
          </div>
        )}

        {/* District 5: Innovation */}
        {normDistrict === 'innovation' && (
          <div className="relative w-full h-full">
            <div className="absolute top-24 left-6 p-3.5 rounded-3xl bg-white/95 dark:bg-slate-900/95 border-2 border-cyan-400 shadow-xl flex items-center gap-3">
              <span className="text-4xl">⚡</span>
              <div>
                <div className="text-xs font-black text-cyan-950 dark:text-cyan-200">
                  {isArabic ? 'مختبرات الذكاء الاصطناعي' : 'AI & Tech Labs'}
                </div>
                <div className="text-[10px] font-bold text-cyan-600">
                  {isArabic ? 'مختبرات المستقبل والذكاء' : 'AI & Advanced Tech'}
                </div>
              </div>
            </div>
            <div className="absolute top-[440px] left-12 text-3xl animate-bounce">🚀</div>
          </div>
        )}
      </div>

      {/* ── 6. RIGHT FLANK: 3D TERRAIN PLATEAU & DISTRICT LANDMARKS (>= 1024px) ── */}
      <div className="hidden lg:block absolute right-2 xl:right-6 2xl:right-12 top-24 bottom-0 w-80 2xl:w-96 pointer-events-none transition-all duration-700 z-[1]">
        {/* Floating 3D Grass Island with Stepped Cliffs on Right Upper Flank */}
        <div className="absolute top-16 right-2 w-64 2xl:w-72 h-64 transform scale-x-[-1]">
          <img
            src="/assets/world/terrain_island.png"
            alt=""
            className="w-full h-full object-contain drop-shadow-[0_20px_32px_rgba(0,0,0,0.4)]"
            loading="lazy"
          />
        </div>

        {/* District 1: Money / Savings District */}
        {normDistrict === 'money' && (
          <div className="relative w-full h-full">
            {/* Golden Vault Landmark Card */}
            <div className="absolute top-24 right-6 p-3 rounded-3xl bg-white/95 dark:bg-slate-800/95 border-2 border-amber-400 shadow-xl flex items-center gap-3">
              <span className="text-3xl">🏦</span>
              <div>
                <div className="text-xs font-black text-slate-800 dark:text-white">
                  {isArabic ? 'البنك المركزي للأبطال' : 'Central Bank of Heroes'}
                </div>
                <div className="text-[10px] font-bold text-amber-600">
                  {isArabic ? 'معلم البنك المركزي' : 'Central Bank Landmark'}
                </div>
              </div>
            </div>

            {/* Trees & Scenic Grove on Right Slope */}
            <div className="absolute top-[420px] right-8 flex items-end gap-2">
              <div className="w-14 h-18 flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-gradient-to-b from-emerald-300 to-emerald-500 border-2 border-white shadow-md" />
                <div className="w-3 h-4 bg-amber-900 rounded-b" />
              </div>
              <div className="w-11 h-14 flex flex-col items-center -ml-2">
                <div className="w-11 h-11 rounded-full bg-gradient-to-b from-green-400 to-green-600 border border-white shadow-sm" />
                <div className="w-2.5 h-3 bg-amber-800 rounded-b" />
              </div>
            </div>

            {/* Golden Safe Vault Arch */}
            <div className="absolute top-[600px] right-8 w-36 h-28 rounded-2xl bg-gradient-to-b from-emerald-100 to-teal-50 border-2 border-emerald-400 shadow-lg p-2 flex flex-col items-center justify-center">
              <span className="text-3xl">🔐</span>
              <span className="text-[10px] font-black text-emerald-900 mt-1">
                {isArabic ? 'خزينة الأمانات الذهبية' : 'Golden Safe Vault'}
              </span>
            </div>
          </div>
        )}

        {/* District 2: Builders / Startup District */}
        {normDistrict === 'builders' && (
          <div className="relative w-full h-full">
            <div className="absolute top-24 right-8 p-3 rounded-3xl bg-white/95 dark:bg-slate-800/95 border-2 border-orange-400 shadow-xl flex items-center gap-3">
              <span className="text-3xl">🚀</span>
              <div>
                <div className="text-xs font-black text-slate-800 dark:text-white">
                  {isArabic ? 'منصة إطلاق المشاريع' : 'Startup Launchpad'}
                </div>
                <div className="text-[10px] font-bold text-orange-600">
                  {isArabic ? 'قاعدة ريادة الأعمال' : 'Startup Launchpad'}
                </div>
              </div>
            </div>
            <div className="absolute top-[480px] right-14 text-4xl animate-bounce">🏗️</div>
          </div>
        )}

        {/* District 3: Risk & Investing */}
        {normDistrict === 'risk' && (
          <div className="relative w-full h-full">
            <div className="absolute top-24 right-8 p-3 rounded-3xl bg-white/95 dark:bg-slate-800/95 border-2 border-purple-400 shadow-xl flex items-center gap-3">
              <span className="text-3xl">🏛️</span>
              <div>
                <div className="text-xs font-black text-slate-800 dark:text-white">
                  {isArabic ? 'برج الاستثمار الذكي' : 'Investment Tower'}
                </div>
                <div className="text-[10px] font-bold text-purple-600">
                  {isArabic ? 'صرح الاستثمار والأمان' : 'Smart Investment Tower'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* District 4: Operations */}
        {normDistrict === 'operations' && (
          <div className="relative w-full h-full">
            <div className="absolute top-24 right-8 p-3 rounded-3xl bg-white/95 dark:bg-slate-800/95 border-2 border-teal-400 shadow-xl flex items-center gap-3">
              <span className="text-3xl">🗼</span>
              <div>
                <div className="text-xs font-black text-slate-800 dark:text-white">
                  {isArabic ? 'منارة التجارة البحرية' : 'Harbor Lighthouse'}
                </div>
                <div className="text-[10px] font-bold text-teal-600">
                  {isArabic ? 'منارة الملاحة البحرية' : 'Maritime Trade Lighthouse'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* District 5: Innovation */}
        {normDistrict === 'innovation' && (
          <div className="relative w-full h-full">
            <div className="absolute top-24 right-8 p-3 rounded-3xl bg-white/95 dark:bg-slate-800/95 border-2 border-cyan-400 shadow-xl flex items-center gap-3">
              <span className="text-3xl">🛰️</span>
              <div>
                <div className="text-xs font-black text-slate-800 dark:text-white">
                  {isArabic ? 'محطة الفضاء والاتصالات' : 'Satellite Comm Station'}
                </div>
                <div className="text-[10px] font-bold text-cyan-600">
                  {isArabic ? 'محطة الأقمار والاتصالات' : 'Space & Comm Station'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── 7. Bottom Vignette Gradient to gently blend into next zone ── */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
    </div>
  );
};
