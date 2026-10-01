import Calendar from '@/icons/cofounder/calendar';
import React, { useState, useRef, useEffect } from 'react';
import { CalendarPicker } from './calendar';

interface ICalenderButtonProps {
  handleDateSelectFromCalender: (Date) => void;
  className?: string;
  iconClasses?: string;
}

const CalendarButton: React.FC<ICalenderButtonProps> = ({
  handleDateSelectFromCalender,
  className,
  iconClasses,
}) => {
  const [isCalendarOpen, setCalendarOpen] = useState(false);
  const calendarRef = useRef(null);

  const toggleCalendar = () => {
    setCalendarOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (calendarRef.current && !calendarRef.current.contains(event.target)) {
      setCalendarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={calendarRef}>
      <button
        type="button"
        onClick={toggleCalendar}
        className={`${className} flex items-center p-2.5 border border-black-200 rounded w-full lg:!max-w-max h-11 justify-center lg:!justify-between`}
      >
        <Calendar className={iconClasses}/>
      </button>

      {isCalendarOpen && (
        <div className="absolute z-50 mt-2 right-0 bg-white rounded-lg w-56 shadow-lg">
          <CalendarPicker
            handleDateSelectFromCalender={handleDateSelectFromCalender}
          />
        </div>
      )}
    </div>
  );
};

export default CalendarButton;
