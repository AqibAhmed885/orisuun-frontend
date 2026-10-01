import React, { useState } from 'react';
import { X } from 'react-feather';

interface PDFTimeframeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (options: PDFGenerateOptions) => void;
  selectedCity?: string;
  selectedEventType?: string;
  selectedCountry?: string;
  selectedDates?: Date[];
}

export interface PDFGenerateOptions {
  timeframeType: 'all-future' | 'date-range' | 'selected-dates';
  startDate?: Date;
  endDate?: Date;
  city?: string;
  eventType?: string;
  country?: string;
  dates?: Date[];
}

const PDFTimeframeSelector: React.FC<PDFTimeframeSelectorProps> = ({
  isOpen,
  onClose,
  onGenerate,
  selectedCity,
  selectedEventType,
  selectedCountry,
  selectedDates = [],
}) => {
  const [timeframeType, setTimeframeType] = useState<'all-future' | 'date-range' | 'selected-dates'>(
    selectedDates.length > 0 ? 'selected-dates' : 'all-future'
  );
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const handleGenerate = () => {
    const options: PDFGenerateOptions = {
      timeframeType,
      city: selectedCity,
      eventType: selectedEventType,
      country: selectedCountry,
    };

    if (timeframeType === 'date-range' && startDate && endDate) {
      options.startDate = new Date(startDate);
      options.endDate = new Date(endDate);
    } else if (timeframeType === 'selected-dates') {
      options.dates = selectedDates;
    }

    onGenerate(options);
    onClose();
  };

  const isGenerateDisabled = () => {
    if (timeframeType === 'date-range') {
      return !startDate || !endDate || new Date(startDate) > new Date(endDate);
    }
    if (timeframeType === 'selected-dates') {
      return selectedDates.length === 0;
    }
    return false;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Generate PDF</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Display selected filters */}
          {(selectedCity || selectedEventType || selectedCountry) && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">Selected Filters:</h3>
              <div className="space-y-1 text-sm text-blue-700">
                {selectedCity && <p>City: {selectedCity}</p>}
                {selectedEventType && <p>Event Type: {selectedEventType}</p>}
                {selectedCountry && <p>Country: {selectedCountry}</p>}
              </div>
            </div>
          )}

          {/* Timeframe Selection */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">Select Timeframe:</h3>

            {/* All Future Events Option */}
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="radio"
                name="timeframe"
                value="all-future"
                checked={timeframeType === 'all-future'}
                onChange={(e) => setTimeframeType(e.target.value as 'all-future')}
                className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">All Future Events</span>
                <p className="text-xs text-gray-500 mt-0.5">
                  Include all upcoming events from today onwards
                </p>
              </div>
            </label>

            {/* Selected Dates Option */}
            {selectedDates.length > 0 && (
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="timeframe"
                  value="selected-dates"
                  checked={timeframeType === 'selected-dates'}
                  onChange={(e) => setTimeframeType(e.target.value as 'selected-dates')}
                  className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900">
                    Selected Dates ({selectedDates.length})
                  </span>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {selectedDates.length === 1
                      ? selectedDates[0].toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })
                      : `${selectedDates.length} dates selected`
                    }
                  </p>
                </div>
              </label>
            )}

            {/* Date Range Option */}
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="radio"
                name="timeframe"
                value="date-range"
                checked={timeframeType === 'date-range'}
                onChange={(e) => setTimeframeType(e.target.value as 'date-range')}
                className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900">Custom Date Range</span>
                <p className="text-xs text-gray-500 mt-0.5 mb-3">
                  Specify a custom date range for events
                </p>

                {timeframeType === 'date-range' && (
                  <div className="space-y-3 ml-0">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    {startDate && endDate && new Date(startDate) > new Date(endDate) && (
                      <p className="text-xs text-red-600">
                        End date must be after start date
                      </p>
                    )}
                  </div>
                )}
              </div>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={isGenerateDisabled()}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${
              isGenerateDisabled()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            Generate PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default PDFTimeframeSelector;
