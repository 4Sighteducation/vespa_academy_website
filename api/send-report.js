import sgMail from '@sendgrid/mail';
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
    
    // Sample coaching questions based on the JSON structure - you would load from the actual JSON file
    const coachingData = {
      'VISION': {
        'High': 'What skills are you learning that will benefit your future self?<br />Imagine you are 25 and when you wake up in the morning… what does your perfect working life look like?<br />What do you see as the benefits of getting a good education?',
        'Medium': 'What do you want to do next? What if you don't get the grades? What other options are there?<br />Do you compare yourself to other people? Who would you like to be, and why?<br />Where do you want to be next year, in 2 years or 5 years? What will stop you getting there?',
        'Low': 'What does success look like for you? What might you want to achieve in the next year?<br />What would be important to you in a job? Describe a good day at work.<br />What things do you not want to be doing in 2 years' time?',
        'Very Low': 'If you could only do one subject in lots of detail, which would it be and why?<br />Describe a lesson you've enjoyed recently.<br />What obstacles do you think you may have to overcome while studying at this level?'
      },
      'EFFORT': {
        'High': 'Describe a typical hour of your study.<br />What is your best time of day for working?<br />How much work would you have to do in order to feel satisfied? How do you know you have done enough?',
        'Medium': 'In an average week how many hours do you spend on hard/challenging/uncomfortable study outside of class?<br />What are you good at, and what did you do to get so good at it?<br />Where do you normally spend your study periods?',
        'Low': 'Think of a student who works harder than you. What do they do?<br />If you get stuck on a piece of work, what do you do to get past the blockage?<br />What should you be doing, that you know you're not?',
        'Very Low': 'How many hours have you studied for this week outside the classroom? How many hours do you think you should be studying?<br />Are you working now as hard as you did last year or earlier in your school career?<br />For your last homework, was your objective… to avoid doing it for as long as possible… to complete it as quickly as possible… or to get the best possible grade?'
      },
      'SYSTEMS': {
        'High': 'Are you spending more time on one subject than the others? Why?<br />How could you create an extra hour every day to use in a productive way?<br />What organisational advice would you give to a new student?',
        'Medium': 'What is next week looking like for you?<br />How do you tackle writing an extended response to a difficult question if you're given ten days to do it?<br />How do you follow-up classwork done during the day?',
        'Low': 'Are you comfortable meeting all deadlines? Describe a time you missed a deadline.<br />Do you still work in the same ways as you used to? What is good about these? What isn't working and why?<br />Suggest an object/thing – maybe something you could buy or borrow - that would make you more organised.',
        'Very Low': 'Would you rather spend 1 hour working in class or 1 hr working at home? Why?<br />How do you know what work is currently outstanding?<br />If you could change one aspect about the way you work – what would it be and how would you change it?'
      },
      'PRACTICE': {
        'High': 'What do you \'do\' with the information we give you? How do you use it/transform it?<br />When was the last time you tested yourself? When did you last ask someone else to test you?<br />Is getting something wrong a disaster, is it a spur to (eventually) find the right answer, or something else?',
        'Medium': 'Pick one of your subjects - which aspects of this subject do you least need to revise? Why?<br />How comfortable is the process of revision for you? How could you make it less comfortable?<br />Do you tend to focus/practice the content that you enjoy?',
        'Low': 'Choose a subject. If you had one hour, and no homework, what would you do to help your learning in it?<br />Do you do past paper questions? Describe the last time you tried something under timed conditions.<br />What's the hardest exam question you expect to face? What are you doing about it?',
        'Very Low': 'Is revision boring for you? Why? Explain your answer.<br />If you could pick one revision activity to use to prepare for an exam what would it be?<br />Describe a revision session you've recently done.'
      },
      'ATTITUDE': {
        'High': 'How do you feel and respond when you get marked work back?<br />If you get a low grade, what do you do to make sure it doesn't happen again?<br />Describe a moment when you felt proud.',
        'Medium': 'When something goes wrong in your studies, what do you do?<br />Describe something you have persevered with in the past. How did you conquer the challenge?<br />Describe a time you've taken the initiative.',
        'Low': 'What's the biggest mistake you have made so far? What have you learnt/how did you deal with it?<br />How do other people respond to disappointing grades? Can you name someone who responds differently to you? How?<br />What do you feel is the difference between you and a top 'A grade' student? List five if you can',
        'Very Low': 'What have you done since the start of the year that you are proud of?<br />Are you willing to contribute in class? Name a student who contributes more than you. What is their learning like?<br />Advise your friend if they have a grade they're unhappy with.'
      }
    };
    
    return coachingData[category] && coachingData[category][level] ? coachingData[category][level] : 'No coaching questions available.';
  };

  // Function to get description from JSON structure  
  const getDescription = (category, score) => {
    const level = getPerformanceLevel(score);
    
    // Sample descriptions based on JSON structure
    const descriptions = {
      'VISION': {
        'High': 'You are a person with a very clear idea of what you would like to achieve in the future. Once you set a goal you strive hard to reach it, making lists of actions you must take.',
        'Medium': 'You are a person with a reasonably clear idea of what you want to do in the future, but you might not be 100% sure whether university, employment or work-based training is the right choice for you.',
        'Low': 'You are a person with some idea of what you would like to achieve in the future, but you might not give much attention to your career planning, preferring to defer the decision.',
        'Very Low': 'At the moment you may be the type of person who finds thinking about the future challenging or uncomfortable. It might feel much easier to just ignore it.'
      },
      'EFFORT': {
        'High': 'You are a very hard-working student. You are likely to be very focused in lessons and give your best to every task.',
        'Medium': 'You are a reasonably hard-working student, but you know that you could be working harder. You generally use your study periods effectively.',
        'Low': 'Your score suggests that you are working within your comfort zone. You might have made small improvements to last year\'s levels of effort but deep down you know you could be working much harder.',
        'Very Low': 'It\'s very likely you are currently not achieving what you could be and deep down you know that you are not working hard enough to achieve your goals.'
      },
      'SYSTEMS': {
        'High': 'You are very good at organising your time and meeting deadlines. Your score suggests you are good at organising information in files or folders.',
        'Medium': 'You are likely to use most of your study periods effectively, organising your time well. You meet many of your deadlines, only missing when work piles up.',
        'Low': 'This systems score suggests you are fairly good at organising your time, and sometimes meet deadlines. However, it also suggests you don\'t always complete your homework on time.',
        'Very Low': 'Your systems score suggests that at the moment you prefer not to organise your time, and as a result you often miss deadlines.'
      },
      'PRACTICE': {
        'High': 'Your responses indicate you are able to revise and study in a targeted, efficient way. You\'ve summarised your courses efficiently.',
        'Medium': 'You use a reasonable range of revision strategies such as completing past paper questions under timed conditions. You might have handed in extra work for marking.',
        'Low': 'You are able to revise using familiar techniques, perhaps ones you\'ve used a lot before. Often your revision is passive and you may feel bored.',
        'Very Low': 'You may currently find it difficult to revise and you only use a small range of approaches. Perhaps when you do revise you only study the topics you are confident with.'
      },
      'ATTITUDE': {
        'High': 'You are likely to feel in control and calm before taking any assessments or exams. Most of the time you are confident in your own ability.',
        'Medium': 'You often feel confident and in control before tests and exams. You also feel confident in your own abilities, though there are infrequent occasions where you might question yourself.',
        'Low': 'You may feel nervous before assessments or exams. Normally you\'ll feel quite confident in your abilities although you could be set back by a disappointing result.',
        'Very Low': 'Currently you may tend to feel quite anxious on the build-up to assessments or exams. You might well feel angry at your situation and with yourself.'
      }
    };
    
    return descriptions[category] && descriptions[category][level] ? descriptions[category][level] : 'No description available.';
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