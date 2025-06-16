import sgMail from '@sendgrid/mail';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Initialize SendGrid
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    // Check if this is a custom email (lead notification) or test email
    const { to, subject, html } = req.body;
    
    if (to && subject && html) {
      // This is a custom email (e.g., lead notification)
      const msg = {
        to: to,
        from: process.env.SENDGRID_FROM_EMAIL,
        subject: subject,
        html: html
      };

      await sgMail.send(msg);

      res.status(200).json({ 
        success: true, 
        message: 'Email sent successfully'
      });
    } else {
      // This is a test email - use the template
      // Read the HTML template
      const templatePath = path.join(process.cwd(), 'REPORT_TEMPLATE.html');
      let htmlContent = fs.readFileSync(templatePath, 'utf8');

      // Replace placeholders with test data
      const testData = {
        user_name: 'Test User',
        user_email: 'test@example.com',
        user_school: 'Test School',
        vision_score: 7.5,
        vision_avg: 6.8,
        effort_score: 8.2,
        effort_avg: 7.1,
        systems_score: 6.9,
        systems_avg: 6.5,
        practice_score: 7.8,
        practice_avg: 7.2,
        attitude_score: 8.5,
        attitude_avg: 7.9,
        overall_score: 7.8,
        download_link: 'https://www.vespa.academy'
      };

      // Replace all placeholders in the HTML
      Object.keys(testData).forEach(key => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        htmlContent = htmlContent.replace(regex, testData[key]);
      });

      // Simple test email using HTML content
      const msg = {
        to: 'tony@vespa.academy', // Using a real email for testing
        from: process.env.SENDGRID_FROM_EMAIL,
        subject: 'Your VESPA Assessment Report - Test Email',
        html: htmlContent
      };

      console.log('Attempting to send email with config:', {
        to: msg.to,
        from: msg.from,
        subject: msg.subject,
        hasHtmlContent: !!msg.html
      });

      await sgMail.send(msg);

      res.status(200).json({ 
        success: true, 
        message: 'Test email sent successfully',
        config: {
          from: msg.from,
          to: msg.to,
          subject: msg.subject
        }
      });
    }

  } catch (error) {
    console.error('SendGrid Error:', error);
    
    // Extract detailed error information
    let errorDetails = {
      message: error.message,
      code: error.code
    };

    if (error.response && error.response.body && error.response.body.errors) {
      errorDetails.sendgrid_errors = error.response.body.errors;
      console.error('SendGrid API Errors:', JSON.stringify(error.response.body.errors, null, 2));
    }

    res.status(500).json({ 
      error: 'Failed to send email', 
      details: errorDetails
    });
  }
} 