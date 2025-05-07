// app/api/swagger/route.ts
import { getApiDocs } from '@/src/lib/swagger';
import { NextResponse } from 'next/server';

export async function GET(req, res) {
  try {
    // Await the getApiDocs function to get the Swagger spec
    const swaggerSpec = await getApiDocs();  // Await the promise returned by getApiDocs
    return NextResponse.json(swaggerSpec);  // Return the Swagger spec as JSON
  } catch (error) {
    console.error('Error generating Swagger spec:', error);
    return NextResponse.json({ Error: "Failed to generate" }, { status: 500 });  // Handle the error
  }
}