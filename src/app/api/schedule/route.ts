import { google } from 'googleapis';
import { DateTime } from 'luxon';

export async function POST(req) {
  try {
    const body = await req.json();
    const { summary, description, startTime, endTime } = body;

    console.log('Original Start Time:', startTime);
    console.log('Original End Time:', endTime);

    const startDateTime = DateTime.fromISO(startTime).toISO();  

    const endDateTime = DateTime.fromISO(endTime).toISO();


    console.log('Converted Start Time:', startDateTime);
    console.log('Converted End Time:', endDateTime);

    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oAuth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

    const event = {
      summary,
      description,
      start: {
        dateTime: startDateTime,
        timeZone: 'Asia/Karachi', 
      },
      end: {
        dateTime: endDateTime,
        timeZone: 'Asia/Karachi', 
      },
      conferenceData: {
        createRequest: {
          requestId: `sample${Date.now()}`,
          conferenceSolutionKey: {
            type: 'hangoutsMeet', 
          },
          status: {
            statusCode: 'success',
          },
        },
      },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
      conferenceDataVersion: 1, 
    });

    return new Response(JSON.stringify({ message: 'Event created', event: response.data }), { status: 200 });
  } catch (error) {
    console.error('Google Calendar API Error:', error.message, error);
    return new Response(JSON.stringify({ message: 'Internal Server Error', error: error.message }), { status: 500 });
  }
}
