# Verification Protocol - ContextGuard

## Purpose
Define the step-by-step verification process that AI agents MUST follow when completing tasks to ensure ContextGuard compliance.

---

## Protocol Overview

This protocol ensures that every code change, test creation, or refactoring task adheres to all ContextGuard standards through systematic verification.

**Mandatory for ALL agents:** You MUST follow this protocol for every task involving code changes, test creation, or architectural modifications.

---

## Step-by-Step Verification Checklist

### Phase 1: Pre-Task Analysis

#### STEP 1.1: Acknowledge Task and Load Context
**Action Required:**
- ✅ Read and understand the user's task
- ✅ Load ALL ContextGuard files
- ✅ Identify which guardrails apply to this task
- ✅ Confirm understanding with the user

**Report Format:**
```
🎯 TASK ACKNOWLEDGED: [Task Description]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Applicable ContextGuard Files:
├─ ✓ quality-guardrails.md [Sections: 1.1, 1.2, 1.4]
├─ ✓ playwright-standards.md [Sections: 1.2, 2.1, 3.1]
├─ ✓ security-guidelines.md [Sections: 1.1, 2.1]
├─ ✓ architecture-patterns.md [Sections: 1.1, 1.2]
└─ ✓ verification-protocol.md [All steps]

🎯 Primary Goal: [Specific objective]
🔧 Approach: [High-level approach]

Ready to proceed with step-by-step execution.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

#### STEP 1.2: Break Down Task into Verifiable Steps
**Action Required:**
- ✅ Break task into atomic, verifiable steps
- ✅ Map each step to specific ContextGuard checkpoints
- ✅ Estimate effort and dependencies
- ✅ Present plan for user confirmation

**Report Format:**
```
📊 EXECUTION PLAN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Steps: [N]

Step 1: [Description]
  └─ ContextGuard Checkpoint: [Section reference]
  └─ Deliverable: [What will be created/modified]

Step 2: [Description]
  └─ ContextGuard Checkpoint: [Section reference]
  └─ Deliverable: [What will be created/modified]

[... continue for all steps ...]

Dependencies: [Any cross-step dependencies]
Estimated completion: [N] steps

Proceeding with execution...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### Phase 2: Execution with Real-Time Reporting

#### STEP 2.1: Execute Each Step with Immediate Reporting
**Action Required:**
- ✅ Complete ONE step fully before moving to next
- ✅ Apply relevant ContextGuard standards
- ✅ Report completion immediately after each step
- ✅ Include specific details and metrics

**Report Format (AFTER EACH STEP):**
```
✅ STEP [N] COMPLETED: [Step Name]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 What was done:
   [Detailed description of actions taken]

📋 Files affected:
   ├─ Created: [file paths]
   ├─ Modified: [file paths]
   └─ Deleted: [file paths]

🔍 ContextGuard Compliance:
   ├─ Quality Guardrails: [Specific checkpoints met]
   ├─ Playwright Standards: [Specific checkpoints met]
   ├─ Security Guidelines: [Specific checkpoints met]
   └─ Architecture Patterns: [Specific checkpoints met]

📊 Metrics:
   ├─ Lines of code: [N]
   ├─ Methods created: [N]
   ├─ Tests created: [N]
   └─ Documentation: [N JSDoc blocks]

✓ Validation: [How this step meets quality standards]

Moving to Step [N+1]...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

#### STEP 2.2: Handle Issues and Blockers
**Action Required:**
- ✅ If a blocker is encountered, STOP and report
- ✅ Explain the issue clearly
- ✅ Propose solutions or alternatives
- ✅ Wait for user input if needed

**Report Format (IF BLOCKER ENCOUNTERED):**
```
⚠️ BLOCKER ENCOUNTERED at Step [N]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚨 Issue: [Clear description of the problem]

📍 Context:
   [What was being attempted]

🔍 Impact:
   [How this affects the task]

💡 Proposed Solutions:
   1. [Solution 1 with pros/cons]
   2. [Solution 2 with pros/cons]
   3. [Solution 3 with pros/cons]

⏸️ Awaiting user direction...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### Phase 3: Post-Execution Verification

#### STEP 3.1: Quality Checklist Verification
**Action Required:**
- ✅ Verify ALL quality guardrails
- ✅ Check naming conventions
- ✅ Validate documentation completeness
- ✅ Confirm TypeScript strict mode compliance
- ✅ Verify test coverage

**Report Format:**
```
✅ QUALITY CHECKLIST VERIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Naming Conventions:
   ├─ Classes (PascalCase): [N/N] ✓
   ├─ Methods (camelCase): [N/N] ✓
   ├─ Variables (camelCase): [N/N] ✓
   ├─ Constants (UPPER_CASE): [N/N] ✓
   └─ Files (kebab-case): [N/N] ✓

📖 Documentation:
   ├─ Classes documented: [N/N] (100%) ✓
   ├─ Public methods documented: [N/N] (100%) ✓
   ├─ JSDoc completeness: ✓
   └─ Examples provided: [N] ✓

🔒 TypeScript Compliance:
   ├─ Strict mode: ✓
   ├─ No 'any' types: [N/N] (100%) ✓
   ├─ Null safety: ✓
   └─ Type guards: [N] implemented ✓

🧪 Test Coverage:
   ├─ Test files: [N] created ✓
   ├─ Test cases: [N] total ✓
   ├─ AAA pattern: [N/N] (100%) ✓
   ├─ Assertions: Avg [N] per test ✓
   └─ Independence: [N/N] (100%) ✓

📁 Project Structure:
   ├─ Files in correct locations: [N/N] ✓
   ├─ Barrel exports: ✓
   └─ No layer violations: ✓

✅ All quality guardrails satisfied.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

#### STEP 3.2: Playwright Standards Verification
**Action Required:**
- ✅ Verify Page Object Model compliance
- ✅ Check selector strategy
- ✅ Validate wait strategies
- ✅ Confirm test independence

**Report Format:**
```
✅ PLAYWRIGHT STANDARDS VERIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏗️ Page Object Model:
   ├─ Extends BasePage: [N/N] ✓
   ├─ Selectors centralized: [N] selectors ✓
   ├─ Lazy-loaded locators: ✓
   ├─ Public methods only: ✓
   └─ No direct selectors in tests: ✓

🎯 Selector Strategy:
   ├─ data-testid primary: [N] selectors ✓
   ├─ Role-based fallbacks: [N] selectors ✓
   ├─ No XPath: ✓
   └─ No brittle CSS: ✓

⏱️ Wait Strategies:
   ├─ Explicit waits: [N] implementations ✓
   ├─ No waitForTimeout: ✓
   ├─ Network waits: [N] ✓
   └─ URL waits: [N] ✓

🔄 Test Design:
   ├─ Test independence: [N/N] (100%) ✓
   ├─ beforeEach setup: ✓
   ├─ Proper cleanup: ✓
   └─ Unique test data: ✓

📦 Components:
   ├─ Reusable components: [N] created ✓
   ├─ Component usage: [N] pages use components ✓
   └─ Code reuse: [N]% reduction ✓

✅ All Playwright standards satisfied.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

#### STEP 3.3: Security Guidelines Verification
**Action Required:**
- ✅ Verify no hardcoded credentials
- ✅ Check environment variable usage
- ✅ Validate input sanitization
- ✅ Confirm API authentication security

**Report Format:**
```
✅ SECURITY GUIDELINES VERIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔐 Credential Management:
   ├─ No hardcoded credentials: ✓
   ├─ Environment variables: [N] used ✓
   ├─ .env.example created: ✓
   ├─ .gitignore updated: ✓
   └─ Credential validation: ✓

🛡️ Input Validation:
   ├─ Validation functions: [N] implemented ✓
   ├─ Sanitization: XSS/injection prevention ✓
   ├─ Test data validation: ✓
   └─ Error messages: Descriptive ✓

🔒 API Security:
   ├─ Secure authentication: ✓
   ├─ Token handling: Masked in logs ✓
   ├─ No hardcoded tokens: ✓
   └─ Token cleanup: ✓

📊 Data Protection:
   ├─ Sensitive data masking: ✓
   ├─ Screenshot safety: ✓
   ├─ Log sanitization: ✓
   └─ Report sanitization: ✓

🌍 Environment Isolation:
   ├─ Environment validator: ✓
   ├─ Production blocked: ✓
   ├─ Test data namespaced: ✓
   └─ Cleanup implemented: ✓

🧪 Security Tests:
   ├─ SQL injection tests: [N] ✓
   ├─ XSS prevention tests: [N] ✓
   ├─ Rate limiting tests: [N] ✓
   └─ Authorization tests: [N] ✓

✅ All security guidelines satisfied.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

#### STEP 3.4: Architecture Patterns Verification
**Action Required:**
- ✅ Verify layered architecture
- ✅ Check component reusability
- ✅ Validate design patterns
- ✅ Confirm dependency injection

**Report Format:**
```
✅ ARCHITECTURE PATTERNS VERIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏗️ Layered Architecture:
   ├─ Test Layer: [N] spec files ✓
   ├─ Page Object Layer: [N] page objects ✓
   ├─ Service Layer: [N] services ✓
   ├─ Utility Layer: [N] helpers ✓
   ├─ Data Layer: [N] data files ✓
   └─ No layer violations: ✓

🧩 Component Design:
   ├─ Base component: BaseComponent ✓
   ├─ Reusable components: [N] ✓
   ├─ Component usage: [N] pages ✓
   └─ Code reuse: [N]% ✓

🎨 Design Patterns:
   ├─ Factory pattern: [N] factories ✓
   ├─ Builder pattern: [N] builders ✓
   ├─ Singleton pattern: [N] singletons ✓
   └─ Strategy pattern: [N] strategies ✓

💉 Dependency Injection:
   ├─ Constructor injection: [N] classes ✓
   ├─ Fixtures: Custom fixtures ✓
   ├─ Default dependencies: ✓
   └─ Testability: Easy mocking ✓

✅ All architecture patterns satisfied.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

#### STEP 3.5: Final Compilation and Testing
**Action Required:**
- ✅ Run TypeScript compiler
- ✅ Fix any compilation errors
- ✅ Run tests (if applicable)
- ✅ Verify all tests pass

**Report Format:**
```
✅ COMPILATION AND TESTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔨 TypeScript Compilation:
   ├─ Command: tsc --noEmit
   ├─ Result: ✓ No errors
   └─ Strict mode: ✓ Enabled

🧪 Test Execution:
   ├─ Command: npx playwright test
   ├─ Tests run: [N]
   ├─ Passed: [N]
   ├─ Failed: [N]
   └─ Skipped: [N]

[If tests failed]
❌ Test Failures:
   ├─ [Test name]: [Error description]
   └─ Resolution: [How it was fixed]

✅ All compilation and tests successful.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### Phase 4: Final Report

#### STEP 4.1: Comprehensive Task Completion Report
**Action Required:**
- ✅ Provide complete summary
- ✅ List all changes made
- ✅ Confirm all ContextGuard compliance
- ✅ Note any exceptions or deviations

**Report Format:**
```
🎯 TASK COMPLETION REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Task: [Original task description]
Status: ✅ COMPLETED [or COMPLETED WITH EXCEPTIONS]

📊 Summary:
   [High-level summary of what was accomplished]

📋 Changes Made:
   ├─ Files Created: [N]
   │   ├─ [file path 1]
   │   ├─ [file path 2]
   │   └─ [...]
   ├─ Files Modified: [N]
   │   ├─ [file path 1]
   │   ├─ [file path 2]
   │   └─ [...]
   └─ Files Deleted: [N]
       └─ [file paths if any]

✅ ContextGuard Compliance:
   ├─ Quality Guardrails: ✓ PASS [N/N checkpoints]
   ├─ Playwright Standards: ✓ PASS [N/N checkpoints]
   ├─ Security Guidelines: ✓ PASS [N/N checkpoints]
   └─ Architecture Patterns: ✓ PASS [N/N checkpoints]

📈 Metrics:
   ├─ Total lines of code: [N]
   ├─ Classes created: [N]
   ├─ Methods created: [N]
   ├─ Tests created: [N]
   ├─ Documentation blocks: [N]
   └─ Code reuse: [N]%

🔍 Code Quality:
   ├─ TypeScript strict: ✓
   ├─ ESLint: ✓ No violations
   ├─ Test coverage: [N]%
   └─ Documentation: 100%

🎯 Steps Completed: [N/N]
   ✅ [Step 1 name]
   ✅ [Step 2 name]
   ✅ [Step 3 name]
   [...all steps...]

⚠️ Exceptions/Notes:
   [List any deviations from standards with justifications]
   [Or state "None - full compliance achieved"]

📝 Next Steps (if any):
   [Any recommended follow-up actions or improvements]

✅ Ready for Review
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

All ContextGuard protocols have been followed.
Task completed to the highest quality standards.
```

---

## Special Scenarios

### Scenario A: Refactoring Existing Code
**Additional Verification Required:**
- ✅ Ensure backward compatibility
- ✅ Verify existing tests still pass
- ✅ Document breaking changes (if any)
- ✅ Update affected tests

### Scenario B: Adding New Features
**Additional Verification Required:**
- ✅ Ensure feature doesn't break existing functionality
- ✅ Add comprehensive tests for new feature
- ✅ Update documentation
- ✅ Consider edge cases

### Scenario C: Bug Fixes
**Additional Verification Required:**
- ✅ Add test case that reproduces the bug
- ✅ Verify fix resolves the issue
- ✅ Ensure no regression in other areas
- ✅ Document root cause

---

## Compliance Enforcement

### Non-Negotiable Rules
1. **NO skipping steps** - Every step must be completed and reported
2. **NO vague reports** - All reports must include specific metrics and details
3. **NO silent failures** - All issues must be reported immediately
4. **NO partial compliance** - 100% ContextGuard compliance required
5. **NO assumptions** - Verify everything explicitly

### If Compliance Cannot Be Achieved
If a task cannot be completed while maintaining ContextGuard compliance:

1. **STOP immediately**
2. **Report the conflict clearly**
3. **Explain why compliance cannot be maintained**
4. **Propose alternatives that maintain compliance**
5. **Request user guidance**

**Example Report:**
```
🚨 COMPLIANCE CONFLICT DETECTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Task: [Task description]
Conflict: [Specific ContextGuard rule that conflicts]

Explanation:
[Why the requested task conflicts with ContextGuard standards]

Proposed Alternatives:
1. [Alternative approach 1 that maintains compliance]
2. [Alternative approach 2 that maintains compliance]

⚠️ Recommendation: [Your recommended approach]

Awaiting user direction before proceeding.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Summary

This verification protocol ensures:
- **Transparency**: Every step is visible to the user
- **Quality**: All ContextGuard standards are enforced
- **Accountability**: Clear metrics and validation at every stage
- **Traceability**: Complete audit trail of all actions
- **Reliability**: Consistent approach across all tasks

**Remember:** Quality is non-negotiable. Follow this protocol without exception.
