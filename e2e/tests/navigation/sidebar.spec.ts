import { test, expect } from '@playwright/test';
import { login, clickSidebarItem, assertVisible, waitForPageLoad } from '../utils/helpers';

test.describe('Navigation Tests', () => {
    test.beforeEach(async ({ page }) => {
        await login(page);
    });

    test('should navigate to all main menu items', async ({ page }) => {
        const menuItems = [
            'nav-adventure-map',
            'nav-assignments',
            'nav-arcade',
            'nav-debate-dojo',
            'nav-library',
            'nav-videos',
            'nav-gig-central',
            'nav-hq'
        ];

        for (const testId of menuItems) {
            await clickSidebarItem(page, testId);
            await waitForPageLoad(page);

            // Verify page loaded
            await expect(page).not.toHaveURL('/dashboard');
        }
    });

    test('should toggle sidebar on mobile', async ({ page }) => {
        // Set mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });

        // Check if menu button exists
        const menuButton = page.locator('[data-testid="mobile-menu-toggle"]');
        if (await menuButton.isVisible()) {
            await menuButton.click();
            await assertVisible(page, 'nav');
        }
    });

    test('should navigate using browser back/forward', async ({ page }) => {
        // Start from dashboard to ensure predictable navigation
        await page.goto('/dashboard');
        await waitForPageLoad(page);

        await clickSidebarItem(page, 'nav-gig-central');
        await page.goBack();
        await expect(page).toHaveURL(/dashboard/);

        await page.goForward();
        await expect(page).toHaveURL(/side-hustle/);
    });
});
