import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/user-slice';
import authReducer from './slices/auth-slice';
import commonSlice from './slices/common-slice';
import campaignSlice from './slices/campaign-slice';
import animationReducer from './slices/animation-slice';
import bookingReducer from './slices/booking-slice';
import profileViewReducer from './slices/profile-view-slice';

const store = configureStore({
  reducer: {
    user: userReducer,
    auth: authReducer,
    common: commonSlice,
    campaign: campaignSlice,
    animation: animationReducer,
    booking: bookingReducer,
    profileView: profileViewReducer,
  },
  devTools: true,
});

// Define the RootState type
export type RootState = ReturnType<typeof store.getState>;

// Optionally, define the AppDispatch type
export type AppDispatch = typeof store.dispatch;

export default store;
