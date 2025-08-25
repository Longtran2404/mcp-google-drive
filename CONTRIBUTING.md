# Contributing to MCP Google Drive Server

Thank you for your interest in contributing to the MCP Google Drive Server! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### 1. Fork and Clone

- Fork the repository on GitHub
- Clone your fork locally
- Add the upstream remote: `git remote add upstream https://github.com/original-owner/mcp-google-drive-server.git`

### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-fix-name
```

### 3. Make Changes

- Follow the coding standards below
- Add tests for new functionality
- Update documentation as needed
- Ensure all tests pass

### 4. Commit and Push

```bash
git add .
git commit -m "feat: add new feature description"
git push origin feature/your-feature-name
```

### 5. Create a Pull Request

- Go to your fork on GitHub
- Click "New Pull Request"
- Select the appropriate base branch
- Fill out the PR template
- Submit and wait for review

## 📝 Coding Standards

### TypeScript

- Use TypeScript strict mode
- Prefer `const` over `let`
- Use meaningful variable names
- Add JSDoc comments for public APIs

### Code Style

- Follow Prettier formatting
- Use ESLint rules
- Keep functions small and focused
- Use descriptive function names

### Error Handling

- Always handle errors gracefully
- Provide meaningful error messages
- Log errors appropriately
- Use try-catch blocks where needed

## 🧪 Testing

### Running Tests

```bash
npm test
npm run test:watch
npm run test:coverage
```

### Writing Tests

- Test all public functions
- Include edge cases
- Mock external dependencies
- Use descriptive test names

## 📚 Documentation

### Code Comments

- Comment complex logic
- Explain business rules
- Document API parameters
- Keep comments up-to-date

### README Updates

- Update installation instructions
- Add usage examples
- Document new features
- Keep configuration examples current

## 🔧 Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Google Service Account credentials

### Local Development

```bash
npm install
npm run dev
npm run build
npm run lint
npm run format
```

## 🚀 Release Process

### Versioning

- Follow [Semantic Versioning](https://semver.org/)
- Update CHANGELOG.md
- Tag releases appropriately

### Publishing

```bash
npm version patch|minor|major
npm publish
```

## 🐛 Bug Reports

### Before Reporting

- Check existing issues
- Search documentation
- Try latest version
- Reproduce the issue

### Bug Report Template

```markdown
**Description**: Brief description of the issue

**Steps to Reproduce**:

1. Step 1
2. Step 2
3. Step 3

**Expected Behavior**: What should happen

**Actual Behavior**: What actually happens

**Environment**:

- OS: [e.g., Windows 10]
- Node.js: [e.g., 18.0.0]
- Package Version: [e.g., 1.0.0]

**Additional Context**: Any other relevant information
```

## 💡 Feature Requests

### Before Requesting

- Check if feature already exists
- Search existing discussions
- Consider use cases
- Think about implementation

### Feature Request Template

```markdown
**Problem**: Description of the problem

**Solution**: Proposed solution

**Alternatives**: Alternative solutions considered

**Additional Context**: Any other relevant information
```

## 📞 Getting Help

- **Issues**: [GitHub Issues](https://github.com/yourusername/mcp-google-drive-server/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/mcp-google-drive-server/discussions)
- **Documentation**: [README.md](README.md)

## 🙏 Recognition

Contributors will be recognized in:

- CHANGELOG.md
- README.md contributors section
- GitHub contributors page
- Release notes

Thank you for contributing to the MCP Google Drive Server! 🚀
