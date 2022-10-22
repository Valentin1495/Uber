import React, { useState } from "react";
import { GoogleMap, MarkerF } from "@react-google-maps/api";
import OriginInput from "./OriginInput";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import {
  setCenter,
  setDestination,
  setOrigin,
  setZoom,
} from "../slices/navigationSlice";
import DestinationInput from "./DestinationInput";

const Directions = () => {
  const origin = useSelector((state: RootState) => state.navigation.origin);
  const destination = useSelector(
    (state: RootState) => state.navigation.destination
  );
  const center = useSelector((state: RootState) => state.navigation.center);
  const zoom = useSelector((state: RootState) => state.navigation.zoom);

  const dispatch = useDispatch();

  const [originAddress, setOriginAddress] = useState<string>("");
  const [destinationAddress, setDestinationAddress] = useState<string>("");

  const geocodeLatLng = (mapsMouseEvent: google.maps.MapMouseEvent) => {
    const geocoder = new google.maps.Geocoder();
    const latLngLiteral = JSON.parse(
      JSON.stringify(mapsMouseEvent.latLng?.toJSON(), null, 2)
    );
    geocoder.geocode({ location: latLngLiteral }).then((response) => {
      if (response.results[0]) {
        if (!originAddress && !destinationAddress) {
          dispatch(setOrigin(latLngLiteral));
          dispatch(setCenter(latLngLiteral));
          dispatch(setZoom(16));

          setOriginAddress(response.results[0].formatted_address);
        }
        if (!originAddress && destinationAddress)
          dispatch(setOrigin(latLngLiteral));
        dispatch(setCenter(latLngLiteral));
        dispatch(setZoom(16));

        setOriginAddress(response.results[0].formatted_address);

        if (!destinationAddress && originAddress) {
          dispatch(setDestination(latLngLiteral));
          dispatch(setCenter(latLngLiteral));
          dispatch(setZoom(16));

          setDestinationAddress(response.results[0].formatted_address);
        }
        if (originAddress && destinationAddress) {
          setOriginAddress(originAddress);
          setDestination(destinationAddress);
        }
      }
    });
  };

  return (
    <div className="h-screen sm:max-w-xl md:max-w-3xl mx-auto pt-3">
      <div className="flex flex-col items-center gap-y-2">
        <div className="w-full space-y-2 m px-2">
          <OriginInput
            originAddress={originAddress}
            setOriginAddress={setOriginAddress}
          />
          <DestinationInput
            destinationAddress={destinationAddress}
            setDestinationAddress={setDestinationAddress}
          />
        </div>
        <button
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
        onClick={geocodeLatLng}
      >
        {origin && <MarkerF position={origin} />}
        {destination && <MarkerF position={destination} />}
      </GoogleMap>
    </div>
  );
};

export default Directions;
