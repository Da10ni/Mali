// src/app/services/appointmentService.ts

import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

interface AppointmentData {
  username: string;
  bookingDetails: any;
  title: string;
  description: string;
  price: string;
  timezone: string;
  bottomTitle: string;
  cardBgColor: string;
  cardTextColor: string;
  image?: string | null;
  availability?: any;
  blockedDates: string[];
  isbooked?: boolean;
}

export async function createAppointment(data: AppointmentData) {
  try {
    let { bookingDetails, availability } = data;

    if (typeof bookingDetails === 'string') {
      try {
        bookingDetails = JSON.parse(bookingDetails);
      } catch (e) {
        throw new Error("Invalid bookingDetails JSON format");
      }
    }

    if (availability && typeof availability === 'string') {
      try {
        availability = JSON.parse(availability);
      } catch (e) {
        throw new Error("Invalid availability JSON format");
      }
    }

    const blockedDates = Array.isArray(data.blockedDates) ? data.blockedDates : [];

    const appointment = await prisma.appointmentBooking.create({
      data: {
        username: data.username,
        availability,
        blockedDates,
        bookingDetails,
        title: data.title,
        description: data.description,
        price: data.price,
        timezone: data.timezone,
        bottomTitle: data.bottomTitle,
        cardBgColor: data.cardBgColor,
        cardTextColor: data.cardTextColor,
        image: data.image || null,
        isbooked: data.isbooked || false,
      },
    });

    

    return appointment;
  } catch (error) {
    console.error("Error creating appointment booking:", error);
    throw error; // Rethrow the error to be handled in the route
  } finally {
    await prisma.$disconnect();
  }
}

export async function fetchBookingByUsername(username: string) {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/booking/${username}`) // Use axios to make the GET request

    return response.data // Axios automatically parses JSON
  } catch (error: any) {
    // Check if it’s an Axios error
    if (error.response) {
      // The server responded with a status other than 2xx
      throw new Error(`Error fetching booking: ${error.response.statusText}`)
    } else if (error.request) {
      // No response was received
      throw new Error('Error fetching booking: No response from server')
    } else {
      // Something went wrong in setting up the request
      throw new Error(`Error fetching booking: ${error.message}`)
    }

  }
}
export async function createOrUpdateBooking(bookingData: {
  username: string;
  availability?: string;
  blockedDates?: string[];
  bookingDetails?: string;
  title?: string;
  description?: string;
  price?: string;
  timezone?: string;
  bottomTitle?: string;
  cardBgColor?: string;
  cardTextColor?: string;
  image?: string;
  isbooked?: boolean;
}) {
  try {
    // Send a POST request to the API with the booking data using Axios
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/booking/appointment`, bookingData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error: any) {
    // If the error is a response error (from the server), you can get the response details
    if (error.response) {
      console.error('Error response:', error.response);
      throw new Error(error.response.data.message || 'Error creating or updating booking');
    }
    
    // If it's a different type of error (like a network error)
    console.error('Error:', error);
    throw new Error('Error creating or updating booking');
  }
}

export const checkSlotAvailability = async (startTime, endTime, bookingUserId ) => {
  try {
    // Send POST request to the check-slot-availability API
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/booking/check-slot-availability`, {
      startTime,
      endTime,
      bookingUserId 
    });

    // Return the response data (availability status)
    return response.data;
  } catch (error) {
    console.error("Error checking slot availability:", error);
    throw error; // Rethrow the error so it can be handled by the calling function
  }
};

export const checkBookingByEmailAndUserId = async (email, bookingUserId) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/booking/check-email`, {
      customerEmail: email,
      bookingUserId: bookingUserId,
    });

    return response.data; // Return the API response containing the booking status and message
  } catch (error) {
    console.error('Error checking booking by email and user ID:', error);
    throw new Error('Failed to check booking status');
  }
};

export const createBooking = async (date, customerEmail, customerName, bookingUserId, price) => {
  try {
    // Send POST request to the booking API with the required data
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/booking/appointment`, {
      date,
      customerEmail,
      customerName,
      bookingUserId,
      price,
    });

    return response.data; // Return the response data (booking info or error message)
  } catch (error) {
    console.error('Error creating booking:', error);
    throw new Error('Failed to create booking');
  }
};