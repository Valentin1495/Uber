import { Popover, Tab } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { MagnifyingGlassCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";
import DateRange from "../components/DateRange";
import Guests from "../components/Guests";
import SearchInput from "../components/SearchInput";
import { RootState } from "../store";

const Search = () => {
  const destination = useSelector(
    (state: RootState) => state.reservation.destination
  );
  const startDate = useSelector(
    (state: RootState) => state.reservation.startDate
  );
  const endDate = useSelector((state: RootState) => state.reservation.endDate);
  const guests = useSelector((state: RootState) => state.reservation.guests);

  return (
    <div className="flex mt-24 max-w-xl md:max-w-3xl w-full mx-auto">
      <Popover className="gap-y-5 flex flex-col items-center w-full">
        <Popover.Button
          className="outline-none hover:shadow-lg hover:duration-500 
                    shadow-md border rounded-full border-gray-300 
                    px-5 py-1 flex items-center gap-x-2"
        >
          <div>
            Anywhere <span className="text-gray-500 font-light mx-2">|</span>{" "}
            Any week <span className="text-gray-500 font-light mx-2">|</span>{" "}
            <span className="text-gray-500 font-light">Add guests</span>
          </div>
          <MagnifyingGlassCircleIcon className="h-10 w-10 text-[#FF385C] -mr-4" />
        </Popover.Button>
        <Popover.Panel className="px-5 md:px-3 lg:px-0 w-full">
          <Tab.Group>
            <Tab.List
              className="text-xl font-bold flex items-center py-2 justify-evenly
                        border border-gray-400 rounded-full w-full"
            >
              <Tab className="outline-none">Where</Tab>
              <span>|</span>
              <Tab className="outline-none">Check in/out</Tab>
              <span>|</span>
              <Tab className="outline-none">Who</Tab>
              <Link href="/rooms">
                <button
                  className="gap-x-2 -mr-4 md:-mr-14 outline-none flex items-center bg-[#FF385C] text-white rounded-full p-2"
                  disabled={!destination || !startDate || !endDate || !guests}
                >
                  <MagnifyingGlassIcon className="w-8 h-8" />
                  <h1 className="hidden sm:inline-flex">Search</h1>
                </button>
              </Link>
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel className="relative text-center mt-5 h-96 rounded-md ">
                <SearchInput />
              </Tab.Panel>
              <Tab.Panel>
                <DateRange />
              </Tab.Panel>
              <Tab.Panel>
                <Guests />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </Popover.Panel>
      </Popover>
    </div>
  );
};

export default Search;
