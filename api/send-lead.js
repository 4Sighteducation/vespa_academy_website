import sgMail from '@sendgrid/mail';

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('=== LEAD EMAIL API RECEIVED DATA ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));

    const { name, email, jobTitle, school, interests } = req.body;

    // Validate required fields
    if (!email || !name) {
      console.log('VALIDATION FAILED: Missing email or name');
      return res.status(400).json({ error: 'Missing required fields: email and name are required' });
    }

    // Prepare template data for SendGrid
    const templateData = {
      user_name: name,
      user_email: email,
      user_job_title: jobTitle || 'Not provided',
      user_school: school || 'Not provided',
      user_interests: Array.isArray(interests) ? interests.join(', ') : (interests || 'Not provided'),
      timestamp: new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' }),
      registration_date: new Date().toLocaleDateString('en-GB', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    };

    console.log('Template data prepared:', templateData);

    // Send lead notification email using SendGrid template
    const msg = {
      to: process.env.SENDGRID_ADMIN_EMAIL,
      from: process.env.SENDGRID_FROM_EMAIL,
      templateId: process.env.SENDGRID_LEAD_EMAIL_ID,
      dynamicTemplateData: templateData
    };

    console.log('Sending lead email to:', process.env.SENDGRID_ADMIN_EMAIL);
    console.log('Using template ID:', process.env.SENDGRID_LEAD_EMAIL_ID);

    await sgMail.send(msg);

    console.log('Lead email sent successfully');

    res.status(200).json({ 
      success: true, 
      message: 'Lead notification sent successfully'
    });

  } catch (error) {
    console.error('Error sending lead notification:', error);
    
    // Log detailed SendGrid error if available
    if (error.response && error.response.body && error.response.body.errors) {
      console.error('SendGrid errors:', JSON.stringify(error.response.body.errors, null, 2));
    }
    
    res.status(500).json({ 
      error: 'Failed to send lead notification', 
      details: error.message,
      sendgrid_errors: error.response?.body?.errors || null
    });
  }
} 