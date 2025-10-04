// Test script to verify Supabase connection
const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔍 Testing Supabase Connection...')
console.log('URL:', supabaseUrl ? '✅ Set' : '❌ Missing')
console.log('Key:', supabaseKey ? '✅ Set' : '❌ Missing')

if (supabaseUrl && supabaseKey) {
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  // Test connection by getting the current user
  supabase.auth.getUser()
    .then(({ data, error }) => {
      if (error) {
        console.log('❌ Connection failed:', error.message)
      } else {
        console.log('✅ Supabase connection successful!')
        console.log('User:', data.user ? 'Authenticated' : 'Anonymous')
      }
    })
    .catch(err => {
      console.log('❌ Connection error:', err.message)
    })
} else {
  console.log('❌ Missing required environment variables')
}
