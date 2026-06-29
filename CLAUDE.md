# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Run all tests
npx playwright test

# Run a single spec file
npx playwright test tests/dashboard/dashboard.spec.ts

# Run a single test by name
npx playwright test tests/dashboard/dashboard.spec.ts --grep "TC-DASH-02"

# Run against a specific browser
npx playwright test --project=chromium

# Open the HTML report after a run
npx playwright show-report
```

## Application Under Test

**UI:** QA Playground Bank Demo at `https://qaplayground.com/bank`
- Built with Next.js and Radix UI component library
- Two roles: `admin` / `admin123` and `viewer` / `viewer123`
- `baseURL` is set in `playwright.config.ts` so tests use relative paths (e.g. `/bank/accounts`)

**API:** Cat Facts (`catfact.ninja`) and Cat API (`api.thecatapi.com`) — API key loaded from `.env` as `CAT_API_KEY`

## Architecture

### Fixture hierarchy (`utils/fixtures.ts`)

The custom `test` export chains fixtures so login logic lives in one place:

```
adminPage          ← logs in as admin, waits for dashboard
  ├── adminDashboardPage   ← passes adminPage through (use in dashboard tests)
  └── adminAccountsPage    ← navigates to /bank/accounts on top of adminPage
loginPage          ← navigates to login page only (for login spec tests)
```

Login tests (`tests/auth/login.spec.ts`) import from `@playwright/test` directly, not from `utils/fixtures`, because they need an unauthenticated page.

`auth.setup.ts` runs as a Playwright setup project and saves storage state to `playwright/.auth/` — but the Bank Demo does not persist auth in cookies/localStorage, so the saved state is not reused by the main fixtures. Auth happens fresh per test via the fixture chain above.

### Page Object Model (`pages/`)

All locators live in page classes. Tests must not use raw `page.getByTestId()` or `page.locator()` directly — go through the POM.

**Radix UI comboboxes** render as `<button role="combobox">`, not `<select>`. Use click-then-option:
```typescript
await page.getByTestId('filter-type-select').click();
await page.getByRole('option', { name: 'Savings' }).click();
```

**`role="alert"`** has a duplicate element injected by Next.js (`__next-route-announcer__`). Always use `getByTestId('login-alert')` instead of `getByRole('alert')` to avoid strict mode violations.

### Known app behaviours

- **Dashboard stat cards** run a count-up animation after data loads. `data-loading="false"` fires before the animation ends. Use `expect.poll` to read the value until it stops changing before asserting.
- **Accounts / skeleton rows** appear before real data. Wait for a real cell: `locator('td').filter({ hasText: /\$/ }).first().waitFor()`.
- **Pinned account drag items** have dynamic `data-testid` values (`draggable-account-{id}`). Select them with `locator('[draggable="true"]')` scoped to the drop zone.
- **New Transaction modal** has no trigger button on the transactions page. Open it by navigating to `/bank/transactions?action=new` — the same URL the dashboard "New Transaction" quick action uses. Radix UI calendar day buttons carry the full date in their aria-label so match by text content: `locator('button').filter({ hasText: /^28$/ })`.

### Selector priority

1. `getByRole` — preferred for interactive elements
2. `getByTestId` — for elements with `data-testid`
3. `getByText` / `getByLabel` — for text-driven elements
4. CSS selectors — avoid; only acceptable for `data-testid` partial matching when `getByTestId` cannot express the pattern

## playwright-cli

`playwright-cli` is available globally. Use it to inspect the live app before writing or debugging tests:
- Check real element structure, aria-labels, and data-testid values
- Observe dynamic behavior (animations, loading states, toasts)
- Diagnose flaky tests by watching what actually happens in the browser

Open with: `playwright-cli open https://qaplayground.com/bank` then log in as admin/admin123.