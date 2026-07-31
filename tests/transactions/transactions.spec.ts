import { expect, test } from '../../utils/fixtures';
import { TransactionsPage } from '../../pages/TransactionsPage';
import { AccountsPage } from '../../pages/AccountsPage';

test.describe('Transactions Features Tests', () => {

    test('TC-TXN-01: Verify Transactions Page Load', async ({ adminTransactionsPage }) => {
        const transactionsPage = new TransactionsPage(adminTransactionsPage);
        await transactionsPage.pageLoaded();

        //Assert the Transactions table is visible
        const transactionsTable = transactionsPage.getTransactionsTable;
        await expect(transactionsTable).toBeVisible();

        // Assert table contains columns like Date, Description, Category, Amount
        const tableHeaders = transactionsTable.getByRole('columnheader');
        await expect(tableHeaders.filter({ hasText: 'Date' })).toBeVisible();
        await expect(tableHeaders.filter({ hasText: 'Description' })).toBeVisible();
        await expect(tableHeaders.filter({ hasText: 'Category' })).toBeVisible();
        await expect(tableHeaders.filter({ hasText: 'Amount' })).toBeVisible();

        const transactionRows = transactionsPage.getTransactionRows();
        const rowsCount = await transactionRows.count();
        expect(rowsCount).toBeGreaterThan(0);

        const firstRow = transactionRows.first();
        await expect(firstRow).toBeVisible();
        await expect(transactionsPage.getTransactionDate(firstRow)).toHaveText(/\S+/);
        await expect(transactionsPage.getTransactionDescription(firstRow)).toHaveText(/\S+/);
        await expect(transactionsPage.getTransactionCategory(firstRow)).toHaveText(/\S+/);
        await expect(transactionsPage.getTransactionAmount(firstRow)).toHaveText(/\$?\d+(\.\d{2})?/);

    });


    test('TC-TXN-02: Verify Account Filter', async ({ adminTransactionsPage }) => {
        //Navigate to Transactions page
        const transactionsPage = new TransactionsPage(adminTransactionsPage);
        await transactionsPage.pageLoaded();

        const transactionsTable = transactionsPage.getTransactionsTable;
        await expect(transactionsTable).toBeVisible();

        //Select a specific 'Checking' account from the filter dropdown
        const totalBefore = await transactionsPage.getTransactionRows().count();
        await transactionsPage.selectFilterAccount('Everyday Checking');

        //Assert all visible transactions belong to the selected account
        const rows = transactionsPage.getTransactionRows();
        await expect(rows.first()).toBeVisible();
        const count = await rows.count();
        for (let i = 0; i < count; i++) {
            await expect(transactionsPage.getTransactionAccount(rows.nth(i))).toHaveText('Everyday Checking');
        }

        await transactionsPage.clickOnResetFiltersButton();
        const countAfter = await transactionsPage.getTransactionRows().count();
        expect(countAfter).toBeGreaterThanOrEqual(totalBefore);

    });

    test('TC-TXN-03: Verify Search Functionality', async ({ adminTransactionsPage }) => {
        //Navigate to Transactions page
        const transactionsPage = new TransactionsPage(adminTransactionsPage);
        await transactionsPage.pageLoaded();

        //Enter 'Transfer' in the search bar
        const transactionsTable = transactionsPage.getTransactionsTable;
        await expect(transactionsTable).toBeVisible();
        await transactionsPage.search('Transfer'); 

        // Assert all visible transactions contain 'Transfer' in their description or category
        const visibleRows = transactionsPage.getTransactionRows();
        const visibleCount = await visibleRows.count();
        expect(visibleCount).toBeGreaterThan(0);

        for (let i = 0; i < visibleCount; i++) {
            const row = visibleRows.nth(i);
            const descriptionText = (await transactionsPage.getTransactionDescription(row).textContent())?.trim() ?? '';
            const categoryText = (await transactionsPage.getTransactionCategory(row).textContent())?.trim() ?? '';
            expect(
                descriptionText.toLowerCase().includes('transfer')||categoryText.toLowerCase().includes('transfer')
            ).toBe(true);
        }

    });

    test('TC-TXN-04: Verify Date Sorting', async ({ adminTransactionsPage }) => {
        //Navigate to Transactions page
        const transactionsPage = new TransactionsPage(adminTransactionsPage);
        await transactionsPage.pageLoaded();

        //Click the Date column header
        const transactionsTable = transactionsPage.getTransactionsTable;
        await expect(transactionsTable).toBeVisible();
        const dateHeader = transactionsTable.getByRole('columnheader').filter({ hasText: 'Date' });
        await dateHeader.click();

        //Assert transactions are sorted by date ascending
        let rows = transactionsPage.getTransactionRows();
        const ascendingDates: Date[] = [];
        const ascendingCount = await rows.count();
        for (let i = 0; i < ascendingCount; i++) {
            const dateText = await transactionsPage.getTransactionDate(rows.nth(i)).textContent();
            if (dateText) {
                ascendingDates.push(new Date(dateText.trim()));
            }
        }
        for (let i = 0; i < ascendingDates.length - 1; i++) {
            expect(ascendingDates[i].getTime()).toBeLessThanOrEqual(ascendingDates[i + 1].getTime());
        }

        //Click the Date column header again
        await dateHeader.click();

        //Assert transactions are sorted by date descending
        rows = transactionsPage.getTransactionRows();
        const descendingDates: Date[] = [];
        const descendingCount = await rows.count();
        for (let i = 0; i < descendingCount; i++) {
            const dateText = await transactionsPage.getTransactionDate(rows.nth(i)).textContent();
            if (dateText) {
                descendingDates.push(new Date(dateText.trim()));
            }
        }
        for (let i = 0; i < descendingDates.length - 1; i++) {
            expect(descendingDates[i].getTime()).toBeGreaterThanOrEqual(descendingDates[i + 1].getTime());
        }

    });


    test('TC-TXN-05: Verify Pagination', async ({ adminTransactionsPage }) => {
        //Navigate to Transactions page
        const transactionsPage = new TransactionsPage(adminTransactionsPage);
        await transactionsPage.pageLoaded();

        // Assert pagination 'Next' button is enabled if multiple pages exist
        const nextButton = adminTransactionsPage.getByRole('button', { name: /next/i });
        const isNextButtonVisible = await nextButton.isVisible().catch(() => false);
        
        if (isNextButtonVisible) {
            const isNextEnabled = await nextButton.isEnabled();
            
            if (isNextEnabled) {
                // Store the first page row count and first row data
                const firstPageRows = transactionsPage.getTransactionRows();
                const firstPageCount = await firstPageRows.count();
                const firstPageFirstRowText = await firstPageRows.first().textContent();

                // Click 'Next'
                await nextButton.click();
                await adminTransactionsPage.waitForLoadState('networkidle');

                // Assert the second page of transactions is displayed
                const secondPageRows = transactionsPage.getTransactionRows();
                const secondPageCount = await secondPageRows.count();
                expect(secondPageCount).toBeGreaterThan(0);
                
                const secondPageFirstRowText = await secondPageRows.first().textContent();
                expect(secondPageFirstRowText).not.toBe(firstPageFirstRowText);
            }
        }

    });

    test('TC-TXN-06:Verify Empty State - No transactions message is shown when filters return no results', async ({ adminTransactionsPage }) => {
        //Navigate to Transactions page
        const transactionsPage = new TransactionsPage(adminTransactionsPage);
        await transactionsPage.pageLoaded();

        //Search for a non-existent string like 'XYZ123NonExistent'
        const transactionsTable = transactionsPage.getTransactionsTable;
        await expect(transactionsTable).toBeVisible();
        await transactionsPage.search('XYZ123NonExistent'); 

        //Assert 'No transactions found' message is displayed
        const emptyMessage = transactionsPage.getEmptySearchResultsMessage();
        await expect(emptyMessage).toBeVisible();

    });

});
