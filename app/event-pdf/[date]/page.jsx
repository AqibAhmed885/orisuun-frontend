"use client"
import '@/styles/global.css';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { eventApi } from '@/app/api/event-pdf/event-pdf';

export default function PdfPage() {
    const params = useParams();
    const selectedDate = params.date;
    const baseDate = decodeURIComponent(selectedDate);
    const [eventTypeMapping, setEventTypeMapping] = useState([])
    const [countries, setCountries] = useState([])
    const [getEvents, setGetEvents] = useState([])
    const [filteredEvents, setFilteredEvents] = useState([])
    const [transformedEvents, setTransformedEvents] = useState([])
    const inputDate = new Date(baseDate);
    const dateShow = inputDate.getDate();
    const monthShow = inputDate.toLocaleString('en-US', { month: 'short' });
    const yearStr = (inputDate.getFullYear()).toString();
    const yearShow1 = parseInt(yearStr.slice(0, 2)); // 20
    const yearShow2 = parseInt(yearStr.slice(2));

    // Utility function to format date and time
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const month = date.toLocaleString('default', { month: 'short' });
        const day = date.getDate();
        return {
            date: `${month} ${day}`,
            day: day.toString().padStart(2, '0'),
            month: date.toLocaleString('default', { month: 'long' }),
            year: date.getFullYear(),
            isoDate: dateString // Keep original ISO format for editing
        };
    };

    // Fetch countries
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await eventApi.getCountryAndCityList();
                const data = await response.json();
                if (data.StatusCode === 200 && Array.isArray(data.Result.country)) {
                    setCountries(data.Result.country);
                }
            } catch (err) {
                console.error('Error fetching countries:', err);
            }
        };
        fetchCountries();
    }, []);

    // Fetch Event Types
    useEffect(() => {
        const fetchEventTypes = async () => {
            try {
                const response = await eventApi.getEventTypes();
                const data = await response.json();
                if (data.StatusCode === 200 && Array.isArray(data.Result)) {
                    const mapping = data.Result.reduce((acc, event) => {
                        acc[event.Id] = event.Title;
                        return acc;
                    }, {});
                    setEventTypeMapping(mapping);
                }
            } catch (err) {
                console.error('Error fetching event types:', err);
            }
        };
        fetchEventTypes();
    }, []);

    // Fetch and filter events
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await eventApi.getEventList();
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
                }
                const data = await response.json();
                const getEventTypeName = (id) => eventTypeMapping[id] || '';
                const getCountryName = (id) => {
                    if (!countries || countries.length === 0) return '';
                    const country = countries.find(c => c.Id == id);
                    return country ? country.CountryName : '';
                };
                const transformedEvents = data.Result.map((event) => {
                    const formattedDate = formatDate(event.EventDate);
                    const startTime = event.EventStartTime?.split('T')[1]?.split(':').slice(0, 2).join(':') || '';
                    const endTime = event.EventEndTime?.split('T')[1]?.split(':').slice(0, 2).join(':') || '';

                    return {
                        id: event.Id,
                        date: formattedDate.date,
                        day: formattedDate.day,
                        time: startTime,
                        timezone: event.TimeZone,
                        title: event.Title,
                        role: event.CreatedBy,
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
                        AllDay: event.AllDay,
                        details: {
                            description: event.Description || 'No description available',
                            agenda: [
                                {
                                    time: startTime,
                                    activity: 'Event starts',
                                },
                                {
                                    time: endTime,
                                    activity: 'Event ends',
                                },
                            ],
                            speakers: [],
                        },
                    };
                });
                setGetEvents(transformedEvents);
            } catch (err) {
                console.error('Error fetching events:', err);
            }
        };

        if (Object.keys(eventTypeMapping).length > 0) {
            fetchEvents();
        }
    }, [eventTypeMapping, countries]);

    function filterEvents(events, baseDateStr) {
        const baseDate = new Date(baseDateStr);

        return events.filter(event => {
            const eventDate = new Date(event.EventDate);

            // Normalize to remove time component for accurate comparison
            const base = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
            const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());

            const diffInDays = (eventDay - base) / (1000 * 60 * 60 * 24);

            // Handle types with a 5-day range
            if (["Upcoming Deadlines", "Trade Show / Expo"].includes(event.type.toLowerCase())) {
                return diffInDays >= 0 && diffInDays <= 5;
            }

            // Handle all other types — exact date match only
            return eventDay.getTime() === base.getTime();
        });
    }
    useEffect(() => {
        setFilteredEvents(filterEvents(getEvents, baseDate))
    }, [getEvents])

    function groupEventsByType(eventsArray) {
        const grouped = {};
        eventsArray.forEach(event => {
            const typeKey = event.type.toLowerCase();
            if (!grouped[typeKey]) {
                grouped[typeKey] = {
                    title: event.type,
                    events: []
                };
            }
            const [hour, minute] = (event.EventStartTime || event.time || "").split(":");
            const hour24 = parseInt(hour) || 0;
            const minuteVal = parseInt(minute) || 0;
            const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
            const formattedHour = hour12.toString().padStart(2, "0");
            const amPm = hour24 >= 12 ? "PM" : "AM";
            const formattedMinute = minuteVal.toString().padStart(2, "0") + " " + amPm;

            grouped[typeKey].events.push({
                title: event.title,
                type: event.role,
                time: formattedHour || "",
                timeSuper: formattedMinute || "",
                timezone: event.timezone,
                location: event.cityName || event.location || "",
                LocationType: event.LocationType,
                AllDay: event.AllDay
            });
        });
        return grouped;
    }

    useEffect(() => {
        setTransformedEvents(groupEventsByType(filteredEvents))
    }, [filteredEvents])

    // Flatten all events and add category information
    const allEvents = Object.entries(transformedEvents).flatMap(([category, data]) =>
        data.events.map(event => ({
            ...event,
            category: data.title
        }))
    );

    // Calculate pages
    const firstPageEvents = 5;
    const eventsPerPage = 10;
    const remainingEvents = allEvents.slice(firstPageEvents);
    const additionalPages = Math.ceil(remainingEvents.length / eventsPerPage);

    // Generate all pages content
    const generatePages = () => {
        let pages = [];
        let currentIndex = 0;

        // First page (6 events)
        const firstPageContent = allEvents.slice(0, firstPageEvents);
        pages.push(createPageContent(firstPageContent, 0, "eventPDF/ContentStart.svg", true)); // true for isFirstPage

        // Subsequent pages (12 events each)
        while (currentIndex < remainingEvents.length) {
            const pageEvents = remainingEvents.slice(currentIndex, currentIndex + eventsPerPage);
            const pageNumber = Math.floor(currentIndex / eventsPerPage) + 1;
            const isLastContentPage = currentIndex + eventsPerPage >= remainingEvents.length;

            pages.push(createPageContent(
                pageEvents,
                pageNumber,
                isLastContentPage ? "eventPDF/ContentEnd.svg" : "eventPDF/ContentMiddle.svg",
                false // false for isFirstPage
            ));
            currentIndex += eventsPerPage;
        }
        return pages;
    };

    // Create content for each page
    const createPageContent = (events, pageIndex, backgroundImage, isFirstPage) => {
        const groupedEvents = events.reduce((acc, event) => {
            if (!acc[event.category]) {
                acc[event.category] = [];
            }
            acc[event.category].push(event);
            return acc;
        }, {});

        return (
            <div key={`page-${pageIndex}`} className="relative overflow-hidden w-[595px] h-[842px] bg-[#0A193A] text-white">
                <div className="">
                    <img
                        src={`/${backgroundImage}`}
                        alt="Decorative Layer"
                        className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none z-10"
                    />
                    {isFirstPage &&
                        <div className="absolute right-5 top-28 z-20 ">
                            <div className="flex items-center gap-2 pl-2">
                                <span className="text-[20px] font-bold leading-none">{dateShow}</span>
                                <span className="text-[20px] font-bold leading-none text-[#69B3E7]">{monthShow.toUpperCase()}</span>
                            </div>
                            <div className="text-[70px] font-bold leading-[0.85]">
                                <div>{yearShow1}</div>
                                <div>{yearShow2}</div>
                            </div>
                        </div>
                    }

                </div>
                <div className={`relative z-20 pl-4 pe-18 ${isFirstPage ? 'pt-[19rem]' : 'pt-[2rem]'} w-full`}>
                    <div className="">
                        {Object.entries(groupedEvents).map(([category, categoryEvents]) => (
                            <div key={category} className='w-[516px] mb-3'>
                                <div className="bg-gradient-to-r from-[#69B3E7] ml-7 from-5% to-[#3663AC] to-95% px-2 w-fit rounded-t-xl text-center">
                                    <h2 className="text-[17px] font-semibold text-white pb-mb-1">{category}</h2>
                                </div>
                                <div className="space-y-1 bg-white px-5 py-3 shadow-lg border rounded-xl">
                                    {categoryEvents.map((event, index) => (
                                        <React.Fragment key={index}>
                                            <div className="px-1 bg-white flex justify-center items-center w-full rounded-sm border-l-[1.3px] border-[#5B93FF]">
                                                <div className="w-3/5 px-[2px] text-black">
                                                    <p className="text-[12px] mb-1 text-black font-semibold leading-none">{event.title}</p>
                                                    <p className="text-[10px] text-gray-600 leading-none">{event.type}</p>
                                                </div>
                                                <div className="flex gap-10 w-2/5">
                                                    <div className="flex flex-col items-center w-1/3">
                                                        {event.AllDay ? (
                                                            <p className="text-[15px] text-black font-semibold">All Day</p>
                                                        ) : (
                                                            <>
                                                                <p className="text-[15px] text-black">
                                                                    <span className="font-semibold">{event.time}</span>
                                                                    <sup className="text-[10px]">{event.timeSuper}</sup>
                                                                </p>
                                                                <p className="text-[8px] text-gray-600">{event.timezone}</p>
                                                            </>
                                                        )}
                                                    </div>


                                                    <div className="text-xs flex text-gray-400 w-2/3">
                                                        <div className="flex items-center gap-[1px]">
                                                            <svg width="10" height="12" viewBox="0 0 5 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M2.28484 5.46287C2.84174 4.95161 3.25486 4.48715 3.52418 4.06947C3.7935 3.65179 3.92816 3.28091 3.92816 2.95681C3.92816 2.45925 3.76953 2.05184 3.45228 1.73459C3.13503 1.41734 2.74588 1.25871 2.28484 1.25871C1.8238 1.25871 1.43465 1.41734 1.1174 1.73459C0.800149 2.05184 0.641523 2.45925 0.641523 2.95681C0.641523 3.28091 0.776184 3.65179 1.04551 4.06947C1.31483 4.48715 1.72794 4.95161 2.28484 5.46287ZM2.28484 6.00379C2.22093 6.00379 2.15703 5.99238 2.09312 5.96956C2.02921 5.94673 1.97215 5.9125 1.92194 5.86685C1.62523 5.59296 1.36276 5.32593 1.13452 5.06573C0.90628 4.80554 0.7157 4.55334 0.56278 4.30912C0.409861 4.06491 0.293459 3.82982 0.213575 3.60386C0.133692 3.37791 0.09375 3.16222 0.09375 2.95681C0.09375 2.27209 0.314 1.7266 0.754501 1.32033C1.195 0.91407 1.70512 0.710938 2.28484 0.710938C2.86457 0.710938 3.37468 0.91407 3.81518 1.32033C4.25568 1.7266 4.47593 2.27209 4.47593 2.95681C4.47593 3.16222 4.43599 3.37791 4.35611 3.60386C4.27622 3.82982 4.15982 4.06491 4.0069 4.30912C3.85398 4.55334 3.6634 4.80554 3.43516 5.06573C3.20693 5.32593 2.94445 5.59296 2.64774 5.86685C2.59753 5.9125 2.54047 5.94673 2.47656 5.96956C2.41265 5.99238 2.34875 6.00379 2.28484 6.00379ZM2.28484 3.4498C2.43548 3.4498 2.56443 3.39617 2.67171 3.28889C2.77898 3.18162 2.83261 3.05267 2.83261 2.90203C2.83261 2.75139 2.77898 2.62244 2.67171 2.51516C2.56443 2.40789 2.43548 2.35426 2.28484 2.35426C2.1342 2.35426 2.00525 2.40789 1.89798 2.51516C1.7907 2.62244 1.73707 2.75139 1.73707 2.90203C1.73707 3.05267 1.7907 3.18162 1.89798 3.28889C2.00525 3.39617 2.1342 3.4498 2.28484 3.4498Z" fill="#0A193A" />
                                                            </svg>
                                                            <span className="text-[#0A193A]">
                                                                {event.LocationType == "Online"
                                                                    ? "Online Only"
                                                                    : event.LocationType === "Both"
                                                                        ? `${event.location}/Online`
                                                                        : event.location
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {index < categoryEvents.length - 1 && (
                                                <div className="w-full h-[.1px] bg-gray-200"></div>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <p className='-rotate-90 absolute top-[776px] z-20 text-[23px] font-[700] text-white'>{dateShow}&nbsp;&nbsp;<span className='text-[#69B3E7]'>{monthShow.toUpperCase()}</span></p>
                <div className="absolute left-[50px] top-[749px] z-20 text-white w-[59px] h-[92px]">
                    <div className="text-[50px] font-[600] leading-[0.85]">
                        <div>{yearShow1}</div>
                        <div>{yearShow2}</div>
                    </div>
                </div>
            </div>
        );
    };
    return (
        <div className="mx-auto max-w-[595px]">
            {/* Cover page */}
            <div className="relative overflow-hidden w-full h-[842px] bg-[#0A193A] text-white">
                <img
                    src="/eventPDF/CoverPage.svg"
                    alt="Decorative Layer"
                    className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none z-10"
                />
                <div className="absolute top-[51px] left-[449.5px] z-20 text-sm font-light font-sans">
                    <span>{dateShow} {monthShow} {yearShow1}{yearShow2}</span>
                </div>
            </div>

            {/* Content pages */}
            {generatePages()}

            {/* Promo page */}
            <div className="relative overflow-hidden w-full h-[842px] bg-[#0A193A] text-white">
                <img
                    src="/eventPDF/PromoPage.jpg"
                    alt="Decorative Layer"
                    className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none z-10"
                />
                <a href='https://orisuun.com/' target='_blank' className="absolute top-[799px] left-[466px] z-20 text-xl font-light">
                    <span>orisuun.com</span>
                </a>
            </div>
        </div>
    );
}