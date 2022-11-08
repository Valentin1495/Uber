import { createSlice } from "@reduxjs/toolkit";
import { format } from "date-fns";

interface reservation {
  destination: string;
  startDate: string;
  endDate: string;
  guests: number;
}

const initialState: reservation = {
  destination: "",
  startDate: format(new Date(), "dd MMMM yyyy"),
  endDate: "",
  guests: 1,
};

export const reservationSlice = createSlice({
  name: "reservation",
  initialState,
  reducers: {
    setDestination: (state, action) => {
      state.destination = action.payload;
    },
    setStartDate: (state, action) => {
      state.startDate = action.payload;
    },
    setEndDate: (state, action) => {
      state.endDate = action.payload;
    },
    setGuests: (state, action) => {
      state.guests = action.payload;
    },
  },
});

export const { setDestination, setStartDate, setEndDate, setGuests } =
  reservationSlice.actions;

export default reservationSlice.reducer;
