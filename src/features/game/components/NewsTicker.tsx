import { useEffect, useState, useMemo } from "react";
import { TrendingUp, TrendingDown, Sun, Globe, Newspaper } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useSocialStore } from "../../../store/socialStore";
import { NewsEvent } from "../../../types";

// Multilingual headline dictionary for dynamic simulation events
const NEWS_TRANSLATION_MAP: Array<{
    keywords: string[];
    ar: string;
    en: string;
    de: string;
    es: string;
    fr: string;
}> = [
    {
        keywords: ['ليمون', 'lemonade', 'حارة', 'heatwave'],
        ar: '🔥 موجة حارة بالمدينة! الطلب على عصير الليمون والآيس كريم يرتفع 1.5x!',
        en: '🔥 Heatwave in Patrol City! Lemonade & Ice cream demand skyrockets 1.5x!',
        de: '🔥 Hitzewelle in Patrol City! Nachfrage nach Limonade & Eis schießt um das 1,5-fache hoch!',
        es: '🔥 ¡Ola de calor en Patrol City! ¡La demanda de limonada y helado se dispara 1.5x!',
        fr: '🔥 Vague de chaleur à Patrol City ! La demande de limonade et glace explose de 1.5x !'
    },
    {
        keywords: ['أسهم', 'تكنولوجيا', 'stock', 'market dip', 'مستثمرين'],
        ar: '📉 فرصة شراء! انخفاض مؤقت في أسهم التكنولوجيا يتيح للمستثمرين الشراء بسعر مخفض!',
        en: '📉 Market Dip! Tech stocks down temporarily — great buying opportunity for tycoons.',
        de: '📉 Markteinbruch! Tech-Aktien vorübergehend gefallen – großartige Kaufgelegenheit für Tycoons.',
        es: '📉 ¡Caída del mercado! Acciones tecnológicas a la baja temporalmente: gran oportunidad de compra.',
        fr: '📉 Baisse du marché ! Les actions tech sont temporairement en baisse : excellente opportunité d\'achat.'
    },
    {
        keywords: ['مهرجان', 'festival', 'زوار', 'patrol festival'],
        ar: '🎪 مهرجان الأعمال السنوي في باترول سيتي! زيادة زوار المتاجر بنسبة 1.3x!',
        en: '🎪 Annual Patrol Festival! Local shop customers & sales surge 1.3x!',
        de: '🎪 Jährliches Patrol-Festival! Kunden & Verkäufe in lokalen Geschäften steigen um das 1,3-fache!',
        es: '🎪 ¡Festival Anual de Patrol! ¡Los clientes y ventas de tiendas locales aumentan 1.3x!',
        fr: '🎪 Festival Annuel de Patrol ! Clients et ventes des magasins locaux en hausse de 1.3x !'
    },
    {
        keywords: ['طفرة', 'برمجة', 'ذكاء اصطناعي', 'tech sector boom', 'coding'],
        ar: '🚀 طفرة تقنية كبرى! ارتفاع أرباح شركات البرمجة والذكاء الاصطناعي 1.4x!',
        en: '🚀 Tech sector boom! Coding & AI corporation profits surge 1.4x!',
        de: '🚀 Tech-Sektor-Boom! Gewinne von Programmier- & KI-Unternehmen steigen um das 1,4-fache!',
        es: '🚀 ¡Auge del sector tecnológico! ¡Las ganancias de empresas de programación e IA aumentan 1.4x!',
        fr: '🚀 Boom du secteur technologique ! Les bénéfices des entreprises de code et IA bondissent de 1.4x !'
    }
];

export const resolveLocalizedHeadline = (item: NewsEvent | undefined, langOrIsArabic: string | boolean): string => {
    const lang = typeof langOrIsArabic === 'boolean' ? (langOrIsArabic ? 'ar' : 'en') : (langOrIsArabic || 'en');
    const isArabic = lang.startsWith('ar');
    const isDe = lang.startsWith('de');
    const isEs = lang.startsWith('es');
    const isFr = lang.startsWith('fr');

    if (!item) {
        if (isArabic) return '🔥 أخبار السوق: نشاط اقتصادي واعد في باترول سيتي!';
        if (isDe) return '🔥 Marktbericht: Wachsende Wirtschaftsaktivität in Patrol City!';
        if (isEs) return '🔥 Alerta de Mercado: Crecimiento económico en Patrol City!';
        if (isFr) return '🔥 Alerte Marché : Activité économique florissante à Patrol City !';
        return '🔥 Market Alert: Economic growth accelerating in Patrol City!';
    }

    // 1. If explicit localized properties exist, use them
    if (isArabic && item.headlineAr) return item.headlineAr;
    if (isDe && (item as any).headlineDe) return (item as any).headlineDe;
    if (isEs && (item as any).headlineEs) return (item as any).headlineEs;
    if (isFr && (item as any).headlineFr) return (item as any).headlineFr;
    if (!isArabic && !isDe && !isEs && !isFr && item.headlineEn) return item.headlineEn;

    const raw = item.headline || '';
    const hasArabicChars = /[\u0600-\u06FF]/.test(raw);

    // 2. If Arabic and text is Arabic, or English and text is ASCII
    if (isArabic && hasArabicChars) return raw;
    if (!isArabic && !isDe && !isEs && !isFr && !hasArabicChars) return raw;

    // 3. Needs translation: match against dictionary
    const lowerRaw = raw.toLowerCase();
    for (const entry of NEWS_TRANSLATION_MAP) {
        if (entry.keywords.some((k) => lowerRaw.includes(k.toLowerCase()) || raw.includes(k))) {
            if (isArabic) return entry.ar;
            if (isDe) return entry.de;
            if (isEs) return entry.es;
            if (isFr) return entry.fr;
            return entry.en;
        }
    }

    // 4. Fallback if no specific keyword matched
    if (isArabic) return '🔥 خبر عاجل: حركة تجارية نشطة تشهدها أسواق باترول سيتي!';
    if (isDe) return '🔥 Eilmeldung: Lebhafte Handelsaktivität auf den Märkten von Patrol City!';
    if (isEs) return '🔥 Noticia de Última Hora: ¡Gran actividad comercial en Patrol City!';
    if (isFr) return '🔥 Flash Info : Activité commerciale florissante sur les marchés de Patrol City !';
    return '🔥 Breaking Alert: Surging commercial activity across Patrol City markets!';
};

const NewsTicker = () => {
    const { t, i18n } = useTranslation();
    const currentLang = i18n.language || 'en';
    const isArabic = currentLang.startsWith('ar');
    const { news, addNewsEvent } = useSocialStore();
    const [currentIndex, setCurrentIndex] = useState(0);

    // Initial default events if news is empty or first run
    useEffect(() => {
        if (!news.length) {
            addNewsEvent({
                id: 'init_market_1',
                headline: isArabic
                    ? '🔥 موجة حارة بالمدينة! الطلب على عصير الليمون والآيس كريم يرتفع 1.5x!'
                    : '🔥 Heatwave in Patrol City! Lemonade & Ice cream demand skyrockets 1.5x!',
                headlineAr: '🔥 موجة حارة بالمدينة! الطلب على عصير الليمون والآيس كريم يرتفع 1.5x!',
                headlineEn: '🔥 Heatwave in Patrol City! Lemonade & Ice cream demand skyrockets 1.5x!',
                type: 'WEATHER',
                effect: { target: 'LEMONADE', multiplier: 1.5, durationMinutes: 10 } as any,
                createdAt: new Date().toISOString()
            });
        }
    }, [news.length, isArabic, addNewsEvent]);

    // Simulation of dynamic market events
    useEffect(() => {
        const timer = setInterval(() => {
            if (Math.random() > 0.7) return; // Distinct events

            const events = [
                {
                    headlineAr: '🔥 موجة حارة بالمدينة! الطلب على عصير الليمون والآيس كريم يرتفع 1.5x!',
                    headlineEn: '🔥 Heatwave in Patrol City! Lemonade & Ice cream demand skyrockets 1.5x!',
                    type: 'WEATHER',
                    effect: { target: 'LEMONADE', multiplier: 1.5, durationMinutes: 5 }
                },
                {
                    headlineAr: '📉 فرصة شراء! انخفاض مؤقت في أسهم التكنولوجيا يتيح للمستثمرين الشراء بسعر مخفض!',
                    headlineEn: '📉 Market Dip! Tech stocks down temporarily — great buying opportunity for tycoons.',
                    type: 'MARKET',
                    effect: { target: 'TECH_STOCKS', multiplier: 0.8, durationMinutes: 5 }
                },
                {
                    headlineAr: '🎪 مهرجان الأعمال السنوي في باترول سيتي! زيادة زوار المتاجر بنسبة 1.3x!',
                    headlineEn: '🎪 Annual Patrol Festival! Local shop customers & sales surge 1.3x!',
                    type: 'LOCAL',
                    effect: { target: 'ALL_BUSINESSES', multiplier: 1.3, durationMinutes: 5 }
                },
                {
                    headlineAr: '🚀 طفرة تقنية كبرى! ارتفاع أرباح شركات البرمجة والذكاء الاصطناعي 1.4x!',
                    headlineEn: '🚀 Tech sector boom! Coding & AI corporation profits surge 1.4x!',
                    type: 'GLOBAL',
                    effect: { target: 'CODING_AI', multiplier: 1.4, durationMinutes: 5 }
                }
            ];

            const selected = events[Math.floor(Math.random() * events.length)];
            addNewsEvent({
                id: `dynamic_${Date.now()}`,
                headline: isArabic ? selected.headlineAr : selected.headlineEn,
                headlineAr: selected.headlineAr,
                headlineEn: selected.headlineEn,
                type: selected.type as any,
                effect: selected.effect as any,
                createdAt: new Date().toISOString()
            });
        }, 45000);

        return () => clearInterval(timer);
    }, [isArabic, addNewsEvent]);

    // Rotate ticker items
    useEffect(() => {
        if (!news.length) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % news.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [news.length]);

    if (!news.length) return null;

    const currentNews = news[currentIndex] || news[0];
    const displayHeadline = resolveLocalizedHeadline(currentNews, currentLang);

    const handleOpenBizPulse = () => {
        window.dispatchEvent(new CustomEvent('modal:open', { detail: 'bizPulse' }));
    };

    return (
        <div
            onClick={handleOpenBizPulse}
            role="button"
            tabIndex={0}
            title={t('bizpulse.tooltip', isArabic ? 'اضغط لقراءة الأخبار الاقتصادية الكاملة (BizPulse)' : 'Click to read full BizPulse news articles')}
            className="w-full bg-amber-500/10 dark:bg-amber-950/30 text-slate-800 dark:text-slate-100 overflow-hidden h-9 sm:h-10 flex items-center border-y border-amber-300/40 dark:border-amber-700/40 backdrop-blur-sm z-30 transition-all cursor-pointer hover:bg-amber-500/15 select-none"
        >
            <div className="flex items-center gap-3 px-3 sm:px-4 max-w-4xl mx-auto w-full">
                {/* Live Breaking News Tag with pulse dot */}
                <div className="flex items-center gap-1.5 font-black text-[11px] sm:text-xs uppercase tracking-wider text-rose-600 dark:text-rose-400 shrink-0">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                    </span>
                    <Newspaper size={14} className="text-rose-600 dark:text-rose-400" />
                    <span>{t('dashboard.breaking_news', isArabic ? 'خبر عاجل' : 'Breaking News')}</span>
                </div>

                <div className="h-4 w-px bg-amber-300 dark:bg-amber-700/60 shrink-0"></div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentNews.id || currentIndex}
                        initial={{ y: 16, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -16, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="flex items-center gap-2 text-xs sm:text-sm font-bold truncate flex-1 text-slate-700 dark:text-slate-200"
                    >
                        {currentNews.type === 'MARKET' && <TrendingDown size={15} className="text-rose-500 shrink-0" />}
                        {currentNews.type === 'WEATHER' && <Sun size={15} className="text-amber-500 shrink-0" />}
                        {currentNews.type === 'GLOBAL' && <Globe size={15} className="text-blue-500 shrink-0" />}
                        {currentNews.type === 'LOCAL' && <TrendingUp size={15} className="text-emerald-500 shrink-0" />}

                        <span className="truncate">{displayHeadline}</span>
                        <span className="text-[10px] text-amber-700/70 dark:text-amber-300/70 font-mono ms-auto hidden sm:inline-block shrink-0">
                            {t('bizpulse.open_details', isArabic ? 'اقرأ المزيد 📰' : 'Read more 📰')}
                        </span>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default NewsTicker;
