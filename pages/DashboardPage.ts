import { Page, Locator, expect } from '@playwright/test';

export class DashboardPage {
    readonly page: Page;
    readonly dashboardTitle: Locator;
    readonly viewerBadge: Locator;
    readonly recentTransactionsTable: Locator;
    readonly recentTransactionsTableBody: Locator;
    readonly totalBalanceCard: Locator;
    readonly activeAccountsCard: Locator;
    readonly accountsCount: Locator;
    readonly totalTransactionsCard: Locator;
    readonly transactionsCount: Locator;

    constructor(page: Page) {
        this.page = page;
        this.dashboardTitle = page.getByTestId('page-title');
        this.viewerBadge = page.getByTestId('viewer-badge');
        this.recentTransactionsTable = page.getByTestId('recent-transactions-table');
        this.recentTransactionsTableBody = this.recentTransactionsTable.locator('tbody');
        this.totalBalanceCard = page.getByTestId('total-balance');

        this.activeAccountsCard = page.getByTestId('accounts-count-card');
        this.accountsCount = page.getByTestId('accounts-count');
        this.totalTransactionsCard = page.getByTestId('transactions-count-card');
        this.transactionsCount = page.getByTestId('transactions-count');
    }

    async pageLoaded() {
        await expect(this.page).toHaveURL(/bank\/dashboard/);
        await expect(this.page.getByRole('navigation', { name: 'Bank navigation' })).toBeVisible();
    }
    
}