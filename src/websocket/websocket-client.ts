import ReconnectingWebSocket from "reconnecting-websocket";
export class WebSocketClient {
  readonly url: string;
  private webSocketClient: ReconnectingWebSocket;
  constructor(url: string) {
    this.url = url;
    this.webSocketClient = new ReconnectingWebSocket(url);
  }
}
