import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * LoadPattern enum - Represents available load testing patterns
 */
export enum LoadPattern {
  CONSTANT = 'Constant Load',
  RAMP_UP = 'Ramp-Up',
  RAMP_DOWN = 'Ramp-Down',
  SPIKE = 'Spike Test',
  STRESS = 'Stress Test'
}

/**
 * HttpMethod enum - Represents supported HTTP methods
 */
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

/**
 * NewScenarioPage - Page Object for creating and editing scenarios
 * 
 * Handles all interactions with the scenario creation/editing form:
 * - Basic information (name, description)
 * - HTTP configuration (URL, method, headers, body, auth)
 * - Load configuration (pattern, virtual users, duration)
 * - Advanced options
 * 
 * @class NewScenarioPage
 * @extends BasePage
 * @example
 * ```typescript
 * const newScenarioPage = new NewScenarioPage(page);
 * await newScenarioPage.goto();
 * await newScenarioPage.fillBasicInfo('My Test', 'Test description');
 * await newScenarioPage.fillHttpConfig('https://api.example.com', HttpMethod.GET);
 * await newScenarioPage.setLoadConfig(2, 60, 5);
 * await newScenarioPage.createScenario();
 * ```
 */
export class NewScenarioPage extends BasePage {
  // Basic Information locators
  readonly scenarioNameInput: Locator;
  readonly descriptionInput: Locator;
  
  // HTTP Configuration locators
  readonly targetUrlInput: Locator;
  readonly testUrlButton: Locator;
  readonly httpMethodSelect: Locator;
  
  // Request builder tabs
  readonly paramsTab: Locator;
  readonly headersTab: Locator;
  readonly bodyTab: Locator;
  readonly authTab: Locator;
  readonly testsTab: Locator;
  readonly previewTab: Locator;
  
  // Load Configuration locators
  readonly virtualUsersInput: Locator;
  readonly durationInput: Locator;
  readonly rampUpTimeInput: Locator;
  readonly loadPatternPreview: Locator;
  
  // Action buttons
  readonly saveAsTemplateButton: Locator;
  readonly cancelButton: Locator;
  readonly validateButton: Locator;
  readonly createScenarioButton: Locator;
  readonly advancedOptionsToggle: Locator;

  /**
   * Creates an instance of NewScenarioPage
   * @param {Page} page - Playwright page object
   */
  constructor(page: Page) {
    super(page);
    
    // Initialize basic information locators
    this.scenarioNameInput = page.getByRole('textbox', { name: /e\.g\., Login API Load Test/i });
    this.descriptionInput = page.getByRole('textbox', { name: /Describe what this test scenario does/i });
    
    // Initialize HTTP configuration locators
    this.targetUrlInput = page.getByRole('textbox', { name: /https:\/\/api\.example\.com\/endpoint/i });
    this.testUrlButton = page.getByRole('button', { name: 'Test' });
    this.httpMethodSelect = page.getByRole('combobox');
    
    // Initialize request builder tabs
    this.paramsTab = page.getByRole('button', { name: 'Params' });
    this.headersTab = page.getByRole('button', { name: 'Headers' });
    this.bodyTab = page.getByRole('button', { name: 'Body' });
    this.authTab = page.getByRole('button', { name: 'Auth' });
    this.testsTab = page.getByRole('button', { name: 'Tests' });
    this.previewTab = page.getByRole('button', { name: 'Preview' });
    
    // Initialize load configuration locators
    this.virtualUsersInput = page.getByRole('spinbutton').filter({ has: page.getByText(/Virtual Users/) });
    this.durationInput = page.getByRole('spinbutton').filter({ has: page.getByText(/Duration \(seconds\)/) });
    this.rampUpTimeInput = page.getByRole('spinbutton').filter({ has: page.getByText(/Ramp-up Time/) });
    this.loadPatternPreview = page.locator('[class*="preview"], [class*="chart"]').first();
    
    // Initialize action buttons
    this.saveAsTemplateButton = page.getByRole('button', { name: '💾 Save as Template' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.validateButton = page.getByRole('button', { name: 'Validate' });
    this.createScenarioButton = page.getByRole('button', { name: 'Create Scenario' });
    this.advancedOptionsToggle = page.getByRole('button', { name: 'Advanced HTTP Options' });
  }

  /**
   * Navigate to the New Scenario page
   * @returns {Promise<void>}
   */
  async goto(): Promise<void> {
    await this.page.goto('/scenarios/new');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Fill in basic scenario information
   * @param {string} name - Scenario name
   * @param {string} description - Scenario description (optional)
   * @returns {Promise<void>}
   */
  async fillBasicInfo(name: string, description?: string): Promise<void> {
    await this.scenarioNameInput.fill(name);
    if (description) {
      await this.descriptionInput.fill(description);
    }
  }

  /**
   * Fill in HTTP configuration
   * @param {string} url - Target URL
   * @param {HttpMethod} method - HTTP method (default: GET)
   * @returns {Promise<void>}
   */
  async fillHttpConfig(url: string, method: HttpMethod = HttpMethod.GET): Promise<void> {
    await this.targetUrlInput.fill(url);
    
    if (method !== HttpMethod.GET) {
      await this.httpMethodSelect.selectOption(method);
    }
  }

  /**
   * Test the target URL connection
   * @returns {Promise<void>}
   */
  async testUrl(): Promise<void> {
    await this.testUrlButton.click();
    // Wait for test result (implementation depends on UI feedback)
    await this.page.waitForTimeout(1000);
  }

  /**
   * Select a load pattern
   * @param {LoadPattern} pattern - Load pattern to select
   * @returns {Promise<void>}
   */
  async selectLoadPattern(pattern: LoadPattern): Promise<void> {
    const patternButton = this.page.getByRole('button', { name: new RegExp(pattern, 'i') });
    await patternButton.click();
  }

  /**
   * Set load configuration parameters
   * @param {number} virtualUsers - Number of virtual users
   * @param {number} duration - Test duration in seconds
   * @param {number} rampUpTime - Ramp-up time in seconds (optional, default: 10)
   * @returns {Promise<void>}
   */
  async setLoadConfig(virtualUsers: number, duration: number, rampUpTime: number = 10): Promise<void> {
    // Clear and fill virtual users
    await this.virtualUsersInput.clear();
    await this.virtualUsersInput.fill(virtualUsers.toString());
    
    // Clear and fill duration
    await this.durationInput.clear();
    await this.durationInput.fill(duration.toString());
    
    // Clear and fill ramp-up time
    await this.rampUpTimeInput.clear();
    await this.rampUpTimeInput.fill(rampUpTime.toString());
  }

  /**
   * Click the Headers tab and wait for it to be active
   * @returns {Promise<void>}
   */
  async goToHeadersTab(): Promise<void> {
    await this.headersTab.click();
  }

  /**
   * Click the Body tab and wait for it to be active
   * @returns {Promise<void>}
   */
  async goToBodyTab(): Promise<void> {
    await this.bodyTab.click();
  }

  /**
   * Click the Preview tab and wait for it to be active
   * @returns {Promise<void>}
   */
  async goToPreviewTab(): Promise<void> {
    await this.previewTab.click();
  }

  /**
   * Toggle advanced HTTP options
   * @returns {Promise<void>}
   */
  async toggleAdvancedOptions(): Promise<void> {
    await this.advancedOptionsToggle.click();
  }

  /**
   * Create the scenario (submit the form)
   * @returns {Promise<void>}
   */
  async createScenario(): Promise<void> {
    await this.createScenarioButton.click();
    // Wait for redirect to scenarios list
    await this.page.waitForURL('/scenarios', { timeout: 10000 });
  }

  /**
   * Validate the scenario configuration
   * @returns {Promise<void>}
   */
  async validateScenario(): Promise<void> {
    await this.validateButton.click();
  }

  /**
   * Cancel scenario creation and return to scenarios list
   * @returns {Promise<void>}
   */
  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  /**
   * Save scenario as a template
   * @returns {Promise<void>}
   */
  async saveAsTemplate(): Promise<void> {
    await this.saveAsTemplateButton.click();
  }

  /**
   * Check if the load pattern preview is visible
   * @returns {Promise<boolean>} True if preview is visible
   */
  async isLoadPatternPreviewVisible(): Promise<boolean> {
    return await this.loadPatternPreview.isVisible().catch(() => false);
  }

  /**
   * Get validation error message for a field
   * @param {string} fieldLabel - Label of the field to check
   * @returns {Promise<string>} Error message text
   */
  async getValidationError(fieldLabel: string): Promise<string> {
    const errorLocator = this.page.locator(`text=${fieldLabel}`).locator('..').locator('[class*="error"]');
    return await errorLocator.textContent() || '';
  }

  /**
   * Check if Create Scenario button is enabled
   * @returns {Promise<boolean>} True if enabled
   */
  async isCreateButtonEnabled(): Promise<boolean> {
    return await this.createScenarioButton.isEnabled();
  }

  /**
   * Fill complete scenario form (convenience method)
   * @param {Object} config - Scenario configuration
   * @param {string} config.name - Scenario name
   * @param {string} config.description - Scenario description
   * @param {string} config.url - Target URL
   * @param {HttpMethod} config.method - HTTP method
   * @param {number} config.virtualUsers - Number of virtual users
   * @param {number} config.duration - Duration in seconds
   * @param {number} config.rampUpTime - Ramp-up time in seconds
   * @param {LoadPattern} config.loadPattern - Load pattern
   * @returns {Promise<void>}
   */
  async fillCompleteForm(config: {
    name: string;
    description?: string;
    url: string;
    method?: HttpMethod;
    virtualUsers: number;
    duration: number;
    rampUpTime?: number;
    loadPattern?: LoadPattern;
  }): Promise<void> {
    await this.fillBasicInfo(config.name, config.description);
    await this.fillHttpConfig(config.url, config.method || HttpMethod.GET);
    
    if (config.loadPattern) {
      await this.selectLoadPattern(config.loadPattern);
    }
    
    await this.setLoadConfig(
      config.virtualUsers,
      config.duration,
      config.rampUpTime || 10
    );
  }
}
