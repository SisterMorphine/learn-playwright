import { Page, Locator, expect } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly dashboardTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dashboardTitle = page.getByRole('heading', { name: /dashboard/i });
  }

  async expectLoaded() {
    await expect(this.dashboardTitle).toBeVisible();
    await expect(this.page).toHaveURL(/bank\/dashboard/);
  }
}