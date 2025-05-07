"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";

export const GoogleLoginButton = () => {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      const result = await signIn("google", {
        redirect: false,
        callbackUrl: "/",
      });

      if (result?.ok) {
        router.push(result.url || "/");
      } //else {
        //console.error("Google login failed:", result?.error);
        //alert("Login failed. Please try again.");
      //}
    } catch (error) {
      console.error("Error during Google login:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="flex items-center justify-center gap-3 border px-4 py-2 w-full text-center mx-auto rounded-md hover:shadow-md"
    >
      <FcGoogle size={20} />
      Sign in with Google
    </button>
  );
};
