import { Book } from '../../../types';

export const BATCH_4_BOOKS_PART_2: Book[] = [
  {
    id: "flow-for-teens",
    title: "Flow for Teens",
    author: "Mihaly Csikszentmihalyi",
    coverUrl: "https://images.unsplash.com/photo-1518600506278-4e8ef466b810?w=400&q=80",
    category: "Mindset",
    ageRating: "14+",
    summary: "Discover the psychology of optimal experience and how to find deep focus and joy in any activity.",
    fullContent: `## 🌊 What is 'Flow'?
Have you ever been doing something you love—maybe playing a video game, painting, playing sports, or reading a great book—and completely lost track of time? You didn't feel hungry, you weren't worried about the future, and your skills perfectly matched the challenge in front of you.

Psychologist Mihaly Csikszentmihalyi calls this state **Flow**. It is the state of "optimal experience" where you are so involved in an activity that nothing else seems to matter.

## ⚖️ The Balance of Challenge and Skill
Flow doesn't happen when you're watching TV or scrolling on your phone. Those things are relaxing, but they don't challenge you.
Flow happens on a very specific edge: the exact balance between **Challenge** and **Skill**.
1. If an activity is too hard for your current skills, you feel **Anxious**.
2. If an activity is too easy for your current skills, you feel **Bored**.
3. But when the challenge is just right—stretching you slightly past your comfort zone—you enter **Flow**.

## 🎯 How to Find Your Flow
You can engineer a life filled with flow, rather than just waiting for it to happen by accident.
- **Set Clear Goals:** You need to know exactly what you are trying to do right now. Flow breaks down when you are confused.
- **Get Immediate Feedback:** You need to know if you are doing well or making mistakes so you can adjust immediately. (This is why video games are so good at creating flow; the feedback is instant.)
- **Minimize Distractions:** Flow requires total focus. Put your phone in another room, close extra browser tabs, and tell people you need 30 minutes of deep work time.

When you learn how to access flow in your schoolwork, hobbies, and sports, you won't just perform better—you'll feel significantly happier and more fulfilled.`,
    keyLessons: [
      "Flow is the state of total immersion where you lose track of time and yourself.",
      "Flow happens when your skills perfectly match the challenge of the activity.",
      "You can create more flow by setting clear goals, getting instant feedback, and removing distractions."
    ],
    tasks: [
      {
        id: "flow-for-teens-quiz-1",
        bookId: "flow-for-teens",
        type: "quiz",
        title: "Finding the Sweet Spot",
        description: "Test your understanding of the psychology of flow.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What happens when an activity's challenge is much higher than your current skills?",
              options: [
                "You enter Flow",
                "You feel Bored",
                "You feel Anxious",
                "You fall asleep"
              ],
              correctAnswer: 2
            },
            {
              question: "Which of these is NOT a requirement for entering a flow state?",
              options: [
                "Clear goals",
                "Immediate feedback",
                "Multitasking with technology",
                "Total focus on the task"
              ],
              correctAnswer: 2
            }
          ]
        }
      },
      {
        id: "flow-for-teens-reflection-1",
        bookId: "flow-for-teens",
        type: "reflection",
        title: "Your Flow State",
        description: "Identify activities that trigger flow for you.",
        rewards: { xp: 60, coins: 30 },
        difficulty: "hard",
        estimatedMinutes: 10,
        reflection: {
          prompt: "Think about the last time you completely lost track of time because you were so absorbed in what you were doing. What was the activity? Why do you think it captured your attention so deeply?",
          minWords: 35
        }
      }
    ]
  },
  {
    id: "5am-club-teen",
    title: "The 5 AM Club (Teen Edition)",
    author: "Robin Sharma",
    coverUrl: "https://images.unsplash.com/photo-1413882353314-73389f63b6fd?w=400&q=80",
    category: "Mindset",
    ageRating: "12+",
    summary: "Own your morning, elevate your life. Discover the routine that successful people use to master their day.",
    fullContent: `## 🌅 The Magic Hour
Most people wake up at the last possible second, grab their phones to scroll through social media, shovel down a quick breakfast, and rush out the door. Their day starts in a reactive, hurried state of stress.

Robin Sharma's *The 5 AM Club* proposes a radically different approach: Wake up before the rest of the world and dedicate the very first hour to entirely upgrading yourself.
You don't *have* to wake up exactly at 5 AM, but the concept is to carve out a sacred hour of quiet, uninterrupted time before your day begins.

## ⏱️ The 20/20/20 Formula
To make the most of this golden hour, the book teaches the 20/20/20 formula. Divide your hour into three 20-minute blocks:

1. **Move (20 Minutes):** Intense exercise. Sweating releases a brain chemical called BDNF, which supercharges your focus and mood, clearing out the grogginess of sleep.
2. **Reflect (20 Minutes):** Quiet time. Use this to journal, meditate, or plan your day. Silence helps lower your anxiety and connects you to your deepest goals.
3. **Grow (20 Minutes):** Learning. Read a book, listen to a podcast, or study a new skill. Compounding 20 minutes of daily learning makes you unstoppable over time.

## 🏰 The Four Interior Empires
True success isn't just about what you accomplish outside (your grades, awards, or money). It's built on your Four Interior Empires:
1. **Mindset:** Your psychology and positive thoughts.
2. **Heartset:** Your emotional life and relationships.
3. **Healthset:** Your physical well-being.
4. **Soulset:** Your connection to your true purpose and character.

By waking up early and applying the 20/20/20 formula, you feed all four empires before most people are even awake. Try waking up just 30 to 60 minutes earlier tomorrow—own your morning, and you will elevate your entire life.`,
    keyLessons: [
      "Starting your day with a focused, uninterrupted hour gives you a massive advantage over the reactive world.",
      "The 20/20/20 formula consists of 20 minutes of sweating, 20 minutes of reflecting, and 20 minutes of growing.",
      "True performance requires nurturing all Four Interior Empires: Mindset, Heartset, Healthset, and Soulset."
    ],
    tasks: [
      {
        id: "5am-club-quiz-1",
        bookId: "5am-club-teen",
        type: "quiz",
        title: "The Golden Hour",
        description: "Test your knowledge of the morning mastery routine.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What are the three parts of the 20/20/20 Formula?",
              options: [
                "Move, Reflect, Grow",
                "Eat, Sleep, Play",
                "Read, Write, Talk",
                "Stretch, Snack, Scroll"
              ],
              correctAnswer: 0
            },
            {
              question: "Which Interior Empire is focused on your emotional life and relationships?",
              options: [
                "Mindset",
                "Soulset",
                "Healthset",
                "Heartset"
              ],
              correctAnswer: 3
            }
          ]
        }
      },
      {
        id: "5am-club-action-1",
        bookId: "5am-club-teen",
        type: "action_challenge",
        title: "Own Your Morning",
        description: "Try a mini version of the 20/20/20 routine.",
        rewards: { xp: 80, coins: 40 },
        difficulty: "hard",
        estimatedMinutes: 30,
        actionChallenge: {
          steps: [
            "Set your alarm 30 minutes earlier than usual for tomorrow morning.",
            "Spend 10 minutes moving (jumping jacks, stretching, running).",
            "Spend 10 minutes reflecting (writing in a journal or planning the day).",
            "Spend 10 minutes growing (reading a few pages of a book)."
          ],
          checkpoints: [
            "Woke up early",
            "10 mins of moving",
            "10 mins of reflecting",
            "10 mins of growing"
          ]
        }
      }
    ]
  },
  {
    id: "brain-rules-kids",
    title: "Brain Rules for Kids",
    author: "John Medina",
    coverUrl: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&q=80",
    category: "Mindset",
    ageRating: "10+",
    summary: "Discover the amazing science of how your brain actually works, and how to use it better for school and life.",
    fullContent: `## 🧠 Your Meat Computer
Inside your skull is the most complex, incredible supercomputer in the known universe. But nobody ever gave you an instruction manual for how to use it!
Dr. John Medina, a brain scientist, breaks down the absolute \"Brain Rules\" that dictate how we learn, remember, and thrive. If you understand these rules, you can 'hack' your own brain to be much more effective.

## 🏃‍♀️ Rule #1: Exercise Boosts Brain Power
Your brain evolved while humans were walking up to 12 miles a day! It was designed to work best while moving. 
When you sit at a desk for 8 hours a day, your brain actually gets slower. Exercise brings extra blood, oxygen, and nutrients straight to your brain.
**The Hack:** If you are stuck on a difficult homework problem, don't just stare at the paper. Go for a fast 10-minute walk or do some jumping jacks. Your brain will fire up!

## 😴 Rule #2: Sleep Well, Think Well
When you sleep, your brain doesn't just turn off. It actually works the night shift.
During deep sleep, your brain replays what you learned that day, files away important memories, and throws out junk information. 
If you skip sleep to study for a test, you are actually sabotaging yourself, because without sleep, your brain cannot connect the dots of the new information.
**The Hack:** Guard your sleep like a treasure. 8 to 10 hours is non-negotiable for a young, growing brain.

## 👁️ Rule #3: Vision Trumps All Other Senses
We are incredible visual learners. If you hear a piece of information, you'll remember 10% of it three days later. If you add a picture, you'll remember 65%!
**The Hack:** Don't just write down words in your notes. Draw mind-maps, doodles, and weird symbols. The crazier the picture, the easier your brain will recall it.

Your brain is capable of truly astonishing things, provided you feed it exactly what it needs: movement, sleep, and rich visual information!`,
    keyLessons: [
      "Your brain evolved to operate best while your body is moving; exercise supercharges focus.",
      "Sleep is when your brain files away memories and learns. Without sleep, you can't retain new info.",
      "Vision is your dominant sense. Adding pictures to information dramatically increases your ability to remember it."
    ],
    tasks: [
      {
        id: "brain-rules-quiz-1",
        bookId: "brain-rules-kids",
        type: "quiz",
        title: "Brain Hacks Quiz",
        description: "Test your understanding of the brain rules.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "If you only HEAR a piece of information, you might remember 10% of it later. How much do you remember if you add a PICTURE?",
              options: [
                "15%",
                "25%",
                "65%",
                "100%"
              ],
              correctAnswer: 2
            },
            {
              question: "What does your brain do while you are in deep sleep?",
              options: [
                "It turns off completely to rest.",
                "It replays the day and files away important memories.",
                "It erases everything to prepare for tomorrow.",
                "It only focuses on making dreams."
              ],
              correctAnswer: 1
            }
          ]
        }
      },
      {
        id: "brain-rules-action-1",
        bookId: "brain-rules-kids",
        type: "action_challenge",
        title: "The Doodle Hack",
        description: "Use vision to memorize something.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 10,
        actionChallenge: {
          steps: [
            "Pick a vocabulary word, historical fact, or formula you need to slowly memorize for school.",
            "Draw a silly, weird, or colorful picture that represents that fact.",
            "Look at the picture once tomorrow and see if you easily remember the fact!"
          ],
          checkpoints: [
            "Picked a fact to learn",
            "Drew a crazy picture for it",
            "Tested my memory the next day"
          ]
        }
      }
    ]
  },
  {
    id: "you-are-enough",
    title: "You Are Enough",
    author: "Mandy Hale",
    coverUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80",
    category: "Mindset",
    ageRating: "10+",
    summary: "A beautiful reminder that your worth isn't determined by likes, grades, or other people's opinions.",
    fullContent: `## 🎭 The Comparison Game
It is easier than ever to feel completely inadequate. You can open an app on your phone and instantly see thousands of people who seem smarter, more athletic, better-looking, and happier than you.
But you are looking at their "highlight reel" while experiencing your own "behind the scenes." This leads to a dangerous trap: The Comparison Game.

Mandy Hale writes that living a happy life begins with believing one simple, unbreakable truth: **You are enough, exactly as you are.**

## 💖 Separating Your Worth
A lot of people tie their personal worth to external things:
- Their GPA or test scores.
- How many likes a photo gets.
- Being the "star" of a sports team.

The problem with tying your worth to external things is that those things can be taken away. If you have a bad game, or fail a test, your brain tells you, "I am a failure."
You have to separate your DOING from your BEING. You *do* make mistakes, but you *are* a worthy human being.

## 🛡️ Becoming Bulletproof
When you truly believe that you are enough, you become immune to a lot of the world's negativity.
- If someone is mean to you, you realize it says more about their own unhappiness than it does about your value.
- If you don't get invited to a party, your world doesn't end, because your identity doesn't depend on popularity.

Stop trying to mold yourself into a copy of someone else. The world already has a million of them. What the world incredibly needs is the one and only, authentic YOU. 
Embrace your quirks, speak your truth, and remember: Your worth is a fact, not a question.`,
    keyLessons: [
      "Comparing your 'behind the scenes' to someone else's 'highlight reel' is a recipe for misery.",
      "Separate your identity (your intrinsic worth) from your performance (your grades, likes, or trophies).",
      "Believing 'I am enough' makes you resilient to rejection and other people's negative opinions."
    ],
    tasks: [
      {
        id: "you-are-enough-quiz-1",
        bookId: "you-are-enough",
        type: "quiz",
        title: "Intrinsic Worth",
        description: "Test your understanding of personal value.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is the danger of tying your self-worth to things like grades or social media likes?",
              options: [
                "It makes you try too hard to be perfect.",
                "If those things change or are taken away, you feel like a failure.",
                "It makes you too confident.",
                "It has no danger, it's a great motivator."
              ],
              correctAnswer: 1
            },
            {
              question: "What does the author suggest you are doing when you look at social media?",
              options: [
                "Looking at someone's behind the scenes.",
                "Looking at realistic lives.",
                "Comparing your behind the scenes to someone's highlight reel.",
                "Seeing exactly how successful people are."
              ],
              correctAnswer: 2
            }
          ]
        }
      },
      {
        id: "you-are-enough-reflection-1",
        bookId: "you-are-enough",
        type: "reflection",
        title: "Un-tying Your Worth",
        description: "Reflect on where you place your value.",
        rewards: { xp: 60, coins: 30 },
        difficulty: "medium",
        estimatedMinutes: 10,
        reflection: {
          prompt: "What is one external thing (like a grade, a sport, or being liked by a specific person) that makes you feel bad about yourself when it doesn't go right? How can you remind yourself that your worth is completely separate from that thing?",
          minWords: 35
        }
      }
    ]
  },
  {
    id: "energy-bus-kids",
    title: "The Energy Bus for Kids",
    author: "Jon Gordon",
    coverUrl: "https://images.unsplash.com/photo-1555547631-0df8beabcbfa?w=400&q=80",
    category: "Mindset",
    ageRating: "6+",
    summary: "Hop on the Energy Bus and learn how to navigate life with positive energy, joy, and purpose.",
    fullContent: `## 🚌 You Are the Driver
Imagine you are the driver of a big, brightly colored bus. This bus is your life! 
Sometimes the road is perfectly smooth, and you roll along happily. But other times, you hit giant potholes, get stuck in traffic, or have a flat tire. 

Jon Gordon wrote *The Energy Bus* to teach a very important rule: **You are the driver of your bus.** No one else gets to steer it. You get to decide where your bus goes and how you handle the bumps along the way.

## ⛽ Fueling Your Ride
If your bus runs on gasoline, your life runs on **Energy**. But not all energy is the same.
- **Positive Energy:** This is the premium fuel! It makes you feel strong, helps you solve problems, and makes the ride fun.
- **Negative Energy:** This is junk fuel. It makes you feel tired, grumpy, and drags your bus to a miserable stop.

When bad things happen, it's easy to fill up on negative energy and complain. But the best drivers learn to pause, take a deep breath, and choose positive energy. They focus on what they *can* do, rather than what they can't.

## 🚫 No Energy Vampires Allowed
As you drive your bus, you will meet different kinds of passengers. Some will cheer for you, hand you snacks, and sing songs. 
But others are what Gordon calls **Energy Vampires**. These are people who constantly complain, bully others, and try to suck all the positive energy out of the room.

Your rule as a driver must be: *No Energy Vampires Allowed on My Bus!* 
You can't always control if someone is grumpy, but you don't have to let them sit in the front seat of your life. Surround yourself with people who fuel your ride with kindness and joy, and watch how amazing the journey becomes!`,
    keyLessons: [
      "You are the driver of your own life. You are responsible for where it goes.",
      "Positive energy is the premium fuel that helps you overcome obstacles and enjoy the ride.",
      "Protect your energy by refusing to let 'Energy Vampires' (constant complainers or bullies) dictate your mood."
    ],
    tasks: [
      {
        id: "energy-bus-quiz-1",
        bookId: "energy-bus-kids",
        type: "quiz",
        title: "Bus Rules",
        description: "Test your knowledge of the rules of The Energy Bus.",
        rewards: { xp: 40, coins: 20 },
        difficulty: "easy",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "Who is the driver of your bus?",
              options: [
                "Your parents",
                "Your teachers",
                "Your friends",
                "You are!"
              ],
              correctAnswer: 3
            },
            {
              question: "What is an 'Energy Vampire'?",
              options: [
                "Someone who works at night",
                "Someone who complains all the time and sucks away your positive energy",
                "Someone who talks really quietly",
                "A character in a spooky movie"
              ],
              correctAnswer: 1
            }
          ]
        }
      },
      {
        id: "energy-bus-action-1",
        bookId: "energy-bus-kids",
        type: "action_challenge",
        title: "Kick Out the Vampires",
        description: "Protect your positive energy today.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 10,
        actionChallenge: {
          steps: [
            "Notice your own 'Energy Vampire' thoughts today (like complaining or whining).",
            "When you feel like complaining, stop and focus on one positive thing instead.",
            "Say something encouraging to a friend to put positive energy on THEIR bus."
          ],
          checkpoints: [
            "Caught my own complaining thought",
            "Flipped it to a positive focus",
            "Encouraged a friend"
          ]
        }
      }
    ]
  },
  {
    id: "developing-leaders-around-you-teen",
    title: "Developing the Leaders Around You",
    author: "John Maxwell",
    coverUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=80",
    category: "Leadership",
    ageRating: "12+",
    summary: "True leadership isn't about being a solo star; it's about finding and multiplying the potential in others.",
    fullContent: `## ⭐ The Solo Star vs. The Conductor
A lot of ambitious people think that leadership means becoming the biggest, brightest superstar in the room. They want to be the hero who scores all the points, makes all the decisions, and takes all the credit.

But leadership expert John Maxwell says that being a superstar is actually the lowest level of leadership. 
The highest level of leadership is not acting like a solo star; it's acting like an orchestra conductor. A conductor doesn't play a single instrument—their job is to help everyone else play beautifully together. 

Real leaders know that they can only go so far on their own. To achieve truly massive goals, you have to find, empower, and develop the leaders *around* you.

## 🧲 How to Attract Leaders
If you want great people on your team, you have to become the kind of person great people want to follow. 
- **Share the Credit, Take the Blame:** When things go right, point to your team. When things go wrong, take responsibility. Nothing earns respect faster.
- **Listen More Than You Talk:** You can't develop someone if you don't know what they care about. Ask questions and genuinely listen to their answers.

## 🌱 The Growth Process
Developing someone else is a process that takes patience. Maxwell suggests a four-step method for teaching anyone a new skill:
1. **I do it.** (You model the correct behavior).
2. **I do it, and you're with me.** (They watch and learn the nuances).
3. **You do it, and I'm with you.** (You let them try, offering gentle course corrections).
4. **You do it.** (You step back and empower them to lead).

When you shift your focus completely from "How can I shine today?" to "How can I help someone else shine today?", you stop being just a performer and start becoming a true leader.`,
    keyLessons: [
      "The highest form of leadership is developing and empowering other leaders, not being a solo superstar.",
      "Leaders earn furious loyalty by taking the blame when things fail and giving away the credit when things succeed.",
      "Use the four-step empowerment process: Model, Mentor, Monitor, and Multiply."
    ],
    tasks: [
      {
        id: "developing-leaders-quiz-1",
        bookId: "developing-leaders-around-you-teen",
        type: "quiz",
        title: "The Conductor's Mindset",
        description: "Test your knowledge of multiplying leadership.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "medium",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "According to the book, what is the 'lowest level' of leadership?",
              options: [
                "Listening to others too much",
                "Being the conductor of the orchestra",
                "Being the solo superstar who does everything",
                "Sharing the credit"
              ],
              correctAnswer: 2
            },
            {
              question: "What should a true leader do when the team experiences a victory?",
              options: [
                "Remind everyone that the leader was in charge",
                "Give away the credit to the team",
                "Take the blame",
                "Step down immediately"
              ],
              correctAnswer: 1
            }
          ]
        }
      },
      {
        id: "developing-leaders-reflection-1",
        bookId: "developing-leaders-around-you-teen",
        type: "reflection",
        title: "Sharing the Spotlight",
        description: "Think about how you can empower a friend.",
        rewards: { xp: 60, coins: 30 },
        difficulty: "hard",
        estimatedMinutes: 10,
        reflection: {
          prompt: "Think about a project, club, or sport you are involved in. Who is someone on your team who has hidden potential? Write down two specific ways you could step back and help THEM shine or lead this week.",
          minWords: 35
        }
      }
    ]
  },
  {
    id: "cant-hurt-me-teen",
    title: "Can't Hurt Me (Teen Edition)",
    author: "David Goggins",
    coverUrl: "https://images.unsplash.com/photo-1549471013-3364d7ce466b?w=400&q=80",
    category: "Mindset",
    ageRating: "14+",
    summary: "Master your mind and defy the odds by callous-ing your mind to push past your perceived limits.",
    fullContent: `## 🪞 The Accountability Mirror
David Goggins had a terrifyingly tough childhood. He dealt with poverty, prejudice, and abuse. As a young adult, he was deeply depressed, overweight, and had no future.
Everything changed when he looked into his bathroom mirror and got brutally honest with himself. 

He called it the "Accountability Mirror." He stopped blaming his genetics, his past, and his bullies. He looked at himself and said, "You are the problem. But you are also the solution." 
He wrote down all his insecurities and goals on sticky notes, slapped them on the mirror, and started doing the work.

## 🧱 Callousing Your Mind
If you lift weights and grip an iron bar every day, your hands build rough callouses. The callouses protect your skin so you can lift even heavier weight without bleeding.

Goggins says you have to do the same thing to your mind. We live in a comfortable society where we avoid pain at all costs. But to achieve greatness, you must intentionally seek out discomfort. 
Do things that suck—whether it's running in the rain, studying an extra hour when you're tired, or speaking up when you're terrified. Doing things you hate voluntarily builds a mental callous, making you tougher and more unbreakable against the tragedies that life will eventually throw at you.

## 🍪 The 40% Rule & The Cookie Jar
Goggins (who survived Navy SEAL "Hell Week" three times and runs 100-mile ultra-marathons) discovered a terrifying truth: **When your brain tells you that you are completely done and have nothing left to give, you are only at 40% of your actual capacity.**

Your brain is designed to protect you from pain, so it acts like an alarm system that goes off way too early. When you hit that wall of exhaustion, push slightly past it.
To help you push past it, use "The Cookie Jar." This is a mental list of all the times you succeeded, survived trauma, or overcame a massive obstacle in your past. When the pain is unbearable, reach into your mental Cookie Jar, remember who you are, and take one more step.`,
    keyLessons: [
      "Use the Accountability Mirror: Stop blaming external circumstances and take brutal, complete ownership of your life and failures.",
      "Callous your mind by intentionally doing things that are uncomfortable or difficult every single day.",
      "The 40% Rule: When you feel completely exhausted and want to quit, you have massive reserves left. Push past the brain's fake limits."
    ],
    tasks: [
      {
        id: "cant-hurt-me-quiz-1",
        bookId: "cant-hurt-me-teen",
        type: "quiz",
        title: "Testing the Mind",
        description: "Test your understanding of mental toughness.",
        rewards: { xp: 50, coins: 25 },
        difficulty: "hard",
        estimatedMinutes: 5,
        quiz: {
          questions: [
            {
              question: "What is 'The 40% Rule'?",
              options: [
                "You only need to try 40% of the time to succeed.",
                "When your brain tells you you're absolutely done, you are usually only at 40% of your true capacity.",
                "Only 40% of people can actually become mentally tough.",
                "You must sleep for 40% of your day to heal."
              ],
              correctAnswer: 1
            },
            {
              question: "What does Goggins mean by 'The Cookie Jar'?",
              options: [
                "Eating junk food as a reward for hard work.",
                "A jar of actual money you save when you exercise.",
                "A mental list of past victories and tough times you've survived to draw strength from.",
                "Taking a nap in the middle of a hard challenge."
              ],
              correctAnswer: 2
            }
          ]
        }
      },
      {
        id: "cant-hurt-me-action-1",
        bookId: "cant-hurt-me-teen",
        type: "action_challenge",
        title: "The Accountability Mirror",
        description: "Get honest and set a tough goal.",
        rewards: { xp: 80, coins: 40 },
        difficulty: "hard",
        estimatedMinutes: 20,
        actionChallenge: {
          steps: [
            "Look in a mirror and get brutally honest about one area where you have been making excuses.",
            "Write down your goal to fix it on a sticky note (e.g. 'I will run 1 mile every day' or 'I will stop blaming my teacher for my grade').",
            "Stick it to your bathroom mirror, and take the first painful step today."
          ],
          checkpoints: [
            "Got ruthlessly honest",
            "Wrote the sticky note",
            "Took the first hard action today"
          ]
        }
      }
    ]
  }
];
