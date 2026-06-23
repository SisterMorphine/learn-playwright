import { expect, test } from '../../utils/fixtures';
import { DashboardPage } from '../../pages/DashboardPage';

test.describe('Dashboard Features Tests', () => {
    test('TC-DASH-01: Verify dashboard cards display correctly', async ({ adminPage }) => {
        const dashboardPage = new DashboardPage(adminPage);

        //expect total balance card to be visible and contain a dollar sign
        await expect(dashboardPage.totalBalanceCard).toBeVisible();
        await expect(dashboardPage.totalBalanceCard).toContainText('$');

        //assert that the accounts count is a number    
        await expect(dashboardPage.activeAccountsCard).toBeVisible();
        await expect(dashboardPage.accountsCount).toBeVisible();
        await expect(dashboardPage.accountsCount).toContainText(/^\d+$/);

        //assert that the transactions count is a number                                                
        await expect(dashboardPage.totalTransactionsCard).toBeVisible();
        await expect(dashboardPage.transactionsCount).toBeVisible();
        await expect(dashboardPage.transactionsCount).toContainText(/^\d+$/);
    });

    test('TC-DASH-04: Recent transactions table display up to 5 transactions', async ({ adminPage }) => {
        const dashboardPage = new DashboardPage(adminPage);
        await expect(dashboardPage.recentTransactionsTable).toBeVisible();
        await expect(dashboardPage.recentTransactionsTableBody).toBeVisible();
        //assert that the recent transactions table displays up to 5 transactions   
        const rows = dashboardPage.recentTransactionsTable.locator('tbody tr');
        const rowCount = await rows.count();
        expect(rowCount).toBeLessThanOrEqual(5);
    
    });
});
