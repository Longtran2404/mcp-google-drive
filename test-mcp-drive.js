const { spawn } = require('child_process');
const fs = require('fs');

// Đọc environment variables
const envContent = fs.readFileSync('.env', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

console.log('🚀 Starting MCP Google Drive test...');

// Spawn MCP server
const mcpProcess = spawn('npx', ['mcp-google-drive@1.4.4'], {
  env: { ...process.env, ...envVars },
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
  console.log('🔍 Testing MCP Google Drive...');
  
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

  // Wait and send list tools request
  setTimeout(() => {
    const listToolsRequest = {
      jsonrpc: "2.0",
      id: 2,
      method: "tools/list"
    };

    console.log('📤 Sending list tools request...');
    mcpProcess.stdin.write(JSON.stringify(listToolsRequest) + '\n');

    // Wait and search for files
    setTimeout(() => {
      const searchRequest = {
        jsonrpc: "2.0",
        id: 3,
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

}, 2000);
