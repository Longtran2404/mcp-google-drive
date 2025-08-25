# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Which versions are eligible for receiving such patches depends on the CVSS v3.0 Rating:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of MCP Google Drive Server seriously. If you believe you have found a security vulnerability, please report it to us as described below.

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to [security@yourdomain.com](mailto:security@yourdomain.com).

You should receive a response within 48 hours. If for some reason you do not, please follow up via email to ensure we received your original message.

Please include the requested information listed below (as much as you can provide) to help us better understand the nature and scope of the possible issue:

- Type of issue (buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the vulnerability
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

This information will help us triage your report more quickly.

## Preferred Languages

We prefer to receive vulnerability reports in English, but we can also handle reports in Vietnamese.

## Policy

MCP Google Drive Server follows the principle of [Responsible Disclosure](https://en.wikipedia.org/wiki/Responsible_disclosure).

## What to expect

When you report a security vulnerability, you can expect:

1. **Acknowledgment**: You will receive an acknowledgment within 48 hours
2. **Assessment**: Our security team will assess the reported vulnerability
3. **Updates**: You will receive regular updates on the progress
4. **Resolution**: Once resolved, you will be notified of the fix
5. **Credit**: If you wish, you will be credited in our security advisories

## Security Best Practices

### For Users

- Keep your Google Service Account credentials secure
- Use environment variables for sensitive information
- Regularly rotate your service account keys
- Monitor your Google Drive API usage
- Review file permissions regularly

### For Developers

- Never commit credentials to version control
- Use environment variables for configuration
- Implement proper error handling
- Validate all user inputs
- Keep dependencies updated

## Security Features

MCP Google Drive Server includes several security features:

- **Service Account Authentication**: Secure API access
- **Scope Limitation**: Minimal required permissions
- **Input Validation**: Zod schema validation
- **Error Handling**: Secure error messages
- **No Data Storage**: No user data is stored locally

## Disclosure Policy

When we receive a security bug report, we will:

1. Confirm the problem and determine affected versions
2. Audit code to find any similar problems
3. Prepare fixes for all supported versions
4. Release a new version with the fix
5. Disclose the vulnerability publicly

## Security Updates

Security updates are released as patch versions (e.g., 1.0.1, 1.0.2) and should be applied as soon as possible.

## Contact

- **Security Email**: [security@yourdomain.com](mailto:security@yourdomain.com)
- **PGP Key**: [security-pgp-key.asc](security-pgp-key.asc)
- **Security Team**: [@security-team](https://github.com/orgs/yourusername/teams/security-team)

## Acknowledgments

We would like to thank all security researchers and users who responsibly disclose vulnerabilities to us. Your contributions help make MCP Google Drive Server more secure for everyone.

## License

This security policy is licensed under the [Creative Commons Attribution 4.0 License](https://creativecommons.org/licenses/by/4.0/).
