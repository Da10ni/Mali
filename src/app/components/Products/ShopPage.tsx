// "use client"  

// import React, { useState, useEffect } from "react"; 
// import Products from "./Products"; 
// import ProfileCard from "../Links/ProfilePreview"; 
// import Header from "../UI/Header"; 
// import ProfileThemePicker from "../UI/ThemePicker";  

// const ShopPage: React.FC = () => {   
//   const [addedProducts, setAddedProducts] = useState<any[]>([]);
//   const [cardBgColor, setCardBgColor] = useState("bg-gray-200");
//   const [cardTextColor, setCardTextColor] = useState("text-gray-700");

//   const handleBgColorChange = (color: string) => {
//     setCardBgColor(color);
//   };

//   const handleTextColorChange = (color: string) => {
//     setCardTextColor(color);
//   };
        
//   return (
//     <div className="min-h-screen">
//       <div style={{ position: 'relative', zIndex: 100 }}>
//         <Header
//           title=""
//           centerContent={<span className="text-lg text-gray-900">My Links</span>}
//           rightContent={
//             <div className="flex items-center gap-3">
//               <ProfileThemePicker
//                 setBgColor={handleBgColorChange}
//                 setTextColor={handleTextColorChange}
//               />
//             </div>
//           }
//         />
//       </div>

//       <div className="p-6 mx-auto max-w-4xl flex flex-col lg:flex-row">
//         <div className="w-full lg:w-2/3 lg:pr-6 mb-6 lg:mb-0">
//           <Products
//             addedProducts={addedProducts}
//             setAddedProducts={setAddedProducts}
//             cardBgColor={cardBgColor}
//             cardTextColor={cardTextColor} 
//             setCardBgColor={handleBgColorChange}
//             setCardTextColor={handleTextColorChange}
//           />
//         </div>
        
//         {/* Profile card with lower z-index */}
//         <div className="w-full lg:w-1/3" style={{ zIndex: 10 }}>
//           <div className="lg:sticky lg:top-20">
//             <ProfileCard
//               productData={undefined}
//               linkData={undefined}
//               productList={addedProducts}
//               bgColor={cardBgColor}
//               textColor={cardTextColor}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   ); 
// };  

// export default ShopPage;

"use client"  

import React, { useState, useEffect, useContext } from "react"; 
import Products from "./Products"; 
import ProfileCard from "../Links/ProfilePreview"; 
import Header from "../UI/Header"; 
import ProfileThemePicker from "../UI/ThemePicker";  
import { AuthContext } from "@/src/context/AuthContext";


const ShopPage: React.FC = () => {   
  const [addedProducts, setAddedProducts] = useState<any[]>([]);
  const [cardBgColor, setCardBgColor] = useState("bg-gray-200");
  const [cardTextColor, setCardTextColor] = useState("text-gray-700");
  const data = useContext(AuthContext);

  console.log(data);

  const handleBgColorChange = (color: string) => {
    setCardBgColor(color);
  };

  const handleTextColorChange = (color: string) => {
    setCardTextColor(color);
  };
        
  return (
    <div className="min-h-screen">
      <div style={{ position: 'relative', zIndex: 100 }}>
        <Header
          title=""
          centerContent={<span className="text-lg text-gray-900">My Links</span>}
          rightContent={
            <div className="flex items-center gap-3">
              <ProfileThemePicker
                setBgColor={handleBgColorChange}
                setTextColor={handleTextColorChange}
              />
            </div>
          }
        />
      </div>

      <div className="p-6 mx-auto min-h-[660px] flex flex-col lg:flex-row">
        <div className="w-full lg:w-2/3 lg:pr-6 mb-6 lg:mb-0">
          <Products
            addedProducts={addedProducts}
            setAddedProducts={setAddedProducts}
            cardBgColor={cardBgColor}
            cardTextColor={cardTextColor} 
            setCardBgColor={handleBgColorChange}
            setCardTextColor={handleTextColorChange}
          />
        </div>
        
        {/* Profile card with lower z-index */}
      { /* <div className="w-full lg:w-1/3" style={{ zIndex: 10 }}>*/}
        <div className="w-full lg:mt-5 fixed right-0 top-1/2 transform -translate-y-1/2 mb-6 lg:w-1/3 lg:mr-8">
            <ProfileCard
              productData={undefined}
              linkData={undefined}
              productList={addedProducts}
              bgColor={cardBgColor}
              textColor={cardTextColor}
            />
          </div>
        {/*</div>*/}
      </div>
    </div>
  ); 
};  

export default ShopPage;