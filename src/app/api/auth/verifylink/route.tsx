// src/app/api/auth/verifyMagicLink/route.ts
import { NextResponse } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';


/**
 * @swagger
 * /api/auth/verify-link:
 *   get:
 *     summary: Verify magic link
 *     description: Verifies the login token from the magic link and returns a new JWT token.
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: The token from the magic login link
 *     responses:
 *       200:
 *         description: Token verified and user authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: jwt_token_here
 *       400:
 *         description: Token is missing or invalid
 *       500:
 *         description: Server error
 */


// Prisma client to interact with the database
const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get('token');  // Get token from the query params

    if (!token) {
      return NextResponse.json({ message: 'Token is required' }, { status: 400 });
    }

    // Verify the token server-side using the JWT secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);  // Replace with your secret key

    // Get user data from the decoded token (assuming token has email)
    const user = await prisma.user.findUnique({
      where: { email: (decoded as JwtPayload).email }, // Cast decoded to JWTPayload
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Token is valid, return success response
    return NextResponse.json({ message: 'Token verified successfully', user }, { status: 200 });
  } catch (error) {
    console.error('Token verification failed:', error);
    return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
  }
}
