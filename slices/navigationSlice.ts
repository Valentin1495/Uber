import { createSlice } from "@reduxjs/toolkit";
import { coordinate } from "../model";

export interface navigationState {
  origin: coordinate;
  destination: coordinate;
  traveltimeInfo: number | null;
}

const seoul = {
  lat: 35.907757,
  lng: 127.766922,
};

const initialState: navigationState = {
  origin: seoul,
  destination: seoul,
  traveltimeInfo: null,
};

export const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setOrigin: (state, action) => {
      state.origin = action.payload;
    },
    setDestination: (state, action) => {
      state.destination = action.payload;
    },
    setTraveltimeInfo: (state, action) => {
      state.traveltimeInfo = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setOrigin, setDestination, setTraveltimeInfo } =
  navigationSlice.actions;

export default navigationSlice.reducer;
