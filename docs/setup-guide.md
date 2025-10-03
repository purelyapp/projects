# Purely Development Setup Guide

This guide will help you set up the Purely Development template for your team and create new projects.

## 🎯 Overview

Purely Development is a comprehensive template that provides:

- Standardized project structure
- Pre-configured development tools
- Automated CI/CD pipelines
- Team collaboration guidelines
- AI agent integration

## 🚀 Quick Setup

### 1. Clone the Template

```bash
git clone <your-repo-url>
cd purely-development-template
```

### 2. Install Dependencies

```bash
npm run setup
```

This will:

- Install root dependencies
- Install template dependencies
- Run health checks

### 3. Verify Installation

```bash
npm run health-check
```

## 🛠️ Creating New Projects

### Method 1: Using the Script (Recommended)

```bash
# Create a new project
npm run create-project my-awesome-app "A new web application"

# This will:
# - Create a new directory with your project name
# - Copy all template files
# - Update package.json files
# - Install dependencies
# - Initialize Git repository
# - Create initial commit
```

### Method 2: Manual Copy

```bash
# Copy the template directory
cp -r template ../my-new-project

# Update package.json files
# Install dependencies
# Initialize Git
```

## 🔧 Configuration

### Environment Variables

Each new project needs these environment variables:

```env
# Required
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional
VERCEL_TOKEN=your_vercel_token
VERCEL_TEAM_ID=your_team_id
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

### Database Setup

1. Create a new Supabase project
2. Run migrations:
   ```bash
   npm run db:migrate
   ```
3. Seed with sample data:
   ```bash
   npm run db:seed
   ```

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## 📚 Team Onboarding

### For New Team Members

1. **Read the documentation**:

   - [Getting Started Guide](./getting-started.md)
   - [Team Onboarding Guide](./team-onboarding.md)
   - [Development Guidelines](./development-guidelines.md)

2. **Set up your environment**:

   - Install Node.js 18+
   - Install VS Code with recommended extensions
   - Install Cursor for AI assistance
   - Configure Git

3. **Clone and test the template**:

   ```bash
   git clone <repo-url>
   cd purely-development-template
   npm run setup
   npm run health-check
   ```

4. **Create a test project**:
   ```bash
   npm run create-project test-project "My test project"
   cd ../test-project
   npm run dev
   ```

### For Team Leads

1. **Set up team repositories**:

   - Create GitHub organization
   - Set up team permissions
   - Configure branch protection rules

2. **Configure CI/CD**:

   - Set up GitHub Actions secrets
   - Configure Vercel integration
   - Set up monitoring and alerts

3. **Create team guidelines**:
   - Customize development guidelines
   - Set up code review processes
   - Configure notification channels

## 🤖 AI Agent Integration

### Cursor Configuration

The template includes Cursor rules for AI assistance:

```json
{
  "rules": [
    "Use TypeScript for all new code",
    "Follow ESLint and Prettier configurations",
    "Write comprehensive tests",
    "Add proper error handling",
    "Update documentation when needed"
  ]
}
```

### MCP Servers

The template includes MCP servers for:

- **Supabase**: Database operations
- **Vercel**: Deployment automation

## 📊 Monitoring and Analytics

### Health Checks

Run health checks to verify system status:

```bash
# Full health check
npm run health-check

# Check environment variables
npm run env:check

# Test database connection
npm run db:test
```

### CI/CD Pipeline

The template includes automated:

- Linting and type checking
- Testing with coverage
- Security audits
- Build verification
- Deployment to preview/production
- Database migrations

## 🔒 Security

### Best Practices

1. **Never commit secrets**:

   - Use environment variables
   - Use Vercel's secret management
   - Rotate keys regularly

2. **Enable security features**:

   - Row Level Security in Supabase
   - HTTPS everywhere
   - Security headers

3. **Regular audits**:
   - Dependency updates
   - Security scans
   - Code reviews

## 📈 Performance

### Optimization

1. **Build optimization**:

   - Code splitting
   - Image optimization
   - Bundle analysis

2. **Runtime optimization**:
   - Caching strategies
   - Lazy loading
   - Performance monitoring

## 🆘 Troubleshooting

### Common Issues

1. **Environment variables not working**:

   ```bash
   npm run env:check
   ```

2. **Database connection issues**:

   ```bash
   npm run db:test
   ```

3. **Build failures**:

   ```bash
   npm run build
   npm run type-check
   ```

4. **Test failures**:
   ```bash
   npm run test
   npm run test:coverage
   ```

### Getting Help

1. Check the [Troubleshooting Guide](./troubleshooting.md)
2. Search existing issues
3. Ask in team channels
4. Create a new issue

## 📋 Maintenance

### Regular Tasks

1. **Update dependencies**:

   ```bash
   npm update
   npm audit fix
   ```

2. **Update documentation**:

   - Keep guides current
   - Update examples
   - Review team guidelines

3. **Monitor performance**:
   - Check build times
   - Monitor test coverage
   - Review error logs

## 🎉 Success Metrics

Track these metrics to ensure success:

- **Code Quality**: ESLint errors, test coverage
- **Performance**: Build times, page load speeds
- **Security**: Vulnerability scans, audit results
- **Team Productivity**: PR review times, deployment frequency
- **Reliability**: Uptime, error rates

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Testing Library Documentation](https://testing-library.com/docs)

---

**Need help?** Check our [complete documentation](./) or reach out to the team.
