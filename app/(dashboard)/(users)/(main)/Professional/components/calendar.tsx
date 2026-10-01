"use client";

import React, { useEffect, useMemo, useState } from "react";

type CalendarProps = {
    availableDayNumbers?: number[];
    availableDaysOfWeek?: number[];
    selectedDates?: string[];
    onToggleDate?: (dateString: string) => void;
    initialMonth?: Date;
};

type CalendarDay = {
    dayNumber: number;
    otherMonth: boolean;
    dateString: string;
};

const startOfMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1);

const Calendar: React.FC<CalendarProps> = ({
    availableDayNumbers = [],
    availableDaysOfWeek = [],
    selectedDates,
    onToggleDate,
    initialMonth,
}) => {
    const [currentMonth, setCurrentMonth] = useState<Date>(() =>
        startOfMonth(initialMonth || new Date())
    );

    const [internalSelectedDates, setInternalSelectedDates] = useState<string[]>(
        selectedDates || []
    );

    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const isControlled = selectedDates !== undefined;

    useEffect(() => {
        if (initialMonth) {
            setCurrentMonth(startOfMonth(initialMonth));
        }
    }, [initialMonth]);

    const handlePreviousMonth = () => {
        setCurrentMonth((previousMonth) =>
            new Date(
                previousMonth.getFullYear(),
                previousMonth.getMonth() - 1,
                1
            )
        );
    };

    const handleNextMonth = () => {
        setCurrentMonth((previousMonth) =>
            new Date(
                previousMonth.getFullYear(),
                previousMonth.getMonth() + 1,
                1
            )
        );
    };

    const activeSelectedDates = useMemo(() => {
        return isControlled ? selectedDates || [] : internalSelectedDates;
    }, [isControlled, selectedDates, internalSelectedDates]);

    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    const normalizeDateString = (dateString: string) => {
        const [year, month, day] = dateString.split("-").map(Number);

        if (!year || !month || !day) return dateString;

        return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
            2,
            "0"
        )}`;
    };

    const getDateFromString = (dateString: string) => {
        const [year, month, day] = normalizeDateString(dateString)
            .split("-")
            .map(Number);

        return new Date(year, month - 1, day);
    };

    const todayString = formatDate(new Date());

    const selectedDateKeys = useMemo(() => {
        return activeSelectedDates.map(normalizeDateString);
    }, [activeSelectedDates]);

    const getWeekRows = (days: CalendarDay[]) => {
        const rows: CalendarDay[][] = [];

        for (let i = 0; i < days.length; i += 7) {
            rows.push(days.slice(i, i + 7));
        }

        return rows;
    };

    const generateCalendarDays = (forMonth: Date) => {
        const year = forMonth.getFullYear();
        const month = forMonth.getMonth();

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

        const days: CalendarDay[] = [];

        for (let i = 0; i < totalCells; i++) {
            if (i < firstDay) {
                days.push({
                    dayNumber: 0,
                    otherMonth: true,
                    dateString: "",
                });
            } else if (i >= firstDay + daysInMonth) {
                days.push({
                    dayNumber: 0,
                    otherMonth: true,
                    dateString: "",
                });
            } else {
                const dayNumber = i - firstDay + 1;
                const d = new Date(year, month, dayNumber);

                days.push({
                    dayNumber,
                    otherMonth: false,
                    dateString: formatDate(d),
                });
            }
        }

        return days;
    };

    const handleToggleDate = (dateString: string, isOtherMonth: boolean) => {
        if (isOtherMonth || !dateString) return;

        const normalizedDate = normalizeDateString(dateString);

        if (!isControlled) {
            setInternalSelectedDates((prev) => {
                const normalizedPrev = prev.map(normalizeDateString);

                if (normalizedPrev.includes(normalizedDate)) {
                    return normalizedPrev.filter((date) => date !== normalizedDate);
                }

                return [...normalizedPrev, normalizedDate].sort(
                    (a, b) =>
                        getDateFromString(a).getTime() - getDateFromString(b).getTime()
                );
            });
        }

        onToggleDate?.(normalizedDate);
    };

    return (
        <div className="px-4">
            <div className="flex items-center justify-center gap-3 mb-4">
                <button
                    type="button"
                    onClick={handlePreviousMonth}
                    className="relative z-20 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:text-[#2357C6]"
                    aria-label="Previous month"
                >
                    <svg
                        width="8"
                        height="15"
                        viewBox="0 0 8 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M6.90625 13.5859L0.906251 7.12418L6.90625 0.662414"
                            stroke="currentColor"
                            strokeWidth="1.3259"
                            strokeLinecap="round"
                        />
                    </svg>
                </button>

                <div className="text-xl font-medium min-w-[150px] text-center">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </div>

                <button
                    type="button"
                    onClick={handleNextMonth}
                    className="relative z-20 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:text-[#2357C6]"
                    aria-label="Next month"
                >
                    <svg
                        width="8"
                        height="15"
                        viewBox="0 0 8 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M0.664062 0.664062L6.66406 7.12583L0.664062 13.5876"
                            stroke="currentColor"
                            strokeWidth="1.3259"
                            strokeLinecap="round"
                        />
                    </svg>
                </button>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center text-sm text-gray-600 mb-3">
                {["SU", "MO", "TU", "WE", "TH", "FR", "SA"].map((day) => (
                    <div key={day} className="font-medium">
                        {day}
                    </div>
                ))}
            </div>

            <div className="space-y-3">
                {getWeekRows(generateCalendarDays(currentMonth)).map(
                    (week, weekIndex) => {
                        const selectedIndexes = week
                            .map((cell, index) =>
                                !cell.otherMonth &&
                                    cell.dateString &&
                                    selectedDateKeys.includes(normalizeDateString(cell.dateString))
                                    ? index
                                    : -1
                            )
                            .filter((index) => index >= 0);

                        const selectedRuns: Array<{ start: number; end: number }> = [];

                        selectedIndexes.forEach((index) => {
                            const lastRun = selectedRuns[selectedRuns.length - 1];

                            if (!lastRun || index !== lastRun.end + 1) {
                                selectedRuns.push({ start: index, end: index });
                                return;
                            }

                            lastRun.end = index;
                        });

                        return (
                            <div
                                key={weekIndex}
                                className="relative grid grid-cols-7 gap-3 overflow-visible"
                            >
                                <div className="absolute inset-0 grid grid-cols-7 gap-3 z-0 pointer-events-none">
                                    {selectedRuns.map((run) => (
                                        <div
                                            key={`${weekIndex}-${run.start}-${run.end}`}
                                            style={{
                                                gridColumn: `${run.start + 1} / ${run.end + 2}`,
                                            }}
                                            className="h-12 rounded-full bg-[#EEF3FF]"
                                        />
                                    ))}
                                </div>

                                {week.map((cell, idx) => {
                                    if (cell.otherMonth) {
                                        return (
                                            <div
                                                key={`${weekIndex}-${idx}`}
                                                className="h-12 flex items-center justify-center"
                                            />
                                        );
                                    }

                                    const normalizedDate = normalizeDateString(cell.dateString);

                                    const isSelected = selectedDateKeys.includes(normalizedDate);

                                    const isToday = normalizedDate === todayString;

                                    const cellDate = getDateFromString(normalizedDate);

                                    const isAvailable =
                                        availableDayNumbers.includes(cell.dayNumber) ||
                                        availableDaysOfWeek.includes(cellDate.getDay());

                                    return (
                                        <button
                                            key={`${weekIndex}-${idx}`}
                                            type="button"
                                            onClick={() => handleToggleDate(normalizedDate, false)}
                                            className="relative z-10 h-12 flex items-center justify-center cursor-pointer"
                                        >
                                            <div
                                                className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors text-lg ${isSelected
                                                        ? "bg-omblue-500 text-white font-medium"
                                                        : isToday
                                                            ? "bg-omblue-500 text-white font-medium"
                                                            : isAvailable
                                                                ? "bg-gray-100 text-gray-800 font-light"
                                                                : "text-gray-800 font-light"
                                                    }`}
                                            >
                                                {cell.dayNumber}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        );
                    }
                )}
            </div>
        </div>
    );
};

export default Calendar;
