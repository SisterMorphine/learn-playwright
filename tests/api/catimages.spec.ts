import { test, expect } from '@playwright/test';
import { API_ENDPOINTS, getCatAPIHeaders } from '../../utils/testData';

test.describe('Cat API - Image Retrieval', () => {
  test('should retrieve cat images with valid API key', async ({ request }) => {
    const headers = getCatAPIHeaders();

    // Verify API key is present
    expect(headers['x-api-key']).toBeTruthy();

    const response = await request.get(API_ENDPOINTS.catImages, { headers });

    // Assert that the request was successful
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const responseBody = await response.json();

    // Verify response is an array
    expect(Array.isArray(responseBody)).toBeTruthy();
    expect(responseBody.length).toBeGreaterThan(0);

    // Verify each image object has required properties
    responseBody.forEach((image: { id: string; url: string; width: number; height: number }) => {
      expect(image).toHaveProperty('id');
      expect(image).toHaveProperty('url');
      expect(image).toHaveProperty('width');
      expect(image).toHaveProperty('height');
      expect(typeof image.id).toBe('string');
      expect(typeof image.url).toBe('string');
      expect(image.url).toMatch(/^https?:\/\//);
    });
  });
});
