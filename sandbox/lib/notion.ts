/**
 * Notion API Integration
 * Handles creating pages and content in Notion
 */

interface NotionPageData {
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

interface NotionPage {
  id: string;
  url: string;
  title: string;
}

/**
 * Creates a new page in Notion with project data
 * @param data - Project data to create in Notion
 * @param parentPageId - The parent page ID where the new page should be created
 * @returns Promise<NotionPage | null> - Created page or null if failed
 */
export async function createNotionPage(
  data: NotionPageData,
  parentPageId: string = '282c761a423e80debc1de9c87c63ecc4'
): Promise<NotionPage | null> {
  try {
    const notionApiKey = process.env.NOTION_API_KEY;
    
    if (!notionApiKey) {
      console.warn('NOTION_API_KEY not found in environment variables - using mock mode');
      
      // Return a mock response for testing
      return {
        id: `mock-${Date.now()}`,
        url: `https://www.notion.so/mock-${Date.now()}`,
        title: data.projectName
      };
    }

    // Create the page content
    const pageContent = {
      parent: {
        page_id: parentPageId
      },
      properties: {
        title: {
          title: [
            {
              text: {
                content: data.projectName
              }
            }
          ]
        }
      },
      children: [
        {
          object: 'block',
          type: 'heading_1',
          heading_1: {
            rich_text: [
              {
                text: {
                  content: data.projectName
                }
              }
            ]
          }
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                text: {
                  content: `Created: ${new Date().toLocaleDateString()}`
                }
              }
            ]
          }
        },
        {
          object: 'block',
          type: 'heading_2',
          heading_2: {
            rich_text: [
              {
                text: {
                  content: 'Project Description'
                }
              }
            ]
          }
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                text: {
                  content: data.description
                }
              }
            ]
          }
        },
        {
          object: 'block',
          type: 'heading_2',
          heading_2: {
            rich_text: [
              {
                text: {
                  content: 'Objectives'
                }
              }
            ]
          }
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                text: {
                  content: data.objectives || 'No objectives specified'
                }
              }
            ]
          }
        },
        {
          object: 'block',
          type: 'heading_2',
          heading_2: {
            rich_text: [
              {
                text: {
                  content: 'Requirements'
                }
              }
            ]
          }
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                text: {
                  content: data.requirements || 'No requirements specified'
                }
              }
            ]
          }
        },
        {
          object: 'block',
          type: 'heading_2',
          heading_2: {
            rich_text: [
              {
                text: {
                  content: 'Timeline'
                }
              }
            ]
          }
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                text: {
                  content: data.timeline || 'No timeline specified'
                }
              }
            ]
          }
        },
        {
          object: 'block',
          type: 'heading_2',
          heading_2: {
            rich_text: [
              {
                text: {
                  content: 'Budget'
                }
              }
            ]
          }
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                text: {
                  content: data.budget || 'No budget specified'
                }
              }
            ]
          }
        },
        {
          object: 'block',
          type: 'heading_2',
          heading_2: {
            rich_text: [
              {
                text: {
                  content: 'Team Members'
                }
              }
            ]
          }
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                text: {
                  content: data.team || 'No team members specified'
                }
              }
            ]
          }
        },
        {
          object: 'block',
          type: 'heading_2',
          heading_2: {
            rich_text: [
              {
                text: {
                  content: 'Deliverables'
                }
              }
            ]
          }
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                text: {
                  content: data.deliverables || 'No deliverables specified'
                }
              }
            ]
          }
        },
        {
          object: 'block',
          type: 'heading_2',
          heading_2: {
            rich_text: [
              {
                text: {
                  content: 'Potential Risks'
                }
              }
            ]
          }
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                text: {
                  content: data.risks || 'No risks identified'
                }
              }
            ]
          }
        },
        {
          object: 'block',
          type: 'heading_2',
          heading_2: {
            rich_text: [
              {
                text: {
                  content: 'Success Criteria'
                }
              }
            ]
          }
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                text: {
                  content: data.successCriteria || 'No success criteria specified'
                }
              }
            ]
          }
        }
      ]
    };

    const response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${notionApiKey}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify(pageContent),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Notion API error:', errorData);
      throw new Error(`Notion API error: ${response.status} ${response.statusText}`);
    }

    const createdPage = await response.json();
    
    return {
      id: createdPage.id,
      url: createdPage.url,
      title: data.projectName
    };

  } catch (error) {
    console.error('Error creating Notion page:', error);
    return null;
  }
}

/**
 * Searches for pages in Notion
 * @param query - Search query
 * @returns Promise<any[]> - Array of search results
 */
export async function searchNotionPages(query: string): Promise<any[]> {
  try {
    const notionApiKey = process.env.NOTION_API_KEY;
    
    if (!notionApiKey) {
      console.warn('NOTION_API_KEY not found in environment variables');
      return [];
    }

    const response = await fetch('https://api.notion.com/v1/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${notionApiKey}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify({
        query: query,
        page_size: 10
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Notion search error:', errorData);
      return [];
    }

    const searchResults = await response.json();
    return searchResults.results || [];

  } catch (error) {
    console.error('Error searching Notion pages:', error);
    return [];
  }
}

/**
 * Gets information about a specific Notion page
 * @param pageId - The page ID
 * @returns Promise<any | null> - Page information or null if failed
 */
export async function getNotionPage(pageId: string): Promise<any | null> {
  try {
    const notionApiKey = process.env.NOTION_API_KEY;
    
    if (!notionApiKey) {
      console.warn('NOTION_API_KEY not found in environment variables');
      return null;
    }

    const response = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${notionApiKey}`,
        'Notion-Version': '2022-06-28',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Notion page fetch error:', errorData);
      return null;
    }

    const pageData = await response.json();
    return pageData;

  } catch (error) {
    console.error('Error fetching Notion page:', error);
    return null;
  }
}