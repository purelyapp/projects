#!/usr/bin/env node

/**
 * Database Migration Script
 * Runs database migrations from the supabase/migrations directory
 */

const fs = require('fs');
const path = require('path');
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

async function runMigrations() {
  log(`${colors.bold}Database Migration${colors.reset}`, 'blue');
  log('==================', 'blue');
  
  // Check environment variables
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    log('❌ Missing required environment variables', 'red');
    log('   NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required', 'red');
    log('   Note: Use service role key for migrations, not anon key', 'yellow');
    return false;
  }
  
  // Create Supabase client with service role key
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  
  // Find migration files
  const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations');
  
  if (!fs.existsSync(migrationsDir)) {
    log('❌ Migrations directory not found', 'red');
    log(`   Expected: ${migrationsDir}`, 'red');
    return false;
  }
  
  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();
  
  if (migrationFiles.length === 0) {
    log('⚠️  No migration files found', 'yellow');
    log(`   Directory: ${migrationsDir}`, 'yellow');
    return true;
  }
  
  log(`Found ${migrationFiles.length} migration file(s)`, 'green');
  
  // Check if migrations table exists
  try {
    log('\n🔍 Checking migrations table...', 'yellow');
    const { data, error } = await supabase
      .from('supabase_migrations')
      .select('version')
      .limit(1);
    
    if (error && error.code === 'PGRST116') {
      log('  Creating migrations table...', 'yellow');
      const createMigrationsTable = `
        CREATE TABLE IF NOT EXISTS supabase_migrations (
          version VARCHAR(255) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `;
      
      const { error: createError } = await supabase.rpc('exec', {
        sql: createMigrationsTable
      });
      
      if (createError) {
        log(`  ❌ Failed to create migrations table: ${createError.message}`, 'red');
        return false;
      }
      
      log('  ✅ Migrations table created', 'green');
    } else if (error) {
      log(`  ❌ Error checking migrations table: ${error.message}`, 'red');
      return false;
    } else {
      log('  ✅ Migrations table exists', 'green');
    }
    
  } catch (error) {
    log(`  ❌ Error with migrations table: ${error.message}`, 'red');
    return false;
  }
  
  // Get executed migrations
  let executedMigrations = [];
  try {
    const { data, error } = await supabase
      .from('supabase_migrations')
      .select('version');
    
    if (error) {
      log(`  ❌ Failed to get executed migrations: ${error.message}`, 'red');
      return false;
    }
    
    executedMigrations = data.map(row => row.version);
    log(`  Found ${executedMigrations.length} executed migration(s)`, 'green');
    
  } catch (error) {
    log(`  ❌ Error getting executed migrations: ${error.message}`, 'red');
    return false;
  }
  
  // Run pending migrations
  let successCount = 0;
  let errorCount = 0;
  
  for (const migrationFile of migrationFiles) {
    const version = migrationFile.split('_')[0];
    const name = migrationFile.replace('.sql', '');
    
    if (executedMigrations.includes(version)) {
      log(`  ⏭️  Skipping ${migrationFile} (already executed)`, 'yellow');
      continue;
    }
    
    log(`\n🔄 Running migration: ${migrationFile}`, 'blue');
    
    try {
      const migrationPath = path.join(migrationsDir, migrationFile);
      const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
      
      // Execute migration
      const { error: execError } = await supabase.rpc('exec', {
        sql: migrationSQL
      });
      
      if (execError) {
        log(`  ❌ Migration failed: ${execError.message}`, 'red');
        errorCount++;
        continue;
      }
      
      // Record migration as executed
      const { error: recordError } = await supabase
        .from('supabase_migrations')
        .insert({
          version,
          name,
          executed_at: new Date().toISOString()
        });
      
      if (recordError) {
        log(`  ⚠️  Migration executed but failed to record: ${recordError.message}`, 'yellow');
      }
      
      log(`  ✅ Migration completed successfully`, 'green');
      successCount++;
      
    } catch (error) {
      log(`  ❌ Migration error: ${error.message}`, 'red');
      errorCount++;
    }
  }
  
  log('\n=====================================', 'blue');
  log(`Migration Summary:`, 'blue');
  log(`  ✅ Successful: ${successCount}`, 'green');
  log(`  ❌ Failed: ${errorCount}`, errorCount > 0 ? 'red' : 'green');
  
  if (errorCount > 0) {
    log('\n❌ Some migrations failed. Check the errors above.', 'red');
    return false;
  } else {
    log('\n🎉 All migrations completed successfully!', 'green');
    return true;
  }
}

async function main() {
  try {
    const success = await runMigrations();
    process.exit(success ? 0 : 1);
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
