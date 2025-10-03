#!/usr/bin/env node

// Simple test script for the MCP server
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🧪 Testing Supabase MCP Server...\n');

// Start the MCP server
const server = spawn('node', [join(__dirname, 'dist', 'index.js')], {
  stdio: ['pipe', 'pipe', 'pipe']
});

// Test message to list tools
const testMessage = {
  jsonrpc: '2.0',
  id: 1,
  method: 'tools/list',
  params: {}
};

console.log('📤 Sending tools/list request...');
server.stdin.write(JSON.stringify(testMessage) + '\n');

// Handle responses
server.stdout.on('data', (data) => {
  const response = JSON.parse(data.toString());
  console.log('📥 Server response:', JSON.stringify(response, null, 2));
});

server.stderr.on('data', (data) => {
  console.log('🔍 Server log:', data.toString());
});

// Clean up after 5 seconds
setTimeout(() => {
  console.log('\n✅ Test completed');
  server.kill();
  process.exit(0);
}, 5000);

server.on('error', (error) => {
  console.error('❌ Server error:', error);
  process.exit(1);
});
