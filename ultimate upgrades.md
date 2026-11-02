# PROFITSPATROL 2.0 — MASTER PRD

## Complete Product + Content + Game + World + Technical Rebuild & Upgrade Specification

**Document Type:** Master Product Requirements Document
**Product:** ProfitsPatrol
**Version:** 3.0 — Consolidated Master Specification
**Status:** Implementation Source of Truth
**Target:** Kids Financial Literacy + Entrepreneurship Learning RPG
**Platforms:** Mobile + Web
**Languages:** English + Arabic RTL
**Primary Modes:** Junior 6–9, Explorer 9–12

---

# 0. MASTER DIRECTIVE

This document **merges the previous ProfitsPatrol PRDs into one implementation specification**.

It replaces the need to maintain separate product PRDs.

The existing ProfitsPatrol application must be **audited first**, then upgraded incrementally.

### Non-negotiable implementation rule

> **DO NOT blindly rebuild the application from scratch.**

The implementation agent must:

1. Audit the existing application.
2. Identify what already works.
3. Preserve working functionality.
4. Repair broken functionality.
5. Refactor duplicated architecture.
6. Add missing systems.
7. Migrate existing content into the new architecture.
8. Test every phase before moving forward.
9. Never delete existing content merely because the new architecture is different.
10. Never create parallel duplicate systems when an existing reusable system can be extended.

The final product should feel like:

> **A living financial-life RPG where children learn money, entrepreneurship, decision-making and business by actually playing, building, experimenting and making consequences-driven decisions.**

It must **not** feel like:

* an online course
* a collection of quizzes
* an MBA for children
* a collection of disconnected mini-games
* a generic children's app with financial terminology added

---

# 1. PRODUCT VISION

## 1.1 Core Vision

ProfitsPatrol is a gamified educational world where children:

```text
Explore
   ↓
Learn
   ↓
Make decisions
   ↓
Experience consequences
   ↓
Play
   ↓
Build
   ↓
Earn
   ↓
Improve
   ↓
Create a business
   ↓
Become more capable
```

The existing content catalog contains:

* 20 modules
* 200 lessons
* 50 games
* 8 districts
* CEO Library
* side hustles
* real-estate/passive-income systems
* HQ progression
* avatar shop
* skill tree
* mentors
* parent/teacher monetization systems

The new architecture should **connect these systems instead of presenting them as isolated features**. 

---

# 2. PRODUCT PRINCIPLES

## P1 — Experience Before Explanation

Do not start with:

> "Today we will learn what compound interest means."

Start with:

> "Filo has 10 coins. He can spend them now or save them. What should he do?"

Then reveal the concept.

### Learning pattern

```text
Experience
→ Decision
→ Consequence
→ Reflection
→ Concept
→ Vocabulary
→ Practice
→ Mastery
```

---

## P2 — Learn by Doing

Lessons must not all follow:

```text
Story
→ Multiple choice
→ Vocabulary
→ XP
```

Introduce multiple lesson types:

* Explore
* Choose
* Build
* Calculate
* Negotiate
* Create
* Investigate
* Predict
* Run
* Repair
* Compare
* Design
* Experiment
* Roleplay
* Simulation

---

# 3. TARGET AUDIENCES

## Junior Mode

**Age:** 6–9

Focus:

* money recognition
* needs vs wants
* saving
* spending
* simple budgeting
* earning
* basic business ideas
* teamwork
* simple choices

Use:

* simple vocabulary
* visual explanations
* audio
* Ollie guidance
* very small numbers
* short activities
* large touch targets

---

## Explorer Mode

**Age:** 9–12

Focus:

* budgeting
* business economics
* pricing
* marketing
* profit
* risk
* investing concepts
* operations
* leadership
* entrepreneurship
* strategy
* global business
* technology
* sustainability

Can introduce:

* formulas
* percentages
* multi-step decisions
* risk modeling
* simplified financial models
* business cases

---

# 4. THE FOUR MAIN HEROES

There must be **exactly four permanent main heroes**.

Do not add additional main mascots.

---

## 4.1 OLLIE — PLAN

**Animal:** Owl
**Colors:** Orange + Navy
**Role:** Leader / Organizer

### Personality

* organized
* thoughtful
* calm
* strategic
* encouraging

### Core skill

**Planning**

### Represents

```text
PLAN
```

Ollie helps players:

* plan
* organize
* prioritize
* make decisions
* understand strategy

---

# 4.2 REEMA — CONNECT

**Animal:** Arctic Fox
**Colors:** White + Cyan + Teal Scarf
**Role:** Marketing / Sales

### Personality

* energetic
* social
* persuasive
* curious
* confident

### Core skill

**Communication**

### Represents

```text
CONNECT
```

Reema helps players understand:

* customers
* communication
* marketing
* persuasion
* branding
* sales

---

# 4.3 FILO — PROTECT

**Animal:** Baby Elephant
**Color:** Soft Olive Green
**Role:** Accountant / Financial Guardian

### Personality

* patient
* careful
* kind
* reliable
* practical

### Core skill

**Financial protection**

### Represents

```text
PROTECT
```

Filo teaches:

* saving
* budgeting
* financial safety
* patience
* risk awareness
* responsible money decisions

---

# 4.4 KAMI — CREATE

**Animal:** Chameleon
**Colors:** Purple + Lemon Spots
**Role:** Inventor / Innovator

### Personality

* imaginative
* experimental
* curious
* flexible
* playful

### Core skill

**Creativity**

### Represents

```text
CREATE
```

Kami teaches:

* innovation
* experimentation
* problem solving
* prototyping
* technology
* adapting to change

---

# 5. REX — THE RIVAL

## Role

Recurring rival.

**Animal:** Raccoon

**Colors:**

* deep navy
* charcoal
* coral/red accents
* small warm-yellow accent

## Personality

* clever
* competitive
* mischievous
* ambitious
* confident
* playful

Rex is **not evil**.

He should sometimes:

* beat the player
* make mistakes
* challenge the player
* have good ideas
* have bad ideas
* cooperate
* learn from the player

### Philosophy

> **Think Again.**

Rex should create healthy competition rather than simply being the villain.

---

# 6. NPC SYSTEM

NPCs are supporting world characters.

They must **not visually compete with the four heroes**.

Initial recurring NPC roster:

| NPC   | Animal  | Role           |
| ----- | ------- | -------------- |
| Penny | Panda   | Banker         |
| Tara  | Turtle  | Supplier       |
| Bruno | Dog     | Delivery       |
| Milo  | Rabbit  | Customer       |
| Nina  | Cat     | Shop Owner     |
| Pip   | Penguin | Technology     |
| Maya  | Koala   | Sustainability |
| Ozi   | Octopus | Negotiation    |
| Lina  | Deer    | Community      |
| Ziko  | Monkey  | Creator        |

NPCs should have:

* profession
* personality
* location
* dialogue
* quests
* reactions
* relationship state
* relevant competencies

---

# 7. CHARACTER HIERARCHY

```text
LEVEL 1
4 HEROES

Ollie
Reema
Filo
Kami

       ↓

LEVEL 2
RIVAL

Rex

       ↓

LEVEL 3
RECURRING NPCs

Penny
Tara
Bruno
Milo
Nina
Pip
Maya
Ozi
Lina
Ziko

       ↓

LEVEL 4
BACKGROUND CITIZENS
```

---

# 8. WORLD STRUCTURE

The eight existing districts become the primary world architecture. 

## District 1 — Money District

Skills:

* earning
* spending
* saving
* budgeting
* banking
* financial decisions

Existing games:

* Coin Catcher
* Needs vs Wants
* Coin Sorter
* Piggy Budget
* Super Savings
* Change Master
* Expense Detective
* Discount Dash
* Cashflow Runner
* Bank Maze

---

# 9. DISTRICT 2 — BUILDERS DISTRICT

Skills:

* business creation
* customers
* pricing
* sales
* marketing

Existing games include:

* Lemonade Stand Tycoon
* Snack Shack
* T-Shirt Designer
* Pet Care Service
* Cafe Rush
* Ad Agency
* Customer Quest
* Sales Master
* Brand Builder
* Marketing Mix

---

# 10. DISTRICT 3 — RISK & WEALTH

Skills:

* saving
* investing concepts
* risk
* diversification
* scams
* long-term thinking

Games:

* Invest Island
* Risk Radar
* Portfolio Quest
* Compound Mountain
* Scam Detective

---

# 11. DISTRICT 4 — OPERATIONS

Skills:

* time
* people
* inventory
* supply chain
* crisis management

Games:

* Time Tycoon
* Team Builder
* Supply Chain Challenge
* Inventory Master
* Business Crisis

---

# 12. DISTRICT 5 — INNOVATION

Skills:

* ideas
* prototypes
* testing
* feedback
* experimentation

Games:

* Idea Factory
* Product Lab
* Prototype Rush
* Customer Feedback
* Innovation Challenge

---

# 13. DISTRICT 6 — LEADERSHIP

Skills:

* communication
* negotiation
* teamwork
* leadership
* deals

Games:

* Negotiation Arena
* Team Captain
* Deal Maker
* Communication Lab
* Leadership Quest

---

# 14. DISTRICT 7 — STRATEGY

Skills:

* competition
* market positioning
* strategy
* growth
* business management

Games:

* Market Wars
* Strategy Empire
* Competitor Hunt
* Growth Engine
* Business Tycoon

---

# 15. DISTRICT 8 — LAUNCH & SCALE

Skills:

* sales
* marketing
* e-commerce
* pitching
* launching

Games:

* Sales Master X
* Marketing Machine
* E-commerce Rush
* Pitch Battle
* Startup Launch

---

# 16. WORLD PROGRESSION

Do not unlock everything immediately.

Recommended progression:

```text
Money
  ↓
Builders
  ↓
Risk & Wealth
  ↓
Operations
  ↓
Innovation
  ↓
Leadership
  ↓
Strategy
  ↓
Launch & Scale
```

Each district should contain:

```text
Story
→ Missions
→ Lessons
→ Games
→ Challenges
→ NPCs
→ Business opportunities
→ Mastery
→ District Boss/Capstone
```

---

# 17. HOME SCREEN 2.0

The home screen should answer five questions immediately:

1. Who am I?
2. What am I doing?
3. What should I do next?
4. How is my business doing?
5. What can I unlock?

Recommended structure:

```text
HEADER
Avatar + Name + Level + Coins

CURRENT MISSION
"Help Nina save her shop."

WORLD
Current District

BUSINESS
Revenue / Customers / Cash

CHARACTER
Hero reaction

DAILY CHALLENGE

CONTINUE
```

Avoid turning the home screen into a dashboard full of numbers.

---

# 18. WORLD MAP

The world map is the main navigation.

It should visually show:

* unlocked districts
* locked districts
* current mission
* player location
* NPCs
* businesses
* achievements
* district completion
* collectibles

---

# 19. CORE GAME LOOP

Every major learning experience should follow:

```text
WORLD
 ↓
STORY
 ↓
MISSION
 ↓
EXPERIENCE
 ↓
DECISION
 ↓
CONSEQUENCE
 ↓
CONCEPT
 ↓
GAME
 ↓
MASTERY
 ↓
REWARD
 ↓
BUSINESS PROGRESSION
 ↓
NEXT MISSION
```

---

# 20. CURRICULUM REBUILD

The existing catalog contains **20 modules and 200 lessons**. 

Do not throw them away.

Instead:

```text
Existing Content
       ↓
Content Inventory
       ↓
Competency Mapping
       ↓
District Mapping
       ↓
Age Mapping
       ↓
Lesson Type
       ↓
Game Mapping
       ↓
Mastery
```

---

# 21. EXISTING MODULES

The existing modules are:

1. Money Basics
2. Entrepreneurship
3. Investing & Wealth
4. Marketing
5. Leadership
6. Economics
7. Technology
8. Social Responsibility
9. Global Business
10. Financial Smarts
11. Crypto & Blockchain
12. AI & Future Jobs
13. Sustainability Business
14. Venture Capital
15. Corporate Strategy
16. Global Trade
17. Financial Modeling
18. Brand Building
19. Future of Money
20. Negotiation & Persuasion



These become **content pools**, not necessarily the visible top-level navigation.

---

# 22. COMPETENCY SYSTEM

Replace simple lesson completion with competency mastery.

Core competency groups:

### Money

* earning
* spending
* saving
* budgeting
* financial safety

### Business

* identifying problems
* customers
* pricing
* profit
* operations

### Communication

* listening
* presenting
* negotiation
* persuasion
* teamwork

### Strategy

* planning
* competition
* risk
* decisions
* growth

### Innovation

* ideation
* experimentation
* feedback
* prototyping
* adaptation

### Responsible Business

* sustainability
* ethics
* community
* responsible decisions

---

# 23. MASTERY LEVELS

Each competency:

```text
Locked
↓
Introduced
↓
Practicing
↓
Competent
↓
Mastered
```

Do not equate:

> completed lesson = mastered skill.

Mastery should be based on demonstrated performance.

---

# 24. ADAPTIVE LEARNING

The application tracks:

* accuracy
* mistakes
* retries
* completion time
* game performance
* confidence signals
* repeated errors
* mastery

Then adjusts:

* difficulty
* examples
* hints
* repetition
* mission complexity

Example:

```text
Player repeatedly overspends
        ↓
Filo detects pattern
        ↓
Short budgeting challenge
        ↓
Simpler scenario
        ↓
Practice
        ↓
Retry real scenario
```

---

# 25. GAME ARCHITECTURE

Every game must have:

```text
game_id
title
district_id
competencies[]
age_modes[]
difficulty
instructions
assets
levels
scoring
rewards
mastery_rules
localization
```

---

# 26. GAME INTEGRATION

Every game must answer:

> **What skill does this game actually teach?**

Avoid games that are merely cosmetic variations of each other.

For example:

* Sales Master
* Sales Master X
* Deal Maker
* Negotiation Arena
* Communication Lab

must have clearly different learning objectives.

---

# 27. GAME RESULT MODEL

After a game:

```text
Score
Accuracy
Mistakes
Skill performance
Coins
XP
Mastery progress
Mission progress
Character reaction
```

The game should return structured results to the main application.

---

# 28. CONSEQUENCE ENGINE

Player choices must matter.

Example:

```text
Choose cheap supplier
      ↓
Lower cost
      ↓
Lower quality
      ↓
Customer complaints
      ↓
Reputation decreases
```

Or:

```text
Choose expensive supplier
      ↓
Higher cost
      ↓
Higher quality
      ↓
Happy customers
      ↓
Lower short-term profit
      ↓
Better long-term reputation
```

No choice should simply be:

> RIGHT = +10
> WRONG = -10

The child should understand **why**.

---

# 29. "WHY?" SYSTEM

Every meaningful decision can have:

### Why?

A short explanation.

Example:

> You chose to save your money.

Then:

> **Why it matters:**
> Saving gives you money you can use later for something important.

Explorer mode can provide deeper explanations.

---

# 30. PERSISTENT BUSINESS

The player eventually owns and manages a business.

The business persists across sessions.

Possible variables:

```text
cash
revenue
expenses
profit
customers
inventory
reputation
staff
products
marketing
capacity
business_level
business_health
```

---

# 31. BUSINESS LOOP

```text
Choose product
      ↓
Set price
      ↓
Buy inventory
      ↓
Market
      ↓
Serve customers
      ↓
Earn revenue
      ↓
Pay costs
      ↓
Calculate result
      ↓
Improve
```

---

# 32. BUSINESS TYPES

The existing catalog includes side hustles such as:

* dog walking
* grocery bagger
* car wash
* pet sitter
* lemonade stand
* lawn care
* babysitter
* craft maker



Use these as early business experiences.

Later unlock:

* shops
* food businesses
* services
* digital businesses
* e-commerce
* larger businesses

---

# 33. BUSINESS ECONOMY

The simulation must include trade-offs.

Variables can include:

* price
* demand
* cost
* inventory
* quality
* reputation
* marketing
* competition
* time
* capacity

Avoid creating a simplistic:

> Buy → Wait → Rich

system.

---

# 34. PASSIVE INCOME / REAL ESTATE

Existing content contains:

* Pop-Up Stand
* Suburban Garage
* Taco Truck
* Retro Arcade
* Commercial High-Rise
* Eco-Resort Island

with dynamic costs/bonuses. 

Retain this concept but make it educational.

Include appropriate concepts such as:

* operating costs
* maintenance
* vacancy
* risk
* opportunity cost
* management
* responsibility

The message should be:

> Income sources involve trade-offs.

Not:

> Smart people get rich without working.

---

# 35. REX COMPETITION SYSTEM

Rex periodically competes with the player.

Examples:

### Price Challenge

Rex changes price.

Player responds.

### Customer Challenge

Who can satisfy customers better?

### Business Race

Who can grow responsibly?

### Innovation Race

Who solves the problem better?

### Negotiation Challenge

Player negotiates against Rex.

Results should be based on decisions and skills, not random punishment.

---

# 36. NPC LIVING WORLD

NPCs should not simply stand in one place.

Their states can change:

```text
happy
busy
worried
growing
struggling
celebrating
needs_help
```

Example:

Nina's shop:

```text
Inventory low
→ player helps supplier
→ inventory restored
→ customers return
```

This makes the world feel alive.

---

# 37. CHARACTER RELATIONSHIPS

Players build relationships with:

* Ollie
* Reema
* Filo
* Kami
* Rex
* NPCs

Relationship states:

```text
Unknown
↓
Introduced
↓
Friendly
↓
Trusted
↓
Partner
```

Relationships unlock:

* dialogue
* missions
* challenges
* cosmetics
* story scenes
* special opportunities

---

# 38. CHARACTER DIALOGUE ENGINE

Dialogue should be data-driven.

Example:

```text
character_id
situation
emotion
player_action
dialogue
response
unlock
```

Character reactions should depend on player behavior.

Example:

Player repeatedly saves:

> Filo: "I knew you could plan ahead!"

Player repeatedly takes risky decisions:

> Filo: "Let's check the numbers one more time."

---

# 39. CHARACTER EMOTION SYSTEM

Characters need basic states:

```text
happy
excited
worried
surprised
confused
proud
disappointed
curious
```

Expressions should correspond to gameplay events.

---

# 40. MISSION ENGINE

Missions should be generated from reusable templates.

Example:

```text
Help [NPC]
Solve [problem]
Using [competency]
Within [constraint]
```

Examples:

> Help Nina reduce wasted inventory.

> Help Bruno find a faster delivery route.

> Help Reema attract 20 customers.

> Help Filo build a safer budget.

---

# 41. DAILY CHALLENGES

Each day:

```text
1 main challenge
1 quick activity
1 optional bonus
```

Examples:

* save 20 coins
* complete a negotiation
* help an NPC
* improve business reputation
* complete a game without hints

---

# 42. WEEKLY CHALLENGES

Longer-term goals:

```text
Complete 5 missions
Master 1 competency
Earn 500 coins
Help 3 NPCs
Beat a Rex challenge
```

---

# 43. ACHIEVEMENT SYSTEM

Examples:

### Saver

Complete multiple saving challenges.

### Problem Solver

Solve multiple business problems.

### Customer Champion

Maintain strong customer satisfaction.

### Negotiator

Successfully complete negotiation missions.

### Inventor

Create successful prototypes.

### Responsible Entrepreneur

Make socially/environmentally responsible decisions.

Achievements should reward **behavior**, not simply grinding.

---

# 44. COLLECTIBLES

Collectibles can include:

* badges
* stickers
* character items
* business decorations
* district souvenirs
* achievement cards

Avoid turning every collectible into a monetization mechanism.

---

# 45. HQ 2.0

Existing HQ progression:

```text
Messy Garage
↓
Shared Office
↓
High-Rise Floor
↓
Private Island
```



Keep the progression but make HQ interactive.

Rooms can include:

* business desk
* finance corner
* innovation lab
* marketing wall
* team area
* trophy room
* library
* avatar area

---

# 46. HQ SKILL TREE

Existing branches:

* Charisma
* Efficiency
* Wisdom



Retain the system but connect skills to actual gameplay.

Example:

### Charisma

Better negotiation opportunities.

### Efficiency

Lower time/operating costs in appropriate simulations.

### Wisdom

Improved decision information/hints.

Avoid making bonuses so powerful that skill trees replace learning.

---

# 47. KAMI'S EXPERIMENT LAB

A dedicated creative area.

Player can:

```text
Problem
 ↓
Idea
 ↓
Prototype
 ↓
Test
 ↓
Feedback
 ↓
Improve
```

Possible mechanics:

* combine parts
* design product
* choose materials
* test
* observe results
* iterate

Failure should be expected.

---

# 48. FAILURE & RECOVERY

Failure should be safe.

Example:

> Your shop lost money.

Then:

```text
What happened?
Why?
What can you change?
Try again.
```

Never make failure humiliating.

The goal is:

> **Mistake → Understanding → Improvement**

---

# 49. CAPSTONE — BUILD YOUR BUSINESS

Final major experience:

```text
Choose problem
↓
Identify customer
↓
Design solution
↓
Build prototype
↓
Choose price
↓
Create brand
↓
Market
↓
Sell
↓
Manage operations
↓
Review results
↓
Improve
↓
Pitch
```

The capstone should combine multiple competencies.

---

# 50. KNOWLEDGE HUB

Existing CEO Library contains 100+ chapter-by-chapter summaries and books including:

* Think and Grow Rich
* Rich Dad Poor Dad for Teens
* The Richest Man in Babylon
* How to Win Friends and Influence People
* Psychology of Money
* 7 Habits of Highly Effective Teens
* Zero to One
* Shoe Dog
* Lean Startup
* Atomic Habits
* Originals
* Start with Why



Reframe this as:

# Ollie's Knowledge Vault

Use it for:

* concepts
* short explanations
* practical takeaways
* vocabulary
* examples

Do not make the app dependent on reproducing copyrighted books.

---

# 51. SOCIAL RESPONSIBILITY

Social responsibility should not exist only as one isolated module.

It should appear throughout gameplay.

Examples:

* fair pricing
* honest advertising
* responsible sourcing
* accessibility
* environmental impact
* customer safety
* employee wellbeing
* community impact

---

# 52. SUSTAINABILITY

Integrate sustainability into business decisions.

Example:

```text
Cheap packaging
→ lower cost
→ higher environmental impact

Eco packaging
→ higher cost
→ possible customer preference
→ environmental benefit
```

Children learn trade-offs.

---

# 53. CRYPTO & FUTURE OF MONEY

Crypto & Blockchain, Future of Money and related advanced topics exist in the content catalog. 

They should be:

* optional
* Explorer-oriented
* simplified
* contextual

They should not dominate the core curriculum.

---

# 54. ADVANCED BUSINESS CONTENT

Topics such as:

* venture capital
* financial modeling
* corporate strategy
* global trade
* valuation
* advanced business terminology

should become **Explorer Lab / advanced optional content** rather than appearing too early.

---

# 55. ADAPTIVE AGE CONTENT

Same concept, different implementation.

### Example: Budget

Junior:

> You have 10 coins. You need 6 for lunch. How many are left?

Explorer:

> You earn $50. Your fixed expenses are $20 and variable expenses are $15. How much can you save?

Same competency.

Different cognitive level.

---

# 56. AVATAR SYSTEM

Avatar progression should be connected to gameplay.

Unlock:

* clothing
* accessories
* hairstyles
* business outfits
* district items
* achievement cosmetics

The avatar shop should use structured asset IDs.

Example:

```text
avatar_hat_001
avatar_jacket_003
avatar_shoes_002
```

---

# 57. ASSET REGISTRY

All visual assets must be externally replaceable.

Never hardcode asset paths throughout components.

Use:

```text
asset_id
asset_type
path
version
character_id
language
theme
status
```

Example:

```text
hero_ollie_default
hero_ollie_happy
hero_ollie_thinking
hero_ollie_excited
```

This allows artwork to be replaced without changing application logic.

---

# 58. CHARACTER IMAGE REQUIREMENT

Each major character should have:

* idle
* happy
* sad
* thinking
* surprised
* excited
* celebrating
* worried
* pointing
* talking

Images should be reusable throughout the application.

---

# 59. DATA ARCHITECTURE

Use a centralized model.

Core entities:

```text
users
profiles
heroes
characters
npcs
districts
lessons
lesson_steps
competencies
games
game_levels
game_results
player_progress
player_competencies
missions
mission_progress
achievements
player_achievements
businesses
business_progress
products
inventory
transactions
hq
skills
avatars
avatar_items
relationships
dialogues
assets
notifications
daily_challenges
weekly_challenges
seasons
events
```

---

# 60. PLAYER PROFILE

The user profile must be **real**, not a dummy UI.

It should persist:

```text
user_id
name
avatar
age_mode
language
level
XP
coins
district
business
competencies
achievements
relationships
settings
```

---

# 61. SAVE SYSTEM

Progress must survive:

* logout
* refresh
* device changes
* web/mobile transitions where supported

Use:

```text
autosave
server persistence
local fallback where appropriate
sync conflict handling
```

---

# 62. AUTHENTICATION

Audit existing authentication first.

Requirements:

* secure sessions
* proper user IDs
* no fake profile data
* authorization
* protected player data
* parent/teacher role separation where applicable

---

# 63. PARENT DASHBOARD 2.0

Parent dashboard should focus on **learning**, not surveillance.

Show:

* time spent
* competencies
* progress
* strengths
* areas needing practice
* completed districts
* recent achievements
* learning moments

Avoid unnecessary granular behavioral tracking.

---

# 64. PARENT LEARNING MOMENTS

After relevant activities:

> Today your child practiced budgeting.

Then give parent:

> Try asking: "What would you do if you had to choose between two things you want?"

The objective is to extend learning outside the app.

---

# 65. TEACHER SYSTEM

Teacher features:

* class management
* student progress
* assign missions
* assign districts
* create custom challenges
* view competency progress
* classroom reports

Existing monetization includes Teacher Solo, Teacher Pro and school plans. 

---

# 66. REAL-WORLD MISSIONS

Optional missions outside the game:

Examples:

### Grocery Mission

Find three products and compare prices.

### Savings Mission

Choose something to save toward.

### Customer Mission

Ask a family member what makes them choose a product.

### Business Mission

Find a problem at home and propose a solution.

These should not require children to make financial purchases.

---

# 67. SEASON SYSTEM

Later-stage feature.

Each season can introduce:

* new district event
* limited missions
* new collectibles
* special business challenge
* Rex tournament
* character story

Do not make seasons mandatory for educational progression.

---

# 68. MONETIZATION

Existing catalog defines:

* Intern — Free
* Founder — $9.99/month
* Board Member — $14.99/month
* Tycoon — $89.99/year
* Teacher Solo — Free
* Teacher Pro — $49/year
* School plans — $299–$1499/year



The product architecture should support feature flags and subscription entitlements.

---

# 69. MONETIZATION PRINCIPLE

Do not lock core learning behind aggressive monetization.

Paid features can focus on:

* additional content
* advanced business simulations
* customization
* teacher tools
* parent insights
* expanded worlds

---

# 70. ARABIC + ENGLISH

Arabic is not simply a translated UI.

Requirements:

* RTL
* Cairo/Baloo 2-compatible typography
* localized examples
* localized currency/examples where appropriate
* Arabic punctuation
* culturally natural dialogue
* mirrored navigation where appropriate

The existing catalog explicitly requires English LTR and Arabic RTL with culturally tailored examples. 

---

# 71. LOCALIZATION ARCHITECTURE

Never hardcode strings.

Use:

```text
translation_key
en
ar
```

Example:

```text
mission.save_money.title
mission.save_money.description
```

All game content should support localization.

---

# 72. TECHNICAL REQUIREMENTS

The implementation agent must first inspect the actual current stack.

Where the existing architecture already works, preserve it.

The target architecture should support:

* component reuse
* centralized state
* structured data
* API abstraction
* authentication
* persistence
* localization
* asset registry
* feature flags
* analytics
* responsive design

---

# 73. RESPONSIVE DESIGN

The application must work across:

### Mobile

* touch-first
* large controls
* portrait-first gameplay
* simple navigation

### Web

* wider layouts
* richer world map
* dashboard views
* expanded business interfaces

Do not simply stretch the mobile UI onto desktop.

---

# 74. NAVIGATION

Recommended primary navigation:

```text
HOME
WORLD
GAMES
BUSINESS
HQ
PROFILE
```

Secondary features should be contextually accessible.

Avoid 10–15 permanent bottom navigation buttons.

---

# 75. GAME LAUNCH ARCHITECTURE

Games must launch through a common interface.

Example:

```text
GameLauncher
   ↓
load game definition
   ↓
load assets
   ↓
load localization
   ↓
initialize state
   ↓
play
   ↓
submit result
   ↓
calculate rewards
   ↓
update mastery
   ↓
update mission
   ↓
character reaction
```

---

# 76. ERROR HANDLING

No more generic:

> "No game created"

without diagnosis.

Every failure must have:

```text
error_id
technical_message
user_message
retry_action
logging
```

Example:

```text
GAME_LOAD_001
"Game content unavailable."
[Retry]
```

The user should never see raw exceptions.

---

# 77. GAME REGISTRY

Create one source of truth.

Example:

```json
{
  "id": "needs_vs_wants",
  "district": "money",
  "competencies": [
    "spending",
    "decision_making"
  ],
  "modes": [
    "junior",
    "explorer"
  ],
  "asset": "game_needs_wants",
  "enabled": true
}
```

---

# 78. FEATURE FLAGS

Every major new system should be independently enabled.

Example:

```text
feature.world_map
feature.rex
feature.relationships
feature.business_simulation
feature.experiment_lab
feature.teacher_builder
feature.seasons
```

This allows safe rollout.

---

# 79. ANALYTICS

Track meaningful learning/product events.

Examples:

```text
lesson_started
lesson_completed
game_started
game_completed
game_failed
mastery_increased
mission_completed
business_action
achievement_unlocked
district_unlocked
```

Avoid excessive collection of sensitive child data.

---

# 80. PERFORMANCE

Requirements:

* lazy-load games
* lazy-load large assets
* optimize images
* cache static assets
* avoid unnecessary rerenders
* keep world map responsive
* minimize initial bundle
* support slower connections

---

# 81. ACCESSIBILITY

Junior mode:

* large touch targets
* strong visual hierarchy
* audio assistance
* simple language
* readable typography

Explorer:

* same core accessibility
* more information density

Provide:

* readable contrast
* reduced motion option
* audio where appropriate
* clear interaction states

---

# 82. SECURITY

Audit:

* authentication
* authorization
* API endpoints
* database rules
* user-owned data
* teacher/student separation
* subscription permissions
* admin tools

Never trust client-side values for:

* coins
* XP
* purchases
* achievements
* progression

Server-side validation should be used where appropriate.

---

# 83. CONTENT ADMIN SYSTEM

Build content so future content can be added without modifying application code.

Content entities should support:

```text
lesson
game
mission
dialogue
achievement
challenge
NPC
district
```

Each should have stable IDs.

---

# 84. CONTENT VERSIONING

Every content item should support:

```text
version
status
created_at
updated_at
published_at
```

Statuses:

```text
draft
review
approved
published
archived
```

---

# 85. MIGRATION STRATEGY

## Phase 0 — Audit

**No major feature development.**

Inspect:

* architecture
* database
* authentication
* routes
* components
* games
* profile
* assets
* localization
* state management
* APIs
* broken features
* duplicated systems
* unused code

Output:

```text
IMPLEMENTATION_STATUS.md
```

---

# 86. PHASE 1 — FOUNDATION

Implement/fix:

1. real profile
2. authentication
3. player persistence
4. game registry
5. asset registry
6. localization architecture
7. progress system
8. reward system
9. competency system
10. common game result interface

Do not begin advanced simulations yet.

---

# 87. PHASE 2 — CONTENT ARCHITECTURE

Migrate:

* 20 modules
* 200 lessons
* 50 games

into:

```text
district
→ competency
→ lesson
→ game
→ mission
→ mastery
```

Do not manually duplicate content.

---

# 88. PHASE 3 — CHARACTER + WORLD

Implement:

* Ollie
* Reema
* Filo
* Kami
* Rex
* NPC framework
* world map
* 8 districts
* character reactions
* dialogue engine

---

# 89. PHASE 4 — GAME + MASTERY

Implement:

* common game launcher
* game results
* mastery
* adaptive difficulty
* missions
* daily challenges
* weekly challenges
* achievements

Then audit every existing game.

**Every game must work.**

---

# 90. PHASE 5 — BUSINESS SIMULATION

Implement:

* persistent business
* products
* customers
* inventory
* pricing
* revenue
* expenses
* reputation
* business events
* side hustles

---

# 91. PHASE 6 — LIVING WORLD

Implement:

* NPC states
* NPC quests
* relationships
* character emotions
* Rex competition
* consequence engine
* world events

---

# 92. PHASE 7 — ADVANCED SYSTEMS

Implement:

* HQ 2.0
* skill tree
* Kami's Experiment Lab
* avatar progression
* collectibles
* Knowledge Vault
* capstone business

---

# 93. PHASE 8 — PARENT + TEACHER

Implement:

* parent dashboard
* learning moments
* teacher dashboard
* mission builder
* classroom progress
* school features

---

# 94. PHASE 9 — POLISH

Perform:

* UX audit
* visual audit
* animation pass
* audio pass
* Arabic QA
* English QA
* accessibility audit
* performance testing
* security audit
* game regression testing

---

# 95. PHASE 10 — LAUNCH READINESS

Verify:

### Authentication

* registration
* login
* logout
* persistence
* recovery

### Profile

* real data
* avatar
* progress
* settings

### Games

* all games launch
* all games finish
* rewards work
* progress saves

### Content

* lessons load
* Arabic loads
* English loads
* correct RTL

### Business

* state persists
* calculations work
* consequences work

### Characters

* assets load
* dialogue works
* reactions work

### World

* districts unlock correctly
* missions work
* progression works

---

# 96. QA MATRIX

Every feature must be tested in:

| Environment                                     | Required |
| ----------------------------------------------- | -------- |
| Mobile                                          | Yes      |
| Desktop Web                                     | Yes      |
| English                                         | Yes      |
| Arabic                                          | Yes      |
| Junior                                          | Yes      |
| Explorer                                        | Yes      |
| New Account                                     | Yes      |
| Returning Account                               | Yes      |
| Offline/intermittent connection where supported | Yes      |

---

# 97. ACCEPTANCE CRITERIA

The rebuild is not complete until:

### Architecture

* no unnecessary duplicate systems
* stable data model
* reusable game framework
* centralized assets
* centralized localization

### Gameplay

* player always knows what to do next
* actions have consequences
* progression is persistent
* games connect to learning

### Education

* every game maps to competencies
* mastery is measurable
* difficulty adapts
* Junior/Explorer content differs appropriately

### Characters

* four heroes are consistently represented
* Rex is a rival
* NPCs are supporting characters
* character reactions reflect player actions

### Business

* player business persists
* financial calculations are correct
* business choices have consequences

### Localization

* English works
* Arabic works
* RTL works
* no clipped text
* no hardcoded strings

### Reliability

* no generic game errors
* no fake profile data
* no broken progression
* no lost rewards
* no lost player data

---

# 98. WHAT NOT TO DO

The implementation agent must NOT:

❌ rebuild the whole application blindly

❌ delete existing working games

❌ create a separate database for every feature

❌ create separate progression systems for every game

❌ hardcode character images

❌ hardcode translations

❌ hardcode game definitions

❌ create another main mascot

❌ turn every lesson into a quiz

❌ make advanced business terminology mandatory for young children

❌ make crypto central to the product

❌ create fake profile data

❌ create fake progress

❌ use raw errors in the UI

❌ implement all advanced features before stabilizing the foundation

❌ create multiple conflicting navigation systems

❌ make every feature dependent on monetization

---

# 99. DESIGN LANGUAGE

ProfitsPatrol should feel:

* playful
* premium
* colorful
* polished
* energetic
* friendly
* intelligent
* modern
* game-like

But not:

* babyish
* cluttered
* childish in a cheap way
* corporate
* overly educational
* visually noisy

---

# 100. CHARACTER ART DIRECTION

All characters should share one visual universe:

**2D flat / cut-out cartoon**

Characteristics:

* polished thick outlines
* expressive faces
* large readable eyes
* simple silhouettes
* strong color identity
* production-ready poses
* child-safe
* consistent proportions

Avoid:

* photorealism
* anime
* horror
* hyper-realistic 3D
* inconsistent art styles

---

# 101. CHARACTER ASSET SYSTEM

Each character should have:

```text
character_id
default
happy
sad
thinking
excited
worried
surprised
celebrating
talking
pointing
working
```

Assets must be replaceable without code changes.

---

# 102. BUSINESS DASHBOARD

The player should see:

```text
💰 Cash
📈 Revenue
💸 Expenses
⭐ Reputation
👥 Customers
📦 Inventory
🚀 Business Level
```

But translate complex financial metrics into age-appropriate language.

---

# 103. CHILD-FRIENDLY ECONOMICS

Instead of:

> "Gross margin decreased 4.2%."

Junior:

> "You earned less from each sale."

Explorer can optionally see:

> Revenue − Cost = Profit

Then eventually:

> Profit Margin = Profit ÷ Revenue

---

# 104. REWARD ECONOMY

Rewards:

* XP
* coins
* badges
* cosmetics
* HQ items
* character relationship progress
* business upgrades
* district unlocks

Rewards should reinforce learning.

---

# 105. NO PAY-TO-WIN EDUCATION

Purchasing something should never allow a player to bypass essential learning.

For example:

❌ Buy 500 coins → skip budgeting

Better:

✅ Complete budgeting challenge → unlock financial upgrade.

---

# 106. DAILY PLAYER EXPERIENCE

A typical session should look like:

```text
LOGIN
 ↓
Ollie welcomes player
 ↓
Current mission
 ↓
Travel to district
 ↓
Short story
 ↓
Decision
 ↓
Mini-game
 ↓
Result
 ↓
Character reaction
 ↓
Reward
 ↓
Business update
 ↓
Next mission
```

Target short sessions while allowing deeper play.

---

# 107. LONG-TERM PLAYER JOURNEY

```text
NEW PLAYER
   ↓
Learn Money
   ↓
Start First Side Hustle
   ↓
Build First Business
   ↓
Meet Heroes
   ↓
Meet Rex
   ↓
Unlock Districts
   ↓
Improve Skills
   ↓
Manage Business
   ↓
Experiment
   ↓
Compete
   ↓
Scale
   ↓
Build Final Business
   ↓
CAPSTONE
```

---

# 108. FINAL PRODUCT STRUCTURE

The finished product should essentially become:

```text
                    PROFITSPATROL
                         │
       ┌─────────────────┼─────────────────┐
       │                 │                 │
      WORLD            GAMES            BUSINESS
       │                 │                 │
   8 DISTRICTS      50+ GAMES        PLAYER COMPANY
       │                 │                 │
    MISSIONS         MASTERY          ECONOMY
       │                 │                 │
      NPCs          COMPETENCIES      CUSTOMERS
       │                 │                 │
 CHARACTERS        ADAPTIVE          PRODUCTS
       │             LEARNING             │
       └─────────────────┼─────────────────┘
                         │
                    PLAYER JOURNEY
                         │
            ┌────────────┼────────────┐
            │            │            │
           HQ       EXPERIMENT      AVATAR
            │           LAB            │
            │            │             │
        SKILLS       CREATION      CUSTOMIZATION
            │            │             │
            └────────────┼─────────────┘
                         │
                    CAPSTONE BUSINESS
```

---

# 109. IMPLEMENTATION STATUS FILE

The coding agent must maintain:

`IMPLEMENTATION_STATUS.md`

Format:

```text
FEATURE                         STATUS
------------------------------------------------
Authentication                 ✅
Real Profile                   ✅
Game Registry                  ✅
Asset Registry                 🟡
Competency System              🟡
World Map                      ❌
Ollie                          ✅
Reema                          ❌
Filo                           ❌
Kami                           ❌
Rex                            ❌
NPC Framework                  ❌
Relationship System            ❌
Business Simulation            ❌
Mission Engine                 ❌
Adaptive Learning              ❌
HQ 2.0                         ❌
Experiment Lab                 ❌
Parent Dashboard               🟡
Teacher Dashboard              ❌
Arabic RTL                     🟡
```

Use:

```text
❌ NOT STARTED
🟡 PARTIAL
🔴 BROKEN
🔵 IN PROGRESS
🟢 COMPLETE
```

---

# 110. CHANGELOG

Maintain:

`CHANGELOG.md`

Every implementation session must record:

```text
Date
Feature
Files changed
Database changes
Migration performed
Tests performed
Known issues
Next task
```

---

# 111. AI CODER MASTER INSTRUCTION

Use the following as the **system/master prompt** when giving this PRD to Google AI Studio, Claude Code, Cursor, Codex, or another coding agent:

> **You are the lead engineer responsible for implementing ProfitsPatrol 2.0 according to this Master PRD.**
>
> First inspect and understand the existing application.
>
> Do not immediately rewrite the application.
>
> Audit the existing architecture, database, authentication, routes, components, games, content, assets, localization, player profile, progress system and backend.
>
> Identify:
>
> * existing working systems
> * partial systems
> * broken systems
> * missing systems
> * duplicate systems
> * obsolete systems
>
> Create and maintain `IMPLEMENTATION_STATUS.md`.
>
> Preserve working functionality whenever possible.
>
> Reuse existing architecture when it is suitable.
>
> Refactor only when necessary to support this specification.
>
> Do not create duplicate databases, duplicate progression systems, duplicate game launchers, duplicate localization systems or duplicate asset systems.
>
> Implement the product incrementally according to the phases in this PRD.
>
> **Do not jump directly to advanced features.**
>
> Complete and test each foundation layer before building dependent systems.
>
> All player progress must persist.
>
> Player profile information must be real, not dummy data.
>
> Games must use a centralized registry.
>
> Assets must use an asset registry.
>
> Translations must use localization keys.
>
> Characters must be data-driven.
>
> Missions must be data-driven.
>
> Competencies and mastery must be data-driven.
>
> The four permanent heroes are Ollie, Reema, Filo and Kami.
>
> Rex is the recurring rival.
>
> Do not create additional main mascots.
>
> NPCs are supporting characters.
>
> The existing 20 modules, 200 lessons and 50 games are valuable content assets and must be migrated/mapped rather than casually deleted. 
>
> The eight districts are the primary world structure.
>
> The final experience must connect lessons, games, missions, competencies, characters, business progression and consequences.
>
> Never expose raw technical errors to users.
>
> Never allow client-side manipulation of critical rewards or progression.
>
> Test English and Arabic.
>
> Test LTR and RTL.
>
> Test Junior and Explorer.
>
> Test mobile and desktop.
>
> After each completed implementation phase:
>
> 1. run tests
> 2. fix regressions
> 3. update `IMPLEMENTATION_STATUS.md`
> 4. update `CHANGELOG.md`
> 5. document remaining issues
> 6. only then proceed
>
> **Do not claim a feature is complete unless it is implemented, connected to the actual application, persisted where required, and tested.**

---

# 112. FINAL DEFINITION OF DONE

ProfitsPatrol 2.0 is complete when it is no longer merely:

> **"an app containing financial lessons and games."**

It should function as:

> **A persistent educational adventure where a child has a real profile, enters a living world, learns from Ollie/Reema/Filo/Kami, meets NPCs, competes with Rex, completes missions, plays meaningful games, develops competencies, builds and manages a business, experiences consequences, improves through mistakes, upgrades their HQ/avatar, and eventually completes a full entrepreneurial capstone.**

The existing breadth remains valuable—the catalog's **20 modules, 200 lessons, 50 games, eight districts, side hustles, properties, HQ, avatar system and library** are not being discarded.   

The major transformation is:

```text
OLD PROFITSPATROL

Content
+ Games
+ Lessons
+ Avatar
+ HQ
+ Library
+ Business

        ↓↓↓

PROFITSPATROL 2.0

              LIVING WORLD
                   │
        ┌──────────┼──────────┐
        ↓          ↓          ↓
     LEARN       PLAY       BUILD
        │          │          │
        └──────────┼──────────┘
                   ↓
             MAKE DECISIONS
                   ↓
              CONSEQUENCES
                   ↓
               MASTERY
                   ↓
              PROGRESSION
                   ↓
              BUSINESS
                   ↓
              CAPSTONE
```

**This single document should now be treated as the master specification.** The previous PRDs become historical/reference documents rather than separate implementation instructions.

---

# 12. IMPLEMENTATION & REBUILD PROGRESS

### Current Status (as of 2026-10-04): 🟢 Core Rebuild Complete & Verified

| System Area | PRD Target | Status | Implementation Details |
|---|---|:---:|---|
| **Living Learning Path** | Sections 8–18 | 🟢 COMPLETE | Full 20-module, 200-lesson vertical path (10 counted lessons + 1 Boss fight platform per module), widened wave offsets (`WAVE_OFFSETS = [0, 48, 64, 48, 0, -48, -64, -48]`), zero-overlap safe-slot character placement, and pure Arabic RTL translations for all 200 lessons. |
| **Boss Encounters** | Sections 15, 23 | 🟢 COMPLETE | Dynamic boss platform nodes, `PreBossModal`, `BossFightShell`, and `BossResultModal` integrated via thin adapters consuming canonical scenario rules. |
| **Character & NPC Sprites** | Section 57 | 🟢 COMPLETE | Dedicated isolated character crops (`/images/characters_clean/`), micro-animations (Ollie breathe, Reema sway, Filo bob, Kami hop, Rex twitch) with `prefers-reduced-motion` compliance, and single-active speech coordinator. |
| **Daily Rewards & News** | Sections 20, 24 | 🟢 COMPLETE | 🎡 `DailySpinWheel` with idempotent rewards and `spinReady` visual pulse indicator in TopBar and PlayHubFAB; `NewsTicker` with dynamic economic/weather headlines and click-to-open `BizPulseNewsFeed`. |
| **Living World & Heroes** | Sections 30–42 | 🟢 COMPLETE | 4 core heroes (Ollie, Reema, Filo, Kami) + Rival Rex, 5-tier trust engine, 25 passive perks, 15 narrative quests, and Living World schedules (morning/afternoon/night). |
| **Persistent Business & Capstone** | Sections 45–56 | 🟢 COMPLETE | Daily simulation with price/inventory/quality/marketing levers, consequence engine, "Why?" modal, and 7-step guided entrepreneurial capstone. |
| **Verification & Stability** | Section 109 | 🟢 COMPLETE | **59/59 test suites passing (406/406 Vitest tests green)**, 0 regressions, all IDE TypeScript errors resolved. |
