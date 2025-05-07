import React from 'react';

const Progressbar = ({ percentage }: { percentage: number }) => {
  return (
    <div className="w-[80%] mx-auto my-10 h-2 rounded-full bg-gradient-to-r from-[#999] via-[#ccc] to-[#eee] shadow-inner">
      <div
        className="h-full bg-black rounded-full transition-all duration-500 ease-in-out"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

export default Progressbar;
