import React, { useState } from "react";
import RideOption from "./RideOption";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";

interface Option {
  id: string;
  title: string;
  multiplier: number;
  image: string;
}

const options = [
  {
    id: "Uber-X-123",
    title: "Uber X",
    multiplier: 1,
    image: "https://links.papareact.com/3pn",
  },
  {
    id: "Uber-XL-456",
    title: "Uber XL",
    multiplier: 1.2,
    image: "https://links.papareact.com/5w8",
  },
  {
    id: "Uber-LUX-789",
    title: "Uber LUX",
    multiplier: 1.75,
    image: "https://links.papareact.com/7pf",
  },
];

const RideOptions = () => {
  const [selected, setSelected] = useState<Option>();
  const router = useRouter();

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="py-5 rounded-xl w-4/5 md:w-1/2 lg:w-1/3 bg-gray-100 flex flex-col items-center justify-center gap-y-3">
        <div className="flex items-center w-full px-3">
          <button
            className="hover:opacity-50"
            onClick={() => router.push("/locations")}
          >
            <ChevronLeftIcon className="h-8 w-8" />
          </button>
          <p className="text-2xl italic mx-auto">Select a Ride</p>
        </div>

        {options.map((option) => (
          <div
            className="w-full hover:cursor-pointer hover:opacity-50"
            onClick={() => {
              setSelected(option);
            }}
          >
            <RideOption
              key={option.id}
              id={option.id}
              title={option.title}
              image={option.image}
              multiplier={option.multiplier}
              selected={selected!}
            />
          </div>
        ))}

        <button
          onClick={() => router.push("/checkout")}
          disabled={!selected}
          className="disabled:hover:cursor-not-allowed disabled:opacity-20
                 bg-black w-1/2 font-bold md:text-lg
                 text-white py-3 rounded-full mt-3"
        >
          Choose {selected?.title}
        </button>
      </div>
    </div>
  );
};

export default RideOptions;
