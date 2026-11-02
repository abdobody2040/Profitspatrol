# ProfitsPatrol Task Roadmap

## Phase 5: Competitive Season & Social (Current)
- [ ] Implement Global Leaderboard with Seasonal Resets.
- [x] Create Corporation/Guild system for co-op play.
- [ ] Launch "Annual CEO Championship" seasonal event.
- [x] Implement Daily Spin Wheel for improved daily retention.
- [x] Build Weekly CEO Challenge with high-value rewards.

## Phase 6: Advanced Economy
- [ ] Implement fictional Stock Market simulation with 5 companies.
- [ ] Expand Real Estate Tycoon with interactive property management.
- [ ] Add "Angel Investor" prestige system for endgame progression.

## Enterprise Observability & SRE (Completed Oct 2026)
- [x] Implement central Monolog 3.12 structured logger (`LOG_CHANNEL=structured`) with JSON formatting in staging/prod and pretty formatting in dev.
- [x] Implement `RequestCorrelationMiddleware` injecting and reading `X-Request-ID` and W3C `traceparent` (`trace_id`, `span_id`).
- [x] Configure recursive PII and secrets redaction engine (`RedactionProcessor.php`) for passwords, API keys, bearer tokens, cards, CVVs, SSNs, phones, and emails.
- [x] Add global exception boundary in `bootstrap/app.php` with stack trace serialization and single boundary reporting.
- [x] Configure DB slow query monitoring, background queue job telemetry, and security audit event logging.
- [x] Deploy centralized logging infrastructure (`monitoring/docker-compose.logging.yml`) with Grafana Loki 3.x, Vector with 1GB disk buffer, and Grafana 11.
- [x] Add 4 Loki alert rules (`ErrorRateSpike`, `Http5xxRatioSpike`, `FailedLoginBurst`, `ServiceNoLogsHeartbeat`) with 30-day retention.
- [x] Build Grafana dashboard with RPS, 5xx ratio, latency metrics, and saved LogQL drilldown queries.
- [x] Build automated test suite (`LoggingAndCorrelationTest.php`) and CLI health script (`backend/scripts/verify-logging.php`).
- [x] Author comprehensive reference documentation in `LOGGING.md`.

## Technical Debt & Optimizations
- [ ] Refactor legacy "Frankenstein" logic in `UserProfile`.
- [ ] Expand Vitest coverage for complex game mechanics (The Tank, Debate Dojo).
- [ ] Implement image lazy loading across all heavy grids (Store, Library).
- [ ] Normalize Supabase migrations into a single cohesive structure.
## UI/UX Polish & Layout (Recent Updates)
- [x] Fix Ollie Chat assistant overlapping/hidden under bottom bars (bottom navigation, news ticker, ads banner) by lifting closed button to `bottom-[240px]` with `z-[210]`.
- [x] Fix Ollie Chat assistant dialog window from going off-screen on mobile viewports by shifting container to `bottom-4` when open.
- [x] Clean up Windows system font "Tofu" boxes by replacing unsupported coin emoji `🪙` with `💰` or `<CoinIcon />` SVG throughout the codebase.
- [x] Fix Daily Missions modal rendering empty white sheet when opened from Play Hub by correctly lazy-loading and implementing rendering switch logic in `GlobalModalManager`.
- [x] Fix KidMap NPC Quest Hover Modal not opening due to AnimatePresence & Portal conflict.
- [x] Fix Map Layout & Full-Bleed Background for all viewports.
- [x] Consolidate map action buttons (Ollie Chat, PlayHub, HQ Level, Empire) into top HUD header or floating appropriately.
- [x] Ensure Universal Lesson Engine perfectly overlays Bottom Navigation on mobile (`z-index` fix).
- [x] Remove `md:hidden` from Bottom Navigation to ensure 7-item menu is accessible on desktop.
- [x] Fix Ollie definition bubble out-of-view placement (RTL clipping, horizontal scrollbars) — viewport-aware `fixed` positioning.
- [x] Fix Ollie bubble showing wrong definition (all terms returning "Strategy/Planning" fallback) — `DEFINITIONS_DB` dictionary.
- [x] Fix Ollie bubble internal scrollbar — natural flow with `whitespace-normal break-words`.
- [x] Fix Ollie bubble JSX syntax error (`</span>resence>` broken tag).
- [x] Fix dual scrollbars on `/map` route.
- [x] Fix district cards dark mode (hardcoded `bg-white` ignoring theme).
- [x] Fix district card inline Arabic ternaries — replaced with `t()` i18n calls.


## Backlog
- [ ] AI Voice Interaction for "The Tank" (Multilingual).
- [ ] Custom Ollie Outfits (Avatar system expansion).
- [ ] Monthly Parent Report email automation.
- [ ] Referral Program for growth.

---

**Prioritization Legend**:
- 🔴 Critical (Revenue/Retention)
- 🟠 High (Engagement)
- 🔵 Medium (Polish)
- ⚪ Low (Nice to have)
