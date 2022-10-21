import React, { useEffect, useMemo, useState, useRef } from "react";
import { GoogleMap, MarkerF } from "@react-google-maps/api";
import OriginInput from "./OriginInput";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { setOrigin } from "../slices/navigationSlice";
import DestinationInput from "./DestinationInput";

const Booking = () => {
  const origin = useSelector((state: RootState) => state.navigation.origin);
  const destination = useSelector(
    (state: RootState) => state.navigation.destination
  );
  const center = useSelector((state: RootState) => state.navigation.center);
  const zoom = useSelector((state: RootState) => state.navigation.zoom);

  const dispatch = useDispatch();

  return (
    <div className="h-screen sm:max-w-xl md:max-w-3xl mx-auto pt-3">
      <div className="flex flex-col items-center gap-y-2">
        <div className="w-full space-y-2 m px-2">
          <OriginInput />
          <DestinationInput />
        </div>
        <button
          // onClick={}
          className="disabled:hover:cursor-not-allowed disabled:opacity-20 w-1/3 h-12 text-xl rounded-full bg-black text-white font-bold hover:opacity-80"
          disabled={!origin || !destination}
        >
          Done
        </button>
      </div>

      <GoogleMap
        mapContainerClassName="h-[calc(100%-184px)] sm:h-[calc(100%-196px)]  w-full mt-2"
        center={center}
        zoom={zoom}
        onClick={(mapsMouseEvent) => {
          dispatch(
            setOrigin(
              JSON.parse(
                JSON.stringify(mapsMouseEvent.latLng?.toJSON(), null, 2)
              )
            )
          );
        }}
      >
        {origin && <MarkerF position={origin!} />}
        {destination && <MarkerF position={destination!} />}
      </GoogleMap>
    </div>
  );
};

export default Booking;
