'use client';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import Rating from './_section/rating';
import Favourites from './_section/favourites';
import RecentChats from './_section/recent-chats';
import { toast } from 'react-toastify';
import { CalendarPicker } from '@/components/calendar/calendar';
import { ensureCurrentCycleEntry, getFeeds, getEvents, getNews, getSavedEvents } from '../../../../api/dashboard/dashboard';
import { fetchEventTypes, fetchEventCountsByDate } from '../../../../api/dashboard/eventApi';
import moment from 'moment-timezone';
import { DashboardHeader } from './_section/dashboard-header';
import { FeedCard } from '@/components/dashboard/feeds-card';
import { CalendarEventCard } from '@/components/dashboard/feed-cards/CalendarEventCard';
import Reminders from './_section/reminders';
import WeeklyActivityGoals from './_section/weekly-goals';
import MobileTabs from '@/components/dashboard/mobile-tabs';
import { FeedSkeletonList } from '@/components/feed-card-skeleton/feedCardSkeleton';
import Close from '@/icons/close';
import { current } from '@reduxjs/toolkit';
import WeeklyActivity from './_section/weekly-activity';
import BookingCard from './_section/booking-card';
import useCurrentUser from '@/hooks/useCurrentUser';
import { useSearchParams } from 'next/navigation';
import {
  getEventTypeName,
  SAVED_EVENTS_CHANGED_EVENT,
} from '@/utils/event-type-config';
import { fetchUserBookings, type BookingRecord } from '@/lib/booking';

const PAGE_SIZE = 15; // feeds per page
type FeedTab = 'link1' | 'link2' | 'link3' | 'link4';

const getFeedBucket = (linkId: FeedTab) => {
  if (linkId === 'link3') return 'events' as const;
  if (linkId === 'link4') return 'news' as const;
  if (linkId === 'link2') return 'activity' as const;
  return 'all' as const;
};

const getSavedEventDate = (item: any) => {
  const event = item?.Event || item;
  return (
    event?.EventDate ||
    event?.EventStartTime ||
    event?.StartTime ||
    event?.StartDate ||
    event?.EventStartDate ||
    event?.DateTime ||
    null
  );
};

const getDateKey = (value: unknown) => {
  if (!value) return null;
  const date = moment(value as moment.MomentInput);
  return date.isValid() ? date.format('YYYY-MM-DD') : null;
};

const buildEventTypesByDate = (
  savedEvents: any[],
  eventCounts: Record<string, number>
) => {
  const typesByDate: Record<string, string[]> = {};

  savedEvents.forEach((item) => {
    const dateKey = getDateKey(getSavedEventDate(item));
    if (!dateKey) return;

    if (!typesByDate[dateKey]) typesByDate[dateKey] = [];
    typesByDate[dateKey].push(getEventTypeName(item));
  });

  Object.entries(eventCounts).forEach(([date, rawCount]) => {
    const dateKey = getDateKey(date);
    if (!dateKey) return;

    const count = Math.max(0, Number(rawCount) || 0);
    if (!typesByDate[dateKey]) typesByDate[dateKey] = [];
    while (typesByDate[dateKey].length < count) {
      typesByDate[dateKey].push('Other');
    }
  });

  return typesByDate;
};

const buildBookedMeetingDates = (
  bookings: BookingRecord[],
  currentUserId: string
) => {
  const dates: Record<string, true> = {};

  bookings.forEach((booking) => {
    const belongsToCurrentUser =
      booking.BookerUserId === currentUserId ||
      booking.ProviderUserId === currentUserId;
    const isCancelled = ['cancelled', 'canceled'].includes(
      String(booking.Status || '').toLowerCase()
    );
    const dateKey = getDateKey(booking.ScheduledStartTime);

    if (belongsToCurrentUser && !isCancelled && dateKey) {
      dates[dateKey] = true;
    }
  });

  return dates;
};

const Dashboard = () => {
  const [feeds, setFeeds] = useState([]);
  const [filteredFeeds, setFilteredFeeds] = useState([]);
  const [eventFeeds, setEventFeeds] = useState([]); // separate list for events
  const [newsFeeds, setNewsFeeds] = useState([]); // separate list for news
  const [activeLink, setActiveLink] = useState<FeedTab>('link1');
  const [calendar, setCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isDateSelected, setIsDateSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [paginationByTab, setPaginationByTab] = useState<Record<FeedTab, {
    page: number;
    hasNextPage: boolean;
    totalCount: number;
  }>>({
    link1: { page: 1, hasNextPage: false, totalCount: 0 },
    link2: { page: 1, hasNextPage: false, totalCount: 0 },
    link3: { page: 1, hasNextPage: false, totalCount: 0 },
    link4: { page: 1, hasNextPage: false, totalCount: 0 },
  });

  const [eventTypes, setEventTypes] = useState<string[]>([]);
  const [selectedEventType, setSelectedEventType] = useState('All Event Types');
  const [isEventTypeDropdownOpen, setIsEventTypeDropdownOpen] = useState(false);
  const [showSavedEventsModal, setShowSavedEventsModal] = useState(false);
  const [savedEvents, setSavedEvents] = useState<any[]>([]);
  const [isSavedEventsLoading, setIsSavedEventsLoading] = useState(false);
  const [eventTypesByDate, setEventTypesByDate] = useState<Record<string, string[]>>({});
  const [bookedMeetingDates, setBookedMeetingDates] = useState<Record<string, true>>({});
  const [showNewUserWelcomeModal, setShowNewUserWelcomeModal] = useState(false);
  const [welcomeFirstName, setWelcomeFirstName] = useState('there');

  const activeBucket = getFeedBucket(activeLink);
  const activePagination = paginationByTab[activeLink];

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const giveawayEntryUserRef = useRef<string | null>(null);
  const visibleCalendarMonthRef = useRef({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const { user: currentUser } = useCurrentUser();
  const searchParams = useSearchParams();

  useEffect(() => {
    const userId = currentUser?.Id;
    if (!userId || giveawayEntryUserRef.current === userId) return;

    giveawayEntryUserRef.current = userId;
    void ensureCurrentCycleEntry(userId);
  }, [currentUser?.Id]);

  const loadCalendarEventsByDate = useCallback(async (year: number, month: number) => {
    if (!currentUser?.Id) return;

    visibleCalendarMonthRef.current = { year, month };

    const [countsResult, savedEventsResult] = await Promise.allSettled([
      fetchEventCountsByDate(currentUser.Id, year, month),
      getSavedEvents(currentUser.Id),
    ]);
    const counts = countsResult.status === 'fulfilled' ? countsResult.value : {};
    const savedEventItems =
      savedEventsResult.status === 'fulfilled' && savedEventsResult.value.success
        ? savedEventsResult.value.data
        : [];

    setEventTypesByDate(buildEventTypesByDate(savedEventItems, counts));
  }, [currentUser?.Id]);

  // Load event counts for current month on mount
  useEffect(() => {
    const now = new Date();
    loadCalendarEventsByDate(now.getFullYear(), now.getMonth() + 1);
  }, [loadCalendarEventsByDate]);

  useEffect(() => {
    const userId = currentUser?.Id;
    let isCurrentRequest = true;

    if (!userId) {
      setBookedMeetingDates({});
      return () => {
        isCurrentRequest = false;
      };
    }

    const loadBookedMeetingDates = async () => {
      try {
        const bookings = await fetchUserBookings(userId);
        if (isCurrentRequest) {
          setBookedMeetingDates(buildBookedMeetingDates(bookings, userId));
        }
      } catch {
        if (isCurrentRequest) {
          setBookedMeetingDates({});
        }
      }
    };

    void loadBookedMeetingDates();

    return () => {
      isCurrentRequest = false;
    };
  }, [currentUser?.Id]);

  useEffect(() => {
    const refreshSavedEventDots = () => {
      const { year, month } = visibleCalendarMonthRef.current;
      void loadCalendarEventsByDate(year, month);
    };

    window.addEventListener(SAVED_EVENTS_CHANGED_EVENT, refreshSavedEventDots);
    return () =>
      window.removeEventListener(SAVED_EVENTS_CHANGED_EVENT, refreshSavedEventDots);
  }, [loadCalendarEventsByDate]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isWelcomePending = localStorage.getItem('newUserWelcomePending') === 'true';
    if (!isWelcomePending) return;

    const localUser = JSON.parse(localStorage.getItem('userData') || '{}');
    const firstName =
      localUser?.FirstName ||
      localUser?.UserName ||
      (typeof localUser?.name === 'string' ? localUser.name.split(' ')[0] : '');
    setWelcomeFirstName(firstName);
    setShowNewUserWelcomeModal(true);
  }, []);



  const fetchFeeds = useCallback(async (
    page: number,
    replace: boolean = false,
    dateFilter?: { selectedDate?: Date; isDateSelected?: boolean },
    linkId: FeedTab = activeLink
  ) => {
    if (!currentUser?.Id) {
      setIsLoading(false);
      return;
    }

    const bucket = getFeedBucket(linkId);

    if (page === 1) {
      setIsLoading(true);
    } else {
      setIsFetchingMore(true);
    }

    // Prepare date parameters if a date is selected
    let fromDate: string | undefined;
    let toDate: string | undefined;
    const shouldFilterByDate = dateFilter?.isDateSelected ?? isDateSelected;
    const dateToUse = dateFilter?.selectedDate ?? selectedDate;
    const currentFeedDate = moment().tz(userTimeZone);
    const selectedFeedDate = moment.tz(dateToUse, userTimeZone).startOf('day');
    const isAnotherFeedDate = Boolean(
      shouldFilterByDate &&
      dateToUse &&
      !selectedFeedDate.isSame(currentFeedDate, 'day')
    );
    const feedFromDate = isAnotherFeedDate
      ? selectedFeedDate.toISOString()
      : undefined;
    const feedToDate = isAnotherFeedDate
      ? selectedFeedDate.clone().endOf('day').toISOString()
      : currentFeedDate.toISOString();

    if (shouldFilterByDate && dateToUse) {
      const selectedDay = moment.tz(dateToUse, userTimeZone).startOf('day');

      fromDate = selectedDay.toISOString();
      toDate = selectedDay.clone().endOf('day').toISOString();
    }

    let result;
    if (bucket === 'events') {
      result = await getEvents(currentUser?.Id, page, PAGE_SIZE, fromDate, toDate);
    } else if (bucket === 'news') {
      result = await getNews(currentUser?.Id, page, PAGE_SIZE);
    } else {
      result = await getFeeds(
        currentUser?.Id,
        page,
        PAGE_SIZE,
        feedToDate,
        feedFromDate
      );
    }

    if (result.success && result.data?.Items) {
      const newItems = result.data.Items.sort((a, b) =>
        new Date(b.CreateDate || b.EventDate).getTime() - new Date(a.CreateDate || a.EventDate).getTime()
      );

      if (bucket === 'events') {
        setEventFeeds(prev => replace ? newItems : [...prev, ...newItems]);
      } else if (bucket === 'news') {
        setNewsFeeds(prev => replace ? newItems : [...prev, ...newItems]);
      } else {
        setFeeds(prev => replace ? newItems : [...prev, ...newItems]);
      }

      setPaginationByTab((prev) => ({
        ...prev,
        [linkId]: {
          page: result.data.Page || page,
          hasNextPage: Boolean(result.data.HasNextPage),
          totalCount: Number(result.data.TotalCount || 0),
        },
      }));
    } else {
      toast.error(result?.message || 'Something went wrong');
    }

    setIsLoading(false);
    setIsFetchingMore(false);
  }, [activeLink, currentUser?.Id, isDateSelected, selectedDate, userTimeZone]);

  console.log("currentUser", currentUser);

  // Initial load / reload when activeLink changes
  useEffect(() => {
    fetchFeeds(1, true, undefined, activeLink);
  }, [activeLink, fetchFeeds]);


  // Infinite scroll handler: loads more feeds or events depending on active tab
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container || isFetchingMore) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 200; // 200px threshold

    if (isNearBottom) {
      const hasNext = activePagination.hasNextPage;
      const page = activePagination.page;

      if (hasNext) {
        fetchFeeds(page + 1, false, undefined, activeLink);
      }
    }
  }, [activeLink, activePagination.hasNextPage, activePagination.page, fetchFeeds, isFetchingMore]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Centralized filter logic
  const isCalendarEvent = (feed) => {
    const type = String(feed?.Type || '').toLowerCase();
    return type === 'calenderevent' || type === 'calendarevent' || type === 'todayevent';
  };

  const getFeedEventType = (feed: any) => {
    const eventType = feed?.Event?.EventType || feed?.EventType || feed?.Event?.Type || '';
    if (typeof eventType === 'string') return eventType;
    return eventType?.Title || eventType?.Name || '';
  };

  const getSavedEventData = (item: any) => {
    const event = item?.Event || item;

    return {
      ...event,
      Id: event?.Id || event?.EventId,
      EventId: event?.EventId || event?.Id,
      EventStartTime: event?.EventStartTime || event?.StartTime || event?.EventDate,
      EventEndTime: event?.EventEndTime || event?.EndTime,
      EndTime: event?.EndTime || event?.EventStartTime || event?.StartTime || event?.EventDate,
      EventType: event?.EventTypeName,
      Title: event?.Title || event?.EventTitle,
      TimeZone: event?.TimeZone || event?.Timezone,
      CityName: event?.CityName || event?.City?.CityName,
      CountryName: event?.CountryName || event?.Country?.CountryName,
    };
  };

  const applyFilters = useCallback((linkId: string) => {
    // choose source list depending on tab
    let listSource;
    if (linkId === 'link3') listSource = eventFeeds;
    else if (linkId === 'link4') listSource = newsFeeds;
    else listSource = feeds;
    let filtered = listSource;

    // Filter by type only for non-event tabs
    switch (linkId) {
      case 'link2':
        filtered = feeds.filter(f => !isCalendarEvent(f));
        break;
      case 'link3':
        // eventFeeds already contain events; sort by start time for display
        filtered = [...eventFeeds].sort((a, b) =>
          new Date(a.StartTime || a.EventDate).getTime() -
          new Date(b.StartTime || b.EventDate).getTime()
        );

        if (selectedEventType !== 'All Event Types') {
          filtered = filtered.filter((eventFeed) => getFeedEventType(eventFeed) === selectedEventType);
        }

        setCalendar(filtered.length === 0);
        break;
      case 'link4':
        filtered = newsFeeds;
        break;
      default:
        filtered = listSource;
    }

    if (linkId !== 'link3') setCalendar(false);

    setFilteredFeeds(filtered);
  }, [feeds, eventFeeds, newsFeeds, selectedEventType]);

  useEffect(() => {
    const loadEventTypes = async () => {
      if (activeLink !== 'link3') return;

      try {
        const result = await fetchEventTypes();
        const names = (result || [])
          .map((item: any) => item?.Title)
          .filter(Boolean);
        setEventTypes(Array.from(new Set(names)));
      } catch (error) {
        toast.error('Unable to load event types');
      }
    };

    loadEventTypes();
  }, [activeLink]);

  // Sync filteredFeeds whenever feeds, eventFeeds, newsFeeds, or activeLink/filters change
  useEffect(() => {
    applyFilters(activeLink);
  }, [feeds, eventFeeds, newsFeeds, activeLink, applyFilters]);

  const handleDateSelect = (date: Date | [Date, Date]) => {
    const selected = Array.isArray(date) ? date[0] : date;
    setSelectedDate(selected);
    setIsDateSelected(true);
    // Re-fetch data from API with the selected date
    fetchFeeds(1, true, { selectedDate: selected, isDateSelected: true });
  };

  const clearDateFilter = () => {
    const today = new Date();
    setSelectedDate(today);
    setIsDateSelected(false);
    // Clear the exact-date filter and reload the default feed through today.
    fetchFeeds(1, true, { selectedDate: today, isDateSelected: false });
  };

  const handleLinkClick = (linkId: FeedTab) => {
    setActiveLink(linkId);
    setIsEventTypeDropdownOpen(false);
    applyFilters(linkId);
  };

  const handleEventTypeSelect = (type: string) => {
    setSelectedEventType(type);
    setIsEventTypeDropdownOpen(false);
  };

  const openSavedEventsModal = async () => {
    if (!currentUser?.Id) {
      toast.error('Please sign in to view saved events');
      return;
    }

    setShowSavedEventsModal(true);
    setIsSavedEventsLoading(true);

    const result = await getSavedEvents(currentUser.Id);
    if (result.success) {
      setSavedEvents(result.data);
    } else {
      setSavedEvents([]);
      toast.error(result.message || 'Unable to load saved events');
    }

    setIsSavedEventsLoading(false);
  };

  const getLinkClass = (linkId: string) =>
    `text-lg p-1 rounded-md px-2 hover:text-omblue transition-colors ${activeLink === linkId
      ? 'text-white font-medium bg-[#204FB4]'
      : 'text-[#797B82] font-normal'
    }`;

  const noFeedsMessage = () => {
    if (isDateSelected) return "There's currently nothing to share for this date range";
    if (activeLink === 'link3') return 'No calendar events available';
    if (activeLink === 'link4') return 'No news available';
    return 'No feeds available';
  };

  return (
    <div className="font-sf-pro mx-auto max-w-[100rem] space-y-6 md:space-y-0">
      <DashboardHeader />
      <div className="lg:hidden overflow-x-visible">
        <MobileTabs
          handleDateSelect={handleDateSelect}
          selectedDate={selectedDate}
          currentUser={currentUser}
          eventTypesByDate={eventTypesByDate}
          bookedMeetingDates={bookedMeetingDates}
          onMonthChange={loadCalendarEventsByDate}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 px-4 py-4 md:px-6 lg:grid-cols-12">
        <div className="hidden lg:col-span-3 lg:flex flex-col gap-5">
          <CalendarPicker
            handleDateSelectFromCalender={handleDateSelect}
            selectedDate={selectedDate}
            eventTypesByDate={eventTypesByDate}
            bookedMeetingDates={bookedMeetingDates}
            onMonthChange={loadCalendarEventsByDate}
          />
          {currentUser?.UserProfileType !== "Black-owned Business" && (
            <BookingCard />
          )}
          {currentUser?.UserProfileType === "Black-owned Business" && (
            <WeeklyActivityGoals />
          )}
          {currentUser?.UserProfileType !== "Black-owned Business" && (
            <WeeklyActivity />
          )}
          <Reminders />
        </div>

        <div
          ref={scrollContainerRef}
          className="hide-scrollbar flex md:max-h-[200vh] flex-col overflow-auto rounded-2xl md:px-2 lg:col-span-9 xl:col-span-6"
        >
          <div className="bg-white shadow-blur p-3 rounded-lg flex small-767:gap-2 gap-4 mb-[1rem]">
            {(['link1', 'link2', 'link3', 'link4'] as FeedTab[]).map((link, i) => (
              <button key={link} onClick={() => handleLinkClick(link)} className={getLinkClass(link)}>
                {['All', 'Activity', 'Events', 'News'][i]}
              </button>
            ))}
          </div>

          {activeLink === 'link3' && (
            <div className="flex items-center gap-3 mb-4 px-1">
              <div className="relative">
                <button
                  onClick={() => setIsEventTypeDropdownOpen((prev) => !prev)}
                  className="h-11 min-w-[140px] rounded-md border border-[#CBD5E1] bg-[#F8FAFC] px-6 text-sm text-[#5A6783] font-semibold flex items-center justify-between gap-4"
                >
                  <span>{selectedEventType === 'All Event Types' ? 'Conference' : selectedEventType}</span>
                  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12L10 7L15 12" stroke="#5A6783" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {isEventTypeDropdownOpen && (
                  <div className="absolute z-20 top-[3.6rem] text-xs left-0 w-full bg-white border border-[#CBD5E1] rounded-xl shadow-md max-h-60 overflow-y-auto">
                    <button
                      onClick={() => handleEventTypeSelect('All Event Types')}
                      className="w-full px-4 py-3 text-left text-[#5A6783] hover:bg-[#F1F5F9]"
                    >
                      All Event Types
                    </button>
                    {eventTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => handleEventTypeSelect(type)}
                        className="w-full px-4 text-xs py-1.5 text-left text-[#5A6783] hover:bg-[#F1F5F9]"
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={openSavedEventsModal}
                className="h-11 min-w-[140px] rounded-md border border-[#CBD5E1] bg-[#F8FAFC] px-6 text-sm text-[#5A6783] font-semibold"
              >
                My Saved Events
              </button>
            </div>
          )}

          {isLoading ? (
            <FeedSkeletonList len={8} />
          ) : filteredFeeds.length > 0 ? (
            <>
              {filteredFeeds.map((feed, index) => (
                <div key={`${feed.Id}-${index}`} className="">
                  <FeedCard feed={feed} />
                </div>
              ))}

              {/* Loading more indicator */}
              {isFetchingMore && (
                <FeedSkeletonList len={1} />
              )}

              {/* End of feeds/events message */}
              {/* {!(activeLink === 'link3' ? eventHasNextPage : activeLink === 'link4' ? newsHasNextPage : hasNextPage) && !isDateSelected && (
                <div className="text-center text-gray-400 text-sm py-4">
                  You&#39;ve seen all {activeLink === 'link3' ? eventTotalCount : activeLink === 'link4' ? newsTotalCount : totalCount}{' '}{activeLink === 'link3' ? 'events' : activeLink === 'link4' ? 'news' : 'feeds'}
                </div>
              )} */}
            </>
          ) : (
            <div className="text-center mt-20 text-gray-500">{noFeedsMessage()}</div>
          )}
        </div>

        <div className="hidden xl:col-span-3 xl:flex flex-col gap-6">
          <RecentChats />
          <Favourites />
          <Rating />
        </div>
      </div>

      {showSavedEventsModal && (
        <div className="fixed inset-0 z-[99999] bg-black-900/35 flex items-center justify-center ">
          <div className="w-full max-w-[680px] bg-white rounded-2xl h-[85vh]  max-h-[90vh] overflow-auto">
            <div className="flex items-center sticky py-2 px-4 top-0 bg-white z-[60] justify-between mb-4">
              <h3 className="text-2xl md:text-[28px] font-semibold text-[#102148]">Saved Events For You!</h3>
              <button
                onClick={() => setShowSavedEventsModal(false)}
                className="text-[#64748B] hover:text-[#334155] text-sm"
              >
                <Close />
              </button>
            </div>

            {isSavedEventsLoading ? (
              <>
                {/* shimmmer */}
                <FeedSkeletonList len={4} />
              </>
            ) : (
              <div className="space-y-3 mx-6">
                {savedEvents.map((item, index) => {
                  const event = getSavedEventData(item);

                  return (
                    <div key={`${event?.Event || event?.EventId || index}`} className="border border-[#E2E8F0] rounded-2xl bg-white">
                      <CalendarEventCard feed={event} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* <NewUserWelcomeModal
        visible={showNewUserWelcomeModal}
        firstName={welcomeFirstName}
        onClose={closeNewUserWelcomeModal}
      /> */}
    </div>
  );
};

export default Dashboard;
