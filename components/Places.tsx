import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { FaChevronLeft } from "react-icons/fa";
import { ArrowsUpDownIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import Destination from "./Destination";
import { coordinate } from "../model";
import Origin from "./Origin";

const center = {
  lat: -34.397,
  lng: 150.644,
};

const Places = () => {
  const router = useRouter();
  const [selected, setSelected] = useState<coordinate>({
    lat: null,
    lng: null,
  });

  console.log(selected);

  return (
    <div className="h-screen sm:max-w-xl md:max-w-3xl mx-auto">
      <div className="bg-gray-50 p-3">
        <button onClick={() => router.push("/")}>
          <FaChevronLeft className="h-8 w-8" />
        </button>
        <div className="flex mt-3 items-center gap-3">
          <button>
            <ArrowsUpDownIcon className="h-12 w-12" />
          </button>
          <div className="w-full space-y-2">
            <Origin setSelected={setSelected} />
            <Destination setSelected={setSelected} />
          </div>
          <button>
            <PlusCircleIcon className="h-12 w-12" />
          </button>
        </div>
      </div>
      {/* <div ref={mapRef} className="h-[calc(100%-161.6px)] w-full" /> */}

      <GoogleMap
        mapContainerClassName="h-[calc(100%-161.6px)] w-full"
        center={center}
        zoom={10}
      ></GoogleMap>
    </div>
  );
};

export default Places;
