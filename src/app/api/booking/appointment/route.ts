// // File: app/api/booking/route.ts
// import { NextResponse } from 'next/server'
// import { PrismaClient } from '@prisma/client'

// const prisma = new PrismaClient()

// export async function POST(request: Request) {
//   try {
//     const body = await request.json()
//     console.log('👉 payload:', body)

//     const { username } = body

//     if (!username) {
//       return NextResponse.json(
//         { message: 'username is required' },
//         { status: 400 }
//       )
//     }

//     // Check if the booking with the given username already exists
//     const existingBooking = await prisma.appointmentBooking.findUnique({
//       where: { username },
//     })

//     let newBooking

//     if (existingBooking) {
//       // If the booking exists, update it
//       newBooking = await prisma.appointmentBooking.update({
//         where: { username },
//         data: {
//           availability: body?.availability,
//           blockedDates: body?.blockedDates,
//           bookingDetails: body?.bookingDetails,
//           title: body?.title,
//           description: body?.description,
//           price: body?.price,
//           timezone: body?.timezone,
//           bottomTitle: body?.bottomTitle,
//           cardBgColor: body?.cardBgColor,
//           cardTextColor: body?.cardTextColor,
//           image: body?.image ?? null,
//           isbooked: body?.isbooked ?? false,
//         },
//       })

//       console.log('✅ updated:', newBooking)
//     } else {
//       // If the booking does not exist, create a new one
//       newBooking = await prisma.appointmentBooking.create({
//         data: {
//           username: body?.username,
//           availability: body?.availability,
//           blockedDates: body?.blockedDates,
//           bookingDetails: body?.bookingDetails,
//           title: body?.title,
//           description: body?.description,
//           price: body?.price,
//           timezone: body?.timezone,
//           bottomTitle: body?.bottomTitle,
//           cardBgColor: body?.cardBgColor,
//           cardTextColor: body?.cardTextColor,
//           image: body?.image ?? null,
//           isbooked: body?.isbooked ?? false,
//         },
//       })

//       console.log('✅ created:', newBooking)
//     }

//     return NextResponse.json(newBooking, { status: 201 })
//   } catch (err) {
//     console.error('❌ create/update error:', err)
//     return NextResponse.json(
//       { message: 'Error creating or updating booking' },
//       { status: 500 }
//     )
//   }
// }

// import { PrismaClient } from '@prisma/client';
// import { NextResponse } from 'next/server';

// const prisma = new PrismaClient()

// export async function POST(req: Request) {
//   try {
//     const { date, customerEmail, customerName, bookingUserId, price  } = await req.json();

//     // Validate the required fields
//     if (!date || !customerEmail || !customerName || !bookingUserId) {
//       return NextResponse.json(
//         { error: 'Missing required fields' },
//         { status: 400 }
//       );
//     }
//     console.log('✅ data found >>:', date, customerEmail, customerName, bookingUserId);

//     // Step 1: Create the Booking record
//     const booking = await prisma.booking.create({
//       data: {
//         customerEmail,
//         customerName,
//         bookingUserId,
//         // assuming you want to link the booking to the appropriate bookingPage
//         paymentId: price, // Optionally set this if needed
//       },
//     });
//     // Step 2: Update the bookingPage table to add the selected booking date to bookedSlots array
//     await prisma.bookingPage.update({
//       where: {
//         id: bookingUserId, // Use the provided bookingPageId to find the page to update
//       },
//       data: {
//         bookedslots: {
//           push: date, // Push the selected date into the bookedSlots array (e.g. "2025-05-01")
//         },
//       },
//     });

//     // Return the created booking as a response
//     return NextResponse.json(
//       { message: 'Booking created and added to bookedSlots successfully', booking },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { error: 'Failed to create booking' },
//       { status: 500 }
//     );
//   }
// }



import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { customerEmail, customerName, bookingUserId, price, date } = await req.json();

    if (!customerEmail || !customerName || !bookingUserId || !date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Step 1: Create booking
    const booking = await prisma.booking.create({
      data: {
        customerEmail,
        customerName,
        bookingUserId,
        paymentId: price || null,
      },
    });

    // Step 2: Fetch current bookedslots
    const bookingPage = await prisma.bookingPage.findUnique({
      where: { id: bookingUserId },
      select: { bookedslots: true }
    });

    const existingSlots = bookingPage?.bookedslots && typeof bookingPage.bookedslots === 'object' 
    ? bookingPage.bookedslots 
    : {};    const updatedSlots = { ...existingSlots };

    // Step 3: Merge date into existingSlots
    for (const day in date) {
      const newDates = date[day];

      if (!updatedSlots[day]) {
        updatedSlots[day] = {};
      }

      for (const date in newDates) {
        const newTimes = newDates[date];
        const existingTimes = updatedSlots[day][date] || [];

        // Merge and remove duplicates
        const mergedTimes = Array.from(new Set([...existingTimes, ...newTimes]));

        updatedSlots[day][date] = mergedTimes;
      }
    }

    // Step 4: Update bookedslots in DB
    await prisma.bookingPage.update({
      where: { id: bookingUserId },
      data: {
        bookedslots: updatedSlots
      }
    });

    return NextResponse.json(
      { message: 'Booking created and slots updated successfully', booking },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error:", error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
