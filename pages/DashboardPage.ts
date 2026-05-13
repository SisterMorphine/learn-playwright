import { Page, Locator, expect } from '@playwright/test';

export class DashboardPage {
    readonly page: Page;
    readonly dashboardTitle: Locator;
    readonly viewerBadge: Locator;

    constructor(page: Page) {
        this.page = page;
        this.dashboardTitle = page.getByRole('heading', { name: /dashboard/i });
        this.viewerBadge = page.getByTestId('viewer-badge');
    }

    async expectLoaded() {
        await expect(this.dashboardTitle).toBeVisible();
        await expect(this.page).toHaveURL(/bank\/dashboard/);
    }

    async expectViewerAccess() {
        await expect(this.viewerBadge).toBeVisible();
        await expect(this.viewerBadge).toHaveText('Read-only');


    }
}