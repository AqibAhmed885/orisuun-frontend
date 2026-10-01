"use client";

import React, { useEffect, useState } from 'react';
import { CalendarDays, Check } from 'lucide-react';
import CheckoutProfile from '../checkout/CheckoutProfile';
import { apiClient } from '@/utils/api-client';
import useCurrentUser from '@/hooks/useCurrentUser';
import { requestBookingReschedule } from '@/lib/booking';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import type { RootState } from '@/data/store';
import { fetchProfileDetails } from '@/app/api/profile-details';
import { resolveBookingProvider } from '@/utils/booking-provider';

type BookingProviderUser = {
  Id?: string;
  UserName?: string;
  FirstName?: string;
  LastName?: string;
  ProfilePicture?: string | null;
  UserProfileTypeId?: number | string;
  ProfileTypeId?: number | string;
  UserProfileType?: string;
  ProfileType?: string;
  IsVerified?: boolean;
  ProfileVerified?: boolean;
};

type BookingResult = {
  Id: string;
  BookerName: string;
  ProviderUserId?: string;
  ProviderUserName?: string;
  ProviderName: string;
  ProviderProfilePicture?: string | null;
  ProviderProfileTypeId?: number | string;
  ProviderIsVerified?: boolean;
  ProviderUserModel?: BookingProviderUser | null;
  MeetingType: string;
  MeetingTypeName: string;
  MeetingDurationMinutes: number;
  ScheduledStartTime: string;
  TotalPrice: number;
  Currency: string;
  CreatedAt: string;
  Status?: string;
};

type BookingApiResponse = {
  StatusCode?: number;
  Message?: string;
  Result?: BookingResult;
};

const cancellationRules = [
  'Calls can be rescheduled up to 2 hours before the session.',
  'Cancellations must be submitted via the dashboard contact form at least 24 hours before your call.',
];

function formatDate(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatDateTime(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatAmount(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount || 0);
}

export default function BookingConfirmClient({ bookingId }: { bookingId: string }) {
  const draft = useSelector((state: RootState) => state.booking.draft);
  const [booking, setBooking] = useState<BookingResult | null>(null);
  const [providerDetails, setProviderDetails] = useState(() => ({
    providerAvatar: draft?.providerAvatar || '',
    providerProfileTypeId: draft?.providerProfileTypeId,
    providerIsVerified: draft?.providerIsVerified || false,
  }));
  const [loading, setLoading] = useState(Boolean(bookingId));
  const [error, setError] = useState<string | null>(bookingId ? null : 'Missing booking ID.');
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [proposedDateTime, setProposedDateTime] = useState('');
  const [rescheduleReason, setRescheduleReason] = useState('');
  const [rescheduling, setRescheduling] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const { user } = useCurrentUser();
  const userId = user?.Id || user?.id || '';

  useEffect(() => {
    if (!bookingId) {
      setLoading(false);
      setError('Missing booking ID.');
      return;
    }

    let cancelled = false;

    const loadBooking = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.get<BookingApiResponse>('/Booking/GetBooking', {
          params: { bookingId },
        });

        const result = response.data?.Result ?? null;

        if (!result) {
          throw new Error(response.data?.Message || 'Booking not found.');
        }

        if (!cancelled) {
          setBooking(result);
          setCancelled(result.Status?.toLowerCase() === 'cancelled');

          const matchingDraft =
            result.ProviderUserId && draft?.providerUserId === result.ProviderUserId
              ? draft
              : null;
          const bookingProviderSource = {
            ...(result.ProviderUserModel || {}),
            CompanyName: result.ProviderName,
            ProfilePicture:
              result.ProviderUserModel?.ProfilePicture ||
              result.ProviderProfilePicture ||
              matchingDraft?.providerAvatar ||
              '',
            UserProfileTypeId:
              result.ProviderUserModel?.UserProfileTypeId ??
              result.ProviderUserModel?.ProfileTypeId ??
              result.ProviderProfileTypeId ??
              matchingDraft?.providerProfileTypeId,
            ProfileVerified:
              result.ProviderUserModel?.ProfileVerified ??
              result.ProviderUserModel?.IsVerified ??
              result.ProviderIsVerified ??
              matchingDraft?.providerIsVerified ??
              false,
          };
          const bookingProvider = resolveBookingProvider(bookingProviderSource);

          setProviderDetails({
            providerAvatar: bookingProvider.providerAvatar,
            providerProfileTypeId: bookingProvider.providerProfileTypeId,
            providerIsVerified: bookingProvider.providerIsVerified,
          });
          setLoading(false);

          const providerUsername =
            result.ProviderUserModel?.UserName || result.ProviderUserName;

          if (providerUsername) {
            try {
              const publicProfile = await fetchProfileDetails({
                username: providerUsername,
              });
              const enrichedProvider = resolveBookingProvider({
                ...bookingProviderSource,
                ...(publicProfile || {}),
                CompanyName: result.ProviderName,
                ProfilePicture:
                  publicProfile?.ProfilePicture || bookingProvider.providerAvatar,
                UserProfileTypeId:
                  publicProfile?.UserProfileTypeId ??
                  bookingProvider.providerProfileTypeId,
                ProfileVerified:
                  publicProfile?.ProfileVerified ??
                  publicProfile?.IsVerified ??
                  bookingProvider.providerIsVerified,
              });

              if (!cancelled) {
                setProviderDetails({
                  providerAvatar: enrichedProvider.providerAvatar,
                  providerProfileTypeId: enrichedProvider.providerProfileTypeId,
                  providerIsVerified: enrichedProvider.providerIsVerified,
                });
              }
            } catch {
              // The booking response/draft still provides a usable profile fallback.
            }
          }
        }
      } catch (err: any) {
        if (!cancelled) {
          setBooking(null);
          setError(err?.response?.data?.Message || err?.message || 'Failed to load booking details.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadBooking();

    return () => {
      cancelled = true;
    };
  }, [bookingId, draft]);

  const openReschedule = () => {
    if (!booking) return;

    const currentStart = new Date(booking.ScheduledStartTime);
    const localDateTime = new Date(
      currentStart.getTime() - currentStart.getTimezoneOffset() * 60_000
    )
      .toISOString()
      .slice(0, 16);

    setProposedDateTime(localDateTime);
    setRescheduleReason('');
    setRescheduleOpen(true);
  };

  const handleReschedule = async () => {
    if (!booking || !userId) {
      toast.error('Please sign in before rescheduling this booking.');
      return;
    }

    const proposedStart = new Date(proposedDateTime);
    if (!proposedDateTime || Number.isNaN(proposedStart.getTime())) {
      toast.error('Please select a valid date and time.');
      return;
    }

    const proposedEnd = new Date(
      proposedStart.getTime() + (booking.MeetingDurationMinutes || 60) * 60_000
    );

    setRescheduling(true);

    try {
      await requestBookingReschedule({
        BookingId: booking.Id,
        RequestedBy: String(userId),
        ProposedStartTime: proposedStart.toISOString(),
        ProposedEndTime: proposedEnd.toISOString(),
        Reason: rescheduleReason.trim() || 'Reschedule requested from booking confirmation page',
      });
      setRescheduleOpen(false);
      toast.success('Reschedule request sent successfully.');
    } catch (actionFailure) {
      const message =
        actionFailure instanceof Error ? actionFailure.message : 'Unable to reschedule booking.';
      toast.error(message);
    } finally {
      setRescheduling(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!booking || !userId) {
      toast.error('Please sign in before cancelling this booking.');
      return;
    }

    setCancelling(true);

    try {
      await apiClient.post('/Booking/CancelBooking', {
        BookingId: booking.Id,
        CancelledBy: String(userId),
        CancellationReason: 'Cancelled from booking confirmation page',
      });
      setCancelled(true);
      setBooking((current) => (current ? { ...current, Status: 'cancelled' } : current));
      toast.success('Booking cancelled successfully.');
    } catch (actionFailure) {
      const apiMessage =
        typeof actionFailure === 'object' &&
        actionFailure !== null &&
        'response' in actionFailure
          ? (actionFailure as {
              response?: { data?: { Message?: string; message?: string } };
            }).response?.data
          : undefined;
      const message =
        apiMessage?.Message ||
        apiMessage?.message ||
        (actionFailure instanceof Error
          ? actionFailure.message
          : 'Unable to cancel booking.');
      toast.error(message);
    } finally {
      setCancelling(false);
    }
  };

  const meetingTypeLabel = booking?.MeetingTypeName || booking?.MeetingType || 'Building a successful Digital Agency in 2026';
  const meetingTimeLabel = booking
    ? `${formatDateTime(booking.ScheduledStartTime)} (${booking.MeetingDurationMinutes} min)`
    : 'Sun, May 17, 2026 11:00AM (60 min)';
  const totalLabel = booking ? formatAmount(booking.TotalPrice, booking.Currency) : '$80';
  const bookingIdLabel = booking?.Id || 'LW91800880180808128';
  const bookingDateLabel = booking ? formatDate(booking.CreatedAt) : '5/14/2026';

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <div className="border-b border-slate-100 bg-white px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1440px] text-lg font-bold">Booking confirmed</div>
      </div>

      <section className="relative overflow-hidden pb-16">
        <div className="absolute inset-x-0 top-0 h-[254px] rounded-b-3xl bg-[#D1F8E6]" />

        <div className="relative mx-auto max-w-[1440px] px-4 pt-20 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-center gap-3 text-[#118357]">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#19C58F] text-white">
              <Check className="h-8 w-8" strokeWidth={2.8} />
            </span>
            <h1 className="text-3xl font-bold">Booking Confirmed!</h1>
          </div>

          {loading ? (
            <div className="grid gap-10 lg:grid-cols-[minmax(0,530px)_1px_minmax(0,610px)] lg:gap-16 lg:items-start">
              <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-[0_20px_40px_rgba(15,23,42,0.08)]">
                Loading booking details...
              </div>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-rose-200 bg-white p-8 shadow-[0_20px_40px_rgba(15,23,42,0.08)]">
              {error}
            </div>
          ) : (
            <div className="grid gap-10 lg:grid-cols-[minmax(0,530px)_1px_minmax(0,610px)] lg:gap-16 lg:items-start">
              <aside className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_20px_40px_rgba(15,23,42,0.08)]">
                <div className="rounded-[24px] border border-slate-200 bg-white px-5 py-7 sm:px-8">
                  <CheckoutProfile
                    size={180}
                    providerName={booking?.ProviderName}
                    providerAvatar={providerDetails.providerAvatar}
                    providerProfileTypeId={providerDetails.providerProfileTypeId}
                    providerIsVerified={providerDetails.providerIsVerified}
                  />

                  <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <h2 className="max-w-[330px] text-2xl font-bold leading-tight tracking-tight text-slate-950">
                      {meetingTypeLabel}
                    </h2>
                    <div className="w-full rounded-2xl border border-[#9ECFFF] bg-[#D2EBFF] px-5 py-2 text-center text-base font-bold text-slate-800 sm:w-[170px]">
                      <div>Full</div>
                      <div className="text-sm font-medium text-slate-600">
                        ({booking?.MeetingDurationMinutes || 60} min)
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3 text-base font-semibold text-slate-900">
                      <CalendarDays className="h-5 w-5 text-slate-700" />
                      <span>{meetingTimeLabel}</span>
                    </div>
                    <button
                      type="button"
                      onClick={openReschedule}
                      disabled={cancelled}
                      className="self-start text-base font-bold text-slate-900 underline underline-offset-4 disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-6">
                    <span className="text-lg font-bold text-slate-900">Total</span>
                    <span className="text-3xl font-bold tracking-tight text-slate-950">{totalLabel}</span>
                  </div>
                </div>

                <section className="px-1 pb-2 pt-12 sm:px-4">
                  <h2 className="text-2xl font-bold text-slate-950">Cancellation</h2>
                  <ul className="mt-5 space-y-4 text-sm leading-6 text-slate-900">
                    {cancellationRules.map((rule) => (
                      <li key={rule} className="flex gap-3">
                        <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-900" />
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </aside>

              <div className="hidden min-h-[835px] w-px bg-slate-200 lg:block" />

              <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_20px_40px_rgba(15,23,42,0.08)] sm:p-8 lg:mt-4">
                <h2 className="text-4xl font-bold tracking-tight text-slate-950">Booking details</h2>

                <dl className="mt-10 space-y-6">
                  <div className="flex items-center justify-between gap-6 text-xl">
                    <dt className="font-medium text-slate-900">Booking ID</dt>
                    <dd className="text-right font-bold text-slate-950">{bookingIdLabel}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-6 text-xl">
                    <dt className="font-medium text-slate-900">Booking date</dt>
                    <dd className="text-right font-bold text-slate-950">{bookingDateLabel}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-6 text-xl">
                    <dt className="font-medium text-slate-900">Amount paid</dt>
                    <dd className="text-right font-bold text-slate-950">{totalLabel}</dd>
                  </div>
                </dl>

                <div className="mt-12 space-y-5">
                  <button
                    type="button"
                    onClick={openReschedule}
                    disabled={cancelled || cancelling}
                    className="h-14 w-full rounded-md bg-[#2D5BC8] text-base font-bold text-white shadow-sm transition hover:bg-[#244DAE] disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    Reschedule
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleCancelBooking()}
                    disabled={cancelled || cancelling}
                    className="h-14 w-full rounded-md border border-slate-200 bg-white text-base font-bold text-slate-500 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-100"
                  >
                    {cancelling ? 'Cancelling…' : cancelled ? 'Booking Cancelled' : 'Cancel Booking'}
                  </button>
                </div>

                <p className="mt-7 text-sm leading-6 text-slate-900">
                  <span className="font-bold">Cancellation Policy Alert:</span> 50% cancellation fee applies within 24 hours.
                </p>
              </section>
            </div>
          )}
        </div>
      </section>

      {rescheduleOpen && booking ? (
        <div className="fixed inset-0 z-[10020] flex items-center justify-center px-4 py-6">
          <button
            type="button"
            aria-label="Close reschedule dialog"
            className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm"
            onClick={() => !rescheduling && setRescheduleOpen(false)}
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="reschedule-title"
            className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
          >
            <h2 id="reschedule-title" className="text-2xl font-bold text-slate-950">
              Reschedule booking
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Select a proposed time. The other participant will be asked to approve it.
            </p>

            <label className="mt-6 block">
              <span className="mb-2 block text-sm font-semibold text-slate-800">
                New date and time
              </span>
              <input
                type="datetime-local"
                value={proposedDateTime}
                onChange={(event) => setProposedDateTime(event.target.value)}
                disabled={rescheduling}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-[#2D5BC8]"
              />
            </label>

            <label className="mt-4 block">
              <span className="mb-2 block text-sm font-semibold text-slate-800">
                Reason (optional)
              </span>
              <textarea
                value={rescheduleReason}
                onChange={(event) => setRescheduleReason(event.target.value)}
                disabled={rescheduling}
                rows={3}
                className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-[#2D5BC8]"
              />
            </label>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setRescheduleOpen(false)}
                disabled={rescheduling}
                className="rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-700 disabled:opacity-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => void handleReschedule()}
                disabled={rescheduling || !proposedDateTime}
                className="rounded-lg bg-[#2D5BC8] px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {rescheduling ? 'Sending…' : 'Request reschedule'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
