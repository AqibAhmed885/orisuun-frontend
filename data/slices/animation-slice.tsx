import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AnimationState {
    userType: string | null;
}

const initialState: AnimationState = {
    userType: null,
};

const animationSlice = createSlice({
    name: 'animation', // ✅ Use a unique slice name
    initialState,
    reducers: {
        setUserType(state, action: PayloadAction<string | null>) {
            state.userType = action.payload;
        },
    },
});

export const { setUserType } = animationSlice.actions;
export default animationSlice.reducer;
