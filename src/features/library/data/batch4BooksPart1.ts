import { Book } from '../../../types';

export const BATCH_4_BOOKS_PART_1: Book[] = [
  {
    id: "grit-young-reader",
    title: "Grit (Young Reader)",
    author: "Angela Duckworth",
    coverUrl: "https://images.unsplash.com/photo-1543269664-7eef42226a21?w=400&q=80",
    category: "Mindset",
    ageRating: "12+",
    summary: "Discover why passion and perseverance—not just raw talent—are the true keys to achieving your biggest goals.",
    fullContent: `## 🌱 What is "Grit"?
Have you ever tried to learn a new skill—like playing guitar, coding, or a new sport—and found it so hard that you wanted to quit? 
Many people believe that if something is hard, it means they just aren't talented enough. But Angela Duckworth, a scientist and teacher, discovered something completely different. She found that the people who succeed in life don't necessarily have the most natural talent. Instead, they have something else: **Grit**.

Grit is a combination of two things:
1. **Passion**: Caring deeply about what you do and sticking to it over a long time.
2. **Perseverance**: Keeping going even when things get difficult, boring, or frustrating.

## 🏃‍♀️ The Talent Trap
Society loves to celebrate "naturals"—people who seem to be born great at something. But focusing only on talent can be a trap. 
If you believe talent is everything, what happens when you struggle? You might think, "I guess I don't have what it takes," and give up.
Duckworth created a simple formula to explain how success actually happens:

**Talent × Effort = Skill**
**Skill × Effort = Achievement**

Did you notice that "Effort" counts twice? Even if someone has less natural talent, applying intense effort over a long time can help them build superior skills and outachieve someone who relies on talent alone but doesn't work hard.

## 🧠 Growing Your Grit
The best part about grit is that you can grow it! It's not something you are just born with. Here are three ways to build your grit muscle:

1. **Develop a Fascination**: Find something you genuinely enjoy learning about. Passion doesn't happen overnight; it grows as you explore and ask questions.
2. **Practice with Purpose**: Don't just practice; practice deliberately. Focus on the things you are bad at, set a specific goal to improve them, get feedback, and repeat.
3. **Find a Higher Purpose**: Connect your work to something bigger than yourself. When you realize how your skills can help others, you gain a powerful source of motivation to keep going when it gets tough.

The next time you fail or get frustrated, don't say, "I'm not good at this." Say, "I'm not good at this *yet*." Stay committed, put in the effort, and let your grit lead you to success.`,
    keyLessons: [
      "Grit is passion and perseverance over the long term.",
      "Effort counts twice: Talent × Effort = Skill, and Skill × Effort = Achievement.",
      "You can grow grit through purpose, deliberate practice, and passion."
    ],
    tasks: [
      {
        id: "grit-young-reader-quiz-1",
        bookId: "grit-young-reader",
        type: "quiz",
        title: "The Grit Check",
        description: "Test your understanding of passion and perseverance.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What are the two main ingredients of 'Grit'?",
              options: [
                "Talent and Luck",
                "Passion and Perseverance",
                "Intelligence and Education",
                "Speed and Strength"
              ],
              correctAnswer: 1
            },
            {
              question: "In Angela Duckworth's formula, which word counts TWICE?",
              options: [
                "Talent",
                "Skill",
                "Effort",
                "Achievement"
              ],
              correctAnswer: 2
            }
          ]
        }
      },
      {
        id: "grit-young-reader-reflection-1",
        bookId: "grit-young-reader",
        type: "reflection",
        title: "Your Gritty Moment",
        description: "Reflect on a time you didn't give up.",
        rewards: { xp: 60, coins: 30 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "Think of a time when you were learning something new and wanted to quit, but you pushed through instead. How did you feel once you finally succeeded or improved?",
          minWords: 35
        }
      }
    ]
  },
  {
    id: "atomic-habits-teen",
    title: "Atomic Habits (Teen)",
    author: "James Clear",
    coverUrl: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&q=80",
    category: "Mindset",
    ageRating: "12+",
    summary: "Tiny changes yield massive results. Learn how to build good habits and break bad ones.",
    fullContent: `## 🧱 The Power of 1%
Have you ever tried to make a huge change in your life—like working out for an hour every day, or completely changing your diet—only to give up a week later?
Most of us believe that to get massive results, we need to take massive action. We put immense pressure on ourselves to make earth-shattering improvements. But James Clear argues that real change doesn't happen through huge leaps. It happens through **Atomic Habits**.

An atomic habit is a regular practice or routine that is not only small and easy to do, but also the source of incredible power. 
If you can get just **1% better each day** for one year, you'll end up 37 times better by the time you're done! It's the compounding effect of these tiny choices that shapes your destiny.

## 🔄 The Habit Loop
To change your habits, you need to understand how they work. Every habit follows a 4-step loop:
1. **Cue**: A trigger that tells your brain to start a behavior (like your phone buzzing).
2. **Craving**: The motivation or desire to change your state (wanting to see who texted you).
3. **Response**: The actual habit you perform (picking up the phone).
4. **Reward**: The end goal that satisfies the craving (reading the text).

## 🛠️ The 4 Laws of Behavior Change
To build a GOOD habit, you need to flip these four steps to your advantage:
- **1st Law (Cue): Make it obvious.** Don't just say "I will read more." Say, "I will read for 10 minutes at 8:00 PM sitting on my bed." Place the book right on your pillow.
- **2nd Law (Craving): Make it attractive.** Pair an action you *want* to do with an action you *need* to do. (e.g., "I will only listen to my favorite podcast while cleaning my room.")
- **3rd Law (Response): Make it easy.** Reduce friction. If you want to exercise in the morning, lay out your workout clothes the night before.
- **4th Law (Reward): Make it satisfying.** Reward yourself immediately after completing your habit.

To break a BAD habit, do the exact opposite:
Make the cue **invisible** (put your phone in another room while studying). Make it **unattractive**, make it **difficult** (add passwords to apps), and make it **unsatisfying**.

Focus on the systems in your life, not just the goals. Small, daily 1% improvements are what will ultimately transform who you become.`,
    keyLessons: [
      "Getting 1% better every day leads to massive compounding results.",
      "Every habit is based on a Cue, Craving, Response, and Reward.",
      "To build good habits: Make it Obvious, Attractive, Easy, and Satisfying."
    ],
    tasks: [
      {
        id: "atomic-habits-teen-quiz-1",
        bookId: "atomic-habits-teen",
        type: "quiz",
        title: "Habit Mechanics",
        description: "Test your knowledge of the 4 Laws of Behavior Change.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "If you improve by just 1% every day for a year, how much better will you be at the end?",
              options: [
                "10 times better",
                "37 times better",
                "100 times better",
                "It stays the same"
              ],
              correctAnswer: 1
            },
            {
              question: "What is the 3rd Law of Behavior Change (Response) for building a GOOD habit?",
              options: [
                "Make it obvious",
                "Make it difficult",
                "Make it easy",
                "Make it perfect"
              ],
              correctAnswer: 2
            }
          ]
        }
      },
      {
        id: "atomic-habits-teen-action-1",
        bookId: "atomic-habits-teen",
        type: "action_challenge",
        title: "Design Your Habit",
        description: "Create a plan to build a new tiny habit.",
        rewards: { xp: 80, coins: 40 },
        difficulty: "hard",
        estimatedMinutes: 20,
        actionChallenge: {
          steps: [
            "Pick ONE tiny habit you want to start (e.g., reading 2 pages, doing 5 pushups).",
            "Write down the exact Time and Location you will do it (Make it Obvious).",
            "Do your tiny habit today, and give yourself a small reward right after (Make it Satisfying)."
          ],
          checkpoints: [
            "Chose my tiny habit",
            "Set the Time and Location",
            "Completed the habit today!"
          ]
        }
      }
    ]
  },
  {
    id: "growth-mindset-coach",
    title: "Growth Mindset Coach",
    author: "Annie Brock",
    coverUrl: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=400&q=80",
    category: "Mindset",
    ageRating: "10+",
    summary: "Transform the way you see challenges and mistakes by upgrading your brain's operating system.",
    fullContent: `## 💻 The Brain's Operating System
Imagine your brain is a computer. The way you think about yourself and your abilities is like the operating system running in the background. According to researchers, there are two main operating systems people use: a **Fixed Mindset** and a **Growth Mindset**.

In a **Fixed Mindset**, people believe that intelligence and talent are set in stone. You're either good at math, or you aren't. You're either a natural athlete, or you're clumsy. 
When people with a fixed mindset face a hard challenge or make a mistake, they panic. They think, "If I fail, it proves I'm not smart!" So, they avoid taking risks, hide their mistakes, and give up easily.

In a **Growth Mindset**, people believe that abilities can be developed through hard work, good strategies, and input from others. They know their brain is like a muscle—it gets stronger when it does hard things.

## 🌧️ Re-thinking Mistakes
In a growth mindset, mistakes aren't permanent failures; they are data. They are proof that you are trying something new.
When you encounter a hurdle, a fixed mindset says: "I can't do this."
A growth mindset says: "What am I missing? Let me try a different strategy."

## 🚀 The Power of "YET"
One of the most powerful tools to rewrite your brain's operating system is a single, magical three-letter word: **YET**.
Whenever you catch yourself saying something negative about your abilities, just add "yet" to the end of the sentence.
- "I don't understand fractions... **yet**."
- "I can't hit a curveball... **yet**."
- "I haven't figured out this coding problem... **yet**."

That simple word changes your brain from a state of defeat into a state of learning. It reminds you that the learning curve is a process, and you are simply on the path.
Upgrade your mindset today. Embrace challenges, celebrate your mistakes as learning opportunities, and remember the power of yet!`,
    keyLessons: [
      "A Fixed Mindset believes talent is set; a Growth Mindset believes skills can be developed.",
      "Mistakes are data and proof that your brain is growing.",
      "Adding the word 'YET' to the end of a sentence transforms frustration into opportunity."
    ],
    tasks: [
      {
        id: "growth-mindset-coach-quiz-1",
        bookId: "growth-mindset-coach",
        type: "quiz",
        title: "Mindset vs. Mindset",
        description: "Test if you can tell the difference between fixed and growth mindsets.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "If someone says, 'I'm just naturally bad at math,' what kind of mindset are they showing?",
              options: [
                "Growth Mindset",
                "Fixed Mindset",
                "Genius Mindset",
                "Optimistic Mindset"
              ],
              correctAnswer: 1
            },
            {
              question: "What is the magical three-letter word that changes a fixed statement into a growth statement?",
              options: [
                "NOW",
                "TRY",
                "YET",
                "WIN"
              ],
              correctAnswer: 2
            }
          ]
        }
      },
      {
        id: "growth-mindset-coach-reflection-1",
        bookId: "growth-mindset-coach",
        type: "reflection",
        title: "Your 'Yet' Statement",
        description: "Apply the power of YET to your own life.",
        rewards: { xp: 60, coins: 30 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "Think of a subject or skill that you currently struggle with and feel frustrated about. Write a sentence describing your struggle, but make sure it ends with the word 'YET'. How does adding that word change how you feel about the challenge?",
          minWords: 30
        }
      }
    ]
  },
  {
    id: "power-of-yet-kids",
    title: "The Power of Yet",
    author: "Carol Dweck",
    coverUrl: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=400&q=80",
    category: "Mindset",
    ageRating: "6+",
    summary: "Discover the magic word that turns 'I can't' into an adventure of learning and growing.",
    fullContent: `## ✨ The Magic Word
Sometimes, when we try something new, it doesn't work out the very first time. Maybe you are trying to tie your shoes, ride a bike without training wheels, or read a long book. 
When things get hard, your brain might tell you, "I can't do this!" 

But there is a magical word that can change everything. That word is **YET**.

## 🧗‍♀️ Climbing the Mountain
Imagine you are standing at the bottom of a huge, beautiful mountain. At the very top is the thing you want to learn.
When you say "I can't," it's like putting a giant wall right in front of you. You stop climbing.
But when you say "I can't do it **YET**," a hidden path appears on the mountain. It means you haven't reached the top today, but you are still climbing!

Dr. Carol Dweck studies how brains grow. She found out that when kids try hard things and use the word "yet," neurons inside their brains actually stretch and connect. Your brain is literally growing bigger and stronger, just like your muscles do when you exercise!

## 🧩 Mistakes are Puzzles
When you make a mistake, it doesn't mean you are bad at something. It means your brain is working on a puzzle. 
Next time you draw a picture that doesn't look quite right, or miss a goal in soccer, don't get mad. Take a deep breath and remind yourself: "I just haven't figured it out YET. I will keep practicing!"
With enough practice and the right help, "not yet" will eventually turn into "I did it!"`,
    keyLessons: [
      "Saying 'I can't' stops you from trying, but saying 'Not Yet' keeps you learning.",
      "Doing hard things makes your brain grow stronger, like a muscle.",
      "Mistakes are just puzzles that you are still figuring out."
    ],
    tasks: [
      {
        id: "power-of-yet-quiz-1",
        bookId: "power-of-yet-kids",
        type: "quiz",
        title: "Magic Words",
        description: "Do you know how to use the magic word?",
        rewards: { xp: 40, coins: 20 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What happens to your brain when you try hard things and don't give up?",
              options: [
                "It gets tired and shrinks",
                "It stays exactly the same",
                "Neurons connect and it grows stronger",
                "It goes to sleep"
              ],
              correctAnswer: 2
            },
            {
              question: "If you can't ride a bike, what is the best thing to say?",
              options: [
                "I will never ride a bike.",
                "I can't ride a bike YET.",
                "Bikes are silly anyway.",
                "I should only walk."
              ],
              correctAnswer: 1
            }
          ]
        }
      },
      {
        id: "power-of-yet-action-1",
        bookId: "power-of-yet-kids",
        type: "action_challenge",
        title: "Catch the 'Can'ts'",
        description: "Turn your 'can'ts' into 'yets'.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 10,
        actionChallenge: {
          steps: [
            "Listen to yourself today. Try to catch yourself saying 'I can't'.",
            "When you catch it, immediately say the magic word out loud: 'Wait... I can't do it YET!'",
            "Try the hard thing one more time."
          ],
          checkpoints: [
            "Caught an 'I can't'",
            "Added the word YET",
            "Tried one more time"
          ]
        }
      }
    ]
  },
  {
    id: "you-are-a-badass-teen",
    title: "You Are a Badass (Teen)",
    author: "Jen Sincero",
    coverUrl: "https://images.unsplash.com/photo-1552508744-1696d4464960?w=400&q=80",
    category: "Mindset",
    ageRating: "14+",
    summary: "Stop doubting your greatness and start living an awesome life by changing your self-talk.",
    fullContent: `## 🛑 Stop the Self-Sabotage
Deep down, you have massive potential. You have dreams, talents, and unique quirks that the world desperately needs. So why don't you always feel awesome?
Often, the biggest thing standing in your way is... your own brain. More specifically, your subconscious beliefs.

Throughout our lives, we absorb negative messages from the world around us. We start telling ourselves stories like:
- "I'm not the smart one."
- "I don't have enough money to do that."
- "What if everyone laughs at me?"

Jen Sincero calls these thoughts "The Big Snooze." They are fear-based beliefs that try to keep you safely asleep in your comfort zone, but they completely block your greatness.

## 🗣️ Change Your Soundtrack
To become a badass, you have to wake up and change the soundtrack playing in your head. 
How you speak to yourself matters more than almost anything else. If you constantly tell yourself you're awkward, you will act awkward. If you constantly tell yourself you are capable and worthy, you will act bold.

Start replacing your negative beliefs with empowering ones. Practice affirmations (positive statements about yourself) even if they feel silly at first. Fake it until you believe it.

## 🚀 Take the Leap
You can't achieve massive, awesome things by sitting on the couch worrying about what other people think. 
Fear will always be there when you try something new. But a badass knows that fear is just a compass pointing towards the direction you need to grow. 
- Stop asking for permission to be yourself.
- Surround yourself with people who lift you up and support your wildest dreams.
- Take a leap of faith before you feel 100% "ready." (Spoiler: you rarely feel totally ready).

Love yourself fiercely, forgive your mistakes, and go out and create the life you actually want to live. You are a badass, so start acting like one.`,
    keyLessons: [
      "Your subconscious beliefs—'The Big Snooze'—are often what hold you back.",
      "How you speak to yourself dictates your reality; change your internal soundtrack.",
      "Fear is normal, but don't let worrying about other people's opinions stop you from acting."
    ],
    tasks: [
      {
        id: "you-are-a-badass-quiz-1",
        bookId: "you-are-a-badass-teen",
        type: "quiz",
        title: "Beating The Big Snooze",
        description: "Test your knowledge on overcoming self-doubt.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What does the author call our fear-based, self-sabotaging thoughts?",
              options: [
                "The Danger Zone",
                "The Big Snooze",
                "The Brain Cloud",
                "The Mind Trap"
              ],
              correctAnswer: 1
            },
            {
              question: "If you feel fear when trying something new and exciting, what does that usually mean?",
              options: [
                "It's a compass pointing toward your growth.",
                "You should stop and turn around immediately.",
                "You aren't talented enough for it.",
                "Other people will definitely laugh at you."
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "you-are-a-badass-reflection-1",
        bookId: "you-are-a-badass-teen",
        type: "reflection",
        title: "Flipping the Script",
        description: "Change a negative story you tell yourself.",
        rewards: { xp: 60, coins: 30 },
        difficulty: "hard",
        estimatedMinutes: 10,
        reflection: {
          prompt: "Write down one negative story or belief you often tell yourself (e.g., 'I am terrible at public speaking'). Then, flip the script and write a new, badass affirmation to replace it (e.g., 'I have important things to say and my confidence is growing every day').",
          minWords: 35
        }
      }
    ]
  },
  {
    id: "positive-thinking-kids",
    title: "Positive Thinking for Kids",
    author: "Julie Lythcott-Haims",
    coverUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80",
    category: "Mindset",
    ageRating: "8+",
    summary: "Learn how to flip your negative thoughts and build a sunny, resilient mindset.",
    fullContent: `## ☀️ The Lens You Look Through
Imagine you are wearing a pair of sunglasses. If the lenses are dark blue, the whole world looks blue and cold. If the lenses are bright yellow, the whole world looks sunny and warm!
Your mindset is just like those glasses. It's the "lens" you use to look at your life. Positive thinking means choosing to wear the sunny lenses, even when things don't go perfectly.

## 🪞 Catching ANTs
We all have negative thoughts. Sometimes, they march into our brains like tiny insects. We call these **ANTs**: Automatic Negative Thoughts.
An ANT might whisper, "You'll never finish this homework," or "Nobody liked my joke, I'm embarrassing."

The trick to positive thinking isn't to pretend ANTs don't exist. The trick is to **catch them** and squish them with a positive truth!
When you catch an ANT, ask yourself:
1. Is this thought 100% true? (Usually, no!)
2. What is a kinder, more helpful way to look at this?

If your ANT says: "I ruined the whole game by missing that shot."
Your positive truth says: "It was just one shot, and I tried my best. I'll practice more tomorrow!"

## 📝 The Gratitude Magnet
One of the fastest ways to become a positive thinker is to build a "Gratitude Magnet." When you focus on the good things happening around you, you attract more happiness!
Every night before you sleep, try pulling out your gratitude magnet by finding three good things that happened that day. It could be as big as winning a prize, or as small as a warm chocolate chip cookie.

Training your brain to spot the good things changes your lenses to a permanent sunny yellow!`,
    keyLessons: [
      "Your mindset acts like a pair of glasses that colors how you see the world.",
      "You can catch Automatic Negative Thoughts (ANTs) and replace them with kind truths.",
      "Focusing on gratitude trains your brain to notice the good things around you."
    ],
    tasks: [
      {
        id: "positive-thinking-quiz-1",
        bookId: "positive-thinking-kids",
        type: "quiz",
        title: "Squishing ANTs",
        description: "Test your knowledge of automatic negative thoughts.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What does 'ANT' stand for when talking about our mindset?",
              options: [
                "Always Needing Tacos",
                "Automatic Negative Thoughts",
                "Angry Noisy Temper",
                "Awareness Not Thinking"
              ],
              correctAnswer: 1
            },
            {
              question: "What is a good way to become a positive thinker?",
              options: [
                "Pretend nothing bad ever happens",
                "Use a Gratitude Magnet to find good things every day",
                "Never talk to anyone",
                "Only wear yellow sunglasses"
              ],
              correctAnswer: 1
            }
          ]
        }
      },
      {
        id: "positive-thinking-action-1",
        bookId: "positive-thinking-kids",
        type: "action_challenge",
        title: "The Gratitude Magnet",
        description: "Find the good in your day today.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        actionChallenge: {
          steps: [
            "Think of one really good thing that happened today.",
            "Think of one small thing that made you smile.",
            "Tell someone else about one of your good things."
          ],
          checkpoints: [
            "Found my really good thing",
            "Found my small reason to smile",
            "Shared the good news"
          ]
        }
      }
    ]
  },
  {
    id: "what-i-wish-i-knew-18",
    title: "What I Wish I Knew at 18",
    author: "Dennis Trittin",
    coverUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&q=80",
    category: "Mindset",
    ageRating: "14+",
    summary: "A practical guide to the life skills, character traits, and decisions you need to launch a successful adult life.",
    fullContent: `## 🚪 The Doorway to Adulthood
Being a teenager is like standing in a hallway filled with doors. Every choice you make opens some doors and locks others. 
Many adults look back at their teenage years and think, "If only I knew then what I know now, I could have avoided so much stress!" 

Dennis Trittin wrote this book to give you the ultimate cheat-sheet for stepping into adulthood with confidence, focusing on Character, Relationships, and Life Skills.

## 🧭 Character is Your Compass
When you leave home and go to college or start working, you won't always have parents or teachers looking over your shoulder. Your true success depends on your character.
- **Integrity**: Doing the right thing when nobody is watching. People trust those with integrity, and in the real world, trust is the ultimate currency.
- **Resiliency**: The ability to bounce back. Adulthood will throw you curveballs—lost jobs, broken relationships, tough classes. Your ability to get back up determines your altitude.

## 💬 The Power of Relationships
The people you surround yourself with will either lift you or drag you down. 
- **Choose friends wisely**: Show me your friends, and I can show you your future.
- **Master communication**: Learn to look people in the eye, listen actively, and resolve conflicts without burning bridges. How you treat people sets the tone for your entire professional network.

## 💸 Practical Life Skills
Finally, adulthood requires practical street smarts that aren't always taught in high school:
- **Financial literacy**: Spend less than you earn, avoid credit card debt, and save a portion of every paycheck. 
- **Time management**: You are now the CEO of your own schedule. Prioritize what's important, not just what's urgent.

By building a strong character, nurturing healthy relationships, and managing your time and money wisely, you aren't just surviving adulthood—you're mastering it.`,
    keyLessons: [
      "Character traits like integrity and resiliency are more valuable than pure talent in the adult world.",
      "The friends you choose and how you communicate dramatically shape your future.",
      "Mastering practical skills like financial discipline and time management is crucial for independence."
    ],
    tasks: [
      {
        id: "wish-i-knew-18-quiz-1",
        bookId: "what-i-wish-i-knew-18",
        type: "quiz",
        title: "Adulthood Cheat Sheet",
        description: "Test your understanding of the pillars of adulthood.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What does the author suggest is the ultimate 'currency' in the real world regarding character?",
              options: [
                "Intelligence",
                "Trust (built via Integrity)",
                "Humor",
                "Physical strength"
              ],
              correctAnswer: 1
            },
            {
              question: "What is a key principle of financial literacy mentioned in the text?",
              options: [
                "Spend exactly what you earn",
                "Use credit cards for everything",
                "Spend less than you earn and avoid debt",
                "Never save money until you are 30"
              ],
              correctAnswer: 2
            }
          ]
        }
      },
      {
        id: "wish-i-knew-18-reflection-1",
        bookId: "what-i-wish-i-knew-18",
        type: "reflection",
        title: "Your Future Compass",
        description: "Reflect on the character traits you want to be known for.",
        rewards: { xp: 60, coins: 30 },
        difficulty: "hard",
        estimatedMinutes: 10,
        reflection: {
          prompt: "When you are 25 years old, what are three character traits (e.g., honest, reliable, resilient) you want your friends and coworkers to describe you with? Why are those specific traits important to you?",
          minWords: 40
        }
      }
    ]
  }
];
