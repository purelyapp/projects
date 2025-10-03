-- Seed data for development
-- This file is for local testing only

-- Note: This assumes you have test users created in Supabase Auth
-- You can create test users manually in the Supabase dashboard

-- Example: Insert test profiles (uncomment when you have test user IDs)
/*
INSERT INTO public.profiles (id, email, full_name) VALUES
  ('uuid-of-test-user-1', 'test1@example.com', 'Test User 1'),
  ('uuid-of-test-user-2', 'test2@example.com', 'Test User 2');
*/

-- Additional seed data examples (uncomment as needed):

-- Sample profiles with different data
/*
INSERT INTO public.profiles (id, email, full_name, avatar_url) VALUES
  ('00000000-0000-0000-0000-000000000001', 'admin@example.com', 'Admin User', 'https://example.com/avatar1.jpg'),
  ('00000000-0000-0000-0000-000000000002', 'user@example.com', 'Regular User', 'https://example.com/avatar2.jpg'),
  ('00000000-0000-0000-0000-000000000003', 'developer@example.com', 'Developer User', null);
*/

-- Sample data for testing different scenarios
/*
INSERT INTO public.profiles (id, email, full_name, avatar_url, created_at, updated_at) VALUES
  ('11111111-1111-1111-1111-111111111111', 'john.doe@example.com', 'John Doe', 'https://example.com/john.jpg', NOW() - INTERVAL '7 days', NOW() - INTERVAL '1 day'),
  ('22222222-2222-2222-2222-222222222222', 'jane.smith@example.com', 'Jane Smith', 'https://example.com/jane.jpg', NOW() - INTERVAL '3 days', NOW()),
  ('33333333-3333-3333-3333-333333333333', 'bob.wilson@example.com', 'Bob Wilson', null, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 hour');
*/

-- Instructions for using this seed file:
-- 1. First, create test users in your Supabase Auth dashboard
-- 2. Copy the user IDs from the Auth dashboard
-- 3. Replace the placeholder UUIDs above with real user IDs
-- 4. Uncomment the INSERT statements you want to use
-- 5. Run this file in the Supabase SQL Editor

-- To get user IDs from Supabase Auth:
-- 1. Go to Authentication > Users in your Supabase dashboard
-- 2. Click on a user to see their details
-- 3. Copy the User UID (this is the ID you need)
-- 4. Use that ID in the INSERT statements above
