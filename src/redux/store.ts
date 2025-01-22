import { configureStore } from '@reduxjs/toolkit';
import { ToggleTheme } from './slice/ToggleTheme';
import organizationSlice from './slice/organizationSlice';
import sessionReducer from './slice/sessionSlice';

export const store = configureStore({
  reducer: {
    session: sessionReducer,
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
