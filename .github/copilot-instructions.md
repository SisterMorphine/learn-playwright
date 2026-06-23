# Copilot Instructions for Learn Playwright

## Project Overview

This is a **learning project** for Playwright test automation, targeting **QA Playground's Bank Demo application**. The goal is to practice UI automation fundamentals through realistic scenarios with proper architecture and patterns.

**Key characteristics:** 
- Single test application (qaplayground.com/bank)
- Multi-browser testing (Chromium, Firefox, WebKit)
- HTML reporter with parallel execution
- Learning-focused, not production-grade

## Architecture & Patterns

### Page Object Model (POM)
All page interactions are encapsulated in page classes under `pages/`:
- **LoginPage.ts**: Login form interaction (username/password inputs, login button)
- **DashboardPage.ts**: Dashboard verification (title visibility, URL validation)

**Pattern to follow when adding new pages:**
```typescript
// Use test IDs for stable selectors (page.getByTestId)
// Use semantic locators when available (page.getByRole)
// Separate navigation (goto) from actions (login)
// Include expectation methods to verify page state (expectLoaded)
```

### Test Organization
Tests live in `tests/` organized by feature:
- `e2e/`: Complete user flows (admin-login.spec.ts)
- `auth/`: Authentication scenarios
- `forms/`: Form interaction scenarios

## Essential Commands

| Command | Purpose |
|---------|---------|
| `npx playwright test` | Run all tests across all browsers (Chromium, Firefox, WebKit) |
| `npx playwright test --ui` | Run tests in interactive UI mode for debugging |
| `npx playwright test --debug` | Step through tests with Inspector tool |
| `npx playwright test tests/e2e/admin-login.spec.ts` | Run specific test file |
| `npx playwright show-report` | Open HTML report of last test run |

## Developer Conventions

### Selector Strategy (Priority Order)
1. **Test IDs** (`getByTestId`): Most stable, requires test ID attributes in HTML
2. **Semantic locators** (`getByRole`, `getByLabel`): Accessible and maintainable
3. **Text content** (`getByText`): For visible elements without IDs
4. **CSS/XPath**: Last resort, fragile

### Test Structure
- Use `test.describe()` for logical grouping
- Name tests descriptively: "Admin user can log in and access dashboard"
- Arrange-Act-Assert pattern implicit in Page Object methods
- No hardcoded waits; rely on Playwright's auto-waiting

### Page Object Patterns
- Constructor takes `Page` object and stores UI element locators
- Methods represent user actions (e.g., `login()`, `expectLoaded()`)
- Separate concerns: navigation (`goto()`) vs. interaction (`login()`)

## Configuration Details

**playwright.config.ts key settings:**
- **Tests directory**: `./tests` (TypeScript files auto-discovered)
- **Parallel execution**: Enabled by default (`fullyParallel: true`)
- **CI behavior**: Retries enabled (2), single worker, forbid test.only
- **Reporter**: HTML output (open with `npx playwright show-report`)
- **Trace collection**: On first retry for debugging failures
- **Browsers**: Chromium, Firefox, WebKit (mobile configs commented out)

## Utilities Patterns

The `utils/` folder contains reusable helper functions and test data. Examples include:

### Test Data Fixtures
```typescript
// utils/testData.ts
export const ADMIN_USER = {
  username: 'admin',
  password: 'admin123'
};

export const READ_ONLY_USER = {
  username: 'viewer',
  password: 'viewer123'
};

export const TEST_URLS = {
  login: 'https://qaplayground.com/bank',
  dashboard: 'https://qaplayground.com/bank/dashboard'
};
```

### Helper Functions
```typescript
// utils/helpers.ts
export async function loginAsAdmin(loginPage: LoginPage) {
  await loginPage.goto();
  await loginPage.login('admin', 'admin123');
}

export async function verifyDashboardAccess(page: Page, dashboardPage: DashboardPage) {
  await dashboardPage.expectLoaded();
}
```

**Guidelines for utils:**
- Extract repetitive test flows into reusable functions
- Store test data (credentials, URLs, fixtures) separately
- Keep functions focused and single-purpose
- Avoid over-abstracting; only create utils for patterns used 2+ times

## Adding New Tests

1. Create test file in appropriate `tests/` subdirectory
2. Import required Page Object classes
3. Use `test.describe()` and `test()` from `@playwright/test`
4. Instantiate Page Objects in test, call their methods
5. Create new Page Object in `pages/` if needed (follow LoginPage/DashboardPage patterns)

**Example workflow:**
```typescript
import { test } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { ADMIN_USER } from '../../utils/testData';

test.describe('Feature Name', () => {
  test('scenario description', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    
    await loginPage.goto();
    await loginPage.login(ADMIN_USER.username, ADMIN_USER.password);
    await dashboardPage.expectLoaded();
  });
});
```

## Testing Against QA Playground Bank

- **Base URL**: https://qaplayground.com/bank
- **Test user**: username: `admin`, password: `admin123`
- **Key pages**: Login form → Dashboard (protected route)
- **Concepts to practice**: Authentication flows, protected routes, role-based access

## Common Pitfalls to Avoid

- **Hardcoded waits** (`page.waitForTimeout`): Use locator waits instead
- **Fragile selectors**: Prefer test IDs over deep CSS/XPath
- **Over-parameterization**: Keep tests focused on single scenarios
- **Mixing concerns**: Don't put assertions in Page Objects, keep them in tests
