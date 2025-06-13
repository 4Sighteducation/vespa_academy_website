import type { APIRoute } from 'astro';

export const prerender = false; // This route needs server-side rendering

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    // Get the request data
    const data = await request.json();
    const { 
      userData, 
      reportHTML, 
      scores, 
      averages 
    } = data;

    // Get location information
    const userAgent = request.headers.get('user-agent') || 'Unknown';
    const referrer = request.headers.get('referer') || 'Direct';
    const userIP = clientAddress || request.headers.get('x-forwarded-for') || 'Unknown';

    // Get SendGrid configuration from environment variables
    const SENDGRID_API_KEY = import.meta.env.SENDGRID_API_KEY;
    const SENDGRID_FROM_EMAIL = import.meta.env.SENDGRID_FROM_EMAIL;
    const SENDGRID_ADMIN_EMAIL = import.meta.env.SENDGRID_ADMIN_EMAIL;
    const SENDGRID_REPORT_TEMPLATE_ID = import.meta.env.SENDGRID_REPORT_TEMPLATE_ID;

    if (!SENDGRID_API_KEY) {
      throw new Error('SendGrid API key not configured');
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
      vision_score: scores.VISION,
      effort_score: scores.EFFORT,
      systems_score: scores.SYSTEMS,
      practice_score: scores.PRACTICE,
      attitude_score: scores.ATTITUDE,
      overall_score: Math.round((Object.values(scores) as number[]).reduce((a: number, b: number) => a + b, 0) / Object.keys(scores).length),
      vision_avg: averages.VISION.toFixed(2),
      effort_avg: averages.EFFORT.toFixed(2),
      systems_avg: averages.SYSTEMS.toFixed(2),
      practice_avg: averages.PRACTICE.toFixed(2),
      attitude_avg: averages.ATTITUDE.toFixed(2),
      report_html: reportHTML,
      download_link: `${import.meta.env.PUBLIC_SITE_URL || 'https://vespa-academy.com'}/api/download-report?token=${generateToken()}`
    };

    // Send email to user
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

    // Read the admin email template
    const adminTemplateResponse = await fetch(new URL('../../../LEAD_EMAIL.html', import.meta.url));
    let adminTemplate = await adminTemplateResponse.text();
    
    // Prepare admin template data
    const adminTemplateData = {
      user_name: userData.name,
      user_email: userData.email,
      user_school: userData.school,
      user_level: userData.level || 'Not specified',
      completion_date: reportDate,
      vision_score: scores.VISION,
      vision_avg: averages.VISION.toFixed(2),
      vision_class: getScoreClass(scores.VISION),
      effort_score: scores.EFFORT,
      effort_avg: averages.EFFORT.toFixed(2),
      effort_class: getScoreClass(scores.EFFORT),
      systems_score: scores.SYSTEMS,
      systems_avg: averages.SYSTEMS.toFixed(2),
      systems_class: getScoreClass(scores.SYSTEMS),
      practice_score: scores.PRACTICE,
      practice_avg: averages.PRACTICE.toFixed(2),
      practice_class: getScoreClass(scores.PRACTICE),
      attitude_score: scores.ATTITUDE,
      attitude_avg: averages.ATTITUDE.toFixed(2),
      attitude_class: getScoreClass(scores.ATTITUDE),
      overall_score: templateData.overall_score,
      user_ip: userIP,
      user_location: 'To be determined', // You could integrate with an IP geolocation service
      user_agent: userAgent,
      referrer_url: referrer,
      lead_quality: leadQuality,
      follow_up_priority: scores.VISION < 6 || scores.EFFORT < 6 ? 'High' : 'Normal',
      timestamp: new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })
    };
    
    // Replace all placeholders in the template
    Object.entries(adminTemplateData).forEach(([key, value]) => {
      adminTemplate = adminTemplate.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
    });

    // Send notification email to admin
    const adminEmailResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: SENDGRID_ADMIN_EMAIL }],
          subject: `New VESPA Lead: ${userData.name} - ${userData.school}`
        }],
        from: {
          email: SENDGRID_FROM_EMAIL,
          name: 'VESPA Academy'
        },
        content: [{
          type: 'text/html',
          value: adminTemplate
        }]
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
    console.error('Error sending report:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send report'
    }), {
      status: 500,
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