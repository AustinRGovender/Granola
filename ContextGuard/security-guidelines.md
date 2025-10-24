# Security Guidelines - ContextGuard

## Purpose
Enforce security best practices throughout test automation development to prevent vulnerabilities, protect sensitive data, and ensure secure testing practices.

---

## 1. Credential Management

### 1.1 Secure Credential Storage

#### ✅ CHECKPOINT: No Hardcoded Credentials
**Verification Required:** Zero hardcoded credentials or secrets in codebase.

```typescript
// ❌ INCORRECT - Hardcoded credentials (SECURITY RISK)
const username = 'admin@example.com';
const password = 'MyPassword123!';
const apiKey = 'sk_live_123456789abcdefg';

// ✅ CORRECT - Environment variables
const username = process.env.TEST_USERNAME!;
const password = process.env.TEST_PASSWORD!;
const apiKey = process.env.API_KEY!;

// ✅ CORRECT - Validation of required secrets
function validateSecrets(): void {
  const requiredSecrets = [
    'TEST_USERNAME',
    'TEST_PASSWORD',
    'API_KEY',
    'DATABASE_PASSWORD'
  ];

  const missing = requiredSecrets.filter(secret => !process.env[secret]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'These must be set in your .env file or environment configuration.\n' +
      'NEVER commit secrets to version control!'
    );
  }
}

// ✅ CORRECT - Secure credential helper
export class SecureCredentials {
  /**
   * Get credential from environment with validation.
   * 
   * @param {string} key - Environment variable key
   * @returns {string}
   * @throws {Error} If credential is not found
   */
  static getCredential(key: string): string {
    const value = process.env[key];
    
    if (!value || value.trim().length === 0) {
      throw new Error(
        `Credential '${key}' not found in environment variables. ` +
        'Please check your .env file configuration.'
      );
    }
    
    return value;
  }

  /**
   * Get optional credential with default fallback.
   * 
   * @param {string} key - Environment variable key
   * @param {string} defaultValue - Default value if not found
   * @returns {string}
   */
  static getOptionalCredential(key: string, defaultValue: string): string {
    return process.env[key] || defaultValue;
  }

  /**
   * Mask sensitive data for logging.
   * 
   * @param {string} sensitiveData - Data to mask
   * @param {number} [visibleChars=4] - Number of characters to show
   * @returns {string}
   */
  static maskSensitiveData(sensitiveData: string, visibleChars: number = 4): string {
    if (sensitiveData.length <= visibleChars) {
      return '***';
    }
    return sensitiveData.substring(0, visibleChars) + '***';
  }
}

// ✅ CORRECT - Usage example
test('user can login with secure credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  // Get credentials securely
  const username = SecureCredentials.getCredential('TEST_USERNAME');
  const password = SecureCredentials.getCredential('TEST_PASSWORD');
  
  // Log masked credentials for debugging
  console.log('Testing with username:', SecureCredentials.maskSensitiveData(username));
  
  await loginPage.performLogin(username, password);
  await expect(page).toHaveURL(/.*dashboard/);
});
```

**AGENT MUST REPORT:**
```
✅ STEP 1.1 COMPLETED: No Hardcoded Credentials
- What was done: Scanned codebase for hardcoded credentials and secrets
- Files scanned: [N] files checked ✓
- Hardcoded credentials found: 0 (✓)
- Environment variables used: [N] secure credential references ✓
- Credential validation: Startup validation implemented ✓
- Masking utility: SecureCredentials helper class created ✓
- .gitignore updated: .env files excluded from version control ✓
- Validation: Zero secrets in codebase, all credentials externalized
```

---

### 1.2 .env File Security

#### ✅ CHECKPOINT: .env File Protection
**Verification Required:** Proper .env configuration and .gitignore setup.

```bash
# ✅ CORRECT - .gitignore configuration
# Environment files
.env
.env.local
.env.development
.env.test
.env.production
.env.*.local

# Credential files
credentials.json
secrets.json
auth-tokens.json

# Key files
*.pem
*.key
*.cert
*.p12

# Test reports with potential sensitive data
test-results/
playwright-report/
screenshots/
videos/
traces/

# OS files
.DS_Store
Thumbs.db
```

```bash
# ✅ CORRECT - .env.example (template without secrets)
# Test User Credentials (REPLACE WITH ACTUAL VALUES)
TEST_USERNAME=your_test_username_here
TEST_PASSWORD=your_test_password_here

# Admin Credentials (REPLACE WITH ACTUAL VALUES)
ADMIN_USERNAME=your_admin_username_here
ADMIN_PASSWORD=your_admin_password_here

# API Configuration
API_BASE_URL=https://api.staging.example.com
API_KEY=your_api_key_here

# Database Configuration (if needed)
DB_HOST=localhost
DB_PORT=5432
DB_USER=test_user
DB_PASSWORD=your_db_password_here

# Security Note:
# 1. Copy this file to .env
# 2. Replace all placeholder values with actual credentials
# 3. NEVER commit .env to version control
# 4. Keep .env file secure and restrict access
```

**AGENT MUST REPORT:**
```
✅ STEP 1.2 COMPLETED: .env File Protection
- What was done: Configured .env security and version control protection
- .gitignore updated: All sensitive file patterns excluded ✓
- .env.example created: Template file with placeholders ✓
- .env file verification: Confirmed .env is not tracked by Git ✓
- Documentation: Added security notes to .env.example ✓
- File permissions: Recommended chmod 600 for .env on Unix systems ✓
- Validation: Sensitive files cannot be committed to repository
```

---

## 2. Input Validation and Sanitization

### 2.1 Data Validation

#### ✅ CHECKPOINT: Input Validation
**Verification Required:** All user inputs and external data must be validated.

```typescript
// ✅ CORRECT - Comprehensive input validation

/**
 * Validates email address format.
 * 
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates password meets security requirements.
 * 
 * @param {string} password - Password to validate
 * @returns {{ valid: boolean; errors: string[] }}
 */
function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*)');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Sanitizes string input to prevent injection attacks.
 * 
 * @param {string} input - Input to sanitize
 * @returns {string}
 */
function sanitizeInput(input: string): string {
  // Remove potentially dangerous characters
  return input
    .replace(/[<>\"']/g, '') // Remove HTML/script injection chars
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .trim();
}

/**
 * Validates and sanitizes user registration data.
 * 
 * @param {UserRegistrationData} data - Registration data
 * @returns {{ valid: boolean; errors: string[]; sanitizedData?: UserRegistrationData }}
 */
function validateRegistrationData(
  data: UserRegistrationData
): { valid: boolean; errors: string[]; sanitizedData?: UserRegistrationData } {
  const errors: string[] = [];

  // Validate email
  if (!isValidEmail(data.email)) {
    errors.push('Invalid email address format');
  }

  // Validate password
  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.valid) {
    errors.push(...passwordValidation.errors);
  }

  // Validate username
  if (data.username.length < 3 || data.username.length > 50) {
    errors.push('Username must be between 3 and 50 characters');
  }

  if (!/^[a-zA-Z0-9_]+$/.test(data.username)) {
    errors.push('Username can only contain letters, numbers, and underscores');
  }

  // Validate age (if provided)
  if (data.age !== undefined) {
    if (data.age < 13 || data.age > 120) {
      errors.push('Age must be between 13 and 120');
    }
  }

  // Return validation result
  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // Sanitize data before returning
  const sanitizedData: UserRegistrationData = {
    email: sanitizeInput(data.email),
    username: sanitizeInput(data.username),
    password: data.password, // Don't sanitize password, already validated
    firstName: sanitizeInput(data.firstName || ''),
    lastName: sanitizeInput(data.lastName || ''),
    age: data.age
  };

  return {
    valid: true,
    errors: [],
    sanitizedData
  };
}

interface UserRegistrationData {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  age?: number;
}

// ✅ CORRECT - Usage in tests with validation
test('should register new user with valid data', async ({ page }) => {
  const registerPage = new RegisterPage(page);
  
  const testData = {
    email: 'testuser@example.com',
    username: 'testuser123',
    password: 'SecurePass123!',
    firstName: 'Test',
    lastName: 'User',
    age: 25
  };

  // Validate data before using it
  const validation = validateRegistrationData(testData);
  
  if (!validation.valid) {
    throw new Error(`Invalid test data: ${validation.errors.join(', ')}`);
  }

  await registerPage.fillRegistrationForm(validation.sanitizedData!);
  await registerPage.submitForm();

  await expect(page).toHaveURL(/.*dashboard/);
  await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
});

// ❌ INCORRECT - No validation (vulnerable to injection)
test('register user - BAD', async ({ page }) => {
  await page.fill('#email', '<script>alert("xss")</script>'); // No validation!
  await page.fill('#password', '123'); // Weak password, no validation!
  await page.click('#submit');
});
```

**AGENT MUST REPORT:**
```
✅ STEP 2.1 COMPLETED: Input Validation
- What was done: Implemented comprehensive input validation across all forms
- Validation functions: [N] validation utilities created ✓
- Email validation: Regex-based format validation ✓
- Password validation: Multi-criteria security validation ✓
- Sanitization: XSS and injection prevention implemented ✓
- Test data validation: All test data validated before use ✓
- Error messages: Descriptive validation error messages ✓
- Validation: All user inputs validated and sanitized before use
```

---

## 3. Secure API Testing

### 3.1 API Authentication Security

#### ✅ CHECKPOINT: Secure API Authentication
**Verification Required:** API authentication must be handled securely.

```typescript
// ✅ CORRECT - Secure API client with authentication

export class SecureApiClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private authToken: string | null = null;

  constructor() {
    this.baseUrl = process.env.API_BASE_URL!;
    this.apiKey = process.env.API_KEY!;
    
    // Validate required configuration
    if (!this.baseUrl || !this.apiKey) {
      throw new Error('API_BASE_URL and API_KEY must be set in environment variables');
    }
  }

  /**
   * Authenticate and get JWT token.
   * 
   * @param {string} username - Username
   * @param {string} password - Password
   * @returns {Promise<string>} JWT token
   */
  async authenticate(username: string, password: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey
        },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      this.authToken = data.token;
      
      // Log masked token for debugging
      console.log('Authentication successful. Token:', this.maskToken(this.authToken));
      
      return this.authToken;
    } catch (error) {
      // Don't log sensitive credentials
      console.error('Authentication error:', (error as Error).message);
      throw error;
    }
  }

  /**
   * Make authenticated API request.
   * 
   * @param {string} endpoint - API endpoint
   * @param {RequestInit} options - Fetch options
   * @returns {Promise<Response>}
   */
  async makeRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
    if (!this.authToken) {
      throw new Error('Not authenticated. Call authenticate() first.');
    }

    const headers = {
      'Content-Type': 'application/json',
      'X-API-Key': this.apiKey,
      'Authorization': `Bearer ${this.authToken}`,
      ...options.headers
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers
    });

    // Handle token expiration
    if (response.status === 401) {
      this.authToken = null;
      throw new Error('Authentication token expired. Please re-authenticate.');
    }

    return response;
  }

  /**
   * Mask token for logging (show only first 8 chars).
   * 
   * @param {string} token - Token to mask
   * @returns {string}
   */
  private maskToken(token: string): string {
    if (token.length <= 8) {
      return '***';
    }
    return token.substring(0, 8) + '***';
  }

  /**
   * Clear authentication token (logout).
   */
  clearAuth(): void {
    this.authToken = null;
  }
}

// ✅ CORRECT - Secure usage in tests
test('should fetch user data with authenticated API', async ({ page }) => {
  const apiClient = new SecureApiClient();
  
  // Authenticate with secure credentials
  const username = SecureCredentials.getCredential('API_USERNAME');
  const password = SecureCredentials.getCredential('API_PASSWORD');
  
  await apiClient.authenticate(username, password);
  
  // Make authenticated request
  const response = await apiClient.makeRequest('/users/me');
  expect(response.ok).toBe(true);
  
  const userData = await response.json();
  expect(userData).toHaveProperty('id');
  expect(userData).toHaveProperty('email');
  
  // Clear auth after test
  apiClient.clearAuth();
});

// ❌ INCORRECT - Exposed credentials in headers
test('API test - BAD', async ({ request }) => {
  const response = await request.get('https://api.example.com/users', {
    headers: {
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' // HARDCODED TOKEN!
    }
  });
});
```

**AGENT MUST REPORT:**
```
✅ STEP 3.1 COMPLETED: Secure API Authentication
- What was done: Implemented secure API authentication patterns
- API client class: SecureApiClient with authentication management ✓
- Token handling: Secure token storage and masking ✓
- No hardcoded tokens: All tokens obtained through authentication ✓
- Error handling: Token expiration and re-authentication logic ✓
- Cleanup: Token clearing after tests ✓
- Logging: Sensitive data masked in logs ✓
- Validation: All API requests use secure authentication
```

---

## 4. Data Protection in Tests

### 4.1 Sensitive Data Handling

#### ✅ CHECKPOINT: Sensitive Data Protection
**Verification Required:** No sensitive data exposure in logs, screenshots, or reports.

```typescript
// ✅ CORRECT - Safe logging with data masking

export class SecureLogger {
  /**
   * Log information with automatic sensitive data masking.
   * 
   * @param {string} message - Log message
   * @param {Record<string, any>} data - Data to log
   */
  static info(message: string, data?: Record<string, any>): void {
    if (data) {
      const maskedData = this.maskSensitiveData(data);
      console.log(`[INFO] ${message}`, maskedData);
    } else {
      console.log(`[INFO] ${message}`);
    }
  }

  /**
   * Mask sensitive fields in data object.
   * 
   * @param {Record<string, any>} data - Data to mask
   * @returns {Record<string, any>}
   */
  private static maskSensitiveData(data: Record<string, any>): Record<string, any> {
    const sensitiveKeys = [
      'password',
      'token',
      'apiKey',
      'secret',
      'creditCard',
      'ssn',
      'apiSecret',
      'privateKey'
    ];

    const masked = { ...data };

    for (const key of Object.keys(masked)) {
      const lowerKey = key.toLowerCase();
      
      if (sensitiveKeys.some(sensitiveKey => lowerKey.includes(sensitiveKey.toLowerCase()))) {
        masked[key] = '***REDACTED***';
      } else if (typeof masked[key] === 'object' && masked[key] !== null) {
        // Recursively mask nested objects
        masked[key] = this.maskSensitiveData(masked[key]);
      }
    }

    return masked;
  }

  /**
   * Mask credit card number (show only last 4 digits).
   * 
   * @param {string} cardNumber - Credit card number
   * @returns {string}
   */
  static maskCreditCard(cardNumber: string): string {
    const digits = cardNumber.replace(/\s+/g, '');
    if (digits.length < 4) {
      return '***';
    }
    return `****-****-****-${digits.slice(-4)}`;
  }

  /**
   * Mask email (show only first char and domain).
   * 
   * @param {string} email - Email address
   * @returns {string}
   */
  static maskEmail(email: string): string {
    const [username, domain] = email.split('@');
    if (!username || !domain) {
      return '***@***.***';
    }
    return `${username[0]}***@${domain}`;
  }
}

// ✅ CORRECT - Usage in tests
test('payment processing with secure logging', async ({ page }) => {
  const paymentData = {
    cardNumber: '4111111111111111',
    cvv: '123',
    expiryDate: '12/25',
    cardholderName: 'Test User'
  };

  // Log with automatic masking
  SecureLogger.info('Processing payment with card', paymentData);
  // Output: [INFO] Processing payment with card { cardNumber: '***REDACTED***', cvv: '***REDACTED***', ... }

  const paymentPage = new PaymentPage(page);
  await paymentPage.fillPaymentForm(paymentData);
  
  // Take screenshot (no sensitive data visible)
  await page.screenshot({ path: 'screenshots/payment-form.png' });
});

// ✅ CORRECT - Exclude sensitive data from test artifacts
// playwright.config.ts
export default defineConfig({
  use: {
    // Redact sensitive data from traces
    trace: {
      mode: 'on-first-retry',
      snapshots: true,
      screenshots: true,
      // Custom sanitization
      sanitizeContent: true
    },
    
    // Mask sensitive request headers
    extraHTTPHeaders: {
      // Don't log actual API keys
    }
  },

  // Custom screenshot on failure (with masking)
  use: {
    screenshot: {
      mode: 'only-on-failure',
      fullPage: true
    }
  }
});

// ✅ CORRECT - Sanitize test reports
async function sanitizeTestReport(reportPath: string): Promise<void> {
  const report = await fs.readFile(reportPath, 'utf-8');
  
  // Redact sensitive patterns
  let sanitized = report
    .replace(/password[\"']?\s*:\s*[\"'][^\"']+[\"']/gi, 'password: "***REDACTED***"')
    .replace(/token[\"']?\s*:\s*[\"'][^\"']+[\"']/gi, 'token: "***REDACTED***"')
    .replace(/apiKey[\"']?\s*:\s*[\"'][^\"']+[\"']/gi, 'apiKey: "***REDACTED***"')
    .replace(/\d{13,19}/g, '****-****-****-XXXX'); // Credit card numbers
  
  await fs.writeFile(reportPath, sanitized, 'utf-8');
  console.log(`Sanitized test report: ${reportPath}`);
}
```

**AGENT MUST REPORT:**
```
✅ STEP 4.1 COMPLETED: Sensitive Data Protection
- What was done: Implemented comprehensive data masking and protection
- Secure logger: SecureLogger class with automatic masking ✓
- Sensitive fields identified: [N] field patterns marked for redaction ✓
- Screenshot protection: Sensitive data not visible in screenshots ✓
- Test reports sanitized: Automated sanitization of reports ✓
- Trace sanitization: Playwright traces configured to redact data ✓
- Credit card masking: Only last 4 digits visible ✓
- Validation: No sensitive data exposed in artifacts, logs, or reports
```

---

## 5. Secure Test Environment

### 5.1 Environment Isolation

#### ✅ CHECKPOINT: Environment Isolation
**Verification Required:** Tests must not affect production or shared environments.

```typescript
// ✅ CORRECT - Environment validation and isolation

export class EnvironmentValidator {
  private static readonly ALLOWED_ENVIRONMENTS = [
    'local',
    'development',
    'testing',
    'staging'
  ] as const;

  private static readonly PROTECTED_ENVIRONMENTS = [
    'production',
    'prod',
    'live'
  ] as const;

  /**
   * Validate that tests are not running against production.
   * 
   * @throws {Error} If environment is production
   */
  static validateEnvironment(): void {
    const environment = process.env.NODE_ENV?.toLowerCase() || 'development';
    const baseUrl = process.env.BASE_URL?.toLowerCase() || '';

    // Check NODE_ENV
    if (this.PROTECTED_ENVIRONMENTS.includes(environment as any)) {
      throw new Error(
        `🚨 CRITICAL: Tests cannot run in ${environment.toUpperCase()} environment!\n` +
        'This is a safety measure to prevent data corruption.\n' +
        'Set NODE_ENV to "testing", "staging", or "development".'
      );
    }

    // Check URL for production indicators
    const productionIndicators = [
      'production',
      'prod',
      'live',
      'www.',
      '.com' // Be careful with this one
    ];

    const hasProductionIndicator = productionIndicators.some(indicator =>
      baseUrl.includes(indicator)
    );

    if (hasProductionIndicator && !baseUrl.includes('staging') && !baseUrl.includes('test')) {
      console.warn(
        `⚠️  WARNING: BASE_URL (${baseUrl}) may be pointing to production!\n` +
        'Please verify you are using a test environment.'
      );
      
      // Require explicit confirmation
      if (process.env.ALLOW_PRODUCTION_TESTS !== 'true') {
        throw new Error(
          'Tests appear to target production. If this is intentional,\n' +
          'set ALLOW_PRODUCTION_TESTS=true (NOT RECOMMENDED!)'
        );
      }
    }

    console.log(`✓ Environment validated: ${environment} (${baseUrl})`);
  }

  /**
   * Get safe test environment configuration.
   * 
   * @returns {TestEnvironmentConfig}
   */
  static getConfig(): TestEnvironmentConfig {
    this.validateEnvironment();

    return {
      environment: process.env.NODE_ENV || 'testing',
      baseUrl: process.env.BASE_URL || 'http://localhost:3000',
      apiUrl: process.env.API_BASE_URL || 'http://localhost:3001/api',
      databaseUrl: process.env.DATABASE_URL || 'postgresql://localhost:5432/test_db',
      isProduction: false
    };
  }
}

interface TestEnvironmentConfig {
  environment: string;
  baseUrl: string;
  apiUrl: string;
  databaseUrl: string;
  isProduction: boolean;
}

// ✅ CORRECT - Use in test setup
// tests/fixtures/test-fixtures.ts
import { test as base } from '@playwright/test';

export const test = base.extend({
  // Validate environment before each test
  page: async ({ page }, use) => {
    EnvironmentValidator.validateEnvironment();
    await use(page);
  }
});

// ✅ CORRECT - Namespace test data to prevent conflicts
export class TestDataManager {
  private static testRunId = `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  /**
   * Get unique identifier for test run.
   * 
   * @returns {string}
   */
  static getTestRunId(): string {
    return this.testRunId;
  }

  /**
   * Generate unique email for test.
   * 
   * @param {string} prefix - Email prefix
   * @returns {string}
   */
  static generateTestEmail(prefix: string = 'testuser'): string {
    return `${prefix}+${this.testRunId}@test.example.com`;
  }

  /**
   * Generate unique username for test.
   * 
   * @param {string} base - Base username
   * @returns {string}
   */
  static generateTestUsername(base: string = 'user'): string {
    return `${base}_${this.testRunId}`;
  }

  /**
   * Clean up test data after run.
   * 
   * @param {SecureApiClient} apiClient - API client
   */
  static async cleanupTestData(apiClient: SecureApiClient): Promise<void> {
    try {
      await apiClient.makeRequest(`/test-data/${this.testRunId}`, {
        method: 'DELETE'
      });
      console.log(`✓ Test data cleaned up for run: ${this.testRunId}`);
    } catch (error) {
      console.error('Failed to cleanup test data:', (error as Error).message);
    }
  }
}
```

**AGENT MUST REPORT:**
```
✅ STEP 5.1 COMPLETED: Environment Isolation
- What was done: Implemented environment validation and isolation
- Environment validator: Prevents production test execution ✓
- Protected environments: [N] environments blocked (production, prod, live) ✓
- URL validation: Production URL patterns detected and blocked ✓
- Test namespace: Unique test run IDs prevent data conflicts ✓
- Data isolation: Test data tagged with run ID for cleanup ✓
- Cleanup implemented: Automatic test data cleanup after runs ✓
- Validation: Tests cannot run against production, all data isolated
```

---

## 6. Security Testing Practices

### 6.1 Security Test Cases

#### ✅ CHECKPOINT: Security Test Coverage
**Verification Required:** Security-specific test cases must be implemented.

```typescript
// ✅ CORRECT - Security-focused test suite

test.describe('Security Tests - Authentication', () => {
  test('should prevent SQL injection in login form', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    const sqlInjectionAttempts = [
      "' OR '1'='1",
      "admin'--",
      "' OR 1=1--",
      "admin' OR '1'='1'/*"
    ];

    for (const injection of sqlInjectionAttempts) {
      await loginPage.navigateToLoginPage();
      await loginPage.fillUsername(injection);
      await loginPage.fillPassword('anypassword');
      await loginPage.clickLoginButton();

      // Should NOT be logged in
      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage).toBeTruthy();
      await expect(page).not.toHaveURL(/.*dashboard/);
      
      SecureLogger.info('SQL injection prevented', { attempt: injection });
    }
  });

  test('should prevent XSS attacks in form inputs', async ({ page }) => {
    const profilePage = new ProfilePage(page);
    
    const xssPayloads = [
      '<script>alert("XSS")</script>',
      '<img src=x onerror="alert(1)">',
      'javascript:alert("XSS")',
      '<svg onload=alert(1)>'
    ];

    for (const payload of xssPayloads) {
      await profilePage.fillBioField(payload);
      await profilePage.saveProfile();

      // Verify script doesn't execute
      const bioContent = await profilePage.getBioContent();
      expect(bioContent).not.toContain('<script>');
      expect(bioContent).not.toContain('onerror=');
      
      SecureLogger.info('XSS attack prevented', { payload });
    }
  });

  test('should enforce rate limiting on login attempts', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const maxAttempts = 5;
    let isRateLimited = false;

    for (let i = 1; i <= maxAttempts + 2; i++) {
      await loginPage.navigateToLoginPage();
      await loginPage.fillUsername('test@example.com');
      await loginPage.fillPassword('WrongPassword');
      await loginPage.clickLoginButton();

      if (i > maxAttempts) {
        // Should be rate limited
        const errorMessage = await loginPage.getErrorMessage();
        if (errorMessage?.includes('too many attempts') || 
            errorMessage?.includes('rate limit')) {
          isRateLimited = true;
          break;
        }
      }

      await page.waitForTimeout(100); // Small delay between attempts
    }

    expect(isRateLimited).toBe(true);
    SecureLogger.info('Rate limiting is enforced');
  });

  test('should enforce password strength requirements', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    
    const weakPasswords = [
      '123',
      'password',
      'abc123',
      '12345678', // Numbers only
      'abcdefgh', // Letters only
      'Password' // Missing number and special char
    ];

    for (const weakPassword of weakPasswords) {
      await registerPage.navigateToRegisterPage();
      await registerPage.fillEmail('test@example.com');
      await registerPage.fillPassword(weakPassword);
      await registerPage.submitForm();

      // Should show password strength error
      const errorMessage = await registerPage.getPasswordError();
      expect(errorMessage).toBeTruthy();
      expect(errorMessage?.toLowerCase()).toContain('password');
      
      SecureLogger.info('Weak password rejected', { password: '***' });
    }
  });

  test('should have secure session management', async ({ page, context }) => {
    const loginPage = new LoginPage(page);
    
    // Login
    await loginPage.performLogin(
      SecureCredentials.getCredential('TEST_USERNAME'),
      SecureCredentials.getCredential('TEST_PASSWORD')
    );

    // Get cookies
    const cookies = await context.cookies();
    const sessionCookie = cookies.find(c => c.name.includes('session') || c.name.includes('token'));

    if (sessionCookie) {
      // Verify secure flags
      expect(sessionCookie.secure).toBe(true); // HTTPS only
      expect(sessionCookie.httpOnly).toBe(true); // Not accessible via JavaScript
      expect(sessionCookie.sameSite).toBe('Strict'); // CSRF protection

      SecureLogger.info('Session cookie security validated', {
        secure: sessionCookie.secure,
        httpOnly: sessionCookie.httpOnly,
        sameSite: sessionCookie.sameSite
      });
    }
  });
});

test.describe('Security Tests - Authorization', () => {
  test('should prevent unauthorized access to admin pages', async ({ page }) => {
    // Login as regular user
    const loginPage = new LoginPage(page);
    await loginPage.performLogin(
      SecureCredentials.getCredential('TEST_USERNAME'),
      SecureCredentials.getCredential('TEST_PASSWORD')
    );

    // Attempt to access admin page
    await page.goto('/admin');

    // Should be redirected or see error
    await expect(page).not.toHaveURL(/.*admin/);
    const errorText = await page.textContent('body');
    expect(
      errorText?.includes('forbidden') || 
      errorText?.includes('unauthorized') ||
      errorText?.includes('403')
    ).toBe(true);
  });

  test('should prevent CSRF attacks', async ({ page, context }) => {
    const loginPage = new LoginPage(page);
    await loginPage.performLogin(
      SecureCredentials.getCredential('TEST_USERNAME'),
      SecureCredentials.getCredential('TEST_PASSWORD')
    );

    // Get CSRF token from page
    const csrfToken = await page.evaluate(() => {
      const meta = document.querySelector('meta[name="csrf-token"]');
      return meta?.getAttribute('content');
    });

    expect(csrfToken).toBeTruthy();
    SecureLogger.info('CSRF token present on page');

    // Verify token is validated on form submission
    // (Implementation depends on application)
  });
});
```

**AGENT MUST REPORT:**
```
✅ STEP 6.1 COMPLETED: Security Test Coverage
- What was done: Implemented comprehensive security test cases
- SQL injection tests: [N] injection patterns tested ✓
- XSS prevention tests: [N] XSS payloads validated ✓
- Rate limiting tests: Login attempt throttling verified ✓
- Password strength tests: [N] weak passwords rejected ✓
- Session security: Cookie security flags validated ✓
- Authorization tests: Unauthorized access prevention verified ✓
- CSRF protection: Token presence and validation checked ✓
- Validation: All common security vulnerabilities tested
```

---

## Summary

**AGENT MUST PROVIDE FINAL REPORT:**
```
✅ SECURITY GUIDELINES VERIFICATION COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[✓] 1.1 No Hardcoded Credentials
[✓] 1.2 .env File Protection
[✓] 2.1 Input Validation
[✓] 3.1 Secure API Authentication
[✓] 4.1 Sensitive Data Protection
[✓] 5.1 Environment Isolation
[✓] 6.1 Security Test Coverage
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
All security guidelines have been satisfied.
Project follows security best practices.
Zero vulnerabilities detected in test automation code.
```

These security guidelines ensure:
- **Credential Protection**: No secrets in code
- **Data Safety**: Sensitive data properly masked
- **API Security**: Authenticated and encrypted communication
- **Environment Safety**: Protection against production test execution
- **Vulnerability Prevention**: Security-focused test coverage