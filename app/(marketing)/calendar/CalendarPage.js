"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import 'react-datepicker/dist/react-datepicker.css';
import EventForm from './popups/addevents';
import Events from './components/events';
import Image from 'next/image';
import ShareEvents from "./popups/ShareEvents";
import VerticalScrollCalendar from './components/VerticalScrollCalendar';
import HorizontalScrollCalendar from './components/HorizontalScrollCalendar';
import DateSelector from './components/DateSelectorAnimation';
import './components/vartical.css';
import { fetchCitiesList, downloadEventsPdf } from '../../api/marketing/eventService';

const CalendarPage = () => {
  const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePopup, setActivePopup] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [tempSelectedDate, setTempSelectedDate] = useState(new Date());
  const [showTooltip, setShowTooltip] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [pdfDate, setPdfDate] = useState('')
  const dropdownRef = useRef(null);
  const containerRef = useRef(null);

  // Generate dates array based on selected date
  const generateDatesArray = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const datesArray = [];
    const maxDatesToShow = 4;

    for (let i = 0; i < maxDatesToShow; i++) {
      const currentDate = new Date(year, month, date.getDate() + i);
      datesArray.push({
        day: currentDate.toLocaleDateString('en-US', { weekday: 'short' }),
        date: currentDate.getDate(),
        fullDate: new Date(currentDate)
      });
    }

    return datesArray;
  };

  const [dates, setDates] = useState(generateDatesArray(new Date()));
  const [selectedDates, setSelectedDates] = useState([dates[0]?.date]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragPosition, setDragPosition] = useState(0);
  const [previewWidth, setPreviewWidth] = useState(0);
  const [upliftedEvents, setUpliftedEvents] = useState([]);
  const [openShareModel, setOpenShareModel] = useState(false);
  const [selectedEventType, setSelectedEventType] = useState(null);

  useEffect(() => {
    const newDates = generateDatesArray(selectedDate);
    setDates(newDates);
    if (newDates.length > 0) {
      setSelectedDates([new Date(newDates[0].fullDate)]);
    }
  }, [selectedDate]);

  const filteredCities = cities.filter(city =>
    city.CityName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const calculateInitialWidth = () => {
    if (!containerRef.current) return 0;
    return (selectedDates.length / dates.length) * containerRef.current.offsetWidth / 3;
  };

  const handleDragStart = useCallback((e) => {
    setIsDragging(true);
    setShowTooltip(true);
    const clientX = e.clientX || e.touches[0].clientX;
    setDragStartX(clientX);
    setDragPosition(clientX);
    setPreviewWidth(calculateInitialWidth());
    e.preventDefault();
  }, [selectedDates, dates.length]);

  const handleDrag = useCallback((e) => {
    if (!isDragging || !containerRef.current) return;

    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    if (!clientX) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const constrainedX = Math.max(containerRect.left, Math.min(clientX, containerRect.right));

    setDragPosition(constrainedX);

    const relativeX = constrainedX - containerRect.left;
    const newWidth = Math.max(0, Math.min(relativeX, containerRect.width));

    setPreviewWidth(newWidth);
  }, [isDragging]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging || !containerRef.current) return;
    setShowTooltip(false);

    const containerRect = containerRef.current.getBoundingClientRect();
    const dateWidth = containerRect.width / dates.length;
    const selectedCount = Math.round(previewWidth / dateWidth);

    const newSelectedDates = dates
      .slice(0, Math.max(1, selectedCount))
      .map(d => new Date(d.fullDate));

    setSelectedDates(newSelectedDates);
    setIsDragging(false);
  }, [isDragging, dates, previewWidth]);

  const handleDateClick = (dateIndex) => {
    const newSelectedDates = dates
      .slice(0, dateIndex + 1)
      .map(d => d.fullDate);
    setSelectedDates(newSelectedDates);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDrag);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleDrag);
      window.addEventListener('touchend', handleDragEnd);
      return () => {
        window.removeEventListener('mousemove', handleDrag);
        window.removeEventListener('mouseup', handleDragEnd);
        window.removeEventListener('touchmove', handleDrag);
        window.removeEventListener('touchend', handleDragEnd);
      };
    }
  }, [isDragging, handleDrag, handleDragEnd]);

  useEffect(() => {
    const fetchCities = async () => {
      setLoading(true);
      setError(null);
      try {
        const citiesData = await fetchCitiesList();
        setCities(citiesData);
      } catch (error) {
        setError(error);
        console.error('Error fetching city data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  const openPopup = (popupName) => {
    setActivePopup(popupName);
  };

  const handleBackClick = () => {
    setSelectedCity("");
    setSearchTerm("");
  };

  const closePopup = () => {
    setActivePopup(null);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setSelectedCity("");
    if (!isDropdownOpen) setIsDropdownOpen(true);
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city.CityName);
    setSearchTerm(city.CityName);
    setIsDropdownOpen(false);

    // Scroll/focus logic: set selectedDates to first event date for this city
    // upliftedEvents is populated by the Events component via UpliftFilteredEvents
    const cityEvents = upliftedEvents.filter(
      (e) => e.location && e.location.toLowerCase() === city.CityName.toLowerCase()
    );

    if (cityEvents.length > 0) {
      // pick the nearest or earliest event to scroll to
      cityEvents.sort((a, b) => new Date(a.EventDate) - new Date(b.EventDate));
      setSelectedDates([new Date(cityEvents[0].EventDate)]);
    } else {
      // fallback to current selectedDate (or first displayed date)
      setSelectedDates([dates[0]?.fullDate]);
    }
  };

  function UpliftFilteredEvents(events) {
    setUpliftedEvents(events);
  }

  const downloadPdf = async () => {
    setDownloadingPDF(true);
    try {
      const filters = {};

      if (selectedDate) {
        filters.date = selectedDate.toISOString().split('T')[0];
      }

      if (selectedCity) {
        filters.city = selectedCity;
      }

      if (selectedEventType) {
        filters.eventType = selectedEventType;
      }

      if (selectedDates && selectedDates.length > 0) {
        const dates = selectedDates.map(d => new Date(d).toISOString().split('T')[0]);
        if (dates.length > 1) {
          filters.startDate = dates[0];
          filters.endDate = dates[dates.length - 1];
        }
      }



      const blob = await downloadEventsPdf(filters);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Global Black Business Events-\n ${pdfDate}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF download failed:', error);
    } finally {
      setDownloadingPDF(false);
    }
  };

  useEffect(() => {
    const options = { month: 'short', day: '2-digit', year: 'numeric' };
    const formatted = selectedDate.toLocaleDateString('en-US', options);
    const [month, day, year] = formatted.replace(',', '').split(' ');
    setPdfDate(`${month} ${day}, ${year}`);
  }, [selectedDate])

  return (
    <>
      <ShareEvents
        isOpen={openShareModel}
        onClose={() => setOpenShareModel(false)}
        eventData={upliftedEvents}
      />
      {activePopup === 'EventForm' && <EventForm closePopup={closePopup} />}
      <div className="w-full flex flex-col lg:py-24 py-12">
        {/* Header section */}
        <div className="flex items-center justify-between md:pb-[120px] gap-8 lg:px-16 px-4 md:flex-row flex-col">
          {/* Left Section */}
          <div className="xl:w-[967px] md:w-[660px] w-full">
            <h1 className="xl:text-h14 lg:text-h12 text-[40px] font-bold text-blue-strong small-767:leading-none">
              GLOBAL BLACK
              <div className="w-full md:text-right text-left">
                BUSINESS{' '}
                <span className="small-767:block small-767:text-right small-767:pe-[122px] pe-0">
                  EVENTS
                </span>
              </div>
              <div className="flex md:flex-row flex-col xl:gap-12 gap-6 md:items-center items-start">
                <div>
                  CALENDAR
                  <svg
                    className=" h-3 xl:h-auto lg:h-[18px] w-full"
                    xmlns="http://www.w3.org/2000/svg"
                    width="488"
                    height="28"
                    viewBox="0 0 488 28"
                    fill="none"
                  >
                    <path
                      d="M2 2C145.783 4.48419 289.828 6.36664 433.384 10.6473C469.037 11.7104 516.302 13.0327 459.846 14.6482C399.771 16.3673 339.362 16.5352 279.23 18.0361C241.655 18.974 203.429 19.7617 166.154 22.1984C146.4 23.4898 205.871 24.2957 225.846 24.6506C290.674 25.8027 355.581 26.1542 420.461 25.9413C426.781 25.9205 450.655 25.7822 459.076 25.6831C464.316 25.6215 479.13 26.4832 474.769 25.2637C471.296 24.2927 456.269 25.0022 452.538 24.941C430.604 24.5816 408.844 24.9348 386.923 25.2314"
                      stroke="#E5EEF9"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <p className="text-[#16357A] lg:text-xl text-base font-medium ">
                  Discover and track key events in the Black <br />
                  business community.
                </p>
              </div>
            </h1>
          </div>

          {/* Right Section */}
          <div className="small-767:flex small-767:flex-col-reverse gap-12">
            <button
              onClick={() => openPopup('EventForm')}
              className="bg-omblue-500 text-lg font-semibold text-white px-2 rounded-xl small-767:w-[340px] w-[190px] h-[48px] leading-[18px] tracking-[ 0.16px]"
            >
              + Add event
            </button>
            <div className="relative px-5 text-base font-medium leading-4 text-nav-blue pt-2 flex flex-col gap-2 justify-start tracking-[ 0.16px]">
              <div className="pt-[2px] ml-[-10px] md:relative md:rotate-0 md:right-auto md:bottom-auto absolute rotate-[145deg] right-0 bottom-[-40px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="101"
                  height="47"
                  viewBox="0 0 101 47"
                  fill="none"
                >
                  <g clipPath="url(#clip0_2736_38735)">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M38.3948 49.5109C36.276 49.2171 34.1367 49.6968 32.1096 51.2255C25.8391 55.955 25.0747 62.5549 27.1646 69.2456C30.2165 79.0152 39.4417 88.9697 45.9226 93.2001C46.2293 93.4009 46.6401 93.3135 46.8393 93.0074C47.04 92.7007 46.9542 92.2894 46.6474 92.0887C40.3569 87.983 31.3927 78.3307 28.4301 68.8494C26.5114 62.7059 27.1493 56.628 32.9092 52.2849C34.6226 50.991 36.4293 50.5923 38.2213 50.8361C38.08 52.0097 37.9737 53.1718 37.9034 54.3202C37.7102 57.4906 38.7345 65.7025 41.506 70.9779C43.495 74.7616 46.3778 77.0336 50.2085 75.4669C52.3375 74.5957 53.3868 72.6672 53.5324 70.1752C53.7345 66.7492 52.1838 62.2038 49.6351 58.2507C47.5136 54.959 44.7079 52.0818 41.7015 50.5759C41.04 50.2462 40.3699 49.9789 39.6944 49.7871C41.9634 33.5483 50.8731 15.7968 62.9021 5.18242C63.1753 4.93955 63.2031 4.5211 62.9596 4.24636C62.7178 3.97102 62.2983 3.94534 62.0245 4.18664C49.8001 14.9751 40.7328 32.9956 38.3948 49.5109ZM39.5219 51.1245C39.3916 52.2277 39.2932 53.3205 39.2276 54.401C39.0434 57.4391 40.0249 65.3059 42.6805 70.3602C44.3098 73.4622 46.5672 75.5234 49.7068 74.2395C51.3553 73.5643 52.0944 72.0269 52.2093 70.0975C52.3336 67.975 51.7135 65.3984 50.5921 62.8255C48.8895 58.9191 46.0263 55.024 42.7443 52.742C41.7049 52.0185 40.6222 51.4599 39.5219 51.1245Z"
                      fill="#2357C6"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M59.4909 29.6848C57.9816 21.9174 59.8126 12.3466 62.918 5.02428C63.0608 4.68755 62.9028 4.29816 62.5661 4.15531C62.2294 4.01246 61.8394 4.16889 61.6966 4.50562C58.4933 12.0564 56.6335 21.9297 58.189 29.9373C58.2583 30.2958 58.6067 30.5309 58.9667 30.4609C59.3252 30.3916 59.5603 30.0432 59.4909 29.6848Z"
                      fill="#2357C6"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M61.5675 4.4032C57.3723 9.48228 49.3245 13.0086 42.756 13.7229C42.3915 13.7623 42.127 14.0896 42.168 14.4534C42.2074 14.8179 42.534 15.0808 42.8984 15.0414C49.7797 14.293 58.1947 10.5688 62.5899 5.24762C62.8234 4.96608 62.783 4.54656 62.5014 4.31305C62.2183 4.08014 61.8004 4.12009 61.5675 4.4032Z"
                      fill="#2357C6"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_2736_38735">
                      <rect
                        width="78"
                        height="78"
                        fill="white"
                        transform="translate(0 27.5898) rotate(-20.7139)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <div className="small-767:ps-32">
                It&apos;s free. <br />
                Incredibly free!
              </div>

            </div>
          </div>
        </div>

        <div className="w-full lg:px-16 px-4 md:mt-8 mt-14">
          <div
            className="flex items-center gap-2 border-b border-[#D9D9D9] pb-2 relative"
            ref={containerRef}
            onMouseMove={handleDrag}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            style={{
              minWidth: `${dates.length * 80}px`
            }}
          >
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="w-[98px] h-[48px] flex items-center gap-1 px-3 py-2 border-2 rounded-lg border-[#EEEFF1] hover:bg-gray-100 bg-[#F5F7FA] text-z-black text-lg font-medium"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
              >
                <g clipPath="url(#clip0_2748_29452)">
                  <path
                    d="M22.6667 2.66797C21.9333 2.66797 21.3333 3.26797 21.3333 4.0013V5.33464H10.6667V4.0013C10.6667 3.26797 10.0667 2.66797 9.33333 2.66797C8.6 2.66797 8 3.26797 8 4.0013V5.33464H6.66667C5.18667 5.33464 4.01333 6.53464 4.01333 8.0013L4 26.668C4 28.1346 5.18667 29.3346 6.66667 29.3346H25.3333C26.8 29.3346 28 28.1346 28 26.668V8.0013C28 6.53464 26.8 5.33464 25.3333 5.33464H24V4.0013C24 3.26797 23.4 2.66797 22.6667 2.66797ZM25.3333 26.668H6.66667V13.3346H25.3333V26.668ZM14.6667 17.3346C14.6667 16.6013 15.2667 16.0013 16 16.0013C16.7333 16.0013 17.3333 16.6013 17.3333 17.3346C17.3333 18.068 16.7333 18.668 16 18.668C15.2667 18.668 14.6667 18.068 14.6667 17.3346ZM9.33333 17.3346C9.33333 16.6013 9.93333 16.0013 10.6667 16.0013C11.4 16.0013 12 16.6013 12 17.3346C12 18.068 11.4 18.668 10.6667 18.668C9.93333 18.668 9.33333 18.068 9.33333 17.3346ZM20 17.3346C20 16.6013 20.6 16.0013 21.3333 16.0013C22.0667 16.0013 22.6667 16.6013 22.6667 17.3346C22.6667 18.068 22.0667 18.668 21.3333 18.668C20.6 18.668 20 18.068 20 17.3346ZM14.6667 22.668C14.6667 21.9346 15.2667 21.3346 16 21.3346C16.7333 21.3346 17.3333 21.9346 17.3333 22.668C17.3333 23.4013 16.7333 24.0013 16 24.0013C15.2667 24.0013 14.6667 23.4013 14.6667 22.668ZM9.33333 22.668C9.33333 21.9346 9.93333 21.3346 10.6667 21.3346C11.4 21.3346 12 21.9346 12 22.668C12 23.4013 11.4 24.0013 10.6667 24.0013C9.93333 24.0013 9.33333 23.4013 9.33333 22.668ZM20 22.668C20 21.9346 20.6 21.3346 21.3333 21.3346C22.0667 21.3346 22.6667 21.9346 22.6667 22.668C22.6667 23.4013 22.0667 24.0013 21.3333 24.0013C20.6 24.0013 20 23.4013 20 22.668Z"
                    fill="#0A193A"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_2748_29452">
                    <rect width="32" height="32" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <span className="small-767:hidden">Date</span>
            </button>

            <DateSelector
              dates={dates}
              selectedDates={selectedDates}
              handleDateClick={handleDateClick}
              isDragging={isDragging}
              previewWidth={previewWidth}
              handleDragStart={handleDragStart}
              showTooltip={showTooltip}
              containerRef={containerRef}
            />
          </div>

          {showDatePicker && (
            <>
              <div className="small-767:block hidden">
                <VerticalScrollCalendar
                  selectedDate={tempSelectedDate}
                  onDateSelect={(date) => {
                    setTempSelectedDate(date);
                    setSelectedDate(date);
                    setShowDatePicker(false);
                  }}
                  onCancel={() => setShowDatePicker(false)}
                />
              </div>

              <HorizontalScrollCalendar
                tempSelectedDate={tempSelectedDate}
                setTempSelectedDate={setTempSelectedDate}
                setSelectedDate={setSelectedDate}
                setShowDatePicker={setShowDatePicker}
              />
            </>
          )}

          {/* City search and action buttons */}
          <div className="relative z-1 flex items-center justify-between mt-7 px-0 md:px-3 md:flex-row flex-col gap-3 w-full">
            <div className="relative md:max-w-[333px] w-full" ref={dropdownRef}>
              <input
                type="text"
                className="px-5 border border-[rgba(0, 0, 0, 0.17)] rounded-[10px] w-full h-[48px] text-base text-z-black font-medium"
                placeholder={loading ? "Loading cities..." : "Check a city"}
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => setIsDropdownOpen(true)}
                disabled={loading}
              />
              {isDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full max-h-60 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg">
                  {filteredCities.length > 0 ? (
                    filteredCities.map((city, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleCitySelect(city)}
                      >
                        {city.CityName}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-500">
                      No cities found
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex w-full gap-3 ">
              <button onClick={() => { setOpenShareModel(true) }} className="small-767:w-full flex items-center gap-2 px-6 py-3 border border-omblue-100 rounded-[10px] text-omblue-500 text-lg font-medium bg-[rgba(35, 87, 198, 0.03)]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M17 22C16.1667 22 15.4583 21.7083 14.875 21.125C14.2917 20.5417 14 19.8333 14 19C14 18.9 14.025 18.6667 14.075 18.3L7.05 14.2C6.78333 14.45 6.475 14.6458 6.125 14.7875C5.775 14.9292 5.4 15 5 15C4.16667 15 3.45833 14.7083 2.875 14.125C2.29167 13.5417 2 12.8333 2 12C2 11.1667 2.29167 10.4583 2.875 9.875C3.45833 9.29167 4.16667 9 5 9C5.4 9 5.775 9.07083 6.125 9.2125C6.475 9.35417 6.78333 9.55 7.05 9.8L14.075 5.7C14.0417 5.58333 14.0208 5.47083 14.0125 5.3625C14.0042 5.25417 14 5.13333 14 5C14 4.16667 14.2917 3.45833 14.875 2.875C15.4583 2.29167 16.1667 2 17 2C17.8333 2 18.5417 2.29167 19.125 2.875C19.7083 3.45833 20 4.16667 20 5C20 5.83333 19.7083 6.54167 19.125 7.125C19.7083 7.70833 17.8333 8 17 8C16.6 8 16.225 7.92917 15.875 7.7875C15.525 7.64583 15.2167 7.45 14.95 7.2L7.925 11.3C7.95833 11.4167 7.97917 11.5292 7.9875 11.6375C7.99583 11.7458 8 11.8667 8 12C8 12.1333 7.99583 12.2542 7.9875 12.3625C7.97917 12.4708 7.95833 12.5833 7.925 12.7L14.95 16.8C15.2167 16.55 15.525 16.3542 15.875 16.2125C16.225 16.0708 16.6 16 17 16C17.8333 16 18.5417 16.2917 19.125 16.875C19.7083 17.4583 20 18.1667 20 19C20 19.8333 19.7083 20.5417 19.125 21.125C19.7083 21.7083 17.8333 22 17 22ZM17 20C17.2833 20 17.5208 19.9042 17.7125 19.7125C17.9042 19.5208 18 19.2833 18 19C18 18.7167 17.9042 18.4792 17.7125 18.2875C17.5208 18.0958 17.2833 18 17 18C16.7167 18 16.4792 18.0958 16.2875 18.2875C16.0958 18.4792 16 18.7167 16 19C16 19.2833 16.0958 19.5208 16.2875 19.7125C16.4792 19.9042 16.7167 20 17 20ZM5 13C5.28333 13 5.52083 12.9042 5.7125 12.7125C5.90417 12.5208 6 12.2833 6 12C6 11.7167 5.90417 11.4792 5.7125 11.2875C5.52083 11.0958 5.28333 11 5 11C4.71667 11 4.47917 11.0958 4.2875 11.2875C4.09583 11.4792 4 11.7167 4 12C4 12.2833 4.09583 12.5208 4.2875 12.7125C4.47917 12.9042 4.71667 13 5 13ZM17 6C17.2833 6 17.5208 5.90417 17.7125 5.7125C17.9042 5.52083 18 5.28333 18 5C18 4.71667 17.9042 4.47917 17.7125 4.2875C17.5208 4.09583 17.2833 4 17 4C16.7167 4 16.4792 4.09583 16.2875 4.2875C16.0958 4.47917 16 4.71667 16 5C16 5.28333 16.0958 5.52083 16.2875 5.7125C16.4792 5.90417 16.7167 6 17 6Z"
                    fill="#2357C6"
                  />
                </svg>
                Share
              </button>
              <button onClick={() => { downloadPdf() }} className="small-767:w-full flex items-center gap-2 px-6 py-3 border border-omblue-100 text-nowrap rounded-[10px] text-omblue-500 text-lg font-medium bg-[rgba(35, 87, 198, 0.03)]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M2.88 0C1.28942 0 0 1.28942 0 2.88V21.12C0 22.7106 1.28942 24 2.88 24H21.12C22.7106 24 24 22.7106 24 21.12V2.88C24 1.28942 22.7106 0 21.12 0H2.88ZM4.4101 15.1399C4.50754 15.2066 4.66893 15.24 4.89426 15.24C5.11959 15.24 5.28098 15.2066 5.37842 15.1399C5.47586 15.0732 5.53676 14.9883 5.56112 14.8852C5.58548 14.776 5.59766 14.6638 5.59766 14.5486V13.3568H6.76694C7.02272 13.3568 7.28155 13.3113 7.54342 13.2203C7.80529 13.1233 8.04584 12.9838 8.26509 12.8018C8.49042 12.6138 8.67007 12.3803 8.80406 12.1013C8.94412 11.8223 9.01416 11.4978 9.01416 11.1279C9.01416 10.7518 8.94412 10.4243 8.80406 10.1453C8.67007 9.86634 8.49042 9.63283 8.26509 9.44481C8.04584 9.25073 7.80529 9.1082 7.54342 9.01723C7.28764 8.92624 7.03186 8.88076 6.77607 8.88076H4.9034C4.67807 8.88076 4.51668 8.91412 4.41924 8.98083C4.3218 9.04755 4.2609 9.13549 4.23654 9.24467C4.21218 9.34777 4.2 9.45694 4.2 9.57218V14.5395C4.2 14.6547 4.21218 14.7669 4.23654 14.8761C4.2609 14.9853 4.31875 15.0732 4.4101 15.1399ZM6.77607 11.974H5.59766V10.2636H6.76694C6.93746 10.2636 7.08666 10.3 7.21456 10.3728C7.34854 10.4456 7.45207 10.5456 7.52515 10.673C7.59823 10.8004 7.63477 10.949 7.63477 11.1188C7.63477 11.3189 7.58909 11.4827 7.49774 11.61C7.41248 11.7374 7.30286 11.8314 7.16889 11.8921C7.04099 11.9467 6.91006 11.974 6.77607 11.974ZM9.82425 15.1399C9.92169 15.2066 10.077 15.24 10.2901 15.24H11.9162C12.3668 15.24 12.781 15.1581 13.1585 14.9944C13.5422 14.8306 13.8772 14.6062 14.1634 14.3211C14.4496 14.03 14.6719 13.6904 14.8302 13.3022C14.9886 12.908 15.0678 12.4834 15.0678 12.0285C15.0678 11.5797 14.9886 11.1643 14.8302 10.7822C14.6719 10.4001 14.4496 10.0665 14.1634 9.78142C13.8772 9.49636 13.5453 9.27499 13.1677 9.1173C12.7901 8.95961 12.3821 8.88076 11.9436 8.88076H10.2993C10.0739 8.87469 9.91256 8.90502 9.81512 8.97174C9.71768 9.03845 9.65678 9.12639 9.63242 9.23557C9.60806 9.33867 9.59588 9.44785 9.59588 9.56308V14.5395C9.59588 14.6608 9.6111 14.776 9.64156 14.8852C9.672 14.9883 9.73291 15.0732 9.82425 15.1399ZM11.9436 13.8481H10.9844V10.2636H11.9344C12.2694 10.2636 12.5678 10.3424 12.8297 10.5001C13.0915 10.6518 13.2986 10.864 13.4509 11.137C13.6031 11.4099 13.6792 11.7192 13.6792 12.0649C13.6792 12.4106 13.6031 12.7169 13.4509 12.9838C13.2986 13.2507 13.0915 13.4629 12.8297 13.6206C13.0915 13.7722 12.2724 13.8481 11.9436 13.8481ZM15.9994 15.149C16.0968 15.2097 16.2552 15.24 16.4744 15.24C16.7058 15.24 16.8672 15.2097 16.9586 15.149C17.056 15.0823 17.1169 14.9974 17.1413 14.8943C17.1656 14.7851 17.1778 14.6729 17.1778 14.5577V12.6381H19.0414C19.1693 12.6381 19.2789 12.629 19.3702 12.6108C19.4677 12.5926 19.5438 12.5441 19.5986 12.4652C19.6534 12.3803 19.6808 12.2408 19.6808 12.0467C19.6808 11.8466 19.6534 11.7041 19.5986 11.6191C19.5438 11.5342 19.4677 11.4827 19.3702 11.4645C19.2789 11.4463 19.1723 11.4372 19.0505 11.4372H17.1778V10.2636H18.9766C19.0984 10.2636 19.2111 10.2545 19.3146 10.2363C19.4242 10.212 19.5125 10.1514 19.5795 10.0543C19.6465 9.95731 19.68 9.79962 19.68 9.58128C19.68 9.3508 19.6465 9.18705 19.5795 9.09001C19.5186 8.99296 19.4364 8.93534 19.3329 8.91715C19.2293 8.89289 19.1167 8.88076 18.9949 8.88076H16.5018C16.2339 8.88076 16.0481 8.92928 15.9446 9.02632C15.8411 9.12336 15.7893 9.30532 15.7893 9.57218V14.5486C15.7893 14.6638 15.7984 14.776 15.8167 14.8852C15.8411 14.9944 15.902 15.0823 15.9994 15.149Z"
                    fill="#16357A"
                  />
                </svg>
                {downloadingPDF ? "Downloading..." : "Create PDF"}
              </button>
            </div>
          </div>
        </div>

        {selectedCity && (
          <button onClick={handleBackClick} className="relative left-5 md:left-20 text-[18px] flex items-center gap-2 pt-[1%]">
            <Image
              src={`${staticUrl}/icons/calendar/backArrow.png`}
              alt="Back"
              width={28}
              height={28}
              className="w-7 h-7"
            />
            Back to all categories
          </button>
        )}

        <Events
          selectedCity={selectedCity}
          selectedDates={selectedDates}
          UpliftFilteredEvents={UpliftFilteredEvents}
          onEventTypeSelect={setSelectedEventType}
        />
      </div>
    </>
  );
};

export default CalendarPage;
