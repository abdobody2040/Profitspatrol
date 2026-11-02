import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { useAppStore } from '@/store';
import { useEducationStore } from '@/store/educationStore';
import { AdventureMap } from '@/features/hq/components/AdventureMap';
import { ALL_LESSONS, COURSE_MAP } from '@/features/education/data/curriculum';
import { User, UserRole } from '@/types';

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

const createMockUser = (level = 1): User => ({
  id: 'test_student',
  name: 'Patrol Kid',
  username: 'patrol_kid',
  role: UserRole.KID,
  xp: 100,
  level,
  streak: 3,
  lastActivityDate: '2026-10-02',
  ppTokens: 250,
  currentModuleId: 'MOD_MB',
  completedLessonIds: ['MB_01', 'MB_02'],
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
  activeQuests: [],
});

describe('AdventureMap - 20 Modules & Dynamic Curriculum Scaling', () => {
  it('renders all 10 lessons in the active module instead of capping at 8', () => {
    const mockUser = createMockUser();
    useAppStore.setState({ user: mockUser });
    useEducationStore.setState({ lessons: ALL_LESSONS });

    const handleStartLesson = vi.fn();

    render(
      <MemoryRouter>
        <AdventureMap onStartLesson={handleStartLesson} />
      </MemoryRouter>
    );

    // Module 1 (Money Basics) has 10 lessons (MB_01 to MB_10)
    // Verify lesson 1 is rendered (What is Money / يعني إيه فلوس)
    const firstLessonText = screen.getByText(/(What is Money|يعني إيه فلوس)/i);
    expect(firstLessonText).toBeInTheDocument();

    // Verify 8th/10th lesson (Grand Champion Capstone / تحدي بطل الأعمال) is rendered
    const capstoneNode = screen.getByText(/(Business Hero Challenge|تحدي بطل الأعمال)/i);
    expect(capstoneNode).toBeInTheDocument();

    // Clicking the lesson node button invokes onStartLesson with exact lesson id
    const circleBtn = firstLessonText.closest('button') || screen.getByRole('button', { name: /(MB_01|What is Money|يعني إيه فلوس)/i });
    if (circleBtn) {
      fireEvent.click(circleBtn);
      expect(handleStartLesson).toHaveBeenCalledWith('MB_01');
    }
  });

  it('renders in-district module pills and allows switching modules', () => {
    const mockUser = createMockUser();
    useAppStore.setState({ user: mockUser });
    useEducationStore.setState({ lessons: ALL_LESSONS });

    render(
      <MemoryRouter>
        <AdventureMap onStartLesson={() => {}} />
      </MemoryRouter>
    );

    // Money District has MOD_MB, MOD_FIN, MOD_FUTURE
    const safetyPill = screen.getByRole('button', { name: /(Safety & Smarts|الأمن والذكاء المالي)/i });
    expect(safetyPill).toBeInTheDocument();

    // Switch to Safety & Smarts
    fireEvent.click(safetyPill);

    // Verify Safety & Smarts lessons are now loaded
    expect(screen.getAllByText(/(Passwords & Privacy|كلمات المرور والخصوصية)/i).length).toBeGreaterThan(0);
  });

  it('opens All 20 Modules modal and displays all 4 seasons with unlock requirements', () => {
    const mockUser = createMockUser(5); // Level 5 student
    useAppStore.setState({ user: mockUser });
    useEducationStore.setState({ lessons: ALL_LESSONS });

    render(
      <MemoryRouter>
        <AdventureMap onStartLesson={() => {}} />
      </MemoryRouter>
    );

    // Click "All 20 Modules" button
    const allModulesBtn = screen.getByRole('button', { name: /(All 20 Modules|جميع الفصول|٢٠ فصل)/i });
    fireEvent.click(allModulesBtn);

    // Modal should be open
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /(Patrol Academy: All 20 Modules|أكاديمية باترول: الـ 20 فصلاً)/i })).toBeInTheDocument();

    // Verify all 4 seasons are visible
    expect(screen.getByText(/(Season 1: Foundation|الموسم 1: التأسيس)/i)).toBeInTheDocument();
    expect(screen.getByText(/(Season 2: Advanced Track|الموسم 2: المسار المتقدم)/i)).toBeInTheDocument();
    expect(screen.getByText(/(Season 3: CEO Track|الموسم 3: مسار الرئيس التنفيذي)/i)).toBeInTheDocument();
    expect(screen.getByText(/(Season 4: Mastery Track|الموسم 4: مسار الاحتراف)/i)).toBeInTheDocument();

    // Verify level gates: Level 5 kid cannot access CEO track (requires Level 8)
    expect(screen.getByText(/(Requires Lvl 8|يتطلب مستوى 8)/i)).toBeInTheDocument();
    expect(screen.getByText(/(Requires Lvl 12|يتطلب مستوى 12)/i)).toBeInTheDocument();

    // Close modal
    const closeBtn = screen.getByRole('dialog').querySelector('button');
    if (closeBtn) fireEvent.click(closeBtn);
  });
});
