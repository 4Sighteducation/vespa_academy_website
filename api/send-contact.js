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
    console.log('=== CONTACT FORM API RECEIVED DATA ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));

    const { name, email, school, message } = req.body;

    // Validate required fields
    if (!email || !name || !message) {
      console.log('VALIDATION FAILED: Missing required fields');
      return res.status(400).json({ error: 'Missing required fields: name, email, and message are required' });
    }

    // Build email content
    const timestamp = new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' });

    const emailContent = `New VESPA Contact Form Submission

=== CONTACT DETAILS ===
Name: ${name}
Email: ${email}
School/Institution: ${school || 'Not provided'}
Submitted: ${timestamp}

=== MESSAGE ===
${message}

This contact form submission was received via the VESPA Academy website contact page.
Please follow up with the contact details provided above.`;

    // Email configuration
    const emailAddresses = ['info@vespa.academy', 'admin@vespa.academy'];
    
    // Send emails to both addresses
    const sendPromises = emailAddresses.map(async (toEmail) => {
      const msg = {
        to: toEmail,
        from: process.env.SENDGRID_FROM_EMAIL,
        subject: `New VESPA Contact Form Submission from ${name}`,
        text: emailContent,
        html: emailContent.replace(/\n/g, '<br>').replace(/===/g, '<strong>===').replace(/===/g, '===</strong>')
      };

      console.log(`Sending contact form email to: ${toEmail}`);
      return sgMail.send(msg);
    });

    // Wait for all emails to send
    await Promise.all(sendPromises);

    console.log('Contact form emails sent successfully to both addresses');

    res.status(200).json({ 
      success: true, 
      message: 'Contact form submitted successfully' 
    });

  } catch (error) {
    console.error('Error sending contact form:', error);
    
    // Log detailed SendGrid error if available
    if (error.response && error.response.body && error.response.body.errors) {
      console.error('SendGrid errors:', JSON.stringify(error.response.body.errors, null, 2));
    }
    
    res.status(500).json({ 
      error: 'Failed to send contact form', 
      details: error.message,
      sendgrid_errors: error.response?.body?.errors || null
    });
  }
} 