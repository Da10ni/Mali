import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: Request, {params}
  // { params }: { params: { username: string } } // Get the username from the URL params
) {
  try {
    const { username } =  await params

    if (!username) {
      return NextResponse.json(
        { message: 'username parameter is required' },
        { status: 400 }
      )
    }

    const booking = await prisma.bookingPage.findUnique({
      where: { username },
    })

    if (!booking) {
      return NextResponse.json(
        { message: 'No booking found for the given username' },
        { status: 404 }
      )
    }

    // Return the booking data as a response
    return NextResponse.json(booking)
  } catch (error) {
    console.error('Error fetching booking:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
