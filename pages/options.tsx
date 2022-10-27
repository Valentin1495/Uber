import React, { useState, useMemo, useEffect } from "react";
import { DirectionsRenderer, GoogleMap } from "@react-google-maps/api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { DirectionsResult, LatLngLiteral, MapOptions } from "../model";
import RideOptions from "../components/RideOptions";
import {
  setCenter,
  setDestination,
  setOrigin,
  setZoom,
} from "../slices/navigationSlice";

const Options = () => {
  const origin = useSelector((state: RootState) => state.navigation.origin);
  const destination = useSelector(
    (state: RootState) => state.navigation.destination
  );
  const center = useSelector((state: RootState) => state.navigation.center);
  const zoom = useSelector((state: RootState) => state.navigation.zoom);

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
    dispatch(setZoom(4));
    dispatch(setCenter({ lat: 39.3812661305678, lng: -97.9222112121185 }));
  };

  useEffect(() => {
    fetchDirections(origin!, destination!);
  }, [origin, destination]);

  const options = useMemo<MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: false,
    }),
    []
  );

  return (
    <div className="h-screen mx-auto max-w-lg">
      <GoogleMap
        mapContainerClassName="h-1/2 mt-0 w-full"
        center={center}
        zoom={zoom}
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

      <RideOptions />
    </div>
  );
};

export default Options;
