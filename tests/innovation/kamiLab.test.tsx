import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { KamiExperimentLab, LAB_ELEMENTS } from '../../src/features/innovation/components/KamiExperimentLab';
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

describe('KamiExperimentLab Component', () => {
  beforeEach(() => {
    useAppStore.setState({
      user: {
        id: 'test_user',
        name: 'Test Kid',
        role: 'kid',
        xp: 100,
        ppTokens: 50
      } as any
    });
  });

  it('renders all base elements and modifiers correctly', () => {
    render(<KamiExperimentLab />);

    // Check header
    expect(screen.getByText(/Kami's Prototyping Lab|معمل كامي/i)).toBeInTheDocument();

    // Check base items
    const bases = LAB_ELEMENTS.filter(e => e.category === 'base');
    bases.forEach(b => {
      expect(screen.getAllByText(new RegExp(`${b.nameEn}|${b.nameAr}`)).length).toBeGreaterThan(0);
    });
  });

  it('synthesizes prototype when base is chosen and awards XP and tokens', async () => {
    render(<KamiExperimentLab />);

    // Select the first base
    const firstBase = LAB_ELEMENTS.find(e => e.category === 'base')!;
    const baseBtn = screen.getByText(new RegExp(`${firstBase.nameEn}|${firstBase.nameAr}`)).closest('button');
    fireEvent.click(baseBtn!);

    // Select a modifier
    const firstMod = LAB_ELEMENTS.find(e => e.category === 'modifier')!;
    const modBtn = screen.getByText(new RegExp(`${firstMod.nameEn}|${firstMod.nameAr}`)).closest('button');
    fireEvent.click(modBtn!);

    // Click synthesize button
    const synthesizeBtn = screen.getByText(/Synthesize Prototype|بدء التصنيع والاختبار/i).closest('button');
    fireEvent.click(synthesizeBtn!);

    // Wait for synthesis result
    await waitFor(() => {
      expect(screen.getByText(/Prototype Synthesized|تم ابتكار النموذج/i)).toBeInTheDocument();
    }, { timeout: 3000 });

    // Verify user profile received rewards
    const updatedUser = useAppStore.getState().user;
    expect(updatedUser?.xp).toBeGreaterThan(100);
    expect(updatedUser?.ppTokens).toBeGreaterThan(50);
  });
});
