# ProfitsPatrol Key Technical Decisions

## 1. Feature-Based Directory Structure
- **Decision**: Organize source code by feature domain (`src/features`) instead of technical layer (`components`, `hooks`, etc.).
- **Rationale**: Scales better as the project grows. Developers can find all related files (UI, logic, state) in one place.
- **Alternatives**: Standard atomic or layer-based structure.
- **Impact**: Improved maintainability and developer onboarding.

## 2. Zustand for State Management
- **Decision**: Use Zustand instead of Redux or Context API.
- **Rationale**: Minimal boilerplate, high performance, and built-in persistence middleware.
- **Alternatives**: Redux Toolkit (too heavy), Context (performance issues for high-frequency updates).
- **Impact**: Clean code and predictable state sync.

## 3. Supabase for Backend
- **Decision**: Use Supabase (PostgreSQL + RLS) as the primary backend.
- **Rationale**: Rapid development with auto-generated APIs, robust authentication, and real-time capabilities.
- **Alternatives**: Custom Node.js/Express backend (too much overhead).
- **Impact**: Fast iteration and built-in security via RLS.

## 4. Hybrid Persistence (Cloud + Local)
- **Decision**: Implement a `StorageAdapter` to sync between Supabase and LocalStorage.
- **Rationale**: Allows the app to work offline or in "Guest Mode" while providing seamless cloud sync for registered users.
- **Impact**: Better UX and offline resilience.

## 5. Framer Motion for Animations
- **Decision**: Standardize on Framer Motion for all UI transitions.
- **Rationale**: Declarative API that fits React perfectly and handles complex layout animations easily.
- **Impact**: Achieving the "Juicy" game-like feel required for the target audience.

## 6. Theme-Aware Inline SVG Vector Graphic Engine
- **Decision**: Render customized vector SVG drawings for each business instead of system character emojis.
- **Rationale**: Eliminates OS-level emoji differences, provides a visually premium AAA card-game feel, and allows responsive styling (adaptive borders, glowing HSL bubbles) that matches Light/Dark themes perfectly.
- **Impact**: Stunning visual consistency, high-resolution rendering on modern displays, and maximum engagement.

## 7. Responsive CSS Grid Layouts and Scrollable Containers
- **Decision**: Replace hardcoded JSX inline styles with reusable, media-query-driven CSS classes (`.business-grid`) and apply explicit `max-height: calc(100vh - 160px)` with `overflow-y: auto` to prevent viewport clipping.
- **Rationale**: Statically hardcoded column layouts lead to squished text, while uncontrolled flex heights on 100vh wrapper screens prevent scrolling, leaving bottom elements inaccessible. Moving layout boundaries to CSS allows the grid to dynamically adjust:
  - **Business Selection Grid**: 6 columns on desktop, 4 columns on tablet, 3 columns on small tablet, and 2 columns on mobile (<= 600px) to support comfortable tapping.
  - **Quiz Options Grid**: 2 columns on desktop/tablet, and a stacked 1-column layout on mobile (<= 480px) to prevent option text overflow and truncation.
  - **Shop Upgrades Grid**: 3 columns on desktop, 2 columns on tablet, and 1 column on narrow viewports.
- **Impact**: Provides perfect visual readability and seamless vertical scrolling on all smartphone displays.

## 8. Mobile-First Grid Over Horizontal Carousel
- **Decision**: Replace all `snap-carousel` / `min-w-[Xpx]` horizontal scroll patterns in feature pages (Library, BizStore) with Tailwind responsive grids (`grid grid-cols-2 lg:grid-cols-3`).
- **Rationale**: Horizontal carousels only show 1 item at a time on narrow viewports, requiring the user to discover scrolling direction. Vertical grids show 2 items per row immediately, match user expectations for a catalog UI, and allow natural vertical scrolling.
- **Pattern**: Remove `isMobile ? 'snap-carousel...' : 'grid...'` conditionals — use a single unified responsive grid. Cards adapt internally using `md:` prefixes for size adjustments.
- **Impact**: Dramatically improved content discoverability on mobile. Applied to: `BookLibrary.tsx`, `BizStore.tsx`.

## 9. Lean Mobile Top Bar
- **Decision**: Remove `ThemeToggle` and `LanguageToggle` from the mobile fixed top bar. Keep only: Logo, EnergyBar, NotificationCenter, Coins badge, Menu button.
- **Rationale**: With 7+ items in the top bar, the right side overflowed on screens < 400px, hiding the Menu button. These are low-frequency actions available inside the menu drawer.
- **Impact**: Clean, uncluttered mobile header with all critical elements always visible.

## 10. Portal Rendering for Mobile Hovering Panels
- **Decision**: Portaled the floating panels (**HQ Level** and **Empire Overview**) in `KidMap.tsx` to `document.body` via React Portal and set a high z-index (`z-[150]`).
- **Rationale**: Prevents elements from being clipped by overflow-x containers or parent scroll containers on mobile views. Added dynamic `dir` class configuration for RTL to automatically reposition them based on active localization settings.
- **Impact**: High-fidelity rendering across all screen sizes and device viewports.

## 11. Bottom Navigation Gating on Public Pages
- **Decision**: Added validation inside `BottomNavigation.tsx` to return `null` if a user is not logged in or is currently visiting landing, login, register, pricing, features, or policy pages.
- **Rationale**: Keeps internal app controls from bleeding into marketing, authorization, or other pages outside the core application.
- **Impact**: Clean, correct layout integration on all user-facing auth/marketing interfaces.

## 12. Floating Action Buttons vs Header Actions on Map
- **Decision**: On the active gameplay screen (`/map`), remove floating FABs and embed critical action buttons (Ollie Chat, PlayHub) directly into the sticky top HUD header.
- **Rationale**: Floating buttons on the right side of the screen were getting clipped or overlapping with the news/ads banners and the bottom navigation, causing a cluttered and broken UI on various screen sizes. Moving them to the header frees up the map view.
- **Impact**: Cleaner, more immersive map experience with reliable access to core tools.

## 13. Viewport-Aware Fixed Positioning for Ollie Definition Bubble
- **Decision**: Replaced the `absolute bottom-full left-1/2 -translate-x-1/2` tooltip positioning with a **`fixed` positioned overlay** that captures `getBoundingClientRect()` on button click and clamps coordinates: `left = Math.max(8, Math.min(computedLeft, window.innerWidth - bubbleWidth - 8))`. If insufficient vertical space above the term, the bubble flips below it.
- **Rationale**: Absolute positioning inside scrollable containers and RTL (`dir="rtl"`) layouts caused the 288px-wide bubble to render off-screen to the right or left, triggering horizontal scrollbars on the lesson panel. The bubble also appeared inside an overflow-clipping ancestor. Fixed positioning with viewport clamping makes it guaranteed-visible on any screen size, language, or scroll position.
- **Pattern**: Render the bubble **outside** the text flow (at the bottom of the component return) with an invisible dismiss overlay behind it. No portals needed since the component itself is already a `fixed` full-screen overlay (`z-[300]`).
- **Impact**: Ollie definition bubble always fully visible; no horizontal scrollbars; dismiss-on-outside-click UX; works in RTL and LTR equally.

## 14. Responsive Layout Stack and Dynamic Vertical Adjustments for Floating Widgets
- **Decision**: Raised the z-index of the Ollie Chat container to `z-[210]` (above `BottomNavigation` at `z-[200]` and `NewsTicker` at `z-[190]`), and implemented dynamic vertical offsets: `bottom-[240px]` when closed to stack neatly above the `PlayHubFAB` (`bottom-[168px]`), and `bottom-4` / `md:bottom-6` when open, combined with `transition-all duration-300 ease-in-out` for a smooth slide animation.
- **Rationale**: Prior to this, the chat floating button at `bottom-[96px]` was rendered behind the news ticker and bottom navigation on mobile viewports due to a lower z-index (`z-[150]`), making it completely hidden. Additionally, the chat window when opened from `bottom-[240px]` would extend past the top edge of mobile screens. Dynamically shifting the bottom position when open ensures the chat dialog has maximum screen height to render safely inside the viewport.
- **Impact**: The chat assistant is fully visible and clickable across all pages and viewports (mobile and desktop), stacks beautifully with other FAB elements, slides smoothly on click, and fits perfectly on low-height mobile screens when open.

## 15. Vector SVG and Font-Safe Emoji Strategy for Windows Compatibility
- **Decision**: Purged the unsupported unicode coin emoji `🪙` (U+1FA99) across translation data, state slices, and UI files, replacing it with either the SVG-based `<CoinIcon />` React component or the universally supported `💰` emoji.
- **Rationale**: Windows system fonts (Segoe UI Emoji) do not support the newer `🪙` coin emoji on many standard installations, rendering it as a blank "tofu" rectangle. Since Profits Patrol is a finance-based game, this resulted in broken coin boxes throughout the entire application.
- **Impact**: Guaranteed rendering of coin icons and token prices across all operating systems and browsers, maintaining visual excellence without system font dependencies.

