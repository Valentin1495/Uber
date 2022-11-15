import React from "react";
import { Room } from "../typings";
import ImageSlider from "./ImageSlider";

const Room = ({ room }: { room: Room }) => {
  return (
    <div className="h-full">
      <ImageSlider images={room.image} />
    </div>
  );
};

export default Room;
