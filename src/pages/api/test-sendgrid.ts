import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    // Check environment variables
    const SENDGRID_API_KEY = import.meta.env.SENDGRID_API_KEY;
    const SENDGRID_FROM_EMAIL = import.meta.env.SENDGRID_FROM_EMAIL;
    const SENDGRID_ADMIN_EMAIL = import.meta.env.SENDGRID_ADMIN_EMAIL;
    const SENDGRID_REPORT_TEMPLATE_ID = import.meta.env.SENDGRID_REPORT_TEMPLATE_ID;

    const config = {
      hasApiKey: !!SENDGRID_API_KEY,
      hasFromEmail: !!SENDGRID_FROM_EMAIL,
      hasAdminEmail: !!SENDGRID_ADMIN_EMAIL,
      hasTemplateId: !!SENDGRID_REPORT_TEMPLATE_ID,
      apiKeyLength: SENDGRID_API_KEY ? SENDGRID_API_KEY.length : 0,
      fromEmail: SENDGRID_FROM_EMAIL || 'Not set',
      adminEmail: SENDGRID_ADMIN_EMAIL || 'Not set'
    };

    if (!SENDGRID_API_KEY) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'SendGrid API key not configured',
        config
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Test SendGrid API connection
    const testResponse = await fetch('https://api.sendgrid.com/v3/user/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const isApiKeyValid = testResponse.ok;
    let profileData = null;
    
    if (isApiKeyValid) {
      profileData = await testResponse.json();
    }

    return new Response(JSON.stringify({
      success: true,
      config,
      apiKeyValid: isApiKeyValid,
      profile: profileData,
      status: testResponse.status
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('SendGrid test error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}; 