import { expect, test } from '../../utils/fixtures';
import { DashboardPage } from '../../pages/DashboardPage';
import { AccountsPage } from '../../pages/AccountsPage';

test.describe('Accounts Features Tests', () => {

    test('TC-ACC-01: Verify accounts are listed properly', async ({ adminAccountsPage }) => {
        const accountsPage = new AccountsPage(adminAccountsPage)
        await accountsPage.pageLoaded();

        await expect(accountsPage.accountsTable.table).toBeVisible();

        const rows = await accountsPage.accountsTable.accountRow.all();
        expect(rows.length).toBeGreaterThan(0);

        for (const row of rows) {
            const balanceCell = accountsPage.getBalanceCell(row);
            await expect(balanceCell).toBeVisible();
            await expect(balanceCell).toHaveText(/^-?\$[\d,]+\.\d{2}$/);

            await expect(accountsPage.getSeeButton(row)).toBeVisible();
            await expect(accountsPage.getEditButton(row)).toBeVisible();
            await expect(accountsPage.getDeleteButton(row)).toBeVisible();
        }
    });

    test('TC-ACC-02: Create a new account using button from Accounts page', async ({ adminAccountsPage }) => {
        const accountsPage = new AccountsPage(adminAccountsPage)
        await accountsPage.pageLoaded();

        await expect(accountsPage.addAccountButton).toBeVisible();
        await accountsPage.addAccountButton.click();


        await expect(accountsPage.newAccountModal.modal).toBeVisible(); // Verify that the accounts page is displayed
        await expect(adminAccountsPage).toHaveURL(/bank\/accounts/);

        // Fill in the account creation form
        await accountsPage.newAccountModal.accountForm.accountNameInput.fill('Test Account');
        // account type is implemented as a custom combobox — open it and click the option
        await accountsPage.newAccountModal.accountForm.accountTypeSelect.click();
        await adminAccountsPage.getByRole('option', { name: 'Savings' }).click();
        await accountsPage.newAccountModal.accountForm.initialBalanceInput.fill('1000');

        //Accept Terms and Conditions
        await accountsPage.newAccountModal.accountForm.termsAndConditionsCheckbox.check();

        // Submit the form
        await accountsPage.newAccountModal.accountForm.createButton.click();

        // Verify that the new account is created and displayed in the accounts table
        await expect(accountsPage.accountsTable.table).toBeVisible();
        const newAccountRow = accountsPage.accountsTable.table.locator('tbody tr').filter({ hasText: 'Test Account' });
        await expect(newAccountRow).toBeVisible();
    });

    test('TC-ACC-02: Edit account name and saving the changes', async ({ adminAccountsPage }) => {
        const accountsPage = new AccountsPage(adminAccountsPage)

        //Pick up the first row of the accounts table and click the Edit button
        const table = accountsPage.accountsTable;
        await expect(table.table).toBeVisible();

        const row = accountsPage.getFirstAccountRow()
        await expect(row).toBeVisible();
        await expect(accountsPage.getEditButton(row)).toBeVisible();
        await (accountsPage.getEditButton(row)).click();

        const accountModal = accountsPage.editAccountModal.modal;
        await expect(accountModal).toBeVisible();
        const accountNameInput = accountsPage.editAccountModal.editAccountForm.accountName
        await expect(accountNameInput).toBeVisible();
        const newAccountName = 'Updated Account Name';
        await accountNameInput.fill(newAccountName);
        await accountsPage.editAccountModal.editAccountForm.saveChangesButton.click();

        // Verify that the updated account name is displayed in the accounts table
        const updatedRow = table.table.getByRole('row').filter({ hasText: newAccountName });
        await expect(updatedRow).toBeVisible();
    });

    test('TC-ACC-03: Delete an account with confirmation and verify it is removed', async ({ adminAccountsPage }) => {
        const accountsPage = new AccountsPage(adminAccountsPage)

        //Pick up the first row of the accounts table and click the Edit button
        const table = accountsPage.accountsTable;
        await expect(table.table).toBeVisible();

        const targetRow = accountsPage.getFirstAccountRow()
        await expect(targetRow).toBeVisible();

        //save in a variable the account name of the row to be deleted
        const accountNameToDelete = await accountsPage.getAccountNameFromRow(targetRow);
        await expect(targetRow).toBeVisible();

        // Click the Delete button inside that row
        await accountsPage.getDeleteButton(targetRow).click();

        // Confirm the deletion in dialog (match common confirm button labels)
        const confirmBtn = accountsPage.deleteAccountModal.confirmButton;
        await expect(confirmBtn).toBeVisible();
        await confirmBtn.click();

        // Verify the row is removed from the table by checking that no row contains the deleted account name
        const rowToBeDeleted = accountsPage.accountsTable.table.locator('tbody tr').filter({ hasText: accountNameToDelete ?? '' });
        await expect(rowToBeDeleted).toHaveCount(0);
    });


});