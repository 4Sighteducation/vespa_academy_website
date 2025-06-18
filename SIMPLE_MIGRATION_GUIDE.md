# 🚀 VESPA Academy - Simple Migration Guide

## Quick Overview
- **Website:** Moving to Vercel (free, faster)
- **Email:** Stays on Siteground (no changes)
- **Domain:** Stays owned by Siteground
- **Old files:** Stay on Siteground

---

## 📋 Step 1: Pre-Launch Check

### Test your site on Vercel:
1. Go to your Vercel dashboard
2. Your preview URL should be something like: `vespa-academy-new.vercel.app`
3. Test everything works:
   - [ ] Homepage loads
   - [ ] Navigation works
   - [ ] Contact form works
   - [ ] PDFs download
   - [ ] Questionnaire works

---

## 🌐 Step 2: Add Domain to Vercel

1. **In Vercel Dashboard:**
   - Go to your project
   - Click "Settings" → "Domains"
   - Add: `vespa.academy`
   - Add: `www.vespa.academy`
   - Vercel will show you some DNS records

2. **Copy these DNS records** (they'll look something like):
   ```
   A     @     76.76.21.21
   CNAME www   cname.vercel-dns.com
   ```

---

## 🔧 Step 3: Update DNS (Keep Email Working!)

1. **Login to Siteground**
   - Go to Site Tools
   - Select your domain
   - Go to "Domain" → "DNS Zone Editor"

2. **Screenshot Current Settings** (IMPORTANT!)
   - Take a screenshot of ALL records
   - Especially note the MX records (these are for email)

3. **Update ONLY Web Records:**
   - Find the A record for `@` → Change to Vercel's IP
   - Find the CNAME for `www` → Change to Vercel's CNAME
   - ⚠️ **DO NOT TOUCH:** MX records, TXT records, or email-related records

4. **Your DNS should look like:**
   ```
   Type  Host   Points To              (What it does)
   A     @      76.76.21.21           (Vercel website)
   CNAME www    cname.vercel-dns.com  (Vercel website)
   MX    @      mx.siteground.com     (Keep email working!)
   TXT   @      [email records]       (Keep email working!)
   ```

---

## ✅ Step 4: Verify Everything

After 5-30 minutes:
- [ ] Visit https://vespa.academy - Should show new site
- [ ] Visit https://www.vespa.academy - Should show new site
- [ ] Send test email to your @vespa.academy address - Should work
- [ ] Reply from your @vespa.academy address - Should work

---

## 🆘 If Something Goes Wrong

**Website not showing?**
- DNS can take up to 24 hours (but usually 5-30 mins)
- Try clearing browser cache
- Try incognito/private browsing

**Email stopped working?**
- You probably changed MX records by mistake
- Go back to Siteground DNS
- Restore MX records from your screenshot

**Need to rollback?**
- Change A and CNAME records back to original
- Site will revert in 5-10 minutes

---

## 📞 Support Contacts

- **Siteground Support:** For DNS/email issues
- **Vercel Community:** https://vercel.com/help
- **Me:** Ready to help with next steps!

---

## 🎉 Success Checklist

- [ ] New site live at vespa.academy
- [ ] Email still working perfectly
- [ ] Old file links still work (if needed)
- [ ] Ready to add schools map page
- [ ] Consider submitting new sitemap to Google

That's it! Much simpler without worrying about old URLs. 🚀 