import { test, expect } from '@playwright/test';
import { API_ENDPOINTS } from '../../utils/testData';

test.describe('Cat Facts API', () => {
  test('should retrieve paginated cat facts', async ({ request }) => {
    const response = await request.get(API_ENDPOINTS.catFactsList);

    // Assert that the request was successful
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const responseBody = await response.json();

    // Verify response structure
    expect(responseBody).toHaveProperty('current_page');
    expect(responseBody).toHaveProperty('data');
    expect(responseBody).toHaveProperty('first_page_url');
    expect(responseBody).toHaveProperty('last_page');
    expect(responseBody).toHaveProperty('total');
    expect(responseBody).toHaveProperty('per_page');

    // Verify data is an array of facts
    expect(Array.isArray(responseBody.data)).toBeTruthy();
    expect(responseBody.data.length).toBeGreaterThan(0);

    // Verify each fact has required properties
    responseBody.data.forEach((fact: { fact: string; length: number }) => {
      expect(fact).toHaveProperty('fact');
      expect(fact).toHaveProperty('length');
      expect(typeof fact.fact).toBe('string');
      expect(typeof fact.length).toBe('number');
    });

    // Verify pagination properties
    expect(responseBody.current_page).toBe(1);
    expect(responseBody.per_page).toBeGreaterThan(0);
    expect(responseBody.from).toBe(1);   
    expect(responseBody.last_page).toBeGreaterThanOrEqual(1);
    expect(responseBody.total).toBeGreaterThanOrEqual(responseBody.per_page);
  });

  test('should navigate to a specific page', async ({ request }) => {
    const response = await request.get(API_ENDPOINTS.catFactsList + '?page=2');

    // Assert that the request was successful
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const responseBody = await response.json();

    // Verify we're on page 2
    expect(responseBody.current_page).toBe(2);
    expect(responseBody.data.length).toBeGreaterThan(0);
  });
});