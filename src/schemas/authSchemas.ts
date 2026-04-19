/**
 * Zod Validation Schemas for Authentication Forms
 * Provides type-safe form validation with security checks
 */

import { z } from 'zod';

/**
 * Login Form Schema
 */
export const LoginSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Invalid email address')
        .toLowerCase()
        .trim(),

    password: z
        .string()
        .min(1, 'Password is required')
        .min(8, 'Password must be at least 8 characters')
});

export type LoginFormData = z.infer<typeof LoginSchema>;

/**
 * Registration Form Schema
 */
export const RegisterSchema = z.object({
    username: z
        .string()
        .min(1, 'Username is required')
        .min(3, 'Username must be at least 3 characters')
        .max(50, 'Username too long (max 50 characters)')
        .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens')
        .trim(),

    email: z
        .string()
        .min(1, 'Email is required')
        .email('Invalid email address')
        .toLowerCase()
        .trim(),

    password: z
        .string()
        .min(1, 'Password is required')
        .min(8, 'Password must be at least 8 characters')
        .max(100, 'Password too long')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),

    confirmPassword: z
        .string()
        .min(1, 'Please confirm your password'),

    // ✅ SECURITY FIX: 'admin' removed — admin role is assigned server-side only via Supabase RLS.
    // A client submitting role:'admin' must NEVER receive elevated privileges.
    role: z.enum(['kid', 'parent', 'teacher'], {
        message: 'Please select a valid role'
    }),

    parentEmail: z
        .string()
        .email('Invalid parent email address')
        .toLowerCase()
        .trim()
        .optional()
        .or(z.literal(''))
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
}).refine((data) => {
    // Require parent email for kids
    if (data.role === 'kid') {
        return !!data.parentEmail && data.parentEmail.length > 0;
    }
    return true;
}, {
    message: 'Parent email is required for kid accounts',
    path: ['parentEmail']
});

export type RegisterFormData = z.infer<typeof RegisterSchema>;

/**
 * Password Reset Schema
 */
export const PasswordResetSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Invalid email address')
        .toLowerCase()
        .trim()
});

export type PasswordResetFormData = z.infer<typeof PasswordResetSchema>;

/**
 * Change Password Schema
 */
export const ChangePasswordSchema = z.object({
    currentPassword: z
        .string()
        .min(1, 'Current password is required'),

    newPassword: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(100, 'Password too long')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),

    confirmNewPassword: z
        .string()
        .min(1, 'Please confirm your new password')
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ['confirmNewPassword']
}).refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword']
});

export type ChangePasswordFormData = z.infer<typeof ChangePasswordSchema>;
