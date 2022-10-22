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
import { setCenter, setDestination, setZoom } from "../slices/navigationSlice";

const DestinationInput = ({
  destinationAddress,
  setDestinationAddress,
}: {
  destinationAddress: string;
  setDestinationAddress: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const dispatch = useDispatch();

  const {
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleSelect = async (address: string) => {
    setValue(address, false);
    clearSuggestions();

    const results = await getGeocode({ address });

    const { lat, lng } = getLatLng(results[0]);

    dispatch(setDestination({ lat, lng }));
    dispatch(setCenter({ lat, lng }));
    dispatch(setZoom(16));
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    setDestinationAddress(e.target.value);
  };

  useEffect(() => {
    if (destinationAddress) {
      setValue(destinationAddress, false);
      clearSuggestions();
    }
  }, [destinationAddress]);

  return (
    <div>
      <Combobox onSelect={handleSelect}>
        <ComboboxInput
          value={value}
          onChange={onChange}
          // disabled={!origin}
          className="bg-gray-200 w-full rounded-md h-14 px-2 outline-none text-2xl font-bold"
          placeholder="Where to?"
        />
        <ComboboxPopover className="bg-white/60">
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

export default DestinationInput;
