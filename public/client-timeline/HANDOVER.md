# VESPA Client Timeline Tool - Handover Document

## Current Status

The VESPA Client Timeline Tool has been developed with most features working correctly, but two recent updates have issues that need to be fixed:

1. **School Management Modal Error**
2. **Deliverables Separation Not Working**

## Project Overview

### File Structure
```
client-timeline-tool/
├── index.html          # Generic timeline tool
├── eact-demo.html      # E-ACT specific version
├── timeline.js         # Generic JavaScript
├── timeline-eact.js    # E-ACT specific JavaScript  
├── styles.css          # Shared styles
└── README.md           # Documentation
```

### Working Features
- ✅ Visual timeline view with zoom controls
- ✅ School Matrix view showing all schools vs milestones
- ✅ Progress tracking per school
- ✅ PDF and CSV export
- ✅ Client management (create, edit, delete)
- ✅ Contact modal for viewing school contacts
- ✅ School filtering and selection
- ✅ Ousedale logo updated to: https://tse1.mm.bing.net/th/id/OIP.zPyqAOuaIUoSxs5TGlwGfwAAAA

## Issues to Fix

### Issue 1: School Management Modal Error

**Error Message:**
```
Uncaught TypeError: Cannot read properties of undefined (reading 'name')
at timeline-eact.js:1540
```

**Problem:** The school data structure in the `schools` array doesn't match what the `openSchoolManagementModal()` function expects.

**Current School Structure (in timeline-eact.js around line 30-78):**
```javascript
{ 
    id: 'bourne-end', 
    name: 'Bourne End Academy', 
    logo: 'https://...',
    contacts: {
        'Head of 6th Form': { name: 'Paul Elms', email: 'paul.elms@e-act.org.uk' },
        'Headteacher': { name: 'Rebecca Garratt', email: 'rebecca.garratt@e-act.org.uk' }
    }
}
```

**Code Expecting (line ~1540):**
```javascript
school.contacts['Head of 6th Form'].name  // This is failing
```

**Solution Needed:**
1. Check if `school.contacts` exists before accessing properties
2. Add proper error handling in the `openSchoolManagementModal()` function
3. Ensure all schools have the contacts object properly defined

### Issue 2: Deliverables Separation Not Showing

**Problem:** The modal was updated to have separate fields for VESPA and School deliverables, but they're not appearing/working.

**Changes Made But Not Working:**

1. **In eact-demo.html (around line 282-290):**
   - Changed single `deliverables` field to `vespaDeliverables` and `schoolDeliverables`
   
2. **In timeline-eact.js:**
   - Updated `saveMilestone()` to save both types (around line 677)
   - Updated milestone display to handle both types (around line 650)
   - Updated CSV export headers (around line 1425)

3. **In index.html:**
   - Same changes needed for the generic version

**What's Missing:**
- The form might need to be reset when opening the modal
- The existing milestone data needs migration from `deliverables` to the new fields
- The milestone display in timeline view needs to show both types

## Code Sections to Review

### 1. School Management Modal (timeline-eact.js, lines ~1519-1582)
```javascript
openSchoolManagementModal() {
    const content = document.getElementById('schoolManagementContent');
    content.innerHTML = '';
    
    // This forEach is failing because school.contacts might be undefined
    this.schools.forEach(school => {
        // Need to add: if (!school.contacts) return; or initialize contacts
        ...
    });
}
```

### 2. Deliverables Handling (timeline-eact.js)
- Line ~650: Loading milestone data into form
- Line ~677: Saving milestone data from form
- Line ~1434: CSV export needs both deliverable types

### 3. Milestone Data Structure
The existing milestones use `deliverables: []` but need to be updated to:
```javascript
{
    vespaDeliverables: ['VESPA provides...'],
    schoolDeliverables: ['School responsible for...']
}
```

## Steps to Fix in New Context

1. **Fix School Management Error:**
   ```javascript
   // Add null checks in openSchoolManagementModal()
   if (!school.contacts) {
       school.contacts = {
           'Head of 6th Form': { name: '', email: '' },
           'Headteacher': { name: '', email: '' }
       };
   }
   ```

2. **Fix Deliverables Display:**
   - Ensure form fields exist in both HTML files
   - Update form reset/clear functions
   - Test that both save and load functions handle the new fields
   - Consider backward compatibility for existing `deliverables` field

3. **Test Thoroughly:**
   - Create new milestone with both deliverable types
   - Edit existing milestone
   - Export to CSV and verify both columns appear
   - Check school management for all schools

## Additional Context

### User Requirements
1. Separate deliverables into:
   - **VESPA Deliverables**: What VESPA provides (training, resources, frameworks)
   - **School Deliverables**: What schools must do (implementation, student activities)

2. School information management:
   - Easy editing of contact details
   - Visual interface for all schools
   - Persistent storage

### Recent Updates That Need Verification
- Milestone activities (e.g., eact-9, eact-15) should be marked as school responsibilities
- Contact modal CSS was added to end of styles.css
- School logos bar has a "Manage" button added

## Testing Checklist
- [ ] School management modal opens without errors
- [ ] All school contacts can be edited and saved
- [ ] New milestones show both deliverable types
- [ ] Existing milestones migrate properly
- [ ] CSV export includes both deliverable columns
- [ ] PDF export handles new structure
- [ ] School matrix view still works correctly

## File Paths
- Main Demo: `/client-timeline-tool/eact-demo.html`
- Generic Version: `/client-timeline-tool/index.html`
- Error Location: `/client-timeline-tool/timeline-eact.js` line 1540

## Quick Start for New Context

1. Attach these files to the new conversation:
   - `/client-timeline-tool/eact-demo.html`
   - `/client-timeline-tool/timeline-eact.js`
   - `/client-timeline-tool/styles.css`
   - This handover document

2. Ask the AI to:
   - Fix the school management modal error at line 1540
   - Implement the deliverables separation properly
   - Test both features work correctly

3. The main issues are:
   - JavaScript errors preventing school management from working
   - UI not showing the separated deliverables fields properly

## Key Feature Requirements Summary

### 1. Deliverables Separation
- **Purpose**: Clearly distinguish between what VESPA provides vs what schools must do
- **Example**: 
  - VESPA Deliverables: "Training materials, Portal access, Coaching framework"
  - School Deliverables: "Complete milestone activities, Ensure student participation, Submit data"
- **Special Note**: Milestone activities (like in milestones eact-9, eact-15) are SCHOOL responsibilities

### 2. School Information Management
- **Purpose**: Allow easy editing of school contact details without code changes
- **Features Needed**:
  - Edit Head of 6th Form name/email for each school
  - Edit Headteacher name/email for each school
  - Save changes to localStorage
  - Access via "Manage" button next to school filter 