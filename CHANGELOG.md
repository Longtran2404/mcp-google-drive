# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.3] - 2024-12-XX

### Added

- **Enhanced Cursor MCP Integration**: Improved automatic startup and configuration
- **Better Error Handling**: More detailed error messages and logging
- **Cursor Integration Guide**: Comprehensive troubleshooting guide for Cursor users
- **MCP Configuration Templates**: Ready-to-use MCP configuration examples

### Changed

- **MCP Configuration**: Added `MCP_MODE`, `LOG_LEVEL`, and `cwd` parameters
- **README**: Updated with Cursor integration instructions and troubleshooting
- **Documentation**: Added `CURSOR_INTEGRATION.md` with detailed setup guide

### Fixed

- **Cursor Integration Issues**: Resolved problems with MCP server not auto-starting
- **Configuration Problems**: Fixed MCP server configuration for better Cursor compatibility
- **Startup Issues**: Improved automatic MCP server startup in Cursor

## [1.3.2] - 2024-12-XX

### Added

- **Executable Package**: Added `bin` field and shebang for direct execution
- **Enhanced Error Handling**: Better error messages and validation
- **Type Safety Improvements**: Replaced `any` types with proper TypeScript types

### Changed

- **Package Structure**: Optimized for better npm distribution
- **Build Process**: Improved TypeScript compilation and build scripts
- **Documentation**: Updated README with better usage examples

### Fixed

- **ESLint Issues**: Resolved linting errors and warnings
- **TypeScript Compatibility**: Fixed type-related issues
- **Build Process**: Streamlined build and development workflow

## [1.3.1] - 2024-12-XX

### Added

- **Google Service Account Setup Guide**: Comprehensive setup instructions
- **Enhanced Documentation**: Better README and API documentation
- **Development Scripts**: Additional npm scripts for development

### Changed

- **Package Name**: Renamed from `@minhlong244/mcp-google-drive` to `mcp-google-drive`
- **Repository URLs**: Updated to reflect new GitHub organization
- **Documentation**: Improved setup and usage instructions

### Removed

- **Unnecessary Files**: Removed deployment, security, and contributing docs
- **Old Configuration**: Cleaned up outdated configuration files

## [1.3.0] - 2024-12-XX

### Added

- **Full CRUD Operations**: Create, read, update, delete files and folders
- **Advanced Search**: Google Drive syntax search with filters
- **File Management**: Copy, move, rename, and organize files
- **Permission Management**: File sharing and access control
- **Shared Drives Support**: Enterprise drive management
- **File Revisions**: Version history tracking
- **Multi-format Export**: Support for various file formats
- **TypeScript Support**: Full TypeScript implementation
- **Zod Validation**: Input validation and error handling

### Changed

- **Complete Rewrite**: Modern TypeScript implementation
- **MCP Protocol**: Updated to latest MCP specification
- **Google APIs**: Latest Google Drive API integration
- **Error Handling**: Comprehensive error handling and logging

## [1.2.0] - 2024-12-XX

### Added

- **Basic File Operations**: File listing and basic management
- **Google Drive API**: Initial integration with Google Drive
- **MCP Server**: Basic MCP server implementation

### Changed

- **Architecture**: Improved server architecture and performance
- **Error Handling**: Better error handling and user feedback

## [1.1.0] - 2024-12-XX

### Added

- **Initial Release**: Basic MCP server functionality
- **Google Drive Integration**: Basic file operations
- **TypeScript Support**: Initial TypeScript implementation

### Changed

- **Project Structure**: Organized project structure
- **Documentation**: Basic README and setup instructions

## [1.0.0] - 2024-12-XX

### Added

- **Project Initialization**: Initial project setup
- **Basic MCP Server**: Foundation for MCP server development
- **Development Environment**: TypeScript, ESLint, and build tools setup
