import { NextRequest, NextResponse } from 'next/server';
import { createNotionPage } from '@/lib/notion';

interface ProjectFormData {
  projectName: string;
  description: string;
  objectives: string;
  requirements: string;
  timeline: string;
  budget: string;
  team: string;
  deliverables: string;
  risks: string;
  successCriteria: string;
}

/**
 * Generates a markdown file content from project data
 * @param data - Project form data
 * @returns Markdown content as string
 */
function generateMarkdownContent(data: ProjectFormData): string {
  const timestamp = new Date().toISOString().split('T')[0];
  
  return `# ${data.projectName}

**Created:** ${timestamp}

## Project Description

${data.description}

## Objectives

${data.objectives || 'No objectives specified'}

## Requirements

${data.requirements || 'No requirements specified'}

## Timeline

${data.timeline || 'No timeline specified'}

## Budget

${data.budget || 'No budget specified'}

## Team Members

${data.team || 'No team members specified'}

## Deliverables

${data.deliverables || 'No deliverables specified'}

## Potential Risks

${data.risks || 'No risks identified'}

## Success Criteria

${data.successCriteria || 'No success criteria specified'}

---

*This project was created using the Project Manager tool on ${new Date().toLocaleDateString()}.*
`;
}

/**
 * Creates a Notion page with the project data
 * @param data - Project form data
 * @returns Promise<boolean> - Success status
 */
async function createNotionPageWrapper(data: ProjectFormData): Promise<boolean> {
  try {
    console.log('Creating Notion page for project:', data.projectName);
    
    // Use the Notion integration utility
    const notionPage = await createNotionPage(data);
    
    if (notionPage) {
      console.log('Notion page created successfully:', notionPage.url);
      return true;
    } else {
      console.warn('Failed to create Notion page');
      return false;
    }
  } catch (error) {
    console.error('Error creating Notion page:', error);
    return false;
  }
}

/**
 * Generates a safe filename from project name
 * @param projectName - The project name
 * @returns Safe filename string
 */
function generateSafeFilename(projectName: string): string {
  // Remove special characters and replace spaces with underscores
  const safeName = projectName
    .replace(/[^a-zA-Z0-9\s-_]/g, '')
    .replace(/\s+/g, '_')
    .toLowerCase();
  
  const timestamp = new Date().toISOString().split('T')[0];
  return `${safeName}_${timestamp}.md`;
}

export async function POST(request: NextRequest) {
  try {
    const data: ProjectFormData = await request.json();
    
    // Validate required fields
    if (!data.projectName || !data.description) {
      return NextResponse.json(
        { success: false, error: 'Project name and description are required' },
        { status: 400 }
      );
    }

    // Generate markdown content
    const markdownContent = generateMarkdownContent(data);
    
    // Create Notion page
    const notionSuccess = await createNotionPageWrapper(data);
    
    // Generate filename
    const filename = generateSafeFilename(data.projectName);
    
    // Create response with file download
    const response = new NextResponse(markdownContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache',
      },
    });

    // Add custom headers to indicate success
    response.headers.set('X-Notion-Success', notionSuccess.toString());
    response.headers.set('X-Filename', filename);
    
    return response;
    
  } catch (error) {
    console.error('Error processing project creation:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}