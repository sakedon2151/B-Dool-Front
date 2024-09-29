import { MessageModel } from "@/app/models/message.model";
import { serverBAxios } from "../axiosInstance";
import { WebSocketService } from "../websocketService";

export class messageService {
  private wsService: WebSocketService;
  constructor(wsUrl: string) {
    this.wsService = new WebSocketService(wsUrl);
  }
  connect() {
    this.wsService.connect();
  }
  disconnect() {
    this.wsService.disconnect();
  }

  getMessagesByChannelId(channelId: string, page: number, size: number) {
    return serverBAxios.get<MessageModel[]>(`/messages/${channelId}`, { params: { page, size } });
  }
  sendMessage(channelId: string, content: string, profileId: string) {
    this.wsService.send(`/app/message/${channelId}`, JSON.stringify({ content, channelId, profileId }));
  }

  subscribeToChannel(channelId: string, callback: (message: MessageModel) => void) {
    return this.wsService.subscribe(`/topic/channel/${channelId}`, (message) => {
      const parsedMessage = JSON.parse(message.body) as MessageModel;
      callback(parsedMessage);
    });
  }

};