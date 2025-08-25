# Google Service Account Setup Guide

## Overview

This guide will help you set up a Google Service Account to use with the MCP Google Drive server.

## Prerequisites

- Google Cloud Platform account
- Google Drive API enabled
- Basic knowledge of Google Cloud Console

## Step-by-Step Setup

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter a project name (e.g., "mcp-google-drive")
4. Click "Create"

### 2. Enable Google Drive API

1. In your project, go to "APIs & Services" → "Library"
2. Search for "Google Drive API"
3. Click on "Google Drive API" → "Enable"

### 3. Create a Service Account

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "Service Account"
3. Fill in the details:
   - **Service account name**: `mcp-google-drive-service`
   - **Service account ID**: Auto-generated
   - **Description**: `Service account for MCP Google Drive integration`
4. Click "Create and Continue"

### 4. Grant Permissions

1. For "Role", select:
   - `Editor` (for full access) OR
   - `Drive File Stream` (for read-only access)
2. Click "Continue"
3. Click "Done"

### 5. Create and Download Key

1. Click on your service account email
2. Go to "Keys" tab
3. Click "Add Key" → "Create new key"
4. Choose "JSON" format
5. Click "Create"
6. The JSON file will download automatically

### 6. Configure Environment Variables

1. Rename the downloaded file to `google-service-account-key.json`
2. Place it in your project root directory
3. Add to your `.env` file:

```bash
GOOGLE_SERVICE_ACCOUNT_KEY=./google-service-account-key.json
```

### 7. Share Google Drive Folders (Optional)

If you want to access specific folders:

1. Right-click on the folder in Google Drive
2. Click "Share"
3. Add your service account email (found in the JSON file)
4. Grant appropriate permissions

## Security Best Practices

### ⚠️ Important Security Notes

- **Never commit** the service account key to version control
- **Never share** the key publicly
- Use environment variables for production
- Consider using Google Cloud Secret Manager for production

### Environment Variable Setup

```bash
# Development
export GOOGLE_SERVICE_ACCOUNT_KEY="./google-service-account-key.json"

# Production (recommended)
export GOOGLE_SERVICE_ACCOUNT_KEY="$(cat /path/to/key.json)"
```

## Troubleshooting

### Common Issues

#### 1. "API not enabled" error

- Ensure Google Drive API is enabled in your project
- Check if billing is enabled (required for some APIs)

#### 2. "Permission denied" error

- Verify the service account has the correct roles
- Check if the folder/file is shared with the service account
- Ensure the service account email is added to sharing permissions

#### 3. "Invalid key file" error

- Verify the JSON file path is correct
- Check if the file contains valid JSON
- Ensure the file has proper read permissions

#### 4. "Quota exceeded" error

- Check your Google Cloud quotas
- Consider upgrading your plan if needed

## API Quotas and Limits

### Free Tier Limits

- 1,000 requests per 100 seconds per user
- 10,000 requests per 100 seconds per project

### Paid Tier

- Higher limits available with billing enabled
- Contact Google Cloud support for quota increases

## Testing Your Setup

### 1. Test Basic Connection

```bash
npm run dev
```

### 2. Test API Calls

Use the MCP client to test basic operations:

- List files
- Search files
- Get file metadata

## Support

If you encounter issues:

1. Check the [Google Drive API documentation](https://developers.google.com/drive/api)
2. Review [Google Cloud Console](https://console.cloud.google.com/) for errors
3. Check the MCP Google Drive server logs
4. Open an issue on the GitHub repository

## Additional Resources

- [Google Cloud Console](https://console.cloud.google.com/)
- [Google Drive API Documentation](https://developers.google.com/drive/api)
- [Service Account Best Practices](https://cloud.google.com/iam/docs/service-accounts)
- [Google Cloud IAM](https://cloud.google.com/iam/docs)
