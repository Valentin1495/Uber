import { createSlice } from "@reduxjs/toolkit";
import { Room } from "../typings";

interface reservation {
  destination: string;
  checkin: string;
  checkout: string;
  guests: number;
  rooms: Room[];
}

const initialState: reservation = {
  destination: "",
  checkin: "",
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
    setCheckin: (state, action) => {
      state.checkin = action.payload;
    },
    setCheckout: (state, action) => {
      state.checkout = action.payload;
    },
    setGuests: (state, action) => {
      state.guests = action.payload;
    },
    setRooms: (state, action) => {
      state.rooms = action.payload;
    },
  },
});

export const { setDestination, setCheckin, setCheckout, setGuests, setRooms } =
  reservationSlice.actions;

export default reservationSlice.reducer;
