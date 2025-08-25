import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

export abstract class BaseToolHandler {
  abstract runTool(args: any, drive: any): Promise<CallToolResult>;

  protected handleGoogleApiError(error: any): Error {
    if (error.response?.data?.error) {
      const googleError = error.response.data.error;
      return new Error(`Google API Error: ${googleError.message} (Code: ${googleError.code})`);
    }
    
    if (error.message) {
      return new Error(`Google Drive Error: ${error.message}`);
    }
    
    return new Error(`Unknown Google Drive Error: ${error}`);
  }

  protected formatError(message: string): CallToolResult {
    return {
      content: [{
        type: "text",
        text: `Error: ${message}`,
      }],
      isError: true,
    };
  }

  protected formatSuccess(message: string): CallToolResult {
    return {
      content: [{
        type: "text",
        text: message,
      }],
      isError: false,
    };
  }
}
