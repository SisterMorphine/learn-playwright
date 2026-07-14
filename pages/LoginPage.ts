import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
    private readonly page: Page;
    private readonly usernameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;
    private readonly loginErrorMessage: Locator;
    private readonly togglePasswordButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.getByTestId('login-username-input');
        this.passwordInput = page.getByTestId('login-password-input');
        this.loginButton = page.getByTestId('login-submit-btn');
        this.loginErrorMessage = page.getByTestId('login-error-message');
        this.togglePasswordButton = page.getByRole('button', { name: /Show password|Hide password/ })
    }

    public async goto() {
        await this.page.goto('/bank/login');
    }

    public getUsernameInput(): Locator {
        return this.usernameInput;
    }

    public getPasswordInput(): Locator {
        return this.passwordInput;
    }

    public getTogglePasswordButton(): Locator {
        return this.togglePasswordButton;
    }

    public async clickLoginButton() {
        await this.loginButton.click();
    }

    public async fillUsername(username: string) {
        await this.usernameInput.fill(username);
    }

    public async fillPassword(password: string) {
        await this.passwordInput.fill(password);
    }

    public async login(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    public async pageLoaded() {
        await expect(this.usernameInput).toBeVisible();
        await expect(this.passwordInput).toBeVisible();
        await expect(this.loginButton).toBeVisible();
    }

    public async togglePasswordVisibility() {
        await this.togglePasswordButton.click();
    }

    public async getLoginErrorMessageText(): Promise<string> {
        return await this.loginErrorMessage.textContent() || '';
    }
}
