import React, { useState } from "react";
import Script from "next/script";
import Directions from "../components/Directions";

const Booking = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div>
      <Script
        id="google-maps"
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_API_KEY}&libraries=places`}
        onReady={() => {
          setIsLoaded(true);
        }}
      />

      {isLoaded && <Directions />}
    </div>
  );
};

export default Booking;
