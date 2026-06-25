import { expect, test } from '../../utils/fixtures';
import { DashboardPage } from '../../pages/DashboardPage';

test.describe('Dashboard Features Tests', () => {
    test('TC-DASH-01: Verify dashboard cards display correctly for an admin role', async ({ adminDashboardPage }) => {
        const dashboardPage = new DashboardPage(adminDashboardPage);

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

    test('TC-DASH-02: Stat card values match actual account and transactions data', async ({ adminDashboardPage }) => {
        // Wait for the count-up animation to finish — the container sets data-loading="false" when done
        await adminDashboardPage.locator('#dashboard-page-container[data-loading="false"]').waitFor();

    
        const balanceValueEl = adminDashboardPage.locator('#total-balance');
        await expect(balanceValueEl).toBeVisible();
        const dashboardBalance = parseFloat((await balanceValueEl.textContent() ?? '').replace(/[^0-9.]/g, ''));

        // Navigate to accounts page
        await adminDashboardPage.goto('/bank/accounts');

        // Wait for actual balance data to load — skeleton rows appear first with empty cells.
        // Match both positive ($2,500.00) and negative (-$4,125.00) balance cells.
        const balanceCells = adminDashboardPage.getByRole('cell').filter({ hasText: /^-?\$[\d,]+\./ });
        await expect(balanceCells.first()).toBeVisible();
        const balanceTexts = await balanceCells.allTextContents();
        console.log('DEBUG dashboard balance:', (await balanceValueEl.textContent())?.trim());
        console.log('DEBUG balance cells:', JSON.stringify(balanceTexts));
        const accountsTotal = balanceTexts
            .map(text => {
                const sign = text.startsWith('-') ? -1 : 1;
                return sign * (parseFloat(text.replace(/[^0-9.]/g, '')) || 0);
            })
            .reduce((sum, v) => sum + v, 0);

        expect(accountsTotal).toBeCloseTo(dashboardBalance, 2);
    });

    test('TC-DASH-04: Recent transactions table display up to 5 transactions', async ({ adminDashboardPage }) => {
        const dashboardPage = new DashboardPage(adminDashboardPage);
        await expect(dashboardPage.recentTransactionsTable).toBeVisible();
        await expect(dashboardPage.recentTransactionsTableBody).toBeVisible();
        //assert that the recent transactions table displays up to 5 transactions   
        const rows = dashboardPage.recentTransactionsTable.locator('tbody tr');
        const rowCount = await rows.count();
        expect(rowCount).toBeLessThanOrEqual(5);
    
  });
});