"use client";

import React, { useState, useEffect } from "react";
import Links from "./Links";
import Header from "../UI/Header";
import ProfileCard from "./ProfilePreview";
import ProfileThemePicker from "../UI/ThemePicker";

const ShopPage: React.FC = () => {
  const [addedLinks, setAddedLinks] = useState<any[]>([]); // List of added products
  const [cardBgColor, setCardBgColor] = useState("bg-gray-200"); // Background color for the card
  const [cardTextColor, setCardTextColor] = useState("text-gray-700"); // Text color for the card

  const handleBgColorChange = (color: string) => {
    setCardBgColor(color);
  };

  const handleTextColorChange = (color: string) => {
    setCardTextColor(color);
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Links"
        // centerContent={<span className="text-lg text-gray-900">My Links</span>}
        rightContent={
          <div className="flex items-center gap-3">
            <ProfileThemePicker
              setBgColor={handleBgColorChange}
              setTextColor={handleTextColorChange}
            />
          </div>
        }
      />
      <div className="w-full flex justify-start" >


      <div className="p-6  flex flex-col lg:flex-row w-[100%]">
      <Links
          addedLinks={addedLinks}
          setAddedLinks={setAddedLinks}
          cardBgColor={cardBgColor}
          cardTextColor={cardTextColor}
          setCardBgColor={handleBgColorChange}
          setCardTextColor={handleTextColorChange}
        />
      </div>

      {/* Right Side - Profile Card */}
      <div className=" lg:mt-5 fixed right-0 top-[52%]  transform -translate-y-1/2 mb-6  lg:mr-8  w-[24%] h-[86%]"
       style={{
        backgroundImage: `url(/assets/IPHONE2.png)`,
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top center",
      }}
      >

        <ProfileCard
          productData={undefined}
          linkData={addedLinks}
          productList={undefined} // Pass the added products list
          bgColor={cardBgColor} // Pass the background color
          textColor={cardTextColor} // Pass the text color
        />
      </div>
      </div>

    </div>
  );
};

export default ShopPage;
