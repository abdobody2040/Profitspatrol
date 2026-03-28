import { Book } from '../../../types';

export const CLASSIC_BOOKS: Book[] = [
  {
    id: "think-and-grow-rich",
    title: "Think and Grow Rich",
    author: "Unknown Author",
    coverUrl: "/images/books/think-and-grow-rich.jpg",
    category: "Mindset",
    ageRating: "12+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "think-and-grow-rich-quiz-1",
        bookId: "think-and-grow-rich",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Think and Grow Rich?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Think and Grow Rich'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Think and Grow Rich'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "think-and-grow-rich-reflection-1",
        bookId: "think-and-grow-rich",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Think and Grow Rich' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "think-and-grow-rich-action-1",
        bookId: "think-and-grow-rich",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Think and Grow Rich",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "think-and-grow-rich-share-1",
        bookId: "think-and-grow-rich",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Think and Grow Rich.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "think-and-grow-rich-application-1",
        bookId: "think-and-grow-rich",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Think and Grow Rich in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "mindset-the-new-psychology-of-success",
    title: "Mindset: The New Psychology of Success",
    author: "Unknown Author",
    coverUrl: "/images/books/mindset.jpg",
    category: "Mindset",
    ageRating: "12+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "mindset-the-new-psychology-of-success-quiz-1",
        bookId: "mindset-the-new-psychology-of-success",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Mindset: The New Psychology of Success?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Mindset: The New Psychology of Success'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Mindset: The New Psychology of Success'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "mindset-the-new-psychology-of-success-reflection-1",
        bookId: "mindset-the-new-psychology-of-success",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Mindset: The New Psychology of Success' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "mindset-the-new-psychology-of-success-action-1",
        bookId: "mindset-the-new-psychology-of-success",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Mindset: The New Psychology of Success",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "mindset-the-new-psychology-of-success-share-1",
        bookId: "mindset-the-new-psychology-of-success",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Mindset: The New Psychology of Success.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "mindset-the-new-psychology-of-success-application-1",
        bookId: "mindset-the-new-psychology-of-success",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Mindset: The New Psychology of Success in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "7-habits-of-highly-effective-people",
    title: "The 7 Habits of Highly Effective People",
    author: "Stephen Covey",
    coverUrl: "/images/books/7-habits.jpg",
    category: "Mindset",
    ageRating: "12+",
    summary: "A transformative book about achieving success and personal growth.",
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
              question: "What is a key concept from 'The 7 Habits of Highly Effective People'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'The 7 Habits of Highly Effective People'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
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
          prompt: "How can you apply the key lessons from 'The 7 Habits of Highly Effective People' to your current projects or goals?",
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
            "Review the key concepts from The 7 Habits of Highly Effective People",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
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
  },
  {
    id: "atomic-habits",
    title: "Atomic Habits",
    author: "Unknown Author",
    coverUrl: "/images/books/atomic-habits.jpg",
    category: "Mindset",
    ageRating: "12+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "atomic-habits-quiz-1",
        bookId: "atomic-habits",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Atomic Habits?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Atomic Habits'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Atomic Habits'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "atomic-habits-reflection-1",
        bookId: "atomic-habits",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Atomic Habits' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "atomic-habits-action-1",
        bookId: "atomic-habits",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Atomic Habits",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "atomic-habits-share-1",
        bookId: "atomic-habits",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Atomic Habits.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "atomic-habits-application-1",
        bookId: "atomic-habits",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Atomic Habits in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "how-to-win-friends-and-influence-people",
    title: "How to Win Friends and Influence People",
    author: "Dale Carnegie",
    coverUrl: "/images/books/win-friends.jpg",
    category: "Mindset",
    ageRating: "12+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "how-to-win-friends-and-influence-people-quiz-1",
        bookId: "how-to-win-friends-and-influence-people",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand How to Win Friends and Influence People?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'How to Win Friends and Influence People'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'How to Win Friends and Influence People'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "how-to-win-friends-and-influence-people-reflection-1",
        bookId: "how-to-win-friends-and-influence-people",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'How to Win Friends and Influence People' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "how-to-win-friends-and-influence-people-action-1",
        bookId: "how-to-win-friends-and-influence-people",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from How to Win Friends and Influence People",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "how-to-win-friends-and-influence-people-share-1",
        bookId: "how-to-win-friends-and-influence-people",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of How to Win Friends and Influence People.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "how-to-win-friends-and-influence-people-application-1",
        bookId: "how-to-win-friends-and-influence-people",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from How to Win Friends and Influence People in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "start-with-why",
    title: "Start with Why",
    author: "Simon Sinek",
    coverUrl: "/images/books/start-with-why.jpg",
    category: "Strategy",
    ageRating: "12+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "start-with-why-quiz-1",
        bookId: "start-with-why",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Start with Why?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Start with Why'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Start with Why'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "start-with-why-reflection-1",
        bookId: "start-with-why",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Start with Why' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "start-with-why-action-1",
        bookId: "start-with-why",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Start with Why",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "start-with-why-share-1",
        bookId: "start-with-why",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Start with Why.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "start-with-why-application-1",
        bookId: "start-with-why",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Start with Why in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "grit",
    title: "Grit",
    author: "Angela Duckworth",
    coverUrl: "/images/books/grit.jpg",
    category: "Mindset",
    ageRating: "12+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "grit-quiz-1",
        bookId: "grit",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Grit?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Grit'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Grit'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "grit-reflection-1",
        bookId: "grit",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Grit' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "grit-action-1",
        bookId: "grit",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Grit",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "grit-share-1",
        bookId: "grit",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Grit.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "grit-application-1",
        bookId: "grit",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Grit in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "zero-to-one",
    title: "Zero to One",
    author: "Peter Thiel",
    coverUrl: "/images/books/zero-to-one.jpg",
    category: "Strategy",
    ageRating: "14+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "zero-to-one-quiz-1",
        bookId: "zero-to-one",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Zero to One?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Zero to One'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Zero to One'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "zero-to-one-reflection-1",
        bookId: "zero-to-one",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Zero to One' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "zero-to-one-action-1",
        bookId: "zero-to-one",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Zero to One",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "zero-to-one-share-1",
        bookId: "zero-to-one",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Zero to One.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "zero-to-one-application-1",
        bookId: "zero-to-one",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Zero to One in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "blue-ocean-strategy",
    title: "Blue Ocean Strategy",
    author: "W. Chan Kim",
    coverUrl: "/images/books/blue-ocean-strategy.jpg",
    category: "Strategy",
    ageRating: "14+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "blue-ocean-strategy-quiz-1",
        bookId: "blue-ocean-strategy",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Blue Ocean Strategy?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Blue Ocean Strategy'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Blue Ocean Strategy'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "blue-ocean-strategy-reflection-1",
        bookId: "blue-ocean-strategy",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Blue Ocean Strategy' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "blue-ocean-strategy-action-1",
        bookId: "blue-ocean-strategy",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Blue Ocean Strategy",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "blue-ocean-strategy-share-1",
        bookId: "blue-ocean-strategy",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Blue Ocean Strategy.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "blue-ocean-strategy-application-1",
        bookId: "blue-ocean-strategy",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Blue Ocean Strategy in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "lean-startup",
    title: "The Lean Startup",
    author: "Eric Ries",
    coverUrl: "/images/books/the-lean-startup.jpg",
    category: "Strategy",
    ageRating: "14+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "lean-startup-quiz-1",
        bookId: "lean-startup",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand The Lean Startup?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'The Lean Startup'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'The Lean Startup'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "lean-startup-reflection-1",
        bookId: "lean-startup",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'The Lean Startup' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "lean-startup-action-1",
        bookId: "lean-startup",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from The Lean Startup",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "lean-startup-share-1",
        bookId: "lean-startup",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of The Lean Startup.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "lean-startup-application-1",
        bookId: "lean-startup",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from The Lean Startup in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "hooked",
    title: "Hooked",
    author: "Nir Eyal",
    coverUrl: "/images/books/hooked.jpg",
    category: "Strategy",
    ageRating: "14+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "hooked-quiz-1",
        bookId: "hooked",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Hooked?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Hooked'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Hooked'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "hooked-reflection-1",
        bookId: "hooked",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Hooked' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "hooked-action-1",
        bookId: "hooked",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Hooked",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "hooked-share-1",
        bookId: "hooked",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Hooked.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "hooked-application-1",
        bookId: "hooked",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Hooked in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "contagious",
    title: "Contagious",
    author: "Jonah Berger",
    coverUrl: "/images/books/contagious.jpg",
    category: "Strategy",
    ageRating: "12+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "contagious-quiz-1",
        bookId: "contagious",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Contagious?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Contagious'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Contagious'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "contagious-reflection-1",
        bookId: "contagious",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Contagious' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "contagious-action-1",
        bookId: "contagious",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Contagious",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "contagious-share-1",
        bookId: "contagious",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Contagious.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "contagious-application-1",
        bookId: "contagious",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Contagious in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "purple-cow",
    title: "Purple Cow",
    author: "Seth Godin",
    coverUrl: "/images/books/purple-cow.jpg",
    category: "Strategy",
    ageRating: "12+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "purple-cow-quiz-1",
        bookId: "purple-cow",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Purple Cow?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Purple Cow'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Purple Cow'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "purple-cow-reflection-1",
        bookId: "purple-cow",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Purple Cow' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "purple-cow-action-1",
        bookId: "purple-cow",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Purple Cow",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "purple-cow-share-1",
        bookId: "purple-cow",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Purple Cow.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "purple-cow-application-1",
        bookId: "purple-cow",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Purple Cow in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "good-to-great",
    title: "Good to Great",
    author: "Jim Collins",
    coverUrl: "/images/books/good-to-great.jpg",
    category: "Strategy",
    ageRating: "14+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "good-to-great-quiz-1",
        bookId: "good-to-great",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Good to Great?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Good to Great'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Good to Great'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "good-to-great-reflection-1",
        bookId: "good-to-great",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Good to Great' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "good-to-great-action-1",
        bookId: "good-to-great",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Good to Great",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "good-to-great-share-1",
        bookId: "good-to-great",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Good to Great.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "good-to-great-application-1",
        bookId: "good-to-great",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Good to Great in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "built-to-last",
    title: "Built to Last",
    author: "Jim Collins",
    coverUrl: "/images/books/built-to-last.jpg",
    category: "Strategy",
    ageRating: "14+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "built-to-last-quiz-1",
        bookId: "built-to-last",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Built to Last?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Built to Last'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Built to Last'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "built-to-last-reflection-1",
        bookId: "built-to-last",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Built to Last' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "built-to-last-action-1",
        bookId: "built-to-last",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Built to Last",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "built-to-last-share-1",
        bookId: "built-to-last",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Built to Last.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "built-to-last-application-1",
        bookId: "built-to-last",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Built to Last in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "crossing-the-chasm",
    title: "Crossing the Chasm",
    author: "Geoffrey Moore",
    coverUrl: "/images/books/crossing-the-chasm.jpg",
    category: "Strategy",
    ageRating: "14+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "crossing-the-chasm-quiz-1",
        bookId: "crossing-the-chasm",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Crossing the Chasm?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Crossing the Chasm'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Crossing the Chasm'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "crossing-the-chasm-reflection-1",
        bookId: "crossing-the-chasm",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Crossing the Chasm' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "crossing-the-chasm-action-1",
        bookId: "crossing-the-chasm",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Crossing the Chasm",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "crossing-the-chasm-share-1",
        bookId: "crossing-the-chasm",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Crossing the Chasm.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "crossing-the-chasm-application-1",
        bookId: "crossing-the-chasm",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Crossing the Chasm in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "innovators-dilemma",
    title: "The Innovator's Dilemma",
    author: "Unknown Author",
    coverUrl: "/images/books/innovators-dilemma.jpg",
    category: "Strategy",
    ageRating: "14+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "innovators-dilemma-quiz-1",
        bookId: "innovators-dilemma",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand The Innovator's Dilemma?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'The Innovator's Dilemma'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'The Innovator's Dilemma'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "innovators-dilemma-reflection-1",
        bookId: "innovators-dilemma",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'The Innovator's Dilemma' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "innovators-dilemma-action-1",
        bookId: "innovators-dilemma",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from The Innovator's Dilemma",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "innovators-dilemma-share-1",
        bookId: "innovators-dilemma",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of The Innovator's Dilemma.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "innovators-dilemma-application-1",
        bookId: "innovators-dilemma",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from The Innovator's Dilemma in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "business-model-generation",
    title: "Business Model Generation",
    author: "Alexander Osterwalder",
    coverUrl: "/images/books/business-model-generation.jpg",
    category: "Strategy",
    ageRating: "14+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "business-model-generation-quiz-1",
        bookId: "business-model-generation",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Business Model Generation?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Business Model Generation'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Business Model Generation'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "business-model-generation-reflection-1",
        bookId: "business-model-generation",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Business Model Generation' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "business-model-generation-action-1",
        bookId: "business-model-generation",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Business Model Generation",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "business-model-generation-share-1",
        bookId: "business-model-generation",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Business Model Generation.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "business-model-generation-application-1",
        bookId: "business-model-generation",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Business Model Generation in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "sprint",
    title: "Sprint",
    author: "Jake Knapp",
    coverUrl: "/images/books/sprint.jpg",
    category: "Strategy",
    ageRating: "14+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "sprint-quiz-1",
        bookId: "sprint",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Sprint?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Sprint'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Sprint'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "sprint-reflection-1",
        bookId: "sprint",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Sprint' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "sprint-action-1",
        bookId: "sprint",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Sprint",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "sprint-share-1",
        bookId: "sprint",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Sprint.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "sprint-application-1",
        bookId: "sprint",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Sprint in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "traction",
    title: "Traction",
    author: "Gabriel Weinberg",
    coverUrl: "/images/books/traction.jpg",
    category: "Strategy",
    ageRating: "14+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "traction-quiz-1",
        bookId: "traction",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Traction?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Traction'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Traction'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "traction-reflection-1",
        bookId: "traction",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Traction' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "traction-action-1",
        bookId: "traction",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Traction",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "traction-share-1",
        bookId: "traction",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Traction.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "traction-application-1",
        bookId: "traction",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Traction in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "100-startup",
    title: "The $100 Startup",
    author: "Chris Guillebeau",
    coverUrl: "/images/books/100-startup.jpg",
    category: "Strategy",
    ageRating: "12+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "100-startup-quiz-1",
        bookId: "100-startup",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand The $100 Startup?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'The $100 Startup'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'The $100 Startup'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "100-startup-reflection-1",
        bookId: "100-startup",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'The $100 Startup' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "100-startup-action-1",
        bookId: "100-startup",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from The $100 Startup",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "100-startup-share-1",
        bookId: "100-startup",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of The $100 Startup.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "100-startup-application-1",
        bookId: "100-startup",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from The $100 Startup in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "running-lean",
    title: "Running Lean",
    author: "Ash Maurya",
    coverUrl: "/images/books/running-lean.jpg",
    category: "Strategy",
    ageRating: "14+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "running-lean-quiz-1",
        bookId: "running-lean",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Running Lean?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Running Lean'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Running Lean'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "running-lean-reflection-1",
        bookId: "running-lean",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Running Lean' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "running-lean-action-1",
        bookId: "running-lean",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Running Lean",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "running-lean-share-1",
        bookId: "running-lean",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Running Lean.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "running-lean-application-1",
        bookId: "running-lean",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Running Lean in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "playing-to-win",
    title: "Playing to Win",
    author: "A.G. Lafley",
    coverUrl: "/images/books/playing-to-win.jpg",
    category: "Strategy",
    ageRating: "14+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "playing-to-win-quiz-1",
        bookId: "playing-to-win",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Playing to Win?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Playing to Win'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Playing to Win'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "playing-to-win-reflection-1",
        bookId: "playing-to-win",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Playing to Win' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "playing-to-win-action-1",
        bookId: "playing-to-win",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Playing to Win",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "playing-to-win-share-1",
        bookId: "playing-to-win",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Playing to Win.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "playing-to-win-application-1",
        bookId: "playing-to-win",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Playing to Win in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "measure-what-matters",
    title: "Measure What Matters",
    author: "John Doerr",
    coverUrl: "/images/books/measure-what-matters.jpg",
    category: "Strategy",
    ageRating: "14+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "measure-what-matters-quiz-1",
        bookId: "measure-what-matters",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Measure What Matters?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Measure What Matters'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Measure What Matters'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "measure-what-matters-reflection-1",
        bookId: "measure-what-matters",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Measure What Matters' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "measure-what-matters-action-1",
        bookId: "measure-what-matters",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Measure What Matters",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "measure-what-matters-share-1",
        bookId: "measure-what-matters",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Measure What Matters.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "measure-what-matters-application-1",
        bookId: "measure-what-matters",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Measure What Matters in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "made-to-stick",
    title: "Made to Stick",
    author: "Chip Heath",
    coverUrl: "/images/books/made-to-stick.jpg",
    category: "Strategy",
    ageRating: "12+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "made-to-stick-quiz-1",
        bookId: "made-to-stick",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Made to Stick?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Made to Stick'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Made to Stick'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "made-to-stick-reflection-1",
        bookId: "made-to-stick",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Made to Stick' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "made-to-stick-action-1",
        bookId: "made-to-stick",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Made to Stick",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "made-to-stick-share-1",
        bookId: "made-to-stick",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Made to Stick.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "made-to-stick-application-1",
        bookId: "made-to-stick",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Made to Stick in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "dotcom-secrets",
    title: "Dotcom Secrets",
    author: "Russell Brunson",
    coverUrl: "/images/books/dotcom-secrets.jpg",
    category: "Strategy",
    ageRating: "14+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "dotcom-secrets-quiz-1",
        bookId: "dotcom-secrets",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Dotcom Secrets?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Dotcom Secrets'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Dotcom Secrets'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "dotcom-secrets-reflection-1",
        bookId: "dotcom-secrets",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Dotcom Secrets' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "dotcom-secrets-action-1",
        bookId: "dotcom-secrets",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Dotcom Secrets",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "dotcom-secrets-share-1",
        bookId: "dotcom-secrets",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Dotcom Secrets.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "dotcom-secrets-application-1",
        bookId: "dotcom-secrets",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Dotcom Secrets in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "influence",
    title: "Influence",
    author: "Robert Cialdini",
    coverUrl: "/images/books/influence.jpg",
    category: "Strategy",
    ageRating: "14+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "influence-quiz-1",
        bookId: "influence",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Influence?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Influence'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Influence'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "influence-reflection-1",
        bookId: "influence",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Influence' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "influence-action-1",
        bookId: "influence",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Influence",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "influence-share-1",
        bookId: "influence",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Influence.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "influence-application-1",
        bookId: "influence",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Influence in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "leaders-eat-last",
    title: "Leaders Eat Last",
    author: "Simon Sinek",
    coverUrl: "/images/books/leaders-eat-last.jpg",
    category: "Leadership",
    ageRating: "12+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "leaders-eat-last-quiz-1",
        bookId: "leaders-eat-last",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Leaders Eat Last?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Leaders Eat Last'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Leaders Eat Last'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "leaders-eat-last-reflection-1",
        bookId: "leaders-eat-last",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Leaders Eat Last' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "leaders-eat-last-action-1",
        bookId: "leaders-eat-last",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Leaders Eat Last",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "leaders-eat-last-share-1",
        bookId: "leaders-eat-last",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Leaders Eat Last.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "leaders-eat-last-application-1",
        bookId: "leaders-eat-last",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Leaders Eat Last in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "rework",
    title: "Rework",
    author: "Jason Fried",
    coverUrl: "/images/books/rework.jpg",
    category: "Strategy",
    ageRating: "12+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "rework-quiz-1",
        bookId: "rework",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Rework?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Rework'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Rework'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "rework-reflection-1",
        bookId: "rework",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Rework' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "rework-action-1",
        bookId: "rework",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Rework",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "rework-share-1",
        bookId: "rework",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Rework.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "rework-application-1",
        bookId: "rework",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Rework in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "e-myth-revisited",
    title: "The E-Myth Revisited",
    author: "Michael Gerber",
    coverUrl: "/images/books/e-myth-revisited.jpg",
    category: "Strategy",
    ageRating: "14+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "e-myth-revisited-quiz-1",
        bookId: "e-myth-revisited",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand The E-Myth Revisited?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'The E-Myth Revisited'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'The E-Myth Revisited'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "e-myth-revisited-reflection-1",
        bookId: "e-myth-revisited",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'The E-Myth Revisited' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "e-myth-revisited-action-1",
        bookId: "e-myth-revisited",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from The E-Myth Revisited",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "e-myth-revisited-share-1",
        bookId: "e-myth-revisited",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of The E-Myth Revisited.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "e-myth-revisited-application-1",
        bookId: "e-myth-revisited",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from The E-Myth Revisited in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "this-is-marketing",
    title: "This Is Marketing",
    author: "Seth Godin",
    coverUrl: "/images/books/this-is-marketing.jpg",
    category: "Strategy",
    ageRating: "14+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "this-is-marketing-quiz-1",
        bookId: "this-is-marketing",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand This Is Marketing?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'This Is Marketing'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'This Is Marketing'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "this-is-marketing-reflection-1",
        bookId: "this-is-marketing",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'This Is Marketing' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "this-is-marketing-action-1",
        bookId: "this-is-marketing",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from This Is Marketing",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "this-is-marketing-share-1",
        bookId: "this-is-marketing",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of This Is Marketing.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "this-is-marketing-application-1",
        bookId: "this-is-marketing",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from This Is Marketing in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "building-a-storybrand",
    title: "Building a StoryBrand",
    author: "Donald Miller",
    coverUrl: "/images/books/building-a-storybrand.jpg",
    category: "Strategy",
    ageRating: "12+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "building-a-storybrand-quiz-1",
        bookId: "building-a-storybrand",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Building a StoryBrand?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Building a StoryBrand'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Building a StoryBrand'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "building-a-storybrand-reflection-1",
        bookId: "building-a-storybrand",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Building a StoryBrand' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "building-a-storybrand-action-1",
        bookId: "building-a-storybrand",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Building a StoryBrand",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "building-a-storybrand-share-1",
        bookId: "building-a-storybrand",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Building a StoryBrand.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "building-a-storybrand-application-1",
        bookId: "building-a-storybrand",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Building a StoryBrand in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "traffic-secrets",
    title: "Traffic Secrets",
    author: "Russell Brunson",
    coverUrl: "/images/books/traffic-secrets.jpg",
    category: "Strategy",
    ageRating: "14+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "traffic-secrets-quiz-1",
        bookId: "traffic-secrets",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Traffic Secrets?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Traffic Secrets'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Traffic Secrets'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "traffic-secrets-reflection-1",
        bookId: "traffic-secrets",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Traffic Secrets' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "traffic-secrets-action-1",
        bookId: "traffic-secrets",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Traffic Secrets",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "traffic-secrets-share-1",
        bookId: "traffic-secrets",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Traffic Secrets.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "traffic-secrets-application-1",
        bookId: "traffic-secrets",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Traffic Secrets in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "rich-dad-poor-dad",
    title: "Rich Dad Poor Dad",
    author: "Unknown Author",
    coverUrl: "/images/books/rich-dad-poor-dad.jpg",
    category: "Finance",
    ageRating: "10+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "rich-dad-poor-dad-quiz-1",
        bookId: "rich-dad-poor-dad",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Rich Dad Poor Dad?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Rich Dad Poor Dad'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Rich Dad Poor Dad'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "rich-dad-poor-dad-reflection-1",
        bookId: "rich-dad-poor-dad",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Rich Dad Poor Dad' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "rich-dad-poor-dad-action-1",
        bookId: "rich-dad-poor-dad",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Rich Dad Poor Dad",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "rich-dad-poor-dad-share-1",
        bookId: "rich-dad-poor-dad",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Rich Dad Poor Dad.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "rich-dad-poor-dad-application-1",
        bookId: "rich-dad-poor-dad",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Rich Dad Poor Dad in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "richest-man-in-babylon",
    title: "The Richest Man in Babylon",
    author: "George S. Clason",
    coverUrl: "/images/books/richest-man.jpg",
    category: "Finance",
    ageRating: "10+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "richest-man-in-babylon-quiz-1",
        bookId: "richest-man-in-babylon",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand The Richest Man in Babylon?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'The Richest Man in Babylon'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'The Richest Man in Babylon'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "richest-man-in-babylon-reflection-1",
        bookId: "richest-man-in-babylon",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'The Richest Man in Babylon' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "richest-man-in-babylon-action-1",
        bookId: "richest-man-in-babylon",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from The Richest Man in Babylon",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "richest-man-in-babylon-share-1",
        bookId: "richest-man-in-babylon",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of The Richest Man in Babylon.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "richest-man-in-babylon-application-1",
        bookId: "richest-man-in-babylon",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from The Richest Man in Babylon in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "psychology-of-money",
    title: "The Psychology of Money",
    author: "Morgan Housel",
    coverUrl: "/images/books/psychology-money.jpg",
    category: "Finance",
    ageRating: "12+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "psychology-of-money-quiz-1",
        bookId: "psychology-of-money",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand The Psychology of Money?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'The Psychology of Money'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'The Psychology of Money'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "psychology-of-money-reflection-1",
        bookId: "psychology-of-money",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'The Psychology of Money' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "psychology-of-money-action-1",
        bookId: "psychology-of-money",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from The Psychology of Money",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "psychology-of-money-share-1",
        bookId: "psychology-of-money",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of The Psychology of Money.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "psychology-of-money-application-1",
        bookId: "psychology-of-money",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from The Psychology of Money in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "i-will-teach-you-to-be-rich",
    title: "I Will Teach You to Be Rich",
    author: "Ramit Sethi",
    coverUrl: "/images/books/i-will-teach-you-to-be-rich.jpg",
    category: "Finance",
    ageRating: "14+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "i-will-teach-you-to-be-rich-quiz-1",
        bookId: "i-will-teach-you-to-be-rich",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand I Will Teach You to Be Rich?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'I Will Teach You to Be Rich'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'I Will Teach You to Be Rich'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "i-will-teach-you-to-be-rich-reflection-1",
        bookId: "i-will-teach-you-to-be-rich",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'I Will Teach You to Be Rich' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "i-will-teach-you-to-be-rich-action-1",
        bookId: "i-will-teach-you-to-be-rich",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from I Will Teach You to Be Rich",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "i-will-teach-you-to-be-rich-share-1",
        bookId: "i-will-teach-you-to-be-rich",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of I Will Teach You to Be Rich.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "i-will-teach-you-to-be-rich-application-1",
        bookId: "i-will-teach-you-to-be-rich",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from I Will Teach You to Be Rich in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "profit-first",
    title: "Profit First",
    author: "Mike Michalowicz",
    coverUrl: "/images/books/profit-first.jpg",
    category: "Finance",
    ageRating: "14+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "profit-first-quiz-1",
        bookId: "profit-first",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Profit First?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Profit First'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Profit First'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "profit-first-reflection-1",
        bookId: "profit-first",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Profit First' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "profit-first-action-1",
        bookId: "profit-first",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Profit First",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "profit-first-share-1",
        bookId: "profit-first",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Profit First.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "profit-first-application-1",
        bookId: "profit-first",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Profit First in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "automatic-millionaire",
    title: "The Automatic Millionaire",
    author: "David Bach",
    coverUrl: "/images/books/automatic-millionaire.jpg",
    category: "Finance",
    ageRating: "12+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "automatic-millionaire-quiz-1",
        bookId: "automatic-millionaire",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand The Automatic Millionaire?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'The Automatic Millionaire'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'The Automatic Millionaire'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "automatic-millionaire-reflection-1",
        bookId: "automatic-millionaire",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'The Automatic Millionaire' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "automatic-millionaire-action-1",
        bookId: "automatic-millionaire",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from The Automatic Millionaire",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "automatic-millionaire-share-1",
        bookId: "automatic-millionaire",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of The Automatic Millionaire.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "automatic-millionaire-application-1",
        bookId: "automatic-millionaire",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from The Automatic Millionaire in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "magic-of-thinking-big",
    title: "The Magic of Thinking Big",
    author: "David J. Schwartz",
    coverUrl: "/images/books/magic-of-thinking-big.jpg",
    category: "Mindset",
    ageRating: "12+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "magic-of-thinking-big-quiz-1",
        bookId: "magic-of-thinking-big",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand The Magic of Thinking Big?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'The Magic of Thinking Big'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'The Magic of Thinking Big'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "magic-of-thinking-big-reflection-1",
        bookId: "magic-of-thinking-big",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'The Magic of Thinking Big' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "magic-of-thinking-big-action-1",
        bookId: "magic-of-thinking-big",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from The Magic of Thinking Big",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "magic-of-thinking-big-share-1",
        bookId: "magic-of-thinking-big",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of The Magic of Thinking Big.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "magic-of-thinking-big-application-1",
        bookId: "magic-of-thinking-big",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from The Magic of Thinking Big in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "power-of-positive-thinking",
    title: "The Power of Positive Thinking",
    author: "Norman Vincent Peale",
    coverUrl: "/images/books/power-of-positive-thinking.jpg",
    category: "Mindset",
    ageRating: "10+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "power-of-positive-thinking-quiz-1",
        bookId: "power-of-positive-thinking",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand The Power of Positive Thinking?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'The Power of Positive Thinking'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'The Power of Positive Thinking'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "power-of-positive-thinking-reflection-1",
        bookId: "power-of-positive-thinking",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'The Power of Positive Thinking' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "power-of-positive-thinking-action-1",
        bookId: "power-of-positive-thinking",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from The Power of Positive Thinking",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "power-of-positive-thinking-share-1",
        bookId: "power-of-positive-thinking",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of The Power of Positive Thinking.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "power-of-positive-thinking-application-1",
        bookId: "power-of-positive-thinking",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from The Power of Positive Thinking in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "thinking-fast-and-slow",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    coverUrl: "/images/books/thinking-fast-and-slow.jpg",
    category: "Mindset",
    ageRating: "16+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "thinking-fast-and-slow-quiz-1",
        bookId: "thinking-fast-and-slow",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Thinking, Fast and Slow?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Thinking, Fast and Slow'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Thinking, Fast and Slow'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "thinking-fast-and-slow-reflection-1",
        bookId: "thinking-fast-and-slow",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Thinking, Fast and Slow' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "thinking-fast-and-slow-action-1",
        bookId: "thinking-fast-and-slow",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Thinking, Fast and Slow",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "thinking-fast-and-slow-share-1",
        bookId: "thinking-fast-and-slow",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Thinking, Fast and Slow.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "thinking-fast-and-slow-application-1",
        bookId: "thinking-fast-and-slow",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Thinking, Fast and Slow in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "4-hour-workweek",
    title: "The 4-Hour Workweek",
    author: "Tim Ferriss",
    coverUrl: "/images/books/4-hour-workweek.jpg",
    category: "Strategy",
    ageRating: "14+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "4-hour-workweek-quiz-1",
        bookId: "4-hour-workweek",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand The 4-Hour Workweek?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'The 4-Hour Workweek'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'The 4-Hour Workweek'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "4-hour-workweek-reflection-1",
        bookId: "4-hour-workweek",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'The 4-Hour Workweek' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "4-hour-workweek-action-1",
        bookId: "4-hour-workweek",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from The 4-Hour Workweek",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "4-hour-workweek-share-1",
        bookId: "4-hour-workweek",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of The 4-Hour Workweek.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "4-hour-workweek-application-1",
        bookId: "4-hour-workweek",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from The 4-Hour Workweek in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "quiet",
    title: "Quiet",
    author: "Susan Cain",
    coverUrl: "/images/books/quiet.jpg",
    category: "Mindset",
    ageRating: "12+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "quiet-quiz-1",
        bookId: "quiet",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Quiet?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Quiet'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Quiet'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "quiet-reflection-1",
        bookId: "quiet",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Quiet' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "quiet-action-1",
        bookId: "quiet",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Quiet",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "quiet-share-1",
        bookId: "quiet",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Quiet.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "quiet-application-1",
        bookId: "quiet",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Quiet in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "originals",
    title: "Originals",
    author: "Adam Grant",
    coverUrl: "/images/books/originals.jpg",
    category: "Mindset",
    ageRating: "14+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "originals-quiz-1",
        bookId: "originals",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Originals?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Originals'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Originals'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "originals-reflection-1",
        bookId: "originals",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Originals' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "originals-action-1",
        bookId: "originals",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Originals",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "originals-share-1",
        bookId: "originals",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Originals.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "originals-application-1",
        bookId: "originals",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Originals in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "ego-is-the-enemy",
    title: "Ego Is the Enemy",
    author: "Ryan Holiday",
    coverUrl: "/images/books/ego-is-the-enemy.jpg",
    category: "Mindset",
    ageRating: "14+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "ego-is-the-enemy-quiz-1",
        bookId: "ego-is-the-enemy",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Ego Is the Enemy?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Ego Is the Enemy'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Ego Is the Enemy'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "ego-is-the-enemy-reflection-1",
        bookId: "ego-is-the-enemy",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Ego Is the Enemy' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "ego-is-the-enemy-action-1",
        bookId: "ego-is-the-enemy",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Ego Is the Enemy",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "ego-is-the-enemy-share-1",
        bookId: "ego-is-the-enemy",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Ego Is the Enemy.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "ego-is-the-enemy-application-1",
        bookId: "ego-is-the-enemy",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Ego Is the Enemy in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "obstacle-is-the-way",
    title: "The Obstacle Is the Way",
    author: "Ryan Holiday",
    coverUrl: "/images/books/obstacle-is-the-way.jpg",
    category: "Mindset",
    ageRating: "12+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "obstacle-is-the-way-quiz-1",
        bookId: "obstacle-is-the-way",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand The Obstacle Is the Way?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'The Obstacle Is the Way'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'The Obstacle Is the Way'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "obstacle-is-the-way-reflection-1",
        bookId: "obstacle-is-the-way",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'The Obstacle Is the Way' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "obstacle-is-the-way-action-1",
        bookId: "obstacle-is-the-way",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from The Obstacle Is the Way",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "obstacle-is-the-way-share-1",
        bookId: "obstacle-is-the-way",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of The Obstacle Is the Way.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "obstacle-is-the-way-application-1",
        bookId: "obstacle-is-the-way",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from The Obstacle Is the Way in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "who-moved-my-cheese",
    title: "Who Moved My Cheese?",
    author: "Spencer Johnson",
    coverUrl: "/images/books/who-moved-my-cheese.jpg",
    category: "Mindset",
    ageRating: "10+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "who-moved-my-cheese-quiz-1",
        bookId: "who-moved-my-cheese",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Who Moved My Cheese??",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Who Moved My Cheese?'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Who Moved My Cheese?'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "who-moved-my-cheese-reflection-1",
        bookId: "who-moved-my-cheese",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Who Moved My Cheese?' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "who-moved-my-cheese-action-1",
        bookId: "who-moved-my-cheese",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Who Moved My Cheese?",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "who-moved-my-cheese-share-1",
        bookId: "who-moved-my-cheese",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Who Moved My Cheese?.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "who-moved-my-cheese-application-1",
        bookId: "who-moved-my-cheese",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Who Moved My Cheese? in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "5-am-club",
    title: "The 5 AM Club",
    author: "Unknown Author",
    coverUrl: "/images/books/5-am-club.jpg",
    category: "Mindset",
    ageRating: "12+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "5-am-club-quiz-1",
        bookId: "5-am-club",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand The 5 AM Club?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'The 5 AM Club'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'The 5 AM Club'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "5-am-club-reflection-1",
        bookId: "5-am-club",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'The 5 AM Club' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "5-am-club-action-1",
        bookId: "5-am-club",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from The 5 AM Club",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "5-am-club-share-1",
        bookId: "5-am-club",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of The 5 AM Club.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "5-am-club-application-1",
        bookId: "5-am-club",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from The 5 AM Club in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "deep-work",
    title: "Deep Work",
    author: "Cal Newport",
    coverUrl: "/images/books/deep-work.jpg",
    category: "Strategy",
    ageRating: "14+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "deep-work-quiz-1",
        bookId: "deep-work",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Deep Work?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Deep Work'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Deep Work'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "deep-work-reflection-1",
        bookId: "deep-work",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Deep Work' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "deep-work-action-1",
        bookId: "deep-work",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Deep Work",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "deep-work-share-1",
        bookId: "deep-work",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Deep Work.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "deep-work-application-1",
        bookId: "deep-work",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Deep Work in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "digital-minimalism",
    title: "Digital Minimalism",
    author: "Cal Newport",
    coverUrl: "/images/books/digital-minimalism.jpg",
    category: "Mindset",
    ageRating: "14+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "digital-minimalism-quiz-1",
        bookId: "digital-minimalism",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Digital Minimalism?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Digital Minimalism'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Digital Minimalism'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "digital-minimalism-reflection-1",
        bookId: "digital-minimalism",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Digital Minimalism' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "digital-minimalism-action-1",
        bookId: "digital-minimalism",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Digital Minimalism",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "digital-minimalism-share-1",
        bookId: "digital-minimalism",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Digital Minimalism.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "digital-minimalism-application-1",
        bookId: "digital-minimalism",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Digital Minimalism in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "essentialism",
    title: "Essentialism",
    author: "Greg McKeown",
    coverUrl: "/images/books/essentialism.jpg",
    category: "Strategy",
    ageRating: "14+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "essentialism-quiz-1",
        bookId: "essentialism",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Essentialism?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Essentialism'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Essentialism'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "essentialism-reflection-1",
        bookId: "essentialism",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Essentialism' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "essentialism-action-1",
        bookId: "essentialism",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Essentialism",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "essentialism-share-1",
        bookId: "essentialism",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Essentialism.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "essentialism-application-1",
        bookId: "essentialism",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Essentialism in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "cant-hurt-me",
    title: "Can't Hurt Me",
    author: "David Goggins",
    coverUrl: "/images/books/cant-hurt-me.jpg",
    category: "Mindset",
    ageRating: "14+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "cant-hurt-me-quiz-1",
        bookId: "cant-hurt-me",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Can't Hurt Me?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Can't Hurt Me'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Can't Hurt Me'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "cant-hurt-me-reflection-1",
        bookId: "cant-hurt-me",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Can't Hurt Me' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "cant-hurt-me-action-1",
        bookId: "cant-hurt-me",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Can't Hurt Me",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "cant-hurt-me-share-1",
        bookId: "cant-hurt-me",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Can't Hurt Me.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "cant-hurt-me-application-1",
        bookId: "cant-hurt-me",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Can't Hurt Me in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "extreme-ownership",
    title: "Extreme Ownership",
    author: "Jocko Willink",
    coverUrl: "/images/books/extreme-ownership.jpg",
    category: "Leadership",
    ageRating: "14+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "extreme-ownership-quiz-1",
        bookId: "extreme-ownership",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Extreme Ownership?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Extreme Ownership'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Extreme Ownership'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "extreme-ownership-reflection-1",
        bookId: "extreme-ownership",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Extreme Ownership' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "extreme-ownership-action-1",
        bookId: "extreme-ownership",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Extreme Ownership",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "extreme-ownership-share-1",
        bookId: "extreme-ownership",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Extreme Ownership.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "extreme-ownership-application-1",
        bookId: "extreme-ownership",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Extreme Ownership in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "awaken-the-giant-within",
    title: "Awaken the Giant Within",
    author: "Tony Robbins",
    coverUrl: "/images/books/awaken-the-giant-within.jpg",
    category: "Mindset",
    ageRating: "14+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "awaken-the-giant-within-quiz-1",
        bookId: "awaken-the-giant-within",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Awaken the Giant Within?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Awaken the Giant Within'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Awaken the Giant Within'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "awaken-the-giant-within-reflection-1",
        bookId: "awaken-the-giant-within",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Awaken the Giant Within' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "awaken-the-giant-within-action-1",
        bookId: "awaken-the-giant-within",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Awaken the Giant Within",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "awaken-the-giant-within-share-1",
        bookId: "awaken-the-giant-within",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Awaken the Giant Within.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "awaken-the-giant-within-application-1",
        bookId: "awaken-the-giant-within",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Awaken the Giant Within in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "limitless",
    title: "Limitless",
    author: "Jim Kwik",
    coverUrl: "/images/books/limitless.jpg",
    category: "Mindset",
    ageRating: "12+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "limitless-quiz-1",
        bookId: "limitless",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Limitless?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Limitless'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Limitless'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "limitless-reflection-1",
        bookId: "limitless",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Limitless' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "limitless-action-1",
        bookId: "limitless",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Limitless",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "limitless-share-1",
        bookId: "limitless",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Limitless.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "limitless-application-1",
        bookId: "limitless",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Limitless in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "make-your-bed",
    title: "Make Your Bed",
    author: "William H. McRaven",
    coverUrl: "/images/books/make-your-bed.jpg",
    category: "Mindset",
    ageRating: "10+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "make-your-bed-quiz-1",
        bookId: "make-your-bed",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Make Your Bed?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Make Your Bed'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Make Your Bed'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "make-your-bed-reflection-1",
        bookId: "make-your-bed",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Make Your Bed' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "make-your-bed-action-1",
        bookId: "make-your-bed",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Make Your Bed",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "make-your-bed-share-1",
        bookId: "make-your-bed",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Make Your Bed.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "make-your-bed-application-1",
        bookId: "make-your-bed",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Make Your Bed in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "switch",
    title: "Switch",
    author: "Chip Heath",
    coverUrl: "/images/books/switch.jpg",
    category: "Mindset",
    ageRating: "12+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "switch-quiz-1",
        bookId: "switch",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Switch?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Switch'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Switch'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "switch-reflection-1",
        bookId: "switch",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Switch' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "switch-action-1",
        bookId: "switch",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Switch",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "switch-share-1",
        bookId: "switch",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Switch.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "switch-application-1",
        bookId: "switch",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Switch in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "compound-effect",
    title: "The Compound Effect",
    author: "Darren Hardy",
    coverUrl: "/images/books/the-compound-effect.jpg",
    category: "Mindset",
    ageRating: "12+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "compound-effect-quiz-1",
        bookId: "compound-effect",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand The Compound Effect?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'The Compound Effect'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'The Compound Effect'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "compound-effect-reflection-1",
        bookId: "compound-effect",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'The Compound Effect' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "compound-effect-action-1",
        bookId: "compound-effect",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from The Compound Effect",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "compound-effect-share-1",
        bookId: "compound-effect",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of The Compound Effect.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "compound-effect-application-1",
        bookId: "compound-effect",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from The Compound Effect in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "shoe-dog",
    title: "Shoe Dog",
    author: "Phil Knight",
    coverUrl: "/images/books/shoe-dog.jpg",
    category: "Biography",
    ageRating: "14+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "shoe-dog-quiz-1",
        bookId: "shoe-dog",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Shoe Dog?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Shoe Dog'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Shoe Dog'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "shoe-dog-reflection-1",
        bookId: "shoe-dog",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Shoe Dog' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "shoe-dog-action-1",
        bookId: "shoe-dog",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Shoe Dog",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "shoe-dog-share-1",
        bookId: "shoe-dog",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Shoe Dog.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "shoe-dog-application-1",
        bookId: "shoe-dog",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Shoe Dog in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "steve-jobs",
    title: "Steve Jobs",
    author: "Walter Isaacson",
    coverUrl: "/images/books/steve-jobs.jpg",
    category: "Biography",
    ageRating: "14+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "steve-jobs-quiz-1",
        bookId: "steve-jobs",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Steve Jobs?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Steve Jobs'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Steve Jobs'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "steve-jobs-reflection-1",
        bookId: "steve-jobs",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Steve Jobs' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "steve-jobs-action-1",
        bookId: "steve-jobs",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Steve Jobs",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "steve-jobs-share-1",
        bookId: "steve-jobs",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Steve Jobs.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "steve-jobs-application-1",
        bookId: "steve-jobs",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Steve Jobs in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "elon-musk",
    title: "Elon Musk",
    author: "Walter Isaacson",
    coverUrl: "/images/books/elon-musk.jpg",
    category: "Biography",
    ageRating: "14+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "elon-musk-quiz-1",
        bookId: "elon-musk",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Elon Musk?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Elon Musk'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Elon Musk'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "elon-musk-reflection-1",
        bookId: "elon-musk",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Elon Musk' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "elon-musk-action-1",
        bookId: "elon-musk",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Elon Musk",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "elon-musk-share-1",
        bookId: "elon-musk",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Elon Musk.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "elon-musk-application-1",
        bookId: "elon-musk",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Elon Musk in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "creativity-inc",
    title: "Creativity, Inc.",
    author: "Ed Catmull",
    coverUrl: "/images/books/creativity-inc.jpg",
    category: "Biography",
    ageRating: "14+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "creativity-inc-quiz-1",
        bookId: "creativity-inc",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Creativity, Inc.?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Creativity, Inc.'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Creativity, Inc.'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "creativity-inc-reflection-1",
        bookId: "creativity-inc",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Creativity, Inc.' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "creativity-inc-action-1",
        bookId: "creativity-inc",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Creativity, Inc.",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "creativity-inc-share-1",
        bookId: "creativity-inc",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Creativity, Inc..",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "creativity-inc-application-1",
        bookId: "creativity-inc",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Creativity, Inc. in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "made-in-america",
    title: "Made in America",
    author: "Sam Walton",
    coverUrl: "/images/books/made-in-america.jpg",
    category: "Biography",
    ageRating: "14+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "made-in-america-quiz-1",
        bookId: "made-in-america",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Made in America?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Made in America'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Made in America'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "made-in-america-reflection-1",
        bookId: "made-in-america",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Made in America' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "made-in-america-action-1",
        bookId: "made-in-america",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Made in America",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "made-in-america-share-1",
        bookId: "made-in-america",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Made in America.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "made-in-america-application-1",
        bookId: "made-in-america",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Made in America in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "snowball",
    title: "The Snowball",
    author: "Alice Schroeder",
    coverUrl: "/images/books/the-snowball.jpg",
    category: "Biography",
    ageRating: "16+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "snowball-quiz-1",
        bookId: "snowball",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand The Snowball?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'The Snowball'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'The Snowball'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "snowball-reflection-1",
        bookId: "snowball",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'The Snowball' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "snowball-action-1",
        bookId: "snowball",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from The Snowball",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "snowball-share-1",
        bookId: "snowball",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of The Snowball.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "snowball-application-1",
        bookId: "snowball",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from The Snowball in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "titan",
    title: "Titan",
    author: "Ron Chernow",
    coverUrl: "/images/books/titan.jpg",
    category: "Biography",
    ageRating: "16+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "titan-quiz-1",
        bookId: "titan",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Titan?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Titan'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Titan'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "titan-reflection-1",
        bookId: "titan",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Titan' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "titan-action-1",
        bookId: "titan",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Titan",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "titan-share-1",
        bookId: "titan",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Titan.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "titan-application-1",
        bookId: "titan",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Titan in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "everything-store",
    title: "The Everything Store",
    author: "Brad Stone",
    coverUrl: "/images/books/the-everything-store.jpg",
    category: "Biography",
    ageRating: "14+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "everything-store-quiz-1",
        bookId: "everything-store",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand The Everything Store?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'The Everything Store'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'The Everything Store'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "everything-store-reflection-1",
        bookId: "everything-store",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'The Everything Store' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "everything-store-action-1",
        bookId: "everything-store",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from The Everything Store",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "everything-store-share-1",
        bookId: "everything-store",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of The Everything Store.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "everything-store-application-1",
        bookId: "everything-store",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from The Everything Store in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "grinding-it-out",
    title: "Grinding It Out",
    author: "Ray Kroc",
    coverUrl: "/images/books/grinding-it-out.jpg",
    category: "Biography",
    ageRating: "12+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "grinding-it-out-quiz-1",
        bookId: "grinding-it-out",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Grinding It Out?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Grinding It Out'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Grinding It Out'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "grinding-it-out-reflection-1",
        bookId: "grinding-it-out",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Grinding It Out' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "grinding-it-out-action-1",
        bookId: "grinding-it-out",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Grinding It Out",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "grinding-it-out-share-1",
        bookId: "grinding-it-out",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Grinding It Out.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "grinding-it-out-application-1",
        bookId: "grinding-it-out",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Grinding It Out in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "pour-your-heart-into-it",
    title: "Pour Your Heart Into It",
    author: "Howard Schultz",
    coverUrl: "/images/books/pour-your-heart-into-it.jpg",
    category: "Biography",
    ageRating: "14+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "pour-your-heart-into-it-quiz-1",
        bookId: "pour-your-heart-into-it",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Pour Your Heart Into It?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Pour Your Heart Into It'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Pour Your Heart Into It'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "pour-your-heart-into-it-reflection-1",
        bookId: "pour-your-heart-into-it",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Pour Your Heart Into It' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "pour-your-heart-into-it-action-1",
        bookId: "pour-your-heart-into-it",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Pour Your Heart Into It",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "pour-your-heart-into-it-share-1",
        bookId: "pour-your-heart-into-it",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Pour Your Heart Into It.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "pour-your-heart-into-it-application-1",
        bookId: "pour-your-heart-into-it",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Pour Your Heart Into It in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "delivering-happiness",
    title: "Delivering Happiness",
    author: "Tony Hsieh",
    coverUrl: "/images/books/delivering-happiness.jpg",
    category: "Biography",
    ageRating: "14+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "delivering-happiness-quiz-1",
        bookId: "delivering-happiness",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Delivering Happiness?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Delivering Happiness'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Delivering Happiness'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "delivering-happiness-reflection-1",
        bookId: "delivering-happiness",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Delivering Happiness' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "delivering-happiness-action-1",
        bookId: "delivering-happiness",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Delivering Happiness",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "delivering-happiness-share-1",
        bookId: "delivering-happiness",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Delivering Happiness.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "delivering-happiness-application-1",
        bookId: "delivering-happiness",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Delivering Happiness in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "bad-blood",
    title: "Bad Blood",
    author: "John Carreyrou",
    coverUrl: "/images/books/bad-blood.jpg",
    category: "Biography",
    ageRating: "16+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "bad-blood-quiz-1",
        bookId: "bad-blood",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Bad Blood?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Bad Blood'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Bad Blood'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "bad-blood-reflection-1",
        bookId: "bad-blood",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Bad Blood' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "bad-blood-action-1",
        bookId: "bad-blood",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Bad Blood",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "bad-blood-share-1",
        bookId: "bad-blood",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Bad Blood.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "bad-blood-application-1",
        bookId: "bad-blood",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Bad Blood in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "alibaba",
    title: "Alibaba",
    author: "Duncan Clark",
    coverUrl: "/images/books/alibaba.jpg",
    category: "Biography",
    ageRating: "14+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "alibaba-quiz-1",
        bookId: "alibaba",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Alibaba?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Alibaba'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Alibaba'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "alibaba-reflection-1",
        bookId: "alibaba",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Alibaba' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "alibaba-action-1",
        bookId: "alibaba",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Alibaba",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "alibaba-share-1",
        bookId: "alibaba",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Alibaba.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "alibaba-application-1",
        bookId: "alibaba",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Alibaba in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "disneys-land",
    title: "Disney's Land",
    author: "Unknown Author",
    coverUrl: "/images/books/disneys-land.jpg",
    category: "Biography",
    ageRating: "12+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "disneys-land-quiz-1",
        bookId: "disneys-land",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Disney's Land?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Disney's Land'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Disney's Land'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "disneys-land-reflection-1",
        bookId: "disneys-land",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Disney's Land' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "disneys-land-action-1",
        bookId: "disneys-land",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Disney's Land",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "disneys-land-share-1",
        bookId: "disneys-land",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Disney's Land.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "disneys-land-application-1",
        bookId: "disneys-land",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Disney's Land in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "wings-of-fire",
    title: "Wings of Fire",
    author: "A.P.J. Abdul Kalam",
    coverUrl: "/images/books/wings-of-fire.jpg",
    category: "Biography",
    ageRating: "12+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "wings-of-fire-quiz-1",
        bookId: "wings-of-fire",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Wings of Fire?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Wings of Fire'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Wings of Fire'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "wings-of-fire-reflection-1",
        bookId: "wings-of-fire",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Wings of Fire' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "wings-of-fire-action-1",
        bookId: "wings-of-fire",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Wings of Fire",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "wings-of-fire-share-1",
        bookId: "wings-of-fire",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Wings of Fire.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "wings-of-fire-application-1",
        bookId: "wings-of-fire",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Wings of Fire in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "open",
    title: "Open",
    author: "Andre Agassi",
    coverUrl: "/images/books/open.jpg",
    category: "Biography",
    ageRating: "14+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "open-quiz-1",
        bookId: "open",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Open?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Open'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Open'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "open-reflection-1",
        bookId: "open",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Open' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "open-action-1",
        bookId: "open",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Open",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "open-share-1",
        bookId: "open",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Open.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "open-application-1",
        bookId: "open",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Open in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "becoming",
    title: "Becoming",
    author: "Michelle Obama",
    coverUrl: "/images/books/becoming.jpg",
    category: "Biography",
    ageRating: "14+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "becoming-quiz-1",
        bookId: "becoming",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Becoming?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Becoming'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Becoming'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "becoming-reflection-1",
        bookId: "becoming",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Becoming' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "becoming-action-1",
        bookId: "becoming",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Becoming",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "becoming-share-1",
        bookId: "becoming",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Becoming.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "becoming-application-1",
        bookId: "becoming",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Becoming in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "greenlights",
    title: "Greenlights",
    author: "Matthew McConaughey",
    coverUrl: "/images/books/greenlights.jpg",
    category: "Biography",
    ageRating: "14+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "greenlights-quiz-1",
        bookId: "greenlights",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Greenlights?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Greenlights'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Greenlights'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "greenlights-reflection-1",
        bookId: "greenlights",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Greenlights' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "greenlights-action-1",
        bookId: "greenlights",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Greenlights",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "greenlights-share-1",
        bookId: "greenlights",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Greenlights.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "greenlights-application-1",
        bookId: "greenlights",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Greenlights in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "will",
    title: "Will",
    author: "Will Smith",
    coverUrl: "/images/books/will.png",
    category: "Biography",
    ageRating: "14+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "will-quiz-1",
        bookId: "will",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Will?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Will'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Will'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "will-reflection-1",
        bookId: "will",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Will' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "will-action-1",
        bookId: "will",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Will",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "will-share-1",
        bookId: "will",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Will.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "will-application-1",
        bookId: "will",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Will in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "empire-state-of-mind",
    title: "Empire State of Mind",
    author: "Zack O'Malley Greenburg",
    coverUrl: "/images/books/empire-state-of-mind.jpg",
    category: "Biography",
    ageRating: "14+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "empire-state-of-mind-quiz-1",
        bookId: "empire-state-of-mind",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Empire State of Mind?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Empire State of Mind'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Empire State of Mind'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "empire-state-of-mind-reflection-1",
        bookId: "empire-state-of-mind",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Empire State of Mind' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "empire-state-of-mind-action-1",
        bookId: "empire-state-of-mind",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Empire State of Mind",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "empire-state-of-mind-share-1",
        bookId: "empire-state-of-mind",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Empire State of Mind.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "empire-state-of-mind-application-1",
        bookId: "empire-state-of-mind",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Empire State of Mind in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "ride-of-a-lifetime",
    title: "The Ride of a Lifetime",
    author: "Robert Iger",
    coverUrl: "/images/books/the-ride-of-a-lifetime.jpg",
    category: "Biography",
    ageRating: "14+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "ride-of-a-lifetime-quiz-1",
        bookId: "ride-of-a-lifetime",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand The Ride of a Lifetime?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'The Ride of a Lifetime'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'The Ride of a Lifetime'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "ride-of-a-lifetime-reflection-1",
        bookId: "ride-of-a-lifetime",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'The Ride of a Lifetime' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "ride-of-a-lifetime-action-1",
        bookId: "ride-of-a-lifetime",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from The Ride of a Lifetime",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "ride-of-a-lifetime-share-1",
        bookId: "ride-of-a-lifetime",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of The Ride of a Lifetime.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "ride-of-a-lifetime-application-1",
        bookId: "ride-of-a-lifetime",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from The Ride of a Lifetime in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "invent-and-wander",
    title: "Invent and Wander",
    author: "Jeff Bezos",
    coverUrl: "/images/books/invent-and-wander.jpg",
    category: "Biography",
    ageRating: "14+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "invent-and-wander-quiz-1",
        bookId: "invent-and-wander",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Invent and Wander?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Invent and Wander'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Invent and Wander'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "invent-and-wander-reflection-1",
        bookId: "invent-and-wander",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Invent and Wander' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "invent-and-wander-action-1",
        bookId: "invent-and-wander",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Invent and Wander",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "invent-and-wander-share-1",
        bookId: "invent-and-wander",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Invent and Wander.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "invent-and-wander-application-1",
        bookId: "invent-and-wander",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Invent and Wander in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "iacocca",
    title: "Iacocca",
    author: "Lee Iacocca",
    coverUrl: "/images/books/iacocca.jpg",
    category: "Biography",
    ageRating: "14+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "iacocca-quiz-1",
        bookId: "iacocca",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Iacocca?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Iacocca'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Iacocca'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "iacocca-reflection-1",
        bookId: "iacocca",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Iacocca' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "iacocca-action-1",
        bookId: "iacocca",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Iacocca",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "iacocca-share-1",
        bookId: "iacocca",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Iacocca.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "iacocca-application-1",
        bookId: "iacocca",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Iacocca in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "virgin-way",
    title: "The Virgin Way",
    author: "Richard Branson",
    coverUrl: "/images/books/the-virgin-way.jpg",
    category: "Leadership",
    ageRating: "14+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "virgin-way-quiz-1",
        bookId: "virgin-way",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand The Virgin Way?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'The Virgin Way'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'The Virgin Way'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "virgin-way-reflection-1",
        bookId: "virgin-way",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'The Virgin Way' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "virgin-way-action-1",
        bookId: "virgin-way",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from The Virgin Way",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "virgin-way-share-1",
        bookId: "virgin-way",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of The Virgin Way.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "virgin-way-application-1",
        bookId: "virgin-way",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from The Virgin Way in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "steal-like-an-artist",
    title: "Steal Like an Artist",
    author: "Austin Kleon",
    coverUrl: "/images/books/steal-like-an-artist.jpg",
    category: "Creativity",
    ageRating: "12+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "steal-like-an-artist-quiz-1",
        bookId: "steal-like-an-artist",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Steal Like an Artist?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Steal Like an Artist'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Steal Like an Artist'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "steal-like-an-artist-reflection-1",
        bookId: "steal-like-an-artist",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Steal Like an Artist' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "steal-like-an-artist-action-1",
        bookId: "steal-like-an-artist",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Steal Like an Artist",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "steal-like-an-artist-share-1",
        bookId: "steal-like-an-artist",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Steal Like an Artist.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "steal-like-an-artist-application-1",
        bookId: "steal-like-an-artist",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Steal Like an Artist in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "show-your-work",
    title: "Show Your Work!",
    author: "Austin Kleon",
    coverUrl: "/images/books/show-your-work.jpg",
    category: "Creativity",
    ageRating: "12+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "show-your-work-quiz-1",
        bookId: "show-your-work",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Show Your Work!?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Show Your Work!'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Show Your Work!'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "show-your-work-reflection-1",
        bookId: "show-your-work",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Show Your Work!' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "show-your-work-action-1",
        bookId: "show-your-work",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Show Your Work!",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "show-your-work-share-1",
        bookId: "show-your-work",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Show Your Work!.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "show-your-work-application-1",
        bookId: "show-your-work",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Show Your Work! in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "big-magic",
    title: "Big Magic",
    author: "Elizabeth Gilbert",
    coverUrl: "/images/books/big-magic.jpg",
    category: "Creativity",
    ageRating: "14+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "big-magic-quiz-1",
        bookId: "big-magic",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Big Magic?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Big Magic'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Big Magic'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "big-magic-reflection-1",
        bookId: "big-magic",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Big Magic' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "big-magic-action-1",
        bookId: "big-magic",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Big Magic",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "big-magic-share-1",
        bookId: "big-magic",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Big Magic.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "big-magic-application-1",
        bookId: "big-magic",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Big Magic in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "war-of-art",
    title: "The War of Art",
    author: "Steven Pressfield",
    coverUrl: "/images/books/the-war-of-art.jpg",
    category: "Creativity",
    ageRating: "14+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "war-of-art-quiz-1",
        bookId: "war-of-art",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand The War of Art?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'The War of Art'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'The War of Art'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "war-of-art-reflection-1",
        bookId: "war-of-art",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'The War of Art' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "war-of-art-action-1",
        bookId: "war-of-art",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from The War of Art",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "war-of-art-share-1",
        bookId: "war-of-art",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of The War of Art.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "war-of-art-application-1",
        bookId: "war-of-art",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from The War of Art in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "factfulness",
    title: "Factfulness",
    author: "Hans Rosling",
    coverUrl: "/images/books/factfulness.jpg",
    category: "Economics",
    ageRating: "14+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "factfulness-quiz-1",
        bookId: "factfulness",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Factfulness?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Factfulness'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Factfulness'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "factfulness-reflection-1",
        bookId: "factfulness",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Factfulness' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "factfulness-action-1",
        bookId: "factfulness",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Factfulness",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "factfulness-share-1",
        bookId: "factfulness",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Factfulness.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "factfulness-application-1",
        bookId: "factfulness",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Factfulness in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "sapiens",
    title: "Sapiens",
    author: "Yuval Noah Harari",
    coverUrl: "/images/books/sapiens.jpg",
    category: "History",
    ageRating: "16+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "sapiens-quiz-1",
        bookId: "sapiens",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Sapiens?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Sapiens'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Sapiens'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "sapiens-reflection-1",
        bookId: "sapiens",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Sapiens' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "sapiens-action-1",
        bookId: "sapiens",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Sapiens",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "sapiens-share-1",
        bookId: "sapiens",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Sapiens.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "sapiens-application-1",
        bookId: "sapiens",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Sapiens in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "freakonomics",
    title: "Freakonomics",
    author: "Steven D. Levitt",
    coverUrl: "/images/books/freakonomics.jpg",
    category: "Economics",
    ageRating: "14+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "freakonomics-quiz-1",
        bookId: "freakonomics",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Freakonomics?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Freakonomics'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Freakonomics'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "freakonomics-reflection-1",
        bookId: "freakonomics",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Freakonomics' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "freakonomics-action-1",
        bookId: "freakonomics",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Freakonomics",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "freakonomics-share-1",
        bookId: "freakonomics",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Freakonomics.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "freakonomics-application-1",
        bookId: "freakonomics",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Freakonomics in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "outliers",
    title: "Outliers",
    author: "Malcolm Gladwell",
    coverUrl: "/images/books/outliers.jpg",
    category: "Mindset",
    ageRating: "12+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "outliers-quiz-1",
        bookId: "outliers",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Outliers?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Outliers'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Outliers'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "outliers-reflection-1",
        bookId: "outliers",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Outliers' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "outliers-action-1",
        bookId: "outliers",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Outliers",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "outliers-share-1",
        bookId: "outliers",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Outliers.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "outliers-application-1",
        bookId: "outliers",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Outliers in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "tipping-point",
    title: "The Tipping Point",
    author: "Malcolm Gladwell",
    coverUrl: "/images/books/the-tipping-point.jpg",
    category: "Strategy",
    ageRating: "12+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "tipping-point-quiz-1",
        bookId: "tipping-point",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand The Tipping Point?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'The Tipping Point'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'The Tipping Point'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "tipping-point-reflection-1",
        bookId: "tipping-point",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'The Tipping Point' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "tipping-point-action-1",
        bookId: "tipping-point",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from The Tipping Point",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "tipping-point-share-1",
        bookId: "tipping-point",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of The Tipping Point.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "tipping-point-application-1",
        bookId: "tipping-point",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from The Tipping Point in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "david-and-goliath",
    title: "David and Goliath",
    author: "Malcolm Gladwell",
    coverUrl: "/images/books/david-and-goliath.jpg",
    category: "Mindset",
    ageRating: "12+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "david-and-goliath-quiz-1",
        bookId: "david-and-goliath",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand David and Goliath?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'David and Goliath'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'David and Goliath'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "david-and-goliath-reflection-1",
        bookId: "david-and-goliath",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'David and Goliath' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "david-and-goliath-action-1",
        bookId: "david-and-goliath",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from David and Goliath",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "david-and-goliath-share-1",
        bookId: "david-and-goliath",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of David and Goliath.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "david-and-goliath-application-1",
        bookId: "david-and-goliath",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from David and Goliath in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "money-master-the-game",
    title: "Money: Master the Game",
    author: "Tony Robbins",
    coverUrl: "/images/books/money-master-the-game.jpg",
    category: "Finance",
    ageRating: "16+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "money-master-the-game-quiz-1",
        bookId: "money-master-the-game",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Money: Master the Game?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Money: Master the Game'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Money: Master the Game'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "money-master-the-game-reflection-1",
        bookId: "money-master-the-game",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Money: Master the Game' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "money-master-the-game-action-1",
        bookId: "money-master-the-game",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Money: Master the Game",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "money-master-the-game-share-1",
        bookId: "money-master-the-game",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Money: Master the Game.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "money-master-the-game-application-1",
        bookId: "money-master-the-game",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Money: Master the Game in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "unshakeable",
    title: "Unshakeable",
    author: "Tony Robbins",
    coverUrl: "/images/books/unshakeable.jpg",
    category: "Finance",
    ageRating: "14+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "unshakeable-quiz-1",
        bookId: "unshakeable",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Unshakeable?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Unshakeable'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Unshakeable'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "unshakeable-reflection-1",
        bookId: "unshakeable",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Unshakeable' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "unshakeable-action-1",
        bookId: "unshakeable",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Unshakeable",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "unshakeable-share-1",
        bookId: "unshakeable",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Unshakeable.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "unshakeable-application-1",
        bookId: "unshakeable",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Unshakeable in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "intelligent-investor",
    title: "The Intelligent Investor",
    author: "Benjamin Graham",
    coverUrl: "/images/books/the-intelligent-investor.jpg",
    category: "Finance",
    ageRating: "16+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "intelligent-investor-quiz-1",
        bookId: "intelligent-investor",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand The Intelligent Investor?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'The Intelligent Investor'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'The Intelligent Investor'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "intelligent-investor-reflection-1",
        bookId: "intelligent-investor",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'The Intelligent Investor' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "intelligent-investor-action-1",
        bookId: "intelligent-investor",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from The Intelligent Investor",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "intelligent-investor-share-1",
        bookId: "intelligent-investor",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of The Intelligent Investor.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "intelligent-investor-application-1",
        bookId: "intelligent-investor",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from The Intelligent Investor in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "one-up-on-wall-street",
    title: "One Up On Wall Street",
    author: "Peter Lynch",
    coverUrl: "/images/books/one-up-on-wall-street.jpg",
    category: "Finance",
    ageRating: "16+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "one-up-on-wall-street-quiz-1",
        bookId: "one-up-on-wall-street",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand One Up On Wall Street?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'One Up On Wall Street'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'One Up On Wall Street'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "one-up-on-wall-street-reflection-1",
        bookId: "one-up-on-wall-street",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'One Up On Wall Street' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "one-up-on-wall-street-action-1",
        bookId: "one-up-on-wall-street",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from One Up On Wall Street",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "one-up-on-wall-street-share-1",
        bookId: "one-up-on-wall-street",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of One Up On Wall Street.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "one-up-on-wall-street-application-1",
        bookId: "one-up-on-wall-street",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from One Up On Wall Street in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "team-of-teams",
    title: "Team of Teams",
    author: "Gen. Stanley McChrystal",
    coverUrl: "/images/books/team-of-teams.jpg",
    category: "Leadership",
    ageRating: "16+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "team-of-teams-quiz-1",
        bookId: "team-of-teams",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Team of Teams?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Team of Teams'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Team of Teams'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "team-of-teams-reflection-1",
        bookId: "team-of-teams",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Team of Teams' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "team-of-teams-action-1",
        bookId: "team-of-teams",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Team of Teams",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "team-of-teams-share-1",
        bookId: "team-of-teams",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Team of Teams.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "team-of-teams-application-1",
        bookId: "team-of-teams",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Team of Teams in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  },
  {
    id: "trillion-dollar-coach",
    title: "Trillion Dollar Coach",
    author: "Eric Schmidt",
    coverUrl: "/images/books/trillion-dollar-coach.jpg",
    category: "Leadership",
    ageRating: "14+",
    summary: "A transformative book about achieving success and personal growth.",
    keyLessons: [
      "Key lesson 1",
      "Key lesson 2",
      "Key lesson 3"
    ],
    tasks: [
      {
        id: "trillion-dollar-coach-quiz-1",
        bookId: "trillion-dollar-coach",
        type: "quiz",
        title: "Test Your Knowledge",
        description: "How well do you understand Trillion Dollar Coach?",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is a key concept from 'Trillion Dollar Coach'?",
              options: [
                "Success principles",
                "Working harder not smarter",
                "Avoiding all risks",
                "Following the crowd"
              ],
              correctAnswer: 0
            },
            {
              question: "True or False: This book teaches practical strategies.",
              options: ["True", "False"],
              correctAnswer: 0
            },
            {
              question: "What is the main takeaway from 'Trillion Dollar Coach'?",
              options: [
                "Apply the lessons to achieve success",
                "Read more books",
                "Avoid taking action",
                "Wait for opportunities"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "trillion-dollar-coach-reflection-1",
        bookId: "trillion-dollar-coach",
        type: "reflection",
        title: "Personal Reflection",
        description: "Connect the book's lessons to your own life.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "How can you apply the key lessons from 'Trillion Dollar Coach' to your current projects or goals?",
          minWords: 30
        }
      },
      {
        id: "trillion-dollar-coach-action-1",
        bookId: "trillion-dollar-coach",
        type: "action_challenge",
        title: "Apply It Daily",
        description: "Take action on what you learned.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Review the key concepts from Trillion Dollar Coach",
            "Identify one situation today where you can apply them",
            "Write down the result"
          ],
          checkpoints: [
            "I identified a situation",
            "I applied the concept",
            "I noted the outcome"
          ]
        }
      },
      {
        id: "trillion-dollar-coach-share-1",
        bookId: "trillion-dollar-coach",
        type: "share_teach",
        title: "Teach to Learn",
        description: "Share the wisdom of Trillion Dollar Coach.",
        rewards: { xp: 60, coins: 40 },
        difficulty: "medium",
        estimatedMinutes: 15
      },
      {
        id: "trillion-dollar-coach-application-1",
        bookId: "trillion-dollar-coach",
        type: "application",
        title: "Real World Application",
        description: "Use the strategies from Trillion Dollar Coach in real life.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "hard",
        estimatedMinutes: 20
      }
    ]
  }
];
