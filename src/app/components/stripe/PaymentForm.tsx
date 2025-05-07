// components/PaymentForm.jsx

'use client';

import { useState, useEffect } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';

export default function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Call API to create PaymentIntent
    fetch('/api/stripe/create-payment', {
      method: 'POST',
      body: JSON.stringify({ amount: 5000 }), // $50.00
    })
      .then(res => res.json())
      .then(data => setClientSecret(data.clientSecret));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements || !clientSecret) return;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: 'Customer Name',
        },
      },
    });

    if (result.error) {
      setError(result.error.message);
    } else {
      if (result.paymentIntent.status === 'succeeded') {
        alert('Payment successful!');
      }
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <CardElement className="border p-2 rounded" />
      {error && <div className="text-red-500">{error}</div>}
      <button type="submit" disabled={!stripe || loading} className="bg-blue-600 text-white px-4 py-2 rounded">
        {loading ? 'Processing...' : 'Pay $50'}
      </button>
    </form>
  );
}   
