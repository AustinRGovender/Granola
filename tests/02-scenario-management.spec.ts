import { test, expect } from '@playwright/test';
import { ScenariosPage } from './pages/scenarios.page';
import { NewScenarioPage, HttpMethod } from './pages/new-scenario.page';

/**
 * Test Suite: Scenario Management
 * Priority: High
 * 
 * Tests scenario list display, creation, editing, duplication, and deletion functionality.
 * Ensures scenarios can be managed effectively through the UI.
 */
test.describe('Scenario Management', () => {
  let scenariosPage: ScenariosPage;
  let newScenarioPage: NewScenarioPage;

  test.beforeEach(async ({ page }) => {
    scenariosPage = new ScenariosPage(page);
    newScenarioPage = new NewScenarioPage(page);
    await scenariosPage.goto();
  });

  test('should display scenarios list with action buttons', async ({ page }) => {
    // Verify Browse Templates button is visible
    const hasBrowseTemplates = await scenariosPage.isBrowseTemplatesVisible();
    expect(hasBrowseTemplates).toBe(true);
    
    // Verify New Scenario button is visible
    const hasNewScenario = await scenariosPage.isNewScenarioButtonVisible();
    expect(hasNewScenario).toBe(true);
    
    // Verify at least one scenario exists (assuming test data present)
    const scenarioCount = await scenariosPage.getScenarioCount();
    expect(scenarioCount).toBeGreaterThan(0);
  });

  test('should create a new scenario with basic GET configuration', async ({ page }) => {
    // Click New Scenario button
    await scenariosPage.clickNewScenario();
    
    // Verify we're on the new scenario page
    expect(page.url()).toContain('/scenarios/new');
    
    // Fill in scenario details with constraints: 2 VU, 60s duration
    await newScenarioPage.fillCompleteForm({
      name: 'Automated Test Scenario',
      description: 'Created by Playwright automation test',
      url: 'https://jsonplaceholder.typicode.com/posts/1',
      method: HttpMethod.GET,
      virtualUsers: 2,
      duration: 60,
      rampUpTime: 5
    });
    
    // Verify load pattern preview is visible
    const previewVisible = await newScenarioPage.isLoadPatternPreviewVisible();
    expect(previewVisible).toBe(true);
    
    // Create the scenario
    await newScenarioPage.createScenario();
    
    // Verify redirect back to scenarios list
    expect(page.url()).toContain('/scenarios');
    expect(page.url()).not.toContain('/new');
    
    // Verify new scenario appears in the list
    const scenarioExists = await scenariosPage.scenarioExists('Automated Test Scenario');
    expect(scenarioExists).toBe(true);
  });

  test('should display scenario information correctly', async ({ page }) => {
    // Get information from the first available scenario
    const testScenario = 'Echo API - Basic Test';
    
    // Check if test scenario exists, if not skip
    const exists = await scenariosPage.scenarioExists(testScenario);
    if (!exists) {
      test.skip();
    }
    
    const info = await scenariosPage.getScenarioInfo(testScenario);
    
    // Verify all information fields are populated
    expect(info.name).toBeTruthy();
    expect(info.target).toBeTruthy();
    expect(info.method).toBeTruthy();
    expect(info.virtualUsers).toBeTruthy();
    expect(info.duration).toBeTruthy();
    
    // Verify format of fields
    expect(info.method).toMatch(/GET|POST|PUT|PATCH|DELETE/);
    expect(info.duration).toMatch(/\d+s/);
  });

  test('should allow editing an existing scenario', async ({ page }) => {
    // First, create a test scenario to edit
    await scenariosPage.clickNewScenario();
    
    await newScenarioPage.fillCompleteForm({
      name: 'Scenario To Edit',
      description: 'This scenario will be edited',
      url: 'https://jsonplaceholder.typicode.com/posts/1',
      method: HttpMethod.GET,
      virtualUsers: 2,
      duration: 30,
      rampUpTime: 5
    });
    
    await newScenarioPage.createScenario();
    
    // Now edit the scenario
    await scenariosPage.editScenario('Scenario To Edit');
    
    // Verify we're on an edit page (URL should change)
    await page.waitForLoadState('networkidle');
    
    // Modify the scenario name
    await newScenarioPage.scenarioNameInput.clear();
    await newScenarioPage.scenarioNameInput.fill('Scenario Edited Successfully');
    
    // Modify virtual users
    await newScenarioPage.virtualUsersInput.clear();
    await newScenarioPage.virtualUsersInput.fill('1');
    
    // Save changes
    await newScenarioPage.createScenarioButton.click();
    await page.waitForURL('/scenarios');
    
    // Verify edited scenario exists with new name
    const editedExists = await scenariosPage.scenarioExists('Scenario Edited Successfully');
    expect(editedExists).toBe(true);
  });

  test('should duplicate a scenario', async ({ page }) => {
    // Check if a scenario exists to duplicate
    const originalScenario = 'Echo API - Basic Test';
    const exists = await scenariosPage.scenarioExists(originalScenario);
    
    if (!exists) {
      // Create one if it doesn't exist
      await scenariosPage.clickNewScenario();
      await newScenarioPage.fillCompleteForm({
        name: originalScenario,
        url: 'https://jsonplaceholder.typicode.com/posts/1',
        virtualUsers: 2,
        duration: 60
      });
      await newScenarioPage.createScenario();
    }
    
    // Get initial count
    const initialCount = await scenariosPage.getScenarioCount();
    
    // Duplicate the scenario
    await scenariosPage.duplicateScenario(originalScenario);
    
    // Wait for duplication to complete
    await page.waitForTimeout(1000);
    await scenariosPage.waitForScenariosToLoad();
    
    // Verify count increased
    const newCount = await scenariosPage.getScenarioCount();
    expect(newCount).toBeGreaterThan(initialCount);
  });

  test('should delete a scenario with confirmation', async ({ page }) => {
    // Create a scenario specifically for deletion
    await scenariosPage.clickNewScenario();
    
    await newScenarioPage.fillCompleteForm({
      name: 'Scenario To Delete',
      description: 'This scenario will be deleted',
      url: 'https://jsonplaceholder.typicode.com/posts/1',
      virtualUsers: 2,
      duration: 30
    });
    
    await newScenarioPage.createScenario();
    
    // Verify scenario exists
    const existsBefore = await scenariosPage.scenarioExists('Scenario To Delete');
    expect(existsBefore).toBe(true);
    
    // Get count before deletion
    const countBefore = await scenariosPage.getScenarioCount();
    
    // Delete the scenario
    await scenariosPage.deleteScenario('Scenario To Delete', true);
    
    // Wait for deletion to complete
    await page.waitForTimeout(1000);
    await scenariosPage.waitForScenariosToLoad();
    
    // Verify scenario no longer exists
    const existsAfter = await scenariosPage.scenarioExists('Scenario To Delete');
    expect(existsAfter).toBe(false);
    
    // Verify count decreased
    const countAfter = await scenariosPage.getScenarioCount();
    expect(countAfter).toBeLessThan(countBefore);
  });

  test('should enforce required fields validation', async ({ page }) => {
    // Go to new scenario page
    await scenariosPage.clickNewScenario();
    
    // Try to create without filling anything
    await newScenarioPage.createScenarioButton.click();
    
    // Verify we're still on the new scenario page (form didn't submit)
    expect(page.url()).toContain('/scenarios/new');
    
    // Verify form validation prevents submission
    // (Browser native validation should prevent submission)
  });

  test('should validate virtual users within acceptable range', async ({ page }) => {
    await scenariosPage.clickNewScenario();
    
    // Fill basic info
    await newScenarioPage.fillBasicInfo('Test Validation', 'Testing validation');
    await newScenarioPage.fillHttpConfig('https://jsonplaceholder.typicode.com/posts/1');
    
    // Try to set invalid virtual users (negative)
    await newScenarioPage.virtualUsersInput.clear();
    await newScenarioPage.virtualUsersInput.fill('-1');
    
    // Browser should prevent negative values or show validation error
    const value = await newScenarioPage.virtualUsersInput.inputValue();
    expect(parseInt(value)).toBeGreaterThanOrEqual(0);
  });

  test('should display Browse Templates button', async ({ page }) => {
    // Verify Browse Templates button is present and clickable
    await expect(scenariosPage.browseTemplatesButton).toBeVisible();
    await expect(scenariosPage.browseTemplatesButton).toBeEnabled();
  });

  test('should show scenario timestamps', async ({ page }) => {
    // Check if any scenario has timestamp information
    const firstScenario = page.locator('[class*="scenario"]').first();
    const hasTimestamp = await firstScenario.getByText(/Created:|Updated:/).isVisible().catch(() => false);
    
    // If scenarios exist, they should have timestamps
    const scenarioCount = await scenariosPage.getScenarioCount();
    if (scenarioCount > 0) {
      expect(hasTimestamp).toBe(true);
    }
  });
});
