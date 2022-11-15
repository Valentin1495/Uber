import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Room from "../components/Room";
import SearchBar from "../components/SearchBar";
import { setRooms } from "../slices/reservationSlice";
import { RootState } from "../store";
import { getRooms } from "./api/airBnbAPI";

const Rooms = () => {
  const destination = useSelector(
    (state: RootState) => state.reservation.destination
  );
  const checkin = useSelector((state: RootState) => state.reservation.checkin);
  const checkout = useSelector(
    (state: RootState) => state.reservation.checkout
  );
  const guests = useSelector((state: RootState) => state.reservation.guests);
  const rooms = useSelector((state: RootState) => state.reservation.rooms);

  const dispatch = useDispatch();

  useEffect(() => {
    getRooms(destination, checkin, checkout, guests).then((homes) =>
      dispatch(setRooms(homes))
    );
  }, [destination, checkin, checkout, guests]);

  return (
    <div>
      <SearchBar />
      <div className="grid grid-cols-2">
        <div className="col-span-1">
          {rooms?.map((room) => (
            <Room key={room.id} room={room} />
          ))}
        </div>
        <div>map</div>
      </div>
    </div>
  );
};

export default Rooms;
