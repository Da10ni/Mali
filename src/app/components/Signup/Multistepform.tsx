"use client";

import React, { useRef, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Eye, EyeOff, Check } from "lucide-react";
import Textinput from "../UI/Textinput";
import { checkUsername, registerUser } from "@/src/services/Auth";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
//import Swal from 'sweetalert2'

const MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [usernameExist, setUsernameExist] = useState("");
  const [formSubmit, setFormSubmit] = useState(false);
  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const debounceUsernameTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const methods = useForm({ mode: "onChange" });
  const { handleSubmit, setValue, getValues, trigger } = methods;

  const steps = [
    { name: "Username" },
    { name: "Email" },
    { name: "Password" },
    { name: "Complete" },
  ];

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

  const handleNext = async () => {
    let isStepValid = false;

    // Trigger the validation for the step
    isStepValid = await trigger(
      currentStep === 0
        ? "username"
        : currentStep === 1
        ? "email"
        : ["password", "confirmPassword"]
    );

    if (currentStep === 0 && !isUsernameValid) {
      toast.error("Username is not valid");
      return;
    }

    if (isStepValid) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => setCurrentStep((prev) => Math.max(0, prev - 1));

  const onSubmit = async (data: any) => {
    const { username, email, password, confirmPassword } = data;

    try {
      if (formSubmit) {
        const response = await registerUser({
          username,
          email,
          password,
          phone: undefined,
          fullName: "",
        });
        // toast.success("Registration successful!");
        /*Swal.fire({
          title: "Email Sent!",
          text: "Check your inbox to verify the email!",
          icon: "success"
        }).then(() => {
          // After the alert is closed, navigate to the desired page
          router.push('/login'); // Change '/login' to the route you want to navigate to
        });*/
      }
      router.push("/login");
    } catch (error: any) {
      toast.error("Error: " + error.message);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <h2 className="text-2xl font-semibold mb-6 text-teal-500">
              Create Account
            </h2>
            <Textinput
              name="username"
              placeholder="Enter username"
              required
              type="text"
              pattern={/^[a-zA-Z0-9_]{3,16}$/}
              errorMessage="Username must be 3-16 characters, alphanumeric or _"
              onChange={handleUsernameChange}
            />
            {usernameExist && (
              <p
                className={`text-sm mt-1 ${
                  isUsernameValid ? "text-green-600" : "text-red-500"
                }`}
              >
                {usernameExist}
              </p>
            )}
          </>
        );
      case 1:
        return (
          <>
            <h2 className="text-2xl font-semibold mb-6 text-teal-500">
              Email Address
            </h2>
            <Textinput
              name="email"
              placeholder="Enter email"
              required
              type="email"
              pattern={/^[^\s@]+@[^\s@]+\.[^\s@]+$/}
              errorMessage="Invalid email format"
            />
          </>
        );
      case 2:
        return (
          <>
            <h2 className="text-2xl font-semibold mb-6 text-teal-500">
              Create Password
            </h2>
            <div className="relative">
              <Textinput
                name="password"
                placeholder="Enter password"
                required
                type={showPassword ? "text" : "password"}
                errorMessage="Min 6 characters, at least one letter and one number"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-6 right-3"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="relative">
              <Textinput
                name="confirmPassword"
                placeholder="Confirm password"
                required
                type={showConfirmPassword ? "text" : "password"}
                validate={(value: string) =>
                  value === getValues("password") || "Passwords do not match"
                }
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-6 right-3"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </>
        );
      case 3:
        return (
          <div className="text-center">
            <Check size={48} className="text-green-500 mx-auto mb-4" />
            <p className="text-xl font-medium">All steps completed!</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-4xl mx-auto p-16 bg-white rounded-lg mt-24 shadow-lg"
      >
        <div className="mb-12 px-8">
          <div className="flex items-start mb-8">
            {steps.map((step, i) => (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center z-10">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
                      i <= currentStep
                        ? "bg-[#04c4ac] text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    <Check size={18} />
                  </div>
                  <span className="text-sm mt-2 font-medium whitespace-nowrap">
                    {step.name}
                  </span>
                </div>

                {i < steps.length - 1 && (
                  <div className="flex-1 flex mt-5 mx-3">
                    <div
                      className={`h-1 w-full ${
                        i < currentStep ? "bg-teal-500" : "bg-gray-300"
                      } transition-colors duration-300`}
                    ></div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="mb-8">{renderStepContent()}</div>

        <div className="flex justify-between">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={handlePrevious}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded"
            >
              Previous
            </button>
          )}
          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="ml-auto px-6 py-2 bg-teal-500 text-white rounded"
            >
              Next
            </button>
          ) : (
            <button
              onClick={() => setFormSubmit(true)}
              type="submit"
              className="ml-auto px-6 py-2 bg-green-600 text-white rounded"
            >
              Submit
            </button>
          )}
        </div>
      </form>
    </FormProvider>
  );
};

export default MultiStepForm;
