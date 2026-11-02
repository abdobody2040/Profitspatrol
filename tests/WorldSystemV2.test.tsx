import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { useAppStore } from '@/store';
import { useEducationStore } from '@/store/educationStore';
import KidMap from '@/features/hq/components/KidMap';
import { AssetRegistry } from '@/assets/world/AssetRegistry';
import { User, UserRole } from '@/types';

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
    default: vi.fn()
}));

const createMockUser = (): User => ({
    id: 'test_user',
    name: 'Test Kid',
    username: 'test',
    role: UserRole.KID,
    xp: 0,
    level: 1,
    streak: 1,
    lastActivityDate: '2024-01-01',
    ppTokens: 100,
    currentModuleId: 'mod_1',
    completedLessonIds: [],
    readBookIds: [],
    badges: [],
    inventory: [],
    settings: { dailyGoalMinutes: 15, soundEnabled: false, musicEnabled: false, themeColor: 'green', themeMode: 'light' },
    hqLevel: 'hq_garage',
    unlockedSkills: [],
    portfolio: [],
    equippedItems: [],
    placedItems: [],
    properties: [],
    subscriptionStatus: 'PREMIUM',
    subscriptionTier: 'founder',
    energy: 5,
    lastEnergyRefill: Date.now(),
    unlockedCollectibles: [],
    activeQuests: []
});

describe('World System V2 - Asset Abstraction & Configs', () => {
    it('AssetRegistry resolves mascot, landmark, and collectible keys to renderable SVG components', () => {
        // Smoke-test one representative key per category — TypeScript enforces the full set at compile time
        const smokeKeys = [
            'ollie_idle',              // mascot
            'building_cozy_garage',    // landmark
            'col_founders_notebook',   // collectible
        ];
        smokeKeys.forEach(key => {
            const Component = AssetRegistry.get(key);
            expect(Component).toBeDefined();
            const { container } = render(<Component />);
            expect(container.querySelector('svg')).toBeInTheDocument();
        });
    });


    it('opens NPC dialogue drawer when clicked', async () => {
        const mockUser = createMockUser();
        useAppStore.setState({ user: mockUser });

        useEducationStore.setState({
            lessons: [
                { id: 'les_1', title: 'Money Intro', topic_tag: 'Money Basics', game_rewards: { base_xp: 10, currency_value: 10 } }
            ] as any
        });

        render(
            <MemoryRouter>
                <KidMap onStartLesson={() => { }} />
            </MemoryRouter>
        );

        const npcBtn = screen.getByText('ENTREPRENEUR');
        expect(npcBtn).toBeInTheDocument();

        fireEvent.click(npcBtn);

        expect(screen.getByRole('heading', { level: 3, name: /entrepreneur/i })).toBeInTheDocument();
        expect(screen.getByText(/Active Quest: Entrepreneur's First Budget/i)).toBeInTheDocument();

        const chitchatBtn = screen.getByRole('button', { name: /chitchat/i });
        fireEvent.click(chitchatBtn);

        const adviceBtn = screen.getByRole('button', { name: /ask advice/i });
        fireEvent.click(adviceBtn);
    });

    it('handles Quest completion and unlocks collectibles', async () => {
        const mockUser = createMockUser();
        mockUser.ppTokens = 150;
        useAppStore.setState({ user: mockUser });

        useEducationStore.setState({
            lessons: [
                { id: 'les_1', title: 'Money Intro', topic_tag: 'Money Basics', game_rewards: { base_xp: 10, currency_value: 10 } }
            ] as any
        });

        render(
            <MemoryRouter>
                <KidMap onStartLesson={() => { }} />
            </MemoryRouter>
        );

        const npcBtn = screen.getByText('ENTREPRENEUR');
        fireEvent.click(npcBtn);

        const completeBtn = screen.getByRole('button', { name: /complete quest & claim rewards/i });
        expect(completeBtn).toBeInTheDocument();

        fireEvent.click(completeBtn);

        const updatedUser = useAppStore.getState().user;
        expect(updatedUser?.completedLessonIds).toContain('QUEST_qst_budget_sheet');
        expect(updatedUser?.unlockedCollectibles).toContain('col_founders_notebook');
        expect(updatedUser?.ppTokens).toBe(250);
        expect(updatedUser?.xp).toBe(50);

        // Verify NPC is now hidden/disappeared from the map
        expect(screen.queryByText('ENTREPRENEUR')).not.toBeInTheDocument();
    });
});
