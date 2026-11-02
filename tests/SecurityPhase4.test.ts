import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAppStore } from '@/store';
import { useEducationStore } from '@/store/educationStore';
import { UserRole } from '@/types';

vi.mock('@/lib/supabase', () => ({
    supabase: null,
    isSupabaseConfigured: vi.fn().mockReturnValue(false),
}));

vi.mock('@/services/persistence/SupabaseAdapter', () => ({
    supabaseAdapter: {
        client: null,
        saveUser: vi.fn().mockResolvedValue(undefined),
        saveClassroom: vi.fn().mockResolvedValue(undefined),
        deleteClassroom: vi.fn().mockResolvedValue(undefined),
        isTableMissing: vi.fn().mockReturnValue(false),
    },
}));

vi.mock('@/services/logger', () => ({
    Logger: {
        info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn(),
        logSecurityEvent: vi.fn().mockResolvedValue(undefined),
    },
}));

vi.mock('@/services/SoundService', () => ({
    SoundService: { playClick: vi.fn(), playCoin: vi.fn(), playSuccess: vi.fn(), playError: vi.fn(), playLevelUp: vi.fn() },
}));

const MOCK_USER_STATE = {
    id: 'student_1',
    name: 'Test Student',
    role: UserRole.KID,
    xp: 0,
    ppTokens: 100,
    settings: { soundEnabled: false, musicEnabled: false, themeMode: 'light' as const, dailyGoalMinutes: 30, themeColor: 'blue' },
    completedLessonIds: [],
    badges: [],
    inventory: [],
    hqLevel: 'hq_garage',
    unlockedSkills: [],
    portfolio: [],
    equippedItems: [],
    subscriptionStatus: 'FREE' as const,
    subscriptionTier: 'intern' as const,
    energy: 5,
    lastEnergyRefill: Date.now(),
    level: 1,
    streak: 0,
    lastActivityDate: '2025-01-01',
    currentModuleId: 'mod_1',
};

describe('Security Phase 4: Business Logic Integrity', () => {
    beforeEach(() => {
        useAppStore.setState({
            user: { ...MOCK_USER_STATE } as any,
            users: [{ ...MOCK_USER_STATE } as any],
        });
        useEducationStore.setState({ submissions: [] });
    });

    it('should BLOCK students from updating protected fields (Role, Wallets)', () => {
        const store = useAppStore.getState();

        // Attempt to self-promote to ADMIN
        // @ts-ignore
        store.updateUser('student_1', { role: 'ADMIN' });

        const updatedUser = useAppStore.getState().user;
        expect(updatedUser?.role).toBe(UserRole.KID); // Should remain KID

        // Attempt to grant infinite money (ppTokens is the internal currency field)
        store.updateUser('student_1', { ppTokens: 999999 } as any);
        expect(updatedUser?.ppTokens).toBe(100); // Should remain 100
    });

    it('should ALLOW students to update whitelisted fields', () => {
        const store = useAppStore.getState();

        store.updateUser('student_1', { name: 'New Name', hqTheme: 'gold' });

        const updatedUser = useAppStore.getState().user;
        expect(updatedUser?.name).toBe('New Name');
        expect(updatedUser?.hqTheme).toBe('gold');
    });

    it('should STRIP grades if a student attempts to self-grade', () => {
        // addSubmission lives on useEducationStore, not useAppStore
        const store = useEducationStore.getState();

        store.addSubmission({
            id: 'sub_1',
            assignmentId: 'assign_1',
            studentId: 'student_1',
            submittedAt: new Date().toISOString(),
            status: 'GRADED', // Maliciously set to GRADED
            grade: 100,       // Maliciously giving full marks
        });

        const submission = useEducationStore.getState().submissions.find(s => s.id === 'sub_1');
        expect(submission?.status).toBe('PENDING');       // Should be reset to PENDING
        expect(submission?.grade).toBeUndefined();         // Grade should be stripped
    });
});
