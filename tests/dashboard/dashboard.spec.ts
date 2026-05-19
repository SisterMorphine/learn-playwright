import { test } from '../../utils/fixtures';
import { DashboardPage } from '../../pages/DashboardPage';

test.describe('Dashboard Features Tests', () => {

    test('TC-DASH-04: Recent transactions table display up to 5 transactions', async ({ adminPage }) => {
        const dashboardPage = new DashboardPage(adminPage);
        await dashboardPage.expectRecentTransactionsDisplayed();
    });
});
