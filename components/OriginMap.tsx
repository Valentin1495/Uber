import React, { useMemo } from "react";
import { useRouter } from "next/router";
import { GoogleMap, MarkerF } from "@react-google-maps/api";
import Origin from "./Origin";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { setOrigin } from "../slices/navigationSlice";

const OriginMap = () => {
  const router = useRouter();
  const origin = useSelector((state: RootState) => state.navigation.origin);
  const seoul = useMemo(() => ({ lat: 35.907757, lng: 127.766922 }), []);
  const dispatch = useDispatch();

  let zoom;

  const isOriginSeoul = origin.lat === seoul.lat && origin.lng === seoul.lng;

  if (isOriginSeoul) {
    zoom = 7;
  } else zoom = 16;

  return (
    <div className="h-screen sm:max-w-xl md:max-w-3xl mx-auto">
      <div className="flex gap-x-3 p-3">
        <Origin />
        <button
          onClick={() => router.push("/setDestination")}
          className="w-1/5 rounded-md bg-black text-white font-bold"
        >
          Done
        </button>
      </div>

      <GoogleMap
        mapContainerClassName="h-[calc(100%-64px)] w-full"
        center={isOriginSeoul ? seoul : origin}
        zoom={zoom}
        onClick={(mapsMouseEvent) => {
          dispatch(setOrigin(mapsMouseEvent.latLng));
        }}
      >
        {!isOriginSeoul && <MarkerF position={origin} />}
      </GoogleMap>
    </div>
  );
};

export default OriginMap;
