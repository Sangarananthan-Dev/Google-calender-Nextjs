import { createSlice } from "@reduxjs/toolkit";

const initialState = {};
const calendarColorsSlice = createSlice({
  name: "calendarColors",
  initialState,
  reducers: {
    setCalendarColors: (state, action) => {
      return action.payload;
    },
  },
});

export const { setCalendarColors } = calendarColorsSlice.actions;
export default calendarColorsSlice.reducer;
