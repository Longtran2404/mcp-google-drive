import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { google } from 'googleapis';
import { z } from 'zod';

// Google Drive API setup
const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY, // eslint-disable-line no-undef
  scopes: [
    'https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/drive.metadata.readonly',
    'https://www.googleapis.com/auth/drive.file',
  ],
});

const drive = google.drive({ version: 'v3', auth });

// Tool schemas
const SearchFilesSchema = z.object({
  query: z.string().describe('Search query for files in Google Drive'),
  maxResults: z.number().optional().default(20).describe('Maximum number of results to return'),
  fileType: z
    .string()
    .optional()
    .describe("Filter by file type (e.g., 'application/vnd.google-apps.spreadsheet')"),
  orderBy: z.string().optional().describe("Order by field (e.g., 'name', 'modifiedTime', 'size')"),
  includeTrashed: z.boolean().optional().default(false).describe('Include trashed files'),
});

const GetFileSchema = z.object({
  fileId: z.string().describe('ID of the file to retrieve'),
  includeContent: z.boolean().optional().default(false).describe('Whether to include file content'),
  includePermissions: z.boolean().optional().default(false).describe('Include file permissions'),
});

const ListFilesSchema = z.object({
  pageSize: z.number().optional().default(20).describe('Number of files to return'),
  pageToken: z.string().optional().describe('Token for pagination'),
  orderBy: z.string().optional().describe("Order by field (e.g., 'name', 'modifiedTime', 'size')"),
  q: z.string().optional().describe('Query string to filter files'),
  driveId: z.string().optional().describe('ID of the shared drive'),
  includeItemsFromAllDrives: z
    .boolean()
    .optional()
    .default(false)
    .describe('Include items from all drives'),
});

const GetFileContentSchema = z.object({
  fileId: z.string().describe('ID of the file to get content from'),
  mimeType: z
    .string()
    .optional()
    .describe("MIME type for export (e.g., 'text/plain', 'application/pdf')"),
  encoding: z.string().optional().describe("Encoding for text files (e.g., 'utf-8', 'latin1')"),
});

const CreateFileSchema = z.object({
  name: z.string().describe('Name of the file to create'),
  mimeType: z.string().describe('MIME type of the file'),
  content: z.string().describe('Content of the file'),
  parentId: z.string().optional().describe('ID of the parent folder'),
  description: z.string().optional().describe('Description of the file'),
});

const UpdateFileSchema = z.object({
  fileId: z.string().describe('ID of the file to update'),
  name: z.string().optional().describe('New name for the file'),
  description: z.string().optional().describe('New description for the file'),
  content: z.string().optional().describe('New content for the file'),
});

const DeleteFileSchema = z.object({
  fileId: z.string().describe('ID of the file to delete'),
  permanent: z.boolean().optional().default(false).describe('Permanently delete the file'),
});

const CopyFileSchema = z.object({
  fileId: z.string().describe('ID of the file to copy'),
  name: z.string().optional().describe('Name for the copied file'),
  parentId: z.string().optional().describe('ID of the destination folder'),
});

const MoveFileSchema = z.object({
  fileId: z.string().describe('ID of the file to move'),
  parentId: z.string().describe('ID of the destination folder'),
  removeFromParents: z.boolean().optional().default(true).describe('Remove from current parent'),
});

const CreateFolderSchema = z.object({
  name: z.string().describe('Name of the folder to create'),
  parentId: z.string().optional().describe('ID of the parent folder'),
  description: z.string().optional().describe('Description of the folder'),
});

const GetFilePermissionsSchema = z.object({
  fileId: z.string().describe('ID of the file to get permissions for'),
});

const ShareFileSchema = z.object({
  fileId: z.string().describe('ID of the file to share'),
  email: z.string().describe('Email address to share with'),
  role: z.enum(['reader', 'writer', 'commenter', 'owner']).describe('Role for the user'),
  message: z.string().optional().describe('Message to include in sharing email'),
});

const GetDriveInfoSchema = z.object({
  driveId: z.string().optional().describe("ID of the drive (defaults to 'root')"),
});

const ListSharedDrivesSchema = z.object({
  pageSize: z.number().optional().default(20).describe('Number of drives to return'),
  pageToken: z.string().optional().describe('Token for pagination'),
});

const GetFileRevisionsSchema = z.object({
  fileId: z.string().describe('ID of the file to get revisions for'),
  maxResults: z.number().optional().default(10).describe('Maximum number of revisions to return'),
});

// Tools
const tools: Tool[] = [
  {
    name: 'search_files',
    description: "Search for files in Google Drive using Google's search syntax",
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query for files in Google Drive' },
        maxResults: {
          type: 'number',
          description: 'Maximum number of results to return',
          default: 20,
        },
        fileType: {
          type: 'string',
          description: "Filter by file type (e.g., 'application/vnd.google-apps.spreadsheet')",
        },
        orderBy: {
          type: 'string',
          description: "Order by field (e.g., 'name', 'modifiedTime', 'size')",
        },
        includeTrashed: { type: 'boolean', description: 'Include trashed files', default: false },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_file',
    description: 'Get file metadata and optionally content',
    inputSchema: {
      type: 'object',
      properties: {
        fileId: { type: 'string', description: 'ID of the file to retrieve' },
        includeContent: {
          type: 'boolean',
          description: 'Whether to include file content',
          default: false,
        },
        includePermissions: {
          type: 'boolean',
          description: 'Include file permissions',
          default: false,
        },
      },
      required: ['fileId'],
    },
  },
  {
    name: 'list_files',
    description: 'List files in Google Drive with optional filtering',
    inputSchema: {
      type: 'object',
      properties: {
        pageSize: { type: 'number', description: 'Number of files to return', default: 20 },
        pageToken: { type: 'string', description: 'Token for pagination' },
        orderBy: {
          type: 'string',
          description: "Order by field (e.g., 'name', 'modifiedTime', 'size')",
        },
        q: { type: 'string', description: 'Query string to filter files' },
        driveId: { type: 'string', description: 'ID of the shared drive' },
        includeItemsFromAllDrives: {
          type: 'boolean',
          description: 'Include items from all drives',
          default: false,
        },
      },
    },
  },
  {
    name: 'get_file_content',
    description: 'Get file content in various formats',
    inputSchema: {
      type: 'object',
      properties: {
        fileId: { type: 'string', description: 'ID of the file to get content from' },
        mimeType: {
          type: 'string',
          description: "MIME type for export (e.g., 'text/plain', 'application/pdf')",
        },
        encoding: {
          type: 'string',
          description: "Encoding for text files (e.g., 'utf-8', 'latin1')",
        },
      },
      required: ['fileId'],
    },
  },
  {
    name: 'create_file',
    description: 'Create a new file in Google Drive',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Name of the file to create' },
        mimeType: { type: 'string', description: 'MIME type of the file' },
        content: { type: 'string', description: 'Content of the file' },
        parentId: { type: 'string', description: 'ID of the parent folder' },
        description: { type: 'string', description: 'Description of the file' },
      },
      required: ['name', 'mimeType', 'content'],
    },
  },
  {
    name: 'update_file',
    description: 'Update an existing file in Google Drive',
    inputSchema: {
      type: 'object',
      properties: {
        fileId: { type: 'string', description: 'ID of the file to update' },
        name: { type: 'string', description: 'New name for the file' },
        description: { type: 'string', description: 'New description for the file' },
        content: { type: 'string', description: 'New content for the file' },
      },
      required: ['fileId'],
    },
  },
  {
    name: 'delete_file',
    description: 'Delete a file from Google Drive',
    inputSchema: {
      type: 'object',
      properties: {
        fileId: { type: 'string', description: 'ID of the file to delete' },
        permanent: { type: 'boolean', description: 'Permanently delete the file', default: false },
      },
      required: ['fileId'],
    },
  },
  {
    name: 'copy_file',
    description: 'Copy a file to a new location',
    inputSchema: {
      type: 'object',
      properties: {
        fileId: { type: 'string', description: 'ID of the file to copy' },
        name: { type: 'string', description: 'Name for the copied file' },
        parentId: { type: 'string', description: 'ID of the destination folder' },
      },
      required: ['fileId'],
    },
  },
  {
    name: 'move_file',
    description: 'Move a file to a new location',
    inputSchema: {
      type: 'object',
      properties: {
        fileId: { type: 'string', description: 'ID of the file to move' },
        parentId: { type: 'string', description: 'ID of the destination folder' },
        removeFromParents: {
          type: 'boolean',
          description: 'Remove from current parent',
          default: true,
        },
      },
      required: ['fileId', 'parentId'],
    },
  },
  {
    name: 'create_folder',
    description: 'Create a new folder in Google Drive',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Name of the folder to create' },
        parentId: { type: 'string', description: 'ID of the parent folder' },
        description: { type: 'string', description: 'Description of the folder' },
      },
      required: ['name'],
    },
  },
  {
    name: 'get_file_permissions',
    description: 'Get permissions for a file',
    inputSchema: {
      type: 'object',
      properties: {
        fileId: { type: 'string', description: 'ID of the file to get permissions for' },
      },
      required: ['fileId'],
    },
  },
  {
    name: 'share_file',
    description: 'Share a file with another user',
    inputSchema: {
      type: 'object',
      properties: {
        fileId: { type: 'string', description: 'ID of the file to share' },
        email: { type: 'string', description: 'Email address to share with' },
        role: {
          type: 'string',
          enum: ['reader', 'writer', 'commenter', 'owner'],
          description: 'Role for the user',
        },
        message: { type: 'string', description: 'Message to include in sharing email' },
      },
      required: ['fileId', 'email', 'role'],
    },
  },
  {
    name: 'get_drive_info',
    description: 'Get information about a drive',
    inputSchema: {
      type: 'object',
      properties: {
        driveId: { type: 'string', description: "ID of the drive (defaults to 'root')" },
      },
    },
  },
  {
    name: 'list_shared_drives',
    description: 'List all shared drives',
    inputSchema: {
      type: 'object',
      properties: {
        pageSize: { type: 'number', description: 'Number of drives to return', default: 20 },
        pageToken: { type: 'string', description: 'Token for pagination' },
      },
    },
  },
  {
    name: 'get_file_revisions',
    description: 'Get revision history of a file',
    inputSchema: {
      type: 'object',
      properties: {
        fileId: { type: 'string', description: 'ID of the file to get revisions for' },
        maxResults: {
          type: 'number',
          description: 'Maximum number of revisions to return',
          default: 10,
        },
      },
      required: ['fileId'],
    },
  },
];

// Tool implementations
async function searchFiles(args: z.infer<typeof SearchFilesSchema>) {
  try {
    let query = args.query;
    if (!args.includeTrashed) {
      query += ' and trashed = false';
    }

    const response = await drive.files.list({
      q: query,
      pageSize: args.maxResults,
      fields:
        'files(id,name,mimeType,modifiedTime,size,webViewLink,parents,description,owners,permissions)',
      orderBy: args.orderBy || 'modifiedTime desc',
      includeItemsFromAllDrives: true,
      supportsAllDrives: true,
    });

    return {
      files: response.data.files || [],
      nextPageToken: response.data.nextPageToken,
      totalResults: response.data.files?.length || 0,
    };
  } catch (error) {
    throw new Error(`Failed to search files: ${error}`);
  }
}

async function getFile(args: z.infer<typeof GetFileSchema>) {
  try {
    let fields =
      'id,name,mimeType,modifiedTime,size,webViewLink,parents,description,owners,createdTime,lastModifyingUser';
    if (args.includePermissions) {
      fields += ',permissions';
    }

    const response = await drive.files.get({
      fileId: args.fileId,
      fields,
      supportsAllDrives: true,
    });

    let content = null;
    if (args.includeContent && response.data.mimeType?.includes('text')) {
      try {
        const contentResponse = await drive.files.get({
          fileId: args.fileId,
          alt: 'media',
          supportsAllDrives: true,
        });
        content = contentResponse.data;
      } catch (contentError) {
        console.error('Failed to get file content:', contentError); // eslint-disable-line no-undef
      }
    }

    return {
      file: response.data,
      content,
    };
  } catch (error) {
    throw new Error(`Failed to get file: ${error}`);
  }
}

async function listFiles(args: z.infer<typeof ListFilesSchema>) {
  try {
    const response = await drive.files.list({
      pageSize: args.pageSize,
      pageToken: args.pageToken,
      orderBy: args.orderBy || 'modifiedTime desc',
      q: args.q,
      fields:
        'files(id,name,mimeType,modifiedTime,size,webViewLink,parents,description,owners),nextPageToken',
      driveId: args.driveId,
      includeItemsFromAllDrives: args.includeItemsFromAllDrives,
      supportsAllDrives: true,
    });

    return {
      files: response.data.files || [],
      nextPageToken: response.data.nextPageToken,
      totalResults: response.data.files?.length || 0,
    };
  } catch (error) {
    throw new Error(`Failed to list files: ${error}`);
  }
}

async function getFileContent(args: z.infer<typeof GetFileContentSchema>) {
  try {
    let content;

    if (args.mimeType) {
      // Export file to specific format
      const response = await drive.files.export({
        fileId: args.fileId,
        mimeType: args.mimeType,
      });
      content = response.data;
    } else {
      // Get raw content
      const response = await drive.files.get({
        fileId: args.fileId,
        alt: 'media',
        supportsAllDrives: true,
      });
      content = response.data;
    }

    return {
      content,
      mimeType: args.mimeType || 'raw',
      encoding: args.encoding || 'utf-8',
    };
  } catch (error) {
    throw new Error(`Failed to get file content: ${error}`);
  }
}

async function createFile(args: z.infer<typeof CreateFileSchema>) {
  try {
    const fileMetadata = {
      name: args.name,
      description: args.description,
      parents: args.parentId ? [args.parentId] : undefined,
    };

    const media = {
      mimeType: args.mimeType,
      body: Buffer.from(args.content, 'utf-8'), // eslint-disable-line no-undef
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media,
      fields: 'id,name,mimeType,webViewLink,size',
      supportsAllDrives: true,
    });

    return {
      file: response.data,
      message: 'File created successfully',
    };
  } catch (error) {
    throw new Error(`Failed to create file: ${error}`);
  }
}

async function updateFile(args: z.infer<typeof UpdateFileSchema>) {
  try {
    const fileMetadata: Record<string, string> = {};
    if (args.name) fileMetadata.name = args.name;
    if (args.description) fileMetadata.description = args.description;

    let media;
    if (args.content) {
      media = {
        body: Buffer.from(args.content, 'utf-8'), // eslint-disable-line no-undef
      };
    }

    const response = await drive.files.update({
      fileId: args.fileId,
      requestBody: fileMetadata,
      media,
      fields: 'id,name,mimeType,webViewLink,size,modifiedTime',
      supportsAllDrives: true,
    });

    return {
      file: response.data,
      message: 'File updated successfully',
    };
  } catch (error) {
    throw new Error(`Failed to update file: ${error}`);
  }
}

async function deleteFile(args: z.infer<typeof DeleteFileSchema>) {
  try {
    if (args.permanent) {
      await drive.files.delete({
        fileId: args.fileId,
        supportsAllDrives: true,
      });
    } else {
      await drive.files.update({
        fileId: args.fileId,
        requestBody: { trashed: true },
        supportsAllDrives: true,
      });
    }

    return {
      message: args.permanent ? 'File permanently deleted' : 'File moved to trash',
      fileId: args.fileId,
    };
  } catch (error) {
    throw new Error(`Failed to delete file: ${error}`);
  }
}

async function copyFile(args: z.infer<typeof CopyFileSchema>) {
  try {
    const copyMetadata: Record<string, string | string[]> = {};
    if (args.name) copyMetadata.name = args.name;
    if (args.parentId) copyMetadata.parents = [args.parentId];

    const response = await drive.files.copy({
      fileId: args.fileId,
      requestBody: copyMetadata,
      fields: 'id,name,mimeType,webViewLink,size',
      supportsAllDrives: true,
    });

    return {
      file: response.data,
      message: 'File copied successfully',
    };
  } catch (error) {
    throw new Error(`Failed to copy file: ${error}`);
  }
}

async function moveFile(args: z.infer<typeof MoveFileSchema>) {
  try {
    // First, get current parents
    const currentFile = await drive.files.get({
      fileId: args.fileId,
      fields: 'parents',
      supportsAllDrives: true,
    });

    const currentParents = currentFile.data.parents || [];
    let newParents = [...currentParents];

    // Add new parent
    if (!newParents.includes(args.parentId)) {
      newParents.push(args.parentId);
    }

    // Remove from current parent if requested
    if (args.removeFromParents && currentParents.length > 0) {
      newParents = newParents.filter(id => id !== 'root');
    }

    const response = await drive.files.update({
      fileId: args.fileId,
      requestBody: {
        parents: newParents,
      },
      fields: 'id,name,parents,webViewLink',
      supportsAllDrives: true,
    });

    return {
      file: response.data,
      message: 'File moved successfully',
    };
  } catch (error) {
    throw new Error(`Failed to move file: ${error}`);
  }
}

async function createFolder(args: z.infer<typeof CreateFolderSchema>) {
  try {
    const folderMetadata = {
      name: args.name,
      description: args.description,
      mimeType: 'application/vnd.google-apps.folder',
      parents: args.parentId ? [args.parentId] : undefined,
    };

    const response = await drive.files.create({
      requestBody: folderMetadata,
      fields: 'id,name,mimeType,webViewLink',
      supportsAllDrives: true,
    });

    return {
      folder: response.data,
      message: 'Folder created successfully',
    };
  } catch (error) {
    throw new Error(`Failed to create folder: ${error}`);
  }
}

async function getFilePermissions(args: z.infer<typeof GetFilePermissionsSchema>) {
  try {
    const response = await drive.permissions.list({
      fileId: args.fileId,
      fields: 'permissions(id,emailAddress,role,displayName,type,deleted)',
      supportsAllDrives: true,
    });

    return {
      permissions: response.data.permissions || [],
      totalResults: response.data.permissions?.length || 0,
    };
  } catch (error) {
    throw new Error(`Failed to get file permissions: ${error}`);
  }
}

async function shareFile(args: z.infer<typeof ShareFileSchema>) {
  try {
    const permission = {
      type: 'user',
      role: args.role,
      emailAddress: args.email,
    };

    const response = await drive.permissions.create({
      fileId: args.fileId,
      requestBody: permission,
      emailMessage: args.message,
      fields: 'id,emailAddress,role',
      supportsAllDrives: true,
    });

    return {
      permission: response.data,
      message: 'File shared successfully',
    };
  } catch (error) {
    throw new Error(`Failed to share file: ${error}`);
  }
}

async function getDriveInfo(args: z.infer<typeof GetDriveInfoSchema>) {
  try {
    const driveId = args.driveId || 'root';
    const response = await drive.drives.get({
      driveId,
      fields: 'id,name,capabilities,restrictions,createdTime',
    });

    return {
      drive: response.data,
    };
  } catch (error) {
    throw new Error(`Failed to get drive info: ${error}`);
  }
}

async function listSharedDrives(args: z.infer<typeof ListSharedDrivesSchema>) {
  try {
    const response = await drive.drives.list({
      pageSize: args.pageSize,
      pageToken: args.pageToken,
      fields: 'drives(id,name,capabilities,restrictions,createdTime),nextPageToken',
    });

    return {
      drives: response.data.drives || [],
      nextPageToken: response.data.nextPageToken,
      totalResults: response.data.drives?.length || 0,
    };
  } catch (error) {
    throw new Error(`Failed to list shared drives: ${error}`);
  }
}

async function getFileRevisions(args: z.infer<typeof GetFileRevisionsSchema>) {
  try {
    const response = await drive.revisions.list({
      fileId: args.fileId,
      fields:
        'revisions(id,mimeType,modifiedTime,size,originalFilename,keepForever,published,publishedOutsideDomain)',
      pageSize: args.maxResults,
    });

    return {
      revisions: response.data.revisions || [],
      totalResults: response.data.revisions?.length || 0,
    };
  } catch (error) {
    throw new Error(`Failed to get file revisions: ${error}`);
  }
}

// MCP Server setup
const server = new Server({
  name: 'mcp-google-drive-server',
  version: '1.0.0',
  capabilities: {
    tools: {},
  },
});

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools,
}));

server.setRequestHandler(CallToolRequestSchema, async request => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'search_files':
        return await searchFiles(SearchFilesSchema.parse(args));
      case 'get_file':
        return await getFile(GetFileSchema.parse(args));
      case 'list_files':
        return await listFiles(ListFilesSchema.parse(args));
      case 'get_file_content':
        return await getFileContent(GetFileContentSchema.parse(args));
      case 'create_file':
        return await createFile(CreateFileSchema.parse(args));
      case 'update_file':
        return await updateFile(UpdateFileSchema.parse(args));
      case 'delete_file':
        return await deleteFile(DeleteFileSchema.parse(args));
      case 'copy_file':
        return await copyFile(CopyFileSchema.parse(args));
      case 'move_file':
        return await moveFile(MoveFileSchema.parse(args));
      case 'create_folder':
        return await createFolder(CreateFolderSchema.parse(args));
      case 'get_file_permissions':
        return await getFilePermissions(GetFilePermissionsSchema.parse(args));
      case 'share_file':
        return await shareFile(ShareFileSchema.parse(args));
      case 'get_drive_info':
        return await getDriveInfo(GetDriveInfoSchema.parse(args));
      case 'list_shared_drives':
        return await listSharedDrives(ListSharedDrivesSchema.parse(args));
      case 'get_file_revisions':
        return await getFileRevisions(GetFileRevisionsSchema.parse(args));
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    throw new Error(`Tool execution failed: ${error}`);
  }
});

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);

console.error('MCP Google Drive server started with enhanced features'); // eslint-disable-line no-undef
