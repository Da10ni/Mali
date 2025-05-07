import { DateTime } from 'luxon';
import fs from 'fs';

// Function to generate .ics file
export const generateICS = (startTime: string, endTime: string, summary: string, description: string, location: string) => {
  const start = DateTime.fromISO(startTime, { zone: 'Asia/Karachi' }).toFormat("yyyyMMdd'T'HHmmss");
  const end = DateTime.fromISO(endTime, { zone: 'Asia/Karachi' }).toFormat("yyyyMMdd'T'HHmmss");

  // iCalendar format (.ics)
  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Your Company//NONSGML v1.0//EN
BEGIN:VEVENT
UID:${Date.now()}@yourdomain.com
DTSTAMP:${start}
DTSTART:${start}
DTEND:${end}
SUMMARY:${summary}
DESCRIPTION:${description}
LOCATION:${location}
STATUS:CONFIRMED
BEGIN:VALARM
TRIGGER:-PT15M
DESCRIPTION:Reminder
ACTION:DISPLAY
END:VALARM
END:VEVENT
END:VCALENDAR`;

  // Save the .ics file
  const filePath = `./public/${summary.replace(/\s+/g, '_')}_${start}.ics`;
  fs.writeFileSync(filePath, icsContent);
  return filePath;
};
