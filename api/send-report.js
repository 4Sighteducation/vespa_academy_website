import sgMail from '@sendgrid/mail';
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Load the JSON data for descriptions and coaching questions
const fs = require('fs');
const path = require('path');
const reportData = JSON.parse(fs.readFileSync(path.join(__dirname, '../assets/reporttext_restructured_complete.json'), 'utf8'));

// Professional HTML template for PDF generation - EXACT MATCH to reference image structure
const generateProfessionalReportHTML = (data) => {
  
  // VESPA color mapping
  const vespaColors = {
    'VISION': '#ffab40',    // Orange
    'EFFORT': '#a9c8f5',   // Light Blue  
    'SYSTEMS': '#90d66f',  // Green
    'PRACTICE': '#9c57c0', // Purple
    'ATTITUDE': '#f567ea'  // Pink
  };

  // Function to get performance level based on score ranges
  const getPerformanceLevel = (score) => {
    if (score < 4) return 'Very Low';
    if (score < 6) return 'Low';
    if (score < 9) return 'Medium';
    return 'High';
  };

  // Function to get coaching questions from JSON structure
  const getCoachingQuestions = (category, score) => {
    const level = getPerformanceLevel(score);
    
    // Map VESPA category names to JSON keys
    const categoryMap = {
      'VISION': 'Vision',
      'EFFORT': 'Effort', 
      'SYSTEMS': 'System',
      'PRACTICE': 'Practice',
      'ATTITUDE': 'Attitude'
    };
    
    const jsonCategory = categoryMap[category];
    
    // Get coaching questions from JSON data
    if (reportData && reportData[jsonCategory] && reportData[jsonCategory][level] && reportData[jsonCategory][level].english) {
      return reportData[jsonCategory][level].english.coaching_questions || 'No coaching questions available.';
    }
    
    return 'No coaching questions available for this score level.';
  };

  // Function to get description from JSON structure  
  const getDescription = (category, score) => {
    const level = getPerformanceLevel(score);
    
    // Map VESPA category names to JSON keys
    const categoryMap = {
      'VISION': 'Vision',
      'EFFORT': 'Effort', 
      'SYSTEMS': 'System',
      'PRACTICE': 'Practice',
      'ATTITUDE': 'Attitude'
    };
    
    const jsonCategory = categoryMap[category];
    
    // Get description from JSON data
    if (reportData && reportData[jsonCategory] && reportData[jsonCategory][level] && reportData[jsonCategory][level].english) {
      return reportData[jsonCategory][level].english.description;
    }
    
    return 'No description available for this score level.';
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
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          background: white;
          color: #333;
          font-size: 9pt;
        }
        
        .vespa-report { 
          width: 210mm; 
          min-height: 297mm;
          padding: 6mm !important; 
          box-sizing: border-box; 
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; 
          font-size: 9pt;
          color: #333;
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
        
        .report-header .header-info {
          text-align: left;
          font-size: 10pt;
          line-height: 1.3;
        }
        
        .report-header .header-info div {
          font-weight: bold;
          margin-bottom: 2mm;
        }

        .vespa-grid-title {
          display: grid;
          grid-template-columns: 40mm 1fr 1fr !important;
          grid-gap: 8mm;
          margin-bottom: 4mm !important;
          font-weight: bold;
          color: #555;
          font-size: 10pt !important;
          padding: 8px 0;
          border-bottom: 2px solid #333 !important;
        }
        .vespa-grid-title div {
          text-align: center;
        }

        .vespa-grid { 
          display: grid; 
          grid-template-columns: 1fr;
          grid-gap: 3mm; 
        }
        
        .vespa-block {
          border: 1px solid #d6d6d6 !important;
          border-left-width: 6px !important;
          border-radius: 4px !important;
          background: #ffffff !important;
          box-shadow: 0 1px 3px rgba(0,0,0,0.07) !important;
          padding: 3mm !important;
          display: grid !important;
          grid-template-columns: 40mm 1fr 1.2fr !important;
          grid-gap: 6mm !important;
          align-items: stretch !important;
          min-height: 40mm !important;
        }
        
        .block-score {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          border-radius: 4px;
          padding: 8px;
          color: white;
          font-weight: bold;
        }
        
        .block-score .score-label {
          font-size: 12pt;
          font-weight: bold;
          margin-bottom: 4px;
        }
        
        .block-score .score-val {
          font-size: 28pt !important;
          font-weight: bold;
        }
        
        .block-body {
          padding: 0;
          line-height: 1.4;
          font-size: 8.5pt;
        }
        
        .block-body .average-score {
          font-weight: bold;
          margin: 4px 0;
        }
        
        .block-questions {
          padding: 0;
          line-height: 1.4;
          font-size: 8.5pt;
          border-left: 1px solid #eee;
          padding-left: 5mm;
        }
        
        .block-questions h5 {
          margin: 0 0 2mm 0;
          font-weight: bold;
          color: #333;
        }
        
        .block-questions .coaching-content {
          margin-bottom: 3mm;
        }

        .bottom-section { 
          margin-top: 6mm; 
          font-size: 9pt;
          border-top: 1px solid #ccc;
          padding-top: 4mm;
        }
        
        .bottom-section h4 {
          font-size: 11pt;
          margin: 0 0 3mm 0;
        }
        
        .comment-box {
          border: 1px solid #ddd;
          padding: 3mm;
          margin-bottom: 3mm;
          background: #fdfdfd;
          min-height: 20mm;
        }
        
        .bottom-row {
          display: flex !important;
          flex-direction: column !important;
          gap: 6mm !important;
        }
        .bottom-row .comment-box {
          width: 100% !important;
        }
      </style>
    </head>
    <body>
      <div class="vespa-report">
        <!-- Header Section -->
        <div class="report-header">
          <div class="header-info">
            <div>Student: ${data.user_name}</div>
            <div>School: VESPA Academy</div>
            <div>Date: ${new Date().toLocaleDateString('en-GB')}</div>
            <div>Overall Score: ${Math.round((data.vision_score + data.effort_score + data.systems_score + data.practice_score + data.attitude_score) / 5)}</div>
          </div>
          <div class="header-title">VESPA Assessment Report</div>
          <div style="width: 80px;"></div> <!-- Spacer for layout balance -->
        </div>

        <!-- VESPA Grid Header -->
        <div class="vespa-grid-title">
          <div>VESPA REPORT</div>
          <div>COACHING QUESTIONS</div>
        </div>

        <!-- VESPA Categories -->
        <div class="vespa-grid">
          ${['VISION', 'EFFORT', 'SYSTEMS', 'PRACTICE', 'ATTITUDE'].map(category => {
            const scoreKey = category.toLowerCase() + '_score';
            const score = data[scoreKey] || 0;
            const description = getDescription(category, score);
            const coachingQuestions = getCoachingQuestions(category, score);
            const avgScore = (score / 10 * 100).toFixed(0) + '%';
            
            return `
              <div class="vespa-block" style="border-left-color: ${vespaColors[category]};">
                <div class="block-score" style="background-color: ${vespaColors[category]};">
                  <div class="score-label">${category.charAt(0)}</div>
                  <div class="score-val">${score}</div>
                </div>
                <div class="block-body">
                  <strong>${category}</strong>
                  <div class="average-score">Average score: ${avgScore}</div>
                  <p>${description}</p>
                </div>
                <div class="block-questions">
                  <h5>Coaching Questions:</h5>
                  <div class="coaching-content">${coachingQuestions}</div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Bottom Section -->
        <div class="bottom-section">
          <div class="bottom-row">
            <div class="comment-box">
              <h4>Personal Reflection</h4>
              <p>Use this space to reflect on your VESPA results and consider what they mean for your learning journey.</p>
            </div>
            <div class="comment-box">
              <h4>Action Plan</h4>
              <p>Based on your results, what specific actions will you take to improve your learning mindset?</p>
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