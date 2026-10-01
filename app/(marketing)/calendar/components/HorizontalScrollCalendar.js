import React from 'react';
import DatePicker from "react-datepicker";
const HorizontalScrollCalendar = ({ tempSelectedDate, setTempSelectedDate, setSelectedDate, setShowDatePicker }) => {
    return (
        <div className="small-767:hidden block mt-5 absolute z-[50] bg-white shadow-xl border rounded-3xl border-[#E1EBF9] border-4 p-3">
            <DatePicker
                selected={tempSelectedDate}
                onChange={(date) => setTempSelectedDate(date)}
                inline
                calendarClassName="custom-datepicker"
                formatWeekDay={(day) => day.substr(0, 3)}
                renderCustomHeader={({
                    date,
                    decreaseMonth,
                    increaseMonth,
                    prevMonthButtonDisabled,
                    nextMonthButtonDisabled,
                }) => (
                    <div className="flex items-center justify-between px-4 py-3 bg-white">
                        <div className="text-[16px] font-semibold text-gray-800">
                            {date.toLocaleDateString('en-US', {
                                month: 'long',
                                year: 'numeric'
                            })}
                        </div>
                        <div className="flex">
                            <button
                                onClick={decreaseMonth}
                                disabled={prevMonthButtonDisabled}
                                className="text-gray-600 hover:text-gray-800 disabled:opacity-30"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M15 18l-6-6 6-6" />
                                </svg>
                            </button>
                            <button
                                onClick={increaseMonth}
                                disabled={nextMonthButtonDisabled}
                                className="text-gray-600 hover:text-gray-800 disabled:opacity-30"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M9 18l6-6-6-6" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
                dayClassName={() => "px-1 py-1 text-[15px]"}
            />

            {/* "Today" button */}
            <div className="absolute top-0 right-[-2rem] mt-[-1rem] bg-[#E1EBF9] border-white border-4 rounded-xl">
                <button
                    onClick={() => setTempSelectedDate(new Date())}
                    className="px-4 py-1 text-md text-[#2357C6] font-bold hover:text-[#2357C6]"
                >
                    Today
                </button>
            </div>
            <div className="flex justify-end px-4 py-3 border-t border-gray-100">
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowDatePicker(false)}
                        className="px-6 py-[4px] border border-[#2357C680] rounded-xl text-[#2357C6] hover:text-gray-800"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            setSelectedDate(tempSelectedDate);
                            setShowDatePicker(false);
                        }}
                        className="px-6 py-[4px] text-[14px] font-semibold bg-[#2357C6] text-white border rounded-xl hover:bg-gray-400"
                    >
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HorizontalScrollCalendar;