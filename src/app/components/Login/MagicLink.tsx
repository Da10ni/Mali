"use client"; 

import { useState } from "react";

export default function MagicLogin() {
  const sendLink = async (e: any) => {
    e.preventDefault();
    const email = e.target.email.value;
    const res = await fetch('/api/auth/magiclink', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    alert(data.message);
  };

  return (
    <form onSubmit={sendLink}>
      <input type="email" name="email" placeholder="Enter email" className="w-90 ml-[40%] mt-5 p-3 text-center border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required/>
      <button type="submit" className="w-90 ml-[40%] mt-2 p-3 border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">Send Magic Link</button>
    </form>
  );
}
