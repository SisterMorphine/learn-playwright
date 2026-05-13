import { test } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';

test.describe('Bank Demo - Viewer login', () => {
    test('Viewer user can log in and access dashboard', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const dashboardPage = new DashboardPage(page);

        await loginPage.goto();
        await loginPage.login('viewer', 'viewer123');

        await dashboardPage.expectLoaded();
        await dashboardPage.expectViewerAccess();
    });
});