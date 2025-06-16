import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    console.log('=== DEBUG API CALLED ===');
    
    // Get the request data but don't validate it
    let data;
    try {
      data = await request.json();
      console.log('Successfully parsed JSON:', Object.keys(data));
    } catch (e) {
      console.error('JSON parse error:', e);
      throw new Error('Invalid JSON data');
    }
    
    // Use hardcoded data for testing
    const testUserData = {
      name: 'Test User',
      email: 'tony@vespa.academy',
      school: 'Test School'
    };
    
    const testScores = {
      VISION: 8,
      EFFORT: 7,
      SYSTEMS: 9,
      PRACTICE: 6,
      ATTITUDE: 8
    };
    
    const testAverages = {
      VISION: 5.5,
      EFFORT: 5.2,
      SYSTEMS: 6.1,
      PRACTICE: 5.8,
      ATTITUDE: 5.9
    };
    
    // Get SendGrid configuration
    const SENDGRID_API_KEY = import.meta.env.SENDGRID_API_KEY;
    const SENDGRID_FROM_EMAIL = import.meta.env.SENDGRID_FROM_EMAIL; 
    const SENDGRID_REPORT_TEMPLATE_ID = import.meta.env.SENDGRID_REPORT_TEMPLATE_ID;
    
    console.log('SendGrid config check:', {
      hasApiKey: !!SENDGRID_API_KEY,
      hasFromEmail: !!SENDGRID_FROM_EMAIL,
      hasTemplateId: !!SENDGRID_REPORT_TEMPLATE_ID
    });
    
    if (!SENDGRID_API_KEY) {
      throw new Error('SendGrid API key not configured');
    }
    
    // Prepare minimal template data
    const templateData = {
      user_name: testUserData.name,
      user_email: testUserData.email,
      user_school: testUserData.school,
      report_date: new Date().toLocaleDateString('en-GB'),
      vision_score: testScores.VISION,
      effort_score: testScores.EFFORT,
      systems_score: testScores.SYSTEMS,
      practice_score: testScores.PRACTICE,
      attitude_score: testScores.ATTITUDE,
      overall_score: 8,
      vision_avg: testAverages.VISION.toFixed(2),
      effort_avg: testAverages.EFFORT.toFixed(2),
      systems_avg: testAverages.SYSTEMS.toFixed(2),
      practice_avg: testAverages.PRACTICE.toFixed(2),
      attitude_avg: testAverages.ATTITUDE.toFixed(2),
      report_html: '<div>Test Report HTML Content</div>',
      download_link: 'https://vespa-academy.com/test'
    };
    
    console.log('Template data prepared:', Object.keys(templateData));
    
    // Send email using SendGrid
    const sendGridResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: testUserData.email, name: testUserData.name }],
          dynamic_template_data: templateData
        }],
        from: {
          email: SENDGRID_FROM_EMAIL,
          name: 'VESPA Academy'
        },
        template_id: SENDGRID_REPORT_TEMPLATE_ID
      })
    });
    
    console.log('SendGrid response status:', sendGridResponse.status);
    
    if (!sendGridResponse.ok) {
      const errorText = await sendGridResponse.text();
      console.error('SendGrid error:', errorText);
      throw new Error(`SendGrid API error: ${sendGridResponse.status} - ${errorText}`);
    }
    
    return new Response(JSON.stringify({ 
      success: true,
      message: 'Debug email sent successfully',
      sentTo: testUserData.email
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Debug API error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      endpoint: 'debug'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}; 