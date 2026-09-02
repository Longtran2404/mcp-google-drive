import assert from 'node:assert/strict';
import { CallToolResultSchema } from '@modelcontextprotocol/sdk/types.js';
import { runCallToolOperation } from '../dist/mcp-result.js';

function parseResult(result) {
  return CallToolResultSchema.parse(result);
}

const objectResult = parseResult(
  await runCallToolOperation('list_files', async () => ({
    files: [{ id: 'file-1', name: 'Release plan' }],
    nextPageToken: null,
    totalResults: 1,
    credentials: { private_key: 'not-for-output' },
  }))
);
assert.notEqual(objectResult.isError, true);
assert.match(objectResult.content[0].text, /Release plan/);
assert.deepEqual(objectResult.structuredContent?.files, [{ id: 'file-1', name: 'Release plan' }]);
assert.equal(objectResult.structuredContent?.credentials, '[REDACTED]');
assert.doesNotMatch(objectResult.content[0].text, /not-for-output/);

const stringContentResult = parseResult(
  await runCallToolOperation('get_file_content', async () => ({
    content: 'plain text file',
    mimeType: 'text/plain',
    encoding: 'utf-8',
  }))
);
assert.match(stringContentResult.content[0].text, /plain text file/);
assert.equal(stringContentResult.structuredContent?.content, 'plain text file');

const bufferContentResult = parseResult(
  await runCallToolOperation('get_file_content', async () => ({
    content: Buffer.from('binary file'),
    mimeType: 'application/octet-stream',
    encoding: 'raw',
  }))
);
assert.match(bufferContentResult.content[0].text, /YmluYXJ5IGZpbGU=/);
assert.deepEqual(bufferContentResult.structuredContent?.content, {
  type: 'Buffer',
  encoding: 'base64',
  byteLength: 11,
  data: 'YmluYXJ5IGZpbGU=',
});

const errorResult = parseResult(
  await runCallToolOperation('get_file_content', async () => {
    throw new Error('access_token=not-for-output');
  })
);
assert.equal(errorResult.isError, true);
assert.match(errorResult.content[0].text, /access_token=\[REDACTED\]/);
assert.doesNotMatch(errorResult.content[0].text, /not-for-output/);
assert.equal(errorResult.structuredContent, undefined);

const quotedJsonSentinel = 'quoted-json-token-sentinel-7Jw9';
const quotedJsonResult = parseResult(
  await runCallToolOperation(
    'get_file_content',
    async () => `{"access_token":"${quotedJsonSentinel}","status":"ok"}`
  )
);
assert.equal(quotedJsonResult.content[0].text, '{"access_token":"[REDACTED]","status":"ok"}');
assert.doesNotMatch(quotedJsonResult.content[0].text, new RegExp(quotedJsonSentinel));

const spacedPasswordSentinel = 'two word secret sentinel 4Qx8';
const spacedPasswordResult = parseResult(
  await runCallToolOperation(
    'get_file_content',
    async () => `password = "${spacedPasswordSentinel}"`
  )
);
assert.equal(spacedPasswordResult.content[0].text, 'password = "[REDACTED]"');
assert.doesNotMatch(spacedPasswordResult.content[0].text, new RegExp(spacedPasswordSentinel));

console.log(
  'MCP call-tool contract tests passed for object, string, Buffer, error, quoted JSON, and spaced quoted secret results.'
);
