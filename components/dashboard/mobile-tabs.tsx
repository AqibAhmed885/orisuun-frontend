import Reminders from '@/app/(dashboard)/(users)/(main)/dashboard/_section/reminders';
import WeeklyActivityGoals from '@/app/(dashboard)/(users)/(main)/dashboard/_section/weekly-goals';
import React, { useState } from 'react';
import { CalendarPicker } from '../calendar/calendar';
import RecentChats from '@/app/(dashboard)/(users)/(main)/dashboard/_section/recent-chats';
import Favourites from '@/app/(dashboard)/(users)/(main)/dashboard/_section/favourites';
import Rating from '@/app/(dashboard)/(users)/(main)/dashboard/_section/rating';
import moment from 'moment';
import WeeklyActivity from '@/app/(dashboard)/(users)/(main)/dashboard/_section/weekly-activity';
interface MobileTabsProps {
  handleDateSelect: (date: Date | [Date, Date]) => void;
  selectedDate: Date;
  currentUser: any;
  eventTypesByDate?: Record<string, string[]>;
  bookedMeetingDates?: Record<string, true>;
  onMonthChange?: (year: number, month: number) => void;
}
const MobileTabs = ({
  handleDateSelect,
  selectedDate,
  currentUser,
  eventTypesByDate,
  bookedMeetingDates,
  onMonthChange,
}: MobileTabsProps) => {
  const [activeTab, setActiveTab] = useState('Weekly Goals');
  const [date, setDate] = useState<string>(moment().format('MM/DD/YYYY'));

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'Weekly Goals':
        return currentUser?.UserProfileType === 'Black-owned Business' ? (
          <>
            {currentUser?.UserProfileType === "Black-owned Business" && (
              <WeeklyActivityGoals />
            )}
            {
              currentUser?.UserProfileType !== "Black-owned Business" && (
                <WeeklyActivity />
              )
            }
          </>
        ) : null;
      case 'Reminders':
        return <Reminders />;
      case 'Calendar':
        return (
          <CalendarPicker
            handleDateSelectFromCalender={handleDateSelect}
            selectedDate={selectedDate}
            eventTypesByDate={eventTypesByDate}
            bookedMeetingDates={bookedMeetingDates}
            onMonthChange={onMonthChange}
          />
        );
      case 'Recent Chats':
        return <RecentChats />;
      case 'Favourites':
        return <Favourites />;
      case 'Rating':
        return <Rating />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full flex flex-col relative">
      {/* Tabs Header */}
      <div className="flex flex-nowrap hide-scrollbar sm:justify-center max-w-full h-11 absolute overflow-x-auto">
        {[
          'Weekly Goals',
          'Reminders',
          'Calendar',
          'Recent Chats',
          'Favourites',
          'Rating',
        ].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`p-3 leading-[18px] box-border whitespace-nowrap text-sm ${
              activeTab === tab
                ? 'border-b-2 border-omblue-600 text-omblue-600 font-semibold'
                : 'text-[#797B82]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-grow mb-4 mt-16 rounded-2xl xs:shadow-custom sm:!shadow-none overflow-visible">
        {renderActiveTabContent()}
      </div>
    </div>
  );
};

export default MobileTabs;
