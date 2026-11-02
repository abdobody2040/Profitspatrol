# ProfitsPatrol API Standards

## Overview
As a Supabase-backed project, APIs are primarily served via PostgREST (Auto-generated) and custom PostgreSQL RPCs.

## Response Formats
- PostgREST returns JSON arrays or objects.
- RPCs should return consistent objects:
  ```json
  {
    "success": true,
    "data": { ... },
    "error": null
  }
  ```

## Authentication & Authorization
- Every request must include the user's JWT (handled by Supabase client).
- RBAC is enforced at the database level via RLS.
- High-privilege actions (like awarding tokens) must be done through `SECURITY DEFINER` RPCs to prevent client-side manipulation.

## Validation Strategy
- Use Zod on the client-side before sending data.
- Use PostgreSQL constraints (CHECK, UNIQUE, NOT NULL) on the server-side.

## Rate Limiting
- Client-side rate limiting (10 req/min) implemented for AI services.
- Database-level cooldowns (30s) implemented for token-awarding RPCs.

## Error Formats
- Use standard HTTP status codes.
- Errors should include a machine-readable code and a user-friendly (localizable) message.

## Versioning
- PostgREST APIs are versioned by Supabase.
- For custom logic, versioning is handled through modular code in `src/features`.
