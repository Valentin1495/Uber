import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "../store";
import React, { useState } from "react";
import Script from "next/script";

function MyApp({ Component, pageProps }: AppProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      <Script
        id="google-maps"
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_API_KEY}&libraries=places&language=en`}
        onReady={() => {
          setIsLoaded(true);
        }}
      />

      {isLoaded && (
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      )}
    </>
  );
}

export default MyApp;
