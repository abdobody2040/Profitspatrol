
import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useAppStore } from '@/store';
import { useEducationStore } from '@/store/educationStore';
import { User, UserRole } from '@/types';
import BookLibrary from '@/features/library/components/BookLibrary';
import KidMap from '@/features/hq/components/KidMap';
import Layout from '@/components/layout/Layout';
import { INITIAL_LIBRARY } from '@/features/library/data/libraryBooks';
import { ALL_LESSONS } from '@/features/education/data/curriculum';

vi.mock('@/services/geminiService', () => ({
  chatWithOllie: vi.fn(),
  getOwlyExplanation: vi.fn(),
}));

const createMockUser = (tier: any): User => ({
  id: 'test_user',
  name: 'Test Kid',
  username: 'test',
  role: UserRole.KID,
  xp: 0,
  level: 1,
  streak: 1,
  lastActivityDate: '2024-01-01',
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
  energy: 5,
  lastEnergyRefill: Date.now()
});

describe('Content Gating & Tiers', () => {
  beforeEach(() => {
    useAppStore.setState({ user: null, library: INITIAL_LIBRARY });
    useEducationStore.setState({ lessons: ALL_LESSONS });
  });

  describe('Intern (free tier)', () => {
    it('shows premium lock overlays in book library', () => {
      useAppStore.setState({ user: createMockUser('intern') });
      render(<MemoryRouter><BookLibrary /></MemoryRouter>);
      expect(screen.getAllByText(/Premium Only|للمشتركين فقط/i).length).toBeGreaterThan(0);
    });

    it('shows premium lock labels on restricted map modules', () => {
      useAppStore.setState({ user: createMockUser('intern') });
      render(<MemoryRouter><KidMap onStartLesson={() => {}} /></MemoryRouter>);
      expect(screen.getAllByText(/Premium Only|للمشتركين فقط/i).length).toBeGreaterThan(0);
    });

    it('shows intern tier badge in layout', () => {
      useAppStore.setState({ user: createMockUser('intern') });
      render(
        <MemoryRouter>
          <Layout activeTab="games" onNavigate={() => {}}>
            <div>Child</div>
          </Layout>
        </MemoryRouter>
      );
      expect(screen.getAllByText(/INTERN/i).length).toBeGreaterThan(0);
    });
  });

  describe('Founder (premium tier)', () => {
    it('shows no premium lock overlays in book library', () => {
      useAppStore.setState({ user: createMockUser('founder') });
      render(<MemoryRouter><BookLibrary /></MemoryRouter>);
      expect(screen.queryByText(/Premium Only|للمشتركين فقط/i)).not.toBeInTheDocument();
    });

    it('shows no premium lock labels on the map', () => {
      useAppStore.setState({ user: createMockUser('founder') });
      render(<MemoryRouter><KidMap onStartLesson={() => {}} /></MemoryRouter>);
      expect(screen.queryByText(/Premium Only|للمشتركين فقط/i)).not.toBeInTheDocument();
    });

    it('hides ad banner in layout', () => {
      useAppStore.setState({ user: createMockUser('founder') });
      render(
        <MemoryRouter>
          <Layout activeTab="map" onNavigate={() => {}}>
            <div>Child</div>
          </Layout>
        </MemoryRouter>
      );
      expect(screen.queryByText(/Ads support free learning/i)).not.toBeInTheDocument();
    });
  });
});
