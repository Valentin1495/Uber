import React from "react";

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
  return (
    <div
      className={`${
        selected?.id === id && "bg-gray-200"
      } flex items-center justify-evenly`}
    >
      <img src={image} alt="Ride Option" className="h-20 w-20 object-contain" />
      <div>
        <span className="text-xl font-bold">{title}</span> <br />
        <span>Travel time...</span>
      </div>
      <span className="text-lg">$110</span>
    </div>
  );
};

export default RideOption;
