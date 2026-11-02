
import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, renderHook, act } from '@testing-library/react';
import { useAppStore } from '@/store';
import { useEnergy } from '@/hooks/useEnergy';
import UniversalBusinessGame from '@/features/game/components/UniversalBusinessGame';
import { User, UserRole } from '@/types';

const MOCK_GAME = {
  business_id: 'test_game',
  name: 'Test Game',
  category: 'Retail',
  game_type: 'simulation_tycoon',
  description: 'Test Description',
  visual_config: { theme: 'light', colors: { primary: '#000', secondary: '#000', accent: '#000', background: '#fff' }, icon: '🎮' },
  upgrade_tree: [],
  variables: { player_inputs: ['price'] },
  event_triggers: { positive: { event_name: 'Good', effect: '', duration: '' }, negative: { event_name: 'Bad', effect: '', duration: '' } }
};

const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: 'test_user',
  name: 'Test User',
  username: 'test',
  role: UserRole.KID,
  xp: 0,
  level: 1,
  ppTokens: 0,
  streak: 0,
  inventory: [],
  completedLessonIds: [],
  badges: [],
  lastActivityDate: '',
  currentModuleId: 'mod_1',
  settings: { dailyGoalMinutes: 15, soundEnabled: false, musicEnabled: false, themeColor: 'green', themeMode: 'light' },
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
  ...overrides
});

describe('Subscription & Energy System', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval', 'Date'] });
    try { localStorage.clear(); } catch { /* jsdom adapter may not support clear() */ }
    useAppStore.setState({ user: null, users: [], games: [MOCK_GAME as any] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('intern_with_last_energy_unit_is_blocked_on_next_consume', () => {
    const user = createMockUser({ subscriptionTier: 'intern', energy: 1 });
    useAppStore.setState({ user, users: [user] });

    const { result } = renderHook(() => useEnergy());

    let success;
    act(() => { success = result.current.consumeEnergy(); });
    expect(success).toBe(true);
    expect(useAppStore.getState().user?.energy).toBe(0);

    act(() => { success = result.current.consumeEnergy(); });
    expect(success).toBe(false);
    expect(useAppStore.getState().user?.energy).toBe(0);
  });

  it('founder_energy_is_not_decremented_after_consume', () => {
    const user = createMockUser({ subscriptionTier: 'founder', energy: 5 });
    useAppStore.setState({ user, users: [user] });

    const { result } = renderHook(() => useEnergy());

    let success;
    act(() => { success = result.current.consumeEnergy(); });
    expect(success).toBe(true);
    expect(useAppStore.getState().user?.energy).toBe(5);
  });

  it('intern_with_zero_energy_renders_paywall_modal_on_game_start', async () => {
    const user = createMockUser({ subscriptionTier: 'intern', energy: 0 });
    useAppStore.setState({ user, users: [user] });

    render(React.createElement(UniversalBusinessGame, { gameId: 'test_game', onExit: () => {} }));

    fireEvent.click(screen.getByText(/Start Day|بدء اليوم/i));

    expect(await screen.findByText(/Content Locked/i)).toBeInTheDocument();
  });

  it('upgrading_to_tycoon_grants_ai_access_and_unlimited_energy', () => {
    const user = createMockUser({ subscriptionTier: 'intern' });
    useAppStore.setState({ user, users: [user] });

    act(() => { useAppStore.getState().upgradeSubscription('tycoon'); });

    const state = useAppStore.getState();
    expect(state.user?.subscriptionTier).toBe('tycoon');
    expect(state.hasAiAccess()).toBe(true);
    expect(state.hasUnlimitedEnergy()).toBe(true);
  });
});
