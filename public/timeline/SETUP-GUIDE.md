# VESPA Timeline App - Setup Guide

## Quick Start - Getting Your App Running

### Step 1: Run the Schools Policies SQL
First, you need to enable the security policies for your schools tables in Supabase:

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/ldrbytqlphftjzafrlms
2. Click on "SQL Editor" in the left sidebar
3. Copy and paste the contents of `schools-policies.sql`
4. Click "Run" to execute the SQL

### Step 2: Start Your Local Server
Open PowerShell in your timeline folder and run:
```bash
cd "C:\Users\tonyd\OneDrive - 4Sight Education Ltd\VESPA WEBISTE FILES\vespa-academy-new\public\timeline"
python -m http.server 8000
```

### Step 3: Migrate Your Data
This is a two-step process to get all your E-ACT data into Supabase:

1. **Open your browser** and go to: http://localhost:8000/migrate-eact-data.html

2. **Follow these steps in order:**
   - Click "1. Migrate Schools" - This adds all E-ACT schools to the database
   - Wait for completion message
   - Click "2. Migrate E-ACT Data" - This transfers your timeline and milestones
   - Wait for completion message
   - Click "3. Verify Migration" - Check that everything transferred correctly

### Step 4: Test Your App
1. Open http://localhost:8000/index.html
2. You should see:
   - Your E-ACT client loaded
   - All your milestones displayed
   - Schools loaded from the database (not hardcoded anymore!)

## What We Fixed

### 1. Field Mapping Issues
- Fixed the camelCase to snake_case conversion (startDate → start_date)
- Properly handle array fields for deliverables
- Added proper field mapping in syncToSupabase()

### 2. Schools Feature
- Schools now load dynamically from Supabase
- Added migration script to populate schools
- Schools bar updates automatically
- Contact information stored in database

### 3. Data Migration
- Created tools to migrate your existing localStorage data
- Preserves all your E-ACT timeline work
- Includes verification to ensure data integrity

## Troubleshooting

### If Schools Don't Appear:
1. Check browser console for errors (F12)
2. Verify schools migration completed successfully
3. Try refreshing the page

### If Milestones Don't Load:
1. Check if E-ACT client exists in Supabase
2. Verify milestone migration completed
3. Check for any 400 errors in console

### If You Get 400 Errors:
This usually means field mapping issues. The fixes we applied should resolve this, but if you still see them:
- Check the exact error message in browser console
- It will tell you which field is causing issues

## Next Steps for Production

### 1. Test Everything Locally
- Create new milestones
- Edit existing milestones
- Check all views (Timeline, Gantt, List, Matrix)
- Test school filtering

### 2. Deploy to GitHub
```bash
git add .
git commit -m "Add Supabase integration with schools feature"
git push origin main
```

### 3. Deploy to Vercel
1. Push to GitHub first
2. In Vercel dashboard, add environment variables:
   - `SUPABASE_URL`: Your Supabase URL
   - `SUPABASE_ANON_KEY`: Your Supabase anon key
3. Deploy and test

## Managing Schools Going Forward

### Adding New Schools:
Instead of hardcoding, you can now:
1. Use Supabase dashboard to add schools directly
2. Or create an admin interface in your app
3. Schools will automatically appear in all projects

### Updating School Information:
1. Go to Supabase dashboard
2. Navigate to Table Editor → schools
3. Update any school details
4. Changes reflect immediately in app

## Important Files

- `app.js` - Main application with Supabase integration
- `migrate-schools.js` - Script to add schools to database
- `migrate-eact-data.js` - Script to migrate timeline data
- `config.local.js` - Your Supabase credentials (don't commit!)
- `schools-policies.sql` - Security policies for schools tables

## Support

If you encounter any issues:
1. Check browser console for detailed error messages
2. Verify your Supabase credentials in config.local.js
3. Ensure all SQL has been run in Supabase
4. Try the migration steps again

Remember: Your localStorage data is safe! The migration doesn't delete anything, it only copies to Supabase. 