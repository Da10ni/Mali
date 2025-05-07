"use client";

import React, { useState } from 'react';
import {  FaDollarSign, FaShoppingCart, FaMusic, FaEnvelope } from 'react-icons/fa';
import { RiAdvertisementFill } from 'react-icons/ri';
import { useRouter } from 'next/navigation';

const EarnMoneySelection: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const router = useRouter();

  const categories = [
    { id: 'affiliate', label: 'Affiliate', icon: <RiAdvertisementFill size={20} /> },
    { id: 'content', label: 'Content', icon: <FaEnvelope size={20} /> },
    { id: 'ecommerce', label: 'E-commerce', icon: <FaShoppingCart size={20} /> },
    { id: 'experiences', label: 'Experiences', icon: <FaMusic size={20} /> },
    { id: 'food', label: 'Food & Beverage', icon: <FaMusic size={20} /> },
    { id: 'retail', label: 'Retail', icon: <FaShoppingCart size={20} /> },
    { id: 'services', label: 'Services', icon: <FaDollarSign size={20} /> },
    { id: 'streams', label: 'Streams', icon: <FaMusic size={20} /> },
    { id: 'tips', label: 'Tips', icon: <FaDollarSign size={20} /> },
    { id: 'youtube', label: 'YouTube', icon: <FaMusic size={20} /> }
  ];

  const toggleCategorySelection = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleContinue = () => {
    router.push('/avatar');
  };

  return (
    <div className="max-w-lg mt-20 mx-auto py-17 px-5 min-w-[900px] bg-gray-100 border border-gray-300 rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold text-center mb-6">How would you like to earn money?</h2>
      <p className="text-center text-gray-600 mb-6">Your answer will help us personalize your experience. Select all that apply</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className={`flex items-center justify-center px-1 p-4 border rounded-lg cursor-pointer ${selectedCategories.includes(category.id) ? 'bg-blue-100' : 'bg-white'} transition-colors hover:bg-gray-100`}
            onClick={() => toggleCategorySelection(category.id)}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{category.icon}</span>
              <span className="text-lg">{category.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <button
          className={`px-17 py-2 rounded-lg text-white font-semibold transition-colors ${selectedCategories.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-teal-500 hover:bg-teal-700'}`}
          disabled={selectedCategories.length === 0} onClick={handleContinue}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default EarnMoneySelection;
