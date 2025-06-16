# VESPA Academy Website

A modern, responsive website for VESPA Academy built with Astro, Tailwind CSS, and deployed on Vercel.

## 🚀 Project Structure

```
vespa-academy-new/
├── src/
│   ├── components/         # Reusable Astro components
│   ├── layouts/           # Page layouts
│   ├── pages/             # Website pages and API routes
│   └── styles/            # Global styles
├── public/                # Static assets
├── assets/                # Source images and files
└── api/                   # Serverless functions
```

## 📁 Key Files and Directories

### Core Configuration Files

- **`astro.config.mjs`** - Main Astro configuration with Vercel adapter and Tailwind setup
- **`tailwind.config.cjs`** - Tailwind CSS configuration with custom VESPA color scheme
- **`package.json`** - Project dependencies and scripts
- **`vercel.json`** - Vercel deployment configuration
- **`tsconfig.json`** - TypeScript configuration

### Source Files (`src/`)

#### Components (`src/components/`)
- **`Header.astro`** - Main navigation header with responsive menu
- **`Footer.astro`** - Site footer with links and contact information
- **`VespaReport.astro`** - Component for generating VESPA assessment reports
- **`Hero.astro`** - Hero section component used on various pages
- **`Features.astro`** - Features showcase component
- **`Testimonials.astro`** - Customer testimonials component

#### Layouts (`src/layouts/`)
- **`Layout.astro`** - Base layout template for all pages
- **`BaseLayout.astro`** - Alternative layout template

#### Pages (`src/pages/`)

##### Main Pages
- **`index.astro`** - Homepage with hero, features, and CTAs
- **`about.astro`** - About page with team information
- **`pricing.astro`** - Pricing plans and packages
- **`contact.astro`** - Contact form and information
- **`questionnaire.astro`** - VESPA assessment questionnaire with lead capture

##### Solution Pages
- **`solutions/index.astro`** - Solutions overview
- **`solutions/schools.astro`** - Solutions for schools
- **`solutions/colleges.astro`** - Solutions for colleges
- **`solutions/mat.astro`** - Solutions for Multi-Academy Trusts

##### Resource Pages
- **`resources/index.astro`** - Resources hub
- **`resources/books.astro`** - VESPA books and publications
- **`resources/research.astro`** - Research and case studies
- **`resources/blog/[...slug].astro`** - Dynamic blog post pages

##### Portal Pages
- **`portal/index.astro`** - Main portal landing
- **`portal/coaching.astro`** - Coaching portal information
- **`portal/resources.astro`** - Resource portal information

##### API Routes (`src/pages/api/`)
- **`send-report.ts`** - Handles sending VESPA reports via email
- **`download-report.ts`** - Handles report PDF downloads
- **`test.js`** - API testing endpoint

### Public Assets (`public/`)

#### Images (`public/assets/`)
- **`vespa-logo.png`** - Main VESPA logo
- **`questionnaireinsights2.png`** - Questionnaire insights dashboard screenshot
- **`REport Main.png`** - Sample VESPA report
- **`martingriffin.jpg`** - Team member photo
- **`steveoakes.webp`** - Team member photo
- **`tonydennis.webp`** - Team member photo

### Assets Directory (`assets/`)
- **`reporttext_restructured_complete.json`** - Complete report text data
- **`questionniareimage1.jpg`** - Questionnaire background image
- Various other images and resources

### Email Templates
- **`LEAD_EMAIL.html`** - Admin notification email template for new leads
- **`REPORT_TEMPLATE.html`** - User report email template

### Documentation Files
- **`README.md`** - This file
- **`EDITING-GUIDE.md`** - Guide for editing the website
- **`SENDGRID_SETUP.md`** - SendGrid email configuration guide
- **`HOW_TO_EDIT.md`** - Simple editing instructions

## 🎨 Styling

### Custom Colors (defined in `tailwind.config.cjs`)
- **Primary**: `#102f62` (Dark blue)
- **Secondary**: `#00e5db` (Cyan)
- **Accent1**: `#00c9bf` (Teal)
- **Dark**: `#0a1628` (Very dark blue)

### VESPA Category Colors
- **Vision**: `#ffab40` (Orange)
- **Effort**: `#a9c8f5` (Light blue)
- **Systems**: `#90d66f` (Green)
- **Practice**: `#9c57c0` (Purple)
- **Attitude**: `#f567ea` (Pink)

## 🔧 Key Features

### 1. VESPA Questionnaire
- 28-question psychometric assessment
- Real-time scoring across 5 dimensions
- Lead capture form
- Automated report generation
- Email delivery via SendGrid

### 2. Responsive Design
- Mobile-first approach
- Animated sections with fade-in effects
- Consistent styling across all pages

### 3. Portal Integration
- Coaching portal information
- Resource portal details
- Integration with external Knack database

### 4. Email Automation
- SendGrid integration for transactional emails
- Lead notifications to admin
- Report delivery to users

## 🚀 Deployment

The site is deployed on Vercel with:
- Automatic deployments from GitHub
- Environment variables for API keys
- Serverless functions for email handling

### Environment Variables Required
```
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@vespa-academy.com
SENDGRID_ADMIN_EMAIL=admin@vespa-academy.com
SENDGRID_REPORT_TEMPLATE_ID=your_template_id
PUBLIC_SITE_URL=https://vespa-academy.com
```

## 📝 Development

### Local Development
```bash
npm install
npm run dev
```

### Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🔗 External Integrations

- **Vercel** - Hosting and deployment
- **SendGrid** - Email delivery
- **Knack** - Database for portal functionality
- **Calendly** - Meeting scheduling
- **Google Analytics** - Website analytics

## 📄 License

© 2024 VESPA Academy. All rights reserved.

```sh
npm create astro@latest -- --template basics
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/basics)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/astro/tree/latest/examples/basics)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/withastro/astro?devcontainer_path=.devcontainer/basics/devcontainer.json)

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

![just-the-basics](https://github.com/withastro/astro/assets/2244813/a0a5533c-a856-4198-8470-2d67b1d7c554)

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
