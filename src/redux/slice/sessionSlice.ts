import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
export const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET;

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
                    // const storedToken: any = localStorage.getItem('token');
                    const decoded = jwt.decode(state.token);
                    console.log('decoded', decoded);
                    // Check if the token is expired
                    if (decoded && typeof decoded === 'object' && 'exp' in decoded) {
                        const expirationTime = (decoded as JwtPayload).exp! * 1000;
                        if (Date.now() >= expirationTime) {
                            state.token = null;
                            state.user = { id: null, name: '', email: '', profile: { id: null, theme: 'light', avatar: null } };
                            state.status = 'unauthenticated';
                        } else {
                            state.status = 'authenticated';
                        }
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
