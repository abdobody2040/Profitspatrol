import { TurnaroundScenario } from '../../../types';

export const SCENARIOS: TurnaroundScenario[] = [
    // ─── Season 1 Boss Scenarios ────────────────────────────────────────────
    {
        id: 'pizza_panic',
        title: 'Pizza Panic!',
        companyName: "Papa Pete's Pizzeria",
        initialCash: 1200,
        initialBurnRate: 500,
        turns: 5,
        issues: [
            { id: '1', description: 'Oven Broken', severity: 'CRITICAL', fixed: false, costToFix: 800, impactOnBurn: 300 },
            { id: '2', description: 'Lazy Staff', severity: 'MEDIUM', fixed: false, costToFix: 200, impactOnBurn: 100 },
            { id: '3', description: 'Bad Marketing', severity: 'LOW', fixed: false, costToFix: 100, impactOnBurn: 50 }
        ],
        winCondition: { minCash: 100, maxBurn: 100 },
        theme: {
            emoji: '🍕',
            accentColor: 'orange',
            tagline: 'The oven exploded and the staff is asleep. Can you save dinner?',
            bgClass: 'bg-orange-50 dark:bg-orange-950/30',
            badgeClass: 'text-orange-600 dark:text-orange-400',
            btnClass: 'bg-orange-500 hover:bg-orange-600 shadow-orange-200',
            surpriseEvent: { headline: '🌧️ Rainy Night Surge! Delivery orders +30%', cashDelta: 300, burnDelta: -50 }
        }
    },
    {
        id: 'tech_trouble',
        title: 'Tech Trouble',
        companyName: "Glitchy Games Studio",
        initialCash: 1500,
        initialBurnRate: 600,
        turns: 5,
        issues: [
            { id: '1', description: 'Server Crash', severity: 'CRITICAL', fixed: false, costToFix: 1000, impactOnBurn: 400 },
            { id: '2', description: 'Buggy App', severity: 'MEDIUM', fixed: false, costToFix: 400, impactOnBurn: 150 },
            { id: '3', description: 'No Ads', severity: 'MEDIUM', fixed: false, costToFix: 200, impactOnBurn: 50 }
        ],
        winCondition: { minCash: 100, maxBurn: 100 },
        theme: {
            emoji: '💻',
            accentColor: 'blue',
            tagline: 'The servers are down, the app is broken, and nobody knows you exist!',
            bgClass: 'bg-blue-50 dark:bg-blue-950/30',
            badgeClass: 'text-blue-600 dark:text-blue-400',
            btnClass: 'bg-blue-600 hover:bg-blue-700 shadow-blue-200',
            surpriseEvent: { headline: '🦠 Viral Bug Report! Community helps fix code for free', cashDelta: 0, burnDelta: -200 }
        }
    },
    {
        id: 'fashion_fiasco',
        title: 'Fashion Fiasco',
        companyName: "Trendy Threads",
        initialCash: 1000,
        initialBurnRate: 400,
        turns: 5,
        issues: [
            { id: '1', description: 'Leaking Roof', severity: 'CRITICAL', fixed: false, costToFix: 600, impactOnBurn: 200 },
            { id: '2', description: 'Ugly Design', severity: 'MEDIUM', fixed: false, costToFix: 300, impactOnBurn: 150 },
            { id: '3', description: 'Slow Shipping', severity: 'LOW', fixed: false, costToFix: 100, impactOnBurn: 50 }
        ],
        winCondition: { minCash: 100, maxBurn: 100 },
        theme: {
            emoji: '👗',
            accentColor: 'pink',
            tagline: "Your boutique is soaked, your designs are ugly, and orders take forever. Fashion week is in 5 days!",
            bgClass: 'bg-pink-50 dark:bg-pink-950/30',
            badgeClass: 'text-pink-600 dark:text-pink-400',
            btnClass: 'bg-pink-500 hover:bg-pink-600 shadow-pink-200',
            surpriseEvent: { headline: '📸 Influencer Spotted Your Store! Free viral post', cashDelta: 400, burnDelta: 0 }
        }
    },
    {
        id: 'burger_burnout',
        title: 'Burger Burnout',
        companyName: "Big Bob's Burgers",
        initialCash: 1100,
        initialBurnRate: 450,
        turns: 5,
        issues: [
            { id: '1', description: 'Fridge Warm', severity: 'CRITICAL', fixed: false, costToFix: 700, impactOnBurn: 250 },
            { id: '2', description: 'Wrong Orders', severity: 'MEDIUM', fixed: false, costToFix: 300, impactOnBurn: 150 },
            { id: '3', description: 'Dirty Floor', severity: 'LOW', fixed: false, costToFix: 100, impactOnBurn: 50 }
        ],
        winCondition: { minCash: 100, maxBurn: 100 },
        theme: {
            emoji: '🍔',
            accentColor: 'yellow',
            tagline: 'Warm fridge, confused cooks and a grimy floor — the health inspector visits in 5 days!',
            bgClass: 'bg-yellow-50 dark:bg-yellow-950/30',
            badgeClass: 'text-yellow-700 dark:text-yellow-400',
            btnClass: 'bg-yellow-500 hover:bg-yellow-600 shadow-yellow-200',
            surpriseEvent: { headline: '🏆 Local Food Award! Judges surprise visit, bonus cash', cashDelta: 500, burnDelta: 0 }
        }
    },
    {
        id: 'stock_market_storm',
        title: 'Stock Market Storm!',
        companyName: "Kiddo Capital Investments",
        initialCash: 2000,
        initialBurnRate: 700,
        turns: 6,
        issues: [
            { id: '1', description: 'Portfolio Down 40%', severity: 'CRITICAL', fixed: false, costToFix: 900, impactOnBurn: 350 },
            { id: '2', description: 'Panic Selling Clients', severity: 'MEDIUM', fixed: false, costToFix: 400, impactOnBurn: 200 },
            { id: '3', description: 'No Hedging Strategy', severity: 'LOW', fixed: false, costToFix: 150, impactOnBurn: 80 }
        ],
        winCondition: { minCash: 200, maxBurn: 150 },
        theme: {
            emoji: '📉',
            accentColor: 'emerald',
            tagline: "The market crashed overnight. Keep your clients calm and the fund alive!",
            bgClass: 'bg-emerald-50 dark:bg-emerald-950/30',
            badgeClass: 'text-emerald-600 dark:text-emerald-400',
            btnClass: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200',
            surpriseEvent: { headline: '📈 Rebound Rally! Fed cuts rates, portfolio recovers', cashDelta: 600, burnDelta: -100 }
        }
    },
    {
        id: 'marketing_meltdown',
        title: 'Marketing Meltdown',
        companyName: "Mega Buzz Agency",
        initialCash: 1800,
        initialBurnRate: 650,
        turns: 6,
        issues: [
            { id: '1', description: 'Viral Negative Post', severity: 'CRITICAL', fixed: false, costToFix: 850, impactOnBurn: 300 },
            { id: '2', description: 'Ad Budget Wasted', severity: 'MEDIUM', fixed: false, costToFix: 500, impactOnBurn: 180 },
            { id: '3', description: 'Wrong Target Audience', severity: 'LOW', fixed: false, costToFix: 200, impactOnBurn: 70 }
        ],
        winCondition: { minCash: 150, maxBurn: 120 },
        theme: {
            emoji: '📣',
            accentColor: 'rose',
            tagline: 'A meme went viral for ALL the wrong reasons. Fix the campaign or go broke!',
            bgClass: 'bg-rose-50 dark:bg-rose-950/30',
            badgeClass: 'text-rose-600 dark:text-rose-400',
            btnClass: 'bg-rose-500 hover:bg-rose-600 shadow-rose-200',
            surpriseEvent: { headline: '🎤 Celebrity Shout-out! Positive post from a pop star', cashDelta: 700, burnDelta: -150 }
        }
    },
    {
        id: 'leadership_mutiny',
        title: 'Leadership Mutiny!',
        companyName: "Peak Performance Co.",
        initialCash: 1600,
        initialBurnRate: 600,
        turns: 5,
        issues: [
            { id: '1', description: 'Team On Strike', severity: 'CRITICAL', fixed: false, costToFix: 900, impactOnBurn: 400 },
            { id: '2', description: 'No Clear Goals Set', severity: 'MEDIUM', fixed: false, costToFix: 350, impactOnBurn: 150 },
            { id: '3', description: 'Toxic Office Culture', severity: 'MEDIUM', fixed: false, costToFix: 250, impactOnBurn: 100 }
        ],
        winCondition: { minCash: 100, maxBurn: 100 },
        theme: {
            emoji: '🚩',
            accentColor: 'purple',
            tagline: 'Your whole team quit — in a group chat. Lead them back or lose everything.',
            bgClass: 'bg-purple-50 dark:bg-purple-950/30',
            badgeClass: 'text-purple-600 dark:text-purple-400',
            btnClass: 'bg-purple-600 hover:bg-purple-700 shadow-purple-200',
            surpriseEvent: { headline: '🤝 Team All-Hands! Morale boost saves productivity', cashDelta: 0, burnDelta: -180 }
        }
    },
    {
        id: 'supply_shortage',
        title: 'Supply Chain Nightmare',
        companyName: "Global Gadget Hub",
        initialCash: 2200,
        initialBurnRate: 800,
        turns: 6,
        issues: [
            { id: '1', description: 'Factory Strike Abroad', severity: 'CRITICAL', fixed: false, costToFix: 1100, impactOnBurn: 450 },
            { id: '2', description: 'Ship Delayed 3 Months', severity: 'MEDIUM', fixed: false, costToFix: 600, impactOnBurn: 200 },
            { id: '3', description: 'No Backup Supplier', severity: 'LOW', fixed: false, costToFix: 200, impactOnBurn: 80 }
        ],
        winCondition: { minCash: 200, maxBurn: 150 },
        theme: {
            emoji: '🚢',
            accentColor: 'cyan',
            tagline: 'Containers stuck at sea, factory workers on strike. Your shelves are EMPTY.',
            bgClass: 'bg-cyan-50 dark:bg-cyan-950/30',
            badgeClass: 'text-cyan-600 dark:text-cyan-400',
            btnClass: 'bg-cyan-600 hover:bg-cyan-700 shadow-cyan-200',
            surpriseEvent: { headline: '✈️ Emergency Air Freight! Fast delivery unlocked', cashDelta: -300, burnDelta: -250 }
        }
    },
    {
        id: 'eco_startup_chaos',
        title: 'Green Dream Crisis',
        companyName: "EcoKid Ventures",
        initialCash: 1400,
        initialBurnRate: 550,
        turns: 5,
        issues: [
            { id: '1', description: 'Solar Panels Faulty', severity: 'CRITICAL', fixed: false, costToFix: 800, impactOnBurn: 280 },
            { id: '2', description: 'Greenwashing Scandal', severity: 'MEDIUM', fixed: false, costToFix: 400, impactOnBurn: 160 },
            { id: '3', description: 'Packaging Still Plastic', severity: 'LOW', fixed: false, costToFix: 100, impactOnBurn: 60 }
        ],
        winCondition: { minCash: 100, maxBurn: 100 },
        theme: {
            emoji: '🌱',
            accentColor: 'lime',
            tagline: 'The eco startup is actually polluting! Fix it before the press finds out.',
            bgClass: 'bg-lime-50 dark:bg-lime-950/30',
            badgeClass: 'text-lime-700 dark:text-lime-400',
            btnClass: 'bg-lime-600 hover:bg-lime-700 shadow-lime-200',
            surpriseEvent: { headline: '☀️ Government Green Grant! Clean energy subsidy arrived', cashDelta: 500, burnDelta: -80 }
        }
    },
    {
        id: 'crypto_crash',
        title: 'Crypto Crash!',
        companyName: "BlockKid Exchange",
        initialCash: 2500,
        initialBurnRate: 900,
        turns: 7,
        issues: [
            { id: '1', description: 'Bitcoin Dropped 60%', severity: 'CRITICAL', fixed: false, costToFix: 1200, impactOnBurn: 500 },
            { id: '2', description: 'Hacker Breach Attempt', severity: 'CRITICAL', fixed: false, costToFix: 800, impactOnBurn: 300 },
            { id: '3', description: 'Regulators Investigating', severity: 'MEDIUM', fixed: false, costToFix: 400, impactOnBurn: 150 }
        ],
        winCondition: { minCash: 300, maxBurn: 200 },
        theme: {
            emoji: '₿',
            accentColor: 'amber',
            tagline: 'Bitcoin tanked 60%, hackers are at the door, and the government just called. SURVIVE.',
            bgClass: 'bg-amber-50 dark:bg-amber-950/30',
            badgeClass: 'text-amber-700 dark:text-amber-400',
            btnClass: 'bg-amber-500 hover:bg-amber-600 shadow-amber-200',
            surpriseEvent: { headline: '🚀 Crypto Moonshot! Altcoin you hold pumps 200%', cashDelta: 1000, burnDelta: 0 }
        }
    },
    {
        id: 'ai_ethics_storm',
        title: 'AI Ethics Scandal',
        companyName: "SmartBot Corp.",
        initialCash: 2000,
        initialBurnRate: 750,
        turns: 6,
        issues: [
            { id: '1', description: 'Biased Algorithm Exposed', severity: 'CRITICAL', fixed: false, costToFix: 1000, impactOnBurn: 400 },
            { id: '2', description: 'Data Privacy Lawsuit', severity: 'CRITICAL', fixed: false, costToFix: 700, impactOnBurn: 250 },
            { id: '3', description: 'Staff Morale Crashed', severity: 'LOW', fixed: false, costToFix: 200, impactOnBurn: 80 }
        ],
        winCondition: { minCash: 200, maxBurn: 150 },
        theme: {
            emoji: '🤖',
            accentColor: 'indigo',
            tagline: 'Your AI discriminated against millions. Ethics, lawsuits, and angry engineers await.',
            bgClass: 'bg-indigo-50 dark:bg-indigo-950/30',
            badgeClass: 'text-indigo-600 dark:text-indigo-400',
            btnClass: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200',
            surpriseEvent: { headline: '🛡️ Ethics Board Clears You! Independent audit finds you\'re improving', cashDelta: 0, burnDelta: -200 }
        }
    },
    {
        id: 'vc_deal_gone_wrong',
        title: 'VC Deal Gone Wrong',
        companyName: "Startup Rocket Labs",
        initialCash: 3000,
        initialBurnRate: 1000,
        turns: 7,
        issues: [
            { id: '1', description: 'Investor Wants 60% Equity', severity: 'CRITICAL', fixed: false, costToFix: 1500, impactOnBurn: 500 },
            { id: '2', description: 'Product Not MVP-Ready', severity: 'MEDIUM', fixed: false, costToFix: 700, impactOnBurn: 300 },
            { id: '3', description: 'Co-Founder Disagreement', severity: 'MEDIUM', fixed: false, costToFix: 400, impactOnBurn: 150 }
        ],
        winCondition: { minCash: 400, maxBurn: 250 },
        theme: {
            emoji: '💼',
            accentColor: 'violet',
            tagline: 'The VC wants 60% of your startup and your co-founder quit. Shark Tank in 7 days.',
            bgClass: 'bg-violet-50 dark:bg-violet-950/30',
            badgeClass: 'text-violet-600 dark:text-violet-400',
            btnClass: 'bg-violet-600 hover:bg-violet-700 shadow-violet-200',
            surpriseEvent: { headline: '💰 Angel Investor Appears! Bridge funding offer landed', cashDelta: 1500, burnDelta: 0 }
        }
    },
    {
        id: 'brand_disaster',
        title: 'Brand Meltdown!',
        companyName: "Sparkle & Co.",
        initialCash: 1700,
        initialBurnRate: 650,
        turns: 6,
        issues: [
            { id: '1', description: 'Logo Leaked Early — Mocked', severity: 'CRITICAL', fixed: false, costToFix: 900, impactOnBurn: 350 },
            { id: '2', description: 'Influencer Posted Fake Review', severity: 'MEDIUM', fixed: false, costToFix: 500, impactOnBurn: 180 },
            { id: '3', description: 'Wrong Brand Color in Print Run', severity: 'LOW', fixed: false, costToFix: 150, impactOnBurn: 70 }
        ],
        winCondition: { minCash: 150, maxBurn: 120 },
        theme: {
            emoji: '✨',
            accentColor: 'fuchsia',
            tagline: 'Your logo got dunked on the internet, your influencer lied, and the merch is the wrong color.',
            bgClass: 'bg-fuchsia-50 dark:bg-fuchsia-950/30',
            badgeClass: 'text-fuchsia-600 dark:text-fuchsia-400',
            btnClass: 'bg-fuchsia-600 hover:bg-fuchsia-700 shadow-fuchsia-200',
            surpriseEvent: { headline: '🎨 Rebrand Goes Viral! New logo gets 1M positive impressions', cashDelta: 800, burnDelta: -120 }
        }
    },
    {
        id: 'global_trade_war',
        title: 'Trade War Turmoil',
        companyName: "WorldWide Kids Exports",
        initialCash: 2800,
        initialBurnRate: 950,
        turns: 7,
        issues: [
            { id: '1', description: 'New 30% Import Tariff', severity: 'CRITICAL', fixed: false, costToFix: 1300, impactOnBurn: 500 },
            { id: '2', description: 'Currency Devalued by 20%', severity: 'CRITICAL', fixed: false, costToFix: 900, impactOnBurn: 300 },
            { id: '3', description: 'Port Strike in Main Market', severity: 'MEDIUM', fixed: false, costToFix: 400, impactOnBurn: 150 }
        ],
        winCondition: { minCash: 300, maxBurn: 200 },
        theme: {
            emoji: '🌍',
            accentColor: 'teal',
            tagline: 'Tariffs, currency crashes, and dock workers on strike — your global empire is under siege.',
            bgClass: 'bg-teal-50 dark:bg-teal-950/30',
            badgeClass: 'text-teal-600 dark:text-teal-400',
            btnClass: 'bg-teal-600 hover:bg-teal-700 shadow-teal-200',
            surpriseEvent: { headline: '🤝 Trade Deal Signed! Emergency bilateral agreement unlocked', cashDelta: 0, burnDelta: -300 }
        }
    },
    {
        id: 'fintech_hack',
        title: 'Fintech Hack Attack!',
        companyName: "KidPay Digital",
        initialCash: 2400,
        initialBurnRate: 850,
        turns: 6,
        issues: [
            { id: '1', description: '$200K Stolen by Hackers', severity: 'CRITICAL', fixed: false, costToFix: 1200, impactOnBurn: 500 },
            { id: '2', description: 'Users Withdrawing Funds', severity: 'CRITICAL', fixed: false, costToFix: 800, impactOnBurn: 300 },
            { id: '3', description: 'App Rated 1 Star in App Store', severity: 'MEDIUM', fixed: false, costToFix: 300, impactOnBurn: 120 }
        ],
        winCondition: { minCash: 250, maxBurn: 180 },
        theme: {
            emoji: '🔐',
            accentColor: 'sky',
            tagline: '$200K gone, users panicking, and 1-star reviews flooding in. Restore trust in 6 days.',
            bgClass: 'bg-sky-50 dark:bg-sky-950/30',
            badgeClass: 'text-sky-600 dark:text-sky-400',
            btnClass: 'bg-sky-600 hover:bg-sky-700 shadow-sky-200',
            surpriseEvent: { headline: '🛡️ White Hat Steps Up! Security hero finds and patches main exploit', cashDelta: 0, burnDelta: -250 }
        }
    },
    {
        id: 'real_estate_crash',
        title: 'Real Estate Rumble',
        companyName: "KidRealty Holdings",
        initialCash: 2600,
        initialBurnRate: 900,
        turns: 7,
        issues: [
            { id: '1', description: 'Property Value Dropped 35%', severity: 'CRITICAL', fixed: false, costToFix: 1100, impactOnBurn: 450 },
            { id: '2', description: 'Tenant Stopped Paying Rent', severity: 'MEDIUM', fixed: false, costToFix: 600, impactOnBurn: 250 },
            { id: '3', description: 'Renovation Over Budget by 50%', severity: 'LOW', fixed: false, costToFix: 300, impactOnBurn: 100 }
        ],
        winCondition: { minCash: 300, maxBurn: 200 },
        theme: {
            emoji: '🏠',
            accentColor: 'stone',
            tagline: 'Property values crashed, tenants aren\'t paying, and construction costs exploded. Hold on!',
            bgClass: 'bg-stone-50 dark:bg-stone-950/30',
            badgeClass: 'text-stone-600 dark:text-stone-400',
            btnClass: 'bg-stone-600 hover:bg-stone-700 shadow-stone-200',
            surpriseEvent: { headline: '🏙️ Urban Renewal Fund! Government buys adjacent lot at peak price', cashDelta: 900, burnDelta: 0 }
        }
    },
    {
        id: 'negotiation_nightmare',
        title: 'Negotiation Nightmare!',
        companyName: "DealBreaker Inc.",
        initialCash: 2000,
        initialBurnRate: 700,
        turns: 6,
        issues: [
            { id: '1', description: 'Key Client Ready to Walk Out', severity: 'CRITICAL', fixed: false, costToFix: 1000, impactOnBurn: 400 },
            { id: '2', description: 'Supplier Demands 40% Price Hike', severity: 'MEDIUM', fixed: false, costToFix: 600, impactOnBurn: 200 },
            { id: '3', description: 'Partnership Terms Unclear', severity: 'LOW', fixed: false, costToFix: 200, impactOnBurn: 80 }
        ],
        winCondition: { minCash: 200, maxBurn: 150 },
        theme: {
            emoji: '🤝',
            accentColor: 'orange',
            tagline: 'Your biggest client is walking out, suppliers want more money, and nobody read the contract. Negotiate your way out!',
            bgClass: 'bg-orange-50 dark:bg-orange-950/30',
            badgeClass: 'text-orange-600 dark:text-orange-400',
            btnClass: 'bg-orange-500 hover:bg-orange-600 shadow-orange-200',
            surpriseEvent: { headline: '💡 Win-Win Breakthrough! Both parties find a creative compromise', cashDelta: 500, burnDelta: -150 }
        }
    },
];
