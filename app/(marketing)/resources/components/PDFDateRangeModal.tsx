"use client";

import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { CalendarPicker } from "@/components/calendar/calendar";
import { Calendar } from "react-feather";


interface PDFDateRangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: (startDate: Date, endDate: Date) => void;
  downloading: boolean;
}

export default function PDFDateRangeModal({
  isOpen,
  onClose,
  onDownload,
  downloading,
}: PDFDateRangeModalProps) {
  const [startDate, setStartDate] = useState<Date>(new Date(2024, 0, 1)); // Jan 1, 2024
  const [endDate, setEndDate] = useState<Date>(new Date(2025, 11, 31)); // Dec 31, 2025
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const startCalendarRef = useRef<HTMLDivElement>(null);
  const endCalendarRef = useRef<HTMLDivElement>(null);

  // Close calendars when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (startCalendarRef.current && !startCalendarRef.current.contains(event.target as Node)) {
        setShowStartCalendar(false);
      }
      if (endCalendarRef.current && !endCalendarRef.current.contains(event.target as Node)) {
        setShowEndCalendar(false);
      }
    };

    if (showStartCalendar || showEndCalendar) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showStartCalendar, showEndCalendar]);

  const formatDateForDisplay = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });
  };

  const handleDownload = () => {
    if (startDate && endDate && startDate <= endDate) {
      onDownload(startDate, endDate);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Select Date Range for PDF</h2>
          <button
            onClick={onClose}
            disabled={downloading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <div className="relative" ref={startCalendarRef}>
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-omblue-300 z-10" size={20} />
              <input
                type="text"
                value={formatDateForDisplay(startDate)}
                onFocus={() => setShowStartCalendar(true)}
                onClick={() => setShowStartCalendar(true)}
                readOnly
                placeholder="MM/DD/YYYY"
                disabled={downloading}
                className="w-full px-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-omblue-500 focus:border-transparent disabled:opacity-50 cursor-pointer bg-white"
              />
              {showStartCalendar && (
                <div className="absolute z-50 top-full mt-2 left-0 right-0">
                  <CalendarPicker
                    selectedDate={startDate}
                    handleDateSelectFromCalender={(date) => {
                      setStartDate(date);
                      setShowStartCalendar(false);
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <div className="relative" ref={endCalendarRef}>
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-omblue-300 z-10" size={20} />
              <input
                type="text"
                value={formatDateForDisplay(endDate)}
                onFocus={() => setShowEndCalendar(true)}
                onClick={() => setShowEndCalendar(true)}
                readOnly
                placeholder="MM/DD/YYYY"
                disabled={downloading}
                className="w-full px-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-omblue-500 focus:border-transparent disabled:opacity-50 cursor-pointer bg-white"
              />
              {showEndCalendar && (
                <div className="absolute z-50 top-full mt-2 left-0 right-0">
                  <CalendarPicker
                    selectedDate={endDate}
                    handleDateSelectFromCalender={(date) => {
                      setEndDate(date);
                      setShowEndCalendar(false);
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {startDate > endDate && (
            <p className="text-sm text-red-500">
              Start date must be before or equal to end date
            </p>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={downloading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDownload}
            disabled={downloading || startDate > endDate}
            className="flex-1 px-4 py-2 bg-omblue-600 text-white rounded-lg font-semibold hover:bg-omblue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {downloading ? "Generating PDF..." : "Download PDF"}
          </button>
        </div>
      </div>
    </div>
  );
}
