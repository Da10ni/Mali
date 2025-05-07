"use client";
import React, { useState, useEffect } from "react";


interface BookedSlotsInterface {
  [day: string]: {
    [date: string]: string[];
  };
}

interface CalendarProps {
  availability: {
    [key: string]: {
      selected: boolean;
      from: string;
      to: string;
    };
  };
  onDayClick: (day: string) => void;
  currentMonth: string;
  onMonthChange?: (newMonth: string) => void;
  bookedSlots?: BookedSlotsInterface;
  blockedDates?: string[];
}

const Calendar: React.FC<CalendarProps> = ({ 
  availability, 
  onDayClick, 
  currentMonth,
  onMonthChange,
  bookedSlots = {},
  blockedDates = []
}) => {
  const [calendarDays, setCalendarDays] = useState<Array<{ date: number | null; dayOfWeek: number | null }>>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  const getBlockedDatesForCurrentMonth = () => {
    const [monthName, yearStr] = currentMonth.split(" ");
    const year = parseInt(yearStr);
    const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth();
    
    return blockedDates
      .filter(dateStr => {
        const date = new Date(dateStr);
        return date.getFullYear() === year && date.getMonth() === monthIndex;
      })
      .map(dateStr => {
        const date = new Date(dateStr);
        return date.getDate().toString();
      });
  };
  
  const blockedDaysInCurrentMonth = getBlockedDatesForCurrentMonth();
  
  useEffect(() => {
    try {
      const [monthName, yearStr] = currentMonth.split(" ");
      const year = parseInt(yearStr);
      const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth();
      
      const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
      
      const firstDay = new Date(year, monthIndex, 1).getDay();
      
      const days: Array<{ date: number | null; dayOfWeek: number | null }> = [];
      
      for (let i = 0; i < firstDay; i++) {
        days.push({ date: null, dayOfWeek: null });
      }
      
      for (let i = 1; i <= daysInMonth; i++) {
        const dayOfWeek = new Date(year, monthIndex, i).getDay();
        days.push({ date: i, dayOfWeek });
      }
      
      const remainingDays = 7 - (days.length % 7);
      if (remainingDays < 7) {
        for (let i = 0; i < remainingDays; i++) {
          days.push({ date: null, dayOfWeek: null });
        }
      }
      
      setCalendarDays(days);
    } catch (error) {
      console.error("Error generating calendar:", error);
      setCalendarDays([]);
    }
  }, [currentMonth]);

  const goToNextMonth = () => {
    const [monthName, yearStr] = currentMonth.split(" ");
    const year = parseInt(yearStr);
    const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth();
    
    const nextMonthIndex = (monthIndex + 1) % 12;
    const nextYear = nextMonthIndex === 0 ? year + 1 : year;
    
    const nextMonthName = new Date(nextYear, nextMonthIndex, 1).toLocaleString('default', { month: 'long' });
    const newMonthString = `${nextMonthName} ${nextYear}`;
    
    if (onMonthChange) {
      onMonthChange(newMonthString);
    }
  };
  
  const goToPrevMonth = () => {
    const [monthName, yearStr] = currentMonth.split(" ");
    const year = parseInt(yearStr);
    const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth();
    
    const prevMonthIndex = (monthIndex - 1 + 12) % 12;
    const prevYear = monthIndex === 0 ? year - 1 : year;
    
    const prevMonthName = new Date(prevYear, prevMonthIndex, 1).toLocaleString('default', { month: 'long' });
    const newMonthString = `${prevMonthName} ${prevYear}`;
    
    const today = new Date();
    const currentMonthString = `${today.toLocaleString('default', { month: 'long' })} ${today.getFullYear()}`;
    
    if (currentMonth !== currentMonthString && onMonthChange) {
      onMonthChange(newMonthString);
    }
  };
  
  const isAvailable = (dayOfWeek: number | null): boolean => {
    if (dayOfWeek === null) return false;
    const dayName = dayNames[dayOfWeek];
    return availability && availability[dayName]?.selected !== false;
  };
  
  const isDateBlocked = (date: number | null): boolean => {
    if (date === null) return false;
    return blockedDaysInCurrentMonth.includes(date.toString());
  };

  const hasBookedSlots = (date: number | null, dayOfWeek: number | null): boolean => {
    if (date === null || dayOfWeek === null) return false;
    
    const dayName = dayNames[dayOfWeek];
    return !!(bookedSlots[dayName] && 
            bookedSlots[dayName][date.toString()] && 
            bookedSlots[dayName][date.toString()].length > 0);
  };
  
  const today = new Date();
  const currentMonthString = `${today.toLocaleString('default', { month: 'long' })} ${today.getFullYear()}`;
  const isCurrentMonth = currentMonth === currentMonthString;

  
  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={goToPrevMonth}
          disabled={isCurrentMonth}
          className={`px-2 py-1 rounded ${
            isCurrentMonth 
              ? 'text-gray-300 cursor-not-allowed' 
              : 'text-purple-600 hover:bg-purple-100'
          }`}
        >
          &lt;
        </button>
        <span className="font-medium">{currentMonth}</span>
        <button 
          onClick={goToNextMonth}
          className="px-2 py-1 rounded text-purple-600 hover:bg-purple-100"
        >
          &gt;
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
          <div key={index} className="text-xs font-medium text-gray-500 mb-1">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {calendarDays.map((day, idx) => {
          if (!day || day.date === null) {
            return <div key={idx} className="py-1"></div>;
          }
          
          const available = isAvailable(day.dayOfWeek);
          const isBlocked = isDateBlocked(day.date);
          const hasBooked = hasBookedSlots(day.date, day.dayOfWeek);
          const isSelected = selectedDate === day.date.toString();
          
          let cellClass = "py-1 text-sm rounded-full ";
          
          if (!available || isBlocked) {
            cellClass += "bg-gray-200 text-gray-400 cursor-not-allowed";
          } else if (hasBooked) {
            cellClass += "bg-orange-100 cursor-pointer hover:bg-orange-200";
          } else {
            cellClass += "cursor-pointer hover:bg-blue-100";
          }
          
          if (isSelected) {
            cellClass += " ring-2 ring-purple-500";
          }
          
          if (isBlocked) {
            cellClass += " relative";
          }
          
          return (
            <div
              key={idx}
              className={cellClass}
              onClick={() => {
                if (available && !isBlocked) {
                  setSelectedDate(day.date.toString());
                  onDayClick(day.date.toString());
                }
              }}
            >
              {day.date}
              {isBlocked && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-0.5 transform rotate-45"></div>
                </div>
              )}
              {hasBooked && !isBlocked && <span className="block h-1 w-1 mx-auto mt-1 bg-orange-500 rounded-full"></span>}
            </div>
          );
        })}
      </div>
      
    
    </div>
  );
};

export default Calendar;