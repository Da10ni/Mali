"use client";

import React, { useState, useEffect } from "react";
import BookingSystem from "./BookingSystem";
import BookingCard from "./BookingPreview";
import Header from "../UI/Header";
import ProfileThemePicker from "../UI/ThemePicker";
import { useSelector, useDispatch } from 'react-redux'
import { setField } from "@/src/store/slices/bookingSlice";


// while sharing state between them
const BookingsPage: React.FC = () => {
  // Shared state for both components
  const [title, setTitle] = useState("Book a 1:1 Call with Me");
  const [price, setPrice] = useState("$9.99");
  const [description, setDescription] = useState(
    "I am here to help you achieve your goals."
  );
  const [timezone, setTimezone] = useState("Asia/Dubai");
  const [duration, setDuration] = useState("30 minutes");
  const [currentMonth, setCurrentMonth] = useState("May 2025");
  const [image, setImage] = useState<File | null>(null);
  const dispatch = useDispatch();

  // Theme state
  const [cardBgColor, setCardBgColor] = useState("bg-gray-100");
  const [cardTextColor, setCardTextColor] = useState("text-gray-700");

  // Availability and booking data
  const [availability, setAvailability] = useState<{
    [key: string]: {
      selected: boolean;
      from: string;
      to: string;
    };
  }>({});

  const [bookedSlots, setBookedSlots] = useState<{
    [day: string]: {
      [date: string]: string[];
    };
  }>({});

  const [blockedDates, setBlockedDates] = useState<string[]>([
    "2025-05-01",
    "2025-05-15",
    "2025-05-20",
  ]);

  // Booking details
  const [bookingDetails, setBookingDetails] = useState<
    Array<{
      name: string;
      email: string;
      day: string;
      date: string;
      time: string;
      month?: string;
    }>
  >([]);

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
  };

  const handlePriceChange = (newPrice: string) => {
    setPrice(newPrice);
  };

  const handleDescriptionChange = (newDescription: string) => {
    setDescription(newDescription);
  };

  const handleTimezoneChange = (newTimezone: string) => {
    setTimezone(newTimezone);
  };

  const handleDurationChange = (newDuration: string) => {
    setDuration(newDuration);
  };

  const handleImageChange = (newImage: File | null) => {
    setImage(newImage);
  };

  const handleMonthChange = (newMonth: string) => {
    setCurrentMonth(newMonth);
  };

  const handleAvailabilityChange = (newAvailability: any) => {
    setAvailability(newAvailability);
  };

  const handleBookingAdd = (
    day: string,
    date: string,
    time: string,
    name: string,
    email: string
  ) => {
    setBookingDetails((prev) => [
      ...prev,
      { name, email, day, date, time, month: currentMonth },
    ]);

    setBookedSlots((prev) => {
      const newSlots = { ...prev };

      if (!newSlots[day]) {
        newSlots[day] = {};
      }

      if (!newSlots[day][date]) {
        newSlots[day][date] = [];
      }

      if (!newSlots[day][date].includes(time)) {
        newSlots[day][date] = [...newSlots[day][date], time];
      }

      return newSlots;
    });
  };

  const handleBlockedDatesChange = (newBlockedDates: string[]) => {
    setBlockedDates(newBlockedDates);
  };

  function handleDayClick(day: string): void {
    throw new Error("Function not implemented.");
  }

  const handleBgColorChange = (color: string) => {
    setCardBgColor(color);
    dispatch(setField({name: 'bookingpagebg', value: color}));
  };

  const handleTextColorChange = (color: string) => {
    setCardTextColor(color);
    dispatch(setField({name: 'bookingpagetext', value: color}));
  };
  

  return (
    <div className=" min-h-screen">
      <Header
        title="Bookings"
        rightContent={
          <div className="flex items-center gap-3">
            <ProfileThemePicker
              setBgColor={handleBgColorChange}
              setTextColor={handleTextColorChange}
            />
          </div>
        }
      />
      {/* Left side - BookingPage */}
      <div className="w-full">
        <BookingSystem />
      </div>

      {/* Right side - BookingCard */}
      <div className="w-full  lg:mt-5 fixed right-0 top-1/2 transform -translate-y-1/2 mb-6 lg:w-1/3 lg:mr-8">
        {/* <BookingCard
          title={title}
          price={price}
          timezone={timezone}
          image={image}
          description={description}
          currentMonth={currentMonth}
          selectedDays={["14", "21", "28"]} // Example selected days
          bgColor={cardBgColor}
          textColor={cardTextColor}
          availability={availability}
          onDayClick={handleDayClick}
          bookedSlots={bookedSlots}
          blockedDates={blockedDates}
        /> */}
      </div>
    </div>
  );
};

export default BookingsPage