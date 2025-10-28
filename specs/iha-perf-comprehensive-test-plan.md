# IHAPerf - Comprehensive Test Plan

## Overview
Test plan for **IHAPerf** (Intelligent High-performance API Performance Testing Tool) - a web-based performance testing dashboard for managing and executing load tests.

**Application URL**: http://localhost:5174/  
**Application Type**: React-based performance testing tool  
**Testing Constraints**: Maximum 60 seconds duration, 2 virtual users

## Application Structure

### Navigation Menu
- **Dashboard** (`/`) - Real-time metrics and execution monitoring
- **Scenarios** (`/scenarios`) - Scenario management and creation
- **Executions** (`/executions`) - Active and historical test runs
- **History** (`/history`) - Completed test results with comparison
- **Compare** (`/comparison`) - Compare multiple test results

### Key Features Discovered
1. **Scenario Management**: Create, edit, duplicate, and delete performance test scenarios
2. **Real-time Execution Monitoring**: WebSocket-based live updates
3. **Multiple Load Patterns**: Constant, Ramp-Up, Ramp-Down, Spike, Stress
4. **HTTP Configuration**: Full request builder (params, headers, body, auth, tests)
5. **Template System**: Save and browse scenario templates
6. **Execution History**: View completed tests with filtering and comparison

---

## Test Scenarios

### 1. Navigation and Page Accessibility
**Priority**: High  
**Description**: Verify all main navigation pages load correctly and display expected content

#### Steps:
1. Navigate to Dashboard (`/`)
2. Verify page title contains "IHAPerf"
3. Verify "Connected" status indicator is visible
4. Click "Scenarios" in navigation
5. Verify "Test Scenarios" heading is visible
6. Click "Executions" in navigation
7. Verify "Test Executions" heading is visible
8. Click "History" in navigation
9. Verify "Test History" heading is visible
10. Click "Compare" in navigation
11. Verify comparison page loads

#### Expected Results:
- All pages load without errors
- Navigation menu remains visible on all pages
- Page titles update correctly
- WebSocket connection status shows "Connected"

---

### 2. Scenario List Display
**Priority**: High  
**Description**: Verify scenarios list displays existing scenarios with correct information

#### Steps:
1. Navigate to Scenarios page (`/scenarios`)
2. Wait for scenarios to load
3. Verify "Browse Templates" button is visible
4. Verify "New Scenario" button is visible
5. Verify at least one scenario card is displayed
6. Verify scenario card contains:
   - Scenario name
   - Target URL
   - HTTP method
   - Virtual users count
   - Duration
   - Action buttons (Start Test, Edit, Duplicate, Delete)
7. Verify created/updated timestamp is shown

#### Expected Results:
- Scenarios load within 3 seconds
- All scenario information is displayed correctly
- Action buttons are clickable
- Timestamps are formatted properly

---

### 3. Create New Scenario (Basic Configuration)
**Priority**: High  
**Description**: Create a simple GET request scenario with constant load pattern

#### Steps:
1. Navigate to Scenarios page
2. Click "➕ New Scenario" button
3. Verify form displays with heading "Create New Scenario"
4. Enter scenario name: "Test Scenario - Automation"
5. Enter description: "Automated test scenario created by Playwright"
6. Enter target URL: "https://jsonplaceholder.typicode.com/posts/1"
7. Verify HTTP method is set to "GET" (default)
8. Set Virtual Users to "2"
9. Set Duration to "60" seconds
10. Set Ramp-up Time to "5" seconds
11. Verify load pattern preview updates
12. Click "Create Scenario" button
13. Verify redirect to scenarios list
14. Verify new scenario appears in the list

#### Expected Results:
- Form validates input correctly
- Load pattern preview shows accurate visualization
- Scenario is created successfully
- New scenario visible with correct configuration

---

### 4. Scenario Load Pattern Selection
**Priority**: Medium  
**Description**: Test different load pattern configurations

#### Steps:
1. Navigate to New Scenario page
2. Enter basic information (name, URL)
3. Select "Constant Load" pattern
4. Verify preview shows flat line at target users
5. Select "Ramp-Up" pattern
6. Verify preview shows gradual increase
7. Select "Spike Test" pattern
8. Verify preview shows sudden burst
9. Verify pattern descriptions are displayed
10. Verify "Best for:" recommendations shown

#### Expected Results:
- All load patterns are selectable
- Previews update dynamically
- Descriptions provide clear guidance
- UI responds without lag

---

### 5. HTTP Request Configuration
**Priority**: Medium  
**Description**: Configure HTTP request details including headers and body

#### Steps:
1. Navigate to New Scenario page
2. Enter scenario name and target URL
3. Change HTTP method to "POST"
4. Click "Headers" tab
5. Add header: "Content-Type: application/json"
6. Click "Body" tab
7. Verify body editor is now available
8. Enter JSON body: `{"test": "data"}`
9. Click "Preview" tab
10. Verify full request preview displays
11. Verify method, URL, headers, and body shown correctly

#### Expected Results:
- Tab navigation works smoothly
- Body editor only available for POST/PUT/PATCH
- Headers can be added/removed
- Preview shows complete request details

---

### 6. Test URL Validation
**Priority**: Medium  
**Description**: Verify URL validation and test connectivity

#### Steps:
1. Navigate to New Scenario page
2. Leave target URL empty
3. Attempt to create scenario
4. Verify validation error for required field
5. Enter invalid URL: "not-a-url"
6. Verify validation error
7. Enter valid URL: "https://jsonplaceholder.typicode.com/posts/1"
8. Click "Test" button next to URL field
9. Verify connection test executes
10. Verify test result feedback is shown

#### Expected Results:
- Empty URL shows validation error
- Invalid URL format shows error
- Test button attempts connection
- Validation prevents invalid submissions

---

### 7. Execution List Display
**Priority**: High  
**Description**: Verify executions page displays historical test runs

#### Steps:
1. Navigate to Executions page (`/executions`)
2. Wait for executions to load
3. Verify filter tabs display:
   - All (with count)
   - Running (with count)
   - Completed (with count)
   - Failed (with count)
4. Verify execution cards display:
   - Scenario name
   - Status badge (completed/running/stopped/failed)
   - Execution ID
   - Start timestamp
   - Completion timestamp
   - Duration
   - "View Details" button
5. Click different filter tabs
6. Verify list updates based on filter

#### Expected Results:
- Executions load within 3 seconds
- All execution information is accurate
- Filters work correctly
- Status badges are color-coded appropriately

---

### 8. Start Test Execution (Limited Duration)
**Priority**: High  
**Description**: Start a performance test with 2 virtual users for 60 seconds

#### Steps:
1. Navigate to Scenarios page
2. Find scenario with 2 VU and 60s duration
   - If not exists, create one following Scenario 3
3. Click "▶️ Start Test" button
4. Verify confirmation or redirect to executions
5. Navigate to Dashboard
6. Verify real-time metrics appear
7. Wait for test to complete (max 60 seconds)
8. Verify status changes to "completed"
9. Verify execution summary is displayed

#### Expected Results:
- Test starts successfully
- Dashboard shows live metrics
- Test completes within specified duration
- No errors during execution
- Results are captured

---

### 9. View Execution Details
**Priority**: Medium  
**Description**: View detailed results of a completed test execution

#### Steps:
1. Navigate to Executions page
2. Find a completed execution
3. Click "View Details" button
4. Verify detailed metrics page loads
5. Verify presence of:
   - Response time metrics (avg, min, max, p50, p95, p99)
   - Request rate (requests/sec)
   - Error rate
   - Status code distribution
   - Timeline graphs
6. Verify charts render correctly
7. Verify metrics are numerical and formatted

#### Expected Results:
- Details page loads quickly
- All metrics are present and valid
- Charts display data visually
- No broken visualizations
- Data aligns with execution parameters

---

### 10. History Page and Test Comparison
**Priority**: Medium  
**Description**: View test history and select tests for comparison

#### Steps:
1. Navigate to History page (`/history`)
2. Verify completed tests list displays
3. Verify each test shows:
   - Test name
   - Timestamp
   - Duration
   - Checkbox for selection
4. Select two test executions using checkboxes
5. Verify selection count updates
6. Click "Compare" or navigate to comparison page
7. Verify selected tests are ready for comparison

#### Expected Results:
- History loads all completed tests
- Checkboxes function correctly
- Multiple selections allowed
- Comparison feature accessible
- No performance issues with large lists

---

### 11. Scenario Duplicate Function
**Priority**: Low  
**Description**: Duplicate an existing scenario

#### Steps:
1. Navigate to Scenarios page
2. Find any existing scenario
3. Click "📋 Duplicate" button
4. Verify new scenario is created
5. Verify duplicated scenario has:
   - Same configuration as original
   - Modified name (e.g., "Copy of...")
   - New created timestamp
6. Verify duplicate appears in scenarios list

#### Expected Results:
- Duplication happens quickly
- All settings copied accurately
- Name differentiated from original
- No data loss or corruption

---

### 12. Scenario Edit Function
**Priority**: Medium  
**Description**: Edit an existing scenario

#### Steps:
1. Navigate to Scenarios page
2. Find the test scenario created in Scenario 3
3. Click "✏️ Edit" button
4. Verify form loads with existing values
5. Modify scenario name to "Test Scenario - Edited"
6. Change virtual users to "1"
7. Click "Save" or "Update Scenario" button
8. Verify redirect to scenarios list
9. Verify changes are reflected in scenario card

#### Expected Results:
- Edit form pre-populates with current values
- Changes save successfully
- UI updates immediately
- No data corruption

---

### 13. Scenario Delete Function
**Priority**: Medium  
**Description**: Delete a scenario and verify removal

#### Steps:
1. Navigate to Scenarios page
2. Count total scenarios
3. Find the test scenario created earlier
4. Click "🗑 Delete" button
5. Verify confirmation dialog appears
6. Confirm deletion
7. Verify scenario is removed from list
8. Verify total count decreased by 1
9. Verify deleted scenario not accessible

#### Expected Results:
- Confirmation dialog prevents accidental deletion
- Deletion executes successfully
- UI updates immediately
- No orphaned data remains

---

### 14. WebSocket Connection Status
**Priority**: Medium  
**Description**: Verify WebSocket connection for real-time updates

#### Steps:
1. Open browser console
2. Navigate to Dashboard
3. Verify console logs show "[WebSocket] Connecting..."
4. Verify console shows "[WebSocket] Connected successfully"
5. Verify "Connected" indicator in UI
6. Simulate connection interruption (if possible)
7. Verify reconnection attempt
8. Verify status indicator updates

#### Expected Results:
- WebSocket connects on page load
- Connection status visible to user
- Automatic reconnection on failure
- No console errors related to WebSocket

---

### 15. Browse Templates Functionality
**Priority**: Low  
**Description**: Access and use scenario templates

#### Steps:
1. Navigate to Scenarios page
2. Click "📋 Browse Templates" button
3. Verify templates modal/page opens
4. Verify template categories or list displayed
5. Select a template
6. Verify template details shown
7. Click "Use Template" or equivalent
8. Verify scenario form pre-fills with template values
9. Modify if needed and create scenario

#### Expected Results:
- Templates accessible and organized
- Template selection works smoothly
- Pre-filling saves time
- Templates provide good starting points

---

### 16. Advanced HTTP Options
**Priority**: Low  
**Description**: Configure advanced HTTP settings

#### Steps:
1. Navigate to New Scenario page
2. Fill basic information
3. Click "Advanced HTTP Options" accordion
4. Verify additional options display:
   - Timeout settings
   - Retry configuration
   - Connection pooling
   - SSL/TLS options
5. Modify one or more settings
6. Verify changes persist when creating scenario

#### Expected Results:
- Advanced options expand/collapse
- All settings configurable
- Tooltips explain each option
- Settings apply correctly to test

---

### 17. Form Validation and Error Handling
**Priority**: High  
**Description**: Test form validation throughout the application

#### Steps:
1. Navigate to New Scenario page
2. Click "Create Scenario" with empty form
3. Verify all required field errors display
4. Enter invalid values:
   - Virtual Users: -1
   - Duration: 0
   - Invalid URL format
5. Verify validation messages for each
6. Enter valid values
7. Verify validation clears
8. Successfully create scenario

#### Expected Results:
- All required fields validated
- Numeric ranges enforced
- URL format validated
- Clear error messages
- Validation feedback immediate

---

### 18. Responsive UI and Layout
**Priority**: Medium  
**Description**: Verify UI layout and responsiveness

#### Steps:
1. Navigate to each main page
2. Verify sidebar navigation always visible
3. Verify page headers consistent
4. Verify content areas properly aligned
5. Verify buttons and forms accessible
6. Check for any layout breaks
7. Verify scrolling works on long content

#### Expected Results:
- Consistent layout across pages
- No overlapping elements
- Proper spacing and alignment
- Smooth scrolling
- Professional appearance

---

### 19. Stop Running Execution
**Priority**: Medium  
**Description**: Stop a running test execution before completion

#### Steps:
1. Navigate to Scenarios page
2. Start a test with longer duration (60s)
3. Quickly navigate to Executions page
4. Find the running execution
5. Verify "Stop" button is available
6. Click "Stop" button
7. Verify confirmation dialog
8. Confirm stop action
9. Verify execution status changes to "stopped"
10. Verify execution shows partial duration

#### Expected Results:
- Running executions identifiable
- Stop button accessible
- Execution stops gracefully
- Partial results captured
- Status updated correctly

---

### 20. Cross-Browser Compatibility (Chromium Focus)
**Priority**: High  
**Description**: Verify application works in Chromium browser

#### Steps:
1. Open application in Chromium
2. Verify all pages load
3. Verify WebSocket connection works
4. Verify forms submit correctly
5. Verify charts/graphs render
6. Verify no console errors
7. Complete one full scenario creation and execution flow

#### Expected Results:
- Full functionality in Chromium
- No browser-specific errors
- Consistent user experience
- All features operational

---

## Non-Functional Test Scenarios

### 21. Page Load Performance
**Priority**: Medium  
**Description**: Verify pages load within acceptable time

#### Steps:
1. Measure time to load Dashboard
2. Measure time to load Scenarios page
3. Measure time to load Executions page
4. Verify initial page load < 2 seconds
5. Verify subsequent navigation < 1 second

#### Expected Results:
- Fast initial load times
- Smooth transitions
- No blocking operations
- Good perceived performance

---

### 22. Data Persistence
**Priority**: High  
**Description**: Verify data persists across sessions

#### Steps:
1. Create a new scenario
2. Note the scenario ID
3. Refresh the page
4. Verify scenario still exists
5. Close browser
6. Reopen browser to application
7. Verify scenario still exists with same configuration

#### Expected Results:
- Data saved to backend/database
- No data loss on refresh
- Persistent across sessions
- Reliable storage

---

## Test Execution Constraints

- **Maximum Test Duration**: 60 seconds per execution
- **Virtual Users**: Maximum 2 VU per test
- **Browser**: Chromium (primary), Firefox, WebKit (optional)
- **Test Independence**: Each test must be independent and isolated
- **No Authentication Required**: Application accessible without login

---

## Success Criteria

1. All High priority scenarios pass (100%)
2. Medium priority scenarios pass (90%+)
3. No critical bugs blocking main workflows
4. WebSocket connection stable
5. Forms validate correctly
6. Data persists reliably
7. Page load times acceptable
8. No console errors during normal operations

---

## Notes for Test Implementation

- Use Page Object Model (POM) architecture
- Implement proper wait strategies (no fixed waits except where necessary)
- Use web-first assertions with auto-wait
- Ensure test independence (no shared state between tests)
- Use descriptive test and selector names
- Add comprehensive error handling
- Document any discovered issues or edge cases
- Follow ContextGuard quality standards

---

**Test Plan Created**: October 28, 2025  
**Application**: IHAPerf v1.0  
**Total Scenarios**: 22 (20 functional, 2 non-functional)  
**Estimated Execution Time**: 15-20 minutes for full suite
