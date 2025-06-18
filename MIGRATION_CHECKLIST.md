# VESPA Academy Website Migration Checklist

## 🎯 Overview
Migrating from Mobirise (Siteground) → Astro (Vercel)

## ✅ Pre-Launch Checklist

### 1. **SEO Preparation** ✓ DONE
- [x] Created 301 redirects for all old URLs
- [x] Mapped old pages to new equivalents
- [ ] Copy important meta tags from old site

### 2. **Content Migration**
- [ ] Copy any missing PDF files to `vespa-academy-new/public/assets/`
- [ ] Upload any worksheets to `vespa-academy-new/public/worksheets/`
- [ ] Ensure all images are in the new site

### 3. **Files to Keep on Siteground**
These can stay on Siteground if needed:
- Large PDF collections
- Historical files
- Any member-only content

## 🚀 Launch Steps

### Step 1: Deploy to Vercel (Test)
1. Go to your Vercel dashboard
2. Click on your vespa-academy project
3. Click "Visit" to see the preview URL
4. Test all pages thoroughly

### Step 2: Pre-Launch Testing
- [ ] Test all navigation links
- [ ] Test contact forms
- [ ] Test PDF downloads
- [ ] Check mobile responsiveness
- [ ] Test questionnaire functionality
- [ ] Verify API endpoints work

### Step 3: DNS Migration (Launch Day)

#### Option A: Full Migration (Recommended)
1. **In Siteground:**
   - Go to Site Tools → Domain → DNS Zone Editor
   - Take screenshots of all records for backup

2. **In Vercel:**
   - Go to Project Settings → Domains
   - Add `vespa.academy` and `www.vespa.academy`
   - Vercel will provide DNS records

3. **Update DNS:**
   - Change your domain's nameservers to Vercel's OR
   - Update A/CNAME records to point to Vercel

#### Option B: Keep Siteground for Files
1. Point only the web traffic to Vercel
2. Keep email and file storage on Siteground
3. Update only A/CNAME records, not nameservers

### Step 4: Post-Launch Tasks
- [ ] Submit new sitemap to Google Search Console
- [ ] Monitor 404 errors in Vercel Analytics
- [ ] Test all redirects are working
- [ ] Check Google Search Console for crawl errors
- [ ] Update any external links pointing to .html URLs

## 📧 Email Considerations

**Important:** If your email is hosted on Siteground:
- Option A: Keep email on Siteground (update MX records in Vercel)
- Option B: Migrate to a dedicated email service

## 🔍 SEO Preservation

Your SEO will be preserved because:
1. ✅ Domain remains the same
2. ✅ 301 redirects handle URL changes
3. ✅ Content is preserved/improved
4. ✅ Site structure is maintained

## 📊 Monitoring After Launch

1. **Google Search Console**
   - Check for crawl errors
   - Monitor search performance
   - Submit new sitemap

2. **Analytics**
   - Ensure tracking code is installed
   - Monitor traffic patterns
   - Watch for 404 errors

## 🆘 Rollback Plan

If issues arise:
1. Keep Siteground active for 30 days
2. DNS changes can be reverted in 5-10 minutes
3. Take full backup before migration

## 📝 Notes

- **Downtime:** Expect 0-5 minutes during DNS propagation
- **Propagation:** Full DNS update takes 24-48 hours globally
- **Testing:** Use incognito/private browsing to test

## 🎉 Success Indicators

- [ ] Site loads on vespa.academy
- [ ] All pages accessible
- [ ] Forms working
- [ ] No 404 errors for main pages
- [ ] Email still working
- [ ] Search rankings maintained 