# ProfitsPatrol Deployment Strategy

## Overview
ProfitsPatrol is deployed as a static site (SPA) with serverless functions and a hosted database.

## Environment Setup
- **Development**: Local Vite server (`npm run dev`) + Supabase Local/Dev project.
- **Production**: Vercel + Supabase Production project.

## CI/CD Pipeline
- **Linting**: Pre-commit hooks run ESLint and Prettier.
- **Testing**: PRs should trigger Vitest and Playwright tests (CI setup in progress).
- **Build**: `npm run build` runs Type checking (`tsc`) and Vite bundling.

## Release Process
1. **Branching**: Use `main` for stable releases. Feature branches for development.
2. **Versioning**: Follow semantic versioning in `package.json`.
3. **Deployment**: Automatic deployment to Vercel on push to `main`.

## Rollback Strategy
- **Vercel**: Instant rollbacks to previous deployments via the Vercel dashboard.
- **Database**: Point-in-time recovery (PITR) enabled on Supabase Production.

## Production Checklist
- [ ] Environment variables set correctly in Vercel.
- [ ] Database migrations applied to production.
- [ ] RLS policies verified.
- [ ] Stripe production keys configured.
- [ ] PWA manifest and icons verified.
