import React, { useState, useMemo, useEffect } from "react";
import { DirectionsRenderer, GoogleMap } from "@react-google-maps/api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { DirectionsResult, LatLngLiteral, MapOptions } from "../typing";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { setLeg } from "../slices/navigationSlice";

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
          dispatch(setLeg(result.routes[0].legs[0]));
        }
      }
    );
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
    <div className="relative">
      <GoogleMap
        mapContainerClassName="h-[90vh]"
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
        className="absolute top-5 left-5 bg-black text-white rounded-full p-1.5 lg:p-3 
                  hover:opacity-80"
      >
        <ArrowLeftIcon className="h-8 lg:w-10 w-8 lg:h-10" />
      </button>

      <div className="text-center mt-4 sm:mt-3.5">
        <button
          onClick={() => router.push("/rideoptions")}
          className="w-1/2 md:w-1/3 h-12 text-xl rounded-full bg-black
                   text-white font-bold hover:opacity-80"
        >
          Select a Ride
        </button>
      </div>
    </div>
  );
};

export default Directions;
