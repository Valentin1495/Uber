import React, { useEffect } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import { useDispatch } from "react-redux";
import { setCenter, setOrigin } from "../slices/navigationSlice";

const OriginInput = ({
  originAddress,
  setOriginAddress,
}: {
  originAddress: string;
  setOriginAddress: React.Dispatch<React.SetStateAction<string>>;
}) => {
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
    setOriginAddress(e.target.value);
  };

  const handleSelect = async (address: string) => {
    setValue(address, false);
    clearSuggestions();

    const results = await getGeocode({ address });

    const { lat, lng } = getLatLng(results[0]);

    dispatch(setOrigin({ lat, lng }));
    dispatch(setCenter({ lat, lng }));
  };

  useEffect(() => {
    if (originAddress) {
      setValue(originAddress, false);
      clearSuggestions();
    } else {
      dispatch(setOrigin(null));
    }
  }, [originAddress]);

  return (
    <div className="w-full">
      <Combobox onSelect={handleSelect}>
        <ComboboxInput
          value={value}
          onChange={onChange}
          disabled={!ready}
          className="bg-gray-200 w-full rounded-md h-14 px-2 outline-none text-2xl font-bold"
          placeholder="Where from?"
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

export default OriginInput;
