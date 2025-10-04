/**
 * Test Notion API Integration
 */

const { createNotionPage, searchNotionPages, getNotionPage } = require('./lib/notion.ts');

async function testNotionIntegration() {
  console.log('🧪 Testing Notion Integration...\n');
  
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

  try {
    // Test 1: Search for existing pages
    console.log('1. Testing Notion search...');
    const searchResults = await searchNotionPages('Project Scopes');
    console.log(`   Found ${searchResults.length} pages matching "Project Scopes"`);
    
    if (searchResults.length > 0) {
      console.log('   Sample result:', searchResults[0].title || 'No title');
    }

    // Test 2: Create a new page
    console.log('\n2. Testing Notion page creation...');
    const notionPage = await createNotionPage(testData);
    
    if (notionPage) {
      console.log('   ✅ Page created successfully!');
      console.log(`   Page ID: ${notionPage.id}`);
      console.log(`   Page URL: ${notionPage.url}`);
      console.log(`   Page Title: ${notionPage.title}`);
    } else {
      console.log('   ❌ Failed to create page');
    }

    // Test 3: Get page information (if page was created)
    if (notionPage) {
      console.log('\n3. Testing Notion page retrieval...');
      const pageInfo = await getNotionPage(notionPage.id);
      
      if (pageInfo) {
        console.log('   ✅ Page retrieved successfully!');
        console.log(`   Page Type: ${pageInfo.object}`);
        console.log(`   Created Time: ${pageInfo.created_time}`);
      } else {
        console.log('   ❌ Failed to retrieve page');
      }
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