// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';

// const StoreSetup = () => {
//   const router = useRouter();

//   useEffect(() => {
//     // Check if the user is authenticated (for example, by checking for JWT in localStorage)
//     const token = localStorage.getItem('token');
    
//     if (!token) {
//       // Redirect to login page if not authenticated
//       router.push('/');
//     }
//   }, []);

//   const loadSteps = () => {
//     const storedSteps = localStorage.getItem('stepsCompleted');
//     return storedSteps ? JSON.parse(storedSteps) : [false, false, false, false];
//   };

//   const [stepsCompleted, setStepsCompleted] = useState(loadSteps());
//   const [completionPercentage, setCompletionPercentage] = useState(0);

//   // Handle completion of steps
//   const handleCompleteStep = (stepIndex) => {
//     const updatedSteps = [...stepsCompleted];
//     updatedSteps[stepIndex] = !updatedSteps[stepIndex]; // Toggle completion status
//     setStepsCompleted(updatedSteps);
//   };

//   useEffect(() => {
//     localStorage.setItem('stepsCompleted', JSON.stringify(stepsCompleted));

//     const completedSteps = stepsCompleted.filter(completed => completed).length;
//     const newPercentage = (completedSteps / stepsCompleted.length) * 100;
//     setCompletionPercentage(newPercentage);
//   }, [stepsCompleted]);

//   return (
//     <div className="container p-10">
//       <h2 className="text-2xl font-semibold mb-4">Complete Your Store Setup</h2>
//       <p className="mb-4">Follow these steps to get started</p>

//       {/* Progress bar */}
//       <div className="mb-6">
//         <div className="relative pt-1 mb-6">
//           <div className="flex mb-2 items-center justify-between">
//             <div>
//               <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
//                 {Math.round(completionPercentage)}% completed
//               </span>
//             </div>
//           </div>
//           <div className="flex mb-2">
//             <div className="w-full bg-gray-200 rounded-full h-2.5">
//               <div
//                 className="bg-green-600 h-2.5 rounded-full"
//                 style={{ width: `${completionPercentage}%` }}
//               ></div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Steps List with Checkmarks */}
//       <div className="mb-6 border border-gray-300 p-9">
//         {['Add Your First Product', 'Set Up Payments', 'Upload Media Kit', 'Customize Design'].map((step, index) => (
//           <div
//             key={index}
//             className={`flex items-center mb-3 p-3 rounded-md border ${stepsCompleted[index] ? 'bg-green-100' : 'bg-white'}`}
//           >
//             <div className="w-8 h-8 rounded-full border-2 border-gray-500 flex justify-center items-center mr-4">
//               {/* Display checkmark when step is completed */}
//               {stepsCompleted[index] ? (
//                 <span className="text-white text-lg">✔</span> // Checkmark
//               ) : (
//                 <span className="text-white text-lg">○</span> // Empty circle for incomplete steps
//               )}
//             </div>
//             <div>
//               <h4 className="font-medium">
//                 <div
//                   onClick={() => handleCompleteStep(index)}
//                   className="text-blue-500 hover:text-blue-700 cursor-pointer"
//                 >
//                   {step}
//                 </div>
//               </h4>
//               <p className="text-xs text-gray-500">
//                 {index === 0
//                   ? 'Start selling by adding your first digital or physical product'
//                   : index === 1
//                   ? 'Connect your payment account to start accepting orders'
//                   : index === 2
//                   ? 'Add your brand assets and promotional materials'
//                   : 'Fine-tune your page layout and appearance'}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Continue Button */}
//       <Link
//       href='/myadmin'
//         className={`px-6 py-3 w-[115px] mt-6 text-white font-semibold rounded-lg ${completionPercentage === 100 ? 'bg-green-500' : 'bg-gray-400 cursor-not-allowed'}`}
//       >
//         Continue
//       </Link>
//     </div>
//   );
// };

// export default StoreSetup;


'use client';

import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthContext } from "@/src/context/AuthContext";

const StoreSetup = () => {
  const router = useRouter();

  // Check if we are on the client-side
  const isClient = typeof window !== "undefined";

  useEffect(() => {
    if (isClient) {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/');
      }
    }
  }, [isClient, router]);

  const loadSteps = () => {
    if (isClient) {
      const storedSteps = localStorage.getItem('stepsCompleted');
      return storedSteps ? JSON.parse(storedSteps) : [false, false, false, false];
    }
    return [false, false, false, false];
  };

  const [stepsCompleted, setStepsCompleted] = useState(loadSteps());
  const [completionPercentage, setCompletionPercentage] = useState(0);

  const handleCompleteStep = (stepIndex) => {
    const updatedSteps = [...stepsCompleted];
    updatedSteps[stepIndex] = !updatedSteps[stepIndex]; // Toggle completion status
    setStepsCompleted(updatedSteps);
  };

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('stepsCompleted', JSON.stringify(stepsCompleted));

      const completedSteps = stepsCompleted.filter(completed => completed).length;
      const newPercentage = (completedSteps / stepsCompleted.length) * 100;
      setCompletionPercentage(newPercentage);
    }
  }, [stepsCompleted, isClient]);

  return (
    <div className="container p-10">
      <h2 className="text-2xl font-semibold mb-4">Complete Your Store Setup</h2>
      <p className="mb-4">Follow these steps to get started</p>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="relative pt-1 mb-6">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                {Math.round(completionPercentage)}% completed
              </span>
            </div>
          </div>
          <div className="flex mb-2">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-green-600 h-2.5 rounded-full"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Steps List with Checkmarks */}
      <div className="mb-6 border border-gray-300 p-9">
        {['Add Your First Product', 'Set Up Payments', 'Upload Media Kit', 'Customize Design'].map((step, index) => (
          <div
            key={index}
            className={`flex items-center mb-3 p-3 rounded-md border ${stepsCompleted[index] ? 'bg-green-100' : 'bg-white'}`}
          >
            <div className="w-8 h-8 rounded-full border-2 border-gray-500 flex justify-center items-center mr-4">
              {/* Display checkmark when step is completed */}
              {stepsCompleted[index] ? (
                <span className="text-white text-lg">✔</span> // Checkmark
              ) : (
                <span className="text-white text-lg">○</span> // Empty circle for incomplete steps
              )}
            </div>
            <div>
              <h4 className="font-medium">
                <div
                  onClick={() => handleCompleteStep(index)}
                  className="text-blue-500 hover:text-blue-700 cursor-pointer"
                >
                  {step}
                </div>
              </h4>
              <p className="text-xs text-gray-500">
                {index === 0
                  ? 'Start selling by adding your first digital or physical product'
                  : index === 1
                  ? 'Connect your payment account to start accepting orders'
                  : index === 2
                  ? 'Add your brand assets and promotional materials'
                  : 'Fine-tune your page layout and appearance'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Continue Button */}
      <Link
        href='/myadmin'
        className={`px-6 py-3 w-[115px] mt-6 text-white font-semibold rounded-lg ${completionPercentage === 100 ? 'bg-green-500' : 'bg-gray-400 cursor-not-allowed'}`}
      >
        Continue
      </Link>
    </div>
  );
};

export default StoreSetup;
