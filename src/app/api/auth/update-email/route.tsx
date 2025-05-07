import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";


/**
 * @swagger
 * /api/auth/update-email:
 *   post:
 *     summary: Update user email
 *     description: Updates the user's email and returns a new JWT token.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: newemail@example.com
 *     responses:
 *       200:
 *         description: Email updated successfully
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
 *                   description: New JWT token with updated email
 *       400:
 *         description: Missing email
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */




const SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(token, SECRET);

    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Optional: update DB here using decoded.userId or email

    // Generate new token with updated email, keep username
    const newToken = jwt.sign(
      {
        email,
        username: decoded.username,
      },
      SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json({ success: true, token: newToken });
  } catch (err) {
    console.error("Update email failed:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
