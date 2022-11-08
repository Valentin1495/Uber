import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const results = () => {
  const startDate = useSelector(
    (state: RootState) => state.reservation.startDate
  );
  const endDate = useSelector((state: RootState) => state.reservation.endDate);
  const guests = useSelector((state: RootState) => state.reservation.guests);
  const destination = useSelector(
    (state: RootState) => state.reservation.destination
  );

  return (
    <div>
      <span>{`${startDate} - ${endDate} - for ${guests} guests`}</span>
      <h1>Stays in {destination}</h1>
    </div>
  );
};

export default results;
