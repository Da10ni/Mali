"use client";

import React, { useState, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { checkUsername, registerUser } from "@/src/services/Auth";
import {
  FaEnvelope,
  FaLock,
  FaPhone,
  FaUser,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Textinput from "../UI/Textinput";
import Buttons from "../UI/Buttons";
import { AtSign } from "lucide-react";
import Progressbar from "../UI/Progressbar";

const RegisterPage = () => {
  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const debounceUsernameTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [usernameExist, setUsernameExist] = useState("");
  const [isUsernameLogin, setIsUsernameLogin] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false); // Password visibility state
  const [isPasswordLogin, setIsPasswordLogin] = useState<boolean>(false);

  const [formSubmit, setFormSubmit] = useState(false);
  const router = useRouter();

  const methods = useForm();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const username = e.target.value;
    setValue("username", username);

    if (debounceUsernameTimeoutRef.current) {
      clearTimeout(debounceUsernameTimeoutRef.current);
    }

    debounceUsernameTimeoutRef.current = setTimeout(async () => {
      const res = await checkUsername({ username });
      if (res?.errormessage) {
        setUsernameExist(res.errormessage);
        setIsUsernameValid(false);
      } else {
        setUsernameExist(res.message);
        setIsUsernameValid(true);
      }
    }, 500);
  };
  const { handleSubmit, watch, setValue } = methods;

  const handleToggleLoginMethod = () => {
    if (isPasswordLogin) {
      setIsUsernameLogin(false);
    }
    setIsPasswordLogin(!isPasswordLogin);
  };

  const username = watch("username") || "guest";

  const onSubmit = async (data: any) => {
    const { username, email, password, phone, fullName } = data;
    try {
      const response = await registerUser({
        username,
        email,
        password,
        phone,
        fullName,
      });
      toast.success("Registration successful!");

      const userLink = `https://mali.store/${username}`;
      toast.info(`Your unique link is: ${userLink}`);

      router.push("/goals");
    } catch (error: any) {
      toast.error("Error: " + error.message);
    }
  };

  return (
    <FormProvider {...methods}>
      <Progressbar percentage={20} />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="min-h-screen flex items-center justify-center p-6"
      >
        <div className=" p-10 max-w-md w-full">
          <h2 className="text-5xl font-bold text-center mb-2 flex gap-2 justify-center">
            Hey <span className="text-black">@{username}</span> 👋
          </h2>
          <p className="text-center text-xl font-semibold text-gray-600 mb-6">
            Let's monetize your following!
          </p>
          <Textinput
            name="username"
            placeholder="Enter username"
            required
            type="text"
            pattern={/^[a-zA-Z0-9_]{3,16}$/}
            errorMessage="Username must be 3-16 characters, alphanumeric or _"
            onChange={handleUsernameChange}
            icon={<AtSign />}
          />
          {usernameExist && (
            <p
              className={`text-sm mb-2 ${
                isUsernameValid ? "text-green-600" : "text-red-500"
              }`}
            >
              Mali.store/{usernameExist}
            </p>
          )}

          {/* <Textinput
            name="username"
            placeholder="username"
            type="text"
            required
            icon={<FaUser />}
            validationMessage="Username is required"
          /> */}
          {/* <p className="text-sm ml-1 text-gray-500 mb-4">
            mail.store/{username}
          </p> */}

          <Buttons
            handleContinuePassword={handleToggleLoginMethod}
            isPasswordLogin={isPasswordLogin}
          />

          <div className="text-center text-gray-500 my-2 text-sm">
            OR CONTINUE WITH EMAIL
          </div>

          <Textinput
            name="fullName"
            placeholder="Full Name"
            type="text"
            required
            icon={<FaUser />}
            validationMessage="Full name is required"
          />

          <Textinput
            name="email"
            placeholder="Email"
            type="email"
            required
            icon={<FaEnvelope />}
            pattern={/^[^\s@]+@[^\s@]+\.[^\s@]+$/}
            errorMessage="Invalid email"
          />

          <Textinput
            name="phone"
            placeholder="Phone Number"
            type="tel"
            required
            icon={<FaPhone />}
          />

          {/* Password Field */}
          <div className="relative">
            <Textinput
              name="password"
              placeholder="Password"
              type={passwordVisible ? "text" : "password"}
              required
              icon={<FaLock />}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-3/5 transform -translate-y-1/2"
            >
              {passwordVisible ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-lg text-white font-semibold transition-colors bg-black hover:bg-gray-800"
          >
            Next →
          </button>

          <p className="text-center text-xs mt-3 text-gray-500">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacypolicy" className="underline">
              Privacy Policy
            </Link>
            .
          </p>

          <p className="text-center text-sm mt-4">
            Have an account?{" "}
            <Link href="/login" className="underline">
              Login
            </Link>
          </p>
        </div>
      </form>
    </FormProvider>
  );
};

export default RegisterPage;
