import { createSlice } from "@reduxjs/toolkit";
import { format } from "date-fns";
import { room } from "../typings";

interface reservation {
  destination: string;
  startDate: string;
  checkin: string;
  endDate: string;
  checkout: string;
  guests: number;
  rooms: room[];
}

const initialState: reservation = {
  destination: "",
  startDate: format(new Date(), "dd MMM yyyy"),
  checkin: format(new Date(), "yyyy-MM-dd"),
  endDate: "",
  checkout: "",
  guests: 1,
  rooms: [],
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
    setCheckin: (state, action) => {
      state.checkin = action.payload;
    },
    setCheckout: (state, action) => {
      state.checkout = action.payload;
    },
    setEndDate: (state, action) => {
      state.endDate = action.payload;
    },
    setGuests: (state, action) => {
      state.guests = action.payload;
    },
    setRooms: (state, action) => {
      state.rooms = action.payload;
    },
  },
});

export const {
  setDestination,
  setStartDate,
  setCheckin,
  setCheckout,
  setEndDate,
  setGuests,
  setRooms,
} = reservationSlice.actions;

export default reservationSlice.reducer;
