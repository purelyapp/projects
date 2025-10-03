# Linear Workflow for AI Agents

## 🎯 Overview

This document defines the Linear workflow that AI agents should follow when managing tasks in Purely Development projects.

## 📋 Workflow States

### 1. Backlog

- **Description**: Tasks that are planned but not yet started
- **Agent Action**: None (wait for assignment)
- **Human Action**: Assign to agent or move to Todo

### 2. Todo

- **Description**: Tasks ready to be worked on
- **Agent Action**:
  - Move to "In Progress"
  - Post initialization comment
  - Begin analysis
- **Human Action**: Assign to agent

### 3. In Progress

- **Description**: Tasks currently being worked on
- **Agent Action**:
  - Regular status updates
  - Code implementation
  - Testing
  - Documentation updates
- **Human Action**: Monitor progress, provide feedback

### 4. In Review

- **Description**: Tasks completed and ready for review
- **Agent Action**:
  - Create pull request
  - Post PR link to Linear
  - Wait for review feedback
- **Human Action**: Review code, approve or request changes

### 5. Done

- **Description**: Tasks completed and merged
- **Agent Action**:
  - Post completion summary
  - Move to next task
- **Human Action**: None

### 6. Blocked

- **Description**: Tasks that cannot proceed
- **Agent Action**:
  - Post blocking reason
  - Request human intervention
- **Human Action**: Resolve blocking issue

## 🔄 Agent Workflow Process

### Step 1: Task Initialization

```typescript
// When starting a new task
async function initializeTask(issueId: string) {
  // Update status to In Progress
  await mcp_linear_update_issue({
    id: issueId,
    state: "In Progress",
  });

  // Post initialization comment
  await mcp_linear_create_comment({
    issueId,
    body: `🤖 **Agent Initialized**

**Task**: ${issue.title}
**Status**: Starting analysis
**Estimated Time**: ${estimateTime(issue)}

**Next Steps**:
- [ ] Analyze requirements
- [ ] Review existing code
- [ ] Plan implementation
- [ ] Begin development`,
  });
}
```

### Step 2: Progress Updates

```typescript
// Regular progress updates
async function updateProgress(issueId: string, progress: string) {
  await mcp_linear_create_comment({
    issueId,
    body: `📊 **Progress Update**

**Status**: ${progress}
**Time**: ${new Date().toLocaleString()}

**Completed**:
- [x] Analysis complete
- [x] Implementation started
- [ ] Testing in progress
- [ ] Documentation pending

**Next**: ${getNextStep()}`,
  });
}
```

### Step 3: Code Review Request

```typescript
// When code is ready for review
async function requestReview(issueId: string, prUrl: string) {
  // Update status to In Review
  await mcp_linear_update_issue({
    id: issueId,
    state: "In Review",
  });

  // Post review request
  await mcp_linear_create_comment({
    issueId,
    body: `📝 **Ready for Review**

**Pull Request**: ${prUrl}
**Status**: Code complete, tests passing

**Review Checklist**:
- [ ] Code follows standards
- [ ] Tests are comprehensive
- [ ] Documentation updated
- [ ] Performance acceptable
- [ ] Security considerations addressed

**Changes**:
${getChangeSummary()}

**Testing Instructions**:
${getTestingInstructions()}`,
  });
}
```

### Step 4: Task Completion

```typescript
// When task is complete
async function completeTask(issueId: string, prUrl: string) {
  // Update status to Done
  await mcp_linear_update_issue({
    id: issueId,
    state: "Done",
  });

  // Post completion summary
  await mcp_linear_create_comment({
    issueId,
    body: `✅ **Task Completed**

**Summary**:
- ✅ Implementation complete
- ✅ Tests passing
- ✅ Code reviewed
- ✅ Merged to main

**Pull Request**: ${prUrl}
**Commit**: ${getCommitHash()}

**Metrics**:
- Development Time: ${getDevelopmentTime()}
- Lines of Code: ${getLinesOfCode()}
- Test Coverage: ${getTestCoverage()}%

**Next**: Moving to next task in queue`,
  });
}
```

### Step 5: Error Handling

```typescript
// When task encounters an error
async function handleError(issueId: string, error: Error) {
  // Update status to Blocked
  await mcp_linear_update_issue({
    id: issueId,
    state: "Blocked",
  });

  // Post error details
  await mcp_linear_create_comment({
    issueId,
    body: `❌ **Task Blocked**

**Error**: ${error.message}
**Time**: ${new Date().toLocaleString()}

**Details**:
${error.stack}

**Action Required**: Human intervention needed

**Possible Solutions**:
- Check environment configuration
- Verify API credentials
- Review code for issues
- Contact team lead`,
  });
}
```

## 📊 Status Monitoring

### Daily Status Report

```typescript
// Generate daily status report
async function generateDailyStatus() {
  const issues = await mcp_linear_list_issues({
    assignee: "me",
    limit: 50,
  });

  const statusCounts = {
    todo: issues.data.issues.filter((i) => i.state.name === "Todo").length,
    inProgress: issues.data.issues.filter((i) => i.state.name === "In Progress")
      .length,
    inReview: issues.data.issues.filter((i) => i.state.name === "In Review")
      .length,
    done: issues.data.issues.filter((i) => i.state.name === "Done").length,
    blocked: issues.data.issues.filter((i) => i.state.name === "Blocked")
      .length,
  };

  const report = `📊 **Daily Status Report**

**Task Distribution**:
- Todo: ${statusCounts.todo}
- In Progress: ${statusCounts.inProgress}
- In Review: ${statusCounts.inReview}
- Done: ${statusCounts.done}
- Blocked: ${statusCounts.blocked}

**Current Focus**: ${getCurrentTask()}
**Next Priority**: ${getNextPriority()}

**Performance**:
- Tasks Completed Today: ${getCompletedToday()}
- Average Completion Time: ${getAverageTime()}
- Success Rate: ${getSuccessRate()}%`;

  // Post to status issue or team channel
  await postStatusReport(report);
}
```

### Weekly Summary

```typescript
// Generate weekly summary
async function generateWeeklySummary() {
  const weekIssues = await getIssuesForWeek();

  const summary = `📈 **Weekly Summary**

**Completed Tasks**: ${weekIssues.completed.length}
**In Progress**: ${weekIssues.inProgress.length}
**Blocked**: ${weekIssues.blocked.length}

**Key Achievements**:
${weekIssues.completed.map((issue) => `- ${issue.title}`).join("\n")}

**Areas for Improvement**:
${getImprovementAreas()}

**Next Week Priorities**:
${getNextWeekPriorities()}`;

  // Post to team channel
  await postWeeklySummary(summary);
}
```

## 🏷️ Label Management

### Automatic Labeling

```typescript
// Apply labels based on task content
async function applyLabels(
  issueId: string,
  title: string,
  description: string
) {
  const labels = [];

  // Technology labels
  if (title.includes("React") || description.includes("React")) {
    labels.push("react");
  }
  if (title.includes("API") || description.includes("API")) {
    labels.push("api");
  }
  if (title.includes("Database") || description.includes("Database")) {
    labels.push("database");
  }

  // Priority labels
  if (title.includes("urgent") || title.includes("critical")) {
    labels.push("high-priority");
  }

  // Type labels
  if (title.includes("bug") || title.includes("fix")) {
    labels.push("bug");
  }
  if (title.includes("feature") || title.includes("add")) {
    labels.push("feature");
  }

  // Apply labels
  await mcp_linear_update_issue({
    id: issueId,
    labels,
  });
}
```

## 🔔 Notifications

### Status Change Notifications

```typescript
// Notify team of status changes
async function notifyStatusChange(
  issueId: string,
  oldStatus: string,
  newStatus: string
) {
  const issue = await mcp_linear_get_issue({ id: issueId });

  const notification = `🔔 **Status Update**

**Issue**: ${issue.title}
**Changed**: ${oldStatus} → ${newStatus}
**Assignee**: ${issue.assignee?.name || "Unassigned"}
**Priority**: ${issue.priority}

**Link**: ${issue.url}`;

  // Post to team channel
  await postToTeamChannel(notification);
}
```

### Deadline Alerts

```typescript
// Check for approaching deadlines
async function checkDeadlines() {
  const issues = await mcp_linear_list_issues({
    assignee: "me",
    state: ["Todo", "In Progress"],
  });

  const approachingDeadlines = issues.data.issues.filter((issue) => {
    if (!issue.dueDate) return false;

    const dueDate = new Date(issue.dueDate);
    const now = new Date();
    const daysUntilDue = Math.ceil(
      (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    return daysUntilDue <= 2 && daysUntilDue >= 0;
  });

  for (const issue of approachingDeadlines) {
    await mcp_linear_create_comment({
      issueId: issue.id,
      body: `⚠️ **Deadline Alert**

**Due Date**: ${issue.dueDate}
**Days Remaining**: ${Math.ceil(
        (new Date(issue.dueDate).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )}

**Action Required**: Please prioritize this task`,
    });
  }
}
```

## 📈 Performance Metrics

### Task Completion Metrics

```typescript
// Track performance metrics
interface TaskMetrics {
  completionTime: number;
  codeQuality: number;
  testCoverage: number;
  bugCount: number;
  reviewCycles: number;
}

async function trackTaskMetrics(issueId: string, metrics: TaskMetrics) {
  // Store metrics for analysis
  await storeMetrics(issueId, metrics);

  // Post metrics summary
  await mcp_linear_create_comment({
    issueId,
    body: `📊 **Task Metrics**

**Completion Time**: ${metrics.completionTime} hours
**Code Quality**: ${metrics.codeQuality}/10
**Test Coverage**: ${metrics.testCoverage}%
**Bugs Found**: ${metrics.bugCount}
**Review Cycles**: ${metrics.reviewCycles}

**Performance**: ${getPerformanceRating(metrics)}`,
  });
}
```

## 🎯 Best Practices

### 1. Regular Communication

- Post updates every 2-4 hours during active work
- Always explain what you're doing and why
- Ask for clarification when requirements are unclear

### 2. Quality Assurance

- Always test code before marking complete
- Follow coding standards and best practices
- Update documentation when making changes

### 3. Error Handling

- Don't let tasks sit in error state for more than 1 hour
- Always provide detailed error information
- Suggest possible solutions when reporting errors

### 4. Time Management

- Provide realistic time estimates
- Update estimates if scope changes
- Don't overcommit to too many tasks

### 5. Collaboration

- Work with human team members effectively
- Accept feedback gracefully
- Learn from mistakes and improve

---

**Remember**: The goal is to work seamlessly with the human team while maintaining high quality and clear communication throughout the development process.
