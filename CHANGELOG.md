# ProfitsPatrol Changelog

All implementation sessions and migrations are recorded here according to PRD Section 110.

---

### [2026-09-30] — Phase 1: Foundation Layer (Core Registries & Profile)
- **Feature:** Core Foundation Setup (Asset Registry, Game Registry & Common Game Result Model, Player Profile Progression).
- **Files changed:**
  - `src/lib/assets/assetRegistry.ts` (created): Centralized asset registry for the 4 Heroes (Ollie, Reema, Filo, Kami), Rival Rex, and 8 Districts.
  - `src/features/games/types.ts`: Added `CommonGameResult` schema matching PRD Section 27 (accuracy, mistakes, competencies, consequences, character reactions).
  - `src/types.ts`: Added `unlockedDistricts`, `competencyMastery`, and `activeHeroCompanion` to `UserProgression` and `User`.
  - `tests/assets/assetRegistry.test.ts` (created): Unit test suite for asset resolution and fallbacks.
  - `tests/games/gameRegistry.test.ts` (created): Unit test suite for 50-station game registry and result schema.
  - `tests/store/playerProfile.test.ts` (created): Unit test suite for player profile progression and settings RBAC.
  - `docs/plans/2026-09-30-profitspatrol-master-upgrade-plan.md` (created): Master 10-phase implementation plan.
  - `IMPLEMENTATION_STATUS.md` (created & updated).
- **Database changes:** None (additive client state aligned with existing Supabase profiles schema).
- **Migration performed:** None required for this foundation step.
- **Tests performed:** 10/10 automated tests passed (`tests/assets/assetRegistry.test.ts`, `tests/games/gameRegistry.test.ts`, `tests/store/playerProfile.test.ts`).
- **Next task:** Phase 2: Content Architecture (Mapping 20 modules & 200 lessons to 8 Districts and competencies).

---

### [2026-09-30] — Phase 2: Content Architecture (Districts & Competencies)
- **Feature:** Competency Model & 8-District Mapping (PRD Sections 2, 8–15, 109).
- **Files changed:**
  - `src/domain/curriculum/competencyModel.ts` (created): 6 Canonical Competency Groups (Money, Business, Marketing, Risk & Ethics, Leadership, Innovation), granular skill definitions with bilingual En/Ar titles and descriptions, 4-tier mastery calculation engine (`calculateMasteryLevel`).
  - `src/domain/world/districts.ts` (created): 8 canonical districts with hero guides, color themes, Arabic & English taglines, and complete mapping of all 20 modules to districts.
  - `src/features/education/data/curriculum.ts`: Enhanced `ALL_LESSONS` pipeline to enrich every one of the 200 lessons with `districtId` and `primaryCompetencyId`.
  - `tests/curriculum/curriculumMapping.test.ts` (created): Comprehensive unit test suite covering competency definitions, mastery formula, 8-district coverage, and 100% lesson mapping without gaps.
  - `IMPLEMENTATION_STATUS.md`: Marked Competency System as 🟢 COMPLETE.
- **Database changes:** None.
- **Migration performed:** None.
- **Tests performed:** 7/7 automated tests passed (`tests/curriculum/curriculumMapping.test.ts`). Combined test suite: 17/17 tests passing across Phases 1 & 2.
- **Next task:** Phase 3: Character & World System (The 4 Heroes + Rex Antagonist Engine, and 8-District World Map Integration).

---

### [2026-09-30] — Phase 3: Character & World System
- **Feature:** 4 Heroes Engine, Rival Rex Antagonist Engine, and 8-District World Map Navigation (PRD Sections 4.1–4.4, 5, 7, 8–15, 109).
- **Files changed:**
  - `src/features/characters/data/heroes.ts` (created): 4 Canonical Heroes (**Ollie** - Plan/Owl, **Reema** - Connect/Arctic Fox, **Filo** - Protect/Baby Elephant, **Kami** - Create/Chameleon) with rich bilingual dialogue banks, personality profiles, and helper selectors.
  - `src/features/characters/data/rivalRex.ts` (created): **Rex the Raccoon** rival profile with "Think Again." philosophy, competition dialogue bank (challenge, victory, defeat, banter, reluctant respect).
  - `src/features/characters/components/CharacterDialogueModal.tsx` (created): Accessible, touch-first dialogue modal with animated speech bubbles, role badges, action buttons, and asset resolution.
  - `src/features/world/components/WorldDistrictSelector.tsx` (created): Horizontal scrollable 8-district selector with unlock progression, theme color badges, and hero tags.
  - `src/features/hq/components/AdventureMap.tsx`: Integrated `WorldDistrictSelector`, active district card with hero advisor button, and dynamic district lesson loading.
  - `tests/characters/characterEngine.test.ts` (created): 6/6 tests passing for heroes, dialogue banks, and Rex rivalry.
  - `tests/world/districtMap.test.tsx` (created): 5/5 tests passing for district selector, unlock rules, and dialogue modals.
  - `IMPLEMENTATION_STATUS.md`: Marked World Map, Ollie, Reema, Filo, Kami, and Rex as 🟢 COMPLETE.
- **Database changes:** None.
- **Migration performed:** None.
- **Tests performed:** 31/31 automated tests passed across all Phase 1, Phase 2, and Phase 3 suites (`tests/assets/`, `tests/games/`, `tests/store/`, `tests/curriculum/`, `tests/characters/`, `tests/world/`, `tests/WorldSystemV2.test.tsx`).
- **Next task:** Phase 4: Unified Game Launcher & Mastery Engine (PRD Sections 25–27, 4.1–4.2 in Master Plan).

---

### [2026-09-30] — Phase 4: Unified Game Launcher & Mastery Engine
- **Feature:** Universal Game Launcher Component & Adaptive Mastery Engine (PRD Sections 25–27, 109).
- **Files changed:**
  - `src/features/world/components/WorldDistrictSelector.tsx`: Enhanced `unlockedDistricts` type definition to `(DistrictId | string)[]` for seamless compatibility with user profile state.
  - `src/domain/mastery/masteryCalculator.ts` (created): 3-tier dynamic difficulty adjustment engine (`rookie`, `founder`, `tycoon`) based on accuracy and mistakes, plus granular competency delta calculator.
  - `src/features/games/components/UniversalGameLauncher.tsx` (created): Universal game wrapper supporting pre-game objective briefs, difficulty selector, live gameplay timer/score, pause overlays, and post-game result screen conforming to PRD Section 27 (stars, accuracy, XP, ppTokens, hero reaction, and store state synchronization).
  - `tests/mastery/masteryCalculator.test.ts` (created): 4/4 tests passing for competency progression and adaptive recommendations.
  - `tests/games/gameLauncher.test.tsx` (created): 2/2 tests passing for launcher lifecycle, state transitions, and reward dispatching.
  - `IMPLEMENTATION_STATUS.md`: Marked Adaptive Learning as 🟢 COMPLETE.
- **Database changes:** None.
- **Migration performed:** None.
- **Tests performed:** 37/37 automated tests passed across all 9 test suites.
- **Next task:** Phase 5: Persistent Business Simulation & Economy (PRD Sections 28–30, 5.1–5.2 in Master Plan).

---

### [2026-09-30] — Phase 5: Persistent Business Simulation & Economy
- **Feature:** Persistent Business Simulation Engine, Consequence Engine & "Why?" Explainer (PRD Sections 28–33, 109).
- **Files changed:**
  - `src/features/business/types/business.ts` (created): Data models for `BusinessVenture`, `BusinessType`, `QualityTier`, `DailyRecord`, and `BusinessConsequence`.
  - `src/features/business/engine/consequenceEngine.ts` (created): Cause-and-effect consequence generator evaluating pricing, quality, inventory, and marketing (selling below cost, empty shelves, overpricing, quality cuts, and healthy profit milestones).
  - `src/features/business/store/businessStore.ts` (created): Persistent Zustand store managing venture cash, inventory, quality tiers, marketing, dynamic customer conversion simulation, and 30-day performance history.
  - `src/features/business/components/WhyExplanationModal.tsx` (created): Cause-and-effect educational modal explaining "Why this happened" with CEO recommended actions in Arabic and English.
  - `src/features/business/components/BusinessDashboard.tsx` (created): Child-friendly 4-lever control dashboard (Price slider, Inventory buying, Material Quality, Marketing budget), "Run Day Sales" simulation action, and daily profit/loss breakdown.
  - `tests/business/businessSimulation.test.ts` (created): 6/6 tests passing for inventory math, pricing rules, daily financial simulation (Revenue = Price * Sold, Expenses = InventoryCost + Marketing, Profit = Revenue - Expenses), and consequence triggers.
  - `IMPLEMENTATION_STATUS.md`: Marked Business Simulation as 🟢 COMPLETE.
- **Database changes:** None (persisted client-side via LocalStorageAdapter).
- **Migration performed:** None.
- **Tests performed:** 43/43 automated tests passed across all 10 test suites.
- **Known issues:** None.
- **Next task:** Phase 6: Living World & Rex Competition (PRD Section 35, 6.1 in Master Plan).

---

### [2026-09-30] — Phase 6: Living World & Rex Competition
- **Feature:** Rex Competition Engine, Tug-of-War Market Share & Showdown Modal (PRD Section 5, 7, 28, 109).
- **Backend Architecture Note:** Confirmed complete transition away from Supabase to **Laravel + SQLite** REST backend (`backend/` with Sanctum token authentication in `src/lib/api.ts`). All local persistence uses `LocalStorageAdapter`.
- **Files changed:**
  - `src/features/rivalry/types/rivalry.ts` (created): Data models for `RivalChallenge`, `PlayerStrategicOption`, `RivalryDistrictStatus`, and `RivalryResolution`.
  - `src/features/rivalry/engine/rexCompetition.ts` (created): 8 canonical district showdowns with Rex the Raccoon (Price war, copycat sprints, speculative crypto hype, supply chain bottlenecks, prototype feature bloat, corporate smear campaigns, credit traps, and angel investor pitch-offs).
  - `src/features/rivalry/store/rivalryStore.ts` (created): Persistent Zustand store tracking player vs Rex market share (0–100%), confrontation counts, and synchronization with `useAppStore` (XP & P-Tokens) and `useBusinessStore` (tactical cash spending).
  - `src/features/rivalry/components/RexShowdownModal.tsx` (created): High-impact visual competition modal featuring animated tug-of-war market share bar, comic speech bubbles with Rex's "Think Again." philosophy, 3 strategic response cards with advisor tips (Ollie, Reema, Filo, Kami), sound effects, and economic consequence explanations in bilingual English / Arabic RTL.
  - `src/features/business/components/BusinessDashboard.tsx`: Integrated District Rivalry widget and "Challenge Rex ⚡" trigger.
  - `src/features/hq/components/AdventureMap.tsx`: Integrated Rex Rival button in the district adventure header alongside the hero guide.
  - `src/domain/world/districts.ts`: Exported `CANONICAL_DISTRICTS` alias for consistency.
  - `tests/rivalry/rexCompetition.test.ts` (created): 6/6 tests passing for challenge retrieval, strategic victory rewards, reckless defeat consequences, market share clamping (5%–95%), and dominance tier bonuses.
  - `IMPLEMENTATION_STATUS.md`: Updated Rex (Rival) to 🟢 COMPLETE.
- **Database changes:** None (persisted client-side via LocalStorageAdapter, synchronizing with Laravel profile state).
- **Migration performed:** None.
- **Tests performed:** 53/53 automated tests passed across all 11 test suites.
- **Known issues:** None.
- **Next task:** Phase 7: Advanced Systems & HQ 2.0 (Interactive Skill Tree & Kami's Prototyping Lab).

---

### [2026-09-30] — Phase 7: Advanced Systems & HQ 2.0
- **Feature:** Interactive Competency Skill Tree & Kami's Prototyping Lab in HQ 2.0 (PRD Sections 36–42, 109).
- **Backend Architecture Note:** Confirmed persistent client-side state using `LocalStorageAdapter` syncing with Laravel + SQLite profile and inventory state.
- **Files changed:**
  - `src/features/skills/components/SkillTreeView.tsx` (created): Interactive Skill Tree mapped to all 6 canonical competency groups (Money, Business, Marketing, Risk & Ethics, Leadership, Innovation) with 4-tier mastery calculations (Novice ➔ Apprentice ➔ Expert ➔ Master), progress bars, and bilingual detail modal.
  - `src/features/innovation/components/KamiExperimentLab.tsx` (created): Kami the Chameleon's innovation incubator allowing players to combine base products (lemonade, gadget, apparel, snack) with eco/kinetic/AI modifiers to synthesize prototypes, evaluate Uniqueness, Feasibility, and Market Demand, and earn Innovation XP & P-Tokens.
  - `src/features/hq/components/Headquarters.tsx`: Enhanced HQ tabs to 5 functional sections (`empire`, `builder`, `skills`, `lab`, `missions`), seamlessly embedding `SkillTreeView` and `KamiExperimentLab`.
  - `src/features/rivalry/components/RexShowdownModal.tsx`: Fixed district undefined safety fallback.
  - `tests/skills/skillTree.test.tsx` (created): 3/3 tests passing for competency group rendering, mastery level calculations, and node selection modal.
  - `tests/innovation/kamiLab.test.tsx` (created): 2/2 tests passing for element synthesis, scoring math, and player profile reward dispatch.
  - `IMPLEMENTATION_STATUS.md`: Marked HQ 2.0 and Experiment Lab as 🟢 COMPLETE.
- **Database changes:** None (persisted client-side, syncing with Laravel profile state).
- **Migration performed:** None.
- **Tests performed:** 58/58 automated tests passed across all 13 test suites.
- **Known issues:** None.
- **Next task:** Phase 8: Parent & Teacher Ecosystem (Real-time Learning Moments & Classroom Assignments linked to Laravel backend).

---

### [2026-10-18] — Production Deployment: Hostinger Linux Path Normalization & MIME Configuration
- **Feature:** Hostinger deployment packaging script upgrade & Apache SPA configuration fix.
- **Root Cause:** Windows PowerShell's `Compress-Archive` wrote backslashes (`\`) into ZIP entry names, causing Linux unzippers on Hostinger to extract flat files (e.g., `assets\index-*.js`) instead of directories. Apache fell back to serving `index.html` (MIME `text/html`) on module script requests, causing browser strict MIME type errors.
- **Files changed:**
  - `scripts/package-hostinger.ps1`: Replaced `Compress-Archive` with `Compress-CleanArchive` using .NET `ZipArchive` to normalize all relative entry paths to forward slashes (`/`) and preserve hidden files (`.htaccess`). Renamed to approved verb `Compress`.
  - `public/.htaccess` & `dist/.htaccess`: Added explicit MIME types (`.js`, `.mjs`, `.webmanifest`, `.wasm`, `.svg`, `.json`) and added rewrite conditions returning true 404s for missing static assets.
  - `hostinger.md`: Added instructions for cleaning leftover flat backslash files in `public_html` before extracting.
  - `deploy_hostinger/1_frontend_public_html.zip`: Re-packaged with 0 backslashes across 1,400 entries.
  - `deploy_hostinger/2_backend_api.zip`: Re-packaged with 0 backslashes across 14,477 entries.
  - `MEMORY.md`, `PROJECT_CONTEXT.md`, `IMPLEMENTATION_STATUS.md`: Synchronized project memory files.
- **Database changes:** None.
- **Verification:** Live server curl testing confirmed the backslash path behavior; scratch verification confirmed 0 backslashes in all newly generated ZIP packages.





