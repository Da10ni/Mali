import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST: Check if the customerEmail exists for a specific bookingUserId in the Booking table
export async function POST(req: Request) {
  try {
    const { customerEmail, bookingUserId } = await req.json(); // Getting customerEmail and bookingUserId from the request

    // Validate if email and bookingUserId are provided
    if (!customerEmail || !bookingUserId) {
      return NextResponse.json({ error: 'customerEmail and bookingUserId are required' }, { status: 400 });
    }

    // Check if the email exists for the given bookingUserId in the Booking table
    const booking = await prisma.booking.findFirst({
      where: {
        customerEmail: customerEmail, // Check email
        bookingUserId: Number(bookingUserId), // Check against bookingUserId
      },
    });

    // If booking exists for the email and user, return confirmation
    if (booking) {
      return NextResponse.json({
        bookingConfirmed: true,
        message: 'Booking confirmed. Proceed to manage your booking.',
      });
    }

    // If no booking found, return response to show "Buy Now"
    return NextResponse.json({
      bookingConfirmed: false,
      message: 'No booking found. Please proceed with the "Buy Now" button to make a new booking.',
    });
    
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to check email for booking' }, { status: 500 });
  }
}
