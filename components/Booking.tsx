import React, { useMemo } from "react";
import { GoogleMap, MarkerF } from "@react-google-maps/api";
import Origin from "./Origin";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { setOrigin } from "../slices/navigationSlice";
import Destination from "./Destination";

const Booking = () => {
  const origin = useSelector((state: RootState) => state.navigation.origin);
  const destination = useSelector(
    (state: RootState) => state.navigation.destination
  );
  const seoul = useMemo(() => ({ lat: 37.5666791, lng: 126.9782914 }), []);

  const dispatch = useDispatch();

  let zoom;
  let center;
  if (!origin) {
    center = seoul;
    zoom = 10;
  } else if (origin && !destination) {
    center = origin;
    zoom = 16;
  } else if (destination) {
    center = destination;
    zoom = 16;
  }

  return (
    <div className="h-screen sm:max-w-xl md:max-w-3xl mx-auto pt-3">
      <div className="flex flex-col items-center gap-y-2">
        <div className="w-full space-y-2 m px-2">
          <Origin />
          <Destination />
        </div>
        <button
          // onClick={}
          className="w-1/3 h-12 text-xl rounded-full bg-black text-white font-bold hover:opacity-80"
        >
          Done
        </button>
      </div>

      <GoogleMap
        mapContainerClassName="h-[calc(100%-184px)] sm:h-[calc(100%-196px)]  w-full mt-2"
        center={center}
        zoom={zoom}
        onClick={(mapsMouseEvent) => {
          dispatch(setOrigin(mapsMouseEvent.latLng));
        }}
      >
        {origin && <MarkerF position={origin!} />}
        {destination && <MarkerF position={destination!} />}
      </GoogleMap>
    </div>
  );
};
export default Booking;
