import React from 'react';
import moment from 'moment-timezone';
import {
    CalenderIcon,
    EditventIcon,
    ShareEventIcon,
    DeleteIcon,
    LocationIcon,
    LinkIcon,
} from '../../../../public/icons/calendar/Icons.tsx';

const EventCard = ({ event, isActive, onClick, openPopup, selectedDates }) => (
    <div className="relative w-full ">
        <div
            className="flex items-start justify-start small-767:flex-wrap gap-2 px-4 py-3 border-l-2 border-omblue-500 rounded-lg relative w-full hover:bg-white cursor-pointer"
            onClick={onClick}
        >
            {selectedDates.length === 1 && (
                <div className="text-blue-500 text-[22px] min-w-[90px]">
                    {event.EventStartTime === "" && event.EventEndTime === "" ? (
                        <span className="text-[15px]">All day</span>
                    ) : (
                        <>
                            {(() => {
                                const timeParts = event.time.split(':');
                                let hours = parseInt(timeParts[0], 10);
                                const ampm = hours >= 12 ? 'PM' : 'AM';
                                hours = hours % 12;
                                hours = hours || 12;
                                const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
                                return formattedHours;
                            })()}
                            <sup className="text-[15px] pl-[2px]">
                                {(() => {
                                    if (!event.time || !event.time.includes(':')) return '00';
                                    const timeParts = event.time.split(':');
                                    const minutes = timeParts[1] ? timeParts[1].padStart(2, '0') : '00';
                                    return minutes;
                                })()}
                            </sup>
                            <span className="text-[15px] pl-[2px]">
                                {(() => {
                                    const timeParts = event.time.split(':');
                                    const hours = parseInt(timeParts[0], 10);
                                    return hours >= 12 ? 'PM' : 'AM';
                                })()}
                            </span>
                        </>
                    )}
                    <span className="block text-sm text-gray-500">
                        {event.Timezone}
                    </span>

                </div>
            )}

            {selectedDates.length > 1 && (
                <div className="text-blue-500 text-[22px] min-w-[90px]">
                    {(() => {
                        const eventDate = new Date(event.EventDate);
                        return eventDate.getDate();
                    })()}
                    <sup className="text-[15px] pl-[2px]">
                        {(() => {
                            const eventDate = new Date(event.EventDate);
                            return eventDate.toLocaleString('en-US', { month: 'short' });
                        })()}
                    </sup>
                    <div className='text-[15px]'>
                        {event.EventStartTime === "" && event.EventEndTime === "" ? (
                            "All day"
                        ) : (
                            (() => {
                                const timeParts = event.time.split(':');
                                let hours = parseInt(timeParts[0], 10);
                                const ampm = hours >= 12 ? 'PM' : 'AM';
                                hours = hours % 12;
                                hours = hours || 12;
                                const minutes = timeParts[1];
                                return `${hours < 10 ? `0${hours}` : hours}:${minutes} ${ampm}`;
                            })()
                        )}
                    </div>
                    <span className="block text-sm text-gray-500">  {event.Timezone?.replace(/\(.*\)/, '')}</span>
                </div>
            )}

            <div className="small-767:w-full small-767:order-1 text-sm font-semibold flex flex-col gap-1">
                {event.title}
                <span className="font-medium"> {event.role }</span>
            </div>

            <div className="flex items-start flex-col gap-1 text-blue-500 min-w-[120px] ml-auto">

                <div className="text-xs font-medium flex gap-1">
                    <LocationIcon />
                    {event.LocationType === 'Online' && (
                        "Online Only"
                    )}
                    {((event.location && event.LocationType == 'Physical' || event.LocationType == 'In Person Only') || !event.LocationType) && (
                        (event.location || "Physical Location") 
                    )}
                    {(event.location && event.LocationType === 'Both') && (
                        (event.location + "/" + "Online")
                    )}
                </div>

                {/* {event.LocationType === 'Online' && (
                    <div className="text-xs font-medium flex gap-1">
                        <LocationIcon />

                        {event.LocationType}
                    </div>
                )}
                  {event.LocationType === 'Both' && (
                    <div className="text-xs font-medium flex gap-1">
                       (Online/)
                    </div>
                )}
                {event.LocationType === 'Physical' && (
                    <div className="text-xs font-medium flex gap-1">

                    </div>
                )} */}
                {event.link && (
                    <a
                        href={event.link} 
                        target="_blank"
                        className="text-blue-500 text-xs font-medium flex gap-1 px-2 py-1 rounded bg-[#eef0f4]"
                    >
                        <LinkIcon />
                        More info
                    </a>
                )}
            </div>
        </div>

        {isActive && (
            <div className="absolute right-4 top-10 bg-white shadow-lg rounded-lg border w-[197px] z-50">
                <ul className="text-base p-4 flex flex-col gap-3">
                    <li
                        onClick={() => openPopup('calendar')}
                        className="flex items-center gap-2 cursor-pointer text-[#080808] font-medium"
                    >
                        <CalenderIcon />
                        Add to my calendar
                    </li>
                    <li
                        onClick={() => openPopup('edit')}
                        className="flex items-center gap-2 cursor-pointer text-[#080808] font-medium"
                    >
                        <EditventIcon />
                        Edit event
                    </li>
                    <li
                        onClick={() => openPopup('share', event)}
                        className="flex items-center gap-2 cursor-pointer text-[#080808] font-medium"
                    >
                        <ShareEventIcon />
                        Share event
                    </li>
                    <hr className="w-full" />
                    <li
                        onClick={() => openPopup('delete')}
                        className="flex items-center gap-2 cursor-pointer text-[#16357A] font-medium"
                    >
                        <DeleteIcon />
                        Delete event
                    </li>
                </ul>
            </div>
        )}
    </div>
);

export default EventCard;