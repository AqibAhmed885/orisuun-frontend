import axios from 'axios';
import * as signalR from '@microsoft/signalr';
import { apiClient } from '@/utils/api-client';
import { getAccessToken } from '@/utils/auth-token';

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_APP_BASE_URL ||
  'https://api.orisuun.com'
).replace(/\/+$/g, '');

export const BOOKING_CHAT_HUB_URL = `${API_BASE_URL}/chatHub`;

export type BookingChatMessage = {
  Id: string;
  BookingId: string;
  SenderUserId: string | null;
  SenderName?: string | null;
  GuestName: string | null;
  GuestEmail: string | null;
  Message: string;
  MessageType: string;
  AttachmentUrl: string | null;
  IsRead: boolean;
  ReadAt: string | null;
  IsEdited: boolean;
  EditedAt: string | null;
  IsDeleted: boolean;
  CreatedAt: string;
  TimeStatus?: string;
};

export type SendBookingChatMessagePayload = {
  BookingId: string;
  SenderUserId?: string;
  GuestName?: string;
  GuestEmail?: string;
  Message: string;
  MessageType?: string;
  AttachmentUrl?: string;
};

export type EditBookingChatMessagePayload = {
  MessageId: string;
  EditorUserId: string;
  NewMessage: string;
};

type ApiEnvelope<T> = {
  StatusCode: number;
  Message: string;
  Result: T;
};

type UnreadCountResult = {
  BookingId: string;
  UserId: string;
  UnreadCount: number;
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

export async function getBookingChatMessages(
  bookingId: string,
  skip = 0,
  take = 100
): Promise<BookingChatMessage[]> {
  try {
    const response = await apiClient.get<ApiEnvelope<BookingChatMessage[]>>(
      '/BookingChat/GetMessages',
      {
        params: { bookingId, skip, take },
      }
    );

    return response.data?.Result ?? [];
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function sendBookingChatMessage(
  payload: SendBookingChatMessagePayload
): Promise<BookingChatMessage> {
  try {
    const response = await apiClient.post<ApiEnvelope<BookingChatMessage>>(
      '/BookingChat/SendMessage',
      payload
    );

    const message = response.data?.Result;

    if (!message) {
      throw new Error('Message response was empty.');
    }

    return message;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function markBookingChatAsRead(bookingId: string, userId: string): Promise<void> {
  try {
    await apiClient.post('/BookingChat/MarkAsRead', null, {
      params: { bookingId, userId },
    });
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function editBookingChatMessage(
  payload: EditBookingChatMessagePayload
): Promise<BookingChatMessage> {
  try {
    const response = await apiClient.put<ApiEnvelope<BookingChatMessage>>(
      '/BookingChat/EditMessage',
      payload
    );

    const message = response.data?.Result;

    if (!message) {
      throw new Error('Updated message response was empty.');
    }

    return message;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function deleteBookingChatMessage(messageId: string, userId: string): Promise<void> {
  try {
    await apiClient.delete('/BookingChat/DeleteMessage', {
      params: { messageId, userId },
    });
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function getBookingUnreadCount(
  bookingId: string,
  userId: string
): Promise<number> {
  try {
    const response = await apiClient.get<ApiEnvelope<UnreadCountResult>>(
      '/BookingChat/GetUnreadCount',
      {
        params: { bookingId, userId },
      }
    );

    return response.data?.Result?.UnreadCount ?? 0;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export const createBookingChatConnection = () =>
  new signalR.HubConnectionBuilder()
    .withUrl(BOOKING_CHAT_HUB_URL, {
      accessTokenFactory: () => {
        const token = getAccessToken();
        if (!token) {
          throw new Error('No access token available for booking chat.');
        }
        return token;
      },
    })
    .withAutomaticReconnect({
      nextRetryDelayInMilliseconds: (retryContext) => {
        if (retryContext.elapsedMilliseconds < 60000) {
          return 2000;
        }
        return 5000;
      },
    })
    .configureLogging(signalR.LogLevel.Information)
    .build();

export async function joinBookingChat(
  connection: signalR.HubConnection,
  bookingId: string
): Promise<void> {
  if (connection.state !== signalR.HubConnectionState.Connected) {
    await connection.start();
  }

  await connection.invoke('JoinBookingChat', bookingId);
}

export async function leaveBookingChat(
  connection: signalR.HubConnection,
  bookingId: string
): Promise<void> {
  if (connection.state === signalR.HubConnectionState.Connected) {
    await connection.invoke('LeaveBookingChat', bookingId);
  }
}
