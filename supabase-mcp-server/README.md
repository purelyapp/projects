# Supabase MCP Server

A Model Context Protocol (MCP) server for Supabase operations.

## Setup Complete ✅

The MCP server has been successfully created and configured with your Supabase credentials.

## Files Created

- `src/index.ts` - Main MCP server implementation
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `.env` - Environment variables (with your Supabase credentials)
- `dist/` - Compiled JavaScript output

## Available Tools

The MCP server provides these tools:

1. **execute_sql** - Execute SQL queries on Supabase database
2. **list_tables** - List all tables in the database
3. **describe_table** - Get detailed information about a specific table

## Usage

### Build and Run
```bash
npm run build
npm start
```

### Development
```bash
npm run dev
```

## Important Note

**The MCP server cannot execute DDL statements (CREATE TABLE, etc.) directly.** 

For Step 18 (running the migration), you need to:

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Run the migration SQL manually

## Migration SQL

Here's the complete migration SQL to run in your Supabase dashboard:

```sql
-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create function to handle updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Next Steps

1. Run the migration SQL in your Supabase dashboard
2. Verify the "profiles" table is created
3. Check that RLS policies are in place
4. Continue with Step 19 of your setup
