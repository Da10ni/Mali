import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

// Create user and send verification email
export async function POST(req: Request) {
  
  try {
    const { email, password, username, fullName, phone } = await req.json();

    if (!email || !password || !username) {
      return new Response(
        JSON.stringify({ error: 'Email, password, and username are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in DB (isVerified will be false by default)
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, username, phone, fullName },
    });

 const accessToken = jwt.sign(
      { userId: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );
    // Generate a verification token
    const verificationToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Save the token in the database for this user
    await prisma.user.update({
      where: { email: user.email },
      data: { verificationToken },
    });

    // Send email verification
    sendVerificationEmail(user.email, verificationToken);

    return new Response(
      JSON.stringify({
        Token: accessToken,
        message: 'User created successfully, please check your email to verify your account.',
        userId: user.id,
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Error during user creation >>', err);
    return new Response(
      JSON.stringify({ message: 'Failed to create user', error: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

async function sendVerificationEmail(email: string, token: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const verificationLink = `${process.env.NEXT_PUBLIC_BASIC_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify your email address',
    html: `<p>Click <a href="${verificationLink}">here</a> to verify your email address.</p>`,
  };

  await transporter.sendMail(mailOptions);
  
}
