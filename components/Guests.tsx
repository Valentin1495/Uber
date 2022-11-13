import { UsersIcon } from "@heroicons/react/24/solid";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setGuests } from "../slices/reservationSlice";
import { RootState } from "../store";

const Guests = () => {
  const guests = useSelector((state: RootState) => state.reservation.guests);
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col items-center gap-y-5">
      <em className="text-xl sm:text-2xl font-light">Number of Guests</em>
      <div className="flex items-center gap-x-2">
        <UsersIcon className="h-6 w-6" />
        <input
          type="number"
          className="bg-gray-100 font-bold text-lg rounded-md text-[#FF385C] w-12 outline-none text-center py-1"
          min={1}
          value={guests}
          onChange={(e) => dispatch(setGuests(e.target.value))}
        />
      </div>
    </div>
  );
};

export default Guests;
