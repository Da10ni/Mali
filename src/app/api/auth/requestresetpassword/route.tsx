import { encodeToken } from '@/src/lib/tokenObfuscator';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';


/**
 * @swagger
 * /api/auth/request-reset-password:
 *   post:
 *     summary: Request password reset
 *     description: Sends a password reset link to the user's email.
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
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Reset link sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password reset link sent
 *       400:
 *         description: Email required
 *       404:
 *         description: Email not found
 *       500:
 *         description: Server error
 */



const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return new Response(JSON.stringify({ error: "Email is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return new Response(JSON.stringify({ error: "No user with that email" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: "15m" });
  const encodedToken = encodeToken(token);



  const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL_2}/resetpassword?token=${token}`;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Reset your password",
    html: `<p>Click the link below to reset your password:</p>
           <a href="${resetLink}">${resetLink}</a>`,
  });

  return new Response(JSON.stringify({ message: "Password reset email sent" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
