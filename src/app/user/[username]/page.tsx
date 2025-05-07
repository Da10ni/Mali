"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import ProfileCard from "../../components/Links/ProfilePreview";
import { fetchProfile } from "../../../utils/api";

export default function UserProfile() {
  const params = useParams();
  const username = params.username as string;

  const [addedProducts, setAddedProducts] = useState<any[]>([]);
  const [addedLinks, setAddedLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cardBgColor, setCardBgColor] = useState<string>("bg-gray-200");
  const [cardTextColor, setCardTextColor] = useState<string>("text-gray-700");

  useEffect(() => {
    const loadProfileData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Attempt to fetch profile from API
        const profile = await fetchProfile(username);

        // Set products
        if (profile.products) {
          setAddedProducts(profile.products);
        }

        // Set links
        if (profile.links) {
          setAddedLinks(profile.links);
        }

        // Set theme
        if (profile.theme) {
          if (profile.theme.bgColor) setCardBgColor(profile.theme.bgColor);
          if (profile.theme.textColor)
            setCardTextColor(profile.theme.textColor);
        }

        setLoading(false);
      } catch (apiError) {
        console.error("API fetch failed:", apiError);

        console.log("Falling back to localStorage...");
        try {
          const savedProducts = localStorage.getItem("addedProducts");
          if (savedProducts) {
            const parsed = JSON.parse(savedProducts);
            setAddedProducts(Array.isArray(parsed) ? parsed : []);
          }

          const savedLinks = localStorage.getItem("addedLinks");
          if (savedLinks) {
            const parsed = JSON.parse(savedLinks);
            setAddedLinks(Array.isArray(parsed) ? parsed : []);
          }

          const savedTheme = localStorage.getItem("profileTheme");
          if (savedTheme) {
            const theme = JSON.parse(savedTheme);
            if (theme.bgColor) setCardBgColor(theme.bgColor);
            if (theme.textColor) setCardTextColor(theme.textColor);
          }

          setLoading(false);
        } catch (localError) {
          console.error("Error loading from localStorage:", localError);
          setError("Failed to load profile data");
          setLoading(false);
        }
      }
    };

    loadProfileData();
  }, [username]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-50 p-6 rounded-lg border border-red-200">
          <h2 className="text-red-800 text-lg font-medium">Error</h2>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  // If no products or links, show message
  if (addedProducts.length === 0 && addedLinks.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">{username}'s Profile</h1>
        </div>

        <div className="flex justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p>This profile has no content yet.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold">{username}'s Profile</h1>
        <p className="text-gray-600 mt-2">
          Check out my products and links below
        </p>
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-md p-6 items-center justify flex flex-col pt-2 absolute mt-[18%] z-30 transform -translate-y-1/2">
          <ProfileCard
            productData={undefined}
            productList={addedProducts}
            linkData={addedLinks}
            bgColor={cardBgColor}
            textColor={cardTextColor}
          />
        </div>
      </div>
    </div>
  );
}
