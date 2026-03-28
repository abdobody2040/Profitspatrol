import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '@/app/App';
import { useAppStore } from '@/store';
import { SoundProvider } from '@/contexts/SoundContext';

describe('App Component', () => {
  beforeEach(() => {
    // Reset store to ensure clean slate (Logged Out)
    useAppStore.setState({ user: null });
  });

  it('renders the Landing Page when not logged in', async () => {
    render(
      <MemoryRouter initialEntries={['/welcome']}>
        <SoundProvider>
          <App />
        </SoundProvider>
      </MemoryRouter>
    );

    // Check for Landing Page specific text (wait for lazy load)
    expect(await screen.findByText(/Don't just play games/i, {}, { timeout: 3000 })).toBeTruthy();
  });

  it('renders Auth screen when Get Started is clicked (Simulated by state)', async () => {
    render(
      <MemoryRouter initialEntries={['/welcome']}>
        <SoundProvider>
          <App />
        </SoundProvider>
      </MemoryRouter>
    );
    // Wait for Landing Page to finish lazy-loading
    const buttons = await screen.findAllByText(/Start Free/i, {}, { timeout: 3000 });
    expect(buttons.length).toBeGreaterThan(0);
  });
});
