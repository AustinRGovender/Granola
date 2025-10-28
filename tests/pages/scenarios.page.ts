import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * ScenariosPage - Page Object for the Scenarios management page
 * 
 * Handles all interactions with the Scenarios page including:
 * - Viewing scenario list
 * - Creating new scenarios
 * - Editing existing scenarios
 * - Duplicating scenarios
 * - Deleting scenarios
 * - Starting test executions
 * 
 * @class ScenariosPage
 * @extends BasePage
 * @example
 * ```typescript
 * const scenariosPage = new ScenariosPage(page);
 * await scenariosPage.goto();
 * await scenariosPage.clickNewScenario();
 * ```
 */
export class ScenariosPage extends BasePage {
  // Page-specific locators
  readonly browseTemplatesButton: Locator;
  readonly newScenarioButton: Locator;
  readonly scenarioCards: Locator;
  readonly loadingIndicator: Locator;

  /**
   * Creates an instance of ScenariosPage
   * @param {Page} page - Playwright page object
   */
  constructor(page: Page) {
    super(page);
    
    // Initialize page-specific locators
    this.browseTemplatesButton = page.getByRole('button', { name: '📋 Browse Templates' });
    this.newScenarioButton = page.getByRole('button', { name: '➕ New Scenario' });
    this.scenarioCards = page.locator('[class*="scenario-card"], [class*="ScenarioCard"]').first();
    this.loadingIndicator = page.getByText('Loading scenarios...');
  }

  /**
   * Navigate to the Scenarios page
   * @returns {Promise<void>}
   */
  async goto(): Promise<void> {
    await this.page.goto('/scenarios');
    await this.waitForScenariosToLoad();
  }

  /**
   * Wait for scenarios list to finish loading
   * @returns {Promise<void>}
   */
  async waitForScenariosToLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    // Wait for loading indicator to disappear
    await this.loadingIndicator.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {
      // Loading indicator might not appear if data loads quickly
    });
  }

  /**
   * Click the "Browse Templates" button
   * @returns {Promise<void>}
   */
  async clickBrowseTemplates(): Promise<void> {
    await this.browseTemplatesButton.click();
  }

  /**
   * Click the "New Scenario" button to create a new scenario
   * @returns {Promise<void>}
   */
  async clickNewScenario(): Promise<void> {
    await this.newScenarioButton.click();
    await this.page.waitForURL('/scenarios/new');
  }

  /**
   * Get a scenario card by name
   * @param {string} scenarioName - Name of the scenario to find
   * @returns {Locator} Locator for the scenario card
   */
  getScenarioCard(scenarioName: string): Locator {
    return this.page.locator(`[class*="scenario"]`).filter({ hasText: scenarioName });
  }

  /**
   * Get the "Start Test" button for a specific scenario
   * @param {string} scenarioName - Name of the scenario
   * @returns {Locator} Locator for the Start Test button
   */
  getStartTestButton(scenarioName: string): Locator {
    const card = this.getScenarioCard(scenarioName);
    return card.getByRole('button', { name: /▶️ Start Test/ });
  }

  /**
   * Get the "Edit" button for a specific scenario
   * @param {string} scenarioName - Name of the scenario
   * @returns {Locator} Locator for the Edit button
   */
  getEditButton(scenarioName: string): Locator {
    const card = this.getScenarioCard(scenarioName);
    return card.getByRole('button', { name: /✏️ Edit/ });
  }

  /**
   * Get the "Duplicate" button for a specific scenario
   * @param {string} scenarioName - Name of the scenario
   * @returns {Locator} Locator for the Duplicate button
   */
  getDuplicateButton(scenarioName: string): Locator {
    const card = this.getScenarioCard(scenarioName);
    return card.getByRole('button', { name: /📋 Duplicate/ });
  }

  /**
   * Get the "Delete" button for a specific scenario
   * @param {string} scenarioName - Name of the scenario
   * @returns {Locator} Locator for the Delete button
   */
  getDeleteButton(scenarioName: string): Locator {
    const card = this.getScenarioCard(scenarioName);
    return card.getByRole('button', { name: /🗑 Delete/ });
  }

  /**
   * Start a test execution for a specific scenario
   * @param {string} scenarioName - Name of the scenario to run
   * @returns {Promise<void>}
   */
  async startTest(scenarioName: string): Promise<void> {
    const startButton = this.getStartTestButton(scenarioName);
    await startButton.click();
  }

  /**
   * Edit a specific scenario
   * @param {string} scenarioName - Name of the scenario to edit
   * @returns {Promise<void>}
   */
  async editScenario(scenarioName: string): Promise<void> {
    const editButton = this.getEditButton(scenarioName);
    await editButton.click();
  }

  /**
   * Duplicate a specific scenario
   * @param {string} scenarioName - Name of the scenario to duplicate
   * @returns {Promise<void>}
   */
  async duplicateScenario(scenarioName: string): Promise<void> {
    const duplicateButton = this.getDuplicateButton(scenarioName);
    await duplicateButton.click();
  }

  /**
   * Delete a specific scenario
   * @param {string} scenarioName - Name of the scenario to delete
   * @param {boolean} confirm - Whether to confirm the deletion (default: true)
   * @returns {Promise<void>}
   */
  async deleteScenario(scenarioName: string, confirm: boolean = true): Promise<void> {
    const deleteButton = this.getDeleteButton(scenarioName);
    await deleteButton.click();
    
    // Handle confirmation dialog if it appears
    if (confirm) {
      this.page.once('dialog', async dialog => {
        await dialog.accept();
      });
    } else {
      this.page.once('dialog', async dialog => {
        await dialog.dismiss();
      });
    }
  }

  /**
   * Get scenario information from a scenario card
   * @param {string} scenarioName - Name of the scenario
   * @returns {Promise<{name: string, target: string, method: string, virtualUsers: string, duration: string}>}
   */
  async getScenarioInfo(scenarioName: string): Promise<{
    name: string;
    target: string;
    method: string;
    virtualUsers: string;
    duration: string;
  }> {
    const card = this.getScenarioCard(scenarioName);
    
    const name = await card.getByRole('heading', { level: 3 }).textContent() || '';
    const target = await card.getByText(/Target:/).locator('..').locator('p').textContent() || '';
    const method = await card.getByText(/Method:/).locator('..').locator('p').textContent() || '';
    const virtualUsers = await card.getByText(/Virtual Users:/).locator('..').locator('p').textContent() || '';
    const duration = await card.getByText(/Duration:/).locator('..').locator('p').textContent() || '';
    
    return { name, target, method, virtualUsers, duration };
  }

  /**
   * Check if a scenario exists in the list
   * @param {string} scenarioName - Name of the scenario to check
   * @returns {Promise<boolean>} True if scenario exists, false otherwise
   */
  async scenarioExists(scenarioName: string): Promise<boolean> {
    const card = this.getScenarioCard(scenarioName);
    return await card.isVisible().catch(() => false);
  }

  /**
   * Get the count of visible scenarios
   * @returns {Promise<number>} Number of scenarios
   */
  async getScenarioCount(): Promise<number> {
    await this.waitForScenariosToLoad();
    const scenarios = this.page.locator('[class*="scenario"]').filter({ hasText: /Target:/ });
    return await scenarios.count();
  }

  /**
   * Verify the "Browse Templates" button is visible
   * @returns {Promise<boolean>} True if visible
   */
  async isBrowseTemplatesVisible(): Promise<boolean> {
    return await this.browseTemplatesButton.isVisible();
  }

  /**
   * Verify the "New Scenario" button is visible
   * @returns {Promise<boolean>} True if visible
   */
  async isNewScenarioButtonVisible(): Promise<boolean> {
    return await this.newScenarioButton.isVisible();
  }
}
