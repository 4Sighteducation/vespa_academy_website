# Website Editing Guide for VESPA Academy

## Quick Start - Visual Editing

### Option 1: VS Code with Live Preview (Recommended)

1. **Install VS Code** (if not already installed)
   - Download from: https://code.visualstudio.com/

2. **Install Helpful Extensions**
   - Open VS Code
   - Click the Extensions icon (square icon on left sidebar)
   - Search and install these:
     - **Live Server** - for instant preview
     - **HTML CSS Support** - for better code hints
     - **Astro** - for Astro file support
     - **Tailwind CSS IntelliSense** - for styling hints

3. **Open Your Project**
   - File → Open Folder → Select `vespa-academy-new`

4. **Start Live Preview**
   - Open terminal in VS Code: View → Terminal
   - Type: `npm run dev`
   - Your site opens at http://localhost:4321
   - Changes update automatically!

### Option 2: Use a Visual Editor (No-Code)

For future projects, consider these visual website builders:
- **Webflow** - Professional visual web design
- **Framer** - Modern interactive websites
- **WordPress + Elementor** - Popular and flexible
- **Wix or Squarespace** - Easiest for beginners

## Common Edits You Can Make

### 1. Changing Text
Find text in `.astro` files and edit directly:
```html
<!-- Before -->
<h1>Old Heading</h1>

<!-- After -->
<h1>Your New Heading</h1>
```

### 2. Changing Colors
The site uses a color theme. Edit these in `tailwind.config.mjs`:
- `theme-primary`: Main blue color
- `theme-secondary`: Orange accent
- `theme-dark`: Dark blue
- `vision`, `effort`, `systems`, `practice`, `attitude`: VESPA colors

### 3. Changing Images
1. Add new images to `public/images/` or `public/assets/`
2. Update the image path in the code:
```html
<!-- Before -->
<img src="/images/old-image.jpg" alt="Description">

<!-- After -->
<img src="/images/your-new-image.jpg" alt="Description">
```

### 4. Updating Links
```html
<!-- Before -->
<a href="/old-page">Link Text</a>

<!-- After -->
<a href="/new-page">Link Text</a>
<!-- Or external link -->
<a href="https://example.com" target="_blank">Link Text</a>
```

## File Structure

```
vespa-academy-new/
├── src/
│   ├── pages/          # Your web pages
│   │   ├── index.astro # Home page
│   │   ├── about.astro # About page
│   │   ├── contact.astro # Contact page
│   │   └── ...
│   ├── layouts/        # Page templates
│   └── components/     # Reusable parts
├── public/             # Images, files
│   ├── images/        # Image files
│   └── assets/        # Other assets
└── package.json       # Project config
```

## Making Changes Safely

1. **Before making changes**: Copy the file you're editing
2. **Test locally**: Always check http://localhost:4321
3. **Small changes**: Make one change at a time
4. **Save often**: Ctrl+S (or Cmd+S on Mac)

## Common Patterns to Look For

### Buttons
```html
<a href="LINK-HERE" class="btn-primary">Button Text</a>
```

### Headings
```html
<h1>Main Title</h1>
<h2>Section Title</h2>
<h3>Subsection</h3>
```

### Paragraphs
```html
<p>Your paragraph text here</p>
```

### Lists
```html
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
</ul>
```

## Getting Help

1. **Astro Documentation**: https://docs.astro.build/
2. **Tailwind CSS Classes**: https://tailwindcss.com/docs
3. **HTML Basics**: https://www.w3schools.com/html/

## Tips for Non-Coders

1. **Use Find & Replace** (Ctrl+F) to locate text you want to change
2. **Look for patterns** - most sections follow similar structures
3. **Don't delete brackets** `< >` or quotes `" "`
4. **Keep backups** of files before editing
5. **Ask AI for help** - describe what you want to change

## Visual Editing Tools to Consider

If you want a more visual experience for future projects:

1. **Pinegrow** - Visual editor that works with your existing code
2. **Brackets** - Adobe's visual HTML editor
3. **BlueGriffon** - WYSIWYG HTML editor

## Converting to a CMS

For easier content management, you could later add:
- **Netlify CMS** - Free, works with your current setup
- **Strapi** - Open source headless CMS
- **Sanity** - Modern content platform

Remember: The current setup is code-based, but you can still make many changes by carefully editing the text within the HTML tags! 