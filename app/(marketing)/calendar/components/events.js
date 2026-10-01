import React, { useState, useEffect, useMemo } from 'react';
import {
  EyeIcon,
} from '../../../../public/icons/calendar/Icons.tsx';
import EventCard from './EventCard.js';
import { fetchCountries, fetchEventTypes, fetchEvents } from '../../../api/marketing/eventService.js';
import ShareEvents from '../popups/ShareEvents.js';
import AddToCalendarPopup from '../popups/AddToCalendarPopup.js';
import EditEventPopup from '../popups/EditEventPopup.js';
import DeleteEventPopup from '../popups/DeleteEventPopup.js';
import ConferenceTimeline from './ConferenceTimeline.js';
import Image from 'next/image.js';
import { all } from 'axios';
import { set } from 'lodash';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const month = date.toLocaleString('default', { month: 'short' });
  const day = date.getDate();
  return {
    date: `${month} ${day}`,
    day: day.toString().padStart(2, '0'),
    month: date.toLocaleString('default', { month: 'long' }),
    year: date.getFullYear(),
    isoDate: dateString
  };
};

const Events = ({ selectedCity, selectedDates, UpliftFilteredEvents, onEventTypeSelect }) => {
  const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;
  const [activeEvent, setActiveEvent] = useState(null);
  const [openPopup, setOpenPopup] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allEvents, setAllEvents] = useState([]);
  const [eventTypeMapping, setEventTypeMapping] = useState({});
  const [countries, setCountries] = useState([]);

  // Improved date comparison function
  const isSameDay = (date1, date2) => {
    if (!date1 || !date2) return false;

    try {
      const d1 = new Date(date1);
      const d2 = new Date(date2);

      return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
    } catch (e) {
      console.error('Error comparing dates:', e);
      return false;
    }
  };

  // Find the nearest event (future or past) from a given list
  const findNearestEvent = (events) => {
    if (events.length === 0) return [];

    const now = new Date();
    const futureEvents = events.filter(event => new Date(event.EventDate) >= now);
    const pastEvents = events.filter(event => new Date(event.EventDate) < now);
    futureEvents.sort((a, b) => new Date(a.EventDate) - new Date(b.EventDate));
    pastEvents.sort((a, b) => new Date(b.EventDate) - new Date(a.EventDate));
    return futureEvents.length > 0 ? [futureEvents[0]] : pastEvents.length > 0 ? [pastEvents[0]] : [];
  };

  // Filter events by dates or return nearest event if no matches
  const filterEventsByDates = (events) => {
    if (!selectedDates || selectedDates.length === 0) {
      return events;
    }

    const filtered = events.filter(event => {
      try {
        if (!event.EventDate) return false;

        const eventDate = new Date(event.EventDate);
        return selectedDates.some(selectedDate =>
          isSameDay(eventDate, selectedDate)
        );
      } catch (e) {
        console.error('Error filtering event:', e);
        return false;
      }
    });


    return filtered;
  };

  // Fetch countries
  useEffect(() => {
    const getCountries = async () => {
      try {
        const countriesData = await fetchCountries();
        setCountries(countriesData);
      } catch (err) {
        console.error('Error fetching countries:', err);
      }
    };

    getCountries();
  }, []);

  // Update the event types fetch
  useEffect(() => {
    const getEventTypes = async () => {
      try {
        const eventTypes = await fetchEventTypes();
        const mapping = eventTypes.reduce((acc, event) => {
          acc[event.Id] = event.Title;
          return acc;
        }, {});
        setEventTypeMapping(mapping);
      } catch (err) {
        console.error('Error fetching event types:', err);
      }
    };

    getEventTypes();
  }, []);

  // Fetch and filter events
  useEffect(() => {
    const getEvents = async () => {
      try {
        const eventsData = await fetchEvents();


        const getEventTypeName = (id) => eventTypeMapping[id] || '';
        const getCountryName = (id) => {
          if (!countries || countries.length === 0) return '';
          const country = countries.find(c => c.Id == id);
          return country ? country.CountryName : '';
        };

        const transformedEvents = eventsData
          .filter((event) => event.CityName) // Skip events without CityName
          .map((event) => {
            const formattedDate = formatDate(event.EventDate);
            const startTime = event.EventStartTime?.split('T')[1]?.split(':').slice(0, 2).join(':') || '';
            const endTime = event.EventEndTime?.split('T')[1]?.split(':').slice(0, 2).join(':') || '';


            return {
              id: event.Id,
              date: formattedDate.date,
              day: formattedDate.day,
              time: startTime,
              timezone: 'UTC-8 (PST)',
              title: event.Title,
              role: event.CreatedBy || event.Sponsor,
              location: event.CityName,
              link: event.EventLink,
              month: formattedDate.month,
              year: formattedDate.year,
              type: getEventTypeName(event.EventsTypeId),
              typeId: event.EventsTypeId,
              country: getCountryName(event.CountryId),
              countryId: event.CountryId,
              cityName: event.CityName,
              cityId: event.CityId,
              EventDate: event.EventDate,
              EventStartTime: startTime,
              EventEndTime: endTime,
              Description: event.Description,
              LocationType: event.LocationType,
              Timezone: event.TimeZone,
              details: {
                description: event.Description || 'No description available',
                agenda: [
                  { time: startTime, activity: 'Event starts' },
                  { time: endTime, activity: 'Event ends' },
                ],
                speakers: [],
              },
            };
          });
        
        setAllEvents(transformedEvents);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError(err.message.includes('JSON') ? 'The server returned an invalid response. Please try again later.' : err.message);
        setLoading(false);
      }
    };

    if (Object.keys(eventTypeMapping).length > 0) {
      getEvents();
    }
  }, [eventTypeMapping, countries]);

  // Filter events based on selected city and dates
  const filteredEvents = useMemo(() => {
    let result = [...allEvents];

    // Filter by city if selected
    if (selectedCity) {
      result = result.filter(
        event => event.location?.toLowerCase() === selectedCity.toLowerCase()
      );
    }

    // Only apply date filtering if no category is active
    if (!activeCategory) {
      result = filterEventsByDates(result);
    }

    return result;
  }, [allEvents, selectedCity, selectedDates, activeCategory]);

  // Get events to display in timeline view (with fallback to nearest event)
  const timelineEvents = useMemo(() => {
    if (filteredEvents.length > 0) {
      return filteredEvents;
    }

    // If no filtered events, find nearest event from the relevant subset
    let eventsSubset = [...allEvents];
    if (selectedCity) {
      eventsSubset = eventsSubset.filter(
        event => event.location.toLowerCase() === selectedCity.toLowerCase()
      );
    }
    if (activeCategory) {
      eventsSubset = eventsSubset.filter(
        event => event.type === activeCategory.name
      );
    }


    return findNearestEvent(eventsSubset);
  }, [filteredEvents, allEvents, selectedCity, activeCategory]);

  // Group filtered events by type for category display
  const filteredEventCategories = useMemo(() => {
    const eventsByType = filteredEvents.reduce((acc, event) => {
      const type = event.type || 'General';
      if (!acc[type]) {
        acc[type] = {
          id: type.toLowerCase().replace(/\s+/g, '-'),
          name: type,
          description: `${type} Events`,
          events: [],
        };
      }
      acc[type].events.push(event);
      return acc;
    }, {});

    return Object.values(eventsByType);
  }, [filteredEvents]);

  const selectedYear = useMemo(() => {
    if (selectedDates && selectedDates.length > 0) {
      const firstDate = new Date(selectedDates[0]);
      return firstDate.getFullYear();
    }
    return null;
  }, [selectedDates]);

  const selectedDateISO = useMemo(() => {
    if (selectedDates && selectedDates.length > 0) {
      return selectedDates[0]; // ISO format date string
    }
    return null;
  }, [selectedDates]);

  const handleEventClick = (event) => {
    setActiveEvent(activeEvent === event ? null : event);
  };

  const openPopupHandler = (popupName, event = activeEvent) => {
    setActiveEvent(event);
    setOpenPopup(popupName);
  };

  const closePopupHandler = () => {
    setOpenPopup(null);
  };

  const handleEyeClick = (category) => {
    const categoryEvents = allEvents.filter(event => event.type === category.name);
    setActiveCategory({
      ...category,
      events: categoryEvents,
      // Pass the selected date to scroll to
      scrollToDate: selectedDates && selectedDates.length > 0 ? selectedDates[0] : null
    });
    onEventTypeSelect && onEventTypeSelect(category.name);
  };

  const handleBackClick = () => {
    setActiveCategory(null);
    onEventTypeSelect && onEventTypeSelect(null);
  };

  //Uplift event Data
  useEffect(() => {
    UpliftFilteredEvents(filteredEvents)
  }, [filteredEvents.length])

  if (loading) {
    return (
      <div className="w-full py-10 lg:px-16 px-4 ">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-[#F7F9FC] h-72 p-6 rounded-2xl border border-gray-200">
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  if (selectedCity) {
    const name = selectedCity;
    
    // Filter events by selected city only
    const cityFilteredEvents = allEvents.filter(
      event => event.location.toLowerCase() === selectedCity.toLowerCase()
    );

    return (
      <div className="relative z-1">
        {cityFilteredEvents.length > 0 ? (
          <div className="mt-28">
            <ConferenceTimeline
              name={name}
              events={cityFilteredEvents}
              selectedYear={selectedYear}
              selectedDateISO={selectedDateISO}
              showFallbackMessage={false}
              scrollToCity={selectedCity}
            />
          </div>
        ) : (
          <div className="text-center py-10">
            No events found for {selectedCity}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative z-1">
      {activeCategory && (
        <button onClick={handleBackClick} className="absolute top-4 left-5 md:left-20 text-[18px] flex items-center gap-2 pt-[1%]">
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

      {!activeCategory ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:px-16 px-4 mt-12">
          {filteredEventCategories.map((category) => (
            <div key={category.id} className="bg-[#F7F9FC] p-6 rounded-2xl border relative">
              <div className="flex justify-between items-center mb-4">
                <h2 className="sm:text-h1 text-2xl font-semibold text-omblue-500">{category.name}</h2>
                <div className="flex items-start justify-end size-[62px] bg-white rounded-bl-[20px] absolute right-[-1px] top-[-1px]">
                  <svg className="absolute left-[-20px] top-0" xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 23 23" fill="none">
                    <path d="M23 0L23 23C23 5.4 7.66667 0.333333 1.00536e-06 -1.00536e-06L23 0Z" fill="white" />
                  </svg>
                  <button className="size-[48px] p-2 flex items-center justify-center rounded-full border border-omblue-500" onClick={() => handleEyeClick(category)}>
                    <EyeIcon />
                  </button>
                  <svg className="absolute bottom-[-20px] right-0" xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 23 23" fill="none">
                    <path d="M23 0H0C17.6 0 22.6667 15.3333 23 23V0Z" fill="white" />
                  </svg>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {category.events.length > 0 ? (
                  category.events.map((event, idx) => (
                    <React.Fragment key={event.id}>
                      <EventCard
                        event={event}
                        selectedDates={selectedDates}
                        isActive={activeEvent === event}
                        onClick={() => handleEventClick(event)}
                        openPopup={openPopupHandler}
                      />
                      {category.events.length > 1 && idx < category.events.length - 1 && <hr className="w-full" />}
                    </React.Fragment>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No events found in this category
                  </div>
                )}
              </div>
            </div>
          ))}
          <AddToCalendarPopup
            isOpen={openPopup === 'calendar'}
            onClose={closePopupHandler}
            event={activeEvent}
            countries={countries}
          />
          <EditEventPopup
            isOpen={openPopup === 'edit'}
            onClose={closePopupHandler}
            eventData={activeEvent}
          />
          <ShareEvents
            isOpen={openPopup === 'share'}
            onClose={closePopupHandler}
            eventData={activeEvent}
          />
          <DeleteEventPopup
            isOpen={openPopup === 'delete'}
            onClose={closePopupHandler}
            eventData={activeEvent}
          />
        </div>
      ) :
        <div className="mt-28">
        <ConferenceTimeline
          name={activeCategory.name}
          events={activeCategory.events}
          selectedYear={selectedYear}
          selectedDateISO={activeCategory.scrollToDate || selectedDateISO}
          showFallbackMessage={filteredEvents.length === 0}
        />
      </div>
      }
    </div>
  );
};

export default Events;
