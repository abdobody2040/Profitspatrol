# ProfitsPatrol Changelog

## [2026-10-14] - Enterprise Structured Logging & Observability Infrastructure

- **Structured Monolog Channel (`structured`)**: Implemented central Monolog 3.12 channel writing to `stdout`. Automatically outputs strict, single-line JSON (`StructuredJsonFormatter.php`) in staging/prod and colorized badges (`PrettyConsoleFormatter.php`) in local dev.
- **Request Correlation & W3C Tracing**: Integrated `RequestCorrelationMiddleware.php` which generates/preserves `X-Request-ID` and W3C standard `traceparent` (`trace_id`, `span_id`), returning them in response headers and binding them to thread-scoped `CorrelationContext.php`.
- **Frontend Client Correlation**: Updated `src/lib/api.ts` to automatically attach `X-Request-ID` to all outgoing API calls.
- **Single Access Line**: Every HTTP request emits exactly one `http.request.completed` access log line with method, route, status, `duration_ms`, client IP, user ID, and request ID.
- **Global Exception Boundary**: Laravel 13 `bootstrap/app.php` exception reporter serializes unhandled exceptions and fatal errors (`class`, `message`, `code`, `file`, `stack_trace`), logging once at the boundary.
- **Safety & PII Redaction**: `RedactionProcessor.php` recursively sanitizes context and messages, masking passwords, API keys, tokens, secrets, credit cards, CVVs, SSNs, national IDs, phones, and emails.
- **Centralized Stack (Loki + Vector + Grafana)**: Added `monitoring/docker-compose.logging.yml` with Grafana Loki 3.x (30-day retention), Vector collector with a **1GB on-disk buffer** (`buffer.type = "disk"`), and Grafana 11 dashboards. Kubernetes DaemonSet provided in `monitoring/k8s/vector-daemonset.yaml`.
- **SRE Alert Rules & Dashboard**: Added 4 Loki alert rules (`ErrorRateSpike`, `Http5xxRatioSpike`, `FailedLoginBurst`, `ServiceNoLogsHeartbeat`) and production Grafana dashboard with saved queries.
- **Testing & Master Docs**: 7/7 PHPUnit tests passing green (`backend/tests/Feature/LoggingAndCorrelationTest.php`), standalone health check script `backend/scripts/verify-logging.php`, and master reference published in `LOGGING.md`.

## [2026-06-20] - Ollie Bubble Fix, UI Polish & Localization

- **Fixed Ollie Chat Layout & Overlaps**: Raised z-index to `z-[210]` (above BottomNavigation at `z-[200]` and NewsTicker at `z-[190]`), and implemented dynamic vertical offsets: `bottom-[240px]` when closed to stack neatly above the `PlayHubFAB` (`bottom-[168px]`), and `bottom-4` (mobile) / `md:bottom-6` (desktop) when open so that the chat window sits nicely within mobile screen heights. Added CSS transitions for smooth sliding.
- **Fixed Windows Coin Emoji Tofu Boxes**: Purged the unsupported unicode coin emoji `🪙` throughout all translation files, state configurations, and UI components, replacing it with the high-fidelity SVG `<CoinIcon />` or the universally supported `💰` emoji.
- **Fixed Daily Missions Modal Rendering**: Lazy-loaded and registered the `<DailyMissions />` component in `GlobalModalManager.tsx` to resolve the empty white sheet issue. Unified open trigger logic across layout.
- **Fixed Ollie Definition Bubble (Out-of-View)**: Rewrote the tooltip in `UniversalLessonEngine.tsx` to use **viewport-aware `fixed` positioning** instead of `absolute bottom-full`. On term click, the button's `getBoundingClientRect()` is recorded and clamped so the bubble never exits screen edges in LTR or RTL. Flips below the word if insufficient space above.
- **Fixed Ollie Bubble Details**: Added a prominent **term name label** inside the bubble (bold, centered). Bubble now shows header → term → definition in correct order.
- **Fixed JSX Syntax Error**: Removed broken `</span>resence>` string (leftover from a previous partial edit) that caused invalid JSX markup in `UniversalLessonEngine.tsx`.
- **Fixed Ollie Definitions DB** (`src/lib/gemini.ts`): Replaced hardcoded generic "Strategy/Planning" fallback with a comprehensive `DEFINITIONS_DB` mapping curriculum terms in English & Arabic to accurate, kid-friendly definitions (Barter/المقايضة, Piggy Bank/حصالة النقود, Budget/الميزانية, Earn/كسب المال, Invest/الاستثمار, Entrepreneur, Supply & Demand, and more).
- **Fixed Ollie Bubble Scroll**: Removed internal scroll from tooltip. Bubble now uses `whitespace-normal break-words` with fixed width — content flows without a scrollbar.
- **Fixed Dual Scrollbars**: Resolved double-scrollbar issue on the map page caused by both the outer layout container and the inner map panel having independent `overflow-y: auto`.
- **Fixed District Card Translations**: Replaced hardcoded Arabic inline ternaries (`isArabic ? 'مكتمل' : 'Complete'`) in `KidMap.tsx` with `t()` i18n calls for consistent translation.
- **Added Dark Mode to District Cards**: Added `dark:bg-slate-800 dark:text-slate-200 dark:border-amber-700/50` to the center "Current Mission" card in `KidMap.tsx`, which previously used hardcoded `bg-white text-slate-800` ignoring the active theme.
- **Added Dismiss Overlay**: Clicking anywhere outside the Ollie bubble now dismisses it cleanly.

## [2026-06-15] - Map HUD Actions & Z-Index Fixes
- **HQ Level & Empire to Header**: Moved the floating `HQ Level` and `Empire Overview` panels into the compact top HUD header on the map page, cleaning up the right side of the screen.
- **Restored Ollie Chat**: Restored the floating Ollie AI chat button to its original position instead of embedding it in the header.
- **Universal Lesson Engine Z-Index**: Increased `UniversalLessonEngine`'s z-index to 300 so that it correctly overlays both the bottom navigation bar and the news ticker during an active lesson.
- **Fixed Desktop Bottom Navigation**: Removed the `md:hidden` class from the `BottomNavigation` bar, making the 7-item bottom action bar available consistently across all screen sizes.
## [2026-06-10] - Map Layout Responsiveness & Bottom Navigation Gating
- **Fixed Map Layout & Full-Bleed Background**: Adjusted padding rules for active tab `/map` in `Layout.tsx` to render the map full bleed without black margins/borders on both desktop and mobile viewports.
- **Fixed Side Hovering Panels**: Wrapped the Empire Overview and HQ Level cards in React Portals inside `KidMap.tsx` to render them at `document.body` level. Added support for dynamic text directions (`dir={isArabic ? 'rtl' : 'ltr'}`) to prevent overlaps with right-hand sidebar navigations in RTL mode.
- **Fixed Bottom Navigation Visibility**: Added conditional checks in `BottomNavigation.tsx` to return `null` if `user` is not authenticated or if the current route is a public/auth/marketing path (e.g. `/`, `/login`, `/register`, `/curriculum`, `/pricing`, etc.), ensuring the navigation menu does not show on pages outside the core application.
- **Fixed Desktop Layout Stretch & Sidebar Alignment**: Moved `<BottomNavigation />` from `App.tsx` into the `<main>` layout container in `Layout.tsx` and updated container styling to `absolute bottom-0 left-0 right-0 w-full`. This ensures that on desktop screens, the bottom navigation stretches exactly to the edge of the sidebar without overlapping or overlaying it.
- **Fixed OllieChat Widget Positioning**: Added dynamic bottom offset class configuration in `OllieChat.tsx` to position the chat button and coaching dialog box above the bottom bar on the map page, preventing visual overlap.

## [2026-06-07] - HQ 4.0 Empire Management & Localization
- **Completed HQ 4.0 Integration**: Redesigned the Headquarters dashboard into a 4-tab premium RPG-style hub (My Empire, HQ Builder, Skills, Missions). Integrated the Interactive HQ canvas (3D isometric / 2D dollhouse), customizable theme toggles, furniture inventory management, and upgraded progression path.
- **Completed Premium World Map Redesign**: Replaced the legacy map HUD with a premium dark game HUD containing active rank badges, passive income emerald indicators, PP tokens, and daily streaks. Implemented District header cards (rewards, progress, next unlocks) and the 7-icon Bottom Action Bar with a pulsing center "Collect" hero button.
- **Implemented Full Localization (Arabic & English)**: Translated all newly introduced UI strings (HUD, district cards, side panels, bottom action bar, Ollie coach CTA, and ranks) for both components. Wired all dynamic strings using `react-i18next`'s `t()` hook in `KidMap.tsx` and `Headquarters.tsx`, and verified zero-error type checking.

## [2026-06-07] - Admin Layout & Currency Alignment
- **Fixed Admin Layout Truncation**: Resolved the issue where `/admin?tab=USERS` and other admin panel views were squeezed into a centered `max-w-4xl` container, causing overlapping columns and empty margins in RTL mode. Added `admin_dashboard`, `teacher_dashboard`, and `parent_dashboard` to the list of tabs that render full width (`w-full h-full`) in `Layout.tsx`.
- **Fixed Coin Mismatch (BZ vs PP)**: Resolved why coin currency was displayed as "BZ" (BizCoins) instead of "PP" (ppTokens) on the Platform Analytics Economy Health dashboard. Updated `EconomyHealth.tsx` to format currency as `PP` instead of `BZ`, aligning it with the application-wide "PP Tokens" rebranding.

## [2026-06-06] - Mobile UI Fixes & Layout Overhaul
- **Fixed Mobile Top Bar Overflow**: Removed `ThemeToggle` and `LanguageToggle` from the mobile top bar in `Layout.tsx`. These controls are still accessible via the mobile menu drawer. Reduced gap from `gap-3` to `gap-1.5`. Top bar now shows: Logo | EnergyBar | NotificationCenter | Coins | Menu.
- **Fixed Mobile Bottom Navigation Labels**: Replaced fixed `w-16` width on `MobileNavItem` with `flex-1` so all 5 items distribute evenly across the screen. Removed `max-w-[60px] truncate` constraint that was cutting off labels like "ADVENTURE MAP" → "ADVENTU...". Labels now wrap cleanly at `text-[9px]`.
- **Fixed Library Mobile Layout**: Replaced horizontal snap-carousel (`snap-carousel no-scrollbar`) with a responsive 2-column CSS Grid (`grid grid-cols-2`) on all screen sizes. Cards now stack vertically in 2 columns on mobile (cover on top, text below), showing many books at once instead of 1 card at a time. Book cover sizes reduced to `w-20 h-28` on mobile.
- **Fixed BizStore Mobile Layout**: Applied the same carousel-to-grid conversion in `BizStore.tsx`. Store items now display in a 2-column grid on mobile. Item icon reduced to `w-16 h-16` on mobile, text to `text-sm`, button to `py-2`.

## [2026-05-17] - Card Academy Rebranding & Mobile Responsiveness Overhaul
- **Fixed Mobile Scroll & Overflow**: Added `max-height: calc(100vh - 160px)` and `overflow-y: auto` to `.business-grid` with custom scrollbar styling, completely resolving mobile view cutoff issues and ensuring all 24 cards can be smoothly scrolled.
- **Fixed Mobile Responsiveness**: Replaced all rigid inline grid layouts with flexible, media-query-driven responsive CSS classes (`.business-grid`, `.shop-grid`, `.quiz-grid`) to adapt automatically to any screen size.
- **Implemented Mobile Grids**:
  - Enforced a beautiful **2-column** layout on mobile viewports (widths <= 600px) for the 24 business selection cards, scaling up to **3-column**, **4-column**, and **6-column** layouts on larger tablet and desktop screens.
  - Converted the Quiz option layout from a squeezed 2-column grid to a clean stacked **1-column** format on mobile viewports for maximum readability.
  - Converted the Shop upgrades layout to responsive **1-column** on narrow viewports, **2-column** on mobile/tablet, and **3-column** on desktop.
- **Rebranded**: Game name from "Card Game" / "ProfitsPatrol Card Game" to **Card Academy (أكاديمية الكروت)**.
- **Removed**: Isolated in-game language selector. Enforced complete linguistic alignment with the global app-wide language switcher hook (`react-i18next`).
- **Added**: Reactive MutationObserver `useDark` hook to seamlessly synchronize dark mode settings in real-time with the parent application container class toggles.
- **Added**: Theme-aware inline Vector SVG illustration engine rendering 24 unique, highly detailed, and scalable vector graphics (instead of low-resolution system emojis) for all business cards.
- **Improved**: Significantly enlarged business card typography (up to `0.85rem` titles and `14px` coin icons) and card grid geometries (added `minHeight: 135px` with a balanced responsive grid) to make the illustrations and labels highly readable.
- **Added**: Carried these premium illustrations into the Active Playing Hub header, and as large `80px` visual outcome badges in both the Win and Lose result screens.

## [2026-05-16] - Phase 4 Completion & Infrastructure
- **Added**: AI Production Engineering & Persistent Memory System (`/.ai/`).
- **Added**: 3D Isometric HQ Builder with NPC employees.
- **Added**: Debate Fallacy Detector in GeminiService.
- **Added**: Conveyor Template for industrial simulations.
- **Fixed**: Multiple TypeScript type errors in `GameEngine` and `TheTank`.
- **Improved**: Mobile responsiveness for the HQ page.

## [2026-05-04] - Test Suite Stabilization
- **Fixed**: Vitest failures in `ContentGating` and `ContentAdditions`.
- **Improved**: UI feedback for locked content on the Map.

## [2026-05-03] - Profile Consolidation & Freemium
- **Merged**: Avatar Customizer into User Profile.
- **Implemented**: Freemium paywall gating for Debate Dojo and Side Hustle.
- **Fixed**: Arabic translations for Portfolio.

## [2026-05-01] - Security & Rebranding
- **Rebranded**: "BizCoins" to "PP Tokens".
- **Security**: Purged service_role keys from client. Implemented Security Definer RPCs.
- **Added**: Audit logs for sensitive actions.

## [2026-04-25] - PWA & Real Estate
- **Added**: PWA support with manifest and service workers.
- **Overhauled**: Real Estate system with passive income generation.
- **Added**: Offline income accrual (up to 24h).
