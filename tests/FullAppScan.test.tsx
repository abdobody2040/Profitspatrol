
import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import App from '@/app/App';
import { useAppStore } from '@/store';
import { SoundProvider } from '@/contexts/SoundContext';
import i18n from '@/lib/i18n';
import { INITIAL_LIBRARY } from '@/features/library/data/libraryBooks';
import { UserRole } from '@/types';

// Mock PWA
vi.mock("virtual:pwa-register/react", () => ({
  useRegisterSW: () => ({
    needRefresh: [false, vi.fn()],
    updateServiceWorker: vi.fn()
  })
}));

// Helper to reset store
const resetStore = () => {
  useAppStore.setState({
    user: null,
    users: [],
    library: INITIAL_LIBRARY,
    showLevelUpModal: false,
    levelUpData: null,
  });
  // Reset language
  i18n.changeLanguage('en');
  document.documentElement.dir = 'ltr';
};

describe('Full App Scan: User Journeys', () => {
  beforeEach(() => {
    resetStore();
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
      useAppStore.getState().registerUser("New Kid", "newkid", "123", UserRole.KID);
      useAppStore.getState().loginWithCredentials("newkid", "123");
    });

    // Move render here to ensure it picks up the logged-in state
    render(
      <SoundProvider>
        <App />
      </SoundProvider>
    );

    const user = useAppStore.getState().user;

    // 3. Verify Stats
    expect(user).toBeTruthy();
    expect(user?.xp).toBe(0);
    expect(user?.level).toBe(1);
    expect(user?.bizCoins).toBe(100); // 100 is the sign up bonus in store.ts
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
    });
  });

  // --- Journey 2: The Arabic User ---
  it('The Arabic User: Switch language and verify direction', async () => {
    // Login first
    act(() => {
      useAppStore.getState().registerUser("Arab Kid", "akid", "123", UserRole.KID);
      useAppStore.getState().loginWithCredentials("akid", "123");
    });

    render(
      <SoundProvider>
        <App />
      </SoundProvider>
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

    // Verify Text Change (Adventure Map -> خريطة المغامرة)
    // Adventure Map appears in both Desktop and Mobile (hidden via CSS but present in DOM)
    await waitFor(() => {
      expect(screen.getAllByText(/خريطة المغامرة/i).length).toBeGreaterThan(0);
    });
  });

  // --- Journey 3: The Bookworm ---
  it('The Bookworm: Reads a book and earns XP', async () => {
    // Login
    act(() => {
      useAppStore.getState().registerUser("Book Kid", "bkid", "123", UserRole.KID);
      useAppStore.getState().loginWithCredentials("bkid", "123");
    });

    const initialXp = useAppStore.getState().user?.xp || 0;

    render(
      <SoundProvider>
        <App />
      </SoundProvider>
    );

    // 1. Navigate to Library
    // There are multiple "Library" texts (Nav item, potential title if visible). 
    // We target the explicit nav item or use getAll.
    const libraryNav = screen.getAllByText(/Library/i)[0]; // Assuming Menu is first
    fireEvent.click(libraryNav);

    // 2. Find "Rich Dad Poor Dad" (or any book, using Title from INITIAL_LIBRARY)
    const bookTitle = "Rich Dad Poor Dad";
    await waitFor(() => {
      expect(screen.getByText(bookTitle)).toBeInTheDocument();
    });

    // 3. Click "Read Summary"
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
    // Login as Intern first to simulate upgrade flow or start as Founder
    // The test wants to verify "Changes tier", implying a transition or just correct state.
    // Let's just start as Founder to verify the Founder State is correct (Infinite Energy)
    // mirroring the logic of "User starts correctly initialized".

    act(() => {
      useAppStore.getState().registerUser("Founder Kid", "fkid", "123", UserRole.KID);
      useAppStore.getState().loginWithCredentials("fkid", "123");
      // Force upgrade
      useAppStore.getState().upgradeSubscription('founder');
    });

    render(
      <SoundProvider>
        <App />
      </SoundProvider>
    );

    const user = useAppStore.getState().user;
    expect(user?.subscriptionTier).toBe('founder');

    // Verify Infinite Energy logic via Hook or Store Helper
    const isUnlimited = useAppStore.getState().hasUnlimitedEnergy();
    expect(isUnlimited).toBe(true);

    // Verify UI
    await waitFor(() => {
      // The EnergyBar shows "Unlimited" text and Infinity icon when unlimited
      const unlimitedTexts = screen.getAllByText(/Unlimited/i);
      expect(unlimitedTexts.length).toBeGreaterThan(0);

      // Ensure countdown is NOT present
      const countdown = screen.queryByText(/\+1 in/i);
      expect(countdown).not.toBeInTheDocument();
    });
  });

});
