# VESPA Client Timeline Tool

A professional, visual project timeline management tool designed for tracking client project milestones and progress. This tool provides both visual timeline views and practical data export options.

## Features

### 📊 Multiple Views
- **Timeline View**: Visual horizontal timeline showing milestones across different project phases
- **Gantt View**: Traditional Gantt chart representation (coming soon)
- **List View**: Tabular view with sortable columns for detailed milestone management

### 🎯 Key Capabilities
- **Client Management**: Create, edit, and manage multiple client projects
- **Editable Projects**: Click the edit icon next to client name to modify details or delete clients
- **Milestone Tracking**: Add, edit, and delete project milestones
- **Progress Monitoring**: Track completion status and percentage progress
- **Phase Organization**: Organize milestones into Planning, Implementation, Review, and Delivery phases
- **Export Options**: Generate PDF reports and CSV spreadsheets
- **Shareable Links**: Each client gets a unique URL for easy sharing

### 💾 Data Storage
- All data is stored locally in your browser (localStorage)
- No server required - works completely offline
- Data persists between sessions

## Getting Started

1. **Open the Tool**: Simply open `index.html` in your web browser
2. **Create a Client**: 
   - Click on "Select or Create Client" in the header
   - Enter client name and project name
   - Click "Create Client"
3. **Edit Client Details** (NEW):
   - Click the edit icon (✏️) next to the client name
   - Modify client or project name
   - Option to delete client and all associated data
4. **Add Milestones**:
   - Click the "Add Milestone" button
   - Fill in milestone details:
     - Name, dates, phase, status
     - Progress percentage
     - Description and deliverables
   - Click "Save Milestone"

## Using the Timeline

### Navigation
- **Zoom In/Out**: Use the zoom buttons to adjust the timeline scale
- **Switch Views**: Toggle between Timeline, Gantt, and List views
- **Edit Milestones**: Click any milestone to edit its details

### Status Options
- **Upcoming**: Future milestones not yet started
- **In Progress**: Currently active milestones
- **Completed**: Finished milestones
- **Delayed**: Milestones behind schedule

### Phase Categories
- **Planning**: Initial strategy and planning activities
- **Implementation**: Core project execution work
- **Review**: Testing, feedback, and refinement
- **Delivery**: Final delivery and handover

## Sharing with Clients

### Option 1: Direct Link Sharing (Simplest)
1. Select your client in the tool
2. Copy the URL from your browser (it will include `?client=client-xxxxx`)
3. Share this link with your client
4. **Note**: Client will have access to the tool interface (can modify data)

### Option 2: Hosted Solution (Recommended)
1. **Upload to Web Server**: Host the tool on your website (e.g., `timeline.vespa.academy`)
2. **Password Protection**: Add `.htaccess` file for basic authentication
3. **Share Credentials**: Provide clients with URL and password

### Option 3: Export-Only Sharing (Most Secure)
1. Use the PDF export for read-only sharing
2. Generate CSV for clients who need the raw data
3. No risk of accidental modifications

### Option 4: Subdomain per Client (Professional)
- Create subdomains like `clientname.timeline.vespa.academy`
- Each client gets their own isolated instance
- Requires more technical setup but provides best experience

## Exporting Data

### PDF Export
- Generates a professional PDF report
- Includes client information and milestone summary
- Perfect for client meetings and documentation

### CSV Export
- Creates a spreadsheet-compatible file
- Contains all milestone data in tabular format
- Ideal for detailed analysis and record-keeping

## Tips for Effective Use

1. **Regular Updates**: Update milestone progress weekly to maintain accurate timelines
2. **Detailed Descriptions**: Add comprehensive descriptions to help with future reference
3. **Deliverables Tracking**: List all key deliverables for each milestone
4. **Client Reviews**: Use the visual timeline during client meetings for better engagement
5. **Export Regularly**: Generate PDF/CSV exports for record-keeping and sharing

## Technical Notes

### Browser Compatibility
- Works best in modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- Local storage must be enabled for data persistence

### Data Management
- Each client's data is stored separately
- Client selection is maintained via URL parameters
- Data can be backed up by exporting to CSV

### Customization
The tool uses CSS variables for easy color customization:
```css
:root {
    --primary-color: #102f62;    /* VESPA brand blue */
    --secondary-color: #1e88e5;   /* Accent blue */
    --accent-color: #4caf50;      /* Success green */
}
```

## Troubleshooting

**Q: My data disappeared**
A: Check if you're using the same browser and haven't cleared local storage

**Q: Timeline looks compressed**
A: Use the zoom controls to adjust the scale

**Q: Can't export PDF**
A: Ensure pop-ups are allowed for the export functionality

**Q: How do I delete a client?**
A: Click the edit icon (✏️) next to the client name, then click the "Delete Client" button. This will permanently remove the client and all associated timeline data.

## Future Enhancements

- Gantt chart view implementation
- Milestone dependencies
- Team member assignments
- File attachments
- Email notifications
- Cloud backup options

---

For support or feature requests, please contact your VESPA representative. 