# ProfitsPatrol Known Bugs & Issues

## Critical
- **None currently identified.**

## High
- **Mobile Viewport Jitter**: 
  - **Symptom**: Layout shifts on Android devices <320px width during keyboard entry.
  - **Reproduction**: Open login page on a small Android device, tap input.
  - **Possible Fix**: Implement a global resize listener to handle viewport height changes manually or use `dvp` units.

## Medium
- **Phaser Game Scaling**:
  - **Symptom**: Mini-games (Action category) may have coordinate offsets on high-DPI screens.
  - **Possible Fix**: Update Phaser config to use `Scale.RESIZE` or `Scale.FIT` with proper parent container bounds.

## Low
- **i18n Key Duplication**: Duplicate keys `audience` in `ar/games.ts` and `lesson_CORP_145_body` in `ar/lessons.ts` still present (Vite warning, non-breaking).
- **Stale localStorage**: Users with very old store versions might see shifted book covers until a hard refresh.
  - **Fix**: Implemented store versioning to force-clear incompatible state.
- ~~**Ollie Chat Overlap & Hidden under Bottom Bars**: Floating chat button is covered by BottomNavigation (z-200) and NewsTicker (z-190).~~ **RESOLVED 2026-06-20** — Raised z-index to `z-[210]` and shifted bottom position closed to `bottom-[240px]` (above PlayHubFAB) and open to `bottom-4` / `md:bottom-6`.
- ~~**Ollie Chat Window Off-Screen**: Opening chat window on mobile viewports pushes the header off the top edge.~~ **RESOLVED 2026-06-20** — Added dynamic vertical position shifting to `bottom-4` when open so the entire layout fits the screen heights.
- ~~**Windows Coin Emoji Tofu Boxes**: Coin emoji `🪙` rendered as empty boxes on standard Windows OS installations due to Segoe UI Emoji font limitations.~~ **RESOLVED 2026-06-20** — Replaced `🪙` with `💰` or high-fidelity `<CoinIcon />` SVG throughout translation tables and visual components.
- ~~**Daily Missions Modal Blank Sheet**: Clicking Daily Missions in Play Hub opened a blank white sheet.~~ **RESOLVED 2026-06-20** — Registered and lazy-loaded `<DailyMissions />` under `'dailyMissions'` type in `GlobalModalManager`.
- ~~**Mobile Bottom Nav Label Truncation**: `MobileNavItem` labels were truncated (ADVENTU..., LEADERB...) due to `w-16` fixed width + `max-w-[60px] truncate`.~~ **RESOLVED 2026-06-06** — switched to `flex-1` with `text-[9px] word-break`.
- ~~**Mobile Library/BizStore Carousel**: Only 1 item visible at a time due to `snap-carousel` horizontal layout.~~ **RESOLVED 2026-06-06** — converted to `grid grid-cols-2` vertical layout.
- ~~**Ollie Bubble Out-of-View**: Tooltip clipped off-screen in RTL mode; `start-0` pushed the 288px bubble beyond the left viewport edge, causing horizontal scrollbars.~~ **RESOLVED 2026-06-20** — rewritten to use `fixed` viewport-aware positioning clamped within screen bounds.
- ~~**Ollie Bubble Wrong Definition**: `getOwlyExplanation` returned the same "Strategy/Planning" fallback for every term regardless of what was clicked.~~ **RESOLVED 2026-06-20** — replaced with `DEFINITIONS_DB` dictionary lookup with accurate kid-friendly definitions in EN & AR.
- ~~**Ollie Bubble Scroll**: Internal scrollbar appeared inside the tooltip bubble.~~ **RESOLVED 2026-06-20** — removed overflow scroll; bubble uses natural flow with `whitespace-normal break-words`.
- ~~**District Cards Hardcoded White Background**: The center "Current Mission" card in KidMap used `bg-white text-slate-800`, ignoring dark mode.~~ **RESOLVED 2026-06-20** — added full `dark:` class variants.
- ~~**Dual Scrollbars on Map**: Two scrollbars appeared simultaneously on the `/map` route.~~ **RESOLVED 2026-06-20** — removed conflicting `overflow-y: auto` from the outer layout container.
