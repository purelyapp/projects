# Purely Development Template

A comprehensive development template that provides a standardized starting point for all new development projects. This template ensures consistency across your team's codebase while following best practices for modern web development.

## 🚀 What's Included

### Core Technologies

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Supabase** - Backend-as-a-Service with PostgreSQL
- **Vercel** - Deployment platform

### Development Tools

- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting
- **Jest** - Testing framework
- **Testing Library** - React component testing

### MCP Servers

- **Supabase MCP Server** - Database operations
- **Vercel MCP Server** - Deployment automation

## 📁 Project Structure

```
purely-development-template/
├── template/                 # Main application template
│   ├── app/                 # Next.js App Router
│   ├── components/          # Reusable React components
│   ├── lib/                 # Utility functions and configurations
│   ├── __tests__/           # Test files
│   ├── supabase/            # Database migrations and seeds
│   └── public/              # Static assets
├── supabase-mcp-server/     # Supabase MCP server
├── vercel-mcp-server/       # Vercel MCP server
└── docs/                    # Documentation and training materials
```

## 🛠️ Quick Start

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd purely-development-template
npm install
```

### 2. Environment Setup

```bash
cd template
cp .env.example .env.local
# Configure your environment variables
```

### 3. Database Setup

```bash
# Run Supabase migrations
npm run db:migrate
```

### 4. Start Development

```bash
npm run dev
```

## 🎯 Team Guidelines

### Code Standards

- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Use functional components with hooks for React
- Implement proper error handling
- Add comprehensive JSDoc comments
- Write unit tests for all functions
- Use meaningful variable and function names

### File Structure

- Place components in `/components`
- Place utilities in `/lib`
- Place API routes in `/app/api`
- Place types in `/types`
- Place tests in `/__tests__`

### Git Workflow

- Create feature branches from main
- Use conventional commit messages
- Create pull requests for all changes
- Ensure all tests pass before merging

### AI Agent Guidelines

- Always test code before committing
- Follow the established patterns
- Add proper error handling
- Include comprehensive comments
- Update documentation when needed

## 🔧 Available Scripts

### Main Project

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run test` - Run tests
- `npm run lint` - Run linter

### Template Specific

- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data

## 📚 Documentation

- [Getting Started Guide](./docs/getting-started.md)
- [Team Onboarding](./docs/team-onboarding.md)
- [Development Guidelines](./docs/development-guidelines.md)
- [Deployment Guide](./docs/deployment.md)
- [Troubleshooting](./docs/troubleshooting.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

For questions or support, please:

1. Check the [documentation](./docs/)
2. Search existing issues
3. Create a new issue if needed

---

**Purely Development** - Building better software, together.
