import { createSlice } from "@reduxjs/toolkit";
import { LatLng } from "use-places-autocomplete";
type LatLngLiteral = google.maps.LatLngLiteral;

export interface navigationState {
  origin: LatLngLiteral | LatLng | null;
  destination: LatLngLiteral | LatLng | null;
  traveltimeInfo: number | null;
}

const initialState: navigationState = {
  origin: null,
  destination: null,
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
