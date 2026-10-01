import React, { useState } from 'react';
import Image from 'next/image';
import moment from 'moment';
import { EllipsisSmIcon } from '@/icons/ellipsis';
import axios from 'axios';
import { apiEndpoint } from '@/utils/utils';
import { toast } from 'react-toastify';
import {
  getEventTypeConfig,
  getEventTypeName,
  SAVED_EVENTS_CHANGED_EVENT,
} from '@/utils/event-type-config';

const getEventImage = (eventType: string): string => {
  const imageMap: { [key: string]: string } = {
    Conferences: '/event/conference.svg',
    'Grand Openings & Launches': '/event/grand-opening.svg',
    'Trade Show / Expo': '/event/trade.svg',
    Webinars: '/event/webinar.svg',
    Meetups: '/event/meetup.svg',
    Workshops: '/event/workshop.svg',
    Seminars: '/event/seminar.svg',
  };
  return imageMap[eventType] || '/event/conference.svg';
};



export const CalendarEventCard = ({ feed }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [savedEventId, setSavedEventId] = useState<string | null>(null);

  const eventId = feed?.Event?.Id || feed?.EventId || feed?.Id;

  const eventDate = feed.EventDate || feed.Event.EventDate;
  const formattedDate = eventDate ? moment(eventDate).format('dddd, MMMM D, YYYY') : '';
  const formattedTime = feed.EventDate || feed.Event.EventDate
    ? new Date(feed.EventDate).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).toUpperCase()
    : null;

  const eventType = getEventTypeName(feed);
  const config = getEventTypeConfig(eventType);

  const toggleMenu = () => setMenuOpen(prev => !prev);

  // close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (menuOpen && !target.closest('.save-menu-container')) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [menuOpen]);

  React.useEffect(() => {
    const syncSavedState = async () => {
      const currentUser =
        typeof window !== 'undefined' &&
        JSON.parse(localStorage.getItem('userData'));

      if (!currentUser?.Id || !eventId) return;

      try {
        const response = await axios.get(`${apiEndpoint}/event/saved-events`, {
          params: { userId: currentUser.Id },
          headers: {
            XApiKey: process.env.NEXT_PUBLIC_API_KEY,
            accept: 'text/plain',
          },
        });

        const savedItems = Array.isArray(response?.data?.Result)
          ? response.data.Result
          : Array.isArray(response?.data?.Result?.Items)
            ? response.data.Result.Items
            : [];

        const savedItem = savedItems.find((item: any) => {
          const savedEvent = item?.Event || item;
          return String(savedEvent?.Id || savedEvent?.EventId) === String(eventId);
        });

        if (savedItem) {
          setIsSaved(true);
          setSavedEventId(String(savedItem?.Id || savedItem?.SavedEventId || savedItem?.SavedId || ''));
          return;
        }

        setIsSaved(false);
        setSavedEventId(null);
      } catch (error) {
        // Keep UI interactive even if saved-state sync fails.
        setIsSaved(false);
        setSavedEventId(null);
      }
    };

    syncSavedState();
  }, [eventId]);

  const handleSaveEvent = async () => {
    setMenuOpen(false);
    try {
      const currentUser =
        typeof window !== 'undefined' &&
        JSON.parse(localStorage.getItem('userData'));
      if (!currentUser?.Id) {
        toast.error('Please sign in to save events');
        return;
      }

      if (isSaved) {
        if (!savedEventId) {
          toast.error('Unable to unsave this event right now');
          return;
        }

        const unsaveResponse = await axios.delete(
          `${apiEndpoint}/event/saved-event/${savedEventId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              XApiKey: process.env.NEXT_PUBLIC_API_KEY,
              accept: 'text/plain',
            },
          }
        );

        if (unsaveResponse.status === 200) {
          setIsSaved(false);
          setSavedEventId(null);
          window.dispatchEvent(new Event(SAVED_EVENTS_CHANGED_EVENT));
          toast.success('Event removed from saved list');
        } else {
          toast.error('Unable to unsave event');
        }
        return;
      }

      const payload = {
        EventId: eventId,
        UserId: currentUser.Id,
      };
      const response = await axios.post(
        `${apiEndpoint}/event/save-event`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            XApiKey: process.env.NEXT_PUBLIC_API_KEY,
          },
        }
      );
      if (response.status === 200) {
        const newSavedId =
          response?.data?.Result?.Id ||
          response?.data?.Result?.SavedEventId ||
          response?.data?.Result?.SavedId;
        setIsSaved(true);
        if (newSavedId) {
          setSavedEventId(String(newSavedId));
        }
        window.dispatchEvent(new Event(SAVED_EVENTS_CHANGED_EVENT));
        toast.success('Event saved successfully');
      } else {
        toast.error('Unable to save event');
      }
    } catch (err) {
      console.error('save event error', err);
      toast.error('Failed to save event');
    }
  };


  return (
    <div className="flex relative mb-4 xs:flex-col md:min-h-[356px] p-4 bg-white rounded-2xl shadow-blur overflow-hidden lg:flex-row gap-4">
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex items-center gap-3 w-full ">
        
          {formattedTime && (
            <>
              <span
                className="font-semibold flex gap-2 md:rounded-lg rounded-ms px-2 md:px-4 py-1 md:py-2.5 md:text-base text-[9px]"
                style={{ color: config.color, backgroundColor: config.bgColor }}
              >
                <svg className="w-3 h-3  md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 2V6M16 2V6M3 10H21M8 14H8.01M12 14H12.01M16 14H16.01M8 18H8.01M12 18H12.01M16 18H16.01M5 4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4Z" stroke={config.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {formattedDate}
              </span>
              <span className="font-bold text-base text-gray-600">•</span>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" />
                <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" />
              </svg>
              <span className="font-light md:text-sm text-[9px]" >
                {formattedTime} {feed.TimeZone || feed.Event?.TimeZone ? `${feed.TimeZone || feed.Event?.TimeZone}` : ''}
              </span>
            </>
          )}

          <div className=" absolute top-1 right-1 save-menu-container">
            <EllipsisSmIcon
              className="text-[#5B657B] absolute top-4 right-2 md:right-6 w-4 rounded-full h-4 hover:bg-gray-50 cursor-pointer"
              onClick={toggleMenu}
            />
            {menuOpen && (
              <div className="absolute right-0 mt-8 w-32 bg-olblue-50 shadow-lg rounded-lg">
                <button
                  className="w-full text-left px-4 py-2 text-sm"
                  onClick={handleSaveEvent}
                >
                  {isSaved ? 'Unsave' : 'Save'}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between gap-4">
          <div>
            <div>
              <p className="md:text-[28px] text-[14px] font-semibold mb-2" style={{ color: config.color }}>
                {eventType }
              </p>
              <h2 className="md:text-2xl text-xs font-bold leading-tight mb-4">
                {feed.Title || feed.Event?.Title }
              </h2>
            </div>

            <div className="flex items-center gap-2.5">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.6673 8.33073C16.6673 12.4916 12.0515 16.8249 10.5015 18.1632C10.3571 18.2718 10.1813 18.3305 10.0007 18.3305C9.81999 18.3305 9.64421 18.2718 9.49982 18.1632C7.94982 16.8249 3.33398 12.4916 3.33398 8.33073C3.33398 6.56262 4.03636 4.86693 5.28661 3.61668C6.53685 2.36644 8.23254 1.66406 10.0007 1.66406C11.7688 1.66406 13.4645 2.36644 14.7147 3.61668C15.9649 4.86693 16.6673 6.56262 16.6673 8.33073Z" stroke="#193E8D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10.0007 10.8307C11.3814 10.8307 12.5007 9.71144 12.5007 8.33073C12.5007 6.95002 11.3814 5.83073 10.0007 5.83073C8.61994 5.83073 7.50065 6.95002 7.50065 8.33073C7.50065 9.71144 8.61994 10.8307 10.0007 10.8307Z" stroke="#193E8D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>

              <span className="md:text-sm text-[8px] font-normal">
                {feed.LocationType === 'Online'
                  ? 'Online Only'
                  : (feed.LocationType || feed.Event?.LocationType) === 'In Person Only'
                  && `${feed.City || feed.Event?.CityName || feed.CityName}, ${feed.Country || feed.Event?.CountryName || feed.CountryName ? `${feed.Country || feed.Event?.CountryName || feed.CountryName}` : ''} `}
              </span>
            </div>

            <div className="mt-2">
              <p className="text-[#5B657B] md:text-sm text-[8px] mb-3">Sponsors</p>
              <div className="flex gap-3 flex-wrap">
                <div className="md:px-4 px-2 py-1 md:py-2  bg-[#F5F7FA] rounded-lg">
                  <span className="md:text-sm text-xs font-semibold">{feed.Sponsor || feed.Event?.Sponsor}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="md:w-[230px] w-[122px] md:h-[205px] h-[108px] flex-shrink-0 rounded-2xl overflow-hidden">
            <Image
              src={getEventImage(eventType)}
              alt={getEventImage(eventType)}
              width={480}
              height={300}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex items-center rounded-lg justify-end">
          <button
            className="flex items-center gap-2 md:text-base text-[8px] hover:underline text-[#204FB4]"
            onClick={() => feed.EventLink && window.open(feed.EventLink, '_blank')}
          >
            <span>Learn more</span>
            <svg className="md:w-5 md:h-5 w-3 h-3" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
