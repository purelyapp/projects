# Development Guidelines

This document outlines the coding standards, best practices, and guidelines that all team members should follow when working on Purely Development projects.

## 🎯 Core Principles

### 1. Consistency

- All code should follow the same patterns and conventions
- Use the provided templates and configurations
- Maintain consistent naming conventions

### 2. Quality

- Write clean, readable, and maintainable code
- Include comprehensive error handling
- Write tests for all functionality
- Document complex logic

### 3. Performance

- Optimize for speed and efficiency
- Use proper caching strategies
- Minimize bundle size
- Implement lazy loading where appropriate

### 4. Security

- Never commit secrets or API keys
- Validate all inputs
- Implement proper authentication
- Follow security best practices

## 📝 Code Standards

### TypeScript Guidelines

#### Type Definitions

```typescript
// ✅ Good: Clear interface definitions
interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user" | "guest";
  createdAt: Date;
  updatedAt: Date;
}

// ✅ Good: Generic types for reusability
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// ❌ Bad: Using any type
function processData(data: any): any {
  return data;
}
```

#### Function Definitions

```typescript
// ✅ Good: Clear function signature with JSDoc
/**
 * Fetches a user by ID from the API
 * @param id - The user ID
 * @returns Promise resolving to user data or null if not found
 */
async function fetchUser(id: string): Promise<User | null> {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

// ❌ Bad: No error handling, unclear return type
function fetchUser(id: string) {
  return fetch(`/api/users/${id}`);
}
```

### React Component Guidelines

#### Component Structure

```typescript
// ✅ Good: Well-structured component
import React, { useState, useEffect } from "react";
import { User } from "@/types/user";
import { fetchUser } from "@/lib/api";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface UserProfileProps {
  userId: string;
  onUserUpdate?: (user: User) => void;
}

export function UserProfile({ userId, onUserUpdate }: UserProfileProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        setError(null);
        const userData = await fetchUser(userId);
        setUser(userData);
        onUserUpdate?.(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load user");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [userId, onUserUpdate]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error">Error: {error}</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="user-profile">
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

#### Hooks Guidelines

```typescript
// ✅ Good: Custom hook with proper typing
import { useState, useEffect } from "react";
import { User } from "@/types/user";
import { fetchUser } from "@/lib/api";

interface UseUserResult {
  user: User | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useUser(userId: string): UseUserResult {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await fetchUser(userId);
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [userId]);

  return { user, loading, error, refetch };
}
```

### File Organization

#### Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── (auth)/            # Route groups
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── ui/               # Basic UI components
│   ├── forms/            # Form components
│   └── layout/           # Layout components
├── lib/                  # Utility functions
│   ├── api.ts           # API client
│   ├── auth.ts          # Authentication
│   ├── db.ts            # Database utilities
│   └── utils.ts         # General utilities
├── types/               # TypeScript type definitions
│   ├── user.ts
│   ├── api.ts
│   └── index.ts
└── __tests__/           # Test files
    ├── components/
    ├── lib/
    └── utils/
```

#### Naming Conventions

- **Files**: `kebab-case` (e.g., `user-profile.tsx`)
- **Components**: `PascalCase` (e.g., `UserProfile`)
- **Functions**: `camelCase` (e.g., `fetchUser`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `API_BASE_URL`)
- **Types/Interfaces**: `PascalCase` (e.g., `User`, `ApiResponse`)

### Error Handling

#### API Error Handling

```typescript
// ✅ Good: Comprehensive error handling
class ApiError extends Error {
  constructor(message: string, public status: number, public code?: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function apiRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || "Request failed",
        response.status,
        errorData.code
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError("Network error", 0, "NETWORK_ERROR");
  }
}
```

#### Component Error Boundaries

```typescript
// ✅ Good: Error boundary component
import React, { Component, ReactNode } from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="error-boundary">
            <h2>Something went wrong</h2>
            <p>Please refresh the page and try again.</p>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
```

### Testing Guidelines

#### Unit Tests

```typescript
// ✅ Good: Comprehensive unit test
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { UserProfile } from "./UserProfile";
import { fetchUser } from "@/lib/api";

// Mock the API function
jest.mock("@/lib/api");
const mockFetchUser = fetchUser as jest.MockedFunction<typeof fetchUser>;

describe("UserProfile", () => {
  const mockUser = {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "user" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders user information when loaded", async () => {
    mockFetchUser.mockResolvedValue(mockUser);

    render(<UserProfile userId="1" />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("john@example.com")).toBeInTheDocument();
    });
  });

  it("handles loading error", async () => {
    mockFetchUser.mockRejectedValue(new Error("Failed to fetch"));

    render(<UserProfile userId="1" />);

    await waitFor(() => {
      expect(screen.getByText("Error: Failed to fetch")).toBeInTheDocument();
    });
  });

  it("calls onUserUpdate when user is loaded", async () => {
    const onUserUpdate = jest.fn();
    mockFetchUser.mockResolvedValue(mockUser);

    render(<UserProfile userId="1" onUserUpdate={onUserUpdate} />);

    await waitFor(() => {
      expect(onUserUpdate).toHaveBeenCalledWith(mockUser);
    });
  });
});
```

#### Integration Tests

```typescript
// ✅ Good: API integration test
import { apiRequest } from "@/lib/api";

describe("API Client", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("handles successful API request", async () => {
    const mockData = { id: "1", name: "Test" };
    fetchMock.mockResponseOnce(JSON.stringify(mockData));

    const result = await apiRequest("/api/test");

    expect(result).toEqual(mockData);
    expect(fetchMock).toHaveBeenCalledWith("/api/test", {
      headers: { "Content-Type": "application/json" },
    });
  });

  it("handles API error response", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ message: "Not found" }), {
      status: 404,
    });

    await expect(apiRequest("/api/test")).rejects.toThrow("Not found");
  });
});
```

## 🔧 Performance Guidelines

### Code Splitting

```typescript
// ✅ Good: Lazy loading components
import { lazy, Suspense } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const HeavyComponent = lazy(() => import("./HeavyComponent"));

export function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### Memoization

```typescript
// ✅ Good: Memoizing expensive calculations
import { useMemo } from "react";

export function ExpensiveComponent({ items }: { items: Item[] }) {
  const processedItems = useMemo(() => {
    return items
      .filter((item) => item.active)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((item) => ({ ...item, processed: true }));
  }, [items]);

  return (
    <div>
      {processedItems.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

## 🔒 Security Guidelines

### Input Validation

```typescript
// ✅ Good: Input validation
import { z } from "zod";

const userSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  age: z.number().min(0).max(120),
});

export function validateUser(input: unknown) {
  try {
    return userSchema.parse(input);
  } catch (error) {
    throw new Error("Invalid user data");
  }
}
```

### Environment Variables

```typescript
// ✅ Good: Environment variable validation
const requiredEnvVars = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
} as const;

// Validate all required environment variables
for (const [key, value] of Object.entries(requiredEnvVars)) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = requiredEnvVars;
```

## 📚 Documentation Guidelines

### JSDoc Comments

````typescript
/**
 * Calculates the distance between two points using the Haversine formula
 * @param lat1 - Latitude of the first point
 * @param lon1 - Longitude of the first point
 * @param lat2 - Latitude of the second point
 * @param lon2 - Longitude of the second point
 * @returns Distance in kilometers
 * @example
 * ```typescript
 * const distance = calculateDistance(40.7128, -74.0060, 34.0522, -118.2437);
 * console.log(distance); // 3944.0 (km)
 * ```
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  // Implementation...
}
````

### README Files

Each major component or module should have a README.md file explaining:

- Purpose and functionality
- Usage examples
- API reference
- Dependencies
- Configuration options

## 🚀 Deployment Guidelines

### Environment Configuration

- Use environment variables for all configuration
- Never commit secrets to version control
- Use different configurations for different environments
- Validate environment variables at startup

### Build Optimization

- Enable production optimizations
- Minimize bundle size
- Use proper caching strategies
- Implement proper error handling

## 📋 Code Review Checklist

Before submitting code for review, ensure:

- [ ] Code follows TypeScript best practices
- [ ] All functions have proper error handling
- [ ] Tests are comprehensive and passing
- [ ] Performance considerations are addressed
- [ ] Security best practices are followed
- [ ] Documentation is updated
- [ ] No console.log statements in production code
- [ ] Code is properly formatted with Prettier
- [ ] ESLint warnings are resolved

## 🎯 Conclusion

Following these guidelines ensures that our codebase remains:

- **Consistent** - Easy to understand and maintain
- **Reliable** - Well-tested and error-free
- **Performant** - Optimized for speed and efficiency
- **Secure** - Protected against common vulnerabilities
- **Scalable** - Ready for future growth

Remember: These guidelines are living documents. They should evolve as we learn and improve our processes.

---

**Questions?** Reach out to the team or check our [complete documentation](./).
