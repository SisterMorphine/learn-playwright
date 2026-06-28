import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { AccountsPage } from '../pages/AccountsPage';

export type TestFixtures = {
  adminDashboardPage: Page;
  readOnlyDashboardPage: Page;
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  adminAccountsPage: Page;
};

export const test = base.extend<TestFixtures>({
  adminDashboardPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('admin', 'admin123');
    await new DashboardPage(page).pageLoaded();
    await use(page);
  },

  readOnlyDashboardPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('viewer', 'viewer123');
    await new DashboardPage(page).pageLoaded();
    await use(page);
  },

  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },

 adminAccountsPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('admin', 'admin123');
    await new DashboardPage(page).pageLoaded();
    await page.goto('/bank/accounts');
    await use(page);
  },
  
});

export { expect } from '@playwright/test';
