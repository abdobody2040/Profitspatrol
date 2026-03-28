import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAppStore } from '@/store';
import { UserRole } from '@/types';

describe('Security Phase 4: Business Logic Integrity', () => {
    beforeEach(() => {
        useAppStore.setState({
            user: {
                id: 'student_1',
                name: 'Test Student',
                role: UserRole.KID,
                xp: 0,
                bizCoins: 100,
                settings: { soundEnabled: true, musicEnabled: true, themeMode: 'light', dailyGoalMinutes: 30, themeColor: 'blue' },
                completedLessonIds: [],
                badges: [],
                inventory: [],
                hqLevel: 'hq_garage',
                unlockedSkills: [],
                portfolio: [],
                equippedItems: [],
                subscriptionStatus: 'FREE',
                subscriptionTier: 'intern',
                energy: 5,
                lastEnergyRefill: Date.now(),
                level: 1,
                streak: 0,
                lastActivityDate: '2025-01-01',
                currentModuleId: 'mod_1'
            },
            users: [{
                id: 'student_1',
                name: 'Test Student',
                role: UserRole.KID,
                xp: 0,
                bizCoins: 100,
                settings: { soundEnabled: true, musicEnabled: true, themeMode: 'light', dailyGoalMinutes: 30, themeColor: 'blue' },
                completedLessonIds: [],
                badges: [],
                inventory: [],
                hqLevel: 'hq_garage',
                unlockedSkills: [],
                portfolio: [],
                equippedItems: [],
                subscriptionStatus: 'FREE',
                subscriptionTier: 'intern', // Use correct literal type
                energy: 5,
                lastEnergyRefill: Date.now(),
                level: 1,
                streak: 0,
                lastActivityDate: '2025-01-01',
                currentModuleId: 'mod_1'
            }],
            submissions: []
        });
    });

    it('should BLOCK students from updating protected fields (Role, Wallets)', () => {
        const store = useAppStore.getState();

        // Attempt to self-promote to ADMIN
        // @ts-ignore
        store.updateUser('student_1', { role: 'ADMIN' });

        const updatedUser = useAppStore.getState().user;
        expect(updatedUser?.role).toBe(UserRole.KID); // Should remain KID

        // Attempt to grant infinite money
        store.updateUser('student_1', { bizCoins: 999999 });
        expect(updatedUser?.bizCoins).toBe(100); // Should remain 100
    });

    it('should ALLOW students to update whitelisted fields', () => {
        const store = useAppStore.getState();

        store.updateUser('student_1', { name: 'New Name', hqTheme: 'gold' });

        const updatedUser = useAppStore.getState().user;
        expect(updatedUser?.name).toBe('New Name');
        expect(updatedUser?.hqTheme).toBe('gold');
    });

    it('should STRIP grades if a student attempts to self-grade', () => {
        const store = useAppStore.getState();

        store.addSubmission({
            id: 'sub_1',
            assignmentId: 'assign_1',
            studentId: 'student_1',
            submittedAt: new Date().toISOString(),
            status: 'GRADED', // Maliciously set to GRADED
            grade: 100 // Maliciously giving full marks
        });

        const submission = useAppStore.getState().submissions[0];
        expect(submission.status).toBe('PENDING'); // Should be reset to PENDING
        expect(submission.grade).toBeUndefined(); // Grade should be stripped
    });
});
