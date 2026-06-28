import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { AccountsPage } from '../pages/AccountsPage';

export type TestFixtures = {
  adminPage: Page;
  adminDashboardPage: Page;
  adminAccountsPage: Page;
  loginPage: LoginPage;
};

export const test = base.extend<TestFixtures>({
  // Base: logged in as admin, settled on the dashboard
  adminPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('admin', 'admin123');
    await new DashboardPage(page).pageLoaded();
    await use(page);
  },

  adminDashboardPage: async ({ adminPage }, use) => {
    await use(adminPage);
  },

  adminAccountsPage: async ({ adminPage }, use) => {
    await adminPage.goto('/bank/accounts');
    await use(adminPage);
  },

  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },
});

export { expect } from '@playwright/test';
