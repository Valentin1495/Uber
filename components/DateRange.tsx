import React, { useState } from "react";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRangePicker, RangeKeyDict } from "react-date-range";

const DateRange = () => {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>();

  const handleSelect = (rangesByKey: RangeKeyDict) => {
    setStartDate(rangesByKey.selection.startDate);
    setEndDate(rangesByKey.selection.endDate);
  };

  const selectionRange = {
    startDate,
    endDate,
    key: "selection",
  };

  return (
    <div className="flex flex-col md:flex-row">
      <DateRangePicker
        ranges={[selectionRange]}
        rangeColors={["#FF385C"]}
        minDate={new Date()}
        onChange={handleSelect}
        className=""
      />
      <div className="w-full space-y-5">
        <p className="text-center">
          <em>Check in</em>
          <br />
          <span className="text-lg font-bold">{startDate?.toDateString()}</span>
        </p>
        <p className="text-center">
          <em>Check out</em>
          <br />
          <span className="text-lg font-bold">
            {endDate ? endDate?.toDateString() : "..."}
          </span>
        </p>
      </div>
    </div>
  );
};

export default DateRange;
