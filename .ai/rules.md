# ProfitsPatrol Engineering Rules

## 1. TypeScript Standards
- **Strict Mode**: Must be enabled.
- **No "any"**: Use proper types or interfaces. If unavoidable, use `unknown`.
- **Explicit Returns**: Functions should have explicit return types.
- **Interfaces over Types**: Use `interface` for object structures that might be extended.

## 2. Architecture & Design
- **Feature Isolation**: Logic inside `src/features` should not depend on other features directly. Use shared hooks or stores if needed.
- **Service Layers**: Use service classes (e.g., `src/services`) for heavy business logic and external integrations (AI, Payments).
- **No Direct DB Access**: Always use the `SupabaseAdapter` or a service layer. Do not call `supabase.from()` directly in UI components.
- **State Management**: Only store global state in Zustand. Local state (transient UI) should stay in `useState`.
- **Modular Boundaries**: Maintain clear separation between UI components and business logic.

## 3. UI/UX Rules
- **Tailwind Only**: No inline styles or ad-hoc CSS.
- **Responsive First**: Always include `md:` and `lg:` variants.
- **Dark Mode**: All background and text colors must have `dark:` counterparts.
- **Juicy Principle**: Interactive elements must have `whileHover` and `whileTap` animations.
- **File Size Limits**: Keep component files under 400 lines. If a component grows larger, refactor into smaller sub-components.

## 4. API & Data
- **Validation**: Use Zod for all form and API data validation (Environment variables, API responses).
- **Sanitization**: Sanitize user-generated content using DOMPurify before rendering.
- **Localization**: Never hardcode strings. Always use `t()` from `react-i18next`.
- **Environment Validation**: All `import.meta.env` variables must be validated at startup to prevent runtime crashes.

## 5. File & Folder Naming
- **Components**: PascalCase (e.g., `LeaderboardCard.tsx`).
- **Hooks**: camelCase (e.g., `useEconomy.ts`).
- **Utilities/Services**: camelCase (e.g., `formatCurrency.ts`).
- **Folders**: kebab-case for assets, camelCase for code folders.

## 6. Error Handling & Logging
- **Centralized Errors**: Use the custom `AppError` classes in `src/utils/errors.ts`.
- **User Feedback**: Never show raw error messages. Use localized fallbacks.
- **Logging**: Use the `Logger` service (`src/services/logger.ts`) for all errors. Console logging is strictly for development only.

## 7. Testing & Quality
- **Coverage**: Aim for 100% coverage on utility and store logic.
- **CI Enforcement**: Linting and type checks must pass before any commit.
- **Dependency Management**: Use `npm audit` regularly. Pin versions of critical libraries.
