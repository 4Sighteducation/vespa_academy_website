# VESPA Client Timeline Tool - Deployment Guide

## Overview
This guide explains the different ways to share the VESPA Client Timeline Tool with your clients, along with the pros and cons of each approach.

## Option 1: Direct File Sharing (Simplest)

### How it works:
1. Zip the entire `client-timeline-tool` folder
2. Send to client via email or file transfer
3. Client opens `index.html` or `eact-demo.html` in their browser

### Pros:
- ✅ No hosting required
- ✅ Works offline
- ✅ Client has full control
- ✅ Data stays on client's computer

### Cons:
- ❌ No real-time updates
- ❌ Harder to provide support
- ❌ Client needs to manage files
- ❌ No centralized data backup

### Instructions for clients:
```
1. Download and extract the ZIP file
2. Open the folder
3. Double-click on 'index.html' (or 'eact-demo.html' for E-ACT)
4. Use Chrome, Firefox, or Edge browser (not Internet Explorer)
```

## Option 2: GitHub Pages (Free Hosting)

### How it works:
1. Upload to a GitHub repository
2. Enable GitHub Pages
3. Share the URL with clients

### Setup steps:
1. Create a GitHub account at github.com
2. Create a new repository
3. Upload the client-timeline-tool files
4. Go to Settings > Pages
5. Select source: Deploy from branch (main)
6. Your site will be available at: `https://[username].github.io/[repository-name]/`

### Pros:
- ✅ Free hosting
- ✅ Always accessible online
- ✅ Easy to update
- ✅ Professional URL

### Cons:
- ❌ Data still stored locally in browser
- ❌ Requires GitHub account
- ❌ Public by default (private repos need paid plan)

## Option 3: Web Hosting (Professional)

### How it works:
Host on your existing website or a dedicated subdomain

### Example structure:
```
https://yourdomain.com/tools/timeline/
https://timeline.yourdomain.com/
https://yourdomain.com/clients/eact/timeline/
```

### Pros:
- ✅ Professional appearance
- ✅ Custom branding possible
- ✅ SSL security
- ✅ Access control options

### Cons:
- ❌ Requires web hosting
- ❌ Setup complexity
- ❌ Ongoing maintenance

### Basic upload via FTP:
1. Create a folder on your web server
2. Upload all files maintaining structure
3. Ensure .html, .js, .css files are accessible
4. Test the URL

## Option 4: Client-Specific Instances

### How it works:
Create separate instances for each client with pre-configured data

### Steps:
1. Duplicate the `client-timeline-tool` folder
2. Rename to `client-timeline-[clientname]`
3. Pre-populate with client data
4. Host separately or provide as download

### URL structure example:
```
https://yourdomain.com/timelines/eact/
https://yourdomain.com/timelines/clientB/
https://yourdomain.com/timelines/clientC/
```

### Pros:
- ✅ Customized for each client
- ✅ No setup required by client
- ✅ Can pre-load milestones
- ✅ Better for demos

### Cons:
- ❌ More work to maintain
- ❌ Multiple versions to update
- ❌ Storage space per client

## Option 5: Embed in Client Portal

### How it works:
Embed the tool in existing client portals or intranets

### Implementation:
```html
<!-- Full page embed -->
<iframe src="https://yourdomain.com/timeline/" 
        width="100%" 
        height="800px" 
        frameborder="0">
</iframe>

<!-- Or direct integration -->
<div id="timeline-container">
    <!-- Include the tool files -->
    <link rel="stylesheet" href="path/to/styles.css">
    <script src="path/to/timeline.js"></script>
</div>
```

### Pros:
- ✅ Integrated experience
- ✅ Single sign-on possible
- ✅ Consistent branding
- ✅ Access control

### Cons:
- ❌ Technical complexity
- ❌ Potential conflicts
- ❌ Requires developer

## Security Considerations

### Data Storage:
- All data is stored in browser's localStorage
- No server-side storage by default
- Data persists on user's device
- Can be cleared by clearing browser data

### Recommendations:
1. **For sensitive data**: Host on secure server with authentication
2. **For public data**: GitHub Pages or simple hosting is fine
3. **For demos**: Use pre-populated, non-sensitive data

## Quick Start URLs

### For demonstrations:
1. **Generic version**: Share `index.html`
   - Clean slate for any client
   - They create their own timeline

2. **E-ACT Demo**: Share `eact-demo.html`
   - Pre-loaded with E-ACT data
   - Shows full functionality

### URL Parameters:
You can share direct links to specific clients:
```
https://yourdomain.com/timeline/?client=client-eact-2025
https://yourdomain.com/timeline/?client=client-12345
```

## Support Documentation

### What to provide clients:

1. **Quick Start Guide**:
   ```
   VESPA Timeline Tool - Quick Start
   
   1. Open the tool in your browser
   2. Click "Create Client" if first time
   3. Add milestones with the "Add Milestone" button
   4. Track progress by clicking milestones
   5. Export reports with PDF/CSV buttons
   ```

2. **Video Tutorial** (recommended):
   - Record 5-minute walkthrough
   - Show creating client
   - Adding milestones
   - Tracking progress
   - Exporting data

3. **FAQ Document**:
   - How to backup data
   - Supported browsers
   - Troubleshooting tips
   - Contact for support

## Recommended Approach

### For most use cases:
1. **Initial Demo**: Use GitHub Pages for easy sharing
2. **Client Adoption**: Provide download for local use
3. **Long-term**: Consider professional hosting

### Setup checklist:
- [ ] Choose deployment method
- [ ] Prepare client documentation
- [ ] Test in multiple browsers
- [ ] Create backup instructions
- [ ] Set up support channel

## Technical Requirements

### Client browser requirements:
- Chrome 60+ (recommended)
- Firefox 55+
- Safari 11+
- Edge 79+
- NOT Internet Explorer

### Features by deployment:
| Feature | Local Files | GitHub Pages | Web Hosting |
|---------|------------|--------------|-------------|
| Offline use | ✅ | ❌ | ❌ |
| Auto-updates | ❌ | ✅ | ✅ |
| Custom domain | ❌ | Limited | ✅ |
| Access control | ❌ | ❌ | ✅ |
| SSL/HTTPS | ❌ | ✅ | ✅ |

## Maintenance Tips

1. **Version Control**: Keep track of which version each client has
2. **Update Notifications**: Email clients about new features
3. **Backup Reminders**: Remind clients to export their data regularly
4. **Support Log**: Track common issues and solutions

## Contact for Technical Support

If you need help with deployment:
- Review this guide first
- Check browser console for errors
- Contact: [your support email] 