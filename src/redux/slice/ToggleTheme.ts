import { createSlice } from '@reduxjs/toolkit';
export const ToggleTheme = createSlice({
  name: 'ToggleTheme',
  initialState: {
    theme: 'light',
    matches: {
      matches_xs_up: false,
      matches_sm_up: false,
      matches_md_up: false,
      matches_lg_up: false,
      matches_sm_down: false,
      matches_md_down: false,
    },
  },
  reducers: {
    toggleTheme(state, action) {
      state.theme = action.payload === 'dark' ? 'light' : 'dark';
    },
    deviceMatches(state, action) {
      state.matches = { ...state.matches, ...action.payload };
    },
  },
});

export const { toggleTheme, deviceMatches } = ToggleTheme.actions;
export default ToggleTheme.reducer;
