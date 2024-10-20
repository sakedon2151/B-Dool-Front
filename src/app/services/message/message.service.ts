import { MessageInsertModel, MessageUpdateModel } from "@/app/models/message.model";
import { serverBAxios } from "../../utils/axiosInstance";
import { Client } from "@stomp/stompjs";

const BASE_URL = '/messages';

export const messageService = {
  getMessageList: (channelId: string, page: number, size: number) => 
    serverBAxios.get(`${BASE_URL}/${channelId}`, { params: { page, size } })
      .then(response => response.data),

  findMessageById: (messageId: string) =>
    serverBAxios.get(`${BASE_URL}/find/${messageId}`)
      .then(response => response.data),
  
  updateMessage: (messageId: string, data: MessageUpdateModel) =>
    serverBAxios.put(`${BASE_URL}/${messageId}`, data)
      .then(response => response.data),

  deleteMessage: (messageId: string) =>
    serverBAxios.delete(`${BASE_URL}/${messageId}`)
      .then(response => response.data)
};

export const messagePublishService = (stompClient: Client) => ({
  sendMessage: (channelId: string, data: MessageInsertModel): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (stompClient.connected) {
        try {
          stompClient.publish({
            destination: `/app/message/${channelId}`,
            body: JSON.stringify(data),
          });
          resolve();
        } catch (error) {
          reject(new Error(`Failed to send message: ${error}`));
        }
      } else {
        reject(new Error("WebSocket is not connected"));
      }
    });
  }
})