import { test as base, Browser, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { AUTH_FILES } from './testData';

export type TestFixtures = {
  adminPage: Page;
  readOnlyPage: Page;
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
};

export const test = base.extend<TestFixtures>({
  adminPage: async ({ browser }: { browser: Browser }, use) => {
    const context = await browser.newContext({ storageState: AUTH_FILES.admin });
    const page = await context.newPage();
    await page.goto('/bank/dashboard');
    await use(page);
    await context.close();
  },

  readOnlyPage: async ({ browser }: { browser: Browser }, use) => {
    const context = await browser.newContext({ storageState: AUTH_FILES.viewer });
    const page = await context.newPage();
    await page.goto('/bank/dashboard');
    await use(page);
    await context.close();
  },

  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
});

export { expect } from '@playwright/test';
