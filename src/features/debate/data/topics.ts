// src/features/debate/topics.ts

export interface DebateTopic {
    id: string;
    title: string;
    scenario: string;
    dilemma: string; // The specific question
    difficulty: 'Easy' | 'Medium' | 'Hard';
    icon: string;
    image?: string;
}

export const DEBATE_TOPICS: DebateTopic[] = [
    {
        id: 'topic_cups',
        title: 'The Cup Crisis',
        scenario: "Your lemonade stand is growing! You need to buy cups. Plastic cups are very cheap ($0.05) but bad for the environment. Paper cups are expensive ($0.15) but eco-friendly.",
        dilemma: "Which cups do you choose and why?",
        difficulty: 'Easy',
        icon: '🥤',
        image: '/images/debate/cup_crisis.jpg'
    },
    {
        id: 'topic_wages',
        title: 'Fair Pay vs. Profits',
        scenario: "Your friend wants to help squeeze lemons. If you pay them $5/hour, you make a huge profit. If you pay them $10/hour (a fair wage), you make less money but they are happier.",
        dilemma: "How much do you pay your friend and why?",
        difficulty: 'Medium',
        icon: '💰',
        image: '/images/debate/fair_pay.jpg'
    },
    {
        id: 'topic_secret',
        title: 'The Secret Ingredient',
        scenario: "You found a 'super sweetener' that makes lemonade taste 10x better, but it might give some kids a tummy ache if they drink too much. No laws ban it yet.",
        dilemma: "Do you use the secret ingredient to sell more?",
        difficulty: 'Hard',
        icon: '🧪',
        image: '/images/debate/secret_ingredient.jpg'
    },
    {
        id: 'topic_remote',
        title: 'Remote vs. Office',
        scenario: "Your software company is growing. Working from home saves money on rent and keeps employees happy. Working in an office helps teams talk better and come up with ideas faster.",
        dilemma: "Should your company stay 100% remote or open an office?",
        difficulty: 'Medium',
        icon: '🏠',
        image: '/images/debate/remote_office.jpg'
    },
    {
        id: 'topic_subscription',
        title: 'The Subscription Model',
        scenario: "You built a popular game. You can sell it for $20 once, or charge $2 per month. Selling it once gives you money fast, but the subscription gives you money every month for a long time.",
        dilemma: "Which pricing model is better for your business?",
        difficulty: 'Hard',
        icon: '🔄',
        image: '/images/debate/subscription_model.jpg'
    },
    {
        id: 'topic_ads',
        title: 'Ads vs. Privacy',
        scenario: "Your social media app is free. To make money, you can show targeted ads by tracking what users do. This makes more money but some users might feel their privacy is invaded.",
        dilemma: "Do you use targeted ads or find another way to make money?",
        difficulty: 'Medium',
        icon: '📢',
        image: '/images/debate/school_ads.jpg'
    },
    {
        id: 'topic_automation',
        title: 'Robots in the Factory',
        scenario: "Your pizza factory can hire 10 people to make pizzas, or buy 2 robots. Robots are faster and don't get tired, but the people will lose their jobs.",
        dilemma: "Do you buy the robots or keep the human workers?",
        difficulty: 'Hard',
        icon: '🤖',
        image: '/images/debate/robots_workers.jpg'
    },
    {
        id: 'topic_influencer',
        title: 'The Honest Influencer',
        scenario: "A big toy company offers you $1,000 to say their toy is the best in the world on your YouTube channel. You think the toy is just okay, not the best.",
        dilemma: "Do you take the money and say it's the best, or tell the truth?",
        difficulty: 'Easy',
        icon: '📸',
        image: '/images/debate/honest_review.jpg'
    },
    {
        id: 'topic_equity',
        title: 'Sharing the Pie',
        scenario: "You are starting a new company with a brilliant engineer. You can pay them a high salary, or give them a small salary plus 20% ownership (equity) in the company.",
        dilemma: "How do you convince them to join your team?",
        difficulty: 'Hard',
        icon: '🍰',
        image: '/images/debate/sharing_pie.jpg'
    }
];
