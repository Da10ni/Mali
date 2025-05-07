import Image from "next/image";
import React, { useContext, useEffect } from "react";
import UsernameForm from "../Signup/UsernameForm";
import Footer from "../UI/Footer";
import GradientProgressBar from "../UI/Progressbar";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/src/store/store";
import { AuthContext } from "@/src/context/AuthContext";

const Homecomponent = () => {
  const context = useContext(AuthContext);
  console.log("context", context);

  const selector = useSelector((state: RootState) => state.mobilePreview);
  useEffect(() => {
    console.log("redux value >>", selector);
  });
  return (
    <div className="relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-32">
        {/* Flex container for text on left, image on right */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left column: Headings / text */}
          <div className="md:w-1/2">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
              Everything you are.
            </h1>
            <h2 className="font-bold text-4xl md:text-6xl mt-4 text-gray-900">
              In one simple link.
            </h2>
            <p className="mt-6 text-lg text-gray-900 max-w-lg">
              Join 50M+ people using Linktree for their link in bio. One link to
              help you share everything you create, curate, and sell from your
              Instagram, TikTok, Twitter, YouTube, and other social media
              profiles.
            </p>
            <UsernameForm />
          </div>

          {/* Right column: Image */}
          <div className="relative w-full md:w-1/2 h-80 md:h-[500px]">
            <Image
              src="/assets/home3.png"
              alt="Promotional"
              fill
              className="object-cover object-center rounded-md"
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Homecomponent;
