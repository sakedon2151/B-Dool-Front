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
    return this.client.subscribe(destination, callback); // 에러 발생중
  }
  
  send(destination: string, body: string) {
    this.client.publish({ destination, body });
  }
}