# Vercel MCP Server

This is a Model Context Protocol (MCP) server that provides Vercel deployment capabilities to AI assistants.

## Features

- Deploy projects to Vercel
- List Vercel projects
- Get project details
- MCP-compatible interface

## Deployment

1. Deploy this project to Vercel
2. Get your deployment URL (e.g., `https://your-project.vercel.app`)
3. Use the MCP endpoint: `https://your-project.vercel.app/mcp`

## Usage with Claude

1. Open Claude Desktop
2. Go to Settings → Connectors
3. Add custom connector:
   - Name: `Vercel`
   - URL: `https://your-project.vercel.app/mcp`

## Available Tools

- `deploy_project`: Deploy a project to Vercel
- `list_projects`: List all Vercel projects
- `get_project_details`: Get details of a specific project

## Example Usage

```
Deploy my GitHub repository to Vercel:
- Repository: https://github.com/username/sandbox
- Project name: sandbox
- Framework: Next.js
```