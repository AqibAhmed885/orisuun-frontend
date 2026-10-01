import { createSlice } from '@reduxjs/toolkit';

const initialState: {
  openSidebar: boolean;
  businessDevelopment: 'seeking' | 'facilitate' | null;
} = {
  openSidebar: false,
  businessDevelopment: null,
};

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setOpenSidebar: (state) => {
      state.openSidebar = !state.openSidebar;
    },
    setBusinessDevelopment: (state, action) => {
      state.businessDevelopment = action.payload;
    },
  },
});

export const { setOpenSidebar, setBusinessDevelopment } = commonSlice.actions;
export default commonSlice.reducer;
