# GitHub Copilot Workspace Instructions

## ContextGuard Enforcement Protocol

You are assisting with a Playwright test automation project that requires strict adherence to quality guardrails defined in the `ContextGuard/` directory. These guardrails ensure the highest quality code, security, and architectural consistency.

## Mandatory Behavior

### 1. Initial Acknowledgment
At the start of EVERY interaction involving code changes or test creation, you MUST:
- ✓ Load all ContextGuard files from the workspace
- ✓ Acknowledge which guardrails apply to the current task
- ✓ Confirm you will follow the step-by-step verification protocol

### 2. Step-by-Step Execution
For every task, you MUST:
- ✓ Break down the task into steps aligned with ContextGuard protocols
- ✓ Complete each step fully before moving to the next
- ✓ Report completion of each step using this format:

```
✅ STEP [N] COMPLETED: [Step Name]
- What was done: [Brief description]
- Guardrails followed: [Specific guardrail references]
- Validation: [How this meets quality standards]
```

### 3. Quality Standards
You MUST enforce:
- Page Object Model architecture for ALL Playwright tests
- TypeScript strict mode compliance
- Comprehensive error handling and validation
- Security best practices (no hardcoded credentials, proper data sanitization)
- Performance optimization (efficient selectors, proper waits)
- Detailed JSDoc documentation for all methods
- Comprehensive test coverage

### 4. Verification Protocol
Before completing ANY task, you MUST:
- ✓ Verify all ContextGuard checkpoints have been met
- ✓ Provide a compliance summary
- ✓ List any deviations or exceptions (with justification)

### 5. Final Report Format
After completing each task, provide:

```
🎯 TASK COMPLETION REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Task: [Task description]
Status: [COMPLETED / COMPLETED WITH EXCEPTIONS]

✅ ContextGuard Compliance:
├─ Quality Guardrails: [PASS/FAIL]
├─ Playwright Standards: [PASS/FAIL]
├─ Security Guidelines: [PASS/FAIL]
├─ Architecture Patterns: [PASS/FAIL]
└─ Performance Standards: [PASS/FAIL]

📋 Steps Completed: [N/N]
[List each completed step]

⚠️ Exceptions/Notes:
[Any deviations or important notes]

✓ Ready for Review
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Reference Files
Always consult these ContextGuard files:
- `ContextGuard/quality-guardrails.md` - Code quality standards
- `ContextGuard/playwright-standards.md` - Test automation best practices
- `ContextGuard/security-guidelines.md` - Security requirements
- `ContextGuard/architecture-patterns.md` - Design patterns and structure
- `ContextGuard/verification-protocol.md` - Step-by-step validation checklist

## Non-Negotiable Rules
1. NO code changes without following ContextGuard protocols
2. NO skipping verification steps
3. NO generic or vague completion reports
4. ALWAYS use Page Object Model for Playwright tests
5. ALWAYS include comprehensive error handling
6. ALWAYS document code with JSDoc comments
7. ALWAYS validate security implications

## Failure to Comply
If you cannot complete a task while maintaining ContextGuard compliance:
1. Stop and explain which guardrail conflicts with the request
2. Propose alternative approaches that maintain compliance
3. Request clarification from the user
4. NEVER compromise on security or quality standards

---

Remember: Quality is non-negotiable. Every interaction must demonstrate adherence to these standards through explicit step-by-step reporting.
