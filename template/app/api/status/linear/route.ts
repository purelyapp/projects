import { NextResponse } from 'next/server';

interface LinearTeam {
  id: string;
  name: string;
  key: string;
}

export async function GET() {
  try {
    const apiKey = process.env.LINEAR_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Linear API key not configured' },
        { status: 500 }
      );
    }

    const response = await fetch('https://api.linear.app/graphql', {
      method: 'POST',
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query {
            viewer {
              id
              name
              email
            }
            teams {
              nodes {
                id
                name
                key
              }
            }
          }
        `,
      }),
    });

    if (!response.ok) {
      throw new Error(`Linear API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      throw new Error(`Linear GraphQL error: ${data.errors[0].message}`);
    }

    return NextResponse.json({
      status: 'connected',
      user: {
        id: data.data.viewer.id,
        name: data.data.viewer.name,
        email: data.data.viewer.email,
      },
      teams: data.data.teams.nodes.map((team: LinearTeam) => ({
        id: team.id,
        name: team.name,
        key: team.key,
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 'error' 
      },
      { status: 500 }
    );
  }
}
