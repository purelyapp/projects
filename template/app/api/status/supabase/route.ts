import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Supabase configuration not found' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Check if this is a mock configuration
    const isMock = supabaseUrl.includes('mock-sandbox');
    
    if (isMock) {
      // Return mock response for testing
      const projectInfo = {
        url: supabaseUrl,
        projectId: 'mock-sandbox',
        isMock: true,
      };

      return NextResponse.json({
        status: 'connected',
        project: projectInfo,
        message: 'Mock Supabase configuration - ready for development',
      });
    }
    
    // Test connection with a simple query for real Supabase
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    if (error) {
      throw new Error(`Supabase query error: ${error.message}`);
    }

    // Get project info
    const projectInfo = {
      url: supabaseUrl,
      projectId: supabaseUrl.split('//')[1].split('.')[0],
    };

    return NextResponse.json({
      status: 'connected',
      project: projectInfo,
      queryResult: data,
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
