
/**
 * @swagger
 * /api/auth/update-username:
 *   post:
 *     summary: Update user username
 *     description: Updates the user's username and returns a new JWT token.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: john_updated
 *     responses:
 *       200:
 *         description: Username updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                   description: New JWT token with updated username
 *       400:
 *         description: Missing username
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient(); // Initialize Prisma Client only once
const SECRET = process.env.JWT_SECRET; // JWT secret from environment variables

export async function POST(req: NextRequest) {
  try {
    // Check for Authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract token from the authorization header
    const token = authHeader.split(" ")[1];

    // Verify the JWT token
    const decoded: any = jwt.verify(token, SECRET);
    console.log('Decoded Token >>', decoded);
    

    // Get the new username from the request body
    const { username } = await req.json();
    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    // Optional: Check if the username already exists in the database
    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUsername) {
      return NextResponse.json({ error: "Username is already taken" }, { status: 400 });
    }

    // Find the user by the decoded user ID from the JWT
    const user = await prisma.user.findUnique({
      where: { email: decoded.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update the user in the database with the new username
    const updatedUser = await prisma.user.update({
      where: { email: decoded.email }, // Use the decoded user ID from the JWT
      data: { username }, // Set the new username
    });

    // Generate a new token with the updated username
    const newToken = jwt.sign(
      {
        email: decoded.email,
        username, // Set the new username in the token
      },
      SECRET,
      { expiresIn: "7d" } // Set the token expiration time
    );

    // Return success response with the new token
    return NextResponse.json({ success: true, token: newToken });
  } catch (err) {
    console.error("Update username failed:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}


