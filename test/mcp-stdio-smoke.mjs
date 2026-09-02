import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { CallToolResultSchema } from '@modelcontextprotocol/sdk/types.js';

const expectedTools = [
  'search_files',
  'get_file',
  'list_files',
  'get_file_content',
  'create_file',
  'update_file',
  'delete_file',
  'copy_file',
  'move_file',
  'create_folder',
  'get_file_permissions',
  'share_file',
  'get_drive_info',
  'list_shared_drives',
  'get_file_revisions',
];

const client = new Client(
  { name: 'mcp-google-drive-release-smoke', version: '1.0.0' },
  { capabilities: {} }
);
const transport = new StdioClientTransport({
  command: process.execPath,
  args: [resolve('dist/index.js')],
  cwd: process.cwd(),
  env: {
    LOG_LEVEL: 'error',
    NODE_ENV: 'test',
  },
  stderr: 'pipe',
});

try {
  await client.connect(transport, { timeout: 10_000 });
  const response = await client.listTools(undefined, { timeout: 10_000 });
  const toolNames = response.tools.map(tool => tool.name);

  assert.deepEqual(toolNames, expectedTools);
  assert.equal(response.tools.length, 15);

  const noAuthResult = CallToolResultSchema.parse(
    await client.callTool(
      { name: 'get_file_content', arguments: { fileId: 'credential-free-smoke' } },
      undefined,
      { timeout: 10_000 }
    )
  );
  assert.equal(noAuthResult.isError, true);
  assert.match(noAuthResult.content[0].text, /Authentication not ready/);

  console.log(
    `MCP stdio smoke test passed: initialized, listed ${toolNames.length} tools, and validated a credential-free call-tool error response.`
  );
} finally {
  await client.close();
}
