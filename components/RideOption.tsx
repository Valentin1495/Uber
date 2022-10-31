import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";

interface Option {
  id: string;
  title: string;
  multiplier: number;
  image: string;
}

const RideOption = ({
  id,
  title,
  image,
  multiplier,
  selected,
}: {
  id: string;
  title: string;
  image: string;
  multiplier: number;
  selected: Option;
}) => {
  const SURGE_CHARGE_RATE = 1.5;

  const durationValue = useSelector(
    (state: RootState) => state.navigation.leg?.duration?.value
  );

  return (
    <div
      className={`${
        selected?.id === id && "bg-gray-200"
      } flex items-center justify-evenly px-5`}
    >
      <img src={image} alt="Ride Option" className="h-20 w-20 object-contain" />
      <div>
        <span className="text-xl">{title}</span> <br />
      </div>
      <span className="text-lg font-bold">
        $
        {new Intl.NumberFormat().format(
          (durationValue! * SURGE_CHARGE_RATE * multiplier) / 100
        )}
      </span>
    </div>
  );
};

export default RideOption;
