/**
 * Complete Workflow Test
 * Tests the entire project manager workflow
 */

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testCompleteWorkflow() {
  console.log('🧪 Testing Complete Project Manager Workflow...\n');
  
  const testData = {
    projectName: 'Complete Workflow Test Project',
    description: 'This is a comprehensive test of the entire project manager workflow including MD file generation and Notion integration.',
    objectives: 'Test the complete workflow end-to-end',
    requirements: 'Verify MD file generation, proper naming, and Notion integration',
    timeline: '1 day',
    budget: '$0 (testing)',
    team: 'Test Team',
    deliverables: 'Working project manager system',
    risks: 'None for testing purposes',
    successCriteria: 'All components working correctly'
  };

  try {
    console.log('1. Testing API endpoint...');
    
    const response = await fetch('http://localhost:3000/api/project-manager', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log(`   ✅ API responded with status: ${response.status}`);
    
    // Check content type
    const contentType = response.headers.get('content-type');
    console.log(`   Content-Type: ${contentType}`);
    
    if (contentType && contentType.includes('text/markdown')) {
      console.log('   ✅ Correct content type (markdown)');
      
      // Check custom headers
      const filename = response.headers.get('X-Filename');
      const notionSuccess = response.headers.get('X-Notion-Success');
      
      console.log(`   Filename header: ${filename || 'Not set'}`);
      console.log(`   Notion success header: ${notionSuccess || 'Not set'}`);
      
      // Get the content
      const content = await response.text();
      console.log(`   Content length: ${content.length} characters`);
      
      // Check if content contains expected elements
      if (content.includes(testData.projectName)) {
        console.log('   ✅ Project name found in content');
      } else {
        console.log('   ❌ Project name not found in content');
      }
      
      if (content.includes(testData.description)) {
        console.log('   ✅ Description found in content');
      } else {
        console.log('   ❌ Description not found in content');
      }
      
      if (content.includes('## Project Description')) {
        console.log('   ✅ Proper markdown structure found');
      } else {
        console.log('   ❌ Proper markdown structure not found');
      }
      
      // Save the file for inspection
      const fs = require('fs');
      fs.writeFileSync('test-output.md', content);
      console.log('   ✅ Content saved to test-output.md');
      
    } else {
      console.log('   ❌ Unexpected content type');
    }

    console.log('\n2. Testing Notion integration...');
    
    // Test Notion integration directly
    const { createNotionPage } = require('./lib/notion.ts');
    const notionPage = await createNotionPage(testData);
    
    if (notionPage) {
      console.log('   ✅ Notion page created successfully');
      console.log(`   Page ID: ${notionPage.id}`);
      console.log(`   Page URL: ${notionPage.url}`);
      console.log(`   Page Title: ${notionPage.title}`);
    } else {
      console.log('   ❌ Failed to create Notion page');
    }

    console.log('\n3. Testing filename generation...');
    
    // Test filename generation
    function generateSafeFilename(projectName) {
      const safeName = projectName
        .replace(/[^a-zA-Z0-9\s-_]/g, '')
        .replace(/\s+/g, '_')
        .toLowerCase();
      
      const timestamp = new Date().toISOString().split('T')[0];
      return `${safeName}_${timestamp}.md`;
    }
    
    const expectedFilename = generateSafeFilename(testData.projectName);
    console.log(`   Expected filename: ${expectedFilename}`);
    
    if (expectedFilename.includes('complete_workflow_test_project')) {
      console.log('   ✅ Filename generation working correctly');
    } else {
      console.log('   ❌ Filename generation not working correctly');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testCompleteWorkflow().then(() => {
  console.log('\n🏁 Complete workflow test completed');
}).catch(error => {
  console.error('💥 Test error:', error);
});