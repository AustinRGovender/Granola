import { test, expect } from '@playwright/test';

/**
 * Seed test for performance testing tool.
 * This test sets up the environment and navigates to the application.
 * Used by Playwright Test Agents (🎭 planner, 🎭 generator) as context.
 * 
 * @remarks
 * - Ensures application is accessible at http://localhost:5174
 * - Provides baseline context for test generation
 * - Should complete within 30 seconds
 */
test('seed - performance testing tool', async ({ page }) => {
  // Navigate to the performance testing tool
  await page.goto('/');
  
  // Wait for the page to be fully loaded
  await page.waitForLoadState('domcontentloaded');
  
  // Verify the application is accessible
  await expect(page).toHaveURL(/localhost:5174/);
  
  // Log success for agent context
  console.log('✓ Performance testing tool is accessible');
  console.log('✓ Base URL:', page.url());
  
  // Wait for any initial loading to complete
  await page.waitForLoadState('networkidle');
  
  // Take a screenshot for agent reference
  await page.screenshot({ path: 'test-results/seed-screenshot.png', fullPage: true });
  
  console.log('✓ Seed test completed successfully');
});
