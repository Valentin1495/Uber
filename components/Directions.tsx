import React, { useState, useMemo } from "react";
import { DirectionsRenderer, GoogleMap, MarkerF } from "@react-google-maps/api";
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
import { DirectionsResult, LatLngLiteral, MapOptions } from "../model";
import { useRouter } from "next/router";
import RideOptions from "./RideOptions";

const Directions = () => {
  const router = useRouter();
  const origin = useSelector((state: RootState) => state.navigation.origin);
  const destination = useSelector(
    (state: RootState) => state.navigation.destination
  );
  const center = useSelector((state: RootState) => state.navigation.center);
  const zoom = useSelector((state: RootState) => state.navigation.zoom);

  const dispatch = useDispatch();

  const [originAddress, setOriginAddress] = useState<string>("");
  const [destinationAddress, setDestinationAddress] = useState<string>("");
  const [directions, setDirections] = useState<DirectionsResult>();

  const geocodeLatLng = (e: google.maps.MapMouseEvent) => {
    const geocoder = new google.maps.Geocoder();

    const coordinate = JSON.parse(JSON.stringify(e.latLng?.toJSON(), null, 2));

    geocoder.geocode({ location: coordinate }).then((response) => {
      if (response.results[0]) {
        if (!originAddress && !destinationAddress) {
          dispatch(setOrigin(coordinate));
          dispatch(setCenter(coordinate));
          dispatch(setZoom(16));

          setOriginAddress(response.results[0].formatted_address);
        }
        if (!originAddress && destinationAddress) {
          dispatch(setOrigin(coordinate));
          dispatch(setCenter(coordinate));
          dispatch(setZoom(16));

          setOriginAddress(response.results[0].formatted_address);
        }

        if (!destinationAddress && originAddress) {
          dispatch(setDestination(coordinate));
          dispatch(setCenter(coordinate));
          dispatch(setZoom(16));

          setDestinationAddress(response.results[0].formatted_address);
        }
      }
    });
  };

  const fetchDirections = (
    origin: LatLngLiteral,
    destination: LatLngLiteral
  ) => {
    const service = new google.maps.DirectionsService();

    service.route(
      {
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirections(result);
        }
      }
    );
  };

  const options = useMemo<MapOptions>(
    () => ({
      disableDefaultUI: true,
    }),
    []
  );

  return (
    <div className={`${directions ? "py-" : "py-3"} h-screen mx-auto max-w-lg`}>
      {!directions && (
        <div className="flex flex-col items-center gap-y-2">
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
            className="disabled:hover:cursor-not-allowed disabled:opacity-20 w-1/3 h-12 text-xl rounded-full bg-black text-white font-bold hover:opacity-80"
            disabled={!origin || !destination}
            onClick={() => {
              fetchDirections(origin!, destination!);
            }}
          >
            Done
          </button>
        </div>
      )}
      <GoogleMap
        mapContainerClassName={`${
          directions ? "h-1/2 mt-0" : "h-[calc(100%-172px)] mt-2"
        }  w-full`}
        center={center}
        zoom={zoom}
        options={options}
        onClick={geocodeLatLng}
      >
        {!directions && origin && <MarkerF position={origin} />}
        {!directions && destination && <MarkerF position={destination} />}

        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              polylineOptions: {
                zIndex: 50,
                strokeColor: "black",
                strokeWeight: 5,
              },
            }}
          />
        )}
      </GoogleMap>
      {directions && <RideOptions />}
    </div>
  );
};

export default Directions;
