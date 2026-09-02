import { CallToolResultSchema, type CallToolResult } from '@modelcontextprotocol/sdk/types.js';

type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };

const SENSITIVE_KEY_PATTERN =
  /^(?:authorization|credentials?|google[_-]?service[_-]?account[_-]?key|private[_-]?key|client[_-]?secret|password|secret|token|(?:access|refresh|id)[_-]?token|api[_-]?key)$/i;

function sanitizeSensitiveText(value: string): string {
  return value
    .replace(
      /(-----BEGIN [^-]*PRIVATE KEY-----)[\s\S]*?(-----END [^-]*PRIVATE KEY-----)/gi,
      '$1\n[REDACTED]\n$2'
    )
    .replace(/(Bearer\s+)[A-Za-z0-9._~+/-]+=*/gi, '$1[REDACTED]')
    .replace(
      /(["']?(?:(?:access|refresh|id)[_-]?token|token|secret|client[_-]?secret|api[_-]?key|password|google[_-]?service[_-]?account[_-]?key)["']?\s*[:=]\s*)"(?:\\.|[^"\\])*"/gi,
      '$1"[REDACTED]"'
    )
    .replace(
      /(["']?(?:(?:access|refresh|id)[_-]?token|token|secret|client[_-]?secret|api[_-]?key|password|google[_-]?service[_-]?account[_-]?key)["']?\s*[:=]\s*)'(?:\\.|[^'\\])*'/gi,
      "$1'[REDACTED]'"
    )
    .replace(
      /(["']?(?:(?:access|refresh|id)[_-]?token|token|secret|client[_-]?secret|api[_-]?key|password|google[_-]?service[_-]?account[_-]?key)["']?\s*[:=]\s*)[^"'\s,;}\]]+/gi,
      '$1[REDACTED]'
    );
}

function toJsonValue(value: unknown, seen: WeakSet<object>): JsonValue {
  if (value === null || typeof value === 'boolean' || typeof value === 'string') {
    return typeof value === 'string' ? sanitizeSensitiveText(value) : value;
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : String(value);
  }

  if (typeof value === 'bigint') {
    return value.toString();
  }

  if (typeof value === 'undefined') {
    return null;
  }

  if (typeof value === 'symbol' || typeof value === 'function') {
    return String(value);
  }

  if (Buffer.isBuffer(value)) {
    return {
      type: 'Buffer',
      encoding: 'base64',
      byteLength: value.byteLength,
      data: value.toString('base64'),
    };
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (value instanceof Error) {
    return {
      name: value.name,
      message: sanitizeSensitiveText(value.message),
    };
  }

  if (seen.has(value)) {
    return '[Circular]';
  }
  seen.add(value);

  if (Array.isArray(value)) {
    const result = value.map(item => toJsonValue(item, seen));
    seen.delete(value);
    return result;
  }

  const result: { [key: string]: JsonValue } = {};
  for (const [key, entryValue] of Object.entries(value)) {
    result[key] = SENSITIVE_KEY_PATTERN.test(key) ? '[REDACTED]' : toJsonValue(entryValue, seen);
  }
  seen.delete(value);
  return result;
}

function isJsonObject(value: JsonValue): value is { [key: string]: JsonValue } {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function toCallToolResult(rawResult: unknown): CallToolResult {
  const jsonResult = toJsonValue(rawResult, new WeakSet<object>());
  const text = typeof jsonResult === 'string' ? jsonResult : JSON.stringify(jsonResult, null, 2);
  const result: CallToolResult = {
    content: [{ type: 'text', text }],
    isError: false,
  };

  if (isJsonObject(jsonResult)) {
    result.structuredContent = jsonResult;
  }

  return CallToolResultSchema.parse(result);
}

export function toCallToolError(toolName: string, error: unknown): CallToolResult {
  const rawMessage = error instanceof Error ? error.message : String(error);
  const message = sanitizeSensitiveText(rawMessage);

  return CallToolResultSchema.parse({
    content: [
      {
        type: 'text',
        text: `Tool ${toolName} failed: ${message}`,
      },
    ],
    isError: true,
  });
}

export async function runCallToolOperation(
  toolName: string,
  operation: () => Promise<unknown>
): Promise<CallToolResult> {
  try {
    return toCallToolResult(await operation());
  } catch (error) {
    return toCallToolError(toolName, error);
  }
}
