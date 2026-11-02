import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useAppStore } from '@/store';
import { User, UserRole, SubscriptionTier } from '@/types';
import { FamilyManager } from '@/features/family/components/FamilyManager';
import ParentDashboard from '@/features/dashboard/components/ParentDashboard';
import { resolveSubject, getLinkedChildren } from '@/utils/userUtils';
import { supabaseAdapter } from '@/services/persistence/SupabaseAdapter';
import { laravelAdapter } from '@/services/persistence/LaravelAdapter';

// Mock SoundService
vi.mock('@/services/SoundService', () => ({
  SoundService: {
    playClick: vi.fn(),
    playLevelUp: vi.fn(),
    playError: vi.fn(),
    playSuccess: vi.fn(),
    playCoin: vi.fn(),
  },
}));

vi.mock('@/lib/sound', () => ({
  SoundService: {
    playClick: vi.fn(),
    playLevelUp: vi.fn(),
    playError: vi.fn(),
    playSuccess: vi.fn(),
    playCoin: vi.fn(),
  },
}));

const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: 'test_user',
  name: 'Test User',
  username: 'test_user',
  role: UserRole.KID,
  xp: 100,
  level: 1,
  ppTokens: 50,
  streak: 1,
  inventory: [],
  completedLessonIds: [],
  readBookIds: [],
  badges: [],
  lastActivityDate: '2026-10-08',
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
  ...overrides,
});

describe('Kid Linking to Parent Across All Plans (Free, Founder, Tycoon)', () => {
  beforeEach(() => {
    localStorage.clear();
    useAppStore.setState({
      user: null,
      users: [],
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('1. Free Plan (Intern Tier)', () => {
    it('links kid to Free parent via invite code; kid remains Free and parent views kid stats', async () => {
      const parent = createMockUser({
        id: 'parent_free_1',
        name: 'Sarah Parent',
        username: 'sarah_p',
        role: UserRole.PARENT,
        subscriptionTier: 'intern',
        subscriptionStatus: 'FREE',
        referralCode: 'FAM-FREE',
      });

      const kid = createMockUser({
        id: 'kid_1',
        name: 'Leo Kid',
        username: 'leo_k',
        role: UserRole.KID,
        subscriptionTier: 'intern',
        subscriptionStatus: 'FREE',
        parentId: undefined,
        xp: 1450,
        level: 4,
        streak: 3,
      });

      // Populate local profiles and store
      localStorage.setItem(`family_invite_code_${parent.id}`, 'FAM-FREE');
      localStorage.setItem(
        'profits_patrol_all_profiles',
        JSON.stringify([
          { id: parent.id, invite_code: 'FAM-FREE', role: 'parent', subscription_tier: 'intern', subscription_status: 'FREE' },
          { id: kid.id, role: 'kid', subscription_tier: 'intern', subscription_status: 'FREE' },
        ])
      );

      useAppStore.setState({
        user: kid,
        users: [parent, kid],
      });

      // Render kid view in FamilyManager
      const { unmount } = render(
        <MemoryRouter>
          <FamilyManager />
        </MemoryRouter>
      );

      // Enter code and link
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'FAM-FREE' } });

      const linkButton = screen.getByRole('button', { name: /LINK|ربط/i });
      await act(async () => {
        fireEvent.click(linkButton);
      });

      // Verify kid now has parentId and remains intern (Free)
      const updatedState = useAppStore.getState();
      const updatedKid = updatedState.users.find(u => u.id === kid.id);
      expect(updatedKid?.parentId).toBe(parent.id);
      expect(updatedKid?.subscriptionTier).toBe('intern');
      expect(updatedKid?.subscriptionStatus).toBe('FREE');

      unmount();

      // Switch to Parent perspective
      useAppStore.setState({
        user: parent,
        users: [parent, updatedKid!],
      });

      render(
        <MemoryRouter>
          <ParentDashboard />
        </MemoryRouter>
      );

      // Verify Parent Dashboard resolves to the linked kid (not sample child preview)
      const linked = getLinkedChildren(parent.id, useAppStore.getState().users);
      expect(linked.length).toBe(1);
      expect(linked[0].id).toBe(kid.id);

      const resolved = resolveSubject(parent, useAppStore.getState().users);
      expect(resolved.id).toBe(kid.id);
      expect(resolved.name).toBe('Leo Kid');
    });
  });

  describe('2. Paid Plan - Founder Tier', () => {
    it('links kid to Founder parent; kid inherits Founder tier and unlimited energy', async () => {
      const parent = createMockUser({
        id: 'parent_founder_1',
        name: 'David Founder',
        username: 'david_f',
        role: UserRole.PARENT,
        subscriptionTier: 'founder',
        subscriptionStatus: 'PREMIUM',
        billingCycle: 'YEARLY',
        referralCode: 'FAM-FNDR',
      });

      const kid = createMockUser({
        id: 'kid_2',
        name: 'Mia Kid',
        username: 'mia_k',
        role: UserRole.KID,
        subscriptionTier: 'intern',
        subscriptionStatus: 'FREE',
        parentId: undefined,
      });

      localStorage.setItem(`family_invite_code_${parent.id}`, 'FAM-FNDR');
      localStorage.setItem(
        'profits_patrol_all_profiles',
        JSON.stringify([
          { id: parent.id, invite_code: 'FAM-FNDR', role: 'parent', subscription_tier: 'founder', subscription_status: 'PREMIUM' },
          { id: kid.id, role: 'kid', subscription_tier: 'intern', subscription_status: 'FREE' },
        ])
      );

      useAppStore.setState({
        user: kid,
        users: [parent, kid],
      });

      render(
        <MemoryRouter>
          <FamilyManager />
        </MemoryRouter>
      );

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'FAM-FNDR' } });

      const linkButton = screen.getByRole('button', { name: /LINK|ربط/i });
      await act(async () => {
        fireEvent.click(linkButton);
      });

      // Verify kid inherited Founder tier and unlimited energy
      const state = useAppStore.getState();
      const updatedKid = state.users.find(u => u.id === kid.id);
      expect(updatedKid?.parentId).toBe(parent.id);
      expect(updatedKid?.subscriptionTier).toBe('founder');
      expect(updatedKid?.subscriptionStatus).toBe('PREMIUM');
      expect(updatedKid?.billingCycle).toBe('YEARLY');

      // Test hook/store energy checks for this kid
      useAppStore.setState({ user: updatedKid });
      expect(useAppStore.getState().hasUnlimitedEnergy()).toBe(true);
      expect(useAppStore.getState().hasAiAccess()).toBe(false); // Founder does NOT have full AI Tycoon access
    });
  });

  describe('3. Paid Plan - Tycoon Tier', () => {
    it('links kid to Tycoon parent; kid inherits Tycoon tier, unlimited energy, and AI access', async () => {
      const parent = createMockUser({
        id: 'parent_tycoon_1',
        name: 'Elena Tycoon',
        username: 'elena_t',
        role: UserRole.PARENT,
        subscriptionTier: 'tycoon',
        subscriptionStatus: 'PREMIUM',
        billingCycle: 'YEARLY',
        referralCode: 'FAM-TYCN',
      });

      const kid = createMockUser({
        id: 'kid_3',
        name: 'Noah Kid',
        username: 'noah_k',
        role: UserRole.KID,
        subscriptionTier: 'intern',
        subscriptionStatus: 'FREE',
        parentId: undefined,
      });

      localStorage.setItem(`family_invite_code_${parent.id}`, 'FAM-TYCN');
      localStorage.setItem(
        'profits_patrol_all_profiles',
        JSON.stringify([
          { id: parent.id, invite_code: 'FAM-TYCN', role: 'parent', subscription_tier: 'tycoon', subscription_status: 'PREMIUM' },
          { id: kid.id, role: 'kid', subscription_tier: 'intern', subscription_status: 'FREE' },
        ])
      );

      useAppStore.setState({
        user: kid,
        users: [parent, kid],
      });

      render(
        <MemoryRouter>
          <FamilyManager />
        </MemoryRouter>
      );

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'FAM-TYCN' } });

      const linkButton = screen.getByRole('button', { name: /LINK|ربط/i });
      await act(async () => {
        fireEvent.click(linkButton);
      });

      const state = useAppStore.getState();
      const updatedKid = state.users.find(u => u.id === kid.id);
      expect(updatedKid?.parentId).toBe(parent.id);
      expect(updatedKid?.subscriptionTier).toBe('tycoon');
      expect(updatedKid?.subscriptionStatus).toBe('PREMIUM');

      // Verify Tycoon perks for child
      useAppStore.setState({ user: updatedKid });
      expect(useAppStore.getState().hasUnlimitedEnergy()).toBe(true);
      expect(useAppStore.getState().hasAiAccess()).toBe(true);
    });
  });

  describe('4. Dynamic Subscription Cascade (Parent Upgrades & Downgrades)', () => {
    it('cascades Free -> Founder -> Tycoon -> Free to linked child automatically', () => {
      const parent = createMockUser({
        id: 'parent_dyn_1',
        name: 'Parent Dyn',
        role: UserRole.PARENT,
        subscriptionTier: 'intern',
        subscriptionStatus: 'FREE',
      });

      const kid = createMockUser({
        id: 'kid_dyn_1',
        name: 'Kid Dyn',
        role: UserRole.KID,
        parentId: parent.id,
        subscriptionTier: 'intern',
        subscriptionStatus: 'FREE',
      });

      useAppStore.setState({
        user: parent,
        users: [parent, kid],
      });

      // Step A: Initial state is Free
      let currentKid = useAppStore.getState().users.find(u => u.id === kid.id);
      expect(currentKid?.subscriptionTier).toBe('intern');
      expect(currentKid?.subscriptionStatus).toBe('FREE');

      // Step B: Parent upgrades to Founder
      act(() => {
        useAppStore.getState().upgradeSubscription('founder');
      });

      currentKid = useAppStore.getState().users.find(u => u.id === kid.id);
      expect(useAppStore.getState().user?.subscriptionTier).toBe('founder');
      expect(currentKid?.subscriptionTier).toBe('founder');
      expect(currentKid?.subscriptionStatus).toBe('PREMIUM');

      // Step C: Parent upgrades to Tycoon
      act(() => {
        useAppStore.getState().upgradeSubscription('tycoon');
      });

      currentKid = useAppStore.getState().users.find(u => u.id === kid.id);
      expect(useAppStore.getState().user?.subscriptionTier).toBe('tycoon');
      expect(currentKid?.subscriptionTier).toBe('tycoon');
      expect(currentKid?.subscriptionStatus).toBe('PREMIUM');

      // Step D: Parent cancels subscription (falls back to intern)
      act(() => {
        useAppStore.getState().upgradeSubscription('intern');
      });

      currentKid = useAppStore.getState().users.find(u => u.id === kid.id);
      expect(useAppStore.getState().user?.subscriptionTier).toBe('intern');
      expect(currentKid?.subscriptionTier).toBe('intern');
      expect(currentKid?.subscriptionStatus).toBe('FREE');
    });
  });

  describe('5. Multiple Children Linking to One Parent', () => {
    it('shares parent plan with all linked children and allows parent switching', () => {
      const parent = createMockUser({
        id: 'parent_multi_1',
        name: 'Parent Multi',
        role: UserRole.PARENT,
        subscriptionTier: 'tycoon',
        subscriptionStatus: 'PREMIUM',
      });

      const childA = createMockUser({
        id: 'child_a',
        name: 'Child A',
        role: UserRole.KID,
        parentId: parent.id,
        subscriptionTier: 'tycoon',
        subscriptionStatus: 'PREMIUM',
        xp: 500,
      });

      const childB = createMockUser({
        id: 'child_b',
        name: 'Child B',
        role: UserRole.KID,
        parentId: parent.id,
        subscriptionTier: 'tycoon',
        subscriptionStatus: 'PREMIUM',
        xp: 1200,
      });

      useAppStore.setState({
        user: parent,
        users: [parent, childA, childB],
      });

      const linked = getLinkedChildren(parent.id, useAppStore.getState().users);
      expect(linked.length).toBe(2);
      expect(linked.map(c => c.name)).toEqual(['Child A', 'Child B']);

      // Subject resolution with explicit linkedChildId vs default first child
      expect(resolveSubject(parent, [parent, childA, childB]).id).toBe(childA.id);

      const parentWithActiveB = { ...parent, linkedChildId: childB.id };
      expect(resolveSubject(parentWithActiveB, [parent, childA, childB]).id).toBe(childB.id);
    });
  });

  describe('6. Persistence Adapters Subscription Inheritance Mapping', () => {
    it('SupabaseAdapter correctly inherits Free, Founder, and Tycoon tiers for child', () => {
      const parentRowFree = { id: 'p_free', role: 'parent', subscription_tier: 'intern', subscription_status: 'FREE' };
      const parentRowFounder = { id: 'p_founder', role: 'parent', subscription_tier: 'founder', subscription_status: 'active', billing_cycle: 'yearly' };
      const parentRowTycoon = { id: 'p_tycoon', role: 'parent', subscription_tier: 'tycoon', subscription_status: 'premium', billing_cycle: 'monthly' };

      const childRowFree = { id: 'c_1', role: 'kid', parent_id: 'p_free', subscription_tier: 'intern', subscription_status: 'FREE' };
      const childRowFounder = { id: 'c_2', role: 'kid', parent_id: 'p_founder', subscription_tier: 'intern', subscription_status: 'FREE' };
      const childRowTycoon = { id: 'c_3', role: 'kid', parent_id: 'p_tycoon', subscription_tier: 'intern', subscription_status: 'FREE' };

      const mappedFreeKid = supabaseAdapter.mapProfileToUser(childRowFree, [parentRowFree, childRowFree]);
      expect(mappedFreeKid.subscriptionTier).toBe('intern');
      expect(mappedFreeKid.subscriptionStatus).toBe('FREE');

      const mappedFounderKid = supabaseAdapter.mapProfileToUser(childRowFounder, [parentRowFounder, childRowFounder]);
      expect(mappedFounderKid.subscriptionTier).toBe('founder');
      expect(mappedFounderKid.subscriptionStatus).toBe('PREMIUM');
      expect(mappedFounderKid.billingCycle).toBe('yearly');

      const mappedTycoonKid = supabaseAdapter.mapProfileToUser(childRowTycoon, [parentRowTycoon, childRowTycoon]);
      expect(mappedTycoonKid.subscriptionTier).toBe('tycoon');
      expect(mappedTycoonKid.subscriptionStatus).toBe('PREMIUM');
      expect(mappedTycoonKid.billingCycle).toBe('monthly');
    });

    it('LaravelAdapter correctly inherits Free, Founder, and Tycoon tiers for child', () => {
      const parentRowFree = { id: 'lp_free', role: 'parent', subscription_tier: 'intern', subscription_status: 'FREE' };
      const parentRowFounder = { id: 'lp_founder', role: 'parent', subscription_tier: 'founder', subscription_status: 'active', billing_cycle: 'yearly' };
      const parentRowTycoon = { id: 'lp_tycoon', role: 'parent', subscription_tier: 'tycoon', subscription_status: 'premium', billing_cycle: 'monthly' };

      const childRowFree = { id: 'lc_1', role: 'kid', parent_id: 'lp_free', subscription_tier: 'intern', subscription_status: 'FREE' };
      const childRowFounder = { id: 'lc_2', role: 'kid', parent_id: 'lp_founder', subscription_tier: 'intern', subscription_status: 'FREE' };
      const childRowTycoon = { id: 'lc_3', role: 'kid', parent_id: 'lp_tycoon', subscription_tier: 'intern', subscription_status: 'FREE' };

      const mappedFreeKid = laravelAdapter.mapProfileToUser(childRowFree, [parentRowFree, childRowFree]);
      expect(mappedFreeKid.subscriptionTier).toBe('intern');
      expect(mappedFreeKid.subscriptionStatus).toBe('FREE');

      const mappedFounderKid = laravelAdapter.mapProfileToUser(childRowFounder, [parentRowFounder, childRowFounder]);
      expect(mappedFounderKid.subscriptionTier).toBe('founder');
      expect(mappedFounderKid.subscriptionStatus).toBe('PREMIUM');

      const mappedTycoonKid = laravelAdapter.mapProfileToUser(childRowTycoon, [parentRowTycoon, childRowTycoon]);
      expect(mappedTycoonKid.subscriptionTier).toBe('tycoon');
      expect(mappedTycoonKid.subscriptionStatus).toBe('PREMIUM');
    });
  });
});
