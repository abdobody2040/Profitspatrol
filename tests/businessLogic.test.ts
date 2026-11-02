import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAppStore, SHOP_ITEMS, LEVEL_THRESHOLDS } from '@/store';
import { useEducationStore } from '@/store/educationStore';
import { User, UserRole } from '@/types';

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

// Helper to create a fresh mock user
// NOTE: The internal currency field is `ppTokens`, not `bizCoins`.
const createMockUser = (overrides?: Partial<User>): User => ({
  id: 'test_user',
  name: 'Test Kid',
  username: 'test',
  password: '123',
  role: UserRole.KID,
  xp: 0,
  level: 1,
  streak: 1,
  lastActivityDate: new Date().toISOString().split('T')[0],
  ppTokens: 100,      // ✅ Correct field name (was wrongly `bizCoins` before)
  currentModuleId: 'mod_1',
  completedLessonIds: [],
  badges: [],
  inventory: [],
  settings: {
    dailyGoalMinutes: 15,
    soundEnabled: false,
    musicEnabled: false,
    themeColor: 'green',
    themeMode: 'light'
  },
  hqLevel: 'hq_garage',
  unlockedSkills: [],
  portfolio: [],
  equippedItems: [],
  subscriptionStatus: 'FREE',
  subscriptionTier: 'intern',
  energy: 5,
  lastEnergyRefill: Date.now(),
  ...overrides
} as any);

describe('Business Logic & Store', () => {
  // Reset store before each test
  beforeEach(() => {
    useAppStore.setState({
      user: createMockUser(),
      users: [createMockUser()],
      showLevelUpModal: false
    });
  });

  describe('Money Management', () => {
    it('should deduct ppTokens when buying an item', () => {
      const { buyItem } = useAppStore.getState();
      const item = SHOP_ITEMS[0];

      // Initial: 100 tokens
      buyItem(item);

      const updatedUser = useAppStore.getState().user;
      expect(updatedUser?.ppTokens).toBe(100 - item.cost);
    });

    it('should NOT allow purchase if balance is too low (prevent negative balance)', () => {
      // Set tokens to 0
      useAppStore.setState({ user: createMockUser({ ppTokens: 0 } as any) });

      const { buyItem } = useAppStore.getState();
      const item = SHOP_ITEMS[0];

      buyItem(item);

      const updatedUser = useAppStore.getState().user;
      expect(updatedUser?.ppTokens).toBe(0); // Should remain 0
      expect(updatedUser?.inventory).not.toContain(item.id);
    });

    it('should add ppTokens when a game is completed', () => {
      const { completeGame } = useAppStore.getState();
      // completeGame(score, xpReward): tokenReward = floor(xpReward / 5)
      completeGame(250, 100); // tokenReward = 100 / 5 = 20

      const updatedUser = useAppStore.getState().user;
      // 100 initial + 20 reward = 120
      expect(updatedUser?.ppTokens).toBe(120);
    });
  });

  describe('Leveling System', () => {
    // NOTE: completeLesson lives on useEducationStore, not useAppStore.
    // It writes back to useAppStore internally, so we can verify appStore state.
    it('should increase XP when completing a lesson', () => {
      const { completeLesson } = useEducationStore.getState();
      completeLesson('test_lesson', 50, 10);

      const updatedUser = useAppStore.getState().user;
      expect(updatedUser?.xp).toBe(50);
    });

    it('should trigger level up when crossing threshold', () => {
      // Thresholds: [0, 100, 250...]
      // Start at 90 XP (Level 1)
      useAppStore.setState({ user: createMockUser({ xp: 90, level: 1 } as any), users: [createMockUser({ xp: 90, level: 1 } as any)] });

      const { completeLesson } = useEducationStore.getState();
      // Add 20 XP -> Total 110 (Crosses 100)
      completeLesson('test_lesson_2', 20, 0);

      const state = useAppStore.getState();
      expect(state.user?.level).toBe(2);
      expect(state.showLevelUpModal).toBe(true);
      expect(state.levelUpData).toEqual({ level: 2, xp: 110 });
    });

    it('should NOT level up if threshold is not met', () => {
      useAppStore.setState({ user: createMockUser({ xp: 10, level: 1 } as any), users: [createMockUser({ xp: 10, level: 1 } as any)] });

      const { completeLesson } = useEducationStore.getState();
      completeLesson('test_lesson_3', 10, 0); // Total 20, still < 100

      const state = useAppStore.getState();
      expect(state.user?.level).toBe(1);
      expect(state.showLevelUpModal).toBe(false);
    });
  });

  describe('Inventory Management', () => {
    it('should add item ID to inventory upon purchase', () => {
      const { buyItem } = useAppStore.getState();
      const item = SHOP_ITEMS[0];

      buyItem(item);

      const updatedUser = useAppStore.getState().user;
      expect(updatedUser?.inventory).toContain(item.id);
    });

    it('should prevent buying unique items twice (Avatar items)', () => {
      const item = SHOP_ITEMS.find(i => i.type === 'AVATAR')!;

      // Pre-own the item
      useAppStore.setState({
        user: createMockUser({
          ppTokens: 1000,
          inventory: [item.id]
        } as any),
        users: [createMockUser({ ppTokens: 1000, inventory: [item.id] } as any)]
      });

      const { buyItem } = useAppStore.getState();
      buyItem(item); // Try buying again

      const updatedUser = useAppStore.getState().user;
      // Tokens should NOT decrease
      expect(updatedUser?.ppTokens).toBe(1000);
      // Inventory should still have it only once
      expect(updatedUser?.inventory.filter(id => id === item.id).length).toBe(1);
    });
  });
});
