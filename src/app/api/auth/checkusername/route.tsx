// app/api/users/route.tsx

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

/**
 * @swagger
 * /api/auth/check-username:
 *   post:
 *     summary: Check username availability
 *     description: Validates if a username is already taken.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *             properties:
 *               username:
 *                 type: string
 *                 example: myUniqueUsername
 *     responses:
 *       200:
 *         description: Username status returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 available:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Username missing or invalid
 *       500:
 *         description: Server error
 */



// Create a Prisma client instance

// export async function GET(req: Request) {
//   try {
//     // Extract the username from the query parameters
//     const { searchParams } = new URL(req.url);
//     const username = searchParams.get('username');

//     if (!username) {
//       return NextResponse.json({ error: 'Username query parameter is required' }, { status: 400 });
//     }

//     // Query the database to check if the username exists
//     const user = await prisma.user.findUnique({
//       where: { username },
//     });

//     // If the user is found, return a response with user data
//     if (user) {
//       return NextResponse.json({ message: 'Username exists', user }, { status: 200 });
//     }

//     // If the user is not found, return a response indicating so
//     return NextResponse.json({ message: 'Username does not exist' }, { status: 404 });
//   } catch (error) {
//     console.error('Error checking username:', error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   } finally {
//     // Disconnect the Prisma client
//     await prisma.$disconnect();
//   }
// }


// 
const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    // Extract the username from the query parameters
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');
    
    if (!username) {
      return NextResponse.json({ error: 'Username query parameter is required' }, { status: 400 });
    }
    
    // Query the database to check if the username exists
    const user = await prisma.user.findUnique({
      where: { username },
    });
    
    // If the user is found, return a response with user data
    if (user) {
      return NextResponse.json({ message: 'Username exists', user }, { status: 200 });
    }
    
    // If the user is not found, return a response indicating so
    return NextResponse.json({ message: 'Username does not exist' }, { status: 404 });
  } catch (error) {
    console.error('Error checking username:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}