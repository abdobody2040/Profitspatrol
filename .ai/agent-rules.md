# AI Agent Behavioral Rules

To maintain the integrity of ProfitsPatrol, all AI agents MUST adhere to these rules:

## 1. Documentation First
- **Read First**: Always read `/.ai/context.md`, `/.ai/architecture.md`, and `/.ai/rules.md` before starting any coding task.
- **Update After**: After completing a task, update `/.ai/tasks.md` and `/.ai/changelog.md`.

## 2. Architectural Consistency
- **Preserve Modularity**: Do not break feature boundaries.
- **No Rewrites**: Never rewrite stable systems unnecessarily. If a refactor is needed, explain why in `/.ai/decisions.md`.
- **Follow Patterns**: Use existing patterns for store actions, API calls, and component styling.

## 3. Code Quality
- **Type Safety**: Maintain strict TypeScript. No "any".
- **Localization**: Ensure all new strings are added to English and Arabic locale files. Never use hardcoded English.
- **Testing**: If the code is complex, add or update Vitest unit tests.

## 4. Communication
- **Be Concise**: Keep technical explanations focused.
- **Document Decisions**: If you make a significant technical choice, record it in `/.ai/decisions.md`.

## 5. Security
- **Never Hardcode Secrets**: Use environment variables.
- **RLS Conscious**: When adding new tables, always propose RLS policies.
- **PII Protection**: Ensure no personally identifiable information is leaked in logs.
