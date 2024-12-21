import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    session: any | null;
}

const initialState: AuthState = {
    session: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setSession: (state, action: PayloadAction<any>) => {
            state.session = action.payload;
        },
        clearSession: (state) => {
            state.session = null;
        },
    },
});

export const { setSession, clearSession } = authSlice.actions;
export default authSlice.reducer;
