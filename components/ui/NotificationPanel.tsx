import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import moment from 'moment';
import Button from '@/components/ui/button';
import {
  fetchBookingRescheduleRequestById,
  type BookingRescheduleRequestDetailsRecord,
} from '@/lib/booking';

interface Notification {
  NotificationId: number | string;
  ProfilePicture?: string;
  Description?: string;
  NotificationType?: string;
  InviteStatus?: string;
  NotificationDateTime?: string;
  IsRead?: boolean;
  BookingId?: string | number;
  RequestId?: string | number;
  RescheduleRequestId?: string | number;
  BookingRescheduleRequestId?: string | number;
  RequestedStartTime?: string;
  RequestedEndTime?: string;
  ProposedStartTime?: string;
  ProposedEndTime?: string;
  ProviderAvailableStartTime?: string;
  ProviderAvailableEndTime?: string;
  RequesterName?: string;
  RequestedBy?: string;
}

interface Props {
  loader: boolean;
  notificationList: Notification[];
  onNotificationClick: (id: number | string) => void;
  expanded?: boolean;
  onAction?: (notification: Notification, status: string) => Promise<void> | void;
  boxRef?: React.RefObject<HTMLDivElement>;
}

const isBookingRescheduleRequest = (notification?: Notification | null) =>
  notification?.NotificationType === 'Booking Reschedule Request';

const getRequestId = (notification?: Notification | null) =>
  String(
    notification?.RequestId ||
      notification?.RescheduleRequestId ||
      notification?.BookingRescheduleRequestId ||
      notification?.NotificationId ||
      ''
  ).trim();

const getUserDisplayName = (user?: { FirstName?: string; LastName?: string; UserName?: string } | null) => {
  if (!user) return '';

  const fullName = [user.FirstName, user.LastName].filter(Boolean).join(' ').trim();
  return fullName || user.UserName || '';
};

const NotificationPanel: React.FC<Props> = ({
  loader,
  notificationList,
  onNotificationClick,
  expanded,
  onAction,
  boxRef,
}) => {
  const [activeNotification, setActiveNotification] = useState<Notification | null>(null);
  const [requestDetails, setRequestDetails] = useState<BookingRescheduleRequestDetailsRecord | null>(null);
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestError, setRequestError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');

  const formatNotificationTime = (value?: string) => {
    if (!value) return '—';
    const parsed = moment(value);
    return parsed.isValid() ? parsed.format('DD/MM/YYYY hh:mm A') : value;
  };

  const formatStatus = (value?: string) => {
    if (!value) return 'Pending';
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  };

  const getTimeRangeLabel = (start?: string, end?: string) => {
    const startLabel = formatNotificationTime(start);
    const endLabel = formatNotificationTime(end);
    return start && end ? `${startLabel} - ${endLabel}` : '—';
  };

  const closeRequestPopup = () => {
    setActiveNotification(null);
    setRequestDetails(null);
    setRequestError('');
    setActionError('');
    setRequestLoading(false);
  };

  const handleOpenNotification = (notification: Notification) => {
    if (isBookingRescheduleRequest(notification)) {
      setActiveNotification(notification);
      setRequestDetails(null);
      setRequestError('');
      setActionError('');
    }

    if (!notification.IsRead) {
      onNotificationClick(notification.NotificationId);
    }
  };

  useEffect(() => {
    if (!activeNotification || !isBookingRescheduleRequest(activeNotification)) {
      return;
    }

    const requestId = getRequestId(activeNotification);
    if (!requestId) {
      setRequestDetails(null);
      setRequestError('Missing reschedule request ID.');
      setRequestLoading(false);
      return;
    }

    let cancelled = false;

    const loadDetails = async () => {
      try {
        setRequestLoading(true);
        setRequestError('');
        const details = await fetchBookingRescheduleRequestById(requestId);
        if (!cancelled) {
          setRequestDetails(details);
        }
      } catch (error) {
        if (!cancelled) {
          setRequestDetails(null);
          setRequestError(error instanceof Error ? error.message : 'Failed to load request details.');
        }
      } finally {
        if (!cancelled) {
          setRequestLoading(false);
        }
      }
    };

    void loadDetails();

    return () => {
      cancelled = true;
    };
  }, [activeNotification]);

  const handleNotificationAction = async (status: 'Accepted' | 'Rejected') => {
    const notificationToUse: Notification | null =
      requestDetails && activeNotification
        ? {
            ...activeNotification,
            RequestId: requestDetails.RescheduleRequest.Id,
            BookingId: requestDetails.RescheduleRequest.BookingId,
            RequesterName:
              requestDetails.RescheduleRequest.RequesterName ||
              requestDetails.RequestedByUser.FirstName ||
              requestDetails.RequestedByUser.UserName,
            RequestedBy: requestDetails.RescheduleRequest.RequestedBy,
            ProposedStartTime: requestDetails.RescheduleRequest.ProposedStartTime,
            ProposedEndTime: requestDetails.RescheduleRequest.ProposedEndTime,
            RequestedStartTime: requestDetails.RescheduleRequest.ProposedStartTime,
            RequestedEndTime: requestDetails.RescheduleRequest.ProposedEndTime,
            Description: activeNotification.Description || requestDetails.RescheduleRequest.Reason || '',
          }
        : activeNotification;

    if (!notificationToUse) {
      setActionError('The notification details are missing.');
      return;
    }

    if (!onAction) {
      setActionError('The reschedule action is unavailable. Please refresh the page.');
      return;
    }

    try {
      setActionLoading(true);
      setActionError('');
      await onAction(notificationToUse, status);
      closeRequestPopup();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to respond to the reschedule request.';
      console.error('Failed to respond to booking reschedule request:', error);
      setActionError(message);
    } finally {
      setActionLoading(false);
    }
  };

  const displayRequester =
    requestDetails?.RescheduleRequest.RequesterName ||
    getUserDisplayName(requestDetails?.RequestedByUser) ||
    activeNotification?.RequesterName ||
    activeNotification?.RequestedBy ||
    'The provider';

  const displayStatus = formatStatus(requestDetails?.RescheduleRequest.Status || activeNotification?.InviteStatus || 'pending');
  const requestedStartTime =
    requestDetails?.RescheduleRequest.ProposedStartTime ||
    activeNotification?.RequestedStartTime ||
    activeNotification?.ProposedStartTime;
  const requestedEndTime =
    requestDetails?.RescheduleRequest.ProposedEndTime ||
    activeNotification?.RequestedEndTime ||
    activeNotification?.ProposedEndTime;
  const bookingDetails = requestDetails?.Booking;
  const bookingBookerName =
    bookingDetails?.BookerName ||
    getUserDisplayName(bookingDetails?.BookerUserModel) ||
    '—';
  const bookingProviderName =
    bookingDetails?.ProviderName ||
    getUserDisplayName(bookingDetails?.ProviderUserModel) ||
    '—';
  const bookingScheduledTime = getTimeRangeLabel(
    bookingDetails?.ScheduledStartTime,
    bookingDetails?.ScheduledEndTime
  );

  return (
    <div ref={boxRef}>
      <div
        // positioned to appear to the right of the sidebar (handles expanded / collapsed via parent classes)
        className={`bg-white fixed bottom-14 border border-gray-300 md:max-w-[400px] w- max-h-[400px] min-h-[400px] overflow-y-auto rounded-[10px] shadow-lg z-[10001] ${expanded ? 'md:left-[248px] 2xl:left-[calc(264px*var(--scale-factor))] left-[248px]' : 'md:left-[72px] 2xl:left-[calc(72px*var(--scale-factor))] left-[72px]'}`}
        role="dialog"
        aria-label="Notifications"
      >
        <p className="text-h7 font-semibold w-full text-center text-gray-900 p-3 border-b bg-white sticky top-0">
          Notifications
        </p>

        {loader ? (
          <p className="w-full text-center flex items-center justify-center h-[350px]">
            <svg
              className="animate-spin -ml-1 mr-3 h-10 w-10 text-omblue-600"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </p>
        ) : (
          <ul>
            {notificationList.length > 0 ? (
              notificationList.map((notification, index) => {
                const bookingReschedule = isBookingRescheduleRequest(notification);

                return (
                  <li
                    className={`flex items-center gap-3 border-b py-3 px-4 ${notification.IsRead ? 'bg-white' : 'bg-gray-100 cursor-pointer'}`}
                    onClick={() => handleOpenNotification(notification)}
                    key={index}
                  >
                    <Image
                      src={notification?.ProfilePicture || 'https://orisuundocumentsdev.blob.core.windows.net/user-profile/defaultuser.png'}
                      alt={notification?.ProfilePicture || 'Notification avatar'}
                      width={36}
                      height={36}
                      className="rounded-full profile-image w-12 h-12"
                    />

                    <span className="flex items-start flex-col w-[calc(100%-50px)]">
                      <p className="font-medium text-h9 text-gray-800">{notification?.Description}</p>
                      <p className="font-normal text-h10 text-gray-500">
                        {notification.NotificationType == 'Invitation' || notification.NotificationType == 'ContractInvitation' ? (
                          notification?.InviteStatus !== 'Invited' && notification?.InviteStatus !== 'Invite' ? (
                            <div className="flex items-center gap-2 mt-2">
                              {notification?.InviteStatus === 'Accepted' ? (
                                <div className="bg-green-100 text-green-700 py-1 px-3 inline-block rounded text-h9">{notification?.InviteStatus || ''}</div>
                              ) : (
                                <div className="bg-red-100 text-red-700 py-1 px-3 inline-block rounded text-h9">{notification?.InviteStatus || ''}</div>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 mt-2">
                              <Button title="Accept" className="md:min-w-[100px] bg-green-400" onClick={() => onAction && onAction(notification, 'Accepted')} />
                              <Button title="Reject" className="md:min-w-[100px] bg-red-400" onClick={() => onAction && onAction(notification, 'Rejected')} />
                            </div>
                          )
                        ) : bookingReschedule ? (
                          <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-h9 font-medium text-amber-700">
                            Booking reschedule request
                          </span>
                        ) : (
                          moment(notification.NotificationDateTime).format('DD/MM/YYYY')
                        )}
                      </p>
                    </span>

                    {!notification.IsRead && <div className="h-2 w-2 rounded-full bg-omblue-600" />}
                  </li>
                );
              })
            ) : (
              <p className="w-full text-center flex items-center justify-center h-[340px]"> No Notifications</p>
            )}
          </ul>
        )}
      </div>

      {activeNotification && isBookingRescheduleRequest(activeNotification) ? (
        <div className="fixed inset-0 z-[10002] flex items-center justify-center px-4 py-6">
          <button
            type="button"
            aria-label="Close booking reschedule popup"
            className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm"
            onClick={closeRequestPopup}
          />

          <div className="relative z-10 w-full max-w-[720px] rounded-[24px] border border-slate-200 bg-white p-3 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
               
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                  Review request
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {displayRequester} requested a new booking time.
                </p>
              </div>

              <div className="rounded-full bg-[#EEF4FF] px-4 py-2 text-sm font-semibold text-[#2d5bd1]">
                {displayStatus}
              </div>
            </div>

            <div className="mt-4 ">

              <div className="grid gap-2 sm:grid-cols-2">
                <div className="">
                  <p className="text-xs font-medium  text-slate-500">Requested by</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {displayRequester}
                  </p>
                </div>
              
                <div className="">
                  <p className="text-xs font-medium  text-slate-500">Requested time</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {getTimeRangeLabel(requestedStartTime, requestedEndTime)}
                  </p>
                </div>
              
                <div className="">
                  <p className="text-xs font-medium  text-slate-500">Meeting </p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {bookingDetails?.MeetingTypeName || bookingDetails?.MeetingType || '—'}
                  </p>
                </div>

                <div className="">
                  <p className="text-xs font-medium  text-slate-500">Scheduled time</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {bookingScheduledTime}
                  </p>
                </div>
             
                

                <div className="">
                  <p className="text-xs font-medium  text-slate-500">Duration</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {bookingDetails?.MeetingDurationMinutes ? `${bookingDetails.MeetingDurationMinutes} min` : '—'}
                  </p>
                </div>
              </div>

              <div className=" ">
                <p className="text-xs font-medium  text-slate-500">Reason</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {requestDetails?.RescheduleRequest.Reason || activeNotification.Description || 'A booking reschedule was requested.'}
                </p>
              </div>

              {bookingDetails?.DailyRoomName ? (
                <div className="mt-2 ">
                  <p className="text-xs font-medium  text-slate-500">Daily room</p>
                  <p className="mt-2 break-all text-sm leading-6 text-slate-700">
                    {bookingDetails.DailyRoomName}
                  </p>
                </div>
              ) : null}

              {requestDetails?.RescheduleRequest.ResponseNote ? (
                <div className="mt-2 ">
                  <p className="text-xs font-medium  text-slate-500">Response note</p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {requestDetails.RescheduleRequest.ResponseNote}
                  </p>
                </div>
              ) : null}

            </div>

            {/* {requestError || actionError ? (
              <div
                role="alert"
                className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
              >
                {actionError || requestError}
              </div>
            ) : null} */}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                title={actionLoading ? 'Processing...' : 'Reject'}
                className="min-w-[130px] border rounded-full border-slate-200 bg-white text-omblue-600 hover:bg-omblue-50"
                onClick={() => void handleNotificationAction('Rejected')}
                disabled={actionLoading || requestLoading}
              />
              <Button
                type="button"
                title={actionLoading ? 'Processing...' : 'Accept'}
                className="min-w-[130px] rounded-full bg-omblue-600"
                onClick={() => void handleNotificationAction('Accepted')}
                disabled={actionLoading || requestLoading}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default NotificationPanel;
