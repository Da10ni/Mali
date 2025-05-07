"use client";

import { Rainbow } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FiChevronDown } from "react-icons/fi";

interface ProfileThemePickerProps {
  setBgColor: (color: string) => void;
  setTextColor: (color: string) => void;
}

const ProfileThemePicker: React.FC<ProfileThemePickerProps> = ({
  setBgColor,
  setTextColor,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (showDropdown && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.right - 220, 
      });
    }
  }, [showDropdown]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("profileTheme");
    if (savedTheme) {
      try {
        const theme = JSON.parse(savedTheme);
        if (theme.bgColor) setBgColor(theme.bgColor);
        if (theme.textColor) setTextColor(theme.textColor);
      } catch (err) {
        console.error("Error parsing theme from localStorage:", err);
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('.theme-dropdown')
      ) {
        setShowDropdown(false);
      }
    };
    
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleBgColorChange = (color: string) => {
    setBgColor(color);
    
    const savedTheme = localStorage.getItem("profileTheme");
    let themeObj = { bgColor: color, textColor: "" };
    
    if (savedTheme) {
      try {
        const currentTheme = JSON.parse(savedTheme);
        themeObj = { ...currentTheme, bgColor: color };
      } catch (err) {
        console.error("Error parsing existing theme:", err);
      }
    }
    
    localStorage.setItem("profileTheme", JSON.stringify(themeObj));
  };

  const handleTextColorChange = (color: string) => {
    setTextColor(color);
    
    const savedTheme = localStorage.getItem("profileTheme");
    let themeObj = { bgColor: "", textColor: color };
    
    if (savedTheme) {
      try {
        const currentTheme = JSON.parse(savedTheme);
        themeObj = { ...currentTheme, textColor: color };
      } catch (err) {
        console.error("Error parsing existing theme:", err);
      }
    }
    
    localStorage.setItem("profileTheme", JSON.stringify(themeObj));
  };

  const Dropdown = () => (
    <div 
      className="theme-dropdown fixed bg-white border shadow-lg rounded-md p-3 w-[220px]" 
      style={{ 
        top: `${dropdownPosition.top}px`, 
        left: `${dropdownPosition.left}px`,
        zIndex: 9999
      }}
    >
      <div className="mb-2">
        <p className="text-xs font-semibold mb-1">Background</p>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => handleBgColorChange("bg-blue-100")} className="w-6 h-6 rounded-full bg-blue-100 border border-gray-500" />
          <button onClick={() => handleBgColorChange("bg-yellow-100")} className="w-6 h-6 rounded-full bg-yellow-100 border border-gray-500" />
          <button onClick={() => handleBgColorChange("bg-red-100")} className="w-6 h-6 rounded-full bg-red-100 border border-gray-500" />
          <button onClick={() => handleBgColorChange("bg-green-100")} className="w-6 h-6 rounded-full bg-green-100 border border-gray-500" />
          <button onClick={() => handleBgColorChange("bg-gray-200")} className="w-6 h-6 rounded-full bg-gray-200 border border-gray-500" />
          <button onClick={() => handleBgColorChange("bg-black")} className="w-6 h-6 rounded-full bg-black border border-gray-500"/>
          <button onClick={() => handleBgColorChange("bg-white")} className="w-6 h-6 rounded-full bg-white border border-gray-500" />
          <button onClick={() => handleBgColorChange("bg-blue-900")} className="w-6 h-6 rounded-full bg-blue-900 border border-gray-500" />
          <button onClick={() => handleBgColorChange("bg-green-800")} className="w-6 h-6 rounded-full bg-green-800 border border-gray-500" />
          <button onClick={() => handleBgColorChange("bg-pink-800")} className="w-6 h-6 rounded-full bg-pink-800 border border-gray-500" />
          <button onClick={() => handleBgColorChange("bg-yellow-600")} className="w-6 h-6 rounded-full bg-yellow-600 border border-gray-500" />
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold mb-1">Text</p>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => handleTextColorChange("text-green-800")} className="w-6 h-6 rounded-full bg-green-800" />
          <button onClick={() => handleTextColorChange("text-pink-800")} className="w-6 h-6 rounded-full bg-pink-800" />
          <button onClick={() => handleTextColorChange("text-gray-700")} className="w-6 h-6 rounded-full bg-gray-700" />
          <button onClick={() => handleTextColorChange("text-blue-800")} className="w-6 h-6 rounded-full bg-blue-800" />
          <button onClick={() => handleTextColorChange("text-purple-800")} className="w-6 h-6 rounded-full bg-purple-800" />
          <button onClick={() => handleTextColorChange("text-white")} className="w-6 h-6 rounded-full bg-white" />
          <button onClick={() => handleTextColorChange("text-black")} className="w-6 h-6 rounded-full bg-black" />
          <button onClick={() => handleTextColorChange("text-gray-100")} className="w-6 h-6 rounded-full border border-gray-500 bg-gray-100" />
          <button onClick={() => handleTextColorChange("text-yellow-100")} className="w-6 h-6 rounded-full border border-gray-500 bg-yellow-100" />
          <button onClick={() => handleTextColorChange("text-red-100")} className="w-6 h-6 rounded-full border border-gray-500 bg-red-100" />
          <button onClick={() => handleTextColorChange("text-blue-100")} className="w-6 h-6 rounded-full border border-gray-500 bg-blue-100" />
        </div>
      </div>

      <div className="mt-2 text-right">
        <button
          onClick={() => setShowDropdown(false)}
          className="text-xs text-gray-500 hover:text-gray-800"
        >
          Close
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        ref={buttonRef}
        className="flex items-center px-3 py-2 bg-white border text-sm rounded-md shadow-sm hover:bg-gray-100"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <Image alt="" width={20} height={20} src="/assets/colors.png" />
        Theme
      </button>

      {mounted && showDropdown && createPortal(
        <Dropdown />,
        document.body
      )}
    </>
  );
};

export default ProfileThemePicker;