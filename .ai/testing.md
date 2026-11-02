# ProfitsPatrol Testing Strategy

## Overview
We maintain a multi-layered testing strategy to ensure reliability across complex game mechanics and security systems.

## Unit Testing (Vitest)
- **Tooling**: Vitest + React Testing Library + JSDOM.
- **Coverage**: Focus on Store logic (`slices`), utility functions (`sanitization`, `formatting`), and complex services (`GeminiService`).
- **Command**: `npm run test`

## Integration Testing
- **Focus**: User journeys like Registration -> Onboarding -> First Game.
- **Mocking**: Mock Supabase responses and AI service calls.

## E2E Testing (Playwright)
- **Tooling**: Playwright.
- **Focus**: Critical paths like Checkout, Classroom joining, and Admin management.
- **Location**: `e2e/` folder.

## Database Testing
- **Tooling**: SQL scripts in `supabase/` (DIAGNOSTIC_CHECK.sql, etc.).
- **Focus**: RLS policy verification and trigger accuracy.

## Coding Standards for Tests
- **RTL Context**: Always wrap components in `MemoryRouter` and `AppStoreContext` if they use navigation or state.
- **Mock Data**: Use consistent mock objects that match the latest TypeScript interfaces.
- **No Flakiness**: Avoid hardcoded delays. Use `waitFor` or `findBy` queries.
