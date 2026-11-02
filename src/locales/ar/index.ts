import { nav } from './nav';
import { debate } from './debate';
import { assignments } from './assignments';
import { auth } from './auth';
import { engine } from './engine';
import { project } from './project';
import { kpi } from './kpi';
import { arcade } from './arcade';
import { gig_central } from './gig_central';
import { coop_pitch } from './coop_pitch';
import { videos } from './videos';
import { admin } from './admin';
import { tank } from './tank';
import { socialHub } from './socialHub';
import { parent } from './parent';
import { teacher } from './teacher';
import { store } from './store';
import { store_items } from './store_items';
import { hq_levels } from './hq_levels';
import { difficulty_modal } from './difficulty_modal';
import { scenario_engine } from './scenario_engine';
import { scenarios } from './scenarios';
import { profile } from './profile';
import { hq } from './hq';
import { real_estate } from './real_estate';
import { library } from './library';
import { library_books } from './library_books';
import { library_tasks } from './library_tasks';
import { exclusive_books } from './exclusive_books';
import { chat } from './chat';
import { map } from './map';
import { landing } from './landing';
import { curriculum } from './curriculum';
import { features } from './features';
import { pricing } from './pricing';
import { lemonade } from './lemonade';
import { the_tank } from './the_tank';
import { tutorial } from './tutorial';
import { categories } from './categories';
import { games } from './games';
import { actions } from './actions';
import { dashboard } from './dashboard';
import { lessons } from './lessons';
import { instructions } from './instructions';
import { sideHustlesExtras } from './sideHustlesExtras';
import { hqStats } from './hqStats';
import { dailyMissions } from './dailyMissions';
import { weeklyChallenge } from './weeklyChallenge';
import { hqShowcase } from './hqShowcase';
import { seasonalEvent } from './seasonalEvent';
import { enterprise } from './enterprise';
import { yearEndReport } from './yearEndReport';
import { aiGenerator } from './aiGenerator';
import { mapExtras } from './mapExtras';
import { spin } from './spin';
import { weekly } from './weekly';
import { bizpulse } from './bizpulse';
import { corp } from './corp';
import { stock } from './stock';
import { avatar } from './avatar';
import { season } from './season';
import { report } from './report';
import { settings } from './settings';
import { sim } from './sim';
import { brand } from './brand';
import { common } from './common';
import { bottomNav } from './bottomNav';
import { skills } from './skills';
import { portfolio } from './portfolio';
import { leaderboard } from './leaderboard';
import { social } from './social';
import { join } from './join';
import { family } from './family';
import { business_plan } from './business_plan';
import { hq_builder } from './hq_builder';
import { play_hub } from './play_hub';

export const ar = {
  translation: {
    nav,
    debate,
    assignments,
    auth,
    engine,
    project,
    kpi,
    arcade,
    gig_central,
    coop_pitch,
    videos,
    admin,
    tank,
    socialHub,
    parent,
    teacher,
    store,
    store_items,
    hq_levels,
    difficulty_modal,
    scenario_engine,
    scenarios,
    profile,
    hq,
    real_estate,
    library,
    library_books,
    library_tasks,
    exclusive_books,
    chat,
    map,
    landing,
    curriculum,
    features,
    pricing,
    pricing_page: pricing,
    lemonade,
    the_tank,
    tutorial,
    categories,
    games,
    actions,
    dashboard,
    ...lessons,
    instructions,
    sideHustlesExtras,
    hqStats,
    dailyMissions,
    weeklyChallenge,
    hqShowcase,
    seasonalEvent,
    enterprise,
    yearEndReport,
    aiGenerator,
    mapExtras,
    spin,
    weekly,
    bizpulse,
    corp,
    stock,
    avatar,
    season,
    report,
    settings,
    common,
    bottomNav,
    sim,
    brand,
    skills,
    portfolio,
    leaderboard,
    social,
    join,
    family,
    business_plan,
    hq_builder,
    play_hub,

    // Top-level keys for components
    path_title: 'مساري الريادي',
    money_basics: 'أساسيات المال',
    entrepreneurship: 'ريادة الأعمال',
    investing_wealth: 'الاستثمار والثروة',
    marketing: 'التسويق',
    leadership: 'القيادة',
    economics: 'الاقتصاد',
    technology: 'التكنولوجيا',
    social_responsibility: 'المسؤولية الاجتماعية',
    global_business: 'الأعمال العالمية',
    financial_smarts: 'الذكاء المالي',
    crypto_blockchain: 'الكريبتو والبلوكشين',
    ai_future_jobs: 'الذكاء الاصطناعي ووظائف المستقبل',
    sustainability_business: 'الاستدامة والأعمال الخضراء',
    venture_capital: 'رأس المال الاستثماري والتمويل',
    corporate_strategy: 'استراتيجية الشركات',
    global_trade: 'التجارة العالمية والقيادة',
    financial_modeling: 'النمذجة المالية',
    brand_building: 'بناء العلامة التجارية',
    future_of_money: 'مستقبل المال',
    negotiation_persuasion: 'التفاوض والإقناع',

    coaching: {
      low_streak: "أهلاً بك مجدداً! المدير التنفيذي الناجح يثابر يومياً. حافظ على استمرار سلسلة نشاطك اليومي! 🔥",
      no_skills: "مرحباً يا قائد! لديك الكثير من العملات النقدية. إعادة استثمارها في مهاراتك بالمقر الرئيسي سيزيد من كفاءتك ودخلك السلبي! 🧠",
      no_properties: "العقارات هي طريقك نحو الثراء! اذهب إلى قسم الأعمال (Venture) واشترِ عقارك الأول لتبدأ في جني أرباح الإيجار السلبي! 🏠",
      active_district: "أهلاً بك في {{name}}! دعنا نتقن الدروس ونهزم الزعيم {{bossName}} لنحصل على جوائز إكمال المنطقة! 🏆"
    },

    easy: 'سهل',
    medium: 'متوسط',
    hard: 'صعب',

    // Stats (sidebar)
    stats: {
      streak: 'السلسلة',
      days: 'أيام',
      ppTokens: 'P Tokens',
      level: 'المستوى',
      xp: 'نقاط XP',
    },

    level_up: {
      title: 'ترقية المستوى!',
      subtitle: 'أنت الآن رائد أعمال من المستوى {{level}}!',
      btn: 'رائع جداً!'
    },
  },
} as const;
