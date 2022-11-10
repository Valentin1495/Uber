import React, { useEffect } from "react";
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

  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "40a1382aa9msh820b9e04ce5bbeep1d9467jsn666fe9f68405",
      "X-RapidAPI-Host": "airbnb13.p.rapidapi.com",
    },
  };

  useEffect(() => {
    fetch(
      "https://airbnb13.p.rapidapi.com/search-geo?ne_lat=52.51&ne_lng=13.41&sw_lat=52.41&sw_lng=13.51&checkin=2022-11-11&checkout=2022-11-12&adults=1",
      options
    )
      .then((response) => response.json())
      .then((response) => console.log(response))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <span>{`${startDate} - ${endDate} - for ${guests} guests`}</span>
      <h1>Stays in {destination}</h1>
    </div>
  );
};

export default results;
