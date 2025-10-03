# Deployment Guide

This guide covers the deployment process for Purely Development projects, including both manual and automated deployment strategies.

## 🚀 Deployment Overview

Our deployment strategy uses:

- **Vercel** - Primary deployment platform
- **Supabase** - Database and backend services
- **GitHub Actions** - Automated CI/CD
- **MCP Servers** - AI-powered deployment automation

## 📋 Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All tests are passing
- [ ] Environment variables are configured
- [ ] Database migrations are ready
- [ ] Build process completes successfully
- [ ] Security review is complete
- [ ] Performance optimization is done

## 🔧 Environment Setup

### 1. Vercel Configuration

#### Install Vercel CLI

```bash
npm i -g vercel
```

#### Login to Vercel

```bash
vercel login
```

#### Link Project

```bash
vercel link
```

### 2. Environment Variables

Set up environment variables in Vercel dashboard:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Vercel Configuration
VERCEL_TOKEN=your_vercel_token
VERCEL_TEAM_ID=your_team_id

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

### 3. Database Setup

#### Run Migrations

```bash
# Local development
npm run db:migrate

# Production (via Supabase dashboard)
# Copy migration SQL and run in Supabase SQL Editor
```

#### Verify Database

```bash
# Test database connection
npm run db:test
```

## 🚀 Deployment Methods

### Method 1: Vercel CLI (Recommended)

#### Deploy to Preview

```bash
# Deploy current branch to preview
vercel

# Deploy specific branch
vercel --target preview
```

#### Deploy to Production

```bash
# Deploy to production
vercel --prod
```

### Method 2: GitHub Integration

#### Automatic Deployment

1. Connect GitHub repository to Vercel
2. Configure build settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

#### Branch-based Deployment

- `main` branch → Production
- `develop` branch → Staging
- Feature branches → Preview

### Method 3: MCP Server (AI-Powered)

#### Using Cursor AI

```typescript
// Ask Cursor to deploy your project
"Deploy this project to Vercel with the following settings:
- Project name: my-awesome-app
- Framework: Next.js
- Environment: production
- Domain: my-awesome-app.vercel.app"
```

#### MCP Server Commands

```bash
# List available projects
curl -X POST https://your-mcp-server.vercel.app/mcp \
  -H "Content-Type: application/json" \
  -d '{"method": "list_projects"}'

# Deploy project
curl -X POST https://your-mcp-server.vercel.app/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "method": "deploy_project",
    "params": {
      "repository": "https://github.com/username/repo",
      "projectName": "my-app",
      "framework": "Next.js"
    }
  }'
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build

  deploy-preview:
    if: github.event_name == 'pull_request'
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          scope: ${{ secrets.VERCEL_ORG_ID }}

  deploy-production:
    if: github.ref == 'refs/heads/main'
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: "--prod"
          scope: ${{ secrets.VERCEL_ORG_ID }}
```

### Required Secrets

Add these secrets to your GitHub repository:

- `VERCEL_TOKEN` - Your Vercel API token
- `VERCEL_ORG_ID` - Your Vercel organization ID
- `VERCEL_PROJECT_ID` - Your Vercel project ID

## 🗄️ Database Deployment

### Supabase Migrations

#### Local Development

```bash
# Create new migration
npx supabase migration new add_user_table

# Apply migrations
npx supabase db push

# Reset database
npx supabase db reset
```

#### Production Deployment

1. Go to Supabase Dashboard
2. Navigate to SQL Editor
3. Copy migration SQL
4. Run migration
5. Verify changes

### Migration Best Practices

```sql
-- ✅ Good: Safe migration with rollback
BEGIN;

-- Add new column with default value
ALTER TABLE users ADD COLUMN phone VARCHAR(20);

-- Create index concurrently
CREATE INDEX CONCURRENTLY idx_users_phone ON users(phone);

-- Update existing records
UPDATE users SET phone = 'N/A' WHERE phone IS NULL;

-- Add constraint after data is updated
ALTER TABLE users ALTER COLUMN phone SET NOT NULL;

COMMIT;

-- Rollback script
-- BEGIN;
-- ALTER TABLE users DROP COLUMN phone;
-- DROP INDEX IF EXISTS idx_users_phone;
-- COMMIT;
```

## 🔍 Monitoring and Debugging

### Vercel Analytics

Enable Vercel Analytics in your project:

```typescript
// app/layout.tsx
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Error Monitoring

#### Vercel Error Tracking

```typescript
// lib/error-tracking.ts
export function trackError(error: Error, context?: Record<string, any>) {
  console.error("Error tracked:", error, context);

  // Send to error tracking service
  if (typeof window !== "undefined") {
    // Client-side error tracking
    fetch("/api/errors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: error.message, context }),
    });
  }
}
```

### Health Checks

Create health check endpoint:

```typescript
// app/api/health/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check database connection
    const dbHealth = await checkDatabaseConnection();

    // Check external services
    const servicesHealth = await checkExternalServices();

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      services: {
        database: dbHealth,
        external: servicesHealth,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
```

## 🔒 Security Considerations

### Environment Variables

- Never commit secrets to version control
- Use Vercel's environment variable management
- Rotate secrets regularly
- Use different secrets for different environments

### HTTPS and Headers

```typescript
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};
```

### Database Security

- Use Row Level Security (RLS) in Supabase
- Implement proper authentication
- Validate all inputs
- Use parameterized queries

## 📊 Performance Optimization

### Build Optimization

```typescript
// next.config.ts
const nextConfig = {
  // Enable compression
  compress: true,

  // Optimize images
  images: {
    domains: ["example.com"],
    formats: ["image/webp", "image/avif"],
  },

  // Bundle analyzer
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
};
```

### Caching Strategy

```typescript
// app/api/data/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const data = await fetchData();

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
```

## 🚨 Rollback Procedures

### Vercel Rollback

```bash
# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback [deployment-url]

# Rollback to specific deployment
vercel rollback [deployment-id]
```

### Database Rollback

1. Identify the problematic migration
2. Create rollback migration
3. Test rollback in staging
4. Apply rollback to production
5. Verify data integrity

## 📈 Post-Deployment

### Verification Checklist

- [ ] Application loads correctly
- [ ] All features work as expected
- [ ] Database connections are working
- [ ] Environment variables are set correctly
- [ ] Performance metrics are acceptable
- [ ] Error monitoring is active
- [ ] Analytics are tracking

### Monitoring

- Check Vercel dashboard for deployment status
- Monitor error logs
- Check performance metrics
- Verify user feedback

## 🆘 Troubleshooting

### Common Issues

#### Build Failures

```bash
# Check build logs
vercel logs [deployment-url]

# Local build test
npm run build
```

#### Environment Variable Issues

```bash
# Check environment variables
vercel env ls

# Pull environment variables
vercel env pull .env.local
```

#### Database Connection Issues

```typescript
// Test database connection
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function testConnection() {
  try {
    const { data, error } = await supabase.from("users").select("count");
    if (error) throw error;
    console.log("Database connection successful");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}
```

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Deployment](https://supabase.com/docs/guides/platform)
- [GitHub Actions](https://docs.github.com/en/actions)

---

**Need help?** Check our [Troubleshooting Guide](./troubleshooting.md) or reach out to the team.
