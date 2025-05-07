"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import { AiOutlineUpload } from "react-icons/ai";
import Fireworks from "../UI/Fireworks";
import { useSelector, useDispatch } from "react-redux";
import { setfield } from "@/src/store/slices/userSlice";
import { uploadToCloudinary } from "@/src/lib/Claudinary";
import { consoleLoggingIntegration } from "@sentry/nextjs";
import { updateUserInfo } from "@/src/services/Auth";
import { RootState } from "@/src/store/store";
import Progressbar from "../UI/Progressbar";

const ProfileSetup = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [bioCount, setBioCount] = useState(0);
  const router = useRouter();
  const dispatch = useDispatch();
  const userdata = useSelector((state: RootState) => state.user);
  const [imgfile, setimgfile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    try {
      console.log("Store setup submitted:", data);
      dispatch(setfield({ name: "profilePicture", value: imgfile }));
      dispatch(setfield({ name: "displayName", value: data?.displayName }));
      dispatch(
        setfield({ name: "instagramUsername", value: data?.instagramUsername })
      );
      dispatch(
        setfield({ name: "tiktokUsername", value: data?.tiktokUsername })
      );
      dispatch(setfield({ name: "bio", value: data.bio }));

      const upload = await uploadToCloudinary(imgfile);

      dispatch(setfield({ name: "profilePicture", value: upload }));
      console.log("Storage Responce >>>", upload);
      console.log("User Data from redux >>", userdata);
      const userInfoupdate = await updateUserInfo({
        displayName: data.displayName,
        bio: data.bio,
        profilepicture: upload,
        tiktokUsername: data.tiktokUsername,
        instagramUsername: data.instagramUsername,
        liketosell: userdata.liketosell,
        categories: userdata.categories,
      });
      console.log("Userinfo Result >>", userInfoupdate);

      router.push("/setup-page");
    } catch (err) {
      console.log("Error >>", err);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setimgfile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
        setValue("photo", file);
      };
      reader.readAsDataURL(file);
    }
  };

  const bio = watch("bio") || "";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <Fireworks />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border border-gray-200 p-8 w-full max-w-xl"
      >
      <Progressbar percentage={80} />
        <h2 className="text-2xl font-bold text-center mb-1">
          Let's set up your store!
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Create a space that reflects your brand
        </p>

        {/* Upload photo */}
        <div className="flex items-center mb-6 gap-4">
          <label htmlFor="photoUpload" className="cursor-pointer">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center border border-gray-300 overflow-hidden">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Uploaded"
                  className="object-cover w-full h-full"
                />
              ) : (
                <AiOutlineUpload size={30} className="text-gray-500" />
              )}
            </div>
            <p className="text-sm text-center mt-1 text-gray-600">
              Upload photo
            </p>
            <input
              id="photoUpload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>

          <div className="flex-1">
            <label className="block font-medium text-sm mb-1">
              Display name
            </label>
            <input
              {...register("displayName", {
                required: "Display name is required",
              })}
              placeholder="e.g., John Smith"
              className="w-full border px-4 py-2 rounded-md bg-white"
            />
            {errors.displayName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.displayName.message as string}
              </p>
            )}
          </div>
        </div>

        {/* Bio */}
        <div className="mb-6">
          <label className="block font-medium text-sm mb-1">
            Tell your story
          </label>
          <p className="text-sm text-gray-500 mb-2">
            What makes your store special?
          </p>
          <textarea
            {...register("bio", {
              maxLength: {
                value: 160,
                message: "Bio cannot exceed 160 characters",
              },
              onChange: (e) => setBioCount(e.target.value.length),
            })}
            rows={4}
            placeholder="Share what inspires you and what your followers can expect..."
            className="w-full border px-4 py-2 rounded-md resize-none"
          />
          <div className="text-right text-xs text-gray-400">
            {bio.length}/160
          </div>
        </div>

        {/* Social media */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Connect your social media</h3>
          <p className="text-sm text-gray-500 mb-4">
            Let your followers find your store
          </p>

          {/* Instagram */}
          <div className="flex items-center border px-3 py-2 mb-2 rounded-md bg-white">
            <FaInstagram className="text-pink-500 mr-2" />
            <input
              {...register("instagramUsername", {
                required: false,
                validate: (value) =>
                  value === "" ||
                  /^[a-zA-Z0-9._]+$/.test(value) ||
                  "Enter a valid Instagram profile URL (e.g. www.instagram.com/yourname)",
              })}
              placeholder="www.instagram.com/yourusername"
              className="w-full outline-none"
            />
          </div>
          {errors.instagram && (
            <p className="text-red-500 text-xs mb-4">
              {errors.instagram.message as string}
            </p>
          )}

          {/* TikTok */}
          <div className="flex items-center border px-3 py-2 mb-2 rounded-md bg-white">
            <FaTiktok className="text-gray-800 mr-2" />
            <input
              {...register("tiktokUsername", {
                required: false,
                validate: (value) =>
                  value === "" ||
                  /^[a-zA-Z0-9._]+$/.test(value) ||
                  "Enter a valid TikTok profile URL (e.g. www.tiktok.com/@yourname)",
              })}
              placeholder="www.tiktok.com/@yourusername"
              className="w-full outline-none"
            />
          </div>
          {errors.tiktok && (
            <p className="text-red-500 text-xs mb-4">
              {errors.tiktok.message as string}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-2 rounded-md bg-black text-white font-medium hover:bg-teal-700 transition"
        >
          Create my store →
        </button>
      </form>
    </div>
  );
};

export default ProfileSetup;
