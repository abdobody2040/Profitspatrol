import { MORE_BOOKS } from './moreBooks';
export const INITIAL_LIBRARY = [
    ...MORE_BOOKS,
    {
        id: "7-habits-of-highly-effective-people",
        title: "The 7 Habits of Highly Effective People",
        author: "Stephen Covey",
        coverUrl: "/images/books/7-habits.jpg",
        category: "Mindset",
        ageRating: "12+",
        summary: "A transformative book about personal and professional growth.",
        keyLessons: [
            "Key lesson 1",
            "Key lesson 2",
            "Key lesson 3"
        ],
        tasks: [
            {
                id: "7-habits-of-highly-effective-people-quiz-1",
                bookId: "7-habits-of-highly-effective-people",
                type: "quiz",
                title: "Test Your Knowledge",
                description: "How well do you understand The 7 Habits of Highly Effective People?",
                rewards: { xp: 50, coins: 25 },
                difficulty: "easy",
                estimatedMinutes: 5,
                quiz: {
                    questions: [
                        {
                            question: "What does it mean to 'Begin with the End in Mind'?",
                            options: [
                                "Start working immediately",
                                "Visualizing the destination before starting",
                                "Focusing on the process only",
                                "Ignoring the outcome"
                            ],
                            correctAnswer: 1
                        },
                        {
                            question: "Which habit is about prioritization?",
                            options: [
                                "Be Proactive",
                                "Think Win-Win",
                                "Put First Things First",
                                "Synergize"
                            ],
                            correctAnswer: 2
                        },
                        {
                            question: "What is 'Sharpening the Saw'?",
                            options: [
                                "Buying new tools",
                                "Criticizing others",
                                "Self-renewal and balance",
                                "Working harder"
                            ],
                            correctAnswer: 2
                        }
                    ]
                }
            },
            {
                id: "7-habits-of-highly-effective-people-reflection-1",
                bookId: "7-habits-of-highly-effective-people",
                type: "reflection",
                title: "Personal Reflection",
                description: "Connect the book's lessons to your own life.",
                rewards: { xp: 30, coins: 15 },
                difficulty: "medium",
                estimatedMinutes: 10,
                reflection: {
                    prompt: "Are you 'reactive' (blaming circumstances) or 'proactive' (taking responsibility)? Write down one area where you need to be more proactive.",
                    minWords: 30
                }
            },
            {
                id: "7-habits-of-highly-effective-people-action-1",
                bookId: "7-habits-of-highly-effective-people",
                type: "action_challenge",
                title: "Apply It Daily",
                description: "Take action on what you learned.",
                rewards: { xp: 50, coins: 25 },
                difficulty: "medium",
                estimatedMinutes: 15,
                actionChallenge: {
                    steps: [
                        "Create a Personal Mission Statement draft",
                        "Plan your upcoming week using the 'Big Rocks' first",
                        "Do one activity to 'Sharpen the Saw' today (exercise, read, connect)"
                    ],
                    checkpoints: [
                        "Drafted mission",
                        "Planned week",
                        "Sharpened saw"
                    ]
                }
            },
            {
                id: "7-habits-of-highly-effective-people-share-1",
                bookId: "7-habits-of-highly-effective-people",
                type: "share_teach",
                title: "Teach to Learn",
                description: "Share the wisdom of The 7 Habits of Highly Effective People.",
                rewards: { xp: 60, coins: 40 },
                difficulty: "medium",
                estimatedMinutes: 15
            },
            {
                id: "7-habits-of-highly-effective-people-application-1",
                bookId: "7-habits-of-highly-effective-people",
                type: "application",
                title: "Real World Application",
                description: "Use the strategies from The 7 Habits of Highly Effective People in real life.",
                rewards: { xp: 40, coins: 20 },
                difficulty: "hard",
                estimatedMinutes: 20
            }
        ]
    }
];
