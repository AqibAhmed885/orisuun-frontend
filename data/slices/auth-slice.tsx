import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: AuthState = {
  userDetails: null,
  isAuthenticated: false,
  selectedProfileType: 1,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserDetails: (state, action: PayloadAction<User>) => {
      state.userDetails = action.payload;
      state.isAuthenticated = true;
    },
    clearUserDetails: (state) => {
      state.userDetails = null;
      state.isAuthenticated = false;
    },
    resetAuthState: () => initialState,
    setSelectedProfileType: (state, action: PayloadAction<number>) => {
      state.selectedProfileType = action.payload;
    },
  },
});

export const {
  setUserDetails,
  clearUserDetails,
  resetAuthState,
  setSelectedProfileType,
} = authSlice.actions;
export default authSlice.reducer;
