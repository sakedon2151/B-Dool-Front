import { serverBAxios } from "../axiosInstance";

export const messageService = {

  // GET - api/messages/{channelId}
  getMessageList: (channelId: string, page: number, size: number) => 
    serverBAxios.get(`/messages/${channelId}`, { params: { page, size } }),
  
  // POST - api/messages/{channelId}
  sendMessage: (channelId: string, content: string, profileId: string) =>
    serverBAxios.post(`/messages/${channelId}`, { content, profileId }),

};