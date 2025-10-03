# Supabase MCP Server Configuration

## Environment Variables

Create a `.env` file in the supabase-mcp-server directory with:

```bash
SUPABASE_URL=https://grqlsdaapzqrsbaepiuj.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdycWxzZGFhcHpxcnNiYWVwaXVqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTUxMTkyOCwiZXhwIjoyMDc1MDg3OTI4fQ.cqfovRYCsblKweIXZqrc9hol0qHIBs5fqEpJnXIHMXU
```

## Usage

1. Build the server: `npm run build`
2. Start the server: `npm start`
3. Or run in development: `npm run dev`

## Available Tools

- `execute_sql`: Execute SQL queries on Supabase database
- `list_tables`: List all tables in the database  
- `describe_table`: Get detailed information about a specific table
