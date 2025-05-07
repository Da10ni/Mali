import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { sendMagicLink } from '../../../../lib/nodemailer'; // Import sendMagicLink from your nodemailer setup
import bcrypt from 'bcryptjs';
import { encodeToken } from '@/src/lib/tokenObfuscator';

/**
 * @swagger
 * /api/auth/magic-link:
 *   post:
 *     summary: Request magic login link
 *     description: Sends a login link to the user's email for passwordless authentication.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Magic link sent successfully
 *       400:
 *         description: Email required
 *       500:
 *         description: Server error
 */



// Create Prisma client instance
const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email } = await req.json(); // Get email from the request body

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    // Check if the user exists
    let user = await prisma.user.findUnique({
      where: { email },
    });

    // If user doesn't exist, create a new user
    if (!user) {
      // Set a default password or handle this as per your logic
      const defaultPassword = 'defaultPassword'; // Set a default password or request the user to set it

      // Hash the default password before storing
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);

       user = await prisma.user.create({
        data: {
          // name: 'New User', // or `${email.split('@')[0]}`
          email,
          password: hashedPassword, // You need to store a hashed password
        },
      });
    }

    // Generate a JWT token with an expiration of 15 minutes
    const rawtoken = jwt.sign({ email }, process.env.NEXT_PUBLIC_JWT_SECRET, { expiresIn: '15m' });
    const token = encodeToken(rawtoken);


    // Construct the magic link with the token
    const magicLink = `http://localhost:3000/verifylink?token=${token}`;

    // Send the magic link via email
    await sendMagicLink(user.email, magicLink);

    return NextResponse.json({ message: 'Magic link sent' }, { status: 200 });
  } catch (error) {
    console.error('Error sending magic link:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect(); // Always disconnect Prisma client after the operation
  }
}
