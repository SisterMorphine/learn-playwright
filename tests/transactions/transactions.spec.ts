import { expect, test } from '../../utils/fixtures';
import { TransactionsPage } from '../../pages/TransactionsPage';
import { AccountsPage } from '../../pages/AccountsPage';

test.describe.serial('Transactions Features Tests', () => {

    test('TC-TXN-01: Create a deposit transaction and verify balance update', async ({ adminAccountsPage }) => {
        //Go to Accounts page and get the first account, save the name and the balance
        const accountsPage = new AccountsPage(adminAccountsPage);
        await accountsPage.pageLoaded();

        await adminAccountsPage.locator('td').filter({ hasText: /\$/ }).first().waitFor();
        const primarySavingsRow = accountsPage.getFirstAccountRow();

        await expect(primarySavingsRow).toBeVisible();
        const balanceBefore = parseFloat(
            (await primarySavingsRow.locator('td').nth(3).textContent() ?? '').replace(/[^0-9.]/g, '')
        );
        const accountName = await accountsPage.getAccountNameFromRow(primarySavingsRow);

        const transactionsPage = new TransactionsPage(adminAccountsPage);
        if (!accountName) throw new Error('Failed to read account name');

        await transactionsPage.createTransaction('Deposit', accountName, '500');

        await expect(transactionsPage.newTransactionModal.modal).not.toBeVisible();
        await expect(adminAccountsPage.getByText(/success/i).first()).toBeVisible();
        await expect(transactionsPage.getTransactionRows().first()).toBeVisible();

        await adminAccountsPage.goto('/bank/accounts');
        await adminAccountsPage.locator('td').filter({ hasText: /\$/ }).first().waitFor();
        const balanceAfter = parseFloat(
            (await accountsPage.getAccountRowByName(accountName).locator('td').nth(3).textContent() ?? '').replace(/[^0-9.]/g, '')
        );
        expect(balanceAfter).toBeCloseTo(balanceBefore + 500, 2);
    });

    test('TC-TXN-02: Filter transactions by account and verify only matching rows appear', async ({ adminTransactionsPage }) => {
        const transactionsPage = new TransactionsPage(adminTransactionsPage);
        await transactionsPage.pageLoaded();

        const totalBefore = await transactionsPage.getTransactionRows().count();

        await transactionsPage.selectFilterAccount('Primary Savings');
        await transactionsPage.applyFiltersButton.click();

        const rows = transactionsPage.getTransactionRows();
        await expect(rows.first()).toBeVisible();
        const count = await rows.count();
        for (let i = 0; i < count; i++) {
            await expect(rows.nth(i).getByTestId('transaction-account')).toHaveText('Primary Savings');
        }

        await expect(transactionsPage.summaryBar).toBeVisible();

        await transactionsPage.resetFiltersButton.click();
        const countAfter = await transactionsPage.getTransactionRows().count(); 
        expect(countAfter).toBeGreaterThanOrEqual(totalBefore);
        //await expect(transactionsPage.getTransactionRows()).toHaveCount(totalBefore);
    });

    test('TC-TXN-03: Filter transactions by date range using calendar date picker', async ({ adminTransactionsPage }) => {
        const transactionsPage = new TransactionsPage(adminTransactionsPage);
        await transactionsPage.pageLoaded();

        const totalBefore = await transactionsPage.getTransactionRows().count();

        // FROM: 1st of current month
        await transactionsPage.dateFromInput.click();
        await expect(transactionsPage.calendar).toBeVisible();
        await expect(transactionsPage.calendar.locator('button').filter({ hasText: /^1$/ }).first().click());
        await expect(transactionsPage.dateFromInput).not.toContainText('Pick start date');

        // TO: today
        await transactionsPage.dateToInput.click();
        await expect(transactionsPage.calendar).toBeVisible();
        await transactionsPage.calendar.getByRole('button', { name: /Today/ }).click();
        await expect(transactionsPage.dateToInput).not.toContainText('Pick a date');

        await transactionsPage.applyFiltersButton.click();
        await transactionsPage.resetFiltersButton.click();
        await expect(transactionsPage.getTransactionRows()).toHaveCount(totalBefore);
    });

    test('TC-TXN-04: Export transactions as CSV and verify file is downloaded', async ({ adminTransactionsPage }) => {
        const transactionsPage = new TransactionsPage(adminTransactionsPage);
        await transactionsPage.pageLoaded();
        await expect(transactionsPage.getTransactionRows().first()).toBeVisible();

        const toastVisible = expect(adminTransactionsPage.getByText('Transactions exported successfully!')).toBeVisible();
        const [download] = await Promise.all([
            adminTransactionsPage.waitForEvent('download'),
            transactionsPage.exportButton.click(),
        ]);
        await toastVisible;
        expect(download.suggestedFilename()).toMatch(/\.csv$/);
    });

    test('TC-TXN-05: Transaction detail page shows all fields and breadcrumb navigation', async ({ adminTransactionsPage }) => {
        const transactionsPage = new TransactionsPage(adminTransactionsPage);
        await transactionsPage.pageLoaded();

        const firstRow = transactionsPage.getTransactionRows().first();
        await expect(firstRow).toBeVisible();
        const txnId = await firstRow.getByTestId('transaction-id').textContent();

        await firstRow.getByTestId('transaction-id-link').click();
        await expect(adminTransactionsPage).toHaveURL(/bank\/transactions\/.+/);

        await expect(adminTransactionsPage.getByTestId('breadcrumb-item-1')).toContainText('Dashboard');
        await expect(adminTransactionsPage.getByTestId('breadcrumb-item-2')).toContainText('Transactions');
        await expect(adminTransactionsPage.getByTestId('breadcrumb-item-3')).toContainText(txnId ?? '');

        await expect(transactionsPage.detail.card).toBeVisible();
        await expect(transactionsPage.detail.type).toContainText(/Deposit|Withdrawal|Transfer/);
        await expect(transactionsPage.detail.amount).toContainText(/\$[\d,]+\.\d{2}/);
        await expect(transactionsPage.detail.datetime).toContainText(/^[A-Z][a-z]{2} \d{1,2}, \d{4}(,| at) \d{2}:\d{2} (AM|PM)$/);
        await expect(transactionsPage.detail.balanceAfter).toContainText(/\$[\d,]+\.\d{2}/);
        await expect(transactionsPage.detail.accountLink).toContainText(/\w+(\s+\w+)*/);
        await expect(transactionsPage.detail.status).toContainText(/Completed|Pending|Failed/);
        await transactionsPage.backButton.click();
        await expect(adminTransactionsPage).toHaveURL(/bank\/transactions$/);
    });

});
