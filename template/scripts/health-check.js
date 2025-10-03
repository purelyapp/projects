#!/usr/bin/env node

/**
 * Health Check Script
 * Verifies that all systems are working correctly
 */

const { createClient } = require('@supabase/supabase-js');
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

async function checkEnvironmentVariables() {
  log('\n🔍 Checking environment variables...', 'blue');
  
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ];
  
  const missing = [];
  
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }
  
  if (missing.length > 0) {
    log(`❌ Missing environment variables: ${missing.join(', ')}`, 'red');
    return false;
  }
  
  log('✅ All required environment variables are set', 'green');
  return true;
}

async function checkDatabaseConnection() {
  log('\n🗄️  Checking database connection...', 'blue');
  
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    
    // Test connection with a simple query
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (error) {
      log(`❌ Database connection failed: ${error.message}`, 'red');
      return false;
    }
    
    log('✅ Database connection successful', 'green');
    return true;
  } catch (error) {
    log(`❌ Database connection error: ${error.message}`, 'red');
    return false;
  }
}

async function checkBuildProcess() {
  log('\n🔨 Checking build process...', 'blue');
  
  try {
    const { execSync } = require('child_process');
    
    // Run type check
    log('  Running TypeScript type check...', 'yellow');
    execSync('npx tsc --noEmit', { stdio: 'pipe' });
    log('  ✅ TypeScript type check passed', 'green');
    
    // Run linting
    log('  Running ESLint...', 'yellow');
    execSync('npm run lint', { stdio: 'pipe' });
    log('  ✅ ESLint passed', 'green');
    
    log('✅ Build process checks passed', 'green');
    return true;
  } catch (error) {
    log(`❌ Build process failed: ${error.message}`, 'red');
    return false;
  }
}

async function checkTests() {
  log('\n🧪 Checking tests...', 'blue');
  
  try {
    const { execSync } = require('child_process');
    
    execSync('npm run test -- --passWithNoTests', { stdio: 'pipe' });
    log('✅ Tests passed', 'green');
    return true;
  } catch (error) {
    log(`❌ Tests failed: ${error.message}`, 'red');
    return false;
  }
}

async function main() {
  log(`${colors.bold}Purely Development Health Check${colors.reset}`, 'blue');
  log('================================', 'blue');
  
  const checks = [
    checkEnvironmentVariables,
    checkDatabaseConnection,
    checkBuildProcess,
    checkTests
  ];
  
  let allPassed = true;
  
  for (const check of checks) {
    const passed = await check();
    if (!passed) {
      allPassed = false;
    }
  }
  
  log('\n================================', 'blue');
  
  if (allPassed) {
    log('🎉 All health checks passed! Your system is ready for development.', 'green');
    process.exit(0);
  } else {
    log('❌ Some health checks failed. Please fix the issues above.', 'red');
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  log(`❌ Unhandled Rejection at: ${promise}, reason: ${reason}`, 'red');
  process.exit(1);
});

main().catch(error => {
  log(`❌ Health check failed: ${error.message}`, 'red');
  process.exit(1);
});
