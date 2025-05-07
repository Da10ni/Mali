"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import Textinput from "../UI/Textinput"; // Assume this is a styled input component
//import { resetPassword } from "../../services/Auth"; // This function should handle password reset functionality
import { useForm, FormProvider } from "react-hook-form";

const ForgotEmail: React.FC = () => {
  const [emailOrUsername, setEmailOrUsername] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const methods = useForm();

  // Handle password reset
  const handleResetEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    {
      /*} try {
      // Send the email or username to reset the password
      const response = await resetPassword(emailOrUsername); // You should define this function
      if (response.success) {
        toast.success("Password reset email sent successfully!");
        router.push("/login"); // Redirect back to login page
      } else {
        toast.error("Failed to send password reset email.");
      }
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }*/
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="flex min-h-screen items-center justify-center">
        <div className=" p-5 rounded-lg w-[30%]">
          <h2 className="text-5xl font-bold text-center mb-4">
            Reset your Email
          </h2>
          <p className="text-center mb-6 text-gray-600">
            If you signed up with an username and email, reset your email below.
          </p>

          <form onSubmit={handleResetEmail} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Email
              </label>
              <Textinput
                name="Username"
                type="text"
                placeholder="Enter your username"
                className=""
                onChange={(e) => setEmailOrUsername(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#04c4ac] text-white rounded-md hover:bg-[#039e8b] focus:outline-none focus:ring-2 focus:ring-[#039e8b] shadow-md disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Reset Email"}
            </button>
          </form>

          {/*<p className="text-center text-sm mt-4 text-gray-800">
            If you signed up using your phone number, Google, or Apple,{" "}
            <a href="/help" className="text-[#04c4ac]">
              get help accessing your account here
            </a>
          </p>*/}

          <div className="text-center mt-4">
            <a href="/login" className="text-sm text-[#04c4ac] hover:underline">
              &lt; Back to login
            </a>
          </div>
        </div>
        <ToastContainer />
      </div>
    </FormProvider>
  );
};

export default ForgotEmail;
