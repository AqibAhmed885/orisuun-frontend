import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/data/store';
import { getProviderSetup, type ProviderSetupResult } from '@/utils/providerBookingApi';

export type ProfileTab =
  | 'Overview'
  | 'Snapshot'
  | 'Credentials'
  | 'Opportunities'
  | 'Reviews'
  | 'Consultations'
  | 'Fundraising'
  | 'Campaigns Sponsored';

export type ConsultationType = 'one-time' | 'advisory' | 'task';
type ProviderSetupStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

interface ProfileViewState {
  profileKey: string | null;
  activeTab: ProfileTab;
  selectedConsultationType: ConsultationType | null;
  providerSetup: ProviderSetupResult | null;
  providerSetupStatus: ProviderSetupStatus;
  providerSetupError: string | null;
}

const initialState: ProfileViewState = {
  profileKey: null,
  activeTab: 'Overview',
  selectedConsultationType: null,
  providerSetup: null,
  providerSetupStatus: 'idle',
  providerSetupError: null,
};

export const loadProfileProviderSetup = createAsyncThunk<
  { profileKey: string; providerSetup: ProviderSetupResult | null },
  string,
  { state: RootState }
>(
  'profileView/loadProviderSetup',
  async (profileKey) => ({
    profileKey,
    providerSetup: await getProviderSetup(profileKey),
  }),
  {
    condition: (profileKey, { getState }) => {
      const state = getState().profileView;
      return !(
        state.profileKey === profileKey &&
        (state.providerSetupStatus === 'loading' || state.providerSetupStatus === 'succeeded')
      );
    },
  }
);

const profileViewSlice = createSlice({
  name: 'profileView',
  initialState,
  reducers: {
    initializeProfileView(state, action: PayloadAction<string>) {
      if (state.profileKey === action.payload) return;

      Object.assign(state, initialState, { profileKey: action.payload });
    },
    setActiveProfileTab(state, action: PayloadAction<ProfileTab>) {
      state.activeTab = action.payload;
    },
    setSelectedConsultationType(state, action: PayloadAction<ConsultationType | null>) {
      state.selectedConsultationType = action.payload;
    },
    resetProfileView() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadProfileProviderSetup.pending, (state, action) => {
        if (state.profileKey !== action.meta.arg) {
          Object.assign(state, initialState, { profileKey: action.meta.arg });
        }
        state.providerSetupStatus = 'loading';
        state.providerSetupError = null;
      })
      .addCase(loadProfileProviderSetup.fulfilled, (state, action) => {
        if (state.profileKey !== action.payload.profileKey) return;

        state.providerSetup = action.payload.providerSetup;
        state.providerSetupStatus = 'succeeded';
      })
      .addCase(loadProfileProviderSetup.rejected, (state, action) => {
        if (state.profileKey !== action.meta.arg) return;

        state.providerSetup = null;
        state.providerSetupStatus = 'failed';
        state.providerSetupError = action.error.message ?? 'Unable to load provider setup';
      });
  },
});

export const {
  initializeProfileView,
  resetProfileView,
  setActiveProfileTab,
  setSelectedConsultationType,
} = profileViewSlice.actions;

export const selectActiveProfileTab = (state: RootState) => state.profileView.activeTab;
export const selectProfileViewKey = (state: RootState) => state.profileView.profileKey;
export const selectSelectedConsultationType = (state: RootState) =>
  state.profileView.selectedConsultationType;
export const selectProfileProviderSetup = (state: RootState) => state.profileView.providerSetup;
export const selectProfileProviderSetupStatus = (state: RootState) =>
  state.profileView.providerSetupStatus;
export const selectProfileProviderSetupError = (state: RootState) =>
  state.profileView.providerSetupError;

export default profileViewSlice.reducer;
