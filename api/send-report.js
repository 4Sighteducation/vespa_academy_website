import sgMail from '@sendgrid/mail';
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Professional HTML template for PDF generation using examplereport.css structure
const generateProfessionalReportHTML = (data) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>VESPA Report - ${data.user_name}</title>
      <style>
        /* Professional VESPA report styling based on examplereport.css */
        body {
          margin: 0;
          padding: 0;
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          background: white;
          color: #333;
        }
        
        .vespa-report { 
          width: 210mm; 
          min-height: 297mm;
          padding: 6mm !important; 
          box-sizing: border-box; 
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; 
          font-size: 9pt;
          color: #333;
          background: white;
          page-break-after: always;
        }
        
        .report-header { 
          display: flex; 
          align-items: flex-start; 
          justify-content: space-between; 
          border-bottom: 2px solid #333; 
          padding-bottom: 5mm;
          margin-bottom: 5mm;
        }
        
        .report-header .header-title { 
          font-size: 18pt !important; 
          font-weight: bold; 
          color: #444;
          flex: 1; 
          text-align: center; 
          align-self: center;
        }
        
        .report-header .meta { 
          font-size: 10pt; 
          text-align: right; 
          line-height: 1.4;
        }

        .intro-section {
          display: flex;
          gap: 8mm;
          margin-bottom: 5mm;
          border-bottom: 1px solid #ccc;
          padding-bottom: 5mm;
        }
        
        .intro-questions {
          flex: 2;
          font-size: 9pt;
        }
        
        .intro-questions h4 {
          margin: 0 0 2mm 0;
          font-size: 11pt;
        }
        
        .intro-questions ul {
          padding-left: 5mm;
          margin: 0;
        }
        
        .chart-placeholder {
          flex: 1;
          min-height: 50mm;
          background: #f9f9f9;
          border: 1px solid #eee;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #999;
          font-weight: bold;
        }

        .vespa-grid { 
          display: grid; 
          grid-template-columns: 1fr;
          grid-gap: 3mm; 
          margin: 5mm 0;
        }
        
        .vespa-block {
          border: 1px solid #d6d6d6 !important;
          border-left-width: 6px !important;
          border-radius: 4px !important;
          background: #ffffff !important;
          box-shadow: 0 1px 3px rgba(0,0,0,0.07) !important;
          padding: 3mm !important;
          display: grid !important;
          grid-template-columns: 24mm 1fr 1fr !important;
          grid-gap: 5mm !important;
          align-items: stretch !important;
          min-height: 40mm !important;
        }
        
        .block-score {
          text-align: center;
          padding: 2mm;
          background: #f8f9fa;
          border-radius: 4px;
          box-shadow: inset 0 0 4px rgba(0,0,0,0.15);
        }
        
        .block-score .score-label {
          font-size: 12pt;
          font-weight: bold;
          margin-bottom: 2mm;
        }
        
        .block-score .score-val {
          font-size: 28pt !important;
          font-weight: bold;
          color: #333;
        }
        
        .block-score .score-max {
          font-size: 12pt;
          color: #666;
        }
        
        .block-body {
          padding: 0;
          line-height: 1.4;
          font-size: 8.5pt;
        }
        
        .block-body p {
          margin: 0 0 2mm 0;
        }
        
        .block-questions {
          padding: 0;
          line-height: 1.4;
          font-size: 8.5pt;
          border-left: 1px solid #eee;
          padding-left: 5mm;
        }
        
        .block-questions .coaching {
          margin-bottom: 3mm;
        }
        
        .block-questions .activities {
          margin-top: 2mm;
          font-style: italic;
        }

        .bottom-section { 
          margin-top: 6mm; 
          font-size: 9pt;
          border-top: 1px solid #ccc;
          padding-top: 4mm;
        }
        
        .bottom-section h3 {
          font-size: 12pt;
          margin: 0 0 3mm 0;
          color: #333;
        }
        
        .comment-box {
          border: 1px solid #ddd;
          padding: 3mm;
          margin-bottom: 3mm;
          background: #fdfdfd;
          min-height: 25mm;
        }
        
        /* VESPA color coding */
        .border-vision { border-left-color: #ffab40 !important; }
        .border-effort { border-left-color: #a9c8f5 !important; }
        .border-systems { border-left-color: #90d66f !important; }
        .border-practice { border-left-color: #9c57c0 !important; }
        .border-attitude { border-left-color: #f567ea !important; }
        
        .long-comment { margin: 2px 0; }
        
        .coach-qs { 
          padding-left: 14px; 
          margin: 2px 0; 
        }
        
        .coach-qs li { 
          margin-bottom: 2px; 
        }
        
        .activities { 
          margin-top: 2px; 
          font-style: italic; 
        }
        
        .reflection, .action-plan { 
          border: 1px solid #888; 
          padding: 4px; 
          flex: 1; 
          min-height: 40mm; 
        }
      </style>
    </head>
    <body>
      <div class="vespa-report">
        <div class="report-header">
          <div class="header-center">
            <h1 class="header-title">VESPA Assessment Report</h1>
          </div>
          <div class="header-right">
            <div class="meta">
              <div><strong>Student:</strong> ${data.user_name}</div>
              <div><strong>School:</strong> ${data.user_school || 'N/A'}</div>
              <div><strong>Date:</strong> ${new Date().toLocaleDateString('en-GB')}</div>
              <div><strong>Overall Score:</strong> ${data.overall_score}/10</div>
            </div>
          </div>
        </div>

        <div class="intro-section">
          <div class="intro-questions">
            <h4>What is VESPA?</h4>
            <ul>
              <li>A framework for developing learning mindsets</li>
              <li>Based on 5 key areas: Vision, Effort, Systems, Practice, Attitude</li>
              <li>Helps students take ownership of their learning</li>
              <li>Proven to improve academic outcomes</li>
            </ul>
          </div>
          <div class="chart-placeholder">
            Your VESPA<br/>
            Score Chart<br/>
            <strong>${data.overall_score}/10</strong>
          </div>
        </div>

        <div class="vespa-grid">
          <div class="vespa-block border-vision">
            <div class="block-score">
              <div class="score-label">V</div>
              <div class="score-val">${data.vision_score}</div>
              <div class="score-max">/10</div>
            </div>
            <div class="block-body">
              <p><strong>VISION</strong></p>
              <p class="long-comment">Your vision score of ${data.vision_score}/10 indicates your level of clarity about your learning goals and future aspirations.</p>
              <p>Average score: ${data.vision_avg}/10</p>
            </div>
            <div class="block-questions">
              <div class="coaching">
                <strong>Reflection Questions:</strong>
                <ul class="coach-qs">
                  <li>What are your main learning goals?</li>
                  <li>How do these connect to your future plans?</li>
                  <li>What motivates you to learn?</li>
                </ul>
              </div>
              <div class="activities">
                <span>Activities:</span> Goal setting, vision boarding, career exploration
              </div>
            </div>
          </div>

          <div class="vespa-block border-effort">
            <div class="block-score">
              <div class="score-label">E</div>
              <div class="score-val">${data.effort_score}</div>
              <div class="score-max">/10</div>
            </div>
            <div class="block-body">
              <p><strong>EFFORT</strong></p>
              <p class="long-comment">Your effort score of ${data.effort_score}/10 shows your willingness to work hard and persist through challenges.</p>
              <p>Average score: ${data.effort_avg}/10</p>
            </div>
            <div class="block-questions">
              <div class="coaching">
                <strong>Reflection Questions:</strong>
                <ul class="coach-qs">
                  <li>How do you respond to difficult tasks?</li>
                  <li>What helps you stay motivated?</li>
                  <li>When do you work hardest?</li>
                </ul>
              </div>
              <div class="activities">
                <span>Activities:</span> Challenge tasks, perseverance practice, effort tracking
              </div>
            </div>
          </div>

          <div class="vespa-block border-systems">
            <div class="block-score">
              <div class="score-label">S</div>
              <div class="score-val">${data.systems_score}</div>
              <div class="score-max">/10</div>
            </div>
            <div class="block-body">
              <p><strong>SYSTEMS</strong></p>
              <p class="long-comment">Your systems score of ${data.systems_score}/10 reflects how well you organize your learning and manage your time.</p>
              <p>Average score: ${data.systems_avg}/10</p>
            </div>
            <div class="block-questions">
              <div class="coaching">
                <strong>Reflection Questions:</strong>
                <ul class="coach-qs">
                  <li>How do you organize your study time?</li>
                  <li>What systems help you learn best?</li>
                  <li>How do you track your progress?</li>
                </ul>
              </div>
              <div class="activities">
                <span>Activities:</span> Time management, study planning, organization tools
              </div>
            </div>
          </div>

          <div class="vespa-block border-practice">
            <div class="block-score">
              <div class="score-label">P</div>
              <div class="score-val">${data.practice_score}</div>
              <div class="score-max">/10</div>
            </div>
            <div class="block-body">
              <p><strong>PRACTICE</strong></p>
              <p class="long-comment">Your practice score of ${data.practice_score}/10 shows how you approach skill development and learning from mistakes.</p>
              <p>Average score: ${data.practice_avg}/10</p>
            </div>
            <div class="block-questions">
              <div class="coaching">
                <strong>Reflection Questions:</strong>
                <ul class="coach-qs">
                  <li>How do you practice new skills?</li>
                  <li>What do you do when you make mistakes?</li>
                  <li>How do you get better at difficult subjects?</li>
                </ul>
              </div>
              <div class="activities">
                <span>Activities:</span> Deliberate practice, mistake analysis, skill building
              </div>
            </div>
          </div>

          <div class="vespa-block border-attitude">
            <div class="block-score">
              <div class="score-label">A</div>
              <div class="score-val">${data.attitude_score}</div>
              <div class="score-max">/10</div>
            </div>
            <div class="block-body">
              <p><strong>ATTITUDE</strong></p>
              <p class="long-comment">Your attitude score of ${data.attitude_score}/10 indicates your mindset towards learning and challenges.</p>
              <p>Average score: ${data.attitude_avg}/10</p>
            </div>
            <div class="block-questions">
              <div class="coaching">
                <strong>Reflection Questions:</strong>
                <ul class="coach-qs">
                  <li>How do you feel about challenges?</li>
                  <li>What's your attitude to feedback?</li>
                  <li>How do you view your abilities?</li>
                </ul>
              </div>
              <div class="activities">
                <span>Activities:</span> Mindset development, feedback practice, positive self-talk
              </div>
            </div>
          </div>
        </div>

        <div class="bottom-section">
          <h3>Personal Reflection</h3>
          <div class="comment-box">
            <p><strong>What does this report tell you about your learning mindset?</strong></p>
            <p style="min-height: 20mm; border-bottom: 1px dotted #ccc; margin-bottom: 3mm;"></p>
          </div>

          <h3>Action Plan</h3>
          <div class="comment-box">
            <p><strong>Based on your scores, what will you focus on improving?</strong></p>
            <p style="min-height: 20mm; border-bottom: 1px dotted #ccc; margin-bottom: 3mm;"></p>
          </div>

          <h3>Next Steps</h3>
          <div class="comment-box">
            <p><strong>What specific actions will you take this week?</strong></p>
            <p style="min-height: 20mm; border-bottom: 1px dotted #ccc;"></p>
          </div>
        </div>
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
    console.log('=== API RECEIVED DATA ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    // Handle both old and new data structures
    let userData, scores, averages, reportHTML, level;
    
    // NEW structure from client
    if (req.body.userData) {
      userData = req.body.userData;
      scores = req.body.scores || {};
      averages = req.body.averages || {};
      reportHTML = req.body.reportHTML;
      level = req.body.level || userData.level || 'Level 3';
          } else {
      // OLD structure (fallback)
      userData = {
        email: req.body.user_email,
        name: req.body.user_name,
        school: req.body.user_school,
        level: req.body.level || 'Level 3'
      };
      scores = {
        VISION: req.body.vision_score,
        EFFORT: req.body.effort_score,
        SYSTEMS: req.body.systems_score,
        PRACTICE: req.body.practice_score,
        ATTITUDE: req.body.attitude_score
      };
      averages = {
        VISION: req.body.vision_avg,
        EFFORT: req.body.effort_avg,
        SYSTEMS: req.body.systems_avg,
        PRACTICE: req.body.practice_avg,
        ATTITUDE: req.body.attitude_avg
      };
      level = userData.level;
    }

    console.log('Processed userData:', userData);
    console.log('Processed scores:', scores);
    console.log('Processed averages:', averages);

    // Validate required fields
    if (!userData.email || !userData.name) {
      console.log('VALIDATION FAILED: Missing email or name');
      console.log('userData.email:', userData.email);
      console.log('userData.name:', userData.name);
      return res.status(400).json({ error: 'Missing required fields: email and name are required' });
    }

    // Calculate overall score
    const scoreValues = Object.values(scores).filter(score => typeof score === 'number');
    const overall_score = scoreValues.length > 0 ? 
      Math.round(scoreValues.reduce((sum, score) => sum + score, 0) / scoreValues.length) : 0;

        // Map to the format expected by the email template with proper decimal formatting
    const emailData = {
      user_email: userData.email,
      user_name: userData.name,
      user_school: userData.school || userData.jobTitle || 'Not provided',
      user_level: level,
      vision_score: scores.VISION || 0,
      vision_avg: Number(averages.VISION || 0).toFixed(2),
      effort_score: scores.EFFORT || 0,
      effort_avg: Number(averages.EFFORT || 0).toFixed(2),
      systems_score: scores.SYSTEMS || 0,
      systems_avg: Number(averages.SYSTEMS || 0).toFixed(2),
      practice_score: scores.PRACTICE || 0,
      practice_avg: Number(averages.PRACTICE || 0).toFixed(2),
      attitude_score: scores.ATTITUDE || 0,
      attitude_avg: Number(averages.ATTITUDE || 0).toFixed(2),
      overall_score: overall_score,
      reportHTML: reportHTML || '',
      send_pdf: true // Re-enabled with attachment
    };

    console.log('Email data prepared:', emailData);

    let pdfBuffer = null;

    // Generate PDF if requested
    if (emailData.send_pdf) {
      try {
        console.log('Starting PDF generation...');
        
        // Generate HTML
        const html = generateProfessionalReportHTML(emailData);
        console.log('HTML generated for PDF, length:', html.length);

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

        console.log('PDF generated successfully, buffer size:', pdfBuffer.length);
        await browser.close();
      } catch (pdfError) {
        console.error('PDF generation error:', pdfError);
        console.error('PDF error stack:', pdfError.stack);
        // Continue without PDF if generation fails
        emailData.send_pdf = false;
      }
    }

    // Read the HTML template
    const templatePath = path.join(process.cwd(), 'REPORT_TEMPLATE.html');
    let htmlContent = fs.readFileSync(templatePath, 'utf8');

    // Prepare template data including the reportHTML
    const templateData = {
      user_name: emailData.user_name,
      user_email: emailData.user_email,
      user_school: emailData.user_school,
      user_level: emailData.user_level,
      vision_score: emailData.vision_score,
      vision_avg: emailData.vision_avg,
      effort_score: emailData.effort_score,
      effort_avg: emailData.effort_avg,
      systems_score: emailData.systems_score,
      systems_avg: emailData.systems_avg,
      practice_score: emailData.practice_score,
      practice_avg: emailData.practice_avg,
      attitude_score: emailData.attitude_score,
      attitude_avg: emailData.attitude_avg,
      overall_score: emailData.overall_score,
      reportHTML: emailData.reportHTML || '',
      download_link: `https://www.vespa.academy/download-report?email=${encodeURIComponent(emailData.user_email)}`
    };

    console.log('Template data keys:', Object.keys(templateData));
    console.log('reportHTML length:', templateData.reportHTML.length);

    // Replace all placeholders in the HTML
    Object.keys(templateData).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      htmlContent = htmlContent.replace(regex, templateData[key]);
    });

    console.log('Template replacement completed');

    // Prepare email message
    const msg = {
      to: emailData.user_email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: 'Your VESPA Assessment Report',
      html: htmlContent
    };

    // Add PDF attachment if available
    if (emailData.send_pdf && pdfBuffer) {
      try {
        // Ensure pdfBuffer is properly encoded as base64
        const base64Content = Buffer.isBuffer(pdfBuffer) 
          ? pdfBuffer.toString('base64')
          : Buffer.from(pdfBuffer).toString('base64');
          
        console.log('PDF attachment prepared, size:', base64Content.length);
        
        msg.attachments = [{
          content: base64Content,
          filename: `VESPA_Report_${emailData.user_name.replace(/\s+/g, '_')}.pdf`,
          type: 'application/pdf',
          disposition: 'attachment'
        }];
      } catch (attachmentError) {
        console.error('PDF attachment encoding error:', attachmentError);
        // Send email without PDF if encoding fails
        emailData.send_pdf = false;
      }
    }

    // Send email
    await sgMail.send(msg);

    // Lead email removed - should be sent from registration form instead

    res.status(200).json({ 
      success: true, 
      message: 'Report sent successfully',
      pdf_attached: emailData.send_pdf && !!pdfBuffer
    });

  } catch (error) {
    console.error('Error sending report:', error);
    
    // Log detailed SendGrid error if available
    if (error.response && error.response.body && error.response.body.errors) {
      console.error('SendGrid errors:', JSON.stringify(error.response.body.errors, null, 2));
    }
    
    res.status(500).json({ 
      error: 'Failed to send report', 
      details: error.message,
      sendgrid_errors: error.response?.body?.errors || null
    });
  }
} 