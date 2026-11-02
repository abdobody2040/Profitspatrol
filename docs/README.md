# Profits Patrol — Documentation Directory

Welcome to the technical and operational documentation for **Profits Patrol (Future CEO Academy)**.

---

## 📚 Table of Contents

### 1. 🚀 Deployment & DevOps
- [**Hostinger 4-Step Deployment Guide (hPanel)**](file:///g:/Vibe%20coding/Profitspatrol/docs/DEPLOYMENT_GUIDE_HOSTINGER.md)
  - Quick mouse-driven deployment guide using pre-packaged archives in `deploy_hostinger/`.
  - Frontend SPA upload, Laravel 11 backend setup, `api` subdomain configuration, MySQL setup, and Google OAuth credentials.
- [**Hostinger & cPanel Technical Architecture**](file:///g:/Vibe%20coding/Profitspatrol/docs/HOSTINGER_DEPLOYMENT.md)
  - Full server architecture, environment variables reference, cron job configuration, database seeders, and production caching.

### 2. 🎮 Arcade & Simulation Game Systems
- [**Profits Patrol Game Catalog**](file:///g:/Vibe%20coding/Profitspatrol/docs/PROFITS_PATROL_GAME_CATALOG.md)
  - **50 Educational Arcade Stations** across 8 districts (Money, Builders, Risk, Operations, Innovation, Leadership, Strategy, Launch).
  - **32+ Deep Business Simulations** catalog and engine templates.
  - **Freemium Gating Rules**:
    - **Intern (Free)**: 3 Free Simulation Games (Lemonade Tycoon, Brand Builder, Pizza Restaurant) + Stations 1–10.
    - **Founder**: All 33 standard simulations + Stations 11–35.
    - **Tycoon**: 100% Unlocked simulations + Boardroom Negotiations + Stations 36–50.
- [**Games Integration Architecture**](file:///g:/Vibe%20coding/Profitspatrol/docs/GAME_INTEGRATION.md)
  - Runtime boundaries under `src/features/games/`, `UnifiedGameShell` lifecycle, authoritative rewards adapter, and RTL spatial controls.
- [**Game Source Attribution**](file:///g:/Vibe%20coding/Profitspatrol/docs/GAMES_SOURCE_ATTRIBUTION.md)
  - Mapping upstream educational game definitions to station numbers and commit histories.

### 3. 🌐 Internationalization & Curriculum
- [**Adding New Languages**](file:///g:/Vibe%20coding/Profitspatrol/docs/ADDING_LANGUAGES.md)
  - Guide to adding new language translations, locale files, RTL layout support, and font configurations.

---

## 🛠️ Quick CLI Commands

```powershell
# Run Local Development Server
npm run dev

# Run TypeScript Verification
npx tsc --noEmit

# Run Automated Test Suite
npm test

# Build Production Bundle & Hostinger Packages
npm run build
powershell -ExecutionPolicy Bypass -File scripts/package-hostinger.ps1
```
