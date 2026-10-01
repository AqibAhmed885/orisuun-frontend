import React, { useState, useRef, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
const VerticalScrollCalendar = ({ onDateSelect, onCancel }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tempSelectedDate, setTempSelectedDate] = useState(new Date());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [activeMonth, setActiveMonth] = useState(null);
  const scrollRef = useRef(null);
  const yearPickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (yearPickerRef.current && !yearPickerRef.current.contains(event.target)) {
        setShowYearPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(currentYear, i, 1);
    return {
      name: date.toLocaleString('default', { month: 'long' }),
      days: getDaysInMonth(date),
      firstDay: getFirstDayOfMonth(date)
    };
  });

  function getDaysInMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }

  function getFirstDayOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  }

  const scrollToToday = () => {
    const today = new Date();
    setTempSelectedDate(today);
    setCurrentYear(today.getFullYear());

    const todayElement = document.getElementById(`date-${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`);
    if (todayElement && scrollRef.current) {
      const containerRect = scrollRef.current.getBoundingClientRect();
      const elementRect = todayElement.getBoundingClientRect();
      const relativeTop = elementRect.top - containerRect.top;

      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollTop + relativeTop - containerRect.height / 2,
        behavior: 'smooth'
      });
    }
  };

  const handleYearClick = (monthIndex) => {
    setActiveMonth(monthIndex);
    setShowYearPicker(true);
  };

  const handleYearSelect = (year) => {
    const newDate = new Date(tempSelectedDate);
    newDate.setFullYear(year);
    setTempSelectedDate(newDate);
    setCurrentYear(year);
    setShowYearPicker(false);
  };

  const handleApply = () => {
    setSelectedDate(tempSelectedDate);
    if (onDateSelect) {
      onDateSelect(tempSelectedDate);
    }
  };

  const handleCancel = () => {
    setTempSelectedDate(selectedDate);
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="fixed inset-0 top-[7rem] mx-2 py-2 flex items-center justify-center z-[1000] bg-gray-200/50 backdrop-blur-sm ">
      <div className="w-full max-w-md bg-white p-5 py-5 relative mt-5 border rounded-2xl shadow-2xl">
        <div className="sticky top-0 bg-white z-20 pb-2">
          <div className="grid grid-cols-7 gap-1 border-b px-5 py-2 border border-none rounded-2xl mx-2 bg-[#E4ECFBAD]">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-sm text-gray-500 font-medium">
                {day}
              </div>
            ))}
          </div>

          <div className="relative mt-1 mb-1 px-2">
            <button
              onClick={scrollToToday}
              className="absolute right-0 px-4 py-1 bg-[#E4ECFBAD] text-[#2357C6] border border-[#0A193A4D] border-2 font-bold rounded-xl"
            >
              Today
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="h-[330px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#2357C6] scrollbar-track-[#E1EBF9] mb-16"
        >
          {months.map((month, monthIndex) => (
            <div
              key={month.name}
              className="mb-6 top-8 relative bg-[#E4ECFBAD] p-5 mx-2 border border-none rounded-2xl"
            >
              <div className="flex items-center  my-4 relative">
                <h3 className="text-lg font-semibold text-[#0A193A]">
                  {month.name}
                </h3>
                <button
                  onClick={() => handleYearClick(monthIndex)}
                  className="text-[#0A193A4D] font-semibold hover:bg-[#E1EBF9] px-2 py-1 rounded-md"
                >
                  {currentYear}
                </button>

                {showYearPicker && activeMonth === monthIndex && (
                  <div
                    ref={yearPickerRef}
                    className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-xl border border-gray-200 w-32 max-h-48 overflow-y-auto z-30"
                  >
                    {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - 25 + i)
                      .map(year => (
                        <button
                          key={year}
                          onClick={() => handleYearSelect(year)}
                          className={`w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors
                                ${year === currentYear ? 'text-[#2357C6] font-bold' : 'text-gray-700'}
                              `}
                        >
                          {year}
                        </button>
                      ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {Array(month.firstDay).fill(null).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}

                {Array.from({ length: month.days }, (_, i) => {
                  const day = i + 1;
                  const currentDate = new Date(currentYear, monthIndex, day);
                  const isToday = currentDate.toDateString() === new Date().toDateString();
                  const isSelected = currentDate.toDateString() === tempSelectedDate.toDateString();

                  return (
                    <button
                      key={`day-${day}`}
                      id={`date-${currentYear}-${monthIndex}-${day}`}
                      onClick={() => setTempSelectedDate(currentDate)}
                      className={`aspect-square rounded-full flex items-center justify-center text-sm transition-colors
                            ${isSelected ? 'bg-[#2357C6] text-white' : ''}
                            ${isToday && !isSelected ? 'text-[#2357C6] font-bold' : ''}
                            ${!isSelected && !isToday ? 'hover:bg-gray-100' : ''}
                          `}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t rounded-2xl border-gray-100 flex justify-end gap-2">
          <button
            onClick={handleCancel}
            className="px-6 py-[4px] border border-[#2357C680] rounded-xl text-[#2357C6] hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-6 py-[4px] bg-[#2357C6] text-white rounded-xl hover:bg-[#1a4399]"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerticalScrollCalendar;