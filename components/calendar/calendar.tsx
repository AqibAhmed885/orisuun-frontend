import React, { useEffect, useRef, useState } from 'react';
import Calendar from 'react-calendar';
import { format } from 'date-fns';
import ChevronDown from '@/icons/chevron-down';
import { getEventTypeConfig } from '@/utils/event-type-config';
import './style.css';
import { View } from 'react-calendar/dist/esm/shared/types.js';

const startOfMonth = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), 1);

interface ICalenderButtonProps {
  handleDateSelectFromCalender?: (date: Date) => void;
  selectedDate?: Date;
  eventTypesByDate?: Record<string, string[]>;
  bookedMeetingDates?: Record<string, true>;
  onMonthChange?: (year: number, month: number) => void;
}
  
  export const CalendarPicker: React.FC<ICalenderButtonProps> = ({
    handleDateSelectFromCalender,
    selectedDate,
    eventTypesByDate = {},
    bookedMeetingDates = {},
    onMonthChange,
  }) => {
    const [value, setValue] = useState<Date>(selectedDate || new Date());
    const [activeStartDate, setActiveStartDate] = useState<Date>(() =>
      startOfMonth(selectedDate || new Date())
    );
    const [view, setView] = useState<View>('month');
    const initializedRef = useRef(false);
    const dateSelectHandlerRef = useRef(handleDateSelectFromCalender);
    const selectedDateKey = format(value, 'yyyy-MM-dd');

    useEffect(() => {
      dateSelectHandlerRef.current = handleDateSelectFromCalender;
    }, [handleDateSelectFromCalender]);
  
    useEffect(() => {
      if (selectedDate) {
        setValue(selectedDate);
        setActiveStartDate(startOfMonth(selectedDate));
      }
    }, [selectedDate]);
  
    useEffect(() => {
      if (initializedRef.current && dateSelectHandlerRef.current) {
        dateSelectHandlerRef.current(value);
      }
      initializedRef.current = true;
    }, [value]);
  
    const handleChange = (newValue: Date | [Date, Date]) => {
      const date = Array.isArray(newValue) ? newValue[0] : newValue;
      setValue(date);
      setActiveStartDate(startOfMonth(date));
    };

    const tileContent = ({
      date, view: tileView }: { date: Date; view: View }) => {
      if (tileView !== 'month') return null;
      const key = format(date, 'yyyy-MM-dd');
      const eventTypes = eventTypesByDate[key] || [];
      const hasBookedMeeting = bookedMeetingDates[key];
      if (!eventTypes.length && !hasBookedMeeting) return null;

      const dots = eventTypes.slice(0, 4);
      return (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-50 flex flex-col items-center gap-[2px]">
          {dots.length > 0 && (
            <div className="flex items-center justify-center gap-[2px]">
              {dots.map((eventType, i) => (
                <span
                  key={`${eventType}-${i}`}
                  style={{ backgroundColor: getEventTypeConfig(eventType).color }}
                  className="inline-block h-[4px] w-[4px] rounded-full"
                />
              ))}
            </div>
          )}
          {hasBookedMeeting && (
            <span
              className="calendar-booking-indicator block h-[3px] w-5  bg-[#2357C6]"
              aria-hidden="true"
            />
          )}
        </div>
      );
    };

    return (
      <div className="relative p-4 bg-white rounded-2xl shadow-blur own-calendar">
        <Calendar
          onChange={handleChange}
          value={value}
          activeStartDate={activeStartDate}
          view={view}
          tileClassName={({ date, view: tileView }) => {
            if (tileView !== 'month') return null;

            return format(date, 'yyyy-MM-dd') === selectedDateKey ? 'calendar-selected-day' : null;
          }}
          tileContent={tileContent}
          onClickMonth={(date) => {
            setActiveStartDate(startOfMonth(date));
            setView('month');
          }}
          navigationLabel={({ date }) => {
            return view === 'month' ? (
              <span className="flex flex-row justify-center gap-1 items-center">
                {format(date, 'MMM yyyy')}
                <ChevronDown className="fill-[#797B86]" />
              </span>
            ) : (
              <span className="disabled">{date.getFullYear()}</span>
            );
          }}
          onActiveStartDateChange={({ activeStartDate, view: newView }) => {
            if (activeStartDate) {
              setActiveStartDate(activeStartDate);
            }
            setView(newView);
            if (newView === 'month' && activeStartDate && onMonthChange) {
              onMonthChange(activeStartDate.getFullYear(), activeStartDate.getMonth() + 1);
            }
          }}
        />
      </div>
    );
  };
