import { PrismaClient } from '@prisma/client';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

// Define handler for email verification (GET method)
export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get('token');

    if (!token) {
      return NextResponse.json({ message: 'Token is missing' }, { status: 400 });
    }

    // Decode the token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by email in the token
    const user = await prisma.user.findUnique({
      where: { email: (decoded as JwtPayload).email }, // Cast decoded to JWTPayload
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Update the user to mark them as verified
    await prisma.user.update({
      where: { email: user.email },
      data: { isVerified: true, verificationToken: null },
    });

    return NextResponse.json({ message: 'Email successfully verified' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Invalid or expired token' }, { status: 400 });
  }
}
