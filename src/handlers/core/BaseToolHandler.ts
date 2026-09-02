import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type { drive_v3 } from 'googleapis';

type GoogleApiErrorShape = {
  message?: string;
  response?: {
    data?: {
      error?: {
        code?: number | string;
        message?: string;
      };
    };
  };
};

function getGoogleApiErrorShape(error: unknown): GoogleApiErrorShape {
  return typeof error === 'object' && error !== null ? (error as GoogleApiErrorShape) : {};
}

export abstract class BaseToolHandler {
  abstract runTool(args: unknown, drive: drive_v3.Drive): Promise<CallToolResult>;

  protected handleGoogleApiError(error: unknown): Error {
    const errorShape = getGoogleApiErrorShape(error);

    if (errorShape.response?.data?.error) {
      const googleError = errorShape.response.data.error;
      return new Error(`Google API Error: ${googleError.message} (Code: ${googleError.code})`);
    }

    if (errorShape.message) {
      return new Error(`Google Drive Error: ${errorShape.message}`);
    }

    return new Error(`Unknown Google Drive Error: ${String(error)}`);
  }

  protected formatError(message: string): CallToolResult {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${message}`,
        },
      ],
      isError: true,
    };
  }

  protected formatSuccess(message: string): CallToolResult {
    return {
      content: [
        {
          type: 'text',
          text: message,
        },
      ],
      isError: false,
    };
  }
}
