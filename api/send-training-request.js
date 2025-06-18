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
    console.log('=== TRAINING REQUEST API RECEIVED DATA ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));

    const {
      firstName,
      lastName,
      organisation,
      email,
      areaCode,
      phoneNumber,
      trainingType,
      // Staff training fields
      staffSession,
      bespokeIdeas,
      bespokeRequirements,
      staffNumbers,
      plannedDate,
      locationPreference,
      startHour,
      startMinute,
      endHour,
      endMinute,
      additionalInfo,
      // Student training fields
      studentSession,
      studentAge,
      studentNumbers,
      studentLocationPreference,
      studentPlannedDate,
      studentAdditionalInfo
    } = req.body;

    // Validate required fields
    if (!email || !firstName || !lastName || !organisation) {
      console.log('VALIDATION FAILED: Missing required fields');
      return res.status(400).json({ error: 'Missing required fields: firstName, lastName, organisation, and email are required' });
    }

    // Build email content
    const timestamp = new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' });
    const fullName = `${firstName} ${lastName}`;
    const phone = areaCode && phoneNumber ? `${areaCode} ${phoneNumber}` : (phoneNumber || 'Not provided');
    const trainingTypes = Array.isArray(trainingType) ? trainingType.join(', ') : trainingType;

    let emailContent = `New VESPA Training Request

=== CONTACT DETAILS ===
Name: ${fullName}
Email: ${email}
Organisation: ${organisation}
Phone: ${phone}
Training Type Requested: ${trainingTypes}
Submitted: ${timestamp}

`;

    // Add staff training details if applicable
    if (trainingTypes.includes('staff-training') || trainingTypes.includes('both')) {
      emailContent += `=== STAFF TRAINING DETAILS ===
Session Type: ${staffSession || 'Not specified'}
Bespoke Ideas: ${bespokeIdeas || 'Not specified'}
Bespoke Requirements: ${bespokeRequirements || 'None provided'}
Staff Numbers: ${staffNumbers || 'Not specified'}
Planned Date: ${plannedDate || 'Not specified'}
Location Preference: ${locationPreference || 'Not specified'}
Planned Time: ${startHour || 'XX'}:${startMinute || 'XX'} - ${endHour || 'XX'}:${endMinute || 'XX'}
Additional Information: ${additionalInfo || 'None provided'}

`;
    }

    // Add student training details if applicable
    if (trainingTypes.includes('student-training') || trainingTypes.includes('both')) {
      emailContent += `=== STUDENT TRAINING DETAILS ===
Session Type: ${studentSession || 'Not specified'}
Student Age Group: ${studentAge || 'Not specified'}
Student Numbers: ${studentNumbers || 'Not specified'}
Location Preference: ${studentLocationPreference || 'Not specified'}
Planned Date: ${studentPlannedDate || 'Not specified'}
Additional Information: ${studentAdditionalInfo || 'None provided'}

`;
    }

    emailContent += `This request was submitted via the VESPA Academy training request form.
Please follow up with the contact details provided above.`;

    // Email configuration
    const emailAddresses = ['info@vespa.academy', 'admin@vespa.academy', 'martin@vespa.academy'];
    
    // Send emails to all addresses
    const sendPromises = emailAddresses.map(async (toEmail) => {
      const msg = {
        to: toEmail,
        from: process.env.SENDGRID_FROM_EMAIL,
        subject: `New VESPA Training Request from ${organisation}`,
        text: emailContent,
        html: emailContent.replace(/\n/g, '<br>').replace(/===/g, '<strong>===').replace(/===/g, '===</strong>')
      };

      console.log(`Sending training request email to: ${toEmail}`);
      return sgMail.send(msg);
    });

    // Wait for all emails to send
    await Promise.all(sendPromises);

    console.log('Training request emails sent successfully to all addresses');

    res.status(200).json({ 
      success: true, 
      message: 'Training request submitted successfully' 
    });

  } catch (error) {
    console.error('Error sending training request:', error);
    
    // Log detailed SendGrid error if available
    if (error.response && error.response.body && error.response.body.errors) {
      console.error('SendGrid errors:', JSON.stringify(error.response.body.errors, null, 2));
    }
    
    res.status(500).json({ 
      error: 'Failed to send training request', 
      details: error.message,
      sendgrid_errors: error.response?.body?.errors || null
    });
  }
} 