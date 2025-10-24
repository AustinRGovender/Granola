import { test as setup, expect } from '@playwright/test';

setup('authenticate', async ({ page }) => {
  // Navigate to your login page
  await page.goto('/login');
  
  // Fill in login credentials
  await page.getByLabel('Username').fill('test-user');
  await page.getByLabel('Password').fill('test-password');
  await page.getByRole('button', { name: 'Sign in' }).click();
  
  // Wait for the navigation to complete
  await expect(page.getByText('Welcome')).toBeVisible();
  
  // Save signed-in state
  await page.context().storageState({
    path: 'playwright/.auth/user.json'
  });
});