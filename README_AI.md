# AI Operating Instructions for ProfitsPatrol

Welcome, AI Agent. This repository is designed for autonomous, enterprise-grade development. To ensure continuity and maintain architecture consistency, you MUST follow these instructions.

## 🚀 Getting Started
Before you write a single line of code, you MUST read the following files:

1. **`PROJECT_CONTEXT.md`**: Understand the project goal, tech stack, architecture, and current status.
2. **`MEMORY.md`**: Tracks historical and recent engineering steps taken, verified features, and project setups.
3. **`LOGGING.md`**: Master reference for enterprise structured logging, correlation IDs (`X-Request-ID`), W3C tracing (`traceparent`), redaction lists, and Grafana Loki infrastructure.
4. **`/.ai/rules.md`** & **`/.ai/architecture.md`**: Strict coding standards, modular feature-based boundaries, and UI rules.

## 🧠 Memory & Continuity
This repository maintains its own memory. You are responsible for keeping it updated.

- **Check Tasks**: See `/.ai/tasks.md` and `MEMORY.md` for what needs to be done.
- **Track Progress**: Mark items as completed in `/.ai/tasks.md` and append verified steps to `MEMORY.md`.
- **Log Changes**: Every significant change must be recorded in `/.ai/changelog.md` and `PROJECT_CONTEXT.md`.
- **Update Context**: If the project direction, tech stack, or infrastructure changes, update `PROJECT_CONTEXT.md` and `MEMORY.md`.

## 🛠 Engineering Workflow
1. **Analyze**: Explore the `src/features` folder or `backend/app/` related to your task.
2. **Plan**: Propose changes that respect the boundaries defined in `architecture.md` and `PROJECT_CONTEXT.md`.
3. **Execute**: Write clean, type-safe code following project standards.
4. **Verify**: Run tests (`npm test` / `php vendor/bin/phpunit`) and verify RTL support for Arabic and dev server health.
5. **Document**: Update `MEMORY.md`, `PROJECT_CONTEXT.md`, and relevant `.ai` files to reflect your work.

## ⚠️ Critical Rules
- **No Hallucinations**: Only document what exists. If something is unclear, ask.
- **No Rewrite**: Do not refactor stable systems unless explicitly requested.
- **Any-Free Zone**: Strict TypeScript is non-negotiable.
- **Localization**: All strings must be added to English and Arabic locale files.
- **Production Logging & Observability**:
  - Never use raw `console.log`, `var_dump`, `print`, `echo`, or un-redacted logging in production code.
  - **Backend**: Use `AppLogger` (`backend/app/Services/Logging/AppLogger.php`) with stable dot-notation events (e.g., `payment.failed`, `auth.login.success`).
  - **Frontend**: Use `Logger` (`src/services/logger.ts`). Client requests automatically propagate `X-Request-ID`.
  - **Safety**: Never string-concatenate user input into messages (prevent log injection); pass variables as structured context fields for automated redaction. Refer to `LOGGING.md`.

By following these rules, you ensure that ProfitsPatrol remains maintainable, scalable, observable, and stable forever.
