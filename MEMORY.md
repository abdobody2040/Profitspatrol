# 🧠 ProfitsPatrol — Project Memory

> This file tracks all upgrade steps taken, in-progress, and remaining. Update this file at the end of every session.
> Last Updated: 2026-04-19

---

## 📍 Project Setup

| Item | Detail |
|------|--------|
| **Dev Server** | `npm.cmd run dev` → `http://localhost:5000` |
| **Run Command** | Must use `npm.cmd` (not `npm`) due to PowerShell execution policy |
| **Supabase URL** | `https://pftydgfqwbhfyikfxcxa.supabase.co` (from `.env.local`) |
| **Framework** | React 19 + Vite 7 + TailwindCSS 3 + i18next + Zustand + Framer Motion |

---

## ✅ Steps Completed

- [x] **2026-04-18** — App launched successfully at `http://localhost:5000`
- [x] **2026-04-18** — Created `MEMORY.md` (this file)
- [x] **2026-04-18** — Full codebase audit and implementation plan created
- [x] **2026-04-18** — Root cause of mobile scrolling identified: `Layout.tsx` line 246
- [x] **2026-04-18** — Fixed massive localization file corruption (`ar.ts`), deduplicated files, and resolved TS1005 & TS1117 errors.
- [x] **2026-04-18** — Resolved implicit `any` types in `BookLibrary.tsx`.
- [x] **2026-04-19** — Library Localization & Content Overhaul:
    - [x] Fixed 9 authors in `classicBooks.ts`.
    - [x] Replaced 100+ Unsplash covers with local paths and real book covers (Open Library API + AI-generated).
    - [x] Added rich Arabic `fullContent` for Top 5 Classic Books (Think & Grow Rich, Mindset, etc.).
    - [x] Added rich Arabic `fullContent` for all 6 Profits Patrol Exclusive books.
    - [x] Added generic task titles/descriptions (Quiz, Reflection, etc.) in Arabic and English.
    - [x] Fixed hardcoded banner/badge strings in `BookLibrary.tsx`.
    - [x] Bumped store version to v4 to clear stale localStorage cache.
    - [x] Resolved garbled UTF-8/emoji issues in `ar.ts`.

---

## 🔄 Steps In Progress

- [ ] **Upgrade 1** — Mobile responsiveness for all games
- [x] **Upgrade 2** — Fix Arabic text markdown formatting in Book modal
- [x] **Upgrade 3** — Expand Business Bestsellers content with real summaries (Top 10)
- [x] **Upgrade 4** — Add `_child` / `_teen` versions of all book content (Top 10)
- [x] **Upgrade 5** — Full Arabic translation audit (key diff en.ts vs ar.ts)
- [x] **Upgrade 6** — Debate Dojo: expanded to 9+ topics with Arabic translations
- [x] **Upgrade 7** — Library Local Covers & Content (DONE)
- [x] **Upgrade 8** — ✅ DONE (this file)

---

## 📁 Key File Locations

### 🎮 Games
| File | Purpose |
|------|---------|
| `src/features/game/data/games.ts` | All ~30 game definitions (GAMES_DB) |
| `src/features/game/components/GameEngine.tsx` | Wrapper for all BIZ_* template games (uses `fixed inset-0`) |
| `src/features/game/components/GameMenu.tsx` | Game selection grid (rendered inside Layout scrollable area) |
| `src/features/game/components/LemonadeStand.tsx` | Custom game — renders inside Layout (NOT GameEngine) |
| `src/features/game/components/CoffeeCart.tsx` | Custom game — same |
| `src/features/game/components/PizzaDelivery.tsx` | Custom game — same |
| `src/features/game/components/BrandBuilder.tsx` | Custom game — same |
| `src/features/game/components/RealEstateTycoon.tsx` | Custom game — same |
| `src/features/game/components/game-templates/` | 21 game template components used by GameEngine |

### 📚 Library / Books
| File | Purpose |
|------|---------|
| `src/features/library/data/classicBooks.ts` | Business Bestsellers static data (summaries are placeholders!) |
| `src/features/library/data/moreBooks.ts` | More books data (498KB) |
| `src/features/library/data/classicBooks.ts` | Exclusive books data |
| `src/features/library/components/BookLibrary.tsx` | Main library UI, renders both tabs |
| `src/features/library/components/ExclusiveBookCard.tsx` | Card for Profits Patrol Exclusives tab |
| `src/features/library/components/BookTaskCard.tsx` | Task card within book modal |
| `src/features/library/components/BookTaskModal.tsx` | Full task modal |

### 💬 Debate Dojo
| File | Purpose |
|------|---------|
| `src/features/debate/data/topics.ts` | 3 debate topics (need to expand to 9+) |
| `src/features/debate/components/DebateArena.tsx` | Debate UI (13KB) |

### 🌍 Translations / i18n
| File | Purpose |
|------|---------|
| `src/locales/en.ts` | English — master translation file (232KB) |
| `src/locales/ar.ts` | Arabic — 1MB+ translation file |
| `src/locales/de.ts` | German |
| `src/locales/es.ts` | Spanish |
| `src/locales/fr.ts` | French |
| `src/lib/i18n.ts` | i18n configuration |

**Key translation namespaces:**
- `library_books.*` — Business Bestseller book content (summary, keyLessons, tasks)
- `exclusive_books.*` — Profits Patrol Exclusive book content (fullContent, title, keyLessons)
- `debate.*` — Debate Dojo topics
- `arcade.*` — Game menu labels and badges
- `nav.*` — Navigation labels
- `lemonade.*` — Lemonade Stand game strings
- `weather.*` — Weather labels

### 🏗️ Layout & App Shell
| File | Purpose |
|------|---------|
| `src/components/layout/Layout.tsx` | Main app shell — sidebar, mobile top bar, bottom nav |
| `src/app/App.tsx` | Root app with all routes. Game route at `/games` |
| `src/routes/ProtectedRoute.tsx` | Route guards |

**Mobile scroll root cause (Layout.tsx line 246):**
```tsx
// CURRENT (causes scroll):
<div className={`flex-1 overflow-y-auto scroll-smooth ${
  ['the-tank', 'map'].includes(activeTab) ? 'p-0 pt-16 md:pt-0' : 'p-4 md:p-8 pt-20 pb-36 md:pt-8'
}`}>

// FIX: Add 'games' to the zero-padding exception list:
['the-tank', 'map', 'games'].includes(activeTab)
```

### 🗄️ Store & Types
| File | Purpose |
|------|---------|
| `src/store/index.ts` | Main Zustand store |
| `src/store/gameStore.ts` | Game-specific state (`activeGameId`) |
| `src/store/educationStore.ts` | Education/classroom state |
| `src/types.ts` | All TypeScript types (30KB) |

---

## 📋 Upgrade Execution Order

```
Step 1 → Layout.tsx mobile fix (single line change, highest impact)
Step 2 → Custom game components mobile fix (5 files)
Step 3 → Game templates mobile compact padding (21 files)
Step 4 → Debate topics.ts expand to 9 topics
Step 5 → en.ts + ar.ts: debate topic translations
Step 6 → classicBooks.ts: real summaries, real keyLessons, real quizzes
Step 7 → en.ts: library_books.* keys with _child and _teen variants
Step 8 → ar.ts: full key diff audit + add all missing translations
Step 9 → BookLibrary.tsx: Arabic markdown fix + hardcoded tab label fix
Step 10 → MEMORY.md update
```

---

## ⚠️ Known Issues / Gotchas

1. **PowerShell**: Use `npm.cmd` not `npm` — execution policy blocks `.ps1` scripts
2. **classicBooks.ts**: Most book summaries and key lessons are still PLACEHOLDER text beyond the Top 5.
3. **Arabic text in book modal**: The `fullContent` renderer in `BookLibrary.tsx` is now working, but multi-line markdown needs consistent `\n` or `\\n` usage across all books.
4. **i18next Cache**: Store version 4 handles clearing of stale `exclusiveBooks` URLs, but some `library` items might still be cached if they were moved to different namespaces.
5. **Debate topics currently 9+**: Successfully expanded in `topics.ts`.
6. **GameEngine is already mobile-safe**: Custom games (Lemonade, etc.) still need the padding fix in `Layout.tsx`.

---

## 🔮 Future Ideas (Not in Current Scope)

- Add video subtitles in Arabic for the Videos section
- Add Arabic audio for Ollie AI assistant responses
- Localize the game result modals and tutorial text per language
- Add Persian (Farsi) as a language option
