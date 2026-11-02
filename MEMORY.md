# ✅ ProfitsPatrol — Project Memory

> This file tracks all upgrade steps taken, in-progress, and remaining. Update this file at the end of every session.
> Last Updated: 2026-10-26

---

## 🛠 Project Setup

| Item | Detail |
|------|--------|
| **Dev Server** | `npm.cmd run dev` — `http://localhost:5173` |
| **Run Command** | Must use `npm.cmd` (not `npm`) due to PowerShell execution policy |
| **Backend API** | Laravel 13 REST API (`http://localhost:8000/api/v1`) + Local SQLite (`backend/database/database.sqlite`) |
| **Logging & SRE** | Central Structured Monolog (`LOG_CHANNEL=structured`, `LOG_FORMAT=pretty|json`) + Vector (1GB disk buffer) + Grafana Loki 3.x (30-day retention) + Grafana 11 |
| **Monitoring Stack** | `docker-compose -f monitoring/docker-compose.logging.yml up -d` (Loki `:3100`, Vector `:8686`, Grafana `:3000`) |
| **Framework** | React 19 + Vite 7 + TailwindCSS 3 + i18next + Zustand + Framer Motion |

---

## ✅ Steps Completed

- [x] **2026-11-02** — **Video Library (`/videos`) Full UI Alignment with App DNA**:
    - **1. Mode Tabs Navigation Header**:
        - Replaced flat unstyled `<nav>` and thin `btn--ghost` buttons with a cohesive gamified segmented controller (`bg-amber-100/70 dark:bg-slate-950/90 p-1.5 rounded-2xl border-2 border-amber-200/90 shadow-inner`).
        - Active tab features vibrant 3D bottom bevel (`bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-[0_4px_0_#b45309] scale-[1.02]`).
        - Upgraded header icon badge with amber-to-orange gradient and 3D shadow.
    - **2. Watch Quests Tab (`quests`) Transformation**:
        - **Daily Mystery Chest Banner**: Replaced dark metallic card with a warm, inviting gamified chest card (`border-4 border-amber-300 dark:border-amber-500/40 bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 text-white shadow-[0_10px_0_#b45309]`) featuring the canonical 3D chest icon (`/icons/3d/chest.png`) and ambient radial glows.
        - **3D Claim Reward Button**: Upgraded to a chunky action button with 3D bevel (`shadow-[0_5px_0_#b45309]`), pulse animation when ready, and high-contrast disabled state.
        - **Progress Gauges**: Replaced thin 12px bars with chunky 3D energy bars with distinct emerald & cyan/indigo fills, clear percentage badges, and icons.
        - **Lifetime Video Stats Grid**: Converted 4 plain white boxes into signature 3D stat cards (`card-juicy` with `shadow-[0_6px_0_...]`), vibrant themed icons (`Film`, `Brain`, `Heart`, `Bookmark`), and bold typography.
    - **3. AI Video Studio Tab (`aiStudio`) Transformation**:
        - **Card Container**: Upgraded to `card-juicy` (`rounded-[32px] border-3 border-amber-200/90 shadow-[0_8px_0_#f1f5f9] dark:shadow-[0_8px_0_#0f172a]`) with sparkling badge header.
        - **Topic Input & Example Chips**: Added chunky 3D borders (`border-3 border-slate-200 dark:border-slate-700 focus:border-amber-500 shadow-inner`), clear button, and warm juicy suggestion capsules (`shadow-[0_2px_0_#fde68a]`).
        - **3D Mascot Picker**: Replaced thin plain boxes with rich 3D character cards (`Ollie`, `Reema`, `Filo`, `Kami`) featuring canonical transparent PNG artwork (`/images/characters_clean/`), floating checkmark badge when selected, and 3D bottom bevel (`shadow-[0_6px_0_#d97706]`).
        - **Difficulty Selector**: Segmented chunky 3D buttons with active state bottom bevels (`shadow-[0_4px_0_#b45309]`).
        - **3D Hero Generate Button**: Replaced pale disabled-looking button with a vibrant, high-contrast action button (`btn-juicy bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 shadow-[0_5px_0_#4338ca] text-white active:translate-y-1 active:shadow-none`).
    - **4. Verification**:
        - TypeScript checked with 0 errors (`npx.cmd tsc --noEmit`).
        - Vitest suites `tests/ContentGating.test.tsx` and `tests/AdminAllLevelsUnlocked.test.tsx` passed (12/12 tests green).

- [x] **2026-11-02** — **Boss Fight Solid Opaque Background (Zero Map Bleed-through)**:
    - **1. Root Cause**:
        - `BossFightShell.tsx` and `PreBossModal.tsx` used partial alpha values (`from-amber-50/80 via-orange-50/30`, `bg-white/85`, `bg-white/80`) on the full-screen container, causing the underlying AdventureMap, path nodes, and sidebars to show through the modal background.
    - **2. The Fix**:
        - Replaced all transparent alpha gradients with solid, 100% opaque backgrounds (`bg-[#faf8f5] dark:bg-[#070b16]` with solid gradients `from-[#fffbeb] via-[#fff7ed] to-[#f8fafc]` in light mode, and `from-[#0b1120] via-[#0c1527] to-[#070b16]` in dark mode).
        - Converted header and arena containers to solid `bg-white dark:bg-slate-900` without alpha transparency.
    - **3. Verification**:
        - Vitest suite `tests/AdminAllLevelsUnlocked.test.tsx` passed 6/6 tests.


- [x] **2026-11-02** — **Book Covers Visibility & Loading Resolution (100% Local)**:
    - **1. Root Cause 1: Phantom WebP Decoding Failure in SmartImage**:
        - In `src/components/ui/SmartImage.tsx`, an optimization wrapped every image in `<picture><source srcSet={src.replace(/\.(png|jpe?g)$/i, '.webp')} type="image/webp" /><img ... onError={() => setError(true)} /></picture>`.
        - Because only 3 out of 209 books have `.webp` siblings in `public/images/books/`, modern browsers (Chrome, Brave, Edge) selected the `<source>` tag and requested the non-existent `.webp` file.
        - In Vite SPA dev/preview (and SPA routing hosts), non-existent asset requests fall back to `index.html` with `Content-Type: text/html`.
        - The browser failed to decode HTML as WebP, which immediately triggered `onError` on the `<img>` element.
        - `SmartImage` set `error = true`, swapping every valid `.jpg` image for the generic gradient placeholder rectangle with an open-book icon.
    - **2. Root Cause 2: External OpenLibrary URLs**:
        - In `src/features/library/data/classicBooks.ts`, 19 top bestseller books used external `https://covers.openlibrary.org/b/isbn/...` URLs that were slow, rate-limited, and vulnerable to 404s.
    - **3. The Fix**:
        - Updated `SmartImage.tsx` to directly load the real image with standard `<img>`, adding an `useEffect` to reset `error` whenever `src` changes.
        - Patched the 19 external books in `classicBooks.ts` to their corresponding, high-res local image files in `public/images/books/` (e.g. `think-and-grow-rich.jpg`, `mindset.jpg`, `7-habits.jpg`, `atomic-habits.jpg`, `win-friends.jpg`, etc.).
    - **4. Verification**:
        - `scripts/check-missing-covers.mjs` verifies 198/198 book entries (100%) are local and verified present on disk.
        - `curl.exe -I http://localhost:5173/images/books/the-little-engine-that-could.jpg` returns HTTP 200 JPEG (68KB).
        - TypeScript checked with 0 errors (`npx.cmd tsc --noEmit`).
        - Vitest suite `tests/ContentGating.test.tsx` and `tests/AdminAllLevelsUnlocked.test.tsx` passed 12/12 tests.


- [x] **2026-11-02** — **Boss Battle Theme & UI Full Alignment with Profits Patrol App DNA**:
    - **1. Visual DNA & Theme Alignment**:
        - Replaced hardcoded `bg-slate-900` dark void with seamless light/dark mode support matching the platform tokens (`bg-gradient-to-b from-amber-50/80 via-orange-50/30 to-slate-100 text-slate-800` in light mode, `dark:bg-gradient-to-b dark:from-slate-950 dark:via-[#0c1527] dark:to-[#070b16] dark:text-slate-100` in dark mode).
        - Upgraded header with a tactile 3D back button (`shadow-[0_3px_0_#cbd5e1]`), a playful "Days Remaining" HUD pill capsule with glowing 3D stars, and a circular rescue progress meter with emerald ring.
    - **2. Interactive 3-Way Arena Stage**:
        - Redesigned confrontation zone into an immersive arena featuring Ollie the Coach (`/images/characters_clean/ollie_idle.png`) with dynamic context-aware tactical advice, the Central Crisis Boss card with 3D bottom bevels and reactive emotions (`🤩` impressed, `😰` bumped), and Rival Rex (`/images/characters_clean/rex_idle.png`) with playful rival commentary.
    - **3. Tactile 3D Financial Vitals HUD**:
        - Transformed dull metric blocks into chunky 3D stat cards: Available Cash (`الرصيد المتبقي`) with money/wallet icon and green/emerald depth (`shadow-[0_4px_0_#a7f3d0]`), and Daily Burn Rate (`الخسارة اليومية`) with animated flame icon and danger/safety indicators.
    - **4. Tactical Turnaround Decision Cards**:
        - Converted flat decision rows into interactive gaming action cards with smart contextual icons (`Wrench`, `Users`, `Megaphone`, `AlertCircle`), clear impact badges (`✨ تخفيض الخسارة: -$X/يوم`), and 3D coin action buttons with pressed states (`shadow-[0_3px_0_#d97706]`), plus graceful disabled states for unaffordable items.
    - **5. Enhanced PreBossModal & BossResultModal**:
        - Aligned `PreBossModal` and `BossResultModal` with canonical character artwork (`/images/characters_clean/`), 3D chunky buttons (`btn-juicy`), and full light/dark theme adaptation.
    - **6. Automated Verification**:
        - TypeScript compiled cleanly with 0 errors (`npx.cmd tsc --noEmit`).
        - Vitest suite `tests/AdminAllLevelsUnlocked.test.tsx` passed 6/6 tests.
        - Regression tests `tests/AdventureMap20Modules.test.tsx` and `tests/ContentGating.test.tsx` passed 9/9 tests.


- [x] **2026-10-28** — **Project Icon Visibility & Boss Fight Interactive Execution**:
    - **1. My Venture ("مشروعي") Icon Fix**:
        - **Root Cause**: The icon bubble in `AdventureMap.tsx` used `/icons/3d/shark.png` inside `theme-blue` (`#e3f6ff`), which had faint grey pixels with high transparency, rendering as completely blank/invisible in the browser. Furthermore, a shark represented "The Tank" rather than the parent "مشروعي" (My Project / My Venture) category.
        - **Fix**: Replaced the icon in both desktop sidebar (line 826) and mobile navigation drawer (line 1957) with a vibrant, high-contrast 3D rocket bubble using `linear-gradient(135deg, #0284c7 0%, #2563eb 100%)` and `<Rocket size={18} className="text-white drop-shadow-sm" />`.
    - **2. Boss Fight Clickability & Flow Execution Fix**:
        - **Root Cause**: The boss node container had `z-10` and its tooltip had `z-30`, while the transparent dismissal backdrop had `fixed inset-0 z-40`. As soon as the user hovered over the boss node, `activeTooltipNodeId` was set to `'boss_node'`, immediately mounting the `z-40` backdrop across the entire viewport. Because the backdrop was higher in the stacking context than both the boss node (`z-10`), its tooltip (`z-30`), and the sidebars (`z-auto`), any click on "قتال الزعيم" or "مواجهة الزعيم" hit the invisible backdrop, closing the tooltip and never triggering `setPreBossModalOpen(true)`.
        - **Fix**:
            - Set boss node container to `${activeTooltipNodeId === 'boss_node' ? 'z-50' : 'z-10'}`.
            - Elevated the boss tooltip card to `z-50`.
            - Lowered the canvas backdrop to `z-30` so active nodes and tooltips sit cleanly above it.
            - Added `relative z-40` to `aside.sidebar` and `aside.app-right` to ensure sidebar actions are never occluded by map overlays.
            - Bound `e.stopPropagation()`, `setActiveTooltipNodeId(null)`, and `setPreBossModalOpen(true)` on the tooltip button ("قتال الزعيم"), the boss node button, and the sidebar button ("مواجهة الزعيم").
    - **3. Verification**:
        - Expanded test suite in `tests/AdminAllLevelsUnlocked.test.tsx` to verify the "مشروعي" rocket icon renders and clicking the boss fight triggers `PreBossModal` and starts `BossFightShell` (6/6 tests passed).
        - Ran regression tests: `tests/AdventureMap20Modules.test.tsx` (3/3 passed), `tests/ContentGating.test.tsx` (6/6 passed).
        - TypeScript checked with 0 errors (`npx.cmd tsc --noEmit`).
        - Dev server responding on `http://localhost:5173/`.

- [x] **2026-10-28** — **Admin All Levels Unlocked & Dev Server Execution**:
    - **1. Admin Full Level & Curriculum Access**:
        - In `AdventureMap.tsx`:
            - `isDistrictUnlocked`: Admins bypass previous district completion requirements; all 5 districts are immediately unlocked.
            - `isBossUnlocked`: Admins have instant access to District Boss challenges (`isAdmin || isBossBeaten || allDistrictLessonsCompleted`), with the stage button active and displaying "Fight Boss" / "مواجهة الزعيم".
            - Lesson nodes in path: All lesson nodes render as active and unlocked with the district theme color and lesson number (`1..10`), eliminating lock padlocks and `node--locked` styles for admin accounts.
            - Direct lesson start: Clicking any level node directly opens and launches the lesson (`onStartLesson`) without progression gating.
            - `handleLockedClick`: Early-returns for admin so no lock toasts or warning shakes are triggered.
        - In `mocks.ts` & `userSlice.ts`:
            - Configured `MOCK_ADMIN` with `level: 100`, `xp: 1_000_000`, `ppTokens: 1_000_000_000`, and `subscriptionTier: 'tycoon'`.
        - In `FullMapSheet.tsx` & `GameMenu.tsx`:
            - All 20 curriculum modules and all 50 arcade stations / simulations are unlocked for admin with zero paywall lockouts.
    - **2. Automated Verification & Test Suite**:
        - Created `tests/AdminAllLevelsUnlocked.test.tsx` verifying admin level 100 stats, unlocked lesson path, unlocked boss platform, full map sheet, and game menu access (5/5 passed).
        - Verified `tests/AdventureMap20Modules.test.tsx` and `tests/ContentGating.test.tsx` pass 100% green.
        - `npx.cmd tsc --noEmit` verified clean with 0 errors.
    - **3. Dev Server Running**:
        - Dev server started via `npm.cmd run dev` and verified responding with HTTP 200 on `http://localhost:5173/`.

- [x] **2026-10-26** — **Production Build Crash Fix (`chunk-admin-*.js` TDZ Circular Dependency Elimination)**:
    - **1. Root Cause Identified**:
        - On production load, a white screen occurred with `Uncaught ReferenceError: Cannot access 'o' before initialization at chunk-admin-*.js`.
        - In `vite.config.ts`, `manualChunks` grouped `/features/admin/`, `/features/dashboard/`, and `/features/social/` into a single coarse chunk (`chunk-admin`).
        - `zustand` and `src/store/` lacked explicit manual chunks. Rollup bundled `zustand` into `chunk-games`, while bundling shared stores (`useEconomyStore`, `calculatePropertyIncome`) into `chunk-admin` because `UserProfile` and `ParentDashboard` imported `YearEndReport`.
        - `AdminDashboard.tsx` (in `chunk-admin`) statically imported `GameEngine`, `UnifiedGameShell`, and `CANONICAL_ARCADE_GAMES` from `chunk-games`.
        - `RealEstateTycoon.tsx` (in `chunk-games`) imported `useEconomyStore` from `chunk-admin`.
        - When `index` initialized, `chunk-admin` imported `chunk-games` while `chunk-games` imported `chunk-admin`, causing `o` (`create` from `zustand`) to be accessed in the Temporal Dead Zone (TDZ).
        - Additional cycles existed between `src/store/index.ts` barrel re-exports and slices, and between `GameRunner.tsx` and `Batch04-10` games.
    - **2. Refined `manualChunks` in `vite.config.ts`**:
        - Isolated `zustand` into a dedicated `vendor-state` chunk.
        - Isolated `src/store/` into a dedicated `chunk-store` chunk.
        - Separated `chunk-admin` (`src/features/admin/`), `chunk-dashboard` (`src/features/dashboard/`), and `chunk-social` (`src/features/social/`).
        - Excluded static `data/` modules from feature chunks so state slices do not pull UI components into the store graph.
    - **3. Decoupled Admin Components from Game/Education Chunks**:
        - Converted static imports of `GameEngine`, `UnifiedGameShell`, and `RubricEditor` in `AdminDashboard.tsx` to `React.lazy` wrapped in `<React.Suspense>`.
    - **4. Eliminated Barrel Index Imports in Admin Components**:
        - Extracted `useAppStore` into dedicated `src/store/useAppStore.ts` to bypass the `src/store/index.ts` barrel.
        - Updated `AdminDashboard.tsx`, `AdminBookManager.tsx`, and `AdminLiveSessionManager.tsx` to import directly from `src/store/useAppStore`.
    - **5. Broken Store Slice & Batch Game Cycles**:
        - Created `src/store/economyTypes.ts`, `src/store/educationTypes.ts`, and `src/store/socialTypes.ts` to break cycle between store definitions and slices.
        - Converted slice interface imports in `src/store/types.ts` and `AppState` imports in all 12 slices to `import type`.
        - Moved `GameResult` type into `src/features/games/types.ts` and updated all `Batch04-10` games.
    - **6. Verification**:
        - `npm.cmd run build` passed cleanly with 0 TypeScript errors and full Vite minification in 1m 58s.
        - `npm.cmd run preview -- --port 4173` verified with browser agent: 0 console errors, 0 uncaught exceptions, and homepage rendered cleanly without blank screens.

- [x] **2026-10-26** — **Unified Game Shell Bilingual Localization (Arabic & English)**:
    - **1. Game Shell HUD & Controls Localization**:
        - Added comprehensive Arabic & English translation keys for all arcade HUD labels, pause/resume modals, action controls (`space`, `arrows`, `drag`, `match`, `tap`), difficulty tags (`rookie`, `founder`, `tycoon`), and 8 district themes.
        - Updated `UnifiedGameShell.tsx`, `src/locales/ar/games.ts`, `src/locales/ar/common.ts`, and `src/locales/en.ts`.
    - **2. Automated Verification**:
        - Verified 11/11 tests passing in `tests/games/` test suite.

- [x] **2026-10-19** — **Educational Videos & Shorts Section Overhaul, Full Character Artwork Integration & Zero-Emoji Modernization**:
    - **1. Full Replacement of Emojis with Canonical Character Assets**:
        - Mapped all character mentors (`Ollie`, `Reema`, `Filo`, `Kami`, `Rex`) in `VideoLibrary.tsx` to their clean transparent PNG artwork in `/images/characters_clean/` (`ollie_idle.png`, `reema_idle.png`, `filo_idle.png`, `kami_idle.png`, `rex_idle.png`) with localized Arabic/English titles and roles.
        - **Shorts Player**: Replaced emoji stage avatars and host circles with high-res mascot artwork in glassmorphism containers with animated bounce and character role badges.
        - **Explore Grid & Up Next**: Updated video thumbnail fallbacks and author tags to render circular character portraits instead of emojis.
        - **AI Studio**: Completely eliminated emojis (`🦉`, `🍋`, `🦊`), replacing the mentor selector with 4 responsive character cards featuring real transparent artwork, Arabic names (`أولي`, `ريما`, `فيلو`, `كامي`), and localized roles.
        - **Modals & Badges**: Replaced all remaining raw emojis (`🧠`, `🏆`, `🎉`) in quiz/challenge modals and toasts with Lucide icons (`Brain`, `Trophy`, `Sparkles`, `CheckCircle`).
    - **2. Iframe Elimination & Native Interactive Canvas Animation for All Catalog Videos**:
        - Added full 5-scene `animationConfig` configurations with bilingual captions (Arabic & English), sound effects (`coin`, `success`, `click`), and visual types for `vid_1` (How Money Works), `vid_2` (Think Like a CEO), and `vid_3` (Lemonade Stand Strategy).
        - Fixed the broken document icon issue on narrow mockups by ensuring 100% of videos in the library can render natively through the animated canvas without depending on external YouTube iframes.
    - **3. Bilingual Localization & UI Polish**:
        - Replaced hardcoded English AI Studio prompt chips with localized Arabic suggestion pills (`كيف تبدأ مشروعك التجاري الأول؟`, `ليه التضخم بيخلي أسعار الحلويات تزيد؟`, `3 أسرار للتفاوض على مكافأة المهام والواجبات`, `الفرق السري بين الاحتياجات والرغبات`).
        - Cleaned tab titles in `src/locales/ar/videos.ts` and `src/locales/en.ts` to remove emoji prefixes and match the app's clean cyberpunk aesthetic.
    - **4. Verification & Testing**:
        - Vitest test suite `tests/education/learningShorts.test.ts` passing 5/5 green in 4.6s.
        - Browser walkthrough completed with screenshots verifying all 4 tabs (Shorts player, Explore grid, Daily Quests, AI Studio) and modals render cleanly.

- [x] **2026-10-18** — **Hostinger Live Deployment Fix (MIME Type & Unix Path Separator Normalization)**:
    - **Root Cause Identified**: Windows PowerShell's default `Compress-Archive` cmdlet compressed archives using Windows backslashes (`\`) in entry names (`assets\index-*.js`, `favicon\site.webmanifest`). When extracted on Linux (Hostinger), Linux treats `\` as part of the filename, creating flat files instead of subdirectories. Consequently, Apache `.htaccess` rewrite rules couldn't find `/assets/` and served `index.html` (MIME `text/html`) as fallback, which browsers rejected for module scripts.
    - **Fix 1 (`scripts/package-hostinger.ps1`)**: Created `Compress-CleanArchive` using .NET `System.IO.Compression.ZipArchive` to strictly normalize all entry paths to forward slashes (`/`), ensuring seamless directory extraction on Linux. Used PowerShell approved verb `Compress` to comply with PSScriptAnalyzer rules.
    - **Fix 2 (`public/.htaccess` & `dist/.htaccess`)**: Added explicit MIME types (`.js`, `.mjs`, `.webmanifest`, `.wasm`, `.svg`, `.json`) and added rewrite conditions preventing missing static assets from being rewritten to `index.html`.
    - **Fix 3 (`hostinger.md`)**: Updated deployment guide with instructions on cleaning old flat files in `public_html` before extracting.
    - **Verification**: Verified zero backslashes across all 1,400 frontend entries and 14,477 backend entries in `deploy_hostinger/1_frontend_public_html.zip` and `deploy_hostinger/2_backend_api.zip`.

    - **1. Central Structured Logger & Formatter Engine (`backend/app/Logging/`, `AppLogger.php`)**:
        - Replaced ad-hoc logging with Monolog 3.12 custom structured logging channel (`structured`).
        - `StructuredJsonFormatter.php`: Produces strict, single-line JSON in staging and production with mandatory fields: `timestamp` (UTC ISO-8601 with millisecond `Z`, e.g. `2026-10-14T07:28:46.282Z`), `level`, `service`, `env`, `version` (git SHA), `event` (dot-notation), `message`, `request_id`, `trace_id`, `span_id`, `user_id`, `tenant_id`, `context`, and `exception`.
        - `PrettyConsoleFormatter.php`: Produces colorized console output with status badges and highlighted JSON context for local terminal developer experience (`LOG_FORMAT=pretty`).
        - `AppLogger.php`: Unified logging facade providing type-safe helper methods: `debug()`, `info()`, `warn()`, `error()`, `fatal()`, `security()`, `outbound()`, and `access()`.
    - **2. Request Correlation & Access Middleware (`RequestCorrelationMiddleware.php`)**:
        - Automatically reads incoming `X-Request-ID` or generates a UUIDv4, binds it to thread-scoped `CorrelationContext.php`, and attaches `X-Request-ID` to all HTTP responses.
        - Parses W3C standard `traceparent` headers (`00-{trace_id}-{span_id}-{flags}`) and binds `trace_id` and `span_id` to the context and response headers.
        - Automatically binds authenticated `user_id` and `tenant_id` once verified by Sanctum.
        - Emits exactly one `http.request.completed` access log line per request with HTTP method, route template, status code, `duration_ms`, client IP, user ID, and request ID.
        - Frontend `src/lib/api.ts` automatically attaches `X-Request-ID` to every outgoing API fetch request.
    - **3. Log Levels & Global Exception Boundary (`bootstrap/app.php`)**:
        - Environment-driven log levels (`LOG_LEVEL=debug` locally, `LOG_LEVEL=info` in staging/production).
        - Exception boundary reporting in Laravel 13 `bootstrap/app.php` using `$exceptions->report(...)`.
        - Captures all unhandled exceptions and fatal errors (`Error`, `ParseError`, `PDOException`), logging once at `ERROR` or `FATAL` with sanitized class name, message, code, file, and complete stack trace array. Returns `false` to suppress redundant raw logging.
    - **4. Comprehensive Telemetry Coverage Across Systems**:
        - **Database Telemetry (`AppServiceProvider.php`)**: `DB::listen` automatically emits `database.query.slow` when queries exceed threshold (100ms in dev, 250ms in prod).
        - **Background Queue Jobs (`AppServiceProvider.php`)**: Event listeners for `JobProcessing` (`job.started`), `JobProcessed` (`job.completed`), `JobFailed` (`job.failed`), and `JobRetryRequested` (`job.retry`).
        - **Application Lifecycle**: Emits `app.lifecycle.startup` with non-secret runtime metadata (PHP version, Laravel version, queue driver, DB connection, cache store).
        - **Outbound HTTP / External Calls**: Tracked with target, duration, and outcome for Stripe checkout/webhooks (`payment.stripe.*`), OpenRouter AI requests (`ai.proxy.*`), and Slack alert webhooks.
        - **Security & Audit Events**: Structured audit logging for authentication (`auth.register.success`, `auth.login.failed`, `auth.login.success`, `auth.logout`), COPPA / Parental Gate (`security.parental_gate.attempt`, `security.parental_gate.lockout`, `security.coppa.deletion_requested`), and authorization (`security.authorization_denied`, `admin.users.accessed`).
    - **5. Safety & PII Redaction Engine (`RedactionProcessor.php`)**:
        - Monolog processor recursively traversing context, extra, and exception fields.
        - Masks direct credential keys: `password`, `token`, `secret`, `apiKey`, `authorization`, `cookie`, `card_number`, `cvv`, `ssn`, `national_id`, `phone` with `[REDACTED]`.
        - Regex pattern masking for credit cards (`[REDACTED_CARD]`), phone numbers (`[REDACTED_PHONE]`), email addresses (`s***@example.com`), and Bearer tokens (`Bearer [REDACTED_TOKEN]`).
        - Message body sanitization and 20,000-character payload truncation preventing log injection and buffer exhaustion.
    - **6. Centralized Logging Infrastructure (Loki + Vector + Grafana)**:
        - Apps log strictly to standard output (`stdout`).
        - `monitoring/docker-compose.logging.yml`: Orchestrates Grafana Loki 3.x, Vector log collector, and Grafana 11.
        - Vector configured with a **1GB on-disk buffer** (`buffer.type = "disk"`) to guarantee zero log loss during network partitions or Loki restarts.
        - Low-cardinality indexing in Loki (`service`, `env`, `level`); high-cardinality values (`request_id`, `user_id`) remain in the indexed JSON payload.
        - Kubernetes DaemonSet spec provided in `monitoring/k8s/vector-daemonset.yaml`.
    - **7. Distributed Tracing (`OpenTelemetryTracer.php`)**:
        - OpenTelemetry W3C trace context utilities supporting spans, traces, and traceparent header injection.
    - **8. SRE Alert Rules, 30-Day Retention & Grafana Dashboards**:
        - Loki configured with 720 hours (30 days) retention via compactor.
        - 4 automated Loki alert rules (`monitoring/loki/alert-rules.yaml`): `ErrorRateSpike`, `Http5xxRatioSpike`, `FailedLoginBurst`, and `ServiceNoLogsHeartbeat`.
        - Production Grafana dashboard (`monitoring/grafana/dashboards/profitspatrol-logs-dashboard.json`) with RPS, 5xx ratio, p95/p99 latency, top error types, live stream, and saved LogQL drilldown queries.
    - **9. Automated Testing, Verification Script & Master Reference (`LOGGING.md`)**:
        - Feature test suite `backend/tests/Feature/LoggingAndCorrelationTest.php` passing 7/7 tests (41 assertions, 100% green).
        - Standalone CLI health tool `backend/scripts/verify-logging.php` verifying JSON schema, redaction, exception boundaries, and ingestion.
        - Master architectural reference published in `LOGGING.md`.

- [x] **2026-10-13** — **Complete Map & Navigation Localization Overhaul (Eliminated English Leakage in Arabic Mode)**:
    - **1. Fixed Primary CTA Bottom Button (`AdventureMap.tsx`)**:
        - User request: *"revise all untranslated like the bottn"*.
        - The bottom floating orange CTA button previously bypassed i18n translation by directly interpolating `currentActiveLesson?.lesson_payload?.headline`, which produced English text (`"ابدأ: What is Money? ▶"`).
        - Added `getLessonDisplayTitle` helper resolving localized titles for all 200 curriculum lessons using `t(\`lesson_${lesson.id}_title\`)` with Egyptian-localized fallbacks (`"يعني إيه فلوس؟"` for `MB_01`).
        - The button now reliably displays `"ابدأ: يعني إيه فلوس؟ ▶"` in Arabic mode and `"Start: What is Money? ▶"` in English mode.
    - **2. Fixed Desktop & Mobile Flank HUDs (`AdventureMap.tsx`, `DesktopMapFlanks.tsx`)**:
        - Synced `currentLessonTitle` in `MobileAdventureHud` and `DesktopLeftFlank` to use `getLessonDisplayTitle(currentActiveLesson)`.
    - **3. Bilingual District World Background Landmarks (`DistrictWorldBackground.tsx`)**:
        - Added `isArabic` support to `DistrictWorldBackgroundProps`.
        - Replaced hardcoded English subtitles (e.g., `"Central Bank Landmark"`, `"Startup Launchpad"`, `"Investment Tower"`, `"Harbor Lighthouse"`, `"Satellite Comm Station"`) with natural Arabic translations (`"معلم البنك المركزي"`, `"قاعدة ريادة الأعمال"`, `"صرح الاستثمار والأمان"`, `"منارة الملاحة البحرية"`, `"محطة الأقمار والاتصالات"`).
    - **4. Fixed Untranslated Sidebar Subscription Badge (`Layout.tsx`)**:
        - Resolved missing key fallback `'the_tank.tier_intern'` which rendered as raw uppercase key `THE_TANK.TIER_INTERN` inside `text-[10px] uppercase` pill.
        - Updated to `'pricing.tier_intern'` which translates to `"متدرب"`, displaying cleanly as `"خطة متدرب"`.
    - **5. Verified 100% In-Browser & Automated Tests**:
        - Browser verification confirmed `"ابدأ: يعني إيه فلوس؟ ▶"`, `"معلم البنك المركزي"`, and all map UI elements rendered in pure Arabic.
        - Vitest test suites (`AdventureMap20Modules.test.tsx`, `WorldSystemV2.test.tsx`, `characterEngine.test.ts`, `heroMentorshipParentCard.test.tsx`) pass green.

- [x] **2026-10-12** — **Avatar Studio Layer Ordering, Dimension Calibrations & Transparent Assets Upgrade**:
    - **1. Precise Layer Stack & Seam Elimination (`ModularAvatarRenderer.tsx`)**:
        - Extended SVG canvas headroom to `viewBox="0 -100 400 620"`, completely eliminating hat clipping issues where top hats were previously cut off at the top edge.
        - Corrected z-index order and layer sequence: Ambient Aura & Shadow -> Neck -> Arms & Hands & Smartwatch -> Torso Shirt -> Legs -> Shoes -> Pants Waistband -> Head -> Face Features -> Eyewear Accessories (glasses/sunglasses) -> Hair -> Lapel/Collar Accessories (bowtie/tie/pin) -> Headwear Accessories (top hat/cap/helmet/crown) -> Shield.
        - Calibrated pants waistband (`153x47`, `x=123, y=285`) and legs (`x=123..276`) to exact matching 153px width, eliminating lateral hip bulges and ensuring a seamless, tucked-in corporate look.
        - Fixed `kenney_pants_light_blue_3` waistband from tan `pantsLightBlue3.png` to matching cyan `pantsLightBlue1.png`.
    - **2. Dynamic Hair Placement & Sizing**:
        - Created `hairPlacement` dimension resolver mapping exact bounds for all 27 hairstyles (men's crop, pompadour, side fringe, and women's bob, flowing locks, ponytail) ensuring pixel-perfect alignment on the head skull without floating or clipping.
    - **3. Complete Elimination of Emojis/Icons & Transparent 2D Game Assets Generation**:
        - User request: *"شيل اى ايكونات وولد مكانهم صور شفافة"* (Remove any icons and generate transparent images).
        - Generated 15 high-fidelity transparent PNG assets (4x supersampling, anti-aliased cartoon 2D game art):
            - **Accessories**: `accessory_tophat.png`, `accessory_cap.png`, `accessory_sunglasses.png`, `accessory_glasses.png`, `accessory_bowtie.png`, `accessory_watch.png`.
            - **Outfits**: `business_blazer.png`, `business_tux.png`, `business_vest.png`.
            - **District Gear**: `district_money_tie.png`, `district_builder_hat.png`, `district_risk_shield.png`.
            - **Achievements**: `achieve_first_sale.png`, `achieve_tank_champion.png`, `achieve_tycoon_crown.png`.
            - **Backgrounds**: `bg_office_clean.png`, `bg_penthouse.png`, `bg_vault.png`, `bg_space.png`.
        - Fully linked all 99 items in `avatarCatalog.ts` with transparent `filePath` and `thumbnailPath`.
        - Removed raw emojis from category pills in `AvatarWardrobeModal.tsx` in favor of clean modern typography badges.
    - **4. Verification & Testing**:
        - 13/13 Vitest tests passing green (`src/features/avatar/__tests__/`).
        - TypeScript compilation verified 100% clean.

- [x] **2026-10-11** — **The Tank (عرين المستثمرين) Complete UI/UX Overhaul, 3D Character Asset Generation (Ollie & Friends), Dual Light/Dark Theme Support & 100% Test Suite Health**:
    - **1. Dual Light / Dark Theme Support (Fixed "Always Dark" Trap)**:
        - Resolved root hardcoding (`bg-slate-950`, `bg-[#060a16]`, `text-white`) in `TheTankPage.tsx` and `TheTankMode.tsx` that ignored the app's global light theme (`themeMode: 'light'`).
        - Implemented complete dual-theme palette across all 7 stages:
            - **Light Mode**: Clean `bg-slate-50` backdrop, crisp `bg-white` cards, subtle `border-slate-200`, deep readable slate-900 typography, soft ambient shadows.
            - **Dark Mode**: Cyberpunk `dark:bg-slate-950`, glowing neon `dark:border-blue-500/30`, high-contrast white text, deep navy slate card surfaces.
    - **2. 100% Alignment with Official Character Model Sheets (Ollie & Friends)**:
        - Generated and synced visuals strictly according to the 4 user-provided canonical model sheets (Reema the Arctic Fox, Kami the Chameleon, Filo the Elephant, and Ollie the Owl):
            - `tank_deal_victory.jpg`: 16:9 celebration on The Tank stage featuring the 4 canonical animal heroes (Ollie in white shirt and red tie, Reema in pink coat and teal scarf, Filo in green vest, round gold spectacles, holding his pink piggy bank, and Kami in purple hoodie and goggles on forehead) holding the $100,000 deal check together with golden confetti. Zero human teenagers.
            - `tank_judges_panel.jpg`: 16:9 panoramic judging desk with Ollie, Reema, Filo, Kami, and Rex with executive gold nameplates in the high-tech TV arena.
            - `tank_coaching_board.jpg`: 16:9 backstage coaching room with canonical Ollie giving a thumbs-up at the blueprint and profit metrics drafting table.
            - `judge_ollie.jpg`: Canonical orange owl, white shirt, red tie, thumbs up.
            - `judge_reema.jpg`: White arctic fox, pink coat blazer, teal scarf, megaphone pin.
            - `judge_filo.jpg`: Sage green elephant, gold circular glasses, dark green vest, bowtie.
            - `judge_kami.jpg`: Purple chameleon with lime green spots, purple hoodie, goggles on forehead, holographic financial chart.
            - `judge_rex.jpg`: Official canonical Rex: Terracotta Red T-Rex dinosaur (`#C8553D`) with backwards dark navy baseball cap (`#001B2A`), yellow pencil tucked behind his ear, and navy blue work apron (`#1E3A5F`) with circular badge in calculating 3/4 pose on warm amber/midnight studio spotlight background.
    - **3. Complete Translation Fixes & Zero Raw Keys**:
        - Fixed missing translation keys in `src/locales/ar/the_tank.ts` and `src/locales/en.ts` for analysis strengths (`mentioned_finance`, `clear_problem_solution`, `mentioned_traction`), weaknesses (`missing_finance`, `missing_problem`), and pro tips (`tip_elaborate`, `tip_keep_it_up`, `tip_finance`, `tip_general`).
        - Added bilingual dictionary formatters (`formatStrength`, `formatWeakness`, `formatTip`) in `TheTankMode.tsx` providing fallback translations in Arabic and English, completely eliminating unlocalized raw snake_case keys or quoted paths.
    - **4. Mobile & Desktop Layout Perfection**:
        - **Hero Banner**: Eliminated opaque card overlay that was crushing the stage image on narrow viewports (< 480px). Now showcases a clean 16:9 top banner showcasing all 5 animal judges, with title plaque and arena stats positioned neatly underneath.
        - **VIP Judges Carousel**: Fixed broken 2-2-1 awkward mobile grid by replacing it with a smooth horizontal snap-scroll carousel (`snap-x no-scrollbar w-44 shrink-0 snap-start`) on mobile, and 5-column grid on desktop.
        - **Viewport Polish**: Added `no-scrollbar` to main stage container and generous bottom margins (`mb-16 sm:mb-8`) to primary CTAs to ensure floating navigation and assistant bubbles never obscure actions.
    - **5. Full 7-Stage Gamified TV Show Immersion in The Tank Mode**:
        - **PREP Stage**: Added live broadcast banner (`🔴 بث مباشر من العرين`), Season 4 indicator, interactive 5-judge panel with voice line previews, and Ollie Coach card with the 3 golden rules of pitching.
        - **PITCH Stage**: Real-time keyword checklist chips (**💰 Profit & Cost**, **🎯 Problem**, **💡 Solution**, **👥 Customers**) dynamically illuminating as the student types/speaks, speech dictation waves, and Ollie teleprompter advice.
        - **THINKING Stage**: 3 session judges appear with animated pulsing headshots and real-time financial deliberation ticker.
        - **TANK_FLOOR Stage**: 3 executive judge cards with custom character avatars, voice speaking waveforms, "Hear Offer" audio playback, and dramatic "I'm Out" stamps.
        - **NEGOTIATION Stage**: Face-to-face boardroom table with judge avatar, implied company valuation calculator, and counter-offer sliders.
        - **DEAL Stage**: Novelty giant investment check ceremony displaying negotiated valuation and equity, +500 PP Tokens reward burst, and full pitch breakdown.
        - **REJECTED Stage**: Heartwarming backstage coaching scene with Ollie encouragement and actionable business improvements.
    - **6. Engine, Voice & 100% Test Suite Verification**:
        - Made avatar, characterId, accentColor optional on `Judge` interface in `TheTankEngine.ts` for backward compatibility.
        - All 17 Tank tests passing, TypeScript compilation 0 errors (`tsc --noEmit` code 0).
        - Full Vitest suite passing: **60/60 test files passed, 413/413 tests green (100%)**.

- [x] **2026-10-05** — **Real Estate Market Character Artwork Generation & Profile Header Duplicate Cleanup**:
    - **1. Original Character Artwork for All Real Estate Markets**:
        - Generated 9 original 4:3 high-definition 3D cartoon illustrations saved to `public/images/properties/` depicting each property type with the 4 core heroes & rival Rex:
            - `prop_lemonade_stand.jpg`: Ollie the owl at his sunny park lemonade stand with pitchers of fresh juice.
            - `prop_garage.jpg`: Kami the chameleon tinkering with robotic inventions in the suburban garage startup.
            - `prop_food_truck.jpg`: Reema the arctic fox serving gourmet tacos from her festive Taco Fiesta food truck.
            - `prop_arcade.jpg`: Rex the raccoon playing retro pixel arcade games surrounded by neon signs & tokens.
            - `prop_tech_office.jpg`: Filo the baby elephant reviewing business growth metrics on a tablet in a modern startup loft.
            - `prop_factory.jpg`: Kami inspecting an automated gadget assembly line with robotic arms in the widget factory.
            - `prop_beach_house.jpg`: Reema relaxing poolside at the Malibu luxury beachfront villa with passive rental income.
            - `prop_shopping_mall.jpg`: Ollie holding shopping bags at the grand multi-level adventure mall with retail stores.
            - `prop_tech_campus.jpg`: All 4 heroes (Ollie, Reema, Filo, Kami) walking proudly at the Silicon Valley tech unicorn campus.
        - Updated `src/features/venture/data/properties.ts` with `PROPERTY_IMAGES` mapping and updated default image paths.
        - Upgraded `RealEstateApp.tsx` Market cards (`h-44 rounded-2xl overflow-hidden`), Portfolio cards (`w-16 h-16`), and Sell dialogs to render the responsive artwork with hover zoom and emoji fallbacks.
    - **2. Profile Header Navigation Duplicate Removal**:
        - Removed duplicate navigation controls (`ThemeToggle`, `LanguageToggle`, `Settings`, `Sign Out`) from the profile page header in `src/features/dashboard/components/UserProfile.tsx`.
        - Preserved the clean, centered streak badge (`🔥 0 days streak`) while relying on the persistent global sidebar for settings, theme, language, and logout.
    - **3. Full Quality & Regression Verification**:
        - All 59 test files and 406 Vitest tests passing (100% green).
        - Both Vite server (`:5173`) and Laravel 11 API (`:8000`) verified healthy and responsive.

- [x] **2026-10-04** — **UI Polish, Multilingual Localization, Kid Feature Restoration, Explorer Mode (10y), Arcade Canonical Stations (50) & Security/Admin Modernization**:
    - **1. Multilingual Localization & RTL Fixes**:
        - **Project Submitter Rejection Card**: Replaced hardcoded English rejection strings and inverted punctuation (`Needs a Bit More Work`, `!Tip: Try checking the brief...`, `Review Brief`, `Edit & Improve`) in `ProjectSubmitter.tsx` with dynamic `useTranslation()` calls and full Arabic RTL alignment.
        - **Ollie AI Arabic Grading Engine**: In `src/lib/gemini.ts`, added comprehensive Arabic financial vocabulary (`ربح`, `تكلفة`, `عملاء`, `زبائن`, `سعر`, `منتج`, `خطة`, `تسويق`, `مشروع`) to `gradeProjectWithOllie` prompts and regex checks, preventing false rejections of Arabic project submissions.
        - **Level Up Modal**: Localized `LevelUpModal.tsx` (`t('level_up.title')`, `t('level_up.subtitle')`, `t('level_up.btn')`) across all language files (`ar`, `en`, `fr`, `es`, `de`), eliminating `!LEVEL UP` and `!Awesome` English fallbacks.
        - **Boss Fight Shell**: Connected company titles and issues in `BossFightShell.tsx` to `t('scenarios.<id>.company_name')` and `t('scenarios.<id>.issues.<id>')` (e.g. Papa Pete's Pizzeria, Oven Broken, Lazy Staff, Bad Marketing). Enforced `dir="ltr"` on numeric daily loss and wallet figures to prevent RTL number flipping.
    - **2. Boss Challenge UI & Clean Character Avatars**:
        - Replaced raw, multi-pose spritesheet files (`/images/chracters/`) with clean individual character portraits from `/images/characters_clean/` (`ollie_idle.png`, `reema_idle.png`, `filo_idle.png`, `kami_idle.png`, `rex_idle.png`) in `PreBossModal.tsx` and `BossFightShell.tsx`.
    - **3. Kid Sidebar Feature Restoration & Ollie Assistant**:
        - **Restored Complete Kid Navigation**: Restored full sidebar navigation in `Layout.tsx` for kid users, organized into `nav.section_learn` (Adventure Map, Games/Arcade, Tasks) and `nav.section_venture` (Library, Videos, Card Academy, The Tank, Debate Dojo, Real Estate, Skills Tree, Profile).
        - **Ollie AI Assistant Bubble**: Unblocked `<OllieChat />` for kid users in `App.tsx` (`{user && <OllieChat />}`).
        - **PlayHub Bubble & Daily Spin**: Added Daily Spin Wheel 🎡 (`spin`) to `playHubItems` with custom handler in `BottomNav.tsx`. Removed duplicate `<NewsTicker />` from `AdventureMap.tsx` header to eliminate visual clutter.
    - **4. 10-Year-Old Explorer Mode Test Account**:
        - Added `MOCK_EXPLORER_USER` (Maya, Age 10, Explorer Mode) in `src/data/mocks.ts` and `userSlice.ts`.
        - Added dedicated "Explorer (10y)" quick login button in `Auth.tsx` for testing UI differences between Junior (6-9) and Explorer (10-12) age modes.
    - **5. True Randomization for Lesson Questions**:
        - Replaced biased `sort(() => Math.random() - 0.5)` with true Fisher-Yates shuffle algorithm and added `shuffleNonce` in `UniversalLessonEngine.tsx` to re-shuffle answers on retries.
    - **6. Admin Dashboard Modernization & 50 Arcade Games**:
        - Replaced all legacy Supabase labels with "Laravel Backend (Cloud DB)" / "Laravel Backend Live".
        - Added dual-tab games management in `AdminDashboard.tsx`:
            - **🎮 Arcade Stations (50)**: All 50 canonical arcade stations with District badges, Age modes, and live "Test Station" modal preview using `UnifiedGameShell`.
            - **🏢 Tycoon Simulations (36)**: 36 business simulation games.
        - Hardened `SecurityMonitoring.tsx` with offline/fallback security events to prevent DNS resolution errors.
    - **7. Video Library Player Fix**:
        - Added auto-detection and auto-switching between interactive video animations and YouTube iframe player in `VideoLibrary.tsx`.
    - **8. Zero-Regression Verification**:
        - Vitest suite 100% green with **59/59 test files and 406/406 tests passing**.
        - Verified live in browser with real subagent walkthroughs for both Kid (Explorer) and Admin roles.

- [x] **2026-10-04** — **Learning Path UI/UX Overhaul (/map), Character Safe-Slots, 200 Lesson Translations, Daily Rewards & Breaking News Integration**:
    - **1. Duolingo-Style Learning Path & Boss UI/UX Overhaul**:
        - **Full Hierarchy Support**: Complete 20 modules across 5 districts, rendering 10 counted lessons per module + 1 interactive Boss Platform (`BossPlatformNode.tsx`).
        - **Boss Architecture**: Connected `PreBossModal.tsx`, `BossFightShell.tsx`, and `BossResultModal.tsx` to existing boss curriculum scenarios through thin adapters with zero rule duplication.
        - **Chrome Diet & Banner**: Sticky unit banner (`StickyUnitBanner.tsx`) with district numbers, bilingual module titles, and in-district module pill navigation.
    - **2. Safe-Slot Character & NPC Placement System**:
        - **Zero Collision Guarantee**: Positioned character actors strictly in lateral gutters between nodes with widened wave offsets (`WAVE_OFFSETS = [0, 48, 64, 48, 0, -48, -64, -48]`), keeping the central 80px road corridor, node circles, and lesson title labels 100% collision-free.
        - **Clean Standalone Sprites**: Replaced runtime CSS clipping on large sprite-sheets with dedicated, isolated crops (`/images/characters_clean/`) for Ollie, Rex, Reema, Filo, and Kami. Completely eliminated sprite-sheet bleed and text headers ("حركات / بوزات").
        - **Micro-Animations & Performance**: Updated `SpriteActor.tsx` with character-specific micro-animations (Ollie breathing, Reema swaying, Filo bobbing, Kami hopping, Rex twitching), enforcing `prefers-reduced-motion` compliance and pausing offscreen animations via `IntersectionObserver`.
        - **Single-Active Speech Coordinator**: Bubbles restricted to max 160px width, max 8 words, 3s auto-dismiss, and `<bdi>` bidirectional text wrapping.
    - **3. Pure Arabic Localization for All 200 Lessons**:
        - Connected lesson titles in `AdventureMap.tsx` to `t('lesson_${lesson.id}_title')` from `src/locales/ar/lessons.ts`.
        - Resolved issue where untranslated keys fell back to English ("Coins & Bills", "Earning Money"); all nodes now display pure Arabic titles ("أنواع المال", "كسب المال", etc.).
    - **4. Daily Rewards & Live Breaking News Re-Integration**:
        - **Daily Spin Wheel**: Added quick action chip (`🎡 المكافأة`) in the minimal TopBar header with an animated badge/glow when `spinReady` (`user.lastSpinDate !== getToday()`). Opens `DailySpinWheel.tsx` with anti-cheat idempotency.
        - **Breaking News Ticker**: Upgraded `NewsTicker.tsx` with bilingual economic headlines (heatwave boosting lemonade sales 1.5x, market dip buying opportunities, city festival customer surge 1.3x, tech boom boosting AI corps 1.4x) with live economic effects. Rendered below the sticky banner with click-to-open `BizPulseNewsFeed`.
        - **PlayHubFAB**: Enabled the floating action button across all kid views including `/map` for instant access to Daily Missions, Spin Wheel, Stocks, and Corporations.
    - **5. Role Security & Navigation Fixes**:
        - Blocked kids from unauthorized navigation to `/dashboard` with a proper parent-gate message, while supporting developer mode auto-switch (`user.id?.startsWith('dev_')`).
        - Stabilized `isAdmin` navigation so the admin sidebar persists reliably across all views.
        - Updated CSP in `index.html` to allow local Laravel backend connections (`http://localhost:8000`).
        - Resolved IDE TypeScript errors in `Layout.tsx`, `SpriteActor.tsx`, and `AdventureMap.tsx`.
    - **Zero-Regression Verification**:
        - Vitest suite 100% green with **59/59 test files and 406/406 tests passing**.
        - Verified across viewports (360x740, 390x844, 768x1024, 1440x900) in Arabic RTL and English LTR.

- [x] **2026-10-03** — **Triple Feature Implementation: Learning Shorts (1), The Tank AI Voice (2) & Mini-Game Mobile Touch Controls (4)**:
    - **1. Video Section System Overhaul ("Learning Shorts")**:
        - **Mobile Touch Swipe Feed**: Added vertical swipe gesture detection (`handleTouchStart`, `handleTouchMove`, `handleTouchEnd`) in `VideoLibrary.tsx` with smooth snap transitions between shorts.
        - **Anti-Cheat Watch Rewards**: Configured 90% watch time requirement awarding +10 XP and +5 PP Tokens on initial completion with duplicate prevention.
        - **Post-Video Quiz Overlay**: Completed post-video quiz verification awarding +20 XP and +15 PP Tokens.
        - **Family Bounty Chore System Integration**: In `videoSlice.ts`, connected real-world action challenge submissions (`submitChallengeProof`) directly to `useSocialStore.getState().addBounty(...)`, automatically creating pending verification chores for parents on the Family Job Board.
        - **New Concept Explainer Short**: Added `vid_ollie_business_moat` ("The Castle Fortress: Building a Business Moat" / "قلعة الأعمال: كيف تبني خندقاً تنافسياً لا يقهر؟") with 5 animated scenes, bilingual explanations, and interactive quiz.
        - **Test Suite**: Verified via `tests/education/learningShorts.test.ts` (5/5 passed) and `videoSlice.test.ts` (7/7 passed).
    - **2. Multilingual AI Voice Interaction for The Tank**:
        - **Judge Voice Synthesizer**: Created `TankJudgeVoiceEngine.ts` leveraging Web Speech API with tailored personas for all 5 judges (`cash` = authoritative low pitch, `tech` = analytical crisp pace, `vision` = inspirational cadence, `eco` = warm calm tone, `trend` = youthful energetic pace).
        - **Dynamic Text Sanitizer & Sound Visualizer**: Sanitizes currency symbols, valuation numbers, and equity percentages for natural Arabic and English pronunciation. Simulates 4-band jumping audio waveforms.
        - **Interactive UI Integration**: Updated `TheTankMode.tsx` with a master voice toggle button, judge speaking rings, real-time waveform bars, and "Hear Offer" speaker buttons on judge deal cards.
        - **Test Suite**: Verified via `tests/tank/TankJudgeVoice.test.ts` (5/5 passed) and `TheTankEngine.test.ts` (11/11 passed).
    - **4. Mobile Touch Controls for Complex Mini-Games**:
        - **GridTemplate**: Implemented direct touch swipe gestures on the gameplay canvas (`handleGridTouchStart`, `handleGridTouchEnd`) and upgraded the on-screen virtual D-Pad with 60x60px tactile touch targets.
        - **ConveyorTemplate**: Added direct touch item selection with glowing outline indicators and enlarged min-h-[72px] sorting bin targets for small mobile touchscreens.
        - **DefenseTemplate**: Replaced mouse-only coordinates with `onPointerDown` normalized bounding rect coordinate mapping for pinpoint tower placement on mobile, plus exported core constants (`TOWER_TYPES`, `WAVES`, `PATH`).
        - **OperationsTemplate**: Converted assembly buttons to responsive minimum 64px hit targets with `onPointerDown` immediate tactile response.
        - **Test Suite**: Created and verified `tests/games/mobileTouchControls.test.ts` (6/6 passed).
    - **Zero-Regression Verification**:
        - Full Vitest suite passing with **59/59 test files and 406/406 tests green** (up from 56 files / 390 tests).
        - Both Vite dev server (`:5173`) and Laravel 11 API (`:8000`) verified healthy and running.

- [x] **2026-10-03** — **Full Multi-Language Parity (ES, FR, DE, AR, EN) & Translation Engine Audit**:
    - **Automated Batch Localization Across 3 Languages**:
        - Created `scripts/auto-translate-locales.mjs` using `bing-translate-api` with rate-limiting, variable interpolation protection (`{{param}}`), and nested object reconciliation.
        - Translated all **657 missing keys** across Spanish (`src/locales/es.ts`), French (`src/locales/fr.ts`), and German (`src/locales/de.ts`).
        - Reached **100% key parity** with `src/locales/en.ts` (each locale file now holds 4,028 keys across 191 sections).
    - **Arabic & Library Validation Hardening**:
        - Updated `scripts/validate-translations.ts` to support dual-mode age suffixing (`_child` and `_teen`) for Junior and Explorer modes.
        - Fixed missing Arabic key lessons for Robert Greene's *The 48 Laws of Power* in `src/locales/ar/exclusive_books.ts`.
        - Verified 100% of curriculum modules and 100% of library books translated and passing validation (`npm run check-translations`).
    - **Locale Dev Tool Modernization**:
        - Updated `scripts/sync-locales.cjs` to use robust JS AST/object extraction instead of fragile regex lines, adding explicit recognition for the modular 77-file `src/locales/ar/` directory.
        - `npm run locale:check` now runs cleanly with all 5 locales 100% green.
    - **Zero-Regression Verification**:
        - Full TypeScript type-check clean (`npx tsc --noEmit` exited 0).
        - Full Vitest suite passing with **56/56 test files and 390/390 tests green**.

- [x] **2026-10-02** — **Full 20-Module & 200-Lesson Scaling on Kid's Adventure Map**:
    - **Removed Hardcoded 8-Lesson Limitation**:
        - Eliminated `Math.min(8, pool.length)` truncation in `src/features/hq/components/AdventureMap.tsx` that previously restricted every district to only 8 nodes.
        - Enabled dynamic rendering of the full 10-lesson zigzag path for every module in the curriculum.
        - Configured Node 10 as the **Grand Champion Capstone Milestone (`المشروع الختامي للبطل 🏆`)** with a dedicated Trophy icon and capstone rewards.
    - **In-District Module Navigation**:
        - Added interactive horizontal pill bar beneath the District Card allowing kids to toggle between modules belonging to that district (e.g. `MOD_MB`, `MOD_FIN`, `MOD_FUTURE` in Money District).
        - Displays module icons, localized titles (Arabic & English), and live progress badges (`X/10` or `✓` when 100% complete).
    - **"Patrol Academy: All 20 Modules" Modal**:
        - Added an accessible modal browser featuring all 20 modules categorized into the 4 official seasons:
            - **Season 1: Foundation (10 Modules / 100 Lessons)**: Money Basics, Entrepreneurship, Investing, Marketing, Leadership, Economics, Tech, Social Good, Global Biz, Safety & Smarts.
            - **Season 2: Advanced Track (3 Modules / 30 Lessons)**: Crypto & Blockchain, AI & Future Jobs, Sustainability Biz.
            - **Season 3: CEO Track (3 Modules / 30 Lessons)**: Venture Capital, Corporate Strategy, Global Trade (*Gated: Level 8+*).
            - **Season 4: Mastery Track (4 Modules / 40 Lessons)**: Financial Modeling, Brand Building, Future of Money, Negotiation & Persuasion (*Gated: Level 12+*).
        - Tapping any unlocked module automatically routes the map to the parent district and loads the module's 10-node trail.
    - **Comprehensive Test Coverage & Quality Verification**:
        - Created `tests/AdventureMap20Modules.test.tsx` verifying the 10-lesson scaling, in-district pill switching, and 20-module browser modal with level gates.
        - Maintained 100% regression compatibility with existing world and NPC systems (`tests/WorldSystemV2.test.tsx`).
        - TypeScript compilation verified clean (`npx tsc --noEmit` exited with 0 errors).
        - All 56 test files and 390 Vitest tests passing (100% green).

- [x] **2026-10-02** — **Voice & Sound Polish, Teacher Reports & Grading, E2E Playtest & Production Build**:
    - **Voice & Sound Engine Polish**:
        - Built `CharacterVoiceEngine.ts` with dedicated bilingual voice profiles and pitch/rate settings for Ollie the Owl and the 4 Heroes (Reema, Filo, Kami, Rex).
        - Added text sanitizer (`prepareTextForSpeech` / `cleanTextForSpeech`) stripping markdown syntax, emojis, and math formulas for clean TTS output.
        - Added Web Audio synthesized character earcons (`playCharacterEarcon`, `playCashRegister`, `playBadgeUnlock`, `playWhoosh`, `playStreakFlame`, `playReward`) in `sound.ts`.
        - Integrated animated `VoiceNarrationButton.tsx` with speech state subscriptions into `UniversalLessonEngine.tsx`, `CharacterDialogueModal.tsx`, and `RexShowdownModal.tsx`.
        - Verified with `tests/voiceAndSound.test.ts` (3/3 passed).
    - **Teacher Grading & Export Improvements**:
        - Enhanced `TeacherDashboard.tsx` with multi-format export capabilities (`handleExportData` for CSV with UTF-8 BOM for Arabic Excel and JSON).
        - Added one-click CSV export button directly to the student roster table header.
        - Implemented interactive grading rubrics with dynamic score calculations and quick-feedback suggestion chips.
        - Verified with `tests/teacherReportsAndGrading.test.ts` (2/2 passed).
    - **End-to-End Browser Playtest Verification**:
        - Ran autonomous browser subagent playtest verifying the full learning loop:
            - `/map` navigation with district node interactions and NPC dialogues.
            - `UniversalLessonEngine` briefing with Ollie voice narration button.
            - Interactive challenge answering, validation, and reward payout.
            - Mini-games arcade catalog (`/games`).
            - Teacher classroom portal (`/classroom`) with curriculum management and grade exports.
    - **Production Build & PWA Packaging**:
        - Resolved TypeScript typing discrepancies (`npx tsc --noEmit` exited with 0 errors).
        - Successfully generated production build into `dist/` with `.br` and `.gz` pre-compressed assets.
        - Verified `manifest.webmanifest` and 192x192 / 512x512 maskable icons.
        - Verified passing test suites: `tests/voiceAndSound.test.ts`, `tests/teacherReportsAndGrading.test.ts`, and `tests/avatar/avatarWardrobe.test.ts` (12/12 passing).

- [x] **2026-10-01** — **Triad System Completion: Capstone, Real-World Missions & Avatar Wardrobe (1, 2, and 3)**:
    - **1. Grand Entrepreneurship Capstone — "Build Your Business" (PRD Section 49)**:
        - Built 7-step guided venture creator (`capstoneStore.ts`): Problem Discovery ➡️ Target Customer & Solution ➡️ Unit Economics & Pricing ➡️ Brand Identity ➡️ Ethical Operations & Sustainability ➡️ Competitive Moat ➡️ The Tank Pitch ➡️ Graduation.
        - Created `CapstoneExperience.tsx` with dynamic step indicator, advice tips from Ollie, Reema, Filo, Kami, and Rex, and live validation.
        - Built `CapstoneCertificateModal.tsx` rendering an official, printable "ProfitsPatrol Young Entrepreneur" graduation diploma signed by the 4 Hero Mentors with 250 XP and 100 P-Tokens rewards.
        - Verified with `tests/capstone/capstoneJourney.test.ts` (3/3 passed).
    - **2. Real-World Family Missions (PRD Section 66)**:
        - Created 5 offline family learning missions (`realWorldMissionsData.ts`): Grocery Unit Price Detective, Home Savings Jar Challenge, Customer Needs Interview, Home Problem Solution Pitch, and Eco-Audit & Recycling Enterprise.
        - Built `realWorldStore.ts` with structured reflection notes submission, parent signature approval gating, and token/badge rewards.
        - Built `RealWorldMissionsModal.tsx` with mission briefings, learning objectives, parent signature pin/pad modal, and completed badges gallery.
        - Verified with `tests/realWorld/realWorldMissions.test.ts` (4/4 passed).
    - **3. Avatar Wardrobe & Entrepreneurial Accessories System (PRD Section 56)**:
        - Created structured catalog (`avatarCatalog.ts`) adhering to PRD ID conventions (`avatar_<category>_<slug>`) spanning Business Outfits, District Gear (mapped to 8 districts), Achievement Cosmetics, Accessories, Hairstyles, Clothing, and Headquarters Backgrounds.
        - Built `avatarStore.ts` managing level gating, district unlock requirements, token purchases, and multi-category auto-equipping.
        - Built `AvatarWardrobeModal.tsx` featuring live layered avatar preview (hair, outfit, district gear, accessories, badges, and background), active perk status indicators, category tabs, filter toggles (owned/unlocked), and full Arabic RTL support.
        - Replaced legacy `AvatarCustomizer.tsx` with `AvatarWardrobeModal` and enabled wide modal layout in `GlobalModalManager.tsx`.
        - Verified with `tests/avatar/avatarWardrobe.test.ts` (11/11 passed).
    - **Repository Test Suite Integrity**:
        - Full regression run completed with **52/52 test files passing and 379/379 tests passing (100% green)**.

- [x] **2026-10-01** — **Mission Engine District Competency Integration (Part 2)**:
    - **District Competency Contracts Pool**:
        - Created `DISTRICT_CONTRACTS_POOL` in `dailyMissionSlice.ts` with 8 distinct contract opportunities mapped directly to each canonical district and competency (`budgeting`, `pricing`, `scam_defense`, `inventory`, `prototyping`, `negotiation`, `competitive_strategy`, `global_vision`).
        - Integrated deterministic seed selection picking 2 daily district contracts alongside the 3 daily goals.
    - **District Action & Activity Routing**:
        - Updated `trackMissionProgress` with optional `districtId` routing so curriculum lessons, Kami lab prototype synthesis, Rival Rex showdowns, and business sales accurately advance corresponding district contracts.
    - **Competency Mastery Progression**:
        - Integrated `calculateCompetencyDelta` directly into `claimMissionReward`: claiming a district contract awards user XP, Tokens, and immediately advances that specific competency's level and score in `user.competencyMastery`.
    - **Dual-Tab UI Upgrade**:
        - Upgraded `DailyMissions.tsx` with dedicated navigation tabs for **"Daily Goals / المهام اليومية العامة"** and **"District Contracts / عقود وجدارات الأحياء"** with district badges, competency tags, and `+Mastery XP` indicators.
    - **Testing**:
        - Created `tests/missions/districtMissions.test.ts` (4/4 tests passing).

- [x] **2026-10-01** — **NPC Living World & Schedules Engine (Part 1)**:
    - **NPC Architecture & Data Structure**:
        - Enriched `NPC_CONFIGS` in `npcs.ts` with 5 detailed characters (Tariq the Founder, Laila the Brand Guru, Captain Sami Logistics, Farouk the Harbor Investor, Nadia the Chief Executive).
        - Defined 3 time-of-day schedules (`morning`, `afternoon`, `night`) mapping NPCs across the 8 world districts with specific real-world activities.
        - Defined 7 emotional states (`happy`, `celebrating`, `growing`, `busy`, `worried`, `struggling`, `needs_help`) with state-specific bilingual dialogue pools.
    - **Living World Store & State Engine**:
        - Built `useLivingWorldStore` in `livingWorldStore.ts` with Zustand + localStorage persistence (`pp_living_world_store`).
        - Implemented relationship tiers (`unknown` -> `introduced` -> `friendly` -> `trusted` -> `partner`) and quest lifecycles (`available` -> `active` -> `completed` -> `claimed`).
    - **Interactive UI & Map Integration**:
        - Built `NPCDialogueModal.tsx` with Duolingo-style avatar card, emotion chips, time badges, relationship meters, advice consultation, and quest claiming.
        - Built `DistrictLivingWorldBar.tsx` with time of day toggles and live district residents list, embedded directly in `AdventureMap.tsx`.
    - **Testing**:
        - Created `tests/livingWorld/npcLivingWorld.test.ts` (5/5 tests passing).

- [x] **2026-10-01** — **Teacher & Parent Dashboard Live Moments & Character Trust Analytics**:
    - **Hero Mentorship Pillar Card**:
        - Created `src/features/dashboard/components/HeroMentorshipParentCard.tsx` presenting real-time character trust progression across the 5 canonical pillars: Plan (Ollie), Connect (Reema), Protect (Filo), Create (Kami), and Competitive Resilience (Rex).
        - Integrated dynamic progress bars, unlocked tier badges, trust points, and story quest completion counts.
    - **Contextual "Learning Moments" (Discussion Starters)**:
        - Generated real-world dinner table and classroom conversation prompts tailored with the child's/students' name based on character themes (e.g., Ollie's 50/30/20 budgeting, Reema's storytelling in marketing, Filo's scam protection & emergency funds, Kami's creative prototyping, and Rex's ethical competitive spirit).
    - **Parent & Teacher Portals Integration**:
        - Seamlessly integrated the mentorship analytics into `ParentDashboard.tsx` right beneath the CEO Report Card.
        - Embedded the mentorship breakdown into `TeacherDashboard.tsx` inside the class Overview tab.
    - **Testing**:
        - Created `tests/dashboard/heroMentorshipParentCard.test.tsx` (3/3 tests passing). Total verified tests: 73 green.

- [x] **2026-10-01** — **Daily Business Simulation Integration with Hero Perks**:
    - **Perks Engine Hookup**:
        - Connected `useTrustStore.getState()` into `businessStore.ts` to activate hero perks in the daily cycle:
            - Filo / Rex wholesale discount: 15% off inventory purchasing (`filo_p2`, `rex_p2`).
            - Kami quality discount: 20% off high-tier sourcing costs (`kami_p3`).
            - Ollie demand forecast: +15% simulated customer traffic (`ollie_p3`).
            - Reema viral marketing boost: marketing visitor multiplier raised from 1.5 to 2.2 (`reema_p2`).
            - Filo consequence shield: eliminates empty-shelf penalties when customer demand exceeds inventory (`filo_p2`, `filo_p4`).
    - **Bi-directional Gamification Loop**:
        - Profitable business days feed back into `RelationshipEngine.onPrudentSavingsMaintained()`.
        - High ROI marketing runs trigger `onMarketingCampaignSuccess()`.
        - Business day sales award strategy trust points to Ollie.
    - **Active Hero Advisors UI Banner**:
        - Added a prominent Duolingo-styled badge banner to `BusinessDashboard.tsx` showing active advisor perks with Arabic and English bilingual badges.
    - **Testing**:
        - Updated `tests/business/businessSimulation.test.ts` (8/8 tests passing).

- [x] **2026-10-27** — **Intern Tier Arcade Simulation Expansion (3 Free Games)**:
    - **Simulation Gating Update**:
        - Expanded free games for Intern (non-paying) users from 1 game (Lemonade Stand) to **3 games**:
          1. **Lemonade Tycoon** (`lemonade` / `#SIM-01`)
          2. **Brand Builder** (`brand` / `#SIM-02`)
          3. **Pizza Restaurant / Rush** (`BIZ_02_PIZZA` / `#SIM-03`)
        - Locked the remaining 30+ business simulations (`#SIM-04` onward, starting with Cupcake Bakery, Coffee Cart, etc.) behind `PREMIUM ONLY`.
        - Fixed routing in `App.tsx` so that `BIZ_` simulation games route directly to `GameEngine` instead of being intercepted by `ArcadeGameShellWrapper`.

- [x] **2026-10-01** — **Story Quests & HQ Furniture Rewards**:
    - **Storyline Quests Architecture**:
        - Created 15 distinct bilingual story quests across the 4 Heroes (Ollie, Reema, Filo, Kami) and Rival Rex in `storyQuests.ts`.
        - Built `useStoryQuestStore` with Zustand + localStorage persistence (`pp_character_story_quests`) with dynamic gating based on character trust tiers (Tiers 1 to 3+).
        - Connected automated metric tracking through `RelationshipEngine` for lesson completion, Kami prototype crafting (including High/Viral demand ratings), and Rex district showdowns.
    - **Rare HQ Furniture Rewards**:
        - Appended 15 unique quest reward items (Golden Owl Clock, Grand Strategy Whiteboard, Arctic Neon Sign, Pro Podcaster Mic, Titanium Piggy Safe, Smart Sentry Drone, Golden Scales of Ethics, Chameleon Alchemy Beaker, Quantum 3D Fabricator, Prismatic Trophy, Rivalry Boxing Gloves, Retro Arcade Cabinet, Golden Rex Statue) to `FURNITURE_ITEMS` in `furniture.ts`.
        - Integrated direct claim workflow in `questStore.ts`: claiming immediately adds the item into `user.inventory` and awards XP + ppTokens.
    - **UI & Navigation Integration**:
        - Built `CharacterQuestsPanel.tsx` with hero avatar cards, lore speech bubbles, progress bars, reward showcases, and interactive claim buttons.
        - Integrated a dedicated "Story Quests & HQ / مهمات القصة والـ HQ" tab in `CharacterRelationshipsModal.tsx` with a live claimable quests badge.
    - **Testing**:
        - Created `tests/characters/storyQuests.test.ts` (10/10 tests passing).
        - Total character suite: 30/30 passing; Core suites: 32/32 passing (Grand total 62/62 tests green).

- [x] **2026-10-01** — **Character Relationship & Trust System (Option 1) & Full Supabase Elimination**:
    - **Supabase Cloud Deprecation**:
        - Completely eliminated external Supabase Cloud dependencies (`pftydgfqwbhfyikfxcxa.supabase.co`).
        - Re-routed all auth, profiles, and storage calls to Laravel 11 REST API + local SQLite database (`backend/database/database.sqlite`).
        - Verified database connectivity, migrations, and seed demo accounts.
    - **Hero Trust & Rivalry Engine**:
        - Designed 5-tier relationship progression for Heroes (Acquaintance -> Master Mentor) and Rex (Challenger -> Brother in Business).
        - Created 25 distinct bilingual perks with passive gameplay impacts (XP boosts, discounts, inside market tips, The Tank co-op pitches).
        - Built `useTrustStore` with Zustand + localStorage persistence (`pp_character_relationships`).
        - Created `RelationshipEngine` with automated triggers hooked into curriculum lesson completion (`educationSlice.ts`), prototype crafting in Kami's Lab (`KamiExperimentLab.tsx`), and district showdowns against Rex (`RexShowdownModal.tsx`).
        - Designed and implemented `CharacterTrustCard.tsx` and `CharacterRelationshipsModal.tsx` with smooth Framer Motion tabs, progress meters, and perk directory.
        - Integrated entry points into `AdventureMap.tsx` and enhanced `CharacterDialogueModal.tsx` with live trust badges and consultation bonuses.
        - Created comprehensive unit test suite `tests/characters/relationshipSystem.test.ts` (14/14 tests passing, zero regressions across 32/32 core test suites).

- [x] **2026-09-29** — **Duolingo-Level UI Redesign & Dual Age Modes (Junior & Explorer)**:
    - **Dual Age Modes**:
        - Added `ageMode: 'junior' | 'explorer'` to `UserSettings` and `userSlice`, with dynamic defaults (`junior` for 6–9, `explorer` for 9–12), switchable from the Parent Settings modal.
        - **Junior Mode (6–9)**: Ultra-clean, chunky UI (min 64px touch targets, 20px+ body text, 4-tab bottom navigation [Map, Play, Missions, Me], simplified TopBar showing Stars, Coins, Hearts, and Level badge, maximum 6 visible nodes focused on current progression).
        - **Explorer Mode (9–12)**: Sophisticated learning UI (min 48px targets, 16px body, 5-tab bottom navigation [Map, Learn, Play, Missions, Me] with expandable sub-hubs, SVG circular XP progress ring, and streak flame counter).
    - **Global Design System**:
        - Curated palette: Warm Orange (`#FF8A00` / `#F97316`), Sky Blue (`#0EA5E9` / `#38BDF8`), Sunny Yellow (`#FACC15`), and soft layered elevation shadows. 20px border radius across components with no hard borders.
        - Typography: Google Font `Baloo 2` integrated for friendly, legible Duolingo-grade microcopy in English and `Cairo` for Arabic.
        - Ollie Mascot: Animated owl with idle breathing/blinking cycles and a concise speech bubble (max 8 words) powered by Web Speech API text-to-speech audio narration.
    - **Adventure Map Redesign**:
        - Built `AdventureMap.tsx` with curving SVG stepping path, circular `LessonNode` components (locked with padlock, current with pulsing halo and perched Ollie, completed with 3-star badge), and tactile 3D primary CTA button.
        - Decluttered kid screens: removed breaking news ticker, real estate popups, floating rent/income panels, and multi-district clutter.
        - Retained NPC dialogue mentorship (`ENTREPRENEUR`), quest reward delivery (`col_founders_notebook`), and seamless `EnergyBar` infinite energy support.
    - **Full Testing & Verification**:
        - 100% test pass rate across the whole repository (**32/32 test files, 272/272 tests passing**).
        - Live browser validation verified both Junior and Explorer modes, settings mode switcher, and Arabic RTL alignment.
    - **The Tank Redesign**: Completely overhauled `TheTankMode.tsx` with a 3-judge panel, interactive deal/negotiation sliders, and a visual "Tank Floor" stage.
    - **Debate Arena Fallacy Detector**: Integrated a regex-based logical fallacy detector into `GeminiService.ts` and updated the UI to provide critical thinking feedback on user arguments.
    - **Conveyor Template**: Implemented `ConveyorTemplate.tsx` to handle manufacturing games (Toy Factory, Recycling Center), adding industrial mechanics to the `GameEngine`.
    - **Headquarters Expansion**: Integrated the `IsometricGrid` as a 3D Builder view in `Headquarters.tsx`, added a view toggle, and implemented wandering NPC employees to bring the HQ to life.
    - **Type Hardening**: Fixed multiple TypeScript errors in `types.ts`, `games.ts`, and `GameEngine.tsx` related to missing `GameType` variants and `DebateResult` schema mismatches.
    - **Task Tracker**: Updated `task.md` and created a comprehensive [Phase 4 Walkthrough](file:///C:/Users/ABDO/.gemini/antigravity/brain/26f7872d-297b-4f67-a46c-3cc93485b78b/walkthrough.md).

- [x] **2026-05-04** — **Test Suite Stabilization & UI Feedback**:
    - **Test Suite Resolution**: Successfully stabilized `ContentGating.test.tsx` and `ContentAdditions.test.tsx`. Fixed persistent failures caused by hardcoded data, missing routing context, and outdated mock state.
    - **UI Gating Feedback**: Added explicit "Premium Only" labels to locked nodes in the `KidMap` and implemented lesson progress tracking (e.g., `0/1 Lessons`) in section headers. This improves both automated test discoverability and user UX.
    - **Architecture Refactor**: Updated `BookLibrary` to pull from the store's `library` state instead of hardcoded `CLASSIC_BOOKS`, enabling dynamic content testing.
    - **Type Safety & Linting**: Resolved all TypeScript lint errors in the test directory, aligning mock user objects with the latest `User` interface (added `placedItems`, `properties`, and migrated `bizCoins` to `ppTokens`).
    - **Routing Context**: Wrapped all test renders in `MemoryRouter` to fix `useNavigate` hook crashes.

- [x] **2026-05-03** — **UI Polish, Freemium Paywalls & Localization**:
    - **Avatar & Profile Merge**: Embedded the `AvatarCustomizer` directly into `UserProfile.tsx` for a unified user experience. Removed the legacy "SHOP_ITEMS" Wardrobe (which layered hats on the business logo) to prevent confusion with the new human-avatar system. Updated the Kid's bottom navigation "Avatar" button to route directly to `/profile` instead of launching a modal.
    - **Freemium Paywall Expansion**: Implemented `isInternLocked` logic across the **Debate Dojo** and **Side Hustle (Gig Central)** apps. Non-premium (Intern) users can now only access the first free Dojo topic and the first free gig (plus the rotating weekly gig). Locked items trigger the `InvestorPitchModal` to encourage premium upgrades.
    - **Localization Fixes**: 
        - Fixed the Arabic sidebar translation for "Portfolio", correcting it from "ملفي الشخصي" (My Profile) to "محفظتي" (My Portfolio).
        - Added the missing `avatar` translation block to the English locale (`en.ts`), ensuring avatar category names, items, and action labels display proper English text instead of raw i18n keys.
        - Replaced broken raw coin emoji '🪙' with a robust vector `PrizeIcon` in the `DailySpinWheel` to resolve rendering issues on Windows.

- [x] **2026-05-03** — **Registration & Auth Stability Fix**:
    - **Role Case-Sensitivity**: Resolved a critical registration error where uppercase roles (e.g., 'KID') sent from the client were failing database check constraints (expecting 'kid').
    - **Frontend Fix**: Updated `userSlice.ts` to convert roles to lowercase before calling `supabase.auth.signUp`.
    - **Database Robustness**: Updated `MASTER_SCHEMA.sql` trigger function `handle_new_user` to use `LOWER()` on the role field, ensuring future compatibility even if client data varies.
    - **Diagnostic Scripts**: Verified existence of `FIX_TRIGGER_ROLE_CASE.sql` for manual database patching.

- [x] **2026-05-02** — **Curriculum & Scenario Engine (Boss Battles) Localization**:
    - **200-Lesson Curriculum**: Achieved 100% Arabic localization parity for the entire educational curriculum (Lessons 1–200). Injected localized titles, bodies, and challenge data into `ar/lessons.ts`.
    - **Scenario Engine (Boss Battles)**:
        - Refactored `ScenarioEngine.tsx` to remove hardcoded English. All UI labels (End Day, Start Mission, Event Log, etc.) now use `t()` lookups.
        - Translated all 17 interactive scenarios in `ar/scenarios.ts`, including company names, taglines, goals, and 50+ unique operational issues.
        - Implemented localized severity tags (`severity_critical`, `severity_medium`, `severity_low`) and surprise event headlines.
    - **Lesson Engine Polish**: Updated `UniversalLessonEngine.tsx` to dynamically translate module tags (e.g., "Corporate Strategy" → "استراتيجية الشركات") using `MODULE_MAP` lookup, ensuring zero English fallback in the primary educational flow.
    - **Documentation**: Updated `MEMORY.md` and verified UI RTL parity across all boss battle scenarios.

- [x] **2026-05-01** — **Security Hardening & PP Tokens Rebranding**:
    - **Credential Purge**: Completely removed `service_role` keys and `supabaseAdmin` from client bundles.
    - **Currency Rebranding**: Renamed "BizCoins" to "**PP Tokens**" across database, UI, and locales.
    - **Privileged RPCs**: Migrated admin actions (fetchAllUsers, updateRole, awardTokens) to server-side `SECURITY DEFINER` functions.
    - **Immutable Audit Trail**: Implemented `security_audit_logs` for tamper-proof recording of sensitive events.
    - **Rate Limiting**: Added 30-second cooldown to token award RPCs to prevent exploitation.
    - **Supply Chain Patch**: Implemented `npm overrides` to fix high-severity CVEs in `serialize-javascript` and `rollup-terser`.
    - **Tech Stack**: Upgraded `vite-plugin-pwa` to `1.2.0` and resolved Vite 7 optimization errors.

- [x] **2026-05-01** — **Audience Matcher Localization & Navigation Polish**:
    - **Audience Matcher Localization**: Finalized 100% Arabic localization for the Audience Matcher game template. Added missing keys for customer personas, product labels, and instructions to `ar/games.ts`.
    - **Unified Navigation**: Consolidated the "Home" shortcut across the app. Made the mobile layout logo clickable and added a persistent Ollie navigation icon to the `GameEngine` header.
    - **UI Consolidation**: Resolved icon duplication in the mobile header by merging navigation functionality into the primary logo position (Start side in RTL).
    - **Documentation**: Updated `PROJECT_CONTEXT.md`, `PRD.md`, and `MEMORY.md` to reflect latest progress and navigation standards.

- [x] **2026-04-29** — **Backend Stabilization & Admin UX polish**:
    - **ESLint v9 Migration**: Successfully transitioned the project to a **Flat Config** (`eslint.config.js`), resolving dependency conflicts and updating `package.json` linting scripts.
    - **Database Diagnostic UI**: Implemented `SupabaseAdapter.isTableMissing()` and a high-energy **"Database Setup Required"** modal in `AdminDashboard.tsx` to surface uninitialized database states with clear recovery instructions.
    - **RLS Infinite Recursion Fix**: Resolved critical `500 Internal Server Error` in Supabase by implementing `SECURITY DEFINER` functions (`is_classroom_teacher`, `is_classroom_student`) to bypass RLS during policy evaluation, breaking the dependency loop between `classrooms` and `classroom_members`.
    - **Full Arabic Parity**: Achieved 100% Arabic localization for the new database setup UI and "The Tank" (Solo/Co-op modes).
    - **Game Engine Standardization**: Unified `BusinessSimulation` interface to use `business_id` and localized all upgrades, events, and strategy keys for 28+ games.
    - **Responsive Notifications**: Refactored `NotificationCenter.tsx` to use responsive logical positioning (`md:start-0 end-0`) and added a `position` prop to prevent clipping on mobile and RTL desktop layouts.
    - **Visual Polish**: Integrated **Ollie the Mascot** into `RepairTemplate` and `ClickerTemplate` for contextual help. Fixed "NEW" badge and sidebar clipping issues.

- [x] **2026-04-28** — **Localization & UI Accessibility Polish**:
    - **Fixed Arabic Game Titles**: Resolved missing translations for 28+ games in `ar/games.ts` (Book Publishing, Eco Battery, Rock Star Tour, etc.) that were defaulting to English.
    - **Arabic Localization Finalization**:
        - Implemented `sim` translation namespace for dynamic tycoon slider labels.
        - Fully localized `UniversalBusinessGame.tsx` and `SimulationTemplate.tsx` (tutorial, HUD, results).
        - Synchronized game titles/descriptions in `ar/games.ts` with `GAMES_DB`.
        - Resolved UI contrast issues by upgrading text to high-contrast `text-gray-950`.
    - **Simulation Labels**: Implemented Title Case formatting for strategy keys (e.g., `print_quality` → `Print Quality`) and localized "Strategy", "Shop", "Start Day" headings.
    - **Sync & Cleanup**: Resolved 15+ duplicate key errors in `ar/games.ts` that were causing TypeScript compilation warnings.

- [x] **2026-04-27** — **Authentication Stability & Store Type Audit**:
    - **Fixed Registration Hang**: Implemented `isRegistering` flag in `userSlice.ts` to prevent `AuthProvider` from clobbering new accounts with uninitialized DB profiles during sign-up.
    - **Fixed Auto-Login to Admin**: Implemented `isAuthLoading` (starts `true`, never persisted) to gate all routing and redirects. The app now waits for the Supabase session check to resolve before making navigation decisions, eliminating "flicker" and unauthorized access from stale `localStorage` data.
    - **Resolved Store Type Errors**: Fixed "Cannot find name 'AdminConfigSlice'" by properly importing the interface in `types.ts`.
    - **Fixed Social Store Integration**: Corrected the `refreshRecurringBounties` call site in `App.tsx` to target `useSocialStore` instead of the main store.
    - **Implemented Loading Skeletons**: Added `SkeletonPageLoader` to `ProtectedRoute` for a smoother, game-like initial load experience.

- [x] **2026-04-25** — **Passive Income Engine & Real Estate Overhaul**:
    - Refactored the Real Estate system to use the global `useEconomyStore` and connected it to `BizCoin` economy.
    - Implemented **Offline Income Accrual** (up to 24 hours) to reward daily check-ins.
    - Created the **Passive Income Welcome Modal** (CEO Welcome) with visual effects and confetti.
    - Achieved **100% Arabic Localization** for the entire Real Estate feature, including 9 property types, descriptions, and UI controls (market status, /d suffixes, buttons).
    - Removed redundant UI elements (top back button) to improve navigation flow within the sidebar layout.

- [x] **2026-04-25** — **Progressive Web App (PWA) Conversion**:
    - Converted the application to a PWA using `vite-plugin-pwa`.
    - Configured `manifest.webmanifest` and service workers for offline caching and standalone display.
    - Generated and linked `192x192` and `512x512` placeholder app icons.
    - Created and injected `PWAInstallBanner.tsx` into the main application to handle native `beforeinstallprompt` events and offer a 1-click home screen installation.

- [x] **2026-04-25** — **Adventure Map Localization & Layout Polish**:
    - Completed 100% Arabic localization for the Adventure Map and Lesson Engine (Header, Stage Labels, Module Titles).
    - Fixed hardcoded English strings in difficulty and energy badges.
    - Resolved horizontal scrollbars triggered by hover scaling in the main Layout.
    - Improved "Weekly Featured Gig" card clickability.

    - **Kid UI Full Arabic Localization Pass**:
        - **Bottom Navigation**: Translated hardcoded "Map", "Quests", "News", "Avatar" labels in `BottomNavigation.tsx` via `t()` + new `bottomNav` locale module.
        - **Sidebar Stats**: Added missing `stats.*` namespace (streak, days, bizcoins, level, xp) to Arabic locale so the desktop sidebar renders in Arabic.
        - **Avatar Customizer**: Translated category tabs, items list count layout (RTL), and all 22 Avatar Item names dynamically.
        - **Weekly Challenge Widget**: Translated hardcoded "LAST DAY!", "Xd LEFT", "% complete", "Claimed", and "Claim Weekly Reward!".
        - **CEO Challenge Widget**: Localized the "Weekly CEO Challenge" modal, "Completion Rewards" section, and "Your Stats This Week" area using dynamic keys.
        - **BizPulse News Feed**: Completed full Arabic translation of all 30 business news articles, categories, and tags using `bizpulse.ts`.
        - **Weekly CEO Challenge**: Translated BizCoins/XP reward labels, Go button, and bonus reward message.
        - **Google OAuth Fix**: Removed custom `state` override from `signInWithOAuth` queryParams that was causing `bad_oauth_state` error on Google Sign-In.

- [x] **2026-04-26** — **Family Job Board 2.0 (Recurring Chores & Verification)**:
    - Implemented **Recurring Chores** with `DAILY` and `WEEKLY` reset logic in `bountySlice.ts`.
    - Added **Photo Verification** workflow: kids can upload/capture photos to prove task completion, and parents can review thumbnails before approval.
    - Built a **Notification System** with a centralized hub, unread counters, and global toast alerts for task submissions and approvals.
    - Enhanced the **Family Management** UI with parent invite codes and improved kid-to-parent linking.
    - Verified the 2.0 infrastructure (Post Job modal, recurring badges, linking) via browser testing.

- [x] **2026-04-26** — **Mobile-First Overhaul & Native PWA Experience**:
    - Transformed the app into a touch-optimized experience with Bottom Sheet modals for all core features (Spin, Challenges, Library, Avatar).
    - Implemented horizontal scroll-snapping carousels for Real Estate and Store grids, eliminating long vertical scrolls on small screens.
    - Polished bottom navigation with larger tap targets, safe-area support, and haptic-like animations.
    - Optimized PWA install banner with premium glassmorphism design and adjusted vertical positioning.
    - Created a central `useIsMobile` hook for responsive UI logic.

- [x] **2026-04-25** — **The "Passive Income" Engine (Advanced Economy)**:
    - Implemented a tiered property upgrade system with level caps and visual progression.
    - Added background income generation logic that calculates profits while the user is offline.
    - Integrated real-time "Income Collected" notifications and confetti effects for property leveling.
    - Optimized property rendering with O(1) map lookups and enhanced Arabic localization for the upgrade interface.

- [x] **2026-04-25** — **Full Arabic Library Localization & Build Stabilization**:
    - Completed 100% Arabic localization parity for the library by injecting 82 missing translation objects into `exclusive_books.ts`.
    - Resolved critical build-breaking syntax errors including unquoted numeric keys (e.g., `'1984_biz'`), missing trailing commas, and malformed multiline strings.
    - Standardized all Arabic summaries and full content to use robust template literal formatting with automated escaping.
    - Verified application stability with a successful production build (`npm run build`).
    - Purged stale `.js` files from Vite cache and bumped Zustand store version to hard-reset legacy `localStorage` bugs causing shifted book covers.
    - Updated `syncLibrary` hook to aggressively merge correct static data over local state while preserving custom admin books.

- [x] **2026-04-20** — **Arabic Library & Syntax Stabilization**:
    - Resolved a critical duplicate property error in `src/locales/ar/library_books.ts`.
    - Localized 9 additional books with rich Arabic content (titles, summaries, and lesson plans).
    - Fixed 50+ syntax errors (mismatched quotes, rogue backticks) using automated diagnostic scripts.
    - Generated and deployed professional book covers for *Company of One* and *Never Split the Difference*.
    - Updated `BookLibrary.tsx` to handle dynamic title translation for all age groups.

- [x] **2026-04-19** — **Arabic Localization Modularization**:
    - Split monolithic `ar.ts` into 62 modular files in `src/locales/ar/`.
    - Created `src/locales/ar/index.ts` for unified aggregation.
    - Updated `src/lib/i18n.ts` to use the new modular system.
    - Fixed numerous English strings and garbled text in the Arabic bundle.
    - Resolved port 5000 zombie process and verified app functionality.
- [x] **2026-09-29** — **Comprehensive Codebase & Roadmap Audit**:
    - **Build & Health Verification**: Verified `tsc && vite build` (clean exit 0) and `vitest --run` (32/32 test files, 272/272 tests passing).
    - **Gap Analysis**: Completed comprehensive audit against `PRD.md`, `upgradesplan.md`, `profitspatrol_video_section_system_prd.md`, and `lessons_for_videos.md`. Identified 6 core implementation priorities.

---

## 🚧 Implementation Roadmap (Next Priorities)

- [ ] **1. Video Section System Overhaul ("Learning Shorts")** 🎬 *(Highest Impact)*:
    - **Vertical 9:16 Feed**: TikTok/Reels-style touch-first vertical scrolling feed with auto-play, swipe gestures, animated captions, and sound effects.
    - **Watch Rewards & Anti-Cheat**: Reward +10 XP & +5 PP Tokens upon 90% watch time, tracked in `videoSlice.ts` to prevent duplicate claims.
    - **Interactive Post-Video Quizzes**: Integrated 1-question overlay quizzes from `lessons_for_videos.md` (3,800+ lines of scripts) rewarding +20 XP & +15 PP Tokens.
    - **Action Challenges**: Physical challenge cards (lemonade stand, room clean) with photo upload proof connected to parent approval in `bountySlice.ts`.
    - **"Ollie Explains" Series**: Mascot-led financial concept shorts with full English and Arabic localization.

- [ ] **2. Upgrade 9 — AI Voice Interaction for The Tank (Multilingual)** 🎙️:
    - **Text-to-Speech (TTS) Synthesis**: Web Speech API (`window.speechSynthesis`) or AI TTS to give judges voices that speak offers and feedback in English (`en-US`) and Arabic (`ar-SA`).
    - **Speaking Audio Visualizer**: Animated speech waveform or glowing avatar indicator on the active speaking judge.
    - **LLM Judge Personas**: Integrate dynamic LLM evaluations (Gemini / AI proxy) replacing static keyword heuristics in `TheTankEngine.ts`.

- [ ] **3. Upgrade 10 — Real-Time Stock Market API Integration** 📈:
    - **Ticker Mapping**: Map kid companies to real equities (BurgerBoss ➔ `MCD`, RocketTech ➔ `TSLA`, SneakerKing ➔ `NKE`, MediaMogul ➔ `DIS`).
    - **Live Market Data**: Integrate Finnhub / Edge Function `/api/stocks` with 1–5 minute caching and rate-limit protection.
    - **Offline Fallback**: Preserve current deterministic random-walk engine when offline or during weekend market closures.

- [ ] **4. Upgrade 1 — Mobile Touch Controls for Complex Mini-Games** 🎮:
    - **Virtual Touch D-Pad**: Add on-screen D-pads for `GridTemplate.tsx` (Pizza Delivery, Lawn Master) for mobile/tablet play without keyboards.
    - **Touch Drag & Drop**: Upgrade `ConveyorTemplate.tsx`, `OperationsTemplate.tsx`, and `DefenseTemplate.tsx` for touch tap/swipe targets (min 44x44px).

- [ ] **5. Family Job Board 2.0 Web Push Notifications** 🔔:
    - **Web Push API**: Request permissions and send native browser/OS notifications when a kid submits chore photo proof or a parent approves/pays out.

- [ ] **6. Technical Debt & Stubs Resolution** 🛠️:
    - **Stripe Billing Portal**: Implement `create-billing-portal-session` client handler in `src/lib/stripe.ts`.
    - **SupabaseAdapter CMS**: Implement `cmsContent` mapping in `SupabaseAdapter.ts`.
    - **Analytics Wiring**: Connect `AnalyticsService.ts` to backend events table.
    - **Locale Checker**: Update `scripts/sync-locales.cjs` to support modular `src/locales/ar/` directory structure.

---

## 📂 Key File Locations

### 🎮 Games
- `src/features/game/data/games.ts` — Database of all games.
- `src/features/game/components/` — Game engine and custom components.
- `src/features/games/registry/canonicalRegistry.ts` — 50 Canonical Arcade Games.

### 🎬 Videos & Learning Shorts
- `profitspatrol_video_section_system_prd.md` — Video section PRD & design specs.
- `lessons_for_videos.md` — 3,849 lines of lesson scripts & quiz questions.
- `src/features/education/components/VideoLibrary.tsx` — Video library UI.
- `src/features/education/data/videos.ts` — Video database.
- `src/store/slices/videoSlice.ts` — Video state & watch history.

### 📚 Library
- `src/features/library/data/` — Static data for books.
- `src/features/library/components/` — UI for library and modals.

### 🗣 Debate Dojo & The Tank
- `src/features/debate/data/topics.ts` — Expanded to 9+ topics.
- `src/features/debate/components/DebateArena.tsx` — Main UI.
- `src/features/tank/components/TheTankMode.tsx` — The Tank pitch arena.
- `src/features/tank/logic/TheTankEngine.ts` — Pitch analysis and judge offers.

### 📈 Stock Market
- `src/features/game/components/StockMarket.tsx` — Stock market modal & portfolio.
- `src/features/game/components/game-templates/StockMarketTemplate.tsx` — Tycoon template.

### 🌍 Translations (i18n)
- `src/locales/en.ts` — English Master.
- **`src/locales/ar/`** — **Modular Arabic Bundle (62 files)**.
- `src/lib/i18n.ts` — i18next configuration.

---

## 🚀 Recent Developments & UI Enhancements (October 2026)

### 1. Real Estate Markets Character Artwork
- Replaced basic property icons with 9 custom-generated illustrations featuring Profitspatrol characters:
  - Ollie (Lemonade Stand, Solar Farm, Cloud AI Data Center)
  - Kami (Bakery Corner, Eco Organic Farm)
  - Reema (Fashion Boutique, VR Gaming Arena)
  - Filo (Ethical Bookstore)
  - Rex (Lumina Mega Tower)
- Assets stored in `public/images/properties/` and integrated into `src/features/venture/data/properties.ts`.

### 2. User Profile Header Polish
- Removed duplicate controls (Theme toggle, Language switcher, Settings button, Sign Out button) from `UserProfile.tsx` header to keep the layout unified and clutter-free.

### 3. PlayHub & Ollie AI Bubbles Fixes
- **Admin Access to PlayHub**: Enabled `PlayHubFAB` for both `isKid` and `isAdmin` in `src/components/layout/Layout.tsx`.
- **Ollie Assistant Bubble on Map**: Removed map suppression (`isMapPage`) in `src/features/game/components/OllieChat.tsx`, and repositioned Ollie to `bottom-20 md:bottom-8` when collapsed to avoid overlap with PlayHub (`start-4`).
- **TopBar Redundancy Removal**: Removed duplicate `Daily Spin (🎡 المكافأة)` and `BizPulse (📰 الأخبار)` chips from `TopBar.tsx` minimal header, as both already exist within PlayHub.
- **Economic Events Ticker Restored**: Embedded `<NewsTicker />` beneath `StickyUnitBanner` in `src/features/hq/components/AdventureMap.tsx` so real-time economic events affecting the game are always visible.

### 4. Map Header Unification & Resource Merge
- **Generic Logo Removed**: Removed redundant generic `ProfitsPatrol 🦉` logo and detached minimal TopBar from `AdventureMap.tsx`.
- **Merged Health & Resources with "Who's Here Now" Tab**: Integrated player Hearts/Health (`❤️` with `EnergyBar` fallback), Coins (`🪙`), and Stars (`⭐️`) into [`DistrictResidentsStrip.tsx`](file:///g:/Vibe%20coding/Profitspatrol/src/features/education/components/path/DistrictResidentsStrip.tsx).
- **Responsive Layout**: On one side sits the "من في الحي الآن؟" accordion button with time badge and character avatars (Hero, Rex, NPCs, and Trust/Relationships); on the other side sits the player's health, coins, and stars counters.
- **Sticky Banner Polish**: Updated [`StickyUnitBanner.tsx`](file:///g:/Vibe%20coding/Profitspatrol/src/features/education/components/path/StickyUnitBanner.tsx) to pin seamlessly at `top-0` without empty gaps.

### 6. UI Assets & Icon Replacement (Debate, Card Academy, Arcade)
- **Debate Dojo (Image 1)**: Replaced generic emojis (`🥤`, `💰`, `🧪`, `🏠`, `🔄`, `📢`, `🤖`, `📸`, `🍰`) with 9 custom Pixar-style 3D illustrations in `public/images/debate/` (`cup_crisis.jpg`, `fair_pay.jpg`, `secret_ingredient.jpg`, `remote_office.jpg`, `subscription_model.jpg`, `school_ads.jpg`, `robots_workers.jpg`, `honest_review.jpg`, `sharing_pie.jpg`). Wired into `topics.ts` and `DebateArena.tsx`.
- **Card Academy (Image 2)**: Replaced the floating `💰` money bag emoji with custom 3D card academy splash art (`public/images/card-academy/hero.jpg`) in `CardGame.tsx`.
- **Arcade Cards (Image 4)**: Replaced plain icons and generic shapes with custom 3D illustrations across canonical games and classic simulations in `canonicalRegistry.ts` and `GameMenu.tsx`:
  - Station #46 Sales Master: `/images/arcade/sales.jpg`
  - Station #47 Marketing Machine: `/images/arcade/marketing.jpg`
  - Station #48 E-Commerce Rush: `/images/arcade/ecommerce.jpg`
  - Station #49 Pitch Battle: `/images/arcade/pitch.jpg`
  - Station #50 Startup Launch: `/images/arcade/startup.jpg`
  - Lemonade Tycoon: `/images/arcade/lemonade.jpg`
  - Brand Builder: `/images/arcade/brand.jpg`
  - Pizza Rush: `/images/arcade/pizza.jpg`
  - Cupcake Bakery: `/images/arcade/cupcake.jpg`

### 7. Arabic in English Translations & Assignments (Image 3)
- Aligned missing translation keys in `src/locales/en.ts` under `assignments` (including `tab_daily`, `tab_classroom`, `join_class_button`, `switch_class_button`, `no_class_card_title`, `enter_code_cta`).
- Replaced hardcoded Arabic string fallbacks in `StudentAssignmentDashboard.tsx` with English defaults so language switcher behaves consistently.

### 8. Family Invite Code Generation Fix (Image 5)
- Fixed `FamilyManager.tsx` to handle offline / Supabase-disconnected environments by automatically generating persistent `FAM-XXXX` invite codes with localStorage caching and user model sync.
- Removed premature early returns that caused `Error generating invite code. Try refreshing.`.

### 9. Test Suite & Compilation Health
- TypeScript compilation: `npx tsc --noEmit` passes with 0 errors.
- Vitest suite: 60 test files, 413 tests passing (100% green).

### 10. The Tank (عرين المستثمرين) UI/UX Overhaul & 3D Character Asset Generation
- **3D Game Show Arena & Character Art**:
  - Generated 9 high-definition 3D Pixar-style visuals in `public/images/tank/`:
    - `tank_arena_stage.jpg`: Cinematic TV studio arena with spotlights and glossy floors.
    - `tank_judges_panel.jpg`: Panoramic judging desk with Ollie, Reema, Filo, Kami, and Rex.
    - `tank_deal_victory.jpg`: Golden confetti victory celebration with novelty investment check.
    - `tank_coaching_board.jpg`: Backstage mentorship room with Ollie reviewing strategy blueprints.
    - 5 Individual 1:1 Judge Portraits: `judge_ollie.jpg`, `judge_reema.jpg`, `judge_filo.jpg`, `judge_kami.jpg`, `judge_rex.jpg`.
- **Full 7-Stage Gamified TV Show Immersion in `TheTankMode.tsx`**:
  - **PREP Stage**: Live broadcast badge (`🔴 بث مباشر من العرين`), interactive 5-judge panel with voice previews, Ollie coach bubble with 3 golden pitching rules, 3D ready CTA.
  - **PITCH Stage**: Real-time keyword checklist chips (**💰 Profit & Cost**, **🎯 Problem**, **💡 Solution**, **👥 Customers**) dynamically turning green as the child types/speaks, speech dictation waves, and Ollie teleprompter advice.
  - **THINKING Stage**: 3 panel judges appear with animated pulsing headshots and real-time lower-third financial deliberation ticker.
  - **TANK_FLOOR Stage**: 3 executive judge cards with custom character avatars, voice speaking waveforms, "Hear Offer" audio playback, and "I'm Out" stamps.
  - **NEGOTIATION Stage**: Face-to-face boardroom table with judge avatar, implied company valuation calculator, and counter-offer sliders.
  - **DEAL Stage**: Novelty giant investment check ceremony displaying negotiated valuation and equity, +500 PP Tokens reward burst, and full pitch breakdown.
  - **REJECTED Stage**: Backstage coaching scene with Ollie encouragement and actionable business improvements.
- **Engine & Voice Integration**:
  - Mapped all judges to character IDs, avatar paths, and accent colors in `src/features/tank/logic/TheTankEngine.ts`.
  - Localized character introduction voice lines in `src/services/voice/TankJudgeVoiceEngine.ts` in Arabic and English.
  - Upgraded `TheTankPage.tsx` with glassmorphic styling and eliminated plain CSS classes.
- **Map Node Interaction & Test Alignment**:
  - Added direct `onStartLesson(lesson.id)` trigger on active node click in `src/features/hq/components/AdventureMap.tsx`.
  - Updated button selector in `tests/AdventureMap20Modules.test.tsx` to target the first lesson button cleanly.

- [x] **2026-10-12** — **Rex Official Model Sheet Integration & Identity Canonicalization (T-Rex Dinosaur)**:
    - **1. Character Sheet Alignment**:
        - User uploaded official character sheet (`media_1791755240474.jpg`) defining Rex:
            - **Name**: ريكس (Rex)
            - **Species**: Cute Terracotta Red T-Rex Dinosaur (تيرانوصور / ديناصور لطيف) — NOT a raccoon.
            - **Role**: "طالب وحكم متدرب" (Student & Apprentice Judge / Sharp Negotiator & Rival).
            - **Color Palette**: Terracotta Red (`#C8553D`), Cream Snout & Belly (`#F5E6C8`), Navy Blue Cap/Apron (`#001B2A` / `#1E3A5F`), Gold Spikes & Pencil (`#F59E0B`).
            - **Signature Accessories**: Dark navy backwards baseball cap with yellow pencil tucked behind his ear; dark navy work apron with circular badge on chest.
            - **Personality**: متحمس، ذكي، فكاهي (Enthusiastic, Smart, Witty). Loves: كرة القدم، تنظيم الفرق، الألغاز (Soccer, Team Organization, Puzzles).
    - **2. Clean Character & Judge Visual Assets Generated**:
        - `public/images/characters_clean/rex_idle.png`: Crisp 260x280 transparent RGBA cutout of canonical Rex in standing front view with backwards cap, pencil behind ear, and work apron with badge.
        - `public/images/characters_clean/rex_eyebrow.png`: Clean 260x280 transparent RGBA cutout of Rex raising his eyebrow with hand on chin in calculating 3/4 pose.
        - `public/images/tank/judge_rex.jpg`: High-definition 1024x1024 3D studio portrait of Rex in calculating 3/4 pose on warm amber/midnight obsidian spotlight background.
        - `public/images/tank/tank_judges_panel.jpg`: Updated panoramic judging panel with Rex seated in seat 5 behind the executive desk and gold "REX" nameplate, with all raccoon remnants seamlessly removed.
    - **3. Full Codebase Identity Synced**:
        - Updated `rivalRex.ts`: Species changed to `'T-Rex Dinosaur'` / `'ديناصور تي-ريكس ذكي'`, role updated to apprentice judge & rival, colors updated to `#C8553D` and `#1E3A5F`.
        - Updated `RexShowdownModal.tsx`: Changed raccoon emoji 🦝 to dinosaur 🦖, updated alt text and fallback path to `/images/characters_clean/rex_idle.png`.
        - Updated `TheTankMode.tsx`: Bio updated to "المستثمر ريكس · طالب وحكم متدرب", ring styling updated to amber theme.
        - Updated `HeroMentorshipParentCard.tsx`, `storyQuests.ts`, `furniture.ts`, `BusinessDashboard.tsx`, and `assetRegistry.ts`.
        - Verified 100% test suite passing (17/17 tank tests, all green).
