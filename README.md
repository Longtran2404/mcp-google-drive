# MCP Google Drive

Advanced MCP server for Google Drive integration with full CRUD operations, file management, and sharing capabilities.

## ✨ Features

- **File Management**: Create, read, update, delete files and folders
- **Search & Discovery**: Advanced search with multiple criteria
- **Sharing & Permissions**: Manage file sharing and access control
- **Content Operations**: Upload, download, and modify file content
- **Drive Operations**: List drives, manage shared drives
- **Type Safety**: Full TypeScript support with Zod validation
- **Error Handling**: Comprehensive error handling and logging

## 🚀 Quick Setup

### Prerequisites

- Node.js 18+
- Google Service Account with Drive API enabled
- Service Account JSON key file

### Installation

```bash
npm install mcp-google-drive
```

### Environment Setup

Set your Google Service Account credentials:

```bash
export GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'
```

## 🔧 Cursor MCP Integration

### Automatic Integration

The MCP server is designed to work seamlessly with Cursor. Add this configuration to your `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "mcp-google-drive": {
      "command": "npx",
      "args": ["mcp-google-drive@1.3.2"],
      "env": {
        "GOOGLE_SERVICE_ACCOUNT_KEY": "your-service-account-json",
        "MCP_MODE": "stdio",
        "LOG_LEVEL": "info",
        "DISABLE_CONSOLE_OUTPUT": "false"
      },
      "cwd": "/path/to/your/project"
    }
  }
}
```

### Troubleshooting Cursor Integration

If MCP tools are not working in Cursor:

1. **Restart Cursor** after updating `mcp.json`
2. **Check MCP Status**: Command Palette → "MCP: Show Servers"
3. **Verify Connection**: Command Palette → "MCP: Test Connection"
4. **Check Logs**: Look for MCP server startup messages

### Manual Server Start

If automatic integration fails, you can start the server manually:

```bash
# In your project directory
npm run start

# Or globally
npx mcp-google-drive
```

## 🛠️ Available Tools

### File Operations

- `search_files` - Search files with advanced criteria
- `get_file` - Get file metadata and content
- `create_file` - Create new files and folders
- `update_file` - Update file content and metadata
- `delete_file` - Delete files and folders
- `copy_file` - Copy files to new locations
- `move_file` - Move files between folders

### Drive Management

- `get_drive_info` - Get drive information
- `list_shared_drives` - List available shared drives

### Sharing & Permissions

- `get_file_permissions` - Get file sharing settings
- `share_file` - Share files with users
- `get_file_revisions` - Get file version history

## 📚 Documentation

- [Google Drive API Reference](https://developers.google.com/drive/api/reference/rest/v3)
- [MCP Protocol Specification](https://modelcontextprotocol.io/)
- [Service Account Setup Guide](./GOOGLE_SERVICE_ACCOUNT_SETUP.md)

## 🧪 Development

### Build

```bash
npm run build
```

### Development Mode

```bash
npm run dev
```

### Linting

```bash
npm run lint
npm run lint:fix
```

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines and submit pull requests.

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/Longtran2404/mcp-google-drive/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Longtran2404/mcp-google-drive/discussions)
- **Documentation**: [README](./README.md) and [Setup Guide](./GOOGLE_SERVICE_ACCOUNT_SETUP.md)
