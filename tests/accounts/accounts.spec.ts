import { expect, test } from '../../utils/fixtures';
import { DashboardPage } from '../../pages/DashboardPage';
import { AccountsPage } from '../../pages/AccountsPage';

test.describe('Accounts Features Tests', () => {

    test('TC-ACC-01: Create a new account using Quick action from Dashboard ', async ({ adminDashboardPage }) => {
        const dashboardPage = new DashboardPage(adminDashboardPage);
        await expect(dashboardPage.quickActions.addAccount).toBeVisible();

        await dashboardPage.clickQuickAction('addAccount');
        const accountsPage = new AccountsPage(adminDashboardPage)
        await expect(accountsPage.newAccountModal.modal).toBeVisible(); // Verify that the accounts page is displayed
        await expect(adminDashboardPage).toHaveURL(/bank\/accounts/);

        // Fill in the account creation form
        await accountsPage.newAccountModal.accountForm.accountNameInput.fill('Test Account');
        // account type is implemented as a custom combobox — open it and click the option
        await accountsPage.newAccountModal.accountForm.accountTypeSelect.click();
        await adminDashboardPage.getByRole('option', { name: 'Savings' }).click();
        await accountsPage.newAccountModal.accountForm.initialBalanceInput.fill('1000');

        // Submit the form
        await accountsPage.newAccountModal.accountForm.createButton.click();

        // Verify that the new account is created and displayed in the accounts table
        await expect(accountsPage.accountsSection).toBeVisible();
        const newAccountRow = accountsPage.accountsSection.locator('tbody tr').filter({ hasText: 'Test Account' });
        await expect(newAccountRow).toBeVisible();
    });

    test('TC-ACC-02: Edit account name and saving the changes ', async ({ adminAccountsPage }) => {
        const accountsPage = new AccountsPage(adminAccountsPage);

        //Pick up the first row of the accounts table and click the Edit button
        const table = accountsPage.accountsSection;
        await expect(table).toBeVisible();

        const row = accountsPage.getFirstAccountRow()
        await expect(row).toBeVisible();
        await expect(accountsPage.getEditButton(row)).toBeVisible();
        await (accountsPage.getEditButton(row)).click();

        const accountModal = accountsPage.newAccountModal.modal;
        await expect(accountModal).toBeVisible();
        const accountNameInput = accountsPage.newAccountModal.accountForm.accountNameInput;
        await expect(accountNameInput).toBeVisible();
        const newAccountName = 'Updated Account Name';
        await accountNameInput.fill(newAccountName);
        await accountsPage.newAccountModal.accountForm.createButton.click();

        // Verify that the updated account name is displayed in the accounts table
        const updatedRow = table.getByRole('row').filter({ hasText: newAccountName });
        await expect(updatedRow).toBeVisible();
    });

    test('TC-ACC-03: Delete an account with confirmation and verify it is removed ', async ({ adminAccountsPage }) => {
        const accountsPage = new AccountsPage(adminAccountsPage);
        const targetRow = accountsPage.getFirstAccountRow()
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
        const rowToBeDeleted = accountsPage.accountsSection.locator('tbody tr').filter({ hasText: accountNameToDelete ?? '' });
        await expect(rowToBeDeleted).toHaveCount(0);
    });

    test('TC-ACC-04:Filter accounts by account type ', async ({ adminAccountsPage }) => {
        const accountsPage = new AccountsPage(adminAccountsPage);
        // Open the Account Type filter combobox and choose 'Savings'
        await accountsPage.filterTypeSelect.isVisible();
        await accountsPage.selectFilterType('Savings');

        // Verify that visible rows are of type Savings
        const rows = accountsPage.accountsSection.locator('tbody tr');
        await expect(rows.first()).toContainText('Savings'); // Ensure there are rows to check
        const count = await accountsPage.countAccountRows();
        for (let i = 0; i < count; i++) {
            await expect(rows.nth(i)).toContainText('Savings');
        }
    });

    test('TC-ACC-05:Sort accounts by balance column header ', async ({ adminAccountsPage }) => {
        const accountsPage = new AccountsPage(adminAccountsPage);
        // Helper to parse balance text like "$2,500.00" -> number
        const parseBalance = async (rowIndex: number) => {
            const row = accountsPage.accountsSection.locator('tbody tr').nth(rowIndex);
            const balanceText = await row.locator('td').nth(3).textContent();
            const numeric = parseFloat((balanceText ?? '').replace(/[^0-9.-]/g, ''));
            return Number.isFinite(numeric) ? numeric : 0;
        };

        const balanceHeader = accountsPage.accountsSection.locator('thead th').filter({ hasText: 'Balance' }).first();

        // Click once -> ascending
        await balanceHeader.click();
        const rowsAfterAsc = accountsPage.accountsSection.locator('tbody tr');
        const ascCount = await rowsAfterAsc.count();
        const ascValues = [] as number[];
        for (let i = 0; i < ascCount; i++) ascValues.push(await parseBalance(i));
        for (let i = 1; i < ascValues.length; i++) expect(ascValues[i]).toBeGreaterThanOrEqual(ascValues[i - 1]);

        // Click again -> descending
        await balanceHeader.click();
        const rowsAfterDesc = accountsPage.accountsSection.locator('tbody tr');
        const descCount = await rowsAfterDesc.count();
        const descValues = [] as number[];
        for (let i = 0; i < descCount; i++) descValues.push(await parseBalance(i));
        for (let i = 1; i < descValues.length; i++) expect(descValues[i]).toBeLessThanOrEqual(descValues[i - 1]);
    });

});