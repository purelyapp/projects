#!/usr/bin/env node

/**
 * Environment Variables Check Script
 * Validates that all required environment variables are set
 */

require('dotenv').config({ path: '.env.local' });

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

const requiredEnvVars = {
  'NEXT_PUBLIC_SUPABASE_URL': {
    description: 'Supabase project URL',
    example: 'https://your-project.supabase.co',
    required: true
  },
  'NEXT_PUBLIC_SUPABASE_ANON_KEY': {
    description: 'Supabase anonymous key',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    required: true
  },
  'SUPABASE_SERVICE_ROLE_KEY': {
    description: 'Supabase service role key (for server-side operations)',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    required: false
  },
  'VERCEL_TOKEN': {
    description: 'Vercel API token (for deployment)',
    example: 'vercel_abc123...',
    required: false
  },
  'VERCEL_TEAM_ID': {
    description: 'Vercel team ID (for team deployments)',
    example: 'team_abc123...',
    required: false
  }
};

function checkEnvironmentVariables() {
  log(`${colors.bold}Environment Variables Check${colors.reset}`, 'blue');
  log('=====================================', 'blue');
  
  let allRequired = true;
  let hasOptional = false;
  
  for (const [varName, config] of Object.entries(requiredEnvVars)) {
    const value = process.env[varName];
    const status = value ? '✅' : (config.required ? '❌' : '⚠️ ');
    const color = value ? 'green' : (config.required ? 'red' : 'yellow');
    
    log(`\n${status} ${varName}`, color);
    log(`   Description: ${config.description}`, 'reset');
    
    if (value) {
      // Show first few characters for security
      const maskedValue = value.length > 20 
        ? `${value.substring(0, 10)}...${value.substring(value.length - 10)}`
        : `${value.substring(0, 5)}...`;
      log(`   Value: ${maskedValue}`, 'green');
    } else {
      log(`   Example: ${config.example}`, 'yellow');
      if (config.required) {
        allRequired = false;
      } else {
        hasOptional = true;
      }
    }
  }
  
  log('\n=====================================', 'blue');
  
  if (allRequired) {
    log('✅ All required environment variables are set!', 'green');
    
    if (hasOptional) {
      log('\n💡 Optional environment variables are missing but not required for basic functionality.', 'yellow');
      log('   Consider setting them for enhanced features like deployment automation.', 'yellow');
    }
    
    return true;
  } else {
    log('❌ Some required environment variables are missing!', 'red');
    log('\nTo fix this:', 'yellow');
    log('1. Copy .env.example to .env.local', 'yellow');
    log('2. Fill in the required values', 'yellow');
    log('3. Run this check again', 'yellow');
    
    return false;
  }
}

function generateEnvExample() {
  log('\n📝 Generating .env.example file...', 'blue');
  
  const envExample = Object.entries(requiredEnvVars)
    .map(([varName, config]) => {
      const comment = `# ${config.description}`;
      const example = config.example ? `# Example: ${config.example}` : '';
      const required = config.required ? '# Required' : '# Optional';
      return `${comment}\n${example}\n${required}\n${varName}=\n`;
    })
    .join('\n');
  
  const fs = require('fs');
  const path = require('path');
  
  try {
    fs.writeFileSync(path.join(process.cwd(), '.env.example'), envExample);
    log('✅ .env.example file created successfully!', 'green');
  } catch (error) {
    log(`❌ Failed to create .env.example: ${error.message}`, 'red');
  }
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--generate-example')) {
    generateEnvExample();
  }
  
  const success = checkEnvironmentVariables();
  
  if (!success) {
    log('\n💡 Tip: Run with --generate-example to create a .env.example file', 'yellow');
    process.exit(1);
  }
  
  process.exit(0);
}

main();
