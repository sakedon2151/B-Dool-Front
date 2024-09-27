import { serverBAxios } from "../axiosInstance";

export const webSocketService = {
  getMessageList: (channelId: string, page: number, size: number) => 
    serverBAxios.get(`/messages/${channelId}`, { params: { page, size } }),
  
  sendMessage: (channelId: string, content: string, profileId: string) =>
    serverBAxios.post(`/messages/${channelId}`, { content, profileId }),
};