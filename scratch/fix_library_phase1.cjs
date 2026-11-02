/**
 * Phase 1 Library Fix Script
 * Fixes: authors, cover URLs, adds real fullContent for top 5 books, unique quiz questions
 */
const fs = require('fs');
const path = require('path');

const CLASSIC_PATH = path.join(__dirname, '../src/features/library/data/classicBooks.ts');
let src = fs.readFileSync(CLASSIC_PATH, 'utf8');

// ── 1.1 Fix Authors ──────────────────────────────────────────────────────────
const authorFixes = {
  "think-and-grow-rich":                   "Napoleon Hill",
  "mindset-the-new-psychology-of-success": "Carol S. Dweck",
  "atomic-habits":                         "James Clear",
  "innovators-dilemma":                    "Clayton M. Christensen",
  "rich-dad-poor-dad":                     "Robert T. Kiyosaki",
  "5-am-club":                             "Robin Sharma",
  "disneys-land":                          "Richard Snow",
};

for (const [id, author] of Object.entries(authorFixes)) {
  // Match: id block, then find author: 'Unknown Author'
  const idEscaped = id.replace(/-/g, '\\-');
  const re = new RegExp(
    `(id:\\s*'${idEscaped}'[\\s\\S]{0,200}?)author:\\s*'Unknown Author'`,
    'g'
  );
  src = src.replace(re, (m, pre) => `${pre}author: '${author}'`);
}

// ── 1.2 Fix Cover URLs ───────────────────────────────────────────────────────
// Using Open Library Covers API with known ISBNs
const coverFixes = {
  'think-and-grow-rich':                   'https://covers.openlibrary.org/b/isbn/9781585424337-L.jpg',
  'mindset-the-new-psychology-of-success': 'https://covers.openlibrary.org/b/isbn/9780345472328-L.jpg',
  '7-habits-of-highly-effective-people':   'https://covers.openlibrary.org/b/isbn/9780743269513-L.jpg',
  'atomic-habits':                         'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg',
  'how-to-win-friends-and-influence-people':'https://covers.openlibrary.org/b/isbn/9780671723651-L.jpg',
  'start-with-why':                        'https://covers.openlibrary.org/b/isbn/9781591846444-L.jpg',
  'grit':                                  'https://covers.openlibrary.org/b/isbn/9781501111105-L.jpg',
  'zero-to-one':                           'https://covers.openlibrary.org/b/isbn/9780804139021-L.jpg',
  'rich-dad-poor-dad':                     'https://covers.openlibrary.org/b/isbn/9781612680194-L.jpg',
  'lean-startup':                          'https://covers.openlibrary.org/b/isbn/9780307887894-L.jpg',
  'good-to-great':                         'https://covers.openlibrary.org/b/isbn/9780066620992-L.jpg',
  'innovators-dilemma':                    'https://covers.openlibrary.org/b/isbn/9780062060242-L.jpg',
  'thinking-fast-and-slow':               'https://covers.openlibrary.org/b/isbn/9780374533557-L.jpg',
  'sapiens':                               'https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg',
  'outliers':                              'https://covers.openlibrary.org/b/isbn/9780316017930-L.jpg',
  'tipping-point':                         'https://covers.openlibrary.org/b/isbn/9780316346627-L.jpg',
  'shoe-dog':                              'https://covers.openlibrary.org/b/isbn/9781476766942-L.jpg',
  'deep-work':                             'https://covers.openlibrary.org/b/isbn/9781455586691-L.jpg',
  'essentialism':                          'https://covers.openlibrary.org/b/isbn/9780804137386-L.jpg',
};

for (const [id, newUrl] of Object.entries(coverFixes)) {
  const idEscaped = id.replace(/-/g, '\\-');
  const re = new RegExp(
    `(id:\\s*'${idEscaped}'[\\s\\S]{0,200}?)coverUrl:\\s*'[^']*'`,
    'g'
  );
  src = src.replace(re, (m, pre) => `${pre}coverUrl: '${newUrl}'`);
}

// ── 1.3 Add real fullContent for top 5 classic books ────────────────────────
const fullContents = {
  'think-and-grow-rich': `## 🧠 The Philosophy of Achievement

Napoleon Hill spent two decades interviewing the most successful people of his time — like Henry Ford and Thomas Edison. He discovered that they all followed the same secret formula. Success isn't about luck; it's about **Mindset**.

## 🔥 The Starting Point: Desire

You must have a **Burning Desire** to achieve your goal. It's not just a wish; it's a 'must-have' that keeps you going when things get tough.

**The Formula:**
- Definiteness of Purpose: Know exactly what you are aiming for
- Faith: Believe that you will reach it, even before you see the results
- Auto-suggestion: Repeat your goals daily — your brain believes what you repeatedly tell it

## 🤝 The Mastermind Alliance

Hill discovered that ALL great achievers had a **Mastermind Group** — a team of people who shared their vision and helped them grow. No one becomes wealthy or successful alone.

> "No two minds ever come together without thereby creating a third, invisible, intangible force which may be likened to a third mind." — Napoleon Hill

## 💰 The Six Steps to Turning Desire Into Money

1. Fix the exact amount of money you desire
2. Determine exactly what you will give in return
3. Establish a definite date for receiving it
4. Create a definite plan and begin at once
5. Write it all down in a clear statement
6. Read it aloud twice a day — morning and night

## 🛡️ Overcoming the Fear of Failure

Hill identified **Six Basic Fears** that stop people from achieving greatness:
- Fear of Poverty
- Fear of Criticism
- Fear of Ill Health
- Fear of Loss of Love
- Fear of Old Age
- Fear of Death

The antidote? **Definiteness of Purpose**. When you know exactly where you're going, fear dissolves.

## 🌟 Key Insight for Young Entrepreneurs

You don't need to wait until you're an adult to apply these principles. The desire is the seed, the plan is the soil, and persistence is the water. Start planting today.`,

  'mindset-the-new-psychology-of-success': `## 🧠 Fixed vs Growth Mindset

Carol Dweck spent decades studying success and failure. Her discovery? **It's not your talent that determines your success — it's your mindset.**

## 🔒 The Fixed Mindset Trap

People with a **Fixed Mindset** believe that intelligence and talent are fixed traits. They:
- Avoid challenges (they might fail and look stupid)
- Give up quickly when facing obstacles
- Ignore useful feedback
- Feel threatened by others' success

They believe they're either good at something or they're not — and there's nothing they can do about it.

## 🌱 The Growth Mindset Power

People with a **Growth Mindset** believe that abilities can be developed through dedication and hard work. They:
- Embrace challenges as opportunities
- Persist through setbacks
- Learn from criticism
- Find inspiration in others' success

> "In a growth mindset, challenges are exciting rather than threatening." — Carol Dweck

## 🏆 The Power of 'Yet'

One of the most powerful words in the English language? **YET.**

Instead of "I can't do this" → "I can't do this *yet*."
Instead of "I'm not good at math" → "I'm not good at math *yet*."

This single word shifts your brain from fixed to growth mode instantly.

## 📚 Mindsets in Sports, Business & School

**Michael Jordan** was cut from his high school basketball team. Fixed mindset? He would have quit. Growth mindset? He practiced obsessively and became the greatest.

**Steve Jobs** was fired from Apple. Fixed mindset? Humiliating defeat. Growth mindset? He built Pixar, NeXT, and eventually returned to transform Apple.

The greats don't avoid failure — they use it as fuel.

## 🎯 How to Build a Growth Mindset

1. **Hear the fixed mindset voice** — notice when you think "I can't"
2. **Recognize you have a choice** — you can respond differently
3. **Talk back** — "I can learn this with time and effort"
4. **Take the growth path** — act on the growth mindset voice

Start today. Every challenge is your gym.`,

  'atomic-habits': `## ⚛️ The Surprising Power of Small Habits

James Clear spent years studying the science of habits and peak performance. His central discovery is both simple and revolutionary:

> **"You do not rise to the level of your goals. You fall to the level of your systems."**

## 📈 The 1% Rule

Improve by just **1% every day**, and after a year you'll be **37 times better**. This is the mathematics of marginal gains — tiny improvements compounding into extraordinary results.

Most people overestimate what they can do in a day and underestimate what they can do in a year. Atomic Habits gives you the system to bridge that gap.

## 🔄 The Four Laws of Behavior Change

Every habit follows a loop: **Cue → Craving → Response → Reward**

To build a good habit, use the Four Laws:
1. **Make it Obvious** — design your environment so the cue is unmissable
2. **Make it Attractive** — pair the habit with something enjoyable
3. **Make it Easy** — reduce friction; start with 2 minutes
4. **Make it Satisfying** — create an immediate reward

To break a bad habit, invert the laws:
1. Make it Invisible
2. Make it Unattractive
3. Make it Difficult
4. Make it Unsatisfying

## 🪪 Identity-Based Habits

The most powerful insight in the book: **true behavior change is identity change.**

Instead of "I want to run a marathon" → "I am a runner"
Instead of "I want to read more" → "I am a reader"

Every small action is a **vote** for the identity you want to become. Each time you write a page, you cast a vote for being a writer. Each time you practice guitar, you vote for being a musician.

## 🔗 Habit Stacking

Attach new habits to existing ones:

> "After I [CURRENT HABIT], I will [NEW HABIT]."

Examples:
- "After I pour my morning coffee, I will write in my journal for 2 minutes."
- "After I sit down at my desk, I will study one flashcard."

This turns your entire day into a chain of automatic good behaviors.

## 🌟 The 2-Minute Rule

Never miss twice. If you miss a day, get back immediately. And start every new habit with just **2 minutes** — because starting is the hardest part, and 2 minutes is always possible.`,

  'start-with-why': `## ❓ The Question That Changes Everything

Simon Sinek noticed something remarkable studying the world's greatest leaders and companies. While most organizations communicate from the *outside in* (What → How → Why), the most inspiring ones do the exact opposite.

They **Start With Why**.

## 🎯 The Golden Circle

Sinek's model has three concentric circles:

- **WHAT** (outermost) — What products/services you offer
- **HOW** (middle) — How you do it differently
- **WHY** (center) — Why you exist, your purpose, your belief

Most companies can easily answer WHAT and HOW. Very few can articulate WHY — and that's what separates good companies from legendary ones.

> "People don't buy what you do; they buy why you do it." — Simon Sinek

## 🍎 The Apple Example

**WHAT:** We make great computers.
**HOW:** They're beautifully designed and simple to use.
**WHY:** We believe in challenging the status quo. We believe in thinking differently.

Apple didn't start with "We make computers." They started with a belief — a vision of a world with more creativity and less conformity. People who believe what Apple believes buy their products.

## 🧠 The Biology of Why

It's not just philosophy — it's neuroscience. The WHY speaks to the **limbic brain** — the part responsible for feelings, loyalty, and decision-making. The WHAT speaks to the **neocortex** — logical, analytical, but not in charge of decisions.

When you lead with WHY, you bypass rational resistance and speak directly to the part of the brain that makes people say "Yes, I trust this."

## 🌍 Real-World Why Leaders

**Martin Luther King Jr.** didn't say "I have a plan." He said "I have a **dream**." That dream — his WHY — mobilized millions.

**The Wright Brothers** had no money, no formal education, no government backing. But they had an unshakeable belief that humans should fly. That WHY kept them going while better-funded teams gave up.

## 🚀 Finding Your Why

Your WHY comes from looking back, not forward:
- What were you doing when time disappeared?
- What causes make you angry enough to act?
- What would you do if money wasn't a factor?

Every business that lasts starts with one person who had a strong WHY. What's yours?`,

  '7-habits-of-highly-effective-people': `## 🏛️ The Foundation: Character Ethics

Stephen Covey's central insight: **character, not personality, is the foundation of true effectiveness**.

For 150 years before him, success literature focused on personality — communication techniques, positive thinking, image management. Covey went deeper: sustainable success comes from **principles**, not tricks.

> "Private victories precede public victories." — Stephen Covey

## 🧍 Habits 1-3: The Private Victory (Independence)

### Habit 1: Be Proactive
You are responsible for your life. Between stimulus and response, you have the **freedom to choose**. Proactive people act based on values; reactive people act based on feelings.

Circle of Concern vs **Circle of Influence** — focus your energy only on what you can control.

### Habit 2: Begin With the End in Mind
All things are created twice: first mentally, then physically. Create a **Personal Mission Statement** — your own constitution. Know what matters most before life decides for you.

### Habit 3: Put First Things First
Urgent ≠ Important. Most people spend life in the urgent but not important quadrant. Effective people invest time in the **important but not urgent** — relationships, planning, learning, health.

## 🤝 Habits 4-6: The Public Victory (Interdependence)

### Habit 4: Think Win-Win
Life is not a competition. The best agreements leave both parties feeling they've won. Win-Win isn't being nice — it's a courageous belief that there's enough for everyone.

### Habit 5: Seek First to Understand, Then to Be Understood
Most people listen with the intent to reply, not to understand. **Empathic listening** — truly hearing another person — is the highest form of listening and the foundation of all influence.

### Habit 6: Synergize
The whole is greater than the sum of its parts. When you value differences in people — in perspective, in skill, in approach — you unlock creative solutions impossible alone.

## 🔄 Habit 7: Sharpen the Saw

Renew yourself across four dimensions:
- **Physical** — Exercise, nutrition, rest
- **Mental** — Reading, writing, learning
- **Social/Emotional** — Relationships, service
- **Spiritual** — Values, meditation, nature

Without Habit 7, the other 6 degrade. With it, they compound.

## 🌟 The Maturity Continuum

Covey maps human growth as:
**Dependence → Independence → Interdependence**

Most people stop at independence. The truly effective understand that in a connected world, the highest achievement is **interdependence** — choosing to work WITH others from a position of strength.`,
};

for (const [id, content] of Object.entries(fullContents)) {
  const idEscaped = id.replace(/-/g, '\\-');
  // Replace stub content like 'Think and Grow Rich expanded content...' or 'fullContent: ...'
  const re = new RegExp(
    `(id:\\s*'${idEscaped}'[\\s\\S]*?)fullContent:\\s*'[^']*\\.\\.\\.?',`,
    'g'
  );
  const escaped = content.replace(/`/g, '\\`').replace(/\${/g, '\\${');
  src = src.replace(re, (m, pre) => `${pre}fullContent: \`${escaped}\`,`);
}

// ── 1.4 Unique quiz questions for top 5 books ────────────────────────────────
const uniqueQuizzes = {
  'think-and-grow-rich': {
    questions: [
      {
        question: "According to Napoleon Hill, what is the 'starting point of all achievement'?",
        options: ['Hard work', 'A Burning Desire', 'Good connections', 'Intelligence'],
        correctAnswer: 1,
      },
      {
        question: "What is a 'Mastermind Alliance'?",
        options: ['A secret society', 'A group of smart people working together toward a shared goal', 'A business degree', 'A type of meditation'],
        correctAnswer: 1,
      },
      {
        question: "Napoleon Hill interviewed over 500 successful people for how many years?",
        options: ['5 years', '10 years', '20 years', '30 years'],
        correctAnswer: 2,
      },
    ],
  },
  'mindset-the-new-psychology-of-success': {
    questions: [
      {
        question: "What is the key difference between a 'fixed mindset' and a 'growth mindset'?",
        options: ['Fixed mindset people are smarter', 'Growth mindset people believe abilities can be developed through effort', 'Fixed mindset leads to more success', 'Growth mindset means never failing'],
        correctAnswer: 1,
      },
      {
        question: "Carol Dweck suggests adding what powerful word to change your thinking?",
        options: ['Soon', 'Maybe', 'Yet', 'Someday'],
        correctAnswer: 2,
      },
      {
        question: "Michael Jordan was cut from his high school basketball team. What does this show?",
        options: ['Talent is everything', 'Even great people face setbacks — a growth mindset turns failure into fuel', 'Natural talent eventually wins out', 'Schools often make mistakes'],
        correctAnswer: 1,
      },
    ],
  },
  'atomic-habits': {
    questions: [
      {
        question: "According to James Clear, if you improve by 1% each day for a year, you will be approximately how much better?",
        options: ['10 times better', '20 times better', '37 times better', '100 times better'],
        correctAnswer: 2,
      },
      {
        question: "What is the '2-Minute Rule' in Atomic Habits?",
        options: ['Exercise for 2 minutes a day', 'When starting a new habit, scale it down to something that takes 2 minutes or less', 'Only check your phone for 2 minutes', 'Read 2 minutes every morning'],
        correctAnswer: 1,
      },
      {
        question: "What does 'habit stacking' mean?",
        options: ['Building too many habits at once', 'Linking a new habit to an existing one', 'Tracking habits with a stack of cards', 'Doing habits in groups'],
        correctAnswer: 1,
      },
    ],
  },
  'start-with-why': {
    questions: [
      {
        question: "In Simon Sinek's Golden Circle, what is at the CENTER?",
        options: ['What', 'How', 'Why', 'Who'],
        correctAnswer: 2,
      },
      {
        question: "According to Sinek, why do Apple's customers feel so loyal?",
        options: ['Because Apple products are the cheapest', 'Because Apple markets to their feelings and beliefs, not just their logic', 'Because Apple has the best customer service', 'Because Apple was founded by Steve Jobs'],
        correctAnswer: 1,
      },
      {
        question: "Sinek says 'People don't buy WHAT you do; they buy...'",
        options: ['How you do it', 'Where you do it', 'Why you do it', 'When you do it'],
        correctAnswer: 2,
      },
    ],
  },
  '7-habits-of-highly-effective-people': {
    questions: [
      {
        question: "What does Habit 5 ('Seek First to Understand') mean in practice?",
        options: ['Always ask questions before answering', 'Listen deeply to understand someone before giving your own opinion', 'Study hard before talking', 'Research before making decisions'],
        correctAnswer: 1,
      },
      {
        question: "What does Covey mean by 'Think Win-Win'?",
        options: ['Always try to win competitions', 'Seek agreements where BOTH parties feel they have gained', 'Win twice in a row', 'Only work with winners'],
        correctAnswer: 1,
      },
      {
        question: "Habit 7 is 'Sharpen the Saw' — what does this metaphor mean?",
        options: ['Work faster', 'Regularly renew yourself in body, mind, heart, and spirit', 'Cut out unnecessary tasks', 'Be precise in your work'],
        correctAnswer: 1,
      },
    ],
  },
};

// Apply unique quizzes by finding and replacing the generic quiz block within each book's tasks
for (const [bookId, quizData] of Object.entries(uniqueQuizzes)) {
  const idEscaped = bookId.replace(/-/g, '\\-');
  // Find the quiz questions array for this specific book's first quiz task
  const taskQuizRe = new RegExp(
    `(id:\\s*'${idEscaped}-quiz-1'[\\s\\S]{0,200}?questions:\\s*\\[)[\\s\\S]*?(\\]\\s*,\\s*\\}\\s*,\\s*\\}\\s*,\\s*\\{\\s*id:\\s*'${idEscaped}-reflection)`,
    'g'
  );
  const questionsStr = '\n' + quizData.questions.map(q => {
    const optsStr = q.options.map(o => `'${o.replace(/'/g, "\\'")}'`).join(', ');
    return `            {\n              question: '${q.question.replace(/'/g, "\\'")}',\n              options: [${optsStr}],\n              correctAnswer: ${q.correctAnswer},\n            }`;
  }).join(',\n') + '\n          ';
  src = src.replace(taskQuizRe, (m, pre, post) => `${pre}${questionsStr}${post}`);
}

// Write output
fs.writeFileSync(CLASSIC_PATH, src, 'utf8');
