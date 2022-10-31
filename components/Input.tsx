import {
  Combobox,
  ComboboxInput,
  ComboboxList,
  ComboboxOption,
  ComboboxPopover,
} from "@reach/combobox";
import React from "react";
import { useDispatch } from "react-redux";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { setCenter } from "../slices/navigationSlice";

const Input = () => {
  const dispatch = useDispatch();

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSelect = async (address: string) => {
    setValue(address, false);
    clearSuggestions();

    const results = await getGeocode({ address });

    const { lat, lng } = getLatLng(results[0]);

    dispatch(setCenter({ lat, lng }));
  };
  return (
    <div
      className="top-3 w-full sm:w-1/2 sm:left-1/2 sm:-translate-x-1/2 
                absolute z-40 px-2"
    >
      <Combobox onSelect={handleSelect}>
        <ComboboxInput
          value={value}
          onChange={onChange}
          disabled={!ready}
          className="bg-gray-200 w-full rounded-md h-14 px-2 outline-none text-2xl font-bold"
          placeholder="Find a Place"
          autoFocus
        />
        <ComboboxPopover className="bg-white/60 z-50">
          <ComboboxList>
            {status === "OK" &&
              data.map(({ place_id, description }) => (
                <ComboboxOption
                  key={place_id}
                  value={description}
                  className="hover:cursor-pointer hover:bg-gray-100 p-2"
                />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  );
};

export default Input;
