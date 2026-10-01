import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BookingDraft {
  providerUserId: string;
  providerTeamId?: string;
  providerName: string;
  providerAvatar: string;
  providerProfileTypeId?: number;
  providerIsVerified?: boolean;
  meetingType: string;
  meetingTypeId: string;
  packageId?: string;
  topicId?: string;
  durationMinutes: number;
  scheduledDay: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  basePrice: number;
  totalPrice: number;
  currency: string;
  cancellationWindowHours: number;
  cancellationFeePercentage: number;
  meetingPurpose: string;
  planLabel: string;
  inviteEmails?: string[];
  referralDocumentUrls?: string[];
}

interface BookingState {
  draft: BookingDraft | null;
}

const initialState: BookingState = { draft: null };

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setBookingDraft(state, action: PayloadAction<BookingDraft>) {
      state.draft = action.payload;
    },
    clearBookingDraft(state) {
      state.draft = null;
    },
  },
});

export const { setBookingDraft, clearBookingDraft } = bookingSlice.actions;
export default bookingSlice.reducer;
