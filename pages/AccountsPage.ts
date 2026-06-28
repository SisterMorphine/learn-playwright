import { Page, Locator, expect } from '@playwright/test';

export class AccountsPage {
    readonly page: Page;
    readonly accountsSection: Locator;
    readonly newAccountModal: {
        modal: Locator;
        accountForm: {
            accountForm: Locator;
            accountNameInput: Locator;
            accountTypeSelect: Locator;
            initialBalanceInput: Locator;
            cancelButton: Locator;
            createButton: Locator;
        }
    };
    readonly deleteAccountModal: {
        modal: Locator;
        confirmButton: Locator;
        cancelButton: Locator;
    };
    readonly filterTypeSelect: Locator;



    constructor(page: Page) {
        this.page = page;
        this.accountsSection = page.getByTestId('accounts-table');
        this.newAccountModal = {
            modal: page.getByTestId('account-modal'),
            accountForm: {
                accountForm: page.getByTestId('account-form'),
                accountNameInput: page.getByTestId('account-name-input'),
                accountTypeSelect: page.getByTestId('account-type-select'),
                initialBalanceInput: page.getByTestId('initial-balance-input'),
                cancelButton: page.getByTestId('cancel-button'),
                createButton: page.getByTestId('save-account-button'),
            }
        };
        this.deleteAccountModal = {
            modal: page.getByTestId('delete-modal'),
            confirmButton: page.getByTestId('confirm-delete-button'),
            cancelButton: page.getByTestId('cancel-delete-button'),
        };
        this.filterTypeSelect = page.getByTestId('filter-type-select');
    }
    async pageLoaded() {
        await expect(this.page).toHaveURL(/bank\/accounts/);
    }

    getFirstAccountRow(): Locator {
        return this.accountsSection.locator('tbody tr').first();
    }

    getAccountRowByName(name: string): Locator {
        return this.accountsSection.locator('tbody tr').filter({ hasText: name });
    }

    getAccountNameFromRow(row: Locator): Promise<string | null> {
        return row.getByTestId('account-name').textContent();
    }
 
    getEditButton(row: Locator): Locator {
        return row.getByRole('button', { name: 'Edit' });
    }

    getDeleteButton(row: Locator): Locator {
        return row.getByRole('button', { name: 'Delete' });
    }

    async countAccountRows(): Promise<number> {
        return this.accountsSection.locator('tbody tr').count();
    }  

    async selectFilterType(value: string) {
    await this.page.getByTestId('filter-type-select').click();
    await this.page.getByRole('option', { name: value }).click();
}


}