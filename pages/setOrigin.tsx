import Script from "next/script";
import React, { useState } from "react";
import OriginMap from "../components/OriginMap";

const SetOrigin = () => {
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

      {isLoaded && <OriginMap />}
    </div>
  );
};

export default SetOrigin;
