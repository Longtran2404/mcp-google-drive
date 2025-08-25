# IDE Integration Guide

This MCP Google Drive server is designed to work seamlessly with multiple IDEs and AI coding assistants.

## Supported Platforms

### 1. Cursor

- **Config File**: `cursor-mcp-config.json`
- **Setup**: Copy the configuration to your `~/.cursor/mcp.json`

### 2. VSCode

- **Config File**: `vscode-mcp-config.json`
- **Setup**: Use with VSCode MCP extension

### 3. Claude Code

- **Config File**: `claude-code-mcp-config.json`
- **Setup**: Use with Claude Code MCP integration

## Quick Setup

### For Cursor Users

1. Copy the content from `cursor-mcp-config.json`
2. Add it to your `~/.cursor/mcp.json` file
3. Set your environment variables:
   ```env
   GOOGLE_CLIENT_ID=your_client_id_here
   GOOGLE_CLIENT_SECRET=your_client_secret_here
   GDRIVE_CREDS_DIR=C:\Users\YourUsername\.config\mcp-gdrive
   ```

### For VSCode Users

1. Install the MCP extension for VSCode
2. Copy the content from `vscode-mcp-config.json`
3. Configure the MCP server in VSCode settings

### For Claude Code Users

1. Copy the content from `claude-code-mcp-config.json`
2. Configure Claude Code to use this MCP server
3. Set your environment variables as shown above

## Environment Variables

All platforms require these environment variables:

```env
# Required
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here

# Optional (with defaults)
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
GDRIVE_CREDS_DIR=C:\Users\YourUsername\.config\mcp-gdrive
MCP_MODE=stdio
LOG_LEVEL=info
```

## Features Available

All platforms support the same features:

- **File Search**: Advanced search with Vietnamese support
- **File Operations**: Create, read, update, delete files
- **Folder Management**: Create and manage folders
- **File Sharing**: Share files with permissions
- **Drive Info**: Get drive information and statistics
- **Revision History**: View file revision history

## Authentication

All platforms use OAuth2 authentication:

1. **First Run**: You'll be prompted to authorize
2. **Token Storage**: Tokens are stored locally
3. **Auto Refresh**: Tokens are automatically refreshed when needed

## Troubleshooting

### Common Issues

1. **Authentication Errors**: Check your OAuth2 credentials
2. **Permission Denied**: Ensure correct scopes are configured
3. **Token Expired**: The server will automatically re-authenticate

### Platform-Specific Issues

- **Cursor**: Check `~/.cursor/mcp.json` syntax
- **VSCode**: Verify MCP extension is installed
- **Claude Code**: Ensure MCP integration is enabled

## Security Notes

- Never commit credentials to version control
- Use environment variables for sensitive data
- Tokens are stored locally and encrypted
- Regularly rotate your OAuth2 credentials

## Support

For issues specific to each platform:

- **Cursor**: Check Cursor documentation
- **VSCode**: Check VSCode MCP extension docs
- **Claude Code**: Check Claude Code documentation

For general MCP Google Drive issues, refer to:

- `OAUTH2_SETUP.md` - Detailed OAuth2 setup
- `MIGRATION_GUIDE.md` - Migration from Service Account
- `README.md` - General documentation
