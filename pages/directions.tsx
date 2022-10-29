import React, { useState, useMemo, useEffect } from "react";
import { DirectionsRenderer, GoogleMap } from "@react-google-maps/api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { DirectionsResult, LatLngLiteral, MapOptions } from "../model";
import {
  setCenter,
  setDestination,
  setOrigin,
} from "../slices/navigationSlice";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";

const Directions = () => {
  const origin = useSelector((state: RootState) => state.navigation.origin);
  const destination = useSelector(
    (state: RootState) => state.navigation.destination
  );
  const center = useSelector((state: RootState) => state.navigation.center);

  const dispatch = useDispatch();
  const [directions, setDirections] = useState<DirectionsResult>();

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

    dispatch(setOrigin(null));
    dispatch(setDestination(null));
    dispatch(setCenter(undefined));
  };

  const options = useMemo<MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: false,
    }),
    []
  );

  const router = useRouter();

  useEffect(() => {
    fetchDirections(origin!, destination!);
  }, [origin, destination]);

  return (
    <div className="h-screen relative">
      <GoogleMap
        mapContainerClassName="h-full"
        center={center}
        zoom={16}
        options={options}
      >
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

      <button
        onClick={() => router.push("/locations")}
        className="absolute top-5 left-5 bg-white rounded-full p-1.5 md:p-3 hover:opacity-80 shadow-xl"
      >
        <ArrowLeftIcon className="h-8 md:w-10 w-8 md:h-10" />
      </button>

      <button
        onClick={() => router.push("/options")}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 w-1/2 md:w-1/3 h-12 text-xl rounded-full bg-black text-white font-bold hover:opacity-80"
      >
        Select a Ride
      </button>
    </div>
  );
};

export default Directions;
