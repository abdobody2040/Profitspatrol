# ProfitsPatrol Security System

## Core Security Principles
- **Zero Trust**: Never trust client-side data. Validate everything on the server (Supabase RLS/Functions).
- **Least Privilege**: Users and services should only have the minimum permissions required.
- **Defense in Depth**: Multiple layers of protection (Zod validation, Sanitization, RLS, Audit logs).

## Identity & Access Management
- **Authentication**: Managed by Supabase Auth (Email/Password + OAuth).
- **Authorization**: Enforced via custom roles (`kid`, `parent`, `teacher`, `admin`) and RLS policies.
- **Parental Gate**: Math-based challenge to protect sensitive flows for younger users.

## Data Protection
- **Row Level Security (RLS)**: Mandatory for all tables. Prevents unauthorized data access/modification.
- **Audit Logs**: Immutable `security_audit_logs` table tracks promotions, token awards, and deletions.
- **Encryption**: sensitive data is encrypted at rest by Supabase. Passwords are hashed by Supabase Auth.

## Threat Prevention
- **XSS**: All user input is sanitized using `DOMPurify`.
- **SQL Injection**: PostgREST and parameterized RPCs prevent SQL injection.
- **CSRF**: Handled by Vercel/Supabase infrastructure.
- **Prompt Injection**: Rigid sanitization in `gemini.ts` to block AI jailbreaking.

## Compliance
- **COPPA/GDPR Ready**: Soft delete policy (30-day grace), Data export functionality, and age-appropriate content gating.
