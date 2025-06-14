# How to Edit Your VESPA Website

## Quick Start Guide for Making Changes

### Option 1: Using Visual Studio Code (Recommended)
1. **Install VS Code**: Download from https://code.visualstudio.com/
2. **Open your project**: File → Open Folder → Select `vespa-academy-new`
3. **Find the file you want to edit** (see structure below)
4. **Make your changes** and save (Ctrl+S)
5. **Push to GitHub**:
   - Open terminal in VS Code (Terminal → New Terminal)
   - Type: `git add -A`
   - Type: `git commit -m "Your change description"`
   - Type: `git push`
6. **Wait ~30 seconds** for Vercel to deploy automatically!

### Option 2: Edit Directly on GitHub (For Small Changes)
1. Go to https://github.com/4Sighteducation/vespa_academy_website
2. Navigate to the file you want to edit
3. Click the pencil icon to edit
4. Make your changes
5. Click "Commit changes" at the bottom
6. Vercel will automatically deploy!

## Website Structure - Where to Find Things

```
vespa-academy-new/
├── src/
│   └── pages/           ← YOUR MAIN PAGES ARE HERE
│       ├── index.astro      → Homepage
│       ├── about.astro      → About Us page
│       ├── solutions.astro  → Solutions page
│       ├── pricing.astro    → Pricing page
│       ├── impact.astro     → Our Impact page
│       ├── model.astro      → VESPA Model page
│       ├── resources.astro  → Resources page
│       └── contact.astro    → Contact page
├── public/
│   └── assets/          ← IMAGES GO HERE
└── api/                 ← Email functionality (don't edit unless needed)
```

## Common Edits

### To Change Text:
1. Find the page file (e.g., `src/pages/about.astro`)
2. Look for the text between HTML tags like `<p>Your text here</p>`
3. Change the text and save

### To Change an Image:
1. Add your new image to `public/assets/`
2. Find where the old image is referenced: `src="/assets/old-image.jpg"`
3. Change it to: `src="/assets/your-new-image.jpg"`

### To Change Colors:
Look for classes like:
- `bg-theme-primary` → Dark blue background
- `bg-theme-secondary` → Teal background
- `text-white` → White text
- `text-gray-300` → Light gray text

## Example: Editing Team Member Info

In `src/pages/about.astro`, find:
```html
<h3 class="text-2xl font-bold mb-2">Tony Dennis</h3>
<p class="text-gray-400">With over 20 years of experience...</p>
```

Change to:
```html
<h3 class="text-2xl font-bold mb-2">Tony Dennis</h3>
<p class="text-gray-400">Your new description here...</p>
```

## Tips:
- **Always test locally first**: Run `npm run dev` to see changes before pushing
- **Use descriptive commit messages**: "Updated Tony's bio" not "changes"
- **Keep backups**: Copy important content before making big changes
- **Ask for help**: If unsure, it's better to ask than break something!

## Need Help?
- Astro Documentation: https://docs.astro.build/
- Tailwind CSS Classes: https://tailwindcss.com/docs
- Or ask your developer! 