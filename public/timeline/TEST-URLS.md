# How to Test Different User Views

## These are URLs to open in your BROWSER, not SQL commands!

### 1. Super Admin View (Full Access - You)
Open this file in your browser:
```
file:///C:/Users/tonyd/OneDrive%20-%204Sight%20Education%20Ltd/VESPA%20WEBISTE%20FILES/vespa-academy-new/public/timeline/index.html
```

### 2. Project Lead View (E-ACT Admin - Can Edit)
Open this URL in your browser:
```
file:///C:/Users/tonyd/OneDrive%20-%204Sight%20Education%20Ltd/VESPA%20WEBISTE%20FILES/vespa-academy-new/public/timeline/lead.html?client=client-eact-2025
```

### 3. Client View (E-ACT - Read Only)
Open this URL in your browser:
```
file:///C:/Users/tonyd/OneDrive%20-%204Sight%20Education%20Ltd/VESPA%20WEBISTE%20FILES/vespa-academy-new/public/timeline/client.html?client=client-eact-2025
```

### 4. School View (Bourne End - Read Only)
Open this URL in your browser:
```
file:///C:/Users/tonyd/OneDrive%20-%204Sight%20Education%20Ltd/VESPA%20WEBISTE%20FILES/vespa-academy-new/public/timeline/school.html?client=client-eact-2025&school=bourne-end
```

### Other Schools:
- Crest Academy: `...&school=crest`
- Daventry: `...&school=daventry`
- Montpelier: `...&school=montpelier`
- North Birmingham: `...&school=north-birmingham`
- Ousedale: `...&school=ousedale`
- West Walsall: `...&school=west-walsall`

## What to Look For:

### In Super Admin View:
- ✅ Can create new clients
- ✅ Can add/edit/delete milestones
- ✅ Can manage schools

### In Project Lead View:
- ✅ Can add/edit/delete milestones
- ✅ Can manage schools
- ❌ Cannot create new clients

### In Client View:
- ✅ Can see everything
- ❌ No edit buttons
- ❌ No add milestone button

### In School View:
- ✅ Shows school logo and name
- ✅ Only shows relevant milestones
- ❌ No edit capabilities 