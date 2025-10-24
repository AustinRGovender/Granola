# Architecture Patterns - ContextGuard

## Purpose
Define architectural patterns and design principles for building scalable, maintainable, and testable Playwright test automation frameworks.

---

## 1. Project Architecture

### 1.1 Layered Architecture

#### ✅ CHECKPOINT: Layered Architecture Implementation
**Verification Required:** Project must follow clean layered architecture.

```
┌─────────────────────────────────────────┐
│        Test Layer (Specs)               │
│  - Test scenarios and assertions        │
│  - Business logic validation            │
│  - End-to-end workflows                 │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│     Page Object Layer (POMs)            │
│  - Page interactions and elements       │
│  - UI component abstraction             │
│  - Navigation and state management      │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│      Service Layer (API/Business)       │
│  - API interactions                     │
│  - Business logic helpers               │
│  - Data transformation                  │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│      Utility Layer (Helpers)            │
│  - Common utilities                     │
│  - Data generators                      │
│  - Configuration management             │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│      Data Layer (Test Data)             │
│  - Test data fixtures                   │
│  - Constants and enums                  │
│  - Environment configuration            │
└─────────────────────────────────────────┘
```

**Directory Structure:**
```
tests/
├── specs/                      # Test Layer
│   ├── auth/
│   │   ├── login.spec.ts
│   │   ├── logout.spec.ts
│   │   └── registration.spec.ts
│   ├── user-management/
│   │   ├── user-crud.spec.ts
│   │   └── user-roles.spec.ts
│   └── e2e/
│       └── checkout-flow.spec.ts
│
├── pages/                      # Page Object Layer
│   ├── base.page.ts
│   ├── login.page.ts
│   ├── dashboard.page.ts
│   ├── components/             # Reusable components
│   │   ├── navigation.component.ts
│   │   ├── modal.component.ts
│   │   └── form.component.ts
│   └── index.ts
│
├── services/                   # Service Layer
│   ├── api/
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   └── product.service.ts
│   ├── business/
│   │   ├── cart-calculator.ts
│   │   └── order-processor.ts
│   └── index.ts
│
├── utils/                      # Utility Layer
│   ├── helpers/
│   │   ├── wait-helpers.ts
│   │   ├── assertion-helpers.ts
│   │   └── screenshot-helpers.ts
│   ├── generators/
│   │   ├── user-generator.ts
│   │   ├── product-generator.ts
│   │   └── data-generator.ts
│   └── index.ts
│
├── fixtures/                   # Playwright Fixtures
│   ├── test-fixtures.ts
│   ├── custom-fixtures.ts
│   └── index.ts
│
├── test-data/                  # Data Layer
│   ├── users.ts
│   ├── products.ts
│   ├── config.ts
│   └── constants.ts
│
└── types/                      # TypeScript Types
    ├── page-types.ts
    ├── test-types.ts
    └── api-types.ts
```

**AGENT MUST REPORT:**
```
✅ STEP 1.1 COMPLETED: Layered Architecture Implementation
- What was done: Organized project into clean layers
- Test Layer: [N] spec files organized by feature ✓
- Page Object Layer: [N] page objects with base class ✓
- Service Layer: [N] service classes for API/business logic ✓
- Utility Layer: [N] helper utilities and generators ✓
- Data Layer: [N] test data files with constants ✓
- Component reuse: [N] reusable component classes ✓
- Validation: Clear separation of concerns, no layer violations
```

---

### 1.2 Component-Based Design

#### ✅ CHECKPOINT: Reusable Components
**Verification Required:** Common UI components must be abstracted into reusable classes.

```typescript
/**
 * Base component class for reusable UI components.
 * 
 * @abstract
 * @class BaseComponent
 */
export abstract class BaseComponent {
  protected readonly page: Page;
  protected readonly rootLocator: Locator;

  constructor(page: Page, rootSelector: string) {
    this.page = page;
    this.rootLocator = page.locator(rootSelector);
  }

  /**
   * Wait for component to be visible.
   * 
   * @param {number} [timeout=10000] - Timeout in milliseconds
   * @returns {Promise<void>}
   */
  async waitForVisible(timeout: number = 10000): Promise<void> {
    await this.rootLocator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Check if component is visible.
   * 
   * @returns {Promise<boolean>}
   */
  async isVisible(): Promise<boolean> {
    try {
      await this.rootLocator.waitFor({ state: 'visible', timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Navigation component present across all pages.
 * 
 * @class NavigationComponent
 * @extends {BaseComponent}
 */
export class NavigationComponent extends BaseComponent {
  private readonly selectors = {
    homeLink: '[data-testid="nav-home"]',
    productsLink: '[data-testid="nav-products"]',
    cartLink: '[data-testid="nav-cart"]',
    profileLink: '[data-testid="nav-profile"]',
    logoutButton: '[data-testid="nav-logout"]',
    cartBadge: '[data-testid="cart-badge"]'
  } as const;

  constructor(page: Page) {
    super(page, '[data-testid="navigation"]');
  }

  /**
   * Navigate to home page.
   * 
   * @returns {Promise<void>}
   */
  async navigateToHome(): Promise<void> {
    await this.rootLocator.locator(this.selectors.homeLink).click();
    await this.page.waitForURL(/.*home|dashboard/);
  }

  /**
   * Navigate to products page.
   * 
   * @returns {Promise<void>}
   */
  async navigateToProducts(): Promise<void> {
    await this.rootLocator.locator(this.selectors.productsLink).click();
    await this.page.waitForURL(/.*products/);
  }

  /**
   * Navigate to cart page.
   * 
   * @returns {Promise<void>}
   */
  async navigateToCart(): Promise<void> {
    await this.rootLocator.locator(this.selectors.cartLink).click();
    await this.page.waitForURL(/.*cart/);
  }

  /**
   * Get cart item count from badge.
   * 
   * @returns {Promise<number>}
   */
  async getCartItemCount(): Promise<number> {
    const badge = this.rootLocator.locator(this.selectors.cartBadge);
    const text = await badge.textContent();
    return parseInt(text?.trim() || '0', 10);
  }

  /**
   * Perform logout.
   * 
   * @returns {Promise<void>}
   */
  async logout(): Promise<void> {
    await this.rootLocator.locator(this.selectors.logoutButton).click();
    await this.page.waitForURL(/.*login/);
  }

  /**
   * Verify navigation is loaded.
   * 
   * @returns {Promise<boolean>}
   */
  async isLoaded(): Promise<boolean> {
    try {
      await this.waitForVisible();
      const homeLink = this.rootLocator.locator(this.selectors.homeLink);
      await homeLink.waitFor({ state: 'visible', timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Modal dialog component.
 * 
 * @class ModalComponent
 * @extends {BaseComponent}
 */
export class ModalComponent extends BaseComponent {
  private readonly selectors = {
    title: '[data-testid="modal-title"]',
    message: '[data-testid="modal-message"]',
    confirmButton: '[data-testid="modal-confirm"]',
    cancelButton: '[data-testid="modal-cancel"]',
    closeButton: '[data-testid="modal-close"]'
  } as const;

  constructor(page: Page) {
    super(page, '[data-testid="modal"]');
  }

  /**
   * Get modal title text.
   * 
   * @returns {Promise<string>}
   */
  async getTitle(): Promise<string> {
    const title = this.rootLocator.locator(this.selectors.title);
    return (await title.textContent())?.trim() || '';
  }

  /**
   * Get modal message text.
   * 
   * @returns {Promise<string>}
   */
  async getMessage(): Promise<string> {
    const message = this.rootLocator.locator(this.selectors.message);
    return (await message.textContent())?.trim() || '';
  }

  /**
   * Click confirm button.
   * 
   * @returns {Promise<void>}
   */
  async confirm(): Promise<void> {
    await this.rootLocator.locator(this.selectors.confirmButton).click();
    await this.waitForHidden();
  }

  /**
   * Click cancel button.
   * 
   * @returns {Promise<void>}
   */
  async cancel(): Promise<void> {
    await this.rootLocator.locator(this.selectors.cancelButton).click();
    await this.waitForHidden();
  }

  /**
   * Close modal using close button.
   * 
   * @returns {Promise<void>}
   */
  async close(): Promise<void> {
    await this.rootLocator.locator(this.selectors.closeButton).click();
    await this.waitForHidden();
  }

  /**
   * Wait for modal to be hidden.
   * 
   * @param {number} [timeout=5000] - Timeout in milliseconds
   * @returns {Promise<void>}
   */
  async waitForHidden(timeout: number = 5000): Promise<void> {
    await this.rootLocator.waitFor({ state: 'hidden', timeout });
  }
}

/**
 * Form component with validation.
 * 
 * @class FormComponent
 * @extends {BaseComponent}
 */
export class FormComponent extends BaseComponent {
  constructor(page: Page, formSelector: string) {
    super(page, formSelector);
  }

  /**
   * Fill a form field.
   * 
   * @param {string} fieldName - Field data-testid
   * @param {string} value - Value to fill
   * @returns {Promise<void>}
   */
  async fillField(fieldName: string, value: string): Promise<void> {
    const field = this.rootLocator.locator(`[data-testid="${fieldName}"]`);
    await field.waitFor({ state: 'visible' });
    await field.fill(value);
  }

  /**
   * Get field error message.
   * 
   * @param {string} fieldName - Field data-testid
   * @returns {Promise<string | null>}
   */
  async getFieldError(fieldName: string): Promise<string | null> {
    const errorLocator = this.rootLocator.locator(`[data-testid="${fieldName}-error"]`);
    
    try {
      await errorLocator.waitFor({ state: 'visible', timeout: 2000 });
      return (await errorLocator.textContent())?.trim() || null;
    } catch {
      return null;
    }
  }

  /**
   * Submit form.
   * 
   * @returns {Promise<void>}
   */
  async submit(): Promise<void> {
    const submitButton = this.rootLocator.locator('[type="submit"], [data-testid="submit-button"]');
    await submitButton.click();
  }

  /**
   * Verify form is valid (no error messages).
   * 
   * @returns {Promise<boolean>}
   */
  async isValid(): Promise<boolean> {
    const errors = this.rootLocator.locator('[data-testid$="-error"]');
    const count = await errors.count();
    return count === 0;
  }
}

// ✅ CORRECT - Using components in page objects
export class DashboardPage extends BasePage {
  private navigation: NavigationComponent;
  private modal: ModalComponent;

  constructor(page: Page) {
    super(page);
    this.navigation = new NavigationComponent(page);
    this.modal = new ModalComponent(page);
  }

  /**
   * Navigate to products using navigation component.
   * 
   * @returns {Promise<void>}
   */
  async goToProducts(): Promise<void> {
    await this.navigation.navigateToProducts();
  }

  /**
   * Logout using navigation component.
   * 
   * @returns {Promise<void>}
   */
  async logout(): Promise<void> {
    await this.navigation.logout();
  }

  /**
   * Confirm deletion using modal component.
   * 
   * @returns {Promise<void>}
   */
  async confirmDeletion(): Promise<void> {
    await this.modal.confirm();
  }
}
```

**AGENT MUST REPORT:**
```
✅ STEP 1.2 COMPLETED: Reusable Components
- What was done: Created reusable component classes
- Base component: BaseComponent with common functionality ✓
- Navigation component: NavigationComponent used across pages ✓
- Modal component: ModalComponent for dialog interactions ✓
- Form component: FormComponent with validation helpers ✓
- Component usage: [N] page objects use components ✓
- Code reuse: [N]% reduction in duplicate code ✓
- Validation: All common UI elements abstracted into components
```

---

## 2. Design Patterns

### 2.1 Factory Pattern

#### ✅ CHECKPOINT: Factory Pattern Implementation
**Verification Required:** Complex object creation should use factory pattern.

```typescript
/**
 * Page factory for creating page objects.
 * 
 * @class PageFactory
 */
export class PageFactory {
  /**
   * Create page object based on page type.
   * 
   * @template T
   * @param {Page} page - Playwright page instance
   * @param {PageType} pageType - Type of page to create
   * @returns {T}
   */
  static createPage<T extends BasePage>(page: Page, pageType: PageType): T {
    switch (pageType) {
      case PageType.Login:
        return new LoginPage(page) as T;
      case PageType.Dashboard:
        return new DashboardPage(page) as T;
      case PageType.Products:
        return new ProductsPage(page) as T;
      case PageType.Cart:
        return new CartPage(page) as T;
      case PageType.Checkout:
        return new CheckoutPage(page) as T;
      default:
        throw new Error(`Unknown page type: ${pageType}`);
    }
  }

  /**
   * Create page object by URL pattern.
   * 
   * @param {Page} page - Playwright page instance
   * @returns {Promise<BasePage>}
   */
  static async createPageByUrl(page: Page): Promise<BasePage> {
    const url = page.url();

    if (url.includes('/login')) {
      return new LoginPage(page);
    } else if (url.includes('/dashboard')) {
      return new DashboardPage(page);
    } else if (url.includes('/products')) {
      return new ProductsPage(page);
    } else if (url.includes('/cart')) {
      return new CartPage(page);
    } else {
      throw new Error(`No page object mapped for URL: ${url}`);
    }
  }
}

export enum PageType {
  Login = 'login',
  Dashboard = 'dashboard',
  Products = 'products',
  Cart = 'cart',
  Checkout = 'checkout'
}

/**
 * Test data factory for generating test objects.
 * 
 * @class TestDataFactory
 */
export class TestDataFactory {
  /**
   * Create user object with sensible defaults.
   * 
   * @param {Partial<User>} overrides - Properties to override
   * @returns {User}
   */
  static createUser(overrides?: Partial<User>): User {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(7);

    return {
      id: `user-${timestamp}-${randomId}`,
      email: `testuser+${timestamp}@example.com`,
      username: `testuser_${randomId}`,
      password: 'SecurePass123!',
      firstName: 'Test',
      lastName: 'User',
      role: 'user',
      createdAt: new Date().toISOString(),
      ...overrides
    };
  }

  /**
   * Create admin user.
   * 
   * @param {Partial<User>} overrides - Properties to override
   * @returns {User}
   */
  static createAdminUser(overrides?: Partial<User>): User {
    return this.createUser({
      role: 'admin',
      username: `admin_${Date.now()}`,
      ...overrides
    });
  }

  /**
   * Create product object.
   * 
   * @param {Partial<Product>} overrides - Properties to override
   * @returns {Product}
   */
  static createProduct(overrides?: Partial<Product>): Product {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(7).toUpperCase();

    return {
      id: `prod-${timestamp}`,
      sku: `SKU-${randomId}`,
      name: `Test Product ${randomId}`,
      description: 'Auto-generated test product',
      price: parseFloat((Math.random() * 1000 + 9.99).toFixed(2)),
      category: 'Electronics',
      inStock: true,
      quantity: Math.floor(Math.random() * 100) + 1,
      ...overrides
    };
  }

  /**
   * Create order object.
   * 
   * @param {Partial<Order>} overrides - Properties to override
   * @returns {Order}
   */
  static createOrder(overrides?: Partial<Order>): Order {
    const product = this.createProduct();
    const user = this.createUser();

    return {
      id: `order-${Date.now()}`,
      userId: user.id,
      items: [
        {
          productId: product.id,
          quantity: 1,
          price: product.price
        }
      ],
      total: product.price,
      status: 'pending',
      createdAt: new Date().toISOString(),
      ...overrides
    };
  }

  /**
   * Create batch of users.
   * 
   * @param {number} count - Number of users to create
   * @returns {User[]}
   */
  static createUserBatch(count: number): User[] {
    return Array.from({ length: count }, () => this.createUser());
  }
}

interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
}

interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
  quantity: number;
}

interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
}

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

// ✅ CORRECT - Using factories in tests
test('create and manage user', async ({ page }) => {
  // Use factory to create test data
  const testUser = TestDataFactory.createUser({
    email: 'specific.email@example.com'
  });

  // Use page factory
  const loginPage = PageFactory.createPage<LoginPage>(page, PageType.Login);
  await loginPage.navigateToLoginPage();
  
  // Test continues...
});
```

**AGENT MUST REPORT:**
```
✅ STEP 2.1 COMPLETED: Factory Pattern Implementation
- What was done: Implemented factory patterns for object creation
- Page factory: PageFactory with type-safe page creation ✓
- Data factories: [N] factory methods for test data ✓
- URL-based factory: Dynamic page object creation from URL ✓
- Batch creation: Factory methods for creating multiple objects ✓
- Default values: Sensible defaults with override capability ✓
- Type safety: Generic types ensure compile-time safety ✓
- Validation: Complex object creation centralized in factories
```

---

### 2.2 Builder Pattern

#### ✅ CHECKPOINT: Builder Pattern for Complex Objects
**Verification Required:** Complex test scenarios should use builder pattern.

```typescript
/**
 * Builder for creating complex user test data.
 * 
 * @class UserBuilder
 */
export class UserBuilder {
  private user: Partial<User> = {};

  /**
   * Set email address.
   * 
   * @param {string} email - Email address
   * @returns {UserBuilder}
   */
  withEmail(email: string): this {
    this.user.email = email;
    return this;
  }

  /**
   * Set username.
   * 
   * @param {string} username - Username
   * @returns {UserBuilder}
   */
  withUsername(username: string): this {
    this.user.username = username;
    return this;
  }

  /**
   * Set password.
   * 
   * @param {string} password - Password
   * @returns {UserBuilder}
   */
  withPassword(password: string): this {
    this.user.password = password;
    return this;
  }

  /**
   * Set full name.
   * 
   * @param {string} firstName - First name
   * @param {string} lastName - Last name
   * @returns {UserBuilder}
   */
  withName(firstName: string, lastName: string): this {
    this.user.firstName = firstName;
    this.user.lastName = lastName;
    return this;
  }

  /**
   * Set role.
   * 
   * @param {string} role - User role
   * @returns {UserBuilder}
   */
  withRole(role: 'admin' | 'user' | 'guest'): this {
    this.user.role = role;
    return this;
  }

  /**
   * Set as admin user.
   * 
   * @returns {UserBuilder}
   */
  asAdmin(): this {
    this.user.role = 'admin';
    return this;
  }

  /**
   * Set as verified user.
   * 
   * @returns {UserBuilder}
   */
  asVerified(): this {
    this.user.emailVerified = true;
    this.user.verifiedAt = new Date().toISOString();
    return this;
  }

  /**
   * Add address information.
   * 
   * @param {Address} address - User address
   * @returns {UserBuilder}
   */
  withAddress(address: Address): this {
    this.user.address = address;
    return this;
  }

  /**
   * Build the user object.
   * 
   * @returns {User}
   */
  build(): User {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(7);

    return {
      id: this.user.id || `user-${timestamp}-${randomId}`,
      email: this.user.email || `testuser+${timestamp}@example.com`,
      username: this.user.username || `testuser_${randomId}`,
      password: this.user.password || 'SecurePass123!',
      firstName: this.user.firstName || 'Test',
      lastName: this.user.lastName || 'User',
      role: this.user.role || 'user',
      emailVerified: this.user.emailVerified || false,
      verifiedAt: this.user.verifiedAt,
      address: this.user.address,
      createdAt: this.user.createdAt || new Date().toISOString()
    } as User;
  }
}

/**
 * Builder for creating complex test scenarios.
 * 
 * @class TestScenarioBuilder
 */
export class TestScenarioBuilder {
  private scenario: Partial<TestScenario> = {
    steps: [],
    expectedResults: []
  };

  /**
   * Set scenario name.
   * 
   * @param {string} name - Scenario name
   * @returns {TestScenarioBuilder}
   */
  withName(name: string): this {
    this.scenario.name = name;
    return this;
  }

  /**
   * Add test step.
   * 
   * @param {string} description - Step description
   * @param {Function} action - Step action function
   * @returns {TestScenarioBuilder}
   */
  addStep(description: string, action: (page: Page) => Promise<void>): this {
    this.scenario.steps!.push({ description, action });
    return this;
  }

  /**
   * Add expected result.
   * 
   * @param {string} description - Result description
   * @param {Function} assertion - Assertion function
   * @returns {TestScenarioBuilder}
   */
  expectResult(description: string, assertion: (page: Page) => Promise<void>): this {
    this.scenario.expectedResults!.push({ description, assertion });
    return this;
  }

  /**
   * Set preconditions.
   * 
   * @param {Function} setup - Setup function
   * @returns {TestScenarioBuilder}
   */
  withPreconditions(setup: (page: Page) => Promise<void>): this {
    this.scenario.preconditions = setup;
    return this;
  }

  /**
   * Set cleanup actions.
   * 
   * @param {Function} cleanup - Cleanup function
   * @returns {TestScenarioBuilder}
   */
  withCleanup(cleanup: (page: Page) => Promise<void>): this {
    this.scenario.cleanup = cleanup;
    return this;
  }

  /**
   * Build and execute the test scenario.
   * 
   * @returns {TestScenario}
   */
  build(): TestScenario {
    if (!this.scenario.name) {
      throw new Error('Scenario name is required');
    }

    if (this.scenario.steps!.length === 0) {
      throw new Error('At least one step is required');
    }

    return this.scenario as TestScenario;
  }
}

interface TestScenario {
  name: string;
  steps: TestStep[];
  expectedResults: ExpectedResult[];
  preconditions?: (page: Page) => Promise<void>;
  cleanup?: (page: Page) => Promise<void>;
}

interface TestStep {
  description: string;
  action: (page: Page) => Promise<void>;
}

interface ExpectedResult {
  description: string;
  assertion: (page: Page) => Promise<void>;
}

// ✅ CORRECT - Using builders in tests
test('complex user registration scenario', async ({ page }) => {
  // Build complex user with builder pattern
  const testUser = new UserBuilder()
    .withEmail('premium.user@example.com')
    .withUsername('premium_user')
    .withName('Premium', 'User')
    .withPassword('SuperSecure123!')
    .asVerified()
    .withAddress({
      street: '123 Test St',
      city: 'Test City',
      country: 'Test Country',
      zipCode: '12345'
    })
    .build();

  // Build test scenario
  const scenario = new TestScenarioBuilder()
    .withName('Premium User Registration')
    .withPreconditions(async (page) => {
      await page.goto('/register');
    })
    .addStep('Fill registration form', async (page) => {
      const registerPage = new RegisterPage(page);
      await registerPage.fillEmail(testUser.email);
      await registerPage.fillUsername(testUser.username);
      await registerPage.fillPassword(testUser.password);
    })
    .addStep('Submit form', async (page) => {
      await page.click('[data-testid="submit-button"]');
    })
    .expectResult('Should navigate to dashboard', async (page) => {
      await expect(page).toHaveURL(/.*dashboard/);
    })
    .expectResult('Should show welcome message', async (page) => {
      await expect(page.locator('[data-testid="welcome-message"]')).toBeVisible();
    })
    .withCleanup(async (page) => {
      // Cleanup test data
      await cleanupUser(testUser.id);
    })
    .build();

  // Execute scenario
  await executeScenario(page, scenario);
});
```

**AGENT MUST REPORT:**
```
✅ STEP 2.2 COMPLETED: Builder Pattern for Complex Objects
- What was done: Implemented builder pattern for complex object creation
- User builder: UserBuilder with fluent API ✓
- Scenario builder: TestScenarioBuilder for complex test flows ✓
- Fluent interface: Method chaining for readability ✓
- Validation: Build method validates required fields ✓
- Default values: Builder provides sensible defaults ✓
- Flexibility: Easy to create variants with overrides ✓
- Validation: Complex objects built using maintainable builder pattern
```

---

## 3. Dependency Management

### 3.1 Dependency Injection

#### ✅ CHECKPOINT: Dependency Injection
**Verification Required:** Dependencies should be injected, not hard-coded.

```typescript
/**
 * Base page with dependency injection.
 * 
 * @abstract
 * @class BasePage
 */
export abstract class BasePage {
  protected readonly page: Page;
  protected readonly config: TestConfig;
  protected readonly logger: Logger;

  constructor(
    page: Page,
    config: TestConfig = defaultConfig,
    logger: Logger = consoleLogger
  ) {
    this.page = page;
    this.config = config;
    this.logger = logger;
  }

  async navigateTo(path: string): Promise<void> {
    const url = `${this.config.baseUrl}${path}`;
    this.logger.info(`Navigating to: ${url}`);
    await this.page.goto(url, { 
      waitUntil: this.config.waitUntil,
      timeout: this.config.timeout
    });
  }
}

/**
 * Login page with injected dependencies.
 * 
 * @class LoginPage
 * @extends {BasePage}
 */
export class LoginPage extends BasePage {
  private readonly authService: AuthService;

  constructor(
    page: Page,
    config: TestConfig = defaultConfig,
    logger: Logger = consoleLogger,
    authService: AuthService = new AuthService()
  ) {
    super(page, config, logger);
    this.authService = authService;
  }

  /**
   * Perform login with API verification.
   * 
   * @param {string} username - Username
   * @param {string} password - Password
   * @returns {Promise<void>}
   */
  async performLoginWithVerification(username: string, password: string): Promise<void> {
    this.logger.info(`Attempting login for user: ${username}`);
    
    // UI login
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLoginButton();

    // Verify via API (injected service)
    const isAuthenticated = await this.authService.verifyAuthentication();
    
    if (!isAuthenticated) {
      throw new Error('Login failed - user not authenticated');
    }

    this.logger.info('Login successful');
  }
}

/**
 * Custom Playwright fixtures with dependency injection.
 */
export const test = base.extend<TestFixtures>({
  config: async ({}, use) => {
    const config: TestConfig = {
      baseUrl: process.env.BASE_URL || 'http://localhost:3000',
      apiUrl: process.env.API_URL || 'http://localhost:3001',
      timeout: 30000,
      waitUntil: 'domcontentloaded'
    };
    await use(config);
  },

  logger: async ({}, use) => {
    const logger = new TestLogger();
    await use(logger);
  },

  authService: async ({ config }, use) => {
    const service = new AuthService(config.apiUrl);
    await use(service);
  },

  loginPage: async ({ page, config, logger, authService }, use) => {
    const loginPage = new LoginPage(page, config, logger, authService);
    await use(loginPage);
  }
});

interface TestFixtures {
  config: TestConfig;
  logger: Logger;
  authService: AuthService;
  loginPage: LoginPage;
}

// ✅ CORRECT - Using fixtures with injected dependencies
test('login with injected dependencies', async ({ loginPage }) => {
  // All dependencies injected via fixtures
  await loginPage.navigateToLoginPage();
  await loginPage.performLoginWithVerification('test@example.com', 'password');
});
```

**AGENT MUST REPORT:**
```
✅ STEP 3.1 COMPLETED: Dependency Injection
- What was done: Implemented dependency injection across page objects
- Constructor injection: [N] classes use constructor injection ✓
- Playwright fixtures: Custom fixtures provide dependencies ✓
- Default dependencies: Sensible defaults with override capability ✓
- Testability: Easy to mock dependencies for testing ✓
- Configuration injection: Config objects injected, not hardcoded ✓
- Service injection: API services injected into page objects ✓
- Validation: Dependencies are injected, promoting loose coupling
```

---

## Summary

**AGENT MUST PROVIDE FINAL REPORT:**
```
✅ ARCHITECTURE PATTERNS VERIFICATION COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[✓] 1.1 Layered Architecture Implementation
[✓] 1.2 Reusable Components
[✓] 2.1 Factory Pattern Implementation
[✓] 2.2 Builder Pattern for Complex Objects
[✓] 3.1 Dependency Injection
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
All architecture patterns have been satisfied.
Project follows clean architecture and SOLID principles.
Code is maintainable, scalable, and testable.
```

These architectural patterns ensure:
- **Maintainability**: Clear layers and separation of concerns
- **Reusability**: Component-based design reduces duplication
- **Flexibility**: Factory and builder patterns simplify object creation
- **Testability**: Dependency injection enables easy testing and mocking
- **Scalability**: Architecture supports growth without major refactoring
