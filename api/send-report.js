import sgMail from '@sendgrid/mail';
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// HTML template for PDF generation
const generateReportHTML = (data) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 40px;
          color: #333;
        }
        .header {
          background-color: #102f62;
          color: white;
          padding: 30px;
          text-align: center;
          margin: -40px -40px 30px -40px;
        }
        .logo {
          font-size: 32px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        h1 {
          color: #102f62;
          margin-top: 30px;
        }
        .score-section {
          background-color: #f8f9fa;
          padding: 20px;
          margin: 20px 0;
          border-left: 4px solid #00e5db;
        }
        .score-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin-top: 20px;
        }
        .score-item {
          background: white;
          padding: 15px;
          border: 1px solid #e0e0e0;
          text-align: center;
        }
        .score-label {
          font-size: 14px;
          color: #666;
          text-transform: uppercase;
          margin-bottom: 5px;
        }
        .score-value {
          font-size: 28px;
          font-weight: bold;
          color: #102f62;
        }
        .overall-score {
          background-color: #102f62;
          color: white;
          padding: 20px;
          text-align: center;
          margin: 20px 0;
        }
        .overall-value {
          font-size: 36px;
          color: #00e5db;
          font-weight: bold;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          color: #666;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">VESPA Academy</div>
        <p>Learning Profile Report</p>
      </div>
      
      <h1>Hello ${data.user_name}!</h1>
      <p>Thank you for completing the VESPA assessment. This report provides insights into your learning mindset across the five key areas.</p>
      
      <div class="score-section">
        <h2>Your VESPA Scores</h2>
        <div class="score-grid">
          <div class="score-item">
            <div class="score-label">Vision</div>
            <div class="score-value">${data.vision_score}/10</div>
            <div>Average: ${data.vision_avg}</div>
          </div>
          <div class="score-item">
            <div class="score-label">Effort</div>
            <div class="score-value">${data.effort_score}/10</div>
            <div>Average: ${data.effort_avg}</div>
          </div>
          <div class="score-item">
            <div class="score-label">Systems</div>
            <div class="score-value">${data.systems_score}/10</div>
            <div>Average: ${data.systems_avg}</div>
          </div>
          <div class="score-item">
            <div class="score-label">Practice</div>
            <div class="score-value">${data.practice_score}/10</div>
            <div>Average: ${data.practice_avg}</div>
          </div>
          <div class="score-item">
            <div class="score-label">Attitude</div>
            <div class="score-value">${data.attitude_score}/10</div>
            <div>Average: ${data.attitude_avg}</div>
          </div>
        </div>
        
        <div class="overall-score">
          <p>Overall VESPA Score</p>
          <div class="overall-value">${data.overall_score}/10</div>
        </div>
      </div>
      
      <h2>What Your Scores Mean</h2>
      <p>Your VESPA profile shows your current mindset across five critical areas for academic success. Use this report to identify areas of strength and opportunities for growth.</p>
      
      <h2>Next Steps</h2>
      <ul>
        <li>Review your scores and identify areas for improvement</li>
        <li>Discuss your results with your teacher or coach</li>
        <li>Set specific goals for each VESPA area</li>
        <li>Use the VESPA activities to develop your mindset</li>
      </ul>
      
      <div class="footer">
        <p>© 2024 VESPA Academy. All rights reserved.</p>
        <p>For more information, visit www.vespa.academy</p>
      </div>
    </body>
    </html>
  `;
};

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
    const {
      user_email,
      user_name,
      user_school,
      vision_score,
      vision_avg,
      effort_score,
      effort_avg,
      systems_score,
      systems_avg,
      practice_score,
      practice_avg,
      attitude_score,
      attitude_avg,
      overall_score,
      send_pdf = true // Option to send with or without PDF
    } = req.body;

    // Validate required fields
    if (!user_email || !user_name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let pdfBuffer = null;

    // Generate PDF if requested
    if (send_pdf) {
      try {
        // Generate HTML
        const html = generateReportHTML(req.body);

        // Launch Puppeteer with Chromium
        const browser = await puppeteer.launch({
          args: chromium.args,
          defaultViewport: chromium.defaultViewport,
          executablePath: await chromium.executablePath(),
          headless: chromium.headless,
        });

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        
        // Generate PDF
        pdfBuffer = await page.pdf({
          format: 'A4',
          printBackground: true,
          margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
        });

        await browser.close();
      } catch (pdfError) {
        console.error('PDF generation error:', pdfError);
        // Continue without PDF if generation fails
        send_pdf = false;
      }
    }

    // Prepare email message
    const msg = {
      to: user_email,
      from: process.env.SENDGRID_FROM_EMAIL,
      templateId: process.env.SENDGRID_REPORT_TEMPLATE_ID,
      dynamicTemplateData: {
        user_name,
        user_email,
        user_school,
        vision_score,
        vision_avg,
        effort_score,
        effort_avg,
        systems_score,
        systems_avg,
        practice_score,
        practice_avg,
        attitude_score,
        attitude_avg,
        overall_score,
        download_link: `https://www.vespa.academy/download-report?email=${encodeURIComponent(user_email)}` // Fallback link
      }
    };

    // Add PDF attachment if available
    if (send_pdf && pdfBuffer) {
      msg.attachments = [{
        content: pdfBuffer.toString('base64'),
        filename: `VESPA_Report_${user_name.replace(/\s+/g, '_')}.pdf`,
        type: 'application/pdf',
        disposition: 'attachment'
      }];
    }

    // Send email
    await sgMail.send(msg);

    // Also send lead notification
    if (process.env.SENDGRID_ADMIN_EMAIL) {
      const leadMsg = {
        to: process.env.SENDGRID_ADMIN_EMAIL,
        from: process.env.SENDGRID_FROM_EMAIL,
        templateId: process.env.SENDGRID_LEAD_EMAIL_ID,
        dynamicTemplateData: {
          ...req.body,
          timestamp: new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })
        }
      };
      
      await sgMail.send(leadMsg);
    }

    res.status(200).json({ 
      success: true, 
      message: 'Report sent successfully',
      pdf_attached: send_pdf && !!pdfBuffer
    });

  } catch (error) {
    console.error('Error sending report:', error);
    res.status(500).json({ 
      error: 'Failed to send report', 
      details: error.message 
    });
  }
} 