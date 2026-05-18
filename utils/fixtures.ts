import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

export type TestFixtures = {
  adminPage: Page;
  readOnlyPage: Page;
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
};

/**
 * Define custom fixtures for test setup
 */
export const test = base.extend<TestFixtures>({
  /**
   * Fixture: adminPage
   * Logs in with admin credentials and provides authenticated page
   */
  adminPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('admin', 'admin123');
    await new DashboardPage(page).expectLoaded();
    
    // Use the authenticated page in the test
    await use(page);
  },

  /**
   * Fixture: readOnlyPage
   * Logs in with read-only (viewer) credentials and provides authenticated page
   */
  readOnlyPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('viewer', 'viewer123');
    await new DashboardPage(page).expectLoaded();
    
    // Use the authenticated page in the test
    await use(page);
  },

  /**
   * Fixture: loginPage
   * Provides a fresh LoginPage instance for direct interaction
   */
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },

  /**
   * Fixture: dashboardPage
   * Provides a DashboardPage instance for dashboard verification
   */
  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },
});

export { expect } from '@playwright/test';
