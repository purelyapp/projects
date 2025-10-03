#!/usr/bin/env node

/**
 * Database Seed Script
 * Seeds the database with sample data
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

async function seedDatabase() {
  log(`${colors.bold}Database Seeding${colors.reset}`, 'blue');
  log('================', 'blue');
  
  // Check environment variables
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    log('❌ Missing required environment variables', 'red');
    log('   NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required', 'red');
    return false;
  }
  
  // Create Supabase client with service role key
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  
  // Check if seed file exists
  const seedFile = path.join(process.cwd(), 'supabase', 'seed.sql');
  
  if (!fs.existsSync(seedFile)) {
    log('⚠️  No seed file found', 'yellow');
    log(`   Expected: ${seedFile}`, 'yellow');
    log('   Creating sample seed data...', 'yellow');
    
    // Create sample seed data
    const sampleSeedData = `
-- Sample seed data for Purely Development template

-- Insert sample users
INSERT INTO profiles (id, email, full_name, avatar_url, created_at, updated_at) VALUES
  ('00000000-0000-0000-0000-000000000001', 'john.doe@example.com', 'John Doe', 'https://api.dicebear.com/7.x/avataaars/svg?seed=John', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000002', 'jane.smith@example.com', 'Jane Smith', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000003', 'bob.wilson@example.com', 'Bob Wilson', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert sample data for other tables (if they exist)
-- Add more seed data here as your schema grows
`;
    
    try {
      fs.writeFileSync(seedFile, sampleSeedData);
      log('✅ Sample seed file created', 'green');
    } catch (error) {
      log(`❌ Failed to create seed file: ${error.message}`, 'red');
      return false;
    }
  }
  
  // Read seed file
  let seedSQL;
  try {
    seedSQL = fs.readFileSync(seedFile, 'utf8');
    log('✅ Seed file loaded', 'green');
  } catch (error) {
    log(`❌ Failed to read seed file: ${error.message}`, 'red');
    return false;
  }
  
  // Check if data already exists
  try {
    log('\n🔍 Checking existing data...', 'yellow');
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (error) {
      log(`❌ Failed to check existing data: ${error.message}`, 'red');
      return false;
    }
    
    const existingCount = data[0]?.count || 0;
    if (existingCount > 0) {
      log(`⚠️  Found ${existingCount} existing record(s) in profiles table`, 'yellow');
      log('   Seeding will skip existing records (ON CONFLICT DO NOTHING)', 'yellow');
    } else {
      log('✅ No existing data found, proceeding with seeding', 'green');
    }
    
  } catch (error) {
    log(`❌ Error checking existing data: ${error.message}`, 'red');
    return false;
  }
  
  // Execute seed SQL
  try {
    log('\n🌱 Executing seed data...', 'blue');
    
    // Split SQL into individual statements
    const statements = seedSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    let successCount = 0;
    let skipCount = 0;
    
    for (const statement of statements) {
      if (statement.trim().length === 0) continue;
      
      try {
        const { error } = await supabase.rpc('exec', {
          sql: statement + ';'
        });
        
        if (error) {
          if (error.message.includes('duplicate key') || error.message.includes('conflict')) {
            log(`  ⏭️  Skipped (duplicate): ${statement.substring(0, 50)}...`, 'yellow');
            skipCount++;
          } else {
            log(`  ❌ Failed: ${error.message}`, 'red');
            log(`     Statement: ${statement.substring(0, 100)}...`, 'red');
          }
        } else {
          log(`  ✅ Executed: ${statement.substring(0, 50)}...`, 'green');
          successCount++;
        }
      } catch (error) {
        log(`  ❌ Error executing statement: ${error.message}`, 'red');
      }
    }
    
    log('\n=====================================', 'blue');
    log(`Seeding Summary:`, 'blue');
    log(`  ✅ Successful: ${successCount}`, 'green');
    log(`  ⏭️  Skipped: ${skipCount}`, 'yellow');
    
    // Verify seeded data
    try {
      log('\n🔍 Verifying seeded data...', 'yellow');
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .limit(5);
      
      if (error) {
        log(`❌ Failed to verify data: ${error.message}`, 'red');
        return false;
      }
      
      log(`✅ Found ${data.length} record(s) in profiles table:`, 'green');
      data.forEach(profile => {
        log(`   - ${profile.full_name} (${profile.email})`, 'green');
      });
      
    } catch (error) {
      log(`❌ Error verifying data: ${error.message}`, 'red');
      return false;
    }
    
    log('\n🎉 Database seeding completed successfully!', 'green');
    return true;
    
  } catch (error) {
    log(`❌ Seeding failed: ${error.message}`, 'red');
    return false;
  }
}

async function main() {
  try {
    const success = await seedDatabase();
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
