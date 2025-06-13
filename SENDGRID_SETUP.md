# SendGrid Email Setup Guide

## Overview
This guide explains how to set up SendGrid for the VESPA Academy website to send assessment reports and capture leads.

## Environment Variables

Add these to your `.env` file:

```env
# SendGrid Configuration
SENDGRID_API_KEY=your_actual_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=noreply@vespa-academy.com
SENDGRID_ADMIN_EMAIL=info@vespa.academy
SENDGRID_REPORT_TEMPLATE_ID=your_sendgrid_template_id_here

# Site URL (for download links)
PUBLIC_SITE_URL=https://vespa-academy.com
```

## Email Templates

### 1. User Report Email (REPORT_TEMPLATE.html)

This template is sent to users who complete the VESPA questionnaire. It includes:

- Personalized greeting
- VESPA scores table with averages
- Download link for the full PDF report
- Calendar booking link for a 15-minute demo
- Company contact information

**Dynamic Variables:**
- `{{user_name}}` - User's full name
- `{{user_school}}` - User's school/organization
- `{{vision_score}}`, `{{effort_score}}`, etc. - Individual VESPA scores
- `{{vision_avg}}`, `{{effort_avg}}`, etc. - Average scores for comparison
- `{{overall_score}}` - Combined overall score
- `{{download_link}}` - Unique link to download the PDF report

### 2. Admin Lead Notification (LEAD_EMAIL.html)

This template notifies administrators when someone completes the questionnaire. It includes:

- User contact information
- School/organization details
- Complete VESPA scores with visual indicators
- Location information (IP, browser, referrer)
- Lead quality assessment
- Quick action buttons

**Dynamic Variables:**
- All user information fields
- Score values with color-coded classes
- `{{user_ip}}` - User's IP address
- `{{user_location}}` - Geographic location (if available)
- `{{user_agent}}` - Browser information
- `{{referrer_url}}` - Where the user came from
- `{{lead_quality}}` - Automatic lead scoring
- `{{follow_up_priority}}` - Based on scores

## SendGrid Setup Steps

### 1. Create SendGrid Account
1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Verify your sender domain
3. Create an API key with full access

### 2. Create Dynamic Template (Optional)
1. Go to Email API > Dynamic Templates
2. Create a new template
3. Copy the template ID
4. Design your template using the SendGrid editor
5. Use the same variable names as listed above

### 3. Using HTML Templates
If you prefer to use the HTML templates directly:
- The system will automatically use the HTML files in the project
- No need to create templates in SendGrid
- Just ensure the API key and sender email are configured

## Testing

1. Set up a test environment with your SendGrid credentials
2. Complete the questionnaire with a test email
3. Verify both emails are received:
   - User receives the report with download link
   - Admin receives the lead notification

## Calendar Integration

The calendar link in the emails points to:
`https://calendly.com/vespaacademy/15minmeeting`

Make sure this Calendly event is properly configured and active.

## Security Notes

- Never commit the `.env` file to version control
- Use environment variables in production (Heroku, Vercel, etc.)
- Regularly rotate your SendGrid API key
- Monitor your SendGrid dashboard for unusual activity

## Troubleshooting

### Email not sending
1. Check SendGrid API key is valid
2. Verify sender email is authenticated
3. Check SendGrid dashboard for errors
4. Review server logs for error messages

### Template variables not replacing
1. Ensure variable names match exactly (case-sensitive)
2. Check that all data is being passed to the template
3. Verify the template ID is correct

### Location data not showing
- The basic implementation captures IP address
- For detailed location, integrate with a geolocation service
- Consider privacy regulations (GDPR) when collecting location data 