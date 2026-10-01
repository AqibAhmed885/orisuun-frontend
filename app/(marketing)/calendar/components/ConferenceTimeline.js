import React, { useState, useMemo, useRef, useEffect } from 'react';
import { FaLink } from 'react-icons/fa';
import { useSwipeable } from 'react-swipeable';
import moment from 'moment-timezone';

const ConferenceTimeline = ({ name, events, selectedYear: propSelectedYear, selectedDateISO, scrollToCity }) => {
    const timelineRef = useRef(null);
    const yearRefs = useRef({});
    const eventRefs = useRef({});

    const processedEvents = useMemo(() =>
        events.map(event => ({
            id: event.id,
            date: `${event.day} ${event.month.slice(0, 3)}`,
            time: `${event.time}:00`,
            timezone: event.Timezone,
            eventName: event.title,
            location: event.location,
            LocationType: event.LocationType,
            link: event.link,
            month: event.month,
            year: event.year,
            role: event.role,
            EventDate: event.EventDate,
            sortableDate: new Date(`${event.month} ${event.day}, ${event.year} ${event.time}`)
        }))
            .sort((a, b) => a.sortableDate - b.sortableDate),
        [events]);
        
    // Function to check if two dates are the same day
    const isSameDay = (date1, date2) => {
        if (!date1 || !date2) return false;
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    };
    const [isScrolling, setIsScrolling] = useState(false);
    // Scroll to selected date when prop changes
    useEffect(() => {
        const target =
            (selectedDateISO &&
                processedEvents.find(e => isSameDay(e.EventDate, selectedDateISO))) ||
            (scrollToCity &&
                processedEvents.find(
                    e => e.location?.toLowerCase() === scrollToCity.toLowerCase()
                ));

        if (!target) return;

        const timer = setTimeout(() => {
            const el = eventRefs.current[target.id];
            if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "center" });
                setIsScrolling(true);
                setTimeout(() => setIsScrolling(false), 1000);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [selectedDateISO, scrollToCity, processedEvents]);


    // Get unique years from events and sort them
    const years = useMemo(() => {
        const uniqueYears = [...new Set(processedEvents.map(event => event.year))];
        return uniqueYears.sort((a, b) => a - b);
    }, [processedEvents]);

    // Initialize selectedYear with the prop if available, otherwise use the first year
    const [selectedYear, setSelectedYear] = useState(propSelectedYear || years[0] || new Date().getFullYear());
    const [visibleYearIndex, setVisibleYearIndex] = useState(0);
    const visibleYearsCount = 3;

    // Update selectedYear when prop changes
    useEffect(() => {
        if (propSelectedYear && years.includes(propSelectedYear)) {
            setSelectedYear(propSelectedYear);
            const element = yearRefs.current[propSelectedYear];
            if (element && timelineRef.current) {
                timelineRef.current.scrollTo({
                    top: element.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        }
    }, [propSelectedYear, years]);

    // Group all events by year and then by month (sorted)
    const groupedByYear = useMemo(() => {
        return years.reduce((acc, year) => {
            const yearEvents = processedEvents.filter(event => event.year === year);
            const groupedByMonth = yearEvents.reduce((monthAcc, event) => {
                if (!monthAcc[event.month]) monthAcc[event.month] = [];
                monthAcc[event.month].push(event);
                return monthAcc;
            }, {});

            // Sort months in chronological order
            const sortedMonths = {};
            Object.keys(groupedByMonth)
                .sort((a, b) => {
                    const dateA = new Date(`${a} 1, ${year}`);
                    const dateB = new Date(`${b} 1, ${year}`);
                    return dateA - dateB;
                })
                .forEach(month => {
                    sortedMonths[month] = groupedByMonth[month];
                });

            acc[year] = sortedMonths;
            return acc;
        }, {});
    }, [processedEvents, years]);

    // Handle scroll to detect which year is in view
    useEffect(() => {
        const timeline = timelineRef.current;
        if (!timeline) return;

        const handleScroll = () => {
            const timelineRect = timeline.getBoundingClientRect();
            const timelineTop = timelineRect.top;
            const timelineBottom = timelineRect.bottom;
            const viewportHeight = window.innerHeight;

            let mostVisibleYear = selectedYear;
            let maxVisibility = 0;

            Object.entries(yearRefs.current).forEach(([year, element]) => {
                if (!element) return;

                const rect = element.getBoundingClientRect();
                const visibleHeight = Math.min(rect.bottom, timelineBottom) - Math.max(rect.top, timelineTop);
                const visibility = visibleHeight / viewportHeight;

                if (visibility > maxVisibility) {
                    maxVisibility = visibility;
                    mostVisibleYear = parseInt(year);
                }
            });

            if (mostVisibleYear !== selectedYear && years.includes(mostVisibleYear)) {
                setSelectedYear(mostVisibleYear);
            }
        };

        timeline.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleScroll);
        handleScroll();

        return () => {
            timeline.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    }, [selectedYear, years]);

    // Scroll to selected year when year button is clicked
    const scrollToYear = (year) => {
        setSelectedYear(year);
        const element = yearRefs.current[year];
        if (element) {
            timelineRef.current.scrollTo({
                top: element.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    };

    const handlers = useSwipeable({
        onSwipedLeft: () => {
            if (visibleYearIndex < years.length - visibleYearsCount) {
                setVisibleYearIndex(prev => prev + 1);
            }
        },
        onSwipedRight: () => {
            if (visibleYearIndex > 0) {
            }
        },
        trackMouse: true
    });

    if (years.length === 0) return null;

    return (
        <div className='sm:mx-10 md:mx-20'>
            {/* Year selector for large screens */}
            <div className="absolute mr-12 md:right-0 flex-col items-start-right space-y-2 p-2 z-10 hidden md:block">
                {years.map(year => (
                    <button
                        key={year}
                        className={`px-4 py-2 rounded-full text-lg font-semibold transition-all flex justify-center items-center space-x-2 ${selectedYear === year ? 'bg-[#F3F4F5] border-2 border-gray-400 text-center text-black w-20 transform -translate-x-5' : 'bg-[#F3F4F5] text-gray-800 w-16'}`}
                        onClick={() => scrollToYear(year)}
                    >
                        {selectedYear === year && (
                            <svg width="8" height="8" className='absolute right-20 transform -translate-x-1/2' viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.12704 3.09887C7.8823 3.46225 7.8823 4.53775 7.12704 4.90113L1.43356 7.64041C0.769651 7.95983 -3.70499e-07 7.47603 -3.38295e-07 6.73928L-9.88192e-08 1.26072C-6.66149e-08 0.523971 0.769651 0.0401709 1.43356 0.359592L7.12704 3.09887Z" fill="#E31D1C" />
                            </svg>
                        )}
                        {year}
                    </button>
                ))}
            </div>

            {/* Year selector for mobile */}
            <div
                className="flex justify-end pl-4 mb-6 md:hidden overflow-x-auto py-2 w-full"
                {...handlers}
                style={{ touchAction: 'pan-y' }}
            >
                <div className="flex space-x-4 pr-4">
                    {years.slice(visibleYearIndex, visibleYearIndex + visibleYearsCount).map(year => (
                        <button
                            key={year}
                            className={`relative px-4 py-2 rounded-full text-lg font-semibold transition-all flex-shrink-0 ${selectedYear === year ? 'bg-[#F3F4F5] border-2 border-gray-400 text-center text-black w-20' : 'bg-[#F3F4F5] text-gray-800 w-16'}`}
                            onClick={() => scrollToYear(year)}
                        >
                            {selectedYear === year && (
                                <svg width="8" height="8" className='absolute left-1/2 transform -translate-x-1/2 -top-3' viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4.90113 7.12704C4.53775 7.8823 3.46225 7.8823 3.09887 7.12704L0.359593 1.43356C0.0401723 0.769651 0.523971 -7.40998e-07 1.26072 -6.76589e-07L6.73928 -1.97638e-07C7.47603 -1.3323e-07 7.95983 0.769651 7.64041 1.43356L4.90113 7.12704Z" fill="#E31D1C" />
                                </svg>
                            )}
                            {year}
                        </button>
                    ))}
                </div>
            </div>

            <div className="relative w-full md:w-[79%] mx-auto md:px-0">
                {/* Title at the top */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-[#2357C6]">{name}</h2>
                </div>

                {/* Middle Line */}
                <div className="absolute left-6 md:left-1/2 transform -translate-x-1/2 h-full w-[1px] bg-[#D9D9D9]"></div>

                <div
                    className="space-y-10 relative max-h-[70vh] overflow-y-auto pb-10 scrollbar-hide"
                    ref={timelineRef}
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                    }}
                >
                    {years.map(year => (
                        <div
                            key={year}
                            ref={el => yearRefs.current[year] = el}
                            className="year-section"
                        >
                            {/* Year heading */}
                            <div className="sticky top-0 bg-white z-20 py-4 mb-6 flex justify-center">
                                <h3 className="text-4xl font-bold text-center text-black px-6 py-2 rounded-full inline-block">
                                    {year}
                                </h3>
                            </div>

                            {Object.entries(groupedByYear[year]).map(([month, monthEvents], monthIndex) => (
                                <React.Fragment key={month}>
                                    {monthEvents.map((event, index) => (
                                        <div key={event.id}
                                            ref={el => eventRefs.current[event.id] = el} className="relative flex items-center w-full mb-10">
                                            {/* Dot on the middle line */}
                                            <div className="absolute left-6 md:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gray-800 rounded-full border-4 border-gray-800 z-10"></div>

                                            {/* Event Card - Always right-aligned on mobile, alternating on desktop */}
                                            <div
                                                className={`w-full hidden md:block md:w-[45%] md:p-[20px] bg-[#F7F9FC] shadow-lg rounded-xl border border-gray-200 relative ml-auto md:${index % 2 === 0 ? "mr-auto md:ml-0" : "ml-auto md:mr-0"}`}
                                            >
                                                {/* Date-Time, Event Name, and Location */}
                                                <div className="flex gap-8">
                                                    {/* Date, Time, Type - First Column */}
                                                    <div className='flex flex-col md:flex-row mb-4 md:mb-0'>
                                                        <div className="text-sm flex flex-col mr-4 mb-2 md:mb-0 min-w-[90px]">
                                                            <div className="flex items-baseline">
                                                                <p className="text-black text-3xl mr-1">{event.date.split(' ')[0]}</p>
                                                                <p className="text-black text-xl relative -top-3 transform scale-75">
                                                                    {event.date.split(' ')[1]}
                                                                </p>
                                                            </div>
                                                            <p className="text-[17px]">
                                                                {event.time == ':00' ? (
                                                                    "All day"
                                                                ) : (
                                                                    (() => {
                                                                        const [time, period] = event.time.split(' ');
                                                                        let [hours, minutes] = time.split(':').map(Number);

                                                                        if (period) {
                                                                            if (period.toLowerCase() === 'pm' && hours < 12) {
                                                                                hours += 12;
                                                                            } else if (period.toLowerCase() === 'am' && hours === 12) {
                                                                                hours = 0;
                                                                            }
                                                                        }

                                                                        const hour12 = hours % 12 || 12;
                                                                        const ampm = hours >= 12 ? 'PM' : 'AM';
                                                                        return `${hour12}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
                                                                    })()
                                                                )}
                                                            </p>
                                                            <p className="text-[#0A193A7A]">
                                                                {event.timezone}
                                                            </p>
                                                        </div>

                                                        {/* Event Name - Second Column */}
                                                        <div className="text-sm w-full text-gray-600 flex flex-col mb-2 gap-4 md:mb-0 ml-auto">
                                                            <p className="font-bold text-xl">{event.eventName}</p>
                                                            <p className="text-[16px] text-gray-800">{event.role || event.Sponsor}</p>
                                                        </div>
                                                    </div>

                                                    {/* Location and Link - Third Column */}
                                                    <div className="text-sm text-gray-600 flex flex-col gap-2 w-full md:w-auto">
                                                        <div className="flex w-full items-center space-x-2 text-gray-600">
                                                            <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M5.9974 11.9026C7.35295 10.6582 8.35851 9.52761 9.01406 8.51094C9.66962 7.49427 9.99739 6.59149 9.99739 5.80261C9.99739 4.59149 9.61128 3.59983 8.83906 2.8276C8.06684 2.05538 7.11962 1.66927 5.9974 1.66927C4.87517 1.66927 3.92795 2.05538 3.15573 2.8276C2.38351 3.59983 1.9974 4.59149 1.9974 5.80261C1.9974 6.59149 2.32517 7.49427 2.98073 8.51094C3.63628 9.52761 4.64184 10.6582 5.9974 11.9026ZM5.9974 13.2193C5.84184 13.2193 5.68628 13.1915 5.53073 13.1359C5.37517 13.0804 5.23628 12.9971 5.11406 12.8859C4.39184 12.2193 3.75295 11.5693 3.1974 10.9359C2.64184 10.3026 2.17795 9.68872 1.80573 9.09427C1.43351 8.49983 1.15017 7.92761 0.955729 7.37761C0.761285 6.82761 0.664062 6.30261 0.664062 5.80261C0.664062 4.13594 1.20017 2.80816 2.2724 1.81927C3.34462 0.830382 4.58628 0.335938 5.9974 0.335938C7.40851 0.335938 8.65017 0.830382 9.72239 1.81927C10.7946 2.80816 11.3307 4.13594 11.3307 5.80261C11.3307 6.30261 11.2335 6.82761 11.0391 7.37761C10.8446 7.92761 10.5613 8.49983 10.1891 9.09427C9.81684 9.68872 9.35295 10.3026 8.79739 10.9359C8.24184 11.5693 7.60295 12.2193 6.88073 12.8859C6.75851 12.9971 6.61962 13.0804 6.46406 13.1359C6.30851 13.1915 6.15295 13.2193 5.9974 13.2193ZM5.9974 7.00261C6.36406 7.00261 6.67795 6.87205 6.93906 6.61094C7.20017 6.34983 7.33073 6.03594 7.33073 5.66927C7.33073 5.30261 7.20017 4.98872 6.93906 4.7276C6.67795 4.46649 6.36406 4.33594 5.9974 4.33594C5.63073 4.33594 5.31684 4.46649 5.05573 4.7276C4.79462 4.98872 4.66406 5.30261 4.66406 5.66927C4.66406 6.03594 4.79462 6.34983 5.05573 6.61094C5.31684 6.87205 5.63073 7.00261 5.9974 7.00261Z" fill="#0A193A" />
                                                            </svg>
                                                            <span className='text-lg text-gray-800'>
                                                                {event.LocationType === 'Online' && (
                                                                    "Online Only"
                                                                )}
                                                                {((event.location && event.LocationType == 'Physical' || event.LocationType == 'In Person Only') || !event.LocationType) && (
                                                                    (event.location)
                                                                )}
                                                                {(event.location && event.LocationType === 'Both') && (
                                                                    (event.location + "/" + "Online")
                                                                )}
                                                            </span>
                                                        </div>
                                                        <a
                                                            href={event.link}
                                                            target="_blank"
                                                            className="inline-flex w-24 items-center text-blue-600 space-x-3 px-2 bg-gray-200 mr-4 p-1 rounded hover:bg-gray-300 transition-colors"
                                                        >
                                                            <FaLink />
                                                            <span>More info</span>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Mobile Card Layout */}
                                            <div
                                                className={`block md:hidden p-6 bg-[#F7F9FC] shadow-lg rounded-xl border border-gray-200 relative ml-12 w-[calc(98%-4rem)]`}
                                            >
                                                {/* Date-Time, Event Name, and Location */}
                                                <div className="flex flex-col">
                                                    {/* Date and Event Name Row */}
                                                    <div className="flex mb-4">
                                                        <div className="text-sm flex flex-col mr-4 min-w-[90px]">
                                                            <div className="flex items-baseline">
                                                                <p className="text-black text-3xl mr-1">{event.date.split(' ')[0]}</p>
                                                                <p className="text-black text-xl relative -top-3 transform scale-75">
                                                                    {event.date.split(' ')[1]}
                                                                </p>
                                                            </div>
                                                            <p className="text-xl">
                                                                {(() => {
                                                                    const [time, period] = event.time.split(' ');
                                                                    let [hours, minutes] = time.split(':').map(Number);
                                                                    return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
                                                                })()}
                                                            </p>
                                                            <p className="text-[#0A193A7A]">{event.type}</p>
                                                        </div>
                                                        {/* Location and Link Row */}
                                                        <div className="flex flex-col">
                                                            <div className="flex items-center space-x-2 text-gray-600 mb-2">
                                                                <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M5.9974 11.9026C7.35295 10.6582 8.35851 9.52761 9.01406 8.51094C9.66962 7.49427 9.99739 6.59149 9.99739 5.80261C9.99739 4.59149 9.61128 3.59983 8.83906 2.8276C8.06684 2.05538 7.11962 1.66927 5.9974 1.66927C4.87517 1.66927 3.92795 2.05538 3.15573 2.8276C2.38351 3.59983 1.9974 4.59149 1.9974 5.80261C1.9974 6.59149 2.32517 7.49427 2.98073 8.51094C3.63628 9.52761 4.64184 10.6582 5.9974 11.9026ZM5.9974 13.2193C5.84184 13.2193 5.68628 13.1915 5.53073 13.1359C5.37517 13.0804 5.23628 12.9971 5.11406 12.8859C4.39184 12.2193 3.75295 11.5693 3.1974 10.9359C2.64184 10.3026 2.17795 9.68872 1.80573 9.09427C1.43351 8.49983 1.15017 7.92761 0.955729 7.37761C0.761285 6.82761 0.664062 6.30261 0.664062 5.80261C0.664062 4.13594 1.20017 2.80816 2.2724 1.81927C3.34462 0.830382 4.58628 0.335938 5.9974 0.335938C7.40851 0.335938 8.65017 0.830382 9.72239 1.81927C10.7946 2.80816 11.3307 4.13594 11.3307 5.80261C11.3307 6.30261 11.2335 6.82761 11.0391 7.37761C10.8446 7.92761 10.5613 8.49983 10.1891 9.09427C9.81684 9.68872 9.35295 10.3026 8.79739 10.9359C8.24184 11.5693 7.60295 12.2193 6.88073 12.8859C6.75851 12.9971 6.61962 13.0804 6.46406 13.1359C6.30851 13.1915 6.15295 13.2193 5.9974 13.2193ZM5.9974 7.00261C6.36406 7.00261 6.67795 6.87205 6.93906 6.61094C7.20017 6.34983 7.33073 6.03594 7.33073 5.66927C7.33073 5.30261 7.20017 4.98872 6.93906 4.7276C6.67795 4.46649 6.36406 4.33594 5.9974 4.33594C5.63073 4.33594 5.31684 4.46649 5.05573 4.7276C4.79462 4.98872 4.66406 5.30261 4.66406 5.66927C4.66406 6.03594 4.79462 6.34983 5.05573 6.61094C5.31684 6.87205 5.63073 7.00261 5.9974 7.00261Z" fill="#0A193A" />
                                                                </svg>
                                                                <span className='text-lg text-gray-800'>{event.location}</span>
                                                            </div>
                                                            <a
                                                                href={event.link}
                                                                className="inline-flex items-center text-blue-600 space-x-3 bg-gray-200 p-1 rounded hover:bg-gray-300 transition-colors w-fit"
                                                            >
                                                                <FaLink />
                                                                <span>More info</span>
                                                            </a>
                                                        </div>
                                                    </div>

                                                    <div className="text-sm w-full text-gray-600 flex flex-col">
                                                        <p className="font-bold text-2xl">{event.eventName}</p>
                                                        <p className="text-lg text-gray-800">{event.role || event.Sponsor}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Horizontal connector line */}
                                            <div
                                                className={`absolute top-1/2 transform -translate-y-1/2 h-[1px] bg-[#D9D9D9] hidden md:block ${index % 2 === 0 ? "right-[calc(50%+8px)] left-[calc(87%-43%+13px)]" : "left-[calc(50%+8px)] right-[calc(87%-43%+13px)]"}`}
                                            ></div>

                                            {/* Mobile connector line */}
                                            <div
                                                className={`absolute top-1/2 transform -translate-y-1/2 h-[1px] bg-[#D9D9D9] block md:hidden left-6 right-auto w-[25px]`}
                                            ></div>
                                        </div>
                                    ))}

                                    {/* Month indicator after each month except the last one */}
                                    {monthIndex !== Object.keys(groupedByYear[year]).length - 1 && (
                                        <div className="relative flex justify-left md:justify-center w-full my-8">
                                            <div className="absolute left-[50px] md:left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                                                <span className="bg-[#2357C6] text-white text-[18px] px-4 py-2 rounded-2xl font-medium">
                                                    {Object.keys(groupedByYear[year])[monthIndex + 1]}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ConferenceTimeline;