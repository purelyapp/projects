# MCP Setup Guide for Purely Development

## 🎯 Overview

This guide will help you set up Model Context Protocol (MCP) integration for Purely Development projects, enabling AI agents to work seamlessly with GitHub, Linear, Notion, and Supabase.

## 📋 Prerequisites

- Cursor IDE installed
- Node.js 18+ installed
- Access to required services (GitHub, Linear, Notion, Supabase)
- API keys and tokens for each service

## 🔑 Required API Keys and Tokens

### 1. GitHub Personal Access Token

**Create Token:**

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Select scopes:
   - `repo` - Full repository access
   - `workflow` - Update GitHub Action workflows
   - `write:packages` - Write packages
   - `delete:packages` - Delete packages
   - `admin:org` - Full organization access
   - `user` - Update user data
4. Copy the token (starts with `ghp_`)

### 2. Linear API Key

**Create API Key:**

1. Go to Linear → Settings → API
2. Click "Create API key"
3. Give it a name (e.g., "Purely Development Agent")
4. Select permissions:
   - Read issues
   - Write issues
   - Read projects
   - Write projects
   - Read teams
   - Read users
5. Copy the API key (starts with `lin_api_`)

### 3. Notion Integration Token

**Create Integration:**

1. Go to Notion → Settings & Members → Connections
2. Click "New integration"
3. Give it a name (e.g., "Purely Development")
4. Select workspace
5. Copy the Internal Integration Token (starts with `secret_`)

**Share with Workspace:**

1. Go to the page/database you want to access
2. Click "Share" → "Add people, emails, groups, or integrations"
3. Search for your integration and add it

### 4. Supabase Credentials

**Get Credentials:**

1. Go to your Supabase project dashboard
2. Go to Settings → API
3. Copy:
   - Project URL (starts with `https://`)
   - Anon public key (starts with `eyJ`)
   - Service role key (starts with `eyJ`)

## ⚙️ Environment Configuration

### 1. Create Environment File

Create `.env.local` in the template directory:

```bash
# GitHub Configuration
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GITHUB_REPOSITORY=your-org/your-repo

# Linear Configuration
LINEAR_API_KEY=lin_api_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
LINEAR_TEAM_ID=your-team-id

# Notion Configuration
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=your-database-id

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Cursor IDE Configuration

Create `~/.cursor/settings.json`:

```json
{
  "cursor.mcp.enabled": true,
  "cursor.mcp.autoConnect": true,
  "cursor.mcp.logLevel": "info",
  "cursor.mcp.timeout": 30000,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  }
}
```

### 3. MCP Server Configuration

Create `~/.cursor/mcp.json`:

```json
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
        "SUPABASE_URL": "${NEXT_PUBLIC_SUPABASE_URL}",
        "SUPABASE_ANON_KEY": "${NEXT_PUBLIC_SUPABASE_ANON_KEY}",
        "SUPABASE_SERVICE_ROLE_KEY": "${SUPABASE_SERVICE_ROLE_KEY}"
      }
    }
  }
}
```

## 🚀 Installation Steps

### 1. Install MCP Servers

```bash
# Install all MCP servers globally
npm install -g @modelcontextprotocol/server-github
npm install -g @modelcontextprotocol/server-linear
npm install -g @modelcontextprotocol/server-notion
npm install -g @modelcontextprotocol/server-supabase
```

### 2. Install Project Dependencies

```bash
# Install project dependencies
npm install

# Install template dependencies
cd template
npm install
```

### 3. Test MCP Connections

```bash
# Test all MCP connections
npm run test-mcp

# Test individual services
npm run test-github
npm run test-linear
npm run test-notion
npm run test-supabase
```

### 4. Start Development Server

```bash
# Start the development server
npm run dev

# Visit the status page
open http://localhost:3000/status
```

## 🧪 Testing MCP Integration

### 1. Test GitHub Integration

```bash
# Test GitHub API access
curl -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user
```

### 2. Test Linear Integration

```bash
# Test Linear API access
curl -X POST https://api.linear.app/graphql \
  -H "Authorization: Bearer $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query": "{ viewer { id name email } }"}'
```

### 3. Test Notion Integration

```bash
# Test Notion API access
curl -H "Authorization: Bearer $NOTION_API_KEY" \
  -H "Notion-Version: 2022-06-28" \
  https://api.notion.com/v1/users/me
```

### 4. Test Supabase Integration

```bash
# Test Supabase API access
curl -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/"
```

## 📊 Status Monitoring

### 1. Status Page

Visit `http://localhost:3000/status` to see:

- Real-time MCP connection status
- Response times for each service
- Error details if connections fail
- System information

### 2. Health Check Script

```bash
# Run comprehensive health check
npm run health-check

# Check specific service
npm run test-github
npm run test-linear
npm run test-notion
npm run test-supabase
```

### 3. MCP Tool Verification

The status page will show:

- ✅ Green: Service connected and working
- ❌ Red: Service failed or not configured
- ⏳ Yellow: Service checking or timeout

## 🔧 Troubleshooting

### Common Issues

1. **Environment Variables Not Set**

   ```bash
   # Check if variables are loaded
   echo $GITHUB_TOKEN
   echo $LINEAR_API_KEY
   echo $NOTION_API_KEY
   ```

2. **API Key Permissions**

   - GitHub: Check token scopes
   - Linear: Verify API key permissions
   - Notion: Ensure integration has access to workspace
   - Supabase: Verify project URL and keys

3. **Network Connectivity**

   ```bash
   # Test network access
   ping api.github.com
   ping api.linear.app
   ping api.notion.com
   ping your-project.supabase.co
   ```

4. **MCP Server Issues**

   ```bash
   # Check MCP server installation
   npm list -g @modelcontextprotocol/server-*

   # Reinstall if needed
   npm install -g @modelcontextprotocol/server-github
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

## 🎯 Agent Workflow

### 1. Task Management

Agents will:

- Pull tasks from Linear
- Update task status through workflow
- Post progress updates as comments
- Create GitHub PRs for code changes
- Mark tasks complete when done

### 2. Code Operations

Agents will:

- Create/update files using GitHub MCP
- Run tests and verify functionality
- Create pull requests with detailed descriptions
- Merge code after review approval

### 3. Documentation

Agents will:

- Search Notion for relevant documentation
- Create/update documentation pages
- Link Linear issues to documentation
- Maintain knowledge base

## 📚 Additional Resources

- [MCP Protocol Documentation](https://modelcontextprotocol.io)
- [GitHub API Documentation](https://docs.github.com/en/rest)
- [Linear API Documentation](https://developers.linear.app)
- [Notion API Documentation](https://developers.notion.com)
- [Supabase Documentation](https://supabase.com/docs)

## ✅ Verification Checklist

- [ ] All API keys and tokens obtained
- [ ] Environment variables configured
- [ ] MCP servers installed
- [ ] Cursor IDE configured
- [ ] All connections tested
- [ ] Status page accessible
- [ ] Health checks passing
- [ ] Agent workflow tested
- [ ] Documentation updated
- [ ] Team trained on usage

## 🆘 Getting Help

If you encounter issues:

1. Check the [Troubleshooting Guide](./troubleshooting.md)
2. Run the health check scripts
3. Verify environment variables
4. Check MCP server logs
5. Contact the team for support

---

**Need help?** Check our [complete documentation](./) or reach out to the team.
