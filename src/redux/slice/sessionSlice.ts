import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface User {
    id: number | any;
    name: string;
    email: string;
    profile: {
        id: number | any;
        theme: 'dark' | 'light';
        avatar: string | any;
    };
}

interface SessionState {
    token: string | any;
    user: User | null;
    status?: 'unauthenticated' | 'authenticated' | 'loading';
}

const initialState: SessionState = {
    token: null,
    user: null,
    status: 'unauthenticated',
};

const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {
        setSession: (state, action: PayloadAction<SessionState>) => {
            state.token = action.payload.token;
            state.user = action.payload.user;
            state.status = 'authenticated';
        },
        clearSession: (state) => {
            state.token = null;
            state.user = { id: null, name: '', email: '', profile: {id: null,theme: 'light', avatar: null} };
            state.status = 'unauthenticated';
        },
        setLoading: (state) => {
            state.status = 'loading';
        },
        validateSession: (state) => {
            if (state.token) {
                try {
                    const decoded: { exp: number } = jwt.decode(state.token) as JwtPayload | any;;
                    console.log('decoded', decoded);
                    // Check if the token is expired
                    if (decoded && decoded.exp * 1000 < Date.now()) {
                        state.token = null;
                        state.user = { id: null, name: '', email: '', profile: { id: null, theme: 'light', avatar: null } };
                        state.status = 'unauthenticated';
                    } else {
                        state.status = 'authenticated';
                    }
                } catch (error) {
                    console.error('Invalid token:', error);
                    state.token = null;
                    state.user = { id: null, name: '', email: '', profile: { id: null, theme: 'light', avatar: null } };
                    state.status = 'unauthenticated';
                }
            } else {
                state.status = 'unauthenticated';
            }
        },
    },
});

export const { setSession, clearSession, setLoading, validateSession } = sessionSlice.actions;
export default sessionSlice.reducer;
