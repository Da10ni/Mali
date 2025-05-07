"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface AddLinkComponentProps {
  onClose: () => void;
  onAddLink: (link: any) => void;
  editingLink?: any;
  isEditing?: boolean;
}

const AddLinkComponent: React.FC<AddLinkComponentProps> = ({ 
  onClose, 
  onAddLink, 
  editingLink, 
  isEditing = false 
}) => {
  const [searchTerm, setSearchTerm] = useState(''); 
  const [newTerm, setNewTerm] = useState('');

  useEffect(() => {
    if (isEditing && editingLink) {
      setSearchTerm(editingLink.url || '');
      setNewTerm(editingLink.name || '');
    }
  }, [isEditing, editingLink]);

  const handleSubmit = () => {
    if (searchTerm && newTerm) {
      const newLink = {
        name: newTerm,
        url: searchTerm, 
        image: 'https://placekitten.com/200/200', 
        price: editingLink?.price || '$0', 
      };

      onAddLink(newLink);
      onClose(); 
    }
  };

  return (
    <div className="fixed inset-0 backdrop-brightness-75 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-[400px] max-w-[90%]">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">
            {isEditing ? 'Edit Link' : 'Enter URL or Browse Apps'}
          </h3>
          <button onClick={onClose} className="text-xl">&times;</button>
        </div>

        <div className="mt-4">
          <input
            type="text"
            placeholder="Enter URL or App"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border w-full p-3 rounded-md mb-4"
          />
        </div>

        <div className="mt-4">
          <input
            type="text"
            placeholder="Enter Name"
            value={newTerm}
            onChange={(e) => setNewTerm(e.target.value)}
            className="border w-full p-3 rounded-md mb-4"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full  bg-purple-600 text-white py-3 rounded-md mt-2"
        >
          {isEditing ? 'Update Link' : 'Add Link'}
        </button>

        {!isEditing && (
          <div className="mt-4">
            <p className="text-sm text-gray-500">Inspired by your interests</p>
            <div className="grid grid-cols-3 justify-center ml-12 gap-2 mt-2">
              <button className="">
                <Image src="/assets/Instagram.png" alt="Instagram" width={35} height={35} /></button>
              <button className="">
                <Image src="/assets/Facebook.png" alt="Facebook" width={35} height={35} /></button>
              <button className="">
                <Image src="/assets/Youtube.png" alt="Youtube" width={35} height={45} /></button>
              <button className="">
                <Image src="/assets/google.webp" alt="Google" width={35} height={35} />
              </button>
              <button className="">
                <Image src="/assets/Tiktok.png" alt="Tiktok" width={35} height={35} />
              </button>
              <button className="">
                <Image src="/assets/Linkedin.png" alt="Linkedin" width={35} height={35} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddLinkComponent;