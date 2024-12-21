import { configureStore } from '@reduxjs/toolkit';
import { ToggleTheme } from './slice/ToggleTheme';
import organizationSlice from './slice/organizationSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer from './slice/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    toggleTheme: ToggleTheme.reducer,
    organization: organizationSlice,
  },
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// export const useAppDispatch = () => useDispatch<AppDispatch>();
// export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
