import axios from 'axios';
import { apiClient } from '@/utils/api-client';

export type BookingRecord = {
  Id: string;
  BookerUserId: string;
  BookerName?: string | null;
  ProviderUserId: string;
  ProviderName?: string | null;
  MeetingType: string;
  MeetingTypeName?: string | null;
  MeetingDurationMinutes: number;
  ScheduledStartTime: string;
  ScheduledEndTime: string;
  ActualStartTime: string | null;
  ActualEndTime: string | null;
  MeetingPurpose: string | null;
  Status: string;
  BasePrice: number;
  TotalPrice: number;
  Currency: string;
  IsPaid: boolean;
  IsRefunded: boolean;
  RefundAmount: number;
  DailyRoomUrl: string | null;
  DailyRoomId: string | null;
  DailyRoomName: string | null;
  BookerMeetingToken: string | null;
  ProviderMeetingToken: string | null;
  ReferralDocumentUrls?: string[] | null;
  Email?: string[] | null;
  CreatedAt: string;
  UpdatedAt: string;
};

export type BookingRescheduleRequestRecord = {
  Id: string;
  BookingId: string;
  RequestedBy: string;
  RequesterName?: string;
  ProposedStartTime: string;
  ProposedEndTime: string;
  Reason: string | null;
  Status: 'pending' | 'accepted' | 'rejected' | string;
  RespondedBy?: string | null;
  RespondedAt?: string | null;
  ResponseNote?: string | null;
  CreatedAt: string;
};

export type BookingUserRecord = {
  Id: string;
  UserName: string;
  FirstName: string;
  LastName: string;
  Email: string | null;
  PhoneNumber: string | null;
  ProfilePicture: string | null;
};

export type BookingRescheduleRequestDetailsRecord = {
  RescheduleRequest: BookingRescheduleRequestRecord;
  Booking: BookingRecord & {
    BookerUserModel?: BookingUserRecord | null;
    ProviderUserModel?: BookingUserRecord | null;
    BookerTeamId?: string | number | null;
    ProviderTeamId?: string | number | null;
    MeetingTypeId?: string | number | null;
    PackageId?: string | number | null;
    TopicId?: string | number | null;
    CancellationReason?: string | null;
    CancelledBy?: string | null;
    CancelledAt?: string | null;
    StripePaymentIntentId?: string | null;
    StripeTransferId?: string | null;
    StripeRefundId?: string | null;
    LeadTimeSatisfied?: boolean | null;
    CalendarSyncStatus?: string | null;
    ExternalCalendarEventId?: string | null;
  };
  RequestedByUser: BookingUserRecord;
};

export type RequestBookingReschedulePayload = {
  BookingId: string;
  RequestedBy: string;
  ProposedStartTime: string;
  ProposedEndTime: string;
  Reason?: string;
};

export type RespondToBookingReschedulePayload = {
  RescheduleRequestId: string;
  RespondedBy: string;
  Status: 'accepted' | 'rejected';
  ResponseNote?: string;
};

type ApiEnvelope<T> = {
  StatusCode: number;
  Message: string;
  Result: T;
};

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return (
      (error.response?.data as { Message?: string; message?: string } | undefined)?.Message ||
      (error.response?.data as { Message?: string; message?: string } | undefined)?.message ||
      error.message ||
      'Request failed'
    );
  }

  return error instanceof Error ? error.message : 'Request failed';
};

export async function fetchBookingById(bookingId: string): Promise<BookingRecord> {
  if (!bookingId.trim()) {
    throw new Error('Booking ID is required.');
  }

  try {
    const response = await apiClient.get<ApiEnvelope<BookingRecord>>('/Booking/GetBooking', {
      params: { bookingId },
    });

    const booking = response.data?.Result;

    if (!booking) {
      throw new Error('Booking not found.');
    }

    return booking;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function fetchUserBookings(userId: string): Promise<BookingRecord[]> {
  if (!userId.trim()) {
    return [];
  }

  try {
    const response = await apiClient.get<ApiEnvelope<BookingRecord[]>>(
      '/Booking/GetUserBookings',
      {
        params: { userId },
      }
    );

    return Array.isArray(response.data?.Result) ? response.data.Result : [];
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function requestBookingReschedule(
  payload: RequestBookingReschedulePayload
): Promise<BookingRescheduleRequestRecord> {
  try {
    const response = await apiClient.post<ApiEnvelope<BookingRescheduleRequestRecord>>(
      '/Booking/RequestReschedule',
      payload
    );

    const request = response.data?.Result;

    if (!request) {
      throw new Error('Reschedule request response was empty.');
    }

    return request;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function respondToBookingReschedule(
  payload: RespondToBookingReschedulePayload
): Promise<{
  rescheduleRequest: BookingRescheduleRequestRecord;
  updatedBooking: BookingRecord | null;
}> {
  try {
    const response = await apiClient.post<
      ApiEnvelope<{
        RescheduleRequest: BookingRescheduleRequestRecord;
        UpdatedBooking: BookingRecord | null;
      }>
    >('/Booking/RespondToReschedule', payload);

    const result = response.data?.Result;

    if (!result?.RescheduleRequest) {
      throw new Error('Reschedule response was empty.');
    }

    return {
      rescheduleRequest: result.RescheduleRequest,
      updatedBooking: result.UpdatedBooking ?? null,
    };
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function fetchBookingRescheduleRequestById(
  requestId: string
): Promise<BookingRescheduleRequestDetailsRecord> {
  if (!requestId.trim()) {
    throw new Error('Reschedule request ID is required.');
  }

  try {
    const response = await apiClient.get<ApiEnvelope<BookingRescheduleRequestDetailsRecord>>(
      '/Booking/GetRescheduleRequestById',
      {
        params: { requestId },
      }
    );

    const request = response.data?.Result;

    if (!request) {
      throw new Error('Reschedule request not found.');
    }

    return request;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function fetchBookingRescheduleRequests(
  bookingId: string
): Promise<BookingRescheduleRequestRecord[]> {
  if (!bookingId.trim()) {
    return [];
  }

  try {
    const response = await apiClient.get<ApiEnvelope<BookingRescheduleRequestRecord[]>>(
      '/Booking/GetRescheduleRequests',
      {
        params: { bookingId },
      }
    );

    return response.data?.Result ?? [];
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
