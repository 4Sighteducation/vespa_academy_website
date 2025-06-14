import sgMail from '@sendgrid/mail';

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

    // Log environment variables (without exposing the full key)
    console.log('Environment check:');
    console.log('SENDGRID_API_KEY exists:', !!process.env.SENDGRID_API_KEY);
    console.log('SENDGRID_API_KEY length:', process.env.SENDGRID_API_KEY?.length);
    console.log('SENDGRID_FROM_EMAIL:', process.env.SENDGRID_FROM_EMAIL);
    console.log('SENDGRID_REPORT_TEMPLATE_ID:', process.env.SENDGRID_REPORT_TEMPLATE_ID);

    // Simple test email
    const msg = {
      to: 'test@example.com',
      from: process.env.SENDGRID_FROM_EMAIL,
      templateId: process.env.SENDGRID_REPORT_TEMPLATE_ID,
      dynamicTemplateData: {
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
      }
    };

    console.log('Attempting to send email with config:', {
      to: msg.to,
      from: msg.from,
      templateId: msg.templateId,
      hasTemplateData: !!msg.dynamicTemplateData
    });

    await sgMail.send(msg);

    res.status(200).json({ 
      success: true, 
      message: 'Test email sent successfully',
      config: {
        from: msg.from,
        templateId: msg.templateId
      }
    });

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
      error: 'Failed to send test email', 
      details: errorDetails
    });
  }
} 