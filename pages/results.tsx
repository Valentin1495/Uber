import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Room from "../components/Room";
import { setRooms } from "../slices/reservationSlice";
import { RootState } from "../store";
import { getRooms } from "./api/airBnbAPI";

const results = () => {
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

  useEffect(() => {
    getRooms(destination, checkin, checkout, guests).then((rooms) =>
      dispatch(setRooms(rooms))
    );
  }, [destination, checkin, checkout, guests]);

  const rooms = useSelector((state: RootState) => state.reservation.rooms);

  return (
    <div>
      <span>{`${startDate} - ${endDate} - for ${guests} guests`}</span>
      <h1>Stays in {destination}</h1>
      {rooms?.map((room) => (
        <Room room={room} key={room.id} />
      ))}
    </div>
  );
};

export default results;
