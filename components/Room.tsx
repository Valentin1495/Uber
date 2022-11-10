import React from "react";
import { room } from "../typings";

const Room = ({ room }: { room: room }) => {
  return <div>{room.address}</div>;
};

export default Room;
