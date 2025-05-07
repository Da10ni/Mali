// src/app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // Clear the HTTP-only cookie
    (await cookies()).delete('token');
    
    return NextResponse.json(
      { success: true, message: 'Logout successful' },
      {
        status: 200,
        headers: {
          'Set-Cookie': `token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; ${
            process.env.NODE_ENV === 'production' ? 'Secure; SameSite=Strict' : ''
          }`
        }
      }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to logout' },
      { status: 500 }
    );
  }
}