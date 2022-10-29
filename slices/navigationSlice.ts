import { createSlice } from "@reduxjs/toolkit";
import { LatLngLiteral } from "../model";

export interface navigationState {
  currentLocation: LatLngLiteral | null;
  origin: LatLngLiteral | null;
  destination: LatLngLiteral | null;
  traveltimeInfo: number | null;
  center: LatLngLiteral | undefined;
}

const initialState: navigationState = {
  currentLocation: null,
  origin: null,
  destination: null,
  traveltimeInfo: null,
  center: undefined,
};

export const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setCurrentLocation: (state, action) => {
      state.currentLocation = action.payload;
    },
    setOrigin: (state, action) => {
      state.origin = action.payload;
    },
    setDestination: (state, action) => {
      state.destination = action.payload;
    },
    setTraveltimeInfo: (state, action) => {
      state.traveltimeInfo = action.payload;
    },
    setCenter: (state, action) => {
      state.center = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setCurrentLocation,
  setOrigin,
  setDestination,
  setTraveltimeInfo,
  setCenter,
} = navigationSlice.actions;

export default navigationSlice.reducer;
