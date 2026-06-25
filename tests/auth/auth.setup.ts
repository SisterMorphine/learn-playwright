import { test as setup } from '@playwright/test';
import { mkdirSync } from 'fs';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { AUTH_FILES } from '../../utils/testData';

setup.beforeAll(() => {
  mkdirSync('playwright/.auth', { recursive: true });
});

setup('authenticate as admin', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('admin', 'admin123');
  await new DashboardPage(page).pageLoaded();
  await page.context().storageState({ path: AUTH_FILES.admin });
});

setup('authenticate as viewer', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('viewer', 'viewer123');
  await new DashboardPage(page).pageLoaded();
  await page.context().storageState({ path: AUTH_FILES.viewer });
});
