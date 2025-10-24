# ContextGuard Orchestrator

## 🎯 Purpose
This orchestrator file serves as the central coordination point for all ContextGuard agents. Reference this file in Copilot Chat to activate the appropriate specialized agent based on your task.

---

## 🚀 How to Use

In Copilot Chat, use the following command pattern:
```
@workspace #file:ContextGuard-Orchestrator.md [your request]
```

The orchestrator will automatically route your request to the appropriate specialized agent(s).

---

## 🤖 Agent Routing System

### Automatic Routing Logic

The orchestrator analyzes your request and routes to the appropriate agent based on keywords, context, and task type:

| **Task Type** | **Keywords** | **Primary Agent** | **Supporting Agents** |
|---------------|--------------|-------------------|----------------------|
| Code Quality | quality, naming, documentation, refactor, clean code | Quality Agent | Architecture Agent |
| Playwright/Testing | test, spec, page object, POM, selector, playwright | Playwright Agent | Quality Agent |
| Security | credentials, auth, security, password, token, encryption | Security Agent | Quality Agent |
| Architecture | architecture, pattern, design, structure, layer, component | Architecture Agent | Quality Agent |
| Verification | verify, check, audit, validate, compliance | Verification Agent | All Agents |
| New Feature | create, build, implement, add feature | Integration Agent | All Agents |
| Bug Fix | fix, bug, error, issue, debug | Integration Agent | Verification Agent |

---

## 👥 Specialized Agents

### 1. Quality Agent
**Expertise**: Code quality, naming conventions, documentation, TypeScript compliance  
**Reference File**: `quality-guardrails.md`  
**Use When**:
- Creating or refactoring code
- Adding documentation
- Enforcing naming conventions
- TypeScript strict mode compliance
- Code review and cleanup

**Example Requests**:
- "Refactor this code to follow quality standards"
- "Add JSDoc documentation to all methods"
- "Review code quality in login.page.ts"
- "Ensure TypeScript strict mode compliance"

---

### 2. Playwright Agent
**Expertise**: Page Object Model, test design, selectors, wait strategies  
**Reference File**: `playwright-standards.md`  
**Use When**:
- Creating page objects
- Writing test specs
- Implementing selectors
- Setting up test infrastructure
- Test debugging and optimization

**Example Requests**:
- "Create a LoginPage following POM"
- "Write tests for user registration"
- "Improve selector strategy in CartPage"
- "Add wait strategies to checkout flow"
- "Create reusable navigation component"

---

### 3. Security Agent
**Expertise**: Credential management, input validation, API security, data protection  
**Reference File**: `security-guidelines.md`  
**Use When**:
- Handling credentials or secrets
- Implementing authentication
- Validating user input
- Securing API calls
- Protecting sensitive data
- Security testing

**Example Requests**:
- "Implement secure credential management"
- "Add input validation to registration form"
- "Create secure API client with authentication"
- "Audit code for hardcoded credentials"
- "Add security test cases for login"

---

### 4. Architecture Agent
**Expertise**: Design patterns, layered architecture, component design, dependency injection  
**Reference File**: `architecture-patterns.md`  
**Use When**:
- Designing system architecture
- Implementing design patterns
- Creating reusable components
- Structuring project layers
- Refactoring for better design

**Example Requests**:
- "Design architecture for e-commerce tests"
- "Create factory pattern for test data"
- "Implement reusable form component"
- "Setup dependency injection for page objects"
- "Refactor to follow layered architecture"

---

### 5. Verification Agent
**Expertise**: Compliance checking, step-by-step verification, quality audits  
**Reference File**: `verification-protocol.md`  
**Use When**:
- Auditing existing code
- Verifying ContextGuard compliance
- Reviewing completed work
- Validating standards adherence
- Pre-deployment checks

**Example Requests**:
- "Verify ContextGuard compliance for LoginPage"
- "Audit security in all test files"
- "Check if all tests are independent"
- "Validate naming conventions across project"
- "Review documentation completeness"

---

### 6. Integration Agent
**Expertise**: Multi-agent coordination, complex feature implementation, end-to-end tasks  
**Reference Files**: All ContextGuard files  
**Use When**:
- Building complete features (UI + tests + security)
- Complex refactoring requiring multiple agents
- New page creation with full stack
- End-to-end workflow implementation
- Large-scale code improvements

**Example Requests**:
- "Create complete user registration feature"
- "Build checkout flow with all tests and security"
- "Refactor authentication system end-to-end"
- "Implement product management with POM and tests"

---

## 🔄 Multi-Agent Workflows

For complex tasks requiring multiple agents, the orchestrator coordinates handoffs:

### Example: Creating a New Page Object

```
Orchestrator
    ↓
Architecture Agent (Design page structure)
    ↓
Playwright Agent (Implement Page Object Model)
    ↓
Quality Agent (Add documentation, enforce naming)
    ↓
Security Agent (Validate no hardcoded credentials)
    ↓
Verification Agent (Final compliance check)
```

### Example: Security Audit

```
Orchestrator
    ↓
Security Agent (Scan for vulnerabilities)
    ↓
Quality Agent (Check for weak patterns)
    ↓
Playwright Agent (Review test data handling)
    ↓
Verification Agent (Generate audit report)
```

---

## 📋 Request Processing Flow

```
┌─────────────────────────────────────────┐
│  User Request via Copilot Chat          │
│  @workspace #file:ContextGuard-Orchestrator.md │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  1. ORCHESTRATOR ANALYSIS               │
│  - Parse request intent                 │
│  - Identify task type                   │
│  - Detect keywords                      │
│  - Determine complexity                 │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  2. AGENT ROUTING                       │
│  - Select primary agent                 │
│  - Identify supporting agents           │
│  - Define agent sequence                │
│  - Load relevant ContextGuard files     │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  3. TASK EXECUTION                      │
│  - Primary agent executes core work     │
│  - Supporting agents provide validation │
│  - Step-by-step reporting               │
│  - Handoffs between agents              │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  4. VERIFICATION                        │
│  - All ContextGuard standards checked   │
│  - Multi-agent validation               │
│  - Comprehensive compliance report      │
│  - Metrics and statistics               │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  5. COMPLETION REPORT                   │
│  - Task summary                         │
│  - All changes documented               │
│  - Compliance status                    │
│  - Next steps (if any)                  │
└─────────────────────────────────────────┘
```

---

## 🎨 Agent Interaction Protocol

### When Orchestrator Receives Request:

**STEP 1: Acknowledge and Route**
```
🎯 ORCHESTRATOR ACTIVATED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Request: [User's request]

🔍 Analysis:
   ├─ Task Type: [Identified type]
   ├─ Complexity: [Simple/Medium/Complex]
   ├─ Keywords Detected: [Relevant keywords]
   └─ Estimated Agents: [N] agents required

🤖 Agent Routing:
   ├─ Primary Agent: [Agent Name]
   ├─ Supporting Agents: [Agent Names]
   └─ Execution Order: [Sequence]

📋 ContextGuard Files to Load:
   ├─ [file1.md]
   ├─ [file2.md]
   └─ [file3.md]

Handing off to [Primary Agent Name]...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**STEP 2: Agent Handoff**
```
🤖 [AGENT NAME] ACTIVATED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Loaded ContextGuard Standards:
   ✓ [Specific sections loaded]

🎯 Task Scope:
   [Specific work this agent will perform]

📊 Execution Plan:
   [Steps this agent will complete]

Proceeding with execution...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**STEP 3: Agent Completion & Handoff**
```
✅ [AGENT NAME] COMPLETED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Work Completed:
   [Summary of agent's work]

Files Affected:
   ├─ [file list]

Compliance Verified:
   ✓ [Relevant checkpoints]

Handing off to [Next Agent Name]...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**STEP 4: Orchestrator Final Report**
```
🎯 ORCHESTRATOR COMPLETION REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Task: [Original request]
Status: ✅ COMPLETED

🤖 Agents Involved:
   1. [Agent Name] - [Work performed]
   2. [Agent Name] - [Work performed]
   3. [Agent Name] - [Work performed]

📊 Combined Results:
   ├─ Files Created: [N]
   ├─ Files Modified: [N]
   ├─ Lines of Code: [N]
   ├─ Tests Created: [N]
   └─ Documentation: [N] blocks

✅ ContextGuard Compliance:
   ├─ Quality Guardrails: ✓ PASS
   ├─ Playwright Standards: ✓ PASS
   ├─ Security Guidelines: ✓ PASS
   └─ Architecture Patterns: ✓ PASS

All agents have completed their work successfully.
Full compliance with ContextGuard standards achieved.

✅ Ready for Review
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🎯 Quick Start Examples

### Example 1: Simple Task (Single Agent)
```
User: "@workspace #file:ContextGuard-Orchestrator.md Add JSDoc to login.page.ts"

Orchestrator → Quality Agent
└─ Quality Agent completes task with full reporting
```

### Example 2: Medium Task (Two Agents)
```
User: "@workspace #file:ContextGuard-Orchestrator.md Create ProductPage with tests"

Orchestrator → Playwright Agent → Quality Agent
├─ Playwright Agent: Creates page object and tests
└─ Quality Agent: Adds documentation and validates naming
```

### Example 3: Complex Task (Multiple Agents)
```
User: "@workspace #file:ContextGuard-Orchestrator.md Build complete checkout flow"

Orchestrator → Integration Agent → Architecture + Playwright + Security + Quality + Verification
├─ Architecture: Designs component structure
├─ Playwright: Implements page objects and tests
├─ Security: Adds payment data protection
├─ Quality: Ensures documentation and naming
└─ Verification: Final compliance audit
```

---

## 📌 Routing Decision Matrix

| **Request Contains** | **Primary Agent** | **Why** |
|---------------------|------------------|---------|
| "create page object" | Playwright Agent | Core POM expertise |
| "add documentation" | Quality Agent | Documentation specialist |
| "secure API" | Security Agent | Security expertise |
| "design pattern" | Architecture Agent | Pattern implementation |
| "verify compliance" | Verification Agent | Audit specialist |
| "build feature" | Integration Agent | Coordinates multiple agents |
| "test + security" | Integration Agent | Multi-domain task |
| "refactor architecture" | Architecture Agent | Structural changes |

---

## 🔧 Advanced Usage

### Force Specific Agent
```
@workspace #file:ContextGuard-Orchestrator.md 
[Security Agent] Check for hardcoded credentials in all files
```

### Request Multi-Agent Workflow
```
@workspace #file:ContextGuard-Orchestrator.md
[Integration] Create LoginPage with full security audit and testing
```

### Request Verification Only
```
@workspace #file:ContextGuard-Orchestrator.md
[Verification] Audit entire tests/ directory for ContextGuard compliance
```

---

## 📊 Orchestrator Responsibilities

1. **Request Analysis**: Understand user intent and task complexity
2. **Agent Selection**: Choose appropriate agent(s) based on task type
3. **Resource Loading**: Ensure agents have access to relevant ContextGuard files
4. **Workflow Coordination**: Manage handoffs between multiple agents
5. **Progress Tracking**: Monitor completion of each agent's work
6. **Compliance Verification**: Ensure all ContextGuard standards are met
7. **Final Reporting**: Provide comprehensive task completion summary

---

## ⚙️ Orchestrator Configuration

### Priority Rules
1. **Security First**: Security Agent always validates when credentials/auth involved
2. **Quality Always**: Quality Agent validates all code changes
3. **Verification Last**: Verification Agent provides final compliance check
4. **Integration for Complex**: Integration Agent coordinates multi-domain tasks

### Handoff Triggers
- **Quality Check Needed**: After any code creation → Quality Agent
- **Security Review Needed**: After auth/credentials work → Security Agent
- **Architecture Review Needed**: After structural changes → Architecture Agent
- **Final Validation Needed**: Before completion → Verification Agent

---

## 🎓 Learning Mode

The orchestrator can explain its routing decisions:

```
User: "@workspace #file:ContextGuard-Orchestrator.md explain routing for 'create secure login page'"

Orchestrator Response:

🎓 ROUTING EXPLANATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Request: "create secure login page"

🔍 Keyword Analysis:
   ├─ "create" → New feature development
   ├─ "secure" → Security considerations required
   ├─ "login page" → Page object implementation

🤖 Agent Selection Logic:
   1. Primary: Playwright Agent
      - Reason: "login page" indicates POM implementation
      
   2. Supporting: Security Agent
      - Reason: "secure" requires security validation
      
   3. Supporting: Quality Agent
      - Reason: All new code requires quality validation
      
   4. Final: Verification Agent
      - Reason: Multi-agent work requires final audit

📊 Execution Flow:
   Playwright → Security → Quality → Verification

This ensures the login page is properly implemented,
secure, well-documented, and fully compliant.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🚀 Ready to Use!

The ContextGuard Orchestrator is now active and ready to coordinate all your development tasks with maximum quality and efficiency.

Simply reference this file in Copilot Chat:
```
@workspace #file:ContextGuard-Orchestrator.md [your request]
```

Let the orchestrator route your request to the right experts! 🎯

---

## 📝 Notes

- The orchestrator automatically enforces all ContextGuard standards
- All agents follow the verification protocol with step-by-step reporting
- Complex tasks automatically trigger multi-agent workflows
- Every task results in a comprehensive compliance report
- Quality is never compromised, regardless of agent routing

**Remember**: The orchestrator ensures that no matter how complex your request, the right combination of specialized agents will handle it with the highest quality standards.
