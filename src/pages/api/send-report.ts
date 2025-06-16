import type { APIRoute } from 'astro';

export const prerender = false; // This route needs server-side rendering

export const POST: APIRoute = async ({ request, clientAddress }) => {
  console.log('=== API CALLED ===');
  console.log('Request method:', request.method);
  console.log('Request headers:', Object.fromEntries(request.headers.entries()));
  
  try {
    // Get the request data with better error handling
    console.log('Attempting to parse JSON...');
    const data = await request.json();
    console.log('JSON parsed successfully');
    console.log('Received data structure:', JSON.stringify(data, null, 2));
    
    const { 
      userData, 
      reportHTML, 
      scores, 
      averages,
      currentScales,
      currentAverages 
    } = data;
    
    // Handle both possible field names for backwards compatibility
    const scoresData = scores || currentScales;
    const averagesData = averages || currentAverages;
    
    console.log('userData:', userData);
    console.log('scores/currentScales:', scoresData);
    console.log('averages/currentAverages:', averagesData);
    console.log('reportHTML length:', reportHTML ? reportHTML.length : 'undefined');
    
    // Validate required fields
    if (!userData || !userData.email || !userData.name) {
      console.error('Missing userData fields:', { userData });
      throw new Error('Missing required user data (email or name)');
    }
    
    if (!scoresData || typeof scoresData !== 'object') {
      console.error('Missing or invalid scores:', { scoresData });
      throw new Error('Missing required scores data');
    }
    
    if (!averagesData || typeof averagesData !== 'object') {
      console.error('Missing or invalid averages:', { averagesData });
      throw new Error('Missing required averages data');
    }
    
    if (!reportHTML) {
      console.error('Missing reportHTML');
      throw new Error('Missing report HTML content');
    }

    // Get location information
    const userAgent = request.headers.get('user-agent') || 'Unknown';
    const referrer = request.headers.get('referer') || 'Direct';
    const userIP = clientAddress || request.headers.get('x-forwarded-for') || 'Unknown';

    // Get SendGrid configuration from environment variables
    const SENDGRID_API_KEY = import.meta.env.SENDGRID_API_KEY;
    const SENDGRID_FROM_EMAIL = import.meta.env.SENDGRID_FROM_EMAIL;
    const SENDGRID_ADMIN_EMAIL = import.meta.env.SENDGRID_ADMIN_EMAIL;
    const SENDGRID_REPORT_TEMPLATE_ID = import.meta.env.SENDGRID_REPORT_TEMPLATE_ID;
    const SENDGRID_LEAD_EMAIL_ID = import.meta.env.SENDGRID_LEAD_EMAIL_ID;

    if (!SENDGRID_API_KEY) {
      throw new Error('SendGrid API key not configured');
    }

    if (!SENDGRID_REPORT_TEMPLATE_ID) {
      throw new Error('SendGrid report template ID not configured');
    }

    if (!SENDGRID_LEAD_EMAIL_ID) {
      throw new Error('SendGrid lead email template ID not configured');
    }

    // Format the date
    const reportDate = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    // Prepare template data
    const templateData = {
      user_name: userData.name,
      user_email: userData.email,
      user_school: userData.school,
      report_date: reportDate,
      vision_score: scoresData.VISION,
      effort_score: scoresData.EFFORT,
      systems_score: scoresData.SYSTEMS,
      practice_score: scoresData.PRACTICE,
      attitude_score: scoresData.ATTITUDE,
      overall_score: Math.round((Object.values(scoresData) as number[]).reduce((a: number, b: number) => a + b, 0) / Object.keys(scoresData).length),
      vision_avg: averagesData.VISION.toFixed(2),
      effort_avg: averagesData.EFFORT.toFixed(2),
      systems_avg: averagesData.SYSTEMS.toFixed(2),
      practice_avg: averagesData.PRACTICE.toFixed(2),
      attitude_avg: averagesData.ATTITUDE.toFixed(2),
      report_html: reportHTML,
      download_link: `${import.meta.env.PUBLIC_SITE_URL || 'https://vespa-academy.com'}/api/download-report?token=${Math.random().toString(36).substring(2) + Date.now().toString(36)}`
    };

    // Send email to user using SendGrid template
    const userEmailResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: userData.email, name: userData.name }],
          dynamic_template_data: templateData
        }],
        from: {
          email: SENDGRID_FROM_EMAIL,
          name: 'VESPA Academy'
        },
        template_id: SENDGRID_REPORT_TEMPLATE_ID
      })
    });

    if (!userEmailResponse.ok) {
      const error = await userEmailResponse.text();
      console.error('SendGrid error (user):', error);
      throw new Error('Failed to send email to user');
    }

    // Helper function to determine score class
    const getScoreClass = (score: number) => {
      if (score < 4) return 'score-very-low';
      if (score < 6) return 'score-low';
      if (score < 8) return 'score-medium';
      return 'score-high';
    };

    // Determine lead quality based on school type
    const leadQuality = userData.school.toLowerCase().includes('college') || 
                       userData.school.toLowerCase().includes('university') || 
                       userData.school.toLowerCase().includes('academy') ? 'High' : 'Medium';

    // Format interests for display
    const interestsDisplay = userData.interests && userData.interests.length > 0 
      ? userData.interests.join(', ') 
      : 'Not specified';
    
    // Prepare admin template data for SendGrid template
    const adminTemplateData = {
      user_name: userData.name,
      user_email: userData.email,
      user_school: userData.school,
      user_job_title: userData.jobTitle || 'Not specified',
      user_interests: interestsDisplay,
      user_level: data.level || 'Not specified',
      completion_date: reportDate,
      vision_score: scoresData.VISION,
      vision_avg: averagesData.VISION.toFixed(2),
      vision_class: getScoreClass(scoresData.VISION),
      effort_score: scoresData.EFFORT,
      effort_avg: averagesData.EFFORT.toFixed(2),
      effort_class: getScoreClass(scoresData.EFFORT),
      systems_score: scoresData.SYSTEMS,
      systems_avg: averagesData.SYSTEMS.toFixed(2),
      systems_class: getScoreClass(scoresData.SYSTEMS),
      practice_score: scoresData.PRACTICE,
      practice_avg: averagesData.PRACTICE.toFixed(2),
      practice_class: getScoreClass(scoresData.PRACTICE),
      attitude_score: scoresData.ATTITUDE,
      attitude_avg: averagesData.ATTITUDE.toFixed(2),
      attitude_class: getScoreClass(scoresData.ATTITUDE),
      overall_score: templateData.overall_score,
      user_ip: userIP,
      user_location: 'To be determined', // You could integrate with an IP geolocation service
      user_agent: userAgent,
      referrer_url: referrer,
      lead_quality: leadQuality,
      follow_up_priority: scoresData.VISION < 6 || scoresData.EFFORT < 6 ? 'High' : 'Normal',
      timestamp: new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })
    };

    // Send notification email to admin using SendGrid template
    const adminEmailResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: SENDGRID_ADMIN_EMAIL }],
          dynamic_template_data: adminTemplateData
        }],
        from: {
          email: SENDGRID_FROM_EMAIL,
          name: 'VESPA Academy'
        },
        template_id: SENDGRID_LEAD_EMAIL_ID
      })
    });

    if (!adminEmailResponse.ok) {
      console.error('SendGrid error (admin):', await adminEmailResponse.text());
      // Don't throw here - user email was successful
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Report sent successfully'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('=== ERROR OCCURRED ===');
    console.error('Error type:', typeof error);
    console.error('Error name:', error instanceof Error ? error.name : 'Unknown');
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    console.error('Full error:', error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to send report';
    const statusCode = errorMessage.includes('Missing required') || errorMessage.includes('not configured') ? 400 : 500;
    
    return new Response(JSON.stringify({ 
      success: false,
      error: errorMessage,
      details: error instanceof Error ? error.stack : String(error)
    }), {
      status: statusCode,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

// Simple token generator for download links
function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
} 