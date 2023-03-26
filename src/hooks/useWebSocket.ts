import { useContext } from "react";
import { WebSocketContext } from "../providers/websocket.provider";

export const useWebSocket = () => {
  const client = useContext(WebSocketContext);
  return client;
};
