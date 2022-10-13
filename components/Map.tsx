import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken =
  "pk.eyJ1IjoibWFya3p1Y2tlcmJlcmciLCJhIjoiY2w5NnV2Z2p5MnJpeDNvbXg0MDFqdXllMSJ9.k2AUKmHDYthxIUynXSqT9A";

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [128.168944342317, 36.5362364654109],
      zoom: 7,
    });
  }, []);

  return <div className="h-1/2 w-full" ref={mapContainer}></div>;
};

export default Map;
