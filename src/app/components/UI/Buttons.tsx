"use client";

import React from "react";
import { RiMailSendLine } from "react-icons/ri";
import { GoogleLoginButton } from "./Googleloginbutton";
import { signIn } from "next-auth/react";
import { Facebook } from "lucide-react";
import Image from 'next/image';


interface ButtonsProps {
  handleContinuePassword: () => void;
  isPasswordLogin: boolean;
  islogin?: boolean;
}

const Buttons: React.FC<ButtonsProps> = ({ handleContinuePassword, isPasswordLogin, islogin }) => {
  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/" });
  };

  const handleAppleLogin = () => {
    console.log("Apple login clicked"); // You can integrate Apple auth later
  };

  return (
    <div className="space-y-3">
      {/* <button
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 py-2 rounded-md shadow hover:shadow-md transition"
      >
        <FcGoogle size={20} />
        <span className="font-medium">Login with Google</span>
      </button> */}
      <GoogleLoginButton />

      <button
        onClick={handleAppleLogin}
        className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 py-2 rounded-md shadow hover:shadow-md transition"
      >
       <Image src="/assets/Facebook.png" alt="Facebook" width={20} height={25} />
        <span className="font-medium" >Login with Facebook</span>
      </button>
{
    islogin && (

 
      <button
        onClick={handleContinuePassword}
        className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 py-2 rounded-md shadow hover:shadow-md transition"
      >
        <RiMailSendLine size={20} />
        <span className="font-medium">
          Continue with {isPasswordLogin ? "Email" : "Password"}
        </span>
      </button>
    )

      }
    </div>
  );
};

export default Buttons;
