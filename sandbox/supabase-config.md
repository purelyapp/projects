# Supabase Configuration Setup

## Environment Variables Required

Create a `.env.local` file in the root of your project with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://grqlsdaapzqrsbaepiuj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdycWxzZGFhcHpxcnNiYWVwaXVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1MTE5MjgsImV4cCI6MjA3NTA4NzkyOH0.afkCU7xj9RkJcWSsS7X6XRXGScqsQrjNDTGTaWn6qnk
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdycWxzZGFhcHpxcnNiYWVwaXVqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTUxMTkyOCwiZXhwIjoyMDc1MDg3OTI4fQ.cqfovRYCsblKweIXZqrc9hol0qHIBs5fqEpJnXIHMXU

# Database Connection String
DATABASE_URL=postgresql://postgres:adx1kgx5DRQ2tfk*nqu@db.grqlsdaapzqrsbaepiuj.supabase.co:5432/postgres
```

## How to Set Up

1. Create a `.env.local` file in your project root
2. Copy the above environment variables into the file
3. Save the file

## Verification

All 4 Supabase credentials are now configured:
- ✅ NEXT_PUBLIC_SUPABASE_URL
- ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY  
- ✅ SUPABASE_SERVICE_ROLE_KEY
- ✅ DATABASE_URL

## Next Steps

You can now use these credentials in your Next.js application to connect to Supabase.
