# MCP Notion Integration Guide

## 🎯 Overview

This guide explains how to integrate the Project Manager with Notion using MCP (Model Context Protocol) tools when they become available.

## 🔧 Current Implementation

The Project Manager currently uses direct Notion API integration with the following features:

- **Direct API Integration**: Uses Notion API v1 directly
- **Mock Mode**: Works without API key for testing
- **Structured Content**: Creates properly formatted Notion pages
- **Error Handling**: Graceful fallback when API key is missing

## 🚀 MCP Integration (When Available)

### Available MCP Tools for Notion

When MCP tools are available, you can use the following functions:

```typescript
// Search for pages in Notion
await mcp_Notion_notion_search({
  query: "Project Scopes",
  query_type: "internal"
});

// Fetch page content
await mcp_Notion_notion_fetch({
  page_id: "282c761a423e80debc1de9c87c63ecc4"
});

// Create new pages
await mcp_Notion_notion_create_pages({
  pages: [{
    properties: { title: "New Project" },
    content: "# Project Content\n\nDescription here..."
  }]
});
```

### Integration Steps

1. **Replace Direct API Calls**:
   ```typescript
   // Instead of direct fetch calls
   const response = await fetch('https://api.notion.com/v1/pages', {
     method: 'POST',
     headers: { /* ... */ },
     body: JSON.stringify(pageContent)
   });

   // Use MCP tools
   const result = await mcp_Notion_notion_create_pages({
     pages: [pageContent]
   });
   ```

2. **Update Error Handling**:
   ```typescript
   try {
     const notionPage = await mcp_Notion_notion_create_pages({
       pages: [pageData]
     });
     return notionPage;
   } catch (error) {
     console.error('MCP Notion error:', error);
     return null;
   }
   ```

3. **Search Functionality**:
   ```typescript
   // Search for existing projects
   const searchResults = await mcp_Notion_notion_search({
     query: "Project Scopes",
     query_type: "internal"
   });
   ```

## 📋 Current Status

### ✅ Working Features
- Project Manager form at `/project-manager`
- MD file generation with proper naming
- File download with correct extensions
- Notion integration (mock mode)
- Error handling and validation
- Loading states and user feedback

### 🔄 Ready for MCP Integration
- Code structure supports easy MCP integration
- Error handling already in place
- Mock mode allows testing without API keys
- Comprehensive test suite available

## 🧪 Testing MCP Integration

### Test Script for MCP Tools
```typescript
// test-mcp-notion.js
async function testMCPNotionIntegration() {
  try {
    // Test search
    const searchResults = await mcp_Notion_notion_search({
      query: "Project Scopes",
      query_type: "internal"
    });
    console.log('Search results:', searchResults);

    // Test page creation
    const newPage = await mcp_Notion_notion_create_pages({
      pages: [{
        properties: { title: "MCP Test Project" },
        content: "# Test Project\n\nCreated via MCP"
      }]
    });
    console.log('Created page:', newPage);

  } catch (error) {
    console.error('MCP test failed:', error);
  }
}
```

### Verification Steps
1. Run MCP connection test: `npm run test-mcp`
2. Test Notion MCP tools specifically
3. Verify page creation in Notion workspace
4. Check search functionality
5. Test error handling

## 🔑 Environment Configuration

### Required Environment Variables
```bash
# For direct API integration (current)
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# For MCP integration (when available)
MCP_NOTION_ENABLED=true
MCP_NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### MCP Configuration
```json
// ~/.cursor/mcp.json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-notion"],
      "env": {
        "NOTION_API_KEY": "${NOTION_API_KEY}"
      }
    }
  }
}
```

## 📊 Benefits of MCP Integration

### Advantages
- **Standardized Interface**: Consistent API across all MCP tools
- **Better Error Handling**: MCP provides standardized error responses
- **Easier Testing**: MCP tools are easier to mock and test
- **Future-Proof**: MCP is the standard for AI agent integrations

### Migration Benefits
- **Simplified Code**: Less boilerplate for API calls
- **Better Debugging**: MCP provides better error messages
- **Consistent Patterns**: Same patterns as other MCP integrations
- **Enhanced Features**: Access to MCP-specific features

## 🚀 Implementation Plan

### Phase 1: Preparation
- [x] Current direct API integration working
- [x] Mock mode for testing
- [x] Error handling in place
- [x] Test suite available

### Phase 2: MCP Integration (When Available)
- [ ] Install MCP Notion server
- [ ] Update code to use MCP tools
- [ ] Test MCP integration
- [ ] Verify functionality
- [ ] Update documentation

### Phase 3: Production Deployment
- [ ] Configure MCP servers
- [ ] Set up environment variables
- [ ] Deploy with MCP integration
- [ ] Monitor and maintain

## 🔍 Troubleshooting

### Common Issues
1. **MCP Tools Not Available**: Use direct API integration (current implementation)
2. **API Key Issues**: Check environment variables
3. **Permission Errors**: Verify Notion integration permissions
4. **Network Issues**: Check connectivity to Notion API

### Debug Steps
1. Test MCP connection: `npm run test-mcp`
2. Check environment variables
3. Verify Notion integration permissions
4. Test with mock data
5. Check server logs

## 📚 Resources

- [MCP Protocol Documentation](https://modelcontextprotocol.io)
- [Notion API Documentation](https://developers.notion.com)
- [MCP Notion Server](https://github.com/modelcontextprotocol/servers/tree/main/src/notion)
- [Project Manager Status](./PROJECT_MANAGER_STATUS.md)

---

**Status**: ✅ **READY FOR MCP INTEGRATION**

The Project Manager is fully functional and ready for MCP integration when the tools become available. The current implementation provides a solid foundation for easy migration to MCP tools.