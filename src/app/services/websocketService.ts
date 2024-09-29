import { Client } from "@stomp/stompjs";

export class WebSocketService {
  private client: Client;
  constructor(url: string) {
    this.client = new Client({
      brokerURL: url,
    });
  }
  connect() {
    this.client.activate();
  }
  disconnect() {
    this.client.deactivate();
  }
  subscribe(destination: string, callback: (message: any) => void) {
    return this.client.subscribe(destination, callback);
  }
  send(destination: string, body: string) {
    this.client.publish({ destination, body });
  }
}