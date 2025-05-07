import React, { useState, useEffect, useContext } from "react";
import { FiShare2 } from "react-icons/fi";
import Header from "../UI/Header";
import ProfileThemePicker from "../UI/ThemePicker";
import DatePicker from "../UI/DatePicker";
import TimeSlotSelector from "./TimeSlot";
import BookingManager from "./BookingManager";
import BookingDetailsView from "./BookingDetails";
import BookingCard from "./BookingPreview";
import Calendar from "../UI/Calendar";
import { sendMagicLink } from "@/src/lib/nodemailer";
import Textinput from "../UI/Textinput";
import { FormProvider, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { DateTime } from 'luxon';
import { RootState } from "@/src/store/store";
import { useSelector, useDispatch } from 'react-redux'
import { AuthContext } from "@/src/context/AuthContext";
import Email from "next-auth/providers/email";


interface AvailabilityState {
  [key: string]: {
    selected: boolean;
    from: string;
    to: string;
  };
}

interface BookedSlotsInterface {
  [day: string]: {
    [date: string]: string[];
  };
}

interface BookingDetail {
  name: string;
  email: string;
  day: string;
  date: string;
  time: string;
  month?: string;
  isoDate?: string;
}

const BookingPage: React.FC = () => {
  const methods = useForm();
  const udata = useContext(AuthContext);
  const {bookingpagebg, bookingpagetext} = useSelector((state: RootState) => state.booking);
  console.log("udata", udata);

  // Shared state for both form and preview
  const [activeTab, setActiveTab] = useState("Thumbnail");
  const [image, setImage] = useState<File | null>(null);
  const [title, setTitle] = useState("Book a 1:1 Call with Me");
  const [price, setPrice] = useState("$9.99");
  const [description, setDescription] = useState(
    "I am here to help you achieve your goals."
  );
  const [bottomTitle, setBottomTitle] = useState("Work With Me 1:1");
  const [timezone, setTimezone] = useState("Asia/Dubai");
  const [duration, setDuration] = useState("30 minutes");
  const [currentMonth, setCurrentMonth] = useState("May 2025");
  const [bookingDetails, setBookingDetails] = useState<BookingDetail[]>([]);
  const [cardBgColor, setCardBgColor] = useState("bg-gray-100");
  const [cardTextColor, setCardTextColor] = useState("text-gray-700");
  const [blockedDates, setBlockedDates] = useState<string[]>([
    "2025-05-01",
    "2025-05-15",
    "2025-05-20",
  ]);
  const [availability, setAvailability] = useState<AvailabilityState>({});
  const [bookedSlots, setBookedSlots] = useState<BookedSlotsInterface>({});
  const userData = useSelector((state: RootState) => state.user);

  // Modal states
  const [selectedBookingDetails, setSelectedBookingDetails] = useState<{
    day: string;
    date: string;
    bookings: Array<{
      time: string;
      name: string;
      email: string;
    }>;
  } | null>(null);
  const [showBookedDetailsModal, setShowBookedDetailsModal] = useState(false);
  const router = useRouter();

  // Handler functions
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  // ThemePicker handlers - these adapt to the expected props of ThemePicker
  const setBgColor = (color: string) => {
    setCardBgColor(color);
  };

  const setTextColor = (color: string) => {
    setCardTextColor(color);
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  // Helper function for month name to index
  const getMonthIndexFromName = (monthName: string): number => {
    const months: Record<string, number> = {
      January: 0,
      February: 1,
      March: 2,
      April: 3,
      May: 4,
      June: 5,
      July: 6,
      August: 7,
      September: 8,
      October: 9,
      November: 10,
      December: 11,
    };

    return months[monthName] || 0;
  };

  // Add booking function - implementation
  const addBookingImpl = (
    day: string,
    date: string,
    time: string,
    name: string,
    email: string,
    bookingMonth = currentMonth
  ) => {
    console.log(
      `Adding booking for month: ${bookingMonth}, date: ${date}, day: ${day}`
    );

    // Parse the month and year
    const [monthName, yearStr] = bookingMonth.split(" ");
    const year = parseInt(yearStr);
    const monthIndex = getMonthIndexFromName(monthName);

    // Create a complete date object
    const fullDate = new Date(year, monthIndex, parseInt(date));

    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayOfWeek = daysOfWeek[fullDate.getDay()];

    // Create an ISO string for unambiguous date storage
    const isoDate = fullDate.toISOString();

    // Check if date is blocked
    const dateString = fullDate.toISOString().split("T")[0];
    if (blockedDates.includes(dateString)) {
      alert("Cannot add booking to a blocked date.");
      return;
    }

    // Store the complete booking with all date information
    const newBooking = {
      name,
      email,
      day: dayOfWeek, // Use calculated day of week
      date,
      time,
      month: bookingMonth, // Store the month string
      isoDate, // Store the complete ISO date
    };

    setBookingDetails((prev) => [...prev, newBooking]);

    setBookedSlots((prev) => {
      const newBookedSlots = { ...prev };

      if (!newBookedSlots[dayOfWeek]) {
        newBookedSlots[dayOfWeek] = {};
      }

      if (!newBookedSlots[dayOfWeek][date]) {
        newBookedSlots[dayOfWeek][date] = [];
      }

      if (!newBookedSlots[dayOfWeek][date].includes(time)) {
        newBookedSlots[dayOfWeek][date] = [
          ...newBookedSlots[dayOfWeek][date],
          time,
        ];
      }

      return newBookedSlots;
      console.log(newBookedSlots);
    });

    console.log(
      `Booking added: ${name} on ${dayOfWeek}, ${monthName} ${date}, ${year} at ${time}`
    );
    console.log(`ISO Date: ${isoDate}`);

    alert(
      `Booking confirmed for ${name} (${email}) on ${dayOfWeek}, ${monthName} ${date}, ${year} at ${time}`
    );
  };

  // Adapter for BookingManager - expects parameters version
  // Adapter for BookingCard - expects object version (if needed)
  const addBooking = (booking: BookingDetail) => {
    const { day, date, time, name, email, month } = booking;
    const bookingMonth = month || currentMonth;
    addBookingImpl(day, date, time, name, email, month || currentMonth);
  };

  const handleDayClick = (day: string) => {
    const selectedDateObj = new Date(
      parseInt(currentMonth.split(" ")[1]),
      getMonthIndexFromName(currentMonth.split(" ")[0]),
      parseInt(day)
    );
    const dayOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ][selectedDateObj.getDay()];

    // Get the ISO date string
    const selectedISODate = selectedDateObj.toISOString().split("T")[0];

    // Get bookings for this date by checking if their ISO date starts with the selected date
    const bookingsForDate = bookingDetails.filter((booking) =>
      booking.isoDate?.startsWith(selectedISODate)
    );

    // If there are bookings, show the modal
    if (bookingsForDate.length > 0) {
      setSelectedBookingDetails({
        day: dayOfWeek,
        date: day,
        bookings: bookingsForDate.map((booking) => ({
          time: booking.time,
          name: booking.name,
          email: booking.email,
        })),
      });
      setShowBookedDetailsModal(true);
    } else {
      alert(
        `No bookings found for ${dayOfWeek}, ${
          currentMonth.split(" ")[0]
        } ${day}`
      );
    }
  };

  const handleDayToggle = (day: string) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        selected: !prev[day].selected,
      },
    }));
  };

  const handleTimeChange = (
    day: string,
    type: "from" | "to",
    value: string
  ) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [type]: value,
      },
    }));
  };

  const handleMonthChange = (newMonth: string) => {
    setCurrentMonth(newMonth);
  };

  const removeBooking = (day: string, date: string, time: string) => {
    setBookingDetails((prev) =>
      prev.filter(
        (booking) =>
          !(
            booking.day === day &&
            booking.date === date &&
            booking.time === time
          )
      )
    );

    setBookedSlots((prev) => {
      const newBookedSlots = { ...prev };

      if (newBookedSlots[day] && newBookedSlots[day][date]) {
        newBookedSlots[day][date] = newBookedSlots[day][date].filter(
          (t) => t !== time
        );

        if (newBookedSlots[day][date].length === 0) {
          delete newBookedSlots[day][date];
        }

        if (Object.keys(newBookedSlots[day]).length === 0) {
          delete newBookedSlots[day];
        }
      }
      console.log("Data Found", newBookedSlots);
      return newBookedSlots;

    });
  };

  const handleAddBlockedDate = (date: string) => {
    if (!blockedDates.includes(date)) {
      setBlockedDates((prev) => [...prev, date]);
    }
  };

  const handleRemoveBlockedDate = (date: string) => {
    setBlockedDates((prev) => prev.filter((d) => d !== date));
  };

  const formatTimeTo24Hour = (timeStr: string) => {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours).toString();

    if (modifier === "PM" && hours !== "12") {
      hours = (parseInt(hours) + 12).toString();
    }
    if (modifier === "AM" && hours === "12") {
      hours = "00";
    }

    if (hours.length === 1) {
      hours = "0" + hours; // Pad with 0 if needed
    }

    return `${hours}:${minutes}`;
  };

  // Updated handleSyncToGoogleCalendar function that sends confirmation emails
  const handleSyncToGoogleCalendar = async () => {
    if (bookingDetails.length === 0) {
      alert("No bookings to sync.");
      return;
    }
  
    try {
      for (const booking of bookingDetails) {
        if (!booking.isoDate || !booking.time) {
          console.error("Booking missing date/time:", booking);
          continue;
        }
  
        // Convert the start time to Date object and ensure it's valid
        const formattedStartTime = DateTime.fromISO(
          `${booking.isoDate.slice(0, 10)}T${formatTimeTo24Hour(booking.time)}:00`,
          { zone: 'Asia/Dubai' }
        ).toJSDate();  // Convert to JavaScript Date object
  
        if (isNaN(formattedStartTime.getTime())) {
          console.error("Invalid start time:", formattedStartTime);
          continue;
        }
  
        const startTime = formattedStartTime.toISOString();  // Convert to ISO string for Google Calendar
  
        // Calculate end time based on duration
        const durationMinutes = parseInt(duration.split(" ")[0]);
        const endTime = new Date(formattedStartTime.getTime() + durationMinutes * 60000).toISOString();
  
        // Create event for Google Calendar
        const event = {
          summary: `Meeting with ${booking.name}`,
          description: `Booking via your app.\n\nEmail: ${booking.email}`,
          startTime,
          endTime,
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
          summary: `Meeting with ${booking.name}`,
          description: `Thank you for your booking. We look forward to meeting with you.`,
          location: "Online Meeting (Google Meet link will be shared before the meeting)",
          startTime,
          endTime,
        };
  
        const emailRes = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            meetingDetails,
            userEmail: booking.email,
          }),
        });
  
        if (!emailRes.ok) {
          const emailData = await emailRes.json();
          console.error("Failed to send email:", emailData);
          // Continue with other bookings even if email fails
        } else {
          console.log(`Confirmation email sent to ${booking.email}`);
        }
      }
  
      alert("🎉 All bookings synced to Google Calendar and confirmation emails sent!");
    } catch (error) {
      console.error("Error syncing to Google Calendar or sending emails:", error);
      alert("❌ Failed to sync bookings. Check console for details.");
    }
  };
  
  const safebooking = async () => {
    try {

      const bookingData = {
        email: udata?.user?.email,
        username: udata?.user?.username, // Replace with actual username from your auth system if available
        title,
        description,
        price,
        bottomTitle,
        timezone,
        blockedDates,
        bookingpagebgcolor: bookingpagebg,
        bookingpagetextcolor: bookingpagetext,
        //availability,
        //cardBgColor,
        //cardTextColor,
        //bookingDetails,
        image: udata?.user?.profilepicture,
      };
  
      localStorage.setItem("bookingData", JSON.stringify(bookingData));
  
      const response = await fetch("/api/booking/booking-page", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData), 
      });
  
      if (!response.ok) {
        const errorData = await response.text(); 
        console.error("Error response:", errorData); 
        throw new Error(errorData || "Failed to save booking configuration");
      }
  
      const resultText = await response.text();
      const result = resultText ? JSON.parse(resultText) : {}; 
  
      console.log("Booking configuration saved successfully:", result);
  
      alert("Your booking configuration has been published successfully!");
      router.push("/myshop");
    } catch (error) {
      console.error("Error publishing booking:", error);
      alert(`Failed to publish booking: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };
  
  return (
    <FormProvider {...methods}>
      <div className="min-h-[550px] bg-gray-50 flex w-[90%]">
        {/* Left Side - Form */}
        <div className="w-2/3 pb-[6%] border ml-8 mt-7 rounded-2xl items-center justify-center  p-8">
          <div className="flex space-x-6 mb-8">
            {["Thumbnail", "Checkout Page", "Availability", "Options"].map(
              (tab) => (
                <button
                  key={tab}
                  className={`px-4 py-2 rounded-lg ${
                    activeTab === tab
                      ? "bg-purple-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                  onClick={() => handleTabClick(tab)}
                >
                  {tab}
                </button>
              )
            )}
            <button
              onClick={() =>
                safebooking( )
              }
              className="bg-green-500 text-white text-lg p-2 rounded-md"
            >
              Save
            </button>
          </div>
          {activeTab === "Thumbnail" && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">1. Select Image</h2>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              {image && (
                <img
                  src={URL.createObjectURL(image)}
                  alt="Selected"
                  className="mt-4 max-w-full"
                />
              )}
            </div>
          )}

          {activeTab === "Checkout Page" && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">Write Description</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Description Body *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={3}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Bottom Title *
                </label>
                <input
                  type="text"
                  value={bottomTitle}
                  onChange={(e) => setBottomTitle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          )}

          {/* Availability Section */}
          {activeTab === "Availability" && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">
                1. Configure Settings
              </h2>

              <div className="flex gap-10 items-center mb-4">
                <div className="flex flex-col">
                  <h4 className="text-purple-500 text-sm mb-2">Time Zone</h4>
                  <input
                    type="text"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-[300px] p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="flex flex-col">
                  <h4 className="text-purple-500 text-sm mb-2">
                    Duration (min)
                  </h4>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-[300px] p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-purple-500 text-sm mb-2">Current Month</h4>
                <div className="flex items-center gap-2">
                  <span className="font-bold">{currentMonth}</span>
                  <span className="text-gray-500 text-sm">
                    (Use Calendar navigation to change months)
                  </span>
                </div>
              </div>

              <DatePicker
                onBlockDate={handleAddBlockedDate}
                blockedDates={blockedDates}
                onRemoveDate={handleRemoveBlockedDate}
              />

              <h2 onClick={() => console.log(bookedSlots)} className="text-lg font-semibold mb-4">
                2. Set Availability
              </h2>
              <div className="space-y-4">
                {Object.keys(availability).map((day) => (
                  <div key={day} className="flex items-center space-x-4">
                    <button
                      onClick={() => handleDayToggle(day)}
                      className={`px-4 py-2 mb-2 rounded-lg ${
                        availability[day]?.selected
                          ? "bg-purple-500 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      {day}
                    </button>

                    {availability[day]?.selected && (
                      <div className="time-slot-selector">
                        <TimeSlotSelector
                          day={day}
                          selectedFrom={availability[day].from}
                          selectedTo={availability[day].to}
                          onTimeChange={handleTimeChange}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <BookingManager
                bookedSlots={bookedSlots}
                onAddBooking={(booking) => addBooking(booking)} // Pass booking object here
                onRemoveBooking={removeBooking}
                currentMonth={currentMonth}
                blockedDates={blockedDates}
              />

              <BookingDetailsView
                bookings={bookingDetails}
                onRemoveBooking={removeBooking}
                currentMonth={currentMonth}
              />

              <Calendar
                availability={availability}
                onDayClick={handleDayClick}
                currentMonth={currentMonth}
                onMonthChange={handleMonthChange}
                bookedSlots={bookedSlots}
                blockedDates={blockedDates}
              />

              {showBookedDetailsModal && selectedBookingDetails && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 max-w-md w-full">
                    <h2 className="text-xl font-semibold mb-4">
                      Bookings for {selectedBookingDetails.day},{" "}
                      {currentMonth.split(" ")[0]} {selectedBookingDetails.date}
                    </h2>

                    <div className="space-y-4 mb-6">
                      {selectedBookingDetails.bookings.map((booking, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-md p-4"
                        >
                          <div className="font-medium text-blue-600 mb-2">
                            {booking.time}
                          </div>
                          <div className="text-sm">
                            <div>
                              <span className="font-medium">Name:</span>{" "}
                              {booking.name}
                            </div>
                            <div>
                              <span className="font-medium">Email:</span>{" "}
                              {booking.email}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setShowBookedDetailsModal(false)}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "Options" && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">
                Sync to Google Calendar
              </h2>

              <button
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-lg"
                onClick={handleSyncToGoogleCalendar}
              >
                Sync Bookings
              </button>
            </div>
          )}
        </div>

        {/* Right Side - BookingCard Preview */}
        <div className="w-full lg:mt-5 fixed right-0 top-1/2 transform -translate-y-1/2 mb-6 lg:w-1/3 lg:mr-8">
          <BookingCard
          classname="h-[680px]"
            title={title}
            price={price}
            description={description}
            timezone={timezone}
            bgColor={bookingpagebg}
            textColor={bookingpagetext}
            image={image}
            selectedDays={[]} // Example selected days
            currentMonth={currentMonth}
            availability={availability}
            onDayClick={handleDayClick}
            bookedSlots={bookedSlots}
            blockedDates={blockedDates}
          />
        </div>
      </div>
    </FormProvider>
  );
};

export default BookingPage;
