'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Tooltip from '@/components/ui/tooltip';
import swal from 'sweetalert';
import EditEventPopup from '../../../../(marketing)/calendar/popups/EditEventPopup';
import * as eventApi from '../../../../api/dashboard/eventApi';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatTime = (timeString) => {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':');
  return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
};

const SuperAdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eventTypeMapping, setEventTypeMapping] = useState({});
  const [countries, setCountries] = useState([]);
  const [deleteType, setDeleteType] = useState('soft');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteRequests, setDeleteRequests] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const eventsPerPage = 100;


  const handleEditEvent = (event) => {

    setSelectedEvent(event);
    setShowEditPopup(true);
  };
  const handleCloseEditPopup = (refresh = false) => {
    setShowEditPopup(false);
    if (refresh) {
      fetchEvents();
    }
  };

  const fetchDeleteRequests = async () => {
    try {
      const data = await eventApi.fetchDeleteRequests();
      setDeleteRequests(data);
    } catch (err) {
      console.error('Error fetching delete requests:', err);
    }
  };

  const fetchCountries = async () => {
    try {
      const data = await eventApi.fetchCountries();
      setCountries(data);
    } catch (err) {
      console.error('Error fetching countries:', err);
    }
  };

  const fetchEventTypes = async () => {
    try {
      const data = await eventApi.fetchEventTypes();
      const mapping = data.reduce((acc, event) => {
        acc[event.Id] = event.Title;
        return acc;
      }, {});
      setEventTypeMapping(mapping);
    } catch (err) {
      console.error('Error fetching event types:', err);
    }
  };

  const fetchEvents = async () => {
    try {
      const data = await eventApi.fetchEvents();
      const getEventTypeName = (id) => eventTypeMapping[id] || '';
      const getCountryName = (id) => {
        if (!countries || countries.length === 0) return '';
        const country = countries.find(c => c.Id == id);
        return country ? country.CountryName : '';
      };

      const transformedEvents = data.map((event) => {
        const startTime = event.EventStartTime?.split('T')[1]?.split(':').slice(0, 2).join(':') || '';
        const endTime = event.EventEndTime?.split('T')[1]?.split(':').slice(0, 2).join(':') || '';
        const deleteRequest = deleteRequests.find(req => req.EventId === event.Id);

        return {
          id: event.Id,
          title: event.Title,
          type: getEventTypeName(event.EventsTypeId),
          typeId: event.EventsTypeId,
          country: getCountryName(event.CountryId),
          city: event.CityName,
          date: formatDate(event.EventDate),
          startTime: formatTime(startTime),
          endTime: formatTime(endTime),
          createdBy: event.CreatedBy,
          ContactEmail: event.ContactEmail,
          isDeleted: event.IsDeleted,
          deleteRequestsCount: deleteRequest ? deleteRequest.Count : 0,
          Timezone: event.TimeZone
        };
      }).sort((a, b) => b.id - a.id);

      setEvents(transformedEvents);
      setLoading(false);
    } catch (err) {
      setError(err.message.includes('JSON') ? 'The server returned an invalid response. Please try again later.' : err.message);
      setLoading(false);
    }
  };

  const handleDelete = async (eventId, type = 'soft') => {
    try {
      const willDelete = await swal({
        title: 'Are you sure?',
        text: type === 'soft'
          ? 'This will mark the event as deleted. Are you sure?'
          : 'This will permanently delete the event. This action cannot be undone!',
        icon: 'warning',
        dangerMode: true,
        buttons: {
          cancel: {
            text: 'Cancel',
            value: null,
            visible: true,
            className: 'swal-button--cancel',
            closeModal: true,
          },
          confirm: {
            text: type === 'soft' ? 'Delete' : 'Delete Permanently',
            value: true,
            visible: true,
            className: 'swal-button--confirm',
            closeModal: false,
          },
        },
      });

      if (willDelete) {
        await eventApi.deleteEvent(eventId);
        fetchEvents();
        swal('Deleted!', `Event has been ${type === 'soft' ? 'moved to trash' : 'permanently deleted'}!`, 'success');
      } else {
        swal('Cancelled', 'Your event is safe.', 'info');
      }
    } catch (err) {
      swal('Failed!', 'Failed to delete event.', 'error');
    }
  };

  const handleRestore = async (eventId) => {
    try {
      const willRestore = await swal({
        title: 'Are you sure?',
        text: 'Are you sure that you want to restore this event?',
        icon: 'warning',
        dangerMode: true,
        buttons: {
          cancel: {
            text: 'Cancel',
            value: null,
            visible: true,
            className: 'swal-button--cancel',
            closeModal: true,
          },
          confirm: {
            text: 'Confirm',
            value: true,
            visible: true,
            className: 'swal-button--confirm',
            closeModal: false,
          },
        },
      });

      if (willRestore) {
        await eventApi.restoreEvent(eventId);
        fetchEvents();
        swal('Restored!', 'Event has been restored!', 'success');
      } else {
        swal('Cancelled', 'Your event remains in trash.', 'info');
      }
    } catch (err) {
      swal('Failed!', 'Failed to restore event.', 'error');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchCountries();
      await fetchEventTypes();
      await fetchDeleteRequests();
    };
    loadData();
  }, []);

  useEffect(() => {
    if (Object.keys(eventTypeMapping).length > 0 && countries.length > 0) {
      fetchEvents();
    }
  }, [eventTypeMapping, countries, deleteRequests]);

  const filteredEvents = useMemo(() => {
    return events.filter(event =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.city && event.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (event.country && event.country.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [events, searchTerm]);

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">Loading events...000</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold text-red-500">Error: {error}</div>
      </div>
    );
  }


  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-8">Events Management</h1>

      <div className="mb-4 sm:mb-6 flex flex-col gap-2 sm:gap-4">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search events..."
            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
        <div className="text-sm sm:text-base text-gray-600">
          Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-3 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-3 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-3 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date/Time</th>
                <th className="px-3 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-3 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-3 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase">Delete Requests</th>
                <th className="px-3 sm:px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentEvents.length > 0 ? (
                currentEvents.map((event) => (
                  <tr key={event.id} className={`hover:bg-gray-50 ${event.isDeleted ? 'bg-red-50' : ''}`}>
                    <td className="px-3 sm:px-6 py-4  ">
                      <div className="text-sm font-medium text-gray-900">{event.title}</div>
                      <div className="text-xs sm:text-sm text-gray-500">By: {event.createdBy}</div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-sm text-gray-500">
                      {event.type}
                    </td>
                    <td className="px-3 sm:px-6 py-4">
                      <div className="text-sm text-gray-900">{event.city}</div>
                      <div className="text-sm text-gray-500">{event.country}</div>
                    </td>
                    <td className="px-3 sm:px-6 py-4  ">
                      <div className="text-sm text-gray-500">{event.date}</div>
                      <div className="text-xs sm:text-sm text-gray-500">
                        {event.startTime} - {event.endTime}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4">
                      <div className="text-xs sm:text-sm text-center text-gray-500">
                        {event.ContactEmail}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${event.isDeleted ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                        {event.isDeleted ? 'Deleted' : 'Active'}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-center text-sm">
                      {deleteRequests.find(item => item.EventId === event.id) ? (
                        (() => {
                          const request = deleteRequests.find(item => item.EventId === event.id);
                          return (
                            <>
                              Canceled: {request.CanceledCount ?? 0}<br />
                              Duplicate Entry: {request.DuplicateCount ?? 0}<br />
                              Irrelevant: {request.IrrelevantCount ?? 0}<br />
                              Other: {request.OtherCount ?? 0}
                            </>
                          );
                        })()) : ('0')}
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-sm font-medium">
                      <div className="flex items-center justify-start sm:justify-center space-x-1 sm:space-x-2">
                        {!event.isDeleted ? (
                          <>
                            <Tooltip content="Edit Event">
                              <button
                                className="text-blue-600 hover:text-blue-900 p-1"
                                onClick={() => handleEditEvent(event)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  version="1.1"
                                  width="16"
                                  height="16"
                                  x="0"
                                  y="0"
                                  viewBox="0 0 24 24"
                                  className="w-4 h-4 sm:w-5 sm:h-5"
                                >
                                  <g>
                                    <path
                                      d="m14.46 3.26.88-.88c1.04-1.04 2.85-1.04 3.89 0l.71.71a2.732 2.732 0 0 1 0 3.88l-.88.88-4.6-4.6zM13.4 4.32l-9.11 9.11c-.29.29-.47.67-.5 1.08l-.27 2.93c-.03.37.1.73.36 1 .24.24.55.37.88.37h.11l2.93-.27c.41-.04.79-.22 1.08-.51l9.11-9.11-4.6-4.6zM22.75 22c0-.41-.34-.75-.75-.75H2c-.41 0-.75.34-.75.75s.34.75.75.75h20c.41 0 .75-.34.75-.75z"
                                      fill="#2357c6"
                                      opacity="1"
                                      data-original="#2357c6"
                                    ></path>
                                  </g>
                                </svg>
                              </button>
                            </Tooltip>
                            <Tooltip content="Delete Event">
                              <button
                                onClick={() => handleDelete(event.id, 'soft')}
                                className="text-red-600 hover:text-red-900 p-1"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  version="1.1"
                                  width="16"
                                  height="16"
                                  x="0"
                                  y="0"
                                  viewBox="0 0 24 24"
                                  className="w-4 h-4 sm:w-5 sm:h-5"
                                >
                                  <g>
                                    <path
                                      d="m21 5H3a1 1 0 0 0 0 2h2v12a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V7h2a1 1 0 0 0 0-2zM11 16a1 1 0 0 1-2 0v-5a1 1 0 0 1 2 0zm4 0a1 1 0 0 1-2 0v-5a1 1 0 0 1 2 0zM10 4h4a1 1 0 0 0 0-2h-4a1 1 0 0 0 0 2z"
                                      fill="#ef4444"
                                      opacity="1"
                                      data-original="#ef4444"
                                    ></path>
                                  </g>
                                </svg>
                              </button>
                            </Tooltip>
                          </>
                        ) : (
                          <>
                            <Tooltip content="Restore Event">
                              <button
                                onClick={() => handleRestore(event.id)}
                                className="text-green-600 hover:text-green-900 p-1"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="#2357c6"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="w-4 h-4 sm:w-5 sm:h-5"
                                >
                                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                                  <path d="M21 3v5h-5"></path>
                                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                                  <path d="M8 16H3v5"></path>
                                </svg>
                              </button>
                            </Tooltip>
                            <Tooltip content="Delete Permanently">
                              <button
                                onClick={() => handleDelete(event.id, 'permanent')}
                                className="text-red-600 hover:text-red-900 p-1"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  version="1.1"
                                  width="16"
                                  height="16"
                                  x="0"
                                  y="0"
                                  viewBox="0 0 24 24"
                                  className="w-4 h-4 sm:w-5 sm:h-5"
                                >
                                  <g>
                                    <path
                                      d="m21 5H3a1 1 0 0 0 0 2h2v12a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V7h2a1 1 0 0 0 0-2zM11 16a1 1 0 0 1-2 0v-5a1 1 0 0 1 2 0zm4 0a1 1 0 0 1-2 0v-5a1 1 0 0 1 2 0zM10 4h4a1 1 0 0 0 0-2h-4a1 1 0 0 0 0 2z"
                                      fill="#ef4444"
                                      opacity="1"
                                      data-original="#ef4444"
                                    ></path>
                                  </g>
                                </svg>
                              </button>
                            </Tooltip>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    No events found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {showEditPopup && (
          <EditEventPopup
            isOpen={showEditPopup}
            onClose={handleCloseEditPopup}
            eventData={selectedEvent}
          />
        )}

        {totalPages > 1 && (
          <div className="bg-white px-2 sm:px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <p className="text-xs sm:text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstEvent + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(indexOfLastEvent, filteredEvents.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredEvents.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-4 w-4 sm:h-5 sm:w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let page;
                    if (totalPages <= 5) {
                      page = i + 1;
                    } else if (currentPage <= 3) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-3 sm:px-4 py-2 border text-xs sm:text-sm font-medium ${currentPage === page
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-xs sm:text-sm font-medium text-gray-700">
                      ...
                    </span>
                  )}
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-4 w-4 sm:h-5 sm:w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminEvents;