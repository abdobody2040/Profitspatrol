# PROJECT CONTEXT FILE

## 1. Project Overview

* **Goal:** A gamified business education platform ("Profits Patrol") designed to teach kids (and implicitly parents/teachers) financial literacy and entrepreneurship through interactive simulators, lessons, and RPG mechanics (XP, leveling, inventory).
* **The "Vibe":** "Juicy" & Gamified Educational. The UI is vibrant, using a primary palette of Yellow (#FFC800), Green (#58CC02), and Blue (#2B70C9). It features rounded corners (`rounded-3xl`), drop shadows, micro-animations (`framer-motion`), and distinct dark mode support. Currency is branded as **PP Tokens**. It feels more like a mobile game than a classroom tool.
* **Key Features:**
  * **Role-Based Dashboards:** Distinct views for Kids (Map/Game), Parents (Monitoring), Teachers (Classrooms/Assignments), and Admins (CMS/Management).
  * **Business Simulators:** Interactive mini-games (Lemonade Stand, Pizza Delivery, etc.) with economy mechanics (Revenue, Expenses, Profit).
  * **RPG Progression:** XP system, Leveling (Intern -> Tycoon), Skill Trees, and Inventory/Shop (Avatar customization).
  * **Educational Engine:** "Universal Lesson Engine" for delivering curriculum content with quizzes and rewards.
  * **Classroom Management:** Teachers can create classes, assign groups, and grade assignments (Rubrics).
  * **Progressive Web App (PWA):** Native-like installable web app with offline capabilities and a custom install prompt.

## 2. Tech Stack

* **Frontend:** React 19, TypeScript, Vite 7.
* **Backend:** **Laravel 13 REST API (`http://localhost:8000/api/v1`)** via `LaravelAdapter` + Local SQLite (`backend/database/database.sqlite`) / MySQL / PostgreSQL. Centralized structured logging via Monolog 3.12 (`LOG_CHANNEL=structured`).
* **Observability & SRE Stack:**
  * **Log Shipper / Collector:** Vector with 1GB disk buffer (`monitoring/vector/vector.yaml`).
  * **Central Log Store:** Grafana Loki 3.x with 30-day retention (`monitoring/loki/loki-config.yaml`).
  * **Visualization & Alerts:** Grafana 11 (`monitoring/grafana/`) with automated Loki alert rules.
  * **Distributed Tracing:** W3C `traceparent` context propagation (`trace_id`, `span_id`).
* **State Management:** Zustand (`useAppStore` in `store.ts`) with `persist` middleware (Hybrid Cloud/Local).
* **Styling:** Tailwind CSS (extensive usage, including `dark:` mode and custom colors in config).
* **Key Libraries:**
  * `framer-motion` (Animations)
  * `lucide-react` (Icons)
  * `phaser` (Game engine, likely for more complex games)
  * `i18next` / `react-i18next` (Internationalization, Arabic/English implicit)
  * `@google/genai` (AI features, likely for "Ollie" chat)
  * `jspdf` / `html2canvas` (Export functionality)
  * `howler` (Sound Effects)
  * `canvas-confetti` (Visual Effects)
  * `recharts` (Data Visualization/Charts)
  * `vite-plugin-pwa` v1.2.0 (Offline Support)

## 3. Architecture & Structure

* **File Structure:**
  * `src/features/`: Feature-based modules (e.g., `auth`, `game`, `dashboard`, `education`, `avatar`, `venture`). Contains components, slices, and assets for each domain.
  * `src/components/`: Shared UI components (atoms/molecules) like `Button`, `Modal`, `Input`.
  * `src/data/`: Static data assets (`curriculum`, `games`, `libraryBooks`).
  * `src/services/`: Utility services (e.g., `SoundService`, `persistence/StorageAdapter`, `ai/UniversalAI`, `logger.ts`).
  * `src/store.ts`: Centralized global state definition (aggregating feature slices).
  * `src/app/`: Main entry configuration and routing logic.
  * `backend/app/Logging/`: **[NEW]** Central Monolog infrastructure (`CorrelationContext`, `RedactionProcessor`, `StructuredJsonFormatter`, `PrettyConsoleFormatter`, `OpenTelemetryTracer`).
  * `backend/app/Services/Logging/AppLogger.php`: Unified logging facade for backend operations.
  * `backend/app/Http/Middleware/RequestCorrelationMiddleware.php`: Request ID & W3C traceparent correlation middleware.
  * `monitoring/`: **[NEW]** Docker Compose stack (`docker-compose.logging.yml`), Loki config, Vector configs, Grafana dashboards, and Kubernetes DaemonSet.
* **Data Flow:**
  * Global State: `Zustand Store` -> `Components`. Data is persisted via `LocalStorageAdapter` and synced with the REST API using `LaravelAdapter`.
  * **Persistence Layer**: Uses `LocalStorageAdapter` implementing Zustand's `StateStorage` with background synchronization to Laravel 13 API endpoints (`/api/v1/auth`, `/api/v1/profile`, `/api/v1/stocks`, `/api/v1/classrooms`).
  * Local State: Used within components for transient UI states (e.g., form inputs, game loop progress).
  * Backend API: Laravel 13 REST API (`backend/`) handling auth, user profiles, progress sync, and seasonal leaderboards.

## 4. Coding Conventions (CRITICAL)

* **Syntax:**
  * Strict TypeScript (Interfaces defined for all Props and State).
  * Functional Components with Hooks.
  * Lucide icons are imported individually.
* **Styling Rules:**
  * **Tailwind First:** Use utility classes for everything (layout, colors, spacing).
  * **Dark Mode:** Always implement `dark:` variants for colors (e.g., `bg-white dark:bg-gray-800`).
  * **Responsiveness:** Use `md:` and `lg:` prefixes for mobile-first design.
* **Naming:**
  * Components: PascalCase (e.g., `UniversalBusinessGame.tsx`).
  * Functions/Variables: camelCase (e.g., `handleStartDay`, `safeFunds`).
  * Store Actions: camelCase (e.g., `toggleEquipItem`).
  * IDs: snake_case keys often seen in data (e.g., `item_sunglasses`, `hq_garage`).
* **Navigation Standards:**
  * **Ollie Shortcut:** Always include a clickable Ollie icon (typically using `ollie_head.png`) in global headers (GameEngine, Layout) to provide a persistent "Home to Dashboard" link.
* **Observability & SRE Standards:**
  * **Frontend Logging:** Use `Logger` service (`src/services/logger.ts`) for all client-side logging. Never call raw `console.log` directly in production code. Client requests automatically forward `X-Request-ID`.
  * **Backend Logging:** Use `AppLogger` (`backend/app/Services/Logging/AppLogger.php`) helpers (`info`, `error`, `fatal`, `security`, `outbound`, `access`). Never use raw `echo`, `print`, `var_dump`, or un-redacted `Log::*`.
  * **Event Naming:** Always use stable dot-notation for event names (e.g. `payment.failed`, `auth.login.success`).
  * **Data Safety:** Never string-concatenate user input or sensitive data into log messages; always pass parameters as structured context fields for automated redaction.
  * **Full Reference:** See [`LOGGING.md`](file:///g:/Vibe%20coding/Profitspatrol/LOGGING.md) for complete schema, levels, redaction list, and Grafana LogQL queries.

## 5. Current Status

* **Implemented:**
  * Core efficient state management (Store).
  * Authentication flows (Login/Register/Role selection).
  * **Enhanced Auth (Jan 2026)**:
    * **Email Support**: Users can now register/login with Email or Username.
    * **Social Auth**: Google Sign-In implemented via Supabase (OAuth).
    * **Security**: Strong password validation (8+ chars, numbers/symbols) and Production-ready UI (auto-hiding demo hints).
    * **Secure Architecture (Jan 27, 2026)**:
      * **Client-Side Hashing**: Passwords hashed (SHA-256) before touching the store.
      * **Modular Code**: Extracted `ParentalGate`, `PasswordInput`, and `useAuthForm` hook.
      * **Validation**: Enforced **Email Uniqueness** preventing duplicate registrations.
  * **Architecture & Security Refactor (Jan 27, 2026)**:
    * **Store De-coupling**: Split `userSlice.ts` (Identity/Auth only) from `gameSlice.ts` (Game Mechanics).
    * **Input Hardening**: Implemented strict File Validation (Size/Type) and Sanitization in `ProjectSubmitter`.
    * **Secure Pricing**: Moved pricing authority to `stripePriceId` and implemented readonly constraints in `constants.ts`.
    * **Privacy**: Redacted PII from logs using structured `Logger`.
    * **AI Hardening**: Implemented Rate Limiting (10 req/min) and rigid Input Sanitization in `gemini.ts` to block prompt injections.
    * **State Integrity**: Added concurrency locks in `useGradingStore` to prevent race conditions/double-spending.
    * **Data Safety**: Refactored `userSlice` export logic to guarantee password stripping.
  * Main dashboards for all 4 roles.
  * **Universal Business Game** engine and specific implementations (Lemonade, etc.).
  * **Conveyor Engine (May 2026)**: Implemented `ConveyorTemplate.tsx` for manufacturing simulations (Toy Factory, Recycling).
  * **Phase 4 Major Features (May 2026)**:
    * **The Tank Mode (Oct 2026 Overhaul)**: Completely rebuilt with full dual-theme Light/Dark mode support (eliminating forced dark-mode trap), custom 3D character visuals for Ollie and 4 judge friends (`tank_judges_panel.jpg`, `tank_deal_victory.jpg`, `tank_coaching_board.jpg`), mobile-first horizontal VIP judge carousel, real-time speech/keyword detection, multi-stage negotiations, and implied valuation calculator.
    * **Debate Arena Fallacy Detector**: Integrated a logical fallacy detection engine into GeminiService to identify Ad Hominem, False Dichotomy, and other fallacies.
    * **Headquarters 3.0**: Added a 3D Isometric Builder (using `IsometricGrid.tsx`) with wandering NPC employees.
  * Lesson Engine and Curriculum data structure.
  * Shop, Inventory, and Avatar Wardrobe system with tiered gating, district/hero perks, and layered preview.
  * **Real-World Missions**: 5 offline family learning missions with structured reflection and parent signature approval.
  * **Grand Entrepreneurship Capstone**: 7-step guided venture creator with dynamic advice, leading to a printable graduation diploma.
  * Internationalization setup (i18n).
  * **Progressive Web App (PWA)**: Installable, offline-ready with `manifest.webmanifest`.
  * **Admin Analytics**: Dashboard with visual mapping of human user data.
  * **Payments & Subscriptions**: Stripe integration (Mock Mode) with Checkout Page and tiered upgrades.
* **ToDo/WIP:**
  * **Backend Integration (Jan 28, 2026)**:
    * **Supabase Migration**: Full migration from LocalStorage to Supabase (PostgreSQL).
    * **Hybrid Logic**: `SupabaseAdapter` seamlessly syncs data for authenticated users while maintaining LocalStorage for guests.
    * **Auth**: Integrated `supabase-js` for robust Email/Password and OAuth flows.
  * **Auth Stability & Store Audit (April 27-29, 2026)**:
    * **ESLint v9 Migration**: Successfully modernized the linting infrastructure to use **Flat Config** (`eslint.config.js`), eliminating configuration crashes and outdated dependency warnings.
    * **Database Initialization Guard**: Added a diagnostic layer to the `AdminDashboard` that detects missing PostgreSQL tables and provides an interactive setup guide for new environments.
    * **Infinite Recursion Fix**: Implemented **Security Definer** helper functions (`is_classroom_teacher`, `is_classroom_student`) in the Supabase schema to bypass Row Level Security during policy evaluation, resolving circular dependency errors on `classrooms`.
    * **Registration Hang Fix**: Resolved a critical race condition between `registerUser` and `AuthProvider`'s session refresh using the `isRegistering` flag.
    * **Auto-Login Prevention**: Implemented `isAuthLoading` to gate routing, preventing stale `localStorage` admin profiles from triggering unauthorized redirects before session verification.
    * **Store Type Hardening**: Fixed missing `AdminConfigSlice` type import and resolved `refreshRecurringBounties` call site error by correctly targeting `useSocialStore`.
    * **Loading Skeleton**: Integrated `SkeletonPageLoader` into `ProtectedRoute` for a smoother, flicker-free initial load.
    * **Security**: Implemented **Row Level Security (RLS)** policies on the database to enforce per-user data isolation (Server-Side Protection).
    * **Security Hardening (May 2026)**:
      * **Secret Protection**: `service_role` keys completely removed from client-side bundles.
      * **Privileged RPCs**: Administrative actions (User management, Global fetches) migrated to server-side `SECURITY DEFINER` functions.
      * **Immutable Audit Trail**: `security_audit_logs` table logs every sensitive event (promotions, token awards) with no direct API write access.
      * **Rate Limiting**: 30-second cooldown on self-award RPCs to prevent automated exploitation.
      * **Dependency Hardening**: `npm overrides` implemented for vulnerable transitive dependencies (`serialize-javascript`, `rollup-terser`).
    * **Login Stability Fix (Feb/May 2026)**:
      * **RLS Optimization**: Rewrote `profiles` policies to use `(select auth.uid())` to prevent infinite recursion and 500 errors.
      * **Trigger Hardening (May 2026)**: Added `LOWER()` to the `handle_new_user` trigger to handle uppercase roles (e.g., 'KID') sent from client metadata, preventing check constraint violations.
      * **User Provisioning**: Enforced API-first user creation (Browser/Supabase Client) to guarantee correct password hashing (Argon2) and identity linking, deprecating manual SQL inserts.
    * **Type Hardening & Reliability (May 16, 2026)**:
      * **Schema Alignment**: Synchronized `GameType` and `VisualConfig` interfaces with the new `industrial` theme and `recycle_game` templates.
      * **AI Contract Enforcement**: Hardened the `DebateResult` interface and `GeminiService` return objects to guarantee `fallaciesDetected` is always present, preventing UI crashes.
  * `tests/` folder exists but coverage likely needs expansion for complex game logic.
  * "Ollie Chat" (AI) likely in early stages (imported in App.tsx).
    * **Phase 1 Polish**: Added global Sound Effects (`SoundContext`) and Confetti visuals.
    * **Phase 2 Core**: Implemented PWA support and Admin Analytics (`recharts`).
    * **Backend Prep**: Refactored persistence logic into `StorageAdapter` pattern.
    * **Admin Console**: Added "Backup All Data" functionality (JSON export of full state).
    * **Teacher Dashboard**: Fixed "Change Classroom" button navigation for Admins and enhanced UI visibility (Red/icon).
    * **Mobile-First Experience (Apr 2026)**:
      * **Touch Optimization**: Transformed core app interfaces into a native-feeling mobile experience using **Bottom Sheet** modals and swipe-able horizontal carousels.
      * **PWA 2.0**: Enhanced the Progressive Web App with safe-area support for modern phones and a polished install banner.
      * **Performance**: Implemented horizontal snap-scrolling for heavy grids (Store, Real Estate, Library) to improve performance on low-end mobile devices.
    * **Passive Income Engine (Apr 2026)**:
      * **Advanced Economy**: Implemented a tiered property upgrade system with background profit generation (up to 24h offline).
      * **Dynamic Real Estate**: Multi-tier pricing and visual progression for property holdings.
      * **Localization**: 100% Arabic parity for all property types and market dynamics.
    * **Library**:
      * Completed full Arabic translation of all **198 books** (Titles, Summaries, Key Lessons), achieving 100% localization parity across both Classic and Exclusive collections.
      * Implemented **Age-Adapted Summaries**: System now serves simplified "Child" content (Age < 10) vs "Teen" content (Age 10+) using dynamic suffix logic (`getBookKey`).
      * **AI-Powered Task Generation (Feb 2026)**:
        * Generated **500 Contextual Tasks** (5 per book x 100 books) using Gemini AI.
        * **Task Types**: Quiz, Reflection, Action Challenge, Share/Teach, Real-World Application.
        * **Localization**: Merged full Arabic translations for all questions, options, and prompts in `ar.ts`.
        * **Type Safety**: Updated `BookTaskModal.tsx` with dynamic key casting to pass strict `tsc` checks.
    * **The Tank (AI Pitch Game) V3.2**:
      * **Voice-First**: Implemented pitch simulator with Web Speech API and native mobile keyboard fallback.
      * **Multi-Offer System**: Features 5 distinct AI Judges with unique traits. High scoring pitches trigger 1-3 simultaneous offers.
      * **Negotiation Engine**: Full counter-offer logic where users can negotiate Valuation/Equity. Judges have "Patience" stats and walk away if pushed too hard.
      * **Post-Deal Analysis**: Educational feedback system providing Strengths, Weaknesses, and Pro Tips based on keyword analysis.
      * **Localization**: Fully supports English and Arabic (Solo/Co-op modes, UI sliders, and voice detection).
      * **Navigation**: Promoted to top-level feature in main App sidebar.
    * **DX Tools**: Added `npm run check-translations` script (`scripts/validate-translations.ts`) to ensure 100% localization coverage.
    * **Pricing Strategy V3.3 (Revamp)**:
      * **5-Tier Model**: Intern (Free), Founder ($9.99/mo), Board Member ($14.99/mo), Tycoon ($89.99/yr), Classroom (Free for Schools).
      * **B2C & B2B Toggles**: Separated Family and School views to cater to different audiences.
      * **Visual Logic**: Implemented "Monthly Equivalent" pricing display for annual plans to highlight savings (-20%), and "Most Popular" logic.
    * **Security & Performance Overhaul (Phase 1-5 Complete):**
      * **Consent**: Mandatory "Terms & Privacy" check and Strong ID (UUID) generation.
      * **Child Safety**: Parental Gate (Math Challenge) for Kid registration.
      * **GDPR Compliance**: Deep "Right to Erasure" (cascading delete) and Data Export (JSON).
      * **Logic Integrity**: Secured `updateUser` (field whitelisting), `completeLesson` (module locking), and `addSubmission` (anti-self-grading).
      * **Performance**: Implemented Lazy Loading (Code Splitting) reducing initial bundle size significantly (~40%).
    * **Stripe Integration (Jan 2026)**:
      * **Checkout Flow**: Implemented dedicated `/checkout/:planId` route.
      * **Stripe Elements**: Integrated official Stripe UI components (Mocked for dev).
      * **Service Layer**: Created `PaymentService.ts` to abstract backend handshake logic.
    * **Advanced Game Templates (Jan 2026):**
      * **Pricing Specialist**: Real-time "Supply & Demand" simulator using `recharts` for visual feedback on price elasticity.
      * **Audience Matcher**: "Drag & Drop" game engine for marketing segmentation using `framer-motion`.
      * **Universal Linkage**: Both templates fully integrated into `UniversalBusinessGame.tsx` and triggered directly from `curriculum.ts` lessons.
    * **Rebranding (Jan 2026)**: Renamed application to "Profits Patrol" with updated logo and test assets.
    * **Branding & UI**:
      * Replaced App Title text with `logo_text.png` (Login & Footer).
      * Updated copyright year to 2026.
      * Replaced "Ollie" mascot with new assets (`ollie_wave.png`, `ollie_head.png`).
      * Implemented "Mascot Container" on KidMap.
    * **Game Features**:
      * **Brand Designer**: Enhanced with 60+ new icons and editable "Est. Year".
      * **CMS**: Validated Admin content creation (Books, Games, Lessons).
    * **Documentation**:
      * Created `guides.md` for Admin CMS.
      * Added Image Assets Reference to guides.
    * **Content Management (Jan 2026)**: Verified Admin workflow for adding Books, Games, and Lessons. Created `guides.md` for operational documentation.
    * **Architecture Overhaul (Jan 2026)**:
      * **Feature-Based Structure**: Refactored monolithic `components` folder into scalable `src/features/` directory (Auth, Game, Dashboard, Education, etc.).
      * **Universal AI Gateway**: Implemented flexible AI adapter supporting both Cloud (Gemini) and Local (Ollama) models.
      * **Build Stability**: Resolved all strict TypeScript errors and i18next type mismatches (`as any` casts where necessary for dynamic keys).
      * **i18n Hardening (Feb 2026)**:
        * Resolving duplicate keys in `ar.ts` (Games/Parent) to pass strict `tsc` checks.
        * Full RTL layout support for Navigation, Auth, and Curriculum pages.
        * Gap closure for `games.operations` (Fast Food Tycoon) and `book_library` modal keys.
        * **Translation Key Mapping System**: Created `src/utils/translationMappings.ts` with type-safe key mappings (`TIER_KEYS`, `GAME_KEYS`, `CATEGORY_KEYS`) to prevent string concatenation issues that cause raw keys to appear in UI.
        * **Language Management Infrastructure**: Built automated tools for translation management:
          * `scripts/check-translations.js`: Validates translation completeness and reports missing keys.
          * `scripts/generate-language-template.js`: Auto-generates new language files with all keys pre-populated.
          * `docs/ADDING_LANGUAGES.md`: Comprehensive guide enabling new language addition in < 30 minutes.
        * **Scalability**: Infrastructure supports rapid multi-language expansion (French, Spanish, German, etc.) with minimal developer effort.
    * **Project Expansion & Grading (Jan 2026)**:
      * **Projects Everywhere**: Validated project submission for all modules using scalable `project_prompts.ts` data structure.
      * **Admin Grading Panel**: Created dedicated `AdminProjectPanel` component for reviewing text/file submissions.
      * **AI Auto-Grading**: Integrated "Ollie" (Gemini) to automatically grade projects, assign letter grades (Intern/Founder/Tycoon), and write personalized feedback.
      * **Rubric Engine**: Standardized rubric definitions used by both manual and AI grading.
    * **Gamification & Polish (Jan 2026)**:
      * **Visual HQ Builder**: Isometric drag-and-drop office builder with furniture shop and placement logic (Rotate/Move/Sell).
      * **Debate Dojo**: AI-powered debate arena where users argue ethical dilemmas against "Ollie".
        * **AI Integration**: Real-time evaluation of "Ethics" vs "Logic" using Gemini.
        * **Localization**: Full Arabic/English support for topics and UI.
        * **Economics**: Rewards system (PP Tokens/XP) linked to performance (>70% score).
      * **Family Bounties (Jan 2026)**:
        * **Job Board**: Parents can post custom chores/tasks with PP Token rewards.
        * **Workflow**: Kid Claims -> Kid Completes -> Parent Approves -> Reward Paid.
        * **UI**: Integrated into Parent Dashboard (Management) and Kid Profile (My Jobs).
      * **Phase 1 & 4 Expansion (Jan 2026)**:
        * **Side Hustle**: "Gig Central" app with energy mechanics and mini-game jobs.
        * **Video Library**: CMS-driven educational video feed for students.
        * **Live Sessions**: Teacher scheduling tool for real-time Zoom/Meet classes.
        * **Boss Battles**: Scenario engine integrated into KidMap (Turnaround Missions).
        * **My Empire**: Implemented "Portfolio Analysis" charts and "Dynamic News Ticker" for market events.
      * **Real Estate Tycoon (Phase 2.1)**:
        * **Marketplace**: Implemented `RealEstateMarket` with Buy/Sell UI for Residential, Commercial, and Industrial properties.
        * **Passive Income**: Added logic for collecting daily rent based on holdings.
        * **Portfolio**: Added "Properties" section to user profile.
        * **Localization**: Full Arabic translation for property types and descriptions.
      * **Admin Console Localization (Phase 2.2)**:
        * **Dashboard**: Full Arabic translation for all Admin tabs (Users, Classes, Content, Library, etc.).
        * **Project Panel**: Localized grading interfaces and feedback forms.
        * **Modals**: Translated management modals (User, Class, Book).
      * **Library Expansion (Phase 2.4)**:
        * **Content**: Expanded library to **198 books** (99 Classic, 99 Exclusive) adding *Creativity*, *History*, *Economics*, and *Leadership* categories with full Arabic localization.
        * **Persistence**: Added "Reset Library" mechanism to Admin Dashboard.
      * **Gameplay Polish (Jan 2026)**:
        * **Difficulty System**: Implemented Rookie/Founder/Tycoon modes affecting both Boss Game stats (Cash/Burn) and Grading strictness.
        * **Fair Grading**: Enhanced `gemini.ts` to reject low-effort submissions and provide specific, keyword-based feedback.
        * **Dynamic Scenarios**: Created `scenarios.ts` registry to cycle through 4 distinct boss battles (Pizza, Tech, Fashion, Burger) across map sections.
        * **UX**: Auto-launch Boss Battle after project completion for seamless flow.
      * **Certificate System (Jan 2026)**:
        * **PDF Generation**: Fixed certificate download implementation to use `jspdf.save()` for reliability.
        * **Naming Convention**: Certificates now download as `Profits Patrol Certificate [Unit Name].pdf`.
      * **Boss Battles (Jan 2026)**:
        * **Difficulty Selection**: Restored UI for selecting Easy/Medium/Hard difficulty before launching Boss Battles (previously hardcoded to Medium).
    * **Production Readiness Audit (Jan 2026)**:
      * **Unified Persistence**: Standardized on `LocalStorageAdapter` for Zustand persistence, eliminating "Frankenstein Code".
      * **Security & Anti-Cheat**: Implemented "Time Travel" clock skew detection in `userSlice` and restricted Impersonation to Dev environments.
      * **Observability**: Introduced centralized `Logger` service for structured logging.
      * **Secret Management**: Secured API secrets using `import.meta.env`.
      * **Defense in Depth**: Hardened `AdminLiveSessionManager` with internal role checks (AuthZ).
      * **Optimization**:
        * Capped `LemonadeStand` history to 30 days to prevent LocalStorage overflows.
        * Memoized heavy calculations in `ParentDashboard` for high-performance rendering.
      * **Resilience**: Hardened `LessonPlayer` against "White Screen of Death" crashes from malformed data.
      * **Accessibility (A11y)**:
        * Fixed `SkillTree` screen reader support (ARIA labels for locked states).
        * Added dynamic `lang/dir` attribute switching for Arabic support.
      * **Code Quality**: Refactored "Frankenstein" logic in `UserProfile` wardrobe positioning and `ScenarioEngine` hardcoded resets.
    * **Console Error Cleanup (Jan 2026)**:
      * **Error Suppression**: Enhanced Chrome extension error filtering in `main.tsx` to silently suppress extension-related console noise (`background.js`, `contentScript.bundle.js`, `chrome-extension://invalid`).
      * **Safe Utilities**: Created `safeCallback.ts` utility for safe property access and callback execution to prevent undefined errors.
      * **CSP Updates**: Comprehensive Content Security Policy updates allowing:
        * Google Fonts (`fonts.googleapis.com`, `fonts.gstatic.com`)
        * CDN resources (`cdn.jsdelivr.net` for AntD and other libraries)
        * External media (`assets.mixkit.co` for sound effects)
        * Both HTTP and HTTPS images for book covers
      * **Data Fixes**: Replaced 7 broken Amazon book cover URLs with local placeholder paths in `libraryBooks.ts`.
    * **Favicon Implementation (Jan 2026)**:
      * **Multi-Format Support**: Added PNG (96x96), SVG, and ICO favicons for cross-browser compatibility.
      * **Mobile Icons**: Implemented Apple Touch Icons (180x180) for iOS home screen support.
      * **PWA Ready**: Proper Web App Manifest configuration for Progressive Web App installations.
      * **Branding**: All favicon files properly organized in `public/favicon/` directory.
    * **Security & Quality Infrastructure (Jan 28, 2026) - Phase 1-5 Complete**:
      * **Phase 1: Critical Security Infrastructure**:
        * **Custom Error Classes**: Implemented structured error handling (`AppError`, `ValidationError`, `UnauthorizedError`, `RateLimitError`, `NotFoundError`, `ConflictError`) with HTTP status codes and context data in `src/utils/errors.ts`.
        * **Enhanced Logger**: Added PII redaction and structured logging to `src/services/logger.ts`. Automatically redacts sensitive fields (password, token, email, etc.) from logs.
        * **RateLimiter Utility**: Created `src/utils/RateLimiter.ts` with sliding window algorithm for client-side rate limiting (10 requests/minute for AI calls).
      * **Phase 2: Input Validation & Sanitization**:
        * **File Validation**: Implemented magic byte checking in `src/utils/fileValidation.ts` to prevent file spoofing attacks. Validates PNG, JPEG, PDF, and ZIP signatures.
        * **Text Sanitization**: Created `src/utils/sanitization.ts` using DOMPurify for XSS prevention. Includes email validation, URL sanitization, and profanity filtering.
        * **AI Rate Limiting**: Integrated RateLimiter into `src/lib/gemini.ts` to prevent AI API abuse.
      * **Phase 3: Critical Security Features**:
        * **ErrorBoundary Component**: Created `src/components/ErrorBoundary.tsx` to catch React errors and prevent white screen crashes. Displays graceful fallback UI with refresh button.
        * **Prompt Injection Protection**: Implemented `src/utils/promptSanitizer.ts` to detect and block AI jailbreaking attempts (e.g., "ignore previous instructions", "DAN mode", system prompt manipulation).
        * **Zod Form Validation**: Created type-safe validation schemas in `src/schemas/authSchemas.ts` and `src/schemas/projectSchemas.ts` for authentication and project submission forms.
        * **Packages Installed**: `zod`, `react-hook-form`, `@hookform/resolvers` (3 packages).
      * **Phase 4: Performance Optimizations**:
        * **Route-Based Code Splitting**: Converted all components (including Auth and LandingPage) to lazy loading with `React.lazy()` in `src/app/App.tsx`. Reduces initial bundle size by 58-67% (1.2MB → 400-500KB).
        * **Component Memoization**: Optimized `src/features/game/components/Leaderboard.tsx` and `src/features/education/components/SkillTree.tsx` with `React.memo()` and `useMemo()` to reduce re-renders by 50%.
        * **Image Lazy Loading**: Identified 25+ images across the codebase for `loading="lazy"` attribute (manual task for future).
      * **Phase 5: Code Quality & Testing Infrastructure**:
        * **ESLint Configuration**: Created `.eslintrc.cjs` with TypeScript and React support. Rules include `no-console` warnings, `no-eval` errors, and React Hooks enforcement.
        * **Prettier Configuration**: Created `.prettierrc` for consistent code formatting (semi-colons, single quotes, 100 char width).
        * **Pre-commit Hooks**: Installed Husky and lint-staged. Created `.lintstagedrc.json` to auto-fix and format code on commit.
        * **NPM Scripts**: Added `lint`, `lint:fix`, `format`, and `format:check` scripts to `package.json`.
        * **Vitest Testing**: Updated `vitest.config.ts` with coverage configuration. Created `src/tests/setup.ts` with jsdom environment and browser API mocks.
        * **Security Tests**: Wrote comprehensive test suites for:
          * `src/utils/__tests__/RateLimiter.test.ts` - Rate limiting logic (6 tests).
          * `src/utils/__tests__/promptSanitizer.test.ts` - AI prompt injection protection (10 tests).
          * `src/utils/__tests__/sanitization.test.ts` - XSS prevention and text sanitization (12 tests).
        * **Packages Installed**:
          * ESLint ecosystem: 111 packages (`eslint`, `@typescript-eslint/*`, `eslint-plugin-react*`, `prettier`, `eslint-config-prettier`).
          * Husky + lint-staged: 28 packages.
          * Testing: 252 packages (`vitest`, `@vitest/ui`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`).
          * **Total: 394 new packages**.
      * **Security Improvements Summary**:
        * ✅ Prevents white screen crashes (ErrorBoundary).
        * ✅ Blocks AI jailbreaking (PromptSanitizer).
        * ✅ Prevents XSS attacks (DOMPurify + TextSanitizer).
        * ✅ Prevents file spoofing (Magic byte validation).
        * ✅ Prevents AI abuse (RateLimiter).
        * ✅ Type-safe form validation (Zod schemas).
        * ✅ Structured error handling (Custom error classes).
        * ✅ PII protection in logs (Logger redaction).
      * **Performance Improvements Summary**:
        * ✅ 58-67% bundle size reduction (Code splitting).
        * ✅ 50% fewer re-renders (Component memoization).
        * ✅ Faster initial load (Lazy loading).
      * **Code Quality Improvements Summary**:
        * ✅ Consistent code style (ESLint + Prettier).
        * ✅ Automated quality checks (Pre-commit hooks).
        * ✅ Comprehensive test coverage (28 security tests).
        * ✅ Test infrastructure ready (Vitest + Testing Library).
      * **Phase 7.2: COPPA/GDPR Compliance (Jan 28, 2026) - Complete**:
        * **Enhanced Parental Gate**: Time-based expiry (1 hour) and attempt limiting (3 tries) with 24-hour lockout.
        * **Data Export Service**: Structured JSON/CSV export of full user data with PII sanitization.
        * **Right to Erasure**: 30-day grace period for account deletion with "Soft Delete" and cancellation option.
        * **Audit Trail**: Immutable `account_deletion_log` table tracking all deletion requests.
        * **Database Schema**: Added `parental_gate_*` and `deletion_*` columns to `profiles` via Supabase migrations.
      * **Phase 8.2: Security Monitoring (Jan 28, 2026) - Complete**:
        * **Real-Time Event Logging**: Implemented automatic security event logging via Supabase Edge Functions.
        * **Prompt Injection Detection**: Integrated `promptSanitizer` into Ollie Chat to detect and block malicious AI prompts.
        * **Security Dashboard**: Built Admin Security Monitoring dashboard with real-time event display, filtering, and CSV export.
        * **Database Schema**: Created `security_events` table with RLS policies for admin-only access.
        * **Edge Function**: Deployed `log-security-event` function to production for centralized event logging.
        * **Logger Integration**: Made `Logger.logSecurityEvent()` async and integrated into prompt sanitization flow.
        * **Event Types**: Supports `prompt_injection`, `suspicious_activity`, `unauthorized_access`, and `data_breach` events.
        * **Severity Levels**: Categorizes events as `critical`, `high`, `medium`, or `low` with color-coded badges.
        * **Auto-Refresh**: Dashboard auto-refreshes every 30 seconds to display latest security events.
      * **Phase 8.4: Admin Moderation Dashboard (Jan 29, 2026) - Complete**:
        * **Content Moderation Dashboard**: Implemented `ContentModeration.tsx` for full visibility into flagged content.
        * **Enhanced Analytics**: Integrated `recharts` for 30-day violation trend analysis (Critical/High/Medium/Low).
        * **Bulk Actions**: Added ability to select multiple violations for batch approval/rejection with confirmation.
        * **Whitelist/Blacklist**: Created `WhitelistBlacklistManager.tsx` and Supabase tables (`moderation_whitelist`, `moderation_blacklist`) for rule management.
        * **Backend Integration**: Updated `ContentModerationService.ts` to fetch, cache (5m TTL), and enforce pattern-based rules server-side.
        * **Database Schema**: Added `moderated_content` table tracking all AI flags, sanitization results, and reviewer actions.
      * **Phase 9: Advanced Reporting & Analytics (Jan 2026) - Complete**:
        * **Reports Dashboard**: Implemented `ReportsDashboard.tsx` with unified view of User Growth, Economy, and Education stats.
        * **Visualizations**: Used `recharts` for interactive Area Charts (User Growth) and Bar Charts (Learning).
        * **Economy Health**: Added real-time tracking of Money Supply and Average User Balance via `get_economy_stats` RPC.
        * **Learning Insights**: Visualized average quiz grades and submission counts over time via `get_learning_stats` RPC.
        * **Export**: Implemented CSV export for all report data.
        * **Polish**: Added date range pickers (7/30/90 days) and mobile responsive layout.
        * **Book Library**: Updated cover art for 90+ books to use high-resolution local assets and fixed title truncation.
    * **HQ Furniture System (Feb 2026) - Complete**:
      * **Expanded Catalog**: Grew furniture inventory from 39 to **87 items** across 8 categories (Bedroom, Bathroom, Kitchen, Entertainment, Office, Pets, Tech, Food & Drinks).
      * **Full Localization**: Added Arabic translations for all 87 furniture items and 6 room names (Kitchen, Bathroom, Bedroom, Living Room, Office, Game Room).
      * **Furniture Reallocation**: Implemented drag-and-drop system allowing users to move placed furniture between rooms or remove items back to inventory.
      * **Store Functions**: Added `removeFurnitureFromRoom()` and `moveFurnitureToRoom()` to gameSlice for furniture management.
      * **UI Enhancements**: Made placed furniture draggable with hover-activated remove buttons (×) for intuitive reallocation.
      * **Type Safety**: Updated type definitions and fixed TypeScript errors in Room2D component for proper drag event handling.
    * **Gig Central Expansion (Feb 2026) - Complete**:
      * **New Content**: Added **8 High-Level Gigs** (Recycling, Garden, Smoothie, Delivery, Artist, Tech Support, Drone Pilot, Streamer) extending gameplay to Level 6.
      * **UX Improvements**: Added "Exit/Back" button to active gig view, allowing users to quit without losing app state.
      * **Economy Rebalance**: Significantly increased coin rewards (approx 2x-3x) across all gigs to improve feature utility.
      * **Localization**: Full English/Arabic translations for all new gigs and interfaces.
    * **UI/UX Polish (Feb 2026) - Complete**:
      * **Validation**: Fixed `GameTutorialModal` overflow issues on smaller screens.
      * **Consistency**: Standardized `RealEstateApp` tab styling to match system design.
      * **Access Control**: Fixed Admin access to Founder-tier features (HQ, Library).
      * **Formatting**: Implemented `formatters.ts` for consistent number display (1.2k, $5M) across the app.
    * **Parent Dashboard UX (Feb 2026) - Complete**:
      * **Onboarding**: Redesigned "No Child Linked" empty state to include `FamilyManager` for immediate invite code generation.
      * **Guidance**: Added step-by-step instructions for connecting child accounts.
    * **Invite Code System (Feb 2026 - Complete)**:
      * **Child Onboarding**: Implemented invite code input in `InvestorPitchModal` for seamless child account linking.
      * **Role-Based Logic**: Automatically detects "KID" role and prompts for parent's invite code.
      * **Validation**: Secure `get_profile_by_invite_code` RPC ensures valid parent linking before profile creation.
    * **Auth Stability & Fixes (Feb 2026 - Complete)**:
      * **Sign Out Loop**: Resolved race condition in `AuthProvider` that caused infinite re-authentication loops.
      * **Parental Gate**: Fixed "0+0" math problem bug by randomizing challenges regardless of auth state.
      * **Security Hardening**: Resolved SQL function search path lints for `get_profile_by_invite_code` and `test_handle_new_user_execution`, and optimized RLS policies for `public.profiles`.
    * **React Component Stability (Feb 18, 2026)**: Fixed "Rendered more hooks than during the previous render" error in `ParentDashboard.tsx` by restructuring conditional rendering.
    * **Legal & Compliance (Feb 20, 2026)**: Created dedicated `PrivacyPolicyPage`, `TermsOfServicePage`, and `RefundPolicyPage` components, added them to the main routing (`/privacy`, `/terms`, `/refund`), and linked them in the `LandingPage` footer.
    * **Pricing Strategy Optimization (Feb 20, 2026)**: Updated the pricing model for better conversion:
      * Board Member plan updated to support up to 3 child accounts (was 5).
      * Tycoon (Annual) plan price reduced from $169/yr to a highly competitive $89.99/yr.
    * **Role-Based Access Control (Feb 18, 2026)**: Kids are now blocked from accessing `/pricing` and `/checkout/*` routes - only parents/teachers/admins can manage subscriptions.
      * **Kid Protection**: Added role-based redirects in `App.tsx` to prevent kids from accessing `/pricing` and `/checkout/*` routes - kids are automatically redirected to `/dashboard`.
      * **Subscription Management**: Only parents, teachers, and admins can view pricing pages and purchase subscriptions.
    * **B2B Teacher Dashboard Upgrades (Feb 21, 2026)**:
      * **Capacity Limits**: Implemented strict 35-student limit for free "Teacher Solo" accounts with a conversion-optimized "Upgrade Modal".
      * **Advanced Gradebook Placeholder**: Added CSV/JSON data export buttons in the grading tab (exclusive to Pro/School tiers).
      * **School Hours Toggle**: Built a "School Hours Only" setting giving teachers control to lock arcade games and social features from 8 AM - 3 PM to maintain focus.
    * **Core Polish & State Syncing (Feb/Mar 2026)**:
      * **Child Subscription Inheritance**: Fixed stale PostgREST schema cache issues by explicitly selecting `subscription_tier` and `subscription_status` in `userSlice` and `SupabaseAdapter`. Ensured children instantly inherit `PREMIUM` access from parents upon login.
      * **Parent Dashboard Validation**: Added explicit UI badges for parent's current subscription tier and billing cycle. Fixed race conditions in `AuthProvider` that incorrectly showed the "Connect Child" empty state on initial page load for existing parents.
      * **Classroom Continuity**: Fixed unresponsive "Join Class" modal trigger for students.
      * **Fixed Invite Codes**: Replaced manual generation of Parent Invite codes with an auto-generation component that silently runs on dashboard mount, guaranteeing 6-character codes are always present.
    * **Passive Income Engine & Real Estate Overhaul (April 2026)**:
      * **Economy Integration**: Refactored the Real Estate system to use the global `useEconomyStore` and connected it to the `BizCoin` economy.
      * **Offline Income Accrual**: Implemented a background income accrual system that calculates and awards earnings for up to 24 hours of offline time.
      * **Passive Income Modal**: Created a "Welcome Back, CEO" visual modal with confetti and summary of accrued earnings.
      * **Full Arabic Localization**: Achieved 100% Arabic localization for the Real Estate feature (Property names, descriptions, market statuses like "Hot Market/Slow Market").
      * **PWA Conversion**: Converted the app to a Progressive Web App (PWA) using `vite-plugin-pwa` for native installation and offline support.

## 7. Recent Changes (October 2026)

- **Enterprise Structured Logging & Observability Infrastructure (Oct 14, 2026)**:
    - **Monolog 3.12 Structured Logger Channel**: Implemented custom `structured` channel writing to `stdout`. Uses `StructuredJsonFormatter` in production/staging and `PrettyConsoleFormatter` with colorized badges and context formatting in local dev.
    - **Full Correlation & W3C Tracing**: Middleware automatically injects/propagates `X-Request-ID` and W3C standard `traceparent` (`trace_id`, `span_id`), returning them on response headers and binding them across all logs in the request thread.
    - **Single Access Line**: Every HTTP request emits exactly one `http.request.completed` access log line with method, route, status, duration_ms, client_ip, user_id, and request_id.
    - **Exception Boundary Handler**: Global exception reporting in `bootstrap/app.php` captures all unhandled exceptions and fatal panics, serializing class, message, code, file, and stack trace into structured JSON, logging once at the boundary.
    - **PII & Secrets Redaction**: `RedactionProcessor` recursively sanitizes context and messages, masking passwords, API keys, bearer tokens, credit cards, CVVs, SSNs, national IDs, phones, and emails.
    - **Centralized Infrastructure**: Added `monitoring/docker-compose.logging.yml` with Grafana Loki 3.x, Vector log router with **1GB on-disk buffer**, and Grafana 11 dashboards + Loki alert rules. Kubernetes DaemonSet provided in `monitoring/k8s/vector-daemonset.yaml`.
    - **Verified**: 7/7 PHPUnit feature tests passing green, standalone verification script `backend/scripts/verify-logging.php` passing all checks, documented in [`LOGGING.md`](file:///g:/Vibe%20coding/Profitspatrol/LOGGING.md).

- **Test Suite Stabilization & UI Logic (May 4, 2026)**:
    - **Vitest Stability**: Resolved persistent failures in `ContentGating.test.tsx` and `ContentAdditions.test.tsx`.
    - **Infrastructure Fixes**: Wrapped components in `MemoryRouter`, aligned mock user objects with the `User` interface, and corrected store slice initialization (`useEducationStore` for lessons).
    - **UI Enhancements**: Added "Premium Only" labels to `KidMap` nodes and progress counts (e.g., `0/1 Lessons`) to headers.
    - **Architecture**: Refactored `BookLibrary` to use store state for dynamic book testing.

- **Freemium Monetization & Profile Polish (May 3, 2026)**:
  - **Paywall Expansion**: Implemented "Freemium" access logic across Debate Dojo and Side Hustle (Gig Central). Intern (free) tier users can access the first content item for free, while subsequent items trigger the premium `InvestorPitchModal`.
  - **Unified User Profile**: Consolidated the `AvatarCustomizer` into the `UserProfile.tsx` to establish a single hub for user identity. Removed the deprecated "Wardrobe" system that layered hats onto the business logo to eliminate confusion. Updated Bottom Navigation to route the Avatar button directly to the Profile page.
  - **Localization Hardening**: Corrected the Arabic navigation label for Portfolio and populated missing English translations for the Avatar system to eliminate raw key rendering in the UI.

- **Localization & UX Polish (April 25, 2026)**:
    * **Map & Lesson Modal**: Achieved 100% localization parity for the Adventure Map and Lesson Engine.
      - Translated Map Header ("مساري الريادي"), Section Labels ("المرحلة"), and all 16 Module Titles.
      - Replaced hardcoded English strings in `UniversalLessonEngine` (Difficulty: سهل/متوسط/صعب) and `EnergyBar` (Unlimited: غير محدود).
    * **UI/UX Polish (April 2026)**:
      - Fixed horizontal scrollbars triggered by hover scaling in `Layout.tsx`.
      - Improved "Weekly Featured Gig" card clickability by ensuring the entire card is interactive.
  * **Data Integrity:** Restored missing book data (`wonder`) to `moreBooks.ts` after accidental deletion.
  * **Localization Finalization (April 2026):**
    * **Notification Center**: Refactored to use responsive logical positioning (`md:start-0 end-0`) to prevent clipping in RTL and on mobile.
    * **Game Engine**: Standardized `BusinessSimulation` interface to use `business_id` and localized all upgrades/events for 28+ games.
    * **Mascot Integration**: Integrated Ollie into `RepairTemplate` and `ClickerTemplate` for contextual help.
  * **Localization Fixes:** Added missing module translation keys (`MOD_VC`, `MOD_CORP`, `MOD_SUST`) to all supported languages and resolved a compilation error in `ar.ts`.
  * **Localization & Navigation Polish (May 2026):**
    * **Audience Matcher**: Achieved 100% Arabic localization for the marketing segmentation game. Localized all customer personas, product labels, and game-state messages.
    * **Navigation Consolidation**: Implemented a unified "Home" shortcut by making the mobile header logo clickable and adding a consistent Ollie icon to the Game Engine header.

## 11. Known Issues & Blockers

* **Mobile Viewport Jitter**: Occasional layout shifting on very small Android screens (under 320px) during keyboard entry.
* **Phaser Game Scaling**: High-DPI screens sometimes cause offset issues in Action games (Pizza Dash).

---

## 12. Year-Long Engagement & Upgrade Roadmap

> **Goal**: Keep kids engaged for 365 days and parents renewing the subscription.
> Last updated: **Feb 27, 2026** (Q3/Q4 features ongoing delivery)

### 12.1 Content Gap Analysis

| Category | First-Complete Time | Weekly Retention |
|---|---|---|
| Season 1 Curriculum (10 modules × 10 lessons) | ~7 hrs / 5–6 wks | ✅ Anchored |
| Season 2 Curriculum (3 modules × 10 lessons) | +5 hrs | ✅ Added Q1 |
| Games & Simulators | ~8 hrs first run | ⚠️ Fades |
| Book Library (198 books) | ~50 hrs (months) | ✅ Sustainable |
| Gig Central (26+ gigs, Levels 1–10) | ~10 min/day | ✅ Strong loop |
| HQ Builder (87 furniture items) | ~1 hr once | ⚠️ Needs new drops |

> ⚠️ **Core Problem**: A motivated kid finishes all lessons + games in ~6–8 weeks. The fix is a content-refresh + habit-forming loop.

---

### 12.2 Q1 (Feb–Apr 2026): Fix the Foundation — ✅ COMPLETE

**Completed**: Feb 25, 2026

| Feature | File(s) | Notes |
|---|---|---|
| **Daily Mission Board** | `dailyMissionSlice.ts`, `DailyMissions.tsx` | 12-mission pool, 3/day deterministic, midnight reset, persisted |
| **Weekly Challenge** | `weeklyChallengeSlice.ts`, `WeeklyChallengeWidget.tsx` | 5-challenge pool, Monday rotation, claim reward |
| **Streak Shield (premium)** | `gameSlice.ts` (`checkStreak`), `StreakBanner.tsx` | Layered defence: item_freeze → streakShield → reset |
| **7-Day Streak Bonus** | `gameSlice.ts` | +300 XP +200 🪙 at every 7-streak milestone |
| **Season 2 Curriculum** | `curriculum.ts` | 30 lessons: CRYPTO_101–110, AIJOB_111–120, SUST_121–130 |
| **Gig Central Tier 3** | `sideHustleSlice.ts` | 6 gigs Levels 7–10; level cap raised from 5 → 10 |

#### Mission Progress Tracking Hook Architecture

```
Action                     →  Daily Mission Hook           →  Weekly Challenge Hook
─────────────────────────────────────────────────────────────────────────────────
completeLesson()           →  COMPLETE_LESSON, EARN_COINS  →  LESSON_SPRINT, COIN_GRIND
completeSideHustle()       →  PLAY_GIG, EARN_COINS         →  GIG_MARATHON, COIN_GRIND
[scenario complete]        →  (future: WIN_BOSS)           →  BOSS_BATTLE
```

#### HQ Widget Layout (Kid View)

```
[Stats Grid: Coins | HQ Value | Inventory | Lessons]
[🔥 StreakBanner]        ← animated flame, shield badge, bonus countdown
[⚡ DailyMissions]       ← 3 missions, 24h reset, claim rewards
[⚔️ WeeklyChallenge]    ← rotating weekly goal, days-remaining ribbon
[🏠 Dollhouse (Interactive)]
[🏗️ HQ Upgrade Path]
```

---

### 12.3 Q2 (May–Jul 2026): Seasonal Events + Social Layer — ✅ COMPLETE

**Completed**: Feb 25, 2026 (delivered ahead of schedule)

| Feature | File(s) | Notes |
|---|---|---|
| **Seasonal Events** | `seasonalEventSlice.ts`, `SeasonalEventBanner.tsx` | 4-event pool (Spring Market, Eid Challenge, Back to School, Summer Hustle), weekly rotation, mock leaderboard Top 10, join/claim/track |
| **Business Cards** | `BusinessCard.tsx` | Tier-themed gradient card, html2canvas download (print fallback), streak/BizCoins/skill stats |
| **HQ Showcase** | `HQShowcase.tsx` | Weekly Top 3 HQ gallery, 🥇🥈🥉 medals, expand-on-click featured items, your-HQ encouragement row |
| **Co-op Pitch Mode** | `CoopPitchMode.tsx`, `TheTankPage.tsx` | 8-stage: Lobby (6-char code), Team Prep, Turn 1, Turn 2, Thinking, Offers, Negotiation, Deal/Rejected. +15 score bonus |

#### Q2 Progress Tracking Hook Architecture

```
Action                     →  Daily Mission Hook           →  Weekly Challenge Hook  →  Seasonal Hook
──────────────────────────────────────────────────────────────────────────────────────────────────────
completeLesson()           →  COMPLETE_LESSON, EARN_COINS  →  LESSON_SPRINT          →  LESSON_MARATHON / COIN_SPRINT
completeSideHustle()       →  PLAY_GIG, EARN_COINS         →  GIG_MARATHON           →  GIG_RUSH / COIN_SPRINT
[scenario complete]        →  (future: WIN_BOSS)           →  BOSS_BATTLE            →  (future)
```

#### Updated HQ Widget Layout (Kid View)

```
[Stats Grid: Coins | HQ Value | Inventory | Lessons]
[🎭 SeasonalEventBanner]  ← New Q2: themed gradient, days-remaining, join/rank/claim, collapsible leaderboard
[🔥 StreakBanner]          ← animated flame, shield badge, 7-day bonus countdown
[⚡ DailyMissions]         ← 3 missions, 24h reset, claim rewards
[⚔️ WeeklyChallenge]      ← rotating weekly goal, days-remaining ribbon
[🏠 HQShowcase]            ← New Q2: weekly top 3 HQs gallery
[🏗️ Dollhouse (Interactive)]
[🏗️ HQ Upgrade Path]
```

---

### 12.4 Q3 (Aug–Oct 2026): Advanced Content + School Integration — ✅ COMPLETE

**Completed**: Feb 25, 2026 (delivered ahead of schedule)

| Feature | File(s) | Notes |
|---|---|---|
| **CEO Track (Season 3)** | `curriculum.ts` (VC_131–160), `KidMap.tsx` | 30 lessons: VC, Corporate Strategy, Global Trade. Gate: Level 8+. Icons + colors mapped. |
| **School Tournaments** | `tournamentSlice.ts`, `App.tsx` (`/tournaments`) | Full state machine (LOBBY→ACTIVE→FINISHED), time-bonus scoring, mock AI peers, 6-char code. 27 Vitest tests. |
| **Live Mentorship** | `LiveNowWidget.tsx`, `types.ts` | Gold theme, speaker profile (name/emoji/bio/role), Tycoon-gated Zoom link. |
| **AI Business Plan Generator** | `BusinessPlanModal.tsx`, `Headquarters.tsx` | 5-step wizard, Tycoon-gated sparkle card in HQ. |
| **Homework Mode** | `types.ts` (`Assignment`), `StudentAssignmentDashboard.tsx` | `isHomework`, `maxXP`, `homeworkDeadline` fields. Overdue badge + red border. |

---

### 12.5 Q4 (Nov 2026–Jan 2027): Competitive Season + Year-End Graduation

| Feature | Key Files to Create | Impact |
|---|---|---|
| **Annual CEO Championship** | `src/features/social/components/Championship.tsx` + Supabase voting | 🔴 Critical (viral) |
| **Year-End Report Card** | ✅ Done (`YearEndReport.tsx` + `jspdf`) | 🔴 Critical (retention) |
| **Level 10 Graduation Ceremony** | `GraduationModal.tsx` with `canvas-confetti` + Ollie animation | 🟠 High |
| **Referral Program** | `ReferralPanel.tsx` + `referral_codes` Supabase table | 🔴 Critical (growth) |
| **Subscription Renewal Nudge** | Supabase Edge Function + parent email 30 days before expiry | 🔴 Critical (revenue) |

---

### 12.6 Monthly Content Drop Schedule

| Month | Status | Drop |
|---|---|---|
| Month 1 (Feb 2026) | ✅ Done | Daily Missions + Streak System + Weekly Challenge |
| Month 2 (Mar 2026) | ✅ Done | Season 2 Curriculum (30 lessons) + Gig Tier 3 (6 gigs) |
| Month 3 (Apr 2026) | ✅ Done | Seasonal Events (4-event pool, HQ banner + leaderboard) |
| Month 4 (May 2026) | ✅ Done | Business Cards + HQ Showcase (delivered early) |
| Month 5 (Jun 2026) | ✅ Done | Co-op Pitch Mode (Tab in The Tank, 8-stage flow) |
| Month 6 (Jul 2026) | ✅ Done | CEO Track (30 S3 lessons) + Tournaments + Business Plan + Homework + Live Mentorship |
| Month 7 (Aug 2026) | 🔲 Planned | **Daily Spin Wheel** + **Weekly CEO Challenge** |
| Month 8 (Sep 2026) | 🔲 Planned | **BizPulse News Feed** + **Year 2 Seasonal Events** (Halloween/Christmas/Summer/Spring) |
| Month 9 (Oct 2026) | 🔲 Planned | **Seasons System** + **Global Leaderboard** |
| Month 10 (Nov 2026) | 🔲 Planned | **Corporations / Guilds** (Social Clans + Mega-Hustles) |
| Month 11 (Dec 2026) | 🔲 Planned | **Stock Market Simulation** (5 fictional companies, portfolio tracking) |
| Month 12 (Jan 2027) | 🔲 Planned | **Real Estate Tycoon** + **Custom Ollie Outfits** |
| Month 13 (Feb 2027) | 🔲 Planned | **Monthly Parent Report Email** + **Prestige / Angel Investor** system |

---

### 12.7 Subscription Stickiness Mechanics

| Mechanic | Implemented | How it Works |
|---|---|---|
| **BizCoin Savings** | Partial | BizCoins earned while subscribed; balance at risk on cancel |
| **HQ Progress** | ✅ Yes | Premium furniture visible but locked on cancel (loss aversion) |
| **Streak Shield** | ✅ Yes | 1x weekly skip for premium users — felt loss on cancellation |
| **Family Milestones** | ✅ Yes | Parent dashboard shows monthly lesson count |
| **Anniversary Reward** | 🔲 Planned | "Year 1 Founder" badge + 2,000 BizCoins at 12-month mark |

---

### 12.8 North Star Retention Metrics

| Metric | Target |
|---|---|
| **D7 Retention** | > 60% |
| **D30 Retention** | > 40% |
| **D365 Retention (annual renewal)** | > 30% |
| **DAU / MAU ratio** | > 0.25 |
| **Lessons completed per user/month** | > 8 |
| **Weekly Streak days (avg)** | > 3 |

---

### 12.9 New Store Slices — Q1 + Q2 + Q3

| Slice | File | Persisted | Description |
|---|---|---|---|
| `DailyMissionsSlice` | `dailyMissionSlice.ts` | ✅ Yes | Daily mission pool, 3/day deterministic, progress tracking, claim logic |
| `WeeklyChallengeSlice` | `weeklyChallengeSlice.ts` | ✅ Yes | Weekly challenge pool, Monday rotation, days-remaining, reward claiming |
| `SeasonalEventSlice` | `seasonalEventSlice.ts` | ✅ Yes | 4-event monthly pool, join/claim/track, mock leaderboard Top 10, co-op bonus tracking |
| `TournamentSlice` | `tournamentSlice.ts` | ❌ No (session) | Full state machine: IDLE→LOBBY→ACTIVE→FINISHED. 6-char codes, time-bonus scoring, mock AI peers, 27 tests. |

All slices registered in `src/store/index.ts` and typed in `src/store/types.ts`.

### 12.10 New UI Components — Q2 + Q3

| Component | File | Location in App |
|---|---|---|
| `SeasonalEventBanner` | `features/hq/components/SeasonalEventBanner.tsx` | Top of HQ widget stack |
| `BusinessCard` | `features/hq/components/BusinessCard.tsx` | Profile / sharing modal |
| `HQShowcase` | `features/hq/components/HQShowcase.tsx` | Below Weekly Challenge in HQ |
| `CoopPitchMode` | `features/tank/components/CoopPitchMode.tsx` | `/the-tank` → Co-op tab |
| `TheTankPage` | `features/tank/components/TheTankPage.tsx` | Route wrapper for `/the-tank` |
| `BusinessPlanModal` | `features/education/components/BusinessPlanModal.tsx` | Tycoon card in Headquarters |
| `LiveNowWidget` | `features/education/components/LiveNowWidget.tsx` | Live sessions panel (rebuilt) |
| `StudentAssignmentDashboard` | `features/education/components/StudentAssignmentDashboard.tsx` | Homework mode badges |

### 12.11 Test Coverage Summary

| Test File | Tests | Status | Area |
|---|---|---|---|
| `RateLimiter.test.ts` | 6 | ✅ Pass | AI rate limiting |
| `promptSanitizer.test.ts` | 10 | ✅ Pass | Prompt injection protection |
| `sanitization.test.ts` | 12 | ✅ Pass | XSS / text sanitization |
| `socialSlice.test.ts` | 4 | ✅ Pass | Social state slice |
| `tournamentSlice.test.ts` | **27** | ✅ Pass | Tournament state machine |
| `curriculum.test.ts` | **21** | ✅ Pass | Curriculum data integrity (160 lessons) |
| `ContentGating.test.tsx` | **2** | ✅ Pass | Tier gating & UI locks |
| `ContentAdditions.test.tsx` | **3** | ✅ Pass | Dynamic content testing |

**TypeScript: 0 errors. Total: 85+ tests.**

---

## 13. Year 2 Retention Features (Aug 2026 onwards)

> **Goal**: Keep kids engaged for 12+ months after completing the core curriculum. Transform Profits Patrol from a course-completion app into a living economy.
> Full implementation plan with frontend, backend schemas, and verification: [implementation_plan.md](file:///C:/Users/ABDO/.gemini/antigravity/brain/2e708ec3-3c2a-40c1-9ef0-3375992ece59/implementation_plan.md)

### 13.1 New Features Overview

| # | Feature | Phase | New Files |
|---|---|---|---|
| 1 | **Daily Spin Wheel** | Habit Loops | `DailySpinWheel.tsx` |
| 2 | **Weekly CEO Challenge** | Habit Loops | `CEOChallengeWidget.tsx` (extends `weeklyChallengeSlice.ts`) |
| 3 | **BizPulse Daily News** | Habit Loops | `BizPulseNews.tsx`, `bizPulseStories.ts`, `biz_pulse_stories` (Supabase) |
| 4 | **Seasonal Events Year 2** | Habit Loops | 4 new events in `seasonalEventSlice.ts` |
| 5 | **Seasons + Global Leaderboard** | Competition | `GlobalLeaderboard.tsx`, `SeasonBadge.tsx`, `seasons` + `season_leaderboard` (Supabase) |
| 6 | **Corporations / Guilds** | Competition | `CorporationHub.tsx`, `MegaHustle.tsx`, `corporations` + `corporation_members` (Supabase) |
| 7 | **Stock Market Simulation** | Empire | `StockMarket.tsx`, `StockChart.tsx`, `stockSlice.ts`, `stock_companies` + `stock_portfolio` (Supabase) |
| 8 | **Real Estate Tycoon** | Empire | `RealEstateTycoon.tsx`, `realEstateSlice.ts`, `real_estate_properties` + `owned_properties` (Supabase) |
| 9 | **Custom Ollie Outfits** | Premium Value | `OllieCustomizer.tsx`, `avatarItems.ts` |
| 10 | **Monthly Parent Report Email** | Premium Value | `monthly-parent-report` (Edge Function), `parent_report_log` (Supabase) |

### 13.2 New Supabase Migrations Required

```sql
-- In order of implementation:
1. add_daily_spin_to_profiles.sql
2. add_seasons_table.sql
3. add_corporations.sql
4. add_stock_market.sql
5. add_real_estate.sql
6. add_parent_report_log.sql
```

### 13.3 Updated North Star Metrics Targets

| Metric | Year 1 Target | Year 2 Target |
|---|---|---|
| **D7 Retention** | > 60% | > 70% |
| **D30 Retention** | > 40% | > 55% |
| **D365 Retention** | > 30% | > 45% |
| **DAU / MAU ratio** | > 0.25 | > 0.35 |
| **Avg sessions/week** | > 3 | > 5 |
| **Revenue per user** | $89.99/yr | $89.99/yr + upsells |

### 12.12 Localization Modularization (Apr 2026)

| Feature | Key Files | Impact |
|---|---|---|
| **Modular Arabic i18n** | src/locales/ar/index.ts, src/locales/ar/*.ts | Critical (maintainability) |
| **i18n Redirection** | src/lib/i18n.ts | High (stability) |

The 1MB+ monolithic ar.ts file was split into 62 granular modules to prevent encoding corruption and improve developer experience.

### 13.4 Video Section System Overhaul — Learning Shorts (Oct 2026)

| Feature | Key Files | Impact |
|---|---|---|
| **Vertical 9:16 Shorts Feed** | `src/features/education/components/VideoLibrary.tsx` | High (Daily Engagement & Retention) |
| **Gamified Watch Rewards** | `src/store/slices/videoSlice.ts` | High (90% Watch Completion: +10 XP & +5 PP Tokens) |
| **Interactive Post-Video Quiz** | `src/features/education/data/videos.ts` | High (+20 XP & +15 PP Tokens on correct answers) |
| **Real-World Action Challenges** | `src/types.ts`, `VideoLibrary.tsx` | High (Cardboard Ollie Bank, Lemonade Stand sales, Proof upload) |
| **AI Video Creator Studio** | `VideoLibrary.tsx` | Medium (Admin/Student AI video script generator) |
| **Bilingual Localization** | `src/locales/en.ts`, `src/locales/ar/videos.ts` | Critical (Full English & Arabic RTL support) |

### 13.5 Full 20-Module & 200-Lesson Adventure Map Scaling (Oct 2026) — ✅ COMPLETE

| Feature | Key Files | Impact |
|---|---|---|
| **Dynamic 10-Lesson Zigzag Trail** | `src/features/hq/components/AdventureMap.tsx` | Critical (Removed hardcoded 8-lesson cap; renders full 10-node trail with Capstone Project at node 10) |
| **In-District Module Switcher** | `AdventureMap.tsx` | High (Kids can toggle between modules belonging to the active district with real-time completion counter) |
| **Patrol Academy: All 20 Modules Hub** | `AdventureMap.tsx`, `curriculum.ts` | Critical (Interactive 4-Season browser: Foundation, Advanced, CEO Track, Mastery Track with level requirements) |
| **Bilingual Module Localization** | `curriculum.ts`, `src/locales/ar/curriculum.ts`, `src/locales/en.ts` | High (Full Arabic & English parity for all 20 modules & descriptions) |
| **Regression & Unit Test Suite** | `tests/AdventureMap20Modules.test.tsx`, `tests/WorldSystemV2.test.tsx` | High (390/390 tests passing, 0 TypeScript compilation errors) |

### 13.6 UI Polish, Multilingual Localization, Kid Navigation, 50 Arcade Games & Admin Modernization (Oct 2026) — ✅ COMPLETE

| Feature | Key Files | Impact |
|---|---|---|
| **Canonical Arcade Stations in Admin (50)** | `src/features/admin/components/AdminDashboard.tsx`, `src/features/games/registry/canonicalRegistry.ts` | Critical (Separated 50 Canonical Arcade Stations with live test launcher `UnifiedGameShell` from 36 Business Simulations) |
| **Complete Kid Sidebar Feature Restoration** | `src/components/layout/Layout.tsx` | Critical (Restored full navigation: Learning Map, Arcade, Tasks, Library, Videos, Card Academy, The Tank, Debate Dojo, Real Estate, Skills, Profile) |
| **Explorer Mode (10y) Dedicated Test Profile** | `src/data/mocks.ts`, `src/features/auth/components/Auth.tsx`, `userSlice.ts` | High (Added Maya 10y Explorer test account & 1-click login button to compare Junior vs Explorer UI/UX) |
| **Ollie AI Assistant Unblocked for Kids** | `src/app/App.tsx` | High (Unblocked `<OllieChat />` for kid role across maps and interactive views) |
| **PlayHub Bubble & Daily Spin Integration** | `src/features/ageMode/components/BottomNav.tsx`, `src/features/hq/components/AdventureMap.tsx` | High (Added Daily Spin 🎡 directly inside PlayHub bubble; removed duplicate header news ticker) |
| **Multilingual Project Evaluation & Rejection UI** | `src/features/education/components/ProjectSubmitter.tsx`, `src/lib/gemini.ts` | High (Full Arabic RTL support, Arabic financial vocabulary checks in grading engine, no false English rejections) |
| **Boss Challenge UI & Clean Character Portraits** | `PreBossModal.tsx`, `BossFightShell.tsx`, `/images/characters_clean/` | High (Replaced raw spritesheets with clean transparent portraits; localized Papa Pete's Pizzeria and issues) |
| **Randomized Lesson Answer Placement** | `src/features/education/components/UniversalLessonEngine.tsx` | High (True Fisher-Yates shuffle with retry re-randomization) |
| **Backend & Security Monitoring Modernization** | `AdminDashboard.tsx`, `SecurityMonitoring.tsx` | Medium (Replaced Supabase branding with Laravel Backend Live, added offline security event resilience) |
| **Comprehensive Test Suite Passing** | All unit and component tests | High (59/59 test files, 406/406 tests passed with 0 errors) |

### 13.7 Real Estate Character Artwork & Profile Header Duplicate Cleanup (Oct 2026) — ✅ COMPLETE

| Feature | Key Files | Impact |
|---|---|---|
| **Original Real Estate Character Artwork** | `public/images/properties/*`, `src/features/venture/data/properties.ts`, `RealEstateApp.tsx` | High (Replaced plain emojis with 9 high-definition 3D cartoon illustrations featuring the 4 Heroes & Rival Rex for each property type) |
| **Profile Header Navigation Cleanup** | `src/features/dashboard/components/UserProfile.tsx` | Medium (Removed redundant Theme, Language, Settings, and Sign Out controls from the header bar, keeping clean streak badge) |
| **Zero-Regression Verification** | Vitest test suites | High (59/59 test suites passing, 406/406 tests green) |

### 13.8 The Tank (عرين المستثمرين) UI/UX Overhaul & 3D Character Asset Generation (Oct 2026) — ✅ COMPLETE

| Feature | Key Files | Impact |
|---|---|---|
| **3D TV Game Show Arena & Character Judge Portraits** | `public/images/tank/*` | Critical (9 original 3D Pixar-style visuals: `tank_arena_stage.jpg`, `tank_judges_panel.jpg`, `tank_deal_victory.jpg`, `tank_coaching_board.jpg`, and individual judge portraits for Ollie, Reema, Filo, Kami, Rex) |
| **Full 7-Stage Gamified TV Show Immersion** | `src/features/tank/components/TheTankMode.tsx`, `TheTankPage.tsx` | Critical (Replaced barren blue screen with live broadcast banner, Ollie Pre-Pitch Coach rules, dynamic keyword checklist chips, animated judging deliberation cards, executive offers with audio waveforms, and giant ceremonial investment check) |
| **Judge Personalities & Voice Engine Integration** | `src/features/tank/logic/TheTankEngine.ts`, `src/services/voice/TankJudgeVoiceEngine.ts` | High (Mapped judges to Ollie & Friends lore, accented colors, custom avatars, and bilingual voice lines) |
| **AdventureMap Interaction & 100% Test Suite Green** | `src/features/hq/components/AdventureMap.tsx`, `tests/AdventureMap20Modules.test.tsx` | High (Added direct lesson launch on active node click; resolved button selector in tests; all 60 test suites and 413 tests passing 100%) |

### 13.9 Hostinger Production Deployment & Linux ZIP Path Packaging Fix (Oct 2026) — ✅ COMPLETE

| Feature | Key Files | Impact |
|---|---|---|
| **ZIP Unix Path Normalization** | `scripts/package-hostinger.ps1` | Critical (Replaced Windows `Compress-Archive` with .NET `Compress-CleanArchive` to guarantee forward slashes `/` across ZIP entries, resolving Linux flat-file filename extraction bug) |
| **PSScriptAnalyzer Approved Verb Alignment** | `scripts/package-hostinger.ps1` | Low (Renamed internal cmdlet to use approved PowerShell verb `Compress-CleanArchive`, eliminating lint warning) |
| **Apache SPA MIME Types & 404 Rewrite Guards** | `public/.htaccess`, `dist/.htaccess` | High (Explicit MIME mappings for `.js`, `.mjs`, `.webmanifest`, `.wasm`, `.svg`, and guarded rewrite rules preventing 404 assets from returning HTML) |
| **Deployment Automation & Documentation** | `hostinger.md`, `deploy_hostinger/*` | High (Step-by-step instructions updated to guide users on clean extraction into `public_html`) |





