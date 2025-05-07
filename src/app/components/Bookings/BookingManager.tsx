// import React, { useState } from 'react';
// import BookingModal from './BookingModal';
// import { checkSlotAvailability } from '@/src/services/AppointmentService';
// import { useSelector, useDispatch } from 'react-redux'
// import { setField } from '@/src/store/slices/bookingSlice';


// interface BookingDetail {
//   name: string;
//   email: string;
//   day: string;
//   date: string;
//   time: string;
//   month?: string;
//   isoDate?: string;
// }

// interface BookedSlotsInterface {
//   [day: string]: {
//     [date: string]: string[];
//   };
// }

// interface BookingManagerProps {
//   bookedSlots: BookedSlotsInterface;
//   onAddBooking: (booking: BookingDetail) => void;
//   onRemoveBooking: (day: string, date: string, time: string, month?: string) => void;
//   currentMonth: string;
//   selectedMonth?: string;
//   blockedDates: string[];
//   bookingid: number;
// }

// const BookingManager: React.FC<BookingManagerProps> = ({
//   bookedSlots,
//   onAddBooking,
//   onRemoveBooking,
//   currentMonth,
//   selectedMonth = currentMonth,
//   blockedDates,
//   bookingid
// }) => {
//   const [selectedDate, setSelectedDate] = useState<string>('');
//   const [selectedTime, setSelectedTime] = useState<string>('9:00 AM');
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [pendingBooking, setPendingBooking] = useState<{ day: string; date: string; time: string } | null>(null);
//   const [isSlotAvailable, setIsSlotAvailable] = useState<boolean | null>(null); // Track slot availability
//   const dispatch = useDispatch();

//   const timeSlots = [
//     '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
//     '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
//   ];

//   const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSelectedDate(e.target.value);
//     checkAvailability(e.target.value, selectedTime); // Check availability whenever the date changes
//   };

//   const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setSelectedTime(e.target.value);
//     console.log('Selected Time:', e.target.value);
//     checkAvailability(selectedDate, e.target.value); // Check availability whenever the time changes
//   };

//   const checkAvailability = async (date: string, time: string) => {
//     if (!date || !time) return;
//     console.log('Checking availability for date:', date, 'and time:', time);
//     const { startTime, endTime } = getStartAndEndTime(date, time);
//     if (startTime && endTime) {
//       try {
//         dispatch(setField({name: 'startTime', value: startTime.toISOString()}));
//         dispatch(setField({name: 'endTime', value: endTime.toISOString()}));
//         dispatch(setField({name: 'date', value: startTime.toISOString()}));
//         const availability = await checkSlotAvailability(startTime, endTime, bookingid);
//         setIsSlotAvailable(availability); // Update availability status
//         console.log('Availability:', availability);
//       } catch (err) {
//         console.error('Error checking slot availability:', err);
//         setIsSlotAvailable(false); // Default to unavailable in case of an error
//       }
//     }
//   };

//   const getStartAndEndTime = (date: string, time: string) => {
//     if (!date || !time) return { startTime: null, endTime: null };
  
//     // Extract the hours and minutes from the time string
//     const [timePart, period] = time.split(' ');  // Time part e.g., "9:00" and period e.g., "AM"
//     const [hours, minutes] = timePart.split(':');  // Extract hours and minutes
  
//     let hour = parseInt(hours);
//     const minute = parseInt(minutes);
  
//     // Convert the hour based on AM/PM period
//     if (period === 'PM' && hour < 12) {
//       hour += 12;  // Convert PM time to 24-hour format
//     }
//     if (period === 'AM' && hour === 12) {
//       hour = 0;  // Convert 12 AM (midnight) to 0 hours
//     }
  
//     // Create the start time from the selected date and time
//     const startTime = new Date(date);
//     startTime.setHours(hour, minute, 0, 0);  // Set the start time with hours and minutes
  
//     // Assuming the time slot is 1 hour, set the end time
//     const endTime = new Date(startTime);
//     endTime.setHours(startTime.getHours() + 1);  // Add 1 hour to the start time for the end time
  
//     return { startTime, endTime };
//   };
  

//   const isDateBlocked = (dateStr: string) => {
//     return blockedDates.includes(dateStr);
//   };

//   const isTimeSlotBooked = (time: string) => {
//     if (!selectedDate) return false;

//     if (isDateBlocked(selectedDate)) return true;

//     const date = new Date(selectedDate);
//     const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];
//     const dayOfMonth = date.getDate().toString();

//     return bookedSlots[dayOfWeek]?.[dayOfMonth]?.includes(time) || false;
//   };

//   const handleInitiateBooking = () => {
//     if (!selectedDate || !selectedTime) return;

//     const date = new Date(selectedDate);
//     const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];
//     const dayOfMonth = date.getDate().toString();

//     setPendingBooking({
//       day: dayOfWeek,
//       date: dayOfMonth,
//       time: selectedTime
//     });

//     setIsModalOpen(true);
//   };

//   const handleConfirmBooking = (name: string, email: string) => {
//     if (pendingBooking && selectedDate) {
//       const selectedDateObj = new Date(selectedDate);
//       const month = selectedDateObj.toLocaleString('en-US', { month: 'long' });
//       const year = selectedDateObj.getFullYear().toString();
//       const monthYear = `${month} ${year}`;

//       const bookingDetail: BookingDetail = {
//         name,
//         email,
//         day: pendingBooking.day,
//         date: pendingBooking.date,
//         time: pendingBooking.time,
//         month: monthYear,
//         isoDate: selectedDate,
//       };

//       onAddBooking(bookingDetail);
//       setIsModalOpen(false);
//       setPendingBooking(null);
//       setSelectedTime('9:00 AM');
//     }
//   };

//   const formatBookings = () => {
//     const formattedBookings: Array<{
//       day: string;
//       date: string;
//       formattedDate: string;
//       times: string[];
//     }> = [];

//     const [monthName, yearStr] = currentMonth.split(' ');
//     const year = parseInt(yearStr);
//     const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth();

//     Object.keys(bookedSlots).forEach(day => {
//       Object.keys(bookedSlots[day]).forEach(dateStr => {
//         const date = new Date(year, monthIndex, parseInt(dateStr));
//         const formattedDate = date.toLocaleDateString('en-US', {
//           month: 'short',
//           day: 'numeric',
//           year: 'numeric'
//         });

//         formattedBookings.push({
//           day,
//           date: dateStr,
//           formattedDate,
//           times: bookedSlots[day][dateStr]
//         });
//       });
//     });

//     formattedBookings.sort((a, b) => {
//       const dateA = new Date(`${currentMonth.split(' ')[0]} ${a.date}, ${currentMonth.split(' ')[1]}`);
//       const dateB = new Date(`${currentMonth.split(' ')[0]} ${b.date}, ${currentMonth.split(' ')[1]}`);
//       return dateA.getTime() - dateB.getTime();
//     });

//     return formattedBookings;
//   };

//   const bookingsFormatted = formatBookings();

//   return (
//     <div className="mt-6 p-4 rounded-lg border border-gray-200">
//       <h3 className="text-lg font-semibold mb-0">Manage Bookings</h3>

//       <div className="flex flex-wrap gap-3 mb-4">
//         <div className="flex-1">
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Select Date
//           </label>
//           <input
//             type="date"
//             value={selectedDate}
//             onChange={handleDateChange}
//             className={`w-full p-2 border border-gray-300 rounded-md ${
//               selectedDate && isDateBlocked(selectedDate) ? 'bg-red-50 border-red-300' : ''
//             }`}
//             min={new Date().toISOString().split('T')[0]}
//           />
//           {selectedDate && isDateBlocked(selectedDate) && (
//             <p className="text-red-500 text-xs mt-1">This date is blocked and cannot be booked</p>
//           )}
//         </div>

//         <div className="flex-1">
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Select Time
//           </label>
//           <select
//             value={selectedTime}
//             onChange={handleTimeChange}
//             className="w-full p-2 border border-gray-300 rounded-md"
//           >
//             {timeSlots.map(time => (
//               <option
//                 key={time}
//                 value={time}
//                 // disabled={isTimeSlotBooked(time) || !isSlotAvailable}
//               >
//                 {time} {isTimeSlotBooked(time) ? '(Booked)' : ''}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="flex items-end">
//           <button
//             onClick={handleInitiateBooking}
//             disabled={!selectedDate || !selectedTime || isTimeSlotBooked(selectedTime) || isDateBlocked(selectedDate)}
//             className="px-2 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
//           >
//             Add Booking
//           </button>
//         </div>
//       </div>

//       {/* Booking Modal */}
//       {isModalOpen && pendingBooking && (
//         <BookingModal
//           isOpen={isModalOpen}
//           onClose={() => {
//             setIsModalOpen(false);
//             setPendingBooking(null);
//           }}
//           onConfirm={handleConfirmBooking}
//           date={new Date(selectedDate).toLocaleDateString('en-US', {
//             month: 'long',
//             day: 'numeric',
//             year: 'numeric'
//           })}
//           time={pendingBooking.time}
//           dayOfWeek={pendingBooking.day}
//         />
//       )}
//     </div>
//   );
// };

// export default BookingManager;

import React, { useState, useEffect } from 'react';
import BookingModal from './BookingModal';
import { useSelector, useDispatch } from 'react-redux'
import { setAppointment, setField } from '@/src/store/slices/bookingSlice';
import { setfield } from '@/src/store/slices/authSlice';
import { RootState } from '@/src/store/store';
import { checkSlotAvailability } from '@/src/services/Booking';

interface BookingDetail {
  name: string;
  email: string;
  day: string;
  date: string;
  time: string;
  month?: string;
  isoDate?: string;
}

interface BookedSlotsInterface {
  [day: string]: {
    [date: string]: string[];
  };
}

interface BookingManagerProps {
  bookedSlots: BookedSlotsInterface;
  onAddBooking: (booking: BookingDetail) => void;
  onRemoveBooking: (day: string, date: string, time: string, month?: string) => void;
  currentMonth: string;
  selectedMonth?: string;
  blockedDates: string[];
  bookingid?: number;
  bgColor?: string;
  textColor?: string;
}

const BookingManager: React.FC<BookingManagerProps> = ({
  bookedSlots,
  onAddBooking,
  onRemoveBooking,
  currentMonth,
  selectedMonth = currentMonth,
  blockedDates,
  bookingid,
  bgColor,
  textColor
}) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('9:00 AM');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingBooking, setPendingBooking] = useState<{ day: string; date: string; time: string } | null>(null);
  const [isSlotAvailable, setIsSlotAvailable] = useState<boolean | null>(null); // Track slot availability
  const dispatch = useDispatch();
  const {date, bookingpagebg, bookingpagetext} = useSelector((state: RootState) => state.booking);


  // Add debugging to see bookedSlots
  useEffect(() => {
    console.log('BookingManager received bookedSlots:', bookedSlots);
    // localStorage.setItem('date', JSON.stringify(bookedSlots));
    // dispatch(setAppointment({name: "date",  value : bookedSlots?.Monday}));
  }, [bookedSlots]);

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
    checkAvailability(e.target.value, selectedTime); // Check availability whenever the date changes
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTime(e.target.value);
    console.log('Selected Time:', e.target.value);
    checkAvailability(selectedDate, e.target.value); // Check availability whenever the time changes
  };

  const checkAvailability = async (date: string, time: string) => {
    if (!date || !time) return;
    console.log('Checking availability for date:', date, 'and time:', time);
    const { startTime, endTime } = getStartAndEndTime(date, time);
    if (startTime && endTime) {
      try {
        dispatch(setField({name: 'startTime', value: startTime.toISOString()}));
        dispatch(setField({name: 'endTime', value: endTime.toISOString()}));
        dispatch(setField({name: 'date', value: startTime.toISOString()}));
        const availability = await checkSlotAvailability(startTime, endTime, bookingid);
        setIsSlotAvailable(availability); // Update availability status
        console.log('Availability:', availability);
      } catch (err) {
        console.error('Error checking slot availability:', err);
        setIsSlotAvailable(false); // Default to unavailable in case of an error
      }
    }
  };

  const getStartAndEndTime = (date: string, time: string) => {
    if (!date || !time) return { startTime: null, endTime: null };
  
    // Extract the hours and minutes from the time string
    const [timePart, period] = time.split(' ');  // Time part e.g., "9:00" and period e.g., "AM"
    const [hours, minutes] = timePart.split(':');  // Extract hours and minutes
  
    let hour = parseInt(hours);
    const minute = parseInt(minutes);
  
    // Convert the hour based on AM/PM period
    if (period === 'PM' && hour < 12) {
      hour += 12;  // Convert PM time to 24-hour format
    }
    if (period === 'AM' && hour === 12) {
      hour = 0;  // Convert 12 AM (midnight) to 0 hours
    }
  
    // Create the start time from the selected date and time
    const startTime = new Date(date);
    startTime.setHours(hour, minute, 0, 0);  // Set the start time with hours and minutes
  
    // Assuming the time slot is 1 hour, set the end time
    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + 1);  // Add 1 hour to the start time for the end time
  
    return { startTime, endTime };
  };

  const isDateBlocked = (dateStr: string) => {
    return blockedDates.includes(dateStr);
  };

  const isTimeSlotBooked = (time: string) => {
    if (!selectedDate) return false;

    if (isDateBlocked(selectedDate)) return true;

    // Convert the date string to a Date object
    const date = new Date(selectedDate);
    const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];
    const dayOfMonth = date.getDate().toString();

    // Check if the time slot is booked
    const isBooked = bookedSlots[dayOfWeek]?.[dayOfMonth]?.includes(time) || false;
    const datedata = {[dayOfWeek] : {[dayOfMonth]: [time]}};
    console.log(`Checking if ${dayOfWeek} ${dayOfMonth} at ${time} is booked:`, isBooked);
    console.log(' Slot:', datedata);
    localStorage.setItem('date', JSON.stringify(datedata));
    return isBooked;
  };

  const handleInitiateBooking = () => {
    if (!selectedDate || !selectedTime) return;

    const date = new Date(selectedDate);
    const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];
    const dayOfMonth = date.getDate().toString();

    setPendingBooking({
      day: dayOfWeek,
      date: dayOfMonth,
      time: selectedTime
    });
    console.log('Pending Booking:', pendingBooking);
    setIsModalOpen(true);
  };

  const handleConfirmBooking = (name: string, email: string) => {
    if (pendingBooking && selectedDate) {
      const selectedDateObj = new Date(selectedDate);
      const month = selectedDateObj.toLocaleString('en-US', { month: 'long' });
      const year = selectedDateObj.getFullYear().toString();
      const monthYear = `${month} ${year}`;

      const bookingDetail: BookingDetail = {
        name,
        email,
        day: pendingBooking.day,
        date: pendingBooking.date,
        time: pendingBooking.time,
        month: monthYear,
        isoDate: selectedDate,
      };

      onAddBooking(bookingDetail);
      setIsModalOpen(false);
      setPendingBooking(null);
      setSelectedTime('9:00 AM');
    }
  };

  const formatBookings = () => {
    const formattedBookings: Array<{
      day: string;
      date: string;
      formattedDate: string;
      times: string[];
    }> = [];

    const [monthName, yearStr] = currentMonth.split(' ');
    const year = parseInt(yearStr);
    const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth();

    Object.keys(bookedSlots).forEach(day => {
      Object.keys(bookedSlots[day]).forEach(dateStr => {
        const date = new Date(year, monthIndex, parseInt(dateStr));
        const formattedDate = date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });

        formattedBookings.push({
          day,
          date: dateStr,
          formattedDate,
          times: bookedSlots[day][dateStr]
        });
      });
    });

    formattedBookings.sort((a, b) => {
      const dateA = new Date(`${currentMonth.split(' ')[0]} ${a.date}, ${currentMonth.split(' ')[1]}`);
      const dateB = new Date(`${currentMonth.split(' ')[0]} ${b.date}, ${currentMonth.split(' ')[1]}`);
      return dateA.getTime() - dateB.getTime();
    });

    return formattedBookings;
  };

  const bookingsFormatted = formatBookings();

  // Render disabled status for time slots
  const renderTimeOptions = () => {
    return timeSlots.map(time => {
      const isBooked = isTimeSlotBooked(time);
      return (
        <option
        className='text-black'
          key={time}
          value={time}
          disabled={isBooked || (isSlotAvailable === false)}
        >
          {time} {isBooked ? '(Booked)' : ''}
        </option>
      );
    });
  };

  return (
    <div className="mt-6 p-4 rounded-lg border border-gray-200">
      <h3 onClick={() => console.log("DATE DATA FOUND >>", date)} className={`text-lg font-semibold mb-0 ${bookingpagetext || textColor}`}>Manage Bookings</h3>

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex-1">
          <label className={`block text-sm font-medium mb-1 ${bookingpagetext || textColor}`}>
            Select Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className={`w-full p-2 ${bookingpagetext || textColor} border border-gray-300 rounded-md ${
              selectedDate && isDateBlocked(selectedDate) ? 'bg-red-50 !text-black border-red-300' : ''
            }`}
            min={new Date().toISOString().split('T')[0]}
          />
          {selectedDate && isDateBlocked(selectedDate) && (
            <p className="text-red-500 text-xs mt-1">This date is blocked and cannot be booked</p>
          )}
        </div>

        <div className="flex-1">
        <label className={`block text-sm font-medium mb-1 ${bookingpagetext || textColor}`}>
        Select Time
          </label>
          <select
            value={selectedTime}
            onChange={handleTimeChange}
            className={`w-full p-2 border border-gray-300 rounded-md ${bookingpagetext || textColor}`}
          >
            {renderTimeOptions()}
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={handleInitiateBooking}
            disabled={!selectedDate || !selectedTime || isTimeSlotBooked(selectedTime) || isDateBlocked(selectedDate) || isSlotAvailable === false}
            className={`px-2 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed `}
          >
            Add Booking
          </button>
        </div>
      </div>

      {/* Booking Modal */}
      {isModalOpen && pendingBooking && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setPendingBooking(null);
          }}
          onConfirm={handleConfirmBooking}
          date={new Date(selectedDate).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}
          time={pendingBooking.time}
          dayOfWeek={pendingBooking.day}
        />
      )}
    </div>
  );
};

export default BookingManager;