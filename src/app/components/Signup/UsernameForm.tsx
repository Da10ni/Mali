// components/UsernameForm.tsx
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { checkUsername } from "@/src/services/Auth";
import Textinput from "../UI/Textinput";
import { FormProvider, useForm } from "react-hook-form";

const UsernameForm = () => {
  const methods = useForm();
  const [usernameExist, setUsernameExist] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [userflag, setUserFlag] = useState(false);
  const [isUsernameValid, setIsUsernameValid] = useState<boolean>(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const usernameVal = e.target.value;
    setUsername(usernameVal);

    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);

    debounceTimeoutRef.current = setTimeout(async () => {
      const res = await checkUsername({ username: usernameVal });
      if (res?.errormessage) {
        setUsernameExist(res.errormessage);
        setUserFlag(true);
        setIsUsernameValid(false);
      } else {
        setUsernameExist(res.message);
        setUserFlag(false);
        setIsUsernameValid(true);
      }
    }, 500);
  };

  const handleContinue = () => {
    if (isUsernameValid) router.push("/register");
  };

  return (
    <FormProvider {...methods}>
      <div className="mt-8 w-full max-w-md bg-[#04c4ac]">
        <Textinput
          name="username"
          type="text"
          placeholder="Enter your username"
          required
          className=""
          //className="w-full bg-white p-3"
          onChange={handleUsernameChange}
        />

        <p
          className={`mt-2 text-sm ${
            isUsernameValid ? "text-gray-800" : "text-red-400"
          }`}
        >
          {usernameExist}
        </p>

        <button
          onClick={handleContinue}
          className={`mt-4 w-full py-2 rounded-md text-white ${
            isUsernameValid ? "bg-[#035a50]" : "bg-gray-400"
          }`}
          disabled={!isUsernameValid}
        >
          Continue
        </button>
      </div>
    </FormProvider>
  );
};

export default UsernameForm;
