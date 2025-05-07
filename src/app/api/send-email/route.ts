import nodemailer from 'nodemailer';
import { DateTime } from 'luxon';

export async function POST(req: Request) {
  try {
    const { meetingDetails, userEmail } = await req.json();
    const { summary, description, location, startTime, endTime } = meetingDetails;
    
    // Parse the meeting time details
    const start = DateTime.fromISO(startTime);
    const end = DateTime.fromISO(endTime);
    
    // Format the dates for display
    const meetingDate = start.toFormat('dd MMM yyyy');
    const meetingTimeRange = `${start.toFormat('h:mm')} - ${end.toFormat('h:mma')}`;
    const meetingDay = start.toFormat('cccc');
    const monthShort = start.toFormat('MMM');
    const dayNumber = start.toFormat('d');
    const weekdayShort = start.toFormat('ccc');
    const timezone = start.toFormat('ZZZZ');
    
    // Create the email HTML with a Google Calendar-like template
    const emailHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Meeting Invitation</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #202124;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      border: 1px solid #dadce0;
      border-radius: 8px;
      overflow: hidden;
    }
    .email-header {
      background-color: #f1f3f4;
      padding: 12px 20px;
      border-bottom: 1px solid #dadce0;
    }
    .email-subject {
      font-size: 16px;
      color: #202124;
      margin: 0;
      font-weight: normal;
    }
    .email-label {
      color: #5f6368;
      font-size: 12px;
      text-transform: uppercase;
      margin: 0;
    }
    .email-body {
      padding: 20px;
    }
    .calendar-block {
      display: flex;
      margin-bottom: 20px;
    }
    .date-block {
      background: #1a73e8;
      color: white;
      text-align: center;
      padding: 8px 12px;
      margin-right: 15px;
      border-radius: 4px;
      min-width: 50px;
    }
    .month {
      font-size: 12px;
      text-transform: uppercase;
      font-weight: bold;
    }
    .day {
      font-size: 24px;
      font-weight: bold;
      line-height: 1;
    }
    .weekday {
      font-size: 12px;
    }
    .meeting-details {
      flex: 1;
    }
    .meeting-title {
      font-size: 16px;
      font-weight: bold;
      color: #1a73e8;
      margin: 0 0 5px 0;
    }
    .calendar-link {
      font-size: 12px;
      color: #1a73e8;
      text-decoration: none;
    }
    .detail-row {
      margin-bottom: 12px;
    }
    .detail-label {
      color: #5f6368;
      font-size: 12px;
      margin: 0;
    }
    .detail-value {
      margin: 0;
      font-size: 14px;
    }
    .response-buttons {
      display: flex;
      gap: 8px;
      margin: 25px 0;
    }
    .btn {
      border: 1px solid #dadce0;
      background: #ffffff;
      border-radius: 4px;
      padding: 8px 12px;
      font-size: 14px;
      cursor: pointer;
      text-decoration: none;
      color: #202124;
    }
    .btn-yes {
      border-color: #1a73e8;
      color: #1a73e8;
    }
    .btn-more {
      color: #5f6368;
    }
    .meeting-body {
      padding: 15px 0;
      border-top: 1px solid #dadce0;
      margin-top: 15px;
    }
    .agenda-section {
      background: #f8f9fa;
      border: 1px solid #dadce0;
      border-radius: 4px;
      padding: 12px;
      margin-top: 20px;
    }
    .agenda-header {
      font-weight: bold;
      margin-bottom: 5px;
    }
    .agenda-time {
      font-size: 13px;
      color: #5f6368;
    }
    .agenda-event {
      display: flex;
      margin: 8px 0;
    }
    .time-block {
      width: 75px;
      font-size: 13px;
      color: #5f6368;
    }
    .join-button {
      display: block;
      background: #1a73e8;
      color: white;
      text-align: center;
      padding: 10px;
      border-radius: 4px;
      text-decoration: none;
      font-weight: bold;
      margin: 20px 0;
    }
    .meeting-link {
      word-break: break-all;
      font-size: 12px;
      color: #1a73e8;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1 class="email-subject">Invitation: ${summary} @ ${meetingDay} ${meetingDate} ${meetingTimeRange} (${timezone})</h1>
      <p class="email-label">Inbox</p>
    </div>
    
    <div class="email-body">
      <div class="sender-info">
        <p>Your Meeting Organizer<br>to ${userEmail}</p>
      </div>
      
      <div class="calendar-block">
        <div class="date-block">
          <div class="month">${monthShort}</div>
          <div class="day">${dayNumber}</div>
          <div class="weekday">${weekdayShort}</div>
        </div>
        
        <div class="meeting-details">
          <h2 class="meeting-title">${summary}</h2>
          <a href="#" class="calendar-link">View on Google Calendar</a>
          
          <div class="detail-row">
            <p class="detail-label">When</p>
            <p class="detail-value">${meetingDay} ${meetingDate} ${meetingTimeRange} (${timezone})</p>
          </div>
          
          <div class="detail-row">
            <p class="detail-label">Where</p>
            <p class="detail-value">${location || 'Online Meeting'}</p>
          </div>
          
          <div class="detail-row">
            <p class="detail-label">Who</p>
            <p class="detail-value">Meeting Organizer</p>
          </div>
        </div>
      </div>
      
      <div class="response-buttons">
        <a href="#" class="btn btn-yes">Yes</a>
        <a href="#" class="btn">Maybe</a>
        <a href="#" class="btn">No</a>
        <a href="#" class="btn btn-more">More options</a>
      </div>
      
      <div class="meeting-body">
        <p>${description}</p>
        
        <div class="meeting-details-extended">
          <p><strong>When</strong><br>
          ${meetingDay} ${meetingDate} · ${meetingTimeRange} (${timezone})</p>
          
          <p><strong>Location</strong><br>
          ${location || 'Online Meeting'}<br>
          <a href="#" class="calendar-link">View map</a></p>
        </div>
        
        <a href="#" class="join-button">Join with Google Meet</a>
        
        <div class="meeting-link-section">
          <p><strong>Meeting link</strong><br>
          <a href="#" class="meeting-link">meet.google.com/example-meeting-link</a></p>
        </div>
      </div>
      
      <div class="agenda-section">
        <div class="agenda-header">Agenda</div>
        <div class="agenda-time">${start.toFormat('dd MMM yyyy')}</div>
        
        <div class="agenda-event">
          <div class="time-block">${start.toFormat('h:mma')}</div>
          <div>${summary}</div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

    // Generate the ICS content for calendar attachment
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Your Company//Calendar Event//EN
BEGIN:VEVENT
UID:${Date.now()}@yourdomain.com
DTSTAMP:${start.toFormat("yyyyMMdd'T'HHmmss")}
DTSTART:${start.toFormat("yyyyMMdd'T'HHmmss")}
DTEND:${end.toFormat("yyyyMMdd'T'HHmmss")}
SUMMARY:${summary}
DESCRIPTION:${description.replace(/\n/g, '\\n')}
LOCATION:${location || 'Online Meeting'}
STATUS:CONFIRMED
BEGIN:VALARM
TRIGGER:-PT15M
DESCRIPTION:Reminder
ACTION:DISPLAY
END:VALARM
END:VEVENT
END:VCALENDAR`;

    // Configure email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      }
    });

    // Send the email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"Meeting Organizer" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Invitation: ${summary} @ ${meetingDay} ${meetingDate} ${meetingTimeRange}`,
      text: `You're invited to ${summary} on ${meetingDay}, ${meetingDate} at ${meetingTimeRange}. Please find the calendar attachment for details.`,
      html: emailHtml,
      attachments: [
        {
          filename: 'meeting.ics',
          content: icsContent,
          contentType: 'text/calendar'
        }
      ]
    });

    return new Response(JSON.stringify({ 
      message: 'Meeting invitation sent successfully!',
      messageId: info.messageId
    }), { status: 200 });
    
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(JSON.stringify({ 
      message: 'Failed to send meeting invitation',
      error: error.message 
    }), { status: 500 });
  }
}