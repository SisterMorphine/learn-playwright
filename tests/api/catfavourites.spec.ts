import { test, expect } from '@playwright/test';
import { API_ENDPOINTS, getCatAPIHeaders } from '../../utils/testData';

const MOCK_FAVORITE_RESPONSE = [
    {
        "id": 232413577,
        "user_id": "1ejqec",
        "image_id": "asf2",
        "sub_id": "my-user-1234",
        "created_at": "2023-10-28T17:39:28.000Z",
        "image": {}
    }
];

test.describe('Cat API - Favorites', () => {
    test('should retrieve user favorites with valid API key', async ({ request }) => {
        const headers = getCatAPIHeaders();

        // Verify API key is present
        expect(headers['x-api-key']).toBeTruthy();

        const response = await request.get(`${API_ENDPOINTS.catAPI}/favourites`, { headers });

        // Assert that the request was successful
        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        // Verify response is an array
        expect(Array.isArray(responseBody)).toBeTruthy();

        // If there are favorites, verify structure
        if (responseBody.length > 0) {
            responseBody.forEach((favorite: { id: number; image_id: string; created_at: string }) => {
                expect(favorite).toHaveProperty('id');
                expect(favorite).toHaveProperty('image_id');
                expect(favorite).toHaveProperty('created_at');
                expect(typeof favorite.id).toBe('number');
                expect(typeof favorite.image_id).toBe('string');
                expect(typeof favorite.created_at).toBe('string');
            });
        }
    });


    test('should retrieve favorites with pagination limit', async ({ request }) => {
        const headers = getCatAPIHeaders();
        const limit = 5;

        const response = await request.get(`${API_ENDPOINTS.catAPI}/favourites?limit=${limit}`, { headers });

        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        expect(Array.isArray(responseBody)).toBeTruthy();
        expect(responseBody.length).toBeLessThanOrEqual(limit);
    });

    test('should fail to retrieve favorites without API key', async ({ request }) => {
        const invalidHeaders = {
            'x-api-key': '',
        };

        const response = await request.get(`${API_ENDPOINTS.catAPI}/favourites`, { headers: invalidHeaders });

        // Cat API returns 401 for missing/invalid keys
        expect(response.status()).toBe(401);
    });
});
