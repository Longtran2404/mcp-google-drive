# 🚀 MCP Google Drive Server

**Advanced MCP (Model Context Protocol) server for Google Drive integration** with full CRUD operations, file management, sharing capabilities, and enterprise features.

[![npm version](https://badge.fury.io/js/mcp-google-drive-server.svg)](https://badge.fury.io/js/mcp-google-drive-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)

## ✨ Features

- 🔍 **Advanced Search**: Powerful Google Drive search with filters and sorting
- 📁 **Full CRUD Operations**: Create, read, update, delete files and folders
- 🔐 **Permission Management**: View and manage file sharing permissions
- 📤 **File Operations**: Copy, move, rename, and organize files
- 🗂️ **Folder Management**: Create and organize folder structures
- 👥 **Sharing & Collaboration**: Share files with specific roles and messages
- 🚀 **Shared Drives Support**: Work with enterprise shared drives
- 📊 **Revision History**: Track file changes and versions
- 🎯 **Multi-format Export**: Export files to various formats
- 🔒 **Security**: Secure service account authentication

## 🛠️ Available Tools (16 Total)

### 🔍 **Search & Discovery**
1. **`search_files`** - Advanced file search with filters
2. **`list_files`** - List files with pagination and filtering
3. **`get_drive_info`** - Get information about drives
4. **`list_shared_drives`** - List all shared drives

### 📄 **File Operations**
5. **`get_file`** - Get file metadata and content
6. **`get_file_content`** - Export files to various formats
7. **`create_file`** - Create new files
8. **`update_file`** - Update existing files
9. **`delete_file`** - Delete files (trash or permanent)
10. **`copy_file`** - Copy files to new locations
11. **`move_file`** - Move files between folders

### 🗂️ **Folder Management**
12. **`create_folder`** - Create new folders

### 🔐 **Permissions & Sharing**
13. **`get_file_permissions`** - View file permissions
14. **`share_file`** - Share files with users
15. **`get_file_revisions`** - View file revision history

## 🚀 Quick Start

### Installation

```bash
npm install mcp-google-drive-server
```

### Configuration

Set the following environment variable:

```bash
GOOGLE_SERVICE_ACCOUNT_KEY=path/to/service-account-key.json
```

Or use the JSON content directly:

```bash
GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'
```

### Usage

```bash
# Start the server
npx mcp-google-drive-server

# Or in your MCP configuration
{
  "mcpServers": {
    "google-drive": {
      "command": "npx",
      "args": ["mcp-google-drive-server"],
      "env": {
        "GOOGLE_SERVICE_ACCOUNT_KEY": "your-key-here"
      }
    }
  }
}
```

## 📚 Tool Examples

### 🔍 Search for Files

```json
{
  "query": "name contains 'Kịch bản' and mimeType='application/vnd.google-apps.spreadsheet'",
  "maxResults": 50,
  "orderBy": "modifiedTime desc",
  "includeTrashed": false
}
```

### 📄 Create a New File

```json
{
  "name": "My Document.txt",
  "mimeType": "text/plain",
  "content": "Hello, this is my new document!",
  "description": "A sample text document",
  "parentId": "folder_id_here"
}
```

### 🔐 Share a File

```json
{
  "fileId": "file_id_here",
  "email": "user@example.com",
  "role": "writer",
  "message": "Here's the document we discussed"
}
```

### 📁 Create a Folder

```json
{
  "name": "Project Documents",
  "description": "All project-related documents",
  "parentId": "parent_folder_id"
}
```

## 🔧 Google Drive Search Syntax

Use Google Drive's powerful search syntax:

- `name contains 'keyword'` - Search in filename
- `mimeType='application/vnd.google-apps.spreadsheet'` - Filter by file type
- `modifiedTime > '2024-01-01'` - Filter by date
- `'folder_id' in parents` - Search in specific folder
- `trashed = false` - Exclude trashed files
- `owners in 'user@example.com'` - Filter by owner
- `size > 1000000` - Filter by file size

## 📋 File Types

Common MIME types:

- **Google Workspace**: 
  - Sheets: `application/vnd.google-apps.spreadsheet`
  - Docs: `application/vnd.google-apps.document`
  - Slides: `application/vnd.google-apps.presentation`
  - Forms: `application/vnd.google-apps.form`
- **Documents**: 
  - PDF: `application/pdf`
  - Text: `text/plain`
  - Word: `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- **Media**: 
  - Images: `image/jpeg`, `image/png`, `image/gif`
  - Videos: `video/mp4`, `video/avi`

## 🏗️ Development

```bash
# Clone the repository
git clone https://github.com/yourusername/mcp-google-drive-server.git
cd mcp-google-drive-server

# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Format code
npm run format
```

## 🔒 Security Features

- **Service Account Authentication**: Secure API access
- **Scope Limitation**: Minimal required permissions
- **Error Handling**: Secure error messages
- **Input Validation**: Zod schema validation
- **Audit Logging**: Operation tracking

## 🌟 Advanced Features

### Shared Drives Support
Work with enterprise shared drives:
```json
{
  "driveId": "shared_drive_id",
  "includeItemsFromAllDrives": true
}
```

### File Revisions
Track file changes over time:
```json
{
  "fileId": "file_id",
  "maxResults": 20
}
```

### Batch Operations
Efficiently handle multiple files:
```json
{
  "query": "mimeType='application/vnd.google-apps.spreadsheet'",
  "maxResults": 100
}
```

## 🚨 Error Handling

The server provides detailed error messages for:

- **Authentication failures** - Invalid credentials or expired tokens
- **File not found** - Missing or deleted files
- **Permission denied** - Insufficient access rights
- **Invalid parameters** - Malformed requests
- **Rate limiting** - API quota exceeded
- **Network issues** - Connection problems

## 📊 Performance

- **Pagination**: Efficient large result handling
- **Field Selection**: Only fetch required data
- **Caching**: Optimized API calls
- **Async Operations**: Non-blocking file operations
- **Batch Processing**: Handle multiple files efficiently

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/mcp-google-drive-server/issues)
- **Documentation**: [GitHub Wiki](https://github.com/yourusername/mcp-google-drive-server/wiki)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/mcp-google-drive-server/discussions)

## 🙏 Acknowledgments

- [Google Drive API](https://developers.google.com/drive) for the powerful API
- [MCP Protocol](https://modelcontextprotocol.io/) for the excellent framework
- [Zod](https://zod.dev/) for robust schema validation

---

**Made with ❤️ for the MCP community**
