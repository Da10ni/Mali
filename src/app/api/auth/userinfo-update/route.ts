// src/app/api/auth/userinfo-update/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to verify token
function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded as { email: string; id: number };
  } catch (err) {
    console.error("Token verification failed:", err);
    return null;
  }
}

export async function PUT(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded || !decoded.email) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const { bio, liketosell, categories, profilepicture, tiktokUsername, instagramUsername } = await req.json();

  try {
    const updatedUser = await prisma.user.update({
      where: { email: decoded.email },
      data: { bio, liketosell, categories, profilepicture, tiktokUsername, instagramUsername },
    });

    return NextResponse.json({ message: "User info updated", user: updatedUser });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: "Failed to update user info" }, { status: 500 });
  }
}


// import { NextRequest, NextResponse } from "next/server";
// import jwt from "jsonwebtoken";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// function verifyToken(token: string) {
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET!);
//     return decoded as { email: string; id: number };
//   } catch (err) {
//     console.error("Token verification failed:", err);
//     return null;
//   }
// }

// export async function PUT(req: NextRequest) {
//   const authHeader = req.headers.get("authorization");

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const token = authHeader.split(" ")[1];
//   const decoded = verifyToken(token);

//   if (!decoded || !decoded.email) {
//     return NextResponse.json({ error: "Invalid token" }, { status: 401 });
//   }

//   const body = await req.json();

//   // 🧠 Clean out any undefined fields
//   const cleanData: Record<string, any> = {};
//   const updatableFields = [
//     "bio",
//     "liketosell",
//     "categories",
//     "profilepicture",
//     "tiktokusename",
//     "instagramusername",
//     "phone",
//     "fullName",
//     "displayname",
//     "goals",
//   ];

//   for (const key of updatableFields) {
//     if (body[key] !== undefined) {
//       cleanData[key] = body[key];
//     }
//   }

//   try {
//     const updatedUser = await prisma.user.update({
//       where: { email: decoded.email },
//       data: cleanData,
//     });

//     return NextResponse.json({ message: "User info updated", user: updatedUser });
//   } catch (error) {
//     console.error("Update error:", error);
//     return NextResponse.json({ error: "Failed to update user info" }, { status: 500 });
//   }
// }
