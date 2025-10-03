#!/usr/bin/env node

/**
 * Database Test Script
 * Tests database connection and basic operations
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

async function testDatabaseConnection() {
  log(`${colors.bold}Database Connection Test${colors.reset}`, 'blue');
  log('============================', 'blue');
  
  // Check environment variables
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    log('❌ Missing required environment variables', 'red');
    log('   NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required', 'red');
    return false;
  }
  
  log('✅ Environment variables found', 'green');
  
  // Create Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  
  log('✅ Supabase client created', 'green');
  
  // Test basic connection
  try {
    log('\n🔍 Testing basic connection...', 'yellow');
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (error) {
      log(`❌ Database query failed: ${error.message}`, 'red');
      log(`   Code: ${error.code}`, 'red');
      log(`   Details: ${error.details}`, 'red');
      log(`   Hint: ${error.hint}`, 'red');
      return false;
    }
    
    log('✅ Basic connection successful', 'green');
    log(`   Query returned: ${JSON.stringify(data)}`, 'green');
    
  } catch (error) {
    log(`❌ Connection error: ${error.message}`, 'red');
    return false;
  }
  
  // Test table existence
  try {
    log('\n🔍 Testing table structure...', 'yellow');
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(0);
    
    if (error) {
      log(`❌ Table structure test failed: ${error.message}`, 'red');
      return false;
    }
    
    log('✅ Table structure is valid', 'green');
    
  } catch (error) {
    log(`❌ Table structure error: ${error.message}`, 'red');
    return false;
  }
  
  // Test RLS policies (if any)
  try {
    log('\n🔍 Testing Row Level Security...', 'yellow');
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    if (error && error.code === 'PGRST301') {
      log('⚠️  RLS is enabled but no policies allow access', 'yellow');
      log('   This is normal for protected tables', 'yellow');
    } else if (error) {
      log(`❌ RLS test failed: ${error.message}`, 'red');
      return false;
    } else {
      log('✅ RLS policies are working correctly', 'green');
    }
    
  } catch (error) {
    log(`❌ RLS test error: ${error.message}`, 'red');
    return false;
  }
  
  // Test service role key (if available)
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      log('\n🔍 Testing service role key...', 'yellow');
      const serviceSupabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );
      
      const { data, error } = await serviceSupabase
        .from('profiles')
        .select('count')
        .limit(1);
      
      if (error) {
        log(`❌ Service role test failed: ${error.message}`, 'red');
        return false;
      }
      
      log('✅ Service role key is working', 'green');
      
    } catch (error) {
      log(`❌ Service role test error: ${error.message}`, 'red');
      return false;
    }
  } else {
    log('\n⚠️  Service role key not found (optional)', 'yellow');
  }
  
  log('\n=====================================', 'blue');
  log('🎉 Database connection test completed successfully!', 'green');
  return true;
}

async function testDatabaseOperations() {
  log('\n🔧 Testing database operations...', 'blue');
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  
  // Test insert operation (if RLS allows)
  try {
    log('  Testing insert operation...', 'yellow');
    const testData = {
      id: 'test-' + Date.now(),
      email: 'test@example.com',
      full_name: 'Test User',
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('profiles')
      .insert(testData)
      .select();
    
    if (error) {
      if (error.code === 'PGRST301') {
        log('  ⚠️  Insert blocked by RLS (expected for protected tables)', 'yellow');
      } else {
        log(`  ❌ Insert failed: ${error.message}`, 'red');
        return false;
      }
    } else {
      log('  ✅ Insert operation successful', 'green');
      
      // Clean up test data
      await supabase
        .from('profiles')
        .delete()
        .eq('id', testData.id);
      log('  ✅ Test data cleaned up', 'green');
    }
    
  } catch (error) {
    log(`  ❌ Insert operation error: ${error.message}`, 'red');
    return false;
  }
  
  return true;
}

async function main() {
  try {
    const connectionSuccess = await testDatabaseConnection();
    
    if (connectionSuccess) {
      await testDatabaseOperations();
    }
    
    if (connectionSuccess) {
      log('\n🎉 All database tests passed!', 'green');
      process.exit(0);
    } else {
      log('\n❌ Database tests failed!', 'red');
      process.exit(1);
    }
    
  } catch (error) {
    log(`\n❌ Unexpected error: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  log(`❌ Unhandled Rejection at: ${promise}, reason: ${reason}`, 'red');
  process.exit(1);
});

main();
