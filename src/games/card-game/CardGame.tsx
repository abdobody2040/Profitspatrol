import React, { useState, CSSProperties, ReactNode } from "react";
import { useTranslation } from "react-i18next";

/* ═══════════════════════════════════════════════════
   TypeScript Interfaces
═══════════════════════════════════════════════════ */

interface Business {
  id: number;
  name: string;
  ar: string;
  emoji: string;
  coins: number;
  color: string;
}

interface CardOption {
  en: string;
  ar: string;
  effect: number;
  outEn: string;
  outAr: string;
}

interface GameCard {
  id: string;
  kind: "challenge" | "boost" | "skill" | "decision";
  dColor?: "boost" | "challenge";
  emoji: string;
  title: string;
  ar?: string;
  body?: string;
  arBody?: string;
  effect?: number;
  concepts?: string[];
  fact?: string;
  arFact?: string;
  optA?: CardOption;
  optB?: CardOption;
  q?: string;
  arQ?: string;
  arTitle?: string;
  opts?: string[];
  arOpts?: string[];
  answer?: number;
  explain?: string;
  arExplain?: string;
  reward?: number;
}

interface ShopItem {
  id: string;
  emoji: string;
  en: string;
  ar: string;
  cost: number;
  type: "perm" | "once" | "passive" | "loan";
  passive?: number;
  enDesc: string;
  arDesc: string;
}

interface CardMeta {
  bg: string;
  border: string;
  label: string;
  arLabel: string;
  accent?: string;
}

interface CoinProps {
  size?: number;
}

interface BtnProps {
  children: ReactNode;
  onClick?: () => void;
  color?: string;
  textColor?: string;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  full?: boolean;
  outline?: boolean;
}

interface CoinBarProps {
  coins: number;
  target: number;
}

interface CoinBurstProps {
  positive: boolean;
}

interface GameCardProps {
  card: GameCard | null;
  flipped: boolean;
  onClick?: () => void;
  lang: "en" | "ar";
}

interface GlassCardProps {
  children: ReactNode;
  style?: CSSProperties;
}

interface LangToggleProps {
  lang: "en" | "ar";
  setLang: (fn: (l: "en" | "ar") => "en" | "ar") => void;
  t: typeof T["en"];
}


/* ═══════════════════════════════════════════════════
   PROFITS PATROL — Design DNA v3
   Juicy · Gamified · Educational · RTL-aware
   TypeScript / TSX
═══════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Tajawal:wght@400;700;900&display=swap');

/* ── Keyframes ── */
@keyframes float   {0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes floatSm {0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
@keyframes pop     {0%{transform:scale(0.6);opacity:0}70%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}
@keyframes popIn   {0%{transform:scale(0.8) translateY(20px);opacity:0}100%{transform:scale(1) translateY(0);opacity:1}}
@keyframes shake   {0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
@keyframes slideUp {from{transform:translateY(24px);opacity:0}to{transform:translateY(0);opacity:1}}
@keyframes pulse   {0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
@keyframes spin    {from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes burst0  {0%{opacity:1;transform:translate(0,0) scale(1)}100%{opacity:0;transform:translate(-40px,-80px) scale(0.3)}}
@keyframes burst1  {0%{opacity:1;transform:translate(0,0) scale(1)}100%{opacity:0;transform:translate(40px,-80px) scale(0.3)}}
@keyframes burst2  {0%{opacity:1;transform:translate(0,0) scale(1)}100%{opacity:0;transform:translate(0,-100px) scale(0.3)}}
@keyframes shine   {0%{left:-100%}100%{left:200%}}
@keyframes gradient {0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}

/* ── Base reset ── */
*{box-sizing:border-box;margin:0;padding:0}
::-webkit-scrollbar{width:5px}
::-webkit-scrollbar-track{background:#f1f5f9;border-radius:6px}
::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:6px}

/* ── Juicy button press ── */
.juicy-btn:active{transform:translateY(4px)!important}
.juicy-btn{transition:all 0.1s ease!important}
.card-hover:hover{transform:translateY(-4px) scale(1.02)!important;transition:all 0.2s ease!important}

/* ── Responsive grids ── */
.business-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  width: 100%;
  max-height: calc(100vh - 160px);
  overflow-y: auto;
  padding-inline-end: 4px;
  padding-bottom: 12px;
}
.business-grid::-webkit-scrollbar {
  width: 5px;
}
.business-grid::-webkit-scrollbar-track {
  background: transparent;
}
.business-grid::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.4);
  border-radius: 6px;
}
@media (max-width: 1200px) {
  .business-grid { grid-template-columns: repeat(4, 1fr); }
}
@media (max-width: 768px) {
  .business-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 600px) {
  .business-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; }
}

.shop-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  max-height: 65vh;
  overflow-y: auto;
  padding-right: 2px;
  margin-bottom: 12px;
}
@media (max-width: 768px) {
  .shop-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 360px) {
  .shop-grid { grid-template-columns: 1fr; }
}

.quiz-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 12px;
}
@media (max-width: 480px) {
  .quiz-grid { grid-template-columns: 1fr; }
}
`;

/* ══ Card back image ══ */
const CARD_BACK_SRC = "/images/card-academy/card_back.jpg";

/* ══ PP Coin Token ══ */
function Coin({ size = 20 }: CoinProps) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: size, height: size,
      background: "linear-gradient(135deg, #FFC800 0%, #FFA500 100%)",
      borderRadius: "50%",
      border: `${Math.max(1.5, size * 0.08)}px solid #d97706`,
      boxShadow: "0 2px 6px rgba(251,191,36,0.5), inset 0 1px 0 rgba(255,255,255,0.4)",
      fontFamily: "Nunito, sans-serif",
      fontSize: size * 0.42,
      color: "#78350f",
      fontWeight: 900,
      verticalAlign: "middle",
      flexShrink: 0,
      lineHeight: 1,
      marginLeft: 3,
      marginRight: 1,
    }}>PP</span>
  );
}

const T = {
  en: {
    title: "Card Academy", tagline: "The Entrepreneur Card Game!",
    startBtn: "🚀 Start Playing!", pickTitle: "🏪 Pick Your Business!", pickSub: "24 businesses — pick one and grow it to 80 PP!",
    startWith: "Start", drawCard: "🎴 Draw Card", shopBtn: "🛍️ Shop",
    restart: "🏠 Restart", goal: "Goal", turn: "Turn", recentEvents: "📜 Recent Events",
    gotIt: "✅ Got It!", makeChoice: "🤔 Make My Choice", answerQuiz: "🧠 Answer!",
    whatChoose: "🤔 What do you choose?", bizFact: "💡 Business Fact:",
    drawNext: "🎴 Draw Next", youWin: "You Win! 🏆", winSub: "is a SUCCESS!",
    youLearned: "🎓 What you learned:", playAgain: "🔄 Play Again!",
    bankrupt: "Bankrupt! 😢", tryAgain: "🔄 Try Again!",
    reachGoal: "You reached", inTurns: "in", turns: "turns",
    realEnt: "You're a real entrepreneur! 🌟",
    correctMsg: "Correct! Business genius! 🎉", wrongMsg: "Not quite — but now you know! 📚",
    shopTitle: "🛍️ Upgrade Your Business!", shopSub: "Invest wisely to grow faster!",
    buy: "Buy", owned: "✅ Active", used: "Used", backToGame: "⬅️ Back to Game",
    lang: "عربي 🌍", didYouKnow: "💡 Did you know?",
    learned: ["Entrepreneurs solve real problems", "Smart decisions = more profit", "Challenges make you stronger", "Always keep learning!"],
    quote: "\"I have not failed. I've just found 10,000 ways that won't work.\" — Thomas Edison",
    tryMsg: "Most successful entrepreneurs failed first. Try again! 💪",
    insBlocked: "🛡️ Insurance blocked it! No coins lost.",
    robBlocked: "🤖 Smart Assistant skipped it!",
    passive: "Passive income", optA: "A", optB: "B",
    oneTime: "one-time use", perTurn: "/ turn",
    debtWarning: "⚠️ Loan active — paying back 5PP/turn for 4 turns",
    loanTaken: "💳 Loan taken! +25PP — repaying 5PP/turn",
    pinLabel: "Enter PIN to access", pinPlaceholder: "4-digit PIN", pinHint: "Default PIN: 1234",
    pinWrong: "Wrong PIN. Try again.", enterBtn: "🔐 Enter",
    noSession: "No session yet. Play a game first!",
    summaryTitle: "📋 Lesson Summary", businessLabel: "Business",
    turnsLabel: "Turns", coinsLabel: "Final Coins", outcomeLabel: "Outcome",
    won: "Won 🏆", lost: "Bankrupt 😢", ongoing: "In Progress ⏳",
    conceptsTitle: "📚 Concepts Encountered", quizTitle: "🧠 Quiz Performance",
    timelineTitle: "📜 Timeline", discussTitle: "💬 Discussion Questions",
    upgradesTitle: "🛍️ Upgrades Bought",
    printBtn: "🖨️ Print", clearBtn: "🗑️ Clear", backBtn: "⬅️ Back",
    correct_lbl: "Correct", wrong_lbl: "Wrong", score: "Score",
    age: "Recommended Age: 7–14",
    concepts: {
      profit: "Profit & Loss", budget: "Budgeting", marketing: "Marketing",
      competition: "Competition", customer: "Customer Service", risk: "Risk Management",
      investment: "Investment", passive: "Passive Income", innovation: "Innovation",
      partnership: "Partnerships", seasonal: "Seasonal Trends", reputation: "Reputation",
      debt: "Debt & Loans",
    },
    discuss: {
      profit: ["What is profit? Give an example.", "Sell 5 lemonades for $2 each, spend $4 on supplies — what's your profit?"],
      budget: ["Why is it important to have a budget?", "What would you do if you ran out of money for supplies?"],
      marketing: ["How would you tell people about your business?", "Why might word-of-mouth beat paid ads?"],
      competition: ["How would you react if a rival opened nearby?", "What makes YOUR business special?"],
      customer: ["Why do unhappy customers matter?", "How would you handle a complaint?"],
      risk: ["What is a risk? Is it always bad?", "What risks might a lemonade stand face?"],
      investment: ["What does it mean to invest in your business?", "Why spend money to make more money?"],
      passive: ["What is passive income? Give an example.", "Why would an entrepreneur want passive income?"],
      innovation: ["What does innovation mean?", "How could you improve a lemonade stand?"],
      partnership: ["What are the benefits of working with a partner?", "What are the downsides?"],
      seasonal: ["Why do some businesses earn more in certain seasons?", "How would you prepare for a slow season?"],
      reputation: ["Why does reputation matter?", "How do you build a good one?"],
      debt: ["What is a loan? When is it helpful?", "What is the risk of borrowing money for a business?"],
    },
  },
  ar: {
    title: "أكاديمية الكروت", tagline: "لعبة بطاقات ريادة الأعمال!",
    startBtn: "🚀 ابدأ اللعب!", teacherBtn: "👩‍🏫 وضع المعلم / الوالدين",
    pickTitle: "🏪 اختر عملك التجاري!", pickSub: "24 عملاً — اختر واحداً واجمع 80PP للفوز!",
    startWith: "تبدأ بـ", drawCard: "🎴 اسحب بطاقة", shopBtn: "🛍️ المتجر",
    restart: "🏠 إعادة البدء", goal: "الهدف", turn: "دور", recentEvents: "📜 آخر الأحداث",
    gotIt: "✅ فهمت!", makeChoice: "🤔 اختر قرارك", answerQuiz: "🧠 أجب!",
    whatChoose: "🤔 ماذا تختار؟", bizFact: "💡 حقيقة تجارية:",
    drawNext: "🎴 اسحب التالية", youWin: "فزت! 🏆", winSub: "نجح!",
    youLearned: "🎓 ما تعلمته:", playAgain: "🔄 العب مرة أخرى!",
    bankrupt: "إفلاس! 😢", tryAgain: "🔄 حاول مرة أخرى!",
    reachGoal: "وصلت إلى", inTurns: "في", turns: "أدوار",
    realEnt: "أنت رائد أعمال حقيقي! 🌟",
    correctMsg: "صحيح! عبقري الأعمال! 🎉", wrongMsg: "ليس صحيحاً — لكنك الآن تعرف! 📚",
    shopTitle: "🛍️ طوّر عملك!", shopSub: "استثمر بذكاء لتنمو أسرع!",
    buy: "اشترِ", owned: "✅ نشط", used: "مستخدم", backToGame: "⬅️ العودة",
    lang: "English 🌍", didYouKnow: "💡 هل تعلم؟",
    learned: ["رواد الأعمال يحلون مشاكل حقيقية", "القرارات الذكية = ربح أكثر", "التحديات تجعلك أقوى", "تعلم دائماً!"],
    quote: "\"لم أفشل. اكتشفت 10,000 طريقة لا تنجح.\" — توماس إديسون",
    tryMsg: "معظم رواد الأعمال الناجحين فشلوا أولاً. حاول مرة أخرى! 💪",
    insBlocked: "🛡️ التأمين حماك! لم تخسر شيئاً.",
    robBlocked: "🤖 المساعد الذكي تجاوز التحدي!",
    passive: "دخل سلبي", optA: "أ", optB: "ب",
    oneTime: "مرة واحدة", perTurn: "/ دور",
    debtWarning: "⚠️ قرض نشط — تسديد 5PP/دور لمدة 4 أدوار",
    loanTaken: "💳 تم القرض! +25PP — تسديد 5PP/دور",
    pinLabel: "أدخل الرمز السري", pinPlaceholder: "رمز من 4 أرقام", pinHint: "الرمز الافتراضي: 1234",
    pinWrong: "رمز خاطئ. حاول مرة أخرى.", enterBtn: "🔐 دخول",
    noSession: "لا توجد جلسة بعد. العب أولاً!",
    summaryTitle: "📋 ملخص الدرس", businessLabel: "العمل التجاري",
    turnsLabel: "الأدوار", coinsLabel: "العملات النهائية", outcomeLabel: "النتيجة",
    won: "فاز 🏆", lost: "إفلاس 😢", ongoing: "جارٍ ⏳",
    conceptsTitle: "📚 المفاهيم", quizTitle: "🧠 أداء المسابقة",
    timelineTitle: "📜 السجل", discussTitle: "💬 أسئلة للنقاش",
    upgradesTitle: "🛍️ التطويرات",
    printBtn: "🖨️ طباعة", clearBtn: "🗑️ مسح", backBtn: "⬅️ رجوع",
    correct_lbl: "صحيح", wrong_lbl: "خاطئ", score: "النتيجة",
    age: "الفئة العمرية: 7–14 سنة",
    concepts: {
      profit: "الربح والخسارة", budget: "الميزانية", marketing: "التسويق",
      competition: "المنافسة", customer: "خدمة العملاء", risk: "إدارة المخاطر",
      investment: "الاستثمار", passive: "الدخل السلبي", innovation: "الابتكار",
      partnership: "الشراكات", seasonal: "المواسم التجارية", reputation: "السمعة",
      debt: "الديون والقروض",
    },
    discuss: {
      profit: ["ما هو الربح؟ أعطِ مثالاً.", "بعت 5 عصائر بـ 2$ وأنفقت 4$ — ما هو ربحك؟"],
      budget: ["لماذا الميزانية مهمة؟", "ماذا تفعل إذا نفدت أموالك؟"],
      marketing: ["كيف ستخبر الناس عن عملك؟", "لماذا التسويق الشفهي أفضل من الإعلانات؟"],
      competition: ["كيف ستتصرف إذا فتح منافس بجانبك؟", "ما الذي يجعل عملك مميزاً؟"],
      customer: ["لماذا العملاء الغاضبون مهمون؟", "كيف ستتعامل مع شكوى؟"],
      risk: ["ما هي المخاطرة؟ هل هي دائماً سيئة؟", "ما المخاطر التي يواجهها عشرب الليمون؟"],
      investment: ["ماذا يعني الاستثمار في عملك؟", "لماذا تنفق المال لكسب المزيد؟"],
      passive: ["ما هو الدخل السلبي؟ أعطِ مثالاً.", "لماذا يريد رائد الأعمال دخلاً سلبياً؟"],
      innovation: ["ماذا يعني الابتكار؟", "كيف يمكن تحسين عشرب الليمون؟"],
      partnership: ["ما فوائد العمل مع شريك؟", "ما هي العيوب؟"],
      seasonal: ["لماذا تكسب بعض الأعمال أكثر في مواسم معينة؟", "كيف تستعد للموسم البطيء؟"],
      reputation: ["لماذا السمعة مهمة؟", "كيف تبني سمعة جيدة؟"],
      debt: ["ما هو القرض؟ متى يكون مفيداً؟", "ما خطر اقتراض المال لعمل تجاري؟"],
    },
  },
};


const BUSINESSES: Business[] = [
  { id: 1, name: "Lemonade Stand", ar: "عشرب الليمون", emoji: "🍋", coins: 10, color: "#FFD93D" },
  { id: 2, name: "Dog Walking", ar: "تمشية الكلاب", emoji: "🐕", coins: 8, color: "#6BCB77" },
  { id: 3, name: "Art Shop", ar: "محل رسم", emoji: "🎨", coins: 9, color: "#FF6B6B" },
  { id: 4, name: "Cookie Bakery", ar: "مخبز الكوكيز", emoji: "🍪", coins: 12, color: "#FF9F45" },
  { id: 5, name: "Car Wash", ar: "غسيل سيارات", emoji: "🚗", coins: 7, color: "#4D96FF" },
  { id: 6, name: "Plant Shop", ar: "محل نباتات", emoji: "🌱", coins: 6, color: "#56CFE1" },
  { id: 7, name: "YouTube Channel", ar: "قناة يوتيوب", emoji: "📺", coins: 5, color: "#FF0000" },
  { id: 8, name: "Tutoring", ar: "دروس خصوصية", emoji: "📚", coins: 9, color: "#9B59B6" },
  { id: 9, name: "Pizza Delivery", ar: "توصيل بيتزا", emoji: "🍕", coins: 11, color: "#E74C3C" },
  { id: 10, name: "Clothing Store", ar: "محل ملابس", emoji: "👗", coins: 10, color: "#E91E8C" },
  { id: 11, name: "Tech Repair", ar: "إصلاح إلكترونيات", emoji: "🔧", coins: 10, color: "#607D8B" },
  { id: 12, name: "Food Truck", ar: "عربية أكل", emoji: "🚚", coins: 13, color: "#FF5722" },
  { id: 13, name: "Photography", ar: "تصوير فوتوغرافي", emoji: "📸", coins: 8, color: "#795548" },
  { id: 14, name: "Online Store", ar: "متجر إلكتروني", emoji: "🛒", coins: 7, color: "#00BCD4" },
  { id: 15, name: "Coffee Shop", ar: "مقهى", emoji: "☕", coins: 11, color: "#6F4E37" },
  { id: 16, name: "Ice Cream Cart", ar: "عربية آيس كريم", emoji: "🍦", coins: 8, color: "#FF8FAB" },
  { id: 17, name: "Flower Shop", ar: "محل زهور", emoji: "💐", coins: 9, color: "#C77DFF" },
  { id: 18, name: "Pet Grooming", ar: "تجميل حيوانات", emoji: "🐩", coins: 10, color: "#A8DADC" },
  { id: 19, name: "Game Dev Studio", ar: "استوديو ألعاب", emoji: "🎮", coins: 6, color: "#7B2FBE" },
  { id: 20, name: "Fitness Trainer", ar: "مدرب لياقة", emoji: "💪", coins: 8, color: "#F72585" },
  { id: 21, name: "Cleaning Service", ar: "خدمة تنظيف", emoji: "🧹", coins: 7, color: "#4CC9F0" },
  { id: 22, name: "Jewelry Shop", ar: "محل مجوهرات", emoji: "💍", coins: 9, color: "#F4A261" },
  { id: 23, name: "Catering", ar: "تموين وضيافة", emoji: "🍽️", coins: 13, color: "#E63946" },
  { id: 24, name: "Subscription Box", ar: "صندوق اشتراك", emoji: "📬", coins: 7, color: "#2D6A4F" },
];


const DECK: GameCard[] = [
  /* CHALLENGES */
  {
    id: "c1", kind: "challenge", emoji: "🌧️", title: "Rainy Day!", ar: "يوم ممطر!",
    body: "It rained all day and customers stayed home.", arBody: "اليوم ممطر والعملاء في بيوتهم.",
    effect: -5, concepts: ["risk", "budget"],
    fact: "Save for slow days — this is called a rainy-day fund!",
    arFact: "ادخر للأيام السيئة — يُسمى صندوق الطوارئ!"
  },
  {
    id: "c2", kind: "decision", dColor: "challenge", emoji: "🏪", title: "New Competition!", ar: "منافس جديد!",
    body: "A bigger store opened nearby. What do you do?", arBody: "محل أكبر فتح بجانبك. ماذا تفعل؟",
    optA: { en: "Lower your prices", ar: "خفّض أسعارك", effect: -3, outEn: "Kept customers but earned less.", outAr: "حافظت على العملاء لكن ربحت أقل." },
    optB: { en: "Be more unique", ar: "كن مميزاً", effect: 6, outEn: "Customers loved your unique twist!", outAr: "أحب العملاء تميزك!" },
    concepts: ["competition", "innovation"],
    fact: "Competition pushes businesses to be more creative!", arFact: "المنافسة تجعل الأعمال أكثر إبداعاً!"
  },
  {
    id: "c3", kind: "challenge", emoji: "💸", title: "Broken Equipment!", ar: "معدات مكسورة!",
    body: "Your main tool broke and needs fixing.", arBody: "أدواتك احتاجت إصلاحاً مكلفاً.",
    effect: -8, concepts: ["budget", "risk"],
    fact: "Always keep an emergency fund for unexpected problems!",
    arFact: "احتفظ دائماً بصندوق طوارئ!"
  },
  {
    id: "c4", kind: "decision", dColor: "challenge", emoji: "😤", title: "Unhappy Customer!", ar: "عميل غاضب!",
    body: "A customer is upset. What do you do?", arBody: "عميل غير راضٍ. ماذا تفعل؟",
    optA: { en: "Ignore the complaint", ar: "تجاهل الشكوى", effect: -10, outEn: "Word spread — lost many customers!", outAr: "انتشر الخبر وخسرت عملاء!" },
    optB: { en: "Fix it & apologise", ar: "أصلح وأعتذر", effect: 5, outEn: "They became your biggest fan!", outAr: "أصبح أكبر معجب لك!" },
    concepts: ["customer", "reputation"],
    fact: "Happy customers tell 3 friends. Unhappy ones tell 10!",
    arFact: "العميل السعيد يخبر 3 أصدقاء. الغاضب يخبر 10!"
  },
  {
    id: "c5", kind: "challenge", emoji: "📦", title: "Out of Supplies!", ar: "مواد ناقصة!",
    body: "You ran out of materials!", arBody: "نفدت موادك الخام!",
    effect: -4, concepts: ["budget", "risk"],
    fact: "Always track your inventory to prevent stockouts!", arFact: "تابع مخزونك دائماً!"
  },
  {
    id: "c6", kind: "challenge", emoji: "💻", title: "Website Crashed!", ar: "الموقع تعطّل!",
    body: "Your online store was down all day!", arBody: "متجرك الإلكتروني توقف طوال اليوم!",
    effect: -6, concepts: ["risk", "investment"],
    fact: "Backup systems keep businesses running 24/7!", arFact: "أنظمة النسخ الاحتياطي تحافظ على عملك!"
  },
  {
    id: "c7", kind: "challenge", emoji: "🤒", title: "Got Sick!", ar: "مرضت!",
    body: "Sick for 2 days — couldn't work.", arBody: "مرضت ولم تستطع العمل يومين.",
    effect: -5, concepts: ["risk", "passive"],
    fact: "Having an employee means work continues when you're sick!",
    arFact: "وجود موظف يعني استمرار العمل حتى عند مرضك!"
  },
  {
    id: "c8", kind: "challenge", emoji: "🌩️", title: "Power Cut!", ar: "انقطاع الكهرباء!",
    body: "Electricity off — you had to close early.", arBody: "انقطع التيار واضطررت للإغلاق.",
    effect: -3, concepts: ["risk"],
    fact: "Always have a backup plan for unexpected events!", arFact: "احتفظ دائماً بخطة بديلة!"
  },
  {
    id: "c9", kind: "challenge", emoji: "🥵", title: "Summer Slump!", ar: "ركود الصيف!",
    body: "Too hot outside — almost no customers today.", arBody: "الجو حار جداً — لا عملاء تقريباً!",
    effect: -4, concepts: ["seasonal", "risk"],
    fact: "Seasonal businesses plan for slow periods by saving during peak times!",
    arFact: "الأعمال الموسمية تدخر في أوقات الذروة للأوقات البطيئة!"
  },
  {
    id: "c10", kind: "decision", dColor: "challenge", emoji: "📢", title: "Bad Review!", ar: "تقييم سيء!",
    body: "Someone left a 1-star review online. What do you do?", arBody: "شخص ترك تقييم نجمة واحدة. ماذا تفعل؟",
    optA: { en: "Delete & ignore it", ar: "احذفه وتجاهله", effect: -8, outEn: "People noticed — trust dropped badly!", outAr: "لاحظ الناس ذلك وانخفضت ثقتهم!" },
    optB: { en: "Respond & improve", ar: "رد وتحسّن", effect: 4, outEn: "Your honest reply impressed new customers!", outAr: "ردك الصادق أثر على العملاء الجدد إيجابياً!" },
    concepts: ["reputation", "customer"],
    fact: "Responding well to bad reviews shows professionalism and builds trust!",
    arFact: "الرد الجيد على التقييمات السيئة يبني الثقة!"
  },
  /* BOOSTS */
  {
    id: "b1", kind: "boost", emoji: "⭐", title: "5-Star Review!", ar: "تقييم 5 نجوم!",
    body: "A customer left an amazing review online!", arBody: "عميل ترك تقييماً رائعاً!",
    effect: 10, concepts: ["reputation", "marketing"],
    fact: "Reviews help new customers trust you. Always do your best!",
    arFact: "التقييمات تساعد العملاء الجدد على الثقة بك!"
  },
  {
    id: "b2", kind: "boost", emoji: "📱", title: "Viral Post!", ar: "منشور انتشر!",
    body: "Someone shared your business on social media!", arBody: "شخص شارك عملك على السوشيال ميديا!",
    effect: 15, concepts: ["marketing"],
    fact: "Social media spreads your message like 100 friends at once!",
    arFact: "السوشيال ميديا تنشر رسالتك لمئات الأشخاص!"
  },
  {
    id: "b3", kind: "decision", dColor: "boost", emoji: "🤝", title: "Partnership Offer!", ar: "عرض شراكة!",
    body: "Another business wants to team up with you!", arBody: "عمل آخر يريد الشراكة معك!",
    optA: { en: "Accept & share profits", ar: "اقبل وشارك الأرباح", effect: 12, outEn: "Together you reached way more customers!", outAr: "معاً وصلتما لعملاء أكثر بكثير!" },
    optB: { en: "Stay solo", ar: "ابق وحدك", effect: 3, outEn: "Kept all profits but grew slowly.", outAr: "احتفظت بكل الأرباح لكن نموت ببطء." },
    concepts: ["partnership"],
    fact: "Partnerships combine strengths — in business, 1+1 can equal 3!",
    arFact: "الشراكات تجمع القوى — 1+1 يمكن أن تساوي 3!"
  },
  {
    id: "b4", kind: "boost", emoji: "🎉", title: "Holiday Rush!", ar: "موسم الأعياد!",
    body: "It's a holiday and everyone is buying!", arBody: "جاء موسم الأعياد والجميع يشتري!",
    effect: 20, concepts: ["seasonal", "marketing"],
    fact: "Seasonal trends are predictable spikes — stock up and prepare!",
    arFact: "المواسم ارتفاعات متوقعة. استعد مسبقاً!"
  },
  {
    id: "b5", kind: "boost", emoji: "🏆", title: "Best in Town Award!", ar: "جائزة الأفضل!",
    body: "You won a local small-business award!", arBody: "فزت بجائزة أفضل عمل صغير!",
    effect: 8, concepts: ["reputation"],
    fact: "Your reputation is your most valuable business asset!",
    arFact: "سمعتك هي أثمن أصول عملك!"
  },
  {
    id: "b6", kind: "boost", emoji: "💡", title: "Brilliant Idea!", ar: "فكرة رائعة!",
    body: "You found a faster, cheaper way to work!", arBody: "وجدت طريقة أسرع وأرخص للعمل!",
    effect: 6, concepts: ["innovation"],
    fact: "Innovation = finding better ways to create value!",
    arFact: "الابتكار = إيجاد طرق أفضل لخلق القيمة!"
  },
  {
    id: "b7", kind: "boost", emoji: "📰", title: "Newspaper Feature!", ar: "مقال في الجريدة!",
    body: "A local newspaper wrote about your business!", arBody: "كتبت جريدة محلية مقالاً عن عملك!",
    effect: 12, concepts: ["marketing", "reputation"],
    fact: "Press coverage is free advertising that builds credibility fast!",
    arFact: "التغطية الصحفية إعلان مجاني يبني المصداقية!"
  },
  {
    id: "b8", kind: "boost", emoji: "🎓", title: "School Feature!", ar: "قصة نجاح مدرسية!",
    body: "Your school shared your success story!", arBody: "مدرستك عرضت قصة نجاحك!",
    effect: 7, concepts: ["reputation", "marketing"],
    fact: "Education + real experience = the strongest entrepreneurs!",
    arFact: "التعليم والخبرة معاً = أقوى رواد الأعمال!"
  },
  {
    id: "b9", kind: "boost", emoji: "🌍", title: "International Customer!", ar: "عميل دولي!",
    body: "Someone from another country ordered from you!", arBody: "شخص من بلد آخر طلب منك!",
    effect: 14, concepts: ["marketing", "innovation"],
    fact: "The internet lets small businesses sell worldwide from day one!",
    arFact: "الإنترنت يتيح للأعمال الصغيرة البيع عالمياً من اليوم الأول!"
  },
  {
    id: "b10", kind: "decision", dColor: "boost", emoji: "💰", title: "Bonus Money!", ar: "مكافأة مالية!",
    body: "You have extra cash. How do you use it?", arBody: "لديك أموال إضافية. كيف تستخدمها؟",
    optA: { en: "Reinvest in the business", ar: "استثمرها في العمل", effect: 14, outEn: "Your investment paid off big!", outAr: "استثمارك أعطى نتائج رائعة!" },
    optB: { en: "Save it all", ar: "ادخرها كلها", effect: 7, outEn: "Safe choice — but you missed growth.", outAr: "قرار آمن — لكنك أضعت فرصة النمو." },
    concepts: ["investment", "budget"],
    fact: "Reinvesting profits is how small businesses grow into big ones!",
    arFact: "إعادة استثمار الأرباح هو كيف تنمو الأعمال الصغيرة!"
  },
  /* SKILLS */
  {
    id: "s1", kind: "skill", emoji: "📊", title: "Profit Quiz!", arTitle: "مسابقة الربح!",
    q: "You sell cookies for $3. Costs $1 to make. What's the PROFIT per cookie?",
    arQ: "تبيع كوكيز بـ 3$. التكلفة 1$. ما هو الربح لكل كوكيز؟",
    opts: ["$1", "$2", "$3", "$4"], arOpts: ["1$", "2$", "3$", "4$"], answer: 1, concepts: ["profit"],
    explain: "Profit = Selling Price − Cost. $3 − $1 = $2!",
    arExplain: "الربح = سعر البيع − التكلفة. 3$−1$=2$!", reward: 10
  },
  {
    id: "s2", kind: "skill", emoji: "💰", title: "Budget Brain!", arTitle: "عقل الميزانية!",
    q: "You have $20. Supplies cost $12. How much left for emergencies?",
    arQ: "لديك 20$. المستلزمات 12$. كم يتبقى للطوارئ؟",
    opts: ["$5", "$8", "$10", "$12"], arOpts: ["5$", "8$", "10$", "12$"], answer: 1, concepts: ["budget"],
    explain: "$20 − $12 = $8. Always track your budget!",
    arExplain: "20$ − 12$ = 8$. تابع ميزانيتك دائماً!", reward: 8
  },
  {
    id: "s3", kind: "skill", emoji: "🧠", title: "Entrepreneur Test!", arTitle: "اختبار ريادة الأعمال!",
    q: "What does an entrepreneur do?", arQ: "ماذا يفعل رائد الأعمال؟",
    opts: ["Only spend money", "Start & run a business", "Never take risks", "Work for others"],
    arOpts: ["يُنفق المال فقط", "يبدأ ويدير عمل تجاري", "لا يأخذ مخاطر", "يعمل للآخرين فقط"],
    answer: 1, concepts: ["risk", "innovation"],
    explain: "Entrepreneurs start businesses, take smart risks, and create value!",
    arExplain: "رواد الأعمال يبدأون أعمالاً ويأخذون مخاطر ذكية!", reward: 10
  },
  {
    id: "s4", kind: "skill", emoji: "📈", title: "Marketing Master!", arTitle: "خبير التسويق!",
    q: "Which is the BEST free marketing?", arQ: "ما هو أفضل تسويق مجاني؟",
    opts: ["TV commercials", "Word of mouth", "Billboards", "Magazine ads"],
    arOpts: ["إعلانات التلفزيون", "التسويق الشفهي", "لوحات إعلانية", "إعلانات المجلات"],
    answer: 1, concepts: ["marketing"],
    explain: "Word of mouth is FREE and the most trusted marketing ever!",
    arExplain: "التسويق الشفهي مجاني والأكثر ثقة!", reward: 8
  },
  {
    id: "s5", kind: "skill", emoji: "🤔", title: "Money Moves!", arTitle: "قرارات المال!",
    q: "You earned $50 profit. What's the SMARTEST choice?", arQ: "ربحت 50$. ما هو القرار الأذكى؟",
    opts: ["Spend it all", "Save & reinvest", "Give it all away", "Hide it"],
    arOpts: ["أنفق كله", "ادخر واستثمر", "تبرع بكله", "اخبئه"],
    answer: 1, concepts: ["investment", "budget"],
    explain: "Save some for security AND reinvest some to grow!",
    arExplain: "ادخر بعضاً للأمان واستثمر بعضاً للنمو!", reward: 10
  },
  {
    id: "s6", kind: "skill", emoji: "🎯", title: "Customer Focus!", arTitle: "التركيز على العميل!",
    q: "What does 'customer needs' mean?", arQ: "ماذا تعني 'احتياجات العميل'؟",
    opts: ["What YOU want to sell", "What customers WANT", "Priciest product", "What's trendy"],
    arOpts: ["ما تريد بيعه", "ما يريده العملاء", "أغلى المنتجات", "ما هو رائج"],
    answer: 1, concepts: ["customer"],
    explain: "Great businesses solve real problems customers actually have!",
    arExplain: "الأعمال العظيمة تحل مشاكل حقيقية!", reward: 10
  },
  {
    id: "s7", kind: "skill", emoji: "🤝", title: "Partnership Quiz!", arTitle: "مسابقة الشراكة!",
    q: "Main benefit of a business partnership?", arQ: "ما هي الفائدة الرئيسية من الشراكة؟",
    opts: ["Keep all profit", "Combine strengths", "Less work", "No risks"],
    arOpts: ["تحتفظ بكل الربح", "تجمع القوى", "عمل أقل", "لا مخاطر"],
    answer: 1, concepts: ["partnership"],
    explain: "Partnerships let you combine skills and reach more customers!",
    arExplain: "الشراكات تتيح دمج المهارات والوصول لعملاء أكثر!", reward: 8
  },
  {
    id: "s8", kind: "skill", emoji: "💳", title: "Debt Dilemma!", arTitle: "معضلة الديون!",
    q: "What is the RISK of taking a business loan?", arQ: "ما هو خطر أخذ قرض تجاري؟",
    opts: ["More customers", "You must repay with interest", "Free money", "No risk at all"],
    arOpts: ["عملاء أكثر", "يجب السداد مع الفائدة", "مال مجاني", "لا مخاطر"],
    answer: 1, concepts: ["debt", "budget"],
    explain: "Loans give you money now, but you always repay more than you borrowed!",
    arExplain: "القروض تعطيك مالاً الآن، لكنك ستسدد أكثر مما اقترضت!", reward: 10
  },
];


const SHOP: ShopItem[] = [
  {
    id: "marketing", emoji: "📣", en: "Marketing Campaign", ar: "حملة تسويقية", cost: 15, type: "perm",
    enDesc: "All boost cards give +5 extra coins!", arDesc: "بطاقات التعزيز تعطي +5 إضافية!"
  },
  {
    id: "insurance", emoji: "🛡️", en: "Insurance Policy", ar: "بوليصة تأمين", cost: 12, type: "once",
    enDesc: "Cancels your next challenge completely!", arDesc: "تلغي تحديك القادم تماماً!"
  },
  {
    id: "staff", emoji: "👥", en: "Hire an Employee", ar: "وظّف موظفاً", cost: 20, type: "passive", passive: 3,
    enDesc: "+3 passive coins every turn.", arDesc: "+3 عملات سلبية كل دور."
  },
  {
    id: "online", emoji: "🌐", en: "Online Presence", ar: "وجود إلكتروني", cost: 18, type: "passive", passive: 5,
    enDesc: "+5 passive coins every turn.", arDesc: "+5 عملات سلبية كل دور."
  },
  {
    id: "supplies", emoji: "📦", en: "Better Supplies", ar: "مستلزمات أفضل", cost: 8, type: "perm",
    enDesc: "Lose 3 fewer coins on every challenge.", arDesc: "خسارة 3 عملات أقل في كل تحدٍ!"
  },
  {
    id: "course", emoji: "📊", en: "Business Course", ar: "دورة في الأعمال", cost: 15, type: "perm",
    enDesc: "Quiz rewards are doubled!", arDesc: "مكافآت المسابقات تتضاعف!"
  },
  {
    id: "robot", emoji: "🤖", en: "Smart Assistant", ar: "مساعد ذكي", cost: 22, type: "once",
    enDesc: "Skip one bad challenge card!", arDesc: "تجاوز تحدٍ سيئ واحد!"
  },
  {
    id: "loyalty", emoji: "🎁", en: "Loyalty Program", ar: "برنامج ولاء", cost: 10, type: "perm",
    enDesc: "+3 extra coins on every boost card.", arDesc: "+3 على كل بطاقة تعزيز!"
  },
  {
    id: "loan", emoji: "💳", en: "Business Loan", ar: "قرض تجاري", cost: 0, type: "loan",
    enDesc: "Get +25PP now. Repay 5PP/turn for 4 turns.", arDesc: "احصل على +25PP الآن. سدّد 5PP/دور لـ 4 أدوار."
  },
  {
    id: "accountant", emoji: "🧾", en: "Accountant", ar: "محاسب", cost: 12, type: "perm",
    enDesc: "All challenge losses cut in half!", arDesc: "خسائر التحديات تُنصّف!"
  },
  {
    id: "delivery", emoji: "🛵", en: "Delivery Service", ar: "خدمة توصيل", cost: 16, type: "passive", passive: 2,
    enDesc: "+2 passive coins + boost cards give +3 extra.", arDesc: "+2 دخل سلبي + بطاقات التعزيز +3 إضافية."
  },
  {
    id: "brand", emoji: "🎨", en: "Brand Identity", ar: "هوية العلامة", cost: 10, type: "perm",
    enDesc: "Boost cards give +2 extra & quiz rewards +5!", arDesc: "بطاقات التعزيز +2 ومكافآت المسابقة +5!"
  },
  {
    id: "franchise", emoji: "🏢", en: "Franchise License", ar: "رخصة فرنشايز", cost: 30, type: "perm",
    enDesc: "Doubles ALL passive income sources!", arDesc: "يضاعف جميع مصادر الدخل السلبي!"
  },
  {
    id: "vip", emoji: "👑", en: "VIP Club", ar: "نادي VIP", cost: 14, type: "perm",
    enDesc: "Every 3rd boost card gives +10 bonus coins!", arDesc: "كل ثالث بطاقة تعزيز تعطي +10 عملات إضافية!"
  },
];


const WIN = 80;
const LOSE = -15;
const LOAN_REPAY = 5;
const LOAN_TURNS = 4;

const shuffle = <T,>(arr: T[]): T[] => {
  const a: T[] = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/* ════════════════════════════════════════════════
   SHARED COMPONENTS — DNA Design System
════════════════════════════════════════════════ */

/* ── Juicy Button (DNA signature) ── */
function Btn({ children, onClick, color, textColor = "#fff", size = "md", disabled = false, full = false, outline = false }: BtnProps) {
  const darken = (hex: string): string => {
    if (!hex || !hex.startsWith('#')) return '#d97706';
    const n = parseInt(hex.slice(1), 16);
    const r = Math.max(0, (n >> 16) - 40), g: number = Math.max(0, ((n >> 8) & 0xff) - 40), bl: number = Math.max(0, (n & 0xff) - 40);
    return `#${((r << 16) | (g << 8) | bl).toString(16).padStart(6, "0")}`;
  };

  const btnClass = outline ? "btn btn--ghost" : "btn";
  const customStyle: CSSProperties = {
    width: full ? "100%" : undefined,
    ...(color && !outline ? { background: color, boxShadow: `0 4px 0 ${darken(color)}` } : {}),
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={btnClass}
      style={customStyle}
    >
      {children}
    </button>
  );
}

/* ── Progress bar ── */
function CoinBar({ coins, target }: CoinBarProps) {
  const isDark = useDark();
  const pct = Math.max(0, Math.min(100, (coins / target) * 100));
  const col = coins < 0 ? "#ef4444" : coins < 25 ? "#f97316" : "#58CC02";
  const bgCol = coins < 0 
    ? (isDark ? "rgba(239,68,68,0.15)" : "#fee2e2") 
    : coins < 25 
      ? (isDark ? "rgba(249,115,22,0.15)" : "#ffedd5") 
      : (isDark ? "rgba(88,204,2,0.15)" : "#dcfce7");
  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: isDark ? "#94a3b8" : "#64748b", fontFamily: "Nunito, sans-serif", fontWeight: 700, marginBottom: 4 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 3 }}>0 <Coin size={13} /></span>
        <span style={{ display: "flex", alignItems: "center", gap: 3 }}>{target} <Coin size={13} /></span>
      </div>
      <div style={{ height: 18, borderRadius: 999, background: bgCol, border: isDark ? `2px solid ${col}44` : `2px solid ${col}33`, overflow: "hidden", position: "relative" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${col}, ${col}cc)`, borderRadius: 999, transition: "width 0.7s cubic-bezier(.34,1.56,.64,1)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 100%)", borderRadius: 999 }} />
        </div>
        {pct > 12 && (
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Nunito, sans-serif", fontSize: "0.62rem", fontWeight: 900, color: pct > 50 ? "#fff" : col }}>{Math.round(pct)}%</div>
        )}
      </div>
    </div>
  );
}

/* ── Coin burst animation ── */
function CoinBurst({ positive }: CoinBurstProps) {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 10 }}>
      {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
        <div key={i} style={{ position: "absolute", left: `${10 + i * 11}%`, top: `${15 + (i % 3) * 15}%`, animation: `burst${i % 3} 0.9s ease-out forwards`, animationDelay: `${i * 0.065}s`, opacity: 0 }}>
          {positive ? <Coin size={16} /> : <span style={{ fontSize: "1rem" }}>💸</span>}
        </div>
      ))}
    </div>
  );
}

/* ── Card meta definitions ── */
const CARD_META: Record<string, CardMeta> = {
  challenge: { bg: "linear-gradient(145deg, #ef4444, #b91c1c)", border: "#7f1d1d", label: "CHALLENGE", arLabel: "تحدي", accent: "#fca5a5" },
  boost: { bg: "linear-gradient(145deg, #58CC02, #16a34a)", border: "#14532d", label: "BOOST ✨", arLabel: "تعزيز ✨", accent: "#bbf7d0" },
  skill: { bg: "linear-gradient(145deg, #A855F7, #7c3aed)", border: "#4c1d95", label: "SKILL 🧠", arLabel: "مهارة 🧠", accent: "#e9d5ff" },
};

/* ── Game Card Component ── */
function GameCard({ card, flipped, onClick, lang }: GameCardProps) {
  let meta = (card && CARD_META[card.kind]) ? CARD_META[card.kind] : CARD_META.challenge;
  if (card && card.kind === "decision") {
    const isB = card.dColor === "boost";
    meta = isB
      ? { bg: "linear-gradient(145deg, #2B70C9, #1d4ed8)", border: "#1e3a8a", label: "OPPORTUNITY!", arLabel: "فرصة!", accent: "#bfdbfe" }
      : { bg: "linear-gradient(145deg, #f97316, #c2410c)", border: "#7c2d12", label: "CHALLENGE", arLabel: "تحدي", accent: "#fed7aa" };
  }

  const title = card ? (lang === "ar" ? (card.ar || card.title) : card.title) : "";
  const body = card ? (lang === "ar" ? (card.arBody || card.arQ || card.body || card.q || "") : (card.body || card.q || "")) : "";

  return (
    <div onClick={onClick} style={{ width: 220, height: 320, cursor: flipped ? "default" : "pointer", perspective: 1200, flexShrink: 0 }}>
      <div style={{ width: "100%", height: "100%", position: "relative", transformStyle: "preserve-3d", transition: "transform 0.6s cubic-bezier(.25,.46,.45,.94)", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}>

        {/* ── Card Back ── */}
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", borderRadius: 20, overflow: "hidden", boxShadow: "0 14px 34px rgba(0,0,0,0.5), 0 0 20px rgba(245,158,11,0.3)", border: "3px solid #F59E0B", background: "#080e24" }}>
          <img src={CARD_BACK_SRC} alt="Profits Patrol Card Academy" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }} />
          {/* Subtle top logo brand badge */}
          <div style={{ position: "absolute", top: 8, left: 0, right: 0, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
            <span style={{ background: "rgba(8,14,36,0.85)", border: "1px solid rgba(245,158,11,0.6)", borderRadius: 999, padding: "2px 10px", fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "0.58rem", color: "#FDE047", letterSpacing: 1.2, textTransform: "uppercase", backdropFilter: "blur(4px)", boxShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
              Profits Patrol
            </span>
          </div>
          {/* Bottom Callout */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(5,10,28,0.92) 0%, rgba(5,10,28,0.7) 60%, transparent 100%)", padding: "20px 10px 10px", textAlign: "center" }}>
            <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, color: "#FBBF24", fontSize: "0.95rem", textShadow: "0 2px 8px rgba(0,0,0,0.9)", textTransform: "uppercase", letterSpacing: 0.8 }}>{lang === "ar" ? "أكاديمية الكروت" : "Card Academy"}</div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(245,158,11,0.25)", border: "1px solid rgba(245,158,11,0.5)", borderRadius: 999, padding: "2px 10px", marginTop: 4, color: "#FEF08A", fontSize: "0.62rem", fontFamily: "Tajawal, sans-serif", fontWeight: 800, boxShadow: "0 0 10px rgba(245,158,11,0.3)" }}>
              <span>✨</span>
              <span>{lang === "ar" ? "اضغط لسحب الكارت" : "Tap to draw card"}</span>
              <span>✨</span>
            </div>
          </div>
        </div>

        {/* ── Card Front ── */}
        {card && (
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", borderRadius: 20, background: meta.bg, border: `3px solid ${meta.border}`, boxShadow: `0 12px 32px rgba(0,0,0,0.35), 0 4px 0 ${meta.border}`, display: "flex", flexDirection: "column", alignItems: "center", padding: "14px 12px 12px", gap: 5, overflow: "hidden" }}>
            {/* Shine overlay */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "50%", background: "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)", borderRadius: "20px 20px 0 0", pointerEvents: "none" }} />

            {/* Label badge */}
            <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 999, padding: "3px 12px", fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "0.6rem", letterSpacing: 2, color: meta.accent, textTransform: "uppercase" }}>
              {lang === "ar" ? meta.arLabel : meta.label}
            </div>

            <div style={{ fontSize: "2.8rem", lineHeight: 1, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}>{card.emoji}</div>
            <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.15rem", color: "#fff", textAlign: "center", lineHeight: 1.2, textShadow: "0 1px 3px rgba(0,0,0,0.3)" }}>{title}</div>
            <div style={{ fontFamily: "Tajawal, sans-serif", fontSize: "0.76rem", color: "rgba(255,255,255,0.92)", textAlign: "center", lineHeight: 1.5, flex: 1 }}>{body}</div>

            {(card.kind === "challenge" || card.kind === "boost") && (
              <div style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(0,0,0,0.3)", borderRadius: 999, padding: "4px 14px", fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.2rem", color: "#fff" }}>
                {(card.effect ?? 0) > 0 ? `+${card.effect}` : card.effect ?? 0} <Coin size={18} />
              </div>
            )}
            {card.kind === "skill" && (
              <div style={{ display: "flex", alignItems: "center", gap: 3, background: "rgba(0,0,0,0.3)", borderRadius: 999, padding: "3px 12px", fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "0.78rem", color: "#fff" }}>
                {lang === "ar" ? "أجب لتربح" : "Answer to win"} +{card.reward}<Coin size={14} />
              </div>
            )}
            {card.kind === "decision" && (
              <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 999, padding: "3px 12px", fontFamily: "Tajawal, sans-serif", fontSize: "0.68rem", color: "rgba(255,255,255,0.9)" }}>
                {lang === "ar" ? "🤔 قرارك مهم!" : "🤔 Your choice matters!"}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


/* ════════════════════════════════════════════════
   LAYOUT COMPONENTS (defined outside for stability)
════════════════════════════════════════════════ */

const BG_GRADIENT = "var(--color-bg)";

/* ── Custom Rich Media SVG Illustrations for the 24 Businesses ── */
function renderBusinessGraphic(bizId: number, color: string, isDark: boolean, size = 66) {
  const gId = `biz-${bizId}`;
  const strokeC = isDark ? "rgba(255,255,255,0.85)" : "#1e293b";

  switch (bizId) {
    case 1: // Lemonade Stand (Fresh iced glass with lemon slices, straw & mint)
      return (
        <svg width={size} height={size} viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id={`${gId}-bg`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#FACC15" stopOpacity="0.12" />
            </radialGradient>
            <linearGradient id={`${gId}-glass`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FEF9C3" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#FDE047" stopOpacity="0.7" />
            </linearGradient>
          </defs>
          <circle cx="36" cy="36" r="32" fill={`url(#${gId}-bg)`} />
          {/* Glass */}
          <path d="M24 22h24l-3.5 36h-17L24 22z" fill={`url(#${gId}-glass)`} stroke={color} strokeWidth="3" strokeLinejoin="round" />
          {/* Liquid level */}
          <path d="M26 30h20l-2.5 26h-15L26 30z" fill="#FACC15" opacity="0.85" />
          {/* Ice Cubes */}
          <rect x="29" y="34" width="7" height="7" rx="1.5" fill="#FFFFFF" opacity="0.8" stroke="#FEF08A" strokeWidth="1" />
          <rect x="36" y="42" width="6" height="6" rx="1.5" fill="#FFFFFF" opacity="0.8" stroke="#FEF08A" strokeWidth="1" />
          {/* Striped Straw */}
          <path d="M44 10l-10 44" stroke="#EF4444" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M43 14l-2 3M39 24l-2 3M35 34l-2 3" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
          {/* Lemon Wheel on Rim */}
          <circle cx="23" cy="22" r="9" fill="#FACC15" stroke="#EAB308" strokeWidth="2.5" />
          <circle cx="23" cy="22" r="7" fill="#FEF08A" />
          <circle cx="23" cy="22" r="2" fill="#CA8A04" />
          <path d="M23 15v14M16 22h14M18 17l10 10M18 27l10-10" stroke="#CA8A04" strokeWidth="1.2" strokeLinecap="round" />
          {/* Mint Leaf */}
          <path d="M46 16c2-4 7-4 9-2s2 7-2 9-7 0-7-7z" fill="#22C55E" stroke="#15803D" strokeWidth="1.5" />
          {/* Sparkle */}
          <circle cx="50" cy="36" r="1.5" fill="#FDE047" />
          <circle cx="16" cy="40" r="1.5" fill="#FDE047" />
        </svg>
      );

    case 2: // Dog Walking (Cute happy puppy with floppy ears & golden paw medal)
      return (
        <svg width={size} height={size} viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id={`${gId}-bg`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#86EFAC" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#22C55E" stopOpacity="0.1" />
            </radialGradient>
          </defs>
          <circle cx="36" cy="36" r="32" fill={`url(#${gId}-bg)`} />
          {/* Floppy Left Ear */}
          <path d="M19 28c-4 8-1 18 4 19s8-6 6-13-6-8-10-6z" fill="#B45309" stroke="#78350F" strokeWidth="2" />
          {/* Floppy Right Ear */}
          <path d="M53 28c4 8 1 18-4 19s-8-6-6-13 6-8 10-6z" fill="#B45309" stroke="#78350F" strokeWidth="2" />
          {/* Dog Head */}
          <circle cx="36" cy="35" r="18" fill="#FBBF24" stroke="#D97706" strokeWidth="2.5" />
          {/* Snout */}
          <ellipse cx="36" cy="40" rx="9" ry="7" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
          <ellipse cx="36" cy="37" rx="3.5" ry="2.5" fill="#1E293B" />
          {/* Mouth & Tongue */}
          <path d="M36 39.5v3M33 42.5c1.5 1.5 4.5 1.5 6 0" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M35 44c0 2 1 3 2 3s2-1 2-3" fill="#F43F5E" />
          {/* Eyes */}
          <circle cx="29" cy="32" r="2.5" fill="#1E293B" />
          <circle cx="43" cy="32" r="2.5" fill="#1E293B" />
          <circle cx="28" cy="31" r="0.8" fill="#FFFFFF" />
          <circle cx="42" cy="31" r="0.8" fill="#FFFFFF" />
          {/* Collar & Gold Tag */}
          <path d="M26 51c3 3 17 3 20 0" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" />
          <circle cx="36" cy="55" r="4" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
          {/* Leash Loop */}
          <path d="M40 54c8 3 16 0 16-8s-6-10-10-6" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </svg>
      );

    case 3: // Art Shop (Painter's wooden palette with vibrant paints & brush)
      return (
        <svg width={size} height={size} viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id={`${gId}-bg`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FCA5A5" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0.1" />
            </radialGradient>
          </defs>
          <circle cx="36" cy="36" r="32" fill={`url(#${gId}-bg)`} />
          {/* Wooden Palette */}
          <path d="M20 48c-7-7-6-20 2-27s21-7 29 0c6 5 8 13 4 19-3 4-7 4-8 1s-1-7-6-8-10 1-11 6c-1 5 1 9-3 12s-4-1-7-3z" fill="#FDE68A" stroke="#D97706" strokeWidth="3" strokeLinejoin="round" />
          {/* Thumb Hole */}
          <ellipse cx="44" cy="41" rx="3.5" ry="4.5" fill={isDark ? "#0F172A" : "#FFFFFF"} stroke="#D97706" strokeWidth="2" />
          {/* Paint dollops */}
          <circle cx="25" cy="27" r="4" fill="#EF4444" />
          <circle cx="35" cy="22" r="4" fill="#3B82F6" />
          <circle cx="45" cy="27" r="4" fill="#F59E0B" />
          <circle cx="27" cy="38" r="3.5" fill="#10B981" />
          <circle cx="33" cy="46" r="3" fill="#8B5CF6" />
          {/* Paint Brush across palette */}
          <g transform="rotate(-30 46 22)">
            <rect x="44" y="8" width="5" height="28" rx="2" fill="#B45309" stroke="#78350F" strokeWidth="1.5" />
            <rect x="43.5" y="34" width="6" height="5" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
            <path d="M43.5 39c0 4 3 7 3 7s3-3 3-7h-6z" fill="#3B82F6" />
          </g>
        </svg>
      );

    case 4: // Cookie Bakery (Golden chocolate chip cookie with chef hat)
      return (
        <svg width={size} height={size} viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id={`${gId}-bg`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FDBA74" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#F97316" stopOpacity="0.12" />
            </radialGradient>
          </defs>
          <circle cx="36" cy="36" r="32" fill={`url(#${gId}-bg)`} />
          {/* Big Crunchy Cookie */}
          <path d="M36 17c-13.8 0-25 11.2-25 25s11.2 22 25 22 25-9.8 25-22c0-2.5-.4-4.8-1.2-7-1.8.8-3.9 1.2-6.1 1.2-6.5 0-11.8-5.3-11.8-11.8 0-3.3 1.4-6.3 3.6-8.4-4-1.3-8.2-2-12.5-2z" fill="#F59E0B" stroke="#B45309" strokeWidth="3" strokeLinejoin="round" />
          {/* Chocolate Chunks */}
          <circle cx="24" cy="34" r="3.5" fill="#451A03" />
          <circle cx="33" cy="27" r="3.2" fill="#451A03" />
          <circle cx="31" cy="46" r="3.8" fill="#451A03" />
          <circle cx="44" cy="43" r="3.2" fill="#451A03" />
          <circle cx="23" cy="48" r="2.5" fill="#451A03" />
          <circle cx="43" cy="53" r="2.2" fill="#451A03" />
          {/* Golden Texture Specks */}
          <circle cx="38" cy="36" r="1.5" fill="#FDE68A" />
          <circle cx="28" cy="23" r="1.2" fill="#FDE68A" />
          {/* Mini Chef Hat on Top Left */}
          <path d="M22 17c-2-4 1-9 5-8 2-3 7-3 9 0 4-1 7 4 5 8h-19z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
          <rect x="23" y="17" width="13" height="3" fill="#E2E8F0" rx="1" />
        </svg>
      );

    case 5: // Car Wash (Shiny blue sports roadster with soapy foam & sparkles)
      return (
        <svg width={size} height={size} viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id={`${gId}-bg`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.12" />
            </radialGradient>
          </defs>
          <circle cx="36" cy="36" r="32" fill={`url(#${gId}-bg)`} />
          {/* Car Body */}
          <path d="M14 42l4-12h36l5 12h3v12h-6v-3H16v3h-6V42h4z" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2.5" strokeLinejoin="round" />
          {/* Windshield */}
          <path d="M20 30h32l3 9H17l3-9z" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.5" />
          {/* Headlights */}
          <circle cx="17" cy="46" r="3" fill="#FDE047" stroke="#EAB308" strokeWidth="1" />
          <circle cx="55" cy="46" r="3" fill="#FDE047" stroke="#EAB308" strokeWidth="1" />
          {/* Wheels */}
          <circle cx="22" cy="54" r="6" fill="#1E293B" stroke="#475569" strokeWidth="2" />
          <circle cx="22" cy="54" r="2.5" fill="#CBD5E1" />
          <circle cx="50" cy="54" r="6" fill="#1E293B" stroke="#475569" strokeWidth="2" />
          <circle cx="50" cy="54" r="2.5" fill="#CBD5E1" />
          {/* Soap Foam Bubbles */}
          <circle cx="26" cy="24" r="5" fill="#FFFFFF" opacity="0.9" stroke="#38BDF8" strokeWidth="1.5" />
          <circle cx="35" cy="21" r="6.5" fill="#FFFFFF" opacity="0.95" stroke="#38BDF8" strokeWidth="1.5" />
          <circle cx="45" cy="23" r="5" fill="#FFFFFF" opacity="0.9" stroke="#38BDF8" strokeWidth="1.5" />
          <circle cx="16" cy="22" r="3" fill="#E0F2FE" />
          <circle cx="58" cy="26" r="3" fill="#E0F2FE" />
          {/* Clean Sparkles */}
          <path d="M48 14l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z" fill="#FDE047" />
          <path d="M12 34l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z" fill="#38BDF8" />
        </svg>
      );

    case 6: // Plant Shop (Terracotta planter with rich tropical monstera leaves)
      return (
        <svg width={size} height={size} viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id={`${gId}-bg`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#6EE7B7" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.12" />
            </radialGradient>
          </defs>
          <circle cx="36" cy="36" r="32" fill={`url(#${gId}-bg)`} />
          {/* Terracotta Pot */}
          <path d="M23 44h26l-3.5 19H26.5L23 44z" fill="#EA580C" stroke="#C2410C" strokeWidth="2.5" strokeLinejoin="round" />
          <rect x="21" y="40" width="30" height="6" rx="2" fill="#F97316" stroke="#C2410C" strokeWidth="2" />
          {/* Center Stem */}
          <path d="M36 42V20" stroke="#15803D" strokeWidth="3" strokeLinecap="round" />
          {/* Left Monstera Leaf */}
          <path d="M36 32c-10-2-18-8-16-18s16 4 16 18z" fill="#16A34A" stroke="#14532D" strokeWidth="2" />
          <circle cx="28" cy="22" r="1.5" fill={`url(#${gId}-bg)`} />
          <circle cx="24" cy="27" r="1.2" fill={`url(#${gId}-bg)`} />
          {/* Right Monstera Leaf */}
          <path d="M36 28c10-2 18-8 16-18s-16 4-16 18z" fill="#22C55E" stroke="#14532D" strokeWidth="2" />
          <circle cx="44" cy="18" r="1.5" fill={`url(#${gId}-bg)`} />
          <circle cx="48" cy="24" r="1.2" fill={`url(#${gId}-bg)`} />
          {/* Top Sprout Leaf */}
          <path d="M36 22c-5-8 5-13 7-10s2 8-7 10z" fill="#4ADE80" stroke="#15803D" strokeWidth="1.8" />
          {/* Dew Drop */}
          <circle cx="42" cy="15" r="1.5" fill="#E0F2FE" />
        </svg>
      );

    case 7: // YouTube Channel (3D Studio screen with bright red play button & stars)
      return (
        <svg width={size} height={size} viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id={`${gId}-bg`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FCA5A5" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0.12" />
            </radialGradient>
            <linearGradient id={`${gId}-screen`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#B91C1C" />
            </linearGradient>
          </defs>
          <circle cx="36" cy="36" r="32" fill={`url(#${gId}-bg)`} />
          {/* Television / Video Screen Box */}
          <rect x="12" y="18" width="48" height="34" rx="10" fill={`url(#${gId}-screen)`} stroke="#991B1B" strokeWidth="3" />
          {/* Screen Gloss Glare */}
          <path d="M14 24c0-3 2-4 5-4h34c3 0 5 1 5 4L14 36v-12z" fill="#FFFFFF" opacity="0.2" />
          {/* Play Triangle */}
          <path d="M31 27l14 8-14 8V27z" fill="#FFFFFF" stroke="#FEE2E2" strokeWidth="1.5" strokeLinejoin="round" />
          {/* Pedestal Stand */}
          <path d="M30 52l-3 8h18l-3-8h-12z" fill="#64748B" stroke="#334155" strokeWidth="2" strokeLinejoin="round" />
          {/* Signal Broadcast Waves */}
          <path d="M52 14c4 4 4 10 0 14" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
          {/* Subscriber Star */}
          <path d="M19 14l1.5 3 3 0.5-2.2 2 0.5 3-2.8-1.5-2.8 1.5 0.5-3-2.2-2 3-0.5L19 14z" fill="#FACC15" />
        </svg>
      );

    case 8: // Tutoring (Hardcover books stack with graduation cap & pencil)
      return (
        <svg width={size} height={size} viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id={`${gId}-bg`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#D8B4FE" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#9333EA" stopOpacity="0.12" />
            </radialGradient>
          </defs>
          <circle cx="36" cy="36" r="32" fill={`url(#${gId}-bg)`} />
          {/* Bottom Book (Blue) */}
          <rect x="16" y="48" width="40" height="9" rx="2" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" />
          <rect x="20" y="50" width="34" height="5" fill="#F8FAFC" />
          {/* Middle Book (Emerald) */}
          <rect x="19" y="39" width="35" height="9" rx="2" fill="#10B981" stroke="#047857" strokeWidth="2" />
          <rect x="22" y="41" width="30" height="5" fill="#F8FAFC" />
          {/* Top Book (Purple) */}
          <rect x="22" y="30" width="30" height="9" rx="2" fill="#8B5CF6" stroke="#6D28D9" strokeWidth="2" />
          <rect x="25" y="32" width="25" height="5" fill="#F8FAFC" />
          {/* Graduation Cap */}
          <polygon points="36,12 55,20 36,28 17,20" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
          <path d="M26 24v5c0 3 4.5 5 10 5s10-2 10-5v-5" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
          <circle cx="36" cy="20" r="2" fill="#FACC15" />
          <path d="M36 20l12 6v6" stroke="#FACC15" strokeWidth="1.8" strokeLinecap="round" />
          {/* Yellow Pencil */}
          <g transform="rotate(45 52 42)">
            <rect x="50" y="28" width="5" height="20" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.2" />
            <polygon points="50,48 55,48 52.5,53" fill="#FDE047" stroke="#CA8A04" strokeWidth="1" />
            <polygon points="51.5,51 53.5,51 52.5,53" fill="#1E293B" />
          </g>
        </svg>
      );

    case 9: // Pizza Delivery (Hot pizza slice with melted cheese, pepperoni & speed lines)
      return (
        <svg width={size} height={size} viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id={`${gId}-bg`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FECACA" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0.12" />
            </radialGradient>
          </defs>
          <circle cx="36" cy="36" r="32" fill={`url(#${gId}-bg)`} />
          {/* Pizza Slice Body */}
          <path d="M16 20l38 9L36 61 16 20z" fill="#FACC15" stroke="#D97706" strokeWidth="2.5" strokeLinejoin="round" />
          {/* Puffy Baked Crust */}
          <path d="M14 17c6-3 36 6 42 9" stroke="#B45309" strokeWidth="6.5" strokeLinecap="round" />
          {/* Melted Cheese Swirl */}
          <path d="M20 28c4 2 8-1 12 2s6 3 10 1" stroke="#FEF08A" strokeWidth="3" strokeLinecap="round" />
          {/* Pepperoni Slices */}
          <circle cx="28" cy="30" r="4.5" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
          <circle cx="40" cy="37" r="4.5" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
          <circle cx="33" cy="48" r="4" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
          {/* Basil Leaf */}
          <path d="M24 40c-2-3 2-6 5-4s1 6-5 4z" fill="#22C55E" />
          {/* Speedy Delivery streaks */}
          <path d="M12 28h-6M10 36h-4M14 44h-5" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 10: // Clothing Store (Mannequin in tailored suit with boutique bag)
      return (
        <svg width={size} height={size} viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id={`${gId}-bg`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FBCFE8" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#EC4899" stopOpacity="0.12" />
            </radialGradient>
          </defs>
          <circle cx="36" cy="36" r="32" fill={`url(#${gId}-bg)`} />
          {/* Mannequin Neck & Torso */}
          <path d="M31 16h10v6h-10v-6z" fill="#E2E8F0" />
          <path d="M24 24h24l-3 26H27L24 24z" fill="#1E3A8A" stroke="#172554" strokeWidth="2.5" strokeLinejoin="round" />
          {/* White Shirt V-Neck & Pink Tie */}
          <polygon points="31,24 41,24 36,36" fill="#FFFFFF" />
          <polygon points="35,28 37,28 36,38" fill="#EC4899" />
          {/* Blazer Lapels */}
          <path d="M24 24l9 12M48 24l-9 12" stroke="#172554" strokeWidth="2.5" />
          {/* Stand */}
          <path d="M36 50v14M28 64h16" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
          {/* Boutique Shopping Bag */}
          <g transform="translate(42, 38)">
            <rect x="0" y="6" width="16" height="18" rx="2" fill="#F43F5E" stroke="#BE123C" strokeWidth="1.5" />
            <path d="M4 6V3a4 4 0 0 1 8 0v3" stroke="#FFE4E6" strokeWidth="2" strokeLinecap="round" fill="none" />
            <circle cx="8" cy="15" r="2.5" fill="#FFE4E6" />
          </g>
        </svg>
      );

    case 11: // Tech Repair (Smartphone with glowing circuit board & gold gear)
      return (
        <svg width={size} height={size} viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id={`${gId}-bg`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#CBD5E1" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#475569" stopOpacity="0.15" />
            </radialGradient>
          </defs>
          <circle cx="36" cy="36" r="32" fill={`url(#${gId}-bg)`} />
          {/* Smartphone Body */}
          <rect x="18" y="14" width="28" height="46" rx="5" fill="#0F172A" stroke="#334155" strokeWidth="2.5" />
          <rect x="21" y="18" width="22" height="38" rx="2" fill="#1E293B" />
          {/* Motherboard Circuit Traces */}
          <path d="M25 24h6v8M28 36v6h8M35 28v-4h4" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="31" cy="32" r="1.5" fill="#38BDF8" />
          <circle cx="36" cy="42" r="1.5" fill="#38BDF8" />
          {/* Golden Gear Wheel */}
          <g transform="translate(44, 30)">
            <circle cx="10" cy="10" r="9" fill="#F59E0B" stroke="#B45309" strokeWidth="2" strokeDasharray="5 3" />
            <circle cx="10" cy="10" r="4.5" fill={isDark ? "#0F172A" : "#FFFFFF"} stroke="#B45309" strokeWidth="1.8" />
          </g>
          {/* Precision Screwdriver */}
          <g transform="rotate(-40 38 18)">
            <rect x="36" y="4" width="4" height="16" rx="1" fill="#EF4444" stroke="#B91C1C" strokeWidth="1" />
            <rect x="37" y="20" width="2" height="8" fill="#E2E8F0" />
          </g>
        </svg>
      );

    case 12: // Food Truck (Cute gourmet truck with awning & burger rooftop sign)
      return (
        <svg width={size} height={size} viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id={`${gId}-bg`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFEDD5" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#EA580C" stopOpacity="0.12" />
            </radialGradient>
          </defs>
          <circle cx="36" cy="36" r="32" fill={`url(#${gId}-bg)`} />
          {/* Truck Body */}
          <path d="M12 28h32l12 10v18H12V28z" fill="#F97316" stroke="#C2410C" strokeWidth="2.5" strokeLinejoin="round" />
          {/* Serving Window */}
          <rect x="18" y="34" width="18" height="12" rx="1.5" fill="#FEF3C7" stroke="#C2410C" strokeWidth="1.8" />
          {/* Striped Awning */}
          <path d="M16 32h22l2 4H14l2-4z" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
          <path d="M19 32v4M25 32v4M31 32v4M37 32v4" stroke="#FFFFFF" strokeWidth="1.5" />
          {/* Wheels */}
          <circle cx="22" cy="56" r="6" fill="#1E293B" stroke="#475569" strokeWidth="2" />
          <circle cx="22" cy="56" r="2.5" fill="#E2E8F0" />
          <circle cx="46" cy="56" r="6" fill="#1E293B" stroke="#475569" strokeWidth="2" />
          <circle cx="46" cy="56" r="2.5" fill="#E2E8F0" />
          {/* Rooftop Burger Sign */}
          <g transform="translate(24, 15)">
            <path d="M2 7c0-4 4-6 8-6s8 2 8 6H2z" fill="#F59E0B" stroke="#B45309" strokeWidth="1.2" />
            <rect x="2" y="7" width="16" height="2" fill="#22C55E" />
            <rect x="2" y="9" width="16" height="3" rx="1" fill="#78350F" />
            <path d="M2 12c0 2 3 3 8 3s8-1 8-3H2z" fill="#F59E0B" stroke="#B45309" strokeWidth="1.2" />
          </g>
        </svg>
      );

    case 13: // Photography (Vintage DSLR camera with glass lens glare & flash)
      return (
        <svg width={size} height={size} viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id={`${gId}-bg`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#D7CCC8" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#795548" stopOpacity="0.15" />
            </radialGradient>
          </defs>
          <circle cx="36" cy="36" r="32" fill={`url(#${gId}-bg)`} />
          {/* Camera Body */}
          <rect x="12" y="24" width="48" height="32" rx="6" fill="#4E342E" stroke="#271C19" strokeWidth="2.5" />
          {/* Grip Texture Band */}
          <rect x="12" y="30" width="14" height="20" fill="#3E2723" />
          {/* Top Prism Flash */}
          <path d="M26 24l4-8h12l4 8H26z" fill="#3E2723" stroke="#271C19" strokeWidth="2" strokeLinejoin="round" />
          <rect x="44" y="20" width="6" height="4" rx="1" fill="#F59E0B" />
          {/* Big Lens Assembly */}
          <circle cx="36" cy="40" r="14" fill="#212121" stroke="#E0E0E0" strokeWidth="2.5" />
          <circle cx="36" cy="40" r="10" fill="#0D47A1" stroke="#1976D2" strokeWidth="1.5" />
          {/* Anti-reflective Glass Glare */}
          <path d="M30 34c3-3 8-3 11 0" stroke="#80D8FF" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="41" cy="44" r="2" fill="#E040FB" />
          {/* Flash Flare */}
          <path d="M52 16l1.5 3 3 1.5-3 1.5-1.5 3-1.5-3-3-1.5 3-1.5 1.5-3z" fill="#FFF59D" />
        </svg>
      );

    case 14: // Online Store (Glowing shopping cart loaded with shipping parcels)
      return (
        <svg width={size} height={size} viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id={`${gId}-bg`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#A5F3FC" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.12" />
            </radialGradient>
          </defs>
          <circle cx="36" cy="36" r="32" fill={`url(#${gId}-bg)`} />
          {/* Stacked Parcels inside */}
          <rect x="25" y="18" width="14" height="12" rx="1.5" fill="#D97706" stroke="#92400E" strokeWidth="1.5" />
          <line x1="32" y1="18" x2="32" y2="30" stroke="#FDE68A" strokeWidth="1.5" />
          <rect x="36" y="22" width="15" height="13" rx="1.5" fill="#0284C7" stroke="#0369A1" strokeWidth="1.5" />
          <line x1="43.5" y1="22" x2="43.5" y2="35" stroke="#E0F2FE" strokeWidth="1.5" />
          {/* Shopping Cart Basket Frame */}
          <path d="M14 18h8l7 24h24l6-16H25" fill="none" stroke="#0891B2" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M29 32h24M27 26h28" stroke="#0891B2" strokeWidth="1.8" />
          {/* Cart Wheels */}
          <circle cx="31" cy="48" r="4.5" fill="#1E293B" stroke="#0891B2" strokeWidth="2" />
          <circle cx="31" cy="48" r="1.5" fill="#FFFFFF" />
          <circle cx="49" cy="48" r="4.5" fill="#1E293B" stroke="#0891B2" strokeWidth="2" />
          <circle cx="49" cy="48" r="1.5" fill="#FFFFFF" />
          {/* Wi-Fi Checkout Waves */}
          <path d="M48 12c3-3 7-3 10 0" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 15: // Coffee Shop (Steaming porcelain cup with barista latte heart art)
      return (
        <svg width={size} height={size} viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id={`${gId}-bg`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#D7CCC8" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#6F4E37" stopOpacity="0.15" />
            </radialGradient>
          </defs>
          <circle cx="36" cy="36" r="32" fill={`url(#${gId}-bg)`} />
          {/* Saucer */}
          <ellipse cx="36" cy="56" rx="22" ry="4.5" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
          {/* Coffee Mug */}
          <path d="M20 28h32l-3.5 24H23.5L20 28z" fill="#FFFFFF" stroke="#6F4E37" strokeWidth="3" strokeLinejoin="round" />
          {/* Mug Handle */}
          <path d="M52 32c5 0 8 3 8 7s-3 7-8 7" stroke="#6F4E37" strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* Rich Dark Espresso Surface */}
          <ellipse cx="36" cy="30" rx="14" ry="4" fill="#4E342E" />
          {/* Foam Heart Art */}
          <path d="M36 32c-2-2-4-1-4 1 0 2 4 4 4 4s4-2 4-4c0-2-2-3-4-1z" fill="#FFF8E1" />
          {/* Aromatic Steam Ribbons */}
          <path d="M28 20c0-4 4-5 4-9m8 9c0-4 4-5 4-9" stroke="#A855F7" strokeWidth="2.5" strokeLinecap="round" />
          {/* Roasted Coffee Bean */}
          <g transform="translate(14, 46) rotate(-25)">
            <ellipse cx="4" cy="4" rx="4" ry="3" fill="#3E2723" />
            <path d="M1 4s3-2 6 0" stroke="#8D6E63" strokeWidth="1" />
          </g>
        </svg>
      );

    case 16: // Ice Cream Cart (Double-scoop waffle cone with sprinkles & cherry)
      return (
        <svg width={size} height={size} viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id={`${gId}-bg`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FBCFE8" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#F43F5E" stopOpacity="0.12" />
            </radialGradient>
          </defs>
          <circle cx="36" cy="36" r="32" fill={`url(#${gId}-bg)`} />
          {/* Waffle Cone with Crosshatch */}
          <polygon points="25,38 47,38 36,63" fill="#F59E0B" stroke="#B45309" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M28 42l15 15M44 42L29 57M33 39l10 10M39 39l-8 8" stroke="#D97706" strokeWidth="1.2" strokeLinecap="round" />
          {/* Bottom Scoop (Mint Green) */}
          <circle cx="36" cy="33" r="12" fill="#86EFAC" stroke="#15803D" strokeWidth="2" />
          {/* Top Scoop (Strawberry Pink) */}
          <circle cx="36" cy="22" r="11" fill="#FB7185" stroke="#E11D48" strokeWidth="2" />
          {/* Chocolate Fudge Drip */}
          <path d="M26 22c2 3 5 1 7 4 2-3 5-1 7-4" stroke="#451A03" strokeWidth="2" strokeLinecap="round" fill="none" />
          {/* Sprinkles */}
          <line x1="32" y1="18" x2="34" y2="19" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
          <line x1="39" y1="18" x2="41" y2="17" stroke="#FACC15" strokeWidth="2" strokeLinecap="round" />
          <line x1="35" y1="26" x2="37" y2="25" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" />
          {/* Glossy Red Cherry on Top */}
          <circle cx="36" cy="11" r="4.5" fill="#DC2626" stroke="#991B1B" strokeWidth="1.5" />
          <circle cx="34.5" cy="9.5" r="1.2" fill="#FFFFFF" />
          <path d="M37 10c2-4 6-5 9-3" stroke="#15803D" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </svg>
      );

    case 17: // Flower Shop (Luxurious botanical bouquet wrapped with satin ribbon)
      return (
        <svg width={size} height={size} viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id={`${gId}-bg`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#E9D5FF" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#A855F7" stopOpacity="0.12" />
            </radialGradient>
          </defs>
          <circle cx="36" cy="36" r="32" fill={`url(#${gId}-bg)`} />
          {/* Paper Wrap Cones */}
          <polygon points="26,38 46,38 36,62" fill="#FDE68A" stroke="#D97706" strokeWidth="2" strokeLinejoin="round" />
          {/* Stems */}
          <path d="M33 38L36 60M39 38L36 60" stroke="#15803D" strokeWidth="2" />
          {/* Foliage Leaves */}
          <path d="M22 28c4-6 10-4 10 2s-6 6-10-4z" fill="#22C55E" stroke="#15803D" strokeWidth="1.5" />
          <path d="M50 28c-4-6-10-4-10 2s6 6 10-4z" fill="#22C55E" stroke="#15803D" strokeWidth="1.5" />
          {/* Red Rose */}
          <circle cx="28" cy="24" r="8" fill="#F43F5E" stroke="#BE123C" strokeWidth="2" />
          <circle cx="28" cy="24" r="4" fill="#FDA4AF" />
          {/* Golden Sunflower */}
          <circle cx="44" cy="24" r="8" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
          <circle cx="44" cy="24" r="4" fill="#78350F" />
          {/* Center Violet Blossom */}
          <circle cx="36" cy="30" r="7" fill="#C084FC" stroke="#7E22CE" strokeWidth="2" />
          <circle cx="36" cy="30" r="3" fill="#FACC15" />
          {/* Satin Ribbon Bow */}
          <path d="M32 46c-4-4-6 0-3 3l7 1-7 1c-3 3-1 7 3 3l4-4 4 4c4 4 6 0 3-3l-7-1 7-1c3-3 1-7-3-3l-4 4z" fill="#EC4899" />
          <circle cx="36" cy="46" r="2.5" fill="#BE123C" />
        </svg>
      );

    case 18: // Pet Grooming (Bubble bath clawfoot tub with fluffy puppy)
      return (
        <svg width={size} height={size} viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id={`${gId}-bg`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#CCFBF1" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#14B8A6" stopOpacity="0.12" />
            </radialGradient>
          </defs>
          <circle cx="36" cy="36" r="32" fill={`url(#${gId}-bg)`} />
          {/* Cute White Puppy */}
          <circle cx="36" cy="28" r="12" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="2" />
          <circle cx="27" cy="24" r="4.5" fill="#CBD5E1" />
          <circle cx="45" cy="24" r="4.5" fill="#CBD5E1" />
          <circle cx="32" cy="27" r="2" fill="#1E293B" />
          <circle cx="40" cy="27" r="2" fill="#1E293B" />
          <ellipse cx="36" cy="31" rx="2.5" ry="1.8" fill="#F43F5E" />
          {/* Bath Tub */}
          <path d="M14 36h44c0 10-8 18-22 18S14 46 14 36z" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2.5" />
          <rect x="12" y="34" width="48" height="5" rx="2.5" fill="#0284C7" />
          {/* Tub Feet */}
          <path d="M20 54l-3 6M52 54l3 6" stroke="#0284C7" strokeWidth="3" strokeLinecap="round" />
          {/* Foamy Soap Bubbles */}
          <circle cx="22" cy="32" r="5" fill="#FFFFFF" opacity="0.95" stroke="#38BDF8" strokeWidth="1.5" />
          <circle cx="30" cy="31" r="4" fill="#FFFFFF" opacity="0.95" stroke="#38BDF8" strokeWidth="1.5" />
          <circle cx="43" cy="32" r="5" fill="#FFFFFF" opacity="0.95" stroke="#38BDF8" strokeWidth="1.5" />
          <circle cx="36" cy="17" r="3.5" fill="#FFFFFF" stroke="#38BDF8" strokeWidth="1.5" />
          {/* Trimming Scissors Badge */}
          <g transform="translate(48, 14)">
            <circle cx="4" cy="4" r="3" stroke="#F59E0B" strokeWidth="1.5" fill="none" />
            <circle cx="4" cy="12" r="3" stroke="#F59E0B" strokeWidth="1.5" fill="none" />
            <path d="M6 5l8 6M6 11l8-6" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" />
          </g>
        </svg>
      );

    case 19: // Game Dev Studio (Futuristic purple gamepad with glowing buttons)
      return (
        <svg width={size} height={size} viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id={`${gId}-bg`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#E9D5FF" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#7E22CE" stopOpacity="0.15" />
            </radialGradient>
            <linearGradient id={`${gId}-pad`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#4C1D95" />
            </linearGradient>
          </defs>
          <circle cx="36" cy="36" r="32" fill={`url(#${gId}-bg)`} />
          {/* Ergonomic Game Controller */}
          <path d="M22 24h28c6 0 12 5 12 11 0 8-6 19-11 19-4 0-7-5-9-9h-12c-2 4-5 9-9 9-5 0-11-11-11-19 0-6 6-11 12-11z" fill={`url(#${gId}-pad)`} stroke="#3B0764" strokeWidth="2.5" strokeLinejoin="round" />
          {/* Directional Pad */}
          <path d="M21 34h6m-3-3v6" stroke="#E2E8F0" strokeWidth="3.5" strokeLinecap="round" />
          {/* Action Buttons (ABXY) */}
          <circle cx="48" cy="31" r="2.2" fill="#F43F5E" />
          <circle cx="53" cy="35" r="2.2" fill="#FBBF24" />
          <circle cx="48" cy="39" r="2.2" fill="#22C55E" />
          <circle cx="43" cy="35" r="2.2" fill="#38BDF8" />
          {/* Dual Analog Thumbsticks */}
          <circle cx="28" cy="42" r="4.5" fill="#1E1B4B" stroke="#6D28D9" strokeWidth="1.5" />
          <circle cx="44" cy="42" r="4.5" fill="#1E1B4B" stroke="#6D28D9" strokeWidth="1.5" />
          {/* LED Glow Center Bar */}
          <rect x="33" y="27" width="6" height="2" rx="1" fill="#38BDF8" />
          {/* Pixel power-up stars */}
          <rect x="16" y="14" width="3" height="3" fill="#FACC15" />
          <rect x="52" y="14" width="3" height="3" fill="#FACC15" />
        </svg>
      );

    case 20: // Fitness Trainer (Chrome heavy dumbbell with lightning energy)
      return (
        <svg width={size} height={size} viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id={`${gId}-bg`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FCE7F3" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#BE185D" stopOpacity="0.12" />
            </radialGradient>
          </defs>
          <circle cx="36" cy="36" r="32" fill={`url(#${gId}-bg)`} />
          {/* Heavy Steel Barbell Shaft */}
          <rect x="18" y="33" width="36" height="6" rx="2" fill="#94A3B8" stroke="#475569" strokeWidth="1.8" />
          {/* Knurled Grip Center */}
          <rect x="30" y="32" width="12" height="8" rx="2" fill="#E2E8F0" stroke="#475569" strokeWidth="1.5" />
          <line x1="33" y1="33" x2="33" y2="39" stroke="#94A3B8" strokeWidth="1" />
          <line x1="36" y1="33" x2="36" y2="39" stroke="#94A3B8" strokeWidth="1" />
          <line x1="39" y1="33" x2="39" y2="39" stroke="#94A3B8" strokeWidth="1" />
          {/* Left Weight Plates */}
          <rect x="20" y="22" width="5" height="28" rx="2.5" fill="#DB2777" stroke="#9D174D" strokeWidth="2" />
          <rect x="14" y="25" width="5" height="22" rx="2" fill="#BE185D" stroke="#831843" strokeWidth="2" />
          <rect x="9" y="30" width="4" height="12" rx="1.5" fill="#475569" stroke="#1E293B" strokeWidth="1.5" />
          {/* Right Weight Plates */}
          <rect x="47" y="22" width="5" height="28" rx="2.5" fill="#DB2777" stroke="#9D174D" strokeWidth="2" />
          <rect x="53" y="25" width="5" height="22" rx="2" fill="#BE185D" stroke="#831843" strokeWidth="2" />
          <rect x="59" y="30" width="4" height="12" rx="1.5" fill="#475569" stroke="#1E293B" strokeWidth="1.5" />
          {/* Energy Lightning Bolts */}
          <polygon points="36,12 33,20 37,20 34,28 41,18 37,18" fill="#FACC15" stroke="#CA8A04" strokeWidth="1" />
          <circle cx="28" cy="16" r="1.5" fill="#F43F5E" />
          <circle cx="46" cy="18" r="1.5" fill="#F43F5E" />
        </svg>
      );

    case 21: // Cleaning Service (Spray bottle with foaming nozzle & brilliant sparkles)
      return (
        <svg width={size} height={size} viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id={`${gId}-bg`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#CFFAFE" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.12" />
            </radialGradient>
          </defs>
          <circle cx="36" cy="36" r="32" fill={`url(#${gId}-bg)`} />
          {/* Spray Bottle Container */}
          <path d="M24 30h16l4 28H20l4-28z" fill="#38BDF8" stroke="#0284C7" strokeWidth="2.5" strokeLinejoin="round" />
          {/* Measurement Lines */}
          <line x1="26" y1="38" x2="31" y2="38" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          <line x1="25" y1="44" x2="30" y2="44" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          <line x1="24" y1="50" x2="29" y2="50" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          {/* Bottle Neck & Trigger Head */}
          <rect x="29" y="24" width="6" height="6" fill="#0284C7" />
          <path d="M26 18h14l4 6h-7l-1 5h-4l-1-5h-5z" fill="#0284C7" />
          {/* Spray Nozzle */}
          <rect x="42" y="19" width="6" height="4" rx="1" fill="#FACC15" stroke="#CA8A04" strokeWidth="1" />
          {/* Ergonomic Trigger */}
          <path d="M37 26c2 3 5 4 7 3" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* Yellow Microfiber Sponge */}
          <rect x="42" y="44" width="16" height="14" rx="4" fill="#FDE047" stroke="#CA8A04" strokeWidth="2" />
          <circle cx="47" cy="49" r="1.2" fill="#EAB308" />
          <circle cx="53" cy="53" r="1.2" fill="#EAB308" />
          {/* Clean Sparkles */}
          <path d="M52 16l1.5 3 3 1.5-3 1.5-1.5 3-1.5-3-3-1.5 3-1.5 1.5-3z" fill="#FACC15" />
          <path d="M16 22l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z" fill="#38BDF8" />
        </svg>
      );

    case 22: // Jewelry Shop (Flawless sparkling diamond in luxury velvet box)
      return (
        <svg width={size} height={size} viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id={`${gId}-bg`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FED7AA" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#EA580C" stopOpacity="0.12" />
            </radialGradient>
            <linearGradient id={`${gId}-gem`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#E0F2FE" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
          </defs>
          <circle cx="36" cy="36" r="32" fill={`url(#${gId}-bg)`} />
          {/* Velvet Display Box Base */}
          <polygon points="18,48 54,48 48,60 24,60" fill="#991B1B" stroke="#7F1D1D" strokeWidth="2" />
          <ellipse cx="36" cy="48" rx="18" ry="4" fill="#DC2626" />
          {/* Brilliant Cut Diamond */}
          <polygon points="24,24 48,24 56,36 36,54 16,36" fill={`url(#${gId}-gem)`} stroke="#0284C7" strokeWidth="2.5" strokeLinejoin="round" />
          {/* Diamond Facets */}
          <polygon points="30,24 42,24 46,36 26,36" fill="#F0F9FF" opacity="0.8" />
          <polygon points="36,36 26,36 36,54" fill="#38BDF8" opacity="0.6" />
          <polygon points="36,36 46,36 36,54" fill="#0284C7" opacity="0.6" />
          <line x1="24" y1="24" x2="26" y2="36" stroke="#0284C7" strokeWidth="1.5" />
          <line x1="48" y1="24" x2="46" y2="36" stroke="#0284C7" strokeWidth="1.5" />
          {/* Radiant Shimmer Sparkles */}
          <path d="M48 16l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4z" fill="#FDE047" />
          <circle cx="20" cy="18" r="2" fill="#FDE047" />
        </svg>
      );

    case 23: // Catering (Polished silver cloche banquet platter with fragrant steam)
      return (
        <svg width={size} height={size} viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id={`${gId}-bg`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FECACA" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#DC2626" stopOpacity="0.12" />
            </radialGradient>
          </defs>
          <circle cx="36" cy="36" r="32" fill={`url(#${gId}-bg)`} />
          {/* Serving Platter Base Tray */}
          <ellipse cx="36" cy="52" rx="26" ry="6" fill="#CBD5E1" stroke="#64748B" strokeWidth="2.5" />
          <ellipse cx="36" cy="51" rx="22" ry="4" fill="#F8FAFC" />
          {/* Banquet Cloche Dome Cover */}
          <path d="M16 48c0-14 9-22 20-22s20 8 20 22H16z" fill="#E2E8F0" stroke="#64748B" strokeWidth="2.5" strokeLinejoin="round" />
          {/* Dome Chrome Highlight Curve */}
          <path d="M22 44c2-9 7-14 14-14" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
          {/* Golden Handle Knob */}
          <circle cx="36" cy="23" r="3.5" fill="#FACC15" stroke="#CA8A04" strokeWidth="2" />
          <path d="M34 26h4v3h-4z" fill="#CA8A04" />
          {/* Swirling Gourmet Steam Ribbons */}
          <path d="M28 17c-2-3 2-6 2-9m8 9c-2-3 2-6 2-9m8 9c-2-3 2-6 2-9" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 24: // Subscription Box (Mystery emerald package with gold ribbon & treasure glow)
      return (
        <svg width={size} height={size} viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id={`${gId}-bg`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#A7F3D0" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.12" />
            </radialGradient>
            <linearGradient id={`${gId}-box`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
          </defs>
          <circle cx="36" cy="36" r="32" fill={`url(#${gId}-bg)`} />
          {/* Parcel Box Body */}
          <rect x="16" y="28" width="40" height="28" rx="4" fill={`url(#${gId}-box)`} stroke="#064E3B" strokeWidth="2.5" />
          {/* Vertical Golden Satin Ribbon */}
          <rect x="33" y="28" width="6" height="28" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.2" />
          {/* Horizontal Golden Ribbon */}
          <rect x="16" y="39" width="40" height="6" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.2" />
          {/* Open Top Lid Slightly Cracked */}
          <path d="M14 26l22-5 22 5-3 5H17l-3-5z" fill="#059669" stroke="#064E3B" strokeWidth="2" strokeLinejoin="round" />
          {/* Satin Ribbon Bow */}
          <path d="M36 21c-4-4-8-2-6 2s6 2 6 2 4-2 6-2-2-6-6-2z" fill="#FDE047" stroke="#CA8A04" strokeWidth="1.5" />
          <circle cx="36" cy="21" r="2.5" fill="#EAB308" />
          {/* Golden Treasure Sparkles Beaming Out */}
          <path d="M26 14l1.5 3 3 1.5-3 1.5-1.5 3-1.5-3-3-1.5 3-1.5 1.5-3z" fill="#FDE047" />
          <path d="M46 12l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z" fill="#FACC15" />
        </svg>
      );

    default:
      return null;
  }
}

const SCREEN_STYLE: CSSProperties = {
  minHeight: "100vh", width: "100%",
  background: "var(--color-bg)",
  color: "var(--color-text)",
  fontFamily: "var(--font-family)",
  display: "flex", flexDirection: "column",
  alignItems: "center", justifyContent: "center",
  padding: "18px 14px", position: "relative", overflow: "hidden",
};

function Blobs() {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "-10%", right: "-5%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, #FFC80022 0%, transparent 70%)" }} />
      <div style={{ position: "absolute", bottom: "-10%", left: "-5%", width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, #58CC0218 0%, transparent 70%)" }} />
      <div style={{ position: "absolute", top: "40%", left: "-8%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, #A855F715 0%, transparent 70%)" }} />
    </div>
  );
}

/* ── Dark Mode Detector Hook ── */
function useDark() {
  const [isDark, setIsDark] = React.useState(() => document.documentElement.classList.contains("dark"));

  React.useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return isDark;
}

function GlassCard({ children, style = {} }: GlassCardProps) {
  return (
    <div
      className="card"
      style={{
        maxWidth: 460, width: "100%",
        textAlign: "center",
        position: "relative",
        zIndex: 1,
        ...style
      }}>{children}</div>
  );
}

function LangToggle({ lang, setLang, t }: LangToggleProps) {
  return (
    <button onClick={() => setLang(l => l === "en" ? "ar" : "en")} style={{
      fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "0.72rem",
      padding: "5px 14px", background: "rgba(255,255,255,0.9)",
      border: "2px solid #e2e8f0", borderRadius: 999, cursor: "pointer",
      color: "#475569", boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      flexShrink: 0,
    }}>{t.lang}</button>
  );
}

/* ════════════════════════════════════════════════
   MAIN GAME COMPONENT
════════════════════════════════════════════════ */
export default function ProfitsPatrol() {
  const { i18n } = useTranslation();
  const lang: "en" | "ar" = (i18n.language && i18n.language.startsWith("ar")) ? "ar" : "en";
  const t = T[lang];
  const dir: "rtl" | "ltr" = lang === "ar" ? "rtl" : "ltr";

  const isDark = useDark();
  const c_title = isDark ? "#f8fafc" : "#1e293b";
  const c_body = isDark ? "#cbd5e1" : "#475569";
  const c_sub = isDark ? "#94a3b8" : "#64748b";
  const c_border = isDark ? "rgba(255,255,255,0.08)" : "#f1f5f9";

  const [phase, setPhase] = useState<string>("start");
  const [business, setBusiness] = useState<Business | null>(null);
  const [coins, setCoins] = useState<number>(0);
  const [deck, setDeck] = useState<GameCard[]>([]);
  const [currentCard, setCurrentCard] = useState<GameCard | null>(null);
  const [flipped, setFlipped] = useState<boolean>(false);
  const [resultDelta, setResultDelta] = useState<number>(0);
  const [resultMsg, setResultMsg] = useState<string>("");
  const [resultFact, setResultFact] = useState<string>("");
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [turn, setTurn] = useState<number>(0);
  const [log, setLog] = useState<string[]>([]);
  const [burst, setBurst] = useState<boolean>(false);
  const [upgrades, setUpgrades] = useState<Record<string, boolean>>({});
  const [insActive, setInsActive] = useState<boolean>(false);
  const [robActive, setRobActive] = useState<boolean>(false);
  const [loanTurns, setLoanTurns] = useState<number>(0);
  const [shopMsg, setShopMsg] = useState<string>("");
  const [bizFilter, setBizFilter] = useState<string>("all");
  const [showRulesModal, setShowRulesModal] = useState<boolean>(false);


  /* ── Derived upgrade effects ── */
  const franchiseMult = upgrades.franchise ? 2 : 1;
  const basePassive = (upgrades.staff ? 3 : 0) + (upgrades.online ? 5 : 0) + (upgrades.delivery ? 2 : 0);
  const passiveIncome = basePassive * franchiseMult;
  const boostBonus = (upgrades.marketing ? 5 : 0) + (upgrades.loyalty ? 3 : 0) + (upgrades.delivery ? 3 : 0) + (upgrades.brand ? 2 : 0);
  const challengeMult = upgrades.accountant ? 0.5 : 1;
  const challengeFlat = upgrades.supplies ? 3 : 0;
  const quizBonus = (upgrades.course ? 1 : 0) + (upgrades.brand ? 5 : 0);
  const quizMult = upgrades.course ? 2 : 1;
  const [vipCount, setVipCount] = useState<number>(0);

  const addLog = (msg: string) => setLog(p => [msg, ...p].slice(0, 5));

  /* ── Core effect applier ── */
  const applyEffect = (baseEffect: number, msgIn: string, factText: string | undefined, isBoost: boolean) => {
    let fx = baseEffect;
    let msg = msgIn;

    if (baseEffect < 0) {
      if (robActive) {
        fx = 0; msg = t.robBlocked;
        setRobActive(false);
        setUpgrades(p => { const n = { ...p }; delete n.robot; return n; });
      } else if (insActive) {
        fx = 0; msg = t.insBlocked;
        setInsActive(false);
        setUpgrades(p => { const n = { ...p }; delete n.insurance; return n; });
      } else {
        fx = Math.round(Math.min(0, (baseEffect + challengeFlat) * challengeMult));
      }
    } else if (baseEffect > 0 && isBoost) {
      fx = baseEffect + boostBonus;
      // VIP club: every 3rd boost = +10 bonus
      if (upgrades.vip) {
        const newCount = vipCount + 1;
        if (newCount % 3 === 0) { fx += 10; }
        setVipCount(newCount);
      }
    }

    // Loan repayment
    let loanDeduct = 0;
    if (loanTurns > 0) {
      loanDeduct = LOAN_REPAY;
      setLoanTurns(lt => lt - 1);
    }

    const nc = coins + fx - loanDeduct;
    setCoins(nc);
    setResultDelta(fx - loanDeduct);
    setResultMsg(msg);
    setResultFact(factText || "");
    setBurst(true);
    setTimeout(() => setBurst(false), 900);
    addLog(`${fx >= 0 ? "+" : ""}${fx}PP${loanDeduct > 0 ? ` −${loanDeduct}PP loan` : ""}`);

    if (nc >= WIN) { setTimeout(() => { setPhase("win"); }, 400); }
    else if (nc <= LOSE) { setTimeout(() => { setPhase("lose"); }, 400); }
    else { setPhase("result"); setTurn(p => p + 1); }
  };

  const drawCard = () => {
    let cur = coins;
    // Passive income
    if (passiveIncome > 0) {
      cur = coins + passiveIncome;
      setCoins(cur);
      addLog(`+${passiveIncome}PP ${t.passive}`);
      if (cur >= WIN) { setPhase("win"); return; }
    }
    const d = deck.length > 0 ? deck : shuffle(DECK);
    const [card, ...rest] = d;
    setDeck(rest.length === 0 ? shuffle(DECK) : rest);
    setCurrentCard(card);
    setFlipped(false);
    setPhase("card");
    setTimeout(() => setFlipped(true), 380);
  };

  const handleCardAction = () => {
    const c = currentCard;
    if (!c) return;
    const fact = lang === "ar" ? (c.arFact || c.fact) : c.fact;
    const cardTitle = lang === "ar" ? (c.ar || c.title) : c.title;
    if (c.kind === "challenge" || c.kind === "boost") {
      applyEffect(c.effect ?? 0, (c.effect ?? 0) > 0 ? "🎉" : "😬", fact, c.kind === "boost");
    } else if (c.kind === "decision") { setPhase("decision"); }
    else if (c.kind === "skill") { setQuizAnswer(null); setPhase("quiz"); }
  };

  const handleDecision = (opt: CardOption) => {
    if (!currentCard) return;
    const fact = lang === "ar" ? (currentCard.arFact || currentCard.fact) : currentCard.fact;
    const msg = lang === "ar" ? (opt.outAr || opt.outEn) : opt.outEn;
    const ctitle = lang === "ar" ? (currentCard.ar || currentCard.title) : currentCard.title;
    const clabel = lang === "ar" ? (opt.ar || opt.en) : opt.en;
    applyEffect(opt.effect, msg, fact, opt.effect > 0);
  };

  const handleQuiz = (idx: number) => {
    if (!currentCard) return;
    setQuizAnswer(idx);
    const exp = lang === "ar" ? (currentCard.arExplain || currentCard.explain) : currentCard.explain;
    const opts = lang === "ar" ? (currentCard.arOpts || currentCard.opts) : currentCard.opts;
    const correct = idx === currentCard.answer;
    const qTitle = lang === "ar" ? (currentCard.arTitle || currentCard.title) : currentCard.title;
    const q = lang === "ar" ? (currentCard.arQ || currentCard.q) : currentCard.q;
    const baseReward = (currentCard.reward ?? 0) * quizMult + (correct ? quizBonus : 0);
    if (correct) { setTimeout(() => applyEffect(baseReward, t.correctMsg, exp, false), 750); }
    else { setTimeout(() => applyEffect(0, t.wrongMsg, exp, false), 750); }
  };

  const startGame = (biz: Business) => {
    setBusiness(biz); setCoins(biz.coins); setDeck(shuffle(DECK));
    setTurn(0); setUpgrades({}); setInsActive(false); setRobActive(false);
    setLoanTurns(0); setVipCount(0);
    setLog([`🚀 ${lang === "ar" ? biz.ar : biz.name} — ${biz.coins}PP`]);
    setPhase("playing");
  };

  const resetGame = () => {
    setBusiness(null); setCoins(0); setCurrentCard(null);
    setUpgrades({}); setInsActive(false); setRobActive(false);
    setLoanTurns(0); setVipCount(0);
    setPhase("start"); setLog([]); setTurn(0);
  };

  const buyUpgrade = (item: ShopItem) => {
    if (upgrades[item.id]) return;
    if (item.type === "loan") {
      if (loanTurns > 0) return;
      setCoins(c => c + 25);
      setLoanTurns(LOAN_TURNS);
      setShopMsg(t.loanTaken);
      setTimeout(() => setShopMsg(""), 3000);
      return;
    }
    if (coins < item.cost) return;
    setCoins(c => c - item.cost);
    setUpgrades(p => ({ ...p, [item.id]: true }));
    if (item.id === "insurance") setInsActive(true);
    if (item.id === "robot") setRobActive(true);
    setShopMsg(`${lang === "ar" ? item.ar : item.en} ${lang === "ar" ? "تم الشراء! 🎉" : "purchased! 🎉"}`);
    setTimeout(() => setShopMsg(""), 2500);
  };


  /* ── DNA Layout ── */
  const SCREEN: CSSProperties = {
    ...SCREEN_STYLE,
    background: isDark ? "linear-gradient(160deg, #090d16 0%, #0d0b21 50%, #070c1d 100%)" : BG_GRADIENT,
    direction: dir,
  };





  /* ════════ START SCREEN ════════ */
  if (phase === "start") return (
    <div style={{
      minHeight: "100vh",
      width: "100%",
      background: isDark ? "linear-gradient(160deg, #070b16 0%, #0d1226 50%, #070c1d 100%)" : "linear-gradient(160deg, #f0fdf4 0%, #eff6ff 50%, #fefce8 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "20px 16px 80px",
      boxSizing: "border-box",
      direction: dir,
      position: "relative"
    }}>
      <style>{CSS}</style>
      <Blobs />

      {/* Ambient background watermark of all characters */}
      <div style={{
        position: "fixed",
        inset: 0,
        backgroundImage: "url('/images/card-academy/characters_academy_bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center 20%",
        opacity: isDark ? 0.08 : 0.04,
        pointerEvents: "none",
        zIndex: 0,
        filter: "blur(4px)"
      }} />

      <div style={{
        position: "relative",
        zIndex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 22,
        width: "100%",
        maxWidth: 1040,
        animation: "popIn 0.5s ease-out"
      }}>

        {/* ── 1. CINEMATIC HERO BANNER WITH ALL CHARACTERS ── */}
        <div style={{
          width: "100%",
          borderRadius: 26,
          overflow: "hidden",
          position: "relative",
          border: isDark ? "2px solid rgba(255,200,0,0.35)" : "2px solid rgba(255,200,0,0.5)",
          boxShadow: isDark ? "0 20px 50px rgba(0,0,0,0.7), 0 0 30px rgba(255,200,0,0.15)" : "0 20px 45px rgba(30,58,138,0.15), 0 0 25px rgba(255,200,0,0.2)",
          background: "#080e24",
        }}>
          <div style={{ position: "relative", width: "100%", aspectRatio: "21 / 9", maxHeight: 320, overflow: "hidden" }}>
            <img 
              src="/images/card-academy/characters_academy_bg.jpg" 
              alt="Profits Patrol Card Academy - All Mascot Characters" 
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 28%", display: "block" }} 
            />
            {/* Ambient gradients */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(8,14,36,0.35) 0%, transparent 40%, rgba(8,14,36,0.9) 100%)", pointerEvents: "none" }} />
            
            {/* Top Brand Crest Badge */}
            <div style={{ position: "absolute", top: 14, [lang === "ar" ? "right" : "left"]: 16, display: "flex", alignItems: "center", gap: 10, background: "rgba(8,14,36,0.85)", border: "1.5px solid rgba(255,200,0,0.5)", borderRadius: 999, padding: "6px 14px", backdropFilter: "blur(8px)", boxShadow: "0 4px 14px rgba(0,0,0,0.4)" }}>
              <img src="/images/logo.png" alt="Ollie Logo" style={{ width: 26, height: 26, objectFit: "contain" }} />
              <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, color: "#FFD700", fontSize: "0.82rem", letterSpacing: 0.8, textTransform: "uppercase" }}>
                {lang === "ar" ? "دورية الأرباح • أبطال ريادة الأعمال" : "Profits Patrol • All Characters"}
              </span>
            </div>

            {/* Bottom Title inside Banner */}
            <div style={{ position: "absolute", bottom: 14, [lang === "ar" ? "right" : "left"]: 18, [lang === "ar" ? "left" : "right"]: 18, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 10 }}>
              <div>
                <div style={{ fontFamily: "Nunito, Tajawal, sans-serif", fontWeight: 900, fontSize: "1.5rem", color: "#FFFFFF", textShadow: "0 2px 10px rgba(0,0,0,0.9)", lineHeight: 1.2 }}>
                  {lang === "ar" ? "أكاديمية الكروت: تحدي رواد الأعمال الصغار!" : "Card Academy: The Entrepreneur Challenge!"}
                </div>
                <div style={{ color: "#FDE047", fontSize: "0.85rem", fontWeight: 700, fontFamily: "Tajawal, sans-serif", textShadow: "0 1px 4px rgba(0,0,0,0.8)", marginTop: 4 }}>
                  {lang === "ar" ? "أولي 🦉 • ريما 🦊 • فيلو 🐘 • ريكس 🦖 • كامي 🦎" : "Ollie 🦉 • Reema 🦊 • Filo 🐘 • Rex 🦖 • Kami 🦎"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── 2. HEADER TITLE & FEATURE PILLS ── */}
        <div style={{ textAlign: "center", maxWidth: 740 }}>
          <h1 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "2.5rem", color: c_title, lineHeight: 1.1, textTransform: "uppercase", letterSpacing: -0.5, marginTop: 4 }}>
            {lang === "ar" ? (
              <>
                أكاديمية <span style={{ background: "linear-gradient(135deg, #FFC800, #f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>الكروت الاستراتيجية</span>
              </>
            ) : (
              <>
                Strategic <span style={{ background: "linear-gradient(135deg, #FFC800, #f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Card Academy</span>
              </>
            )}
          </h1>
          <p style={{ fontFamily: "Tajawal, sans-serif", fontWeight: 700, color: c_sub, fontSize: "0.98rem", marginTop: 6, lineHeight: 1.6 }}>
            {lang === "ar" 
              ? "لعبة كروت استراتيجية تفاعلية تمكنك من تأسيس مشروعك الخاص، اتخاذ القرارات المصيرية، وتحقيق الثروة مع أبطال الدورية!" 
              : "An interactive card game to build your business venture, make smart decisions, and achieve wealth with the Patrol team!"}
          </p>

          {/* Feature pills */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginTop: 12 }}>
            {[
              { e: "🏪", l: lang === "ar" ? "24 مشروعاً" : "24 Businesses", c: "#F59E0B" },
              { e: "🟢", l: lang === "ar" ? "كروت تعزيز" : "Boost Cards", c: "#58CC02" },
              { e: "🔴", l: lang === "ar" ? "كروت تحدي" : "Challenge Cards", c: "#ef4444" },
              { e: "🟣", l: lang === "ar" ? "كروت مهارة" : "Skill Quizzes", c: "#A855F7" },
              { e: "🛍️", l: lang === "ar" ? "14 تطوير متجر" : "14 Upgrades", c: "#2B70C9" },
            ].map(x => (
              <div key={x.l} style={{ display: "flex", alignItems: "center", gap: 5, background: isDark ? "rgba(30,41,59,0.75)" : "rgba(255,255,255,0.95)", border: `2px solid ${x.c}33`, borderRadius: 999, padding: "5px 14px", fontSize: "0.8rem", fontWeight: 800, color: c_title, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                {x.e} {x.l}
              </div>
            ))}
          </div>
        </div>

        {/* ── 3. TOP ACTION BAR (START + RULES) ── */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", alignItems: "center", width: "100%", maxWidth: 540 }}>
          <Btn onClick={() => setPhase("pick")} color="#58CC02" textColor="#fff" size="lg" full>
            {lang === "ar" ? "🚀 ابدأ اللعب واختيار مشروعك الآن!" : "🚀 Start Playing & Pick Venture!"}
          </Btn>
          <button
            onClick={() => setShowRulesModal(true)}
            style={{
              background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)",
              border: `1.5px solid ${isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.14)"}`,
              borderRadius: 14,
              padding: "10px 18px",
              fontFamily: "Tajawal, sans-serif",
              fontWeight: 800,
              fontSize: "0.88rem",
              color: c_title,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              transition: "all 0.2s ease"
            }}
          >
            <span>📖</span>
            <span>{lang === "ar" ? "دليل القواعد التفصيلي" : "Detailed Rules Guide"}</span>
          </button>
        </div>

        {/* ── 4. HOW TO PLAY (شرح طريقة اللعب) ── */}
        <div style={{
          width: "100%",
          background: isDark ? "rgba(15,23,42,0.8)" : "rgba(255,255,255,0.95)",
          border: isDark ? "2px solid rgba(255,200,0,0.3)" : "2px solid rgba(255,200,0,0.4)",
          borderRadius: 24,
          padding: "22px 24px",
          boxShadow: isDark ? "0 10px 30px rgba(0,0,0,0.5)" : "0 10px 30px rgba(0,0,0,0.06)",
          backdropFilter: "blur(12px)",
          boxSizing: "border-box"
        }}>
          {/* Section Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, borderBottom: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.06)", paddingBottom: 14, flexWrap: "wrap", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: "linear-gradient(135deg, #FFC800, #F59E0B)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", boxShadow: "0 4px 12px rgba(245,158,11,0.35)", flexShrink: 0 }}>
                🎮
              </div>
              <div>
                <h2 style={{ fontFamily: "Nunito, Tajawal, sans-serif", fontWeight: 900, fontSize: "1.4rem", color: c_title, margin: 0 }}>
                  {lang === "ar" ? "طريقة اللعب: كيف تبني مشروعك وتربح؟" : "How to Play: Build Your Venture & Win!"}
                </h2>
                <p style={{ fontFamily: "Tajawal, sans-serif", fontSize: "0.85rem", color: c_sub, margin: 0, marginTop: 3 }}>
                  {lang === "ar" ? "4 خطوات بسيطة لتصبح رائد أعمال ناجح وتصل لهدف الثروة" : "4 simple steps to become a successful young entrepreneur"}
                </p>
              </div>
            </div>
            <div style={{ background: "rgba(88,204,2,0.15)", border: "1.5px solid #58CC02", borderRadius: 999, padding: "5px 14px", color: "#58CC02", fontWeight: 900, fontSize: "0.78rem", fontFamily: "Nunito, sans-serif" }}>
              {lang === "ar" ? "قواعد سهلة وممتعة 🎯" : "Easy & Fun Rules 🎯"}
            </div>
          </div>

          {/* 4 Steps Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(215px, 1fr))", gap: 14 }}>
            {/* Step 1 */}
            <div style={{ background: isDark ? "rgba(30,41,59,0.7)" : "#ffffff", border: "1.5px solid #F59E0B44", borderRadius: 18, padding: "16px 14px", display: "flex", flexDirection: "column", gap: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "2rem" }}>🏪</span>
                <span style={{ background: "#F59E0B", color: "#fff", fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "0.72rem", borderRadius: 999, padding: "2px 10px" }}>
                  {lang === "ar" ? "الخطوة 1" : "STEP 1"}
                </span>
              </div>
              <div style={{ fontFamily: "Tajawal, sans-serif", fontWeight: 900, fontSize: "1.05rem", color: c_title }}>
                {lang === "ar" ? "اختر مشروعك التجاري" : "Choose Your Business"}
              </div>
              <div style={{ fontFamily: "Tajawal, sans-serif", fontSize: "0.82rem", color: c_body, lineHeight: 1.55 }}>
                {lang === "ar" 
                  ? "اختر من بين 24 فكرة مشروع حقيقي (كشك عصير، بيتزا، جيم، برمجة...). تبدأ برأس مال محدد وعدد جولات لإنهاء التحدي وتحقيق هدف 80PP." 
                  : "Pick from 24 ventures (Lemonade Stand, Pizza, Arcade...). Each starts with a starting budget and turns to reach 80PP."}
              </div>
            </div>

            {/* Step 2 */}
            <div style={{ background: isDark ? "rgba(30,41,59,0.7)" : "#ffffff", border: "1.5px solid #8B5CF644", borderRadius: 18, padding: "16px 14px", display: "flex", flexDirection: "column", gap: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "2rem" }}>🎴</span>
                <span style={{ background: "#8B5CF6", color: "#fff", fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "0.72rem", borderRadius: 999, padding: "2px 10px" }}>
                  {lang === "ar" ? "الخطوة 2" : "STEP 2"}
                </span>
              </div>
              <div style={{ fontFamily: "Tajawal, sans-serif", fontWeight: 900, fontSize: "1.05rem", color: c_title }}>
                {lang === "ar" ? "اسحب كروت الأحداث" : "Draw Strategy Cards"}
              </div>
              <div style={{ fontFamily: "Tajawal, sans-serif", fontSize: "0.82rem", color: c_body, lineHeight: 1.55 }}>
                {lang === "ar" 
                  ? "في كل جولة تسحب كرتاً جديداً: 🟢 تعزيز (أرباح فورية)، 🔴 تحدي (أزمات السوق)، 🟣 مهارة (أسئلة استثمارية تكسبك كوينز)، و🟡 قرارات مصيرية." 
                  : "Each turn draw a card: 🟢 Boost (instant profit), 🔴 Challenge (market crises), 🟣 Skill (quiz for free coins), 🟡 Decisions!"}
              </div>
            </div>

            {/* Step 3 */}
            <div style={{ background: isDark ? "rgba(30,41,59,0.7)" : "#ffffff", border: "1.5px solid #2563EB44", borderRadius: 18, padding: "16px 14px", display: "flex", flexDirection: "column", gap: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "2rem" }}>🛍️</span>
                <span style={{ background: "#2563EB", color: "#fff", fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "0.72rem", borderRadius: 999, padding: "2px 10px" }}>
                  {lang === "ar" ? "الخطوة 3" : "STEP 3"}
                </span>
              </div>
              <div style={{ fontFamily: "Tajawal, sans-serif", fontWeight: 900, fontSize: "1.05rem", color: c_title }}>
                {lang === "ar" ? "استثمر في التطويرات" : "Buy Shop Upgrades"}
              </div>
              <div style={{ fontFamily: "Tajawal, sans-serif", fontSize: "0.82rem", color: c_body, lineHeight: 1.55 }}>
                {lang === "ar" 
                  ? "استغل أرباحك في المتجر لشراء 14 ترقية (حملات إعلانات، معدات ذكية، تأمين تجاري). التطويرات تمنحك دخلاً سلبياً تلقائياً في كل جولة!" 
                  : "Reinvest coins into 14 upgrades (Ads, automated gear, insurance). Upgrades produce automated passive income every single turn!"}
              </div>
            </div>

            {/* Step 4 */}
            <div style={{ background: isDark ? "rgba(30,41,59,0.7)" : "#ffffff", border: "1.5px solid #10B98144", borderRadius: 18, padding: "16px 14px", display: "flex", flexDirection: "column", gap: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "2rem" }}>🏆</span>
                <span style={{ background: "#10B981", color: "#fff", fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "0.72rem", borderRadius: 999, padding: "2px 10px" }}>
                  {lang === "ar" ? "الخطوة 4" : "STEP 4"}
                </span>
              </div>
              <div style={{ fontFamily: "Tajawal, sans-serif", fontWeight: 900, fontSize: "1.05rem", color: c_title }}>
                {lang === "ar" ? "حقق هدف الثروة وتخرج" : "Reach Target & Graduate"}
              </div>
              <div style={{ fontFamily: "Tajawal, sans-serif", fontSize: "0.82rem", color: c_body, lineHeight: 1.55 }}>
                {lang === "ar" 
                  ? "وازن بين الإنفاق والاستثمار وتجنب الإفلاس. عندما تصل إلى 80PP كوين قبل انتهاء الأدوار، تتوج كـ 'الرئيس التنفيذي المستقبلي'!" 
                  : "Balance spending & saving while avoiding debt. Reach 80PP coins before turns run out to graduate as a Future CEO!"}
              </div>
            </div>
          </div>
        </div>

        {/* ── 5. NEW CARD BACK & CARD TYPES SHOWCASE ── */}
        <div style={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
          gap: 16,
          alignItems: "stretch"
        }}>
          {/* Card Back Preview Box */}
          <div style={{
            background: isDark ? "rgba(15,23,42,0.8)" : "rgba(255,255,255,0.95)",
            border: "2px solid #F59E0B66",
            borderRadius: 24,
            padding: "20px",
            boxShadow: isDark ? "0 10px 30px rgba(0,0,0,0.5)" : "0 10px 30px rgba(0,0,0,0.06)",
            display: "flex",
            alignItems: "center",
            gap: 18,
            flexWrap: "wrap"
          }}>
            {/* 3D Preview of Card Back */}
            <div style={{
              width: 125,
              height: 180,
              borderRadius: 16,
              overflow: "hidden",
              border: "3px solid #F59E0B",
              boxShadow: "0 12px 28px rgba(0,0,0,0.5), 0 0 20px rgba(245,158,11,0.4)",
              flexShrink: 0,
              position: "relative",
              transform: "rotate(-3deg)",
              transition: "transform 0.3s ease"
            }}>
              <img 
                src="/images/card-academy/card_back.jpg" 
                alt="Official Patrol Card Back" 
                style={{ width: "100%", height: "100%", objectFit: "cover" }} 
              />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)", padding: "10px 4px 4px", textAlign: "center" }}>
                <span style={{ fontSize: "0.6rem", color: "#FFD700", fontWeight: 900, fontFamily: "Nunito, sans-serif" }}>PROFITS PATROL</span>
              </div>
            </div>

            <div style={{ flex: 1, minWidth: 170 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(245,158,11,0.15)", border: "1px solid #F59E0B", borderRadius: 999, padding: "3px 10px", color: "#F59E0B", fontWeight: 900, fontSize: "0.72rem", fontFamily: "Nunito, sans-serif" }}>
                <span>🛡️</span>
                <span>{lang === "ar" ? "ضهر الكارت الرسمي الجديد" : "New Official Card Back"}</span>
              </div>
              <h3 style={{ fontFamily: "Tajawal, sans-serif", fontWeight: 900, fontSize: "1.15rem", color: c_title, margin: "8px 0 4px" }}>
                {lang === "ar" ? "مستوحى من هوية وشعار الدورية" : "Inspired by Profits Patrol Logo"}
              </h3>
              <p style={{ fontFamily: "Tajawal, sans-serif", fontSize: "0.82rem", color: c_sub, margin: 0, lineHeight: 1.55 }}>
                {lang === "ar" 
                  ? "صُمم ضهر الكارت ليعكس الشعار الأصلي بدقة؛ يتوسطه رمز البومة 'أولي' داخل ميدالية ذهبية براقة، مع إطار ملكي وزخارف كروت الألعاب العالمية لتعيش أجواء التحدي الحقيقي!" 
                  : "Redesigned to honor our brand identity! Centered by mascot Ollie in a gold medallion with luxury trading card filigree borders."}
              </p>
            </div>
          </div>

          {/* The 4 Card Types Overview */}
          <div style={{
            background: isDark ? "rgba(15,23,42,0.8)" : "rgba(255,255,255,0.95)",
            border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.08)",
            borderRadius: 24,
            padding: "20px",
            boxShadow: isDark ? "0 10px 30px rgba(0,0,0,0.5)" : "0 10px 30px rgba(0,0,0,0.06)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 12
          }}>
            <div style={{ fontFamily: "Tajawal, sans-serif", fontWeight: 900, fontSize: "1.05rem", color: c_title }}>
              {lang === "ar" ? "🗂️ بطاقات اللعبة في المجموعة:" : "🗂️ Card Types in the Deck:"}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div style={{ background: "rgba(88,204,2,0.12)", border: "1px solid #58CC0244", borderRadius: 14, padding: "10px" }}>
                <div style={{ fontWeight: 900, fontSize: "0.85rem", color: "#58CC02", fontFamily: "Tajawal, sans-serif" }}>🟢 {lang === "ar" ? "كروت التعزيز" : "Boost Cards"}</div>
                <div style={{ fontSize: "0.74rem", color: c_sub, marginTop: 3 }}>{lang === "ar" ? "صفقات رابحة وزيادة فورية للكاش" : "Instant profit & deals"}</div>
              </div>
              <div style={{ background: "rgba(239,68,68,0.12)", border: "1px solid #ef444444", borderRadius: 14, padding: "10px" }}>
                <div style={{ fontWeight: 900, fontSize: "0.85rem", color: "#ef4444", fontFamily: "Tajawal, sans-serif" }}>🔴 {lang === "ar" ? "كروت التحدي" : "Challenge Cards"}</div>
                <div style={{ fontSize: "0.74rem", color: c_sub, marginTop: 3 }}>{lang === "ar" ? "أزمات عمل تتطلب حلولاً وحماية" : "Market risk & problems"}</div>
              </div>
              <div style={{ background: "rgba(168,85,247,0.12)", border: "1px solid #A855F744", borderRadius: 14, padding: "10px" }}>
                <div style={{ fontWeight: 900, fontSize: "0.85rem", color: "#A855F7", fontFamily: "Tajawal, sans-serif" }}>🟣 {lang === "ar" ? "كروت المهارة" : "Skill Quizzes"}</div>
                <div style={{ fontSize: "0.74rem", color: c_sub, marginTop: 3 }}>{lang === "ar" ? "أسئلة ذكاء تكسبك كوينز مجانية" : "Quiz questions for coins"}</div>
              </div>
              <div style={{ background: "rgba(37,99,235,0.12)", border: "1px solid #2563EB44", borderRadius: 14, padding: "10px" }}>
                <div style={{ fontWeight: 900, fontSize: "0.85rem", color: "#2563EB", fontFamily: "Tajawal, sans-serif" }}>🛍️ {lang === "ar" ? "14 تطوير متجر" : "14 Upgrades"}</div>
                <div style={{ fontSize: "0.74rem", color: c_sub, marginTop: 3 }}>{lang === "ar" ? "معدات تمنحك دخلاً سلبياً كل دور" : "Passive income per turn"}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── 6. MASCOT MENTORS ADVICE (نصائح أبطال الدورية) ── */}
        <div style={{
          width: "100%",
          background: isDark ? "rgba(15,23,42,0.8)" : "rgba(255,255,255,0.95)",
          border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.08)",
          borderRadius: 24,
          padding: "20px",
          boxShadow: isDark ? "0 10px 30px rgba(0,0,0,0.5)" : "0 10px 30px rgba(0,0,0,0.06)",
          boxSizing: "border-box"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <span style={{ fontSize: "1.4rem" }}>💡</span>
            <div>
              <h3 style={{ fontFamily: "Tajawal, sans-serif", fontWeight: 900, fontSize: "1.15rem", color: c_title, margin: 0 }}>
                {lang === "ar" ? "نصائح استراتيجية من أبطال دورية الأرباح:" : "Strategy Tips from Profits Patrol Mentors:"}
              </h3>
              <p style={{ fontFamily: "Tajawal, sans-serif", fontSize: "0.8rem", color: c_sub, margin: 0 }}>
                {lang === "ar" ? "استمع لخبرات كل شخصية لمساعدتك في اتخاذ أفضل القرارات" : "Listen to each character's expert advice to win the game"}
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
            {[
              {
                name: lang === "ar" ? "أولي 🦉 (القيادة)" : "Ollie 🦉 (CEO)",
                role: lang === "ar" ? "التخطيط والسيولة" : "Cash Strategy",
                color: "#F59E0B",
                tip: lang === "ar" ? "لا تنفق كل كاشك في البداية؛ احتفظ باحتياطي للطوارئ!" : "Always keep an emergency cash buffer for sudden challenges!"
              },
              {
                name: lang === "ar" ? "ريما 🦊 (التسويق)" : "Reema 🦊 (Marketing)",
                role: lang === "ar" ? "جذب الزبائن" : "Brand Growth",
                color: "#f97316",
                tip: lang === "ar" ? "استثمر مبكراً في التسويق لتضاعف أرباح كروت التعزيز!" : "Invest early in marketing to multiply your boost card gains!"
              },
              {
                name: lang === "ar" ? "فيلو 🐘 (العمليات)" : "Filo 🐘 (Operations)",
                role: lang === "ar" ? "الدخل السلبي" : "Passive Income",
                color: "#3b82f6",
                tip: lang === "ar" ? "التطويرات هي مفتاح الفوز؛ تمنحك كوينز تلقائية كل جولة!" : "Upgrades are key — they generate automatic coins every turn!"
              },
              {
                name: lang === "ar" ? "ريكس 🦖 (الاستثمار)" : "Rex 🦖 (Investor)",
                role: lang === "ar" ? "إدارة المخاطر" : "Risk Management",
                color: "#10b981",
                tip: lang === "ar" ? "احذر من القروض غير المحسوبة وراقب عدد الجولات المتبقية!" : "Watch your turns carefully and don't borrow unless strictly needed!"
              },
              {
                name: lang === "ar" ? "كامي 🦎 (الابتكار)" : "Kami 🦎 (Innovation)",
                role: lang === "ar" ? "المسابقات والمهارات" : "Skill Quizzes",
                color: "#8b5cf6",
                tip: lang === "ar" ? "أسئلة كروت المهارة تمنحك كوينز مجانية، فكّر قبل الإجابة!" : "Skill quizzes give you free coins — think carefully before answering!"
              },
            ].map(m => (
              <div key={m.name} style={{ background: isDark ? "rgba(30,41,59,0.5)" : "#fff", border: `1.5px solid ${m.color}33`, borderRadius: 16, padding: "12px", display: "flex", flexDirection: "column", gap: 5 }}>
                <div style={{ fontWeight: 900, fontSize: "0.85rem", color: m.color, fontFamily: "Tajawal, sans-serif" }}>{m.name}</div>
                <div style={{ fontSize: "0.68rem", color: c_sub, fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>{m.role}</div>
                <div style={{ fontSize: "0.76rem", color: c_body, fontFamily: "Tajawal, sans-serif", lineHeight: 1.4, marginTop: 4 }}>"{m.tip}"</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 7. BOTTOM START CTA BUTTON ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 500, alignItems: "center", marginTop: 8 }}>
          <Btn onClick={() => setPhase("pick")} color="#58CC02" textColor="#fff" size="lg" full>
            {lang === "ar" ? "🚀 جاهز؟ ابدأ اللعب واختيار مشروعك الآن!" : "🚀 Ready? Pick Your Business & Play!"}
          </Btn>
        </div>

        {/* ── 8. DETAILED RULES MODAL ── */}
        {showRulesModal && (
          <div style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(8px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16
          }} onClick={() => setShowRulesModal(false)}>
            <div style={{
              background: isDark ? "#0f172a" : "#ffffff",
              border: "2px solid #FFC800",
              borderRadius: 24,
              padding: "26px",
              maxWidth: 640,
              width: "100%",
              maxHeight: "85vh",
              overflowY: "auto",
              boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
              direction: dir,
              boxSizing: "border-box"
            }} onClick={e => e.stopPropagation()}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, borderBottom: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.08)", paddingBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: "1.8rem" }}>📖</span>
                  <h2 style={{ fontFamily: "Tajawal, sans-serif", fontWeight: 900, fontSize: "1.4rem", color: c_title, margin: 0 }}>
                    {lang === "ar" ? "دليل قواعد أكاديمية الكروت" : "Card Academy Detailed Rules"}
                  </h2>
                </div>
                <button onClick={() => setShowRulesModal(false)} style={{ background: "transparent", border: "none", fontSize: "1.4rem", cursor: "pointer", color: c_sub }}>✕</button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14, fontFamily: "Tajawal, sans-serif", fontSize: "0.9rem", color: c_body, lineHeight: 1.6 }}>
                <div>
                  <h4 style={{ fontWeight: 900, color: "#F59E0B", marginBottom: 4 }}>🎯 الهدف الرئيسي:</h4>
                  <p>{lang === "ar" ? "الوصول إلى 80 كوين (80PP) قبل انتهاء عدد الأدوار المحددة لمشروعك، وتجنب انخفاض الرصيد إلى 0 أو أقل (الإفلاس)." : "Reach 80PP coins before running out of turns, while avoiding dropping to 0 or below (bankruptcy)."}</p>
                </div>

                <div>
                  <h4 style={{ fontWeight: 900, color: "#8B5CF6", marginBottom: 4 }}>🎴 أنواع البطاقات:</h4>
                  <ul style={{ paddingInlineStart: 20 }}>
                    <li><strong style={{ color: "#58CC02" }}>كروت التعزيز (Boost):</strong> تمنحك أرباحاً فورية وفرصاً تسويقية رابحة.</li>
                    <li><strong style={{ color: "#ef4444" }}>كروت التحدي (Challenge):</strong> أزمات ومشاكل تطلب دفع مصاريف ما لم تكن محمياً بالتأمين أو المساعد الذكي.</li>
                    <li><strong style={{ color: "#A855F7" }}>كروت المهارة (Skill Quizzes):</strong> أسئلة مالية واقتصادية تختبر ذكاءك وتمنحك كوينز فورية عند الإجابة الصحيحة.</li>
                    <li><strong style={{ color: "#3b82f6" }}>كروت القرارات (Decisions):</strong> خياران استراتيجيان (أ أو ب) لتقرير مسار عملك.</li>
                  </ul>
                </div>

                <div>
                  <h4 style={{ fontWeight: 900, color: "#2563EB", marginBottom: 4 }}>🛍️ المتجر والتطويرات:</h4>
                  <p>{lang === "ar" ? "يمكنك في أي وقت فتح المتجر وشراء تطويرات تمنحك دخلاً سلبياً تلقائياً في بداية كل دور حتى وإن واجهت تحديات صعبة!" : "Visit the shop anytime to buy upgrades that generate automated passive income at the start of each turn!"}</p>
                </div>

                <div>
                  <h4 style={{ fontWeight: 900, color: "#10b981", marginBottom: 4 }}>💳 القروض البنكية:</h4>
                  <p>{lang === "ar" ? "إذا احتجت لسيولة سريعة، يمكنك الحصول على قرض بقيمة 25PP من المتجر، ويتم تسديده تلقائياً بواقع 5PP لكل دور لمدة 4 أدوار." : "If you need fast cash, take a 25PP loan from the shop. It is automatically repaid at 5PP per turn for 4 turns."}</p>
                </div>
              </div>

              <div style={{ marginTop: 20, textAlign: "center" }}>
                <Btn onClick={() => setShowRulesModal(false)} color="#58CC02" textColor="#fff" size="md">
                  {lang === "ar" ? "✅ فهمت القواعد، هيا لنلعب!" : "✅ Got It, Let's Play!"}
                </Btn>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  /* ════════ PICK BUSINESS ════════ */
  if (phase === "pick") {
    const CATS = [
      { id: "all", label: lang === "ar" ? "الكل" : "All" },
      { id: "food", label: lang === "ar" ? "🍕 طعام" : "🍕 Food", ids: [1, 4, 9, 12, 15, 16, 17, 23] },
      { id: "service", label: lang === "ar" ? "🔧 خدمات" : "🔧 Services", ids: [2, 5, 8, 11, 18, 20, 21] },
      { id: "digital", label: lang === "ar" ? "💻 رقمي" : "💻 Digital", ids: [7, 13, 14, 19, 24] },
      { id: "retail", label: lang === "ar" ? "🛍 بيع" : "🛍 Retail", ids: [3, 6, 10, 22] },
    ];
    const visible = bizFilter === "all" ? BUSINESSES : BUSINESSES.filter(b => (CATS.find(c => c.id === bizFilter)?.ids || []).includes(b.id));

    return (
      <div style={{ minHeight: "100vh", width: "100%", background: isDark ? "linear-gradient(160deg, #090d16 0%, #0d0b21 50%, #070c1d 100%)" : "linear-gradient(160deg, #f0fdf4 0%, #eff6ff 50%, #fefce8 100%)", display: "flex", flexDirection: "column", padding: "12px 14px", direction: dir, position: "relative", boxSizing: "border-box" }}>
        <style>{CSS}</style>
        <Blobs />
        <div style={{ position: "relative", zIndex: 1, width: "100%", flex: 1, display: "flex", flexDirection: "column", gap: 10, animation: "popIn 0.4s ease-out" }}>

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
            <div>
              <h2 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.5rem", color: c_title, textTransform: "uppercase", lineHeight: 1 }}>{t.pickTitle}</h2>
              <p style={{ color: c_sub, fontSize: "0.72rem", fontFamily: "Tajawal, sans-serif", marginTop: 2 }}>{t.pickSub}</p>
            </div>
          </div>

          {/* Category tabs */}
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", flexShrink: 0 }}>
            {CATS.map(c => (
              <button key={c.id} onClick={() => setBizFilter(c.id)} style={{
                fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "0.7rem",
                padding: "5px 12px", borderRadius: 999, border: "none", cursor: "pointer",
                background: bizFilter === c.id ? "#FFC800" : (isDark ? "rgba(30,41,59,0.85)" : "rgba(255,255,255,0.85)"),
                color: bizFilter === c.id ? "#78350f" : (isDark ? "#cbd5e1" : "#64748b"),
                boxShadow: bizFilter === c.id ? "0 4px 0 #d97706" : (isDark ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.07)"),
                textTransform: "uppercase",
              }}>{c.label}</button>
            ))}
          </div>

          {/* Business grid — responsive columns */}
          <div className="business-grid">
            {visible.map(biz => (
              <div key={biz.id} onClick={() => startGame(biz)}
                className="card-hover"
                style={{
                  background: isDark ? "rgba(15,23,42,0.72)" : "#fff", borderRadius: 20, padding: "14px 10px", cursor: "pointer",
                  border: isDark ? `2.5px solid ${biz.color}66` : `2.5px solid ${biz.color}33`, borderBottom: `5px solid ${biz.color}`,
                  boxShadow: isDark ? "0 4px 15px rgba(0,0,0,0.3)" : "0 4px 15px rgba(0,0,0,0.06)", textAlign: "center", transition: "all 0.2s",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", gap: 6, minHeight: 148
                }}>
                <div style={{ width: "100%", height: 68, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {renderBusinessGraphic(biz.id, biz.color, isDark, 66)}
                </div>
                <div style={{ fontFamily: "Nunito, Tajawal, sans-serif", fontWeight: 900, fontSize: "0.85rem", color: c_title, lineHeight: 1.2 }}>
                  {lang === "ar" ? biz.ar : biz.name}
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 3, fontFamily: "Nunito, sans-serif", fontWeight: 900, color: biz.color, fontSize: "0.85rem" }}>
                  {biz.coins}<Coin size={14} />
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    );
  }


  /* ════════ PLAYING HUB ════════ */
  if (phase === "playing") return (
    <div style={SCREEN}>
      <style>{CSS}</style>
      <Blobs />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 440, width: "100%", display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
        {/* Header card */}
        <div style={{ background: isDark ? "rgba(15,23,42,0.72)" : "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", borderRadius: 24, padding: "12px 16px", width: "100%", boxShadow: isDark ? "0 8px 24px rgba(0,0,0,0.3)" : "0 8px 24px rgba(0,0,0,0.08)", border: isDark ? "2px solid rgba(255,255,255,0.08)" : "2px solid rgba(255,255,255,0.9)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "Nunito, Tajawal, sans-serif", fontWeight: 900, fontSize: "1.35rem", color: c_title }}>
              <div style={{ width: 28, height: 28, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {business && renderBusinessGraphic(business.id, business.color, isDark, 28)}
              </div>
              <span>{lang === "ar" ? business?.ar : business?.name}</span>
            </div>
            <div style={{ fontSize: "0.68rem", color: c_sub, fontWeight: 700, fontFamily: "Nunito, sans-serif" }}>
              {t.turn} {turn + 1} • {t.goal}: {WIN}
              {passiveIncome > 0 && <span style={{ color: "#58CC02" }}> • +{passiveIncome}/turn</span>}
              {loanTurns > 0 && <span style={{ color: "#ef4444" }}> • −{LOAN_REPAY}×{loanTurns}</span>}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: coins < 10 ? (isDark ? "rgba(239,68,68,0.15)" : "#fef2f2") : (isDark ? "rgba(34,197,94,0.15)" : "#f0fdf4"), borderRadius: 16, padding: "6px 12px", border: `2px solid ${coins < 10 ? (isDark ? "rgba(239,68,68,0.4)" : "#fca5a5") : (isDark ? "rgba(34,197,94,0.4)" : "#bbf7d0")}` }}>
            <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.6rem", color: coins < 10 ? "#ef4444" : (isDark ? "#4ade80" : "#15803d") }}>{coins}</span>
            <Coin size={22} />
          </div>
        </div>

        <CoinBar coins={coins} target={WIN} />

        {/* Active upgrades */}
        {Object.keys(upgrades).length > 0 && (
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", justifyContent: "center" }}>
            {Object.keys(upgrades).map(uid => {
              const item = SHOP.find(s => s.id === uid);
              return item ? (
                <div key={uid} style={{ background: isDark ? "rgba(34,197,94,0.12)" : "#f0fdf4", border: isDark ? "2px solid rgba(34,197,94,0.3)" : "2px solid #86efac", borderRadius: 999, padding: "3px 10px", fontSize: "0.65rem", fontFamily: "Nunito, sans-serif", fontWeight: 800, color: isDark ? "#4ade80" : "#15803d", display: "flex", alignItems: "center", gap: 3 }}>
                  {item.emoji} {lang === "ar" ? item.ar : item.en}
                </div>
              ) : null;
            })}
          </div>
        )}

        {/* Loan warning */}
        {loanTurns > 0 && (
          <div style={{ background: isDark ? "rgba(239,68,68,0.12)" : "#fef2f2", border: isDark ? "2px solid rgba(239,68,68,0.3)" : "2px solid #fca5a5", borderRadius: 16, padding: "6px 12px", fontSize: "0.72rem", fontFamily: "Tajawal, sans-serif", fontWeight: 700, color: isDark ? "#fca5a5" : "#b91c1c", width: "100%", textAlign: "center" }}>
            {t.debtWarning} ({loanTurns} {lang === "ar" ? "أدوار" : "turns left"})
          </div>
        )}

        {/* Draw area */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <GameCard card={null} flipped={false} onClick={drawCard} lang={lang} />
          <div style={{ display: "flex", gap: 8 }}>
            <Btn onClick={drawCard} color="#FFC800" textColor="#78350f" size="lg">{t.drawCard}</Btn>
            <Btn onClick={() => setPhase("shop")} color="#A855F7">{t.shopBtn}</Btn>
          </div>
        </div>

        {/* Activity log */}
        {log.length > 0 && (
          <div style={{ background: isDark ? "rgba(15,23,42,0.72)" : "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)", borderRadius: 20, padding: "10px 14px", width: "100%", border: `2px solid ${c_border}` }}>
            <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "0.7rem", color: c_sub, marginBottom: 5, textTransform: "uppercase", letterSpacing: 1 }}>{t.recentEvents}</div>
            {log.map((l, i) => <div key={i} style={{ fontSize: "0.72rem", color: i === 0 ? c_title : c_sub, fontFamily: "Tajawal, sans-serif", fontWeight: 700, padding: "2px 0", borderBottom: i < log.length - 1 ? `1px solid ${c_border}` : "none" }}>{l}</div>)}
          </div>
        )}

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
          <Btn onClick={resetGame} color="#64748b" size="sm">{t.restart}</Btn>
          <Btn onClick={() => setPhase("pick")} color="#f97316" size="sm">⬅️ {lang === "ar" ? "رجوع" : "Back"}</Btn>
        </div>
      </div>
    </div>
  );

  /* ════════ SHOP ════════ */
  if (phase === "shop") return (
    <div style={{ ...SCREEN, justifyContent: "flex-start", paddingTop: 16 }}>
      <style>{CSS}</style>
      <Blobs />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 500, width: "100%", animation: "slideUp 0.3s ease-out" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <div>
            <h2 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.5rem", color: c_title, textTransform: "uppercase" }}>{t.shopTitle}</h2>
            <p style={{ color: c_sub, fontSize: "0.75rem", fontFamily: "Tajawal, sans-serif" }}>{t.shopSub}</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, background: isDark ? "rgba(34,197,94,0.15)" : "#f0fdf4", border: isDark ? "2px solid rgba(34,197,94,0.3)" : "2px solid #86efac", borderRadius: 16, padding: "6px 12px" }}>
            <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.2rem", color: isDark ? "#4ade80" : "#15803d" }}>{coins}</span>
            <Coin size={18} />
          </div>
        </div>

        {shopMsg && (
          <div style={{ background: isDark ? "rgba(34,197,94,0.15)" : "#f0fdf4", border: isDark ? "3px solid #4ade80" : "3px solid #58CC02", borderRadius: 16, padding: "8px 14px", marginBottom: 10, fontFamily: "Nunito, sans-serif", fontWeight: 900, color: isDark ? "#4ade80" : "#15803d", textAlign: "center", animation: "pop 0.3s", fontSize: "0.88rem" }}>
            ✅ {shopMsg}
          </div>
        )}

        <div className="shop-grid">
          {SHOP.map(item => {
            const owned = !!upgrades[item.id];
            const isLoan = item.type === "loan";
            const loanActive = isLoan && loanTurns > 0;
            const canBuy = isLoan ? !loanActive : (!owned && coins >= item.cost);
            const isOne = item.type === "once";
            const stillActive = (item.id === "insurance" && insActive) || (item.id === "robot" && robActive);
            const expired = isOne && owned && !stillActive;

            return (
              <div key={item.id}
                className={canBuy && !owned ? "card-hover" : ""}
                style={{
                  background: owned || loanActive ? (isDark ? "rgba(34,197,94,0.12)" : "#f0fdf4") : (isDark ? "rgba(15,23,42,0.72)" : "#fff"),
                  border: `3px solid ${expired ? (isDark ? "#334155" : "#e2e8f0") : owned || loanActive ? (isDark ? "rgba(34,197,94,0.4)" : "#86efac") : canBuy ? "#A855F733" : (isDark ? "#334155" : "#e2e8f0")}`,
                  borderBottom: `5px solid ${expired ? (isDark ? "#334155" : "#e2e8f0") : owned || loanActive ? (isDark ? "#22c55e" : "#4ade80") : canBuy ? "#7c3aed" : (isDark ? "#334155" : "#e2e8f0")}`,
                  borderRadius: 20, padding: "12px 10px", textAlign: "center",
                  opacity: (expired || (!isLoan && !owned && coins < item.cost)) ? 0.6 : 1,
                  boxShadow: isDark ? "0 4px 12px rgba(0,0,0,0.3)" : "0 4px 12px rgba(0,0,0,0.06)",
                  transition: "all 0.2s"
                }}>
                <div style={{ fontSize: "1.5rem", marginBottom: 3 }}>{item.emoji}</div>
                <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "0.82rem", color: c_title, marginBottom: 3, lineHeight: 1.2 }}>{lang === "ar" ? item.ar : item.en}</div>
                <div style={{ fontSize: "0.67rem", color: c_sub, fontFamily: "Tajawal, sans-serif", marginBottom: 6, lineHeight: 1.4 }}>
                  {lang === "ar" ? item.arDesc : item.enDesc}
                  {isOne && <div style={{ color: "#f97316", fontSize: "0.62rem", fontWeight: 800 }}>⚡ {t.oneTime}</div>}
                  {item.type === "passive" && <div style={{ color: "#58CC02", fontSize: "0.62rem", fontWeight: 800 }}>🔄 +{item.passive}{t.perTurn}</div>}
                  {isLoan && loanActive && <div style={{ color: "#ef4444", fontSize: "0.62rem" }}>Repaying: {loanTurns} turns</div>}
                </div>
                {expired
                  ? <span style={{ fontSize: "0.72rem", color: "#94a3b8", fontFamily: "Nunito, sans-serif", fontWeight: 700 }}>{t.used}</span>
                  : (owned && !expired) || loanActive
                    ? <span style={{ fontSize: "0.72rem", fontFamily: "Nunito, sans-serif", fontWeight: 700, color: isDark ? "#4ade80" : "#15803d" }}>{isOne && stillActive ? <span style={{ color: "#f97316" }}>⚡ Ready!</span> : t.owned}</span>
                    : <Btn onClick={() => buyUpgrade(item)} color={canBuy ? "#A855F7" : (isDark ? "#334155" : "#94a3b8")} disabled={!canBuy} size="sm">{isLoan ? (lang === "ar" ? "اقترض" : "Borrow") : <span style={{ display: "flex", alignItems: "center", gap: 3, justifyContent: "center" }}>{item.cost}<Coin size={13} /> {t.buy}</span>}</Btn>
                }
              </div>
            );
          })}
        </div>
        <Btn onClick={() => setPhase("playing")} color="#2B70C9" size="lg" full>{t.backToGame}</Btn>
      </div>
    </div>
  );

  /* ════════ CARD FLIP ════════ */
  if (phase === "card" && currentCard) return (
    <div style={SCREEN}>
      <style>{CSS}</style>
      <Blobs />
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, animation: "popIn 0.4s ease-out" }}>
        <GameCard card={currentCard} flipped={flipped} lang={lang} />
        {flipped && (
          <div style={{ animation: "slideUp 0.3s ease-out" }}>
            <Btn onClick={handleCardAction} color={currentCard.kind === "skill" ? "#A855F7" : currentCard.kind === "decision" ? "#2B70C9" : "#FFC800"} textColor={currentCard.kind === "skill" || currentCard.kind === "decision" ? "#fff" : "#78350f"} size="lg">
              {currentCard.kind === "decision" ? t.makeChoice : currentCard.kind === "skill" ? t.answerQuiz : t.gotIt}
            </Btn>
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "Nunito, sans-serif", fontWeight: 700, color: c_sub, fontSize: "0.78rem", background: isDark ? "rgba(30,41,59,0.7)" : "rgba(255,255,255,0.8)", borderRadius: 999, padding: "4px 14px" }}>
          {lang === "ar" ? "عملاتك" : "Your coins"}: <strong style={{ color: c_title }}>{coins}</strong><Coin size={15} />
        </div>
      </div>
    </div>
  );

  /* ════════ DECISION ════════ */
  if (phase === "decision" && currentCard) return (
    <div style={SCREEN}>
      <style>{CSS}</style>
      <Blobs />
      <GlassCard style={{ animation: "popIn 0.4s ease-out" }}>
        <div style={{ fontSize: "2.4rem", marginBottom: 4 }}>{currentCard.emoji}</div>
        <h2 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.4rem", color: c_title, marginBottom: 6, textTransform: "uppercase" }}>
          {lang === "ar" ? (currentCard.ar || currentCard.title) : currentCard.title}
        </h2>
        <p style={{ color: c_body, marginBottom: 16, lineHeight: 1.6, fontSize: "0.85rem", fontFamily: "Tajawal, sans-serif" }}>
          {lang === "ar" ? (currentCard.arBody || currentCard.body) : currentCard.body}
        </p>
        <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "0.88rem", color: "#f97316", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>{t.whatChoose}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[currentCard.optA, currentCard.optB].filter((opt): opt is CardOption => opt !== undefined).map((opt, i) => {
            const optColor = i === 0 ? "#2B70C9" : "#58CC02";
            return (
              <div key={i} onClick={() => handleDecision(opt)}
                className="card-hover"
                style={{ background: `${optColor}0d`, border: `3px solid ${optColor}44`, borderBottom: `5px solid ${optColor}`, borderRadius: 20, padding: "12px 14px", cursor: "pointer", textAlign: dir === "rtl" ? "right" : "left", transition: "all 0.2s" }}>
                <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "0.92rem", color: c_title, marginBottom: 2 }}>
                  <span style={{ background: optColor, color: "#fff", borderRadius: 999, padding: "1px 8px", fontSize: "0.72rem", marginRight: 6 }}>{i === 0 ? t.optA : t.optB}</span>
                  {lang === "ar" ? (opt.ar || opt.en) : opt.en}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 3, fontSize: "0.75rem", color: opt.effect >= 0 ? "#15803d" : "#b91c1c", fontWeight: 800, fontFamily: "Nunito, sans-serif" }}>
                  {opt.effect >= 0 ? `+${opt.effect}` : opt.effect}<Coin size={13} />
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );

  /* ════════ QUIZ ════════ */
  if (phase === "quiz" && currentCard) return (
    <div style={SCREEN}>
      <style>{CSS}</style>
      <Blobs />
      <GlassCard style={{ animation: "popIn 0.4s ease-out" }}>
        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 52, height: 52, background: "linear-gradient(145deg, #A855F7, #7c3aed)", borderRadius: "50%", boxShadow: "0 6px 0 #4c1d95", marginBottom: 8 }}>
          <span style={{ fontSize: "1.6rem" }}>{currentCard.emoji}</span>
        </div>
        <h2 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "1.3rem", color: c_title, marginBottom: 6, textTransform: "uppercase" }}>
          {lang === "ar" ? (currentCard.arTitle || currentCard.title) : currentCard.title}
        </h2>
        <p style={{ fontWeight: 800, color: c_title, fontSize: "0.88rem", marginBottom: 14, lineHeight: 1.6, fontFamily: "Tajawal, sans-serif" }}>
          {lang === "ar" ? (currentCard.arQ || currentCard.q) : currentCard.q}
        </p>
        {quizMult > 1 && (
          <div style={{ display: "inline-flex", alignItems: "center", gap: 4, background: isDark ? "rgba(251,191,36,0.12)" : "#fef3c7", border: isDark ? "2px solid rgba(251,191,36,0.4)" : "2px solid #fbbf24", borderRadius: 999, padding: "3px 12px", fontSize: "0.7rem", fontWeight: 800, color: isDark ? "#fef08a" : "#92400e", marginBottom: 10, fontFamily: "Nunito, sans-serif" }}>
            ⚡ {lang === "ar" ? "مكافأة مضاعفة!" : "DOUBLE reward!"}
          </div>
        )}
        <div className="quiz-grid">
          {((lang === "ar" ? (currentCard.arOpts || currentCard.opts) : currentCard.opts) || []).map((opt, i) => {
            let bg = isDark ? "rgba(30,41,59,0.7)" : "#f8fafc", border = isDark ? "#334155" : "#e2e8f0", col = c_title, shadow = isDark ? "#0f172a" : "#e2e8f0";
            if (quizAnswer !== null) {
              if (i === currentCard.answer) { bg = isDark ? "rgba(34,197,94,0.15)" : "#f0fdf4"; border = isDark ? "#4ade80" : "#58CC02"; col = isDark ? "#4ade80" : "#15803d"; shadow = isDark ? "rgba(34,197,94,0.4)" : "#4ade80"; }
              else if (i === quizAnswer) { bg = isDark ? "rgba(239,68,68,0.15)" : "#fef2f2"; border = isDark ? "#f87171" : "#ef4444"; col = isDark ? "#f87171" : "#b91c1c"; shadow = isDark ? "rgba(239,68,68,0.4)" : "#fca5a5"; }
            }
            return (
              <div key={i} onClick={() => quizAnswer === null && handleQuiz(i)}
                style={{ background: bg, border: `3px solid ${border}`, borderBottom: `5px solid ${shadow}`, borderRadius: 16, padding: "10px 8px", cursor: quizAnswer === null ? "pointer" : "default", fontFamily: "Nunito, sans-serif", fontWeight: 800, color: col, fontSize: "0.82rem", textAlign: "center", transition: "all 0.15s", animation: quizAnswer === i && i !== currentCard.answer ? "shake 0.35s" : "none" }}
                onMouseEnter={e => quizAnswer === null && (e.currentTarget.style.transform = "scale(1.04)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}>
                <span style={{ display: "block", fontWeight: 900, fontSize: "0.65rem", color: c_sub, marginBottom: 2, textTransform: "uppercase" }}>{"ABCD"[i]}</span>
                {opt}
              </div>
            );
          })}
        </div>
        {quizAnswer !== null && (
          <div style={{ background: isDark ? "rgba(251,191,36,0.12)" : "linear-gradient(135deg, #fefce8, #fffbeb)", border: isDark ? "3px solid rgba(251,191,36,0.4)" : "3px solid #FFC800", borderRadius: 20, padding: "12px 14px", fontSize: "0.8rem", color: isDark ? "#fef08a" : "#78350f", fontFamily: "Tajawal, sans-serif", lineHeight: 1.55, textAlign: dir === "rtl" ? "right" : "left", animation: "slideUp 0.3s ease-out" }}>
            <strong style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: 0.5 }}>💡 {t.didYouKnow}</strong>
            <br />{lang === "ar" ? (currentCard.arExplain || currentCard.explain) : currentCard.explain}
          </div>
        )}
      </GlassCard>
    </div>
  );

  /* ════════ RESULT ════════ */
  if (phase === "result") return (
    <div style={SCREEN}>
      <style>{CSS}</style>
      <Blobs />
      <GlassCard style={{ animation: "popIn 0.4s ease-out", position: "relative", overflow: "visible" }}>
        {burst && <CoinBurst positive={resultDelta >= 0} />}
        <div style={{ fontSize: "3.2rem", animation: "float 1.5s ease-in-out infinite" }}>{resultDelta > 0 ? "🎉" : resultDelta < 0 ? "😬" : "📚"}</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 4 }}>
          <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "2.4rem", color: resultDelta > 0 ? (isDark ? "#4ade80" : "#15803d") : resultDelta < 0 ? (isDark ? "#f87171" : "#b91c1c") : "#7c3aed" }}>
            {resultDelta > 0 ? `+${resultDelta}` : resultDelta}
          </span>
          <Coin size={30} />
        </div>
        <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "1rem", color: c_title, margin: "8px 0", textTransform: "uppercase", letterSpacing: 0.5 }}>{resultMsg}</p>
        {resultFact && (
          <div style={{ background: isDark ? "rgba(251,191,36,0.12)" : "linear-gradient(135deg, #fefce8, #fffbeb)", border: isDark ? "3px solid rgba(251,191,36,0.4)" : "3px solid #FFC800", borderRadius: 20, padding: "12px 14px", margin: "10px 0", textAlign: dir === "rtl" ? "right" : "left", lineHeight: 1.55 }}>
            <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, color: "#f97316", fontSize: "0.78rem", marginBottom: 4, textTransform: "uppercase" }}>{t.bizFact}</div>
            <div style={{ fontSize: "0.79rem", color: "#92400e", fontFamily: "Tajawal, sans-serif" }}>{resultFact}</div>
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: "0.88rem", color: c_sub, marginBottom: 12 }}>
          {lang === "ar" ? "إجمالي" : "Total"}: <span style={{ color: coins < 10 ? "#ef4444" : (isDark ? "#4ade80" : "#15803d"), fontWeight: 900, fontSize: "1rem" }}>{coins}</span><Coin size={16} /> / {WIN}<Coin size={14} />
        </div>
        <CoinBar coins={coins} target={WIN} />
        <div style={{ marginTop: 14, display: "flex", gap: 8, justifyContent: "center" }}>
          <Btn onClick={drawCard} color="#FFC800" textColor="#78350f">{t.drawNext}</Btn>
          <Btn onClick={() => setPhase("shop")} color="#A855F7">{t.shopBtn}</Btn>
        </div>
      </GlassCard>
    </div>
  );

  /* ════════ WIN ════════ */
  if (phase === "win") return (
    <div style={SCREEN}>
      <style>{CSS}</style>
      <Blobs />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 430, width: "100%", textAlign: "center", animation: "pop 0.6s ease-out" }}>
        <div style={{ fontSize: "5rem", animation: "float 2s ease-in-out infinite", lineHeight: 1, marginBottom: 4 }}>🏆</div>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
          <div style={{ width: 80, height: 80, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {business && renderBusinessGraphic(business.id, business.color, isDark, 80)}
          </div>
        </div>
        <p style={{ fontFamily: "Nunito, Tajawal, sans-serif", fontWeight: 800, fontSize: "1.15rem", color: isDark ? "#4ade80" : "#15803d", marginBottom: 6 }}>
          {lang === "ar" ? business?.ar : business?.name} {t.winSub}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, color: c_sub, marginBottom: 16, fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "0.85rem" }}>
          {t.reachGoal} <strong style={{ color: isDark ? "#4ade80" : "#15803d" }}>{coins}</strong><Coin size={16} /> {t.inTurns} <strong>{turn}</strong> {t.turns}! · {t.realEnt}
        </div>
        <div style={{ background: isDark ? "rgba(15,23,42,0.72)" : "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", borderRadius: 24, padding: "16px 18px", marginBottom: 18, border: `2px solid ${c_border}`, textAlign: dir === "rtl" ? "right" : "left" }}>
          <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: "0.85rem", color: "#f97316", marginBottom: 8, textTransform: "uppercase", textAlign: "center" }}>{t.youLearned}</div>
          {t.learned.map((l, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "Tajawal, sans-serif", fontSize: "0.8rem", color: c_body, padding: "4px 0", borderBottom: i < t.learned.length - 1 ? `1px solid ${c_border}` : "none" }}>
              <span style={{ background: "#58CC02", color: "#fff", borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: 900, flexShrink: 0 }}>✓</span>
              {l}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
          <Btn onClick={resetGame} color="#58CC02" size="lg">{t.playAgain}</Btn>
        </div>
      </div>
    </div>
  );

  /* ════════ LOSE ════════ */
  if (phase === "lose") return (
    <div style={SCREEN}>
      <style>{CSS}</style>
      <Blobs />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 420, width: "100%", textAlign: "center", animation: "pop 0.5s ease-out" }}>
        <div style={{ fontSize: "4rem", marginBottom: 6 }}>😢</div>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
          <div style={{ width: 80, height: 80, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {business && renderBusinessGraphic(business.id, business.color, isDark, 80)}
          </div>
        </div>
        <p style={{ fontFamily: "Nunito, Tajawal, sans-serif", fontWeight: 800, fontSize: "1.05rem", color: c_sub, marginBottom: 14 }}>
          {lang === "ar" ? business?.ar : business?.name}
        </p>
        <div style={{ background: isDark ? "rgba(15,23,42,0.72)" : "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", borderRadius: 24, padding: "18px", marginBottom: 18, border: `2px solid ${c_border}` }}>
          <div style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, color: "#f97316", fontSize: "0.88rem", marginBottom: 8, textTransform: "uppercase" }}>{lang === "ar" ? "💡 رواد الأعمال يقولون:" : "💡 Real entrepreneurs say:"}</div>
          <p style={{ fontFamily: "Tajawal, sans-serif", color: c_body, lineHeight: 1.7, fontSize: "0.84rem", fontStyle: "italic" }}>{t.quote}</p>
          <div style={{ marginTop: 10, display: "inline-flex", alignItems: "center", gap: 6, background: isDark ? "rgba(34,197,94,0.15)" : "#f0fdf4", border: isDark ? "2px solid rgba(34,197,94,0.3)" : "2px solid #86efac", borderRadius: 999, padding: "5px 14px", fontFamily: "Nunito, sans-serif", fontSize: "0.78rem", fontWeight: 800, color: isDark ? "#4ade80" : "#15803d" }}>
            💪 {t.tryMsg}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
          <Btn onClick={resetGame} color="#FFC800" textColor="#78350f" size="lg">{t.tryAgain}</Btn>
        </div>
      </div>
    </div>
  );

  return null;
}