"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import { useForm, FormProvider } from "react-hook-form";
import Textinput from "../UI/Textinput"; // Adjust path as needed
import { resetPassword } from "../../../services/Auth"; // Axios service
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const methods = useForm();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is required");
      return;
    }

    setIsLoading(true);

    try {
      const response = await resetPassword(email);

      if (response.success) {
        toast.success("Password reset email sent successfully!");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        toast.error(response.error || "Failed to send reset email.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="bg-gray-100 shadow-lg rounded-md p-8 w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-4">
            Reset Your Password
          </h2>
          <p className="text-center mb-6 text-gray-600">
            Enter your email and we'll send you a reset link.
          </p>

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email
              </label>
              <Textinput
                name="email"
                type="email"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#04c4ac] text-white rounded-md hover:bg-[#039e8b] focus:outline-none focus:ring-2 focus:ring-[#039e8b] shadow-md disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Reset Password"}
            </button>
          </form>

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

export default ForgotPassword;
