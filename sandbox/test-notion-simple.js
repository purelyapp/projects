/**
 * Simple Notion Integration Test
 */

// Mock the environment
process.env.NOTION_API_KEY = '';

async function testNotionIntegration() {
  console.log('🧪 Testing Notion Integration...\n');
  
  try {
    // Import the Notion utility
    const { createNotionPage } = require('./lib/notion.ts');
    
    // Test data
    const testData = {
      projectName: 'Test Project - Notion Integration',
      description: 'This is a test project to verify Notion integration is working correctly.',
      objectives: 'Test the Notion API integration',
      requirements: 'Verify API connectivity and page creation',
      timeline: 'Immediate',
      budget: 'N/A',
      team: 'Test Team',
      deliverables: 'Working Notion integration',
      risks: 'API connectivity issues',
      successCriteria: 'Page created successfully in Notion'
    };

    console.log('Creating Notion page...');
    const notionPage = await createNotionPage(testData);
    
    if (notionPage) {
      console.log('✅ Page created successfully!');
      console.log(`   Page ID: ${notionPage.id}`);
      console.log(`   Page URL: ${notionPage.url}`);
      console.log(`   Page Title: ${notionPage.title}`);
    } else {
      console.log('❌ Failed to create page');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testNotionIntegration().then(() => {
  console.log('\n🏁 Notion integration test completed');
}).catch(error => {
  console.error('💥 Test error:', error);
});