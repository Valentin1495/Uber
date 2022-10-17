import React from "react";
import { useRouter } from "next/router";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { FaChevronLeft } from "react-icons/fa";
import { ArrowsUpDownIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import Origin from "./Origin";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const Map = () => {
  const router = useRouter();
  const origin = useSelector((state: RootState) => state.navigation.origin);
  const seoul = {
    lat: 35.907757,
    lng: 127.766922,
  };
  const zoom = origin.lat === seoul.lat && origin.lng === seoul.lng ? 7 : 16;
  return (
    <div className="h-screen sm:max-w-xl md:max-w-3xl mx-auto">
      <div className="bg-gray-50 p-3 flex gap-x-3">
        <div className="w-4/5">
          <Origin />
        </div>
        <button className="w-1/5 rounded-md bg-black text-white ">Done</button>
      </div>

      <GoogleMap
        mapContainerClassName="h-[calc(100%-64px)] w-full"
        center={origin}
        zoom={zoom}
      ></GoogleMap>
    </div>
  );
};

export default Map;
