import { createSlice } from "@reduxjs/toolkit";
import { LatLngLiteral } from "../model";

export interface navigationState {
  origin: LatLngLiteral | null;
  destination: LatLngLiteral | null;
  traveltimeInfo: number | null;
  center: LatLngLiteral;
  zoom: number;
}

const initialState: navigationState = {
  origin: null,
  destination: null,
  traveltimeInfo: null,
  center: { lat: 39.3812661305678, lng: -97.9222112121185 },
  zoom: 4,
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
    setCenter: (state, action) => {
      state.center = action.payload;
    },
    setZoom: (state, action) => {
      state.zoom = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setOrigin,
  setDestination,
  setTraveltimeInfo,
  setCenter,
  setZoom,
} = navigationSlice.actions;

export default navigationSlice.reducer;
