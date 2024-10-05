import { serverBAxios } from "../../utils/axiosInstance";

const BASE_URL = '/messages';

export const messageService = {
  getMessageList: (channelId: string, page: number, size: number) => 
    serverBAxios.get(`${BASE_URL}/${channelId}`, { params: { page, size } })
      .then(response => response.data),
  
  sendMessage: (channelId: string, content: string, profileId: string) =>
    serverBAxios.post(`${BASE_URL}/${channelId}`, { content, profileId })
      .then(response => response.data)
};