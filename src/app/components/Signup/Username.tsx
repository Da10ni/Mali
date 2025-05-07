// pages/username.tsx
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation"; // Using the correct Next.js navigation hook
import { toast, ToastContainer } from "react-toastify";
import { useForm, FormProvider } from "react-hook-form"; // Import useForm and FormProvider
import { checkUsername } from "@/src/services/Auth";
import Textinput from "../UI/Textinput";
import { log } from "node:console";
import Image from "next/image";

const UsernamePage = () => {
  const [usernameExist, setUsernameExist] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [userflag, setfuserflag] = useState(false);
  const [isUsernameValid, setIsUsernameValid] = useState<boolean>(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // Initialize the useForm hook
  const methods = useForm();

  // Handle username change with debouncing
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const username = e.target.value;
    setUsername(username);

    // Clear the previous timeout to avoid too many API calls in quick succession
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set a new timeout to call checkUsername after 500ms delay
    debounceTimeoutRef.current = setTimeout(async () => {
      const user = await checkUsername({ username });
      console.log("User >>>>>>", user);

      if (user?.errormessage) {
        setUsernameExist(user?.errormessage);
        setIsUsernameValid(false);
        setfuserflag(true);
      } else {
        setUsernameExist(user?.message);
        setIsUsernameValid(true);
        setfuserflag(false);
      }
    }, 500);
  };

  const handleContinue = () => {
    // Redirect to the register page if the username is valid
    if (isUsernameValid) {
      router.push("/register");
    } else {
      //   toast.error("Please enter a valid username.");
    }
  };

  return (
    // Wrap everything in FormProvider
    <FormProvider {...methods}>
      <div className="min-h-screen flex justify-center items-center -translate-y-24">
        <div className="flex items-center ml-50 justify-center min-h-screen bg-white pb-20">
          <div className="bg-white p-8 rounded-lg w-full max-w-md">
            {/* Logo Section */}
            <div className="text-center mb-8">
              <h1 className="text-7xl font-bold text-[#04c4ac]">Linktree*</h1>
            </div>

            <h2 className="text-3xl font-semibold text-center text-[#04c4ac] mb-6">
              Enter Username
            </h2>

            {/* Username Input */}
            <div className="mb-4">
              <Textinput
                name="username"
                type="text"
                placeholder="Enter your username"
                required={true}
                className="w-full mt-2 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                onChange={handleUsernameChange}
              />
              <span
                className={`${
                  userflag ? "text-red-400" : "text-green-500"
                } ml-4`}
              >
                {usernameExist}
              </span>
            </div>

            {/* Button to continue to the registration page */}
            <div className="text-center">
              <button
                onClick={handleContinue}
                className={`w-full py-3 rounded-md focus:outline-none ${
                  isUsernameValid ? "bg-[#04c4ac]" : "bg-gray-400"
                } text-white`}
                disabled={!isUsernameValid} // Disable the button if the username is invalid
              >
                Continue
              </button>
            </div>
          </div>
        </div>

        <div className="hidden md:flex w-1/2 relative ml-54">
          <Image
            src="/assets/images1.jpg"
            alt="Promotional"
            fill
            className="object-cover object-center"
          />
        </div>
        {/* Toast Container for error/success messages */}
        <ToastContainer />
      </div>
    </FormProvider>
  );
};

export default UsernamePage;
