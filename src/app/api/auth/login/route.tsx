// import { PrismaClient } from '@prisma/client';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';

// const prisma = new PrismaClient();

// interface LoginRequestBody {
//   email?: string;
//   username?: string;
//   password: string;
// }

// export async function POST(req: Request) {
//   try {
//     const { email, username, password }: LoginRequestBody = await req.json();

//     if ((!email && !username) || !password) {
//       return new Response(
//         JSON.stringify({ error: 'Email or username and password are required' }),
//         {
//           status: 400,
//           headers: { 'Content-Type': 'application/json' },
//         }
//       );
//     }

//     // Find user by email or username
//     const user = await prisma.user.findFirst({
//       where: {
//         OR: [
//           email ? { email } : undefined,
//           username ? { username } : undefined,
//         ].filter(Boolean),
//       },
//     });

//     if (!user) {
//       return new Response(
//         JSON.stringify({ error: 'Invalid credentials' }),
//         {
//           status: 401,
//           headers: { 'Content-Type': 'application/json' },
//         }
//       );
//     }

//     // Compare the password
//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return new Response(
//         JSON.stringify({ error: 'Invalid credentials' }),
//         {
//           status: 401,
//           headers: { 'Content-Type': 'application/json' },
//         }
//       );
//     }

//     // Generate JWT token
//     const token = jwt.sign(
//       { userId: user.id, email: user.email, username: user.username },
//       process.env.JWT_SECRET as string,
//       { expiresIn: '7d' }
//     );

//     return new Response(
//       JSON.stringify({ message: 'Login successful', token }),
//       {
//         status: 200,
//         headers: { 'Content-Type': 'application/json' },
//       }
//     );
//   } catch (err: any) {
//     console.error('Error during login:', err);
//     return new Response(
//       JSON.stringify({ error: 'Failed to login', details: err.message }),
//       {
//         status: 500,
//         headers: { 'Content-Type': 'application/json' },
//       }
//     );
//   }
// }

// import { PrismaClient } from '@prisma/client';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import cookie from 'cookie'; // Import cookie package

// const prisma = new PrismaClient();

// interface LoginRequestBody {
//   email?: string;
//   username?: string;
//   password: string;
// }

// export async function POST(req: Request) {
//   try {
//     const { email, username, password }: LoginRequestBody = await req.json();

//     if ((!email && !username) || !password) {
//       return new Response(
//         JSON.stringify({ error: 'Email or username and password are required' }),
//         {
//           status: 400,
//           headers: { 'Content-Type': 'application/json' },
//         }
//       );
//     }

//     // Find user by email or username
//     const user = await prisma.user.findFirst({
//       where: {
//         OR: [
//           email ? { email } : undefined,
//           username ? { username } : undefined,
//         ].filter(Boolean),
//       },
//     });

//     if (!user) {
//       return new Response(
//         JSON.stringify({ error: 'Invalid credentials' }),
//         {
//           status: 401,
//           headers: { 'Content-Type': 'application/json' },
//         }
//       );
//     }

//     // Compare the password
//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return new Response(
//         JSON.stringify({ error: 'Invalid credentials' }),
//         {
//           status: 401,
//           headers: { 'Content-Type': 'application/json' },
//         }
//       );
//     }

//     // Generate JWT token
//     const token = jwt.sign(
//       { userId: user.id, email: user.email, username: user.username },
//       process.env.JWT_SECRET as string,
//       { expiresIn: '7d' }
//     );

//     // Set the token in cookies
//     const cookieOptions = {
//       httpOnly: true,  // JavaScript se access nahi kar sakte
//       secure: process.env.NODE_ENV === 'production', // Secure flag production mein enable hota hai
//       maxAge: 60 * 60 * 24 * 7, // 1 week
//       path: '/', // Cookie har route pe accessible hai
//     };

//     // Return response with token and set it in cookies
//     return new Response(
//       JSON.stringify({ message: 'Login successful', token }),
//       {
//         status: 200,
//         headers: {
//           'Content-Type': 'application/json',
//           'Set-Cookie': cookie.serialize('token', token, cookieOptions), // Set-Cookie header
//         },
//       }
//     );
//   } catch (err: any) {
//     console.error('Error during login:', err);
//     return new Response(
//       JSON.stringify({ error: 'Failed to login', details: err.message }),
//       {
//         status: 500,
//         headers: { 'Content-Type': 'application/json' },
//       }
//     );
//   }
// }

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie'; // Correct import

const prisma = new PrismaClient();

interface LoginRequestBody {
  email?: string;
  username?: string;
  password: string;
}

export async function POST(req: Request) {
  try {
    const { email, username, password }: LoginRequestBody = await req.json();

    if ((!email && !username) || !password) {
      return new Response(
        JSON.stringify({ error: 'Email or username and password are required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Find user by email or username
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          email ? { email } : undefined,
          username ? { username } : undefined,
        ].filter(Boolean),
      },
    });

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    // Set the token in cookies
    const cookieOptions = {
      httpOnly: true, // JavaScript se access nahi kar sakte
      secure: process.env.NODE_ENV === 'production', // Secure flag production mein enable hota hai
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/', // Cookie har route pe accessible hai
    };

    // Return response with token and set it in cookies
    return new Response(
      JSON.stringify({ message: 'Login successful', token }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': serialize('token', token, cookieOptions), // Set-Cookie header
        },
      }
    );
  } catch (err: any) {
    console.error('Error during login:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to login', details: err.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
