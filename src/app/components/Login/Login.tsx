"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaEye, FaEyeSlash, FaInstagram } from "react-icons/fa";
import { TbPointFilled } from "react-icons/tb";
import { loginUser } from "../../../services/Auth";
import { useForm, FormProvider } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import Textinput from "../UI/Textinput"; // Assume this is a styled input component
import Buttons from "../UI/Buttons";
import { GoogleLoginButton } from "../UI/Googleloginbutton";
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from "@/src/store/store";

interface LoginData {
  email?: string;
  username?: string;
  password?: string;
}

const Login: React.FC = () => {
  const [isUsernameLogin, setIsUsernameLogin] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [isPasswordLogin, setIsPasswordLogin] = useState<boolean>(false); // Initially false = "Continue with Password" showing
  const methods = useForm<LoginData>();
  const router = useRouter();

  const selector = useSelector((state: RootState) => state.mobilePreview);
  useEffect(() => {
    console.log("redux value >>", selector)
  })

  const onSubmit = async (data: LoginData) => {
    const { username, email, password } = data;

    try {
      const login = await loginUser({ username, email, password });
      console.log("email", login);
      if (login?.data?.token) {
        toast.success("Login successful!");
        router.push("/myadmin");
      }
    } catch (error: any) {
      console.log(error);
      toast.error(`Error: ${error.message}`);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleToggleLoginMethod = () => {
    // If switching from password to email login, make sure we're in email mode
    if (isPasswordLogin) {
      setIsUsernameLogin(false); // Force email mode when going from password to email
    }
    setIsPasswordLogin(!isPasswordLogin);
  };

  return (
    <FormProvider {...methods}>
      <div className="flex min-h-screen">
        <div className="flex items-center pb-[15%] ml-50 justify-center min-h-screen bg-white">
          <div className="bg-white p-8 rounded-lg w-110 h-[500px]">
            <h2 className="text-5xl font-bold text-center text-[#04c4ac] mb-3">
              Welcome back!
            </h2>
            <p className="text-x font-normal text-center mb-6">
              Log in to your Mali*
            </p>

            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              {/* Email or Username input (based on toggle) */}
              <div className="mb-6">
                <p className="font-semibold ml-1">
                  {isUsernameLogin ? "Username" : "Email"}
                </p>
                <Textinput
                  name={isUsernameLogin ? "username" : "email"}
                  type="text"
                  className=""
                  placeholder={`Enter your ${
                    isUsernameLogin ? "username" : "email"
                  }`}
                  required={true}
                />
              </div>

              {/* Continue Button (Email sends magic link, Username goes to password login) */}
              {!isPasswordLogin && (
                <>
                  {isUsernameLogin ? (
                    <button
                      type="button"
                      onClick={() => setIsPasswordLogin(true)}
                      className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 shadow-md"
                    >
                      Continue with Username
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={async () => {
                        const email = methods.getValues("email");
                        if (!email)
                          return toast.error("Please enter your email");

                        try {
                          const res = await fetch("/api/auth/magiclink", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ email }),
                          });

                          const data = await res.json();
                          if (res.ok) {
                            toast.success(data.message || "Magic link sent!");
                          } else {
                            toast.error(data.message || "Failed to send link");
                          }
                        } catch (err) {
                          toast.error("Something went wrong.");
                          console.error(err);
                        }
                      }}
                      className="w-full bg-[#04c4ac] text-white py-3 rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 shadow-md"
                    >
                      {isPasswordLogin ? "Login" : "Continue"}
                    </button>
                  )}
                </>
              )}

              {/* Password Field + Login Button */}
              {isPasswordLogin && (
                <>
                  <div className="mb-6 relative">
                    <p className="font-semibold ml-1">Password</p>
                    <Textinput
                      name="password"
                      className=""
                      type={passwordVisible ? "text" : "password"}
                      placeholder="Enter your password"
                      required={true}
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-12 text-gray-600"
                      onClick={togglePasswordVisibility}
                    >
                      {passwordVisible ? <FaEye /> : <FaEyeSlash />}
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#04c4ac] text-white py-3 rounded-md hover:bg-[#039e8b] focus:outline-none focus:ring-2 shadow-md"
                  >
                    Login
                  </button>
                </>
              )}
            </form>

            <div className="flex items-center justify-center p-3">
              <span className="text-gray-500">OR</span>
            </div>

            <Buttons
            islogin={true }
              handleContinuePassword={handleToggleLoginMethod}
              isPasswordLogin={isPasswordLogin}
            />
            {/* <GoogleLoginButton/> */}

            <p className="text-center text-sm mt-4 text-gray-800">
              Don't have an account?{" "}
              <Link href="/signup" className="text-[#04c4ac]">
                Register!
              </Link>
            </p>

            <div className="flex items-center pb-7 justify-center gap-3 text-sm mt-4 text-gray-800">
              <Link href="/forgotpassword" className="text-[#04c4ac]">
                Forgot Password
              </Link>
              <TbPointFilled size={12} className="text-gray-600" />
              <button
                type="button"
                className="text-[#04c4ac]"
                onClick={() => {
                  const newIsUsernameLogin = !isUsernameLogin;
                  setIsUsernameLogin(newIsUsernameLogin);

                  // If switching to username mode, automatically show password field
                  if (newIsUsernameLogin) {
                    setIsPasswordLogin(true);
                  } else {
                    // When switching back to email mode, hide password field
                    setIsPasswordLogin(false);
                  }
                }}
              >
                {isUsernameLogin ? "Use Email Instead" : "Use Username Instead"}
              </button>
            </div>
          </div>
        </div>

        <div className="hidden md:flex w-1/2 relative ml-40">
          <Image
            src="/assets/images5.jpg"
            alt="Promotional"
            fill
            className="object-cover object-center"
          />
        </div>
      </div>
      <ToastContainer />
    </FormProvider>
  );
};

export default Login;

