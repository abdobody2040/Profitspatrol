# Games Source Attribution & License Reference

## 1. Upstream Source Repository
- **Repository URL**: `https://github.com/abdobody2040/profitspatrol-games`
- **Source Commit Hash**: `8d0e347c6126697b2aac9b3e4969ec4666aa44aa`
- **Integration Scope**: 50 Neighborhood Arcade Stations and Educational Mini-Games
- **License**: MIT License (Permissive Open-Source)

---

## 2. Integrated Modules & Components
The following modules were adapted and natively integrated into Profits Patrol under `src/features/games/`:

### A. Game Components & Engines (`src/features/games/components/`)
- `GameRunner.tsx`: Stations 01–03 (`arcade_01_coin`, `arcade_02_lemonade`, `arcade_03_recycle`)
- `Batch04Games.tsx`: Stations 04–09 (`arcade_04_budget`, `arcade_05_cashier`, `arcade_06_pizza`, `arcade_07_market`, `arcade_08_pet`, `arcade_09_savings`)
- `Batch04More.tsx`: Stations 10–12 (`arcade_10_crypto`, `arcade_11_detective`, `arcade_12_foodtruck`)
- `Batch05Games.tsx`: Stations 13–18 (`arcade_13_freelance`, `arcade_14_supplychain`, `arcade_15_bankrun`, `arcade_16_stockexchange`, `arcade_17_realestate`, `arcade_18_taxaudit`)
- `Batch06Games.tsx`: Stations 19–24 (`arcade_19_inflatopoly`, `arcade_20_negotiation`, `arcade_21_charity`, `arcade_22_ecommerce`, `arcade_23_compoundinterest`, `arcade_24_esginvest`)
- `Batch07Games.tsx`: Stations 25–30 (`arcade_25_debtpayoff`, `arcade_26_crowdfunding`, `arcade_27_franchise`, `arcade_28_patent`, `arcade_29_forex`, `arcade_30_venturecapital`)
- `Batch08Games.tsx`: Stations 31–37 (`arcade_31_insurance`, `arcade_32_creditscore`, `arcade_33_diversification`, `arcade_34_emergencyfund`, `arcade_35_compoundclock`, `arcade_36_supplydemand`, `arcade_37_opportunitycost`)
- `Batch09Games.tsx`: Stations 38–44 (`arcade_38_inflationdefense`, `arcade_39_marketingroi`, `arcade_40_pricingstrategy`, `arcade_41_networth`, `arcade_42_cashflow`, `arcade_43_recession`, `arcade_44_subscription`)
- `Batch10Games.tsx`: Stations 45–50 (`arcade_45_angelinvestor`, `arcade_46_bootstrapping`, `arcade_47_exitstrategy`, `arcade_48_ethicalbusiness`, `arcade_49_globaltrade`, `arcade_50_startuplaunch`)

### B. Styling & Design Tokens (`src/features/games/styles/`)
- `game-ui.css`: Common buttons, badge chips, modal wrappers, star ratings.
- `game-visual-upgrade.css`: Visual enhancements for earlier batch games (01–12).
- `batch08.css`, `batch09.css`, `batch10.css`: Custom game board, grid, and interactive elements.
- Scoped to avoid collisions with Profits Patrol's Tailwind/CSS tokens and themed to `#FFC800`, `#58CC02`, `#2B70C9`, `#A855F7`.

### C. Localization Dictionaries (`src/features/games/locales/sourceResources.ts`)
- Bilingual translations (English and Arabic) covering all 50 games:
  - Game titles, subtitles, and instructions.
  - Interactive prompts, choices, options, and button labels.
  - Win/loss feedback, scoring labels, and briefing summaries.
- Merged seamlessly into the primary application i18next runtime in `src/lib/i18n.ts`.

---

## 3. Dependency & Performance Auditing Notes
- **Phaser 3.90**: The source repository listed `phaser: ^3.90.0` as a dependency. During architectural auditing, code inspection confirmed that all 50 mini-games are rendered via pure React 19, HTML5 `<canvas>`, and SVG DOM elements. No Phaser runtime APIs were called. Phaser was omitted entirely from Profits Patrol, preventing over 1.2MB of dead bundle bloat.
- **Lucide Icons**: Reused existing Profits Patrol `lucide-react` icons (e.g. `Award`, `Coins`, `Sparkles`, `Star`, `Volume2`, `VolumeX`, `ArrowLeft`, `RotateCcw`, `Play`, `CheckCircle2`, `XCircle`, `AlertCircle`, `ShieldAlert`, `Info`).
- **Sound Effects**: Audio synthesizer and Web Audio API audio nodes used in games do not require external audio file hosting.

---

## 4. Architectural Enhancements Added by Profits Patrol
1. **Authoritative Economy**:
   - Scores and outcomes are normalized through `GameRewardAdapter.ts`.
   - Prevents client-side manipulation of XP and BizCoins.
   - Enforces attempt idempotency to prevent reward duplication on replay.
2. **Physical LTR Spatial Steer**:
   - In Arabic RTL mode, horizontal movement controls (`spatialControls.ts`) maintain physical orientation (left moves left, right moves right) without reversing vehicle steering.
3. **B2B School License & Tier Gating**:
   - Direct integration with user tier entitlements (`free`, `founder`, `tycoon`) and enterprise school student account bypass.
