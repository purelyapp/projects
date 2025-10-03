# Purely Development App Template

This is a Next.js application built with the Purely Development template. It provides a standardized starting point for all new development projects with pre-configured tools and best practices.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Run database migrations
npm run db:migrate

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data

## 📁 Project Structure

```
template/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   └── page.tsx           # Home page
├── components/            # Reusable React components
│   ├── LoadingSpinner.tsx
│   └── SupabaseExample.tsx
├── lib/                   # Utility functions
│   ├── supabase.ts       # Supabase client
│   └── utils.ts          # General utilities
├── __tests__/            # Test files
├── supabase/             # Database migrations and seeds
└── public/               # Static assets
```

## 🔧 Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Supabase** - Backend-as-a-Service
- **Jest** - Testing framework
- **Testing Library** - React component testing
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 📚 Documentation

- [Getting Started Guide](../docs/getting-started.md)
- [Team Onboarding](../docs/team-onboarding.md)
- [Development Guidelines](../docs/development-guidelines.md)
- [Deployment Guide](../docs/deployment.md)
- [Troubleshooting](../docs/troubleshooting.md)

## 🤝 Contributing

1. Follow the [Development Guidelines](../docs/development-guidelines.md)
2. Write tests for new features
3. Ensure all tests pass
4. Create a pull request

## 📄 License

MIT License - see [LICENSE](../LICENSE) file for details.

---

**Purely Development** - Building better software, together.
