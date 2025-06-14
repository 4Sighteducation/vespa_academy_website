# SiteGround DNS Configuration for Vercel Hosting

## Overview
This guide will help you point your domain from SiteGround to Vercel while keeping your email services intact.

## Important: What This Preserves
✅ Your email accounts will continue working normally  
✅ Your domain registration stays with SiteGround  
✅ Only the website traffic will go to Vercel  

## Step-by-Step Instructions

### 1. Log into SiteGround
1. Go to https://my.siteground.com
2. Navigate to **Services** → **Domains**
3. Click on **vespa.academy**

### 2. Access DNS Zone Editor
1. Click on **DNS Zone Editor** or **Manage DNS**
2. You'll see a list of your current DNS records

### 3. Update/Add These Records

**IMPORTANT**: Only modify the records listed below. Leave all email-related records (MX, TXT for email) untouched!

#### A Records (for root domain)
- **Delete** any existing A records for `vespa.academy` (@ or blank host)
- **Add** this new A record:
  - **Host**: @ (or leave blank)
  - **Type**: A
  - **Points to**: `76.76.21.21`
  - **TTL**: 3600 (or default)

#### A Records (for www)
- **Delete** any existing A records for `www.vespa.academy`
- **Add** this new A record:
  - **Host**: www
  - **Type**: A
  - **Points to**: `76.76.21.21`
  - **TTL**: 3600 (or default)

#### Alternative: CNAME for www (optional)
Instead of an A record for www, you can use:
- **Host**: www
- **Type**: CNAME
- **Points to**: `cname.vercel-dns.com`
- **TTL**: 3600

### 4. Records to KEEP (Don't Delete!)
⚠️ **DO NOT DELETE OR MODIFY**:
- **MX records** (for email)
- **TXT records** containing SPF, DKIM, or DMARC (for email authentication)
- **Any records for mail, webmail, smtp, imap, pop subdomains**

### 5. Save Changes
Click **Save** or **Update** to apply the changes.

## Verification

### DNS Propagation
- Changes can take 5 minutes to 48 hours to propagate globally
- Usually it's much faster (5-30 minutes)

### Check Your Configuration
After 15-30 minutes, visit:
1. https://vespa.academy - Should load your new site
2. https://www.vespa.academy - Should also load your new site
3. Send a test email to/from your vespa.academy email - Should work normally

### Verify in Vercel
Run this command to check domain status:
```bash
vercel domains ls
```

## Troubleshooting

### Site Not Loading?
1. Clear your browser cache
2. Try a different browser or incognito mode
3. Check DNS propagation: https://dnschecker.org/#A/vespa.academy

### Email Stopped Working?
This means you accidentally deleted/modified email records. In SiteGround:
1. Check that all MX records are still present
2. Restore any deleted email-related records
3. Contact SiteGround support if needed

### SSL Certificate Issues?
Vercel automatically provisions SSL certificates. If you see warnings:
1. Wait 10-15 minutes after DNS changes
2. The certificate will be automatically generated

## Future Updates

Once this is set up, website updates are automatic:
1. Make changes to your code
2. Push to GitHub
3. Vercel automatically deploys in ~30 seconds
4. No need to touch DNS settings again!

## Need Help?
- **Vercel Support**: https://vercel.com/support
- **SiteGround Support**: Available 24/7 through your account
- **DNS Checker**: https://dnschecker.org/#A/vespa.academy 