# 🔐 Environment Variables Setup for Vercel

## Required Variables

You need to set these in your Vercel project settings:

### SendGrid Configuration
```
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=noreply@vespa.academy
SENDGRID_ADMIN_EMAIL=your_admin_email@vespa.academy
SENDGRID_REPORT_TEMPLATE_ID=your_report_template_id
SENDGRID_LEAD_EMAIL_ID=your_lead_notification_template_id
```

### Site Configuration
```
PUBLIC_SITE_URL=https://vespa.academy
```

## How to Set in Vercel

1. Go to your Vercel Dashboard
2. Select your `vespa-academy` project
3. Go to "Settings" tab
4. Click on "Environment Variables"
5. Add each variable:
   - Name: Copy the variable name exactly as shown above
   - Value: Your actual values
   - Environment: Select "Production", "Preview", and "Development"
6. Click "Save" for each variable

## Getting SendGrid Values

If you don't have these yet:

1. **SENDGRID_API_KEY**: 
   - Login to SendGrid
   - Settings → API Keys → Create API Key
   - Give it full access
   - Copy the key (you can't see it again!)

2. **Template IDs**:
   - In SendGrid → Email API → Dynamic Templates
   - Find your templates and copy their IDs

## Important Notes

- ⚠️ Never commit these values to GitHub
- ✅ Environment variables are secure in Vercel
- 🔄 Changes take effect on next deployment
- 📧 Test email sending after setup

## Testing

After setting up:
1. Deploy your site
2. Test the questionnaire form
3. Check if emails are sent correctly 