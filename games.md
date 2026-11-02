# 🎮 Profits Patrol Games Documentation

This document provides a comprehensive overview of all games, simulations, and interactive experiences within the Profits Patrol platform. It serves as a technical and design reference for developers and content creators to understand existing mechanics and implement future upgrades.

---

## 1. Game Architecture & Engines

Profits Patrol uses a modular, template-driven architecture to scale content efficiently.

### 1.1 The Universal Business Game Engine
Located at `src/features/game/components/UniversalBusinessGame.tsx`, this is the primary engine for "Tycoon-style" simulations.
- **State Management**: Uses `useGameSimulation` hook to handle Day/Phase logic (STRATEGY → SIMULATION → RESULT).
- **Persistence**: Automatically saves progress to the Zustand store (and Supabase/LocalStorage).
- **Logic**: Calculates revenue based on player inputs (sliders), dynamic factors (weather), and upgrades.

### 1.2 Game Templates
Specialized UI/Logic wrappers for specific mini-game types. Found in `src/features/game/components/game-templates/`.

| Template | Purpose | Example Game |
| :--- | :--- | :--- |
| `SimulationTemplate` | Slider-based tycoon logic | Lemonade Stand, Coffee Cart |
| `ClickerTemplate` | Idle/Clicker mechanics | Dropship Empire, App Developer |
| `CookingTemplate` | Recipe assembly (Drag & Drop) | Pizza Delivery, Taco Truck |
| `GridTemplate` | Pathfinding/Movement on a grid | Pizza Rush, Lawn Master |
| `RepairTemplate` | Matching parts to targets | iFix It, Bike Repair |
| `RhythmTemplate` | Timed tapping to music | Rock Star Tour, Car Wash |
| `StockMarketTemplate` | Buy/Sell simulation | Stock Market Rollercoaster |
| `EthicalDilemmaTemplate` | Narrative choices with consequences | The Ethical Dilemma |
| `AudienceMatcher` | Drag & Drop marketing segmentation | Target Audience Master |
| `PricingTemplate` | Supply & Demand curve simulator | Pricing Specialist |

---

## 2. Business Simulations (GAMES_DB)

The core simulations are registered in `src/features/game/data/games.ts`.

### 2.1 Retail & Food
- **Lemonade Stand**: Recipe & Price vs. Weather. (Simulation)
- **Pizza Rush**: Grid-based delivery logistics. (Grid)
- **Cupcake Bakery**: Recipe assembly. (Cooking)
- **Coffee Cart**: Resource management (Beans, Milk). (Simulation)
- **Taco Truck**: Fast-paced assembly. (Cooking)
- **Ice Cream Parlor**: Queue management and scooping. (Service)

### 2.2 Services & E-Commerce
- **Groovy Car Wash**: Rhythm-based cleaning. (Rhythm)
- **Pet Salon**: Multi-step grooming queue. (Service)
- **Lawn Master**: Grid territory coverage. (Grid)
- **Dropship Empire**: Automation and order processing. (Clicker)
- **iFix It**: Hardware repair matching. (Repair)
- **Stock Market Rollercoaster**: Basic portfolio trading. (Stock)

### 2.3 Production & Manufacturing
- **Toy Factory**: Conveyor belt assembly. (Operations)
- **3D Print Shop**: Color/Material matching. (Matching)
- **Book Publishing**: Quality vs. Marketing budget. (Simulation)
- **Eco Battery Co.**: Physics-based balance. (Physics)
- **The Bug Hunter**: Defect detection. (Quality Control)

### 2.4 Digital & Tech
- **App Developer**: Coding clicker with AI assistants. (Clicker)
- **Cyber Defense**: Tower/Network defense. (Defense)
- **Content Creator**: Viewer engagement & mood management. (Streamer)
- **Mars Colony Supply**: Extreme resource survival. (Simulation)

### 2.5 Social Impact
- **Recycling Center**: Sorting materials. (Operations)
- **Fair Trade Market**: Ethical auction/trading. (Trading)
- **Bike Repair**: Green transport maintenance. (Repair)
- **The Ethical Dilemma**: Value-based decision making. (Narrative)

---

## 3. Top-Level Feature Games

These are complex, feature-rich games with dedicated directories.

### 3.1 The Tank (AI Pitching)
- **Location**: `src/features/tank/`
- **Mechanics**: Voice-enabled pitching (Web Speech API). AI judges evaluate the pitch based on keywords and sentiment.
- **Negotiation**: Features a "Valuation Slider" where users negotiate equity with 5 different AI judges.
- **Modes**: Solo and Co-op (Multiplayer).

### 3.2 Debate Dojo (AI Ethics)
- **Location**: `src/features/debate/`
- **Mechanics**: Players argue for/against a business dilemma against "Ollie".
- **Scoring**: AI evaluates logic, ethics, and persuasion.

### 3.3 Side Hustle (Gig Central)
- **Location**: `src/features/side-hustle/`
- **Mechanics**: A "Gig App" UI that launches various mini-games (Recycling, Garden, Smoothie, etc.).
- **Progression**: Energy-gated tasks that reward BizCoins and XP.

### 3.4 HQ Builder (RPG)
- **Location**: `src/features/hq/`
- **Mechanics**: Isometric 2D grid where users place furniture (87+ items) to build their office.
- **Progression**: Unlocks new items as the player levels up.

---

## 4. How to Upgrade & Add New Games

### 4.1 Adding a New "Standard" Simulation
1.  **Define Data**: Add a new entry to `GAMES_DB` in `src/features/game/data/games.ts`.
    - Specify `business_id`, `nameKey`, `game_type`, and `visual_config`.
    - Define `upgrade_tree` and `variables`.
2.  **Add Translations**: Add the corresponding keys to `src/locales/en.ts` and `src/locales/ar/games.ts`.
3.  **Verification**: The game will automatically appear in the "Map" or "Venture" tab based on its category.

### 4.2 Creating a New Game Template
1.  **New File**: Create `YourNewTemplate.tsx` in `src/features/game/components/game-templates/`.
2.  **Props**: It must accept `onComplete: (score: number, data: any) => void`.
3.  **Registration**: Intercept your `gameId` in `UniversalBusinessGame.tsx` to return your new template.

### 4.3 Enhancing AI Interactions
- Most AI logic lives in `src/services/ai/UniversalAI.ts` and `src/lib/gemini.ts`.
- To upgrade "The Tank" or "Debate Dojo", modify the prompt templates in these services to include new judging criteria or personas.

---

## 5. Planned Upgrades (Roadmap)
- **Multiplayer "Joint Ventures"**: Pooling BizCoins to start shared companies.
- **AI Voice Interaction**: Expanding "The Tank" to support real-time voice conversation.
- **Real-time Stock Market**: Connecting the Stock Market game to a mock live API for dynamic price shifts.
- **Custom Ollie Outfits**: Allowing users to spend BizCoins on cosmetic upgrades for their AI mentor.
