/**
 * Zod Validation Schemas for Project Submissions
 * Provides type-safe validation for student project uploads
 */

import { z } from 'zod';

/**
 * Project Submission Schema
 */
export const ProjectSubmissionSchema = z.object({
    title: z
        .string()
        .min(1, 'Project title is required')
        .min(5, 'Title must be at least 5 characters')
        .max(100, 'Title too long (max 100 characters)')
        .trim(),

    description: z
        .string()
        .min(1, 'Project description is required')
        .min(20, 'Description must be at least 20 characters')
        .max(5000, 'Description too long (max 5000 characters)')
        .trim(),

    moduleId: z
        .string()
        .min(1, 'Module selection is required'),

    file: z
        .instanceof(File, { message: 'Please upload a file' })
        .refine((file) => file.size > 0, 'File cannot be empty')
        .refine((file) => file.size <= 5 * 1024 * 1024, 'File size must be less than 5MB')
        .refine(
            (file) => ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'].includes(file.type),
            'File must be PNG, JPEG, or PDF'
        )
        .optional(),

    submittedAt: z.date().optional()
});

export type ProjectSubmissionFormData = z.infer<typeof ProjectSubmissionSchema>;

/**
 * Project Grading Schema (for teachers/admins)
 */
export const ProjectGradingSchema = z.object({
    projectId: z.string().min(1, 'Project ID is required'),

    grade: z
        .number()
        .min(0, 'Grade cannot be negative')
        .max(100, 'Grade cannot exceed 100'),

    feedback: z
        .string()
        .min(10, 'Feedback must be at least 10 characters')
        .max(2000, 'Feedback too long (max 2000 characters)')
        .trim(),

    gradedBy: z.string().min(1, 'Grader ID is required'),

    gradedAt: z.date().optional()
});

export type ProjectGradingFormData = z.infer<typeof ProjectGradingSchema>;

/**
 * Assignment Creation Schema (for teachers)
 */
export const AssignmentCreationSchema = z.object({
    title: z
        .string()
        .min(1, 'Assignment title is required')
        .min(5, 'Title must be at least 5 characters')
        .max(100, 'Title too long (max 100 characters)')
        .trim(),

    description: z
        .string()
        .min(1, 'Assignment description is required')
        .min(20, 'Description must be at least 20 characters')
        .max(5000, 'Description too long (max 5000 characters)')
        .trim(),

    moduleId: z
        .string()
        .min(1, 'Module selection is required'),

    dueDate: z
        .date()
        .min(new Date(), 'Due date must be in the future'),

    classroomId: z
        .string()
        .min(1, 'Classroom selection is required'),

    maxPoints: z
        .number()
        .min(1, 'Max points must be at least 1')
        .max(100, 'Max points cannot exceed 100')
        .default(100)
});

export type AssignmentCreationFormData = z.infer<typeof AssignmentCreationSchema>;
