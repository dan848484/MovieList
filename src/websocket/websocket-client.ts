import ReconnectingWebSocket from "reconnecting-websocket";
import {
  MessageType,
  Movie,
  WebSocketMessage,
} from "../model/movie-list.model";

type WebSocketSubscriber = (message: WebSocketMessage["message"]) => void;

export class WebSocketClient {
  readonly url: string;
  private websocket: ReconnectingWebSocket;
  subscriber?: WebSocketSubscriber;
  constructor(url: string) {
    this.url = url;
    this.websocket = new ReconnectingWebSocket(url);
    this.websocket.addEventListener("message", (event) => {
      this.subscriber && this.subscriber(JSON.parse(event.data));
    });
  }

  subscribe(subscriber: WebSocketSubscriber) {
    this.unsubscribe();
    this.subscriber = subscriber;
  }

  unsubscribe() {
    this.subscriber = undefined;
  }

  close() {
    this.unsubscribe();
    this.websocket.close();
  }

  send(type: MessageType, movie: Movie) {
    const data: WebSocketMessage = {
      action: "send",
      message: {
        messageType: type,
        movie,
      },
    };
    this.websocket.send(
      JSON.stringify({
        ...data,
        message: JSON.stringify(data.message),
      })
    );
  }
}
