import { Page } from '@playwright/test';

/**
 * Login helper - logs in with test credentials
 */
export async function login(page: Page) {
    // Check if already logged in
    const isLoggedIn = await page.locator('text=Dashboard').or(page.locator('text=Adventure Map')).isVisible({ timeout: 2000 }).catch(() => false);

    if (isLoggedIn) {
        console.log('Already logged in');
        return;
    }

    await page.goto('/login');
    await page.fill('input[type="text"]', 'leo');
    await page.fill('input[type="password"]', '123');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
}

/**
 * Navigate to a specific route
 */
export async function navigateTo(page: Page, path: string) {
    await page.goto(path);
    await waitForPageLoad(page);
}

/**
 * Wait for page to load
 */
export async function waitForPageLoad(page: Page) {
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
}

/**
 * Assert element is visible
 */
export async function assertVisible(page: Page, selector: string) {
    await page.waitForSelector(selector, { state: 'visible', timeout: 5000 });
}

/**
 * Click a button by text
 */
export async function clickButton(page: Page, text: string) {
    await page.click(`button:has-text("${text}")`);
    await waitForPageLoad(page);
}

/**
 * Get text content of an element
 */
export async function getTextContent(page: Page, selector: string): Promise<string> {
    return await page.locator(selector).textContent() || '';
}

/**
 * Click sidebar navigation item by test ID
 */
export async function clickSidebarItem(page: Page, testId: string) {
    // Use data-testid for reliable selection
    const button = page.locator(`[data-testid="${testId}"]`);
    await button.waitFor({ state: 'visible', timeout: 10000 });
    await button.click();
    await waitForPageLoad(page);
}

/**
 * Start a gig by name
 */
export async function startGig(page: Page, gigName: string) {
    const gigCard = page.locator('[data-testid="gig-card"]').filter({ hasText: gigName });
    await gigCard.waitFor({ state: 'visible', timeout: 5000 });
    await gigCard.click();
    await page.waitForTimeout(1000);
}

/**
 * Wait for element to be visible
 */
export async function waitForElement(page: Page, selector: string, timeout: number = 5000) {
    await page.waitForSelector(selector, { state: 'visible', timeout });
}

/**
 * Count elements matching selector
 */
export async function countElements(page: Page, selector: string): Promise<number> {
    return await page.locator(selector).count();
}