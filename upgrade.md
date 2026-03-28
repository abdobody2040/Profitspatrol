Upgrade Plan: Learn, My Venture, My Empire & More
This plan includes all requested upgrades: Video Library, Live Sessions, and the full roadmap from 
upgrade.md
.

User Review Required
NOTE

Live Sessions: For the MVP, I am planning this as a Scheduling & Link Management system (Admin/Teachers post Zoom/Meet links) rather than building a custom video streaming infrastructure, which is highly complex. Video Library: This will use YouTube Embeds managed via the Admin CMS.

Proposed Upgrades

3. My Empire (Management & Growth)
Goal: Deepen the feeling of managing a growing portfolio.

A. Dynamic News Feed (Market Events)
Concept: Ticker tape showing events that affect game logic.
Implementation:
Component: NewsTicker in DashboardLayout (Bottom fixed).
System: MarketEventSystem (e.g., "Heatwave: Lemonade Demand +30%").
B. Portfolio Analysis
Concept: Visualizing net worth growth.
Implementation:
Graph: NetWorthHistory chart using recharts.
Breakdown: Pie chart of Assets (Cash vs Business vs Inventory).
4. Classroom & Admin (Connectivity)
A. Live Sessions (New)
Concept: Teachers/Admins can schedule live classes.
Implementation:
Admin/Teacher Panel: Form to create "Events" (Title, Date/Time, Jitsi/Zoom Link).
Student Dashboard: "Live Now" banner or "Upcoming Sessions" list.
Notification: Visual badge when a session is active.
B. Multiplayer Market (Concept from upgrade.md)
Concept: Students selling assets to each other.
Note: Requires Realtime Backend (Supabase/Firebase). Will be planned as "Backend Migration" prerequisite.
Implementation Stages
Phase 1: Core Content & CMS
 Video Library: Create Video type, Admin entry form, and Kid VideoGallery component.
 Live Sessions: Create Session type, Admin scheduler, and Dashboard "Upcoming" widget.
Phase 2: Game Logic Upgrades
 News Feed: Build EventSystem hooking into GameStore.
 Side Hustle: Build SideHustleApp UI and one basic minigame (Dog Walking).
Phase 3: Advanced Scenarios
 Boss Battles: Implement the ScenarioEngine and the first "Pizza Turnaround" mission.













# Profits Patrol - Upgrade Roadmap & Ideas

## 🚀 Category: Social & Multiplayer (High Engagement)
**1. Multiplayer & "Classroom Economy"**
*   **Concept**: Allow students to sell virtual assets (logos, inventory) to classmates.
*   **Features**: Weekly Leaderboards ("Top Pizza Seller"), Co-op Missions ("Sell 1k Lemonades to unlock Pizza Party").
*   **Implementation Plan**:
    *   **Backend**: Must migrate to Supabase/Firebase first (See Item 10).
    *   **Database**: Create `market_listings` table (seller_id, item_json, price).
    *   **UI**: specific "Classroom Market" tab in the Dashboard.
    *   **Logic**: Transaction system that debits Buyer and credits Seller (with a "Tax" sink).

## 🏗️ Category: New Simulations
**2. Real Estate Tycoon**
*   **Concept**: Buying, renovating, and managing properties.
*   **Mechanics**: Flip houses for quick cash or Rent for passive income. Teaches Mortgages, Interest, and ROI.
*   **Implementation Plan**:
    *   **Data**: Create `properties.ts` with static house data (fixer-upper, mansion).
    *   **State**: Add `ownedProperties` to `GameStore`.
    *   **Loop**: Add "Month End" logic to `GameEngine` to collect rent / pay mortgage.
    *   **UI**: Map view using `react-leaflet` or a simple CSS Grid map with interactive pins.

**3. "The Side Hustle" (Gig Economy)**
*   **Concept**: Service-based mini-games (e.g., Dog Walking, Coding, Graphic Design).
*   **Lesson**: Trading *Time* for Money vs. Scalability (Product business).
*   **Implementation Plan**:
    *   **Engine**: Reuse `UniversalBusinessGame` but change the "Sales" mechanic to a "Stamina" mechanic.
    *   **UI**: "Gig App" interface (Tinder-swiping style for selecting jobs).
    *   **Mini-Games**: Small reflex-based games (Quick Time Events) to complete the "Job".

**4. "Boss Battles" (Turnaround Scenarios)**
*   **Concept**: Save a failing business from bankruptcy.
*   **Scenario**: "Uncle Tony’s Pizza is losing money! Cut costs in 3 days."
*   **Implementation Plan**:
    *   **Config**: specific `scenario_config.ts` defining starting state (Debt: High, Cash: Low).
    *   **Logic**: Win condition checks (Profit > X by Day 3).
    *   **UI**: "Urgent" overlay theme (Red/Warning colors).


**7. Dynamic News Feed (Market Events)**
*   **Concept**: Random events that affect game logic.
*   **Examples**: "Heatwave" (Lemonade sales up) or "Toy Shortage" (Manufacturing costs up).
*   **Implementation Plan**:
    *   **Engine**: `EventSystem` that ticks every "Day".
    *   **Math**: Modifiers array `globalMultipliers` (e.g., `demand_citrus: 1.5`).
    *   **UI**: Scrolling Ticker Tape at bottom of Dashboard.


## ⚙️ Category: Technical Foundation
**10. Backend Migration**
*   **Action**: Migrate from `LocalStorageAdapter` to **Supabase** or **Firebase**.
*   **Implementation Plan**:
    *   **Auth**: Switch `useAuthStore` to use Supabase Auth/Firebase Auth.
    *   **DB**: Map `User`, `Classroom`, `Assignment` types to SQL/NoSQL tables.
    *   **Sync**: Implement `Realtime Subscription` (Supabase) or `onSnapshot` (Firebase) for live updates.
    *   **Migration**: Script to upload current LocalStorage data to Cloud on first login.
