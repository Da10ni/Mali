  // // src/app/api/checkout/route.ts
  // import { NextResponse } from 'next/server';
  // import Stripe from 'stripe';

  // const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY, {
  //   // apiVersion: '2022-11-15',
  // });

  // export async function POST(req: Request) {
  //   try {
  //     const { price } = await req.json();

  //     // Convert the price from string (e.g., "9.99") to integer (e.g., 999)
  //     const priceInCents = Math.round(parseFloat(price) * 100);

  //     const session = await stripe.checkout.sessions.create({
  //       payment_method_types: ['card'],
  //       line_items: [
  //         {
  //           price_data: {
  //             currency: 'usd',
  //             product_data: {
  //               name: 'Appointment Booking',
  //             },
  //             unit_amount: priceInCents, // Now using the price in cents
  //           },
  //           quantity: 1,
  //         },
  //       ],
  //       mode: 'payment',
  //       success_url: `${process.env.NEXTAUTH_URL}/success`,
  //       cancel_url: `${process.env.NEXTAUTH_URL}/cancel`,
  //     });

  //     return NextResponse.json({ sessionId: session.id });
  //   } catch (error: any) {
  //     return NextResponse.json({ error: error.message }, { status: 500 });
  //   }
  // }


  import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Make sure to use server-side environment variables for API keys
// Use STRIPE_SECRET_KEY instead of NEXT_PUBLIC prefix for server-side code
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

// Add check for required environment variable
if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY environment variable is missing");
}

// Initialize Stripe with proper type checking
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-03-31.basil', // Current API version as of May 2025
});

// Mark route as dynamic to prevent static optimization attempts during build
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { price } = await req.json();
    
    // Input validation
    if (!price || isNaN(parseFloat(price))) {
      return NextResponse.json(
        { error: 'Invalid price provided' },
        { status: 400 }
      );
    }

    // Convert the price from string (e.g., "9.99") to integer (e.g., 999)
    const priceInCents = Math.round(parseFloat(price) * 100);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Appointment Booking',
            },
            unit_amount: priceInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/success`,
      cancel_url: `${process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/cancel`,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    console.error('Stripe checkout error:', error.message);
    return NextResponse.json(
      { error: error.message || 'An error occurred with the payment service' },
      { status: 500 }
    );
  }
}