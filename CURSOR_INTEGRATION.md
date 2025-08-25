# Cursor MCP Integration Guide

Hướng dẫn chi tiết để tích hợp MCP Google Drive với Cursor và khắc phục các sự cố thường gặp.

## 🚀 **Tích hợp tự động với Cursor**

### **Bước 1: Cấu hình MCP trong Cursor**

Thêm cấu hình sau vào file `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "mcp-google-drive": {
      "command": "npx",
      "args": ["mcp-google-drive@1.3.2"],
      "env": {
        "GOOGLE_SERVICE_ACCOUNT_KEY": "your-service-account-json-here",
        "MCP_MODE": "stdio",
        "LOG_LEVEL": "info",
        "DISABLE_CONSOLE_OUTPUT": "false"
      },
      "cwd": "D:\\Web\\DV VLU\\vercel-n8n-frontend\\mcp-google-drive"
    }
  }
}
```

### **Bước 2: Khởi động lại Cursor**

1. **Đóng Cursor hoàn toàn**
2. **Mở lại Cursor**
3. **Kiểm tra MCP servers** trong Command Palette

### **Bước 3: Xác minh tích hợp**

1. **Mở Command Palette** (Ctrl+Shift+P)
2. **Gõ "MCP"** và chọn "MCP: Show Servers"
3. **Kiểm tra trạng thái** của `mcp-google-drive`

## 🔧 **Khắc phục sự cố**

### **Vấn đề 1: MCP tools không hoạt động**

**Triệu chứng:**

- MCP Google Drive hiển thị "15 tools enabled" nhưng tools không thể gọi được
- Lỗi "Error: no result from tool" khi sử dụng MCP tools

**Giải pháp:**

1. **Kiểm tra MCP status**:
   - Command Palette → "MCP: Show Servers"
   - Kiểm tra trạng thái của `mcp-google-drive`

2. **Test MCP connection**:
   - Command Palette → "MCP: Test Connection"
   - Xem có lỗi gì không

3. **Restart MCP server**:
   - Command Palette → "MCP: Restart Server"
   - Chọn `mcp-google-drive`

### **Vấn đề 2: MCP server không tự động khởi động**

**Triệu chứng:**

- Phải chạy lệnh `npm start` thủ công mỗi lần
- MCP server không hoạt động khi Cursor khởi động

**Giải pháp:**

1. **Kiểm tra cấu hình `mcp.json`**:
   - Đảm bảo `command` và `args` đúng
   - Kiểm tra `cwd` path có chính xác không

2. **Cập nhật cấu hình**:

   ```json
   {
     "mcpServers": {
       "mcp-google-drive": {
         "command": "npx",
         "args": ["mcp-google-drive@1.3.2"],
         "env": {
           "GOOGLE_SERVICE_ACCOUNT_KEY": "your-credentials",
           "MCP_MODE": "stdio",
           "LOG_LEVEL": "info",
           "DISABLE_CONSOLE_OUTPUT": "false"
         },
         "cwd": "D:\\Web\\DV VLU\\vercel-n8n-frontend\\mcp-google-drive"
       }
     }
   }
   ```

3. **Restart Cursor** sau khi cập nhật

### **Vấn đề 3: Lỗi Google Service Account**

**Triệu chứng:**

- Lỗi "Authentication failed"
- "Service account not found"

**Giải pháp:**

1. **Kiểm tra credentials**:
   - Đảm bảo `GOOGLE_SERVICE_ACCOUNT_KEY` đúng format
   - Kiểm tra service account có quyền truy cập Google Drive không

2. **Test credentials**:

   ```bash
   cd mcp-google-drive
   npm run start
   ```

3. **Kiểm tra Google Drive API**:
   - Đảm bảo Google Drive API đã được enable
   - Kiểm tra service account có quyền đúng không

### **Vấn đề 4: MCP server crash hoặc không ổn định**

**Triệu chứng:**

- MCP server tự động tắt
- Lỗi "Connection lost"

**Giải pháp:**

1. **Kiểm tra logs**:
   - Mở Developer Tools (F12)
   - Xem Console tab có lỗi gì không

2. **Cập nhật package**:

   ```bash
   npm update mcp-google-drive
   ```

3. **Kiểm tra Node.js version**:
   ```bash
   node --version
   # Phải >= 18.0.0
   ```

## 📋 **Kiểm tra trạng thái**

### **Command Palette Commands**

1. **"MCP: Show Servers"** - Hiển thị tất cả MCP servers
2. **"MCP: Test Connection"** - Test kết nối MCP
3. **"MCP: Restart Server"** - Khởi động lại MCP server
4. **"MCP: Show Logs"** - Hiển thị logs của MCP

### **Kiểm tra trạng thái MCP**

- **🟢 Active**: MCP server đang hoạt động
- **🔴 Inactive**: MCP server không hoạt động
- **🟡 Connecting**: Đang kết nối
- **⚪ Unknown**: Trạng thái không xác định

## 🛠️ **Giải pháp thay thế**

### **Khởi động thủ công**

Nếu tích hợp tự động không hoạt động:

1. **Mở terminal trong Cursor**
2. **Chạy lệnh**:
   ```bash
   cd mcp-google-drive
   npm run start
   ```
3. **Giữ terminal mở** để MCP server hoạt động

### **Sử dụng global package**

```bash
npm install -g mcp-google-drive
mcp-google-drive
```

## 📞 **Hỗ trợ**

Nếu vẫn gặp vấn đề:

1. **Kiểm tra logs** trong Developer Tools
2. **Tạo issue** trên GitHub với thông tin chi tiết
3. **Kiểm tra** [README](./README.md) và [Setup Guide](./GOOGLE_SERVICE_ACCOUNT_SETUP.md)

## 🔄 **Cập nhật cấu hình**

Sau khi cập nhật cấu hình:

1. **Lưu file** `mcp.json`
2. **Restart Cursor** hoàn toàn
3. **Kiểm tra MCP status** trong Command Palette
4. **Test MCP tools** để đảm bảo hoạt động

---

**Lưu ý**: MCP Google Drive được thiết kế để hoạt động tự động với Cursor. Nếu gặp vấn đề, hãy làm theo hướng dẫn khắc phục sự cố ở trên.
