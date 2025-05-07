"use client";

import { setValue } from "@/src/store/slices/mobilePreviewslice";
import { setfield } from "@/src/store/slices/userSlice";
import React, { ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import { useSelector, useDispatch } from 'react-redux'


interface TextInput {
  name: string;
  placeholder: string;
  required?: boolean;
  type: string;
  pattern?: RegExp;
  errorMessage?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  validationMessage?: string;
  validate?: (value: string) => boolean | string; // Accept custom validate function
  icon?: ReactNode; // ✅ Icon prop added (can be a React icon component)

}

const Textinput = ({
  name,
  placeholder,
  required = false,
  type,
  className = "",
  pattern,
  errorMessage,
  onChange,
  validationMessage = "This field is required",
  validate,
  icon = ""
}: TextInput) => {
  const {
    register,
    formState: { errors },
    getValues, // Get the values of the form
  } = useFormContext();

  const dispatch = useDispatch();
  return (
    <div className="mb-4 relative">
      <input
        {...register(name, {
          required: required ? validationMessage : false,
          pattern: pattern ? { value: pattern, message: errorMessage || "Invalid format" } : undefined,
          validate: validate, // Apply custom validation like password match
          onChange: (event) => {
            onChange && onChange(event);
            dispatch(setValue({ name: name, value: event.target.value }));
          }
          
        })}
        
        type={type}
        placeholder={placeholder}
        className={`w-full mt-2 p-2  ${icon && 'px-10'} border bg-white border-gray-300 rounded-md focus:outline-none focus:border-gray-600 ${className}`}
      />
      <span className="absolute left-3 w-7 top-5 text-gray-400">{icon}</span>
      {errors[name] && (
        <p className="text-red-500 text-sm mt-1">{(errors[name] as any).message}</p>
      )}
    </div>
  );
};

export default Textinput;