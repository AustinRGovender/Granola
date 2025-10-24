# ContextGuard - AI Agent Quality Assurance System

## Overview
ContextGuard is a comprehensive quality assurance framework that ensures AI agents (like GitHub Copilot) follow strict guardrails when assisting with Playwright test automation development. This system enforces industry best practices, architectural patterns, and quality standards.

## System Architecture

### Core Components
1. **Master Instructions** (`.github/copilot-instructions.md`) - Workspace-level agent behavior
2. **Quality Guardrails** - Comprehensive quality standards and validation rules
3. **Playwright Standards** - Test automation best practices and patterns
4. **Security Guidelines** - Security-first development practices
5. **Verification Protocol** - Step-by-step completion tracking

## How to Use

### For Developers (Quick Start)
The easiest way to use ContextGuard is through the **Orchestrator**:

```
@workspace #file:ContextGuard-Orchestrator.md [your request]
```

The orchestrator will automatically:
- Route your request to the appropriate specialized agent
- Ensure all ContextGuard standards are followed
- Provide step-by-step progress reports
- Deliver a comprehensive completion report

**Examples:**
```
@workspace #file:ContextGuard-Orchestrator.md Create a LoginPage with POM
@workspace #file:ContextGuard-Orchestrator.md Audit security in all test files
@workspace #file:ContextGuard-Orchestrator.md Build checkout flow with tests
```

### For AI Agents
When assisting with development tasks, AI agents must:
1. Load and acknowledge all ContextGuard files at the start of each interaction
2. Execute each guardrail checkpoint sequentially
3. Report completion of each step before proceeding
4. Provide a final compliance summary

### Advanced Usage
1. Reference specific ContextGuard files in Copilot Chat using `#file` mentions
2. Review agent compliance reports after each task
3. Update guardrails as project requirements evolve
4. Force specific agent routing using `[Agent Name]` prefix

## File Structure
```
ContextGuard/
├── README.md (this file)
├── ContextGuard-Orchestrator.md      ⭐ START HERE - Routes requests to specialized agents
├── quality-guardrails.md              📋 Code quality and documentation standards
├── playwright-standards.md            🎭 Page Object Model and test best practices
├── security-guidelines.md             🔒 Security, credentials, and data protection
├── architecture-patterns.md           🏗️ Design patterns and project structure
├── verification-protocol.md           ✅ Step-by-step verification checklist
└── agent-behavior.md                  🤖 AI agent behavioral guidelines
```

### Specialized Agents

The orchestrator coordinates six specialized agents:

1. **Quality Agent** - Code quality, naming, documentation
2. **Playwright Agent** - Page objects, tests, selectors
3. **Security Agent** - Credentials, validation, protection
4. **Architecture Agent** - Design patterns, structure
5. **Verification Agent** - Compliance audits, validation
6. **Integration Agent** - Multi-agent coordination for complex tasks

## Quick Start

**Option 1: Use the Orchestrator (Recommended)**
```
@workspace #file:ContextGuard-Orchestrator.md [your request]
```

**Option 2: Direct Request**
```
@workspace I need help with [your task]. Please follow all ContextGuard protocols.
```

**Option 3: Specific Agent**
```
@workspace #file:ContextGuard-Orchestrator.md [Playwright Agent] Create ProductPage
```

## Updates
Last Updated: October 24, 2025
Version: 1.0.0
