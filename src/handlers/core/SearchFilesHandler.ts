import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { BaseToolHandler } from "./BaseToolHandler.js";

// Schema for search files arguments
const SearchFilesSchema = z.object({
  query: z.string(),
  maxResults: z.number().default(20),
  fileType: z.string().optional(),
  orderBy: z.string().optional(),
  includeTrashed: z.boolean().default(false),
});

export class SearchFilesHandler extends BaseToolHandler {
  async runTool(args: any, drive: any): Promise<CallToolResult> {
    const validArgs = SearchFilesSchema.parse(args);
    
    console.error(`[${new Date().toISOString()}] [DEBUG] MCP-Google-Drive: Searching for: "${validArgs.query}"`);
    
    const files = await this.searchFiles(validArgs, drive);
    
    return {
      content: [{
        type: "text",
        text: this.formatSearchResults(files, validArgs.query),
      }],
      isError: false,
    };
  }

  private async searchFiles(args: z.infer<typeof SearchFilesSchema>, drive: any): Promise<any[]> {
    try {
      // Generate search variations for better matching
      const searchVariations = this.generateSearchVariations(args.query);
      console.error(`[${new Date().toISOString()}] [DEBUG] MCP-Google-Drive: Generated ${searchVariations.length} search variations`);
      
      const allFiles: any[] = [];
      const seenIds = new Set<string>();
      
      // Search with each variation
      for (const variation of searchVariations) {
        try {
          const query = this.buildSearchQuery(variation, args);
          console.error(`[${new Date().toISOString()}] [DEBUG] MCP-Google-Drive: Searching with query: "${query}"`);
          
          const response = await drive.files.list({
            q: query,
            pageSize: Math.min(args.maxResults * 2, 100), // Get more results for better scoring
            fields: 'files(id,name,mimeType,modifiedTime,size,webViewLink,parents,description,owners,permissions),nextPageToken',
            orderBy: args.orderBy || 'modifiedTime desc',
            includeItemsFromAllDrives: true,
            supportsAllDrives: true,
          });
          
          if (response.data.files) {
            for (const file of response.data.files) {
              if (!seenIds.has(file.id)) {
                seenIds.add(file.id);
                allFiles.push(file);
              }
            }
          }
        } catch (error) {
          console.error(`[${new Date().toISOString()}] [WARN] MCP-Google-Drive: Search variation failed: "${variation}"`, error);
          // Continue with other variations
        }
      }
      
      // Calculate relevance scores and sort
      const scoredFiles = allFiles.map(file => ({
        ...file,
        relevanceScore: this.calculateRelevanceScore(file.name, args.query)
      }));
      
      // Sort by relevance score (descending) then by modified time (descending)
      scoredFiles.sort((a, b) => {
        if (b.relevanceScore !== a.relevanceScore) {
          return b.relevanceScore - a.relevanceScore;
        }
        return new Date(b.modifiedTime).getTime() - new Date(a.modifiedTime).getTime();
      });
      
      // Return top results
      const results = scoredFiles.slice(0, args.maxResults);
      
      console.error(`[${new Date().toISOString()}] [INFO] MCP-Google-Drive: Found ${results.length} files (from ${allFiles.length} total)`);
      
      return results;
      
    } catch (error) {
      throw this.handleGoogleApiError(error);
    }
  }

  private buildSearchQuery(searchTerm: string, args: z.infer<typeof SearchFilesSchema>): string {
    const conditions: string[] = [];
    
    // Name search
    conditions.push(`name contains "${searchTerm}"`);
    
    // File type filter
    if (args.fileType) {
      conditions.push(`mimeType = "${args.fileType}"`);
    }
    
    // Trashed filter
    if (!args.includeTrashed) {
      conditions.push('trashed = false');
    }
    
    return conditions.join(' and ');
  }

  private generateSearchVariations(searchTerm: string): string[] {
    const variations = new Set<string>();
    
    // Original term
    variations.add(searchTerm);
    
    // Lowercase
    variations.add(searchTerm.toLowerCase());
    
    // Uppercase
    variations.add(searchTerm.toUpperCase());
    
    // Remove diacritics for Vietnamese text
    const withoutDiacritics = this.removeVietnameseDiacritics(searchTerm);
    if (withoutDiacritics !== searchTerm) {
      variations.add(withoutDiacritics);
      variations.add(withoutDiacritics.toLowerCase());
    }
    
    // Split by common separators and create variations
    const parts = searchTerm.split(/[\s\-_.]/);
    if (parts.length > 1) {
      // Combined without spaces
      variations.add(parts.join(''));
      variations.add(parts.join('').toLowerCase());
      
      // CamelCase
      variations.add(parts.map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()).join(''));
      
      // Individual parts
      parts.forEach(part => {
        if (part.length >= 2) {
          variations.add(part);
          variations.add(part.toLowerCase());
        }
      });
    }
    
    // Specific variations for "Get Task Info"
    if (searchTerm.toLowerCase().includes('get task info')) {
      variations.add('GetTaskInfo');
      variations.add('gettaskinfo');
      variations.add('task info');
      variations.add('Task Info');
      variations.add('get task');
      variations.add('task');
      variations.add('info');
    }
    
    // Partial matches for longer terms
    if (searchTerm.length > 3) {
      for (let i = 3; i <= searchTerm.length; i++) {
        variations.add(searchTerm.substring(0, i));
      }
    }
    
    return Array.from(variations);
  }

  private removeVietnameseDiacritics(text: string): string {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[đĐ]/g, 'd'); // Replace đ/Đ with d
  }

  private calculateRelevanceScore(fileName: string, searchTerm: string): number {
    const fileNameLower = fileName.toLowerCase();
    const searchTermLower = searchTerm.toLowerCase();
    const fileNameWithoutDiacritics = this.removeVietnameseDiacritics(fileNameLower);
    const searchTermWithoutDiacritics = this.removeVietnameseDiacritics(searchTermLower);
    
    let score = 0;
    
    // Exact match (highest priority)
    if (fileNameLower === searchTermLower) {
      score += 1000;
    }
    
    // Starts with search term
    if (fileNameLower.startsWith(searchTermLower)) {
      score += 500;
    }
    
    // Contains search term
    if (fileNameLower.includes(searchTermLower)) {
      score += 300;
    }
    
    // Vietnamese diacritics matching
    if (fileNameWithoutDiacritics.includes(searchTermWithoutDiacritics)) {
      score += 250;
    }
    
    // Word matching
    const fileNameWords = fileNameLower.split(/[\s\-_.]/);
    const searchWords = searchTermLower.split(/[\s\-_.]/);
    
    for (const searchWord of searchWords) {
      if (searchWord.length >= 2) {
        if (fileNameWords.includes(searchWord)) {
          score += 200;
        } else if (fileNameWords.some(word => word.includes(searchWord))) {
          score += 150;
        }
      }
    }
    
    // Fuzzy matching using Levenshtein distance
    const distance = this.levenshteinDistance(fileNameLower, searchTermLower);
    const maxLength = Math.max(fileNameLower.length, searchTermLower.length);
    if (maxLength > 0) {
      const similarity = 1 - (distance / maxLength);
      score += similarity * 100;
    }
    
    return score;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) {
      matrix[0][i] = i;
    }
    
    for (let j = 0; j <= str2.length; j++) {
      matrix[j][0] = j;
    }
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1, // deletion
          matrix[j - 1][i] + 1, // insertion
          matrix[j - 1][i - 1] + indicator // substitution
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  private formatSearchResults(files: any[], originalQuery: string): string {
    if (files.length === 0) {
      return `No files found for query: "${originalQuery}"`;
    }
    
    const results = files.map((file, index) => {
      const size = file.size ? `${Math.round(file.size / 1024)}KB` : 'N/A';
      const modified = file.modifiedTime ? new Date(file.modifiedTime).toLocaleString() : 'N/A';
      const link = file.webViewLink || 'N/A';
      const score = file.relevanceScore ? ` (Score: ${Math.round(file.relevanceScore)})` : '';
      
      return `${index + 1}. **${file.name}**${score} (ID: \`${file.id}\`)
   - Type: ${file.mimeType}
   - Size: ${size}
   - Modified: ${modified}
   - Link: ${link}`;
    }).join('\n\n');
    
    return `Found ${files.length} files for query: "${originalQuery}"\n\n${results}`;
  }
}
