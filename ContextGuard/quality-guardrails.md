# Quality Guardrails - ContextGuard

## Purpose
Define comprehensive code quality standards for Playwright test automation that ensure maintainability, reliability, and scalability.

---

## 1. Code Quality Standards

### 1.1 Naming Conventions

#### ✅ CHECKPOINT: Naming Convention Compliance
**Verification Required:** All code must follow these naming patterns exactly.

##### Classes and Interfaces
```typescript
// ✅ CORRECT - PascalCase for classes
class LoginPage extends BasePage {}
class UserProfilePage extends BasePage {}
interface PageElements {}
interface TestConfig {}

// ❌ INCORRECT
class loginPage extends BasePage {}
class user_profile_page extends BasePage {}
```

##### Methods and Functions
```typescript
// ✅ CORRECT - camelCase, descriptive verbs
async navigateToLoginPage(): Promise<void>
async fillLoginCredentials(username: string, password: string): Promise<void>
async verifyElementIsVisible(selector: string): Promise<boolean>

// ❌ INCORRECT
async NavigateToLoginPage(): Promise<void>  // PascalCase
async login(): Promise<void>  // Too generic
async doIt(): Promise<void>  // Non-descriptive
```

##### Variables and Constants
```typescript
// ✅ CORRECT
const DEFAULT_TIMEOUT = 30000;
const API_BASE_URL = 'https://api.example.com';
let currentUserEmail: string;
let isAuthenticated: boolean;

// ❌ INCORRECT
const default_timeout = 30000;  // snake_case
const apibaseurl = 'https://api.example.com';  // Missing separators
let x: string;  // Non-descriptive
```

##### Test Files and Specs
```typescript
// ✅ CORRECT - Descriptive, follows pattern
// File: login-authentication.spec.ts
test.describe('Login Authentication Flow', () => {
  test('should successfully login with valid credentials', async ({ page }) => {
    // Test implementation
  });
});

// ❌ INCORRECT
// File: test1.spec.ts
test('login test', async ({ page }) => {
  // Vague description
});
```

**AGENT MUST REPORT:**
```
✅ STEP 1.1 COMPLETED: Naming Convention Compliance
- What was done: Verified/applied naming conventions to [specific files/classes/methods]
- Classes: [N] classes verified (PascalCase ✓)
- Methods: [N] methods verified (camelCase, descriptive verbs ✓)
- Variables: [N] variables verified (camelCase/CONSTANT_CASE ✓)
- Test files: [N] files verified (kebab-case.spec.ts ✓)
- Validation: All naming follows TypeScript/Playwright best practices
```

---

### 1.2 Documentation Requirements

#### ✅ CHECKPOINT: Documentation Completeness
**Verification Required:** All public methods and classes must have JSDoc documentation.

##### Class Documentation
```typescript
/**
 * Represents the Login page of the application.
 * Provides methods for authentication workflows and element interactions.
 * 
 * @class LoginPage
 * @extends {BasePage}
 * 
 * @example
 * const loginPage = new LoginPage(page);
 * await loginPage.navigateToLoginPage();
 * await loginPage.performLogin('user@example.com', 'password123');
 */
export class LoginPage extends BasePage {
  // Implementation
}
```

##### Method Documentation
```typescript
/**
 * Performs a complete login operation with provided credentials.
 * 
 * @async
 * @param {string} username - The user's email or username
 * @param {string} password - The user's password
 * @returns {Promise<void>}
 * @throws {Error} If login fails or elements are not found
 * 
 * @example
 * await loginPage.performLogin('test@example.com', 'SecurePass123');
 */
async performLogin(username: string, password: string): Promise<void> {
  // Implementation
}
```

##### Complex Logic Documentation
```typescript
/**
 * Waits for a dynamic element to appear and validates its state.
 * Implements retry logic with exponential backoff.
 * 
 * @async
 * @param {string} selector - CSS or data-testid selector
 * @param {number} [maxRetries=3] - Maximum number of retry attempts
 * @param {number} [baseDelay=1000] - Base delay in milliseconds for exponential backoff
 * @returns {Promise<Locator>} The located element
 * @throws {TimeoutError} If element is not found after all retries
 * 
 * @remarks
 * Uses exponential backoff: delay = baseDelay * (2 ^ attemptNumber)
 * Suitable for elements that load asynchronously or require API calls
 */
async waitForDynamicElement(
  selector: string, 
  maxRetries: number = 3, 
  baseDelay: number = 1000
): Promise<Locator> {
  // Implementation with retry logic
}
```

##### Configuration and Type Documentation
```typescript
/**
 * Configuration options for test environment setup.
 * 
 * @interface TestConfig
 * @property {string} baseUrl - Base URL for the application under test
 * @property {number} timeout - Default timeout in milliseconds
 * @property {boolean} headless - Whether to run browser in headless mode
 * @property {string[]} browsers - List of browsers to test against
 */
interface TestConfig {
  baseUrl: string;
  timeout: number;
  headless: boolean;
  browsers: string[];
}
```

**AGENT MUST REPORT:**
```
✅ STEP 1.2 COMPLETED: Documentation Completeness
- What was done: Added/verified JSDoc documentation for [specific components]
- Classes documented: [N/N] (100% ✓)
- Public methods documented: [N/N] (100% ✓)
- Complex logic explained: [N] methods with detailed comments ✓
- Examples provided: [N] usage examples included ✓
- Validation: All documentation follows JSDoc standards with @param, @returns, @throws
```

---

### 1.3 TypeScript Strict Mode Compliance

#### ✅ CHECKPOINT: TypeScript Type Safety
**Verification Required:** All code must be strictly typed with no `any` types (except explicitly justified).

##### Strict Configuration
```typescript
// tsconfig.json must include:
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}
```

##### Type Safety Examples
```typescript
// ✅ CORRECT - Explicit types
interface UserCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

async function login(credentials: UserCredentials): Promise<void> {
  const { username, password, rememberMe = false } = credentials;
  // Implementation
}

// ✅ CORRECT - Proper null handling
async function getElement(selector: string): Promise<Locator | null> {
  try {
    const element = this.page.locator(selector);
    const count = await element.count();
    return count > 0 ? element : null;
  } catch (error) {
    return null;
  }
}

// ❌ INCORRECT - Using 'any'
async function doSomething(data: any): Promise<any> {
  // Loses type safety
}

// ✅ CORRECT - Using generics instead of 'any'
async function processData<T>(data: T): Promise<T> {
  // Maintains type safety
  return data;
}
```

##### Type Guards
```typescript
// ✅ CORRECT - Type guards for runtime validation
function isValidUser(obj: unknown): obj is UserCredentials {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'username' in obj &&
    'password' in obj &&
    typeof (obj as UserCredentials).username === 'string' &&
    typeof (obj as UserCredentials).password === 'string'
  );
}

// Usage with type safety
function processUser(data: unknown): void {
  if (isValidUser(data)) {
    // TypeScript knows data is UserCredentials here
    console.log(data.username);
  }
}
```

**AGENT MUST REPORT:**
```
✅ STEP 1.3 COMPLETED: TypeScript Type Safety
- What was done: Enforced strict typing in [specific files/functions]
- Explicit types added: [N] instances ✓
- 'any' types eliminated: [N] replaced with proper types ✓
- Null checks added: [N] proper null/undefined handling ✓
- Type guards implemented: [N] runtime validation functions ✓
- Validation: TypeScript compiles with --strict flag, zero type errors
```

---

### 1.4 Testing Standards

#### ✅ CHECKPOINT: Test Coverage and Quality
**Verification Required:** All features must have comprehensive test coverage with proper assertions.

##### Test Structure
```typescript
// ✅ CORRECT - Well-structured test with clear AAA pattern
test.describe('User Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Setup: Navigate to login page
    await page.goto('/login');
  });

  test('should successfully authenticate user with valid credentials', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const validCredentials = {
      username: 'testuser@example.com',
      password: 'ValidPass123!'
    };

    // Act
    await loginPage.fillUsername(validCredentials.username);
    await loginPage.fillPassword(validCredentials.password);
    await loginPage.clickLoginButton();

    // Assert
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('[data-testid="welcome-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="user-email"]')).toHaveText(validCredentials.username);
  });

  test('should display error message for invalid credentials', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const invalidCredentials = {
      username: 'invalid@example.com',
      password: 'WrongPassword'
    };

    // Act
    await loginPage.fillUsername(invalidCredentials.username);
    await loginPage.fillPassword(invalidCredentials.password);
    await loginPage.clickLoginButton();

    // Assert
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-message"]'))
      .toHaveText('Invalid username or password');
    await expect(page).toHaveURL(/.*login/);  // Should stay on login page
  });
});
```

##### Assertion Quality
```typescript
// ✅ CORRECT - Multiple specific assertions
test('should validate shopping cart total', async ({ page }) => {
  const cartPage = new CartPage(page);
  
  // Verify cart has items
  await expect(cartPage.getCartItems()).toHaveCount(3);
  
  // Verify specific item prices
  await expect(cartPage.getItemPrice('product-1')).toHaveText('$29.99');
  await expect(cartPage.getItemPrice('product-2')).toHaveText('$49.99');
  
  // Verify subtotal calculation
  await expect(cartPage.getSubtotal()).toHaveText('$79.98');
  
  // Verify tax calculation
  await expect(cartPage.getTax()).toHaveText('$8.00');
  
  // Verify final total
  await expect(cartPage.getGrandTotal()).toHaveText('$87.98');
});

// ❌ INCORRECT - Vague or insufficient assertions
test('cart works', async ({ page }) => {
  await page.goto('/cart');
  const total = await page.locator('.total').textContent();
  // No assertions, just checking content exists
});
```

##### Test Data Management
```typescript
// ✅ CORRECT - Centralized test data
// test-data/users.ts
export const TEST_USERS = {
  validUser: {
    username: 'testuser@example.com',
    password: process.env.TEST_USER_PASSWORD!,
    expectedName: 'Test User'
  },
  adminUser: {
    username: 'admin@example.com',
    password: process.env.ADMIN_PASSWORD!,
    expectedRole: 'Administrator'
  }
} as const;

// Usage in tests
test('admin can access admin panel', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.performLogin(TEST_USERS.adminUser.username, TEST_USERS.adminUser.password);
  
  await expect(page.locator('[data-testid="admin-panel"]')).toBeVisible();
});
```

##### Test Independence
```typescript
// ✅ CORRECT - Each test is independent
test.describe('Product Management', () => {
  test.beforeEach(async ({ page }) => {
    // Each test starts with clean state
    await page.goto('/products');
    await clearTestData();  // Clean up any previous test data
  });

  test('should create new product', async ({ page }) => {
    // Test creates its own data
    const productPage = new ProductPage(page);
    await productPage.createProduct(generateTestProduct());
    // Assertions
  });

  test('should edit existing product', async ({ page }) => {
    // Test creates its own test data, doesn't rely on previous test
    const productPage = new ProductPage(page);
    const testProduct = await productPage.createProduct(generateTestProduct());
    await productPage.editProduct(testProduct.id, { name: 'Updated Name' });
    // Assertions
  });
});
```

**AGENT MUST REPORT:**
```
✅ STEP 1.4 COMPLETED: Test Coverage and Quality
- What was done: Created/verified comprehensive tests for [specific features]
- Test files created/updated: [N] files ✓
- Test cases: [N] total tests (positive: [N], negative: [N], edge cases: [N]) ✓
- AAA pattern: [N/N] tests follow Arrange-Act-Assert (100% ✓)
- Assertions per test: Average [N] assertions, all specific and meaningful ✓
- Test independence: [N/N] tests are independent (100% ✓)
- Test data: Centralized in test-data/ directory ✓
- Validation: All tests pass, no flaky tests, coverage meets standards
```

---

### 1.5 Code Organization and Structure

#### ✅ CHECKPOINT: Project Structure Compliance
**Verification Required:** All files must be organized according to project structure standards.

##### Directory Structure
```
tests/
├── pages/               # Page Object Models
│   ├── base.page.ts    # Base page class with common methods
│   ├── login.page.ts
│   ├── dashboard.page.ts
│   └── index.ts        # Barrel export
├── fixtures/            # Test fixtures and setup
│   ├── test-fixtures.ts
│   └── custom-fixtures.ts
├── test-data/          # Test data and constants
│   ├── users.ts
│   ├── products.ts
│   └── config.ts
├── utils/              # Helper utilities
│   ├── api-helpers.ts
│   ├── data-generators.ts
│   └── assertions.ts
├── specs/              # Test specifications
│   ├── auth/
│   │   ├── login.spec.ts
│   │   └── logout.spec.ts
│   ├── user-management/
│   │   └── user-crud.spec.ts
│   └── e2e/
│       └── checkout-flow.spec.ts
└── types/              # TypeScript type definitions
    └── custom-types.ts
```

##### File Organization Rules
```typescript
// ✅ CORRECT - Each page object in its own file
// login.page.ts
export class LoginPage extends BasePage {
  // Login page specific methods
}

// dashboard.page.ts
export class DashboardPage extends BasePage {
  // Dashboard specific methods
}

// ❌ INCORRECT - Multiple page objects in one file
// pages.ts
export class LoginPage extends BasePage {}
export class DashboardPage extends BasePage {}
export class ProfilePage extends BasePage {}
// This violates single responsibility principle
```

##### Barrel Exports
```typescript
// ✅ CORRECT - pages/index.ts
export { BasePage } from './base.page';
export { LoginPage } from './login.page';
export { DashboardPage } from './dashboard.page';
export { ProfilePage } from './profile.page';

// Usage in tests
import { LoginPage, DashboardPage } from '@pages';
```

**AGENT MUST REPORT:**
```
✅ STEP 1.5 COMPLETED: Project Structure Compliance
- What was done: Organized files according to standard structure
- Directories verified/created: [list directories] ✓
- Files properly located: [N/N] files in correct directories (100% ✓)
- Barrel exports: pages/index.ts, fixtures/index.ts, utils/index.ts ✓
- Single responsibility: [N/N] files follow SRP (100% ✓)
- Import paths: Using path aliases (@pages, @utils, @fixtures) ✓
- Validation: Project structure matches approved architecture
```

---

## 2. Code Review Checklist

Before completing any task, the agent MUST verify:

- [ ] All classes, methods, and variables follow naming conventions
- [ ] JSDoc documentation exists for all public APIs
- [ ] No `any` types used without justification
- [ ] TypeScript compiles with --strict flag
- [ ] Tests follow AAA pattern (Arrange, Act, Assert)
- [ ] Minimum 3 assertions per test
- [ ] Test data is externalized and environment-agnostic
- [ ] Files are in correct directories per project structure
- [ ] No hardcoded values (use constants or config)
- [ ] Error handling is comprehensive
- [ ] Performance considerations addressed (efficient selectors, proper waits)

**AGENT MUST REPORT:**
```
✅ QUALITY GUARDRAILS VERIFICATION COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[✓] 1.1 Naming Convention Compliance
[✓] 1.2 Documentation Completeness
[✓] 1.3 TypeScript Type Safety
[✓] 1.4 Test Coverage and Quality
[✓] 1.5 Project Structure Compliance
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
All quality guardrails have been satisfied.
```

---

## Summary

These quality guardrails ensure:
- **Maintainability**: Clear naming and documentation
- **Reliability**: Strong typing and comprehensive tests
- **Scalability**: Organized structure and reusable patterns
- **Consistency**: Standardized approaches across codebase

Every code change must pass through these checkpoints with explicit verification reporting.
