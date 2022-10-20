import React, { useState } from "react";
import Script from "next/script";
import Booking from "../components/Booking";

const Navigation = () => {
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

      {isLoaded && <Booking />}
    </div>
  );
};

export default Navigation;
