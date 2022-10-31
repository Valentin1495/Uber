import React, { useState, useMemo, useEffect } from "react";
import { GoogleMap, GoogleMapProps, MarkerF } from "@react-google-maps/api";
import OriginInput from "./OriginInput";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import {
  setCenter,
  setCurrentLocation,
  setDestination,
  setOrigin,
} from "../slices/navigationSlice";
import DestinationInput from "./DestinationInput";
import { MapOptions } from "../model";
import { useRouter } from "next/router";

const Input = () => {
  const router = useRouter();

  const currentLocation = useSelector(
    (state: RootState) => state.navigation.currentLocation
  );
  const origin = useSelector((state: RootState) => state.navigation.origin);
  const destination = useSelector(
    (state: RootState) => state.navigation.destination
  );
  const center = useSelector((state: RootState) => state.navigation.center);

  const dispatch = useDispatch();

  const [originAddress, setOriginAddress] = useState<string>("");
  const [destinationAddress, setDestinationAddress] = useState<string>("");

  const geocodeLatLng = (e: google.maps.MapMouseEvent) => {
    const geocoder = new google.maps.Geocoder();

    const coordinate = JSON.parse(JSON.stringify(e.latLng?.toJSON(), null, 2));

    geocoder.geocode({ location: coordinate }).then((response) => {
      if (response.results[0]) {
        if (!originAddress && !destinationAddress) {
          dispatch(setOrigin(coordinate));
          dispatch(setCenter(coordinate));

          setOriginAddress(response.results[0].formatted_address);
        }
        if (!originAddress && destinationAddress) {
          dispatch(setOrigin(coordinate));
          dispatch(setCenter(coordinate));

          setOriginAddress(response.results[0].formatted_address);
        }

        if (!destinationAddress && originAddress) {
          dispatch(setDestination(coordinate));
          dispatch(setCenter(coordinate));

          setDestinationAddress(response.results[0].formatted_address);
        }
      }
    });
  };

  const options = useMemo<MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: false,
    }),
    []
  );

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          dispatch(setCenter(pos));
          dispatch(setCurrentLocation(pos));
        }
      );
    }
  }, []);

  return (
    <div className="h-screen relative">
      <div
        className="top-3 w-full sm:w-1/2 sm:left-1/2 sm:-translate-x-1/2 
                      flex flex-col items-center gap-y-2 absolute z-40"
      >
        <div className="w-full space-y-2 px-2">
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
          className="disabled:hover:cursor-not-allowed disabled:opacity-20 
                     w-1/2 h-12 text-xl rounded-full bg-black text-white font-bold hover:opacity-80"
          disabled={!origin || !destination}
          onClick={() => router.push("/directions")}
        >
          Done
        </button>
      </div>

      {center ? (
        <GoogleMap
          mapContainerClassName="h-full"
          center={center}
          zoom={16}
          options={options}
          onClick={geocodeLatLng}
        >
          {origin && <MarkerF position={origin} />}
          {destination && <MarkerF position={destination} />}
          {currentLocation && <MarkerF position={currentLocation} />}
        </GoogleMap>
      ) : (
        <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-3xl lg:text-5xl">
          Loading a Map...
        </p>
      )}
    </div>
  );
};

export default Input;
