# MCP Google Drive Server

Advanced MCP (Model Context Protocol) server for Google Drive integration with full CRUD operations, file management, and sharing capabilities.

## 🚀 Features

- **16 Powerful Tools** for comprehensive Google Drive management
- **Full CRUD Operations** for files and folders
- **Advanced Search** with Google Drive syntax and filters
- **Permission Management** and file sharing
- **Shared Drives Support** for enterprise environments
- **File Revision History** tracking
- **Multi-format Export** capabilities
- **Folder Management** and organization
- **File Operations** (copy, move, rename)
- **Security Features** with service account authentication

## 📋 Prerequisites

- Node.js 18.0.0 or higher
- Google Cloud Platform account
- Google Drive API enabled
- Service account credentials

## 🛠️ Installation

```bash
npm install mcp-google-drive
```

## ⚙️ Quick Setup

1. **Install the package:**

   ```bash
   npm install mcp-google-drive
   ```

2. **Set up Google Service Account:**
   - Follow the comprehensive guide: [GOOGLE_SERVICE_ACCOUNT_SETUP.md](./GOOGLE_SERVICE_ACCOUNT_SETUP.md)
   - Download your service account key JSON file
   - Set environment variable: `GOOGLE_SERVICE_ACCOUNT_KEY=./path/to/key.json`

3. **Configure MCP client:**
   ```json
   {
     "mcpServers": {
       "google-drive": {
         "command": "npx",
         "args": ["mcp-google-drive-server"],
         "env": {
           "GOOGLE_SERVICE_ACCOUNT_KEY": "./google-service-account-key.json"
         }
       }
     }
   }
   ```

## 🔧 Available Tools

### File Management

- `search_files` - Advanced file search with filters
- `list_files` - List files with pagination
- `get_file` - Get file metadata and content
- `create_file` - Create new files
- `update_file` - Update existing files
- `delete_file` - Delete or trash files
- `copy_file` - Copy files to new locations
- `move_file` - Move files between folders

### Folder Operations

- `create_folder` - Create new folders
- `list_folders` - List folder contents

### Sharing & Permissions

- `get_file_permissions` - View file permissions
- `share_file` - Share files with users
- `get_drive_info` - Get drive information

### Advanced Features

- `get_file_content` - Export files to different formats
- `list_shared_drives` - Work with enterprise drives
- `get_file_revisions` - Track file version history

## 📖 Documentation

- **[Google Service Account Setup](./GOOGLE_SERVICE_ACCOUNT_SETUP.md)** - Complete setup guide
- **[API Reference](./docs/API.md)** - Detailed tool documentation
- **[Examples](./examples/)** - Usage examples and patterns
- **[Troubleshooting](./docs/TROUBLESHOOTING.md)** - Common issues and solutions

## 🔒 Security

- Service account authentication
- Minimal required permissions
- Secure error messages
- Input validation and sanitization
- No user data storage or logging

## 🧪 Development

```bash
# Clone repository
git clone https://github.com/Longtran2404/mcp-google-drive.git
cd mcp-google-drive

# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Format code
npm run format
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## 🐛 Issues & Support

- **Bug Reports**: [GitHub Issues](https://github.com/Longtran2404/mcp-google-drive/issues)
- **Feature Requests**: [GitHub Discussions](https://github.com/Longtran2404/mcp-google-drive/discussions)
- **Documentation**: [GitHub Wiki](https://github.com/Longtran2404/mcp-google-drive/wiki)

## 📊 Version History

See [CHANGELOG.md](CHANGELOG.md) for a complete list of changes and versions.

## 🙏 Acknowledgments

- [MCP (Model Context Protocol)](https://modelcontextprotocol.io/) team
- [Google Drive API](https://developers.google.com/drive) documentation
- [Google Cloud Platform](https://cloud.google.com/) services
- [TypeScript](https://www.typescriptlang.org/) community
- [Zod](https://zod.dev/) for schema validation

---

**Made with ❤️ by the MCP Google Drive Team**
