import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST: Check if the slot is available or not, including the bookingUserId
export async function POST(req: Request) {
  try {
    const { startTime, endTime, bookingUserId } = await req.json(); // Getting the slot's start time, end time, and bookingUserId from the request

    // Validate required fields
    if (!startTime || !endTime || !bookingUserId) {
      return NextResponse.json({ error: 'startTime, endTime, and bookingUserId are required' }, { status: 400 });
    }

    // Convert the time to Date objects to ensure proper comparison
    const requestedStartTime = new Date(startTime);
    const requestedEndTime = new Date(endTime);

    // Check for overlapping slots for the given bookingUserId
    const overlappingSlots = await prisma.availableSlot.findMany({
      where: {
        bookingUserId, // Filter by the bookingUserId
        OR: [
          {
            startTime: {
              lt: requestedEndTime, // Existing start time is before the requested end time
            },
            endTime: {
              gt: requestedStartTime, // Existing end time is after the requested start time
            },
          },
        ],
      },
    });

    // If there are any overlapping slots, the requested slot is not available
    if (overlappingSlots.length > 0) {
      return NextResponse.json({ available: false, message: 'Slot is not available for this user' }, { status: 200 });
    }

    // If no overlapping slots were found, the requested slot is available
    return NextResponse.json({ available: true, message: 'Slot is available' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to check slot availability' }, { status: 500 });
  }
}
