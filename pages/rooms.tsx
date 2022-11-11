import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Room from "../components/Room";
import { setRooms } from "../slices/reservationSlice";
import { RootState } from "../store";
import { getRooms } from "./api/airBnbAPI";
import { MagnifyingGlassCircleIcon } from "@heroicons/react/24/solid";
import { Dialog } from "@headlessui/react";
import DialogInput from "../components/DialogInput";
import DialogDate from "../components/DialogDate";

const Rooms = () => {
  const startDate = useSelector(
    (state: RootState) => state.reservation.startDate
  );
  const endDate = useSelector((state: RootState) => state.reservation.endDate);
  const checkin = useSelector((state: RootState) => state.reservation.checkin);
  const checkout = useSelector(
    (state: RootState) => state.reservation.checkout
  );

  const guests = useSelector((state: RootState) => state.reservation.guests);
  const destination = useSelector(
    (state: RootState) => state.reservation.destination
  );

  const dispatch = useDispatch();

  // useEffect(() => {
  //   getRooms(destination, checkin, checkout, guests).then((rooms) =>
  //     dispatch(setRooms(rooms))
  //   );
  // }, [destination, checkin, checkout, guests]);

  const rooms = useSelector((state: RootState) => state.reservation.rooms);

  const [open, setOpen] = useState(true);

  return (
    <div>
      <button
        className="mx-auto mt-3 outline-none hover:shadow-lg hover:duration-500 
                  shadow-md border rounded-full border-gray-300 
                  px-5 py-1 flex items-center gap-x-2"
        onClick={() => setOpen(true)}
      >
        <div>
          {destination.split(",")[0]}{" "}
          <span className="text-gray-500 font-light mx-2">|</span>{" "}
          {`${startDate.split(" ").slice(0, 2).join(" ")} - ${endDate
            .split(" ")
            .slice(0, 2)
            .join(" ")}`}{" "}
          <span className="text-gray-500 font-light mx-2">|</span>{" "}
          <span>{guests} guests</span>
        </div>
        <MagnifyingGlassCircleIcon className="h-10 w-10 text-[#FF385C] -mr-4" />
      </button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <Dialog.Panel className=" pt-3 px-3 flex flex-col items-center">
          <div className="flex">
            <div className="w-72">
              <DialogInput />
            </div>
            <div className="w-[576px]">
              <DialogDate />
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>

      <div>
        {rooms?.map((room) => (
          <Room room={room} key={room.id} />
        ))}
      </div>
    </div>
  );
};

export default Rooms;
