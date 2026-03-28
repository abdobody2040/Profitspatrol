import { StateCreator } from 'zustand';
import { useAppStore } from '../index';
import type { EconomyState } from '../economyStore';
import { SideHustle } from '../../types';

export interface SideHustleSlice {
    sideHustles: SideHustle[];
    gigXp: Record<string, number>; // gigId -> total XP earned (10 per completion)
    completeSideHustle: (id: string, score: number) => void;
}

export const INITIAL_HUSTLES: SideHustle[] = [
    {
        id: 'hustle_dog_walking',
        title: 'Dog Walker',
        description: 'Walk the neighbors dogs. Keep up the pace!',
        rewardCoins: 50,
        energyCost: 10,
        durationSeconds: 30,
        minigameType: 'RHYTHM',
        requiredLevel: 1,
        category: 'Service',
        skillTags: ['Responsibility', 'Reliability'],
        lifeTip: '🐕 Real Talk: Dog walkers in cities charge $20–$40 per walk. Multiple clients = serious income! Reliability is your brand.'
    },
    {
        id: 'hustle_grocery_bagger',
        title: 'Grocery Bagger',
        description: 'Bag groceries quickly and carefully!',
        rewardCoins: 45,
        energyCost: 8,
        durationSeconds: 25,
        minigameType: 'SWIPE',
        requiredLevel: 1,
        category: 'Service',
        skillTags: ['Speed', 'Customer Service'],
        lifeTip: '🛒 Pro Tip: Speed + a smile = happy customers = bigger tips. Customer service skills are valued in EVERY business.'
    },
    {
        id: 'hustle_car_wash',
        title: 'Car Wash Pro',
        description: "Scrub cars until they shine. Don't miss a spot!",
        rewardCoins: 80,
        energyCost: 15,
        durationSeconds: 45,
        minigameType: 'SWIPE',
        requiredLevel: 2,
        category: 'Service',
        skillTags: ['Quality Control', 'Work Ethic'],
        lifeTip: '🚗 Business Idea: A mobile car wash with two buckets and sponges costs almost nothing to start. Charge $15/car and do 5 a day!'
    },
    {
        id: 'hustle_pet_sitter',
        title: 'Pet Sitter',
        description: 'Answer pet care questions correctly!',
        rewardCoins: 75,
        energyCost: 12,
        durationSeconds: 35,
        minigameType: 'QUIZ',
        requiredLevel: 2,
        category: 'Service',
        skillTags: ['Responsibility', 'Knowledge'],
        lifeTip: '🐾 Did You Know: Pet sitting services can charge $25–$50/night. Apps like Rover let you manage bookings like a pro.'
    },
    {
        id: 'hustle_lemonade_stand',
        title: 'Lemonade Stand',
        description: 'Serve customers fast at your stand!',
        rewardCoins: 60,
        energyCost: 10,
        durationSeconds: 30,
        minigameType: 'RHYTHM',
        requiredLevel: 2,
        category: 'Business',
        skillTags: ['Pricing', 'Entrepreneurship'],
        lifeTip: '🍋 Business Lesson: Price too high = no customers. Price too low = no profit. Finding the sweet spot is called "price optimization" — a real business skill!'
    },
    {
        id: 'hustle_lawn_mower',
        title: 'Lawn Master',
        description: 'Mow the lawn perfectly straight.',
        rewardCoins: 120,
        energyCost: 20,
        durationSeconds: 60,
        minigameType: 'RHYTHM',
        requiredLevel: 3,
        category: 'Service',
        skillTags: ['Work Ethic', 'Reliability'],
        lifeTip: '🌿 Think Bigger: Package your services! Mowing + edging + blowing = charge 2x more. Upselling is a key sales skill.'
    },
    {
        id: 'hustle_tutor_helper',
        title: 'Tutor Helper',
        description: 'Help students with homework questions!',
        rewardCoins: 100,
        energyCost: 18,
        durationSeconds: 50,
        minigameType: 'QUIZ',
        requiredLevel: 3,
        category: 'Business',
        skillTags: ['Communication', 'Teaching'],
        lifeTip: '📚 Teaching Fact: When you teach something, you understand it 90% better yourself. Tutors can earn $20–$60/hour.'
    },
    {
        id: 'hustle_bike_repair',
        title: 'Bike Repair',
        description: 'Fix bikes by assembling parts correctly!',
        rewardCoins: 140,
        energyCost: 22,
        durationSeconds: 55,
        minigameType: 'SWIPE',
        requiredLevel: 4,
        category: 'Tech',
        skillTags: ['Problem Solving', 'Mechanical'],
        lifeTip: '🔧 Skill = Money: Learning a technical skill makes you rare. Most people can\'t fix their own bike — but you can!'
    },
    {
        id: 'hustle_social_media',
        title: 'Social Media Manager',
        description: 'Create content for local businesses!',
        rewardCoins: 150,
        energyCost: 20,
        durationSeconds: 50,
        minigameType: 'SWIPE',
        requiredLevel: 4,
        category: 'Creative',
        skillTags: ['Marketing', 'Creativity'],
        lifeTip: '📱 Real Job: Social media managers earn $30,000–$70,000/year. Local businesses desperately need this skill. You already use social media — now get paid for it!'
    },
    {
        id: 'hustle_coding_tutor',
        title: 'Coding Tutor',
        description: 'Teach basic programming concepts!',
        rewardCoins: 200,
        energyCost: 25,
        durationSeconds: 60,
        minigameType: 'QUIZ',
        requiredLevel: 5,
        category: 'Tech',
        skillTags: ['Tech', 'Communication', 'Teaching'],
        lifeTip: '💻 Power Move: The average developer earns $100k+/year. Teaching coding to younger kids builds YOUR skills and earns money. Win-win!'
    },
    {
        id: 'hustle_photographer',
        title: 'Event Photographer',
        description: 'Capture perfect moments with timing!',
        rewardCoins: 180,
        energyCost: 24,
        durationSeconds: 55,
        minigameType: 'RHYTHM',
        requiredLevel: 5,
        category: 'Creative',
        skillTags: ['Creativity', 'Attention to Detail'],
        lifeTip: '📸 Opportunity: Event photographers charge $75–$200/hour. With just a phone, you can start shooting school events and birthday parties.'
    },
    {
        id: 'hustle_app_tester',
        title: 'App Tester',
        description: 'Test apps and find bugs quickly!',
        rewardCoins: 220,
        energyCost: 28,
        durationSeconds: 65,
        minigameType: 'SWIPE',
        requiredLevel: 6,
        category: 'Tech',
        skillTags: ['Tech', 'Critical Thinking'],
        lifeTip: '🐛 Fun Fact: Companies PAY real testers $20–$50/hour just to use their apps and report bugs. You practically do this for free already!'
    },
    {
        id: 'hustle_recycling',
        title: 'Recycling Hero',
        description: 'Sort recyclables to save the planet!',
        rewardCoins: 40,
        energyCost: 8,
        durationSeconds: 20,
        minigameType: 'SWIPE',
        requiredLevel: 1,
        category: 'Service',
        skillTags: ['Sustainability', 'Responsibility'],
        lifeTip: '♻️ Big Picture: Sustainability is the future of business. Companies that go green see higher profits and better reputations.'
    },
    {
        id: 'hustle_garden',
        title: 'Garden Helper',
        description: 'Plant flowers and water the garden.',
        rewardCoins: 60,
        energyCost: 15,
        durationSeconds: 40,
        minigameType: 'RHYTHM',
        requiredLevel: 1,
        category: 'Service',
        skillTags: ['Patience', 'Work Ethic'],
        lifeTip: '🌱 Growth Mindset: Gardens teach patience — things take time to grow. The same is true for businesses! Every big company started as a tiny seed.'
    },
    {
        id: 'hustle_smoothie',
        title: 'Smoothie Bar',
        description: 'Blend delicious fruit smoothies!',
        rewardCoins: 90,
        energyCost: 12,
        durationSeconds: 30,
        minigameType: 'RHYTHM',
        requiredLevel: 2,
        category: 'Business',
        skillTags: ['Entrepreneurship', 'Speed'],
        lifeTip: '🥤 Profit Math: A smoothie costs $1 in ingredients and sells for $5. That\'s a 400% profit margin! Understanding margins is fundamental to business.'
    },
    {
        id: 'hustle_delivery',
        title: 'Delivery Dash',
        description: 'Deliver packages on your bike!',
        rewardCoins: 130,
        energyCost: 20,
        durationSeconds: 50,
        minigameType: 'SWIPE',
        requiredLevel: 3,
        category: 'Business',
        skillTags: ['Time Management', 'Reliability'],
        lifeTip: '⏱️ Gig Economy: DoorDash, Instacart, and Uber are all delivery gig platforms. Learning to manage multiple customers = operations management.'
    },
    {
        id: 'hustle_artist',
        title: 'Street Artist',
        description: 'Create amazing chalk art on sidewalks.',
        rewardCoins: 140,
        energyCost: 25,
        durationSeconds: 60,
        minigameType: 'RHYTHM',
        requiredLevel: 3,
        category: 'Creative',
        skillTags: ['Creativity', 'Marketing'],
        lifeTip: '🎨 Art = Money: Street artists can earn tips from passers-by. Your art IS your marketing — it attracts customers without spending on ads!'
    },
    {
        id: 'hustle_tech_support',
        title: 'Tech Support',
        description: 'Fix computer problems for neighbors.',
        rewardCoins: 180,
        energyCost: 15,
        durationSeconds: 45,
        minigameType: 'QUIZ',
        requiredLevel: 4,
        category: 'Tech',
        skillTags: ['Tech', 'Problem Solving', 'Communication'],
        lifeTip: '🖥️ Neighbourhood Win: Most adults struggle with basic tech. Offer to fix computers for $10/hour — you\'ll have more clients than you can handle.'
    },
    {
        id: 'hustle_drone',
        title: 'Drone Pilot',
        description: 'Film aerial shots for events.',
        rewardCoins: 250,
        energyCost: 30,
        durationSeconds: 70,
        minigameType: 'RHYTHM',
        requiredLevel: 5,
        category: 'Creative',
        skillTags: ['Tech', 'Creativity', 'Attention to Detail'],
        lifeTip: '🚁 High Paying: Licensed drone pilots charge $150–$500/hour for real estate and event videos. A drone + practice = a premium skill.'
    },
    {
        id: 'hustle_streamer',
        title: 'Game Streamer',
        description: 'Entertain viewers with your gameplay!',
        rewardCoins: 300,
        energyCost: 35,
        durationSeconds: 90,
        minigameType: 'SWIPE',
        requiredLevel: 6,
        category: 'Creative',
        skillTags: ['Marketing', 'Creativity', 'Entertainment'],
        lifeTip: '🎮 Creator Economy: Top streamers earn millions. But even small creators monetize through subscribers, donations, and sponsorships. Consistency beats talent.'
    },

    // ─── TIER 3: Level 7–10 ──────────────────────────────────────────────────
    {
        id: 'hustle_space_delivery',
        title: 'Space Delivery 🚀',
        description: 'Deliver cargo to orbital stations — fast and precise!',
        rewardCoins: 400,
        energyCost: 40,
        durationSeconds: 100,
        minigameType: 'RHYTHM',
        requiredLevel: 7,
        category: 'Tech',
        skillTags: ['Tech', 'Precision', 'Innovation'],
        lifeTip: '🚀 Future Business: SpaceX, Blue Origin, and Rocket Lab are making space delivery a real industry. Logistics in space will be worth trillions by 2040.'
    },
    {
        id: 'hustle_ai_tutor',
        title: 'AI Tutor',
        description: 'Use AI tools to teach personalized lessons!',
        rewardCoins: 380,
        energyCost: 38,
        durationSeconds: 90,
        minigameType: 'QUIZ',
        requiredLevel: 7,
        category: 'Tech',
        skillTags: ['Tech', 'Teaching', 'AI'],
        lifeTip: '🤖 AI + Education: AI tutors already help millions of students worldwide. Building AI-powered learning tools is one of the hottest startup spaces today.'
    },
    {
        id: 'hustle_climate_advisor',
        title: 'Climate Advisor 🌍',
        description: 'Help companies reduce their carbon footprint!',
        rewardCoins: 420,
        energyCost: 42,
        durationSeconds: 95,
        minigameType: 'QUIZ',
        requiredLevel: 8,
        category: 'Business',
        skillTags: ['Sustainability', 'Strategy', 'Communication'],
        lifeTip: '🌱 Green Jobs: ESG consultants earn $80k–$150k/year helping corporations hit sustainability targets. The green economy is growing 3x faster than the rest.'
    },
    {
        id: 'hustle_podcast_producer',
        title: 'Podcast Producer 🎙️',
        description: 'Edit audio, book guests, and grow your show!',
        rewardCoins: 450,
        energyCost: 45,
        durationSeconds: 110,
        minigameType: 'RHYTHM',
        requiredLevel: 8,
        category: 'Creative',
        skillTags: ['Marketing', 'Creativity', 'Communication'],
        lifeTip: '🎙️ Audio Gold: Top podcasters earn millions through ads, Patreon, and sponsors. Podcast production is a $23B industry expected to double by 2030.'
    },
    {
        id: 'hustle_nft_artist',
        title: 'Digital Art Seller 🎨',
        description: 'Create and sell digital collectible art pieces!',
        rewardCoins: 500,
        energyCost: 48,
        durationSeconds: 115,
        minigameType: 'SWIPE',
        requiredLevel: 9,
        category: 'Creative',
        skillTags: ['Creativity', 'Tech', 'Entrepreneurship'],
        lifeTip: '🎨 Digital Ownership: Digital artists now sell unique pieces for thousands of dollars online. Learning digital art + blockchain = rare, high-value skill combo.'
    },
    {
        id: 'hustle_web3_dev',
        title: 'Web3 Developer 💎',
        description: 'Build decentralized apps on the blockchain!',
        rewardCoins: 600,
        energyCost: 50,
        durationSeconds: 120,
        minigameType: 'QUIZ',
        requiredLevel: 10,
        category: 'Tech',
        skillTags: ['Tech', 'Coding', 'Innovation'],
        lifeTip: '💎 Top Earner: Web3 developers earn $150k–$300k+ per year. Solidity (the main blockchain coding language) can be learned in weeks — and the demand far exceeds supply.'
    },
];

// How many completions per gig level
const XP_PER_COMPLETION = 10;
const XP_PER_LEVEL = 30; // 3 completions = level up

export const getGigLevel = (gigId: string, gigXp: Record<string, number>): number => {
    const xp = gigXp[gigId] || 0;
    return Math.min(10, Math.floor(xp / XP_PER_LEVEL) + 1);
};

export const getGigLevelProgress = (gigId: string, gigXp: Record<string, number>): number => {
    const xp = gigXp[gigId] || 0;
    return (xp % XP_PER_LEVEL) / XP_PER_LEVEL; // 0.0 to 1.0
};

export const createSideHustleSlice: StateCreator<EconomyState, [], [], SideHustleSlice> = (set, get) => ({
    sideHustles: INITIAL_HUSTLES,
    gigXp: {},

    completeSideHustle: (id: string, score: number) => {
        const hustle = get().sideHustles.find(h => h.id === id);
        if (!hustle) return;

        const appState = useAppStore.getState();
        const user = appState.user;
        if (!user) return;

        // ✅ SECURITY FIX: Clamp score to [0.0, 1.0].
        // The score param comes from the minigame result, but callers (browser console,
        // React DevTools, injected components) could pass score=999 to grant
        // hundreds of thousands of BizCoins, or score=-1 to subtract (corrupt) balance.
        const clampedScore = Math.min(1, Math.max(0, score));
        const actualReward = Math.floor(hustle.rewardCoins * clampedScore);

        set((state) => ({
            gigXp: {
                ...state.gigXp,
                [id]: (state.gigXp[id] || 0) + XP_PER_COMPLETION
            }
        }));

        useAppStore.setState(state => ({
            user: {
                ...state.user!,
                bizCoins: (state.user?.bizCoins || 0) + actualReward,
                xp: (state.user?.xp || 0) + 10 
            }
        }));

        appState.trackMissionProgress('PLAY_GIG', 1);
        if (actualReward > 0) appState.trackMissionProgress('EARN_COINS', actualReward);
        appState.trackWeeklyChallengeProgress('GIG_MARATHON', 1);
        if (actualReward > 0) appState.trackWeeklyChallengeProgress('COIN_GRIND', actualReward);
        if (actualReward > 0) appState.trackSeasonalProgress('GIG_RUSH', actualReward);
        if (actualReward > 0) appState.trackSeasonalProgress('COIN_SPRINT', actualReward);
    }
});

