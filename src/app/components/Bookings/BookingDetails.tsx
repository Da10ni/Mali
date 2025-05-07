import React from 'react';

export interface BookingDetail {
  name: string;
  email: string;
  day: string;
  date: string;
  time: string;
  month?: string;
  isoDate?: string;
}



interface BookingDetailsViewProps {
  bookings: BookingDetail[]; // Pass BookingDetail array
  onRemoveBooking: (day: string, date: string, time: string) => void;
  currentMonth: string;
}


const BookingDetailsView: React.FC<BookingDetailsViewProps> = ({
  bookings,
  onRemoveBooking,
  currentMonth
}) => {
  // Helper function for month name to index
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
  
  function convertTo24Hour(timeStr: string): number {
    const [timePart, period] = timeStr.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);
    
    if (period === 'PM' && hours < 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }
    
    return hours * 60 + (minutes || 0);
  }
  
  // Create full Date objects for each booking to ensure correct sorting and display
  const bookingsWithDates = bookings.map(booking => {
    let dateObj: Date;
    
    // If we have an ISO date string, use that directly
    if (booking.isoDate) {
      dateObj = new Date(booking.isoDate);
    } 
    // Otherwise construct from month, date
    else {
      const bookingMonth = booking.month || currentMonth;
      const [monthName, yearStr] = bookingMonth.split(' ');
      const year = parseInt(yearStr);
      const monthIndex = getMonthIndexFromName(monthName);
      dateObj = new Date(year, monthIndex, parseInt(booking.date));
    }
    
    return {
      ...booking,
      dateObj // Add the Date object to the booking
    };
  });
  
  // Sort by date and time
  const sortedBookings = [...bookingsWithDates].sort((a, b) => {
    // First compare by date
    const dateDiff = a.dateObj.getTime() - b.dateObj.getTime();
    if (dateDiff !== 0) return dateDiff;
    
    // If same date, sort by time
    return convertTo24Hour(a.time) - convertTo24Hour(b.time);
  });
  
  // Function to format date for display
  const formatDate = (booking: any): string => {
    // Use the dateObj we created
    return booking.dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  if (sortedBookings.length === 0) {
    return (
      <div className="bg-gray-50 p-4 rounded-md text-center text-gray-500">
        No bookings to display
      </div>
    );
  }
  
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">Booking Details</h3>
      
      <div className=" rounded-lg border border-gray-400 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="">
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedBookings.map((booking, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{booking.name}</div>
                  <div className="text-sm text-gray-500">{booking.email}</div>
                </td>
                <td className="px-4 py-3 text-sm">
                  {formatDate(booking)}
                </td>
                <td className="px-4 py-3 text-sm">
                  {booking.time}
                </td>
                <td className="px-4 py-3 text-sm">
                  <button
                    onClick={() => onRemoveBooking(booking.day, booking.date, booking.time)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingDetailsView;