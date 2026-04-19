
import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useAppStore } from '../src/store';
import { useEnergy } from '../src/hooks/useEnergy';
import { User, UserRole } from '../src/types';
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

// Mock Translations
vi.mock('react-i18next', () => {
  const t = (key: string) => key;
  const i18n = {
    language: 'en',
    changeLanguage: vi.fn(),
  };
  return {
    useTranslation: () => ({ t, i18n })
  };
});

// Mock React Router
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: '/' }),
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
  Routes: ({ children }: any) => <div>{children}</div>,
  Route: ({ element }: any) => element,
  BrowserRouter: ({ children }: any) => <div>{children}</div>,
  Navigate: () => null,
  Outlet: () => null,
}));

// Store and useEnergy are used from real implementation
vi.mock('../src/lib/sound');
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
  bizCoins: 100,
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


describe('Tier Feature Validation', () => {
  beforeEach(() => {
    useAppStore.setState({ user: null, users: [], games: [] });
    localStorage.clear();
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
      localStorage.setItem('ollie_free_sample_used', 'true');

      render(<OllieChat />);

      // Floating button click to open
      const toggleButtons = screen.getAllByRole('button');
      // The floating button is usually the last one or the one with the owl image
      const toggleBtn = toggleButtons[toggleButtons.length - 1];
      fireEvent.click(toggleBtn);

      // Expect "Hire Ollie" button using its translation key
      expect(screen.getByText('chat.hire_button')).toBeInTheDocument();
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
      // In unlimited mode, EnergyBar renders a badge with "Energy" text instead of countdown
      expect(screen.getByText('Unlimited')).toBeInTheDocument();
    });

    it('grants access to Custom HQ features', () => {
      const user = createMockUser('founder');
      useAppStore.setState({ user, users: [user] });

      render(<Headquarters />);

      // The customize button title changes based on access
      // "Change Theme" vs "Locked (Founder Only)"
      const customizeBtn = screen.getByTitle("Change Theme");
      expect(customizeBtn).toBeInTheDocument();
    });
  });

  // 3. Board Member ($119)
  describe('Board Member Tier ($119)', () => {


    it('inherits infinite energy', () => {
      const user = createMockUser('board', 5);
      useAppStore.setState({ user, users: [user] });

      const { result } = renderHook(() => useEnergy());
      expect(result.current.isUnlimited).toBe(true);
    });
  });

  // 4. Tycoon ($169)
  describe('Tycoon Tier ($169)', () => {
    it('allows unlimited AI chat', async () => {
      const user = createMockUser('tycoon');
      useAppStore.setState({ user, users: [user] });
      // Even if "used" flag is set from previous tier
      localStorage.setItem('ollie_free_sample_used', 'true');

      render(<OllieChat />);
      const toggleButtons = screen.getAllByRole('button');
      const toggleBtn = toggleButtons[toggleButtons.length - 1];
      fireEvent.click(toggleBtn);

      // Should see input, check for placeholder text for Tycoons
      const input = screen.getByPlaceholderText(/Ask your executive consultant/i);
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

      // Filter to 'Tycoon Exclusive' category or just find the game card
      // Since it's a grid, we can find by translation key
      const gameTitle = screen.getByText('games.negotiation.title');

      // Click the card (parent button)
      const gameCard = gameTitle.closest('button');
      fireEvent.click(gameCard!);

      expect(onSelect).toHaveBeenCalledWith('BIZ_NEGOTIATION');
    });
  });
});
