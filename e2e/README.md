# E2E Testing Suite - KidCapHQ

Comprehensive end-to-end testing suite that tests **every button, action, and icon** in the application.

## Setup

### Install Dependencies

```bash
npm install -D @playwright/test
npx playwright install chromium
```

## Running Tests

### Run All Tests

```bash
npx playwright test
```

### Run Specific Test File

```bash
npx playwright test gigs
npx playwright test navigation
npx playwright test hq
npx playwright test dashboard
```

### Run with UI Mode (Interactive)

```bash
npx playwright test --ui
```

### Run in Headed Mode (See Browser)

```bash
npx playwright test --headed
```

### Run Specific Browser

```bash
npx playwright test --project=chromium
```

## View Test Results

### HTML Report

```bash
npx playwright show-report
```

### View Traces (for failed tests)

```bash
npx playwright show-trace trace.zip
```

## Test Coverage

### ✅ Navigation Tests
- All sidebar menu items (10+ routes)
- Mobile menu toggle
- Browser back/forward navigation

### ✅ Gig Central Tests (12 gigs, 4 minigame types)

**TAP Minigames** (4 gigs):
- Dog Walker
- Grocery Bagger
- Lemonade Stand
- Social Media Manager

**SWIPE Minigames** (3 gigs):
- Car Wash Pro
- Bike Repair
- App Tester

**RHYTHM Minigames** (2 gigs):
- Lawn Master
- Event Photographer

**QUIZ Minigames** (3 gigs):
- Pet Sitter
- Tutor Helper
- Coding Tutor

### ✅ HQ Builder Tests
- Isometric room display
- Character avatar
- Inventory management
- Furniture placement
- Furniture rotation
- Furniture selling
- Furniture shop

### ✅ Dashboard Tests
- User stats display
- Navigation menu
- Profile info
- Quick actions

## Test Structure

```
e2e/
├── tests/
│   ├── utils/
│   │   └── helpers.ts          # Reusable test utilities
│   ├── navigation/
│   │   └── sidebar.spec.ts     # Navigation tests
│   ├── gigs/
│   │   └── gig-central.spec.ts # All gig and minigame tests
│   ├── hq/
│   │   └── hq-builder.spec.ts  # HQ Builder tests
│   └── dashboard/
│       └── dashboard.spec.ts   # Dashboard tests
└── playwright.config.ts         # Playwright configuration
```

## Helper Utilities

Located in `e2e/tests/utils/helpers.ts`:

- `login(page, email, password)` - Login to the app
- `navigateTo(page, route)` - Navigate to a route
- `clickButton(page, selector)` - Click a button
- `fillForm(page, data)` - Fill form fields
- `waitForElement(page, selector)` - Wait for element
- `assertVisible(page, selector)` - Assert element is visible
- `startGig(page, gigName)` - Start a specific gig
- And more...

## Configuration

Edit `playwright.config.ts` to customize:
- Base URL
- Browsers to test
- Parallel execution
- Screenshots/videos
- Timeouts

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Debugging Tests

### Debug Mode

```bash
npx playwright test --debug
```

### Pause Test

```typescript
await page.pause(); // Add this line in your test
```

### Screenshots

Screenshots are automatically taken on failure and saved to `test-results/`

## Best Practices

1. **Use data-testid**: Add `data-testid` attributes to important elements
2. **Wait for elements**: Use `waitForElement()` instead of fixed timeouts
3. **Isolate tests**: Each test should be independent
4. **Clean up**: Reset state between tests
5. **Meaningful names**: Use descriptive test names

## Adding New Tests

1. Create a new `.spec.ts` file in appropriate directory
2. Import helpers from `../utils/helpers`
3. Use `test.describe()` to group related tests
4. Use `test.beforeEach()` for setup
5. Write assertions with `expect()`

Example:

```typescript
import { test, expect } from '@playwright/test';
import { login, navigateTo } from '../utils/helpers';

test.describe('My Feature', () => {
    test.beforeEach(async ({ page }) => {
        await login(page);
    });

    test('should do something', async ({ page }) => {
        await navigateTo(page, '/my-route');
        await expect(page.locator('text=Hello')).toBeVisible();
    });
});
```

## Troubleshooting

### Tests timing out
- Increase timeout in `playwright.config.ts`
- Check if dev server is running
- Verify network requests aren't blocked

### Elements not found
- Add `data-testid` attributes
- Use more specific selectors
- Wait for page load with `waitForPageLoad()`

### Flaky tests
- Use proper waits instead of `waitForTimeout()`
- Check for race conditions
- Ensure proper test isolation

## Coverage Report

Run tests with coverage:

```bash
npx playwright test --reporter=html
```

View report:

```bash
npx playwright show-report
```

## Next Steps

- [ ] Add authentication tests
- [ ] Add education feature tests
- [ ] Add social feature tests
- [ ] Add admin panel tests
- [ ] Increase coverage to 90%+
- [ ] Set up CI/CD pipeline
