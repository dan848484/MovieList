import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { WebSocketClient } from "../websocket/websocket-client";

export const WebSocketContext = createContext<WebSocketClient | null>(null);

export const WebSocketProvider = (
  props: PropsWithChildren & { websocketUrl: string }
) => {
  const [client, setClient] = useState<WebSocketClient | null>(null);
  let ignore = false; //useEffectは2回呼ばれるのでWebSocketのコネクションは１個だけしか貼りたくないため対策
  useEffect(() => {
    if (ignore) return;
    if (client === null) {
      setClient(new WebSocketClient(props.websocketUrl));
    }
    return () => {
      ignore = true;
    };
  }, [props.websocketUrl]);

  return (
    <WebSocketContext.Provider value={client}>
      {props.children}
    </WebSocketContext.Provider>
  );
};
