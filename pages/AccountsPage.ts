import { Page, Locator, expect } from '@playwright/test';

export class AccountsPage {
    readonly page: Page;
    readonly accountsSection: Locator;
    readonly accountsPageTitle: Locator; 
    readonly newAccountModal: {
        modal: Locator;
        accountForm: {
            accountForm: Locator;
            accountNameInput: Locator;
            accountTypeSelect: Locator;
            initialBalanceInput: Locator;
            cancelButton: Locator;
            createButton: Locator;
            termsAndConditionsCheckbox: Locator; 
        }
    };
    readonly deleteAccountModal: {
        modal: Locator;
        confirmButton: Locator;
        cancelButton: Locator;
    };
    readonly filterTypeSelect: Locator;
    readonly accountsTable: {
        table: Locator;
        accountRow: Locator;
    };
    readonly addAccountButton: Locator; 



    constructor(page: Page) {
        this.page = page;
        this.accountsSection = page.getByTestId('accounts-table');
        this.accountsPageTitle  = page.getByTestId('accounts-page-title'); 
        this.newAccountModal = {
            modal: page.getByTestId('add-account-dialog'), 
            accountForm: {
                accountForm: page.getByTestId('account-form'),
                accountNameInput: page.getByTestId('account-form-name-input'),
                accountTypeSelect: page.getByTestId('account-form-type-select'),
                initialBalanceInput: page.locator('[name="account_balance_field"]'),
                cancelButton: page.getByTestId('cancel-button'),
                createButton: page.getByTestId('save-account-form-btn'),
                termsAndConditionsCheckbox: page.getByTestId('account-form-accept-terms-checkbox'), 
            }
        };
        this.deleteAccountModal = {
            modal: page.getByTestId('delete-modal'),
            confirmButton: page.getByTestId('confirm-delete-button'),
            cancelButton: page.getByTestId('cancel-delete-button'),
        };
        this.filterTypeSelect = page.getByTestId('filter-type-select');
        this.accountsTable = {
            table: page.getByTestId('accounts-table'),
            accountRow: page.getByTestId('account-row'),
        }
        this.addAccountButton = page.getByTestId('add-account-btn'); 
    }
    async pageLoaded() {
        await expect(this.page).toHaveURL(/bank\/accounts/);
        await expect(this.accountsPageTitle).toBeVisible();
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

    getSeeButton(row: Locator): Locator {
        return row.getByTestId('view-account-btn');
    }

    getBalanceCell(row: Locator): Locator {
        return row.getByTestId('account-row-balance');
    }

    async countAccountRows(): Promise<number> {
        return this.accountsSection.locator('tbody tr').count();
    }  

    async selectFilterType(value: string) {
    await this.page.getByTestId('filter-type-select').click();
    await this.page.getByRole('option', { name: value }).click();
}


}