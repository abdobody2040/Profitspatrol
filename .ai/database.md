# ProfitsPatrol Database Engineering

## Overview
ProfitsPatrol uses Supabase (PostgreSQL) for persistence. The schema is designed for multi-tenant scalability (Classrooms/Families).

## Core Tables
- **profiles**: Extended user data (XP, Tokens, Role, Level, Subscription).
- **classrooms**: Groups of students managed by teachers.
- **classroom_members**: M:N relationship between users and classrooms.
- **owned_items**: Inventory system (Avatar items, furniture).
- **owned_properties**: Real Estate assets.
- **user_progress**: Tracking completed lessons and quiz scores.
- **security_audit_logs**: Immutable record of sensitive actions.

## Relationships
- A `profile` can belong to multiple `classrooms` via `classroom_members`.
- `owned_items` and `owned_properties` link to `profiles.id` with `on delete cascade`.

## Security (RLS)
- **Select**: Users can read their own profile and profiles of students in their classroom (if Teacher).
- **Update**: Users can only update their own profile (limited fields).
- **Insert**: Handled by database triggers upon auth signup.

## Migrations
- All changes must be recorded in `supabase/migrations/`.
- Use descriptive names (e.g., `20260516_add_leaderboard.sql`).
- Always test RLS policies after migration.

## Backup Strategy
- Supabase provides automated daily backups.
- Admins can manually export the full state as JSON via the Admin Dashboard for catastrophic recovery.

## Indexing
- Primary indexes on all `id` (UUID) columns.
- GIN indexes on JSONB columns if frequent searching is required.
- Composite indexes on `(user_id, created_at)` for logging and history tables.
