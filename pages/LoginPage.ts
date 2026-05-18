import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly loginErrorMessage: Locator;
    readonly passwordErrorMessage: Locator;
    readonly usernameErrorMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.getByTestId('username-input');
        this.passwordInput = page.getByTestId('password-input');
        this.loginButton = page.getByTestId('login-button');
        this.loginErrorMessage = page.getByTestId('login-alert');

        this.passwordErrorMessage = page.getByTestId('password-error');
        this.usernameErrorMessage = page.getByTestId('username-error');
    }

    async goto() {
        await this.page.goto('https://qaplayground.com/bank');
    }

    async login(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async expectLoaded() {
        await expect(this.usernameInput).toBeVisible();
        await expect(this.passwordInput).toBeVisible();
        await expect(this.loginButton).toBeVisible();
    }

    async expectLoginErrorMessage() {
        await expect(this.loginErrorMessage).toBeVisible();
    }

    async expectPasswordErrorMessage() {
        await expect(this.passwordErrorMessage).toBeVisible();
    }

    async expectUserNameErrorMessage() {
        await expect(this.usernameErrorMessage).toBeVisible();
    }
}