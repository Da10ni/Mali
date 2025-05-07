// // "use client";
// // import React, { useState, useEffect } from "react";
// // import { useSession } from "next-auth/react";
// // import Calendar from "../UI/Calendar"; 
// // import { FormProvider, useForm } from "react-hook-form";
// // import Textinput from "../UI/Textinput";
// // import BookingDetailsView from "./BookingDetails";
// // import BookingManager from "./BookingManager";

// // interface BookingDetail {
// //   name: string;
// //   email: string;
// //   day: string;
// //   date: string;
// //   time: string;
// //   month?: string;
// //   isoDate?: string;
// // }

// // interface BookingCardProps {
// //   title?: string;
// //   price?: string;
// //   image?: any;
// //   description?: any;
// //   timezone?: string;
// //   bgColor: string;
// //   textColor: string;
// //   selectedDays?: string[];
// //   currentMonth?: string;
// //   availability: any; 
// //   onDayClick: (day: string) => void;
// //   bookedSlots?: any; 
// //   blockedDates?: string[]; 
// //   bookings?: BookingDetail[]; 
// //   onAddBooking?: (booking: BookingDetail) => void;
// //   maxHeight?: string;
// //   maxWidth?: string;
// //   classname?: string;
// // }

// // const BookingCard: React.FC<BookingCardProps> = ({
// //   title = "Book a 1:1 Call with Me",
// //   price = "$9.99",
// //   description = "I am here to help you achieve your goals.",
// //   timezone = "Asia/Dubai",
// //   bgColor,
// //   image,
// //   textColor,
// //   selectedDays = ["14", "21", "28"],
// //   availability,
// //   onDayClick,
// //   bookedSlots = {}, 
// //   blockedDates = [], 
// //   bookings = [], 
// //   onAddBooking, 
// //   maxHeight = "650px",
// //   maxWidth = "350px",
// //   classname = "",
// // }) => {
// //   const methods = useForm();
  
// //   const [localBookings, setLocalBookings] = useState<BookingDetail[]>(bookings);
// //   const [bookingDetails, setBookingDetails] = useState<BookingDetail[]>([]);
// //   const [currentMonth, setCurrentMonth] = useState("May 2025");
// //   const [selectedBookingDetails, setSelectedBookingDetails] = useState<{
// //       day: string;
// //       date: string;
// //       bookings: Array<{
// //         time: string;
// //         name: string;
// //         email: string;
// //       }>;
// //     } | null>(null);
// //   const [showBookedDetailsModal, setShowBookedDetailsModal] = useState(false);

// //   // This is the important change - we need to transform bookedSlots if needed
// //   const [processedBookedSlots, setProcessedBookedSlots] = useState(bookedSlots);

// //   const [userDetails, setUserDetails] = useState<{
// //     username: string;
// //     email: string;
// //   }>({
// //     username: "Guest",
// //     email: "guest@example.com",
// //   });

// //   const { data: session } = useSession();

// //   // Process bookedSlots to ensure they're in the correct format for the Calendar
// //   useEffect(() => {
// //     // Detect the format of bookedSlots
// //     const firstKey = Object.keys(bookedSlots)[0];
    
// //     // If firstKey is a day of week like "Monday", we need to transform
// //     if (firstKey && ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].includes(firstKey)) {
// //       console.log("Converting day-based bookedSlots to month-based format");
      
// //       // Create a new month-based structure
// //       const monthBasedSlots = {
// //         [currentMonth]: {}
// //       };
      
// //       // Transform the structure
// //       Object.keys(bookedSlots).forEach(dayOfWeek => {
// //         Object.keys(bookedSlots[dayOfWeek]).forEach(date => {
// //           if (!monthBasedSlots[currentMonth][date]) {
// //             monthBasedSlots[currentMonth][date] = [];
// //           }
          
// //           // Add all times for this date
// //           bookedSlots[dayOfWeek][date].forEach(time => {
// //             if (!monthBasedSlots[currentMonth][date].includes(time)) {
// //               monthBasedSlots[currentMonth][date].push(time);
// //             }
// //           });
// //         });
// //       });
      
// //       setProcessedBookedSlots(monthBasedSlots);
// //       console.log("Transformed bookedSlots:", monthBasedSlots);
// //     } else {
// //       // It's already in the right format
// //       setProcessedBookedSlots(bookedSlots);
// //     }
// //   }, [ currentMonth]);

// //   // Update booking details based on localBookings
// //   useEffect(() => {
// //     setBookingDetails(localBookings);
// //   }, [localBookings]);

// //   useEffect(() => {
// //     if (session?.user?.email) {
// //       setUserDetails({
// //         email: session.user.email,
// //         username: session.user.name || "No username",
// //       });
// //     } else {
// //       const token = localStorage.getItem("token");
// //       if (token) {
// //         try {
// //           const payload = JSON.parse(atob(token.split(".")[1]));
// //           if (!payload.exp || Date.now() < payload.exp * 1000) {
// //             setUserDetails({
// //               email: payload.email || "No email",
// //               username: payload.username || "No username",
// //             });
// //           }
// //         } catch (err) {
// //           console.error("Error decoding token", err);
// //         }
// //       }
// //     }
// //   }, [session]);

// //   const getMonthIndexFromName = (monthName: string): number => {
// //     const months: Record<string, number> = {
// //       'January': 0,
// //       'February': 1,
// //       'March': 2,
// //       'April': 3,
// //       'May': 4,
// //       'June': 5,
// //       'July': 6,
// //       'August': 7,
// //       'September': 8,
// //       'October': 9,
// //       'November': 10,
// //       'December': 11
// //     };
    
// //     return months[monthName] || 0;
// //   };

// //   function addBooking(booking: BookingDetail): void {
// //     console.log(`Adding booking:`, booking);
    
// //     // Update the booking with the current month if not specified
// //     const updatedBooking = {
// //       ...booking,
// //       month: booking.month || currentMonth,
// //     };
    
// //     // Generate ISO date for the booking
// //     const monthName = updatedBooking.month.split(' ')[0];
// //     const year = updatedBooking.month.split(' ')[1];
// //     const date = parseInt(updatedBooking.date);
// //     const monthIndex = getMonthIndexFromName(monthName);
    
// //     const isoDate = new Date(parseInt(year), monthIndex, date)
// //       .toISOString()
// //       .split('T')[0];
    
// //     const bookingWithIsoDate = {
// //       ...updatedBooking,
// //       isoDate,
// //     };
    
// //     setLocalBookings(prevBookings => [...prevBookings, bookingWithIsoDate]);
    
// //     // Also update the processed booked slots
// //     setProcessedBookedSlots(prev => {
// //       const newSlots = { ...prev };
// //       const monthStr = updatedBooking.month;
      
// //       if (!newSlots[monthStr]) {
// //         newSlots[monthStr] = {};
// //       }
      
// //       if (!newSlots[monthStr][updatedBooking.date]) {
// //         newSlots[monthStr][updatedBooking.date] = [];
// //       }
      
// //       if (!newSlots[monthStr][updatedBooking.date].includes(updatedBooking.time)) {
// //         newSlots[monthStr][updatedBooking.date].push(updatedBooking.time);
// //       }
      
// //       return newSlots;
// //     });
    
// //     if (onAddBooking) {
// //       onAddBooking(bookingWithIsoDate);
// //     }
    
// //     alert(`Booking confirmed for ${booking.name} (${booking.email}) on ${booking.day}, ${booking.month || currentMonth} ${booking.date} at ${booking.time}`);
// //   }

// //   function removeBooking(day: string, date: string, time: string, month: string = currentMonth): void {
// //     console.log(`Removing booking: ${day}, ${date}, ${time}, ${month}`);
    
// //     setLocalBookings(prevBookings => 
// //       prevBookings.filter(booking => 
// //         !(booking.day === day && 
// //           booking.date === date && 
// //           booking.time === time &&
// //           (!month || booking.month === month))
// //       )
// //     );
    
// //     // Also update the processed booked slots
// //     setProcessedBookedSlots(prev => {
// //       const newSlots = { ...prev };
      
// //       if (newSlots[month] && newSlots[month][date]) {
// //         newSlots[month][date] = newSlots[month][date].filter(t => t !== time);
        
// //         if (newSlots[month][date].length === 0) {
// //           delete newSlots[month][date];
// //         }
        
// //         if (Object.keys(newSlots[month]).length === 0) {
// //           delete newSlots[month];
// //         }
// //       }
      
// //       return newSlots;
// //     });
    
// //     alert(`Booking on ${day}, ${date} at ${time} has been cancelled.`);
// //   }

// //   const getBackgroundColorClass = () => {
// //     if (bgColor?.startsWith('bg-')) {
// //       return bgColor;
// //     }
// //     return "bg-white";
// //   };

// //   const getTextColorClass = () => {
// //     if (textColor?.startsWith('text-')) {
// //       return textColor;
// //     }
// //     return "text-gray-800";
// //   };

// //   const handleDayClick = (day: string) => {
// //     const selectedDateObj = new Date(
// //       parseInt(currentMonth.split(" ")[1]),
// //       getMonthIndexFromName(currentMonth.split(" ")[0]),
// //       parseInt(day)
// //     );
// //     const dayOfWeek = [
// //       "Sunday",
// //       "Monday",
// //       "Tuesday",
// //       "Wednesday",
// //       "Thursday",
// //       "Friday",
// //       "Saturday",
// //     ][selectedDateObj.getDay()];

// //     // Get the ISO date string
// //     const selectedISODate = selectedDateObj.toISOString().split("T")[0];

// //     // Get bookings for this date by checking if their ISO date starts with the selected date
// //     const bookingsForDate = bookingDetails.filter((booking) =>
// //       booking.isoDate?.startsWith(selectedISODate)
// //     );

// //     // If there are bookings, show the modal
// //     if (bookingsForDate.length > 0) {
// //       setSelectedBookingDetails({
// //         day: dayOfWeek,
// //         date: day,
// //         bookings: bookingsForDate.map((booking) => ({
// //           time: booking.time,
// //           name: booking.name,
// //           email: booking.email,
// //         })),
// //       });
// //       setShowBookedDetailsModal(true);
// //     } else {
// //       alert(
// //         `No bookings found for ${dayOfWeek}, ${
// //           currentMonth.split(" ")[0]
// //         } ${day}`
// //       );
// //     }
// //   };

// //   const handleMonthChange = (newMonth: string) => {
// //     setCurrentMonth(newMonth);
// //   };

// //   // Debug function to log the current state of bookedSlots
// //   // const debugBookedSlots = () => {
// //   //   console.log("Current Month:", currentMonth);
// //   //   console.log("Original Booked Slots:", bookedSlots);
// //   //   console.log("Processed Booked Slots:", processedBookedSlots);
// //   //   console.log("Local Bookings:", localBookings);
// //   // };

// //   return (
// //     <FormProvider {...methods}>
// //       <div className="relative w-full mx-6 my-10    ">
// //         {/* Add a debug button in development environment */}
// //         {/* {process.env.NODE_ENV === 'development' && (
// //           <button 
// //             onClick={debugBookedSlots} 
// //             className="absolute top-0 right-0 bg-red-500 text-white p-1 text-xs z-50"
// //           >
// //             Debug Slots
// //           </button>
// //         )} */}
// //         <div
// //           className={`w-full mx-auto ${getBackgroundColorClass()} border border-gray-500 p-6 rounded-xl shadow-xl flex flex-col pt-2 absolute top-1/2 right-4 z-30 transform -translate-y-1/2 overflow-hidden h-[540px] ${classname}`}
// //           style={{
// //             maxWidth: maxWidth,
// //             maxHeight: maxHeight
// //           }}
// //         >
// //           <div className="overflow-auto h-full w-full pb-4" style={{ 
// //             msOverflowStyle: 'none',  
// //             scrollbarWidth: 'none'     
// //           }}>
// //             <style jsx>{`
// //               /* Hide scrollbar for WebKit browsers */
// //               .overflow-auto::-webkit-scrollbar {
// //                 display: none;
// //               }
// //             `}</style>

// //             <div className="flex justify-center mb-3 mt-1">
// //               {/* {image && (
// //                 <img
// //                   className="w-24 h-24 rounded-full object-cover"
// //                   src={URL.createObjectURL(image)}
// //                   alt="User Profile"
// //                 />
// //               )} */}
// //             </div>

// //             <h2
// //               className={`text-center text-2xl font-semibold ${getTextColorClass()}`}
// //             >
// //               {title}
              
// //             </h2>
// //             <p className={`text-center mb-2 text-sm ${getTextColorClass()}`}>
// //               {price}
// //             </p>

// //             <div className="rounded-lg overflow-hidden border border-gray-400 mb-4">
// //               <div className="p-4">
// //                 <h3
// //                   className={`text-center text-lg font-semibold ${getTextColorClass()}`}
// //                 >
// //                   {description}
// //                 </h3>
// //               </div>
// //             </div>

// //             <div className="text-center mt-6">
// //               <h4 className="font-semibold text-lg">Work With Me 1:1</h4>
// //               <button className="mt-2 text-blue-500 font-medium">Choose Date</button>
// //               <p className="text-sm text-gray-500">{timezone}</p>
// //             </div>

// //             <BookingManager
// //               bookedSlots={{Sunday: {11: ["11:00 AM"]}}}
// //               onAddBooking={addBooking} 
// //               onRemoveBooking={removeBooking}
// //               currentMonth={currentMonth}
// //               blockedDates={blockedDates}
// //             />

// //             <BookingDetailsView
// //               bookings={localBookings}
// //               onRemoveBooking={removeBooking}
// //               currentMonth={currentMonth}
// //             />

// //             <div className="mt-6">
// //             <Calendar
// //                 availability={availability}
// //                 onDayClick={onDayClick}
// //                 currentMonth={currentMonth}
// //                 onMonthChange={handleMonthChange}
// //                 // bookedSlots={processedBookedSlots}
// //                 bookedSlots={{Sunday: {11: ["11:00 AM"]}}}
// //                 blockedDates={blockedDates}
// //               />
// //             </div>

// //             <div className="mt-3 flex flex-wrap gap-2 justify-center">
// //               <div className="flex items-center">
// //                 <div className="w-3 h-3 bg-gray-200 rounded-full mr-1"></div>
// //                 <span className="text-xs">Unavailable</span>
// //               </div>
// //               <div className="flex items-center">
// //                 <div className="w-3 h-3 bg-orange-100 rounded-full mr-1 relative">
// //                   <span className="block h-1 w-1 absolute inset-0 m-auto bg-orange-500 rounded-full"></span>
// //                 </div>
// //                 <span className="text-xs">Booked</span>
// //               </div>
// //             </div>
            
// //             <div className="h-6"></div>
// //           </div>
// //         </div>
// //       </div>
// //     </FormProvider>
// //   );
// // };

// // export default BookingCard;

// "use client";
// import React, { useState, useEffect } from "react";
// import { useSession } from "next-auth/react";
// import Calendar from "../UI/Calendar"; 
// import { FormProvider, useForm } from "react-hook-form";
// import Textinput from "../UI/Textinput";
// import BookingDetailsView from "./BookingDetails";
// import BookingManager from "./BookingManager";

// interface BookingDetail {
//   name: string;
//   email: string;
//   day: string;
//   date: string;
//   time: string;
//   month?: string;
//   isoDate?: string;
// }

// interface BookingCardProps {
//   title?: string;
//   price?: string;
//   image?: any;
//   description?: any;
//   timezone?: string;
//   bgColor: string;
//   textColor: string;
//   selectedDays?: string[];
//   currentMonth?: string;
//   availability: any; 
//   onDayClick: (day: string) => void;
//   bookedSlots?: any; 
//   blockedDates?: string[]; 
//   bookings?: BookingDetail[]; 
//   onAddBooking?: (booking: BookingDetail) => void;
//   maxHeight?: string;
//   maxWidth?: string;
//   classname?: string;
//   bookingid?: number; // Added bookingid to props
// }

// const BookingCard: React.FC<BookingCardProps> = ({
//   title = "Book a 1:1 Call with Me",
//   price = "$9.99",
//   description = "I am here to help you achieve your goals.",
//   timezone = "Asia/Dubai",
//   bgColor,
//   image,
//   textColor,
//   selectedDays = ["14", "21", "28"],
//   availability,
//   onDayClick,
//   bookedSlots = {}, 
//   blockedDates = [], 
//   bookings = [], 
//   onAddBooking, 
//   maxHeight = "650px",
//   maxWidth = "350px",
//   classname = "",
//   bookingid = 1, // Default value for bookingid
// }) => {
//   const methods = useForm();
  
//   const [localBookings, setLocalBookings] = useState<BookingDetail[]>(bookings);
//   const [bookingDetails, setBookingDetails] = useState<BookingDetail[]>([]);
//   const [currentMonth, setCurrentMonth] = useState("May 2025");
//   const [selectedBookingDetails, setSelectedBookingDetails] = useState<{
//       day: string;
//       date: string;
//       bookings: Array<{
//         time: string;
//         name: string;
//         email: string;
//       }>;
//     } | null>(null);
//   const [showBookedDetailsModal, setShowBookedDetailsModal] = useState(false);

//   // This is the important change - we need to transform bookedSlots if needed
//   const [processedBookedSlots, setProcessedBookedSlots] = useState(bookedSlots);

//   const [userDetails, setUserDetails] = useState<{
//     username: string;
//     email: string;
//   }>({
//     username: "Guest",
//     email: "guest@example.com",
//   });

//   const { data: session } = useSession();

//   // Process bookedSlots to ensure they're in the correct format for the Calendar
//   useEffect(() => {
//     // Detect the format of bookedSlots
//     const firstKey = Object.keys(bookedSlots)[0];
    
//     // If firstKey is a day of week like "Monday", we need to transform
//     if (firstKey && ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].includes(firstKey)) {
//       console.log("Converting day-based bookedSlots to month-based format");
      
//       // Create a new month-based structure
//       const monthBasedSlots = {
//         [currentMonth]: {}
//       };
      
//       // Transform the structure
//       Object.keys(bookedSlots).forEach(dayOfWeek => {
//         Object.keys(bookedSlots[dayOfWeek]).forEach(date => {
//           if (!monthBasedSlots[currentMonth][date]) {
//             monthBasedSlots[currentMonth][date] = [];
//           }
          
//           // Add all times for this date
//           bookedSlots[dayOfWeek][date].forEach(time => {
//             if (!monthBasedSlots[currentMonth][date].includes(time)) {
//               monthBasedSlots[currentMonth][date].push(time);
//             }
//           });
//         });
//       });
      
//       setProcessedBookedSlots(monthBasedSlots);
//       console.log("Transformed bookedSlots:", monthBasedSlots);
//     } else {
//       // It's already in the right format
//       setProcessedBookedSlots(bookedSlots);
//     }
//   }, [bookedSlots, currentMonth]);

//   // Update booking details based on localBookings
//   useEffect(() => {
//     setBookingDetails(localBookings);
//   }, [localBookings]);

//   useEffect(() => {
//     if (session?.user?.email) {
//       setUserDetails({
//         email: session.user.email,
//         username: session.user.name || "No username",
//       });
//     } else {
//       const token = localStorage.getItem("token");
//       if (token) {
//         try {
//           const payload = JSON.parse(atob(token.split(".")[1]));
//           if (!payload.exp || Date.now() < payload.exp * 1000) {
//             setUserDetails({
//               email: payload.email || "No email",
//               username: payload.username || "No username",
//             });
//           }
//         } catch (err) {
//           console.error("Error decoding token", err);
//         }
//       }
//     }
//   }, [session]);

//   const getMonthIndexFromName = (monthName: string): number => {
//     const months: Record<string, number> = {
//       'January': 0,
//       'February': 1,
//       'March': 2,
//       'April': 3,
//       'May': 4,
//       'June': 5,
//       'July': 6,
//       'August': 7,
//       'September': 8,
//       'October': 9,
//       'November': 10,
//       'December': 11
//     };
    
//     return months[monthName] || 0;
//   };

//   function addBooking(booking: BookingDetail): void {
//     console.log(`Adding booking:`, booking);
    
//     // Update the booking with the current month if not specified
//     const updatedBooking = {
//       ...booking,
//       month: booking.month || currentMonth,
//     };
    
//     // Generate ISO date for the booking
//     const monthName = updatedBooking.month.split(' ')[0];
//     const year = updatedBooking.month.split(' ')[1];
//     const date = parseInt(updatedBooking.date);
//     const monthIndex = getMonthIndexFromName(monthName);
    
//     const isoDate = new Date(parseInt(year), monthIndex, date)
//       .toISOString()
//       .split('T')[0];
    
//     const bookingWithIsoDate = {
//       ...updatedBooking,
//       isoDate,
//     };
    
//     setLocalBookings(prevBookings => [...prevBookings, bookingWithIsoDate]);
    
//     // Also update the processed booked slots
//     setProcessedBookedSlots(prev => {
//       const newSlots = { ...prev };
//       const monthStr = updatedBooking.month;
      
//       if (!newSlots[monthStr]) {
//         newSlots[monthStr] = {};
//       }
      
//       if (!newSlots[monthStr][updatedBooking.date]) {
//         newSlots[monthStr][updatedBooking.date] = [];
//       }
      
//       if (!newSlots[monthStr][updatedBooking.date].includes(updatedBooking.time)) {
//         newSlots[monthStr][updatedBooking.date].push(updatedBooking.time);
//       }
      
//       return newSlots;
//     });
    
//     if (onAddBooking) {
//       onAddBooking(bookingWithIsoDate);
//     }
    
//     alert(`Booking confirmed for ${booking.name} (${booking.email}) on ${booking.day}, ${booking.month || currentMonth} ${booking.date} at ${booking.time}`);
//   }

//   function removeBooking(day: string, date: string, time: string, month: string = currentMonth): void {
//     console.log(`Removing booking: ${day}, ${date}, ${time}, ${month}`);
    
//     setLocalBookings(prevBookings => 
//       prevBookings.filter(booking => 
//         !(booking.day === day && 
//           booking.date === date && 
//           booking.time === time &&
//           (!month || booking.month === month))
//       )
//     );
    
//     // Also update the processed booked slots
//     setProcessedBookedSlots(prev => {
//       const newSlots = { ...prev };
      
//       if (newSlots[month] && newSlots[month][date]) {
//         newSlots[month][date] = newSlots[month][date].filter(t => t !== time);
        
//         if (newSlots[month][date].length === 0) {
//           delete newSlots[month][date];
//         }
        
//         if (Object.keys(newSlots[month]).length === 0) {
//           delete newSlots[month];
//         }
//       }
      
//       return newSlots;
//     });
    
//     alert(`Booking on ${day}, ${date} at ${time} has been cancelled.`);
//   }

//   const getBackgroundColorClass = () => {
//     if (bgColor?.startsWith('bg-')) {
//       return bgColor;
//     }
//     return "bg-white";
//   };

//   const getTextColorClass = () => {
//     if (textColor?.startsWith('text-')) {
//       return textColor;
//     }
//     return "text-gray-800";
//   };

//   const handleDayClick = (day: string) => {
//     const selectedDateObj = new Date(
//       parseInt(currentMonth.split(" ")[1]),
//       getMonthIndexFromName(currentMonth.split(" ")[0]),
//       parseInt(day)
//     );
//     const dayOfWeek = [
//       "Sunday",
//       "Monday",
//       "Tuesday",
//       "Wednesday",
//       "Thursday",
//       "Friday",
//       "Saturday",
//     ][selectedDateObj.getDay()];

//     // Get the ISO date string
//     const selectedISODate = selectedDateObj.toISOString().split("T")[0];

//     // Get bookings for this date by checking if their ISO date starts with the selected date
//     const bookingsForDate = bookingDetails.filter((booking) =>
//       booking.isoDate?.startsWith(selectedISODate)
//     );

//     // If there are bookings, show the modal
//     if (bookingsForDate.length > 0) {
//       setSelectedBookingDetails({
//         day: dayOfWeek,
//         date: day,
//         bookings: bookingsForDate.map((booking) => ({
//           time: booking.time,
//           name: booking.name,
//           email: booking.email,
//         })),
//       });
//       setShowBookedDetailsModal(true);
//     } else {
//       onDayClick(day); // Call the passed onDayClick function
//     }
//   };

//   const handleMonthChange = (newMonth: string) => {
//     setCurrentMonth(newMonth);
//   };

//   return (
//     <FormProvider {...methods}>
//       <div className="relative w-full mx-6 my-10">
//         <div
//           className={`w-full mx-auto ${getBackgroundColorClass()} border border-gray-500 p-6 rounded-xl shadow-xl flex flex-col pt-2 absolute top-1/2 right-4 z-30 transform -translate-y-1/2 overflow-hidden h-[540px] ${classname}`}
//           style={{
//             maxWidth: maxWidth,
//             maxHeight: maxHeight
//           }}
//         >
//           <div className="overflow-auto h-full w-full pb-4" style={{ 
//             msOverflowStyle: 'none',  
//             scrollbarWidth: 'none'     
//           }}>
//             <style jsx>{`
//               /* Hide scrollbar for WebKit browsers */
//               .overflow-auto::-webkit-scrollbar {
//                 display: none;
//               }
//             `}</style>

//             <div className="flex justify-center mb-3 mt-1">
//               {/* {image && (
//                 <img
//                   className="w-24 h-24 rounded-full object-cover"
//                   src={URL.createObjectURL(image)}
//                   alt="User Profile"
//                 />
//               )} */}
//             </div>

//             <h2
//               className={`text-center text-2xl font-semibold ${getTextColorClass()}`}
//             >
//               {title}
              
//             </h2>
//             <p className={`text-center mb-2 text-sm ${getTextColorClass()}`}>
//               {price}
//             </p>

//             <div className="rounded-lg overflow-hidden border border-gray-400 mb-4">
//               <div className="p-4">
//                 <h3
//                   className={`text-center text-lg font-semibold ${getTextColorClass()}`}
//                 >
//                   {description}
//                 </h3>
//               </div>
//             </div>

//             <div className="text-center mt-6">
//               <h4 className="font-semibold text-lg">Work With Me 1:1</h4>
//               <button className="mt-2 text-blue-500 font-medium">Choose Date</button>
//               <p className="text-sm text-gray-500">{timezone}</p>
//             </div>

//             <BookingManager
//               bookedSlots={processedBookedSlots} // Use processed slots
//               onAddBooking={addBooking} 
//               onRemoveBooking={removeBooking}
//               currentMonth={currentMonth}
//               blockedDates={blockedDates}
//               bookingid={bookingid} // Pass bookingid
//             />

//             <BookingDetailsView
//               bookings={localBookings}
//               onRemoveBooking={removeBooking}
//               currentMonth={currentMonth}
//             />

//             <div className="mt-6">
//               <Calendar
//                 availability={availability}
//                 onDayClick={handleDayClick}
//                 currentMonth={currentMonth}
//                 onMonthChange={handleMonthChange}
//                 bookedSlots={processedBookedSlots} // Use processed slots
//                 blockedDates={blockedDates}
//               />
//             </div>

//             <div className="mt-3 flex flex-wrap gap-2 justify-center">
//               <div className="flex items-center">
//                 <div className="w-3 h-3 bg-gray-200 rounded-full mr-1"></div>
//                 <span className="text-xs">Unavailable</span>
//               </div>
//               <div className="flex items-center">
//                 <div className="w-3 h-3 bg-orange-100 rounded-full mr-1 relative">
//                   <span className="block h-1 w-1 absolute inset-0 m-auto bg-orange-500 rounded-full"></span>
//                 </div>
//                 <span className="text-xs">Booked</span>
//               </div>
//             </div>
            
//             <div className="h-6"></div>
//           </div>
//         </div>
//       </div>
//     </FormProvider>
//   );
// };

// export default BookingCard;

"use client";
import React, { useState, useEffect, useContext } from "react";
import { useSession } from "next-auth/react";
import Calendar from "../UI/Calendar"; 
import { FormProvider, useForm } from "react-hook-form";
import Textinput from "../UI/Textinput";
import BookingDetailsView from "./BookingDetails";
import BookingManager from "./BookingManager";
import { AuthContext } from "@/src/context/AuthContext";

interface BookingDetail {
  name: string;
  email: string;
  day: string;
  date: string;
  time: string;
  month?: string;
  isoDate?: string;
}

interface BookingCardProps {
  title?: string;
  price?: string;
  image?: any;
  description?: any;
  timezone?: string;
  bgColor: string;
  textColor: string;
  selectedDays?: string[];
  currentMonth?: string;
  availability: any; 
  onDayClick: (day: string) => void;
  bookedSlots?: any; 
  blockedDates?: string[]; 
  bookings?: BookingDetail[]; 
  onAddBooking?: (booking: BookingDetail) => void;
  maxHeight?: string;
  maxWidth?: string;
  classname?: string;
  bookingid?: number; // Added bookingid to props
  userdata?: any;
  bookingUserName?: string;
}

const BookingCard: React.FC<BookingCardProps> = ({
  title = "Book a 1:1 Call with Me",
  price = "$9.99",
  description = "I am here to help you achieve your goals.",
  timezone = "Asia/Dubai",
  bgColor,
  image,
  textColor,
  selectedDays = ["14", "21", "28"],
  availability,
  onDayClick,
  bookedSlots = {}, 
  blockedDates = [], 
  bookings = [], 
  onAddBooking, 
  maxHeight = "850px",
  maxWidth = "470px",
  classname = "",
  bookingid = 1, // Default value for bookingid
  userdata,
  bookingUserName
}) => {
  const methods = useForm();
  
  const [localBookings, setLocalBookings] = useState<BookingDetail[]>(bookings);
  const [bookingDetails, setBookingDetails] = useState<BookingDetail[]>([]);
  const [currentMonth, setCurrentMonth] = useState("May 2025");
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
  // Use a single bookedSlots state instead of processedBookedSlots
  const [localBookedSlots, setLocalBookedSlots] = useState(bookedSlots);
    const udata = useContext(AuthContext)
  const [userDetails, setUserDetails] = useState<{
    username: string;
    email: string;
  }>({
    username: "Guest",
    email: "guest@example.com",
  });
  const { data: session } = useSession();

  // Initialize and update the bookedSlots format
  useEffect(() => {
    console.log("BookingCard - Original bookedSlots:", bookedSlots);

    
    // Check if we received a new structure of bookedSlots from props
    if (Object.keys(bookedSlots).length > 0) {
      setLocalBookedSlots(bookedSlots);
    } else {
      // Initialize with an empty day-based structure if nothing provided
      setLocalBookedSlots({
        "Sunday": {},
        "Monday": {},
        "Tuesday": {},
        "Wednesday": {},
        "Thursday": {},
        "Friday": {},
        "Saturday": {}
      });
    }
  }, []);

  // Update booking details based on localBookings
  useEffect(() => {
    setBookingDetails(localBookings);
  }, [localBookings]);

  useEffect(() => {
    if (session?.user?.email) {
      setUserDetails({
        email: session.user.email,
        username: session.user.name || "No username",
      });
    } else {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          if (!payload.exp || Date.now() < payload.exp * 1000) {
            setUserDetails({
              email: payload.email || "No email",
              username: payload.username || "No username",
            });
          }
        } catch (err) {
          console.error("Error decoding token", err);
        }
      }
    }
  }, [session]);

  const getMonthIndexFromName = (monthName: string): number => {
    const months: Record<string, number> = {
      'January': 0,
      'February': 1,
      'March': 2,
      'April': 3,
      'May': 4,
      'June': 5,
      'July': 6,
      'August': 7,
      'September': 8,
      'October': 9,
      'November': 10,
      'December': 11
    };
    
    return months[monthName] || 0;
  };

  function addBooking(booking: BookingDetail): void {
    console.log(`Adding booking:`, booking);
    
    // Update the booking with the current month if not specified
    const updatedBooking = {
      ...booking,
      month: booking.month || currentMonth,
    };
    
    // Generate ISO date for the booking
    const monthName = updatedBooking.month.split(' ')[0];
    const year = updatedBooking.month.split(' ')[1];
    const date = parseInt(updatedBooking.date);
    const monthIndex = getMonthIndexFromName(monthName);
    
    const isoDate = new Date(parseInt(year), monthIndex, date)
      .toISOString()
      .split('T')[0];
    
    const bookingWithIsoDate = {
      ...updatedBooking,
      isoDate,
    };
    
    setLocalBookings(prevBookings => [...prevBookings, bookingWithIsoDate]);
    
    // Update localBookedSlots with the new booking
    setLocalBookedSlots(prev => {
      const newSlots = { ...prev };
      
      // Make sure the day exists
      if (!newSlots[booking.day]) {
        newSlots[booking.day] = {};
      }
      
      // Make sure the date exists under that day
      if (!newSlots[booking.day][booking.date]) {
        newSlots[booking.day][booking.date] = [];
      }
      
      // Add the time to the list if it's not already there
      if (!newSlots[booking.day][booking.date].includes(booking.time)) {
        newSlots[booking.day][booking.date].push(booking.time);
      }
      
      console.log("Updated bookedSlots after adding:", newSlots);
      localStorage.setItem('date', JSON.stringify(newSlots));
      return newSlots;

    });
    
    if (onAddBooking) {
      onAddBooking(bookingWithIsoDate);
    }
    
    alert(`Booking confirmed for ${booking.name} (${booking.email}) on ${booking.day}, ${booking.month || currentMonth} ${booking.date} at ${booking.time}`);
  }

  function removeBooking(day: string, date: string, time: string, month: string = currentMonth): void {
    console.log(`Removing booking: ${day}, ${date}, ${time}, ${month}`);
    
    // Remove from localBookings
    setLocalBookings(prevBookings => 
      prevBookings.filter(booking => 
        !(booking.day === day && 
          booking.date === date && 
          booking.time === time &&
          (!month || booking.month === month))
      )
    );
    
    // Update localBookedSlots
    setLocalBookedSlots(prev => {
      const newSlots = { ...prev };
      
      if (newSlots[day] && newSlots[day][date]) {
        // Remove the specific time slot
        newSlots[day][date] = newSlots[day][date].filter(t => t !== time);
        
        // Clean up empty arrays and objects
        if (newSlots[day][date].length === 0) {
          delete newSlots[day][date];
        }
        
        if (Object.keys(newSlots[day]).length === 0) {
          delete newSlots[day];
        }
      }
      
      console.log("Updated bookedSlots after removing:", newSlots);
      return newSlots;
    });
    
    alert(`Booking on ${day}, ${date} at ${time} has been cancelled.`);
  }

  const getBackgroundColorClass = () => {
    if (bgColor?.startsWith('bg-')) {
      return bgColor;
    }
    return "bg-white";
  };

  const getTextColorClass = () => {
    if (textColor?.startsWith('text-')) {
      return textColor;
    }
    return "text-gray-800";
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
      onDayClick(day); // Call the passed onDayClick function
    }
  };

  const handleMonthChange = (newMonth: string) => {
    setCurrentMonth(newMonth);
  };

  return (
    <FormProvider {...methods}>
      <div className="relative w-full mx-6 my-10">
        <div
          className={`w-full mx-auto ${getBackgroundColorClass()} border border-gray-500 p-6 rounded-xl shadow-xl flex flex-col pt-2 absolute top-1/2 right-4 z-30 transform -translate-y-1/2 overflow-hidden h-[540px] ${classname}`}
          style={{
            maxWidth: maxWidth,
            maxHeight: maxHeight
          }}
        >
          <div className="overflow-auto h-full w-full pb-4" style={{ 
            msOverflowStyle: 'none',  
            scrollbarWidth: 'none'     
          }}>
            <style jsx>{`
              /* Hide scrollbar for WebKit browsers */
              .overflow-auto::-webkit-scrollbar {
                display: none;
              }
            `}</style>

            <div className="flex justify-center mb-3 mt-1">

                <img
                  className="w-24 h-24 rounded-full object-cover"
                  src={image || udata.user.profilepicture}
                  alt="User Profile"
                />

            </div>
              <h2 className={`text-center text-2xl font-semibold ${textColor}`}>{bookingUserName || udata?.user.username}</h2>

            <h2
              className={`text-center text-2xl font-semibold ${getTextColorClass()}`}
            >
              {title}
              
            </h2>
            <p className={`text-center mb-2 text-sm ${getTextColorClass()}`}>
              {price}
            </p>

            <div className="rounded-lg overflow-hidden border border-gray-400 mb-4">
              <div className="p-2">
                <h3
                  className={`text-center text-lg font-semibold ${getTextColorClass()}`}
                >
                  {description}
                </h3>
              </div>
            </div>

            <div className="text-center mt-6">
              {/* <h4 className={`font-semibold text-lg ${textColor}`}>Work With Me 1:1</h4> */}
              {/* <button className="mt-2 text-blue-500 font-medium">Choose Date</button> */}
              {/* <p className={`text-sm  ${textColor}`}>{timezone}</p> */}
            </div>

            <BookingManager
              bgColor={bgColor}
            textColor={textColor}
              bookedSlots={localBookedSlots}
              onAddBooking={addBooking} 
              onRemoveBooking={removeBooking}
              currentMonth={currentMonth}
              blockedDates={blockedDates}
              bookingid={bookingid}
            />

            {/* <BookingDetailsView
              bookings={localBookings}
              onRemoveBooking={removeBooking}
              currentMonth={currentMonth}
            /> */}

            <div className="mt-6">
              <Calendar
                textColor={textColor}
                availability={availability}
                onDayClick={handleDayClick}
                currentMonth={currentMonth}
                onMonthChange={handleMonthChange}
                bookedSlots={localBookedSlots}
                blockedDates={blockedDates}
              />
            </div>

            <div className="mt-3 flex flex-wrap gap-2 justify-center">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-200 rounded-full mr-1"></div>
                <span className="text-xs">Unavailable</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-orange-100 rounded-full mr-1 relative">
                  <span className="block h-1 w-1 absolute inset-0 m-auto bg-orange-500 rounded-full"></span>
                </div>
                <span className="text-xs">Booked</span>
              </div>
            </div>
            
            <div className="h-6"></div>
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

export default BookingCard;