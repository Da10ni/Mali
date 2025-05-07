import React, { useState } from 'react';

interface DatePickerProps {
  onBlockDate: (date: string) => void;
  blockedDates: string[];
  onRemoveDate: (date: string) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ 
  onBlockDate, 
  blockedDates,
  onRemoveDate
}) => {
  const [selectedDate, setSelectedDate] = useState<string>('');

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleAddDate = () => {
    if (selectedDate && !blockedDates.includes(selectedDate)) {
      onBlockDate(selectedDate);
      setSelectedDate(''); 
    }
  };

  const formatDisplayDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Block Specific Dates</h3>
      <div className="flex items-center space-x-2">
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="p-2 border border-gray-300 rounded-md"
          min={new Date().toISOString().split('T')[0]} 
        />
        <button 
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          onClick={handleAddDate}
          disabled={!selectedDate || blockedDates.includes(selectedDate)}
        >
          Block Date
        </button>
      </div>
      
      {blockedDates.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Currently Blocked Dates:</h4>
          <div className="flex flex-wrap gap-2">
            {blockedDates.map((date, index) => (
              <div key={index} className="bg-gray-100 px-3 py-1 rounded-md flex items-center">
                <span>{formatDisplayDate(date)}</span>
                <button 
                  className="ml-2 text-red-500 hover:text-red-700"
                  onClick={() => onRemoveDate(date)}
                  aria-label={`Remove ${formatDisplayDate(date)}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;