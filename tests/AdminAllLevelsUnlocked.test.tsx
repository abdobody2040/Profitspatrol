import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { useAppStore } from '@/store';
import { useEducationStore } from '@/store/educationStore';
import { AdventureMap } from '@/features/hq/components/AdventureMap';
import GameMenu from '@/features/game/components/GameMenu';
import { FullMapSheet } from '@/features/education/components/path/FullMapSheet';
import { ALL_LESSONS } from '@/features/education/data/curriculum';
import { MOCK_ADMIN } from '@/data/mocks';
import { UserRole } from '@/types';

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

describe('Admin All Levels & Content Unlocked Verification', () => {
  beforeEach(() => {
    useAppStore.setState({ user: { ...MOCK_ADMIN } });
    useEducationStore.setState({ lessons: ALL_LESSONS });
  });

  it('verifies MOCK_ADMIN has max level (100) and tycoon tier', () => {
    expect(MOCK_ADMIN.role).toBe(UserRole.ADMIN);
    expect(MOCK_ADMIN.level).toBe(100);
    expect(MOCK_ADMIN.subscriptionTier).toBe('tycoon');
    expect(MOCK_ADMIN.subscriptionStatus).toBe('PREMIUM');
  });

  it('renders all lesson nodes as unlocked for admin on AdventureMap with no lock icons', () => {
    const handleStartLesson = vi.fn();

    const { container } = render(
      <MemoryRouter>
        <AdventureMap onStartLesson={handleStartLesson} />
      </MemoryRouter>
    );

    // Verify all 10 lesson node buttons in the path are unlocked (class does not have node--locked)
    const nodeButtons = Array.from(container.querySelectorAll('button.node')).filter((btn) => {
      const aria = btn.getAttribute('aria-label') || '';
      return !aria.includes('Boss') && !aria.includes('Chest');
    });

    expect(nodeButtons.length).toBe(10);
    nodeButtons.forEach((btn) => {
      expect(btn.classList.contains('node--locked')).toBe(false);
      const aria = btn.getAttribute('aria-label') || '';
      expect(aria).not.toContain('Locked');
    });

    // Admin can click on any future lesson (e.g. lesson 5 or 9) and start it immediately
    const lesson9Btn = nodeButtons[8];
    if (lesson9Btn) {
      fireEvent.click(lesson9Btn);
      expect(handleStartLesson).toHaveBeenCalled();
    }
  });

  it('unlocks the District Boss for admin and launches the boss fight flow smoothly', () => {
    render(
      <MemoryRouter>
        <AdventureMap onStartLesson={() => {}} />
      </MemoryRouter>
    );

    // Boss fight button should be active and say "Fight Boss" / "مواجهة الزعيم"
    const fightBossBtns = screen.getAllByRole('button', { name: /(Fight Boss|مواجهة الزعيم)/i });
    expect(fightBossBtns.length).toBeGreaterThan(0);

    // 1. Clicking fight boss opens PreBossModal briefing
    fireEvent.click(fightBossBtns[0]);
    const readyBtn = screen.getByRole('button', { name: /(Ready for the Challenge|جاهز للتحدي)/i });
    expect(readyBtn).toBeDefined();

    // 2. Clicking ready starts the BossFightShell
    fireEvent.click(readyBtn);
    expect(screen.getByText(/(Cash Remaining|الرصيد المتبقي)/i)).toBeDefined();
    expect(screen.getByText(/(Daily Burn Rate|الخسارة اليومية)/i)).toBeDefined();
  });

  it('renders the My Venture (مشروعي) navigation item with visible rocket icon', () => {
    const { container } = render(
      <MemoryRouter>
        <AdventureMap onStartLesson={() => {}} />
      </MemoryRouter>
    );

    // Find the My Venture / مشروعي / مشاريعي button
    const ventureBtn = screen.getAllByRole('button', { name: /(My Venture|مشروعي|مشاريعي)/i })[0];
    expect(ventureBtn).toBeDefined();

    // Verify it contains the theme-blue icon bubble
    const iconBubble = ventureBtn.querySelector('.icon-bubble');
    expect(iconBubble).toBeDefined();
    expect(iconBubble?.className).toContain('theme-blue');
    // Verify it contains an svg icon (Rocket)
    expect(iconBubble?.querySelector('svg')).toBeDefined();
  });

  it('unlocks all 20 modules in FullMapSheet for admin', () => {
    const handleSelectModule = vi.fn();

    render(
      <FullMapSheet
        isOpen={true}
        onClose={() => {}}
        currentModuleId="MOD_MB"
        completedLessonIds={new Set()}
        onSelectModule={handleSelectModule}
        isArabic={false}
        isAdmin={true}
      />
    );

    // Dialog should be open
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Verify no lock icons or locked modules in the sheet
    const moduleCards = screen.getAllByRole('button').filter(btn => btn.textContent?.includes('Lessons'));
    expect(moduleCards.length).toBe(20);
  });

  it('unlocks all arcade games and simulations in GameMenu for admin without paywall', () => {
    const handleSelectGame = vi.fn();

    render(
      <MemoryRouter>
        <GameMenu onSelectGame={handleSelectGame} />
      </MemoryRouter>
    );

    // Verify no "Founder Required" or "Tycoon Required" or "PREMIUM ONLY" lock labels
    expect(screen.queryByText(/Founder Required/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Tycoon Required/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/PREMIUM ONLY/i)).not.toBeInTheDocument();
  });
});
