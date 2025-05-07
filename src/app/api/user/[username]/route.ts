// File: app/api/profile/[username]/route.ts
// This is for App Router. If using Pages Router, place in pages/api/profile/[username].ts

import { NextRequest, NextResponse } from 'next/server';

// This would normally connect to a database
let profiles: Record<string, any> = {};

export async function GET(
  request: NextRequest,
  {params}
) {
  const {username} = await params;
  
  if (profiles[username]) {
    return NextResponse.json(profiles[username]);
  }
  
  return NextResponse.json(
    { error: 'Profile not found' },
    { status: 404 }
  );
}

export async function POST(
  request: NextRequest,
  {params}
) {
  const {username} = await params;
  
  try {
    // Parse the request body
    const body = await request.json();
    
    // Update the profile data
    profiles[username] = {
      products: body.products || [],
      links: body.links || [],
      theme: body.theme || { bgColor: 'bg-gray-200', textColor: 'text-gray-700' },
      lastUpdated: new Date().toISOString()
    };
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    // Return error response
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 400 }
    );
  }
}