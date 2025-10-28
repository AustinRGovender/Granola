import { test, expect } from '@playwright/test';
import { BasePage } from './pages/base.page';

/**
 * Test Suite: Navigation and Page Accessibility
 * Priority: High
 * 
 * Verifies that all main navigation pages load correctly and display expected content.
 * Tests WebSocket connection status and basic page functionality.
 */
test.describe('Navigation and Page Accessibility', () => {
  let basePage: BasePage;

  test.beforeEach(async ({ page }) => {
    basePage = new BasePage(page);
    await page.goto('/');
    await basePage.waitForPageLoad();
  });

  test('should load Dashboard page with correct title and connection status', async ({ page }) => {
    // Verify page title
    const title = await basePage.getPageTitle();
    expect(title).toContain('IHAPerf');
    
    // Verify WebSocket connection status
    const isConnected = await basePage.isWebSocketConnected();
    expect(isConnected).toBe(true);
    
    // Verify Dashboard heading
    const heading = await basePage.getPageHeading();
    expect(heading).toBe('Dashboard');
  });

  test('should navigate to Scenarios page and display content', async ({ page }) => {
    // Navigate to Scenarios
    await basePage.navigateToScenarios();
    
    // Verify URL changed
    expect(page.url()).toContain('/scenarios');
    
    // Verify page heading
    const heading = await basePage.getPageHeading();
    expect(heading).toBe('Scenarios');
    
    // Verify connection status still visible
    const isConnected = await basePage.isWebSocketConnected();
    expect(isConnected).toBe(true);
  });

  test('should navigate to Executions page and display content', async ({ page }) => {
    // Navigate to Executions
    await basePage.navigateToExecutions();
    
    // Verify URL changed
    expect(page.url()).toContain('/executions');
    
    // Verify page heading
    const heading = await basePage.getPageHeading();
    expect(heading).toBe('Executions');
    
    // Verify connection status visible
    await expect(basePage.connectionStatus).toBeVisible();
  });

  test('should navigate to History page and display content', async ({ page }) => {
    // Navigate to History
    await basePage.navigateToHistory();
    
    // Verify URL changed
    expect(page.url()).toContain('/history');
    
    // Verify page heading
    const heading = await basePage.getPageHeading();
    expect(heading).toBe('History');
    
    // Verify WebSocket connection
    await expect(basePage.connectionStatus).toBeVisible();
  });

  test('should navigate to Compare page', async ({ page }) => {
    // Navigate to Compare
    await basePage.navigateToCompare();
    
    // Verify URL changed to comparison page
    expect(page.url()).toContain('/comparison');
    
    // Verify connection status remains active
    const isConnected = await basePage.isWebSocketConnected();
    expect(isConnected).toBe(true);
  });

  test('should maintain navigation menu visibility across all pages', async ({ page }) => {
    const pages = [
      { method: () => basePage.navigateToScenarios(), name: 'Scenarios' },
      { method: () => basePage.navigateToExecutions(), name: 'Executions' },
      { method: () => basePage.navigateToHistory(), name: 'History' },
      { method: () => basePage.navigateToCompare(), name: 'Compare' },
      { method: () => basePage.navigateToDashboard(), name: 'Dashboard' }
    ];

    for (const pageDef of pages) {
      await pageDef.method();
      
      // Verify all navigation links are visible
      await expect(basePage.logoLink).toBeVisible();
      await expect(basePage.dashboardLink).toBeVisible();
      await expect(basePage.scenariosLink).toBeVisible();
      await expect(basePage.executionsLink).toBeVisible();
      await expect(basePage.historyLink).toBeVisible();
      await expect(basePage.compareLink).toBeVisible();
    }
  });

  test('should display correct page title for all pages', async ({ page }) => {
    const expectedTitle = 'IHAPerf - Intelligent High-performance API Performance Testing Tool';
    
    // Check Dashboard
    await basePage.navigateToDashboard();
    expect(await page.title()).toBe(expectedTitle);
    
    // Check Scenarios
    await basePage.navigateToScenarios();
    expect(await page.title()).toBe(expectedTitle);
    
    // Check Executions
    await basePage.navigateToExecutions();
    expect(await page.title()).toBe(expectedTitle);
    
    // Check History
    await basePage.navigateToHistory();
    expect(await page.title()).toBe(expectedTitle);
  });

  test('should maintain WebSocket connection across page navigation', async ({ page }) => {
    // Start on Dashboard
    await basePage.navigateToDashboard();
    expect(await basePage.isWebSocketConnected()).toBe(true);
    
    // Navigate to each page and verify connection persists
    await basePage.navigateToScenarios();
    expect(await basePage.isWebSocketConnected()).toBe(true);
    
    await basePage.navigateToExecutions();
    expect(await basePage.isWebSocketConnected()).toBe(true);
    
    await basePage.navigateToHistory();
    expect(await basePage.isWebSocketConnected()).toBe(true);
    
    await basePage.navigateToCompare();
    expect(await basePage.isWebSocketConnected()).toBe(true);
  });

  test('should allow clicking logo to return to Dashboard', async ({ page }) => {
    // Navigate away from Dashboard
    await basePage.navigateToScenarios();
    expect(page.url()).toContain('/scenarios');
    
    // Click logo to return to Dashboard
    await basePage.logoLink.click();
    await page.waitForURL('/');
    
    // Verify we're back on Dashboard
    const heading = await basePage.getPageHeading();
    expect(heading).toBe('Dashboard');
  });
});
