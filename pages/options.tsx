import React, { useState, useMemo, useEffect } from "react";
import { DirectionsRenderer, GoogleMap } from "@react-google-maps/api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { DirectionsResult, LatLngLiteral, MapOptions } from "../model";
// import RideOptions from "../components/RideOptions";
import {
  setCenter,
  setDestination,
  setOrigin,
  // setZoom,
} from "../slices/navigationSlice";

const Options = () => {
  const origin = useSelector((state: RootState) => state.navigation.origin);
  const destination = useSelector(
    (state: RootState) => state.navigation.destination
  );
  const center = useSelector((state: RootState) => state.navigation.center);
  // const zoom = useSelector((state: RootState) => state.navigation.zoom);

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

  useEffect(() => {
    fetchDirections(origin!, destination!);
  }, [origin, destination]);

  return (
    <div className="h-screen">
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

      {/* <RideOptions /> */}
    </div>
  );
};

export default Options;
