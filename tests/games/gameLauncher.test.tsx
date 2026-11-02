import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UniversalGameLauncher } from '../../src/features/games/components/UniversalGameLauncher';
import { useAppStore } from '../../src/store';
import { UserRole } from '../../src/types';

// Mock audio
vi.mock('../../src/lib/sound', () => ({
  SoundService: {
    play: vi.fn(),
    playClick: vi.fn(),
    playSuccess: vi.fn(),
    playError: vi.fn(),
    init: vi.fn()
  }
}));

describe('UniversalGameLauncher (Phase 4)', () => {
  beforeEach(() => {
    useAppStore.setState({
      user: {
        id: 'test_kid',
        name: 'Test Kid',
        role: UserRole.KID,
        xp: 100,
        level: 1,
        streak: 1,
        lastActivityDate: '2026-09-30',
        ppTokens: 50,
        currentModuleId: 'MOD_MB',
        completedLessonIds: [],
        badges: [],
        inventory: [],
        settings: { dailyGoalMinutes: 15, soundEnabled: true, musicEnabled: false, themeColor: 'green', themeMode: 'light', ageMode: 'junior' },
        hqLevel: 'hq_garage',
        unlockedSkills: [],
        portfolio: [],
        equippedItems: [],
        placedItems: [],
        properties: [],
        subscriptionStatus: 'FREE',
        subscriptionTier: 'intern',
        energy: 5,
        lastEnergyRefill: Date.now(),
        competencyMastery: {}
      }
    });
  });

  it('renders intro screen with station badge, title, and difficulty options', () => {
    render(
      <UniversalGameLauncher
        gameId="arcade_01_coin"
        onClose={vi.fn()}
      />
    );

    // Verify station badge is rendered
    expect(screen.getByText(/Station 01|محطة 01|محطة 1/)).toBeInTheDocument();

    // Verify difficulty choices
    expect(screen.getByText('rookie')).toBeInTheDocument();
    expect(screen.getByText('founder')).toBeInTheDocument();
    expect(screen.getByText('tycoon')).toBeInTheDocument();
  });

  it('transitions to playing state and completes with rewards dispatched to store', async () => {
    const onComplete = vi.fn();
    render(
      <UniversalGameLauncher
        gameId="arcade_01_coin"
        onClose={vi.fn()}
        onGameCompleted={onComplete}
      />
    );

    // Click Start Challenge
    const startBtn = screen.getByText(/Start Challenge Now|ابدأ التحدي الآن/);
    fireEvent.click(startBtn);

    // Verify Playing state has simulated action
    const completeBtn = screen.getByText(/Complete 3 Stars|إنهاء بنجاح/);
    expect(completeBtn).toBeInTheDocument();

    // Click Complete
    fireEvent.click(completeBtn);

    // Verify Result Screen is shown
    expect(screen.getByText(/Challenge Complete!|أحسنت صنعاً/)).toBeInTheDocument();
    expect(screen.getByText('+150 XP')).toBeInTheDocument();

    // Verify store received XP and ppTokens
    const updatedUser = useAppStore.getState().user;
    expect(updatedUser?.xp).toBe(250); // 100 initial + 150 awarded
    expect(updatedUser?.ppTokens).toBe(125); // 50 initial + 75 awarded
    expect(onComplete).toHaveBeenCalled();
  });
});
