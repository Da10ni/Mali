"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import { toast } from "react-toastify";
import { getUserProfile, updateEmail, updateUsername } from "@/src/services/Auth";
import { useSession, signOut } from "next-auth/react";
import { useSelector, useDispatch } from 'react-redux'
import { setfield } from "@/src/store/slices/userSlice";


interface JWTPayload {
  email?: string;
  username?: string;
  exp?: number;
  [key: string]: any;
}

const Profile: React.FC = () => {
  const router = useRouter();
  const [editEmail, setEditEmail] = useState(false);
  const [editUsername, setEditUsername] = useState(false);
  const [editAvatar, setEditAvatar] = useState(false);
  const [editBio, setEditBio] = useState(false);
  const [Profile, setProfile] = useState<{
    profilepicture: string;
    username: string;
    bio: string;
    email: string;
  }>({
    profilepicture: "",
    username: "",
    bio: "",
    email: "",
  });  const [bio, setBio] = useState<string>("")
  const dispatch = useDispatch()

  const [userDetails, setUserDetails] = useState<{
    email: string;
    username: string;
    avatar: string;
  }>({
    email: "",
    username: "",
    avatar: "/assets/avatar/avatar1.png",
  });
  const { data: session, update: updateSession } = useSession();
  const [isGoogleAuth, setIsGoogleAuth] = useState(false);

    const handleProfile = async () => {
      const getProfile = await getUserProfile()
      setProfile(getProfile)
      dispatch(setfield({name: "profilePicture", value: getProfile.profilepicture}))
      dispatch(setfield({name: "email", value: getProfile.email}))
      dispatch(setfield({name: "username", value: getProfile.username}))
      
      console.log("User Profile Got  >>>", getProfile)
    }

  useEffect(() => {
    
    handleProfile();
     
    if (session?.user?.email) {
      setUserDetails({
        email: session.user.email,
        username: session.user.name || "No username",
        avatar: session.user.image || "/assets/avatar/avatar1.png",
      });
      setIsGoogleAuth(true);
      return;
    }

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1])) as JWTPayload;

        if (!payload.exp || Date.now() < payload.exp * 1000) {
          // const storedAvatar =
          //   localStorage.getItem("selectedAvatar") ||
          //   "/assets/avatar/avatar1.png";
          // setUserDetails({
          //   email: payload.email ?? "No email",
          //   username: payload.username ?? "No username",
          //   avatar: storedAvatar,
          // });
          setIsGoogleAuth(false);
        } else {
          localStorage.removeItem("token");
        }
      } catch (err) {
        console.error("Invalid token");
        localStorage.removeItem("token");
      }
    } else if (!session) {
    }

    const savedBio = localStorage.getItem("userBio");
    if (savedBio) {
      setBio(savedBio);
    }
  }, [session, router]);

  const handleUpdateUsername = async () => {
    try {
      if (isGoogleAuth) {
        await updateSession({
          ...session,
          user: {
            ...session?.user,
            name: userDetails.username,
          },
        });
      } else {
        await updateUsername(userDetails.username);

        const token = localStorage.getItem("token");
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split(".")[1])) as JWTPayload;
            payload.username = userDetails.username;

            sessionStorage.setItem(
              "session",
              JSON.stringify({
                email: userDetails.email,
                username: userDetails.username,
                avatar: userDetails.avatar,
              })
            );
          } catch (err) {
            console.error("Error updating token:", err);
          }
        }
      }

      toast.success("Username updated successfully");
      setEditUsername(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to update username");
    }
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBio(e.target.value);
  };

  const handleSaveBio = () => {
    localStorage.setItem("userBio", bio); 
    setEditBio(false);
    toast.success("Bio updated successfully");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#04c4ac] shadow-sm py-3 px-6 justify-center flex items-start">
        <h1 className="text-3xl text font-bold text-gray-800">Mali*</h1>
        <div className="w-6" />
      </header>

      <main className="max-w-xl h-[10%] mx-auto mt-3 p-9 bg-white border  rounded-lg shadow-2xl border-gray-300 space-y-6">
        <div className="flex gap-10">
          <button
            onClick={() => router.push("/")}
            className="text-gray-600 hover:text-black"
          >
            <FiArrowLeft size={24} />
          </button>
          <h2 className="text-2xl ml-[22%] font-bold text-center">
            Your Profile
          </h2>
        </div>

        {isGoogleAuth && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 py-4 px-3 rounded">
            You're signed in with Google. Some profile options may be limited.
          </div>
        )}

        {/* Avatar Section */}
        <div>
          <label className="font-semibold text-lg py-2 block mb-1">
            Avatar:
          </label>
          <div className="flex gap-3 items-center mb-4">
            <img
              src={Profile?.profilepicture}
              alt="Avatar"
              className="w-16 h-16 rounded-full object-cover"
            />
            <button
              onClick={() => setEditAvatar(!editAvatar)}
              className="bg-[#04c4ac] text-white font-medium px-5 py-3 rounded hover:bg-cyan-600"
            >
              {editAvatar ? "Save" : "Edit Avatar"}
            </button>
          </div>

        </div>

        {/* Username Section */}
        <div className="mb-3">
          <label className="font-semibold text-lg py-2 block mb-1">
            Username:
          </label>
          <div className="flex gap-3 items-center">
            <input
              disabled={!editUsername}
              className="border px-3 py-3 rounded-md w-full disabled:bg-gray-100"
              value={Profile.username}
              onChange={(e) =>
                setUserDetails({ ...userDetails, username: e.target.value })
              }
            />
            {editUsername ? (
              <button
                onClick={handleUpdateUsername}
                className="bg-[#04c4ac] text-white font-medium px-5 py-3 rounded hover:bg-cyan-600"
              >
                Update
              </button>
            ) : (
              <button
                onClick={() => setEditUsername(true)}
                className="bg-[#04c4ac] text-white font-medium px-8 py-3 rounded hover:bg-cyan-600"
              >
                Edit
              </button>
            )}
          </div>
        </div>

        {/* Bio Section */}
        <div className="mb-0">
          <label className="font-semibold text-lg py-2 block mb-1">
            Your Bio:
          </label>
          <div className="flex flex-col space-y-2">
            <textarea
              className="border px-3 rounded-md w-full"
              value={Profile.bio}
              onChange={handleBioChange}
              placeholder="Write a little about yourself..."
              rows={4}
              disabled={!editBio}
            />

            <div className="flex justify-end">
              {editBio ? (
                <button
                  onClick={handleSaveBio}
                  className="bg-[#04c4ac] text-white font-medium px-5 py-3 rounded hover:bg-cyan-600"
                >
                  Save Bio
                </button>
              ) : (
                <button
                  onClick={() => setEditBio(true)}
                  className="bg-[#04c4ac] text-white font-medium px-8 py-3 rounded hover:bg-cyan-600"
                >
                  Edit Bio
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Email Section */}
        <div>
          <label className="font-semibold text-lg py-2 block mb-1">
            Email:
          </label>
          <div className="flex gap-3 items-center">
            <input
              disabled={!editEmail || isGoogleAuth}
              className="border px-3 py-3 rounded-md w-full disabled:bg-gray-100"
              value={Profile.email}
              onChange={(e) =>
                setUserDetails({ ...userDetails, email: e.target.value })
              }
            />
          
          </div>
          {isGoogleAuth && (
            <p className="text-sm text-gray-500 mt-1">
              Email cannot be changed for Google accounts
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;
