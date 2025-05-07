"use client";

import React, { useContext, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BookingCard from "../../components/Bookings/BookingPreview";
import { AuthContext } from "@/src/context/AuthContext";
import CheckoutButton from "../../components/stripe/Checkoutpage";
import { useSelector, useDispatch } from 'react-redux'
import { setField } from "@/src/store/slices/bookingSlice";
import { fetchBookingByUsername } from "@/src/services/Booking";


interface BookingDetail {
  name: string;
  email: string;
  day: string;
  date: string;
  time: string;
  month?: string;
  isoDate?: string;
  customerName?: string;
}

interface BookedSlotsInterface {
  [dayOfWeek: string]: {
    [date: string]: string[];
  };
}

const Page = () => {
  const [bookingData, setBookingData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null); // To store error messages
  const [bookedSlots, setBookedSlots] = useState<BookedSlotsInterface>({});
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [bookingDetails, setBookingDetails] = useState<BookingDetail[]>([]);
  const [currentMonth, setCurrentMonth] = useState("May 2025");
  const dispatch = useDispatch();
  const userdata = useContext(AuthContext);
  const { username } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      if (!username) return;

      try {
        const data = await fetchBookingByUsername(String(username));
        setBookingData(data);
        dispatch(setField({name: "price", value: data.price}));
        dispatch(setField({name: "bookingUserId", value: data.id}));
        console.log("Fetched booking id:", data.id);

        if (data.blockedDates) {
          setBlockedDates(data.blockedDates);
        }

        if (data.bookedSlots) {
          setBookedSlots(data.bookedSlots);
        }

        if (data.bookingDetails) {
          setBookingDetails(data.bookingDetails);
        }

        setError(null);
      } catch (err: any) {
        console.error("Error fetching booking:", err);
        setError("Failed to load booking details. Please try again later.");
        setBookingData(null); 
      }
    };

    fetchData(); 
  }, [username]);

  const handleDayClick = (day: string) => {
    console.log("Day clicked:", day);
  };

  const addBooking = (booking: BookingDetail) => {
    setBookingDetails((prev) => [...prev, booking]);

    // Update the booked slots
    setBookedSlots((prev) => {
      const newBookedSlots = { ...prev };

      if (!newBookedSlots[booking.day]) {
        newBookedSlots[booking.day] = {};
      }

      if (!newBookedSlots[booking.day][booking.date]) {
        newBookedSlots[booking.day][booking.date] = [];
      }

      if (!newBookedSlots[booking.day][booking.date].includes(booking.time)) {
        newBookedSlots[booking.day][booking.date] = [
          ...newBookedSlots[booking.day][booking.date],
          booking.time,
        ];
      }

      return newBookedSlots;
    });
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

      return newBookedSlots;
    });
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">{error}</div>
    ); 
  }

  if (!bookingData) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading booking details...
      </div>
    ); 
  }

  return (
    <div className="relative">
      <div className="lg:mt-5 h-[80%] fixed right-0 top-[40%] justify-center items-center mb-6 lg:mr-[40%] w-[24%]">
        <BookingCard
        userdata={userdata}
           bookingid={bookingData.id}
          title={bookingData.title}
          description={bookingData.description}
          image={bookingData.image}
          bookingUserName={bookingData.username}
          price={bookingData.price}
          bgColor={bookingData.bookingpagebgcolor|| "bg-white"}
          textColor={bookingData.bookingpagetextcolor || "text-gray-800"}
          availability={bookingData.availability || {}}
          onDayClick={handleDayClick}
          blockedDates={blockedDates}
          bookings={bookingDetails}
        //   bookedSlots={ {"Sunday": {
        //     "4": ["1:00 PM"]
        //   },
        // "Monday": {
        //     "12": ["9:00 PM"]
        //   }}}
        bookedSlots={bookingData.bookedslots}
          onAddBooking={addBooking}
          currentMonth={currentMonth}
          classname="!w-[1900px] !h-[690px] !-top-[16px]"
        />
      </div>
      <div className="absolute top-[720px] left-[47%]">
        {bookingData.isbooked ? (
          <div className="text-green-500 text-2xl font-bold">
            Booking Confirmed
          </div>
        ) : (
          <CheckoutButton price={bookingData.price.split("$")[1]} />
        )}
      </div>
    </div>
  );
};

export default Page;