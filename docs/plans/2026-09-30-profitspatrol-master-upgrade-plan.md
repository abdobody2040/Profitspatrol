# ProfitsPatrol 2.0 / 3.0 Master Upgrade Implementation Plan

> **For Claude / Agent:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform ProfitsPatrol into a unified, production-grade Kids Financial Literacy & Entrepreneurship RPG according to the 112-section Master PRD in `ultimate upgrades.md`, preserving working code and upgrading in structured phases.

**Architecture:** A layered architecture separating Core Foundations (Auth, Persistence, State, Registries) from Content & Progression (Districts, Competencies, Curriculum), Interactive Game Engines (Common Launcher, Result Interface), Living World (4 Heroes, Rival Rex, NPCs, Dialogue), and Business Simulation. Strict multi-mode support (Junior 6–9 vs Explorer 9–12) with full Arabic RTL and English LTR localization.

**Tech Stack:** React 18, TypeScript 5, Vite, Tailwind CSS, Framer Motion, Zustand (State Management), i18next (Dual-language RTL/LTR), Supabase (Auth, DB, RLS, Storage), Lucide Icons, Howler/Web Audio API.

---

## Master Directives & Non-Negotiables
1. **Never blindly rewrite from scratch.** Audit first, preserve working functionality, and upgrade iteratively.
2. **4 Core Heroes:** Ollie (Plan), Reema (Connect), Filo (Protect), Kami (Create).
3. **1 Rival:** Rex (Recurring competitive antagonist).
4. **8 Districts:** Money, Builders, Risk & Wealth, Operations, Innovation, Leadership, Strategy, Launch & Scale.
5. **Preserve Content:** Migrate and map existing 20 modules, 200 lessons, and 50 games.
6. **Dual Age Mode:** Junior (6–9) with visual, large touch targets, simplified mechanics; Explorer (9–12) with deeper simulations and realistic math.
7. **Tracking Artifacts:** Maintain `IMPLEMENTATION_STATUS.md` and `CHANGELOG.md` at every step.

---

## Phase 0: System Audit & Status Baseline

### Task 0.1: Comprehensive System Audit & Baseline Status Document
**Files:**
- Create: `IMPLEMENTATION_STATUS.md`
- Inspect: `src/store/index.ts`, `src/features/`, `src/lib/`, `supabase/migrations/`

**Step 1: Inspect current implementation status**
Audit authentication, real profile persistence, game registry, world map, existing lessons, locales, and audio services.

**Step 2: Generate `IMPLEMENTATION_STATUS.md`**
Record exact status indicators (🟢 COMPLETE, 🟡 PARTIAL, 🔴 BROKEN, 🔵 IN PROGRESS, ❌ NOT STARTED) for all core PRD systems.

**Step 3: Verification**
Verify that all 22 tracked subsystems in Section 109 of `ultimate upgrades.md` are accurately categorized.

---

## Phase 1: Foundation Layer (Core Engine & Registries)

### Task 1.1: Unified Player Profile & Real Data Persistence
**Files:**
- Modify: `src/types.ts`
- Modify: `src/store/index.ts`
- Modify: `src/services/persistence/`
- Test: `tests/store/playerProfile.test.ts`

**Step 1: Write test for profile persistence & validation**
Verify user profile loads real data, tracks real XP, level, P-Tokens, age mode, district unlocks, and streak.

**Step 2: Update store & persistence**
Ensure `useAppStore` guarantees non-dummy real data, validated against Supabase profiles table with offline local fallback.

**Step 3: Verify tests pass**
Run `npm run test` or `npx vitest run tests/store/playerProfile.test.ts`.

---

### Task 1.2: Centralized Game Registry & Common Game Result Interface
**Files:**
- Create: `src/features/games/registry/gameRegistry.ts`
- Create: `src/features/games/types/gameResult.ts`
- Modify: `src/features/games/`
- Test: `tests/games/gameRegistry.test.ts`

**Step 1: Define `CommonGameResult` interface**
```typescript
export interface CommonGameResult {
  gameId: string;
  score: number;
  maxScore: number;
  durationSeconds: number;
  competencyDeltas: Record<string, number>;
  rewards: { xp: number; ppTokens: number; badgeId?: string };
  completed: boolean;
  consequences?: Array<{ target: string; change: number; message: string }>;
}
```

**Step 2: Build `gameRegistry`**
Register all existing games with metadata (id, title, ageSuitability, targetCompetency, districtId, launchComponent).

**Step 3: Run registry validation test**
Ensure every registered game resolves to a loadable component and standard result schema.

---

### Task 1.3: Centralized Asset Registry & Character Manifest
**Files:**
- Create: `src/lib/assets/assetRegistry.ts`
- Test: `tests/assets/assetRegistry.test.ts`

**Step 1: Write test for asset path resolution**
Verify fallback resolution for missing assets (Ollie, Reema, Filo, Kami, Rex, District maps).

**Step 2: Implement `AssetRegistry`**
Provide type-safe image and audio asset resolution with webp/png fallback handling.

---

## Phase 2: Content Architecture (Districts & Competencies)

### Task 2.1: District & Competency Data Model Mapping
**Files:**
- Create: `src/domain/curriculum/competencyModel.ts`
- Create: `src/domain/world/districts.ts`
- Modify: `src/features/education/data/curriculum.ts`
- Test: `tests/curriculum/curriculumMapping.test.ts`

**Step 1: Map 8 Districts to Competencies**
1. Money District (Cash, Banking, Currency, Saving)
2. Builders District (Production, Cost, Quality, Craft)
3. Risk & Wealth District (Investing, Compounding, Safety)
4. Operations District (Supply Chain, Efficiency, Logistics)
5. Innovation District (Experimentation, Products, Tech)
6. Leadership District (Teamwork, Negotiation, Ethics)
7. Strategy District (Market Analysis, Competition, Moats)
8. Launch & Scale District (Scaling, Capstone, Exit)

**Step 2: Map 20 Modules & 200 Lessons**
Ensure every existing lesson belongs to a District and tags primary/secondary competencies.

---

## Phase 3: Character & World System

### Task 3.1: The 4 Heroes + Rex Antagonist Engine
**Files:**
- Create: `src/features/characters/data/heroes.ts`
- Create: `src/features/characters/data/rivalRex.ts`
- Create: `src/features/characters/components/CharacterDialogueModal.tsx`
- Modify: `src/features/hq/components/AdventureMap.tsx`

**Step 1: Define Hero & Rival personas, emotion states, and dialogue banks**
- **Ollie:** Analytical, wise, calm (Focus: Planning & Saving).
- **Reema:** Energetic, social, persuasive (Focus: Sales & Community).
- **Filo:** Protective, alert, pragmatic (Focus: Risk Management & Law).
- **Kami:** Creative, quirky, inventive (Focus: Product Innovation & R&D).
- **Rex:** Ambitious, impatient, cut-throat (The Rival who challenges the player).

**Step 2: Integrate Hero commentary into World Map & Lesson encounters**

---

### Task 3.2: 8-District Interactive World Map
**Files:**
- Create: `src/features/world/components/WorldDistrictSelector.tsx`
- Modify: `src/features/hq/components/AdventureMap.tsx`
- Modify: `src/pages/KidMap.tsx`

**Step 1: Build District Navigation & Unlock progression**
District 1 is unlocked by default; Districts 2–8 unlock upon achieving required Competency Mastery and Capstone challenges.

**Step 2: Dual Mode Styling**
Render tactile colorful tracks in Junior Mode, and detailed isometric city grids in Explorer Mode.

---

## Phase 4: Unified Game Launcher & Mastery Engine

### Task 4.1: Universal Game Launcher Component
**Files:**
- Create: `src/features/games/components/UniversalGameLauncher.tsx`
- Modify: `src/features/games/`
- Test: `tests/games/gameLauncher.test.tsx`

**Step 1: Build wrapper modal for games**
Handles countdown, pause, audio volume, language injection, exit confirmation, and result dispatching.

**Step 2: Wire `CommonGameResult` to Player Store**
On completion, dynamically award XP, P-Tokens, update Competency Mastery, and trigger NPC reactions.

---

### Task 4.2: Adaptive Difficulty & Mastery Level Calculation
**Files:**
- Create: `src/domain/mastery/masteryCalculator.ts`
- Modify: `src/store/slices/educationSlice.ts`
- Test: `tests/mastery/mastery.test.ts`

**Step 1: Implement Mastery Formula (Beginner -> Apprentice -> Practitioner -> Master)**
Tracks performance across quizzes, games, and consequence choices to dynamically adjust challenge difficulty.

---

## Phase 5: Persistent Business Simulation & Economy

### Task 5.1: Persistent Business Model & State Store
**Files:**
- Create: `src/features/business/types/business.ts`
- Create: `src/features/business/store/businessStore.ts`
- Create: `src/features/business/components/BusinessDashboard.tsx`
- Test: `tests/business/businessSimulation.test.ts`

**Step 1: Implement Core Business Loop**
Inventory purchase -> Pricing setup -> Daily customer simulation -> Revenue vs Cost calculation -> Net Profit & Reputation calculation.

**Step 2: Dual-Mode Business Types**
- Junior: Lemonade Stand, Handmade Crafts, Pet Care.
- Explorer: E-commerce Store, Game Studio, Tech Repair, Eco-Consulting.

---

### Task 5.2: Consequence Engine & "Why?" Explainer
**Files:**
- Create: `src/features/business/engine/consequenceEngine.ts`
- Create: `src/features/business/components/WhyExplanationModal.tsx`

**Step 1: Implement event-driven business consequences**
Bad quality -> loss of reputation; predatory pricing -> loss of customers; excessive saving -> missed opportunity.
Every failure triggers Ollie or Kami with a constructive "Why?" learning breakdown.

---

## Phase 6: Living World & Rex Competition

### Task 6.1: Rex Rivalry Events & Weekly Showdown
**Files:**
- Create: `src/features/rivalry/engine/rexCompetition.ts`
- Create: `src/features/rivalry/components/RexShowdownModal.tsx`

**Step 1: Weekly Competitions with Rex**
Compare weekly sales, customer satisfaction, or quiz mastery against Rex's AI-simulated empire.

---

## Phase 7: Advanced Systems & HQ 2.0

### Task 7.1: HQ 2.0 & Interactive Skill Tree
**Files:**
- Create: `src/features/hq2/components/SkillTreeView.tsx`
- Create: `src/features/hq2/components/KamiExperimentLab.tsx`
- Modify: `src/pages/KidHQ.tsx`

**Step 1: Build branching skill tree**
Unlock perks (e.g., "Bulk Supplier Discount", "Viral Marketing Boost", "Speedy Delivery").

---

## Phase 8: Parent & Teacher Ecosystem

### Task 8.1: Parent Dashboard 2.0 & Real-Time Learning Moments
**Files:**
- Modify: `src/features/parent/components/ParentDashboard.tsx`
- Create: `src/features/parent/components/LearningMomentsCard.tsx`
- Modify: `src/locales/ar/parent.ts`, `src/locales/en/parent.ts`

**Step 1: Generate conversation starters for parents**
When a child completes "Bank Accounts" or fails a "Pricing Game", the parent receives a tailored real-life talking prompt.

---

## Phase 9: Comprehensive Polish, Localization & QA

### Task 9.1: Arabic RTL & English LTR Pixel-Perfect Pass
**Files:**
- Audit: All views at 390px (mobile) and 1440px (desktop)
- Verify: Directionality, badge alignment, font hierarchies (`Cairo` for Arabic, `Nunito` for English).

### Task 9.2: Audio & Haptics Engine Pass
**Files:**
- Audit: `src/lib/sound.ts`
- Ensure all taps, rewards, successes, and errors trigger appropriate kid-friendly sound effects.

---

## Phase 10: Launch Readiness & Final Definition of Done (🟢 COMPLETED - 2026-10-04)

### Task 10.1: Full Automated Test Suite & E2E Validation [DONE]
- [x] Unit & integration tests: 59 test files, 406 Vitest tests passing (100% green).
- [x] TypeScript & IDE type errors resolved in `Layout.tsx`, `SpriteActor.tsx`, and `AdventureMap.tsx`.
- [x] Learning path (/map): 200 lessons across 20 modules + interactive Boss platforms (`BossPlatformNode`, `PreBossModal`, `BossFightShell`, `BossResultModal`).
- [x] Safe-slot character positioning with zero collisions and clean standalone character sprites (`/images/characters_clean/`).
- [x] Pure Arabic RTL localization for all 200 lessons via `lesson_${lesson.id}_title`.
- [x] Re-activated Daily Rewards (🎡 `DailySpinWheel`) and live Breaking News Ticker (`NewsTicker` + `BizPulseNewsFeed`).
- [x] Responsive layout verified across 360x740, 390x844, 768x1024, and 1440x900 in Arabic RTL and English LTR.

### Task 10.2: Final Artifact Updates [DONE]
- [x] `IMPLEMENTATION_STATUS.md` updated with all systems 🟢 COMPLETE.
- [x] `MEMORY.md` updated with comprehensive session log.
- [x] `TRANSLATION_GUIDE.md` updated with 200-lesson canonical translation standards.
- [x] `ultimate upgrades.md` updated with master progress milestone.
