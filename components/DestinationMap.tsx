import React, { useMemo } from "react";
import { useRouter } from "next/router";
import { GoogleMap, MarkerF } from "@react-google-maps/api";
import Destination from "./Destination";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { setDestination } from "../slices/navigationSlice";

const DestinationMap = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const origin = useSelector((state: RootState) => state.navigation.origin);
  const destination = useSelector(
    (state: RootState) => state.navigation.destination
  );
  const seoul = useMemo(() => ({ lat: 35.907757, lng: 127.766922 }), []);
  const isDestinationSeoul =
    destination.lat === seoul.lat && destination.lng === seoul.lng;

  return (
    <div className="h-screen sm:max-w-xl md:max-w-3xl mx-auto">
      <div className="bg-gray-50 p-3 flex gap-x-3">
        <div className="w-4/5">
          <Destination />
        </div>
        <button className="w-1/5 rounded-md bg-black text-white font-bold">
          Done
        </button>
      </div>

      <GoogleMap
        mapContainerClassName="h-[calc(100%-64px)] w-full"
        center={isDestinationSeoul ? origin : destination}
        zoom={16}
        onClick={(mapsMouseEvent) => {
          dispatch(setDestination(mapsMouseEvent.latLng));
        }}
      >
        <MarkerF position={origin} />
        {!isDestinationSeoul && <MarkerF position={destination} />}
      </GoogleMap>
    </div>
  );
};

export default DestinationMap;
