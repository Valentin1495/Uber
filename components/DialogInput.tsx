import { Combobox } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import usePlacesAutocomplete from "use-places-autocomplete";
import { setDestination } from "../slices/reservationSlice";
import { RootState } from "../store";
import Guests from "./Guests";

const DialogInput = () => {
  const {
    value,
    suggestions: { status, data },
    setValue,
  } = usePlacesAutocomplete();
  const dispatch = useDispatch();
  const destination = useSelector(
    (state: RootState) => state.reservation.destination
  );
  const startDate = useSelector(
    (state: RootState) => state.reservation.startDate
  );
  const endDate = useSelector((state: RootState) => state.reservation.endDate);
  const guests = useSelector((state: RootState) => state.reservation.guests);
  return (
    <div className="">
      <Combobox
        value={""}
        onChange={(place) => dispatch(setDestination(place))}
      >
        <Combobox.Input
          className="bg-gray-200 w-full rounded-lg border-none font-bold outline-none p-2 text-lg text-gray-900"
          placeholder={destination.split(",")[0]}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          autoFocus
        />
        <Combobox.Options className="outline-none mt-1 max-h-60 overflow-auto rounded-md bg-white">
          {status === "OK" &&
            data.map(({ place_id, description }) => (
              <Combobox.Option
                key={place_id}
                value={description}
                className="truncate select-none font-bold outline-none py-2 px-4 ui-active:bg-[#FF385C]
                             ui-active:text-white"
              >
                {description}
              </Combobox.Option>
            ))}
        </Combobox.Options>
      </Combobox>
      <Guests />
      <button
        className="gap-x-2 w-1/2 mx-auto mt-3 outline-none flex justify-center items-center
         bg-[#FF385C] text-white rounded-full py-2"
        disabled={!destination || !startDate || !endDate || !guests}
      >
        <MagnifyingGlassIcon className="w-8 h-8" />
        <h1 className="hidden text-xl font-bold sm:inline-flex">Search</h1>
      </button>
    </div>
  );
};

export default DialogInput;
