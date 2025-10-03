import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.NOTION_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Notion API key not configured' },
        { status: 500 }
      );
    }

    const response = await fetch('https://api.notion.com/v1/users/me', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Notion API error: ${response.status} ${response.statusText}`);
    }

    const user = await response.json();
    
    return NextResponse.json({
      status: 'connected',
      user: {
        id: user.id,
        name: user.name,
        email: user.person?.email,
        avatar_url: user.avatar_url,
      },
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
