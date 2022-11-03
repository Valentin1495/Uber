import { GoogleMap, MarkerF } from "@react-google-maps/api";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Information from "../components/Information";
import Input from "../components/Input";
import { LatLngLiteral, MapOptions } from "../model";
import { setCenter, setCurrentLocation } from "../slices/navigationSlice";
import { RootState } from "../store";

interface Bounds {
  ne: LatLngLiteral;
  sw: LatLngLiteral;
}

const Places = () => {
  const [newMap, setNewMap] = useState<google.maps.Map>();
  const [bounds, setBounds] = useState<Bounds>();

  const dispatch = useDispatch();

  const center = useSelector((state: RootState) => state.navigation.center);
  const currentLocation = useSelector(
    (state: RootState) => state.navigation.currentLocation
  );

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

  const onLoad = (map: google.maps.Map) => {
    setNewMap(map);
  };

  const getCenter = () => {
    if (newMap) {
      const latLngBounds = newMap.getBounds();

      if (latLngBounds) {
        const ne = {
          lat: latLngBounds.getNorthEast().lat(),
          lng: latLngBounds.getNorthEast().lng(),
        };

        const sw = {
          lat: latLngBounds.getSouthWest().lat(),
          lng: latLngBounds.getSouthWest().lng(),
        };

        setBounds({ ne, sw });

        console.log(bounds);
      }
    }
  };

  return (
    <div className="h-screen flex flex-col-reverse md:flex-row">
      <Information />

      <div className="md:w-[70%] md:h-full w-full h-1/2 relative">
        <Input />

        {center ? (
          <GoogleMap
            mapContainerClassName="h-full"
            center={center}
            zoom={16}
            options={options}
            onLoad={onLoad}
            onCenterChanged={getCenter}
          >
            {currentLocation && <MarkerF position={currentLocation} />}
          </GoogleMap>
        ) : (
          <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-3xl lg:text-5xl">
            Loading a Map...
          </p>
        )}
      </div>
    </div>
  );
};

export default Places;
