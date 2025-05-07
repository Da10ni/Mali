// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

// console.log(prisma);  // Log Prisma Client instance to ensure it's initialized

// export async function POST(req: Request) {
//   const { email, username, title, description, price, bottomTitle, image, timeZone, blockedDates } = await req.json();

//   console.log('Received data:', { email, username, title, description, price, bottomTitle, image, timeZone, blockedDates });

//   try {
//     if (!username || !title || !description || !price) {
//       throw new Error("Missing required fields");
//     }

//     // Check if user already exists
//     /*const existingUser = await prisma.bookingPage.findUnique({
//       where: { email }, // Check by email (or username)
//     });

//     if (existingUser) {
//       throw new Error('User with this email already exists.');
//     }*/

//     // Create a new user in the database
//     const newUser = await prisma.bookingPage.create({
//       data: {
//         email: email || null, 
//         username,
//         title,
//         description,
//         price,
//         bottomTitle,
//         image: image || null,
//         timeZone,
//         blockedDates,
//       },
//     });

//     console.log('User created:', newUser);
//     return new Response(JSON.stringify(newUser), { status: 200 });
//   } catch (error) {
//     console.error('Error creating user:', error);  // Log the detailed error message
//     return new Response(`Failed to create user: ${error.message}`, { status: 500 });
//   }
// }


import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { email, username, title, description, price, bottomTitle, image, timeZone, blockedDates, bookingpagetextcolor, bookingpagebgcolor } = await req.json();

  console.log('Received data:', { email, username, title, description, price, bottomTitle, image, timeZone, blockedDates });

  try {
    if (!username || !title || !description || !price) {
      throw new Error("Missing required fields");
    }

    const user = await prisma.bookingPage.upsert({
      where: { username }, // uses unique constraint on `username`
      update: {
        email: email || null,
        title,
        description,
        price,
        bottomTitle,
        image: image || null,
        timeZone,
        blockedDates,
        bookingpagetextcolor,
        bookingpagebgcolor,
      },
      create: {
        email: email || null,
        username,
        title,
        description,
        price,
        bottomTitle,
        image: image || null,
        timeZone,
        blockedDates,
        bookingpagetextcolor,
        bookingpagebgcolor,
      },
    });

    console.log('Upserted user:', user);
    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error('Error during upsert:', error);
    return new Response(`Failed to process user: ${error.message}`, { status: 500 });
  }
}
