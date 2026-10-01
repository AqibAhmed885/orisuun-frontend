import React, { useState, useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';

const weekdays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
];

type AvailabilityItem = {
    Id: number;
    Day: string;
    TimeFrom?: string;
    TimeTo?: string;
};

const AvailabilityTimePicker = () => {
    const { setValue, watch } = useFormContext();
    const availabilityFormValue = watch('AvailabilityTime');
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    const availability: AvailabilityItem[] = availabilityFormValue || [];

    const handleClickOutside = (e: MouseEvent) => {
        if (dropdownRef.current && !(dropdownRef.current as any).contains(e.target)) {
            setOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleCheckboxChange = (day: string) => {
        const exists = availability.find((item) => item.Day === day);
        let updated: AvailabilityItem[] = [...availability];

        if (exists) {
            // Remove the day
            updated = updated.filter((item) => item.Day !== day);
        } else {
            // Add new day with Id = 0
            updated.push({
                Id: 0,
                Day: day,
                TimeFrom: '',
                TimeTo: ''
            });
        }

        setValue('AvailabilityTime', updated, { shouldValidate: true });
    };

    const handleTimeChange = (day: string, type: 'TimeFrom' | 'TimeTo', value: string) => {
        const updated = availability.map((item) =>
            item.Day === day ? { ...item, [type]: value } : item
        );
        setValue('AvailabilityTime', updated, { shouldValidate: true });
    };

    const isDaySelected = (day: string) => {
        return availability.some((item) => item.Day === day);
    };

    const getDayTime = (day: string, type: 'TimeFrom' | 'TimeTo') => {
        const item = availability.find((i) => i.Day === day);
        return item ? item[type] || '' : '';
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <div
                onClick={() => setOpen((prev) => !prev)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 flex items-center justify-between cursor-pointer shadow-sm bg-white"
            >
                <div className="flex items-center gap-2 text-gray-500">
                    <svg width="20" height="21" viewBox="0 0 20 21" fill="none">
                        <path d="M17.5 8.83464H2.5M13.3333 2.16797V5.5013M6.66667 2.16797V5.5013M6.5 18.8346H13.5C14.9001 18.8346 15.6002 18.8346 16.135 18.5622C16.6054 18.3225 16.9878 17.94 17.2275 17.4696C17.5 16.9348 17.5 16.2348 17.5 14.8346V7.83464C17.5 6.4345 17.5 5.73444 17.2275 5.19966C16.9878 4.72925 16.6054 4.3468 16.135 4.10712C15.6002 3.83464 14.9001 3.83464 13.5 3.83464H6.5C5.09987 3.83464 4.3998 3.83464 3.86502 4.10712C3.39462 4.3468 3.01217 4.72925 2.77248 5.19966C2.5 5.73444 2.5 6.4345 2.5 7.83464V14.8346C2.5 16.2348 2.5 16.9348 2.77248 17.4696C3.01217 17.94 3.39462 18.3225 3.86502 18.5622C4.3998 18.8346 5.09987 18.8346 6.5 18.8346Z" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Select time</span>
                </div>
                <svg width="21" height="21" viewBox="0 0 21 21" fill="none">
                    <path d="M10.4986 11.4766L14.6236 7.35156L15.802 8.5299L10.4986 13.8332L5.19531 8.5299L6.37365 7.35156L10.4986 11.4766Z" fill="#667085" />
                </svg>
            </div>

            {open && (
                <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-md max-h-[400px] overflow-y-auto p-4">
                    {weekdays.map((day) => (
                        <div
                            key={day}
                            className="flex gap-4 py-2 justify-between items-center"
                        >
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id={`day-${day}`}
                                    checked={isDaySelected(day)}
                                    onChange={() => handleCheckboxChange(day)}
                                    className="accent-[#2357C6] w-5 h-5 p-2"
                                />
                                <label htmlFor={`day-${day}`} className="w-24 font-semibold text-base text-[#344054]">
                                    {day}
                                </label>
                            </div>

                            <div className="flex gap-2 items-center">
                                <div className="relative flex items-center border border-gray-300 rounded-md px-4 py-2 text-sm bg-white w-32 gap-2">
                                    <div className="relative w-full">
                                        <input
                                            type="time"
                                            value={getDayTime(day, 'TimeFrom')}
                                            onChange={(e) => handleTimeChange(day, 'TimeFrom', e.target.value)}
                                            disabled={!isDaySelected(day)}
                                            className={`w-full outline-none bg-transparent ${isDaySelected(day) ? 'text-black' : 'text-gray-300'}`}
                                        />
                                        {!getDayTime(day, 'TimeFrom') && (
                                            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-900 pointer-events-none">
                                                From
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <span className="text-gray-500">-</span>

                                <div className="relative flex items-center border border-gray-300 rounded-md px-4 py-2 text-sm bg-white w-32 gap-2">
                                    <div className="relative w-full">
                                        <input
                                            type="time"
                                            value={getDayTime(day, 'TimeTo')}
                                            onChange={(e) => handleTimeChange(day, 'TimeTo', e.target.value)}
                                            disabled={!isDaySelected(day)}
                                            className={`w-full outline-none bg-transparent ${isDaySelected(day) ? 'text-black' : 'text-gray-300'}`}
                                        />
                                        {!getDayTime(day, 'TimeTo') && (
                                            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-900 pointer-events-none">
                                                To
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AvailabilityTimePicker;
