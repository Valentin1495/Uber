import React, { useState } from "react";
import { Dayjs } from "dayjs";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { setCheckin } from "../slices/reservationSlice";
import { RootState } from "../store";

export default function CheckinDate() {
  const [value, setValue] = useState<Dayjs | null>(null);
  const dispatch = useDispatch();

  const checkin = useSelector((state: RootState) => state.reservation.checkin);

  return (
    <div className="space-y-5">
      <p className="text-center">
        <em className="font-light text-xl sm:text-2xl">Check in</em>
        <br />
        <span className="text-2xl sm:text-3xl font-bold text-[#FF385C]">
          {checkin ? format(new Date(checkin), "MMMM dd, yyyy") : "..."}
        </span>
      </p>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Check-in"
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
            dispatch(setCheckin(newValue?.toISOString()));
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
    </div>
  );
}
