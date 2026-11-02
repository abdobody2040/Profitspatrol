# Profits Patrol Games Integration Guide

## 1. Upstream Source Repository
- **Repository URL:** `https://github.com/abdobody2040/profitspatrol-games`
- **Upstream Commit SHA:** `8d0e347c6126697b2aac9b3e4969ec4666aa44aa`
- **Source Architecture:** React 19, TypeScript, Vite, Zustand, Framer Motion, i18next, 50 educational stations.

---

## 2. Integration Architecture & Boundaries

The integration lives under `src/features/games/` to prevent cluttering global namespace and enforce clear boundaries:

```
src/
└── features/
    └── games/
        ├── types.ts                    # UnifiedGameDefinition, RawGameResult, NormalizedGameResult
        ├── registry/
        │   └── canonicalRegistry.ts     # Single source of truth for all 50 arcade stations
        ├── runtime/
        │   ├── UnifiedGameShell.tsx     # Profits Patrol native lifecycle shell (Ollie mascot, stats, rewards)
        │   └── spatialControls.ts       # Physical LTR controls for directional games in RTL
        ├── adapters/
        │   ├── GameRewardAdapter.ts     # Authoritative rewards (XP + BizCoins + Stars) & idempotency
        │   └── GameProgressAdapter.ts   # Device caching + backend sync abstraction
        ├── components/
        │   ├── GameRunner.tsx           # Stations 01–15 switch & components
        │   ├── Batch04Games.tsx         # Stations 16–17
        │   ├── Batch04More.tsx          # Stations 18–20
        │   ├── Batch05Games.tsx         # Stations 21–25
        │   ├── Batch06Games.tsx         # Stations 26–30
        │   ├── Batch07Games.tsx         # Stations 31–35
        │   ├── Batch08Games.tsx         # Stations 36–40
        │   ├── Batch09Games.tsx         # Stations 41–45
        │   └── Batch10Games.tsx         # Stations 46–50
        ├── styles/
        │   ├── game-ui.css
        │   ├── game-visual-upgrade.css
        │   ├── batch08.css
        │   ├── batch09.css
        │   └── batch10.css
        └── locales/
            └── sourceResources.ts       # 50-game bilingual EN/AR dictionary merged into i18n
```

---

## 3. Game Lifecycle

All games share a unified lifecycle managed by `<UnifiedGameShell />`:
```
Idle / Menu Selection
       ↓
Briefing Screen (Objective, Skill Focus, Station Badge, Ollie Advice, Rewards Preview)
       ↓
Playing Stage (Touch + Keyboard controls, Pause button, Audio cues)
       ↓ (Optional: Paused Overlay)
Results Stage (Score, Star Rating, Authoritative +XP, +BizCoins, Learning Review)
       ↓
Return to Arcade / Replay
```

---

## 4. Authoritative Reward Flow & Anti-Duplication

1. **Client Game UI:** Emits raw outcome `{ achieved: boolean, score: number, stars: number }`.
2. **GameRewardAdapter:** Calculates XP, PP Tokens/BizCoins, and star upgrades based on user subscription tier, whether this is a first clear, and performance score.
3. **Idempotency Guard:** Every attempt generates a unique UUID `attemptId`. Attempts are tracked to ensure that replaying or refreshing does not award duplicate XP or tokens.

---

## 5. Localization & Physical Controls

- **Translations:** Merged seamlessly into i18next using `i18n.addResourceBundle` for English and Arabic.
- **RTL Directional Controls:** In directional games (e.g. `CoinCatcher`, `CashFlowRunner`), `.mobile-steer` is forced to `direction: ltr !important` so Left remains physically Left and Right remains physically Right regardless of language.

---

## 6. Phaser Handling

- All 50 educational stations in this repository are implemented using pure React 19 SVG/Canvas/DOM interactive components.
- Phaser 3.90 is not needed or bundled, eliminating 1.2MB of unnecessary bundle overhead while guaranteeing sub-second load times.

---

## 7. How to Update Upstream Games

1. Inspect updates from `abdobody2040/profitspatrol-games`.
2. Review modified components in `client/src/components/games/`.
3. Apply updates to the relevant `src/features/games/components/` files.
4. Run automated test suite: `npx vitest run src/features/games/__tests__/arcadeRegistry.test.ts`.
