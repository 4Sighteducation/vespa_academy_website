# SendGrid Marketing Email Guide

## Overview
This guide explains how to use the VESPA marketing email template with SendGrid.

## Email Features

### Mobile Responsive Design
- Fully responsive for all devices
- Optimized for smartphones, tablets, and desktop
- Touch-friendly buttons and spacing
- Readable font sizes on all screens

### Dynamic Variables
The email uses the following SendGrid variables:
- `{{first_name}}` - Recipient's first name
- `{{organisation}}` - Recipient's school/organization name
- `%unsubscribe%` - SendGrid unsubscribe link
- `%preferences%` - SendGrid preference center link

### Key Sections
1. **Header** - VESPA logo and impact statement
2. **Stats Banner** - 600+ schools, 15+ countries, 50,000+ students
3. **Trusted Schools** - Dubai College, Bangkok Prep, Al Yasmina Academy
4. **Personal Greeting** - Uses {{first_name}} and {{organisation}}
5. **Testimonials** - Real results from schools
6. **Problem/Solution** - Clear value proposition
7. **Features** - 4 key benefits with icons
8. **Social Proof** - Performance metrics
9. **CTA Buttons** - Schedule call and view resources
10. **Footer** - Contact info and links

## SendGrid Setup

### 1. Create Dynamic Template
1. Log into SendGrid
2. Go to Email API > Dynamic Templates
3. Create new template
4. Paste the HTML from `marketingemail1.html`
5. Note your Template ID

### 2. Test Data Files
Two test data files are provided:
- `sendgrid-test-data.json` - Multiple recipients for batch testing
- `sendgrid-single-test.json` - Single recipient for development

### 3. Using the API
```bash
curl --request POST \
  --url https://api.sendgrid.com/v3/mail/send \
  --header 'Authorization: Bearer YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --data-binary @sendgrid-test-data.json
```

### 4. Template Variables
Make sure your contact lists include:
- `first_name` - Required (fallback to "Educator" if missing)
- `organisation` - Required (fallback to "your school" if missing)
- `email` - Required

## Best Practices

### Subject Lines
Consider A/B testing these options:
- "Transform Your Students' Mindset & Academic Performance"
- "{{organisation}} - Evidence-Based Student Success Programme"
- "Join 600+ International Schools Using VESPA"

### Sending Times
- Tuesday-Thursday, 9-11 AM recipient's time zone
- Avoid Mondays and Fridays
- Test different times for your audience

### Segmentation
Consider segmenting by:
- School type (British, American, IB)
- Location (Middle East, Asia, Europe)
- Role (Principal, Head of Sixth Form, Academic Director)

## Tracking

The template includes:
- Open tracking
- Click tracking (buttons and links)
- Categories for reporting
- Custom campaign arguments

## Mobile Testing

Test on:
- iPhone (Safari, Gmail app)
- Android (Chrome, Gmail app)
- iPad/Tablets
- Desktop (Outlook, Gmail, Apple Mail)

## Fallbacks

For recipients without HTML support:
- Create a plain text version
- Include key information
- Simple formatting
- Direct links to CTAs

## Compliance

The email includes:
- Unsubscribe link
- Physical address
- Clear sender identification
- Preference center link 