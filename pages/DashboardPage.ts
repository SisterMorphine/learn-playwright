import { Page, Locator, expect } from '@playwright/test';

export class DashboardPage {
    readonly page: Page;
    readonly dashboardTitle: Locator;
    readonly viewerBadge: Locator;
    readonly recentTransactionsTable: Locator;
    readonly totalBalanceCard: Locator;
    readonly activeAccountsCard: Locator;
    readonly accountsCount: Locator;
    readonly totalTransactionsCard: Locator;
    readonly transactionsCount: Locator;

    constructor(page: Page) {
        this.page = page;
        this.dashboardTitle = page.getByRole('heading', { name: /dashboard/i });
        this.viewerBadge = page.getByTestId('viewer-badge');
        this.recentTransactionsTable = page.getByTestId('recent-transactions-table');
        this.totalBalanceCard = page.getByTestId('total-balance-card');
        this.activeAccountsCard = page.getByTestId('accounts-count-card');
        this.accountsCount = page.getByTestId('accounts-count');
        this.totalTransactionsCard = page.getByTestId('transactions-count-card');
        this.transactionsCount = page.getByTestId('transactions-count');
    }

    async expectLoaded() {
        await expect(this.dashboardTitle).toBeVisible();
        await expect(this.page).toHaveURL(/bank\/dashboard/);
    }

    async expectViewerAccess() {
        await expect(this.viewerBadge).toBeVisible();
        await expect(this.viewerBadge).toHaveText('Read-only');
    }

    async expectRecentTransactionsDisplayed() {
        await expect(this.recentTransactionsTable).toBeVisible();
        const rows = this.recentTransactionsTable.locator('tbody tr');
        const rowCount = await rows.count();
        await expect(rowCount).toBeLessThanOrEqual(5);
    }

    async expectSkeletonLoading() {
        const skeleton = this.page.getByTestId('skeleton-card');
        await expect(skeleton).toBeVisible();
    }
    
}