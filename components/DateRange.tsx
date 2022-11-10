import React, { useState } from "react";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRangePicker, RangeKeyDict } from "react-date-range";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import {
  setCheckin,
  setCheckout,
  setEndDate,
  setStartDate,
} from "../slices/reservationSlice";
import { format } from "date-fns";

const DateRange = () => {
  const startDate = useSelector(
    (state: RootState) => state.reservation.startDate
  );
  const endDate = useSelector((state: RootState) => state.reservation.endDate);
  const dispatch = useDispatch();

  const [start, setStart] = useState<Date | undefined>(new Date());
  const [end, setEnd] = useState<Date | undefined>();

  const handleSelect = (rangesByKey: RangeKeyDict) => {
    setStart(rangesByKey.selection.startDate);
    setEnd(rangesByKey.selection.endDate);

    dispatch(
      setStartDate(format(rangesByKey.selection.startDate!, "dd MMM yyyy"))
    );
    dispatch(
      setCheckin(format(rangesByKey.selection.startDate!, "yyyy-MM-dd"))
    );
    dispatch(setEndDate(format(rangesByKey.selection.endDate!, "dd MMM yyyy")));
    dispatch(setCheckout(format(rangesByKey.selection.endDate!, "yyyy-MM-dd")));
  };

  const selectionRange = {
    startDate: start,
    endDate: end,
    key: "selection",
  };

  return (
    <div className="flex flex-col md:flex-row">
      <DateRangePicker
        ranges={[selectionRange]}
        rangeColors={["#FF385C"]}
        minDate={new Date()}
        onChange={handleSelect}
      />
      <div className="w-full space-y-5 md:mt-3.5">
        <p className="text-center">
          <em className="font-light">Check in</em>
          <br />
          <span className="text-lg font-bold text-[#FF385C]">{startDate}</span>
        </p>
        <p className="text-center">
          <em className="font-light">Check out</em>
          <br />
          <span className="text-lg font-bold text-[#FF385C]">
            {endDate ? endDate : "..."}
          </span>
        </p>
      </div>
    </div>
  );
};

export default DateRange;
