import { Book } from '../../../types';

export const BATCH_3_BOOKS_PART_1: Book[] = [
  {
    id: "richest-kid-in-the-world",
    title: "The Richest Kid in the World",
    author: "Joey Coleman",
    coverUrl: "https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?w=400&q=80",
    category: "Finance",
    ageRating: "10+",
    summary: "A practical guide for young people to understand money, work, and the foundations of building true wealth early in life.",
    fullContent: `## 🏆 What Does It Mean to Be Rich?

If you ask most people what it means to be "rich," they will talk about mansions, fast cars, and unlimited spending. But true wealth is not just about the money you spend; it's about the freedom you have. 

Being the "richest kid in the world" doesn't mean having a billion dollars before you leave school. It means developing a mindset where you understand how money works, so it can work for you. It means having the discipline to save, the courage to earn, and the wisdom to know the difference between needs and wants.

---

## 💡 The Value of a Dollar

One of the most important concepts to learn early is the true value of money. Money is simply an exchange for value. When you buy a video game or a new pair of shoes, you aren't just trading colorful paper or digital numbers — you are trading the *time* and *effort* it took to earn it. 

If you earn $10 an hour, and a pair of sneakers costs $100, those sneakers don't just cost money. They cost **10 hours of your life**. 

When you start looking at prices in terms of "hours of work," your spending habits change instantly. You begin to ask: *Is this item really worth 10 hours of my hard work?* Often, the answer is no.

---

## 📈 The Magic of Compound Interest

Albert Einstein reportedly called compound interest the "Eighth Wonder of the World." For a young person, compound interest is the closest thing to real-world magic. 

Here is how it works: When you save money and put it in an account that pays interest, your money earns money. And then, the new money earns even more money. 

If you start saving just $50 a month when you're 10 years old, by the time you're an adult, you'll have thousands of dollars that you didn't even have to work for. Time is the most important ingredient in building wealth, and as a young person, time is your greatest asset. 

**Rule of Thumb:** Start saving today. Even small amounts grow into mountains if you give them enough time.

---

## 🛒 Needs vs. Wants

Our brains are constantly tricked by advertisements. Every commercial and billboard tries to convince us that a "want" is actually a "need." 

- **Needs** are things you must have to survive: food, water, clothing, shelter.
- **Wants** are everything else: designer clothes, the latest phone, restaurant meals.

There is nothing wrong with buying things you want, but the richest kids learn to prioritize. They make sure their needs are covered, they set aside money for savings, and *then* they spend what's left on their wants.

---

## 🌟 True Wealth Isn't Just Money

Finally, remember that human capital — your skills, your health, your knowledge, and your relationships — are forms of wealth that money can't buy. 

Investing in yourself by reading books, learning a new language, or practicing a valuable skill like coding or public speaking will pay you back more than any bank account ever could.

The wealthiest people in the world are those who have financial freedom, strong relationships, health, and a purpose. You can start building all of these today.
`,
    keyLessons: [
      "Understand the true value of money as a trade for your time and effort.",
      "Start saving early to take advantage of compound interest.",
      "True wealth includes human capital: your skills, health, and knowledge."
    ],
    tasks: [
      {
        id: "richest-kid-in-the-world-quiz",
        bookId: "richest-kid-in-the-world",
        type: "quiz",
        title: "Wealth Mindset Quiz",
        description: "Test your understanding of the core concepts of true wealth.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is the best way to determine the true cost of an item?",
              options: [
                "Convert the price into the number of hours you have to work to earn that amount.",
                "Compare it to the prices of other items in the store.",
                "Check how much money you have in the bank.",
                "Ask your friends what they think."
              ],
              correctAnswer: 0
            },
            {
              question: "What did Albert Einstein reportedly call the 'Eighth Wonder of the World'?",
              options: [
                "The Stock Market",
                "Compound Interest",
                "Gold",
                "Real Estate"
              ],
              correctAnswer: 1
            },
            {
              question: "Which of the following is an example of 'human capital'?",
              options: [
                "Money in a savings account",
                "A rare collectible",
                "Your skills and knowledge",
                "A designer jacket"
              ],
              correctAnswer: 2
            }
          ]
        }
      },
      {
        id: "richest-kid-in-the-world-reflection",
        bookId: "richest-kid-in-the-world",
        type: "reflection",
        title: "Needs vs. Wants Analysis",
        description: "Reflect on your recent purchases and categorize them.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "Think about the last three things you spent money on. Were they 'needs' or 'wants'? How do you feel about those purchases now?",
          minWords: 30
        }
      },
      {
        id: "richest-kid-in-the-world-action",
        bookId: "richest-kid-in-the-world",
        type: "action_challenge",
        title: "The Time Conversion Challenge",
        description: "Translate prices into time before you buy.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Figure out your 'hourly wage' (e.g., your allowance divided by chores time, or a typical entry-level job rate like $10/hr).",
            "Pick an item you want to buy.",
            "Calculate how many hours you would have to work to afford it.",
            "Decide if it's still worth buying."
          ],
          checkpoints: [
            "Calculated hourly rate",
            "Calculated item's time cost",
            "Made a final buying decision"
          ]
        }
      }
    ]
  },
  {
    id: "i-will-teach-you-to-be-rich-teen",
    title: "I Will Teach You to Be Rich (Teen Edition)",
    author: "Ramit Sethi",
    coverUrl: "https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=400&q=80",
    category: "Finance",
    ageRating: "14+",
    summary: "The ultimate guide for teens to automate their money, spend guilt-free on what they love, and stop worrying about finances.",
    fullContent: `## 🎯 Define Your 'Rich Life'

Most advice about money revolves around cutting back. "Don't buy lattes," "skip the movie," "stop spending on fun." Ramit Sethi flips this on its head. His philosophy is simple: **Spend extravagantly on the things you love, and cut costs mercilessly on the things you don't.**

Before you can be rich, you need to define what a "Rich Life" looks like for *you*. For one person, it might be traveling the world. For another, it might be buying the best gaming rig. For someone else, it might be the freedom to never worry about paying a bill. 

If you don't know what you are saving for, managing money will always feel like a chore.

---

## ⚙️ Automate Everything

Willpower is a limited resource. If you rely on your own memory to manually save money or pay bills every month, eventually, you will fail. 

The secret to building wealth without stress is **automation**. 
Set up your bank accounts so that the moment money comes in (from a job or allowance), it is automatically split up:
- A percentage goes to savings.
- A percentage goes to investing.
- The rest goes to guilt-free spending.

When your money functions on autopilot, you never have to feel guilty about buying that video game or jacket, because you already know your savings and investments have been taken care of invisibly in the background.

---

## 🏦 The Right Accounts Matter

Not all bank accounts are created equal. You need the right tools to build wealth effectively. 

First, get a **fee-free checking account**. You should never pay a bank to hold your money.

Second, open a **high-yield savings account (HYSA)**. Most traditional banks pay you almost 0% interest on your savings. An HYSA pays significantly more, allowing your money to grow faster just by sitting there. 

---

## 📈 Index Funds: The Lazy Way to Riches

Wall Street movies make investing look stressful and complicated, with people screaming on trading floors. Real investing is incredibly boring — and that is how it should be.

Instead of trying to pick the 'next big stock' (which usually ends in losing money), the smartest investors buy **Index Funds**. An index fund contains tiny pieces of hundreds of the top companies in the world. Instead of betting on one horse, you own the entire racetrack. 

By investing a set amount into index funds every month and never touching it, you let the collective growth of the global economy build your wealth over decades.

---

## 🚫 Stop Making Excuses

"I don't earn enough to save."
"Investing is too risky."
"I'll start when I'm older."

The biggest barrier to becoming rich isn't the stock market; it's your own excuses. Earning $1000 a month with bad money habits is worse than earning $100 a month with great money habits. If you learn to master $100, you will know exactly what to do when it becomes $100,000. 

Start today. Start small. Automate making the right choices. That is the true secret to living a Rich Life.`,
    keyLessons: [
      "Define your 'Rich Life' so you know what you are aiming for.",
      "Automate your finances to save and invest without relying on willpower.",
      "Spend extravagantly on what you love, but cut costs mercilessly on what you don't."
    ],
    tasks: [
      {
        id: "i-will-teach-you-to-be-rich-teen-quiz",
        bookId: "i-will-teach-you-to-be-rich-teen",
        type: "quiz",
        title: "The Rich Life Quiz",
        description: "Test your knowledge of the 'I Will Teach You to Be Rich' philosophy.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "According to the book, how should you handle your spending?",
              options: [
                "Cut back on everything.",
                "Spend completely freely.",
                "Spend extravagantly on what you love, cut costs mercilessly on what you don't.",
                "Only spend on your basic needs."
              ],
              correctAnswer: 2
            },
            {
              question: "What is the key to executing good money habits?",
              options: [
                "Having extreme willpower",
                "Automating your finances so it happens invisibly",
                "Earning a huge salary",
                "Tracking every single penny"
              ],
              correctAnswer: 1
            },
            {
              question: "What type of investment strategy is recommended?",
              options: [
                "Day trading single stocks",
                "Buying Index Funds and holding them long-term",
                "Keeping all money in a checking account",
                "Investing only in gold"
              ],
              correctAnswer: 1
            }
          ]
        }
      },
      {
        id: "i-will-teach-you-to-be-rich-teen-reflection",
        bookId: "i-will-teach-you-to-be-rich-teen",
        type: "reflection",
        title: "Design Your Rich Life",
        description: "Visualize what a 'Rich Life' looks like specifically for you.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "Describe your personal 'Rich Life'. What is the one thing you would love to spend money on without any guilt? What is something you don't care about and can cut from your spending?",
          minWords: 30
        }
      },
      {
        id: "i-will-teach-you-to-be-rich-teen-action",
        bookId: "i-will-teach-you-to-be-rich-teen",
        type: "action_challenge",
        title: "Automate One Habit",
        description: "Use automation to enforce a positive habit.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Identify one financial action you struggle to do consistently (like saving a portion of your allowance).",
            "Set up a system to do it automatically (e.g., asking parents to put 10% directly into a savings jar/account before giving you the rest).",
            "Monitor the automated system for one week."
          ],
          checkpoints: [
            "Identified the habit",
            "Set up the automation",
            "Verified it worked"
          ]
        }
      }
    ]
  },
  {
    id: "random-walk-down-wall-street-teen",
    title: "A Random Walk Down Wall Street (Teen Edition)",
    author: "Burton Malkiel",
    coverUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80",
    category: "Finance",
    ageRating: "14+",
    summary: "A practical guide demystifying the stock market, proving that simple, long-term strategies beat trying to predict the future.",
    fullContent: `## 🎲 The Myth of Predicting the Market

Imagine a monkey throwing darts at the financial pages of a newspaper to select stocks. Now imagine a highly-paid Wall Street expert in a tailored suit carefully analyzing data to pick their stocks. Who would win? 

According to Burton Malkiel's famous theory, the **dart-throwing monkey** would do just as well as the expert. 

This is the core idea behind *A Random Walk Down Wall Street*. The stock market moves randomly in the short term. News breaks instantly, and prices adjust before anyone can consistently predict the outcome. Therefore, trying to "time the market" — buying exactly when a price is lowest and selling when it's highest — is practically impossible.

---

## 🎢 The Rollercoaster of Bubbles

Throughout history, people have gotten caught up in speculative "bubbles" — moments when the price of an asset skyrockets simply because everyone believes it will go higher, ignoring its actual value. 

In the 1600s, people went crazy for **Tulip Bulbs** in Holland, paying the price of a house for a single flower. Eventually, people realized it was just a flower, and the price crashed. We saw the same thing with internet companies in the late 1990s, and housing in 2008. 

The lesson? When everyone around you says an investment is "guaranteed to make you rich quick," that is exactly when you should probably walk away.

---

## 🛡️ The Ultimate Strategy: Indexing

If predicting the market is impossible, and bubbles are dangerous, how do you make money?

The answer is simple, boring, and highly effective: **Broad Market Index Funds**. 

An index fund is an investment that tracks a large portion of the market, like the S&P 500 (the 500 largest companies in the US). Instead of trying to find the needle in the haystack (the one stock that will boom), an index fund simply buys the entire haystack. 

Because the global economy tends to grow over decades, by owning a little bit of everything, your wealth grows with it. Furthermore, index funds have incredibly low fees because you aren't paying a frantic manager to actively trade stocks for you.

---

## ⏳ Time > Timing

The most important factor in investing is not *when* you start or finding the perfect stock. The most important factor is **how long your money stays invested**. 

Because of compound interest, a teenager who invests just $100 a month and never touches it can easily retire a multi-millionaire. The stock market will have bad years, crashes, and recessions. But a "Random Walk" investor doesn't panic. They know that over a timeline of 20 or 30 years, the market trends upward. 

**Buy everything, hold it forever, and let time do the heavy lifting.**`,
    keyLessons: [
      "The short-term movement of the stock market is essentially random and cannot be timed.",
      "Speculative 'bubbles' happen when people buy based on hype, leading to inevitable crashes.",
      "Buying low-cost index funds and holding them for decades is the most reliable way to build wealth."
    ],
    tasks: [
      {
        id: "random-walk-down-wall-street-teen-quiz",
        bookId: "random-walk-down-wall-street-teen",
        type: "quiz",
        title: "Market Myths Quiz",
        description: "Test your knowledge on market predictability and index funds.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What does the 'Random Walk' theory suggest about the stock market?",
              options: [
                "Experts can perfectly predict stock movements.",
                "Short-term stock prices move randomly and unpredictably.",
                "Stocks always go down on Fridays.",
                "You should only buy stocks randomly without any plan."
              ],
              correctAnswer: 1
            },
            {
              question: "What is an index fund?",
              options: [
                "A fund managed by an expensive expert who trades daily.",
                "A fund that puts all its money into one high-risk tech company.",
                "A low-cost fund that owns a diverse portfolio representing a whole market.",
                "An account where you hide cash to avoid taxes."
              ],
              correctAnswer: 2
            },
            {
              question: "What is the most important factor in successful investing according to the book?",
              options: [
                "Timing the market perfectly.",
                "Finding the exact right stock.",
                "How long your money is invested (Time in the market).",
                "Having a loud stock broker."
              ],
              correctAnswer: 2
            }
          ]
        }
      },
      {
        id: "random-walk-down-wall-street-teen-reflection",
        bookId: "random-walk-down-wall-street-teen",
        type: "reflection",
        title: "Recognizing Hype",
        description: "Reflect on a time you saw a 'bubble' or extreme hype.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "Think about a time when a specific product, game, or trend became incredibly popular very quickly, but then everyone stopped caring about it shortly after. What was it, and why do you think the hype faded?",
          minWords: 30
        }
      },
      {
        id: "random-walk-down-wall-street-teen-action",
        bookId: "random-walk-down-wall-street-teen",
        type: "action_challenge",
        title: "The Patience Test",
        description: "Practice long-term holding by protecting a small asset.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Take a dollar coin or a specific small bill.",
            "Put it in a hidden place or jar with a note: 'Do not touch for 30 days'.",
            "Resist the urge to spend it, representing holding an investment through long periods.",
            "Check on it after a month to prove your discipline."
          ],
          checkpoints: [
            "Stored the money securely",
            "Waited the assigned time",
            "Successfully resisted spending it"
          ]
        }
      }
    ]
  },
  {
    id: "automatic-millionaire-junior",
    title: "The Automatic Millionaire (Junior Edition)",
    author: "David Bach",
    coverUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80",
    category: "Finance",
    ageRating: "12+",
    summary: "A practical guide showing that you don't need a budget, willpower, or a high salary to become rich—you just need to automate your habits.",
    fullContent: `## ✨ The Myth of Willpower

When people want to get rich, they typically try to completely change their behavior. They vow to stop buying snacks, they create massive, complex budgets, and they promise to use sheer willpower to save money every month. 

David Bach argues that **willpower eventually fails everyone**. You might stick to a budget for a few weeks, but eventually, you get tired, stressed, or distracted, and you revert to your old habits. 

The secret to wealth isn't discipline. It's making the right decisions happen automatically, so you never even have to think about them.

---

## ☕ The Latte Factor

If someone asked you to save $150 a month, you might say, "I absolutely cannot afford that." But if you buy a coffee or bubble tea every day for $5, that adds up to exactly $150 a month. 

This is what Bach calls **"The Latte Factor."** Small, everyday expenses that we don't even think about act like tiny leaks in our financial boat. Identifying your "Latte Factor" doesn't necessarily mean you have to give up all your treats — it means recognizing how much money is flowing out of your life on things you might not genuinely care about. 

If you redirected just $5 a day into an investment account starting in your teens, compound interest would turn that "coffee money" into over a million dollars by the time you retire. 

---

## 🥇 Pay Yourself First

Most people follow this flawed formula:
**Income - Expenses = Savings**

They pay their rent, pay the phone company, buy their clothes, and if anything is magically left over at the end of the month, they save it. (Usually, nothing is left).

The Automatic Millionaire switches the formula: **Pay Yourself First**. Before you pay anyone else, take at least 10% of what you earn and put it directly into your savings or investments. 

If you earn $100, the first $10 belongs to your future self. 

---

## 🤖 Automate It

The magic happens when "Paying Yourself First" is automated. If you have to remember to move the money, your willpower will fail. 

You must set up your banking systems so that the very day you get paid, 10% is immediately and automatically transferred into an investment or high-yield savings account. You never see the money in your checking account, so you never feel tempted to spend it.

When the system runs on autopilot, you can spend whatever is left over absolutely guilt-free. You are an Automatic Millionaire in the making.`,
    keyLessons: [
      "Willpower fails eventually; automation is the true key to financial success.",
      "The 'Latte Factor' proves that small daily expenses compound into massive wealth if invested instead.",
      "Always 'Pay Yourself First' by automatically saving a portion of your income before paying any other expenses."
    ],
    tasks: [
      {
        id: "automatic-millionaire-junior-quiz",
        bookId: "automatic-millionaire-junior",
        type: "quiz",
        title: "Automation Mastery Quiz",
        description: "See how well you grasp the concept of becoming an Automatic Millionaire.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is 'The Latte Factor'?",
              options: [
                "The cost of opening a coffee shop.",
                "The idea that small, daily expenses add up to huge amounts over time.",
                "A tax applied only to luxury drinks.",
                "Drinking coffee makes you work harder."
              ],
              correctAnswer: 1
            },
            {
              question: "What does it mean to 'Pay Yourself First'?",
              options: [
                "Buying yourself a treat on payday.",
                "Saving a percentage of your money automatically before paying any bills or spending.",
                "Making yourself the boss of a company.",
                "Paying off your credit card first."
              ],
              correctAnswer: 1
            },
            {
              question: "According to David Bach, why do most budgets fail?",
              options: [
                "Because math is too hard.",
                "Because they rely on willpower, which eventually fails.",
                "Because banks change their rules.",
                "Because inflation makes budgets irrelevant."
              ],
              correctAnswer: 1
            }
          ]
        }
      },
      {
        id: "automatic-millionaire-junior-reflection",
        bookId: "automatic-millionaire-junior",
        type: "reflection",
        title: "Identify Your Latte Factor",
        description: "Analyze your own small daily or weekly spending habits.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "What is your personal 'Latte Factor'? What is one small thing you buy frequently (snacks, game cosmetics, sodas) that you could reduce to save for your future self instead?",
          minWords: 30
        }
      },
      {
        id: "automatic-millionaire-junior-action",
        bookId: "automatic-millionaire-junior",
        type: "action_challenge",
        title: "The 'Pay Yourself First' Plan",
        description: "Establish your automatic saving rule.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Decide on a fixed percentage (e.g., 10% or 20%) that you will 'pay yourself first' from all future earnings.",
            "Set up a separate physical jar or a dedicated sub-account in a banking app specifically for this money.",
            "Write down the rule and stick it where you will see it when you get your next allowance or paycheck."
          ],
          checkpoints: [
            "Decided on a percentage",
            "Set up a dedicated space/account",
            "Wrote down the rule"
          ]
        }
      }
    ]
  },
  {
    id: "stack-your-money",
    title: "Stack Your Money",
    author: "Shannon McLay",
    coverUrl: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=400&q=80",
    category: "Finance",
    ageRating: "12+",
    summary: "A straightforward, modern guide to taking control of your financial goals and navigating money in the modern world.",
    fullContent: `## 🏋️ Money is Like Fitness

Approaching your finances is incredibly similar to approaching your physical fitness. If you eat junk food and sit on the couch all day, you won't be healthy. If you spend mindlessly and ignore your bank account, your finances will be sick.

Shannon McLay created the concept of the "Financial Gym." Just like you need a routine, consistency, and sometimes a personal trainer to get physically fit, you need a plan, regular check-ins, and good habits to get "financially fit." 

No one gets a six-pack overnight, and no one builds a massive "stack" of wealth in a week. It requires showing up and putting in the reps consistently over time.

---

## 🧭 Your Financial GPS

If you get into a car and just start driving without a map, you might see some cool things, but you probably won't reach a meaningful destination. 

Building wealth requires a **Financial GPS**. You need to know two things:
1. **Your current location** (How much money you have right now, and how much you owe).
2. **Your destination** (What your specific financial goals are).

Are you saving for a car? College? A startup business? Once you have a clear destination, you can map out the route (your budget). A budget isn't a restriction; it's a map that tells your money exactly where you want it to go so it doesn't wander off.

---

## 🚫 The Trap of Debt

One of the heaviest weights that will keep you from stacking your money is **bad debt**, particularly credit card debt. 

Credit cards allow you to buy things with money you don't actually have. If you don't pay the full balance back immediately, the bank charges you an incredibly high "interest rate." This means an item that costs $50 could end up costing you $100 or more as the interest piles up month after month. 

When you owe bad debt, your money is working for the bank, not for you. The fastest way to stack money is to avoid bad debt entirely or pay it off as fiercely as possible.

---

## 🤝 The Power of the Side Hustle

In the modern world, relying on just one source of income is risky. Whether it's an allowance or an entry-level part-time job, having a single stream of money means if it stops, you are stuck.

To accelerate how fast you stack your money, you need a **Side Hustle**. This is a secondary way to earn income outside of your main commitment. For a teen, a side hustle could be:
- Tutoring younger students
- Selling digital art or crafts online
- Reselling vintage clothing
- Mowing lawns or pet-sitting 

The beauty of a side hustle is that the income can be directed 100% toward your saving and investing goals, rapidly accelerating your wealth journey.`,
    keyLessons: [
      "Financial fitness requires consistency and healthy habits, just like physical fitness.",
      "A budget is a GPS; without a clear destination and route, your money will get lost.",
      "Accelerate wealth building by avoiding bad debt and starting a side hustle."
    ],
    tasks: [
      {
        id: "stack-your-money-quiz",
        bookId: "stack-your-money",
        type: "quiz",
        title: "Financial Fitness Check",
        description: "Test your knowledge on getting financially fit.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "How is money compared to fitness in the book?",
              options: [
                "Both require expensive equipment.",
                "Both require consistency, routines, and healthy habits over time.",
                "You can achieve both perfectly in one day.",
                "Only adults can do both."
              ],
              correctAnswer: 1
            },
            {
              question: "What is the primary danger of credit card debt?",
              options: [
                "It requires you to carry a plastic card.",
                "Banks stop letting you use cash.",
                "High interest rates mean you end up paying far more than the item originally cost.",
                "It makes it too easy to save money."
              ],
              correctAnswer: 2
            },
            {
              question: "What is the main benefit of a 'Side Hustle'?",
              options: [
                "It replaces your education.",
                "It allows you to work 24/7 with no sleep.",
                "It provides an extra income stream that can be directed entirely toward your goals.",
                "It forces you to get a business license."
              ],
              correctAnswer: 2
            }
          ]
        }
      },
      {
        id: "stack-your-money-reflection",
        bookId: "stack-your-money",
        type: "reflection",
        title: "Your Financial GPS",
        description: "Determine your current location and destination.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "What is your main financial 'destination' (goal) for the next year? How much money do you realistically need to reach it?",
          minWords: 30
        }
      },
      {
        id: "stack-your-money-action",
        bookId: "stack-your-money",
        type: "action_challenge",
        title: "Brainstorm Your Side Hustle",
        description: "Identify how you can create a second stream of income.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "List 3 skills you have that other people might find valuable or helpful.",
            "Choose one skill and brainstorm how you could charge money for it (even a small amount).",
            "Write down one simple action you can take this week to get your first 'client' or sale."
          ],
          checkpoints: [
            "Listed 3 skills",
            "Chose a realistic side hustle idea",
            "Identified the first actionable step to start"
          ]
        }
      }
    ]
  },
  {
    id: "money-ninja",
    title: "Money Ninja",
    author: "Mary Nhin",
    coverUrl: "https://images.unsplash.com/photo-1593672715438-d88a70629abe?w=400&q=80",
    category: "Finance",
    ageRating: "6+",
    summary: "A fun and engaging story that introduces essential concepts like working, saving, and avoiding impulse spending through the adventures of a clever ninja.",
    fullContent: `## 🥷 Meet Money Ninja

Money Ninja is great at stealth and martial arts, but his best skill is understanding the value of a dollar! Unlike the other ninjas who instantly buy every shiny new toy they see, Money Ninja has learned the secret moves of **Earning, Saving, and Delaying Gratification**.

While his friends complain that their pockets are constantly empty, Money Ninja has a secret stash of coins quietly growing in the background.

---

## 🏃 Earning: The First Move

To manage money, you first have to *earn* money. Money Ninja knows that gold coins do not just fall out of the sky into his hands. They have to be exchanged for something valuable: **work**.

When Money Ninja wants a new training sword, he doesn't whine or beg for it. He asks: *"What problems can I solve to earn this?"*
He rakes leaves, he helps organize the dojo, and he sells items he no longer uses. By putting in the effort, the money he earns feels far more valuable than money simply given to him.

---

## 🛑 The Impulse Block

The most dangerous attack a ninja faces isn't a flying kick; it's an **impulse buy**. 

Imagine walking through a store. Suddenly, you see a giant, colorful box of candy or an epic toy. Your brain yells: *"I MUST HAVE THIS RIGHT NOW!"* This is an impulse attack.

Money Ninja uses a special defensive move to block this attack: the **24-Hour Rule**. When he feels the sudden urge to buy something he didn't plan for, he steps back and waits for exactly 24 hours. Most of the time, by the next day, the intense urge is gone, and he realizes he didn't really need the item at all. He saved his money!

---

## 🏗️ Stacking Your Savings

Finally, Money Ninja knows that a true master prepares for the future. Every time he earns money, he splits it up.

He puts some in his **Spending Pouch** to enjoy right away. But he always puts some in his **Saving Pouch**. He watches the Saving Pouch grow week by week. 

Because he is disciplined, when a massive opportunity arrives — like a special ninja training camp that costs a lot of coins — his friends cannot go because they bought too much candy. But Money Ninja is ready. His patience has paid off. 

Be like Money Ninja: Earn hard, block impulses, and save for the ultimate prize!`,
    keyLessons: [
      "Money is earned by solving problems and working hard.",
      "Defend against terrible 'impulse buys' by using the 24-Hour Rule.",
      "Split your money between spending for today and saving for the future."
    ],
    tasks: [
      {
        id: "money-ninja-quiz",
        bookId: "money-ninja",
        type: "quiz",
        title: "Ninja Knowledge Check",
        description: "See if you possess the wisdom of the Money Ninja.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is the best way to earn money like Money Ninja?",
              options: [
                "Ask a wizard to drop it from the sky.",
                "Solve a problem or do valuable work.",
                "Borrow it from friends and never pay them back.",
                "Sell terrible items to unsuspecting people."
              ],
              correctAnswer: 1
            },
            {
              question: "What defensive move does Money Ninja use against 'impulse buys'?",
              options: [
                "The 24-Hour Rule (wait a day before buying).",
                "The Ninja Smoke Bomb (run away from the store).",
                "The Credit Card Swipe (buy it fast so you don't think).",
                "The Complain Technique."
              ],
              correctAnswer: 0
            },
            {
              question: "What happens when Money Ninja splits his money into Savings?",
              options: [
                "He gets sad.",
                "He loses it all.",
                "He is ready when a big, important opportunity comes up.",
                "His friends steal it."
              ],
              correctAnswer: 2
            }
          ]
        }
      },
      {
        id: "money-ninja-reflection",
        bookId: "money-ninja",
        type: "reflection",
        title: "Block the Impulse",
        description: "Think about a time you faced an impulse attack.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "easy",
        estimatedMinutes: 10,
        reflection: {
          prompt: "Describe a time you really wanted to buy something immediately (an impulse buy). Did you buy it? If you did, did you regret it later? If you waited, were you glad you saved the money?",
          minWords: 20
        }
      },
      {
        id: "money-ninja-action",
        bookId: "money-ninja",
        type: "action_challenge",
        title: "The 24-Hour Defense Practice",
        description: "Use the ninja defense in the real world.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Wait until the next time you feel a sudden, strong urge to buy something (snack, game add-on, toy).",
            "Stop, step away, and enforce the 24-Hour Rule.",
            "Write down the item and how much it cost. After 24 hours, decide if you still want it."
          ],
          checkpoints: [
            "Felt the impulse",
            "Applied the 24-Hour wait",
            "Evaluated the urge the next day"
          ]
        }
      }
    ]
  },
  {
    id: "buy-the-avocado-toast",
    title: "Buy the Avocado Toast",
    author: "Rebecca Walker",
    coverUrl: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400&q=80",
    category: "Finance",
    ageRating: "14+",
    summary: "A refreshing, guilt-free approach to personal finance that teaches you how to align your spending with your core values—and yes, enjoy the avocado toast.",
    fullContent: `## 🥑 Escaping the Guilt Trap

For years, traditional financial experts have shamed young people for their spending habits. The famous joke is that young people can't afford to buy houses because they spend too much money on "$5 avocado toast and fancy coffee." 

This book proves that idea is mostly mathematically incorrect, and more importantly, it creates a toxic relationship with money. If you feel guilty every single time you spend money on something that brings you joy, financial planning will feel like a prison, and you will eventually rebel and crash your budget.

You are allowed to buy the avocado toast. But to do so safely, your money must align with your true values.

---

## 🧭 Value-Based Spending

Instead of looking at a spreadsheet of strict rules, you must look at your own heart. **Value-based spending** means you look deeply at what brings you the highest level of genuine happiness, meaning, and health.

If having a fancy coffee with friends every Saturday is the highlight of your week and keeps you connected and happy, *that is high-value spending*. Keep doing it! 

However, if you are spending $50 a month on a streaming service you never watch, or buying clothes you wear once and toss in the back of your closet — that is *low-value spending*. The goal isn't to stop spending. The goal is to aggressively redirect money away from low-value areas and intentionally funnel it toward the high-value areas of your life.

---

## 🏗️ Getting the Boring Stuff Out of the Way

You can only afford to buy the avocado toast if the foundation is secure. You must prioritize your 'boring' obligations first:
1. **The Emergency Fund:** Creating a buffer so a broken phone or unexpected expense doesn't ruin your life.
2. **Paying Off High-Interest Debt:** Stopping the bleeding.
3. **Automated Investing:** Setting aside investments for the long term.

Once those core pillars are funded automatically, you are free. The leftover money is yours to direct toward whatever brings you the most joy without an ounce of guilt.

---

## 💸 Money is a Tool, Not a Score

Many people get caught up treating money like a high score in a video game. They hoard it simply to watch the number go up, forgetting its purpose. 

Money is an energy exchange; it is a tool meant to design the life you want. Hoarding it all out of fear means you aren’t properly using the tool. Giving it all away recklessly means you lose control of the tool. 

Learn to master the tool: protect your future, respect your present, and yes — buy the avocado toast.`,
    keyLessons: [
      "Do not feel guilty for spending money on things that bring you genuine joy.",
      "Adopt 'Value-Based Spending': cut fiercely on things you don't care about so you can splurge on what you love.",
      "Secure the 'boring' basics first (emergency fund, investing), then use the rest of your money as a tool to design your ideal life."
    ],
    tasks: [
      {
        id: "buy-the-avocado-toast-quiz",
        bookId: "buy-the-avocado-toast",
        type: "quiz",
        title: "Value-Based Spending Quiz",
        description: "Test your knowledge on guilt-free financial planning.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "Why does the book say you shouldn't feel guilty about buying 'avocado toast' (or something you love)?",
              options: [
                "Because food is essential for survival.",
                "Because constant guilt creates a toxic relationship with money and makes you abandon your budget.",
                "Because avocado toast is free.",
                "Because credit cards make everything affordable."
              ],
              correctAnswer: 1
            },
            {
              question: "What is 'Value-Based Spending'?",
              options: [
                "Only buying the cheapest items in the grocery store.",
                "Aligning your spending heavily toward things that bring you joy and cutting out things you don't care about.",
                "Buying everything you want, regardless of the cost.",
                "Giving all your money to charity."
              ],
              correctAnswer: 1
            },
            {
              question: "What must you secure first before you spend guilt-free?",
              options: [
                "A millionaire mindset.",
                "A brand new car.",
                "The 'boring' pillars like an emergency fund and automated investments.",
                "Approval from your parents."
              ],
              correctAnswer: 2
            }
          ]
        }
      },
      {
        id: "buy-the-avocado-toast-reflection",
        bookId: "buy-the-avocado-toast",
        type: "reflection",
        title: "Your High and Low Values",
        description: "Analyze where your money should and shouldn't go.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "What is a 'low-value' area in your life that you spend money on (or ask for) but don't really care about? What is a 'high-value' area that truly brings you joy?",
          minWords: 30
        }
      },
      {
        id: "buy-the-avocado-toast-action",
        bookId: "buy-the-avocado-toast",
        type: "action_challenge",
        title: "The Guilt-Free Splurge",
        description: "Practice intentional, positive spending.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Cancel or completely cut one 'low-value' expense this week.",
            "Take the money you saved and intentionally spend it on a 'high-value' item or experience.",
            "Enjoy the high-value item consciously, without any guilt."
          ],
          checkpoints: [
            "Cut a low-value expense",
            "Allocated funds to a high-value item",
            "Practiced guilt-free enjoyment"
          ]
        }
      }
    ]
  }
];
