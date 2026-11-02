# ProfitsPatrol Context

ALL AI AGENTS MUST READ THIS FILE BEFORE STARTING WORK.

## Project Overview
ProfitsPatrol is a gamified business education platform designed to teach kids financial literacy and entrepreneurship through interactive simulators, lessons, and RPG mechanics.

## Business Goals
- Provide engaging financial education for kids (Ages 7-18).
- Maintain a "Juicy" and high-energy mobile game aesthetic.
- Support multi-role access (Kid, Parent, Teacher, Admin).
- Achieve high retention through daily/weekly game loops and progression.

## Tech Stack
- **Frontend**: React 19, TypeScript, Vite 7, Tailwind CSS.
- **State Management**: Zustand (Feature slices with hybrid persistence).
- **Backend/DB**: Supabase (PostgreSQL, RLS, Edge Functions).
- **Animations**: Framer Motion.
- **i18n**: i18next (English & Arabic with RTL support).
- **Infrastructure**: Vercel (Deployment), PWA (Offline support).

## Current Progress
- **HQ 4.0 & Premium Map Redesign Complete**: Overhauled Headquarters into a 4-tab progression hub (My Empire, HQ Builder, Skills, Missions) with 3D/2D visual toggles, customized theme selection, and upgrades. Replaced the world map HUD with a premium slate-900 status bar, district cards with progress indicator/reward preview/next unlocks, and a 7-icon Bottom Action Bar with pulsing collection button.
- **Card Academy Overhauled**: Complete rebranding, theme/language synchronization, custom vector SVG illustration engine, enlarged high-contrast typography, and fully scrollable, responsive media-query-driven grid layouts for all viewport sizes.
- **Security Hardened**: Admin RPCs, Audit logs, and credential purge.
- **Localization**: 100% Arabic & English translation parity for all new HQ 4.0 and Map components, core curriculum, and arcade games. District card strings now use `t()` i18n calls (no more hardcoded Arabic ternaries).
- **Performance**: Route-based code splitting and optimized re-renders.
- **Ollie AI Tutor Polished** (2026-06-20): Ollie definition bubble fully fixed — viewport-aware `fixed` positioning, accurate `DEFINITIONS_DB` term lookup in EN & AR, no scrollbar, dismiss-on-click, correct term-name display. JSX syntax error resolved.
- **Theme Consistency** (2026-06-20): District cards in `KidMap.tsx` now fully support dark mode. All scrollbar conflicts on `/map` route resolved.

## Core Business Logic
- **Economy**: PP Tokens (currency), passive income from Real Estate, rewards from missions/challenges.
- **Education**: 200+ lessons with adaptive summaries based on age.
- **Progression**: XP-based levels (Intern -> Founder -> Board Member -> Tycoon).

## Engineering Standards
- **Strict TypeScript**: No "any", interfaces for all data structures.
- **Modular Design**: Feature-based organization in `src/features`.
- **Atomic UI**: Shared components in `src/components`.
- **Security**: RBAC enforced via Supabase RLS and custom Edge Functions.

## Known Limitations / Blockers
- Mobile viewport jitter on some small Android devices (<320px).
- High-DPI scaling issues in some Phaser mini-games.

## Immediate Next Tasks
- Implement Year 2 Competitive Seasons and Global Leaderboard.
- Expand Corporations/Guilds social features.
- Integrate Real-time Stock Market simulation.

---

Before making changes:
1. Read all .ai documentation
2. Analyze repository state
3. Continue from latest stable progress
4. Never rewrite stable systems unnecessarily
5. Update changelog after modifications
