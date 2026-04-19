# Product Requirements Document (PRD) - Profits Patrol

## 1. Product Overview

**Profits Patrol** is a gamified financial literacy and entrepreneurship platform for children (ages 7-14). It combines "Tycoon-style" business simulations with RPG progression and structured curriculum to make learning about money fun, engaging, and practical.

**Mission**: To empower the next generation with the skills to build, manage, and understand business.

**"The Vibe"**: Juicy, Mobile-Game First, Educational but not "School-like".

- **Visuals**: Bright colors (Yellow/Green/Blue), rounded UI, confetti rewards, smooth animations.
- **Tone**: Encouraging, energetic, and safe.

---

## 2. Target Audience

| Persona | Description | Key Needs |
| :--- | :--- | :--- |
| **The Kid (Player)** | Ages 7-14. Wants to have fun, earn "money" (BizCoins), customize avatars, and feel powerful. | Fun games, progression rewards, customization, social status (Leaderboards). |
| **The Parent** | Wants their child to learn useful skills safely. | Safety (COPPA), progress monitoring, educational value validation. |
| **The Teacher** | Uses app in classroom. Needs management tools. | Roster management, assignment tracking, grading, curriculum alignment. |
| **The Admin** | Platform owner. | User management, content updates (CMS), analytics. |

---

## 3. Core Pillars

### A. Business Simulations (The "Doing")

Interactive mini-games where simulations teach economic concepts.

- **Lemonade Stand**: Supply/Demand, Inventory Management, Weather effects.
- **Pizza Delivery**: Logistics, Customer Satisfaction, Speed.
- **The Tank**: Pitching, Negotiation, Valuation (AI-powered).
- **Universal Game Engine**: Configurable engine for generic Clicker/Tycoon games.

### B. RPG Progression (The "Hook")

Mechanics to retain user engagement.

- **Economy**: `BizCoins` (Soft Currency) earned via lessons/games.
- **Avatar System**: Buy clothes/accessories (Hats, Suits) to customize appearance.
- **Headquarters (HQ)**: Upgradeable office space with visual builder (Furniture, Decor).
  - **Expanded Catalog**: 87 furniture items across 8 categories (Bedroom, Bathroom, Kitchen, Entertainment, Office, Pets, Tech, Food & Drinks).
  - **Furniture Reallocation**: Drag-and-drop system to move furniture between rooms or return items to inventory.
  - **Full Localization**: All furniture items and room names translated to Arabic.
- **Skill Tree**: RPG-style skills (Charisma, Efficiency, Wisdom) that buffer game stats.

### C. Education (The "Learning")

Structured content delivery.

- **Universal Lesson Engine**: Slide-based learning (Intro -> Info -> Quiz -> Reward).
- **Debate Dojo**: AI-powered debate arena to test Ethics & Logic skills.
- **Curriculum**: Modules covering Savings, Investing, Marketing, Ethics.
- **Library**: 100 summarized business books (e.g., "Rich Dad Poor Dad" for kids).

---

## 4. Functional Requirements

### 4.1 Authentication & User Management

- **Multi-Method Auth**: Support for Username/Password and **Email** login.
- **Social Login**: Google Sign-In integration.
- **Multi-Role**: Login/Register for Kid, Parent, Teacher, Admin.
- **Parental Gate**: Math challenge for Child registration (Randomized for security).
- **Invite Code**: Kids can link to parent account via unique 6-digit code during registration.
- **Consent & Legal**: Mandatory Privacy Policy agreement. Dedicated pages for Privacy Policy, Terms of Service, and Refund Policy accessible from the public footer.
- **Security**:
  - Strong password enforcement (Min 8 chars, alphanumeric).
  - **Hashing**: Client-side SHA-256 hashing (application layer) + Supabase Argon2 hashing (infrastructure layer).
  - **Provisioning**: Users must be created via **Supabase Auth API** (not manual SQL) to ensure valid identity linking and password hashes.
- **Validation**: Unique Email and Username checks.
- **Session**: Persistent login with secure ID generation (UUID).

### 4.2 Security & Compliance (Refined Jan 2026)

- **Data Authority**: Pricing authority moved to backend/Stripe IDs. Client-side values are read-only display.
- **Input Hygiene**: Strict validation for all User Generated Content (File Uploads < 5MB, Text Sanitization).
- **Architecture**: Separation of concerns (Auth vs Game Logic) to reduce attack surface.
- **Observability**: Redacted Logging for PII protection.
- **AI Security**: Rate limiting, prompt injection protection, and content moderation. (Refined Jan 2026)
- **State Integrity**: Concurrency locks on critical actions (e.g. Submissions) to prevent race conditions.
- **Data Protection**: Automatic stripping of sensitive fields during data export.
- **COPPA/GDPR Compliance**:
  - **Parental Gate**: Time-based expiry (1h) and attempt limiting (3 tries).
  - **Right to Access**: Structured Data Export (JSON/CSV).
  - **Right to Erasure**: 30-day grace period with audit trail.

### 4.2 Game Center & Venture

- **Purpose**: Fun reinforcement of business concepts.

- **Key Games**:
  - **Side Hustle Central**: Mobile-style "Gig App" with **20+ mini-games** (Dog Walking, Drone Pilot, Streaming) featuring:
    - **Varied Mechanics**: Tap, Swipe, Rhythm, and Quiz minigames.
    - **Exit Feature**: Ability to quit active gigs mid-progress.
    - **Balanced Economy**: High-reward tiers for advanced levels.
  - **The Tank**: Voice-enabled AI Pitching Simulator with 5 diverse judges and negotiation mechanics.
  - **Tycoon Builder**: Idle clicker game (Cookie Clicker style).
  - **Pizza Dash**: Time management cooking game.
  - **Stock Market Simulator**: Buy/Sell logic with basic market events.
  - **Brand Designer**: Custom logo creator with icon library and color tools.

- **Pricing Specialist**: Interactive Supply & Demand graph simulator.
- **Audience Matcher**: Drag-and-drop marketing segmentation game.
- **Debate Dojo**: Argumentation arena with AI scoring (Ethics/Logic).
- **Ollie Chat**: AI assistant for help and "Co-founder" advice (Powered by Universal AI Gateway).

### 4.3 Education (Learn)

- **Video Library**: Curated collection of external educational videos (YouTube embeds) managed via CMS.

- **Boss Battles**: "Turnaround Scenarios" at the end of modules where students must save a failing business.
- **Curriculum**: Interactive lessons with 'Universal Lesson Engine'.
- **Debate Dojo**: AI-powered debate arena to test Ethics & Logic skills.
- **Library**: 100 summarized business books (e.g., "Rich Dad Poor Dad" for kids) with **Age-Adapted Content** (Child/Teen modes) and **5 AI-Generated Tasks** per book (Quiz, Reflection, Action, Share, Apply).

### 4.3 Branding & UI

- **Visual Identity**: "Profits Patrol" branding with custom logo assets (`logo_text.png`).

- **Mascot**: "Ollie the Owl" (AI Guide) integrated into Map and Chat (`ollie_wave.png`, `ollie_head.png`).
- **Localization**: Full support for English and Arabic (RTL).
- **Favicon**: Multi-format favicon support (PNG, SVG, ICO) with Apple Touch Icons and PWA manifest for professional branding across all platforms. (Implemented Jan 2026)

### 4.4 Classroom Features (Schools)

- **Subscription Tiers**:
  - **Teacher Solo (Free)**: Basic dashboard restricted to 1 class and max 35 students.
  - **Teacher Pro / School Tiers**: Unlocks unlimited capacity and Advanced Gradebook exports.
- **Roster**: Add/Remove students via Class Code (enforces capacity limits).
- **Assignments**: Create/Grade tasks.
- **Rubrics**: Standardized grading criteria.
- **Content Control & "School Hours"**: Teachers can lock specific modules, or enable "School Hours Only" which locks out Arcade/Social features from 8 AM to 3 PM to ensure classroom focus.
- **Admin Grading Control**:
  - **Project Panel**: Rich grading interface for Admin/Teachers.
  - **Auto-Grade with Ollie**: AI-powered grading assistant (Score + Feedback + Rewards) using `gradeProjectWithOllie`.
  - **Scalable Prompts**: Centralized `project_prompts.ts` covering all modules.
  - **AI Services**: Centralized standard interface (`GeminiService`) for all AI features.

### 4.5 Family Features

- **Family Bounties**:
  - **Job Board**: Parents can assign real-world tasks (e.g., "Wash Car") with virtual rewards.
  - **Approval Workflow**: Parent must approve completion before BizCoins are released.
  - **Status Tracking**: Open, In Progress, Pending Approval, Completed.

### 4.6 Settings & Privacy (GDPR/CCPA/COPPA)

- **Data Export**: User can download their full data (JSON + CSV). (Implemented Jan 2026)
- **Right to Erasure**: Deep delete functionality with 30-day grace period. (Implemented Jan 2026)
- **Preferences**: Toggle Music/Sound, Dark Mode, Language (English/Arabic).

### 4.5 Localization

- **RTL Support**: Full layout mirroring for Arabic, including Navigation, Auth Buttons, and Curriculum grids (Verified Feb 2026).
- **Translations**: 100% key coverage via `i18next` for all UI elements, Games, and **Library Tasks** (Quizzes/Reflections).
- **Structure**: Strongly typed `ar.ts` and `en.ts` files with automated validation via `tsc`.
- **Translation Key Mapping System (Feb 2026)**:
  - **Type-Safe Mappings**: `translationMappings.ts` provides compile-time validated key mappings to prevent string concatenation issues.
  - **Dynamic Keys**: Centralized mappings for subscription tiers (`TIER_KEYS`), games (`GAME_KEYS`), and categories (`CATEGORY_KEYS`).
  - **Prevention**: Eliminates raw translation keys appearing in UI by enforcing proper i18next key resolution.
- **Language Management Tools (Feb 2026)**:
  - **Translation Checker**: `scripts/check-translations.js` validates completeness and reports missing keys across all languages.
  - **Template Generator**: `scripts/generate-language-template.js` auto-generates new language files with all keys pre-populated.
  - **Documentation**: `docs/ADDING_LANGUAGES.md` provides step-by-step guide for adding new languages in < 30 minutes.
  - **Scalability**: Infrastructure supports rapid addition of new languages (French, Spanish, German, etc.) with minimal effort.
  - **Age Adaptation (Feb 2026)**:
    - **Dynamic Content**: Content logic switches between `_child` (Simple) and `_teen` (Deep) suffixes based on user age.
    - **Fallback**: Automatically defaults to standard/teen content if specific child adaptation is missing.

### 4.6 Content Management System (CMS)

- **Lesson Editor**: Admin can create/edit lessons with JSON payloads and topic tagging for automatic sectioning.
- **Game Management**: Admin can add new games (JSON-based config) and update existing ones.
- **Library Management**: Admin can add books (Title, Author, Summary, Lessons) via a dedicated UI.
- **Documentation**: Detailed `guides.md` provided for content creators.

### 4.7 Real Estate Tycoon

- **Marketplace**: Buy/Sell Residential, Commercial, and Industrial properties.
- **Economics**: Properties generate daily passive income (Rent).
- **Progression**: Properties require specific user levels to unlock (e.g., Level 5 for Commercial).
- **Portfolio**: Visual tracking of owned assets and total property value.

---

## 5. Non-Functional Requirements

### 5.1 Security

- **Input Hygiene**: No `dangerouslySetInnerHTML`. (Verified)
- **State Protection**: User cannot modify own Role, BizCoins, or Grades via console. (Verified via Store Logic)
- **Validation**: Server-side (simulated) checks for lesson completion and grading. (Verified)
- **Input Validation**: Strict type/size checks on File Uploads and Sanitization on Text Inputs. (Verified)
- **Anti-Cheat**: "Time Travel" protection against clock manipulation for idle income. (Implemented)
- **Secrets**: All API keys and secrets managed via environment variables, not hardcoded. (Implemented)
- **Impersonation**: Admin impersonation capabilities restricted to Development or safe environments. (Implemented)
- **AuthZ**: "Defense in Depth" applied to Admin components. (Implemented)
- **Server-Side Security**: **Row Level Security (RLS)** enabled on all database tables to enforce strict data ownership. (Implemented Jan 2026)
- **Console Error Suppression**: Chrome extension errors automatically filtered to reduce development noise. (Implemented Jan 2026)
- **Content Security Policy**: Comprehensive CSP allowing legitimate external resources (fonts, media, CDN) while maintaining security. (Updated Jan 2026)
- **Security & Quality Infrastructure (Jan 28, 2026)**:
  - **Error Handling**: Custom error classes (`AppError`, `ValidationError`, etc.) with HTTP status codes and context data.
  - **PII Protection**: Enhanced Logger with automatic redaction of sensitive fields (passwords, tokens, emails).
  - **Rate Limiting**: Client-side rate limiter (10 req/min) for AI API abuse prevention.
  - **File Validation**: Magic byte checking to prevent file spoofing attacks (PNG, JPEG, PDF, ZIP).
  - **XSS Prevention**: DOMPurify-based text sanitization with email/URL validation and profanity filtering.
  - **Error Boundaries**: React ErrorBoundary component to prevent white screen crashes with graceful fallback UI.
  - **AI Security**: Prompt injection protection blocking jailbreaking attempts ("ignore instructions", "DAN mode", etc.).
  - **Form Validation**: Type-safe Zod schemas for authentication and project submission forms.
  - **Code Quality**: ESLint + Prettier with pre-commit hooks (Husky + lint-staged).
  - **Testing**: Vitest + Testing Library with 28 comprehensive security tests (RateLimiter, PromptSanitizer, TextSanitizer).
  - **Performance**: 58-67% bundle size reduction via code splitting, 50% fewer re-renders via memoization.
  - **Packages**: 394 new packages installed (ESLint: 111, Husky: 28, Testing: 252, Security: 3).
- **Phase 8.2: Security Monitoring (Jan 28, 2026) - Complete**:
  - **Real-Time Event Logging**: Automatic security event logging via Supabase Edge Functions for centralized monitoring.
  - **Prompt Injection Detection**: Integrated prompt sanitizer into Ollie Chat to detect and block malicious AI prompts in real-time.
  - **Admin Security Dashboard**: Built comprehensive security monitoring dashboard with event filtering, severity badges, and CSV export.
  - **Database Schema**: Created `security_events` table with indexed columns for efficient querying and RLS policies for admin-only access.
  - **Edge Function**: Deployed `log-security-event` function to Supabase production for serverless event logging.
  - **Async Logger**: Made `Logger.logSecurityEvent()` async to ensure events are logged before errors are thrown.
  - **Event Types**: Supports `prompt_injection`, `suspicious_activity`, `unauthorized_access`, and `data_breach` event types.
  - **Severity Levels**: Categorizes events as `critical`, `high`, `medium`, or `low` with color-coded UI badges.
  - **Auto-Refresh**: Dashboard auto-refreshes every 30 seconds to display latest security events without manual intervention.
- **Phase 8.4: Admin Moderation Dashboard (Jan 29, 2026) - Complete**:
  - **Content Moderation Dashboard**: Centralized view for managing all flagged content (Profanity, PII, etc.).
  - **February 2026/March 2026:**
    - Standardized Family Model, tying Parent tiers (`board_member`) securely to Child account capabilities.
    - Hardened Kid Premium Inheritance Logic to persist on refresh.
    - Implemented `AdminConfigSlice` to handle Dynamic State Management.
    - Built an internal Exclusives CRUD in `AdminBookManager.tsx` to handle "Exclusive Books".
    - Re-integrated missing entries (like `wonder`) into `moreBooks.ts` array.
    - Added missing `MOD_VC`, `MOD_CORP`, and `MOD_SUST` translation keys across all four locales (en, ar, fr, es) and fixed a syntax error in `ar.ts`.
  - **Enhanced Analytics**: Time-series charts (`recharts`) visualizing 30-day trends in violation severity and types.
  - **Whitelist/Blacklist Management**: Full CRUD interface for managing pattern-based rules (Keywords, Regex) stored in Supabase.
  - **Bulk Actions**: Tools to select multiple violations and perform bulk approval, rejection, or export (CSV).
  - **Backend Integration**: `ContentModerationService` updated to enforce whitelist/blacklist patterns with caching.
  - **UI Polish**: Added tooltips, "Select All" functionality, and responsive filters for better UX.

### 5.2 Performance

- **Load Time**: < 2s for Landing Page.
- **Code Splitting**: Lazy load heavy routes (Dashboards, Games).
- **Offline**: PWA support (Service Worker) for basic functionality without net.

### 5.3 Technical Constraints

- **Stack**: React, TypeScript, Vite, Zustand.
- **Architecture**: Feature-Based (Scalable Folder Structure).
- **AI Engine**: Universal Gateway (Gemini Cloud + Ollama Local).
- **Persistence**: **Hybrid (Cloud First)**: Supabase for auth users, LocalStorage for guests.

### 4.9 Advanced Gameplay & Grading (New)

- **Difficulty Levels**: "Rookie" (Easy), "Founder" (Normal), "Tycoon" (Hard).
  - **Impact**: Affects starting cash/burn in Boss Battles and grading strictness in Projects.
- **Fair Grading Engine**:
  - **Validation**: Rejects "dummy text" based on length and keyword density.
  - **Feedback**: AI generates specific, constructive feedback citing user's key points.
- **Dynamic Boss Battles**:
  - **Variety**: different scenarios per section (Pizza Panic, Tech Trouble, Fashion Fiasco).
  - **Flow**: Auto-launches battle upon passing the prerequisite project, with user-selectable difficulty (Easy/Medium/Hard).

### 4.10 Reports & Analytics (New)

- **Reports Dashboard**: Centralized hub for Admin/Teachers to view platform health.
- **Key Metrics**:
  - **User Growth**: Daily Active Users (DAU) and registration trends.
  - **Economy Health**: Total Money Supply (Inflation tracking) and Wealth Distribution (Gini coefficient proxy).
  - **Learning Insights**: Educational efficacy tracking (Quiz Scores vs. Time).
- **Export**: Full CSV/PDF export capability for external analysis.

### 4.11 Content Safety & Moderation (New)

- **Automated Moderation**: Real-time AI scanning of all user input (Chat, Names, Projects).
- **Rules Engine**:
  - **Profanity Filter**: Multi-level (Low/Medium/High) keyword blocking.
  - **PII Detection**: Regex-based blocking of Emails, Phones, Addresses using `ContentModerationService`.
  - **Topic Safety**: AI classification of Violence/Self-Harm/Adult content.
- **Admin Control**:
  - **Moderation Dashboard**: Review queue for flagged content with "Approve/Reject" actions.
  - **Lists**: Manage Whitelist (Allowed terms) and Blacklist (Banned patterns).

---

## 6. Year-Long Engagement & Upgrade Roadmap

> **Goal**: Keep kids engaged for 365 days and parents renewing the subscription.

### 6.1 Content Assessment Summary

| Category | First-Complete Time | Weekly Retention |
|---|---|---|
| 10-Module Curriculum (Season 1) | ~7 hrs / 5–6 wks | ✅ Anchored |
| Season 2 Curriculum (3 modules × 10 lessons) | +5 hrs | ✅ Added Q1 |
| Games & Simulators | ~8 hrs first-run | ⚠️ Fades after first-run |
| Book Library (100 books) | ~25 hrs (months) | ✅ Sustainable |
| Gig Central (26+ gigs, Levels 1–10) | Daily, ~10 min/day | ✅ Strong loop |
| HQ Builder (87 furniture items) | ~1 hr once | ⚠️ Needs new drops |

> **Core Problem**: A motivated kid finishes all lessons + games in ~6–8 weeks. After that, only Gig Central, Library, and Leaderboard retain them. The solution is a continuous content-refresh + habit-forming loop.

---

### 6.2 Q1 (Feb–Apr 2026): Fix the Foundation — ✅ COMPLETE

**Status**: Fully implemented as of Feb 25, 2026.

| Feature | Status | Implementation Notes |
|---|---|---|
| **Daily Mission Board** | ✅ Done | `dailyMissionSlice.ts` — 12-mission pool, 3 picked/day deterministically, auto-reset at midnight, persisted. UI: `DailyMissions.tsx` embedded in HQ. |
| **Weekly Challenge** | ✅ Done | `weeklyChallengeSlice.ts` — 5-challenge pool, rotates every Monday. UI: `WeeklyChallengeWidget.tsx` embedded in HQ. Progress tracked via lesson/gig actions. |
| **Streak System (visible + bonus)** | ✅ Done | Enhanced `checkStreak` in `gameSlice.ts`: 7-day milestone bonus (+300 XP +200 🪙), layered shield defence (item_freeze → streakShield → reset). UI: `StreakBanner.tsx`. |
| **Streak Shield (Tycoon perk)** | ✅ Done | `streakShield` field on `User` type. Activates automatically when a premium user would break their streak (once/day). Shield badge visible in `StreakBanner`. |
| **Season 2 Curriculum** | ✅ Done | 30 new lessons in `curriculum.ts`: ₿ Crypto & Blockchain (10), 🤖 AI & Future Jobs (10), ♻️ Sustainability Biz (10). Auto-appear on KidMap. |
| **Gig Central Tier 3** | ✅ Done | 6 new gigs in `sideHustleSlice.ts` (Levels 7–10): Space Delivery, AI Tutor, Climate Advisor, Podcast Producer, Digital Art, Web3 Dev. Level cap raised to 10. |

#### Q1 Implementation Guide (for reference)

```
1. Daily Mission Board
   - Types: src/types.ts (DailyMission, DailyMissionsState)
   - Slice:  src/store/slices/dailyMissionSlice.ts
   - Store:  src/store/index.ts (registered + persisted)
   - UI:     src/features/education/components/DailyMissions.tsx
   - Hooks:  educationSlice.completeLesson → trackMissionProgress('COMPLETE_LESSON')
             sideHustleSlice.completeSideHustle → trackMissionProgress('PLAY_GIG', 'EARN_COINS')

2. Weekly Challenge
   - Types: src/types.ts (WeeklyChallenge, WeeklyChallengeState)
   - Slice:  src/store/slices/weeklyChallengeSlice.ts
   - Store:  src/store/types.ts (AppState extends WeeklyChallengeSlice)
   - UI:     src/features/hq/components/WeeklyChallengeWidget.tsx
   - Hooks:  educationSlice → trackWeeklyChallengeProgress('LESSON_SPRINT')
             sideHustleSlice → trackWeeklyChallengeProgress('GIG_MARATHON', 'COIN_GRIND')

3. Streak System
   - Enhanced: src/store/slices/gameSlice.ts (checkStreak)
   - UI:        src/features/hq/components/StreakBanner.tsx
   - User type: streakShield, streakShieldUsedDate, streakLastBonusDate in src/types.ts

4. Season 2 Curriculum
   - Data: src/features/education/data/curriculum.ts
   - Modules: MOD_CRYPTO, MOD_AIJOB, MOD_SUST (season: 2 tag)
   - IDs: CRYPTO_101–110, AIJOB_111–120, SUST_121–130

5. Gig Central Tier 3
   - Data: src/store/slices/sideHustleSlice.ts (INITIAL_HUSTLES)
   - getGigLevel: max level raised from 5 to 10
```

---

### 6.3 Q2 (May–Jul 2026): Seasonal Events + Social Layer — ✅ COMPLETE

**Status**: Fully implemented as of Feb 25, 2026 (delivered ahead of schedule).

| Feature | Status | Implementation Notes |
|---|---|---|
| **Seasonal Events** | ✅ Done | `seasonalEventSlice.ts` — 4-event pool (Spring Market, Eid Challenge, Back to School, Summer Hustle), weekly rotation, mock leaderboard (top 10), join/claim/track actions. UI: `SeasonalEventBanner.tsx` embedded in HQ. |
| **Business Cards** | ✅ Done | `BusinessCard.tsx` — tier-themed gradient card (Intern/Founder/Board/Tycoon gradients), BizCoins, streak, top skill, level. Download to PNG via `html2canvas` with `window.print` fallback. |
| **HQ Showcase** | ✅ Done | `HQShowcase.tsx` — weekly Top 3 HQ gallery, 🥇🥈🥉 medals, expand-on-click featured items, your-HQ encouragement row. Seeded with mock weekly data. |
| **Co-op Pitch Mode** | ✅ Done | `CoopPitchMode.tsx` — 8-stage flow: Lobby (6-char code), Team Prep, Turn 1 (open), Turn 2 (close + handoff UI), Thinking, Offer Selection, Negotiation, Deal/Rejected. +15 co-op score bonus. Wrapped in `TheTankPage.tsx` tab switcher. |
| **Franchise Mode** | 🔲 Deferred | Moved to Q3 roadmap |

#### Q2 Implementation Guide

```
1. Seasonal Events
   - Types:  src/types.ts (SeasonalEvent, SeasonalEventType, SeasonalEventState, SeasonalEventEntry)
   - Slice:  src/store/slices/seasonalEventSlice.ts
   - Store:  src/store/index.ts (registered + persisted) + src/store/types.ts (AppState extends SeasonalEventSlice)
   - UI:     src/features/hq/components/SeasonalEventBanner.tsx (banner + collapsible leaderboard)
   - Hooks:  educationSlice.completeLesson → trackSeasonalProgress('LESSON_MARATHON', 'COIN_SPRINT')
             sideHustleSlice.completeSideHustle → trackSeasonalProgress('GIG_RUSH', 'COIN_SPRINT')
   - Events: LESSON_MARATHON | GIG_RUSH | STREAK_KEEPER | COIN_SPRINT

2. Business Cards
   - UI: src/features/hq/components/BusinessCard.tsx
   - Download: html2canvas (dynamic import) + window.print fallback
   - Fields: user.name, user.level, user.subscriptionTier, user.bizCoins, user.streak, user.unlockedSkills[0]
   - Tier gradients: intern=slate, founder=blue, board=violet, tycoon=amber

3. HQ Showcase
   - UI: src/features/hq/components/HQShowcase.tsx
   - Weekly label: Mon–Sun date range computed from current date
   - Data: 3 seeded mock entries (future: Supabase RPC `get_weekly_top_hqs`)
   - User nudge row: encourages decoration to be nominated

4. Co-op Pitch Mode
   - New: src/features/tank/components/CoopPitchMode.tsx (8 stages, lobby code, turn system, joint deal)
   - Wrapper: src/features/tank/components/TheTankPage.tsx (Solo/Co-op pill toggle tab)
   - Route: App.tsx /the-tank → TheTankPage (replaces direct TheTankMode)
   - Scoring: TheTankEngine.analyzePitch(pitch1 + pitch2) + 15 co-op bonus (capped at 100)
```

#### Q2 Progress Tracking Hook Architecture

```
Action                     →  Daily Mission Hook           →  Weekly Challenge Hook  →  Seasonal Hook
──────────────────────────────────────────────────────────────────────────────────────────────────────
completeLesson()           →  COMPLETE_LESSON, EARN_COINS  →  LESSON_SPRINT          →  LESSON_MARATHON / COIN_SPRINT
completeSideHustle()       →  PLAY_GIG, EARN_COINS         →  GIG_MARATHON           →  GIG_RUSH / COIN_SPRINT
```

#### Updated HQ Widget Layout (Kid View)

```
[Stats Grid: Coins | HQ Value | Inventory | Lessons]
[🎭 SeasonalEventBanner] ← themed gradient, days-remaining, join/rank/claim, expandable leaderboard
[🔥 StreakBanner]         ← animated flame, shield badge, 7-day bonus countdown
[⚡ DailyMissions]        ← 3 missions, 24h reset, claim rewards
[⚔️ WeeklyChallenge]     ← rotating weekly goal, days-remaining ribbon
[🏠 HQShowcase]           ← weekly top 3 HQs, expand-on-click, your-HQ encouragement
[🏗️ Dollhouse (Interactive)]
[🏗️ HQ Upgrade Path]
```

---

### 6.4 Q3 (Aug–Oct 2026): Advanced Content + School Integration — ✅ COMPLETE

**Status**: Fully implemented as of Feb 25, 2026 (delivered ahead of schedule).

| Feature | Status | Implementation Notes |
|---|---|---|
| **CEO Track (Season 3 Curriculum)** | ✅ Done | 30 new lessons in `curriculum.ts` (VC_131–140, CORP_141–150, GLOB_151–160). Gate: Level 8+. Season 3 flag in COURSE_MAP. |
| **School Tournaments** | ✅ Done | `tournamentSlice.ts` — Teacher creates tournament with 6-char code, 8 default questions (S3 content), mock peer AI entries, time-bonus scoring, full state machine (IDLE→LOBBY→ACTIVE→FINISHED). Route: `/tournaments`. |
| **Live Mentorship Sessions** | ✅ Done | `LiveNowWidget.tsx` rebuilt — gold gradient theme, speaker profile (name, emoji, bio, role), Zoom link gated to Tycoon subscribers. `LiveSession` type extended. |
| **AI Business Plan Generator** | ✅ Done | `BusinessPlanModal.tsx` — 5-step wizard (Name → Problem → Market → Revenue → Goal), Tycoon-gated card trigger in `Headquarters.tsx` with sparkle animation. |
| **Homework Mode** | ✅ Done | `Assignment` type extended (`isHomework`, `maxXP`, `homeworkDeadline`). `StudentAssignmentDashboard.tsx`: homework badge, overdue indicator, deadline shown in submit modal. |

#### Q3 Implementation Reference

```
1. CEO Track (Season 3)
   - Data:   src/features/education/data/curriculum.ts
   - Modules: MOD_VC (VC_131–140), MOD_CORP (CORP_141–150), MOD_GLOB (GLOB_151–160)
   - Gate:   season: 3, unlockLevel: 8 in COURSE_MAP
   - KidMap: Venture Capital (TrendingUp/yellow), Corporate Strategy (Building2/violet), Global Trade (Globe/teal)

2. School Tournaments
   - Slice:  src/store/slices/tournamentSlice.ts (TournamentSlice interface)
   - Types:  TournamentQuestion, TournamentEntry, TournamentStatus, Tournament
   - Tests:  src/store/slices/__tests__/tournamentSlice.test.ts (27 tests, 100% passing)
   - Route:  /tournaments in App.tsx sidebar

3. AI Business Plan Generator
   - Modal:  src/features/education/components/BusinessPlanModal.tsx
   - Trigger: Headquarters.tsx → showBusinessPlan state (isTycoon gated)

4. Live Mentorship Sessions
   - Widget: src/features/education/components/LiveNowWidget.tsx
   - Types:  types.ts (isMentorship, speakerName, speakerEmoji, speakerBio, speakerRole)

5. Homework Mode
   - Types:  src/types.ts (isHomework, maxXP, homeworkDeadline on Assignment)
   - UI:     src/features/education/components/StudentAssignmentDashboard.tsx
```

---

### 6.5 Q4 (Nov 2026–Jan 2027): Competitive Season + Year-End Graduation

**Goal**: Create an emotional peak — the graduation moment.

| Feature | Impact | Implementation Plan |
|---|---|---|
| **Annual CEO Championship** | 🔴 Critical (viral) | End-of-year pitch competition. Voice/video submission. Community voting. Winner gets physical trophy + 1-year renewal. |
| **Year-End Report Card** | 🔴 Critical (retention) | ✅ Done. Auto-generated PDF: Total XP, Lessons, Gigs, BizCoins, Top Skill, Rank using `jspdf` and `html2canvas`. |
| **Level 10 Graduation Ceremony** | 🟠 High | In-app animated sequence with Ollie + confetti + printable diploma. Unlocks "Alumni" HQ items. |
| **Referral Program** | 🔴 Critical (growth) | Kid gets 500 BizCoins per referred friend. Parent gets 1 month free per referred premium signup. |
| **Subscription Renewal Nudge** | 🔴 Critical (revenue) | 30 days before expiry: parent email with kid's progress stats. 20% early renewal discount. |

#### Q4 Implementation Guide

```
1. Year-End Report Card
   - New: src/features/profile/components/YearEndReport.tsx
   - Data: user.xp, completedLessonIds.length, user.streak peak, user.bizCoins
   - Export: jspdf → download or email via Supabase Edge Function

2. Graduation Ceremony
   - Trigger: checkStreak or completeLesson when user hits Level 10
   - New: GraduationModal.tsx with canvas-confetti + Ollie animation
   - Unlock: 'alumni_badge_gold' + 'alumni_desk_trophy' added to shop

3. Referral Program
   - Supabase: referral_codes table linked to user ID
   - New: ReferralPanel.tsx in Profile
   - Webhook: On new premium signup, credit referrer via Edge Function
```

---

### 6.6 Monthly Content Drop Schedule

| Month | Status | Drop |
|---|---|---|
| Month 1 (Feb 2026) | ✅ Done | Daily Missions + Streak System + Weekly Challenge |
| Month 2 (Mar 2026) | ✅ Done | Season 2 Curriculum (30 lessons) + Gig Tier 3 (6 new gigs) |
| Month 3 (Apr 2026) | ✅ Done | Seasonal Events (Spring Market Festival, 4-event pool) |
| Month 4 (May 2026) | ✅ Done | Business Cards + HQ Showcase |
| Month 5 (Jun 2026) | ✅ Done | Co-op Pitch Mode |
| Month 6 (Jul 2026) | ✅ Done | CEO Track (30 S3 lessons) + Tournaments + Business Plan + Homework + Live Mentorship |
| Month 7 (Aug 2026) | 🔲 Planned | **Daily Spin Wheel** + **Weekly CEO Challenge** |
| Month 8 (Sep 2026) | 🔲 Planned | **BizPulse News Feed** + **Year 2 Seasonal Events** |
| Month 9 (Oct 2026) | 🔲 Planned | **Seasons System** + **Global Leaderboard** |
| Month 10 (Nov 2026) | 🔲 Planned | **Corporations / Guilds** |
| Month 11 (Dec 2026) | 🔲 Planned | **Stock Market Simulation** |
| Month 12 (Jan 2027) | 🔲 Planned | **Real Estate Tycoon** + **Custom Ollie Outfits** |
| Month 13 (Feb 2027) | 🔲 Planned | **Monthly Parent Report Email** + **Prestige System** |

---

### 6.7 Subscription Stickiness Mechanics

| Mechanic | How it Works |
|---|---|
| **BizCoin Savings** | BizCoins only redeemable while subscribed. Balance at risk on cancellation. |
| **HQ Progress** | Premium furniture can't be rebought on cancel, but placed items stay visible (loss aversion). |
| **Streak Shield** | Premium subscribers get 1x "streak shield" per week. Losing it is a specific felt loss on cancel. |
| **Family Milestones** | Parent dashboard shows monthly lesson count — makes cancelling mid-journey feel wasteful. |
| **Anniversary Reward** | At 1-year mark: exclusive "Year 1 Founder" badge + 2,000 BizCoins. Incentivizes renewal date. |

---

### 6.8 North Star Metrics

| Metric | Target |
|---|---|
| **D7 Retention** | > 60% |
| **D30 Retention** | > 40% |
| **D365 Retention (annual renewal)** | > 30% |
| **DAU / MAU ratio** | > 0.25 |
| **Lessons completed per user/month** | > 8 |
| **Weekly Streak days (avg)** | > 3 |

---

## 7. Recent Changes (March 2026)

- **Administering Exclusive Books**: Implemented full CRUD functionality for "Exclusive Books" (e.g., *Wonder* and *Who Moved My Cheese?*) within the Admin Panel. Added a dedicated "Exclusives" sub-tab in the Library module, migrating from hardcoded lists to the dynamically managed `exclusiveBooks` state slice in `adminConfigSlice`.
- **Subscription & Family Model Fixes**: Resolved state synchronization bugs to ensure children instantly inherit `PREMIUM` access from parents upon login. Corrected success toast messages for the Tycoon (annual) plan and ensured parent subscription tiers persist across logouts.
- **Data Integrity**: Restored and corrected corrupted book metadata in `moreBooks.ts`.

---

## 7.1 Past Changes (February 2026)

- **Localization & Export (Feb 27, 2026)**:
  - **Year-End Report Card**: Implemented PDF generation using `html2canvas` and `jspdf` inside `YearEndReport.tsx`. Fixed `useCORS` for rendering the app logo natively inside the export.
  - **Full Translation**: Hardcoded strings across `CoopPitchMode`, `TheTankPage`, and `GigCentral` replaced with `react-i18next` bindings and mapped to `ar.ts` ensuring a 100% complete localization checklist.
- **Q3 Features (Feb 25, 2026)** — Full Q3 roadmap implemented (ahead of schedule):
  - **CEO Track (Season 3)**: 30 lessons (VC_131–140, CORP_141–150, GLOB_151–160). Gate: Level 8+.
  - **School Tournaments**: `tournamentSlice.ts` full state machine (IDLE→LOBBY→ACTIVE→FINISHED), time-bonus scoring, 6-char lobby code.
  - **Live Mentorship**: `LiveNowWidget.tsx` rebuilt with gold theme, speaker profiles, Tycoon-gated Zoom links.
  - **AI Business Plan Generator**: Tycoon-gated card in Headquarters, 5-step modal wizard.
  - **Homework Mode**: `Assignment` type extended, overdue badges + max XP display in `StudentAssignmentDashboard.tsx`.
  - **KidMap Content**: Season 2 + Season 3 topic icons, colors, and project code mappings added.
  - **Bug Fixes**: `PrincipalDashboard.tsx` TS error resolved; React hooks violation in `Headquarters.tsx` fixed (0 TS errors).
  - **Tests**: 48 new Vitest tests — `tournamentSlice.test.ts` (27 tests) and `curriculum.test.ts` (21 tests), all passing.
- **Q1 Engagement Features (Feb 25, 2026)** — Full Q1 roadmap implemented:
  - Daily Mission Board, Weekly Challenge, Streak Shield, Season 2 Curriculum, Gig Tier 3.
- **Q2 Social Layer (Feb 25, 2026)** — Delivered ahead of schedule:
  - Seasonal Events, Business Cards, HQ Showcase, Co-op Pitch Mode.
- **Core Polish & State Syncing (Feb 21, 2026)**: Child sub inheritance fixed; parent dashboard race condition resolved.
- **Database Security (Feb 18, 2026)**: Optimized RLS policies on `profiles` table.
- **Legal Pages (Feb 20, 2026)**: Privacy Policy, Terms of Service, Refund Policy pages added.
- **Pricing Optimization (Feb 20, 2026)**: Board Member → 3 kids; Tycoon → $89.99/yr.

---

## 8. Known Issues

- **Registration Hang**: Sign-up completes authentication but UI hangs at "Creating Account..." — likely a race condition in profile creation or RLS blocking profile read. Workaround: Refresh the page.
- **Auto-Login Persistence**: App auto-logs in as admin on refresh due to Zustand localStorage persistence without session validation. Workaround: Clear `kidcap-hq-storage` from browser LocalStorage.

---

## 8. Year 2 Retention Features (Functional Requirements)

> Full implementation plan with backend schemas: [implementation_plan.md](file:///C:/Users/ABDO/.gemini/antigravity/brain/2e708ec3-3c2a-40c1-9ef0-3375992ece59/implementation_plan.md)

### 8.1 Habit Loop Features

| Feature | Requirement | Backend |
|---|---|---|
| **Daily Spin Wheel** | 24h-locked spin with 8 prize tiers (BizCoins, XP, Items, Jackpot). Must require <5s to interact with. | `last_spin_date` on profiles. Edge Function validates cooldown & awards prize. |
| **Weekly CEO Challenge** | Monday-rotating themed challenge highlighting a specific gig with 2x XP. 7-day progress tracking. | `app_config` table. `pg_cron` job rotates each Monday. |
| **BizPulse News Feed** | 5 daily stories referencing fictional companies. Links to Stock Market prices. | `biz_pulse_stories` table, Admin CMS can inject new stories. |
| **Year 2 Seasonal Events** | 4 new events (Halloween, Winter, Summer, Spring IPO). Limited-edition HQ items as rewards. | Extends `seasonalEventSlice.ts`. New furniture items in `furniture.ts`. |

### 8.2 Social & Competition Features

| Feature | Requirement | Backend |
|---|---|---|
| **Seasons + Global Leaderboard** | 3-month seasons with global ranking by Season XP. Top 100 earn legacy badge. Season resets counters only. | `seasons` table. `season_leaderboard` view. `end-season` Edge Function via `pg_cron`. |
| **Corporations / Guilds** | Kids form/join corps (max 20 members) via 6-char code. Shared Corp XP bar, weekly collective goals, Corp HQ. | `corporations` + `corporation_members` Supabase tables. Full RLS policies. |

### 8.3 Empire Building Features

| Feature | Requirement | Backend |
|---|---|---|
| **Stock Market Simulation** | 5 fictional companies. Daily price update (±5-10%). Kids can buy/sell using BizCoins. Portfolio value tracked. | `stock_companies` + `stock_portfolio` tables. `update-stock-prices` Edge Function via `pg_cron` daily. |
| **Real Estate Tycoon** | 5 property tiers from Apartment to Mega-Resort. Passive 24h BizCoin income. Income decays if not maintained after 48h. | `real_estate_properties` + `owned_properties` tables. `collect-rent` Edge Function. |

### 8.4 Premium Value Features

| Feature | Requirement | Backend |
|---|---|---|
| **Custom Ollie Outfits** | 30 new Ollie outfit items across 6 categories. 4 rarity tiers. Seasonal exclusives. Share Avatar feature. | `ollie_outfit JSONB` on profiles. `unlock-avatar-item` Edge Function deducts BizCoins. |
| **Monthly Parent Report Email** | Auto-generated HTML email on 1st of each month to parent. Shows: XP, lessons, streak, skills, financial concepts learned. Opt-in toggle in Parent Dashboard. | `parent_report_log` table. `monthly-parent-report` Edge Function via `pg_cron`. Email via Resend.com. |

### 8.5 Year 2 North Star Metrics

| Metric | Year 1 Target | Year 2 Target |
|---|---|---|
| **D7 Retention** | > 60% | > 70% |
| **D30 Retention** | > 40% | > 55% |
| **D365 Renewal** | > 30% | > 45% |
| **DAU/MAU ratio** | > 0.25 | > 0.35 |
| **Corp membership rate** | N/A | > 40% of active kids |
| **Stock market daily logins** | N/A | > 50% of active kids |

## 9. Test Coverage

| Test File | Tests | Coverage |
|---|---|---|
| `RateLimiter.test.ts` | 6 | Rate limiting logic |
| `promptSanitizer.test.ts` | 10 | AI prompt injection |
| `sanitization.test.ts` | 12 | XSS / text sanitization |
| `socialSlice.test.ts` | 4 | Social friend state |
| `SecurityMonitoring.test.tsx` | — | Admin security events |
| `ContentModeration.test.tsx` | — | Moderation dashboard |
| `ReportsDashboard.test.tsx` | — | Analytics reports |
| `tournamentSlice.test.ts` | **27** | Full tournament state machine |
| `curriculum.test.ts` | **21** | Data integrity (160 lessons) |

**Total: 80+ tests passing. TypeScript: 0 errors.**

---

## 10. Content Translation System (March 2026)

### Overview

The app uses `react-i18next` for all localized content. Translation files live in `src/locales/` (`en.ts`, `ar.ts`, etc.). There are **three distinct layers** for translated content:

### Layer 1 � UI Strings
All button labels, nav items, and UI copy. Use `t('namespace.key')` in any component.

### Layer 2 � Bestseller Books (`library_books` namespace)
Books in `classicBooks.ts` use i18n for title, summary, and key lessons.
**Key pattern:** `library_books.{bookId_underscored}.{field}` (fields: `title`, `summary`, `lesson_0`�)

### Layer 3 � Exclusive Books (`exclusive_books` namespace) ? NEW (March 2026)

Books in `moreBooks.ts` previously rendered raw English markdown directly, bypassing i18n.
**Fix:** `BookLibrary.tsx` now calls `getExclusiveT(bookId, field)` which checks `exclusive_books.{bookId_underscored}.{field}` first, then falls back to English.

**Key pattern:** `exclusive_books.{bookId_underscored}.{field}`
**Fields:** `title`, `fullContent`, `keyLessons.0`, `keyLessons.1`, `keyLessons.2`
**ID rule:** Replace hyphens (`-`) with underscores (`_`).

---

### Exclusive Books Translated to Arabic (March 2026)

| Book | Key in ar.ts |
|---|---|
| The Little Engine That Could | the_little_engine_that_could |
| Kidpreneurs | kidpreneurs |
| Rich Dad Poor Dad for Teens | rich_dad_poor_dad_for_teens |
| The Boy Who Harnessed the Wind | the_boy_who_harnessed_the_wind |
| Charlie and the Chocolate Factory | charlie_chocolate_factory |
| The Alchemist | the_alchemist_pp |
| Wonder | wonder_rj_palacio |
| Shoe Dog (Young Readers Edition) | shoe_dog_young_reader |
| Oh, the Places You'll Go! | oh_the_places_youll_go |

---

### How to Add a New Exclusive Book Translation

1. Note the book's `id` in `moreBooks.ts` and normalise it (replace `-` with `_`).
2. Add its block under `exclusive_books` in `src/locales/ar.ts`:

`	s
your_book_id: {
  title: "??????? ????????",
  fullContent: `## ?? ????? ?????\n\n????? ???? ???...`,
  keyLessons: ["????? ?????.", "????? ??????.", "????? ??????."]
}
`

3. No code changes needed � `BookLibrary.tsx` auto-detects and uses the translation.
4. Repeat in other locale files (`fr.ts`, `es.ts`) for additional languages.
