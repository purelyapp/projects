# Step 18: Run Migration in Supabase Dashboard

Since MCP tools aren't available, here's the easiest way to run the migration:

## 🚀 Quick Method: Copy & Paste in Supabase Dashboard

### 1. Go to your Supabase Dashboard
- Open [supabase.com](https://supabase.com)
- Navigate to your **sandbox** project
- Click **SQL Editor** in the left sidebar

### 2. Create New Query
- Click **"New query"** button
- Copy the entire SQL below and paste it

### 3. Execute the Migration
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

### 4. Run the Query
- Click **"Run"** or press **Cmd/Ctrl + Enter**
- You should see: **"Success. No rows returned"**

### 5. Verify the Table
- Click **"Table Editor"** in the left sidebar
- You should see **"profiles"** in the tables list
- Click on **"profiles"** to see the table structure

## ✅ Expected Result
- ✅ Migration runs successfully
- ✅ `profiles` table is created
- ✅ RLS policies are enabled
- ✅ Triggers are set up for user signup

**Please run this migration and let me know when it's complete!**
