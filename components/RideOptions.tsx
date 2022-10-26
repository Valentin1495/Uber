import React, { useState } from "react";
import RideOption from "./RideOption";

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

  return (
    <div className="py-7 tablet:py-3.5 flex flex-col items-center gap-y-3 tablet:gap-y-1">
      <p className="text-2xl italic">Select a Ride</p>

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

      <button className="bg-black w-4/5 font-bold text-lg text-white py-3 rounded-full mt-3 tablet:mt-0">
        Choose
      </button>
    </div>
  );
};

export default RideOptions;
