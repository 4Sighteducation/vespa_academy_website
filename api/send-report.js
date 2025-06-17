import sgMail from '@sendgrid/mail';
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Load the JSON data for descriptions and coaching questions
let reportData = null;

async function loadReportData() {
  if (!reportData) {
    try {
      const jsonPath = path.join(process.cwd(), 'public', 'reporttext_restructured_complete.json');
      const jsonContent = fs.readFileSync(jsonPath, 'utf8');
      reportData = JSON.parse(jsonContent);
    } catch (error) {
      console.error('Error loading report data:', error);
      reportData = {}; // fallback
    }
  }
  return reportData;
}

// Professional HTML template for PDF generation - EXACT MATCH to reference image structure
const generateProfessionalReportHTML = async (data) => {
  
  // Load report data
  const reportJsonData = await loadReportData();
  
  // VESPA color mapping - exact colors from reference image
  const vespaColors = {
    'VISION': '#ffab40',    // Orange
    'EFFORT': '#a9c8f5',   // Light Blue  
    'SYSTEMS': '#90d66f',  // Green
    'PRACTICE': '#9c57c0', // Purple
    'ATTITUDE': '#f567ea'  // Pink
  };

  // Function to get performance level based on score ranges - EXACT user requirements
  const getPerformanceLevel = (score) => {
    if (score < 4) return 'Very Low';    // 0-3
    if (score < 6) return 'Low';         // 4-5  
    if (score < 9) return 'Medium';      // 6-8
    return 'High';                       // 9-10
  };

  // Function to get coaching content from JSON structure
  const getCoachingContent = (category, score) => {
    const level = getPerformanceLevel(score);
    const userLevel = data.user_level || 'Level 3';
    
    // Map VESPA category names to JSON keys (Systems -> System)
    const categoryMap = {
      'VISION': 'Vision',
      'EFFORT': 'Effort', 
      'SYSTEMS': 'System',  // JSON uses "System" not "Systems"
      'PRACTICE': 'Practice',
      'ATTITUDE': 'Attitude'
    };
    
    const jsonCategory = categoryMap[category];
    
    // Get content from JSON data
    try {
      const content = reportJsonData?.report_data?.[userLevel]?.[jsonCategory]?.[level]?.english;
      if (content) {
        return {
          description: content.description || 'Description not available.',
          questions: content.questions || 'No reflection questions available.',
          activities: content.activities || 'No activities listed.',
          coaching_questions: content.coaching_questions || 'No coaching questions available.'
        };
      }
    } catch (error) {
      console.error(`Error getting content for ${category} ${level}:`, error);
    }
    
    // Fallback content
    return {
      description: `You scored ${score} in ${category}. This indicates your current level in this area.`,
      questions: 'What are your main learning goals?',
      activities: 'Goal setting activities',
      coaching_questions: 'How can you improve in this area?'
    };
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>VESPA Report - ${data.user_name}</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
          background: white;
          color: #333;
          font-size: 9pt;
          line-height: 1.3;
        }
        
        .vespa-report { 
          width: 210mm; 
          min-height: 297mm;
          padding: 6mm;
          box-sizing: border-box;
          page-break-after: always;
        }
        
        .report-header { 
          margin-bottom: 4mm;
          padding-bottom: 3mm;
          border-bottom: 2px solid #000;
        }
        
        .header-top {
          display: grid;
          grid-template-columns: 1fr 2fr 1fr;
          gap: 8mm;
          margin-bottom: 2mm;
        }
        
        .student-info {
          font-size: 10pt;
          line-height: 1.6;
        }
        
        .student-info div {
          margin-bottom: 2mm;
          font-weight: bold;
        }
        
        .cycle-info {
          text-align: center;
        }

        .cycle-number {
          display: inline-block;
          background: #23356f;
          color: white;
          width: 20px;
          height: 20px;
          text-align: center;
          border-radius: 50%;
          font-weight: bold;
          line-height: 20px;
          margin-left: 5px;
        }

        .header-title {
          font-size: 20pt;
          color: #23356f;
          margin: 0;
          text-align: center;
          font-weight: bold;
          align-self: center;
          white-space: nowrap;
        }
        
        .logo-container {
          text-align: right;
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }
        
        .logo-container img {
          max-height: 25px;
          width: auto;
        }

        .intro-questions {
          font-size: 6pt;
          margin-top: 2mm;
          padding: 1.5mm;
          background: #f9f9f9;
          border: 1px solid #e0e0e0;
          border-radius: 2px;
        }
        
        .intro-questions h4 {
          margin: 0 0 1mm 0;
          font-size: 7pt;
          font-weight: bold;
        }
        
        .intro-questions ul {
          margin: 0;
          padding-left: 8px;
          list-style: disc;
        }
        
        .intro-questions li {
          margin-bottom: 0.5mm;
          line-height: 1.1;
        }

        .vespa-main-content {
          margin-top: 3mm;
        }
        
        .vespa-report-header {
          display: grid;
          grid-template-columns: 28mm 1.8fr 1.4fr;
          background: #06206e;
          color: white;
          padding: 1.5mm;
          font-weight: bold;
          font-size: 9pt;
          margin-bottom: 0.5mm;
        }
        
        .vespa-row {
          display: grid;
          grid-template-columns: 28mm 1.8fr 1.4fr;
          border: 1px solid #ddd;
          margin-bottom: 0.5mm;
          background: white;
          page-break-inside: avoid;
          min-height: 28mm;
        }
        
        .vespa-element {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2mm;
          text-align: center;
          color: white;
          font-weight: bold;
        }
        
        .element-name {
          font-size: 9pt;
          font-weight: bold;
          margin-bottom: 2mm;
          text-transform: uppercase;
        }
        
        .score-number {
          font-size: 32pt;
          font-weight: bold;
          line-height: 0.9;
        }
        
        .vespa-description {
          padding: 1.5mm;
          font-size: 7pt;
          line-height: 1.2;
        }
        
        .description-text {
          margin-bottom: 0;
          font-weight: normal;
          line-height: 1.4;
        }
        
        .suggested-activities {
          margin-top: 0;
          font-style: italic;
          font-size: 7pt;
        }
        
        .suggested-activities strong {
          font-size: 7pt;
          font-weight: bold;
          display: block;
          margin-bottom: 0.5mm;
          font-style: normal;
        }
        
        .coaching-questions {
          padding: 1.5mm;
          border-left: 1px solid #eee;
          background: #fafbfc;
          font-size: 7pt;
          line-height: 1.2;
        }
        
        .coaching-content {
          margin-bottom: 2mm;
        }
        
        .activities-divider {
          border-top: 1px solid #ddd;
          margin: 2mm 0;
        }

        .personal-reflection {
          margin-top: 2mm;
          border-top: 1px solid #ccc;
          padding-top: 1mm;
        }
        
        .personal-reflection h3 {
          font-size: 10pt;
          font-weight: bold;
          margin: 0 0 2mm 0;
        }
        
        .write-area {
          border: 1px solid #ddd;
          min-height: 6mm;
          background: #fdfdfd;
          padding: 1mm;
        }
      </style>
    </head>
    <body>
      <div class="vespa-report">
        <!-- Header Section - Updated layout -->
        <div class="report-header">
          <div class="header-top">
            <div class="student-info">
              <div>STUDENT: ${data.user_name}</div>
              <div>DATE: ${new Date().toLocaleDateString('en-GB')}</div>
              <div class="cycle-info">CYCLE: <span class="cycle-number">1</span></div>
            </div>
            <div class="header-title">VESPA COACHING REPORT</div>
            <div class="logo-container">
              <img src="https://www.vespa.academy/assets/images/full-trimmed-transparent-customcolor-1-832x947.png" alt="VESPA Academy" style="max-height: 25px; width: auto;" />
            </div>
          </div>
          <div class="intro-questions">
            <h4>INTRODUCTORY QUESTIONS</h4>
            <ul>
              <li>To what extent is the report accurate?</li>
              <li>Does your highest score represent a strength? Your lowest an area for development?</li>
            </ul>
          </div>
        </div>

        <!-- VESPA Main Content -->
        <div class="vespa-main-content">
          <div class="vespa-report-header">
            <div>SCORE</div>
            <div>COMMENT</div>
            <div>COACHING QUESTIONS</div>
          </div>
          
          ${['VISION', 'EFFORT', 'SYSTEMS', 'PRACTICE', 'ATTITUDE'].map(category => {
            const scoreKey = category.toLowerCase() + '_score';
            const avgKey = category.toLowerCase() + '_avg';
            const score = data[scoreKey] || 0;
            const avgScore = data[avgKey] || '0.00';
            const content = getCoachingContent(category, score);
            
                          return `
                <div class="vespa-row">
                  <div class="vespa-element" style="background-color: ${vespaColors[category]};">
                    <div class="element-name">${category}</div>
                    <div class="score-number">${score}</div>
                  </div>
                  
                  <div class="vespa-description">
                    <div class="description-text">${content.description}</div>
                  </div>
                  
                  <div class="coaching-questions">
                    <div class="coaching-content">
                      ${content.coaching_questions.replace(/<br\s*\/?>/gi, '<br>')}
                    </div>
                    
                    <div class="activities-divider"></div>
                    
                    <div class="suggested-activities">
                      <strong>Suggested Activities:</strong> ${content.activities}
                    </div>
                  </div>
                </div>
              `;
          }).join('')}
        </div>

        <!-- Personal Reflection Section -->
        <div class="personal-reflection">
          <h3>COMMENTS / STUDY GOAL</h3>
          <div style="font-size: 9pt; margin-bottom: 3mm;">
            <strong>STUDENT RESPONSE</strong>
          </div>
          <div class="write-area"></div>
          
          <div style="margin-top: 5mm;">
            <strong>STUDY GOAL/ACTION PLAN</strong>
          </div>
          <div class="write-area"></div>
          
          <div style="margin-top: 5mm; display: flex; justify-content: space-between;">
            <div>
              <strong>Goal Set:</strong> ${new Date().toLocaleDateString('en-GB')} &nbsp;&nbsp;&nbsp;
              <strong>Goal Finish:</strong> _______________
            </div>
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
      send_pdf: true
    };

    console.log('Email data prepared:', emailData);

    let pdfBuffer = null;

    // Generate PDF if requested
    if (emailData.send_pdf) {
      try {
        console.log('Starting PDF generation...');
        
        // Generate HTML
        const html = await generateProfessionalReportHTML(emailData);
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

    // Prepare template data for SendGrid
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
      overall_score: emailData.overall_score
      // Note: download_link removed since PDF is attached to email
    };

    console.log('Template data prepared:', Object.keys(templateData));

    // Prepare email message using SendGrid template
    const msg = {
      to: emailData.user_email,
      from: process.env.SENDGRID_FROM_EMAIL,
      templateId: process.env.SENDGRID_REPORT_TEMPLATE_ID,
      dynamicTemplateData: templateData
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