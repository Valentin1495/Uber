export type LatLngLiteral = google.maps.LatLngLiteral;
export type DirectionsResult = google.maps.DirectionsResult;
export type MapOptions = google.maps.MapOptions;
export type DirectionsLeg = google.maps.DirectionsLeg;
export type LatLng = google.maps.LatLng;

interface Room {
  id: string;
  address: string;
  image: string[];
}

interface Distance {
  text: string;
  value: number;
}

interface Duration {
  text: string;
  value: number;
}
