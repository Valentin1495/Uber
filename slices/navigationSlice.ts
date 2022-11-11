import { createSlice } from "@reduxjs/toolkit";
import { DirectionsLeg, Distance, Duration, LatLngLiteral } from "../typings";

export interface navigationState {
  currentLocation: LatLngLiteral | null;
  origin: LatLngLiteral | null;
  destination: LatLngLiteral | null;
  distance: Distance;
  duration: Duration;
  center: LatLngLiteral | undefined;
}

const initialState: navigationState = {
  currentLocation: null,
  origin: null,
  destination: null,
  distance: {
    text: "",
    value: 1,
  },
  duration: {
    text: "",
    value: 1,
  },
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
    setDistance: (state, action) => {
      state.distance = action.payload;
    },
    setDuration: (state, action) => {
      state.duration = action.payload;
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
  setDistance,
  setDuration,
  setCenter,
} = navigationSlice.actions;

export default navigationSlice.reducer;
