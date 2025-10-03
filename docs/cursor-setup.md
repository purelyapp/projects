# Cursor IDE Setup Guide

## 🎯 Overview

This guide will help you set up Cursor IDE with full MCP integration for Purely Development projects.

## 📋 Prerequisites

- Cursor IDE installed
- Node.js 18+ installed
- Git configured
- Access to required services (GitHub, Linear, Notion)

## 🚀 Installation

### 1. Install Cursor IDE

```bash
# Download from https://cursor.sh
# Or install via package manager

# macOS
brew install --cask cursor

# Windows (via winget)
winget install Cursor.Cursor

# Linux
# Download from website or use snap
sudo snap install cursor
```

### 2. Install MCP Servers

```bash
# Install GitHub MCP server
npm install -g @modelcontextprotocol/server-github

# Install Linear MCP server
npm install -g @modelcontextprotocol/server-linear

# Install Notion MCP server
npm install -g @modelcontextprotocol/server-notion

# Install Supabase MCP server (if using)
npm install -g @modelcontextprotocol/server-supabase
```

## ⚙️ Configuration

### 1. Cursor Settings

Create or update your Cursor settings:

```json
// ~/.cursor/settings.json
{
  "cursor.mcp.enabled": true,
  "cursor.mcp.autoConnect": true,
  "cursor.mcp.logLevel": "info",
  "cursor.mcp.timeout": 30000,
  "cursor.mcp.retryAttempts": 3,
  "cursor.mcp.retryDelay": 1000,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

### 2. MCP Configuration

Create MCP configuration file:

```json
// ~/.cursor/mcp.json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "linear": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-linear"],
      "env": {
        "LINEAR_API_KEY": "${LINEAR_API_KEY}"
      }
    },
    "notion": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-notion"],
      "env": {
        "NOTION_API_KEY": "${NOTION_API_KEY}"
      }
    },
    "supabase": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-supabase"],
      "env": {
        "SUPABASE_URL": "${SUPABASE_URL}",
        "SUPABASE_ANON_KEY": "${SUPABASE_ANON_KEY}",
        "SUPABASE_SERVICE_ROLE_KEY": "${SUPABASE_SERVICE_ROLE_KEY}"
      }
    }
  }
}
```

### 3. Environment Variables

Create environment file:

```bash
# ~/.cursor/.env
# GitHub Configuration
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GITHUB_REPOSITORY=your-org/your-repo

# Linear Configuration
LINEAR_API_KEY=lin_api_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
LINEAR_TEAM_ID=your-team-id

# Notion Configuration
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=your-database-id

# Supabase Configuration (if using)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Cursor Rules

Create project-specific rules:

```json
// .cursorrules
{
  "rules": [
    "Always use TypeScript for new code",
    "Follow ESLint and Prettier configurations",
    "Use functional components with hooks for React",
    "Implement proper error handling",
    "Add comprehensive JSDoc comments",
    "Write unit tests for all functions",
    "Use meaningful variable and function names",
    "Follow Purely Development file structure",
    "Use MCP tools for all external integrations",
    "Always test code before committing",
    "Update documentation when making changes",
    "Follow conventional commit messages",
    "Create pull requests for all changes",
    "Use Linear for task management",
    "Post status updates to Linear/GitHub"
  ],
  "mcp": {
    "enabled": true,
    "servers": ["github", "linear", "notion", "supabase"],
    "autoConnect": true
  },
  "codeStyle": {
    "indentSize": 2,
    "useTabs": false,
    "quoteStyle": "double",
    "semicolons": true,
    "trailingCommas": "es5"
  }
}
```

## 🔧 MCP Server Setup

### 1. GitHub MCP Server

```bash
# Install
npm install -g @modelcontextprotocol/server-github

# Test connection
npx @modelcontextprotocol/server-github --test

# Configure
export GITHUB_PERSONAL_ACCESS_TOKEN="your_token_here"
```

**Required GitHub Token Permissions:**

- `repo` - Full repository access
- `workflow` - Update GitHub Action workflows
- `write:packages` - Write packages
- `delete:packages` - Delete packages
- `admin:org` - Full organization access
- `user` - Update user data

### 2. Linear MCP Server

```bash
# Install
npm install -g @modelcontextprotocol/server-linear

# Test connection
npx @modelcontextprotocol/server-linear --test

# Configure
export LINEAR_API_KEY="your_api_key_here"
```

**Linear API Key Setup:**

1. Go to Linear Settings → API
2. Create new API key
3. Grant necessary permissions:
   - Read issues
   - Write issues
   - Read projects
   - Write projects
   - Read teams
   - Read users

### 3. Notion MCP Server

```bash
# Install
npm install -g @modelcontextprotocol/server-notion

# Test connection
npx @modelcontextprotocol/server-notion --test

# Configure
export NOTION_API_KEY="your_api_key_here"
```

**Notion Integration Setup:**

1. Go to Notion → Settings & Members → Connections
2. Create new integration
3. Copy the Internal Integration Token
4. Share your workspace with the integration

### 4. Supabase MCP Server

```bash
# Install
npm install -g @modelcontextprotocol/server-supabase

# Test connection
npx @modelcontextprotocol/server-supabase --test

# Configure
export SUPABASE_URL="your_supabase_url"
export SUPABASE_ANON_KEY="your_anon_key"
export SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"
```

## 🧪 Testing MCP Connections

### 1. Test Script

Create a test script to verify all MCP connections:

```typescript
// scripts/test-mcp.ts
import { testGitHubConnection } from "./test-github";
import { testLinearConnection } from "./test-linear";
import { testNotionConnection } from "./test-notion";
import { testSupabaseConnection } from "./test-supabase";

async function testAllConnections() {
  console.log("🧪 Testing MCP Connections...\n");

  const results = await Promise.allSettled([
    testGitHubConnection(),
    testLinearConnection(),
    testNotionConnection(),
    testSupabaseConnection(),
  ]);

  results.forEach((result, index) => {
    const services = ["GitHub", "Linear", "Notion", "Supabase"];
    if (result.status === "fulfilled") {
      console.log(`✅ ${services[index]}: Connected`);
    } else {
      console.log(`❌ ${services[index]}: Failed - ${result.reason}`);
    }
  });
}

testAllConnections();
```

### 2. Individual Test Functions

```typescript
// scripts/test-github.ts
export async function testGitHubConnection() {
  // Test GitHub MCP connection
  const response = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `token ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  const user = await response.json();
  console.log(`GitHub connected as: ${user.login}`);
  return true;
}

// scripts/test-linear.ts
export async function testLinearConnection() {
  // Test Linear MCP connection
  const response = await fetch("https://api.linear.app/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.LINEAR_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: "{ viewer { id name email } }",
    }),
  });

  if (!response.ok) {
    throw new Error(`Linear API error: ${response.status}`);
  }

  const data = await response.json();
  console.log(`Linear connected as: ${data.data.viewer.name}`);
  return true;
}

// scripts/test-notion.ts
export async function testNotionConnection() {
  // Test Notion MCP connection
  const response = await fetch("https://api.notion.com/v1/users/me", {
    headers: {
      Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
      "Notion-Version": "2022-06-28",
    },
  });

  if (!response.ok) {
    throw new Error(`Notion API error: ${response.status}`);
  }

  const user = await response.json();
  console.log(`Notion connected as: ${user.name}`);
  return true;
}

// scripts/test-supabase.ts
export async function testSupabaseConnection() {
  // Test Supabase MCP connection
  const { createClient } = require("@supabase/supabase-js");

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from("profiles")
    .select("count")
    .limit(1);

  if (error) {
    throw new Error(`Supabase error: ${error.message}`);
  }

  console.log(`Supabase connected successfully`);
  return true;
}
```

## 🔍 Troubleshooting

### Common Issues

1. **MCP Server Not Starting**

   ```bash
   # Check if servers are installed
   npm list -g @modelcontextprotocol/server-*

   # Reinstall if needed
   npm install -g @modelcontextprotocol/server-github
   ```

2. **Authentication Errors**

   ```bash
   # Check environment variables
   echo $GITHUB_TOKEN
   echo $LINEAR_API_KEY
   echo $NOTION_API_KEY

   # Test API connections
   curl -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user
   ```

3. **Permission Errors**

   - Check GitHub token permissions
   - Verify Linear API key scope
   - Confirm Notion integration access

4. **Network Issues**
   ```bash
   # Test network connectivity
   ping api.github.com
   ping api.linear.app
   ping api.notion.com
   ```

### Debug Mode

Enable debug mode for detailed logging:

```json
// ~/.cursor/settings.json
{
  "cursor.mcp.logLevel": "debug",
  "cursor.mcp.debug": true
}
```

## 📚 Additional Resources

- [Cursor Documentation](https://cursor.sh/docs)
- [MCP Protocol](https://modelcontextprotocol.io)
- [GitHub API](https://docs.github.com/en/rest)
- [Linear API](https://developers.linear.app)
- [Notion API](https://developers.notion.com)

## ✅ Verification Checklist

- [ ] Cursor IDE installed and configured
- [ ] All MCP servers installed
- [ ] Environment variables set
- [ ] GitHub token with correct permissions
- [ ] Linear API key configured
- [ ] Notion integration set up
- [ ] Supabase credentials configured
- [ ] Test script runs successfully
- [ ] All connections verified
- [ ] Cursor rules configured
- [ ] Project-specific settings applied

---

**Need help?** Check the [Troubleshooting Guide](./troubleshooting.md) or reach out to the team.
