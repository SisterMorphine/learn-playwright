import { test as setup } from '@playwright/test';
import { mkdirSync } from 'fs';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { AUTH_FILES } from '../../utils/testData';
import { TEST_USERS } from '../../utils/testData';

setup.beforeAll(() => {
  mkdirSync('playwright/.auth', { recursive: true });
});

setup('authenticate as admin', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.pageLoaded();
  await loginPage.login(TEST_USERS.admin.username, TEST_USERS.admin.password);
  await new DashboardPage(page).pageLoaded();
  await page.context().storageState({ path: AUTH_FILES.admin });
});

setup('authenticate as viewer', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(TEST_USERS.viewer.username, TEST_USERS.viewer.password);
  await new DashboardPage(page).pageLoaded();
  await page.context().storageState({ path: AUTH_FILES.viewer });
});
