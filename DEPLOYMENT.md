# 🚀 Deployment Guide

## 📋 Prerequisites

- Node.js 18+ installed
- npm account (for publishing to npm)
- GitHub account (for repository)
- Google Service Account setup

## 🎯 Step 1: GitHub Repository Setup

### 1.1 Create New Repository on GitHub
- Go to [GitHub](https://github.com)
- Click "New repository"
- Name: `mcp-google-drive-server`
- Description: `Advanced MCP server for Google Drive integration`
- Make it Public
- Don't initialize with README (we already have one)

### 1.2 Clone and Setup Local Repository
```bash
# Clone the new repository
git clone https://github.com/YOUR_USERNAME/mcp-google-drive-server.git
cd mcp-google-drive-server

# Copy all files from current mcp-google-drive folder
# Then initialize git
git init
git add .
git commit -m "Initial commit: Advanced MCP Google Drive Server"

# Add remote origin
git remote add origin https://github.com/YOUR_USERNAME/mcp-google-drive-server.git
git branch -M main
git push -u origin main
```

## 📦 Step 2: NPM Package Setup

### 2.1 Login to NPM
```bash
npm login
# Enter your npm username, password, and email
```

### 2.2 Update package.json
Update the repository URLs in `package.json`:
```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/YOUR_USERNAME/mcp-google-drive-server.git"
  },
  "bugs": {
    "url": "https://github.com/YOUR_USERNAME/mcp-google-drive-server/issues"
  },
  "homepage": "https://github.com/YOUR_USERNAME/mcp-google-drive-server#readme"
}
```

### 2.3 Publish to NPM
```bash
# Build the project
npm run build

# Publish to npm
npm publish

# Or publish with specific version
npm version patch  # 1.0.0 -> 1.0.1
npm publish
```

## 🔧 Step 3: GitHub Actions (Optional)

Create `.github/workflows/ci.yml` for automated testing and deployment:

```yaml
name: CI/CD

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Test
      run: npm test
```

## 📝 Step 4: Update Documentation

### 4.1 Update README.md
Replace `yourusername` with your actual GitHub username in:
- Repository URLs
- Installation instructions
- Support links

### 4.2 Add Badges
Add these badges to README.md:
```markdown
[![npm version](https://badge.fury.io/js/mcp-google-drive-server.svg)](https://badge.fury.io/js/mcp-google-drive-server)
[![GitHub release](https://img.shields.io/github/release/YOUR_USERNAME/mcp-google-drive-server.svg)](https://github.com/YOUR_USERNAME/mcp-google-drive-server/releases)
[![GitHub issues](https://img.shields.io/github/issues/YOUR_USERNAME/mcp-google-drive-server.svg)](https://github.com/YOUR_USERNAME/mcp-google-drive-server/issues)
```

## 🌟 Step 5: Release Management

### 5.1 Create GitHub Release
- Go to GitHub repository
- Click "Releases" → "Create a new release"
- Tag: `v1.0.0`
- Title: `v1.0.0 - Initial Release`
- Description: Copy from CHANGELOG.md

### 5.2 Update CHANGELOG.md
Create `CHANGELOG.md`:
```markdown
# Changelog

## [1.0.0] - 2024-01-XX

### Added
- 16 powerful tools for Google Drive management
- Full CRUD operations for files and folders
- Advanced search and filtering capabilities
- Permission management and file sharing
- Shared drives support
- File revision history
- Multi-format export capabilities

### Features
- Advanced file search with Google Drive syntax
- File and folder creation, updating, deletion
- Copy, move, and organize files
- Share files with specific roles
- Work with enterprise shared drives
- Track file changes and versions
```

## 🔐 Step 6: Security & Maintenance

### 6.1 Security
- Enable GitHub Security Advisories
- Set up Dependabot alerts
- Regular dependency updates

### 6.2 Maintenance
- Monitor npm downloads and GitHub stars
- Respond to issues and pull requests
- Regular version updates

## 📊 Step 7: Monitoring

### 7.1 NPM Analytics
- Check package downloads
- Monitor version usage
- Track dependencies

### 7.2 GitHub Insights
- Repository traffic
- Clone statistics
- Issue and PR metrics

## 🎉 Success!

Your MCP Google Drive Server is now:
- ✅ Available on GitHub
- ✅ Published to NPM
- ✅ Ready for community use
- ✅ Professionally documented

## 🆘 Troubleshooting

### Common Issues:
1. **NPM publish fails**: Check if package name is available
2. **Git push fails**: Verify remote origin and permissions
3. **Build errors**: Ensure all dependencies are installed
4. **TypeScript errors**: Run `npm run build` to check for issues

### Support:
- Check GitHub Issues
- Review NPM package page
- Verify Google Service Account setup
