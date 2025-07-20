# Multi-Tier Permission System Guide

## Overview

The VESPA Timeline app now supports 4 different access levels:

### 1. Super Admin (You)
- **File**: `index.html`
- **Capabilities**:
  - ✅ Create/edit/delete all projects
  - ✅ Create new clients
  - ✅ Add/edit/delete all milestones
  - ✅ Manage all schools
  - ✅ Create project leads
  - ✅ Configure client branding
- **URL**: `https://yourdomain.com/index.html`

### 2. Project Lead (Client Admin)
- **File**: `lead.html`
- **Capabilities**:
  - ✅ Edit their assigned project
  - ✅ Add/edit/delete milestones
  - ✅ Update milestone status
  - ✅ Manage school contacts
  - ❌ Cannot create new projects
  - ❌ Cannot switch between clients
- **URL**: `https://yourdomain.com/lead.html?client=CLIENT_ID`

### 3. Client View (Read-Only)
- **File**: `client.html`
- **Capabilities**:
  - ✅ View entire project timeline
  - ✅ Export to PDF/CSV
  - ✅ View all schools (if applicable)
  - ❌ Cannot edit anything
- **URL**: `https://yourdomain.com/client.html?client=CLIENT_ID`

### 4. School View (Individual School)
- **File**: `school.html`
- **Capabilities**:
  - ✅ View only their school's milestones
  - ✅ See their specific progress
  - ✅ Export their data
  - ❌ Cannot see other schools
  - ❌ Cannot edit anything
- **URL**: `https://yourdomain.com/school.html?client=CLIENT_ID&school=SCHOOL_ID`

## Setting Up Users

### 1. Run the SQL in Supabase
```sql
-- Run the contents of client-branding.sql
```

### 2. Add Users in Supabase
```sql
-- Add a super admin (you)
INSERT INTO user_profiles (email, role, full_name)
VALUES ('your-email@example.com', 'super_admin', 'Your Name');

-- Add a project lead for E-ACT
INSERT INTO user_profiles (email, role, client_id, full_name)
VALUES ('lead@e-act.org.uk', 'project_lead', 'client-1752835894451', 'Project Lead Name');

-- Add a school viewer
INSERT INTO user_profiles (email, role, client_id, school_id, full_name)
VALUES ('head@bourneend.e-act.org.uk', 'school_viewer', 'client-1752835894451', 'bourne-end', 'School Head Name');
```

## Client Branding

### Add Branding for a Client
```sql
INSERT INTO client_branding (
    client_id, 
    logo_url, 
    primary_color, 
    secondary_color,
    company_name
) VALUES (
    'client-id-here',
    'https://url-to-logo.png',
    '#003366',  -- Navy blue
    '#ff6600',  -- Orange
    'Company Name Ltd'
);
```

### Branding Options
- `logo_url`: Company logo (appears in header)
- `primary_color`: Main brand color (buttons, headers)
- `secondary_color`: Accent color
- `header_bg_color`: Header background
- `custom_css`: Additional CSS styling
- `company_name`: Shows in browser title

## Sharing Links

### For E-ACT Example:

1. **Super Admin** (You only):
   ```
   https://yourdomain.com/index.html
   ```

2. **E-ACT Project Lead**:
   ```
   https://yourdomain.com/lead.html?client=client-1752835894451
   ```

3. **E-ACT Client (View Only)**:
   ```
   https://yourdomain.com/client.html?client=client-1752835894451
   ```

4. **Individual School (e.g., Bourne End)**:
   ```
   https://yourdomain.com/school.html?client=client-1752835894451&school=bourne-end
   ```

## Security Considerations

### Current Implementation (URL-Based)
- Simple to implement
- No authentication required
- Security through obscurity (unique URLs)
- Suitable for low-sensitivity data

### Future Enhancement Options
1. **Supabase Auth Integration**
   - Email/password login
   - Magic link authentication
   - Social login (Google, Microsoft)

2. **Row Level Security**
   - Database-level access control
   - Automatic filtering based on user role

3. **API Key Protection**
   - Secure API endpoints
   - Rate limiting

## Testing the System

### 1. Test Super Admin View
- Open `index.html`
- Should see all features
- Can create/edit everything

### 2. Test Project Lead View
- Open `lead.html?client=client-1752835894451`
- Can edit milestones
- Cannot switch clients

### 3. Test Client View
- Open `client.html?client=client-1752835894451`
- Can only view
- No edit buttons

### 4. Test School View
- Open `school.html?client=client-1752835894451&school=bourne-end`
- Shows only that school's data
- School branding visible

## Deployment Notes

When deploying:
1. Keep `index.html` URL completely private
2. Share specific URLs based on user role
3. Consider using subdomains:
   - `admin.yourdomain.com` → index.html
   - `portal.yourdomain.com` → lead.html
   - `timeline.yourdomain.com` → client.html
   - `school.yourdomain.com` → school.html

## Next Steps

1. **Test all views locally**
2. **Run SQL to create tables**
3. **Add sample users**
4. **Configure client branding**
5. **Deploy to production**
6. **Share appropriate URLs** 