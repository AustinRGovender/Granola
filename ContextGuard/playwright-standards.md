# Playwright Standards - ContextGuard

## Purpose
Define industry-standard best practices for Playwright test automation, focusing on Page Object Model architecture, efficient test design, and reliable automation patterns.

---

## 1. Page Object Model (POM) Architecture

### 1.1 Base Page Implementation

#### ✅ CHECKPOINT: Base Page Structure
**Verification Required:** All page objects must extend a comprehensive base page.

```typescript
/**
 * Base page class providing common functionality for all page objects.
 * Implements reusable methods for navigation, waiting, and interaction.
 * 
 * @abstract
 * @class BasePage
 */
export abstract class BasePage {
  protected readonly page: Page;
  protected readonly baseURL: string;

  constructor(page: Page) {
    this.page = page;
    this.baseURL = process.env.BASE_URL || 'https://example.com';
  }

  /**
   * Navigate to a specific path relative to base URL.
   * 
   * @param {string} path - Relative path to navigate to
   * @param {Object} [options] - Navigation options
   * @returns {Promise<void>}
   */
  async navigateTo(path: string, options?: { waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' }): Promise<void> {
    const url = `${this.baseURL}${path}`;
    await this.page.goto(url, { waitUntil: options?.waitUntil || 'domcontentloaded' });
  }

  /**
   * Wait for an element to be visible with custom timeout.
   * 
   * @param {string} selector - Element selector
   * @param {number} [timeout=30000] - Timeout in milliseconds
   * @returns {Promise<Locator>}
   */
  async waitForElement(selector: string, timeout: number = 30000): Promise<Locator> {
    const locator = this.page.locator(selector);
    await locator.waitFor({ state: 'visible', timeout });
    return locator;
  }

  /**
   * Safely click an element with built-in wait and error handling.
   * 
   * @param {string} selector - Element selector
   * @param {Object} [options] - Click options
   * @returns {Promise<void>}
   * @throws {Error} If element is not clickable
   */
  async safeClick(selector: string, options?: { timeout?: number; force?: boolean }): Promise<void> {
    try {
      const locator = this.page.locator(selector);
      await locator.waitFor({ state: 'visible', timeout: options?.timeout || 10000 });
      await locator.click({ force: options?.force || false });
    } catch (error) {
      throw new Error(`Failed to click element '${selector}': ${(error as Error).message}`);
    }
  }

  /**
   * Fill input field with value and validate.
   * 
   * @param {string} selector - Input field selector
   * @param {string} value - Value to fill
   * @param {boolean} [shouldValidate=true] - Whether to validate the filled value
   * @returns {Promise<void>}
   */
  async safeFill(selector: string, value: string, shouldValidate: boolean = true): Promise<void> {
    const locator = this.page.locator(selector);
    await locator.waitFor({ state: 'visible' });
    await locator.fill(value);
    
    if (shouldValidate) {
      const actualValue = await locator.inputValue();
      if (actualValue !== value) {
        throw new Error(`Fill validation failed for '${selector}'. Expected: '${value}', Got: '${actualValue}'`);
      }
    }
  }

  /**
   * Get text content from element with null safety.
   * 
   * @param {string} selector - Element selector
   * @returns {Promise<string>}
   */
  async getTextContent(selector: string): Promise<string> {
    const locator = this.page.locator(selector);
    await locator.waitFor({ state: 'visible' });
    const text = await locator.textContent();
    return text?.trim() || '';
  }

  /**
   * Check if element is visible without throwing error.
   * 
   * @param {string} selector - Element selector
   * @param {number} [timeout=5000] - Timeout in milliseconds
   * @returns {Promise<boolean>}
   */
  async isElementVisible(selector: string, timeout: number = 5000): Promise<boolean> {
    try {
      await this.page.locator(selector).waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Wait for page to be fully loaded (no pending network requests).
   * 
   * @returns {Promise<void>}
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Take a screenshot for debugging purposes.
   * 
   * @param {string} name - Screenshot name
   * @returns {Promise<Buffer>}
   */
  async takeScreenshot(name: string): Promise<Buffer> {
    return await this.page.screenshot({ 
      path: `screenshots/${name}-${Date.now()}.png`,
      fullPage: true 
    });
  }

  /**
   * Get current page URL.
   * 
   * @returns {string}
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Get current page title.
   * 
   * @returns {Promise<string>}
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }
}
```

**AGENT MUST REPORT:**
```
✅ STEP 1.1 COMPLETED: Base Page Structure
- What was done: Created/verified BasePage class with comprehensive methods
- Common methods implemented: [N] methods (navigate, wait, click, fill, etc.) ✓
- Error handling: All methods include try-catch and descriptive errors ✓
- Null safety: Input validation and null checks implemented ✓
- Documentation: Full JSDoc for all methods ✓
- Validation: BasePage is abstract and provides reusable functionality
```

---

### 1.2 Page Object Implementation

#### ✅ CHECKPOINT: Page Object Standards
**Verification Required:** Each page object must follow POM principles strictly.

```typescript
/**
 * Represents the Login page with authentication functionality.
 * Encapsulates all interactions with login form and related elements.
 * 
 * @class LoginPage
 * @extends {BasePage}
 */
export class LoginPage extends BasePage {
  // Selectors - Use data-testid as primary selector strategy
  private readonly selectors = {
    usernameInput: '[data-testid="username-input"]',
    passwordInput: '[data-testid="password-input"]',
    loginButton: '[data-testid="login-button"]',
    errorMessage: '[data-testid="error-message"]',
    rememberMeCheckbox: '[data-testid="remember-me-checkbox"]',
    forgotPasswordLink: '[data-testid="forgot-password-link"]',
    successMessage: '[data-testid="success-message"]',
    loadingSpinner: '[data-testid="loading-spinner"]'
  } as const;

  // Page-specific locators (lazy-loaded for performance)
  private get usernameInput(): Locator {
    return this.page.locator(this.selectors.usernameInput);
  }

  private get passwordInput(): Locator {
    return this.page.locator(this.selectors.passwordInput);
  }

  private get loginButton(): Locator {
    return this.page.locator(this.selectors.loginButton);
  }

  private get errorMessage(): Locator {
    return this.page.locator(this.selectors.errorMessage);
  }

  /**
   * Navigate to the login page.
   * 
   * @returns {Promise<void>}
   */
  async navigateToLoginPage(): Promise<void> {
    await this.navigateTo('/login');
    await this.waitForPageLoad();
    await this.usernameInput.waitFor({ state: 'visible' });
  }

  /**
   * Fill username field with validation.
   * 
   * @param {string} username - Username or email to enter
   * @returns {Promise<void>}
   * @throws {Error} If username field is not interactive
   */
  async fillUsername(username: string): Promise<void> {
    if (!username || username.trim().length === 0) {
      throw new Error('Username cannot be empty');
    }
    await this.safeFill(this.selectors.usernameInput, username);
  }

  /**
   * Fill password field with validation.
   * 
   * @param {string} password - Password to enter
   * @returns {Promise<void>}
   * @throws {Error} If password field is not interactive
   */
  async fillPassword(password: string): Promise<void> {
    if (!password || password.trim().length === 0) {
      throw new Error('Password cannot be empty');
    }
    await this.safeFill(this.selectors.passwordInput, password);
  }

  /**
   * Click the login button and wait for navigation or error.
   * 
   * @returns {Promise<void>}
   */
  async clickLoginButton(): Promise<void> {
    await this.safeClick(this.selectors.loginButton);
    
    // Wait for either navigation or error message
    await Promise.race([
      this.page.waitForURL(/.*dashboard|home/, { timeout: 10000 }).catch(() => {}),
      this.errorMessage.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {})
    ]);
  }

  /**
   * Perform complete login flow with credentials.
   * High-level method that combines multiple actions.
   * 
   * @param {string} username - Username or email
   * @param {string} password - User password
   * @param {boolean} [rememberMe=false] - Whether to check "Remember Me"
   * @returns {Promise<void>}
   */
  async performLogin(username: string, password: string, rememberMe: boolean = false): Promise<void> {
    await this.navigateToLoginPage();
    await this.fillUsername(username);
    await this.fillPassword(password);
    
    if (rememberMe) {
      await this.toggleRememberMe();
    }
    
    await this.clickLoginButton();
  }

  /**
   * Toggle the "Remember Me" checkbox.
   * 
   * @returns {Promise<void>}
   */
  async toggleRememberMe(): Promise<void> {
    await this.safeClick(this.selectors.rememberMeCheckbox);
  }

  /**
   * Get the error message text if visible.
   * 
   * @returns {Promise<string | null>} Error message or null if not visible
   */
  async getErrorMessage(): Promise<string | null> {
    const isVisible = await this.isElementVisible(this.selectors.errorMessage);
    if (!isVisible) {
      return null;
    }
    return await this.getTextContent(this.selectors.errorMessage);
  }

  /**
   * Verify login page is fully loaded and interactive.
   * 
   * @returns {Promise<boolean>}
   */
  async isLoginPageReady(): Promise<boolean> {
    try {
      await this.usernameInput.waitFor({ state: 'visible', timeout: 5000 });
      await this.passwordInput.waitFor({ state: 'visible', timeout: 5000 });
      await this.loginButton.waitFor({ state: 'visible', timeout: 5000 });
      
      const isButtonEnabled = await this.loginButton.isEnabled();
      return isButtonEnabled;
    } catch {
      return false;
    }
  }

  /**
   * Wait for loading spinner to disappear.
   * 
   * @param {number} [timeout=30000] - Timeout in milliseconds
   * @returns {Promise<void>}
   */
  async waitForLoadingComplete(timeout: number = 30000): Promise<void> {
    try {
      await this.page.locator(this.selectors.loadingSpinner).waitFor({ 
        state: 'hidden', 
        timeout 
      });
    } catch {
      // Loading spinner might not appear for fast operations
      // This is acceptable, so we don't throw
    }
  }

  /**
   * Click "Forgot Password" link and verify navigation.
   * 
   * @returns {Promise<void>}
   */
  async clickForgotPassword(): Promise<void> {
    await this.safeClick(this.selectors.forgotPasswordLink);
    await this.page.waitForURL(/.*forgot-password|reset/, { timeout: 10000 });
  }
}
```

**POM Principles Enforced:**
1. **Encapsulation**: All selectors are private and centralized
2. **Abstraction**: Tests interact with methods, not raw selectors
3. **Reusability**: Common operations are in BasePage
4. **Maintainability**: Selector changes only affect the page object
5. **Readability**: Method names are descriptive and self-documenting

**AGENT MUST REPORT:**
```
✅ STEP 1.2 COMPLETED: Page Object Standards
- What was done: Created/verified [PageName] page object following POM principles
- Extends BasePage: ✓
- Selectors centralized: [N] selectors in private object ✓
- Lazy-loaded locators: Using getter methods for performance ✓
- Public methods: [N] methods with clear responsibilities ✓
- High-level workflows: [N] composite methods (e.g., performLogin) ✓
- Error handling: All methods include validation and error messages ✓
- Documentation: Full JSDoc for class and all public methods ✓
- Validation: Page object encapsulates all interactions, no direct selectors in tests
```

---

## 2. Selector Strategy

### 2.1 Selector Priority

#### ✅ CHECKPOINT: Selector Best Practices
**Verification Required:** All selectors must follow the priority hierarchy.

**Selector Priority (Best to Worst):**
1. **data-testid** (Highest Priority)
2. **Role-based selectors** (getByRole)
3. **Label-based selectors** (getByLabel)
4. **Placeholder** (getByPlaceholder)
5. **Text content** (getByText) - Use sparingly
6. **CSS selectors** (Last Resort)
7. **XPath** (Avoid unless absolutely necessary)

```typescript
// ✅ CORRECT - Priority order examples

// 1. data-testid (BEST)
this.page.locator('[data-testid="submit-button"]')

// 2. Role-based (RECOMMENDED)
this.page.getByRole('button', { name: 'Submit' })
this.page.getByRole('textbox', { name: 'Email' })

// 3. Label-based (GOOD)
this.page.getByLabel('Email address')

// 4. Placeholder (ACCEPTABLE)
this.page.getByPlaceholder('Enter your email')

// 5. Text content (USE SPARINGLY - can break with i18n)
this.page.getByText('Submit', { exact: true })

// 6. CSS selectors (LAST RESORT)
this.page.locator('button.submit-btn')

// ❌ AVOID - XPath (brittle and hard to maintain)
this.page.locator('xpath=//div[@class="form"]//button[contains(text(), "Submit")]')

// ❌ AVOID - Complex CSS chains (brittle)
this.page.locator('div.container > form.login-form > div:nth-child(3) > button')
```

**Best Practices:**
```typescript
// ✅ CORRECT - Resilient selector with fallback
async getSubmitButton(): Promise<Locator> {
  // Try data-testid first
  const byTestId = this.page.locator('[data-testid="submit-button"]');
  if (await byTestId.count() > 0) {
    return byTestId;
  }
  
  // Fallback to role-based
  return this.page.getByRole('button', { name: /submit/i });
}

// ✅ CORRECT - Specific data-testid for dynamic lists
async getProductItem(productId: string): Promise<Locator> {
  return this.page.locator(`[data-testid="product-${productId}"]`);
}

// ✅ CORRECT - Combining selectors for specificity
async getEmailInputInLoginForm(): Promise<Locator> {
  return this.page
    .locator('[data-testid="login-form"]')
    .locator('[data-testid="email-input"]');
}
```

**AGENT MUST REPORT:**
```
✅ STEP 2.1 COMPLETED: Selector Best Practices
- What was done: Verified/implemented selector strategy across [N] page objects
- data-testid usage: [N] selectors using data-testid (primary strategy ✓)
- Role-based selectors: [N] selectors using getByRole ✓
- No XPath usage: Confirmed ✓
- No brittle CSS chains: All selectors are resilient ✓
- Dynamic selectors: [N] selectors for dynamic content with proper IDs ✓
- Validation: All selectors follow priority hierarchy, no fragile selectors
```

---

## 3. Test Design Patterns

### 3.1 Test Independence

#### ✅ CHECKPOINT: Test Independence
**Verification Required:** Each test must be completely independent.

```typescript
// ✅ CORRECT - Independent tests with proper setup
test.describe('Product Management', () => {
  let productPage: ProductPage;

  test.beforeEach(async ({ page }) => {
    // Each test gets fresh page object and setup
    productPage = new ProductPage(page);
    await productPage.navigateToProductsPage();
    
    // Clean state for each test
    await cleanupTestData();
  });

  test('should create new product successfully', async ({ page }) => {
    // Arrange - Generate unique test data
    const productData = {
      name: `Test Product ${Date.now()}`,
      price: 29.99,
      sku: `SKU-${generateRandomString(8)}`
    };

    // Act
    await productPage.clickCreateProductButton();
    await productPage.fillProductForm(productData);
    await productPage.clickSaveButton();

    // Assert
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    const products = await productPage.getProductList();
    expect(products).toContain(productData.name);
  });

  test('should edit existing product', async ({ page }) => {
    // Arrange - Create test data within this test
    const originalProduct = await productPage.createTestProduct({
      name: `Original Product ${Date.now()}`,
      price: 19.99
    });
    
    const updatedData = {
      name: `Updated Product ${Date.now()}`,
      price: 39.99
    };

    // Act
    await productPage.selectProduct(originalProduct.id);
    await productPage.clickEditButton();
    await productPage.fillProductForm(updatedData);
    await productPage.clickSaveButton();

    // Assert
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    const productDetails = await productPage.getProductDetails(originalProduct.id);
    expect(productDetails.name).toBe(updatedData.name);
    expect(productDetails.price).toBe(updatedData.price);
  });

  test.afterEach(async () => {
    // Cleanup after each test
    await cleanupTestData();
  });
});

// ❌ INCORRECT - Tests depend on execution order
test.describe('Product Management - BAD', () => {
  let productId: string;

  test('1. create product', async ({ page }) => {
    // Creates product and stores ID
    productId = await createProduct();
  });

  test('2. edit product', async ({ page }) => {
    // Depends on test 1 running first - FRAGILE!
    await editProduct(productId);
  });

  test('3. delete product', async ({ page }) => {
    // Depends on test 1 and 2 - VERY FRAGILE!
    await deleteProduct(productId);
  });
});
```

**AGENT MUST REPORT:**
```
✅ STEP 3.1 COMPLETED: Test Independence
- What was done: Verified/refactored tests for complete independence
- Independent tests: [N/N] tests are fully independent (100% ✓)
- beforeEach hooks: Proper setup in [N] test suites ✓
- Test data generation: Each test creates its own data ✓
- No shared state: Verified no tests rely on previous test results ✓
- Cleanup: afterEach hooks clean up test data ✓
- Validation: Tests can run in any order, parallel execution safe
```

---

### 3.2 Waits and Timeouts

#### ✅ CHECKPOINT: Proper Wait Strategies
**Verification Required:** All waits must be explicit and purposeful.

```typescript
// ✅ CORRECT - Explicit waits with clear intent

/**
 * Wait for element to be visible before interaction.
 */
async clickSubmitButton(): Promise<void> {
  const button = this.page.locator('[data-testid="submit-button"]');
  await button.waitFor({ state: 'visible', timeout: 10000 });
  await button.click();
}

/**
 * Wait for element to be hidden (e.g., loading spinner).
 */
async waitForLoadingComplete(): Promise<void> {
  await this.page.locator('[data-testid="loading-spinner"]').waitFor({ 
    state: 'hidden', 
    timeout: 30000 
  });
}

/**
 * Wait for specific network response before proceeding.
 */
async waitForProductsLoad(): Promise<void> {
  await this.page.waitForResponse(
    response => response.url().includes('/api/products') && response.status() === 200,
    { timeout: 15000 }
  );
}

/**
 * Wait for URL change after action.
 */
async waitForNavigationToComplete(expectedPath: RegExp): Promise<void> {
  await this.page.waitForURL(expectedPath, { 
    timeout: 10000,
    waitUntil: 'domcontentloaded'
  });
}

/**
 * Wait for dynamic content to load.
 */
async waitForDynamicContent(selector: string): Promise<void> {
  await this.page.waitForFunction(
    (sel) => {
      const element = document.querySelector(sel);
      return element && element.textContent.trim().length > 0;
    },
    selector,
    { timeout: 15000 }
  );
}

// ❌ INCORRECT - Arbitrary sleeps
async clickSubmitButtonBad(): Promise<void> {
  await this.page.waitForTimeout(3000); // BAD: Arbitrary wait
  await this.page.locator('[data-testid="submit-button"]').click();
}

// ✅ CORRECT - Conditional waits
async waitForEitherElement(selector1: string, selector2: string): Promise<string> {
  const result = await Promise.race([
    this.page.locator(selector1).waitFor({ state: 'visible' }).then(() => selector1),
    this.page.locator(selector2).waitFor({ state: 'visible' }).then(() => selector2)
  ]);
  return result;
}

// ✅ CORRECT - Auto-wait with timeout override
async fillFormWithCustomTimeout(formData: Record<string, string>): Promise<void> {
  for (const [field, value] of Object.entries(formData)) {
    const locator = this.page.locator(`[data-testid="${field}"]`);
    await locator.fill(value, { timeout: 5000 }); // Override default timeout
  }
}
```

**Wait Strategy Guidelines:**
1. **Never use `waitForTimeout()`** - Always wait for specific conditions
2. **Use built-in Playwright auto-waiting** - It's smart enough for most cases
3. **Wait for network requests** - When content depends on API calls
4. **Wait for URL changes** - After navigation actions
5. **Wait for element states** - visible, hidden, attached, detached
6. **Set appropriate timeouts** - Based on expected operation duration

**AGENT MUST REPORT:**
```
✅ STEP 3.2 COMPLETED: Proper Wait Strategies
- What was done: Implemented explicit waits across [N] page objects
- Explicit waits: [N] proper waitFor implementations ✓
- No arbitrary sleeps: Confirmed zero waitForTimeout usage ✓
- Network waits: [N] waitForResponse implementations ✓
- URL waits: [N] waitForURL implementations ✓
- Conditional waits: [N] Promise.race patterns for multiple conditions ✓
- Custom timeouts: Appropriate timeouts based on operation type ✓
- Validation: All waits are purposeful and condition-based
```

---

## 4. Test Data Management

### 4.1 Environment-Agnostic Test Data

#### ✅ CHECKPOINT: Externalized Test Data
**Verification Required:** No hardcoded credentials or environment-specific data in tests.

```typescript
// ✅ CORRECT - test-data/users.ts
export interface UserCredentials {
  username: string;
  password: string;
  role: 'admin' | 'user' | 'guest';
  email: string;
}

export const TEST_USERS = {
  standardUser: {
    username: process.env.TEST_USER_USERNAME || 'testuser@example.com',
    password: process.env.TEST_USER_PASSWORD!,
    role: 'user' as const,
    email: process.env.TEST_USER_EMAIL || 'testuser@example.com'
  },
  adminUser: {
    username: process.env.ADMIN_USERNAME || 'admin@example.com',
    password: process.env.ADMIN_PASSWORD!,
    role: 'admin' as const,
    email: process.env.ADMIN_EMAIL || 'admin@example.com'
  }
} as const;

// Validate required environment variables
function validateTestData(): void {
  const required = ['TEST_USER_PASSWORD', 'ADMIN_PASSWORD'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      `Please check your .env file or environment configuration.`
    );
  }
}

validateTestData();

// ✅ CORRECT - test-data/products.ts
export function generateTestProduct(overrides?: Partial<Product>): Product {
  return {
    name: `Test Product ${Date.now()}`,
    sku: `SKU-${Math.random().toString(36).substring(7).toUpperCase()}`,
    price: Math.floor(Math.random() * 1000) / 10 + 9.99,
    description: 'Generated test product for automation',
    inStock: true,
    ...overrides
  };
}

// ✅ CORRECT - Usage in tests
test('admin can create product', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const productPage = new ProductPage(page);
  
  // Use centralized test data
  await loginPage.performLogin(
    TEST_USERS.adminUser.username, 
    TEST_USERS.adminUser.password
  );
  
  // Generate unique test data
  const testProduct = generateTestProduct({
    name: 'Special Admin Product'
  });
  
  await productPage.createProduct(testProduct);
  
  await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
});

// ❌ INCORRECT - Hardcoded credentials
test('login test - BAD', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[data-testid="username"]', 'admin@example.com'); // HARDCODED!
  await page.fill('[data-testid="password"]', 'Password123!'); // SECURITY RISK!
  await page.click('[data-testid="login-button"]');
});
```

**.env.example file:**
```bash
# Test User Credentials
TEST_USER_USERNAME=testuser@example.com
TEST_USER_PASSWORD=YourSecurePasswordHere
TEST_USER_EMAIL=testuser@example.com

# Admin User Credentials
ADMIN_USERNAME=admin@example.com
ADMIN_PASSWORD=YourAdminPasswordHere
ADMIN_EMAIL=admin@example.com

# Environment Configuration
BASE_URL=https://staging.example.com
API_BASE_URL=https://api.staging.example.com

# Test Configuration
DEFAULT_TIMEOUT=30000
SCREENSHOT_ON_FAILURE=true
```

**AGENT MUST REPORT:**
```
✅ STEP 4.1 COMPLETED: Externalized Test Data
- What was done: Centralized all test data and credentials
- Test data files created: test-data/users.ts, test-data/products.ts ✓
- Environment variables: [N] variables used for sensitive data ✓
- .env.example created: Template file for configuration ✓
- No hardcoded credentials: Verified across all test files ✓
- Data generators: [N] generator functions for dynamic test data ✓
- Validation: Environment variables validated at startup ✓
- Validation: All tests use centralized, environment-agnostic data
```

---

## 5. Error Handling and Debugging

### 5.1 Comprehensive Error Handling

#### ✅ CHECKPOINT: Error Handling Standards
**Verification Required:** All methods must have proper error handling with descriptive messages.

```typescript
// ✅ CORRECT - Comprehensive error handling

/**
 * Perform login with detailed error handling and recovery.
 */
async performLoginWithErrorHandling(
  username: string, 
  password: string
): Promise<LoginResult> {
  try {
    // Validate inputs
    if (!username || username.trim().length === 0) {
      throw new Error('Username cannot be empty');
    }
    
    if (!password || password.trim().length === 0) {
      throw new Error('Password cannot be empty');
    }

    // Navigate to login page
    try {
      await this.navigateToLoginPage();
    } catch (error) {
      throw new Error(
        `Failed to navigate to login page: ${(error as Error).message}`
      );
    }

    // Fill credentials
    try {
      await this.fillUsername(username);
      await this.fillPassword(password);
    } catch (error) {
      // Take screenshot for debugging
      await this.takeScreenshot('login-fill-error');
      throw new Error(
        `Failed to fill login credentials: ${(error as Error).message}`
      );
    }

    // Click login button
    try {
      await this.clickLoginButton();
    } catch (error) {
      await this.takeScreenshot('login-button-error');
      throw new Error(
        `Failed to click login button: ${(error as Error).message}`
      );
    }

    // Verify login success or get error message
    try {
      const isSuccess = await this.isLoginSuccessful();
      
      if (!isSuccess) {
        const errorMessage = await this.getErrorMessage();
        return {
          success: false,
          error: errorMessage || 'Login failed with unknown error'
        };
      }

      return { success: true };
    } catch (error) {
      await this.takeScreenshot('login-verification-error');
      throw new Error(
        `Failed to verify login result: ${(error as Error).message}`
      );
    }
  } catch (error) {
    // Log comprehensive error details
    console.error('Login Error Details:', {
      username: username,
      timestamp: new Date().toISOString(),
      error: (error as Error).message,
      stack: (error as Error).stack
    });
    
    throw error;
  }
}

interface LoginResult {
  success: boolean;
  error?: string;
}

/**
 * Safely get element with retry logic.
 */
async getElementWithRetry(
  selector: string, 
  maxRetries: number = 3
): Promise<Locator> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const locator = this.page.locator(selector);
      await locator.waitFor({ state: 'visible', timeout: 5000 });
      return locator;
    } catch (error) {
      lastError = error as Error;
      console.warn(
        `Attempt ${attempt}/${maxRetries} failed to get element '${selector}': ${lastError.message}`
      );
      
      if (attempt < maxRetries) {
        // Exponential backoff
        await this.page.waitForTimeout(1000 * Math.pow(2, attempt - 1));
      }
    }
  }
  
  throw new Error(
    `Failed to get element '${selector}' after ${maxRetries} attempts. ` +
    `Last error: ${lastError?.message}`
  );
}
```

**AGENT MUST REPORT:**
```
✅ STEP 5.1 COMPLETED: Error Handling Standards
- What was done: Implemented comprehensive error handling across [N] methods
- Try-catch blocks: [N] methods with proper error handling ✓
- Descriptive errors: All error messages include context and details ✓
- Error recovery: [N] methods with retry logic ✓
- Screenshot on failure: Implemented for debugging ✓
- Input validation: All public methods validate parameters ✓
- Error logging: Detailed error logs with timestamps and context ✓
- Validation: All error paths are handled, no silent failures
```

---

## Summary

**AGENT MUST PROVIDE FINAL REPORT:**
```
✅ PLAYWRIGHT STANDARDS VERIFICATION COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[✓] 1.1 Base Page Structure
[✓] 1.2 Page Object Standards
[✓] 2.1 Selector Best Practices
[✓] 3.1 Test Independence
[✓] 3.2 Proper Wait Strategies
[✓] 4.1 Externalized Test Data
[✓] 5.1 Error Handling Standards
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
All Playwright standards have been satisfied.
Project follows industry best practices for test automation.
```

These standards ensure reliable, maintainable, and scalable test automation using Playwright with Page Object Model architecture.
