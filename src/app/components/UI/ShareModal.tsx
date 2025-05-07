'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  isShopMain?: boolean;
}

export default function ShareModal({ isOpen, onClose, username, isShopMain = false }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const linkUrl = `${baseUrl}/${username}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(linkUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Share your Linktree</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <div className="mb-6 bg-blue-50 border border-blue-100 rounded-lg p-4">
            <div className="flex items-start">
              <div className="text-blue-500 mr-3 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              </div>
              <div>
                <p className="text-gray-800 font-medium">Users see your 'Links' tab first</p>
                <p className="text-gray-600 text-sm mt-1">
                  You can make your shop the main tab in settings by toggling 'Set Shop as main tab'.
                </p>
                <button className="text-blue-600 hover:underline text-sm mt-2">
                  Change main tab
                </button>
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center">
              <div className="mr-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="#43E660"/>
                  <circle cx="12" cy="12" r="4" fill="white"/>
                </svg>
              </div>
              <span className="text-gray-800">{linkUrl}</span>
            </div>
            <button 
              onClick={handleCopy} 
              className="text-gray-800 font-medium hover:text-blue-600"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}