# Cursor AI Agent Instructions

## 🤖 Agent Workflow Overview

As a Cursor AI agent working on Purely Development projects, you must follow these comprehensive instructions to ensure proper integration with our MCP stack, GitHub, and Linear.

## 🎯 Core Principles

1. **Always use MCP tools** - Never work without proper MCP integration
2. **Manage tasks in Linear** - Track progress, move tasks through workflow
3. **Communicate via GitHub/Linear** - Post updates and results as comments
4. **Follow Purely Development standards** - Maintain consistency across all work
5. **Test everything** - Verify functionality before marking complete

## 🛠️ Required MCP Tools

### GitHub MCP

- `mcp_github_get_me` - Get current user info
- `mcp_github_search_repositories` - Search repositories
- `mcp_github_get_file_contents` - Read files
- `mcp_github_create_or_update_file` - Create/update files
- `mcp_github_create_pull_request` - Create PRs
- `mcp_github_list_pull_requests` - List PRs
- `mcp_github_get_pull_request` - Get PR details
- `mcp_github_create_issue` - Create issues
- `mcp_github_list_issues` - List issues
- `mcp_github_add_issue_comment` - Add comments
- `mcp_github_list_commits` - List commits

### Linear MCP

- `mcp_linear_list_issues` - List Linear issues
- `mcp_linear_get_issue` - Get issue details
- `mcp_linear_create_issue` - Create new issues
- `mcp_linear_update_issue` - Update issues
- `mcp_linear_list_issue_statuses` - List available statuses
- `mcp_linear_list_teams` - List teams
- `mcp_linear_list_projects` - List projects
- `mcp_linear_create_comment` - Add comments
- `mcp_linear_list_comments` - List comments

### Notion MCP

- `mcp_Notion_notion-search` - Search Notion workspace
- `mcp_Notion_notion-fetch` - Fetch Notion pages
- `mcp_Notion_notion-create-pages` - Create pages
- `mcp_Notion_notion-update-page` - Update pages

## 📋 Standard Agent Workflow

### 1. Task Initialization

```typescript
// Always start by getting current context
const currentUser = await mcp_github_get_me();
const linearIssues = await mcp_linear_list_issues({ assignee: "me" });
const currentTask = linearIssues.data.issues.find(
  (issue) => issue.state.name === "In Progress" || issue.state.name === "Todo"
);

// Post initialization status
await mcp_linear_create_comment({
  issueId: currentTask.id,
  body: `🤖 **Agent Initialized**\n\nStarting work on: ${currentTask.title}\n\n**Status**: Initializing...`,
});
```

### 2. Task Analysis

```typescript
// Analyze the task requirements
const taskDetails = await mcp_linear_get_issue({ id: currentTask.id });

// Search for related code/files
const relatedFiles = await mcp_github_search_code({
  q: `repo:${repoName} ${taskDetails.title}`,
  per_page: 10,
});

// Post analysis
await mcp_linear_create_comment({
  issueId: currentTask.id,
  body: `🔍 **Task Analysis Complete**\n\n**Requirements**: ${taskDetails.description}\n\n**Related Files Found**: ${relatedFiles.total_count}\n\n**Next Steps**: Beginning implementation...`,
});
```

### 3. Implementation Phase

```typescript
// Update task status to "In Progress"
await mcp_linear_update_issue({
  id: currentTask.id,
  state: "In Progress",
});

// Implement the solution
// ... your implementation code ...

// Create/update files
await mcp_github_create_or_update_file({
  owner: repoOwner,
  repo: repoName,
  path: filePath,
  content: fileContent,
  message: `feat: ${commitMessage}`,
});
```

### 4. Testing Phase

```typescript
// Run tests
const testResults = await runTests();

// Post test results
await mcp_linear_create_comment({
  issueId: currentTask.id,
  body: `🧪 **Testing Complete**\n\n**Test Results**:\n- ✅ Unit Tests: ${testResults.unit}\n- ✅ Integration Tests: ${testResults.integration}\n- ✅ E2E Tests: ${testResults.e2e}\n\n**Coverage**: ${testResults.coverage}%`,
});
```

### 5. Code Review Phase

```typescript
// Create pull request
const pr = await mcp_github_create_pull_request({
  owner: repoOwner,
  repo: repoName,
  title: `feat: ${currentTask.title}`,
  head: featureBranch,
  base: "main",
  body: `## Description\n\n${taskDetails.description}\n\n## Changes\n\n- [x] Implementation complete\n- [x] Tests passing\n- [x] Documentation updated\n\n## Testing Instructions\n\n${testingInstructions}\n\n## Linear Issue\n\nCloses #${currentTask.identifier}`,
});

// Update Linear task
await mcp_linear_update_issue({
  id: currentTask.id,
  state: "In Review",
});

// Post PR link to Linear
await mcp_linear_create_comment({
  issueId: currentTask.id,
  body: `📝 **Pull Request Created**\n\n**PR**: #${pr.number}\n**Link**: ${pr.html_url}\n\n**Status**: Ready for review`,
});
```

### 6. Completion Phase

```typescript
// Wait for PR approval and merge
// ... monitor PR status ...

// Update Linear task to complete
await mcp_linear_update_issue({
  id: currentTask.id,
  state: "Done",
});

// Post completion summary
await mcp_linear_create_comment({
  issueId: currentTask.id,
  body: `✅ **Task Completed**\n\n**Summary**:\n- ✅ Implementation complete\n- ✅ Tests passing\n- ✅ Code reviewed\n- ✅ Merged to main\n\n**PR**: #${pr.number}\n**Commit**: ${commitSha}\n\n**Next**: Moving to next task...`,
});
```

## 🔧 MCP Setup Instructions

### 1. Cursor IDE Configuration

```json
// .cursorrules
{
  "mcp": {
    "servers": {
      "github": {
        "command": "npx",
        "args": ["@modelcontextprotocol/server-github"],
        "env": {
          "GITHUB_PERSONAL_ACCESS_TOKEN": "your_token_here"
        }
      },
      "linear": {
        "command": "npx",
        "args": ["@modelcontextprotocol/server-linear"],
        "env": {
          "LINEAR_API_KEY": "your_linear_key_here"
        }
      },
      "notion": {
        "command": "npx",
        "args": ["@modelcontextprotocol/server-notion"],
        "env": {
          "NOTION_API_KEY": "your_notion_key_here"
        }
      }
    }
  }
}
```

### 2. Environment Variables

```bash
# Required MCP Environment Variables
GITHUB_PERSONAL_ACCESS_TOKEN=ghp_xxxxxxxxxxxx
LINEAR_API_KEY=lin_api_xxxxxxxxxxxx
NOTION_API_KEY=secret_xxxxxxxxxxxx

# Optional but recommended
GITHUB_REPOSITORY=owner/repo-name
LINEAR_TEAM_ID=team-id-here
NOTION_DATABASE_ID=database-id-here
```

### 3. Cursor Settings

```json
// settings.json
{
  "cursor.mcp.enabled": true,
  "cursor.mcp.autoConnect": true,
  "cursor.mcp.logLevel": "info",
  "cursor.mcp.timeout": 30000
}
```

## 📊 Status Reporting

### Daily Status Updates

```typescript
// Post daily status to Linear
const dailyStatus = {
  completed: completedTasks.length,
  inProgress: inProgressTasks.length,
  blocked: blockedTasks.length,
  nextUp: nextTasks.length,
};

await mcp_linear_create_comment({
  issueId: statusIssueId,
  body: `📊 **Daily Status Report**\n\n**Completed**: ${dailyStatus.completed}\n**In Progress**: ${dailyStatus.inProgress}\n**Blocked**: ${dailyStatus.blocked}\n**Next Up**: ${dailyStatus.nextUp}\n\n**Current Focus**: ${currentTask.title}`,
});
```

### Weekly Summary

```typescript
// Post weekly summary to GitHub
const weeklySummary = await generateWeeklySummary();

await mcp_github_create_issue({
  owner: repoOwner,
  repo: repoName,
  title: `Weekly Summary - ${new Date().toISOString().split("T")[0]}`,
  body: weeklySummary,
  labels: ["summary", "automated"],
});
```

## 🚨 Error Handling

### MCP Connection Errors

```typescript
try {
  await mcp_github_get_me();
} catch (error) {
  console.error("GitHub MCP Error:", error);
  await mcp_linear_create_comment({
    issueId: currentTask.id,
    body: `❌ **MCP Error**\n\nGitHub MCP connection failed: ${error.message}\n\n**Action Required**: Check GitHub token and MCP configuration`,
  });
}
```

### Task Blocking

```typescript
// If task is blocked, update status
await mcp_linear_update_issue({
  id: currentTask.id,
  state: "Blocked",
  description: `${
    taskDetails.description
  }\n\n**Blocked by**: ${blockingReason}\n**Blocked on**: ${new Date().toISOString()}`,
});

// Notify team
await mcp_linear_create_comment({
  issueId: currentTask.id,
  body: `🚫 **Task Blocked**\n\n**Reason**: ${blockingReason}\n\n**Action Required**: Human intervention needed`,
});
```

## 📝 Code Standards

### File Naming

- Use kebab-case for files: `user-profile.tsx`
- Use PascalCase for components: `UserProfile`
- Use camelCase for functions: `fetchUserData`

### Commit Messages

- Use conventional commits: `feat:`, `fix:`, `docs:`, `test:`, `chore:`
- Include Linear issue reference: `feat: add user authentication (LIN-123)`

### Pull Request Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing completed

## Linear Issue

Closes #[issue-number]

## Screenshots (if applicable)

Add screenshots here

## Checklist

- [ ] Code follows team standards
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] No console.log statements
- [ ] No commented code
```

## 🔄 Continuous Improvement

### Learning from Feedback

```typescript
// After each task completion, analyze feedback
const feedback = await analyzeTaskFeedback(currentTask.id);

if (feedback.areasForImprovement.length > 0) {
  await mcp_linear_create_comment({
    issueId: currentTask.id,
    body: `📚 **Learning Points**\n\n**Areas for Improvement**:\n${feedback.areasForImprovement
      .map((area) => `- ${area}`)
      .join("\n")}\n\n**Action Items**:\n${feedback.actionItems
      .map((item) => `- [ ] ${item}`)
      .join("\n")}`,
  });
}
```

### Performance Tracking

```typescript
// Track performance metrics
const metrics = {
  taskCompletionTime: Date.now() - taskStartTime,
  codeQualityScore: calculateCodeQuality(),
  testCoverage: getTestCoverage(),
  bugCount: getBugCount(),
};

// Store metrics for analysis
await storeMetrics(metrics);
```

## 🎯 Success Criteria

An agent is successful when:

1. ✅ All tasks are properly tracked in Linear
2. ✅ All code changes are reviewed via GitHub PRs
3. ✅ All tests pass before task completion
4. ✅ All communication is documented in Linear/GitHub
5. ✅ All MCP tools are properly utilized
6. ✅ Code follows Purely Development standards
7. ✅ Documentation is updated when needed
8. ✅ Performance metrics are tracked

## 🆘 Troubleshooting

### Common Issues

1. **MCP Connection Failed**

   - Check environment variables
   - Verify MCP server installation
   - Check network connectivity

2. **Linear API Errors**

   - Verify API key permissions
   - Check team ID configuration
   - Verify issue exists

3. **GitHub API Errors**
   - Check token permissions
   - Verify repository access
   - Check rate limits

### Getting Help

1. Check MCP server logs
2. Review error messages in Linear
3. Check GitHub API status
4. Contact team lead if blocked

---

**Remember**: You are an extension of the Purely Development team. Your work should be indistinguishable from human developers, but with the efficiency and consistency of AI. Always prioritize quality, communication, and following established processes.
