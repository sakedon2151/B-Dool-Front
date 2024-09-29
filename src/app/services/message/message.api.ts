import { serverBAxios } from "../axiosInstance";

export const messageService = {
  
  getMessageAllByChannelId: (channelId: string, page: number, size: number) => 
    serverBAxios.get(`/messages/${channelId}`, { params: { page, size } }),
  
  sendMessage: (channelId: string, content: string, profileId: string) =>
    serverBAxios.post(`/messages/${channelId}`, { content, profileId }),

  // 메시지 수정 함수

  

};