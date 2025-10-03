# Troubleshooting Guide

This guide helps you diagnose and resolve common issues when working with Purely Development projects.

## 🚨 Quick Diagnosis

### Health Check Commands

```bash
# Check if everything is working
npm run health-check

# Test database connection
npm run db:test

# Verify environment variables
npm run env:check

# Run full test suite
npm run test:all
```

## 🔧 Common Issues and Solutions

### 1. Installation Issues

#### Node.js Version Problems

**Problem**: `npm install` fails with version errors

**Solution**:

```bash
# Check Node.js version
node --version

# Install correct version (18+)
nvm install 18
nvm use 18

# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Permission Errors

**Problem**: `EACCES` or permission denied errors

**Solution**:

```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# Or use nvm to avoid permission issues
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

### 2. Development Server Issues

#### Port Already in Use

**Problem**: `Error: listen EADDRINUSE: address already in use :::3000`

**Solution**:

```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process
kill -9 $(lsof -ti:3000)

# Or use a different port
npm run dev -- --port 3001
```

#### Hot Reload Not Working

**Problem**: Changes don't reflect in browser

**Solution**:

```bash
# Clear Next.js cache
rm -rf .next

# Restart development server
npm run dev

# Check file watching limits (Linux)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

#### TypeScript Errors

**Problem**: TypeScript compilation errors

**Solution**:

```bash
# Check TypeScript version
npx tsc --version

# Clear TypeScript cache
rm -rf tsconfig.tsbuildinfo

# Restart TypeScript server in VS Code
# Cmd+Shift+P -> "TypeScript: Restart TS Server"

# Check for type errors
npx tsc --noEmit
```

### 3. Database Issues

#### Supabase Connection Failed

**Problem**: `Error: Failed to connect to Supabase`

**Solution**:

```typescript
// Check environment variables
console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("Supabase Key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

// Test connection
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function testConnection() {
  try {
    const { data, error } = await supabase.from("users").select("count");
    if (error) throw error;
    console.log("✅ Database connection successful");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
}
```

#### Migration Errors

**Problem**: Database migration fails

**Solution**:

```bash
# Check migration status
npx supabase migration list

# Reset local database
npx supabase db reset

# Run specific migration
npx supabase migration up [migration-name]

# Check Supabase logs
npx supabase logs
```

#### RLS Policy Issues

**Problem**: Row Level Security blocking queries

**Solution**:

```sql
-- Check RLS status
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- Disable RLS temporarily for debugging
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Check policies
SELECT * FROM pg_policies WHERE tablename = 'users';

-- Test query with service role
-- Use service role key instead of anon key
```

### 4. Build Issues

#### Build Fails with Memory Error

**Problem**: `JavaScript heap out of memory`

**Solution**:

```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build

# Or add to package.json
"build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
```

#### TypeScript Build Errors

**Problem**: TypeScript errors during build

**Solution**:

```bash
# Check for type errors
npx tsc --noEmit

# Fix common issues
# 1. Missing type definitions
npm install @types/node @types/react @types/react-dom

# 2. Strict type checking
# Update tsconfig.json to be less strict temporarily
{
  "compilerOptions": {
    "strict": false,
    "noImplicitAny": false
  }
}
```

#### ESLint Errors

**Problem**: ESLint errors preventing build

**Solution**:

```bash
# Fix auto-fixable issues
npm run lint -- --fix

# Check specific file
npx eslint src/components/MyComponent.tsx

# Disable specific rule temporarily
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const data: any = response;
```

### 5. Testing Issues

#### Tests Not Running

**Problem**: `npm test` doesn't work

**Solution**:

```bash
# Check Jest configuration
npx jest --showConfig

# Run tests with verbose output
npm run test -- --verbose

# Run specific test file
npm run test -- --testPathPattern=Button.test.tsx

# Clear Jest cache
npx jest --clearCache
```

#### Test Environment Issues

**Problem**: Tests fail with environment errors

**Solution**:

```javascript
// jest.setup.js
import "@testing-library/jest-dom";

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = "http://localhost:54321";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-key";

// Mock fetch
global.fetch = jest.fn();
```

#### Async Test Issues

**Problem**: Tests fail with async operations

**Solution**:

```typescript
// Wait for async operations
import { waitFor } from "@testing-library/react";

test("handles async data loading", async () => {
  render(<AsyncComponent />);

  await waitFor(() => {
    expect(screen.getByText("Data loaded")).toBeInTheDocument();
  });
});

// Or use findBy queries
test("handles async data loading", async () => {
  render(<AsyncComponent />);

  const dataElement = await screen.findByText("Data loaded");
  expect(dataElement).toBeInTheDocument();
});
```

### 6. Deployment Issues

#### Vercel Deployment Fails

**Problem**: Build fails on Vercel

**Solution**:

```bash
# Check build logs
vercel logs [deployment-url]

# Test build locally
npm run build

# Check environment variables
vercel env ls

# Common fixes:
# 1. Update Node.js version in vercel.json
{
  "functions": {
    "app/api/**/*.ts": {
      "runtime": "nodejs18.x"
    }
  }
}

# 2. Check build command
# Should be: "npm run build"
```

#### Environment Variables Missing

**Problem**: App crashes with undefined environment variables

**Solution**:

```typescript
// Add validation for required env vars
const requiredEnvVars = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
};

for (const [key, value] of Object.entries(requiredEnvVars)) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}
```

#### Database Connection in Production

**Problem**: Database queries fail in production

**Solution**:

```typescript
// Check production database URL
console.log("Database URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);

// Use different connection for production
const supabaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_SUPABASE_URL
    : "http://localhost:54321";

// Check network connectivity
fetch(supabaseUrl + "/rest/v1/", {
  headers: {
    apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
}).then((response) => {
  console.log("Database reachable:", response.ok);
});
```

### 7. Performance Issues

#### Slow Page Loads

**Problem**: Pages load slowly

**Solution**:

```typescript
// 1. Enable compression
// next.config.ts
const nextConfig = {
  compress: true,
};

// 2. Optimize images
import Image from "next/image";

<Image
  src="/image.jpg"
  alt="Description"
  width={500}
  height={300}
  priority // For above-the-fold images
/>;

// 3. Use dynamic imports
const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
  loading: () => <p>Loading...</p>,
});

// 4. Implement caching
export async function GET() {
  const data = await fetchData();

  return Response.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
```

#### Memory Leaks

**Problem**: Memory usage increases over time

**Solution**:

```typescript
// 1. Clean up event listeners
useEffect(() => {
  const handleResize = () => {
    // Handle resize
  };

  window.addEventListener("resize", handleResize);

  return () => {
    window.removeEventListener("resize", handleResize);
  };
}, []);

// 2. Clear intervals/timeouts
useEffect(() => {
  const interval = setInterval(() => {
    // Do something
  }, 1000);

  return () => clearInterval(interval);
}, []);

// 3. Avoid memory leaks in async operations
useEffect(() => {
  let isMounted = true;

  async function fetchData() {
    const data = await api.getData();
    if (isMounted) {
      setData(data);
    }
  }

  fetchData();

  return () => {
    isMounted = false;
  };
}, []);
```

## 🔍 Debugging Tools

### Browser DevTools

```typescript
// Add debugging helpers
if (process.env.NODE_ENV === "development") {
  window.debug = {
    supabase: supabase,
    env: process.env,
    clearStorage: () => {
      localStorage.clear();
      sessionStorage.clear();
    },
  };
}
```

### Network Debugging

```typescript
// Log all API calls
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  console.log("API Call:", args[0]);
  const response = await originalFetch(...args);
  console.log("API Response:", response.status, response.statusText);
  return response;
};
```

### Database Debugging

```typescript
// Enable Supabase debug mode
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      debug: process.env.NODE_ENV === "development",
    },
  }
);
```

## 📊 Monitoring and Logging

### Error Tracking

```typescript
// lib/error-tracking.ts
export function trackError(error: Error, context?: Record<string, any>) {
  console.error("Error:", error, context);

  // Send to error tracking service
  if (typeof window !== "undefined") {
    fetch("/api/errors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: error.message,
        stack: error.stack,
        context,
        timestamp: new Date().toISOString(),
        url: window.location.href,
      }),
    });
  }
}
```

### Performance Monitoring

```typescript
// lib/performance.ts
export function trackPerformance(name: string, startTime: number) {
  const endTime = performance.now();
  const duration = endTime - startTime;

  console.log(`Performance: ${name} took ${duration}ms`);

  // Send to analytics
  if (typeof window !== "undefined") {
    fetch("/api/performance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, duration }),
    });
  }
}
```

## 🆘 Getting Help

### Before Asking for Help

1. **Check this guide** - Your issue might be covered here
2. **Search existing issues** - Look for similar problems
3. **Check logs** - Look for error messages
4. **Reproduce the issue** - Can you reproduce it consistently?
5. **Gather information** - Error messages, steps to reproduce, environment details

### When Asking for Help

Include:

- **Error message** - Copy the exact error
- **Steps to reproduce** - What did you do to cause this?
- **Environment** - OS, Node.js version, browser
- **Code** - Relevant code snippets
- **Logs** - Console output, build logs

### Emergency Contacts

- **Critical issues**: Contact team lead immediately
- **General questions**: Use team channels
- **Documentation issues**: Create GitHub issue

## 📚 Additional Resources

- [Next.js Troubleshooting](https://nextjs.org/docs/messages)
- [TypeScript Error Reference](https://www.typescriptlang.org/docs/error-messages)
- [Supabase Troubleshooting](https://supabase.com/docs/guides/platform/troubleshooting)
- [Vercel Debugging](https://vercel.com/docs/concepts/projects/debugging)

---

**Still stuck?** Don't hesitate to ask for help. We're here to support you!
