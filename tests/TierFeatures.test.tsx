
import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { useAppStore } from '../src/store';
import { useEnergy } from '../src/hooks/useEnergy';
import { UserRole, User } from '@/types';
import OllieChat from '../src/features/game/components/OllieChat';
import Layout from '../src/components/layout/Layout';
import Headquarters from '../src/features/hq/components/Headquarters';
import GameMenu from '../src/features/game/components/GameMenu';
import EnergyBar from '../src/features/game/components/EnergyBar';
import { SoundService } from '../src/lib/sound';

// Mock SoundService
vi.mock('../src/services/SoundService', () => ({
  SoundService: {
    playClick: vi.fn(),
    playLevelUp: vi.fn(),
    playError: vi.fn(),
    playSuccess: vi.fn(),
    playCoin: vi.fn(),
  },
}));



// Store and useEnergy are used from real implementation
vi.mock('../src/services/geminiService');

vi.mock('../src/features/marketing/components/StripePaymentPage', () => ({
  default: () => <div data-testid="stripe-payment-page">Mock Payment</div>
}));

// Mock Gemini Service
vi.mock('../src/services/geminiService', () => ({
  chatWithOllie: vi.fn().mockResolvedValue("Hoot hoot! I am a mock owl."),
}));

// Mock intensive components that cause test hangers
vi.mock('../src/features/scenarios/components/ScenarioEngine', () => ({
  default: () => null
}));
vi.mock('../src/features/game/components/NewsTicker', () => ({
  default: () => null
}));
vi.mock('../src/features/education/components/LiveNowWidget', () => ({
  default: () => null
}));
vi.mock('../src/components/ui/LanguageToggle', () => ({
  default: () => <div data-testid="language-toggle">EN</div>
}));
vi.mock('../src/components/ui/ThemeToggle', () => ({
  default: () => <div data-testid="theme-toggle">Light</div>
}));

// Mock Alert & scrollIntoView
vi.spyOn(window, 'alert').mockImplementation(() => { });
window.HTMLElement.prototype.scrollIntoView = vi.fn();

const createMockUser = (tier: any, energy = 5, role = UserRole.KID): User => ({
  id: 'test_user',
  name: 'Test Kid',
  username: 'test',
  role: role,
  xp: 0,
  level: 1,
  streak: 1,
  lastActivityDate: '2023-01-01',
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
  subscriptionStatus: tier === 'intern' ? 'FREE' : 'PREMIUM',
  subscriptionTier: tier,
  energy: energy,
  lastEnergyRefill: Date.now()
});


import i18n from '../src/lib/i18n';

describe('Tier Feature Validation', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en');
    useAppStore.setState({ user: null, users: [], games: [] });
    try { localStorage.clear(); } catch { /* jsdom adapter may not support clear() */ }
    vi.clearAllMocks();
  });


  // 1. Intern (Free)
  describe('Intern Tier (Free)', () => {
    it('consumes energy correctly', () => {
      const user = createMockUser('intern', 5);
      useAppStore.setState({ user, users: [user] });

      const { result } = renderHook(() => useEnergy());

      act(() => {
        result.current.consumeEnergy();
      });

      expect(useAppStore.getState().user?.energy).toBe(4);
    });

    it('blocks AI chat after free limit', () => {
      const user = createMockUser('intern');
      useAppStore.setState({ user, users: [user] });
      try { localStorage.setItem('ollie_free_sample_used', 'true'); } catch { /* custom adapter */ }

      render(
        <MemoryRouter>
          <OllieChat />
        </MemoryRouter>
      );

      // Floating button click to open
      const toggleButtons = screen.getAllByRole('button');
      // The floating button is usually the last one or the one with the owl image
      const toggleBtn = toggleButtons[toggleButtons.length - 1];
      fireEvent.click(toggleBtn);

      expect(screen.getByText('Hire Ollie (Unlock AI)')).toBeInTheDocument();
    });


  });

  // 2. Founder ($9.99)
  describe('Founder Tier ($9.99)', () => {
    it('has infinite energy', () => {
      const user = createMockUser('founder', 5);
      useAppStore.setState({ user, users: [user] });

      const { result } = renderHook(() => useEnergy());

      act(() => {
        result.current.consumeEnergy();
      });

      expect(useAppStore.getState().user?.energy).toBe(5);
    });

    it('displays infinity symbol in EnergyBar', () => {
      const user = createMockUser('founder');
      useAppStore.setState({ user, users: [user] });

      render(<EnergyBar />);
      expect(screen.getByText('UNLIMITED')).toBeInTheDocument();
    });

    it('grants access to Custom HQ features', () => {
      const user = createMockUser('founder');
      useAppStore.setState({ user, users: [user] });

      render(<Headquarters />);
      fireEvent.click(screen.getByText('HQ Builder'));

      // The customize button title changes based on access
      // "Change Theme" vs "Locked (Founder Only)"
      const customizeBtn = screen.getByTitle("Change Theme");
      expect(customizeBtn).toBeInTheDocument();
    });
  });

  // 3. Board Member ($119)
  describe('Board Member Tier ($119)', () => {
    it('energy_is_not_decremented_after_consume', () => {
      const user = createMockUser('board', 5);
      useAppStore.setState({ user, users: [user] });

      const { result } = renderHook(() => useEnergy());

      act(() => { result.current.consumeEnergy(); });

      expect(useAppStore.getState().user?.energy).toBe(5);
    });
  });

  // 4. Tycoon ($169)
  describe('Tycoon Tier ($169)', () => {
    it('allows unlimited AI chat', async () => {
      const user = createMockUser('tycoon');
      useAppStore.setState({ user, users: [user] });
      // Even if "used" flag is set from previous tier
      try { localStorage.setItem('ollie_free_sample_used', 'true'); } catch { /* custom adapter */ }

      render(
        <MemoryRouter>
          <OllieChat />
        </MemoryRouter>
      );
      const toggleButtons = screen.getAllByRole('button');
      const toggleBtn = toggleButtons[toggleButtons.length - 1];
      fireEvent.click(toggleBtn);

      const input = screen.getByPlaceholderText('Ask your executive consultant...');
      expect(input).toBeInTheDocument();
    });

    it('unlocks Negotiation Battle game', () => {
      const user = createMockUser('tycoon');
      // Add negotiation game to store
      const negGame = {
        business_id: 'BIZ_NEGOTIATION',
        name: 'Negotiation Battle',
        category: 'Tycoon Exclusive',
        game_type: 'negotiation_game',
        visual_config: { colors: { primary: '#000', background: '#fff' }, icon: '🤝' },
        description: 'Test'
      };
      useAppStore.setState({ user, users: [user], games: [negGame as any] });

      const onSelect = vi.fn();
      render(<GameMenu onSelectGame={onSelect} />);

      const gameTitle = screen.getByText('Negotiation Battle');
      const gameCard = gameTitle.closest('button');
      fireEvent.click(gameCard!);

      expect(onSelect).toHaveBeenCalledWith('BIZ_NEGOTIATION');
    });
  });
});
