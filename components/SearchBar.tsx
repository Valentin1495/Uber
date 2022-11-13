import { Dialog, Tab, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { MagnifyingGlassCircleIcon } from "@heroicons/react/24/solid";
import React, { useState, Fragment } from "react";
import { useSelector } from "react-redux";
import Guests from "../components/Guests";
import SearchInput from "../components/SearchInput";
import { RootState } from "../store";
import CheckoutDate from "../components/CheckoutDate";
import CheckinDate from "../components/CheckinDate";
import { format } from "date-fns";
import { useRouter } from "next/router";

const Search = () => {
  const destination = useSelector(
    (state: RootState) => state.reservation.destination
  );
  const checkin = useSelector((state: RootState) => state.reservation.checkin);
  const checkout = useSelector(
    (state: RootState) => state.reservation.checkout
  );

  const guests = useSelector((state: RootState) => state.reservation.guests);

  const [open, setOpen] = useState(false);

  const router = useRouter();

  const searchRooms = () => {
    setOpen(false);

    router.push({
      pathname: "/rooms",
      query: {
        location: destination,
        checkin,
        checkout,
        guests,
      },
    });
  };

  return (
    <div className="fixed inset-0 mt-4">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mx-auto outline-none hover:shadow-lg hover:duration-500
                  shadow-md border rounded-full border-gray-300
                  px-5 py-1 flex items-center gap-x-2"
      >
        <div>
          {destination} <span className="text-gray-500 font-light mx-2">|</span>
          {format(new Date(checkin), "MMM dd")}
          <span className="text-gray-500 font-light mx-2">|</span>
          {format(new Date(checkout), "MMM dd")}
          <span className="text-gray-500 font-light mx-2">|</span>
          {guests} guests
        </div>
        <MagnifyingGlassCircleIcon className="h-10 w-10 text-[#FF385C] -mr-4" />
      </button>

      <Transition appear show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className="transform rounded-2xl bg-white
                  p-6 w-full max-w-xl md:max-w-3xl shadow-xl transition-all h-[500px]"
                >
                  <Tab.Group>
                    <Tab.List
                      className="text-sm sm:text-xl font-bold flex items-center py-2
                        border border-gray-400 rounded-full pr-2 w-full"
                    >
                      <div className="flex-1 flex justify-evenly">
                        <Tab className="outline-none">Where</Tab>
                        <span>|</span>
                        <Tab className="outline-none">Check in</Tab>
                        <span>|</span>

                        <Tab className="outline-none">Check out</Tab>

                        <span>|</span>
                        <Tab className="outline-none">Who</Tab>
                      </div>

                      <button
                        className="gap-x-2 outline-none flex items-center
                           bg-[#FF385C] text-white rounded-full p-1.5 sm:p-2"
                        disabled={!destination || !checkin || !checkout}
                        onClick={searchRooms}
                      >
                        <MagnifyingGlassIcon className="w-5 h-5 sm:w-8 sm:h-8" />
                        <h1 className="hidden md:inline-flex">Search</h1>
                      </button>
                    </Tab.List>
                    <Tab.Panels className="flex flex-col items-center justify-center h-[386px]">
                      <Tab.Panel>
                        <SearchInput />
                      </Tab.Panel>
                      <Tab.Panel>
                        <CheckinDate />
                      </Tab.Panel>
                      <Tab.Panel>
                        <CheckoutDate />
                      </Tab.Panel>
                      <Tab.Panel>
                        <Guests />
                      </Tab.Panel>
                    </Tab.Panels>
                  </Tab.Group>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Search;
