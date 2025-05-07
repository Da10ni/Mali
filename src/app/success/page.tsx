"use client";

import { useContext, useEffect, useState } from "react";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/src/context/AuthContext";
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from "@/src/store/store";
import { createBooking } from "@/src/services/Booking";

export default function SuccessPage() {
  const [bookingData, setBookingData] = useState<any>(null);
  const [date, setDate] = useState<any>(null);
  const userdata = useContext(AuthContext);
  const bookingdata = useSelector((state: RootState) => state.booking);
  console.log("bookingdata", bookingdata);

 
  const handleSyncToGoogleCalendar = async () => {
    console.error(bookingData);
    if (bookingData.length === 0) {
      alert("No bookings to sync.");
      return;
    }

    try {
  
      const {customerEmail, customerName, startTime, endTime, price, bookingUserId} = bookingData;

        // Create event for Google Calendar
        const event = {
          summary: `Meeting with ${customerName}`,
          description: `Booking via your app.\n\nEmail: ${customerEmail}`,
          startTime,
          endTime
        };

        console.log("Syncing event:", event);

        // 1. First, sync with Google Calendar
        const calRes = await fetch("/api/schedule", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(event),
        });

        const calData = await calRes.json();

        if (!calRes.ok) {
          throw new Error(calData.message || "Failed to create event");
        }

        console.log("Event created in Google Calendar:", calData);

        // 2. Then, send confirmation email to the user
        const meetingDetails = {
          summary: `Meeting with ${customerName}`,
          description: `Thank you for your booking. We look forward to meeting with you.`,
          location:
            "Online Meeting (Google Meet link will be shared before the meeting)",
          startTime ,
          endTime 
        };

        const emailRes = await fetch("/api/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            meetingDetails,
            userEmail: customerEmail
          }),
        });

        if (!emailRes.ok) {
          const emailData = await emailRes.json();
          console.error("Failed to send email:", emailData);
          // Continue with other bookings even if email fails
        } else {
          // console.log(`Confirmation email sent to ${booking.email}`);
        }
        createBooking(date , customerEmail, customerName, bookingUserId, price);

        alert(
          "🎉 All bookings synced to Google Calendar and confirmation emails sent!"
        );
      }

     
     catch (error) {
      console.error(
        "Error syncing to Google Calendar or sending emails:",
        error
      );
      alert("❌ Failed to sync bookings. Check console for details.");
    }
  };

  useEffect(() => {
    const data = localStorage.getItem("bookingData");
    const datedata = localStorage.getItem("date");
    if (data) {
      setBookingData(JSON.parse(data));
      setDate(JSON.parse(datedata));
    }
  }, []);

  useEffect(() => {
    if (bookingData) {
      handleSyncToGoogleCalendar();
    }
  }, [bookingData]);

  return (
    <div className="h-screen flex justify-center items-center">
      <h1 className="text-3xl font-bold text-green-500">
        Payment Successful! 🎉
      </h1>
    </div>
  );
}
