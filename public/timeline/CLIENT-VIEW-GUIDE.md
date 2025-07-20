# Client View Guide

## Overview

The VESPA Timeline app now has two views:
1. **Admin View** (`index.html`) - Full access for creating/editing projects
2. **Client View** (`client.html`) - Read-only view for clients

## How It Works

### Admin View (index.html)
- Full access to all features
- Can create new clients/projects
- Can add/edit/delete milestones
- Can manage schools
- Access via: `https://yourdomain.com/index.html`

### Client View (client.html)
- Read-only access
- Shows only the specified client's project
- Can export PDF/CSV
- Cannot add milestones or edit anything
- Access via: `https://yourdomain.com/client.html?client=CLIENT_ID`

## Sharing with Clients

### 1. Get the Client ID
- Open the admin view
- Look at the URL when viewing a client
- Copy the client ID (e.g., `client-eact-2025`)

### 2. Create Client URL
Format: `https://yourdomain.com/client.html?client=CLIENT_ID`

Example for E-ACT:
```
https://yourdomain.com/client.html?client=client-1752835894451
```

Note: The client ID might be different in your system. Check the URL in admin view to get the correct ID.

### 3. What Clients Can Do
- ✅ View timeline, Gantt, list, and matrix views
- ✅ Filter by schools (if applicable)
- ✅ Export to PDF or CSV
- ✅ See progress statistics

### 4. What Clients Cannot Do
- ❌ Add new milestones
- ❌ Edit existing milestones
- ❌ Delete milestones
- ❌ Manage schools
- ❌ Create new projects
- ❌ Switch between clients

## Security Notes

1. **URL-based Access**: Clients need the exact URL with their client ID
2. **No Authentication**: Currently no password protection (can be added later)
3. **Read-only**: All editing features are disabled in client view

## Testing Locally

1. Admin view:
   ```
   http://localhost:8000/index.html
   ```

2. Client view (E-ACT example):
   ```
   http://localhost:8000/client.html?client=client-eact-2025
   ```

## Deployment Considerations

When deploying to production:
1. Share only the client.html URL with clients
2. Keep the index.html URL private for admin use
3. Consider adding authentication if needed
4. You might want to use custom domains:
   - `admin.yourdomain.com` → index.html
   - `client.yourdomain.com` → client.html 