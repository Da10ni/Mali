"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // Import useSearchParams
import { verifyEmail } from "@/src/services/Auth";

const VerifyEmail = () => {
  const searchParams = useSearchParams(); // Access search params from the URL
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const Router = useRouter();

  useEffect(() => {
    const token = searchParams.get("token"); // Get the token from the search params

    const verify = async () => {
      try {
        if (token) {
          // Call the verifyEmail service function
          const data = await verifyEmail(token);

          if (data.message === "Email successfully verified") {
            setSuccessMessage("Your email has been successfully verified!");
            Router.push("/goals")
          } else {
            setErrorMessage("Verification failed. Please try again.");
          }
        } else {
          setErrorMessage("No token provided.");
        }
      } catch (error) {
        // Catch errors from the API call or other issues
        setErrorMessage(error.message || "An error occurred during verification.");
      } finally {
        setLoading(false); // Set loading to false when done
      }
    };

    verify(); // Call the verify function
  }, [searchParams]); // Re-run when the searchParams change

  if (loading) {
    return (
      <div  className="flex w-full h-screen justify-center items-center">
      <div className="text-3xl">Verifying your email...</div>
      </div>
    )
  }

  return (
    <div  className="flex w-full h-screen justify-center items-center">
    <div>
      {successMessage && <div className="text-3xl text-green-500">{successMessage}</div>}
      {errorMessage && <div className="text-3xl text-red-500">{errorMessage}</div>}
    </div>
    </div>
  );
};

export default VerifyEmail;
