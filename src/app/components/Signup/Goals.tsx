"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RiAdvertisementFill } from "react-icons/ri";
import { FaYoutube } from "react-icons/fa";
import { useSelector, useDispatch } from 'react-redux'
import { setfield } from "@/src/store/slices/userSlice";
import Progressbar from "../UI/Progressbar";


const GoalSelection: React.FC = () => {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const isReadyToContinue =
    selectedGoals.length > 0 && selectedCategories.length > 0;
  const router = useRouter();
  const dispatch = useDispatch();
useEffect(() => {
  console.log("goals >>>", selectedGoals)
}, [selectedGoals])
  const goals = [
    { id: "digital", label: "Digital Products", icon: "📱" },
    { id: "coaching", label: "Coaching Sessions", icon: "🗓️" },
    { id: "online", label: "Online Courses", icon: "🎓" },
    { id: "physical", label: "Physical Products", icon: "📦" },
    { id: "temeplates", label: "Templates", icon: "🎨" },
    { id: "subscription", label: "Subscription", icon: "📝" },
  ];

  const categories = [
    { id: "photo", label: "Photo & Video", icon: "📸" },
    { id: "fashion", label: "Beauty & Fashion", icon: "💄" },
    { id: "arts", label: "Design & Arts", icon: "🎨" },
    { id: "education", label: "Education", icon: "📚" },
    { id: "health", label: "Fitness & Health", icon: "💪" },
    { id: "business", label: "Business", icon: "💼" },
    { id: "gaming", label: "Gaming", icon: "🎮" },
    { id: "liefstyle", label: "Lifestyle", icon: "✨" },
    { id: "other", label: "Other", icon: "🌟" },
  ];

  const toggleGoalSelection = (goal: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };
  // const dispatch = useDispatch();


  const toggleCategorySelection = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleContinue = () => {
    dispatch(setfield({name: "categories", value: selectedCategories}))
    dispatch(setfield({name: "liketosell", value: selectedGoals}))
    router.push("/profile-setup");
  };
// useEffect(() => {
//   console.log("selected goals value >>>", selectedGoalLabels )
// })
  return (
    <div className="max-w-2xl mx-auto py-12 px-14 min-h-screen">
      <Progressbar percentage={50} />
      <h2 className="text-2xl font-semibold mb-4 mt-0">
        What would you like to sell?
      </h2>
      <p className=" text-gray-600 mb-4">Select all that apply</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className={`flex py-5 px-2 border rounded-lg cursor-pointer 
            ${
              selectedGoals.includes(goal.id)
                ? "border-black border-2"
                : "border-gray-300"
            } 
            bg-white transition-colors hover:bg-gray-100`}
            onClick={() => toggleGoalSelection(goal.id)}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{goal.icon}</span>
              <span className="text-lg">{goal.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-2xl mx-auto py-12 px-1 ">
        <h2 className="text-2xl font-semibold mb-4 mt-0">
            Which categories do you create content in
        </h2>
        <p className=" text-gray-600 mb-4">
          Your answer will help us personalize your experience. Select all that
          apply
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`flex px-2 py-5 border rounded-lg cursor-pointer 
                ${selectedCategories.includes(category.id) ? "border-black border-2" : "border-gray-300"}
                 bg-white transition-colors hover:bg-gray-100`}
                 onClick={() => toggleCategorySelection(category.id)}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{category.icon}</span>
                <span className="text-lg">{category.label}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
        <button
          className={`w-xl py-2 rounded-lg text-white font-semibold transition-colors ${
            isReadyToContinue
              ? "bg-teal-500 hover:bg-teal-700"
              : "bg-gray-300 cursor-not-allowed"
          }`}
          disabled={!isReadyToContinue}
          onClick={handleContinue}
        >
          Continue
        </button>
      </div>
      </div>
      
    </div>
  );
};

export default GoalSelection;
