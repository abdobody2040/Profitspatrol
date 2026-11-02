
# Profits Patrol - Future CEO Academy 🚀

**Profits Patrol** is a gamified business academy for kids. We turn screen time into real-world skills like entrepreneurship, financial literacy, and leadership through addictive mini-games, an RPG-style progression system, and AI-powered tutoring.

![KidCap HQ Banner](https://images.unsplash.com/photo-1544531586-fde5298cdd40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80)

---

## 🌟 Key Features

### 🎓 Interactive Learning Engine
*   **Universal Lesson System**: 100+ gamified lessons covering Money Basics, Crypto, AI, and Global Trade.
*   **Ollie (AI Tutor)**: Powered by **Google Gemini**, Ollie provides real-time homework help, business advice, and cheeky bird puns.
*   **Book Library**: Read summaries of business classics like *Rich Dad Poor Dad* and *Shoe Dog* to earn XP. AI-powered summary generation for admins.

### 🎮 The Universal Business Arcade
Runs on our custom `GameEngine.tsx` supporting multiple genres:
*   **Tycoon Sims**: Lemonade Stand, Coffee Cart, Factory Manager.
*   **Action/Arcade**: Pizza Rush (Phaser-based driving), Rhythm Car Wash.
*   **Puzzle/Logic**: Recycling Sorter, Fair Trade Matcher.
*   **Clicker/Idle**: App Developer, Dropship Empire.
*   **The Tank**: Pitching, Negotiation, Valuation (AI-powered) redesigned with a **3-judge panel** and full Arabic support.
*   **Production & Manufacturing**: Toy Factory and Recycling Center using our new `ConveyorTemplate.tsx`.
*   **Real Estate Tycoon**: Buy, upgrade, and manage a property empire with automated daily passive income and background progression.
*   **Real-World Missions**: 5 offline family learning missions with structured reflection and parent signature approval.
*   **Grand Entrepreneurship Capstone**: 7-step guided venture creator with dynamic advice, leading to a printable graduation diploma.
*   **Mobile-First Design**: Optimized for touch with **Bottom Sheet** modals, horizontal snapping carousels, and enhanced navigation feedback.
*   **PWA Optimized**: Installable on iOS/Android for a native, standalone app experience with offline support and safe-area compatibility.

### 🌍 Localization & Accessibility
*   **Multi-Language Support**: 100% parity for **English** and **Arabic (RTL)** across all features, lessons, and games.
*   **Debate Arena**: AI-powered debate simulator featuring a **Logical Fallacy Detector** to improve critical thinking.
*   **Headquarters (HQ)**: Persistent player base with both **2D Dollhouse** and **3D Isometric Builder** views, featuring wandering **NPC Employees**.
*   **Accessible Design**: High-contrast modes, screen-reader friendly structure, and intuitive UI for kids.

### 🏫 Education & Management
*   **Teacher Dashboard**: Create assignments, manage student groups, and grade submissions with custom rubrics.
*   **Parent Dashboard**: Monitor screen time, view learning graphs, and manage subscriptions.
*   **Admin Console (CMS)**:
    *   **Dynamic Page Builder**: Create marketing pages without code.
    *   **Library Manager**: Add books and auto-generate summaries using AI.
    *   **User Management**: Impersonate users, manage classes, and moderation tools.

### 💎 Monetization & Progression
*   **Subscription System**: 
    *   **Intern (Free)**: Ad-supported, limited energy (hearts system), locked advanced content.
    *   **Founder**: Unlimited energy, custom HQ, full game access.
    *   **Board Member**: Family plans, parent dashboard.
    *   **Tycoon**: AI Consultant (Ollie) unlocked, exclusive "Negotiation" games.
*   **Energy Mechanics**: Robust hook-based system preventing infinite play for free users.
*   **BizStore**: Spend earned **PP Tokens** on avatars, outfits, and power-ups. Features a rich **Avatar Wardrobe Modal** supporting tiered gating, district/hero perks, and layered previews.

---

## 🛠️ Tech Stack & Architecture

Profits Patrol is built as a robust **Client-Side Single Page Application (SPA)** using the latest modern web technologies.

| Category | Technology |
| :--- | :--- |
| **Core** | React 19, TypeScript, Vite |
| **State Management** | Zustand (with Persistence Middleware) |
| **Styling** | Tailwind CSS, Framer Motion |
| **Game Engine** | Phaser 3 + Custom React Reconciler |
| **AI Integration** | Google GenAI SDK (Gemini 2.5 Flash) |
| **Localization** | i18next, i18next-browser-languagedetector |
| **Testing** | Vitest, React Testing Library |

### 🛡️ Enterprise-Grade Stability
Recent audits have fortified the codebase against common exploits and crashes:
*   **Infinite Energy Exploit**: Fixed timestamp validation logic in `useEnergy.ts`.
*   **Save Corruption**: Implemented robust `NaN` and date parsing guards in `store.ts`.
*   **Registration Hang**: Resolved race condition in `UserSlice` using `isRegistering` guard during sign-up.
*   **Unauthorized Admin Access**: Implemented `isAuthLoading` to block redirects based on stale `localStorage` data before session validation.
*   **Test Suite Failures**: Stabilized the Vitest core by resolving routing context issues and store slice mismatches, ensuring 100% pass rate for content gating and addition pipelines.
*   **Type Hardening (May 2026)**: Resolved critical TypeScript mismatches in `GameType` (added `recycle_game`), `VisualConfig` themes (added `industrial`), and `DebateResult` schema (enforced `fallaciesDetected`).
*   **Runtime Crashes**: Added fallback rendering for invalid asset IDs in `Headquarters.tsx`.

---

## 🚀 Setup Tutorial

### Prerequisites
1.  **Node.js (v18+)**: [Download Here](https://nodejs.org/)
2.  **Google Gemini API Key**: [Get it from Google AI Studio](https://aistudio.google.com/) (Required for Ollie Chat & Library Generator).

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/profitspatrol.git
    cd profitspatrol
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env` file in the root directory (see `.env.example` for all keys):
    ```env
    GEMINI_API_KEY=your_google_gemini_api_key_here
    VITE_AI_PROVIDER=openrouter
    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Open `http://localhost:5173` in your browser.

5.  **Run Tests** (Optional)
    ```bash
    npm run test
    ```

---

## ✏️ How to Edit & Customize

### 1. Game Logic & Configuration
*   **Add/Edit Games**: Modify `src/features/game/data/games.ts`. This file contains the JSON definitions for all arcade games (pricing, visuals, upgrade trees).
*   **Game Templates**: The logic for specific game types (e.g., `simulation_tycoon`, `clicker_idle`) resides in `src/features/game/components/game-templates/`. Editing `SimulationTemplate.tsx` changes the behavior for *all* tycoon games.

### 2. Curriculum & Content
*   **Lessons**: Edit `src/features/education/data/curriculum.ts`. Each lesson follows the `UniversalLessonUnit` schema.
*   **Books**: Edit `src/features/library/data/libraryBooks.ts` to change the default library. In production, use the **Admin Dashboard** to add books dynamically.

### 3. Ads & Monetization
The application uses a simulated ad banner and paywall system.

*   **Ad Banner**:
    *   Located in `src/components/layout/Layout.tsx`.
    *   Controlled by the `isIntern` check: `const isIntern = user.subscriptionTier === 'intern';`.
    *   **To Remove/Edit**: Search for `{isIntern && (` in `Layout.tsx`. You can change the text or styling of the footer banner there.

*   **Paywalls (Investor Pitch)**:
    *   The `InvestorPitchModal.tsx` component is the upgrade screen.
    *   It is triggered in various places (e.g., `UniversalBusinessGame.tsx` when energy runs out, `GameMenu.tsx` for locked games).
    *   **To Edit Pricing/Plans**: Modify `SUBSCRIPTION_PLANS` in `src/data/constants.ts`.

### 4. Admin Panel
*   Access the Admin Dashboard by logging in with a user possessing the `ADMIN` role.
*   Use the **CMS Tab** to edit landing page text and create new custom marketing pages without touching code.

---

## 🦉 Meet Ollie (C.E.O.)

**Chief Education Officer**

> *"Hoot hoot! Failure is just market research for your next success!"*

Ollie is more than a mascot; he's a context-aware AI agent integrated into every aspect of the app. He provides hints in games, explains difficult words in lessons, and roleplays as a consultant for premium users.

---

## 📄 License

Distributed under the MIT License. Built for the Future Leaders of the World.
