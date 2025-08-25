const { spawn } = require('child_process');

console.log('🚀 Testing MCP Google Drive Search...');

// Note: Service Account credentials should be set via environment variables
// Set GOOGLE_SERVICE_ACCOUNT_KEY environment variable with your credentials JSON
const credentials = process.env.GOOGLE_SERVICE_ACCOUNT_KEY ? JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY) : null;

// Sử dụng PowerShell để chạy MCP
const mcpProcess = spawn('powershell.exe', [
  '-Command',
  `$env:GOOGLE_SERVICE_ACCOUNT_KEY = '${JSON.stringify(credentials)}'; npx mcp-google-drive@1.4.4`
], {
  env: { ...process.env, GOOGLE_SERVICE_ACCOUNT_KEY: JSON.stringify(credentials) },
  stdio: ['pipe', 'pipe', 'pipe']
});

let output = '';
let errorOutput = '';

mcpProcess.stdout.on('data', (data) => {
  const message = data.toString();
  output += message;
  console.log('📤 Output:', message);
});

mcpProcess.stderr.on('data', (data) => {
  const message = data.toString();
  errorOutput += message;
  console.log('❌ Error:', message);
});

mcpProcess.on('close', (code) => {
  console.log(`🔚 MCP process exited with code ${code}`);
  console.log('📋 Final output:', output);
  if (errorOutput) {
    console.log('❌ Final errors:', errorOutput);
  }
});

// Wait for server to start
setTimeout(() => {
  console.log('🔍 Testing MCP Google Drive Search...');
  
  // Initialize request
  const initRequest = {
    jsonrpc: "2.0",
    id: 1,
    method: "initialize",
    params: {
      protocolVersion: "2024-11-05",
      capabilities: {},
      clientInfo: {
        name: "test-client",
        version: "1.0.0"
      }
    }
  };

  console.log('📤 Sending initialize request...');
  mcpProcess.stdin.write(JSON.stringify(initRequest) + '\n');

  // Wait and search for files
  setTimeout(() => {
    const searchRequest = {
      jsonrpc: "2.0",
      id: 2,
      method: "tools/call",
      params: {
        name: "search_files",
        arguments: {
          query: "kịch bản kim thị",
          maxResults: 10
        }
      }
    };

    console.log('📤 Sending search request for "kịch bản kim thị"...');
    mcpProcess.stdin.write(JSON.stringify(searchRequest) + '\n');

    // Wait and exit
    setTimeout(() => {
      console.log('🔚 Closing MCP process...');
      mcpProcess.kill();
    }, 3000);

  }, 2000);

}, 2000);
