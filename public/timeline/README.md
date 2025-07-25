# VESPA Timeline Manager - User Guide

## Overview
The VESPA Timeline Manager is a comprehensive project management tool designed for tracking milestones, deliverables, and progress across the E-ACT academy schools project.

## Access URLs

### Production URLs (Vercel)
- **Main Timeline (Admin)**: `https://vespa.academy/timeline/`
- **Client View**: `https://vespa.academy/timeline/client.html?client=client-eact-2025`
- **School View**: `https://vespa.academy/timeline/school.html?school=school-id`

### Local Development
- **Main Timeline**: `http://localhost:3000/timeline/`
- **Client View**: `http://localhost:3000/timeline/client.html?client=client-eact-2025`

## User Types & Capabilities

### 1. **Admin Users (VESPA Staff)**
**Access**: `/timeline/index.html` or `/timeline/`

**Capabilities**:
- ✅ Create, edit, and delete milestones
- ✅ Manage multiple clients
- ✅ Track school-specific progress
- ✅ Upload attachments and links
- ✅ Export to PDF and CSV
- ✅ Access all views (Timeline, Gantt, List, Matrix)
- ✅ Manage school contacts
- ✅ Set VESPA categories for activities

**Key Features**:
- Full milestone management
- School progress matrix view
- Zoom controls for timeline
- Deliverables tracking (VESPA & School)

### 2. **Client Users (E-ACT Leadership)**
**Access**: `/timeline/client.html?client=client-eact-2025`

**Capabilities**:
- ✅ View all project milestones
- ✅ Edit existing milestones (name, dates, status, progress, etc.)
- ✅ See progress across all schools
- ✅ Export timeline to PDF/CSV
- ✅ View attachments and resources
- ✅ Access Timeline, Gantt, and List views
- ❌ Cannot create new milestones
- ❌ Cannot delete milestones
- ❌ Cannot access admin functions (school management)

**Key Features**:
- Read-only comprehensive view
- Progress tracking dashboard
- School-by-school progress indicators
- Download resources and attachments

### 3. **School Users (Individual Schools)**
**Access**: `/timeline/school.html?school=SCHOOL_ID`

**School IDs**:
- `bourne-end` - Bourne End Academy
- `crest` - Crest Academy  
- `daventry` - Daventry 6th Form
- `montpelier` - Montpelier V6
- `north-birmingham` - North Birmingham Academy
- `ousedale` - Ousedale
- `west-walsall` - West Walsall

**Capabilities**:
- ✅ View milestones relevant to their school
- ✅ See their specific progress
- ✅ Access VESPA activity resources
- ✅ View their deliverables
- ❌ Cannot see other schools' progress
- ❌ Cannot edit milestones

## Quick Start Guide

### For Administrators

1. **Access the Timeline**
   ```
   https://vespa.academy/timeline/
   ```

2. **Add a Milestone**
   - Click "Add Milestone" button
   - Fill in milestone details
   - Select phase (Planning, Implementation, etc.)
   - Add deliverables for VESPA and Schools
   - Attach files/links if needed
   - Click "Save Milestone"

3. **Track School Progress**
   - Switch to "School Matrix" view
   - Click on school/milestone intersections to update status
   - Progress automatically calculates

4. **Export Data**
   - Click "Export PDF" for visual timeline
   - Click "Export CSV" for data analysis

### For E-ACT Leadership

1. **Access Your Dashboard**
   ```
   https://vespa.academy/timeline/client.html?client=client-eact-2025
   ```

2. **Navigate Views**
   - **Timeline**: Visual project overview with cycles
   - **Gantt**: Traditional project chart
   - **List**: Sortable table view with edit buttons

3. **Edit Milestones**
   - Click on any milestone in Timeline/Gantt view
   - Or use Edit button in List view
   - Update dates, status, progress, deliverables
   - Add attachments and links
   - Click "Save Milestone" to save changes

4. **Monitor Progress**
   - Check header stats (Completed/In Progress/Upcoming)
   - Look for school indicators on each milestone
   - Review deliverables and attachments

### For School Staff

1. **Access Your School View**
   ```
   https://vespa.academy/timeline/school.html?school=YOUR_SCHOOL_ID
   ```
   Replace `YOUR_SCHOOL_ID` with your school's ID from the list above.

2. **Find Your Tasks**
   - Milestones show your specific deliverables
   - VESPA activities display with category colors
   - Download resources via attachment links

## Timeline Features

### Milestone Phases
- **📝 Planning**: Setup and preparation activities
- **🚀 Implementation**: Active project phases
- **📊 Review**: Progress checkpoints
- **✅ Delivery**: Final outputs and wrap-up
- **🎯 VESPA Activities**: Suggested activities color-coded by category

### VESPA Categories
- 🟠 **VISION**: Goal setting & future planning
- 🔵 **EFFORT**: Time management & productivity
- 🟢 **SYSTEMS**: Organization & task management
- 🟣 **PRACTICE**: Learning strategies & techniques
- 🟪 **ATTITUDE**: Mindset & resilience

### Project Cycles
- **Cycle 1**: Sep 22, 2025 - Dec 19, 2025
- **Cycle 2**: Jan 5, 2026 - Apr 10, 2026
- **Cycle 3**: Apr 20, 2026 - Jul 15, 2026

### Status Indicators
- 🟢 **Completed**: Milestone finished
- 🟡 **In Progress**: Currently active
- ⚪ **Upcoming**: Not yet started
- 🔴 **Delayed**: Behind schedule

## File Attachments

### Adding Attachments
1. Edit a milestone
2. In "Files & Links" field, add one item per line:
   ```
   https://example.com/document.pdf
   Meeting Recording
   https://drive.google.com/file/...
   Activity Worksheet
   ```

### Accessing Attachments
- Click paperclip icons in timeline view
- Links open in new tabs
- Text entries display as references

## Troubleshooting

### Can't Access Timeline?
- Check your URL includes the correct parameters
- Ensure you're using the right view (admin/client/school)
- Clear browser cache if having display issues

### Missing School Progress?
- Admin needs to update via Matrix view
- Progress bars show combined milestone completion

### Export Issues?
- PDF export requires popup permissions
- CSV opens in Excel/Google Sheets
- Large timelines may take time to generate

## Support

For technical issues or questions:
- **VESPA Team**: Contact Tony Dennis or Martin Griffin
- **E-ACT Coordinator**: Amy Gill
- **Technical Support**: Check browser console for errors

## Browser Compatibility
- ✅ Chrome (recommended)
- ✅ Edge
- ✅ Firefox
- ✅ Safari
- ⚠️ Internet Explorer (not supported)

---

Last Updated: December 2024
Version: 2.1 (with client editing capabilities) 