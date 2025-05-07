"use client";
import React, { useState, useEffect } from "react";
import { FiShare2, FiSettings } from "react-icons/fi";
import { useSession } from "next-auth/react";
import { Share } from "lucide-react";

interface HeaderProps {
  title: string;
  centerContent?: React.ReactNode;
  rightContent?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  title,
  centerContent,
  rightContent,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const { data: session } = useSession();
  const [userDetails, setUserDetails] = useState<{
    username: string;
    email: string;
  }>({
    username: "Guest",
    email: "guest@example.com",
  });

  useEffect(() => {
    if (session?.user?.email) {
      setUserDetails({
        email: session.user.email,
        username: session.user.name || "No username",
      });
    } else {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          if (!payload.exp || Date.now() < payload.exp * 1000) {
            setUserDetails({
              email: payload.email || "No email",
              username: payload.username || "No username",
            });
          }
        } catch (err) {
          console.error("Error decoding token", err);
        }
      }
    }
  }, [session]);

  useEffect(() => {
    if (userDetails.username && userDetails.username !== "Guest" && userDetails.username !== "No username") {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      
      const url = `${baseUrl}/user/${userDetails.username}`;
      console.log("Generated share URL:", url);
      
      setShareUrl(url);
    }
  }, [userDetails]);

const handleOpenLink = () => {
  console.log("Opening URL:", shareUrl);
  window.open(shareUrl, "_blank");
};

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleCloseModal = () => setIsModalOpen(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); 
  };

  return (
    <header className="bg-gray-100  px-6 py-3 flex items-center justify-between drop-shadow-sm">
      {/* Left */}
      <div className="text-3xl font-semibold text-gray-800">{title}</div>

      {/* Center */}
      <div className="flex items-center gap-4">{centerContent}</div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {rightContent}
        <button
          onClick={toggleModal}
          className="flex items-center gap-1 px-3 py-2 bg-white text-sm font-medium rounded-md shadow-sm border hover:bg-gray-100"
        >
          {/* <FiShare2 size={16} /> */}
          <Share size={18} />
          Share
        </button>
        <button className="w-[60px] h-10 rounded-md bg-white border flex items-center justify-center hover:bg-gray-100">
          <FiSettings size={18} />
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-brightness-75 backdrop-blur-sm bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Share your Linktree</h2>
              <button 
                onClick={toggleModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="border rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" fill="#43E660"/>
                    <circle cx="12" cy="12" r="4" fill="white"/>
                  </svg>
                </div>
                <span className="text-gray-800 truncate max-h-full max-w-[300px]">{shareUrl}</span>
              </div>
              <button 
                onClick={handleCopy} 
                className="text-gray-800 font-medium hover:text-blue-600 ml-2"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="mt-4 flex justify-end">
              <button 
                onClick={handleOpenLink} 
                className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600"
              >
                Open Link
              </button>
              <button 
                onClick={handleCloseModal} 
                className="ml-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
