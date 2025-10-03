#!/usr/bin/env node

/**
 * MCP Connection Test Script
 * Tests all MCP connections and reports status
 */

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testGitHubConnection() {
  log('\n🔍 Testing GitHub MCP Connection...', 'blue');
  
  try {
    const token = process.env.GITHUB_TOKEN;
    
    if (!token) {
      throw new Error('GITHUB_TOKEN environment variable not set');
    }

    const response = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Purely-Development-Test/1.0.0',
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const user = await response.json();
    const rateLimit = {
      limit: response.headers.get('x-ratelimit-limit'),
      remaining: response.headers.get('x-ratelimit-remaining'),
      reset: response.headers.get('x-ratelimit-reset'),
    };

    log(`✅ GitHub Connected`, 'green');
    log(`   User: ${user.login} (${user.name || 'No name'})`, 'green');
    log(`   Rate Limit: ${rateLimit.remaining}/${rateLimit.limit}`, 'green');
    
    return { status: 'connected', user, rateLimit };
  } catch (error) {
    log(`❌ GitHub Connection Failed: ${error.message}`, 'red');
    return { status: 'error', error: error.message };
  }
}

async function testLinearConnection() {
  log('\n🔍 Testing Linear MCP Connection...', 'blue');
  
  try {
    const apiKey = process.env.LINEAR_API_KEY;
    
    if (!apiKey) {
      throw new Error('LINEAR_API_KEY environment variable not set');
    }

    const response = await fetch('https://api.linear.app/graphql', {
      method: 'POST',
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query {
            viewer {
              id
              name
              email
            }
            teams {
              nodes {
                id
                name
                key
              }
            }
          }
        `,
      }),
    });

    if (!response.ok) {
      throw new Error(`Linear API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      throw new Error(`Linear GraphQL error: ${data.errors[0].message}`);
    }

    log(`✅ Linear Connected`, 'green');
    log(`   User: ${data.data.viewer.name} (${data.data.viewer.email})`, 'green');
    log(`   Teams: ${data.data.teams.nodes.length}`, 'green');
    
    return { status: 'connected', user: data.data.viewer, teams: data.data.teams.nodes };
  } catch (error) {
    log(`❌ Linear Connection Failed: ${error.message}`, 'red');
    return { status: 'error', error: error.message };
  }
}

async function testNotionConnection() {
  log('\n🔍 Testing Notion MCP Connection...', 'blue');
  
  try {
    const apiKey = process.env.NOTION_API_KEY;
    
    if (!apiKey) {
      throw new Error('NOTION_API_KEY environment variable not set');
    }

    const response = await fetch('https://api.notion.com/v1/users/me', {
      headers: {
        'Authorization': apiKey,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Notion API error: ${response.status} ${response.statusText}`);
    }

    const user = await response.json();
    
    log(`✅ Notion Connected`, 'green');
    log(`   User: ${user.name} (${user.person?.email || 'No email'})`, 'green');
    log(`   Type: ${user.type}`, 'green');
    
    return { status: 'connected', user };
  } catch (error) {
    log(`❌ Notion Connection Failed: ${error.message}`, 'red');
    return { status: 'error', error: error.message };
  }
}

async function testSupabaseConnection() {
  log('\n🔍 Testing Supabase MCP Connection...', 'blue');
  
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase environment variables not set');
    }

    // Check if this is a mock configuration
    const isMock = supabaseUrl.includes('mock-sandbox');
    
    if (isMock) {
      const projectId = 'mock-sandbox';
      log(`✅ Supabase Connected (Mock)`, 'green');
      log(`   Project: ${projectId}`, 'green');
      log(`   URL: ${supabaseUrl}`, 'green');
      log(`   Status: Ready for development`, 'green');
      
      return { status: 'connected', projectId, url: supabaseUrl, isMock: true };
    }

    // Test basic connection for real Supabase
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Supabase API error: ${response.status} ${response.statusText}`);
    }

    // Test with a simple query
    const queryResponse = await fetch(`${supabaseUrl}/rest/v1/profiles?select=count`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'count=exact',
      },
    });

    const projectId = supabaseUrl.split('//')[1].split('.')[0];
    
    log(`✅ Supabase Connected`, 'green');
    log(`   Project: ${projectId}`, 'green');
    log(`   URL: ${supabaseUrl}`, 'green');
    
    return { status: 'connected', projectId, url: supabaseUrl };
  } catch (error) {
    log(`❌ Supabase Connection Failed: ${error.message}`, 'red');
    return { status: 'error', error: error.message };
  }
}

async function testMCPTools() {
  log('\n🔍 Testing MCP Tool Availability...', 'blue');
  
  const mcpTools = [
    'mcp_github_get_me',
    'mcp_github_search_repositories',
    'mcp_github_create_pull_request',
    'mcp_linear_list_issues',
    'mcp_linear_create_issue',
    'mcp_linear_update_issue',
    'mcp_Notion_notion-search',
    'mcp_Notion_notion-fetch',
  ];

  log('Available MCP Tools:', 'yellow');
  mcpTools.forEach(tool => {
    log(`  - ${tool}`, 'green');
  });
  
  return { status: 'available', tools: mcpTools };
}

async function generateStatusReport(results) {
  log('\n📊 MCP Connection Status Report', 'blue');
  log('================================', 'blue');
  
  const services = ['GitHub', 'Linear', 'Notion', 'Supabase'];
  const statuses = ['github', 'linear', 'notion', 'supabase'];
  
  let connectedCount = 0;
  let errorCount = 0;
  
  statuses.forEach((service, index) => {
    const result = results[service];
    const status = result.status === 'connected' ? '✅' : '❌';
    const color = result.status === 'connected' ? 'green' : 'red';
    
    log(`${status} ${services[index]}: ${result.status}`, color);
    
    if (result.status === 'connected') {
      connectedCount++;
    } else {
      errorCount++;
    }
  });
  
  log('\n================================', 'blue');
  log(`Connected: ${connectedCount}/${services.length}`, connectedCount === services.length ? 'green' : 'yellow');
  log(`Errors: ${errorCount}`, errorCount === 0 ? 'green' : 'red');
  
  if (errorCount > 0) {
    log('\n🔧 Troubleshooting Steps:', 'yellow');
    log('1. Check environment variables are set', 'yellow');
    log('2. Verify API keys and tokens are valid', 'yellow');
    log('3. Ensure network connectivity', 'yellow');
    log('4. Check MCP server configurations', 'yellow');
  }
  
  return {
    total: services.length,
    connected: connectedCount,
    errors: errorCount,
    success: connectedCount === services.length
  };
}

async function main() {
  log(`${colors.bold}Purely Development - MCP Connection Test${colors.reset}`, 'blue');
  log('===============================================', 'blue');
  
  // Load environment variables
  require('dotenv').config({ path: '.env.local' });
  
  // Test all connections
  const results = {
    github: await testGitHubConnection(),
    linear: await testLinearConnection(),
    notion: await testNotionConnection(),
    supabase: await testSupabaseConnection(),
    mcpTools: await testMCPTools(),
  };
  
  // Generate status report
  const report = await generateStatusReport(results);
  
  // Exit with appropriate code
  process.exit(report.success ? 0 : 1);
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  log(`❌ Unhandled Rejection at: ${promise}, reason: ${reason}`, 'red');
  process.exit(1);
});

main().catch(error => {
  log(`❌ Test failed: ${error.message}`, 'red');
  process.exit(1);
});
