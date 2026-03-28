// src/features/debate/topics.ts

export interface DebateTopic {
    id: string;
    title: string;
    scenario: string;
    dilemma: string; // The specific question
    difficulty: 'Easy' | 'Medium' | 'Hard';
    icon: string;
}

export const DEBATE_TOPICS: DebateTopic[] = [
    {
        id: 'topic_cups',
        title: 'The Cup Crisis',
        scenario: "Your lemonade stand is growing! You need to buy cups. Plastic cups are very cheap ($0.05) but bad for the environment. Paper cups are expensive ($0.15) but eco-friendly.",
        dilemma: "Which cups do you choose and why?",
        difficulty: 'Easy',
        icon: '🥤'
    },
    {
        id: 'topic_wages',
        title: 'Fair Pay vs. Profits',
        scenario: "Your friend wants to help squeeze lemons. If you pay them $5/hour, you make a huge profit. If you pay them $10/hour (a fair wage), you make less money but they are happier.",
        dilemma: "How much do you pay your friend and why?",
        difficulty: 'Medium',
        icon: '💰'
    },
    {
        id: 'topic_secret',
        title: 'The Secret Ingredient',
        scenario: "You found a 'super sweetener' that makes lemonade taste 10x better, but it might give some kids a tummy ache if they drink too much. No laws ban it yet.",
        dilemma: "Do you use the secret ingredient to sell more?",
        difficulty: 'Hard',
        icon: '🧪'
    }
];
