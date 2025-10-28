import { Page, Locator } from '@playwright/test';

/**
 * BasePage - Base class for all page objects in the IHAPerf application
 * 
 * Provides common functionality and navigation elements shared across all pages:
 * - Main navigation menu
 * - WebSocket connection status
 * - Common page interactions
 * 
 * @class BasePage
 * @example
 * ```typescript
 * const basePage = new BasePage(page);
 * await basePage.navigateToScenarios();
 * const isConnected = await basePage.isWebSocketConnected();
 * ```
 */
export class BasePage {
  readonly page: Page;
  
  // Navigation menu locators
  readonly logoLink: Locator;
  readonly dashboardLink: Locator;
  readonly scenariosLink: Locator;
  readonly executionsLink: Locator;
  readonly historyLink: Locator;
  readonly compareLink: Locator;
  
  // Common elements
  readonly connectionStatus: Locator;
  readonly pageHeading: Locator;

  /**
   * Creates an instance of BasePage
   * @param {Page} page - Playwright page object
   */
  constructor(page: Page) {
    this.page = page;
    
    // Initialize navigation locators
    this.logoLink = page.getByRole('link', { name: 'IHAPerf' });
    this.dashboardLink = page.getByRole('link', { name: 'Dashboard' });
    this.scenariosLink = page.getByRole('link', { name: 'Scenarios' });
    this.executionsLink = page.getByRole('link', { name: 'Executions' });
    this.historyLink = page.getByRole('link', { name: 'History' });
    this.compareLink = page.getByRole('link', { name: 'Compare' });
    
    // Initialize common elements
    this.connectionStatus = page.getByText('Connected');
    this.pageHeading = page.getByRole('heading', { level: 1 });
  }

  /**
   * Navigate to the Dashboard page
   * @returns {Promise<void>}
   */
  async navigateToDashboard(): Promise<void> {
    await this.dashboardLink.click();
    await this.page.waitForURL('/');
  }

  /**
   * Navigate to the Scenarios page
   * @returns {Promise<void>}
   */
  async navigateToScenarios(): Promise<void> {
    await this.scenariosLink.click();
    await this.page.waitForURL('/scenarios');
  }

  /**
   * Navigate to the Executions page
   * @returns {Promise<void>}
   */
  async navigateToExecutions(): Promise<void> {
    await this.executionsLink.click();
    await this.page.waitForURL('/executions');
  }

  /**
   * Navigate to the History page
   * @returns {Promise<void>}
   */
  async navigateToHistory(): Promise<void> {
    await this.historyLink.click();
    await this.page.waitForURL('/history');
  }

  /**
   * Navigate to the Compare page
   * @returns {Promise<void>}
   */
  async navigateToCompare(): Promise<void> {
    await this.compareLink.click();
    await this.page.waitForURL('/comparison');
  }

  /**
   * Get the current page title
   * @returns {Promise<string>} Page title
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Check if WebSocket connection is established
   * @returns {Promise<boolean>} True if connected, false otherwise
   */
  async isWebSocketConnected(): Promise<boolean> {
    return await this.connectionStatus.isVisible();
  }

  /**
   * Get the current page heading text
   * @returns {Promise<string>} Page heading text
   */
  async getPageHeading(): Promise<string> {
    return await this.pageHeading.textContent() || '';
  }

  /**
   * Wait for page to be fully loaded
   * Waits for network idle and connection status
   * @returns {Promise<void>}
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.connectionStatus.waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * Navigate directly to a URL path
   * @param {string} path - URL path to navigate to
   * @returns {Promise<void>}
   */
  async goto(path: string): Promise<void> {
    await this.page.goto(path);
  }
}
