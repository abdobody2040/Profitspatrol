import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SkillTreeView } from '../../src/features/skills/components/SkillTreeView';
import { COMPETENCY_GROUPS, calculateMasteryLevel } from '../../src/domain/curriculum/competencyModel';
import { useAppStore } from '../../src/store';

// Mock SoundService
vi.mock('../../src/lib/sound', () => ({
  SoundService: {
    play: vi.fn(),
    playClick: vi.fn(),
    playSuccess: vi.fn(),
    playError: vi.fn(),
    init: vi.fn()
  }
}));

describe('SkillTreeView & Competency Progression', () => {
  beforeEach(() => {
    useAppStore.setState({
      user: {
        id: 'test_user',
        name: 'Test Kid',
        role: 'kid',
        xp: 350,
        ppTokens: 100,
        competencyMastery: {
          earning_basics: { level: 2, score: 150, lastTestedAt: new Date().toISOString() },
          saving_habits: { level: 3, score: 450, lastTestedAt: new Date().toISOString() }
        }
      } as any
    });
  });

  it('renders all 6 canonical competency groups in the navigation bar', () => {
    render(<SkillTreeView />);

    COMPETENCY_GROUPS.forEach((g) => {
      // Look for either English or Arabic group name
      const groupElements = screen.getAllByText(new RegExp(`${g.nameEn}|${g.nameAr}`));
      expect(groupElements.length).toBeGreaterThan(0);
    });
  });

  it('calculates mastery levels accurately based on cumulative competency score', () => {
    const novice = calculateMasteryLevel(45);
    expect(novice.level).toBe(1);
    expect(novice.titleEn).toBe('Novice');
    expect(novice.progressPercent).toBe(45);

    const apprentice = calculateMasteryLevel(200);
    expect(apprentice.level).toBe(2);
    expect(apprentice.titleEn).toBe('Apprentice');

    const expert = calculateMasteryLevel(500);
    expect(expert.level).toBe(3);
    expect(expert.titleEn).toBe('Expert');

    const master = calculateMasteryLevel(850);
    expect(master.level).toBe(4);
    expect(master.titleEn).toBe('Master');
    expect(master.progressPercent).toBe(100);
  });

  it('opens detailed description modal when a skill node is clicked', () => {
    render(<SkillTreeView />);

    // Click first skill card via testid
    const card = screen.getByTestId('skill-card-cash_currency');
    fireEvent.click(card);

    // Check modal appears with action button
    expect(screen.getByText(/Got it, Back to Tree|تم، العودة للشجرة/i)).toBeInTheDocument();
  });
});
