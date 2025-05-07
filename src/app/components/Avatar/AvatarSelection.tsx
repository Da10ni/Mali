"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const AvatarSelection: React.FC = () => {
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [bio, setBio] = useState<string>(''); // State to store bio
  const router = useRouter();

  const avatars = [
    { id: 'avatar1', label: 'Avatar 1', image: '/assets/avatar/avatar1.png' },
    { id: 'avatar2', label: 'Avatar 2', image: '/assets/avatar/avatar2.jpg' },
    { id: 'avatar3', label: 'Avatar 3', image: '/assets/avatar/avatar3.jpg' },
    { id: 'avatar4', label: 'Avatar 4', image: '/assets/avatar/avatar4.jpg' },
    { id: 'avatar5', label: 'Avatar 5', image: '/assets/avatar/avatar5.webp' },
    { id: 'avatar6', label: 'Avatar 6', image: '/assets/avatar/avatar6.png' }
  ];

  const handleAvatarSelection = (avatarId: string) => {
    setSelectedAvatar(avatarId);
    localStorage.setItem("selectedAvatar", avatarId); 
  };

  const handleBioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBio(event.target.value);
  };

  const handleSignIn = () => {
    if (selectedAvatar) {
      router.push('/'); // Redirect after selecting avatar and bio
    }
  };

  return (
    <div className="max-w-lg mt-13 mx-auto py-8 px-4 bg-gray-100 border border-gray-300 rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold text-center mb-6">Select your Avatar</h2>

      {/* Avatar Preview */}
      {selectedAvatar && (
        <div className="text-center mb-4">
          <h3 className="text-lg font-medium mb-2">Selected Avatar:</h3>
          <img
            src={avatars.find((avatar) => avatar.id === selectedAvatar)?.image}
            alt="Selected Avatar"
            className="w-16 h-16 rounded-full mx-auto object-cover"
          />
        </div>
      )}

      <div className="grid grid-cols-3 ml-2 justify-center gap-4">
        {avatars.map((avatar) => (
          <div
            key={avatar.id}
            className={`cursor-pointer justify-center items-center px-9 py-2 border rounded ${selectedAvatar === avatar.id ? 'border-blue-500' : 'border-gray-300'} transition-colors hover:scale-105`}
            onClick={() => handleAvatarSelection(avatar.id)}
          >
            <img
              src={avatar.image}
              alt={avatar.label}
              className={`w-16 h-16 rounded-full object-cover ${selectedAvatar === avatar.id ? 'ring-4 ring-blue-500' : ''}`}
            />
          </div>
        ))}
      </div>

      {/* Bio Input */}
      <div className="mt-6 mb-4">
        <label htmlFor="bio" className="block text-lg font-semibold text-gray-800">Your Bio</label>
        <input
          type="text"
          id="bio"
          value={bio}
          onChange={handleBioChange}
          className="w-full mt-2 p-3 border rounded-md bg-white text-gray-700"
          placeholder="Tell us a little about yourself..."
        />
      </div>

      <div className="mt-6 text-center">
        <button
          className={`px-6 py-2 rounded-lg text-white font-semibold transition-colors ${selectedAvatar ? 'bg-teal-500 hover:bg-teal-700' : 'bg-gray-300 cursor-not-allowed'}`}
          onClick={handleSignIn}
          disabled={!selectedAvatar} 
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default AvatarSelection;
