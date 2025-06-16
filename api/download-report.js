import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

// Generate professional VESPA report HTML using the user's CSS structure
const generateProfessionalReportHTML = (data, reportContent) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>VESPA Report - ${data.user_name}</title>
      <style>
        /* Based on the user's professional report CSS */
        .vespa-report { 
          width: 210mm; 
          min-height: 297mm;
          padding: 6mm !important; 
          box-sizing: border-box; 
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; 
          font-size: 9pt;
          color: #333;
          background: white;
        }
        
        .report-header { 
          display: flex; 
          align-items: flex-start; 
          justify-content: space-between; 
          border-bottom: 2px solid #333; 
          padding-bottom: 5mm;
          margin-bottom: 5mm;
        }
        
        .report-header .logo { 
          height: 42px; 
          margin-right: 10mm;
        }
        
        .report-header .header-title { 
          font-size: 18pt !important; 
          font-weight: bold; 
          color: #444;
          flex: 1; 
          text-align: center; 
          align-self: center;
        }
        
        .report-header .header-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
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
      </style>
    </head>
    <body>
      <div class="vespa-report">
        <div class="report-header">
          <div class="header-left">
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjQwIiB2aWV3Qm94PSIwIDAgMTAwIDQwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8dGV4dCB4PSI1MCIgeT0iMjUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZm9udC13ZWlnaHQ9ImJvbGQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMxMDJmNjIiPlZFU1BBPC90ZXh0Pgo8L3N2Zz4K" alt="VESPA" class="logo">
          </div>
          <div class="header-center">
            <h1 class="header-title">VESPA Assessment Report</h1>
          </div>
          <div class="header-right">
            <div class="meta">
              <div><strong>Name:</strong> ${data.user_name}</div>
              <div><strong>School:</strong> ${data.user_school}</div>
              <div><strong>Date:</strong> ${new Date().toLocaleDateString('en-GB')}</div>
              <div><strong>Overall Score:</strong> ${data.overall_score}/10</div>
            </div>
          </div>
        </div>
        
        <div class="intro-section">
          <div class="intro-questions">
            <h4>Your VESPA Profile</h4>
            <p>This report provides insights into your learning mindset across five key areas: Vision, Effort, Systems, Practice, and Attitude. Use this feedback to identify your strengths and areas for development.</p>
            <h4>Your Scores Summary:</h4>
            <ul>
              <li><strong>Vision:</strong> ${data.vision_score}/10 (Average: ${data.vision_avg})</li>
              <li><strong>Effort:</strong> ${data.effort_score}/10 (Average: ${data.effort_avg})</li>
              <li><strong>Systems:</strong> ${data.systems_score}/10 (Average: ${data.systems_avg})</li>
              <li><strong>Practice:</strong> ${data.practice_score}/10 (Average: ${data.practice_avg})</li>
              <li><strong>Attitude:</strong> ${data.attitude_score}/10 (Average: ${data.attitude_avg})</li>
            </ul>
          </div>
          <div class="chart-placeholder">
            Your VESPA Radar Chart<br/>
            (Vision: ${data.vision_score}, Effort: ${data.effort_score}, Systems: ${data.systems_score}, Practice: ${data.practice_score}, Attitude: ${data.attitude_score})
          </div>
        </div>
        
        <div class="vespa-grid">
          ${reportContent || '<p>Detailed report content will be displayed here based on your specific scores and feedback.</p>'}
        </div>
        
        <div class="bottom-section">
          <h3>Your Reflection & Action Plan</h3>
          <div class="comment-box">
            <h4>My Response to this Report:</h4>
            <p style="color: #666; font-style: italic;">Use this space to reflect on your results and what they mean for your learning journey.</p>
          </div>
          <div class="comment-box">
            <h4>My Goals:</h4>
            <p style="color: #666; font-style: italic;">Set specific, achievable goals based on your VESPA feedback.</p>
            <div style="margin-top: 10mm;">
              <strong>Target Date:</strong> ____________________
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ error: 'Email parameter required' });
    }

    console.log('Generating PDF report for:', email);

    // For now, we'll generate a sample PDF. In production, you'd fetch the actual user data
    // from your database based on the email
    const sampleData = {
      user_name: "Sample User",
      user_school: "Sample School", 
      user_email: email,
      vision_score: 8,
      vision_avg: "4.50",
      effort_score: 6,
      effort_avg: "4.25",
      systems_score: 7,
      systems_avg: "4.00",
      practice_score: 9,
      practice_avg: "4.33",
      attitude_score: 5,
      attitude_avg: "4.67",
      overall_score: 7
    };

    // Generate the sample VESPA blocks content
    const sampleReportContent = `
      <div class="vespa-block border-vision">
        <div class="block-score">
          <div class="score-label">VISION</div>
          <div class="score-val">${sampleData.vision_score}</div>
          <div class="score-max">/10</div>
        </div>
        <div class="block-body">
          <p>You have a clear idea of your future goals and work consistently towards them. Your vision provides direction for your learning journey.</p>
        </div>
        <div class="block-questions">
          <div class="coaching">
            <strong>Coaching Questions:</strong><br/>
            What specific steps will you take this month toward your goals?
          </div>
          <div class="activities">
            <strong>Suggested Activities:</strong><br/>
            Goal Setting Workshop, Vision Board Creation
          </div>
        </div>
      </div>
      
      <div class="vespa-block border-effort">
        <div class="block-score">
          <div class="score-label">EFFORT</div>
          <div class="score-val">${sampleData.effort_score}</div>
          <div class="score-max">/10</div>
        </div>
        <div class="block-body">
          <p>Your work ethic shows good consistency. Continue to challenge yourself and maintain your commitment to excellence.</p>
        </div>
        <div class="block-questions">
          <div class="coaching">
            <strong>Coaching Questions:</strong><br/>
            How do you maintain motivation when tasks become difficult?
          </div>
          <div class="activities">
            <strong>Suggested Activities:</strong><br/>
            Effort Tracking, Persistence Building
          </div>
        </div>
      </div>
    `;

    // Generate HTML for PDF
    const html = generateProfessionalReportHTML(sampleData, sampleReportContent);

    // Generate PDF using Puppeteer
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' }
    });

    await browser.close();

    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="VESPA_Report_${email.replace('@', '_')}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    // Send the PDF
    res.end(pdfBuffer);

  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ 
      error: 'Failed to generate PDF report', 
      details: error.message 
    });
  }
} 