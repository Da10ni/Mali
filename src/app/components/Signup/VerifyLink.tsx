
"use client"; 

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; // Correct usage of useRouter and useSearchParams from next/navigation
import { verifyMagicLink } from '@/src/services/Auth';

export default function VerifyLink() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const token = searchParams.get('token');  // Get token from the URL

    if (token) {
      const verify = async () => {
        try {
          // Call the service function to verify the token
          const response = await verifyMagicLink(token);
          console.log('Token verification success:', response);
          localStorage.setItem('user', JSON.stringify(response.user));  // Store the user data
          router.push('/');  // Redirect to the homepage after successful login
        } catch (error: any) {
          // Set the error message if token verification fails
          setError(error.message || 'An error occurred during verification');
        //   router.push('/login');  // Redirect to login page on failure
        }
      };

      verify(); // Run the verify function

    } else {
      setError('Token not found');
    //   router.push('/login');  // Redirect to login if no token is found
    }
  }, [searchParams, router]);

  return (
    <div>
      {error ? <p>{error}</p> : <p>Logging in...</p>}
    </div>
  );
}
