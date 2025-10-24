import { test, expect } from '@playwright/test';

test.describe('Example test suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should verify homepage with agent', async ({ page }, testInfo) => {
    const agent = testInfo.agent;
    await agent.observe('Analyzing homepage');

    // Use web-first assertions
    await expect(page).toHaveTitle(/.*My App.*/);
    
    const loginButton = page.getByRole('button', { name: 'Login' });
    
    if (await loginButton.isVisible()) {
      await agent.observe('User is not logged in');
      await expect(loginButton).toBeVisible();
    } else {
      await agent.observe('User is already logged in');
      await expect(page.getByText('Welcome')).toBeVisible();
    }

    // Example of soft assertions
    await expect.soft(page.getByTestId('header')).toBeVisible();
    await expect.soft(page.getByRole('navigation')).toBeVisible();
  });
});