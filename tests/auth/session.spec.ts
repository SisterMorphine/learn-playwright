import { test, expect } from '../../utils/fixtures';

test.describe('Session Management', () => {
    test('TC-SESSION-01: Expired session redirects to login', async ({ adminPage }) => {
        // Simulate session expiry by clearing sessionStorage —
        // the app stores auth in sessionStorage ('currentUser'), not in cookies
        await adminPage.evaluate(() => sessionStorage.clear());

        // Navigate to a protected page — server sees no valid session and redirects
        await adminPage.goto('/bank/accounts');

        // Verify redirect to login
        await expect(adminPage).toHaveURL(/\/bank$/);
    });
});
