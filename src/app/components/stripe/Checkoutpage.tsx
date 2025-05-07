"use client";

import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import axios from "axios"; // Import axios

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_PUBLISHABLE_KEY);

export default function CheckoutButton({ price }) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);

    try {
      // Send the price as part of the request body
      const res = await axios.post("/api/stripe/checkout", { price });

      const data = res.data;

      const stripe = await stripePromise;

      if (!stripe) {
        console.error("Stripe failed to load");
        return;
      }

      const result = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (result?.error) {
        console.error(result.error.message);
      }
    } catch (error) {
      console.error("Error during checkout", error);
    }

    setLoading(false);
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="bg-black text-white py-2 px-6 rounded-md hover:bg-gray-800"
    >
      {loading ? "Redirecting..." : "Buy Now"}
    </button>
  );
}
