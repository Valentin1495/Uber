import React from "react";
import { useRouter } from "next/router";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { FaChevronLeft } from "react-icons/fa";
import { ArrowsUpDownIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import Destination from "./Destination";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const DestinationMap = () => {
  const router = useRouter();
  const origin = useSelector((state: RootState) => state.navigation.origin);

  return (
    <div className="h-screen sm:max-w-xl md:max-w-3xl mx-auto">
      <div className="bg-gray-50 p-3 flex gap-x-3">
        <div className="w-4/5">
          <Destination />
        </div>
        <button className="w-1/5 rounded-md bg-black text-white ">Done</button>
      </div>

      <GoogleMap
        mapContainerClassName="h-[calc(100%-64px)] w-full"
        center={origin}
        //   zoom={}
      ></GoogleMap>
    </div>
  );
};

export default DestinationMap;
