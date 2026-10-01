'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CloseIcon } from '../../../../public/icons/calendar/Icons.tsx';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReCAPTCHA from 'react-google-recaptcha';
import { submitEvent, getCountryAndCityList, fetchEventTypes, checkEventExists } from '../../../api/marketing/eventService.js';
import { DateTime } from 'luxon';
import { getTimeZones } from '@vvo/tzdb';
import 'moment-timezone';
import { useMemo } from 'react';
import { notifySearchEngines } from '../../../../utils/sitemapNotifier';

export default function EventForm({ closePopup }) {
  const [eventTypes, setEventTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cityOptions, setCityOptions] = useState([]);
  const [formData, setFormData] = useState({
    eventType: '',
    eventName: '',
    country: '',
    city: '',
    date: '',
    startTime: '',
    endTime: '',
    sponsor: '',
    link: '',
    email: '',
    isAllDay: false,
    locationType: 'physical',
    timezone: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captcha, setCaptcha] = useState(null);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [eventExists, setEventExists] = useState(false);
  const [checkingEvent, setCheckingEvent] = useState(false);

  //Handle TimeZones including Daylight savings
  const timeZones = getTimeZones()
  const allTimeZones = timeZones.map(tz => {
    const now = DateTime.now();
    const baseDate = formData.date
      ? DateTime.fromISO(formData.date).set({
        hour: now.hour,
        minute: now.minute,
        second: now.second,
      })
      : now;

    // Helper to get DST-aware abbreviation
    function FormatTimeZone(timezoneName) {
      const output = baseDate.setZone(timezoneName);
      if (!output.isInDST) return null;

      const result = output.offsetNameShort;
      if (/[0-9+\-:]/.test(result)) return null;

      return result;
    }
    function GetDLSAbbreviation(timezoneName){
      const output = DateTime.fromISO('2025-05-15T00:00:00').setZone(timezoneName);
      if (!output.isInDST) return null;
      const result = output.offsetNameShort;
      if (/[0-9+\-:]/.test(result)) return null;
      return result;
    }

    const zoneTime = baseDate.setZone(tz.name);
    return {
      name: tz.name,
      country: tz.countryName || '',
      mainCities: tz.mainCities ? tz.mainCities.join(', ') : '',
      abbreviation: FormatTimeZone(tz.name) || tz.abbreviation,
      formattedOffset: `UTC${tz.currentTimeFormat.includes('+') ? '+' : '-'}${Math.abs(tz.rawOffsetInMinutes / 60)}`,
      currentTime: zoneTime.toFormat('HH:mm'),
      abbreviationSTD: tz.abbreviation,
      abbreviationDLS: GetDLSAbbreviation(tz.name) || tz.abbreviation,
    };
  }).sort((a, b) => a.country.localeCompare(b.country));

  // Search and dropdown states
  const [countrySearchTerm, setCountrySearchTerm] = useState('');
  const [citySearchTerm, setCitySearchTerm] = useState('');
  const [timezoneSearchTerm, setTimezoneSearchTerm] = useState('');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isTimezoneDropdownOpen, setIsTimezoneDropdownOpen] = useState(false);
  const countryDropdownRef = useRef(null);
  const cityDropdownRef = useRef(null);
  const timezoneDropdownRef = useRef(null);
  // Duplicate check control
  const checkSeqRef = useRef(0); // prevents out-of-order responses from overwriting latest state
  const debounceRef = useRef(null); // debounce timer for typing

  // Filter countries based on search term
  const filteredCountries = countries.filter(country =>
    country.CountryName.toLowerCase().includes(countrySearchTerm.toLowerCase())
  );

  // Filter cities based on search term and country selection
  const filteredCities = cities.filter(city =>
    city.CityName.toLowerCase().includes(citySearchTerm.toLowerCase()) &&
    (selectedCountry ? city.CountryId == selectedCountry : true)
  );

  const filteredTimezones = useMemo(() => {
    const searchLower = timezoneSearchTerm.toLowerCase();
    return allTimeZones.filter(tz => {
      // Check direct matches with enhanced priority for country names
      const countryMatch = tz.country.toLowerCase().includes(searchLower);
      const cityMatch = tz.mainCities.toLowerCase().includes(searchLower);
      const tzNameMatch = tz.name.toLowerCase().includes(searchLower);
      const abbrevMatch = tz.abbreviationSTD.toLowerCase().includes(searchLower);
      const abbrevDLSMatch = tz.abbreviationDLS.toLowerCase().includes(searchLower);

      return countryMatch || cityMatch || tzNameMatch || abbrevMatch || abbrevDLSMatch;
    }).sort((a, b) => {
      // Prioritize exact country matches
      const aCountryMatch = a.country.toLowerCase().includes(searchLower);
      const bCountryMatch = b.country.toLowerCase().includes(searchLower);
      if (aCountryMatch && !bCountryMatch) return -1;
      if (!aCountryMatch && bCountryMatch) return 1;
      return 0;
    });
  }, [timezoneSearchTerm]);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target)) {
        setIsCountryDropdownOpen(false);
      }
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target)) {
        setIsCityDropdownOpen(false);
      }
      if (timezoneDropdownRef.current && !timezoneDropdownRef.current.contains(event.target)) {
        setIsTimezoneDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch event types and countries/cities
  useEffect(() => {
    const fetchEventTypesAndCountries = async () => {
      setLoading(true);
      setError(null);

      try {
        const [eventTypesData, locationData] = await Promise.all([
          fetchEventTypes(),
          getCountryAndCityList()
        ]);

        setEventTypes(eventTypesData);
        setCountries(locationData.countries);
        setCities(locationData.cities);
      } catch (error) {
        setError(error);
        toast.error('Failed to load event data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchEventTypesAndCountries();
  }, []);

  // Immediate check on blur (ensures final value is checked without debounce)
  const runImmediateEventCheck = async () => {
    const name = (formData.eventName || '').trim();
    const type = formData.eventType;
    if (!type || !name || name.length < 3) return;

    const seq = ++checkSeqRef.current;
    setCheckingEvent(true);
    try {
      const exists = await checkEventExists(name, type);
      if (seq === checkSeqRef.current) {
        setEventExists(exists === true);
      }
    } catch (err) {
      if (seq === checkSeqRef.current) {
        setEventExists(false);
      }
    } finally {
      if (seq === checkSeqRef.current) {
        setCheckingEvent(false);
      }
    }
  };

  // Debounced check while typing to avoid API spam and handle race conditions
  useEffect(() => {
    const name = (formData.eventName || '').trim();
    const type = formData.eventType;

    // Guard: reset when inputs are incomplete
    if (!type || !name || name.length < 3) {
      setEventExists(false);
      setCheckingEvent(false);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      return;
    }

    // Debounce user typing
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setCheckingEvent(true);
    const seq = ++checkSeqRef.current;

    debounceRef.current = setTimeout(async () => {
      try {
        const exists = await checkEventExists(name, type);
        if (seq === checkSeqRef.current) {
          setEventExists(exists === true);
        }
      } catch (err) {
        if (seq === checkSeqRef.current) {
          setEventExists(false);
        }
      } finally {
        if (seq === checkSeqRef.current) {
          setCheckingEvent(false);
        }
      }
    }, 450);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [formData.eventType, formData.eventName]);

  // Handle country selection
  const handleCountrySelect = (country) => {
    setSelectedCountry(country.Id);
    setFormData({
      ...formData,
      country: country.Id,
      city: '' // Reset city when country changes
    });
    setCountrySearchTerm(country.CountryName);
    setIsCountryDropdownOpen(false);
  };

  // Handle city selection
  const handleCitySelect = (city) => {
    setFormData({
      ...formData,
      city: city.CityName,
      timezone: city.Timezone // Assuming the city data now includes Timezone field
    });
    setCitySearchTerm(city.CityName);
    setIsCityDropdownOpen(false);

    // Calculate and display current time in that timezone
    if (city.Timezone) {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: city.Timezone,
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      });
      const timeString = formatter.format(now);

      // Get UTC offset
      const offsetFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: city.Timezone,
        timeZoneName: 'longOffset'
      });
      const offsetString = offsetFormatter.formatToParts(now)
        .find(part => part.type === 'timeZoneName').value;

      toast.info(`Current time in ${city.CityName}: ${timeString} (${offsetString})`);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAllDayChange = (e) => {
    const isAllDay = e.target.value === 'allDay';
    setFormData({
      ...formData,
      isAllDay,
      startTime: isAllDay ? '' : formData.startTime,
      endTime: isAllDay ? '' : formData.endTime
    });
  };

  const handleLocationTypeChange = (type) => {
    setFormData({
      ...formData,
      locationType: type,
      country: type === 'online' ? '' : formData.country,
      city: type === 'online' ? '' : formData.city,
    });
    setSelectedCountry('');
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.eventType) errors.eventType = 'Event type is required';
    if (!formData.eventName) errors.eventName = 'Event name is required';

    // Location validation based on location type
    if (formData.locationType === 'physical' || formData.locationType === 'both') {
      if (!formData.country) errors.country = 'Country is required';
      if (!formData.city) errors.city = 'City is required';
    }

    if (!formData.date) errors.date = 'Date is required';
    if (!formData.isAllDay && !formData.timezone) {
      errors.timezone = 'Timezone is required';
    }
    if (!formData.isAllDay) {
      if (!formData.startTime) errors.startTime = 'Start time is required';
    }
    if (!formData.sponsor) errors.sponsor = 'Sponsor is required';
    if (!formData.link) errors.link = 'Event link is required';
    if (!captcha) errors.recaptcha = 'Please complete the reCAPTCHA';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      eventType: '',
      eventName: '',
      country: '',
      city: '',
      date: '',
      startTime: '',
      endTime: '',
      sponsor: '',
      link: '',
      email: '',
      isAllDay: false,
      locationType: 'physical',
      timezone: ''
    });
    setCityOptions([]);
    setSelectedCountry('');
    setCountrySearchTerm('');
    setCitySearchTerm('');
    setTimezoneSearchTerm('');
    setFormErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    const payload = {
      Title: formData.eventName,
      Description: '',
      EventDate: formData.date,
      EventStartTime: formData.isAllDay ? null : `${formData.date}T${formData.startTime}:00`,
      EventEndTime: formData.isAllDay ? null : formData.endTime ? `${formData.date}T${formData.endTime}:00` : null,
      EventLink: formData.link,
      CountryId: formData.locationType === 'online' ? 0 : formData.country,
      CityName: formData.locationType === 'online' ? '' : formData.city,
      ContactEmail: formData.email || '',
      Status: 'Active',
      EventsTypeId: formData.eventType,
      CreatedBy: formData.sponsor,
      CreatedAt: new Date().toISOString(),
      UpdatedAt: new Date().toISOString(),
      IsDeleted: false,
      IsActive: true,
      ModifiedBy: formData.sponsor,
      ModifiedAt: new Date().toISOString(),
      AllDay: formData.isAllDay,
      LocationType: formData.locationType.charAt(0).toUpperCase() + formData.locationType.slice(1),
      Timezone: formData.timezone
    };

    try {
      await submitEvent(payload, captcha);
      toast.success('Event added successfully!');
      
      // Notify search engines about the new event (non-blocking)
      notifySearchEngines('event').catch(err => 
        console.warn('Failed to notify search engines:', err)
      );
      
      resetForm();
      closePopup();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.57)] z-[999]">
      <div className="bg-white md:p-8 p-5 rounded-[20px] shadow-price5 w-[370px] md:w-[530px]">
        <div className="sticky top-0 bg-white pb-4 z-10">
          <div className="flex gap-2 justify-between items-start">
            <div className="flex flex-col gap-1 justify-between items-start">
              <h2 className="text-[24px] font-semibold text-blue-strong">New event</h2>
              <p className="text-blu-ray-300 text-[16px] text-base font-medium">Please provide the following details</p>
            </div>
            <button onClick={closePopup}>
              <CloseIcon size={30} />
            </button>
          </div>
        </div>

        <div className="max-h-[77dvh] pr-3 overflow-auto">
          <div className="flex flex-col gap-4">
            {/* Event Type */}
            <div className="flex gap-1 flex-col mb-4">
              <label className="text-z-black text-[14px] font-medium">Event type</label>
              <select
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                className="w-full h-[44px] px-4 border rounded"
              >
                <option className='text-sm' value="">Select Event Type</option>
                {loading && <option disabled>Loading...</option>}
                {error && <option disabled>Error: {error.message}</option>}
                {eventTypes &&
                  eventTypes.map((eventType) => (
                    <option className='text-sm' key={eventType.id} value={eventType.Id}>
                      {eventType.Title}
                    </option>
                  ))}
              </select>
              {formErrors.eventType && <p className="text-red-500 text-xs">{formErrors.eventType}</p>}
            </div>

            <hr />

            {/* Name of Event */}
            <div className="flex gap-2 flex-col mt-4">
              <label className="text-z-black text-[14px] font-medium">Name of event</label>
              <input
                type="text"
                name="eventName"
                value={formData.eventName}
                onChange={handleChange}
                onBlur={runImmediateEventCheck}
                placeholder="Official title of event"
                className="w-full h-[44px] px-4 border rounded"
              />
              {formErrors.eventName && <p className="text-red-500 text-xs">{formErrors.eventName}</p>}
              {checkingEvent && <p className="text-blue-500 text-xs mt-1">Checking if event exists...</p>}
              {eventExists && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  ⚠ An event with this name and type already exists. Please choose a different name or type.
                </p>
              )}
            </div>

            {/* Location Type */}
            <div className="flex flex-col gap-2">
              <label className="text-z-black text-sm font-medium">Location Type</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="locationType"
                    value="physical"
                    checked={formData.locationType === 'physical'}
                    onChange={() => handleLocationTypeChange('physical')}
                    className="h-4 w-4"
                  />
                  <span>Physical</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="locationType"
                    value="online"
                    checked={formData.locationType === 'online'}
                    onChange={() => handleLocationTypeChange('online')}
                    className="h-4 w-4"
                  />
                  <span>Online</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="locationType"
                    value="both"
                    checked={formData.locationType === 'both'}
                    onChange={() => handleLocationTypeChange('both')}
                    className="h-4 w-4"
                  />
                  <span>Both</span>
                </label>
              </div>
            </div>

            {/* Country & City - Only show for physical or both */}
            {(formData.locationType === 'physical' || formData.locationType === 'both') && (
              <div className="flex gap-2 flex-col md:flex-row">
                {/* Country Search */}
                <div className="w-full md:w-1/2 relative" ref={countryDropdownRef}>
                  <label className="text-z-black text-[14px] font-medium">Country</label>
                  <input
                    type="text"
                    value={countrySearchTerm}
                    onChange={(e) => {
                      setCountrySearchTerm(e.target.value);
                      setIsCountryDropdownOpen(true);
                      setSelectedCountry('');
                      setFormData({ ...formData, country: '', city: '' });
                    }}
                    onFocus={() => setIsCountryDropdownOpen(true)}
                    placeholder="Search country"
                    className="w-full h-[44px] px-4 border rounded"
                  />
                  {isCountryDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full max-h-60 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg">
                      {filteredCountries.length > 0 ? (
                        filteredCountries.map((country, index) => (
                          <div
                            key={index}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleCountrySelect(country)}
                          >
                            {country.CountryName}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-gray-500">
                          No countries found
                        </div>
                      )}
                    </div>
                  )}
                  {formErrors.country && <p className="text-red-500 text-xs">{formErrors.country}</p>}
                </div>

                {/* City Search */}
                <div className="w-full md:w-1/2 relative" ref={cityDropdownRef}>
                  <label className="text-z-black text-sm font-medium">City</label>
                  <input
                    type="text"
                    value={citySearchTerm}
                    onChange={(e) => {
                      setCitySearchTerm(e.target.value);
                      setIsCityDropdownOpen(true);
                    }}
                    onFocus={() => {
                      if (selectedCountry) setIsCityDropdownOpen(true);
                      else toast.warning('Please select a country first');
                    }}
                    placeholder={selectedCountry ? "Search city" : "Select country first"}
                    disabled={!selectedCountry}
                    className="w-full h-[44px] px-4 border rounded"
                  />
                  {isCityDropdownOpen && selectedCountry && (
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
                  {formErrors.city && <p className="text-red-500 text-xs">{formErrors.city}</p>}
                </div>
              </div>
            )}

            {/* Other fields */}
            {/* Date */}
            <div className="flex gap-2 flex-col">
              <label className="text-z-black text-sm font-medium">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full h-[44px] px-4 border rounded"
              />
              {formErrors.date && <p className="text-red-500 text-xs">{formErrors.date}</p>}
            </div>



            {/* Time Duration Options */}
            <div className="flex flex-col gap-2">
              <label className="text-z-black text-sm font-medium">Time duration</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="timeDuration"
                    value="specificTime"
                    checked={!formData.isAllDay}
                    onChange={handleAllDayChange}
                    className="h-4 w-4"
                  />
                  <span>Specific Time</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="timeDuration"
                    value="allDay"
                    checked={formData.isAllDay}
                    onChange={handleAllDayChange}
                    className="h-4 w-4"
                  />
                  <span>All Day</span>
                </label>
              </div>
            </div>

            {/* Start Time & End Time - Only show when not All Day */}
            {!formData.isAllDay && (
              <div>
                <div className="flex gap-2">
                  <div className="w-1/2">
                    <label className="text-z-black text-sm font-medium">Start time (local time)</label>
                    <input
                      type="time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleChange}
                      className="w-[147.31px] md:w-[221px] h-[44px] px-4 border rounded"
                    />
                    {formErrors.startTime && <p className="text-red-500 text-xs">{formErrors.startTime}</p>}
                  </div>
                  <div className="w-1/2">
                    <label className="text-z-black text-sm font-medium">End time</label>
                    <input
                      type="time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleChange}
                      className="w-[147.31px] md:w-[221px] h-[44px] px-4 border rounded"
                    />
                    {formErrors.endTime && <p className="text-red-500 text-xs">{formErrors.endTime}</p>}
                  </div>
                </div>
                {/* Timezone */}
                <div className="flex gap-2 flex-col mb-4 mt-4">
                  <label className="text-z-black text-[14px] font-medium">Time Zone</label>
                  <div className="relative" ref={timezoneDropdownRef}>
                    <input
                      type="text"
                      value={timezoneSearchTerm}
                      onChange={(e) => {
                        setTimezoneSearchTerm(e.target.value);
                        setIsTimezoneDropdownOpen(true);
                      }}
                      onFocus={() => setIsTimezoneDropdownOpen(true)}
                      placeholder="Search by country (e.g. Brazil) or time zone (e.g. WAT)"
                      className="w-full h-[44px] px-4 border rounded placeholder:text-sm"
                    />


                    {isTimezoneDropdownOpen && (
                      <div className="absolute z-10 mt-1 w-full max-h-96 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg">
                        {filteredTimezones.length > 0 ? (
                          filteredTimezones.map((tz, index) => (
                            <div
                              key={index}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  timezone: `${tz.formattedOffset} (${tz.abbreviation})`
                                }));
                                setTimezoneSearchTerm(`${tz.country} - ${tz.mainCities.split(',')[0]} (${tz.abbreviation})`);
                                setIsTimezoneDropdownOpen(false);
                              }}
                            >
                              <div className="font-semibold">
                                {tz.country} - <span className="font-medium text-gray-700">{tz.mainCities.split(',')[0]}</span>
                                <span className="ml-2 font-medium text-gray-700">{tz.abbreviation}</span>
                              </div>
                              <div className="text-xs text-gray-500 flex justify-between items-center">
                                <span>{tz.formattedOffset}</span>
                                <span>Current: {tz.currentTime}</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div>No data found</div>
                        )}
                      </div>
                    )}

                  </div>
                  {formErrors.timezone && <p className="text-red-500 text-xs">{formErrors.timezone}</p>}
                </div></div>
            )}


            {/* Sponsor */}
            <div className="flex gap-2 flex-col mb-4">
              <label className="text-z-black text-sm font-medium">Sponsor</label>
              <input
                type="text"
                name="sponsor"
                value={formData.sponsor}
                onChange={handleChange}
                placeholder="Who is hosting this event"
                className="w-full h-[44px] px-4 border rounded"
                disabled={eventExists}
              />
              {formErrors.sponsor && <p className="text-red-500 text-xs">{formErrors.sponsor}</p>}
            </div>

            <hr />

            {/* Link */}
            <div className="flex gap-2 flex-col my-4">
              <label className="text-z-black text-sm font-medium">Link (link will be shortened)</label>
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleChange}
                placeholder="Link to learn more"
                className="w-full h-[44px] px-4 border rounded"
              />
              {formErrors.link && <p className="text-red-500 text-xs">{formErrors.link}</p>}
            </div>

            <hr />

            {/* Email */}
            <div className="my-4">
              <label className="text-z-black text-sm font-medium">Email (optional)</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your email will not be displayed"
                className="w-full h-[44px] px-4 border rounded"
              />
              {formErrors.email && <p className="text-red-500 text-xs">{formErrors.email}</p>}
            </div>

            {/* Add reCAPTCHA above the submit button */}
            <div>
              {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ? (
                <ReCAPTCHA
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                  onChange={setCaptcha}
                  onErrored={() => toast.error('reCAPTCHA error. Please try again.')}
                />
              ) : (
                <p className="text-yellow-600 text-xs">reCAPTCHA not configured</p>
              )}
              {formErrors.recaptcha && <p className="text-red-500 text-xs">{formErrors.recaptcha}</p>}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full h-[44px] px-4 bg-omblue-500 text-white rounded transition"
              disabled={isSubmitting || checkingEvent || eventExists}
            >
              {isSubmitting ? 'Adding event...' : 'Add event'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}