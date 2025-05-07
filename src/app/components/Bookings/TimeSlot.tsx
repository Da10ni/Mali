import React, { useState, useEffect } from "react";

interface TimeSlotSelectorProps {
  day: string;
  selectedFrom: string;
  selectedTo: string;
  onTimeChange: (day: string, type: "from" | "to", value: string) => void;
}

const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({ day, selectedFrom, selectedTo, onTimeChange }) => {
  const timeOptions = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  

  // Handler for the "from" time change
  const handleFromTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onTimeChange(day, "from", e.target.value);
  };

  // Handler for the "to" time change
  const handleToTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onTimeChange(day, "to", e.target.value);
  };

  return (
    <div className="time-slot-selector">
      <div className="flex items-center">
        <label className="mr-2">From:</label>
        <select
          value={selectedFrom}
          onChange={handleFromTimeChange}
          className="p-2 border border-gray-300 rounded-md"
        >
          {timeOptions.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>

        <label className="mx-4">To:</label>
        <select
          value={selectedTo}
          onChange={handleToTimeChange}
          className="p-2 border border-gray-300 rounded-md"
        >
          {timeOptions.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TimeSlotSelector;
