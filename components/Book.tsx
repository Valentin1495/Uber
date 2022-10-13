import React from "react";
import { FaCarSide, FaMotorcycle, FaBusinessTime } from "react-icons/fa";

const Book = () => {
  return (
    <div className="flex justify-between">
      <button className="bg-gray-200 px-3 py-1.5 text-center rounded-md">
        <FaCarSide className="text-7xl" />
        Ride
      </button>
      <button className="bg-gray-200 px-3 py-1.5 text-center rounded-md">
        <FaMotorcycle className="text-7xl" />
        2-Wheels
      </button>
      <button className="bg-gray-200 px-3 py-1.5 text-center rounded-md">
        <FaBusinessTime className="text-7xl" />
        Reserve
      </button>
    </div>
  );
};

export default Book;
