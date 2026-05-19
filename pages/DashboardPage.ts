import { Page, Locator, expect } from '@playwright/test';

export class DashboardPage {
    readonly page: Page;
    readonly dashboardTitle: Locator;
    readonly viewerBadge: Locator;
    readonly recentTransactionsTable: Locator;

    constructor(page: Page) {
        this.page = page;
        this.dashboardTitle = page.getByRole('heading', { name: /dashboard/i });
        this.viewerBadge = page.getByTestId('viewer-badge');
        this.recentTransactionsTable = page.getByTestId('recent-transactions-table');
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
}