"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Textinput from "../UI/Textinput";
import "react-toastify/dist/ReactToastify.css";
import { FormProvider, useForm } from "react-hook-form";
import { updatePassword } from "@/src/services/Auth";

const ResetPassword: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const methods = useForm();
  const { handleSubmit, getValues } = methods;

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = async () => {
    const { newPassword, confirmPassword } = getValues();

    if (!token) {
      toast.error("Invalid or missing token.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    const response = await updatePassword(token, newPassword);

    if (response.success) {
      toast.success("Password successfully reset. Redirecting...");
      setTimeout(() => router.push("/login"), 2000);
    } else {
      toast.error(response.error);
    }

    setIsLoading(false);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
    <FormProvider {...methods}>
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="bg-gray-200 shadow-md rounded-md w-full max-w-md p-6">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Set New Password
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Textinput
              name="newPassword"
              type="password"
              placeholder="New Password"
              required
            />
            <Textinput
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              required
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#04c4ac] text-white py-3 rounded-md hover:bg-[#039e8b] transition-all"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
          <ToastContainer />
        </div>
      </div>
    </FormProvider>
    </Suspense>
  );
};

export default ResetPassword;
