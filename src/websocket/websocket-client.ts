import ReconnectingWebSocket from "reconnecting-websocket";
import {
  MessageType,
  Movie,
  WebSocketMessage,
} from "../model/movie-list.model";

type WebSocketSubscriber = (message: WebSocketMessage) => void;

export class WebSocketClient {
  readonly url: string;
  private websocket: ReconnectingWebSocket;
  subscriber?: WebSocketSubscriber;
  randomId = Math.floor(Math.random() * 100);
  constructor(url: string) {
    this.url = url;
    this.websocket = new ReconnectingWebSocket(url);
    this.websocket.addEventListener(
      "message",
      (event: MessageEvent<WebSocketMessage>) => {
        this.subscriber && this.subscriber(event.data);
      }
    );
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

    const stringfiedData = {
      action: data.action,
      message: JSON.stringify(data.message),
    };

    this.websocket.send(JSON.stringify(stringfiedData));
  }
}
