import { Book } from '../../../types';

export const BATCH_3_BOOKS_PART_2: Book[] = [
  {
    id: "broke-millennial-teen",
    title: "Broke Millennial (Teen Edition)",
    author: "Erin Lowry",
    coverUrl: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400&q=80",
    category: "Finance",
    ageRating: "14+",
    summary: "Stop scraping by and get your financial life together with practical, relatable advice on navigating money in the modern world.",
    fullContent: `## 💸 The #Broke Reality

You scroll through social media and see everyone living their best life: traveling, buying designer clothes, eating at expensive restaurants. Meanwhile, you check your bank account and realize you can barely afford a sandwich. 

This is the #Broke reality that many young adults face. But in *Broke Millennial*, Erin Lowry argues that being "broke" isn't a permanent state — it is a starting line. And the fastest way to get off the starting line is to stop being terrified of looking at your own money.

---

## 🛑 Stop Ignoring Your Bank Account

The number one mistake young people make is **financial avoidance**. They know their bank account is low, so they don't look at it. They cross their fingers and hope their card doesn't decline when they buy coffee. 

This only creates anxiety. You cannot fix a problem you refuse to look at. The first step to financial freedom is knowing exactly how much you have and exactly how much you owe. 

Make it a habit to log into your bank account and review your transactions at least once a week. This "money date" removes the fear and gives you control.

---

## 🗣️ Navigating the 'Money Talk'

Money can ruin relationships if you don't know how to talk about it. 
Imagine your friends invite you to an expensive concert, but you are trying to save money. Most people either:
1. Go anyway and stress over the money, or
2. Stay home and feel incredibly left out.

Erin Lowry offers a third option: **Be honest, but lead with a solution.**

You can say: *"I really want to hang out, but I'm crushing a savings goal right now. Instead of the concert, do you want to come over and host a movie night?"*

True friends will respect your financial boundaries. Learning how to say "no" to expensive outings without feeling ashamed is a superpower.

---

## 📈 Protect Your Credit Score

Your credit score is essentially an "adult GPA" that tells banks how trustworthy you are with money. If it is high, you get the best rates on cars and apartments. If it is low, everything in life becomes more difficult and expensive.

To build a flawless credit score early:
- Never borrow money you cannot pay back immediately.
- Use a credit card like a debit card — pay the entire balance off in full, every single month.
- Pay every bill on time, without exception.

Treat credit cards as tools for convenience and rewards, not as free money.

---

## 🚀 The ultimate cure for broke: Earn More

Budgeting and cutting costs are essential, but there is a limit to how much you can cut. There is no limit to how much you can earn. 

If you are constantly scraping by, the most powerful adjustment you can make is finding a way to increase your income. Look for side hustles, negotiate for a raise at your part-time job, or learn a high-income skill (like graphic design or coding). 

Combine earning more with spending smart, and you will leave the "#Broke" phase behind forever.`,
    keyLessons: [
      "Stop avoiding your financial reality; review your bank accounts regularly.",
      "Learn to navigate awkward money situations with friends by offering cheaper alternatives.",
      "Your credit score is your 'adult GPA'; protect it fiercely by paying bills in full."
    ],
    tasks: [
      {
        id: "broke-millennial-teen-quiz",
        bookId: "broke-millennial-teen",
        type: "quiz",
        title: "Broke Basics Quiz",
        description: "Test your knowledge of the Broke Millennial principles.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is the first step to escaping the '#Broke' reality?",
              options: [
                "Asking your parents for a loan.",
                "Stop avoiding your bank account and look at the actual numbers.",
                "Buying expensive things to look wealthy.",
                "Closing all your bank accounts."
              ],
              correctAnswer: 1
            },
            {
              question: "How should you handle it when friends invite you to an event you can't afford?",
              options: [
                "Go anyway and put it on a credit card.",
                "Ignore their texts forever.",
                "Be honest about saving money and offer a fun, cheaper alternative.",
                "Make up an excuse about feeling sick."
              ],
              correctAnswer: 2
            },
            {
              question: "How does the book describe a credit score?",
              options: [
                "An 'Adult GPA' showing how trustworthy you are with money.",
                "A useless number.",
                "A secret score that only rich people have.",
                "The amount of money in your wallet."
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "broke-millennial-teen-reflection",
        bookId: "broke-millennial-teen",
        type: "reflection",
        title: "The Money Date",
        description: "Reflect on how you currently face your finances.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "Do you ever feel anxious checking your bank account or thinking about money? Why do you think looking at the actual numbers feels so stressful for so many people?",
          minWords: 30
        }
      },
      {
        id: "broke-millennial-teen-action",
        bookId: "broke-millennial-teen",
        type: "action_challenge",
        title: "Alternative Hangout",
        description: "Practice saying no to expensive plans and offering an alternative.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Think of an expensive activity you and your friends often do (like going to the cinema or ordering takeout).",
            "Plan a specific, fun alternative that costs $0 or very little (like a movie night at home or a picnic).",
            "Pitch the cheaper alternative to a friend."
          ],
          checkpoints: [
            "Identified an expensive habit",
            "Planned a cheap/free alternative",
            "Pitched it to a friend"
          ]
        }
      }
    ]
  },
  {
    id: "rock-brock-savings-shock",
    title: "Rock, Brock & the Savings Shock",
    author: "Sheila Bair",
    coverUrl: "https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=400&q=80",
    category: "Finance",
    ageRating: "6+",
    summary: "A fun tale about twin brothers who learn the dramatic difference between saving with compound interest versus spending everything instantly.",
    fullContent: `## 👦 The Tale of Two Twins

Rock and Brock are twin brothers, but when it comes to money, they are complete opposites. 

Their grandfather proposes a challenge: He will give them each a single dollar every week. The rule is simple: **Whatever they manage to save by the end of the week, their grandfather will match it.** 

If they save $1, he will give them another $1. 

The brothers take completely different paths. This story teaches the most powerful force in finance, illustrated through a friendly rivalry.

---

## 🏃 Rock: The Instant Spender

Rock is the kind of kid who cannot stand having money in his pocket. The moment his grandfather hands him the dollar, he races to the store. He buys candy, small toys, and anything that catches his eye. 

At the end of the week, Rock has exactly $0. Because he spent it all, his grandfather matches nothing. 

Week after week, Rock continues the cycle. He gets a dollar, he spends a dollar. He has a lot of candy, but the candy is quickly eaten and forgotten.

---

## 🐢 Brock: The Patient Saver

Brock takes a different approach. He loves the idea of his grandfather matching his savings. 

The first week, he takes his dollar and puts it in a jar. At the end of the week, his grandfather sees the $1 and matches it. Now Brock has $2. 

The second week, Brock receives another dollar. He saves it again. Now he has $3. His grandfather matches *the entire amount he has saved*. Suddenly, Brock has $6. By the third week, Brock has $12. By the fourth, $24. 

Brock is experiencing the magic of **Compound Interest** — where the money you save starts making its own money at a rapid rate. 

---

## ⚡ The Savings Shock

As the weeks go by, Brock's money explodes. What started as just a few dollars quickly turns into hundreds. 

Rock suddenly realizes he has made a massive mistake. He has nothing left but empty candy wrappers, while his brother has enough money to buy anything he could ever want. Rock finally experiences the "Savings Shock."

The lesson is profoundly simple but incredibly powerful: **Patience pays off.** 

If you spend everything you get immediately, you will always be starting from zero. But if you save and let your money multiply, the results will shock you in the best way possible.`,
    keyLessons: [
      "Spending everything immediately leaves you with nothing but empty pockets.",
      "Compound interest effectively acts like 'matching' your money, causing it to grow exponentially over time.",
      "Patience and delayed gratification are the most important traits for wealth."
    ],
    tasks: [
      {
        id: "rock-brock-savings-shock-quiz",
        bookId: "rock-brock-savings-shock",
        type: "quiz",
        title: "The Matching Challenge Quiz",
        description: "Test your knowledge of the grandfather's challenge.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What was the grandfather's rule for the twins?",
              options: [
                "Whoever spends the most wins.",
                "Whatever they save by the end of the week, he will match.",
                "They have to buy him a gift.",
                "They have to hide the money."
              ],
              correctAnswer: 1
            },
            {
              question: "What did Rock do with his money?",
              options: [
                "He saved it all in a jar.",
                "He invested it in a bank.",
                "He spent it instantly on candy and toys.",
                "He gave it to Brock."
              ],
              correctAnswer: 2
            },
            {
              question: "What financial concept does Brock's growing jar of money represent?",
              options: [
                "Inflation",
                "Taxes",
                "Compound Interest",
                "Debt"
              ],
              correctAnswer: 2
            }
          ]
        }
      },
      {
        id: "rock-brock-savings-shock-reflection",
        bookId: "rock-brock-savings-shock",
        type: "reflection",
        title: "Are You a Rock or a Brock?",
        description: "Reflect on your own spending habits.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "easy",
        estimatedMinutes: 10,
        reflection: {
          prompt: "When you receive money (like for a birthday or an allowance), do you act more like Rock (spend it immediately) or Brock (save it to grow)? How would you like to act in the future?",
          minWords: 20
        }
      },
      {
        id: "rock-brock-savings-shock-action",
        bookId: "rock-brock-savings-shock",
        type: "action_challenge",
        title: "Start the Match Challenge",
        description: "Create your own matching challenge.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Find an empty jar or container and label it your 'Growth Jar'.",
            "Put a set amount of money (even just $1 or a few coins) into the jar.",
            "Ask a parent if they would be willing to 'match' your savings (even just 10%) if you keep it saved for a whole month."
          ],
          checkpoints: [
            "Created the Growth Jar",
            "Deposited the first amount",
            "Asked about a matching challenge"
          ]
        }
      }
    ]
  },
  {
    id: "the-lemonade-war",
    title: "The Lemonade War",
    author: "Jacqueline Davies",
    coverUrl: "https://images.unsplash.com/photo-1595981267035-7b04d84b51ad?w=400&q=80",
    category: "Finance",
    ageRating: "8+",
    summary: "A thrilling story of siblings battling to see who can sell the most lemonade, secretly teaching essential lessons on business, marketing, and sales.",
    fullContent: `## 🍋 A Tale of Two Stands

Evan and Jessie are brother and sister. Due to a misunderstanding, they get into a massive argument right before school starts. The argument erupts into a full-blown competition: **The Lemonade War**.

The rules: Whoever sells the most lemonade, and makes the most profit over the final days of summer, wins. The winner takes the loser's earnings. 

What starts as an angry rivalry turns into a masterclass on how businesses operate in the real world. 

---

## 📍 Location, Location, Location

Evan knows that to sell lemonade, people need to actually see the lemonade. He initially sets up his stand in a quiet spot, but quickly realizes he needs foot traffic. He partners with a friend to move his stand to the town center where thirsty crowds are already walking. 

**Business Lesson:** It doesn't matter how great your product is if no one knows it exists. 'Location' in business means putting your product exactly where your customers already are.

---

## 📢 Adding Value and Marketing

Jessie takes a different approach. She realizes she can't just sell boring lemonade; she needs a hook. She starts offering "value add-ons" like face painting and snacks. Furthermore, she uses smart pricing strategies, like offering discounts if people buy more cups. 

She creates bright, eye-catching signs that clearly display her prices and the benefits of stopping at her stand. 

**Business Lesson:** Marketing is how you communicate value. Adding small perks or using clear pricing strategies can drastically increase the amount of money people are willing to spend.

---

## 🤝 The Power of Partnerships

As the war heats up, both siblings realize they cannot do everything alone. 
Evan hires his friends to help him run multiple stands across the neighborhood simultaneously (a concept called "franchising"). 
Jessie partners with girls from her class to out-market Evan and draw larger crowds.

**Business Lesson:** You can only scale a business so far by yourself. Successful entrepreneurs build teams, form partnerships, and delegate tasks to expand their reach.

---

## ❤️ Winning the Right Way

By the end of the book, both siblings resort to borderline sabotage to try and win the war. In the process, they nearly ruin everything they've built and lose all their hard-earned money. 

The most important lesson of the lemonade war has nothing to do with lemonade. It is about emotional intelligence and ethics. Winning a competition means absolutely nothing if you destroy your relationships and reputation in the process. True entrepreneurs compete fiercely but fairly, valuing their integrity over a quick buck.`,
    keyLessons: [
      "Location and visibility are critical; put your product where the customers are.",
      "Add value through marketing, clear pricing, and offering extras to stand out from competitors.",
      "Partnerships are essential for growth, but integrity and relationships are more important than profit."
    ],
    tasks: [
      {
        id: "the-lemonade-war-quiz",
        bookId: "the-lemonade-war",
        type: "quiz",
        title: "Lemonade Business Quiz",
        description: "Test your knowledge of the business strategies used in the Lemonade War.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "Why did Evan move his lemonade stand?",
              options: [
                "It was too sunny in the first spot.",
                "To find a location with higher 'foot traffic' (more people walking by).",
                "Because his parents told him to.",
                "To hide from his sister."
              ],
              correctAnswer: 1
            },
            {
              question: "How did Jessie 'add value' to her stand?",
              options: [
                "She put twice as much sugar in the lemonade.",
                "She yelled louder than Evan.",
                "She offered extras like face painting and snacks.",
                "She gave the lemonade away for free."
              ],
              correctAnswer: 2
            },
            {
              question: "What is the term for Evan having his friends run multiple stands across the neighborhood?",
              options: [
                "Franchising",
                "Marketing",
                "Stealing",
                "Investing"
              ],
              correctAnswer: 0
            }
          ]
        }
      },
      {
        id: "the-lemonade-war-reflection",
        bookId: "the-lemonade-war",
        type: "reflection",
        title: "Value Add Brainstorm",
        description: "Think about how to make a basic product better.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "Imagine you are running a simple lemonade stand. What are three creative 'Value Add-ons' or marketing ideas you could use to make your stand better than the competition?",
          minWords: 30
        }
      },
      {
        id: "the-lemonade-war-action",
        bookId: "the-lemonade-war",
        type: "action_challenge",
        title: "Business Location Scout",
        description: "Understand the importance of foot traffic.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Walk around your neighborhood or school.",
            "Identify the exact spot where the most people walk by every day (the highest foot traffic).",
            "Write down why you think that spot is so busy and what kind of business would succeed there."
          ],
          checkpoints: [
            "Scouted the area",
            "Identified the high-traffic spot",
            "Wrote down business reasoning"
          ]
        }
      }
    ]
  },
  {
    id: "money-can-buy-happiness",
    title: "Money Can Buy Happiness",
    author: "Michael Dobbins",
    coverUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400&q=80",
    category: "Finance",
    ageRating: "10+",
    summary: "The ultimate contrarian take on the classic saying. It teaches how spending money on the right things—experiences, time, and others—completely changes your life.",
    fullContent: `## 🤔 The Age-Old Saying is Wrong

We have all heard the cliché: *"Money can't buy happiness."*

Normally, people say this to imply that billionaires are miserable, and that love and friendship are the only things that matter. While love and friendship are incredibly important, Michael Dobbins argues that the saying is mathematically and psychologically incorrect.

Money *can* buy happiness, but only if you know exactly what to buy. If you spend your money in the wrong places, it will make you miserable. If you spend it in the right places, it becomes a tool for joy.

---

## 🎁 Buying Experiences, Not Things

The biggest mistake people make is buying new "stuff" — the latest phone, designer clothes, a giant TV. 

Psychologists call this the **Hedonic Treadmill**. When you buy a brilliant new phone, it feels amazing for about a week. But quickly, you get used to it. The initial joy fades, and you suddenly want the *next* new phone. 

Instead of buying things, the happiest people use money to buy **experiences**. A trip with your family, tickets to a concert with a friend, or an entry fee to a challenging race. Experiences become memories, and the joy of a great memory actually *increases* over time, unlike a physical item that just gets old and breaks.

---

## ⏳ Buying Back Your Time

The ultimate luxury isn't a fast car; it is having control over your own time. 

Money can buy happiness when it is used to remove tasks you hate. If you absolutely despise doing a chore, and you eventually earn enough money to pay someone else a fair wage to do it for you, you have just bought yourself free time. 

You can use that free time to pursue a hobby, hang out with friends, or just relax. Knowing that your money is buying you freedom is the deepest form of financial peace.

---

## 🤝 The Joy of Giving 

Multiple psychological studies have proven a fascinating truth about human beings: We derive significantly more happiness from spending money on other people than we do spending it on ourselves.

Whether it is buying a thoughtful gift for a friend, treating a sibling to ice cream, or donating to a charity that matters to you, giving creates a rush of endorphins. 

The paradox of money is that the best way to extract joy from it is to give it away. 

---

## 🛠️ Treat Money Like a Wrench

If you obsess over money just to watch your bank account grow, you will be stressed and miserable. Money isn't a high score; it is a tool — like a wrench or a hammer. 

You don't hoard hammers in a closet just to say you have the most hammers. You use them to build a house. Use your money to build a happy life filled with great experiences, free time, and generosity.`,
    keyLessons: [
      "Spending money on physical 'stuff' provides only temporary joy; spend on experiences for lasting happiness.",
      "Use money to buy back your time and avoid tasks you deeply hate to gain true freedom.",
      "Giving money to others mathematically produces more personal joy than spending it entirely on yourself."
    ],
    tasks: [
      {
        id: "money-can-buy-happiness-quiz",
        bookId: "money-can-buy-happiness",
        type: "quiz",
        title: "Happiness Spending Quiz",
        description: "Test your understanding of how to spend money for maximum joy.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is the 'Hedonic Treadmill'?",
              options: [
                "A piece of exercise equipment.",
                "The process where buying new 'stuff' feels great at first, but the joy quickly fades, making you want more stuff.",
                "A technique for running faster.",
                "A type of bank account that loses money."
              ],
              correctAnswer: 1
            },
            {
              question: "According to the book, what provides more lasting happiness than buying physical items?",
              options: [
                "Buying expensive cars.",
                "Hiding the money.",
                "Buying experiences and memories.",
                "Spending it immediately."
              ],
              correctAnswer: 2
            },
            {
              question: "What is described as the 'ultimate luxury' money can buy?",
              options: [
                "A mansion.",
                "Designer clothes.",
                "Control over your own time.",
                "Gold bars."
              ],
              correctAnswer: 2
            }
          ]
        }
      },
      {
        id: "money-can-buy-happiness-reflection",
        bookId: "money-can-buy-happiness",
        type: "reflection",
        title: "Stuff vs. Experiences",
        description: "Analyze your past spending and its impact on your joy.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "Think of a physical item you bought a year ago, and an experience you had around the same time. Which one brings you more happiness today when you think about it?",
          minWords: 30
        }
      },
      {
        id: "money-can-buy-happiness-action",
        bookId: "money-can-buy-happiness",
        type: "action_challenge",
        title: "The Joy of Giving",
        description: "Test the theory that giving brings happiness.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Take a small amount of money (even just $2 or $5).",
            "Use it to buy a small treat or gift completely secretly for someone else (like buying a coffee for a parent or a snack for a friend without them knowing).",
            "Notice how you feel during the rest of the day."
          ],
          checkpoints: [
            "Allocated small amount of money",
            "Bought and gave the gift",
            "Reflected on the feeling of generosity"
          ]
        }
      }
    ]
  },
  {
    id: "make-your-kid-a-money-genius",
    title: "Make Your Kid a Money Genius",
    author: "Beth Kobliner",
    coverUrl: "https://images.unsplash.com/photo-1558025137-0b406e9cb1da?w=400&q=80",
    category: "Finance",
    ageRating: "8+",
    summary: "Clear, practical, and highly effective rules for understanding money, rejecting debt, and building bulletproof financial habits early.",
    fullContent: `## 🧠 Becoming a Genius

Being a "Money Genius" has very little to do with math. You don't need to be able to do calculus to be rich. You just need to master a completely different skill: **self-control**.

Beth Kobliner's core message is that the most financially successful people are simply the ones who can delay gratification. They are the people who can look at a shiny object today and say, "No, I'd rather have security tomorrow."

Becoming a genius is about setting rules for yourself and refusing to break them, even when the marketing around you is very convincing.

---

## 💳 The Danger of Plastic

Credit cards are marketed as a sign of adulthood and responsibility. The banks offer cash back, airline miles, and points to encourage you to swipe the card.

But the hard truth is that multiple studies show people spend up to **30% more** when they use plastic instead of physical cash. When you hand over a crisp $20 bill, your brain registers the loss. When you swipe a card or tap your phone, it feels like magic.

A Money Genius understands this trick. If you use a credit card, you must treat it exactly like a debit card. If the cash isn't sitting in your bank account, you do not make the purchase. Period.

---

## 📈 The High Cost of Debt

If you borrow $1000 from a credit card company and only pay the "minimum payment" every month, how much do you think that item will eventually cost you? 
Because of compound interest working against you, it could cost you $2000 or $3000 over many years. 

Debt is like chaining an anchor to your ankle before trying to swim a race. Every dollar you send to the bank in interest is a dollar stolen from your future investments, your vacations, and your freedom. 

If you want to be a genius, make a lifelong commitment to avoid high-interest debt at all costs. 

---

## 📉 Focus on What You Can Control

The stock market will crash. The economy will go into recessions. Politicians will change taxes. None of these things are in your control, so worrying about them constantly is a waste of energy. 

A Money Genius focuses intensely on what they *can* control:
1. **Your Savings Rate:** How much of your income you keep.
2. **Your Spending Habits:** Avoiding lifestyle inflation (buying more expensive things just because you make more money).
3. **Your Skills:** Becoming so good at what you do that employers or clients have to pay you well.

Master these three things, and you will be financially bulletproof regardless of what the economy does.`,
    keyLessons: [
      "Financial genius is more about self-control and delaying gratification than doing complex math.",
      "Plastic and digital payments trick the brain into spending up to 30% more than physical cash.",
      "Focus your energy entirely on what you can control: your savings rate, spending habits, and skills."
    ],
    tasks: [
      {
        id: "make-your-kid-a-money-genius-quiz",
        bookId: "make-your-kid-a-money-genius",
        type: "quiz",
        title: "Genius Rules Quiz",
        description: "Test your understanding of the essential rules for financial genius.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is the most important skill for a 'Money Genius'?",
              options: [
                "Advanced Calculus.",
                "Being able to predict the stock market.",
                "Self-control and delaying gratification.",
                "Knowing how to ask for loans."
              ],
              correctAnswer: 2
            },
            {
              question: "Why can using credit cards be dangerous?",
              options: [
                "Because plastic hurts the environment.",
                "Because people naturally spend up to 30% more when swiping plastic instead of handing over cash.",
                "Because the magnetic strip breaks often.",
                "Because they make your wallet heavy."
              ],
              correctAnswer: 1
            },
            {
              question: "What are the three things you can control to become financially bulletproof?",
              options: [
                "The economy, the stock market, and taxes.",
                "Your savings rate, spending habits, and personal skills.",
                "Your friends, your boss, and your school.",
                "Other people's opinions."
              ],
              correctAnswer: 1
            }
          ]
        }
      },
      {
        id: "make-your-kid-a-money-genius-reflection",
        bookId: "make-your-kid-a-money-genius",
        type: "reflection",
        title: "The Plastic Test",
        description: "Reflect on how you spend digital money vs real cash.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "Think about spending a $20 bill versus spending $20 on a card or app (like in a game). Does it feel different? Why do you think digital money is easier to spend quickly?",
          minWords: 30
        }
      },
      {
        id: "make-your-kid-a-money-genius-action",
        bookId: "make-your-kid-a-money-genius",
        type: "action_challenge",
        title: "The Cash-Only Challenge",
        description: "Experience the psychological impact of physical cash.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Next time you go to the store or a café, do not use a card or your phone.",
            "Bring exact, physical cash for what you plan to buy.",
            "Notice how it feels to physically hand over the bills compared to swiping a piece of plastic."
          ],
          checkpoints: [
            "Prepared physical cash",
            "Made a purchase using only cash",
            "Noticed the psychological difference"
          ]
        }
      }
    ]
  },
  {
    id: "total-money-makeover-teen",
    title: "The Total Money Makeover (Teen Edition)",
    author: "Dave Ramsey",
    coverUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a28?w=400&q=80",
    category: "Finance",
    ageRating: "12+",
    summary: "The intense, no-nonsense roadmap to eliminating debt entirely, living with fierce financial discipline, and ultimately building extreme wealth.",
    fullContent: `## 🚫 Debt is Dumb, Cash is King

Most modern culture tells you that debt is normal. We take out loans for cars, huge mortgages for houses, and swipe credit cards for vacations. Dave Ramsey has a completely different message: **Debt is a thief that steals your entire future.**

The foundation of the Total Money Makeover is a radical hatred of debt. To build wealth, you must avoid owing money to anyone. When you do not have monthly payments going to the bank for a car loan, student loan, or credit card, you suddenly have thousands of dollars left over every month to invest. 

"If you will live like no one else today, later you can live — and give — like no one else."

---

## 🧱 The Baby Steps

Ramsey's program is incredibly famous because it is simple. He outlines the "Baby Steps" to financial freedom. For a teen, the steps look like this:

**Step 1: Save a Starter Emergency Fund.**
Put $500 aside in a bank account that you never, ever touch unless it is a true emergency (a broken phone doesn't count, but a medical bill or broken-down car does). This stops you from taking on debt when bad things happen.

**Step 2: The Debt Snowball.**
If you owe money to anyone, list all debts from smallest to largest. Ignore interest rates. Attack the smallest debt with absolutely everything you have while paying the minimums on the rest. When the first is gone, take all that energy and attack the second. The psychological "wins" will keep you motivated.

**Step 3: A Full Emergency Fund.**
Once you have zero debt, save up 3 to 6 months of living expenses. Now you are bulletproof against almost any disaster.

---

## 🔥 Gazelle Intensity

You cannot casually wander into wealth. It requires what Ramsey calls "Gazelle Intensity." 

When a cheetah is chasing a gazelle, the gazelle doesn't jog. It sprints for its absolute life. If you want to escape the trap of being broke, you have to sprint. You have to sell things you don't need, work extra hours, and ruthlessly cut your spending until your foundation is secure.

It requires saying "no" to things your friends are doing. It requires discipline. It isn't easy, but the peace of mind on the other side is entirely worth the sacrifice.

---

## 💰 Give Generously

The ultimate goal of the Total Money Makeover isn't to sit in a giant house clutching a pile of gold like a dragon. The final step of the program is to **build wealth and give generously.**

When you have no debt, a fully funded emergency account, and strong investments, money loses its power over you. You are free to change your family tree and leave an incredible impact by giving to others.`,
    keyLessons: [
      "Any form of debt is a thief that steals your future wealth; eliminate it with extreme prejudice.",
      "The 'Debt Snowball' method focuses on psychological wins by paying off the smallest debts first.",
      "Building true wealth requires 'Gazelle Intensity'—sprinting aggressively away from bad financial habits."
    ],
    tasks: [
      {
        id: "total-money-makeover-teen-quiz",
        bookId: "total-money-makeover-teen",
        type: "quiz",
        title: "Makeover Basics Quiz",
        description: "Test your understanding of the intense Ramsey philosophy.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is Dave Ramsey's primary view on debt?",
              options: [
                "It's a useful tool if managed correctly.",
                "It's great for buying cars.",
                "Debt is dumb; it steals your future and should be avoided entirely.",
                "Everyone has to have it, so don't worry."
              ],
              correctAnswer: 2
            },
            {
              question: "What is the 'Debt Snowball' method?",
              options: [
                "Paying off the debt with the highest interest rate first.",
                "Ignoring your debts until winter.",
                "Listing debts from smallest balance to largest, and attacking the smallest one first for quick psychological wins.",
                "Taking out a large loan to pay everything else off."
              ],
              correctAnswer: 2
            },
            {
              question: "What does 'Gazelle Intensity' mean?",
              options: [
                "Running fast for exercise.",
                "Attacking your financial goals and running away from debt as if your life depends on it.",
                "Eating grass to save money.",
                "Moving slowly and carefully."
              ],
              correctAnswer: 1
            }
          ]
        }
      },
      {
        id: "total-money-makeover-teen-reflection",
        bookId: "total-money-makeover-teen",
        type: "reflection",
        title: "The Emergency Fund",
        description: "Reflect on how an emergency fund changes how you feel.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "Imagine that right now, you had an envelope with $500 hidden securely in your room that was specifically for emergencies. How would knowing that money is there change the way you feel when unexpected problems happen?",
          minWords: 30
        }
      },
      {
        id: "total-money-makeover-teen-action",
        bookId: "total-money-makeover-teen",
        type: "action_challenge",
        title: "Start Baby Step 1",
        description: "Take the first concrete step toward the Makeover.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Find an old shoebox or a separate sub-account at your bank.",
            "Label it emphatically: 'DO NOT TOUCH: EMERGENCY FUND'.",
            "Put your first contribution in it today, and commit to securing the $500 goal."
          ],
          checkpoints: [
            "Secured the box/account",
            "Clearly labeled it for emergencies only",
            "Made the first contribution"
          ]
        }
      }
    ]
  },
  {
    id: "young-money",
    title: "Young Money",
    author: "Kevin Roose",
    coverUrl: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&q=80",
    category: "Finance",
    ageRating: "14+",
    summary: "An inside look into the chaotic lives of young Wall Street bankers, revealing the extreme cost of chasing money without a clear purpose.",
    fullContent: `## 🏢 Inside the Golden Cage

Every year, thousands of brilliant college graduates accept jobs on Wall Street. The promise is incredible: Make hundreds of thousands of dollars before you are 25, live in luxury in New York City, and become a master of the financial universe.

Kevin Roose spent years following eight young bankers, and he uncovered a far darker reality. Once inside the "golden cage," these young adults were completely crushed by the demands of the job.

They worked 100-hour weeks. They slept under their desks. They developed anxiety, ruined their relationships, and lost touch with the real world. This book explores a crucial question: What happens when you make money your absolute highest priority?

---

## 🏃 The Escalator to Nowhere

Many of the young bankers didn't actually want to work in finance. They were simply smart kids who followed the paved path. When brilliant students don't know what they want to do with their lives, Wall Street arrives with a golden escalator. Just step on, and we will make you rich.

But because they didn't have a strong internal "Why" (a personal purpose), the money wasn't enough to sustain them. Roose observed that the bankers who survived the brutal culture were the ones who treated the job purely as a stepping stone — a brief boot camp to acquire skills. 

The ones who treated the job as their entire identity were destroyed by it. 

**Lesson:** Earning a massive salary is useless if the job stops you from actually living your life. 

---

## 💳 The Trap of Lifestyle Inflation

You would think that 24-year-olds making huge bonuses would be saving massive amounts of wealth. Instead, Roose witnessed extreme "Lifestyle Inflation."

Because they were so miserable and exhausted from working 100 hours a week, the bankers spent money recklessly to try to buy back some joy. They bought $10,000 watches, spent thousands on "bottle service" at exclusive clubs, and rented apartments they were never awake to enjoy. 

Despite earning a fortune, many were still effectively living paycheck to paycheck on a luxury tier. They were trapped. They couldn't quit the miserable job because they had to pay for the expensive lifestyle they used to cope with the miserable job.

---

## 🧭 Purpose over Profit

The ultimate takeaway from *Young Money* isn't that ambition or wealth is bad. It is a warning about misalignment. 

If you chase a career exclusively for the paycheck without asking if the work aligns with your values, your health, and your relationships, the money will feel hollow. 

True wealth means having the financial freedom to do work you actually care about, on your own terms. Before picking an escalator to ride, make absolutely sure you know where it is taking you.`,
    keyLessons: [
      "Chasing money without a clear internal purpose will lead to burnout and misery.",
      "Beware of 'Lifestyle Inflation': spending everything you earn to cope with a job you hate keeps you trapped.",
      "A massive salary means nothing if the work destroys your health, relationships, and free time."
    ],
    tasks: [
      {
        id: "young-money-quiz",
        bookId: "young-money",
        type: "quiz",
        title: "The Golden Cage Quiz",
        description: "Test your comprehension of the lessons from Wall Street.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What happened to the young bankers when they made money their absolute highest priority?",
              options: [
                "They became extremely happy and relaxed.",
                "They were crushed by 100-hour weeks, lost relationships, and suffered burnout.",
                "They retired immediately.",
                "They bought their own banks."
              ],
              correctAnswer: 1
            },
            {
              question: "What is 'Lifestyle Inflation' in the context of the book?",
              options: [
                "Making smart investments to beat the cost of living.",
                "Buying an expensive inflatable mattress to sleep at the office.",
                "Recklessly spending massive salaries on luxury items to cope with exhaustion, keeping them trapped.",
                "Saving all money for early retirement."
              ],
              correctAnswer: 2
            },
            {
              question: "What is the ultimate takeaway of the book regarding careers?",
              options: [
                "Always take the job that pays the absolute highest amount.",
                "Refuse to work entirely.",
                "Ensure your career aligns with your values and purpose, rather than just chasing a paycheck.",
                "Only work on Wall Street."
              ],
              correctAnswer: 2
            }
          ]
        }
      },
      {
        id: "young-money-reflection",
        bookId: "young-money",
        type: "reflection",
        title: "Purpose vs. Profit",
        description: "Analyze what truly motivates you.",
        rewards: { xp: 30, coins: 15 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "If you were offered a job right now that paid $500,000 a year but required you to work 95 hours a week, completely isolating you from friends and family, would you take it? Explain why or why not.",
          minWords: 30
        }
      },
      {
        id: "young-money-action",
        bookId: "young-money",
        type: "action_challenge",
        title: "Define Your 'Why'",
        description: "Determine what you are aiming for beyond just money.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 15,
        actionChallenge: {
          steps: [
            "Write down three things you value most in life (e.g., family time, creating art, traveling, building a business).",
            "Write down an ideal career path that supports those three things.",
            "Confirm that your imagined career isn't just an 'escalator' someone else told you to ride."
          ],
          checkpoints: [
            "Listed Top 3 Values",
            "Drafted an aligned career path",
            "Verified it aligns with your true purpose"
          ]
        }
      }
    ]
  }
];
