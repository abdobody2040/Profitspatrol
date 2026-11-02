
import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '@/app/App';
import { useAppStore } from '@/store';
import { SoundProvider } from '@/contexts/SoundContext';
import i18n from '@/lib/i18n';
import { INITIAL_LIBRARY } from '@/features/library/data/libraryBooks';
import { UserRole, User } from '@/types';

// Helper to reset store
const resetStore = async () => {
  useAppStore.setState({
    user: null,
    users: [],
    isAuthLoading: false,
    library: INITIAL_LIBRARY,
    showLevelUpModal: false,
    levelUpData: null,
  });
  // Reset language
  await i18n.changeLanguage('en');
  document.documentElement.dir = 'ltr';
  document.documentElement.lang = 'en';
};

const createTestUser = (overrides: Partial<User> = {}): User => ({
  id: 'test-user',
  name: 'Test Kid',
  username: 'testkid',
  email: 'test@test.com',
  role: UserRole.KID,
  xp: 0,
  level: 1,
  ppTokens: 100,
  subscriptionTier: 'intern',
  subscriptionStatus: 'FREE',
  hqLevel: 'hq_garage',
  streak: 1,
  lastActivityDate: new Date().toISOString(),
  currentModuleId: 'mod_1',
  completedLessonIds: [],
  readBookIds: [],
  badges: [],
  inventory: [],
  settings: { dailyGoalMinutes: 15, soundEnabled: false, musicEnabled: false, themeColor: 'green', themeMode: 'light' },
  unlockedSkills: [],
  portfolio: [],
  equippedItems: [],
  placedItems: [],
  energy: 5,
  lastEnergyRefill: Date.now(),
  properties: [],
  ...overrides
} as User);

describe('Full App Scan: User Journeys', () => {
  beforeEach(async () => {
    await resetStore();
    // Use real timers (default)

    // Simulate Desktop Resolution for Navbar
    window.innerWidth = 1024;
    window.dispatchEvent(new Event('resize'));
  });



  // --- Journey 1: The New Kid ---
  it('The New Kid: User starts correctly initialized', async () => {
    // 1. Render App (Start on Landing)
    // 2. Register and Login BEFORE render to start in logged-in state
    act(() => {
      useAppStore.setState({ 
        user: createTestUser({ name: "New Kid" }),
        isAuthLoading: false 
      });
    });

    // Move render here to ensure it picks up the logged-in state
    render(
      <MemoryRouter initialEntries={['/map']}>
        <SoundProvider>
          <App />
        </SoundProvider>
      </MemoryRouter>
    );

    const user = useAppStore.getState().user;

    // 3. Verify Stats
    expect(user).toBeTruthy();
    expect(user?.xp).toBe(0);
    expect(user?.level).toBe(1);
    expect(user?.ppTokens).toBe(100); // 100 is the sign up bonus in store.ts
    expect(user?.subscriptionTier).toBe('intern');
    expect(user?.hqLevel).toBe('hq_garage');

    // 4. Verify UI Elements
    // Need to re-render to catch state update? `render` was called before login. 
    // React testing library `render` result should update if store updates trigger re-render.
    // However, App component uses store. 
    // Let's re-render to be safe or rely on observer. 
    // Zustand hooks should trigger re-render.

    await waitFor(() => {
      // Adventure Map appears in both Desktop and Mobile (hidden via CSS but present in DOM)
      const maps = screen.getAllByText(/Adventure Map/i);
      expect(maps.length).toBeGreaterThan(0);

      // "Lvl 1" is the actual text in en.ts
      const levels = screen.getAllByText(/Lvl 1/i);
      expect(levels.length).toBeGreaterThan(0);
    }, { timeout: 5000 });
  });

  // --- Journey 2: The Arabic User ---
  it('The Arabic User: Switch language and verify direction', async () => {
    // Login first
    act(() => {
      useAppStore.setState({ 
        user: createTestUser({ name: "Arabic Kid" }),
        isAuthLoading: false
      });
    });

    render(
      <MemoryRouter initialEntries={['/map']}>
        <SoundProvider>
          <App />
        </SoundProvider>
      </MemoryRouter>
    );

    // Switch Language
    act(() => {
      i18n.changeLanguage('ar');
    });

    // Verify Document Direction
    await waitFor(() => {
      expect(document.documentElement.dir).toBe('rtl');
      expect(document.documentElement.lang).toBe('ar');
    });

    // Verify Text Change (Adventure Map -> خارطة المغامرة)
    // Adventure Map appears in both Desktop and Mobile (hidden via CSS but present in DOM)
    await waitFor(() => {
      // Use more flexible matching for Arabic text
      const matches = screen.queryAllByText((content) => content.includes('خارطة') || content.includes('المغامرة'));
      expect(matches.length).toBeGreaterThan(0);
    });
  });

  // --- Journey 3: The Bookworm ---
  it('The Bookworm: Reads a book and earns XP', async () => {
    // Login
    act(() => {
      useAppStore.setState({ 
        user: createTestUser({ name: "Book Kid" }),
        isAuthLoading: false
      });
    });

    const initialXp = useAppStore.getState().user?.xp || 0;

    render(
      <MemoryRouter initialEntries={['/library']}>
        <SoundProvider>
          <App />
        </SoundProvider>
      </MemoryRouter>
    );

    // 1. Wait for Library title to confirm we are there
    await waitFor(() => {
      expect(screen.getAllByText(/Library/i).length).toBeGreaterThan(0);
    }, { timeout: 5000 });

    // 2. Find "Think and Grow Rich" (Classic)
    const bookTitle = "Think and Grow Rich";
    await waitFor(() => {
      expect(screen.getByText(bookTitle)).toBeInTheDocument();
    });

    // 4. Click "Read Summary"
    // Since there are multiple "Read Summary" buttons, we will click the first one.
    const readButtons = screen.getAllByText(/Read Summary/i);
    fireEvent.click(readButtons[0]);

    // 4. Verify Modal Opens
    await waitFor(() => {
      expect(screen.getByText(/Key Lessons/i)).toBeInTheDocument();
    });

    // 5. Verify XP Increase
    // BookLibrary.tsx was updated to award 15 XP.
    const newXp = useAppStore.getState().user?.xp;
    expect(newXp).toBeGreaterThan(initialXp);
  });

  // --- Journey 4: The Upgrade ---
  it('The Upgrade: Changes tier to Founder and Energy to Infinite', async () => {
    // Directly seed the store with a logged-in Intern user, then upgrade.
    // We bypass async auth (registerUser/loginWithCredentials) to keep the unit test synchronous.
    const internUser = createTestUser({ subscriptionTier: 'intern', subscriptionStatus: 'FREE' });
    act(() => {
      useAppStore.setState({ 
        user: internUser, 
        users: [internUser],
        isAuthLoading: false
      });
      // Force upgrade to Founder
      useAppStore.getState().upgradeSubscription('founder');
    });

    render(
      <MemoryRouter initialEntries={['/map']}>
        <SoundProvider>
          <App />
        </SoundProvider>
      </MemoryRouter>
    );

    const user = useAppStore.getState().user;
    expect(user?.subscriptionTier).toBe('founder');

    // Wait for Map to ensure redirect happened
    await waitFor(() => {
      expect(screen.getAllByText(/Adventure Map/i).length).toBeGreaterThan(0);
    }, { timeout: 5000 });

    // Verify Infinite Energy logic via Store Helper
    const isUnlimited = useAppStore.getState().hasUnlimitedEnergy();
    expect(isUnlimited).toBe(true);

    // Verify UI
    await waitFor(() => {
      // The EnergyBar shows "Unlimited" text and Infinity icon when user is Founder
      const unlimitedTexts = screen.getAllByText(/Unlimited/i);
      expect(unlimitedTexts.length).toBeGreaterThan(0);

      // Ensure countdown is NOT present
      const countdown = screen.queryByText(/\+1 in/i);
      expect(countdown).not.toBeInTheDocument();
    });
  });

});
